import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const DailyProgress = () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [progressData, setProgressData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProgress, setSelectedProgress] = useState(null);
  const [dialogMode, setDialogMode] = useState('add');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Mock data for daily progress
  const mockProgressData = [
    {
      id: 1,
      internId: 9,
      internName: 'Software Dev Intern',
      date: '2024-01-20',
      task: 'React Component Development',
      status: 'completed',
      progress: 100,
      hoursSpent: 6,
      feedback: 'Excellent work! The component is well-structured and follows best practices.',
      mentorNotes: 'Intern showed great understanding of React concepts',
      nextSteps: 'Move to Redux state management',
      rating: 5
    },
    {
      id: 2,
      internId: 13,
      internName: 'UI/UX Design Intern',
      date: '2024-01-20',
      task: 'User Research Survey',
      status: 'in-progress',
      progress: 75,
      hoursSpent: 4,
      feedback: 'Good progress on research. Need to focus on user pain points.',
      mentorNotes: 'Intern is creative but needs guidance on research methodology',
      nextSteps: 'Complete survey analysis and create personas',
      rating: 4
    },
    {
      id: 3,
      internId: 10,
      internName: 'Marketing Intern',
      date: '2024-01-20',
      task: 'Content Calendar Creation',
      status: 'in-progress',
      progress: 60,
      hoursSpent: 3,
      feedback: 'Calendar structure is good. Add more visual content ideas.',
      mentorNotes: 'Intern has good organizational skills',
      nextSteps: 'Add content themes and posting schedule',
      rating: 4
    }
  ];

  useEffect(() => {
    loadProgressData();
  }, [selectedDate]);

  const loadProgressData = () => {
    // Filter data by selected date
    const filteredData = mockProgressData.filter(item => 
      item.date === selectedDate.toISOString().split('T')[0]
    );
    setProgressData(filteredData);
  };

  const handleOpenDialog = (mode, progress = null) => {
    setDialogMode(mode);
    setSelectedProgress(progress);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProgress(null);
  };

  const handleSubmit = (formData) => {
    if (dialogMode === 'add') {
      const newProgress = {
        id: Date.now(),
        internId: formData.internId,
        internName: formData.internName,
        date: selectedDate.toISOString().split('T')[0],
        ...formData
      };
      setProgressData([...progressData, newProgress]);
      showSnackbar('Tiến độ đã được thêm thành công!', 'success');
    } else {
      const updatedData = progressData.map(item => 
        item.id === selectedProgress.id ? { ...item, ...formData } : item
      );
      setProgressData(updatedData);
      showSnackbar('Tiến độ đã được cập nhật thành công!', 'success');
    }
    handleCloseDialog();
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'warning';
      case 'not-started': return 'error';
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Hoàn thành';
      case 'in-progress': return 'Đang thực hiện';
      case 'not-started': return 'Chưa bắt đầu';
      default: return status;
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'success';
    if (progress >= 50) return 'warning';
    return 'error';
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Tiến độ hàng ngày
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog('add')}
        >
          Thêm tiến độ
        </Button>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {progressData.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Thực tập sinh hôm nay
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main">
                {progressData.filter(p => p.status === 'completed').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Hoàn thành
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main">
                {progressData.filter(p => p.status === 'in-progress').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Đang thực hiện
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="info.main">
                {progressData.reduce((sum, p) => sum + p.hoursSpent, 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tổng giờ làm việc
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Progress Table */}
      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'grey.100' }}>
              <TableCell><strong>Thực tập sinh</strong></TableCell>
              <TableCell><strong>Nhiệm vụ</strong></TableCell>
              <TableCell><strong>Trạng thái</strong></TableCell>
              <TableCell><strong>Tiến độ</strong></TableCell>
              <TableCell><strong>Giờ làm việc</strong></TableCell>
              <TableCell><strong>Đánh giá</strong></TableCell>
              <TableCell><strong>Thao tác</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {progressData.map((progress) => (
              <TableRow key={progress.id} hover>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {progress.internName}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {progress.task}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={getStatusText(progress.status)}
                    color={getStatusColor(progress.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" color={getProgressColor(progress.progress)}>
                      {progress.progress}%
                    </Typography>
                    <Box sx={{ width: 60, height: 8, bgcolor: 'grey.200', borderRadius: 4 }}>
                      <Box
                        sx={{
                          width: `${progress.progress}%`,
                          height: '100%',
                          bgcolor: getProgressColor(progress.progress),
                          borderRadius: 4
                        }}
                      />
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {progress.hoursSpent}h
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {[...Array(5)].map((_, i) => (
                      <CheckCircleIcon
                        key={i}
                        sx={{
                          color: i < progress.rating ? 'gold' : 'grey.300',
                          fontSize: 16
                        }}
                      />
                    ))}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Xem chi tiết">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog('view', progress)}
                      >
                        <TrendingUpIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Chỉnh sửa">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog('edit', progress)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Progress Detail Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {dialogMode === 'add' ? 'Thêm tiến độ mới' : 
           dialogMode === 'edit' ? 'Chỉnh sửa tiến độ' : 'Chi tiết tiến độ'}
        </DialogTitle>
        <DialogContent>
          <ProgressForm
            mode={dialogMode}
            progress={selectedProgress}
            onSubmit={handleSubmit}
            onCancel={handleCloseDialog}
          />
        </DialogContent>
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

// Progress Form Component
const ProgressForm = ({ mode, progress, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    internId: progress?.internId || '',
    internName: progress?.internName || '',
    task: progress?.task || '',
    status: progress?.status || 'not-started',
    progress: progress?.progress || 0,
    hoursSpent: progress?.hoursSpent || 0,
    feedback: progress?.feedback || '',
    mentorNotes: progress?.mentorNotes || '',
    nextSteps: progress?.nextSteps || '',
    rating: progress?.rating || 5
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (mode === 'view') {
    return (
      <Box sx={{ pt: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">Thực tập sinh</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>{progress.internName}</Typography>
            
            <Typography variant="subtitle2" color="text.secondary">Nhiệm vụ</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>{progress.task}</Typography>
            
            <Typography variant="subtitle2" color="text.secondary">Trạng thái</Typography>
            <Chip
              label={progress.status === 'completed' ? 'Hoàn thành' : 
                     progress.status === 'in-progress' ? 'Đang thực hiện' : 'Chưa bắt đầu'}
              color={progress.status === 'completed' ? 'success' : 
                     progress.status === 'in-progress' ? 'warning' : 'error'}
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">Tiến độ</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>{progress.progress}%</Typography>
            
            <Typography variant="subtitle2" color="text.secondary">Giờ làm việc</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>{progress.hoursSpent}h</Typography>
            
            <Typography variant="subtitle2" color="text.secondary">Đánh giá</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2 }}>
              {[...Array(5)].map((_, i) => (
                <CheckCircleIcon
                  key={i}
                  sx={{
                    color: i < progress.rating ? 'gold' : 'grey.300',
                    fontSize: 20
                  }}
                />
              ))}
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary">Phản hồi</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>{progress.feedback}</Typography>
            
            <Typography variant="subtitle2" color="text.secondary">Ghi chú của mentor</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>{progress.mentorNotes}</Typography>
            
            <Typography variant="subtitle2" color="text.secondary">Bước tiếp theo</Typography>
            <Typography variant="body1">{progress.nextSteps}</Typography>
          </Grid>
        </Grid>
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ pt: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Tên thực tập sinh"
            value={formData.internName}
            onChange={(e) => handleChange('internName', e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          
          <TextField
            fullWidth
            label="Nhiệm vụ"
            value={formData.task}
            onChange={(e) => handleChange('task', e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              label="Trạng thái"
            >
              <MenuItem value="not-started">Chưa bắt đầu</MenuItem>
              <MenuItem value="in-progress">Đang thực hiện</MenuItem>
              <MenuItem value="completed">Hoàn thành</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Tiến độ (%)"
            type="number"
            value={formData.progress}
            onChange={(e) => handleChange('progress', parseInt(e.target.value))}
            inputProps={{ min: 0, max: 100 }}
            required
            sx={{ mb: 2 }}
          />
          
          <TextField
            fullWidth
            label="Giờ làm việc"
            type="number"
            value={formData.hoursSpent}
            onChange={(e) => handleChange('hoursSpent', parseInt(e.target.value))}
            inputProps={{ min: 0 }}
            required
            sx={{ mb: 2 }}
          />
          
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Đánh giá</InputLabel>
            <Select
              value={formData.rating}
              onChange={(e) => handleChange('rating', parseInt(e.target.value))}
              label="Đánh giá"
            >
              <MenuItem value={1}>1 sao</MenuItem>
              <MenuItem value={2}>2 sao</MenuItem>
              <MenuItem value={3}>3 sao</MenuItem>
              <MenuItem value={4}>4 sao</MenuItem>
              <MenuItem value={5}>5 sao</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Phản hồi cho thực tập sinh"
            multiline
            rows={3}
            value={formData.feedback}
            onChange={(e) => handleChange('feedback', e.target.value)}
            placeholder="Nhập phản hồi chi tiết..."
            sx={{ mb: 2 }}
          />
          
          <TextField
            fullWidth
            label="Ghi chú của mentor"
            multiline
            rows={2}
            value={formData.mentorNotes}
            onChange={(e) => handleChange('mentorNotes', e.target.value)}
            placeholder="Ghi chú nội bộ..."
            sx={{ mb: 2 }}
          />
          
          <TextField
            fullWidth
            label="Bước tiếp theo"
            value={formData.nextSteps}
            onChange={(e) => handleChange('nextSteps', e.target.value)}
            placeholder="Định hướng cho thực tập sinh..."
          />
        </Grid>
      </Grid>
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
        <Button onClick={onCancel}>Hủy</Button>
        <Button type="submit" variant="contained">
          {mode === 'add' ? 'Thêm' : 'Cập nhật'}
        </Button>
      </Box>
    </Box>
  );
};

export default DailyProgress;