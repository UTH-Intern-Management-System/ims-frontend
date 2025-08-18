import { mockNotifications, mockUsers } from '../mocks/data';

const notificationService = {
  // Get Notifications
  getAllNotifications: () => Promise.resolve({ data: mockNotifications }),
  
  getNotificationsByUser: (userId) => Promise.resolve({
    data: mockNotifications.filter(notification => notification.userId === userId)
  }),
  
  getUnreadNotifications: (userId) => Promise.resolve({
    data: mockNotifications.filter(notification => 
      notification.userId === userId && !notification.read
    )
  }),
  
  getNotificationsByType: (userId, type) => Promise.resolve({
    data: mockNotifications.filter(notification => 
      notification.userId === userId && notification.type === type
    )
  }),

  // Create Notifications
  createNotification: (notificationData) => {
    const newNotification = {
      ...notificationData,
      id: Math.max(...mockNotifications.map(n => n.id)) + 1,
      timestamp: new Date().toISOString(),
      read: false
    };
    mockNotifications.push(newNotification);
    return Promise.resolve({ data: newNotification });
  },
  
  // Bulk create notifications for multiple users
  createBulkNotifications: (userIds, notificationData) => {
    const newNotifications = userIds.map(userId => ({
      ...notificationData,
      id: Math.max(...mockNotifications.map(n => n.id)) + 1 + userIds.indexOf(userId),
      userId,
      timestamp: new Date().toISOString(),
      read: false
    }));
    mockNotifications.push(...newNotifications);
    return Promise.resolve({ data: newNotifications });
  },

  // Mark as read
  markAsRead: (notificationId) => {
    const notification = mockNotifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      return Promise.resolve({ data: notification });
    }
    return Promise.reject(new Error("Notification not found"));
  },
  
  markAllAsRead: (userId) => {
    const userNotifications = mockNotifications.filter(n => n.userId === userId);
    userNotifications.forEach(n => n.read = true);
    return Promise.resolve({ 
      data: { 
        userId, 
        updatedCount: userNotifications.length 
      } 
    });
  },

  // Delete notifications
  deleteNotification: (notificationId) => {
    const initialLength = mockNotifications.length;
    const filtered = mockNotifications.filter(n => n.id !== notificationId);
    if (filtered.length < initialLength) {
      return Promise.resolve({ success: true });
    }
    return Promise.reject(new Error("Notification not found"));
  },
  
  deleteAllNotifications: (userId) => {
    const initialLength = mockNotifications.length;
    const filtered = mockNotifications.filter(n => n.userId !== userId);
    const deletedCount = initialLength - filtered.length;
    if (deletedCount > 0) {
      return Promise.resolve({ 
        data: { 
          userId, 
          deletedCount 
        } 
      });
    }
    return Promise.resolve({ data: { userId, deletedCount: 0 } });
  },

  // Notification Templates
  createTaskDueNotification: (userId, taskTitle, dueDate) => {
    return this.createNotification({
      userId,
      type: "task_due",
      title: "Task Due Soon",
      message: `${taskTitle} is due on ${dueDate}`,
      priority: "high"
    });
  },
  
  createAssessmentDueNotification: (userId, internName, period) => {
    return this.createNotification({
      userId,
      type: "assessment_due",
      title: "Performance Review Due",
      message: `${period} performance assessment for ${internName} is due`,
      priority: "medium"
    });
  },
  
  createApplicationReceivedNotification: (userId, position, candidateName) => {
    return this.createNotification({
      userId,
      type: "application_received",
      title: "New Application",
      message: `New application from ${candidateName} for ${position}`,
      priority: "low"
    });
  },
  
  createInterviewScheduledNotification: (userId, candidateName, position, date, time) => {
    return this.createNotification({
      userId,
      type: "interview_scheduled",
      title: "Interview Scheduled",
      message: `Interview with ${candidateName} for ${position} on ${date} at ${time}`,
      priority: "medium"
    });
  },
  
  createTrainingReminderNotification: (userId, programName, moduleName) => {
    return this.createNotification({
      userId,
      type: "training_reminder",
      title: "Training Reminder",
      message: `Don't forget to complete ${moduleName} in ${programName}`,
      priority: "medium"
    });
  },

  // Analytics
  getNotificationAnalytics: (userId) => {
    const userNotifications = mockNotifications.filter(n => n.userId === userId);
    const totalNotifications = userNotifications.length;
    const unreadCount = userNotifications.filter(n => !n.read).length;
    const readCount = totalNotifications - unreadCount;
    
    // Type distribution
    const typeCounts = {};
    userNotifications.forEach(n => {
      typeCounts[n.type] = (typeCounts[n.type] || 0) + 1;
    });
    
    // Priority distribution
    const priorityCounts = {};
    userNotifications.forEach(n => {
      priorityCounts[n.priority] = (priorityCounts[n.priority] || 0) + 1;
    });
    
    return Promise.resolve({
      data: {
        totalNotifications,
        unreadCount,
        readCount,
        readRate: totalNotifications > 0 ? ((readCount / totalNotifications) * 100).toFixed(1) : 0,
        typeDistribution: typeCounts,
        priorityDistribution: priorityCounts,
        recentNotifications: userNotifications
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
          .slice(0, 10)
      }
    });
  },

  // System-wide analytics
  getSystemNotificationAnalytics: () => {
    const totalNotifications = mockNotifications.length;
    const unreadCount = mockNotifications.filter(n => !n.read).length;
    const readCount = totalNotifications - unreadCount;
    
    // Type distribution across system
    const typeCounts = {};
    mockNotifications.forEach(n => {
      typeCounts[n.type] = (typeCounts[n.type] || 0) + 1;
    });
    
    // Priority distribution across system
    const priorityCounts = {};
    mockNotifications.forEach(n => {
      priorityCounts[n.priority] = (priorityCounts[n.priority] || 0) + 1;
    });
    
    return Promise.resolve({
      data: {
        totalNotifications,
        unreadCount,
        readCount,
        readRate: totalNotifications > 0 ? ((readCount / totalNotifications) * 100).toFixed(1) : 0,
        typeDistribution: typeCounts,
        priorityDistribution: priorityCounts,
        notificationsByUser: mockUsers.map(user => ({
          userId: user.id,
          userName: user.name,
          notificationCount: mockNotifications.filter(n => n.userId === user.id).length,
          unreadCount: mockNotifications.filter(n => n.userId === user.id && !n.read).length
        }))
      }
    });
  }
};

export default notificationService; 