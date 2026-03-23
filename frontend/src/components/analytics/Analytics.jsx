import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FiTrendingUp, FiClock, FiCheckCircle, FiBook,
  FiBarChart2, FiActivity, FiAward, FiTarget
} from 'react-icons/fi';
import analyticsService from '../../services/analyticsService';
import taskService from '../../services/taskService';
import toast from 'react-hot-toast';

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudyTime: 0,
    completedTasks: 0,
    totalTasks: 0,
    pendingTasks: 0,
    overdueTasks: 0,
    averageProductivity: 0,
    currentStreak: 0,
    completionRate: 0,
    topSubject: 'N/A',
    bestTime: 'N/A'
  });
  const [weeklyData, setWeeklyData] = useState([]);
  const [subjectPerformance, setSubjectPerformance] = useState([]);
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Fetch overview data
      const overview = await analyticsService.getOverview();
      const overviewData = overview.data || {};
      
      // Fetch all tasks for detailed analysis
      const tasksResponse = await taskService.getAllTasks();
      const tasks = tasksResponse.tasks || [];
      
      // Calculate study time from tasks
      const totalStudyMinutes = tasks.reduce((sum, task) => {
        if (task.actualDuration) return sum + task.actualDuration;
        if (task.estimatedDuration && task.status === 'completed') return sum + task.estimatedDuration;
        return sum;
      }, 0);
      
      const totalStudyHours = Math.round(totalStudyMinutes / 60 * 10) / 10;
      
      // Calculate pending and overdue tasks
      const now = new Date();
      const pendingTasks = tasks.filter(t => t.status === 'pending' || t.status === 'in-progress').length;
      const overdueTasks = tasks.filter(t => 
        (t.status === 'pending' || t.status === 'in-progress') && 
        t.dueDate && new Date(t.dueDate) < now
      ).length;
      
      // Calculate completion rate
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter(t => t.status === 'completed').length;
      const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
      
      // Get top subject
      const subjectCounts = {};
      tasks.forEach(task => {
        if (task.subject) {
          subjectCounts[task.subject] = (subjectCounts[task.subject] || 0) + 1;
        }
      });
      
      let topSubject = 'N/A';
      let maxCount = 0;
      Object.entries(subjectCounts).forEach(([subject, count]) => {
        if (count > maxCount) {
          maxCount = count;
          topSubject = subject;
        }
      });
      
      // Calculate subject performance
      const subjectStats = {};
      tasks.forEach(task => {
        if (!task.subject) return;
        if (!subjectStats[task.subject]) {
          subjectStats[task.subject] = {
            total: 0,
            completed: 0,
            totalTime: 0
          };
        }
        subjectStats[task.subject].total++;
        if (task.status === 'completed') {
          subjectStats[task.subject].completed++;
          subjectStats[task.subject].totalTime += task.actualDuration || task.estimatedDuration || 0;
        }
      });
      
      const subjectPerf = Object.entries(subjectStats).map(([subject, data]) => ({
        subject,
        score: data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0,
        hours: Math.round((data.totalTime / 60) * 10) / 10,
        tasksCompleted: data.completed,
        totalTasks: data.total
      })).sort((a, b) => b.score - a.score);
      
      // Generate weekly activity data from tasks
      const last7Days = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        last7Days.push(date.toDateString());
      }
      
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const weeklyActivity = last7Days.map((dateStr, index) => {
        const date = new Date(dateStr);
        const dayTasks = tasks.filter(task => {
          if (!task.createdAt) return false;
          const taskDate = new Date(task.createdAt);
          return taskDate.toDateString() === dateStr;
        });
        
        const dayCompleted = tasks.filter(task => {
          if (!task.completedAt) return false;
          const completedDate = new Date(task.completedAt);
          return completedDate.toDateString() === dateStr;
        });
        
        return {
          day: dayNames[date.getDay()],
          hours: dayTasks.reduce((sum, t) => sum + (t.estimatedDuration || 0), 0) / 60,
          tasks: dayCompleted.length
        };
      });
      
      // Fetch achievements
      let achievementsList = [];
      try {
        const achievementsRes = await analyticsService.getAchievements();
        achievementsList = achievementsRes.achievements || [];
      } catch (error) {
        console.log('No achievements yet');
      }
      
      setStats({
        totalStudyTime: totalStudyHours,
        completedTasks,
        totalTasks,
        pendingTasks,
        overdueTasks,
        averageProductivity: completionRate,
        currentStreak: calculateStreak(tasks),
        completionRate,
        topSubject,
        bestTime: findBestStudyTime(tasks)
      });
      
      setWeeklyData(weeklyActivity);
      setSubjectPerformance(subjectPerf.slice(0, 5)); // Top 5 subjects
      setAchievements(achievementsList);
      
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const calculateStreak = (tasks) => {
    // Simple streak calculation based on consecutive days with completed tasks
    const completedDates = tasks
      .filter(t => t.status === 'completed' && t.completedAt)
      .map(t => new Date(t.completedAt).toDateString());
    
    const uniqueDates = [...new Set(completedDates)].sort();
    
    let streak = 0;
    let maxStreak = 0;
    let prevDate = null;
    
    uniqueDates.forEach(dateStr => {
      const currentDate = new Date(dateStr);
      if (prevDate) {
        const diffDays = Math.floor((currentDate - prevDate) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          streak++;
        } else if (diffDays > 1) {
          streak = 1;
        }
      } else {
        streak = 1;
      }
      
      maxStreak = Math.max(maxStreak, streak);
      prevDate = currentDate;
    });
    
    return maxStreak;
  };

  const findBestStudyTime = (tasks) => {
    const hourCounts = {};
    tasks.filter(t => t.status === 'completed' && t.completedAt).forEach(task => {
      const hour = new Date(task.completedAt).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });
    
    let bestHour = 9; // default to morning
    let maxCount = 0;
    Object.entries(hourCounts).forEach(([hour, count]) => {
      if (count > maxCount) {
        maxCount = count;
        bestHour = parseInt(hour);
      }
    });
    
    if (bestHour >= 5 && bestHour < 12) return 'Morning';
    if (bestHour >= 12 && bestHour < 17) return 'Afternoon';
    if (bestHour >= 17 && bestHour < 21) return 'Evening';
    return 'Night';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h1>
        <button
          onClick={fetchAnalytics}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Refresh Data
        </button>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-indigo-100 rounded-lg">
              <FiClock className="w-6 h-6 text-indigo-600" />
            </div>
            <span className="text-2xl font-bold text-indigo-600">{stats.totalStudyTime}h</span>
          </div>
          <h3 className="text-gray-600 font-medium">Total Study Time</h3>
          <p className="text-sm text-gray-500 mt-1">Across {stats.totalTasks} tasks</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <FiCheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-green-600">{stats.completedTasks}</span>
          </div>
          <h3 className="text-gray-600 font-medium">Tasks Completed</h3>
          <p className="text-sm text-gray-500 mt-1">{stats.completionRate}% completion rate</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <FiTrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-2xl font-bold text-purple-600">{stats.pendingTasks}</span>
          </div>
          <h3 className="text-gray-600 font-medium">Pending Tasks</h3>
          <p className="text-sm text-gray-500 mt-1">{stats.overdueTasks} overdue</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <FiActivity className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-2xl font-bold text-orange-600">{stats.currentStreak} days</span>
          </div>
          <h3 className="text-gray-600 font-medium">Current Streak</h3>
          <p className="text-sm text-gray-500 mt-1">Best: {stats.currentStreak} days</p>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Activity Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold mb-4">Weekly Activity</h3>
          <div className="h-64 flex items-end justify-between">
            {weeklyData.map((item, index) => (
              <div key={item.day} className="flex flex-col items-center w-16">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(item.hours * 20, 5)}px` }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="w-10 bg-gradient-to-t from-indigo-600 to-purple-600 rounded-t-lg"
                />
                <span className="text-sm text-gray-600 mt-2">{item.day}</span>
                <span className="text-xs font-semibold text-indigo-600">{item.hours.toFixed(1)}h</span>
                <span className="text-xs text-gray-500">{item.tasks} tasks</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Subject Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold mb-4">Subject Performance</h3>
          <div className="space-y-4">
            {subjectPerformance.length > 0 ? (
              subjectPerformance.map((subject, index) => (
                <div key={subject.subject}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 truncate max-w-[150px]" title={subject.subject}>
                      {subject.subject.length > 20 ? subject.subject.substring(0, 17) + '...' : subject.subject}
                    </span>
                    <div>
                      <span className="font-semibold text-indigo-600">{subject.score}%</span>
                      <span className="text-xs text-gray-400 ml-2">{subject.hours}h</span>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${subject.score}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className="h-full bg-gradient-to-r from-indigo-600 to-purple-600"
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {subject.tasksCompleted}/{subject.totalTasks} tasks
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No subject data yet</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg p-6 text-white"
      >
        <h3 className="text-lg font-semibold mb-4">Study Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4">
            <FiBook className="w-6 h-6 mb-2" />
            <p className="text-sm opacity-90">Best Subject</p>
            <p className="text-xl font-bold">{stats.topSubject}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4">
            <FiClock className="w-6 h-6 mb-2" />
            <p className="text-sm opacity-90">Peak Performance</p>
            <p className="text-xl font-bold">{stats.bestTime}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4">
            <FiTarget className="w-6 h-6 mb-2" />
            <p className="text-sm opacity-90">Next Goal</p>
            <p className="text-xl font-bold">
              {stats.completionRate < 50 ? 'Complete more tasks' : 
               stats.pendingTasks > 0 ? `${stats.pendingTasks} tasks pending` : 
               'Create new tasks'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Achievements Section */}
      {achievements.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FiAward className="mr-2 text-yellow-500" /> Achievements
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {achievements.map((achievement, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
                <FiAward className="w-8 h-8 text-yellow-500" />
                <div>
                  <h4 className="font-semibold text-gray-800">{achievement.name}</h4>
                  <p className="text-xs text-gray-600">{achievement.description}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Analytics;