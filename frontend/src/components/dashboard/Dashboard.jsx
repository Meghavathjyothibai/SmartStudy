import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  FiBook, FiClock, FiCheckCircle, FiTrendingUp,
  FiCalendar, FiBarChart2, FiUsers, FiAward 
} from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { Link } from 'react-router-dom'
import taskService from '../../services/taskService'
import analyticsService from '../../services/analyticsService'

const Dashboard = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    studyHours: 0,
    productivity: 0,
    completionRate: 0
  })
  const [recentTasks, setRecentTasks] = useState([])
  const [todayGoals, setTodayGoals] = useState([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch all tasks
      const tasksResponse = await taskService.getAllTasks()
      const tasks = tasksResponse.tasks || []
      
      // Calculate stats from real tasks
      const totalTasks = tasks.length
      const completed = tasks.filter(t => t.status === 'completed').length
      const pending = tasks.filter(t => t.status === 'pending' || t.status === 'in-progress').length
      const overdue = tasks.filter(t => {
        if (t.status === 'completed') return false
        if (!t.dueDate) return false
        return new Date(t.dueDate) < new Date()
      }).length
      
      // Calculate study hours from tasks (estimated duration)
      const totalStudyMinutes = tasks.reduce((sum, task) => sum + (task.estimatedDuration || 0), 0)
      const studyHours = Math.round(totalStudyMinutes / 60 * 10) / 10
      
      // Calculate completion rate
      const completionRate = totalTasks > 0 ? Math.round((completed / totalTasks) * 100) : 0
      
      setStats({
        totalTasks,
        completedTasks: completed,
        pendingTasks: pending,
        overdueTasks: overdue,
        studyHours,
        productivity: completionRate,
        completionRate
      })
      
      // Set recent tasks (last 5)
      setRecentTasks(tasks.slice(0, 5).map(task => ({
        id: task._id,
        title: task.title,
        subject: task.subject,
        due: task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date',
        priority: task.priority || 'medium',
        status: task.status
      })))

      // Calculate REAL today's goals based on tasks due today or in progress
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)

      // Get tasks due today
      const tasksDueToday = tasks.filter(task => {
        if (!task.dueDate) return false
        const dueDate = new Date(task.dueDate)
        dueDate.setHours(0, 0, 0, 0)
        return dueDate.getTime() === today.getTime() && task.status !== 'completed'
      })

      // Get tasks in progress
      const inProgressTasks = tasks.filter(task => task.status === 'in-progress')

      // Group tasks by subject for today's goals
      const subjectsMap = new Map()

      // Add tasks due today
      tasksDueToday.forEach(task => {
        if (!subjectsMap.has(task.subject)) {
          subjectsMap.set(task.subject, { completed: 0, total: 0, hours: 0 })
        }
        const subjectData = subjectsMap.get(task.subject)
        subjectData.total += 1
        subjectData.hours += task.estimatedDuration || 60
      })

      // Add in-progress tasks
      inProgressTasks.forEach(task => {
        if (!subjectsMap.has(task.subject)) {
          subjectsMap.set(task.subject, { completed: 0, total: 0, hours: 0 })
        }
        const subjectData = subjectsMap.get(task.subject)
        subjectData.total += 1
        subjectData.hours += task.estimatedDuration || 60
      })

      // Calculate completed tasks per subject (for today)
      const completedToday = tasks.filter(task => {
        if (!task.completedAt) return false
        const completedDate = new Date(task.completedAt)
        completedDate.setHours(0, 0, 0, 0)
        return completedDate.getTime() === today.getTime()
      })

      completedToday.forEach(task => {
        if (subjectsMap.has(task.subject)) {
          subjectsMap.get(task.subject).completed += 1
        }
      })

      // Convert to array for display, limit to top 5 subjects
      const goalsArray = Array.from(subjectsMap.entries()).map(([subject, data]) => ({
        subject: subject,
        completed: data.completed,
        total: data.total,
        hours: Math.round(data.hours / 60 * 10) / 10 // Convert minutes to hours
      })).sort((a, b) => b.total - a.total).slice(0, 5)

      setTodayGoals(goalsArray)

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const statsCards = [
    { 
      icon: FiBook, 
      label: 'Total Tasks', 
      value: stats.totalTasks.toString(), 
      color: 'from-blue-500 to-blue-600', 
      bg: 'bg-blue-50', 
      text: 'text-blue-600' 
    },
    { 
      icon: FiClock, 
      label: 'Study Hours', 
      value: stats.studyHours.toString(), 
      color: 'from-green-500 to-green-600', 
      bg: 'bg-green-50', 
      text: 'text-green-600' 
    },
    { 
      icon: FiCheckCircle, 
      label: 'Completed', 
      value: stats.completedTasks.toString(), 
      color: 'from-purple-500 to-purple-600', 
      bg: 'bg-purple-50', 
      text: 'text-purple-600' 
    },
    { 
      icon: FiTrendingUp, 
      label: 'Productivity', 
      value: stats.productivity + '%', 
      color: 'from-orange-500 to-orange-600', 
      bg: 'bg-orange-50', 
      text: 'text-orange-600' 
    },
  ]

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'bg-red-100 text-red-700'
      case 'medium': return 'bg-yellow-100 text-yellow-700'
      case 'low': return 'bg-green-100 text-green-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'text-green-600'
      case 'in-progress': return 'text-yellow-600'
      case 'pending': return 'text-gray-600'
      default: return 'text-gray-600'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white"
      >
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.name || 'Student'}! 👋
        </h1>
        <p className="text-white/90">
          You have {stats.pendingTasks} task{stats.pendingTasks !== 1 ? 's' : ''} pending. 
          {stats.completionRate > 0 ? ` You've completed ${stats.completionRate}% of your tasks.` : ' Start by creating your first task!'}
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 ${stat.bg} rounded-lg`}>
                  <Icon className={`w-6 h-6 ${stat.text}`} />
                </div>
                <span className={`text-2xl font-bold ${stat.text}`}>{stat.value}</span>
              </div>
              <h3 className="text-gray-600 font-medium">{stat.label}</h3>
              <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(parseInt(stat.value) || 0, 100)}%` }}
                  className={`h-full rounded-full bg-gradient-to-r ${stat.color}`}
                />
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Recent Tasks</h3>
            <Link to="/tasks" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
              View All
            </Link>
          </div>
          
          {recentTasks.length > 0 ? (
            <div className="space-y-3">
              {recentTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(task.status)}`} />
                      <h4 className="font-medium text-gray-900">{task.title}</h4>
                    </div>
                    <p className="text-sm text-gray-600 ml-5">{task.subject}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-500">{task.due}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No tasks yet</p>
              <Link
                to="/tasks/new"
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Create Your First Task
              </Link>
            </div>
          )}
        </motion.div>

        {/* Today's Goals - REAL DATA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold mb-4">Today's Goals</h3>
          <div className="space-y-4">
            {todayGoals.length > 0 ? (
              todayGoals.map((goal, index) => {
                const progress = goal.total > 0 ? Math.round((goal.completed / goal.total) * 100) : 0
                return (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">{goal.subject}</span>
                      <span className="font-semibold text-indigo-600">{goal.completed}/{goal.total} tasks</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Estimated: {goal.hours} hours</span>
                      <span>{progress}% complete</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="h-full bg-gradient-to-r from-indigo-600 to-purple-600"
                      />
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No tasks scheduled for today</p>
                <Link
                  to="/tasks/new"
                  className="inline-flex items-center px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Create a Task
                </Link>
              </div>
            )}
            
            {/* Quick stats summary */}
            {stats.totalTasks > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Overall Completion Rate</span>
                  <span className="font-semibold text-indigo-600">{stats.completionRate}%</span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-gray-600">Tasks Remaining</span>
                  <span className="font-semibold text-indigo-600">{stats.pendingTasks}</span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-gray-600">Study Hours</span>
                  <span className="font-semibold text-indigo-600">{stats.studyHours} hrs</span>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Quick Tips Section */}
      {stats.totalTasks === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white"
        >
          <h3 className="text-lg font-semibold mb-2">🚀 Get Started</h3>
          <p className="text-white/90 mb-4">
            Create your first task to start tracking your study progress and see insights here!
          </p>
          <Link
            to="/tasks/new"
            className="inline-flex items-center px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-opacity-90 transition-colors"
          >
            Create Task
          </Link>
        </motion.div>
      )}
    </div>
  )
}

export default Dashboard