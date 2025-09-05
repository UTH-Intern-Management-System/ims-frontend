import React, { createContext, useState, useCallback, useEffect } from 'react';
import { 
  Snackbar, 
  Alert, 
  Badge, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon,
  Typography,
  Box,
  Chip,
  Button,
  Divider,
  Avatar
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Close as CloseIcon,
  MarkEmailRead as MarkReadIcon,
  Delete as DeleteIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  CheckCircle as SuccessIcon
} from '@mui/icons-material';
// Note: Install date-fns if not already installed: npm install date-fns

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
  const [drawerOpen, setDrawerOpen] = useState(false);
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
      action: options.action,
      persistent: options.persistent
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

  const handleClose = () => {
    setNotification(prev => ({ ...prev, open: false }));
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
      const notification = prev.find(n => n.id === id);
      const updated = prev.filter(n => n.id !== id);
      saveNotifications(updated);
      
      if (notification && !notification.read) {
        setUnreadCount(count => Math.max(0, count - 1));
      }
      
      return updated;
    });
  }, [saveNotifications]);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
    localStorage.removeItem('notifications');
  }, []);

  const getIcon = (severity) => {
    switch (severity) {
      case 'success': return <SuccessIcon />;
      case 'error': return <ErrorIcon />;
      case 'warning': return <WarningIcon />;
      case 'info': return <InfoIcon />;
      default: return <InfoIcon />;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'success': return 'success';
      case 'error': return 'error';
      case 'warning': return 'warning';
      case 'info': return 'info';
      default: return 'default';
    }
  };

  return (
    <NotificationContext.Provider value={{ 
      showNotification,
      showSuccess,
      showError,
      showWarning,
      showInfo,
      notifications,
      unreadCount,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      clearAllNotifications,
      openDrawer: () => setDrawerOpen(true)
    }}>
      {children}
      
      {/* Notification Bell Icon */}
      <Box sx={{ position: 'fixed', top: 16, right: 80, zIndex: 1300 }}>
        <IconButton 
          color="inherit" 
          onClick={() => setDrawerOpen(true)}
          sx={{ color: 'text.primary' }}
        >
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Box>

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

      {/* Notifications Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 400,
            maxWidth: '90vw'
          }
        }}
      >
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6">Thông báo</Typography>
            <IconButton onClick={() => setDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button 
              size="small" 
              startIcon={<MarkReadIcon />}
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
            >
              Đánh dấu đã đọc
            </Button>
            <Button 
              size="small" 
              startIcon={<DeleteIcon />}
              onClick={clearAllNotifications}
              disabled={notifications.length === 0}
              color="error"
            >
              Xóa tất cả
            </Button>
          </Box>
        </Box>

        <List sx={{ flex: 1, overflow: 'auto' }}>
          {notifications.length === 0 ? (
            <ListItem>
              <ListItemText 
                primary="Không có thông báo nào"
                secondary="Bạn sẽ nhận được thông báo ở đây"
                sx={{ textAlign: 'center' }}
              />
            </ListItem>
          ) : (
            notifications.map((notif, index) => (
              <React.Fragment key={notif.id}>
                <ListItem
                  sx={{
                    bgcolor: notif.read ? 'transparent' : 'action.hover',
                    '&:hover': { bgcolor: 'action.selected' }
                  }}
                >
                  <ListItemIcon>
                    <Avatar 
                      sx={{ 
                        width: 32, 
                        height: 32,
                        bgcolor: `${getSeverityColor(notif.severity)}.main`,
                        color: 'white'
                      }}
                    >
                      {getIcon(notif.severity)}
                    </Avatar>
                  </ListItemIcon>
                  
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: notif.read ? 'normal' : 'bold',
                            flex: 1
                          }}
                        >
                          {notif.message}
                        </Typography>
                        {!notif.read && (
                          <Chip 
                            size="small" 
                            label="Mới" 
                            color="primary" 
                            sx={{ fontSize: '0.7rem', height: 20 }}
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(notif.timestamp).toLocaleString('vi-VN')}
                        </Typography>
                        <Box>
                          {!notif.read && (
                            <IconButton 
                              size="small" 
                              onClick={() => markAsRead(notif.id)}
                              title="Đánh dấu đã đọc"
                            >
                              <MarkReadIcon fontSize="small" />
                            </IconButton>
                          )}
                          <IconButton 
                            size="small" 
                            onClick={() => deleteNotification(notif.id)}
                            title="Xóa thông báo"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
                {index < notifications.length - 1 && <Divider />}
              </React.Fragment>
            ))
          )}
        </List>
      </Drawer>
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