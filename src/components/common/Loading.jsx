// src/components/common/Loading.jsx
import { CircularProgress, Box } from '@mui/material';

const Loading = ({ fullHeight = false }) => (
  <Box 
    display="flex" 
    justifyContent="center" 
    alignItems="center"
    sx={{ 
      height: fullHeight ? '100vh' : '100%',
      width: '100%'
    }}
  >
    <CircularProgress />
  </Box>
);

export default Loading;