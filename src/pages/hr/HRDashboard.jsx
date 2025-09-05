import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import { People, Assignment, EventNote, TrendingUp, FileDownload, Refresh } from '@mui/icons-material';
import {
  DonutChart,
  HorizontalBarChart,
  MultiLineChart,
  StackedAreaChart,
  DepartmentTreemap,
  ChartContainer
} from '../../components/charts/AdvancedCharts';

const HRDashboard = () => {
  // Dữ liệu mẫu
  const stats = [
    { label: 'Tổng thực tập sinh', value: 120, icon: <People fontSize="large" color="primary" /> },
    { label: 'Vị trí đang tuyển', value: 8, icon: <Assignment fontSize="large" color="secondary" /> },
    { label: 'Lịch phỏng vấn', value: 15, icon: <EventNote fontSize="large" color="success" /> },
    { label: 'Tỉ lệ giữ chân (%)', value: 85, icon: <TrendingUp fontSize="large" color="warning" /> }
  ];

  // Advanced chart data
  const applicationStatusData = [
    { name: 'Đã nhận', value: 80 },
    { name: 'Đang xét duyệt', value: 30 },
    { name: 'Từ chối', value: 10 },
    { name: 'Chờ phỏng vấn', value: 25 }
  ];

  const monthlyTrendData = [
    { name: 'Jan', applications: 45, hired: 12, interviews: 25 },
    { name: 'Feb', applications: 52, hired: 15, interviews: 28 },
    { name: 'Mar', applications: 38, hired: 10, interviews: 20 },
    { name: 'Apr', applications: 61, hired: 18, interviews: 35 },
    { name: 'May', applications: 55, hired: 16, interviews: 30 },
    { name: 'Jun', applications: 48, hired: 14, interviews: 26 }
  ];

  const departmentData = [
    { name: 'Engineering', interns: 45, applications: 120 },
    { name: 'Marketing', interns: 25, applications: 80 },
    { name: 'Design', interns: 15, applications: 45 },
    { name: 'Sales', interns: 20, applications: 60 },
    { name: 'HR', interns: 10, applications: 30 },
    { name: 'Finance', interns: 5, applications: 15 }
  ];

  const skillsStackData = [
    { name: 'Q1', technical: 30, soft: 25, leadership: 15 },
    { name: 'Q2', technical: 35, soft: 30, leadership: 18 },
    { name: 'Q3', technical: 40, soft: 35, leadership: 22 },
    { name: 'Q4', technical: 45, soft: 40, leadership: 25 }
  ];

  const departmentTreeData = [
    { name: 'Engineering', size: 45, children: [
      { name: 'Frontend', size: 20 },
      { name: 'Backend', size: 15 },
      { name: 'DevOps', size: 10 }
    ]},
    { name: 'Marketing', size: 25, children: [
      { name: 'Digital', size: 15 },
      { name: 'Content', size: 10 }
    ]},
    { name: 'Design', size: 15 },
    { name: 'Sales', size: 20 },
    { name: 'HR', size: 10 },
    { name: 'Finance', size: 5 }
  ];

  const multiLineData = [
    { name: 'Jan', recruitment: 45, retention: 85, satisfaction: 78 },
    { name: 'Feb', recruitment: 52, retention: 87, satisfaction: 82 },
    { name: 'Mar', recruitment: 38, retention: 83, satisfaction: 75 },
    { name: 'Apr', recruitment: 61, retention: 89, satisfaction: 85 },
    { name: 'May', recruitment: 55, retention: 91, satisfaction: 88 },
    { name: 'Jun', recruitment: 48, retention: 88, satisfaction: 86 }
  ];

  const handleExportData = () => {
    // Mock export functionality
    console.log('Exporting HR data...');
  };

  const handleRefreshData = () => {
    // Mock refresh functionality
    console.log('Refreshing HR data...');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          HR Analytics Dashboard
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={handleRefreshData}
          >
            Làm mới
          </Button>
          <Button
            variant="contained"
            startIcon={<FileDownload />}
            onClick={handleExportData}
          >
            Xuất báo cáo
          </Button>
        </Box>
      </Box>

      {/* Thống kê nhanh */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {item.icon}
                <Box>
                  <Typography variant="h4" color="primary">{item.value}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {item.label}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Advanced Charts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Application Status Donut Chart */}
        <Grid item xs={12} md={6}>
          <ChartContainer 
            title="Trạng thái đơn ứng tuyển"
            action={
              <Button size="small" variant="outlined">
                Chi tiết
              </Button>
            }
          >
            <DonutChart data={applicationStatusData} height={300} />
          </ChartContainer>
        </Grid>

        {/* Department Distribution */}
        <Grid item xs={12} md={6}>
          <ChartContainer title="Phân bố theo phòng ban">
            <HorizontalBarChart 
              data={departmentData.map(d => ({ name: d.name, value: d.interns }))} 
              height={300} 
            />
          </ChartContainer>
        </Grid>

        {/* Monthly Trends */}
        <Grid item xs={12}>
          <ChartContainer 
            title="Xu hướng tuyển dụng theo tháng"
            action={
              <Button size="small" variant="outlined">
                Xem thêm
              </Button>
            }
          >
            <MultiLineChart 
              data={monthlyTrendData}
              lines={[
                { dataKey: 'applications', name: 'Đơn ứng tuyển' },
                { dataKey: 'hired', name: 'Được tuyển' },
                { dataKey: 'interviews', name: 'Phỏng vấn' }
              ]}
              height={350}
            />
          </ChartContainer>
        </Grid>

        {/* Skills Development Stack */}
        <Grid item xs={12} md={6}>
          <ChartContainer title="Phát triển kỹ năng theo quý">
            <StackedAreaChart 
              data={skillsStackData}
              areas={[
                { dataKey: 'technical', name: 'Kỹ năng kỹ thuật' },
                { dataKey: 'soft', name: 'Kỹ năng mềm' },
                { dataKey: 'leadership', name: 'Lãnh đạo' }
              ]}
              height={300}
            />
          </ChartContainer>
        </Grid>

        {/* Department Treemap */}
        <Grid item xs={12} md={6}>
          <ChartContainer title="Cơ cấu tổ chức">
            <DepartmentTreemap data={departmentTreeData} height={300} />
          </ChartContainer>
        </Grid>

        {/* Performance Metrics */}
        <Grid item xs={12}>
          <ChartContainer 
            title="Chỉ số hiệu suất HR"
            action={
              <Button size="small" variant="outlined">
                Báo cáo chi tiết
              </Button>
            }
          >
            <MultiLineChart 
              data={multiLineData}
              lines={[
                { dataKey: 'recruitment', name: 'Tuyển dụng' },
                { dataKey: 'retention', name: 'Giữ chân (%)' },
                { dataKey: 'satisfaction', name: 'Hài lòng (%)' }
              ]}
              height={350}
            />
          </ChartContainer>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HRDashboard;
