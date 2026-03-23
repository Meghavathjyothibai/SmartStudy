import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useQuery } from 'react-query'
import axios from 'axios'
import { motion } from 'framer-motion'
import {
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiTrendingUp,
  FiAward
} from 'react-icons/fi'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444']

const Dashboard = () => {
  const { user } = useAuth()
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Good Morning')
    else if (hour < 18) setGreeting('Good Afternoon')
    else setGreeting('Good Evening')
  }, [])

  // Fetch overview statistics
  const { data: overview, isLoading } = useQuery(
    'analytics-overview',
    async () => {
      const response = await axios.get('/api/analytics/overview')
      return response.data.data
    },
    {
      refetchInterval: 30000 // Refresh every 30 seconds
    }
  )

  // Fetch timeline data
  const { data: timeline } = useQuery(
    'timeline',
    async () => {
      const response = await axios.get('/api/analytics/timeline?days=7')
      return response.data.timeline
    }
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-8 text-white"
      >
        <h1 className="text-3xl font-bold mb-2">
          {greeting}, {user?.name}! 👋
        </h1>
        <p className="text-primary-100">
          Here's your study overview for today
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<FiCheckCircle className="w-6 h-6" />}
          title="Completed Tasks"
          value={overview?.overview.completedTasks || 0}
          subtitle={`${overview?.overview.completionRate || 0}% completion rate`}
          color="green"
        />
        <StatCard
          icon={<FiClock className="w-6 h-6" />}
          title="Pending Tasks"
          value={overview?.overview.pendingTasks || 0}
          subtitle={`${overview?.overview.overdueTasks || 0} overdue`}
          color="yellow"
        />
        <StatCard
          icon={<FiTrendingUp className="w-6 h-6" />}
          title="Productivity"
          value={`${Math.round(overview?.productivity?.average || 0)}%`}
          subtitle="Average focus score"
          color="blue"
        />
        <StatCard
          icon={<FiAward className="w-6 h-6" />}
          title="Current Streak"
          value={`${user?.streak || 0} days`}
          subtitle="Keep it up!"
          color="purple"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Productivity Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold mb-4">Weekly Progress</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeline}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={(date) => new Date(date).toLocaleDateString()} />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="studyTime"
                  stackId="1"
                  stroke="#4f46e5"
                  fill="#4f46e5"
                  fillOpacity={0.3}
                />
                <Area
                  type="monotone"
                  dataKey="tasksCompleted"
                  stackId="2"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Subject Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold mb-4">Subjects</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={overview?.subjects || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {overview?.subjects?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {overview?.subjects?.slice(0, 3).map((subject, index) => (
              <div key={subject._id} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{subject._id}</span>
                <span className="text-sm font-semibold">{subject.count} tasks</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Tasks */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Today's Schedule</h3>
          <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            View All
          </button>
        </div>
        
        <div className="space-y-4">
          {[1, 2, 3].map((_, i) => (
            <div key={i} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
              <div className="flex-1">
                <h4 className="font-medium">Study Mathematics - Chapter 5</h4>
                <p className="text-sm text-gray-600">10:00 AM - 11:30 AM</p>
              </div>
              <span className="badge badge-primary">In Progress</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

const StatCard = ({ icon, title, value, subtitle, color }) => {
  const colors = {
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600'
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-lg ${colors[color]}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        </div>
      </div>
    </motion.div>
  )
}

export default Dashboard