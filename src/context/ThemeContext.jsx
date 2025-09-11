import React, { createContext, useState, useMemo, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

export const ThemeContext = createContext();

export const ThemeContextProvider = ({ children }) => {
  // Initialize theme from localStorage or default to 'light'
  const [mode, setMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme-mode');
    return savedTheme || 'light';
  });

  // Save theme to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('theme-mode', mode);
  }, [mode]);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  // Function to set theme mode programmatically (for SystemConfig)
  const setThemeMode = (newMode) => {
    if (newMode === 'auto') {
      // Auto mode: detect system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setMode(prefersDark ? 'dark' : 'light');
    } else {
      setMode(newMode);
    }
  };

  const theme = useMemo(() => {
    return createTheme({
      palette: {
        mode,
        ...(mode === 'light'
          ? {
              // Light theme colors
              primary: {
                main: '#1976d2',
                light: '#42a5f5',
                dark: '#1565c0',
              },
              secondary: {
                main: '#dc004e',
                light: '#ff5983',
                dark: '#9a0036',
              },
              background: {
                default: '#fafafa',
                paper: '#ffffff',
              },
              text: {
                primary: '#212121',
                secondary: '#757575',
              },
            }
          : {
              // Dark theme colors
              primary: {
                main: '#90caf9',
                light: '#e3f2fd',
                dark: '#42a5f5',
              },
              secondary: {
                main: '#f48fb1',
                light: '#fce4ec',
                dark: '#e91e63',
              },
              background: {
                default: '#000000',
                paper: '#000000',
              },
              text: {
                primary: '#ffffff',
                secondary: '#e0e0e0',
              },
            }),
      },
      components: {
        // AppBar
        MuiAppBar: {
          styleOverrides: {
            root: {
              backgroundColor: mode === 'dark' ? '#000000' : '#1976d2',
              color: mode === 'dark' ? '#ffffff' : '#ffffff',
            },
          },
        },
        // Drawer
        MuiDrawer: {
          styleOverrides: {
            paper: {
              backgroundColor: mode === 'dark' ? '#000000' : '#ffffff',
              borderRight: mode === 'dark' ? '1px solid #333' : '1px solid #e0e0e0',
            },
          },
        },
        // Paper
        MuiPaper: {
          styleOverrides: {
            root: {
              backgroundColor: mode === 'dark' ? '#000000' : '#ffffff',
              backgroundImage: 'none',
            },
          },
        },
        // Card
        MuiCard: {
          styleOverrides: {
            root: {
              backgroundColor: mode === 'dark' ? '#000000' : '#ffffff',
              border: mode === 'dark' ? '1px solid #333' : '1px solid #e0e0e0',
            },
          },
        },
        // TextField
        MuiTextField: {
          styleOverrides: {
            root: {
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: mode === 'dark' ? '#555' : '#e0e0e0',
                },
                '&:hover fieldset': {
                  borderColor: mode === 'dark' ? '#777' : '#b0b0b0',
                },
                '&.Mui-focused fieldset': {
                  borderColor: mode === 'dark' ? '#90caf9' : '#1976d2',
                },
              },
            },
          },
        },
        // Button
        MuiButton: {
          styleOverrides: {
            root: {
              textTransform: 'none',
            },
            outlined: {
              borderColor: mode === 'dark' ? '#555' : '#e0e0e0',
              color: mode === 'dark' ? '#ffffff' : '#1976d2',
              '&:hover': {
                borderColor: mode === 'dark' ? '#777' : '#1976d2',
                backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.04)' : 'rgba(25, 118, 210, 0.04)',
              },
            },
          },
        },
        // Table
        MuiTableHead: {
          styleOverrides: {
            root: {
              backgroundColor: mode === 'dark' ? '#2a2a2a' : '#f5f5f5',
            },
          },
        },
        MuiTableRow: {
          styleOverrides: {
            root: {
              '&:nth-of-type(odd)': {
                backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)',
              },
              '&:hover': {
                backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)',
              },
            },
          },
        },
        // List
        MuiListItem: {
          styleOverrides: {
            root: {
              '&:hover': {
                backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)',
              },
            },
          },
        },
        // Chip
        MuiChip: {
          styleOverrides: {
            root: {
              backgroundColor: mode === 'dark' ? '#333' : '#e0e0e0',
              color: mode === 'dark' ? '#ffffff' : '#000000',
            },
          },
        },
        // Dialog
        MuiDialog: {
          styleOverrides: {
            paper: {
              backgroundColor: mode === 'dark' ? '#000000' : '#ffffff',
            },
          },
        },
        // Menu
        MuiMenu: {
          styleOverrides: {
            paper: {
              backgroundColor: mode === 'dark' ? '#000000' : '#ffffff',
              border: mode === 'dark' ? '1px solid #333' : '1px solid #e0e0e0',
            },
          },
        },
        // Tooltip
        MuiTooltip: {
          styleOverrides: {
            tooltip: {
              backgroundColor: mode === 'dark' ? '#333' : '#616161',
              color: '#ffffff',
            },
          },
        },
      },
      typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
          fontWeight: 500,
        },
        h2: {
          fontWeight: 500,
        },
        h3: {
          fontWeight: 500,
        },
        h4: {
          fontWeight: 500,
        },
        h5: {
          fontWeight: 500,
        },
        h6: {
          fontWeight: 500,
        },
      },
      shape: {
        borderRadius: 8,
      },
      // Custom scrollbar styles
      ...(mode === 'dark' && {
        components: {
          ...createTheme().components,
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                scrollbarColor: '#555 #000000',
                '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
                  backgroundColor: '#000000',
                  width: '8px',
                },
                '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
                  borderRadius: 8,
                  backgroundColor: '#555',
                  minHeight: 24,
                  border: '2px solid #000000',
                },
                '&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus': {
                  backgroundColor: '#777',
                },
                '&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active': {
                  backgroundColor: '#777',
                },
                '&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover': {
                  backgroundColor: '#777',
                },
                '&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner': {
                  backgroundColor: '#000000',
                },
              },
            },
          },
        },
      }),
    });
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ toggleTheme, mode, setThemeMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => React.useContext(ThemeContext);