const express = require('express');
const router = express.Router();
const StudyPlan = require('../models/StudyPlan');
const SmartScheduler = require('../services/scheduler');
const { auth } = require('../middleware/auth');

// @route   GET /api/studyplan/active
// @desc    Get active study plan
// @access  Private
router.get('/active', auth, async (req, res) => {
  try {
    const studyPlan = await StudyPlan.findOne({
      user: req.user._id,
      status: 'active'
    }).populate('schedule.tasks.taskId');
    
    res.json({
      success: true,
      studyPlan
    });
  } catch (error) {
    console.error('Get active plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/studyplan/generate
// @desc    Generate study plan
// @access  Private
router.post('/generate', auth, async (req, res) => {
  try {
    const { startDate, endDate, preferences } = req.body;
    
    const scheduler = new SmartScheduler(req.user._id);
    const result = await scheduler.generateSchedule(startDate, endDate, preferences);
    
    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Generate plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/studyplan/analytics
// @desc    Get study analytics
// @access  Private
router.get('/analytics', auth, async (req, res) => {
  try {
    const scheduler = new SmartScheduler(req.user._id);
    const patterns = await scheduler.analyzeStudyPatterns();
    
    res.json({
      success: true,
      patterns
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/studyplan/:id/task/:taskId
// @desc    Mark task as complete
// @access  Private
router.put('/:id/task/:taskId', auth, async (req, res) => {
  try {
    const studyPlan = await StudyPlan.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!studyPlan) {
      return res.status(404).json({
        success: false,
        message: 'Study plan not found'
      });
    }
    
    // Find and update the task in schedule
    for (const day of studyPlan.schedule) {
      const task = day.tasks.find(t => t._id.toString() === req.params.taskId);
      if (task) {
        task.completed = true;
        day.completedTime += task.duration;
        studyPlan.analytics.completedTasks++;
        break;
      }
    }
    
    await studyPlan.save();
    
    res.json({
      success: true,
      studyPlan
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/studyplan/:id/pause
// @desc    Pause study plan
// @access  Private
router.post('/:id/pause', auth, async (req, res) => {
  try {
    const studyPlan = await StudyPlan.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { status: 'paused' },
      { new: true }
    );
    
    if (!studyPlan) {
      return res.status(404).json({
        success: false,
        message: 'Study plan not found'
      });
    }
    
    res.json({
      success: true,
      studyPlan
    });
  } catch (error) {
    console.error('Pause plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/studyplan/:id/resume
// @desc    Resume study plan
// @access  Private
router.post('/:id/resume', auth, async (req, res) => {
  try {
    const studyPlan = await StudyPlan.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { status: 'active' },
      { new: true }
    );
    
    if (!studyPlan) {
      return res.status(404).json({
        success: false,
        message: 'Study plan not found'
      });
    }
    
    res.json({
      success: true,
      studyPlan
    });
  } catch (error) {
    console.error('Resume plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;