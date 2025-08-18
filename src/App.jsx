// src/App.jsx
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { ThemeContextProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';
import { Toaster } from 'react-hot-toast';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

function App() {
  return (
    <ThemeContextProvider>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <NotificationProvider>
          <AuthProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </AuthProvider>
        </NotificationProvider>
      </LocalizationProvider>
      <Toaster position="top-right" />
    </ThemeContextProvider>
  );
}

export default App;
