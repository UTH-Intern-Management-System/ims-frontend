import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import webSocketService from '../services/webSocketService';
import crossModuleService from '../services/crossModuleService';
import eventBus, { EVENT_TYPES } from '../services/eventBus';

// Custom hook for real-time notifications
export const useRealTimeNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [unreadCount, setUnreadCount] = useState(0);

  // Initialize WebSocket connection
  useEffect(() => {
    if (user) {
      initializeConnection();
    }

    return () => {
      webSocketService.disconnect();
    };
  }, [user]);

  const initializeConnection = async () => {
    try {
      setConnectionStatus('connecting');
      await webSocketService.connect(user.id, user.role);
      setIsConnected(true);
      setConnectionStatus('connected');
      
      // Load existing notifications for user role
      loadNotifications();
      
    } catch (error) {
      console.error('Failed to connect to WebSocket:', error);
      setConnectionStatus('error');
    }
  };

  // Load notifications for current user role
  const loadNotifications = useCallback(() => {
    if (user) {
      const roleNotifications = crossModuleService.getNotificationsForRole(user.role);
      setNotifications(roleNotifications);
      setUnreadCount(roleNotifications.filter(n => !n.read).length);
    }
  }, [user]);

  // Set up WebSocket event listeners
  useEffect(() => {
    // Listen for incoming notifications
    const unsubscribeNotification = webSocketService.on('notification', (notification) => {
      // Check if notification is for current user role
      if (notification.targetRoles.includes(user.role) || notification.targetRoles.includes('ALL')) {
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);
        
        // Show browser notification if supported
        showBrowserNotification(notification);
      }
    });

    // Listen for connection status changes
    const unsubscribeConnection = webSocketService.on('connection', () => {
      setIsConnected(true);
      setConnectionStatus('connected');
    });

    const unsubscribeDisconnect = webSocketService.on('disconnect', () => {
      setIsConnected(false);
      setConnectionStatus('disconnected');
    });

    const unsubscribeConnectionLost = webSocketService.on('connection_lost', () => {
      setIsConnected(false);
      setConnectionStatus('reconnecting');
    });

    const unsubscribeReconnected = webSocketService.on('reconnected', () => {
      setIsConnected(true);
      setConnectionStatus('connected');
      loadNotifications(); // Reload notifications after reconnection
    });

    // Listen for cross-module events
    const unsubscribeEvents = eventBus.on(EVENT_TYPES.NOTIFICATION_CREATED, (notification) => {
      // Simulate real-time delivery via WebSocket
      setTimeout(() => {
        webSocketService.simulateIncomingNotification(notification);
      }, 100);
    });

    return () => {
      unsubscribeNotification();
      unsubscribeConnection();
      unsubscribeDisconnect();
      unsubscribeConnectionLost();
      unsubscribeReconnected();
      unsubscribeEvents();
    };
  }, [user, loadNotifications]);

  // Show browser notification
  const showBrowserNotification = (notification) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        tag: notification.id
      });
    }
  };

  // Request notification permission
  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return Notification.permission === 'granted';
  };

  // Mark notification as read
  const markAsRead = useCallback((notificationId) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
    
    // Update in cross-module service
    crossModuleService.markNotificationAsRead(notificationId);
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
    setUnreadCount(0);
    
    // Update all in cross-module service
    notifications.forEach(n => {
      if (!n.read) {
        crossModuleService.markNotificationAsRead(n.id);
      }
    });
  }, [notifications]);

  // Clear all notifications
  const clearAll = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  // Simulate receiving a test notification
  const simulateNotification = useCallback((type = 'info') => {
    const testNotification = {
      id: `test_${Date.now()}`,
      type,
      title: 'Thông báo thử nghiệm',
      message: 'Đây là thông báo thử nghiệm real-time',
      targetRoles: [user.role],
      createdAt: new Date().toISOString(),
      read: false
    };
    
    webSocketService.simulateIncomingNotification(testNotification);
  }, [user]);

  return {
    notifications,
    isConnected,
    connectionStatus,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearAll,
    simulateNotification,
    requestNotificationPermission,
    reconnect: initializeConnection
  };
};
