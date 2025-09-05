import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Grid,
  Button,
  Chip,
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
  ListItemIcon,
  Avatar,
  Tooltip
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  Today,
  Event,
  Person,
  Schedule,
  LocationOn,
  Add
} from '@mui/icons-material';

const Calendar = ({ events = [], onEventClick, onDateClick, onEventCreate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [viewMode, setViewMode] = useState('month'); // month, week, day
  const [openEventDialog, setOpenEventDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    time: '',
    duration: 60,
    type: 'interview',
    location: '',
    participants: [],
    notes: ''
  });

  const months = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ];

  const weekDays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const getEventsForDate = (date) => {
    const dateStr = formatDate(date);
    return events.filter(event => event.date === dateStr);
  };

  const handleDateClick = (day) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(clickedDate);
    if (onDateClick) {
      onDateClick(clickedDate);
    }
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setOpenEventDialog(true);
    if (onEventClick) {
      onEventClick(event);
    }
  };

  const handleCreateEvent = () => {
    if (selectedDate) {
      setNewEvent({
        ...newEvent,
        date: formatDate(selectedDate)
      });
    }
    setOpenCreateDialog(true);
  };

  const handleSaveEvent = () => {
    if (onEventCreate) {
      onEventCreate(newEvent);
    }
    setOpenCreateDialog(false);
    setNewEvent({
      title: '',
      date: '',
      time: '',
      duration: 60,
      type: 'interview',
      location: '',
      participants: [],
      notes: ''
    });
  };

  const getEventTypeColor = (type) => {
    const colors = {
      interview: 'primary',
      meeting: 'secondary',
      training: 'success',
      review: 'warning',
      other: 'info'
    };
    return colors[type] || 'default';
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before the first day of month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <Grid item xs key={`empty-${i}`}>
          <Box sx={{ height: 120 }} />
        </Grid>
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayEvents = getEventsForDate(date);
      const isToday = formatDate(date) === formatDate(new Date());
      const isSelected = selectedDate && formatDate(date) === formatDate(selectedDate);

      days.push(
        <Grid item xs key={day}>
          <Paper
            sx={{
              height: 120,
              p: 1,
              cursor: 'pointer',
              border: isSelected ? 2 : 1,
              borderColor: isSelected ? 'primary.main' : 'divider',
              bgcolor: isToday ? 'primary.light' : 'background.paper',
              '&:hover': {
                bgcolor: 'action.hover'
              }
            }}
            onClick={() => handleDateClick(day)}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: isToday ? 'bold' : 'normal',
                  color: isToday ? 'primary.contrastText' : 'text.primary'
                }}
              >
                {day}
              </Typography>
              {dayEvents.length > 0 && (
                <Chip
                  size="small"
                  label={dayEvents.length}
                  color="primary"
                  sx={{ minWidth: 20, height: 20, fontSize: 10 }}
                />
              )}
            </Box>
            <Box sx={{ maxHeight: 80, overflow: 'hidden' }}>
              {dayEvents.slice(0, 2).map((event, index) => (
                <Chip
                  key={index}
                  label={event.title}
                  size="small"
                  color={getEventTypeColor(event.type)}
                  sx={{
                    mb: 0.5,
                    maxWidth: '100%',
                    height: 20,
                    fontSize: 10,
                    '& .MuiChip-label': {
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEventClick(event);
                  }}
                />
              ))}
              {dayEvents.length > 2 && (
                <Typography variant="caption" color="text.secondary">
                  +{dayEvents.length - 2} more
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>
      );
    }

    return days;
  };

  return (
    <Box>
      {/* Calendar Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h5">
            {months[currentDate.getMonth()]} {currentDate.getFullYear()}
          </Typography>
          <Box>
            <IconButton onClick={() => navigateMonth(-1)}>
              <ChevronLeft />
            </IconButton>
            <IconButton onClick={() => navigateMonth(1)}>
              <ChevronRight />
            </IconButton>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<Today />}
            onClick={goToToday}
            size="small"
          >
            Hôm nay
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleCreateEvent}
            size="small"
          >
            Tạo sự kiện
          </Button>
        </Box>
      </Box>

      {/* Calendar Grid */}
      <Paper sx={{ p: 2 }}>
        {/* Week days header */}
        <Grid container spacing={1} sx={{ mb: 1 }}>
          {weekDays.map((day) => (
            <Grid item xs key={day}>
              <Typography
                variant="subtitle2"
                align="center"
                sx={{ fontWeight: 'bold', color: 'text.secondary' }}
              >
                {day}
              </Typography>
            </Grid>
          ))}
        </Grid>

        {/* Calendar days */}
        <Grid container spacing={1}>
          {renderCalendarDays()}
        </Grid>
      </Paper>

      {/* Event Details Dialog */}
      <Dialog open={openEventDialog} onClose={() => setOpenEventDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Event color="primary" />
            Chi tiết sự kiện
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedEvent && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedEvent.title}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Schedule fontSize="small" />
                <Typography variant="body2">
                  {selectedEvent.date} • {selectedEvent.time} ({selectedEvent.duration} phút)
                </Typography>
              </Box>
              {selectedEvent.location && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <LocationOn fontSize="small" />
                  <Typography variant="body2">{selectedEvent.location}</Typography>
                </Box>
              )}
              <Box sx={{ mb: 2 }}>
                <Chip
                  label={selectedEvent.type}
                  color={getEventTypeColor(selectedEvent.type)}
                  size="small"
                />
              </Box>
              {selectedEvent.participants && selectedEvent.participants.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Người tham gia:
                  </Typography>
                  <List dense>
                    {selectedEvent.participants.map((participant, index) => (
                      <ListItem key={index} sx={{ px: 0 }}>
                        <ListItemIcon>
                          <Avatar sx={{ width: 24, height: 24 }}>
                            <Person fontSize="small" />
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText primary={participant} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
              {selectedEvent.notes && (
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Ghi chú:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedEvent.notes}
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEventDialog(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>

      {/* Create Event Dialog */}
      <Dialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Tạo sự kiện mới</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tiêu đề"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Ngày"
                type="date"
                value={newEvent.date}
                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Thời gian"
                type="time"
                value={newEvent.time}
                onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Thời lượng (phút)"
                type="number"
                value={newEvent.duration}
                onChange={(e) => setNewEvent({ ...newEvent, duration: parseInt(e.target.value) })}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Loại sự kiện</InputLabel>
                <Select
                  value={newEvent.type}
                  onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                  label="Loại sự kiện"
                >
                  <MenuItem value="interview">Phỏng vấn</MenuItem>
                  <MenuItem value="meeting">Họp</MenuItem>
                  <MenuItem value="training">Đào tạo</MenuItem>
                  <MenuItem value="review">Đánh giá</MenuItem>
                  <MenuItem value="other">Khác</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Địa điểm"
                value={newEvent.location}
                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Ghi chú"
                multiline
                rows={3}
                value={newEvent.notes}
                onChange={(e) => setNewEvent({ ...newEvent, notes: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateDialog(false)}>Hủy</Button>
          <Button onClick={handleSaveEvent} variant="contained">
            Tạo sự kiện
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Calendar;
