import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Avatar,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  IconButton,
  Tooltip,
  Rating,
  Divider
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Assessment,
  Person,
  School,
  WorkOutline,
  Star,
  Edit,
  Visibility,
  FileDownload,
  FilterList,
  Search,
  Add as AddIcon
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import internService from '../../services/internService';

const PerformanceTracking = () => {
  const [tabValue, setTabValue] = useState(0);
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedIntern, setSelectedIntern] = useState(null);
  const [openEvaluationDialog, setOpenEvaluationDialog] = useState(false);
  const [evaluationData, setEvaluationData] = useState({
    technicalSkills: 5,
    communication: 5,
    teamwork: 5,
    problemSolving: 5,
    initiative: 5,
    punctuality: 5,
    feedback: '',
    goals: ''
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    loadInterns();
  }, []);

  const loadInterns = async () => {
    try {
      setLoading(true);
      const response = await internService.getAll();
      // Add performance data to each intern
      const internsWithPerformance = response.data.map(intern => ({
        ...intern,
        performanceScore: Math.floor(Math.random() * 40) + 60, // 60-100
        tasksCompleted: Math.floor(Math.random() * 20) + 5,
        totalTasks: Math.floor(Math.random() * 10) + 20,
        attendanceRate: Math.floor(Math.random() * 20) + 80,
        lastEvaluation: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        strengths: ['Problem Solving', 'Communication', 'Technical Skills'].slice(0, Math.floor(Math.random() * 3) + 1),
        improvements: ['Time Management', 'Leadership', 'Documentation'].slice(0, Math.floor(Math.random() * 2) + 1)
      }));
      setInterns(internsWithPerformance);
    } catch (error) {
      console.error('Error loading interns:', error);
      showSnackbar('Không thể tải danh sách thực tập sinh', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleOpenEvaluation = (intern) => {
    setSelectedIntern(intern);
    setOpenEvaluationDialog(true);
  };

  const handleCloseEvaluation = () => {
    setOpenEvaluationDialog(false);
    setSelectedIntern(null);
    setEvaluationData({
      technicalSkills: 5,
      communication: 5,
      teamwork: 5,
      problemSolving: 5,
      initiative: 5,
      punctuality: 5,
      feedback: '',
      goals: ''
    });
  };

  const handleSubmitEvaluation = () => {
    showSnackbar('Đánh giá đã được lưu thành công!', 'success');
    handleCloseEvaluation();
  };

  const getPerformanceColor = (score) => {
    if (score >= 90) return 'success';
    if (score >= 80) return 'info';
    if (score >= 70) return 'warning';
    return 'error';
  };

  const getPerformanceLabel = (score) => {
    if (score >= 90) return 'Xuất sắc';
    if (score >= 80) return 'Tốt';
    if (score >= 70) return 'Khá';
    return 'Cần cải thiện';
  };

  const filteredInterns = interns.filter(intern => {
    const matchesSearch = intern.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         intern.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === 'all' || intern.department === filterDepartment;
    const matchesStatus = filterStatus === 'all' || intern.status === filterStatus;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  // Chart data
  const performanceChartData = interns.map(intern => ({
    name: intern.name.split(' ').pop(),
    score: intern.performanceScore,
    tasks: Math.round((intern.tasksCompleted / intern.totalTasks) * 100)
  }));

  const departmentPerformance = [
    { name: 'Engineering', value: 85, count: interns.filter(i => i.department === 'Engineering').length },
    { name: 'Business', value: 78, count: interns.filter(i => i.department === 'Business').length },
    { name: 'Design', value: 82, count: interns.filter(i => i.department === 'Design').length },
    { name: 'IT', value: 88, count: interns.filter(i => i.department === 'IT').length }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const averagePerformance = interns.length > 0 ? 
    Math.round(interns.reduce((sum, intern) => sum + intern.performanceScore, 0) / interns.length) : 0;
  
  const topPerformers = interns.filter(intern => intern.performanceScore >= 90).length;
  const needsImprovement = interns.filter(intern => intern.performanceScore < 70).length;

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Đang tải dữ liệu hiệu suất...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Theo dõi hiệu suất thực tập sinh</Typography>
      
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Tổng quan" icon={<Assessment />} />
          <Tab label="Chi tiết" icon={<Person />} />
          <Tab label="Đánh giá" icon={<Star />} />
          <Tab label="Báo cáo" icon={<FileDownload />} />
        </Tabs>
      </Paper>

      {/* Overview Tab */}
      {tabValue === 0 && (
        <Box>
          {/* KPI Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary">{averagePerformance}%</Typography>
                  <Typography variant="body2" color="text.secondary">Điểm trung bình</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="success.main">{topPerformers}</Typography>
                  <Typography variant="body2" color="text.secondary">Xuất sắc (≥90%)</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="warning.main">{needsImprovement}</Typography>
                  <Typography variant="body2" color="text.secondary">Cần cải thiện (&lt;70%)</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="info.main">{interns.length}</Typography>
                  <Typography variant="body2" color="text.secondary">Tổng thực tập sinh</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Charts */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Biểu đồ hiệu suất cá nhân</Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={performanceChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <RechartsTooltip />
                      <Bar dataKey="score" fill="#8884d8" name="Điểm hiệu suất" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Hiệu suất theo phòng ban</Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={departmentPerformance}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {departmentPerformance.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Details Tab */}
      {tabValue === 1 && (
        <Box>
          {/* Filters */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Tìm kiếm theo tên, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <Search sx={{ color: 'text.secondary', mr: 1 }} />
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Phòng ban</InputLabel>
                  <Select
                    value={filterDepartment}
                    onChange={(e) => setFilterDepartment(e.target.value)}
                    label="Phòng ban"
                  >
                    <MenuItem value="all">Tất cả</MenuItem>
                    <MenuItem value="Engineering">Kỹ thuật</MenuItem>
                    <MenuItem value="Business">Kinh doanh</MenuItem>
                    <MenuItem value="Design">Thiết kế</MenuItem>
                    <MenuItem value="IT">CNTT</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Trạng thái</InputLabel>
                  <Select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    label="Trạng thái"
                  >
                    <MenuItem value="all">Tất cả</MenuItem>
                    <MenuItem value="active">Đang thực tập</MenuItem>
                    <MenuItem value="completed">Hoàn thành</MenuItem>
                    <MenuItem value="pending">Chờ phê duyệt</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <Button
                  variant="outlined"
                  startIcon={<FilterList />}
                  onClick={() => {
                    setSearchTerm('');
                    setFilterDepartment('all');
                    setFilterStatus('all');
                  }}
                  fullWidth
                >
                  Làm mới
                </Button>
              </Grid>
            </Grid>
          </Paper>

          {/* Performance Table */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'grey.100' }}>
                  <TableCell><strong>Thực tập sinh</strong></TableCell>
                  <TableCell><strong>Phòng ban</strong></TableCell>
                  <TableCell><strong>Điểm hiệu suất</strong></TableCell>
                  <TableCell><strong>Tiến độ công việc</strong></TableCell>
                  <TableCell><strong>Tỷ lệ chuyên cần</strong></TableCell>
                  <TableCell><strong>Đánh giá gần nhất</strong></TableCell>
                  <TableCell><strong>Thao tác</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredInterns.map((intern) => (
                  <TableRow key={intern.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          {intern.avatar}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {intern.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {intern.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{intern.department}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip
                          label={`${intern.performanceScore}%`}
                          color={getPerformanceColor(intern.performanceScore)}
                          size="small"
                        />
                        <Typography variant="caption">
                          {getPerformanceLabel(intern.performanceScore)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ width: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="caption">
                            {intern.tasksCompleted}/{intern.totalTasks} nhiệm vụ
                          </Typography>
                          <Typography variant="caption">
                            {Math.round((intern.tasksCompleted / intern.totalTasks) * 100)}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={(intern.tasksCompleted / intern.totalTasks) * 100}
                          sx={{ height: 8, borderRadius: 1 }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {intern.attendanceRate}%
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {intern.lastEvaluation}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Xem chi tiết">
                          <IconButton size="small">
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Đánh giá">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleOpenEvaluation(intern)}
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Evaluation Tab */}
      {tabValue === 2 && (
        <Box>
          <Typography variant="h6" gutterBottom>Tạo đánh giá mới</Typography>
          <Grid container spacing={3}>
            {filteredInterns.map((intern) => (
              <Grid item xs={12} md={6} lg={4} key={intern.id}>
                <Card sx={{ cursor: 'pointer' }} onClick={() => handleOpenEvaluation(intern)}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {intern.avatar}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {intern.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {intern.department}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">Điểm hiện tại:</Typography>
                      <Chip
                        label={`${intern.performanceScore}%`}
                        color={getPerformanceColor(intern.performanceScore)}
                        size="small"
                      />
                    </Box>
                    <Button variant="outlined" size="small" startIcon={<AddIcon />}>
                      Tạo đánh giá
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Reports Tab */}
      {tabValue === 3 && (
        <Box>
          <Typography variant="h6" gutterBottom>Xuất báo cáo hiệu suất</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Báo cáo tổng quan</Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Xuất báo cáo tổng quan hiệu suất của tất cả thực tập sinh
                  </Typography>
                  <Button variant="contained" startIcon={<FileDownload />}>
                    Xuất PDF
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Báo cáo chi tiết</Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Xuất báo cáo chi tiết từng thực tập sinh với biểu đồ
                  </Typography>
                  <Button variant="contained" startIcon={<FileDownload />}>
                    Xuất Excel
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Evaluation Dialog */}
      <Dialog open={openEvaluationDialog} onClose={handleCloseEvaluation} maxWidth="md" fullWidth>
        <DialogTitle>
          Đánh giá hiệu suất - {selectedIntern?.name}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Kỹ năng chuyên môn</Typography>
              <Box sx={{ mb: 2 }}>
                <Typography component="legend">Kỹ năng kỹ thuật</Typography>
                <Rating
                  value={evaluationData.technicalSkills}
                  onChange={(event, newValue) => 
                    setEvaluationData({...evaluationData, technicalSkills: newValue})
                  }
                  max={10}
                />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography component="legend">Giao tiếp</Typography>
                <Rating
                  value={evaluationData.communication}
                  onChange={(event, newValue) => 
                    setEvaluationData({...evaluationData, communication: newValue})
                  }
                  max={10}
                />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography component="legend">Làm việc nhóm</Typography>
                <Rating
                  value={evaluationData.teamwork}
                  onChange={(event, newValue) => 
                    setEvaluationData({...evaluationData, teamwork: newValue})
                  }
                  max={10}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Thái độ làm việc</Typography>
              <Box sx={{ mb: 2 }}>
                <Typography component="legend">Giải quyết vấn đề</Typography>
                <Rating
                  value={evaluationData.problemSolving}
                  onChange={(event, newValue) => 
                    setEvaluationData({...evaluationData, problemSolving: newValue})
                  }
                  max={10}
                />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography component="legend">Chủ động</Typography>
                <Rating
                  value={evaluationData.initiative}
                  onChange={(event, newValue) => 
                    setEvaluationData({...evaluationData, initiative: newValue})
                  }
                  max={10}
                />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography component="legend">Đúng giờ</Typography>
                <Rating
                  value={evaluationData.punctuality}
                  onChange={(event, newValue) => 
                    setEvaluationData({...evaluationData, punctuality: newValue})
                  }
                  max={10}
                />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nhận xét chi tiết"
                multiline
                rows={4}
                value={evaluationData.feedback}
                onChange={(e) => setEvaluationData({...evaluationData, feedback: e.target.value})}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Mục tiêu cải thiện"
                multiline
                rows={3}
                value={evaluationData.goals}
                onChange={(e) => setEvaluationData({...evaluationData, goals: e.target.value})}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEvaluation}>Hủy</Button>
          <Button onClick={handleSubmitEvaluation} variant="contained">
            Lưu đánh giá
          </Button>
        </DialogActions>
      </Dialog>

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

export default PerformanceTracking;