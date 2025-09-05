import React, { useState } from 'react';
import {
  Box,
  Badge,
  IconButton,
  Popover,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Chip,
  Button,
  Divider,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  CheckCircle as SuccessIcon,
  Wifi as ConnectedIcon,
  WifiOff as DisconnectedIcon,
  Refresh as RefreshIcon,
  Clear as ClearIcon,
  DoneAll as DoneAllIcon
} from '@mui/icons-material';
import { useRealTimeNotifications } from '../../hooks/useRealTimeNotifications';

const RealTimeNotificationPanel = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const {
    notifications,
    isConnected,
    connectionStatus,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearAll,
    simulateNotification,
    requestNotificationPermission,
    reconnect
  } = useRealTimeNotifications();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success': return <SuccessIcon color="success" />;
      case 'warning': return <WarningIcon color="warning" />;
      case 'error': return <ErrorIcon color="error" />;
      default: return <InfoIcon color="info" />;
    }
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'success';
      case 'connecting': case 'reconnecting': return 'warning';
      case 'disconnected': case 'error': return 'error';
      default: return 'default';
    }
  };

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return 'Đã kết nối';
      case 'connecting': return 'Đang kết nối...';
      case 'reconnecting': return 'Đang kết nối lại...';
      case 'disconnected': return 'Mất kết nối';
      case 'error': return 'Lỗi kết nối';
      default: return 'Không xác định';
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Vừa xong';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} phút trước`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} giờ trước`;
    return date.toLocaleDateString('vi-VN');
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleClick}
        sx={{ ml: 1 }}
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: { width: 400, maxHeight: 600 }
        }}
      >
        <Box sx={{ p: 2 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Thông báo Real-time
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                icon={isConnected ? <ConnectedIcon /> : <DisconnectedIcon />}
                label={getConnectionStatusText()}
                color={getConnectionStatusColor()}
                size="small"
              />
              {connectionStatus === 'connecting' || connectionStatus === 'reconnecting' ? (
                <CircularProgress size={16} />
              ) : null}
            </Box>
          </Box>

          {/* Connection Status Alert */}
          {!isConnected && (
            <Alert 
              severity="warning" 
              sx={{ mb: 2 }}
              action={
                <Button size="small" onClick={reconnect} startIcon={<RefreshIcon />}>
                  Kết nối lại
                </Button>
              }
            >
              Mất kết nối real-time. Một số thông báo có thể bị trễ.
            </Alert>
          )}

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Button
              size="small"
              startIcon={<DoneAllIcon />}
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
            >
              Đánh dấu tất cả
            </Button>
            <Button
              size="small"
              startIcon={<ClearIcon />}
              onClick={clearAll}
              disabled={notifications.length === 0}
            >
              Xóa tất cả
            </Button>
            <Button
              size="small"
              onClick={() => simulateNotification('info')}
              variant="outlined"
            >
              Test
            </Button>
          </Box>

          <Divider />

          {/* Notifications List */}
          <List sx={{ maxHeight: 400, overflow: 'auto' }}>
            {notifications.length === 0 ? (
              <ListItem>
                <ListItemText
                  primary="Không có thông báo"
                  secondary="Bạn sẽ nhận được thông báo real-time tại đây"
                  sx={{ textAlign: 'center' }}
                />
              </ListItem>
            ) : (
              notifications.map((notification) => (
                <ListItem
                  key={notification.id}
                  button
                  onClick={() => handleNotificationClick(notification)}
                  sx={{
                    backgroundColor: notification.read ? 'transparent' : 'action.hover',
                    borderLeft: notification.read ? 'none' : '4px solid',
                    borderLeftColor: notification.type === 'error' ? 'error.main' :
                                   notification.type === 'warning' ? 'warning.main' :
                                   notification.type === 'success' ? 'success.main' : 'info.main'
                  }}
                >
                  <ListItemIcon>
                    {getNotificationIcon(notification.type)}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: notification.read ? 'normal' : 'bold',
                            flex: 1
                          }}
                        >
                          {notification.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatTime(notification.createdAt)}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}
                        >
                          {notification.message}
                        </Typography>
                        {notification.source === 'websocket' && (
                          <Chip
                            label="Real-time"
                            size="small"
                            color="primary"
                            variant="outlined"
                            sx={{ mt: 1, fontSize: '0.7rem', height: 20 }}
                          />
                        )}
                      </Box>
                    }
                  />
                </ListItem>
              ))
            )}
          </List>

          {/* Browser Notification Permission */}
          {'Notification' in window && Notification.permission === 'default' && (
            <Box sx={{ mt: 2 }}>
              <Alert severity="info">
                <Button
                  size="small"
                  onClick={requestNotificationPermission}
                  sx={{ mt: 1 }}
                >
                  Cho phép thông báo trình duyệt
                </Button>
              </Alert>
            </Box>
          )}
        </Box>
      </Popover>
    </>
  );
};

export default RealTimeNotificationPanel;
