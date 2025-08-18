// src/pages/NotFound.jsx
import { Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div>
    <Typography variant="h4">404 - Not Found</Typography>
    <Button component={Link} to="/" variant="contained">
      Về trang chủ
    </Button>
  </div>
);

export default NotFound;