import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useAuth } from '../../context/AuthContext';

const ProfilePage = () => {
  const { user, logout, isHR } = useAuth();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Welcome, {user?.name || 'User'}
      </Typography>
      
      {isHR && (
        <Button 
          variant="contained" 
          sx={{ mr: 2 }}
          onClick={() => window.location.href = '/hr'}
        >
          HR Dashboard
        </Button>
      )}
      
      <Button 
        variant="outlined" 
        color="error"
        onClick={logout}
      >
        Logout
      </Button>
    </Box>
  );
};

export default ProfilePage;