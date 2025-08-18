import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  IconButton,
  Tooltip,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Alert,
  Snackbar
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  Assessment as AssessmentIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
  CalendarToday as CalendarIcon,
  Business as BusinessIcon,
  Engineering as EngineeringIcon,
  Science as ScienceIcon,
  Palette as ArtIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon
} from '@mui/icons-material';
// Chart components removed - using inline charts instead

const Reports = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [timeRange, setTimeRange] = useState('month');
  const [department, setDepartment] = useState('all');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Enhanced mock data for reports and analytics
  const mockReportData = {
    overview: {
      totalInterns: 156,
      activeInterns: 89,
      completedInterns: 45,
      pendingInterns: 22,
      conversionRate: 78.5,
      averageRating: 4.2,
      totalDepartments: 6,
      totalMentors: 23
    },
    departmentStats: [
      {
        name: 'Engineering',
        total: 45,
        active: 28,
        completed: 12,
        pending: 5,
        averageRating: 4.4,
        conversionRate: 82.2,
        icon: <EngineeringIcon />
      },
      {
        name: 'Business',
        total: 32,
        active: 18,
        completed: 10,
        pending: 4,
        averageRating: 4.1,
        conversionRate: 75.0,
        icon: <BusinessIcon />
      },
      {
        name: 'Data Science',
        total: 28,
        active: 15,
        completed: 8,
        pending: 5,
        averageRating: 4.3,
        conversionRate: 79.3,
        icon: <ScienceIcon />
      },
      {
        name: 'Design',
        total: 25,
        active: 16,
        completed: 6,
        pending: 3,
        averageRating: 4.0,
        conversionRate: 73.3,
        icon: <ArtIcon />
      },
      {
        name: 'IT',
        total: 18,
        active: 8,
        completed: 7,
        pending: 3,
        averageRating: 4.2,
        conversionRate: 77.8,
        icon: <EngineeringIcon />
      },
      {
        name: 'International Business',
        total: 8,
        active: 4,
        completed: 2,
        pending: 2,
        averageRating: 4.5,
        conversionRate: 85.7,
        icon: <BusinessIcon />
      }
    ],
    monthlyTrends: [
      { month: 'T1', applications: 45, acceptances: 38, completions: 12 },
      { month: 'T2', applications: 52, acceptances: 44, completions: 15 },
      { month: 'T3', applications: 48, acceptances: 41, completions: 18 },
      { month: 'T4', applications: 61, acceptances: 52, completions: 22 },
      { month: 'T5', applications: 55, acceptances: 47, completions: 19 },
      { month: 'T6', applications: 58, acceptances: 49, completions: 21 },
      { month: 'T7', applications: 62, acceptances: 53, completions: 25 },
      { month: 'T8', applications: 59, acceptances: 50, completions: 23 },
      { month: 'T9', applications: 65, acceptances: 56, completions: 28 },
      { month: 'T10', applications: 58, acceptances: 49, completions: 24 },
      { month: 'T11', applications: 52, acceptances: 44, completions: 20 },
      { month: 'T12', applications: 48, acceptances: 41, completions: 18 }
    ],
    topPerformers: [
      {
        name: 'Nguyễn Văn An',
        department: 'Engineering',
        rating: 4.9,
        skills: ['JavaScript', 'React', 'Node.js'],
        mentor: 'Trần Thị Bình',
        status: 'completed',
        notes: 'Thực tập sinh xuất sắc, được đề xuất tuyển dụng'
      },
      {
        name: 'Trần Thị Bình',
        department: 'Business',
        rating: 4.8,
        skills: ['Market Research', 'Data Analysis', 'Excel'],
        mentor: 'Lê Văn Cường',
        status: 'active',
        notes: 'Có khả năng lãnh đạo tốt, phù hợp với vị trí quản lý'
      },
      {
        name: 'Lê Văn Cường',
        department: 'Data Science',
        rating: 4.7,
        skills: ['Python', 'Machine Learning', 'Statistics'],
        mentor: 'Phạm Thị Dung',
        status: 'active',
        notes: 'Kiến thức chuyên môn vững, có thể tham gia dự án thực tế'
      },
      {
        name: 'Phạm Thị Dung',
        department: 'Design',
        rating: 4.6,
        skills: ['Figma', 'UI/UX Design', 'Prototyping'],
        mentor: 'Hoàng Văn Em',
        status: 'completed',
        notes: 'Có óc thẩm mỹ tốt, sáng tạo trong thiết kế'
      },
      {
        name: 'Hoàng Văn Em',
        department: 'IT',
        rating: 4.5,
        skills: ['Windows', 'Linux', 'Networking'],
        mentor: 'Vũ Thị Phương',
        status: 'active',
        notes: 'Kỹ năng kỹ thuật tốt, có thể hỗ trợ IT'
      }
    ],
    skillGaps: [
      {
        skill: 'Machine Learning',
        demand: 85,
        supply: 45,
        gap: 40,
        priority: 'high',
        department: 'Data Science'
      },
      {
        skill: 'React Development',
        demand: 78,
        supply: 52,
        gap: 26,
        priority: 'high',
        department: 'Engineering'
      },
      {
        skill: 'Data Analysis',
        demand: 72,
        supply: 48,
        gap: 24,
        priority: 'medium',
        department: 'Business'
      },
      {
        skill: 'UI/UX Design',
        demand: 68,
        supply: 38,
        gap: 30,
        priority: 'medium',
        department: 'Design'
      },
      {
        skill: 'Cloud Computing',
        demand: 65,
        supply: 42,
        gap: 23,
        priority: 'medium',
        department: 'IT'
      }
    ]
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleExportReport = (type) => {
    showSnackbar(`Báo cáo ${type} đã được xuất thành công!`, 'success');
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircleIcon color="success" />;
      case 'active': return <InfoIcon color="info" />;
      case 'pending': return <WarningIcon color="warning" />;
      default: return <ErrorIcon color="error" />;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Báo cáo & Phân tích
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Thời gian</InputLabel>
            <Select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              label="Thời gian"
            >
              <MenuItem value="week">Tuần</MenuItem>
              <MenuItem value="month">Tháng</MenuItem>
              <MenuItem value="quarter">Quý</MenuItem>
              <MenuItem value="year">Năm</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Phòng ban</InputLabel>
            <Select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              label="Phòng ban"
            >
              <MenuItem value="all">Tất cả</MenuItem>
              <MenuItem value="Engineering">Kỹ thuật</MenuItem>
              <MenuItem value="Business">Kinh doanh</MenuItem>
              <MenuItem value="Data Science">Khoa học dữ liệu</MenuItem>
              <MenuItem value="Design">Thiết kế</MenuItem>
              <MenuItem value="IT">CNTT</MenuItem>
              <MenuItem value="International Business">Kinh doanh quốc tế</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => showSnackbar('Dữ liệu đã được làm mới!', 'info')}
          >
            Làm mới
          </Button>
        </Box>
      </Box>

      {/* Overview Statistics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                <PeopleIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              </Box>
              <Typography variant="h4" color="primary">
                {mockReportData.overview.totalInterns}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tổng số thực tập sinh
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                <WorkIcon sx={{ fontSize: 40, color: 'success.main' }} />
              </Box>
              <Typography variant="h4" color="success.main">
                {mockReportData.overview.activeInterns}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Đang thực tập
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                <CheckCircleIcon sx={{ fontSize: 40, color: 'info.main' }} />
              </Box>
              <Typography variant="h4" color="info.main">
                {mockReportData.overview.conversionRate}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tỷ lệ chuyển đổi
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                <AssessmentIcon sx={{ fontSize: 40, color: 'warning.main' }} />
              </Box>
              <Typography variant="h4" color="warning.main">
                {mockReportData.overview.averageRating}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Đánh giá trung bình
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs for different report types */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="Tổng quan" />
          <Tab label="Phòng ban" />
          <Tab label="Xu hướng" />
          <Tab label="Top performers" />
          <Tab label="Khoảng trống kỹ năng" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {activeTab === 0 && (
        <Box>
          <Typography variant="h6" gutterBottom>Tổng quan chương trình thực tập</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>Biểu đồ hiệu suất theo thời gian</Typography>
                {/* Chart component removed - placeholder for future implementation */}
                <Box sx={{ p: 3, textAlign: 'center', bgcolor: 'grey.100', borderRadius: 1, height: 300 }}>
                  <Typography variant="h6" color="text.secondary">
                    Performance Chart
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Chart visualization will be implemented here
                  </Typography>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>Thống kê nhanh</Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon><SchoolIcon color="primary" /></ListItemIcon>
                    <ListItemText 
                      primary="Thực tập sinh hoàn thành" 
                      secondary={`${mockReportData.overview.completedInterns} người`} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><PeopleIcon color="warning" /></ListItemIcon>
                    <ListItemText 
                      primary="Đang chờ phê duyệt" 
                      secondary={`${mockReportData.overview.pendingInterns} người`} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><BusinessIcon color="info" /></ListItemIcon>
                    <ListItemText 
                      primary="Tổng số phòng ban" 
                      secondary={`${mockReportData.overview.totalDepartments} phòng`} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><WorkIcon color="success" /></ListItemIcon>
                    <ListItemText 
                      primary="Tổng số mentor" 
                      secondary={`${mockReportData.overview.totalMentors} người`} 
                    />
                  </ListItem>
                </List>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      )}

      {activeTab === 1 && (
        <Box>
          <Typography variant="h6" gutterBottom>Thống kê theo phòng ban</Typography>
          <Grid container spacing={3}>
            {mockReportData.departmentStats.map((dept, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      {dept.icon}
                      <Typography variant="h6" sx={{ ml: 1 }}>
                        {dept.name}
                      </Typography>
                    </Box>
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Tổng số</Typography>
                        <Typography variant="h6">{dept.total}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Đang thực tập</Typography>
                        <Typography variant="h6" color="success.main">{dept.active}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Hoàn thành</Typography>
                        <Typography variant="h6" color="info.main">{dept.completed}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Chờ phê duyệt</Typography>
                        <Typography variant="h6" color="warning.main">{dept.pending}</Typography>
                      </Grid>
                    </Grid>
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">Đánh giá TB</Typography>
                        <Typography variant="h6" color="primary">{dept.averageRating}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">Tỷ lệ chuyển đổi</Typography>
                        <Typography variant="h6" color="success.main">{dept.conversionRate}%</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {activeTab === 2 && (
        <Box>
          <Typography variant="h6" gutterBottom>Xu hướng theo thời gian</Typography>
          <Paper sx={{ p: 2 }}>
                            {/* Chart component removed - placeholder for future implementation */}
                <Box sx={{ p: 3, textAlign: 'center', bgcolor: 'grey.100', borderRadius: 1, height: 300 }}>
                  <Typography variant="h6" color="text.secondary">
                    Analytics Chart
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Chart visualization will be implemented here
                  </Typography>
                </Box>
          </Paper>
        </Box>
      )}

      {activeTab === 3 && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Top performers</Typography>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={() => handleExportReport('top performers')}
            >
              Xuất báo cáo
            </Button>
          </Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'grey.100' }}>
                  <TableCell><strong>Thực tập sinh</strong></TableCell>
                  <TableCell><strong>Phòng ban</strong></TableCell>
                  <TableCell><strong>Đánh giá</strong></TableCell>
                  <TableCell><strong>Kỹ năng chính</strong></TableCell>
                  <TableCell><strong>Mentor</strong></TableCell>
                  <TableCell><strong>Trạng thái</strong></TableCell>
                  <TableCell><strong>Ghi chú</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockReportData.topPerformers.map((performer, index) => (
                  <TableRow key={index} hover>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {performer.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={performer.department} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="h6" color="primary">
                          {performer.rating}
                        </Typography>
                        <TrendingUpIcon color="success" />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        {performer.skills.slice(0, 2).map((skill, idx) => (
                          <Chip key={idx} label={skill} size="small" variant="outlined" />
                        ))}
                        {performer.skills.length > 2 && (
                          <Chip label={`+${performer.skills.length - 2}`} size="small" />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{performer.mentor}</Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getStatusIcon(performer.status)}
                        <Typography variant="body2">
                          {performer.status === 'completed' ? 'Hoàn thành' : 
                           performer.status === 'active' ? 'Đang thực tập' : 'Chờ phê duyệt'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {performer.notes}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {activeTab === 4 && (
        <Box>
          <Typography variant="h6" gutterBottom>Phân tích khoảng trống kỹ năng</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: 'grey.100' }}>
                      <TableCell><strong>Kỹ năng</strong></TableCell>
                      <TableCell><strong>Phòng ban</strong></TableCell>
                      <TableCell><strong>Nhu cầu</strong></TableCell>
                      <TableCell><strong>Cung cấp</strong></TableCell>
                      <TableCell><strong>Khoảng trống</strong></TableCell>
                      <TableCell><strong>Ưu tiên</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockReportData.skillGaps.map((skill, index) => (
                      <TableRow key={index} hover>
                        <TableCell>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {skill.skill}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip label={skill.department} size="small" variant="outlined" />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="success.main">
                            {skill.demand}%
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="warning.main">
                            {skill.supply}%
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="error.main" fontWeight="bold">
                            {skill.gap}%
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={skill.priority === 'high' ? 'Cao' : 
                                   skill.priority === 'medium' ? 'Trung bình' : 'Thấp'} 
                            color={getPriorityColor(skill.priority)}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>Khuyến nghị</Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon><WarningIcon color="error" /></ListItemIcon>
                    <ListItemText 
                      primary="Ưu tiên cao" 
                      secondary="Machine Learning, React Development cần được đào tạo gấp" 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><InfoIcon color="info" /></ListItemIcon>
                    <ListItemText 
                      primary="Ưu tiên trung bình" 
                      secondary="Data Analysis, UI/UX Design cần cải thiện" 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                    <ListItemText 
                      primary="Đang ổn định" 
                      secondary="Cloud Computing có thể duy trì hiện tại" 
                    />
                  </ListItem>
                </List>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Reports;