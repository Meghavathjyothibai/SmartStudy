const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const Progress = require('../models/Progress');
const { auth } = require('../middleware/auth');
const moment = require('moment');

// @route   GET /api/analytics/overview
// @desc    Get overview statistics
// @access  Private
router.get('/overview', auth, async (req, res) => {
  try {
    const now = moment();
    const startOfWeek = now.clone().startOf('week').toDate();
    const startOfMonth = now.clone().startOf('month').toDate();
    
    // Get task statistics
    const totalTasks = await Task.countDocuments({ user: req.user._id });
    const completedTasks = await Task.countDocuments({ 
      user: req.user._id,
      status: 'completed' 
    });
    
    const pendingTasks = await Task.countDocuments({
      user: req.user._id,
      status: { $in: ['pending', 'in-progress'] },
      dueDate: { $gte: new Date() }
    });
    
    const overdueTasks = await Task.countDocuments({
      user: req.user._id,
      status: { $ne: 'completed' },
      dueDate: { $lt: new Date() }
    });
    
    // Get weekly stats
    const weeklyTasks = await Task.find({
      user: req.user._id,
      createdAt: { $gte: startOfWeek }
    });
    
    // Get monthly stats
    const monthlyProgress = await Progress.find({
      user: req.user._id,
      date: { $gte: startOfMonth }
    }).sort('date');
    
    // Calculate average productivity
    const productivityData = monthlyProgress.map(p => ({
      date: p.date,
      score: p.productivityScore || 0
    }));
    
    // Get subject distribution
    const subjectStats = await Task.aggregate([
      { $match: { user: req.user._id } },
      { $group: {
        _id: '$subject',
        count: { $sum: 1 },
        completed: {
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
        }
      }},
      { $sort: { count: -1 } }
    ]);
    
    res.json({
      success: true,
      data: {
        overview: {
          totalTasks,
          completedTasks,
          pendingTasks,
          overdueTasks,
          completionRate: totalTasks > 0 ? (completedTasks / totalTasks * 100).toFixed(1) : 0
        },
        weekly: {
          tasksCreated: weeklyTasks.length,
          tasksCompleted: weeklyTasks.filter(t => t.status === 'completed').length
        },
        productivity: {
          daily: productivityData.slice(-7),
          average: productivityData.reduce((sum, d) => sum + d.score, 0) / (productivityData.length || 1)
        },
        subjects: subjectStats
      }
    });
  } catch (error) {
    console.error('Analytics overview error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/analytics/timeline
// @desc    Get study timeline
// @access  Private
router.get('/timeline', auth, async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = moment().subtract(days, 'days').startOf('day').toDate();
    
    const progress = await Progress.find({
      user: req.user._id,
      date: { $gte: startDate }
    }).sort('date');
    
    const timeline = progress.map(p => ({
      date: p.date,
      studyTime: p.totalStudyTime,
      tasksCompleted: p.tasksCompleted,
      focusScore: p.productivityScore
    }));
    
    res.json({
      success: true,
      timeline
    });
  } catch (error) {
    console.error('Timeline error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/analytics/achievements
// @desc    Get user achievements
// @access  Private
router.get('/achievements', auth, async (req, res) => {
  try {
    const progress = await Progress.find({ user: req.user._id });
    
    // Calculate achievements
    const achievements = [];
    
    // Streak achievements
    const currentStreak = progress.length > 0 ? progress[progress.length - 1].streak.current : 0;
    if (currentStreak >= 7) {
      achievements.push({
        type: 'streak',
        name: 'Weekly Warrior',
        description: 'Studied for 7 days in a row',
        earned: true,
        date: new Date()
      });
    }
    
    // Task completion achievements
    const totalTasks = await Task.countDocuments({ 
      user: req.user._id,
      status: 'completed' 
    });
    
    if (totalTasks >= 100) {
      achievements.push({
        type: 'milestone',
        name: 'Century Club',
        description: 'Completed 100 tasks',
        earned: true
      });
    } else if (totalTasks >= 50) {
      achievements.push({
        type: 'milestone',
        name: 'Half Century',
        description: 'Completed 50 tasks',
        earned: true
      });
    }
    
    // Study time achievements
    const totalStudyTime = progress.reduce((sum, p) => sum + (p.totalStudyTime || 0), 0);
    if (totalStudyTime >= 100 * 60) { // 100 hours
      achievements.push({
        type: 'milestone',
        name: '100 Hour Club',
        description: 'Studied for 100 hours total',
        earned: true
      });
    }
    
    res.json({
      success: true,
      achievements
    });
  } catch (error) {
    console.error('Achievements error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;