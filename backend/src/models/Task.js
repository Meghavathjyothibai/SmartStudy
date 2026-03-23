const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please provide a task title'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  subject: {
    type: String,
    required: [true, 'Please specify the subject'],
    trim: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  estimatedDuration: {
    type: Number, // in minutes
    required: [true, 'Please provide estimated duration'],
    min: [5, 'Duration must be at least 5 minutes'],
    max: [480, 'Duration cannot exceed 8 hours']
  },
  actualDuration: {
    type: Number, // in minutes
    min: 0,
    default: 0
  },
  dueDate: {
    type: Date,
    required: [true, 'Please provide a due date']
  },
  // NEW TIME FIELDS
  startTime: {
    type: String,
    required: [true, 'Please provide start time'],
    match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Start time must be in HH:MM format']
  },
  endTime: {
    type: String,
    required: [true, 'Please provide end time'],
    match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'End time must be in HH:MM format']
  },
  scheduledStart: {
    type: Date
  },
  scheduledEnd: {
    type: Date
  },
  completedAt: {
    type: Date
  },
  tags: [{
    type: String,
    trim: true
  }],
  resources: [{
    title: String,
    url: String,
    type: {
      type: String,
      enum: ['video', 'article', 'book', 'note', 'other']
    }
  }],
  subtasks: [{
    title: String,
    completed: {
      type: Boolean,
      default: false
    }
  }],
  recurring: {
    isRecurring: {
      type: Boolean,
      default: false
    },
    pattern: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'custom']
    },
    interval: Number,
    endDate: Date
  },
  reminders: [{
    time: Date,
    sent: {
      type: Boolean,
      default: false
    }
  }],
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  notes: [{
    content: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient queries
taskSchema.index({ user: 1, dueDate: 1 });
taskSchema.index({ user: 1, status: 1 });
taskSchema.index({ user: 1, subject: 1 });

// Update timestamps on save
taskSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Calculate progress based on subtasks
taskSchema.pre('save', function(next) {
  if (this.subtasks && this.subtasks.length > 0) {
    const completedCount = this.subtasks.filter(st => st.completed).length;
    this.progress = Math.round((completedCount / this.subtasks.length) * 100);
  }
  next();
});

module.exports = mongoose.model('Task', taskSchema);