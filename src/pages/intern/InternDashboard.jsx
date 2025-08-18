import React from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid,
  Avatar,
  LinearProgress
} from '@mui/material';
import { Assignment, Schedule, Feedback } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const InternDashboard = () => {
  const progress = 65; // % hoàn thành

  const quickActions = [
    { 
      title: 'Lịch trình', 
      description: 'Xem lịch làm việc', 
      icon: <Schedule />, 
      path: '/intern/schedule',
      color: 'primary.main'
    },
    { 
      title: 'Nhiệm vụ', 
      description: 'Quản lý công việc', 
      icon: <Assignment />, 
      path: '/intern/tasks',
      color: 'success.main'
    },
    { 
      title: 'Phản hồi', 
      description: 'Gửi ý kiến đóng góp', 
      icon: <Feedback />, 
      path: '/intern/feedback',
      color: 'warning.main'
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Bảng điều khiển Thực tập sinh</Typography>
      
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <Assignment />
                </Avatar>
                <div>
                  <Typography variant="h6">5</Typography>
                  <Typography variant="body2">Nhiệm vụ hiện tại</Typography>
                </div>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography gutterBottom>Tiến độ thực tập</Typography>
              <Box display="flex" alignItems="center">
                <Box width="100%" mr={1}>
                  <LinearProgress variant="determinate" value={progress} />
                </Box>
                <Typography>{`${progress}%`}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
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

export default InternDashboard;