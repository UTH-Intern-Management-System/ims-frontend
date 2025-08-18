import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Divider } from '@mui/material';
import { People, Assignment, EventNote, TrendingUp } from '@mui/icons-material';
// Nếu có biểu đồ, import thêm
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const HRDashboard = () => {
  // Dữ liệu mẫu
  const stats = [
    { label: 'Tổng thực tập sinh', value: 120, icon: <People fontSize="large" color="primary" /> },
    { label: 'Vị trí đang tuyển', value: 8, icon: <Assignment fontSize="large" color="secondary" /> },
    { label: 'Lịch phỏng vấn', value: 15, icon: <EventNote fontSize="large" color="success" /> },
    // { label: 'Tỉ lệ giữ chân (%)', value: 85, icon: <TrendingUp fontSize="large" color="warning" /> }
  ];

  const pieData = [
    { name: 'Đã nhận', value: 80 },
    { name: 'Đang xét duyệt', value: 30 },
    { name: 'Từ chối', value: 10 }
  ];
  const COLORS = ['#4caf50', '#ff9800', '#f44336'];

  const barData = [
    { month: 'Jan', interns: 20 },
    { month: 'Feb', interns: 25 },
    { month: 'Mar', interns: 30 },
    { month: 'Apr', interns: 28 },
    { month: 'May', interns: 35 }
  ];

  return (
    <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          HR Dashboard
        </Typography>

        {/* Thống kê nhanh */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {stats.map((item, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card>
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {item.icon}
                  <Box>
                    <Typography variant="h6">{item.value}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {item.label}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Biểu đồ */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Trạng thái ứng viên
                </Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Số lượng thực tập sinh theo tháng
                </Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={barData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="interns" fill="#2196f3" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
    </Box>
  );
};

export default HRDashboard;
