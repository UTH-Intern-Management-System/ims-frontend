import React from 'react';
import { Box, AppBar, Toolbar, Typography, Button, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Drawer } from '@mui/material';
import { 
  Home, 
  Assignment, 
  Schedule, 
  TrendingUp, 
  Feedback, 
  Logout 
} from '@mui/icons-material';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const InternLayout = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const drawerWidth = 240;

  const menuItems = [
    { name: 'Dashboard', path: '/intern', icon: <Home /> },
    { name: 'Nhiệm vụ', path: '/intern/tasks', icon: <Assignment /> },
    { name: 'Lịch trình', path: '/intern/schedule', icon: <Schedule /> },
    { name: 'Theo dõi kỹ năng', path: '/intern/skills', icon: <TrendingUp /> },
    { name: 'Feedback', path: '/intern/feedback', icon: <Feedback /> },
  ];

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: 'grey.900',
            color: 'white'
          },
        }}
      >
        <Box sx={{ p: 3, borderBottom: 1, borderColor: 'grey.700' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Intern
          </Typography>
        </Box>
        
        <List sx={{ flex: 1, p: 1 }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  selected={isActive}
                  sx={{
                    borderRadius: 1,
                    '&.Mui-selected': {
                      bgcolor: 'grey.700',
                      '&:hover': {
                        bgcolor: 'grey.700',
                      },
                    },
                    '&:hover': {
                      bgcolor: 'grey.800',
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.name} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        {/* Nút đăng xuất */}
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'grey.700' }}>
          <Button 
            variant="outlined" 
            color="error" 
            fullWidth
            startIcon={<Logout />}
            onClick={logout}
            sx={{ 
              color: 'white', 
              borderColor: 'error.main',
              '&:hover': {
                borderColor: 'error.dark',
                backgroundColor: 'error.dark'
              }
            }}
          >
            Đăng xuất
          </Button>
        </Box>
      </Drawer>

      {/* Content area */}
      <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Header */}
        <AppBar 
          position="static" 
          color="default" 
          elevation={0}
          sx={{ 
            bgcolor: 'background.paper',
            borderBottom: 1,
            borderColor: 'divider'
          }}
        >
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Intern Dashboard
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2">
                Xin chào, {user?.name || 'Intern'}
              </Typography>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Main content */}
        <Box
          component="main"
          sx={{
            flex: 1,
            p: 3,
            overflow: 'auto'
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default InternLayout;
