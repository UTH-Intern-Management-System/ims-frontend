import React, { useState } from 'react';
import { Box, Typography, Button, Paper, List, ListItem, ListItemText, Chip } from '@mui/material';
import useWebSocket from '../../hooks/useWebSocket';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  
  const handleNewMessage = (message) => {
    setNotifications(prev => [message, ...prev]);
  };

  const { sendMessage, isConnected } = useWebSocket(
    'ws://localhost:3001/notifications',
    handleNewMessage
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Notifications Center
      </Typography>
      
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6">
          Connection Status: 
          <Chip 
            label={isConnected ? 'Connected' : 'Disconnected'} 
            color={isConnected ? 'success' : 'error'} 
            sx={{ ml: 2 }}
          />
        </Typography>
        
        <Button
          variant="contained"
          onClick={() => sendMessage({ type: 'ping', content: 'Test' })}
          disabled={!isConnected}
          sx={{ mt: 2 }}
        >
          Send Test Message
        </Button>
      </Paper>

      <Typography variant="h6" gutterBottom>
        Latest Messages ({notifications.length})
      </Typography>
      
      <List>
        {notifications.map((msg, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={msg.content}
              secondary={new Date().toLocaleTimeString()}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default NotificationsPage;