const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  studySessions: [{
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task'
    },
    subject: String,
    startTime: Date,
    endTime: Date,
    duration: Number, // in minutes
    focusScore: {
      type: Number,
      min: 0,
      max: 100
    },
    notes: String
  }],
  totalStudyTime: {
    type: Number,
    default: 0
  },
  tasksCompleted: {
    type: Number,
    default: 0
  },
  tasksPlanned: {
    type: Number,
    default: 0
  },
  productivityScore: {
    type: Number,
    min: 0,
    max: 100
  },
  subjectProgress: [{
    subject: String,
    timeSpent: Number,
    tasksCompleted: Number,
    averageFocus: Number
  }],
  achievements: [{
    type: {
      type: String,
      enum: ['streak', 'milestone', 'consistency', 'excellence']
    },
    name: String,
    description: String,
    earnedAt: Date
  }],
  streak: {
    current: {
      type: Number,
      default: 0
    },
    longest: {
      type: Number,
      default: 0
    },
    lastActive: Date
  }
}, {
  timestamps: true
});

// Update streak
progressSchema.pre('save', async function(next) {
  const today = new Date().setHours(0, 0, 0, 0);
  const lastActive = this.streak.lastActive?.setHours(0, 0, 0, 0);
  
  if (lastActive) {
    const dayDiff = Math.floor((today - lastActive) / (1000 * 60 * 60 * 24));
    
    if (dayDiff === 1) {
      // Consecutive day
      this.streak.current += 1;
    } else if (dayDiff > 1) {
      // Streak broken
      this.streak.current = 1;
    }
  } else {
    this.streak.current = 1;
  }
  
  // Update longest streak
  if (this.streak.current > this.streak.longest) {
    this.streak.longest = this.streak.current;
  }
  
  this.streak.lastActive = new Date();
  next();
});

module.exports = mongoose.model('Progress', progressSchema);