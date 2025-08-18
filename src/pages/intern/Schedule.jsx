import React from 'react';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';

const Schedule = () => {
  const events = [
    { id: 1, title: 'Meeting với mentor', time: '09:00 - 10:00', date: '15/10/2023' },
    { id: 2, title: 'Training React Hooks', time: '14:00 - 16:00', date: '16/10/2023' }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Lịch trình</Typography>
      
      <List>
        {events.map((event) => (
          <ListItem key={event.id}>
            <ListItemText
              primary={event.title}
              secondary={`${event.date} | ${event.time}`}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Schedule;