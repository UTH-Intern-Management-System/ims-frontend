// Automated Email/SMS Reminder Service
import { useNotification, NOTIFICATION_TEMPLATES } from '../context/NotificationContext';

class ReminderService {
  constructor() {
    this.reminders = this.loadReminders();
    this.reminderTypes = {
      INTERVIEW: 'interview',
      TASK_DEADLINE: 'task_deadline', 
      EVALUATION: 'evaluation',
      MEETING: 'meeting',
      DOCUMENT_SUBMISSION: 'document_submission',
      TRAINING_SESSION: 'training_session',
      SYSTEM_MAINTENANCE: 'system_maintenance'
    };
    
    this.notificationChannels = {
      EMAIL: 'email',
      SMS: 'sms',
      IN_APP: 'in_app',
      PUSH: 'push'
    };

    this.scheduleIntervals = new Map();
    this.startReminderEngine();
  }

  loadReminders() {
    try {
      const saved = localStorage.getItem('scheduledReminders');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading reminders:', error);
      return [];
    }
  }

  saveReminders() {
    try {
      localStorage.setItem('scheduledReminders', JSON.stringify(this.reminders));
    } catch (error) {
      console.error('Error saving reminders:', error);
    }
  }

  // Schedule a new reminder
  scheduleReminder({
    id = null,
    type,
    title,
    message,
    targetDate,
    recipients = [],
    channels = ['in_app'],
    priority = 'medium',
    recurring = false,
    recurringPattern = null,
    advanceNotifications = [],
    metadata = {}
  }) {
    const reminder = {
      id: id || `reminder_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      title,
      message,
      targetDate: new Date(targetDate).toISOString(),
      recipients,
      channels,
      priority,
      recurring,
      recurringPattern,
      advanceNotifications: advanceNotifications.map(advance => ({
        ...advance,
        scheduledTime: new Date(new Date(targetDate).getTime() - advance.minutesBefore * 60000).toISOString(),
        sent: false
      })),
      metadata,
      status: 'scheduled',
      createdAt: new Date().toISOString(),
      sentNotifications: []
    };

    this.reminders.push(reminder);
    this.saveReminders();
    this.scheduleReminderChecks(reminder);
    
    return reminder;
  }

  // Predefined reminder templates
  scheduleInterviewReminder(interviewData) {
    const { candidateName, interviewerName, dateTime, location, type } = interviewData;
    
    return this.scheduleReminder({
      type: this.reminderTypes.INTERVIEW,
      title: `Phỏng vấn với ${candidateName}`,
      message: `Bạn có lịch phỏng vấn ${type} với ${candidateName} tại ${location}`,
      targetDate: dateTime,
      recipients: [interviewerName],
      channels: ['email', 'in_app', 'sms'],
      priority: 'high',
      advanceNotifications: [
        { minutesBefore: 1440, message: 'Nhắc nhở: Phỏng vấn vào ngày mai' }, // 1 day
        { minutesBefore: 120, message: 'Nhắc nhở: Phỏng vấn trong 2 giờ' },   // 2 hours
        { minutesBefore: 15, message: 'Nhắc nhở: Phỏng vấn trong 15 phút' }   // 15 minutes
      ],
      metadata: { candidateName, interviewerName, location, type }
    });
  }

  scheduleTaskDeadlineReminder(taskData) {
    const { taskName, assignee, deadline, priority } = taskData;
    
    return this.scheduleReminder({
      type: this.reminderTypes.TASK_DEADLINE,
      title: `Hạn nộp: ${taskName}`,
      message: `Nhiệm vụ "${taskName}" sắp đến hạn`,
      targetDate: deadline,
      recipients: [assignee],
      channels: ['in_app', 'email'],
      priority: priority === 'High' ? 'high' : 'medium',
      advanceNotifications: [
        { minutesBefore: 2880, message: 'Nhiệm vụ sắp đến hạn trong 2 ngày' }, // 2 days
        { minutesBefore: 1440, message: 'Nhiệm vụ sắp đến hạn vào ngày mai' },  // 1 day
        { minutesBefore: 240, message: 'Nhiệm vụ sắp đến hạn trong 4 giờ' }     // 4 hours
      ],
      metadata: { taskName, assignee, priority }
    });
  }

  scheduleEvaluationReminder(evaluationData) {
    const { internName, mentorName, evaluationDate, type } = evaluationData;
    
    return this.scheduleReminder({
      type: this.reminderTypes.EVALUATION,
      title: `Đánh giá ${type}: ${internName}`,
      message: `Thời gian đánh giá ${type} cho thực tập sinh ${internName}`,
      targetDate: evaluationDate,
      recipients: [mentorName],
      channels: ['in_app', 'email'],
      priority: 'medium',
      advanceNotifications: [
        { minutesBefore: 1440, message: 'Đánh giá thực tập sinh vào ngày mai' },
        { minutesBefore: 60, message: 'Đánh giá thực tập sinh trong 1 giờ' }
      ],
      metadata: { internName, mentorName, type }
    });
  }

  scheduleTrainingReminder(trainingData) {
    const { trainingName, participants, startTime, location, instructor } = trainingData;
    
    return this.scheduleReminder({
      type: this.reminderTypes.TRAINING_SESSION,
      title: `Khóa đào tạo: ${trainingName}`,
      message: `Khóa đào tạo "${trainingName}" sẽ bắt đầu tại ${location}`,
      targetDate: startTime,
      recipients: participants,
      channels: ['in_app', 'email', 'sms'],
      priority: 'medium',
      advanceNotifications: [
        { minutesBefore: 1440, message: 'Khóa đào tạo bắt đầu vào ngày mai' },
        { minutesBefore: 30, message: 'Khóa đào tạo bắt đầu trong 30 phút' }
      ],
      metadata: { trainingName, location, instructor }
    });
  }

  // Recurring reminders
  scheduleRecurringReminder(reminderData, pattern) {
    const reminder = this.scheduleReminder({
      ...reminderData,
      recurring: true,
      recurringPattern: pattern
    });

    // Schedule next occurrences based on pattern
    this.scheduleNextRecurrence(reminder);
    return reminder;
  }

  scheduleNextRecurrence(reminder) {
    if (!reminder.recurring || !reminder.recurringPattern) return;

    const { type, interval, endDate } = reminder.recurringPattern;
    const currentDate = new Date(reminder.targetDate);
    let nextDate;

    switch (type) {
      case 'daily':
        nextDate = new Date(currentDate.getTime() + interval * 24 * 60 * 60 * 1000);
        break;
      case 'weekly':
        nextDate = new Date(currentDate.getTime() + interval * 7 * 24 * 60 * 60 * 1000);
        break;
      case 'monthly':
        nextDate = new Date(currentDate);
        nextDate.setMonth(nextDate.getMonth() + interval);
        break;
      case 'yearly':
        nextDate = new Date(currentDate);
        nextDate.setFullYear(nextDate.getFullYear() + interval);
        break;
      default:
        return;
    }

    if (endDate && nextDate > new Date(endDate)) return;

    // Create next occurrence
    this.scheduleReminder({
      ...reminder,
      id: null, // Generate new ID
      targetDate: nextDate.toISOString(),
      advanceNotifications: reminder.advanceNotifications.map(notif => ({
        ...notif,
        sent: false,
        scheduledTime: new Date(nextDate.getTime() - notif.minutesBefore * 60000).toISOString()
      }))
    });
  }

  // Reminder engine
  startReminderEngine() {
    // Check for due reminders every minute
    setInterval(() => {
      this.checkDueReminders();
    }, 60000);

    // Initial check
    this.checkDueReminders();
  }

  checkDueReminders() {
    const now = new Date();
    
    this.reminders.forEach(reminder => {
      if (reminder.status === 'cancelled') return;

      // Check advance notifications
      reminder.advanceNotifications.forEach(advance => {
        if (!advance.sent && new Date(advance.scheduledTime) <= now) {
          this.sendAdvanceNotification(reminder, advance);
          advance.sent = true;
        }
      });

      // Check main reminder
      if (reminder.status === 'scheduled' && new Date(reminder.targetDate) <= now) {
        this.sendReminder(reminder);
        reminder.status = 'sent';
        
        // Schedule next recurrence if applicable
        if (reminder.recurring) {
          this.scheduleNextRecurrence(reminder);
        }
      }
    });

    this.saveReminders();
  }

  sendAdvanceNotification(reminder, advance) {
    const notification = {
      id: `advance_${reminder.id}_${advance.minutesBefore}`,
      type: 'advance_reminder',
      title: `Nhắc nhở: ${reminder.title}`,
      message: advance.message,
      priority: reminder.priority,
      channels: reminder.channels,
      recipients: reminder.recipients,
      metadata: {
        ...reminder.metadata,
        originalReminderId: reminder.id,
        minutesBefore: advance.minutesBefore
      }
    };

    this.deliverNotification(notification);
    reminder.sentNotifications.push({
      ...notification,
      sentAt: new Date().toISOString()
    });
  }

  sendReminder(reminder) {
    const notification = {
      id: reminder.id,
      type: reminder.type,
      title: reminder.title,
      message: reminder.message,
      priority: reminder.priority,
      channels: reminder.channels,
      recipients: reminder.recipients,
      metadata: reminder.metadata
    };

    this.deliverNotification(notification);
    reminder.sentNotifications.push({
      ...notification,
      sentAt: new Date().toISOString()
    });
  }

  deliverNotification(notification) {
    notification.channels.forEach(channel => {
      switch (channel) {
        case this.notificationChannels.IN_APP:
          this.sendInAppNotification(notification);
          break;
        case this.notificationChannels.EMAIL:
          this.sendEmailNotification(notification);
          break;
        case this.notificationChannels.SMS:
          this.sendSMSNotification(notification);
          break;
        case this.notificationChannels.PUSH:
          this.sendPushNotification(notification);
          break;
      }
    });
  }

  sendInAppNotification(notification) {
    // Integration with NotificationContext
    if (typeof window !== 'undefined' && window.showNotification) {
      const severity = notification.priority === 'high' ? 'warning' : 'info';
      window.showNotification(notification.message, severity, {
        persistent: notification.priority === 'high',
        action: notification.metadata.actionUrl ? (
          <button onClick={() => window.open(notification.metadata.actionUrl)}>
            Xem chi tiết
          </button>
        ) : null
      });
    }
  }

  sendEmailNotification(notification) {
    // Mock email service - in real implementation, integrate with email service
    console.log('📧 Email Notification:', {
      to: notification.recipients,
      subject: notification.title,
      body: notification.message,
      priority: notification.priority
    });

    // Simulate email sending delay
    setTimeout(() => {
      console.log('✅ Email sent successfully');
    }, 1000);
  }

  sendSMSNotification(notification) {
    // Mock SMS service - in real implementation, integrate with SMS service
    console.log('📱 SMS Notification:', {
      to: notification.recipients,
      message: `${notification.title}: ${notification.message}`,
      priority: notification.priority
    });

    // Simulate SMS sending delay
    setTimeout(() => {
      console.log('✅ SMS sent successfully');
    }, 500);
  }

  sendPushNotification(notification) {
    // Browser push notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: notification.id,
        requireInteraction: notification.priority === 'high'
      });
    }
  }

  // Management methods
  cancelReminder(id) {
    const reminder = this.reminders.find(r => r.id === id);
    if (reminder) {
      reminder.status = 'cancelled';
      this.saveReminders();
    }
  }

  updateReminder(id, updates) {
    const reminder = this.reminders.find(r => r.id === id);
    if (reminder) {
      Object.assign(reminder, updates);
      this.saveReminders();
      
      // Reschedule if date changed
      if (updates.targetDate) {
        this.scheduleReminderChecks(reminder);
      }
    }
  }

  getReminders(filters = {}) {
    let filtered = [...this.reminders];

    if (filters.type) {
      filtered = filtered.filter(r => r.type === filters.type);
    }

    if (filters.status) {
      filtered = filtered.filter(r => r.status === filters.status);
    }

    if (filters.recipient) {
      filtered = filtered.filter(r => r.recipients.includes(filters.recipient));
    }

    if (filters.dateRange) {
      const { from, to } = filters.dateRange;
      filtered = filtered.filter(r => {
        const date = new Date(r.targetDate);
        return (!from || date >= new Date(from)) && (!to || date <= new Date(to));
      });
    }

    return filtered.sort((a, b) => new Date(a.targetDate) - new Date(b.targetDate));
  }

  getUpcomingReminders(hours = 24) {
    const now = new Date();
    const future = new Date(now.getTime() + hours * 60 * 60 * 1000);
    
    return this.reminders.filter(r => 
      r.status === 'scheduled' && 
      new Date(r.targetDate) >= now && 
      new Date(r.targetDate) <= future
    );
  }

  scheduleReminderChecks(reminder) {
    // Clear existing interval if any
    if (this.scheduleIntervals.has(reminder.id)) {
      clearInterval(this.scheduleIntervals.get(reminder.id));
    }

    // Set up new check interval
    const checkInterval = setInterval(() => {
      if (reminder.status === 'sent' || reminder.status === 'cancelled') {
        clearInterval(checkInterval);
        this.scheduleIntervals.delete(reminder.id);
      }
    }, 60000);

    this.scheduleIntervals.set(reminder.id, checkInterval);
  }

  // Analytics and reporting
  getReminderAnalytics(dateRange = null) {
    let reminders = this.reminders;
    
    if (dateRange) {
      const { from, to } = dateRange;
      reminders = reminders.filter(r => {
        const date = new Date(r.createdAt);
        return (!from || date >= new Date(from)) && (!to || date <= new Date(to));
      });
    }

    return {
      total: reminders.length,
      byStatus: this.groupBy(reminders, 'status'),
      byType: this.groupBy(reminders, 'type'),
      byPriority: this.groupBy(reminders, 'priority'),
      deliveryRate: this.calculateDeliveryRate(reminders),
      avgResponseTime: this.calculateAvgResponseTime(reminders)
    };
  }

  groupBy(array, key) {
    return array.reduce((groups, item) => {
      const group = item[key] || 'unknown';
      groups[group] = (groups[group] || 0) + 1;
      return groups;
    }, {});
  }

  calculateDeliveryRate(reminders) {
    const sent = reminders.filter(r => r.status === 'sent').length;
    return reminders.length > 0 ? (sent / reminders.length * 100).toFixed(2) : 0;
  }

  calculateAvgResponseTime(reminders) {
    const sentReminders = reminders.filter(r => r.status === 'sent' && r.sentNotifications.length > 0);
    if (sentReminders.length === 0) return 0;

    const totalTime = sentReminders.reduce((sum, reminder) => {
      const targetTime = new Date(reminder.targetDate).getTime();
      const sentTime = new Date(reminder.sentNotifications[0].sentAt).getTime();
      return sum + Math.abs(sentTime - targetTime);
    }, 0);

    return Math.round(totalTime / sentReminders.length / 1000 / 60); // minutes
  }
}

// Singleton instance
const reminderService = new ReminderService();

export default reminderService;

// React hook for reminder management
export const useReminders = () => {
  const [reminders, setReminders] = React.useState([]);
  const [upcomingReminders, setUpcomingReminders] = React.useState([]);

  React.useEffect(() => {
    const updateReminders = () => {
      setReminders(reminderService.getReminders());
      setUpcomingReminders(reminderService.getUpcomingReminders());
    };

    updateReminders();
    
    // Update every minute
    const interval = setInterval(updateReminders, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    reminders,
    upcomingReminders,
    scheduleReminder: (data) => {
      const reminder = reminderService.scheduleReminder(data);
      setReminders(reminderService.getReminders());
      return reminder;
    },
    cancelReminder: (id) => {
      reminderService.cancelReminder(id);
      setReminders(reminderService.getReminders());
    },
    updateReminder: (id, updates) => {
      reminderService.updateReminder(id, updates);
      setReminders(reminderService.getReminders());
    },
    getAnalytics: reminderService.getReminderAnalytics.bind(reminderService)
  };
};
