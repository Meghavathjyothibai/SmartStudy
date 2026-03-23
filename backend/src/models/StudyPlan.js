const mongoose = require('mongoose');

const studyPlanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please provide a plan name'],
    trim: true
  },
  description: String,
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  schedule: [{
    date: Date,
    tasks: [{
      taskId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
      },
      title: String,
      subject: String,
      startTime: String,
      endTime: String,
      duration: Number,
      completed: {
        type: Boolean,
        default: false
      }
    }],
    totalStudyTime: Number,
    completedTime: Number
  }],
  goals: [{
    title: String,
    target: Number,
    achieved: {
      type: Number,
      default: 0
    },
    unit: String
  }],
  analytics: {
    totalTasks: {
      type: Number,
      default: 0
    },
    completedTasks: {
      type: Number,
      default: 0
    },
    totalStudyTime: {
      type: Number, // in minutes
      default: 0
    },
    averageProductivity: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    subjectBreakdown: [{
      subject: String,
      timeSpent: Number,
      tasksCompleted: Number
    }]
  },
  preferences: {
    preferredStudyTime: String,
    breakInterval: Number,
    smartScheduling: {
      type: Boolean,
      default: true
    }
  },
  status: {
    type: String,
    enum: ['active', 'paused', 'completed', 'archived'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update analytics before save
studyPlanSchema.pre('save', async function(next) {
  this.updatedAt = Date.now();
  
  // Calculate completion rate
  if (this.analytics.totalTasks > 0) {
    this.analytics.completionRate = 
      (this.analytics.completedTasks / this.analytics.totalTasks) * 100;
  }
  
  next();
});

module.exports = mongoose.model('StudyPlan', studyPlanSchema);