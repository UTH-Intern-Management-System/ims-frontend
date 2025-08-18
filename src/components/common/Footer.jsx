import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const Footer = () => {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        bgcolor: 'primary.main',
        color: 'primary.contrastText',
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body1" align="center">
          © {new Date().getFullYear()} Intern Management System
        </Typography>
        <Typography
          variant="body2"
          align="center"
          sx={{ mt: 1, opacity: 0.8 }}
        >
          Version 1.0.0
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
