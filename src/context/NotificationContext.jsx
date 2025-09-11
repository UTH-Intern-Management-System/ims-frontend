import React, { createContext, useState, useCallback, useEffect } from 'react';
import {
  Snackbar,
  Alert
} from '@mui/material';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
    action: null,
    persistent: false
  });
  
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Load notifications from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('notifications');
    if (saved) {
      const parsed = JSON.parse(saved);
      setNotifications(parsed);
      setUnreadCount(parsed.filter(n => !n.read).length);
    }
  }, []);

  // Save notifications to localStorage
  const saveNotifications = useCallback((notifs) => {
    localStorage.setItem('notifications', JSON.stringify(notifs));
  }, []);

  const showNotification = useCallback((message, severity = 'success', options = {}) => {
    const id = Date.now() + Math.random();
    
    const newNotification = {
      id,
      message,
      severity,
      timestamp: new Date().toISOString(),
      read: false,
      ...options
    };

    // Add to notifications list
    setNotifications(prev => {
      const updated = [newNotification, ...prev].slice(0, 100); // Keep only 100 notifications
      saveNotifications(updated);
      return updated;
    });
    
    setUnreadCount(prev => prev + 1);

    // Show snackbar
    setNotification({
      open: true,
      message,
      severity,
      action: options.action || null,
      persistent: options.persistent || false
    });

    // Auto-hide if not persistent
    if (!options.persistent) {
      setTimeout(() => {
        setNotification(prev => ({ ...prev, open: false }));
      }, options.duration || 6000);
    }

    return id;
  }, [saveNotifications]);

  const showSuccess = useCallback((message, options) => 
    showNotification(message, 'success', options), [showNotification]);
  
  const showError = useCallback((message, options) => 
    showNotification(message, 'error', options), [showNotification]);
  
  const showWarning = useCallback((message, options) => 
    showNotification(message, 'warning', options), [showNotification]);
  
  const showInfo = useCallback((message, options) => 
    showNotification(message, 'info', options), [showNotification]);

  const clearNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    clearNotification();
  };

  const markAsRead = useCallback((id) => {
    setNotifications(prev => {
      const updated = prev.map(n => 
        n.id === id ? { ...n, read: true } : n
      );
      saveNotifications(updated);
      return updated;
    });
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, [saveNotifications]);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, read: true }));
      saveNotifications(updated);
      return updated;
    });
    setUnreadCount(0);
  }, [saveNotifications]);

  const deleteNotification = useCallback((id) => {
    setNotifications(prev => {
      const updated = prev.filter(n => n.id !== id);
      saveNotifications(updated);
      const wasUnread = prev.find(n => n.id === id && !n.read);
      if (wasUnread) {
        setUnreadCount(count => Math.max(0, count - 1));
      }
      return updated;
    });
  }, [saveNotifications]);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
    saveNotifications([]);
  }, [saveNotifications]);

  return (
    <NotificationContext.Provider value={{
      showNotification,
      showSuccess,
      showError,
      showWarning,
      showInfo,
      clearNotification,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      clearAllNotifications,
      notifications,
      unreadCount
    }}>
      {children}
      
      {/* Snackbar for immediate notifications */}
      <Snackbar
        open={notification.open}
        autoHideDuration={notification.persistent ? null : 6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleClose}
          severity={notification.severity}
          variant="filled"
          sx={{ width: '100%' }}
          action={notification.action}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => React.useContext(NotificationContext);

// Notification types for better organization
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error', 
  WARNING: 'warning',
  INFO: 'info'
};

// Predefined notification templates
export const NOTIFICATION_TEMPLATES = {
  TASK_ASSIGNED: (taskName) => ({
    message: `Bạn được giao nhiệm vụ mới: ${taskName}`,
    severity: NOTIFICATION_TYPES.INFO,
    persistent: false
  }),
  
  TASK_COMPLETED: (taskName) => ({
    message: `Nhiệm vụ "${taskName}" đã hoàn thành`,
    severity: NOTIFICATION_TYPES.SUCCESS,
    persistent: false
  }),
  
  INTERVIEW_SCHEDULED: (candidateName, time) => ({
    message: `Phỏng vấn với ${candidateName} đã được lên lịch lúc ${time}`,
    severity: NOTIFICATION_TYPES.INFO,
    persistent: true
  }),
  
  DEADLINE_APPROACHING: (taskName, deadline) => ({
    message: `Nhiệm vụ "${taskName}" sắp đến hạn: ${deadline}`,
    severity: NOTIFICATION_TYPES.WARNING,
    persistent: true
  }),
  
  SYSTEM_MAINTENANCE: (time) => ({
    message: `Hệ thống sẽ bảo trì lúc ${time}. Vui lòng lưu công việc.`,
    severity: NOTIFICATION_TYPES.WARNING,
    persistent: true
  })
};