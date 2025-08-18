import React from 'react';
import { Box, Grid, Card, CardContent, Typography, Avatar, Stack, Button } from '@mui/material';
import { Assignment, People, Schedule, Message, Assessment } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const MentorDashboard = () => {
  const stats = [
    { value: 5, label: 'Thực tập sinh', icon: <People fontSize="large" /> },
    { value: 12, label: 'Nhiệm vụ', icon: <Assignment fontSize="large" /> },
    { value: 3, label: 'Cuộc họp', icon: <Schedule fontSize="large" /> }
  ];

  const quickActions = [
    { 
      title: 'Giao tiếp', 
      description: 'Chat với thực tập sinh', 
      icon: <Message />, 
      path: '/mentor/communication',
      color: 'primary.main'
    },
    { 
      title: 'Đánh giá kỹ năng', 
      description: 'Đánh giá tiến độ học tập', 
      icon: <Assessment />, 
      path: '/mentor/assessment',
      color: 'success.main'
    },
    { 
      title: 'Theo dõi tiến độ', 
      description: 'Xem báo cáo hàng ngày', 
      icon: <Schedule />, 
      path: '/mentor/progress',
      color: 'warning.main'
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Bảng điều khiển Mentor</Typography>
      
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    {stat.icon}
                  </Avatar>
                  <div>
                    <Typography variant="h5">{stat.value}</Typography>
                    <Typography variant="body2">{stat.label}</Typography>
                  </div>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
        Thao tác nhanh
      </Typography>

      <Grid container spacing={3}>
        {quickActions.map((action, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card 
              sx={{ 
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 3
                }
              }}
              component={Link}
              to={action.path}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar sx={{ bgcolor: action.color }}>
                    {action.icon}
                  </Avatar>
                  <Typography variant="h6">{action.title}</Typography>
                </Box>
                <Typography variant="body2" color="textSecondary">
                  {action.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MentorDashboard;