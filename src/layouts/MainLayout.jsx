// src/layouts/MainLayout.jsx
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import { Box } from '@mui/material';

const MainLayout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Header /> {/* Chứa nút toggle theme */}
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {children} {/* Các page sẽ tự động có access đến context */}
      </Box>
    </Box>
  );
};

export default MainLayout;