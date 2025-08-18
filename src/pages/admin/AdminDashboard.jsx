import React, { useState, useEffect } from 'react';
import { 
  Grid, 
  Paper, 
  Typography, 
  Box, 
  Card, 
  CardContent,
  Avatar,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar
} from '@mui/material';
import { 
  People, 
  Assignment, 
  School, 
  Campaign,
  TrendingUp,
  Assessment,
  NotificationsActive,
  Security
} from '@mui/icons-material';
import analyticsService from '../../services/analyticsService';

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const result = await analyticsService.getDashboardSummary();
        setAnalytics(result.data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6">Loading dashboard...</Typography>
      </Box>
    );
  }

  if (!analytics) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="error">Failed to load dashboard data</Typography>
      </Box>
    );
  }

  const { system, internPerformance, tasks, recruitment, training } = analytics;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Admin Dashboard - System Overview
      </Typography>
      
      {/* System Health Status */}
      <Paper sx={{ p: 3, mb: 3, bgcolor: 'success.light', color: 'white' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Security sx={{ fontSize: 32 }} />
          <Box>
            <Typography variant="h5">System Status: {system.systemHealth.status}</Typography>
            <Typography variant="body1">
              Uptime: {system.systemHealth.uptime} | Last Backup: {system.systemHealth.lastBackup}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <People />
                </Avatar>
                <Box>
                  <Typography variant="h4">{system.totalUsers}</Typography>
                  <Typography variant="body2" color="textSecondary">Total Users</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <Assignment />
                </Avatar>
                <Box>
                  <Typography variant="h4">{tasks.totalTasks}</Typography>
                  <Typography variant="body2" color="textSecondary">Active Tasks</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'warning.main' }}>
                  <School />
                </Avatar>
                <Box>
                  <Typography variant="h4">{training.totalPrograms}</Typography>
                  <Typography variant="body2" color="textSecondary">Training Programs</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'info.main' }}>
                  <Campaign />
                </Avatar>
                <Box>
                  <Typography variant="h4">{recruitment.totalCampaigns}</Typography>
                  <Typography variant="body2" color="textSecondary">Recruitment Campaigns</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Detailed Analytics */}
      <Grid container spacing={3}>
        {/* User Distribution */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              User Distribution by Role
            </Typography>
            <List>
              {Object.entries(system.roleDistribution).map(([role, count]) => (
                <ListItem key={role}>
                  <ListItemAvatar>
                    <Avatar sx={{ 
                      bgcolor: role === 'ADMIN' ? 'error.main' : 
                              role === 'HR' ? 'primary.main' :
                              role === 'MENTOR' ? 'warning.main' :
                              role === 'INTERN' ? 'success.main' : 'grey.main'
                    }}>
                      {role.charAt(0)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary={role} 
                    secondary={`${count} users`}
                  />
                  <Chip 
                    label={`${((count / system.totalUsers) * 100).toFixed(1)}%`}
                    size="small"
                    color="primary"
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Department Distribution */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Department Distribution
            </Typography>
            <List>
              {Object.entries(system.departmentDistribution).map(([dept, count]) => (
                <ListItem key={dept}>
                  <ListItemText 
                    primary={dept} 
                    secondary={`${count} users`}
                  />
                  <LinearProgress 
                    variant="determinate" 
                    value={(count / system.totalUsers) * 100}
                    sx={{ width: 100, mr: 2 }}
                  />
                  <Typography variant="body2" color="textSecondary">
                    {((count / system.totalUsers) * 100).toFixed(1)}%
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Task Performance */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Task Performance Overview
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" gutterBottom>
                Completion Rate: {tasks.completionRate}
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={parseFloat(tasks.completionRate)}
                sx={{ height: 10, borderRadius: 5 }}
              />
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="h6" color="success.main">{tasks.completedTasks}</Typography>
                <Typography variant="body2">Completed</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6" color="warning.main">{tasks.inProgressTasks}</Typography>
                <Typography variant="body2">In Progress</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6" color="info.main">{tasks.pendingTasks}</Typography>
                <Typography variant="body2">Pending</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6" color="error.main">{tasks.overdueTasks}</Typography>
                <Typography variant="body2">Overdue</Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Training Programs */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Training Programs Status
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" gutterBottom>
                Overall Enrollment Rate: {training.overallEnrollmentRate}%
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={parseFloat(training.overallEnrollmentRate)}
                sx={{ height: 10, borderRadius: 5 }}
              />
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="h6" color="success.main">{training.activePrograms}</Typography>
                <Typography variant="body2">Active Programs</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6" color="primary.main">{training.totalEnrolled}</Typography>
                <Typography variant="body2">Total Enrolled</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6" color="info.main">{training.totalCapacity}</Typography>
                <Typography variant="body2">Total Capacity</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6" color="warning.main">{training.averageModulesPerProgram}</Typography>
                <Typography variant="body2">Avg Modules</Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent System Activity
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" color="primary" gutterBottom>
                  <TrendingUp sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Performance Updates
                </Typography>
                <Typography variant="body2">
                  {internPerformance.totalInterns} interns assessed this quarter
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" color="success" gutterBottom>
                  <Assessment sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Training Progress
                </Typography>
                <Typography variant="body2">
                  {training.totalEnrolled} participants in active programs
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" color="warning" gutterBottom>
                  <NotificationsActive sx={{ mr: 1, verticalAlign: 'middle' }} />
                  System Alerts
                </Typography>
                <Typography variant="body2">
                  {tasks.overdueTasks} tasks require attention
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;