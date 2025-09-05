import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Tabs, 
  Tab, 
  Card, 
  CardContent,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Alert,
  Snackbar
} from '@mui/material';
import { 
  CalendarMonth, 
  Schedule, 
  Person, 
  LocationOn,
  Add,
  Edit,
  Delete,
  VideoCall,
  Email
} from '@mui/icons-material';
import Calendar from '../../components/common/Calendar';
import { mockInterviews } from '../../mocks/data';

const InterviewSchedule = () => {
  const [tabValue, setTabValue] = useState(0);
  const [interviews, setInterviews] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [dialogMode, setDialogMode] = useState('create');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    candidateName: '',
    candidateEmail: '',
    position: '',
    department: '',
    interviewType: 'Technical',
    scheduledDate: '',
    scheduledTime: '',
    duration: 60,
    location: '',
    interviewers: [],
    notes: ''
  });

  useEffect(() => {
    // Load mock interviews
    setInterviews(mockInterviews);
    
    // Convert interviews to calendar events
    const events = mockInterviews.map(interview => ({
      id: interview.id,
      title: `${interview.candidateName} - ${interview.position}`,
      date: interview.scheduledDate,
      time: interview.scheduledTime,
      duration: interview.duration,
      type: 'interview',
      location: interview.location,
      participants: [interview.candidateName],
      notes: interview.notes,
      status: interview.status,
      interviewType: interview.interviewType
    }));
    setCalendarEvents(events);
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleEventClick = (event) => {
    const interview = interviews.find(i => i.id === event.id);
    if (interview) {
      setSelectedInterview(interview);
      setFormData({
        candidateName: interview.candidateName,
        candidateEmail: interview.candidateEmail,
        position: interview.position,
        department: interview.department,
        interviewType: interview.interviewType,
        scheduledDate: interview.scheduledDate,
        scheduledTime: interview.scheduledTime,
        duration: interview.duration,
        location: interview.location,
        interviewers: interview.interviewers || [],
        notes: interview.notes || ''
      });
      setDialogMode('edit');
      setOpenDialog(true);
    }
  };

  const handleCreateInterview = () => {
    setSelectedInterview(null);
    setFormData({
      candidateName: '',
      candidateEmail: '',
      position: '',
      department: '',
      interviewType: 'Technical',
      scheduledDate: '',
      scheduledTime: '',
      duration: 60,
      location: '',
      interviewers: [],
      notes: ''
    });
    setDialogMode('create');
    setOpenDialog(true);
  };

  const handleSaveInterview = () => {
    if (dialogMode === 'create') {
      const newInterview = {
        id: Date.now(),
        ...formData,
        status: 'scheduled'
      };
      setInterviews([...interviews, newInterview]);
      
      const newEvent = {
        id: newInterview.id,
        title: `${formData.candidateName} - ${formData.position}`,
        date: formData.scheduledDate,
        time: formData.scheduledTime,
        duration: formData.duration,
        type: 'interview',
        location: formData.location,
        participants: [formData.candidateName],
        notes: formData.notes,
        status: 'scheduled',
        interviewType: formData.interviewType
      };
      setCalendarEvents([...calendarEvents, newEvent]);
      
      showSnackbar('Lịch phỏng vấn đã được tạo thành công!', 'success');
    } else {
      // Update existing interview
      const updatedInterviews = interviews.map(interview =>
        interview.id === selectedInterview.id ? { ...interview, ...formData } : interview
      );
      setInterviews(updatedInterviews);
      
      const updatedEvents = calendarEvents.map(event =>
        event.id === selectedInterview.id ? {
          ...event,
          title: `${formData.candidateName} - ${formData.position}`,
          date: formData.scheduledDate,
          time: formData.scheduledTime,
          duration: formData.duration,
          location: formData.location,
          participants: [formData.candidateName],
          notes: formData.notes
        } : event
      );
      setCalendarEvents(updatedEvents);
      
      showSnackbar('Lịch phỏng vấn đã được cập nhật!', 'success');
    }
    
    setOpenDialog(false);
  };

  const handleDeleteInterview = (interviewId) => {
    if (window.confirm('Bạn có chắc muốn xóa lịch phỏng vấn này?')) {
      setInterviews(interviews.filter(i => i.id !== interviewId));
      setCalendarEvents(calendarEvents.filter(e => e.id !== interviewId));
      showSnackbar('Lịch phỏng vấn đã được xóa!', 'success');
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const getStatusColor = (status) => {
    const colors = {
      scheduled: 'success',
      pending: 'warning',
      completed: 'info',
      cancelled: 'error'
    };
    return colors[status] || 'default';
  };

  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <CalendarMonth color="primary" sx={{ fontSize: 32 }} />
          <Typography variant="h4">Quản lý lịch phỏng vấn</Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreateInterview}
        >
          Tạo lịch phỏng vấn
        </Button>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {interviews.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tổng lịch phỏng vấn
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main">
                {interviews.filter(i => i.status === 'scheduled').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Đã lên lịch
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main">
                {interviews.filter(i => i.status === 'pending').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Chờ xác nhận
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="info.main">
                {interviews.filter(i => i.status === 'completed').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Đã hoàn thành
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Lịch" />
          <Tab label="Danh sách" />
        </Tabs>
      </Paper>

      {/* Calendar View */}
      <TabPanel value={tabValue} index={0}>
        <Calendar
          events={calendarEvents}
          onEventClick={handleEventClick}
          onEventCreate={(event) => {
            setFormData({
              ...formData,
              scheduledDate: event.date,
              scheduledTime: event.time
            });
            setDialogMode('create');
            setOpenDialog(true);
          }}
        />
      </TabPanel>

      {/* List View */}
      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          {interviews.map((interview) => (
            <Grid item xs={12} md={6} lg={4} key={interview.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 32, height: 32 }}>
                        <Person />
                      </Avatar>
                      <Typography variant="h6">{interview.candidateName}</Typography>
                    </Box>
                    <Chip
                      label={interview.status}
                      color={getStatusColor(interview.status)}
                      size="small"
                    />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {interview.position} • {interview.department}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Schedule fontSize="small" />
                    <Typography variant="body2">
                      {interview.scheduledDate} • {interview.scheduledTime}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <LocationOn fontSize="small" />
                    <Typography variant="body2">{interview.location}</Typography>
                  </Box>
                  
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                    {interview.interviewType} • {interview.duration} phút
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      size="small"
                      startIcon={<Edit />}
                      onClick={() => handleEventClick({ id: interview.id })}
                    >
                      Sửa
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      startIcon={<Delete />}
                      onClick={() => handleDeleteInterview(interview.id)}
                    >
                      Xóa
                    </Button>
                    <Button
                      size="small"
                      startIcon={<VideoCall />}
                      color="primary"
                    >
                      Họp
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* Interview Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {dialogMode === 'create' ? 'Tạo lịch phỏng vấn mới' : 'Chỉnh sửa lịch phỏng vấn'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Tên ứng viên"
                value={formData.candidateName}
                onChange={(e) => setFormData({ ...formData, candidateName: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Email ứng viên"
                type="email"
                value={formData.candidateEmail}
                onChange={(e) => setFormData({ ...formData, candidateEmail: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Vị trí ứng tuyển"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Phòng ban</InputLabel>
                <Select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  label="Phòng ban"
                >
                  <MenuItem value="Engineering">Engineering</MenuItem>
                  <MenuItem value="Marketing">Marketing</MenuItem>
                  <MenuItem value="Design">Design</MenuItem>
                  <MenuItem value="Sales">Sales</MenuItem>
                  <MenuItem value="HR">HR</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Loại phỏng vấn</InputLabel>
                <Select
                  value={formData.interviewType}
                  onChange={(e) => setFormData({ ...formData, interviewType: e.target.value })}
                  label="Loại phỏng vấn"
                >
                  <MenuItem value="Technical">Technical</MenuItem>
                  <MenuItem value="Behavioral">Behavioral</MenuItem>
                  <MenuItem value="Portfolio Review">Portfolio Review</MenuItem>
                  <MenuItem value="Final">Final</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Thời lượng (phút)"
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Ngày phỏng vấn"
                type="date"
                value={formData.scheduledDate}
                onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Giờ phỏng vấn"
                type="time"
                value={formData.scheduledTime}
                onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Địa điểm"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Ghi chú"
                multiline
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
          <Button onClick={handleSaveInterview} variant="contained">
            {dialogMode === 'create' ? 'Tạo lịch' : 'Cập nhật'}
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

export default InterviewSchedule;