import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import { CalendarMonth, Schedule } from '@mui/icons-material';

const InterviewSchedule = () => {
  const interviews = [
    { id: 1, candidate: 'Nguyễn Văn A', position: 'Frontend Developer', time: '09:00 - 10:00', date: '15/10/2023', status: 'Scheduled' },
    { id: 2, candidate: 'Trần Thị B', position: 'Backend Developer', time: '14:00 - 15:00', date: '16/10/2023', status: 'Scheduled' },
    { id: 3, candidate: 'Lê Văn C', position: 'UI/UX Designer', time: '10:00 - 11:00', date: '17/10/2023', status: 'Pending' }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <CalendarMonth color="primary" sx={{ fontSize: 32 }} />
        <Typography variant="h4">Lịch phỏng vấn</Typography>
      </Box>

      <Grid container spacing={3}>
        {interviews.map((interview) => (
          <Grid item xs={12} md={6} lg={4} key={interview.id}>
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Schedule color="action" />
                <Typography variant="h6">{interview.candidate}</Typography>
              </Box>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                {interview.position}
              </Typography>
              <Typography variant="body2" gutterBottom>
                {interview.date} | {interview.time}
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: interview.status === 'Scheduled' ? 'success.main' : 'warning.main',
                  fontWeight: 'bold'
                }}
              >
                {interview.status}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default InterviewSchedule;