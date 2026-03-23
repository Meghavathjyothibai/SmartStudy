const cron = require('node-cron');
const nodemailer = require('nodemailer');
const Task = require('../models/Task');
const User = require('../models/User');

class ReminderService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  // Start reminder service
  start() {
    // Check for upcoming tasks every hour
    cron.schedule('0 * * * *', () => {
      this.checkUpcomingTasks();
    });
    
    // Send daily summary at 8 AM
    cron.schedule('0 8 * * *', () => {
      this.sendDailySummary();
    });
    
    console.log('Reminder service started');
  }

  // Check for upcoming tasks
  async checkUpcomingTasks() {
    try {
      const now = new Date();
      const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
      
      const tasks = await Task.find({
        scheduledStart: {
          $gte: now,
          $lte: oneHourLater
        },
        status: 'pending',
        'reminders.sent': false
      }).populate('user');
      
      for (const task of tasks) {
        await this.sendTaskReminder(task);
        
        // Mark reminder as sent
        task.reminders.push({
          time: now,
          sent: true
        });
        await task.save();
      }
    } catch (error) {
      console.error('Error checking upcoming tasks:', error);
    }
  }

  // Send task reminder
  async sendTaskReminder(task) {
    const user = task.user;
    
    if (!user.settings.emailNotifications) return;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: `⏰ Task Reminder: ${task.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">Task Reminder</h2>
          <p>Hello ${user.name},</p>
          <p>Your task <strong>"${task.title}"</strong> starts in less than an hour:</p>
          
          <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Subject:</strong> ${task.subject}</p>
            <p><strong>Start Time:</strong> ${new Date(task.scheduledStart).toLocaleTimeString()}</p>
            <p><strong>Duration:</strong> ${task.estimatedDuration} minutes</p>
            <p><strong>Priority:</strong> <span style="color: ${this.getPriorityColor(task.priority)}">${task.priority}</span></p>
          </div>
          
          <p>Good luck with your study session! 📚</p>
          
          <hr style="border: 1px solid #E5E7EB; margin: 20px 0;" />
          
          <p style="color: #6B7280; font-size: 12px;">
            You received this email because you have notifications enabled in Smart Study Scheduler.
          </p>
        </div>
      `
    };
    
    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Reminder sent for task: ${task.title}`);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

  // Send daily summary
  async sendDailySummary() {
    try {
      const users = await User.find({
        'settings.emailNotifications': true
      });
      
      for (const user of users) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const tasks = await Task.find({
          user: user._id,
          scheduledStart: {
            $gte: today,
            $lt: tomorrow
          },
          status: { $ne: 'completed' }
        }).sort('scheduledStart');
        
        if (tasks.length > 0) {
          await this.sendDailySummaryEmail(user, tasks);
        }
      }
    } catch (error) {
      console.error('Error sending daily summary:', error);
    }
  }

  // Send daily summary email
  async sendDailySummaryEmail(user, tasks) {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const totalDuration = tasks.reduce((sum, t) => sum + t.estimatedDuration, 0);
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: `📅 Your Study Schedule for Today`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">Good Morning, ${user.name}!</h2>
          <p>Here's your study schedule for today:</p>
          
          <div style="background: linear-gradient(135deg, #4F46E5, #7C3AED); color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>📊 Today's Summary</strong></p>
            <p>Tasks: ${totalTasks} (${completedTasks} completed)</p>
            <p>Total Study Time: ${Math.round(totalDuration / 60)} hours</p>
          </div>
          
          <h3>Your Tasks:</h3>
          
          ${tasks.map(task => `
            <div style="background-color: #F9FAFB; padding: 15px; border-left: 4px solid ${this.getPriorityColor(task.priority)}; margin: 10px 0; border-radius: 4px;">
              <p style="margin: 0;"><strong>${task.title}</strong> (${task.subject})</p>
              <p style="margin: 5px 0 0; color: #6B7280;">
                ${new Date(task.scheduledStart).toLocaleTimeString()} - ${task.estimatedDuration} minutes
              </p>
              <p style="margin: 5px 0 0;">
                Priority: <span style="color: ${this.getPriorityColor(task.priority)}">${task.priority}</span>
              </p>
            </div>
          `).join('')}
          
          <p style="margin-top: 20px;">
            <a href="${process.env.FRONTEND_URL}/dashboard" style="background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              View Full Schedule
            </a>
          </p>
        </div>
      `
    };
    
    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending daily summary:', error);
    }
  }

  getPriorityColor(priority) {
    const colors = {
      low: '#10B981',
      medium: '#F59E0B',
      high: '#EF4444',
      urgent: '#DC2626'
    };
    return colors[priority] || '#6B7280';
  }
}

module.exports = new ReminderService();