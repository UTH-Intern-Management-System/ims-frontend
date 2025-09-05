import React from 'react';
import { Grid, Paper, Typography, Box, Card, CardContent } from '@mui/material';
import { 
  TrendingUp, 
  School, 
  CalendarMonth
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const CoordinatorDashboard = () => {
  const quickActions = [
    { 
      title: 'Lịch phỏng vấn', 
      description: 'Quản lý lịch phỏng vấn', 
      icon: <CalendarMonth />, 
      path: '/coordinator/interviews',
      color: 'primary.main'
    },
    { 
      title: 'Theo dõi hiệu suất', 
      description: 'Đánh giá tiến độ thực tập', 
      icon: <TrendingUp />, 
      path: '/coordinator/performance',
      color: 'success.main'
    },
    { 
      title: 'Chương trình đào tạo', 
      description: 'Quản lý khóa học', 
      icon: <School />, 
      path: '/coordinator/training',
      color: 'warning.main'
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Coordinator Dashboard</Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Lên lịch phỏng vấn</Typography>
            <Typography variant="h4" color="primary" sx={{ mt: 1 }}>15</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Active Programs</Typography>
            <Typography variant="h4" color="success.main" sx={{ mt: 1 }}>8</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
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
                  <Box sx={{ color: action.color }}>
                    {action.icon}
                  </Box>
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

export default CoordinatorDashboard;