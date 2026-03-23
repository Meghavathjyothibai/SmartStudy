const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const Progress = require('../models/Progress');
const { auth } = require('../middleware/auth');
const { validate, taskValidation } = require('../middleware/validation');

// @route   GET /api/tasks
// @desc    Get all tasks for user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { status, subject, priority, startDate, endDate, limit = 50 } = req.query;
    
    // Build filter
    const filter = { user: req.user._id };
    
    if (status) filter.status = status;
    if (subject) filter.subject = subject;
    if (priority) filter.priority = priority;
    
    if (startDate || endDate) {
      filter.dueDate = {};
      if (startDate) filter.dueDate.$gte = new Date(startDate);
      if (endDate) filter.dueDate.$lte = new Date(endDate);
    }
    
    const tasks = await Task.find(filter)
      .sort({ dueDate: 1, priority: -1 })
      .limit(parseInt(limit));
    
    res.json({
      success: true,
      count: tasks.length,
      tasks
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/tasks
// @desc    Create task
// @access  Private
router.post('/', auth, validate(taskValidation.create), async (req, res) => {
  try {
    const taskData = {
      ...req.body,
      user: req.user._id
    };
    
    const task = await Task.create(taskData);
    
    res.status(201).json({
      success: true,
      task
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/tasks/:id
// @desc    Get single task
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    res.json({
      success: true,
      task
    });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/tasks/:id
// @desc    Update task
// @access  Private
router.put('/:id', auth, validate(taskValidation.update), async (req, res) => {
  try {
    let task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    // Handle completion
    if (req.body.status === 'completed' && task.status !== 'completed') {
      req.body.completedAt = new Date();
      
      // Update progress
      await Progress.findOneAndUpdate(
        { user: req.user._id, date: new Date().setHours(0, 0, 0, 0) },
        {
          $inc: { tasksCompleted: 1 },
          $push: {
            studySessions: {
              taskId: task._id,
              subject: task.subject,
              startTime: task.scheduledStart,
              endTime: new Date(),
              duration: req.body.actualDuration || task.estimatedDuration
            }
          }
        },
        { upsert: true }
      );
    }
    
    task = await Task.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      task
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete task
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/tasks/:id/subtasks
// @desc    Add subtask
// @access  Private
router.post('/:id/subtasks', auth, async (req, res) => {
  try {
    const { title } = req.body;
    
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    task.subtasks.push({ title });
    await task.save();
    
    res.json({
      success: true,
      task
    });
  } catch (error) {
    console.error('Add subtask error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/tasks/:id/subtasks/:subtaskId
// @desc    Update subtask
// @access  Private
router.put('/:id/subtasks/:subtaskId', auth, async (req, res) => {
  try {
    const { completed } = req.body;
    
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    const subtask = task.subtasks.id(req.params.subtaskId);
    if (!subtask) {
      return res.status(404).json({
        success: false,
        message: 'Subtask not found'
      });
    }
    
    subtask.completed = completed;
    await task.save();
    
    res.json({
      success: true,
      task
    });
  } catch (error) {
    console.error('Update subtask error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;