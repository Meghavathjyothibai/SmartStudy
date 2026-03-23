const Task = require('../models/Task');
const StudyPlan = require('../models/StudyPlan');
const moment = require('moment');

class SmartScheduler {
  constructor(userId) {
    this.userId = userId;
  }

  // Generate optimal study schedule
  async generateSchedule(startDate, endDate, preferences = {}) {
    try {
      // Get all pending tasks
      const tasks = await Task.find({
        user: this.userId,
        status: { $in: ['pending', 'in-progress'] },
        dueDate: { $lte: endDate }
      }).sort({ priority: -1, dueDate: 1 });

      if (tasks.length === 0) {
        return { message: 'No tasks to schedule' };
      }

      // Calculate available time slots
      const timeSlots = this.calculateTimeSlots(startDate, endDate, preferences);
      
      // Prioritize and schedule tasks
      const schedule = this.prioritizeAndSchedule(tasks, timeSlots);
      
      // Create or update study plan
      const studyPlan = await this.createOrUpdatePlan(schedule, startDate, endDate);
      
      return {
        success: true,
        studyPlan,
        statistics: {
          totalTasks: tasks.length,
          scheduledTasks: schedule.length,
          totalStudyTime: schedule.reduce((acc, day) => 
            acc + day.tasks.reduce((sum, t) => sum + t.duration, 0), 0
          )
        }
      };
    } catch (error) {
      console.error('Scheduling error:', error);
      throw error;
    }
  }

  // Calculate available time slots
  calculateTimeSlots(startDate, endDate, preferences) {
    const slots = [];
    const currentDate = moment(startDate);
    const end = moment(endDate);
    
    const preferredTime = preferences.preferredStudyTime || 'morning';
    const maxHoursPerDay = preferences.maxStudyHoursPerDay || 6;
    const breakInterval = preferences.breakInterval || 45;

    while (currentDate <= end) {
      const daySlots = this.getDayTimeSlots(
        currentDate.toDate(),
        preferredTime,
        maxHoursPerDay,
        breakInterval
      );
      
      slots.push({
        date: currentDate.toDate(),
        slots: daySlots
      });
      
      currentDate.add(1, 'day');
    }
    
    return slots;
  }

  // Get time slots for a specific day
  getDayTimeSlots(date, preferredTime, maxHours, breakInterval) {
    const slots = [];
    const dayStart = moment(date).hour(9).minute(0); // Default start at 9 AM
    const dayEnd = moment(date).hour(21).minute(0); // Default end at 9 PM
    
    let currentTime = moment(dayStart);
    const totalMinutes = maxHours * 60;
    let allocatedMinutes = 0;
    
    while (currentTime < dayEnd && allocatedMinutes < totalMinutes) {
      const slotDuration = Math.min(breakInterval, totalMinutes - allocatedMinutes);
      
      if (slotDuration >= 30) { // Minimum 30-min slot
        slots.push({
          start: currentTime.format('HH:mm'),
          end: currentTime.add(slotDuration, 'minutes').format('HH:mm'),
          duration: slotDuration,
          available: true
        });
        
        // Add break
        currentTime.add(15, 'minutes'); // 15-min break
        allocatedMinutes += slotDuration + 15;
      } else {
        break;
      }
    }
    
    return slots;
  }

  // Prioritize and schedule tasks
  prioritizeAndSchedule(tasks, timeSlots) {
    const schedule = [];
    
    // Calculate task priority scores
    const scoredTasks = tasks.map(task => ({
      ...task.toObject(),
      priorityScore: this.calculatePriorityScore(task)
    }));
    
    // Sort by priority score (highest first)
    scoredTasks.sort((a, b) => b.priorityScore - a.priorityScore);
    
    // Schedule tasks in available slots
    for (const task of scoredTasks) {
      let remainingDuration = task.estimatedDuration;
      
      for (const day of timeSlots) {
        if (remainingDuration <= 0) break;
        
        const daySchedule = schedule.find(s => 
          moment(s.date).isSame(day.date, 'day')
        ) || {
          date: day.date,
          tasks: []
        };
        
        if (!schedule.includes(daySchedule)) {
          schedule.push(daySchedule);
        }
        
        // Find available slots for this day
        for (const slot of day.slots) {
          if (remainingDuration <= 0) break;
          if (!slot.available) continue;
          
          const taskDuration = Math.min(slot.duration, remainingDuration);
          
          daySchedule.tasks.push({
            taskId: task._id,
            title: task.title,
            subject: task.subject,
            startTime: slot.start,
            endTime: moment(slot.start, 'HH:mm')
              .add(taskDuration, 'minutes')
              .format('HH:mm'),
            duration: taskDuration,
            priority: task.priority,
            completed: false
          });
          
          slot.available = false;
          remainingDuration -= taskDuration;
        }
      }
    }
    
    return schedule;
  }

  // Calculate priority score for task
  calculatePriorityScore(task) {
    let score = 0;
    
    // Priority weight
    const priorityWeights = {
      urgent: 100,
      high: 75,
      medium: 50,
      low: 25
    };
    score += priorityWeights[task.priority] || 0;
    
    // Urgency based on due date
    const daysUntilDue = moment(task.dueDate).diff(moment(), 'days');
    if (daysUntilDue < 0) {
      score += 50; // Overdue tasks get boost
    } else if (daysUntilDue === 0) {
      score += 40; // Due today
    } else if (daysUntilDue <= 2) {
      score += 30; // Due soon
    } else if (daysUntilDue <= 7) {
      score += 20; // Due this week
    }
    
    // Task size weight
    if (task.estimatedDuration > 120) {
      score += 15; // Large tasks
    } else if (task.estimatedDuration > 60) {
      score += 10; // Medium tasks
    } else {
      score += 5; // Small tasks (quick wins)
    }
    
    return score;
  }

  // Create or update study plan
  async createOrUpdatePlan(schedule, startDate, endDate) {
    let studyPlan = await StudyPlan.findOne({
      user: this.userId,
      status: 'active'
    });
    
    if (!studyPlan) {
      studyPlan = new StudyPlan({
        user: this.userId,
        name: `Study Plan ${moment().format('YYYY-MM-DD')}`,
        startDate,
        endDate,
        schedule: []
      });
    }
    
    studyPlan.schedule = schedule;
    studyPlan.analytics.totalTasks = schedule.reduce(
      (acc, day) => acc + day.tasks.length, 0
    );
    
    await studyPlan.save();
    return studyPlan;
  }

  // Analyze study patterns and provide recommendations
  async analyzeStudyPatterns() {
    const thirtyDaysAgo = moment().subtract(30, 'days').toDate();
    
    const completedTasks = await Task.find({
      user: this.userId,
      status: 'completed',
      completedAt: { $gte: thirtyDaysAgo }
    });
    
    const patterns = {
      bestTimeOfDay: this.findBestTimeOfDay(completedTasks),
      averageProductivity: this.calculateAverageProductivity(completedTasks),
      subjectPerformance: this.analyzeSubjectPerformance(completedTasks),
      recommendations: []
    };
    
    // Generate recommendations
    patterns.recommendations = this.generateRecommendations(patterns);
    
    return patterns;
  }

  findBestTimeOfDay(tasks) {
    const timeSlots = {
      morning: { count: 0, duration: 0 },
      afternoon: { count: 0, duration: 0 },
      evening: { count: 0, duration: 0 },
      night: { count: 0, duration: 0 }
    };
    
    tasks.forEach(task => {
      if (task.completedAt) {
        const hour = moment(task.completedAt).hour();
        let slot;
        
        if (hour >= 5 && hour < 12) slot = 'morning';
        else if (hour >= 12 && hour < 17) slot = 'afternoon';
        else if (hour >= 17 && hour < 21) slot = 'evening';
        else slot = 'night';
        
        timeSlots[slot].count++;
        timeSlots[slot].duration += task.actualDuration || 0;
      }
    });
    
    // Find slot with highest completion rate
    let bestSlot = 'morning';
    let maxScore = 0;
    
    Object.entries(timeSlots).forEach(([slot, data]) => {
      const score = data.count * (data.duration / 60); // Weight by hours studied
      if (score > maxScore) {
        maxScore = score;
        bestSlot = slot;
      }
    });
    
    return {
      preferred: bestSlot,
      distribution: timeSlots
    };
  }

  calculateAverageProductivity(tasks) {
    if (tasks.length === 0) return 0;
    
    const totalProductivity = tasks.reduce((sum, task) => {
      if (task.actualDuration && task.estimatedDuration) {
        const ratio = task.actualDuration / task.estimatedDuration;
        return sum + (ratio <= 1 ? 100 : Math.max(0, 100 - (ratio - 1) * 50));
      }
      return sum + 70; // Default score
    }, 0);
    
    return Math.round(totalProductivity / tasks.length);
  }

  analyzeSubjectPerformance(tasks) {
    const subjects = {};
    
    tasks.forEach(task => {
      if (!subjects[task.subject]) {
        subjects[task.subject] = {
          total: 0,
          completed: 0,
          totalTime: 0,
          averageScore: 0
        };
      }
      
      subjects[task.subject].total++;
      subjects[task.subject].completed++;
      subjects[task.subject].totalTime += task.actualDuration || 0;
    });
    
    Object.values(subjects).forEach(subject => {
      subject.completionRate = (subject.completed / subject.total) * 100;
      subject.averageTime = subject.totalTime / subject.completed;
    });
    
    return subjects;
  }

  generateRecommendations(patterns) {
    const recommendations = [];
    
    // Time-based recommendations
    recommendations.push({
      type: 'time',
      title: 'Optimal Study Time',
      description: `You're most productive during ${patterns.bestTimeOfDay.preferred}. Consider scheduling important tasks during this time.`,
      priority: 'high'
    });
    
    // Break recommendations
    recommendations.push({
      type: 'break',
      title: 'Take Regular Breaks',
      description: 'Studies show that taking a 5-10 minute break every hour improves retention.',
      priority: 'medium'
    });
    
    // Subject balance recommendations
    const weakSubjects = Object.entries(patterns.subjectPerformance)
      .filter(([_, data]) => data.completionRate < 60)
      .map(([subject]) => subject);
    
    if (weakSubjects.length > 0) {
      recommendations.push({
        type: 'focus',
        title: 'Focus on Weak Subjects',
        description: `Spend extra time on: ${weakSubjects.join(', ')}`,
        priority: 'high'
      });
    }
    
    return recommendations;
  }
}

module.exports = SmartScheduler;