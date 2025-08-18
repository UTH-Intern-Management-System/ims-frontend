import React, { createContext, useState, useMemo } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import baseTheme from '../styles/theme';

export const ThemeContext = createContext();

export const ThemeContextProvider = ({ children }) => {
  const [mode, setMode] = useState('light');

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const theme = useMemo(
    () => ({
      ...baseTheme,
      palette: {
        ...baseTheme.palette,
        mode,
        ...(mode === 'light'
          ? {
              // Light theme colors
              primary: { main: '#1976d2' },
              secondary: { main: '#dc004e' },
            }
          : {
              // Dark theme colors
              primary: { main: '#90caf9' },
              secondary: { main: '#f48fb1' },
              background: { default: '#121212', paper: '#1e1e1e' },
            }),
      },
    }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={{ toggleTheme, mode }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => React.useContext(ThemeContext);