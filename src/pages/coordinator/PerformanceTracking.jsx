import React, { useState } from 'react';
import { Box, Typography, Tabs, Tab, Paper } from '@mui/material';
// Chart component removed - using inline chart instead

const PerformanceTracking = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Theo dõi hiệu suất</Typography>
      
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Tổng quan" />
          <Tab label="Chi tiết" />
          <Tab label="Xuất báo cáo" />
        </Tabs>
      </Paper>

      {tabValue === 0 && (
        <Box sx={{ height: 400 }}>
          {/* Chart component removed - placeholder for future implementation */}
        <Box sx={{ p: 3, textAlign: 'center', bgcolor: 'grey.100', borderRadius: 1 }}>
          <Typography variant="h6" color="text.secondary">
            Performance Chart Component
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Chart visualization will be implemented here
          </Typography>
        </Box>
        </Box>
      )}

      {tabValue === 1 && (
        <Typography>Bảng chi tiết hiệu suất sẽ hiển thị tại đây</Typography>
      )}
    </Box>
  );
};

export default PerformanceTracking;