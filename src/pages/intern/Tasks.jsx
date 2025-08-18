import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
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
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Alert,
  Snackbar,
  LinearProgress,
  Avatar,
  Badge,
  Tabs,
  Tab,
  Slider,
  FormControlLabel,
  Switch
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  Assignment as AssignmentIcon,
  Schedule as ScheduleIcon,
  PriorityHigh as PriorityHighIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  PlayArrow as PlayArrowIcon,
  Stop as StopIcon,
  Comment as CommentIcon,
  AttachFile as AttachFileIcon,
  FilterList as FilterListIcon,
  TrendingUp as TrendingUpIcon,
  Person as PersonIcon,
  Category as CategoryIcon,
  CalendarToday as CalendarTodayIcon,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';
import taskService from '../../services/taskService';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [dialogMode, setDialogMode] = useState('add');
  const [activeTab, setActiveTab] = useState(0);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showCompleted, setShowCompleted] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assigneeId: '',
    mentorId: '',
    dueDate: '',
    priority: 'medium',
    category: '',
    estimatedHours: '',
    status: 'planning'
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [tasksResponse, analyticsResponse] = await Promise.all([
        taskService.getAll(),
        taskService.getAnalytics()
      ]);
      setTasks(tasksResponse.data);
      setAnalytics(analyticsResponse.data);
    } catch (error) {
      console.error('Error loading data:', error);
      showSnackbar('Error loading tasks', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (mode, task = null) => {
    setDialogMode(mode);
    if (mode === 'edit' && task) {
      setSelectedTask(task);
      setFormData({
        title: task.title,
        description: task.description,
        assigneeId: task.assigneeId.toString(),
        mentorId: task.mentorId.toString(),
        dueDate: task.dueDate,
        priority: task.priority,
        category: task.category,
        estimatedHours: task.estimatedHours.toString(),
        status: task.status
      });
    } else {
      setSelectedTask(null);
      setFormData({
        title: '',
        description: '',
        assigneeId: '',
        mentorId: '',
        dueDate: '',
        priority: 'medium',
        category: '',
        estimatedHours: '',
        status: 'planning'
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTask(null);
  };

  const handleSubmit = async () => {
    try {
      const taskData = {
        ...formData,
        assigneeId: parseInt(formData.assigneeId),
        mentorId: parseInt(formData.mentorId),
        estimatedHours: parseInt(formData.estimatedHours)
      };

      if (dialogMode === 'add') {
        await taskService.create(taskData);
        showSnackbar('Task created successfully', 'success');
      } else {
        await taskService.update(selectedTask.id, taskData);
        showSnackbar('Task updated successfully', 'success');
      }

      handleCloseDialog();
      loadData();
    } catch (error) {
      console.error('Error saving task:', error);
      showSnackbar('Error saving task', 'error');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.delete(taskId);
        showSnackbar('Task deleted successfully', 'success');
        loadData();
      } catch (error) {
        console.error('Error deleting task:', error);
        showSnackbar('Error deleting task', 'error');
      }
    }
  };

  const handleUpdateProgress = async (taskId, progress) => {
    try {
      await taskService.updateProgress(taskId, progress);
      showSnackbar('Progress updated successfully', 'success');
      loadData();
    } catch (error) {
      console.error('Error updating progress:', error);
      showSnackbar('Error updating progress', 'error');
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in-progress':
        return 'primary';
      case 'planning':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon color="success" />;
      case 'in-progress':
        return <PlayArrowIcon color="primary" />;
      case 'planning':
        return <PendingIcon color="warning" />;
      default:
        return <PendingIcon />;
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filterStatus !== 'all' && task.status !== filterStatus) return false;
    if (filterPriority !== 'all' && task.priority !== filterPriority) return false;
    if (filterCategory !== 'all' && task.category !== filterCategory) return false;
    if (!showCompleted && task.status === 'completed') return false;
    return true;
  });

  const getDaysUntilDue = (dueDate) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const isOverdue = (dueDate, status) => {
    return getDaysUntilDue(dueDate) < 0 && status !== 'completed';
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress />
        <Typography sx={{ mt: 2, textAlign: 'center' }}>
          Loading tasks...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Task Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog('add')}
        >
          Add New Task
        </Button>
      </Box>

      {/* Analytics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AssignmentIcon color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6">{analytics.totalTasks}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Tasks
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CheckCircleIcon color="success" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6">{analytics.completedTasks}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Completed
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PlayArrowIcon color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6">{analytics.inProgressTasks}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    In Progress
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingUpIcon color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6">{analytics.averageProgress}%</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Avg. Progress
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filterStatus}
              label="Status"
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="planning">Planning</MenuItem>
              <MenuItem value="in-progress">In Progress</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Priority</InputLabel>
            <Select
              value={filterPriority}
              label="Priority"
              onChange={(e) => setFilterPriority(e.target.value)}
            >
              <MenuItem value="all">All Priority</MenuItem>
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="low">Low</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={filterCategory}
              label="Category"
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <MenuItem value="all">All Categories</MenuItem>
              <MenuItem value="Training">Training</MenuItem>
              <MenuItem value="Design">Design</MenuItem>
              <MenuItem value="Marketing">Marketing</MenuItem>
              <MenuItem value="Development">Development</MenuItem>
              <MenuItem value="Research">Research</MenuItem>
              <MenuItem value="Content">Content</MenuItem>
              <MenuItem value="Documentation">Documentation</MenuItem>
              <MenuItem value="Analysis">Analysis</MenuItem>
            </Select>
          </FormControl>
          <FormControlLabel
            control={
              <Switch
                checked={showCompleted}
                onChange={(e) => setShowCompleted(e.target.checked)}
              />
            }
            label="Show Completed"
          />
        </Box>
      </Paper>

      {/* Tasks Grid */}
      <Grid container spacing={3}>
        {filteredTasks.map((task) => (
          <Grid item xs={12} md={6} key={task.id}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                border: isOverdue(task.dueDate, task.status) ? '2px solid #f44336' : 'none'
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {task.title}
                  </Typography>
                  <Box>
                    <Chip
                      label={task.status}
                      color={getStatusColor(task.status)}
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    <Chip
                      label={task.priority}
                      color={getPriorityColor(task.priority)}
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog('edit', task)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>

                <Typography variant="body2" color="text.secondary" paragraph>
                  {task.description}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <PersonIcon sx={{ mr: 1, fontSize: 16 }} />
                  <Typography variant="body2">
                    {task.assigneeName}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CategoryIcon sx={{ mr: 1, fontSize: 16 }} />
                  <Typography variant="body2">
                    {task.category}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CalendarTodayIcon sx={{ mr: 1, fontSize: 16 }} />
                  <Typography 
                    variant="body2" 
                    color={isOverdue(task.dueDate, task.status) ? 'error' : 'text.secondary'}
                  >
                    Due: {task.dueDate} 
                    {isOverdue(task.dueDate, task.status) && 
                      ` (${Math.abs(getDaysUntilDue(task.dueDate))} days overdue)`
                    }
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AccessTimeIcon sx={{ mr: 1, fontSize: 16 }} />
                  <Typography variant="body2">
                    {task.actualHours}/{task.estimatedHours} hours
                  </Typography>
                </Box>

                {/* Progress Bar */}
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Progress</Typography>
                    <Typography variant="body2">{task.progress}%</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={task.progress} 
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>

                {/* Progress Slider */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    Update Progress
                  </Typography>
                  <Slider
                    value={task.progress}
                    onChange={(e, value) => handleUpdateProgress(task.id, value)}
                    valueLabelDisplay="auto"
                    step={5}
                    marks
                    min={0}
                    max={100}
                  />
                </Box>

                {/* Attachments */}
                {task.attachments.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                      Attachments ({task.attachments.length}):
                    </Typography>
                    <List dense>
                      {task.attachments.map((attachment, index) => (
                        <ListItem key={index} sx={{ py: 0 }}>
                          <ListItemIcon>
                            <AttachFileIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary={attachment} />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}

                {/* Comments */}
                {task.comments.length > 0 && (
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        Comments ({task.comments.length})
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <List dense>
                        {task.comments.map((comment) => (
                          <ListItem key={comment.id} sx={{ py: 0 }}>
                            <ListItemText
                              primary={comment.text}
                              secondary={`${comment.author} - ${new Date(comment.timestamp).toLocaleDateString()}`}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </AccordionDetails>
                  </Accordion>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add/Edit Task Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {dialogMode === 'add' ? 'Create New Task' : 'Edit Task'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Task Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Assignee ID"
                type="number"
                value={formData.assigneeId}
                onChange={(e) => setFormData({ ...formData, assigneeId: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Mentor ID"
                type="number"
                value={formData.mentorId}
                onChange={(e) => setFormData({ ...formData, mentorId: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Due Date"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Estimated Hours"
                type="number"
                value={formData.estimatedHours}
                onChange={(e) => setFormData({ ...formData, estimatedHours: e.target.value })}
              />
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={formData.priority}
                  label="Priority"
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                >
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category}
                  label="Category"
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <MenuItem value="Training">Training</MenuItem>
                  <MenuItem value="Design">Design</MenuItem>
                  <MenuItem value="Marketing">Marketing</MenuItem>
                  <MenuItem value="Development">Development</MenuItem>
                  <MenuItem value="Research">Research</MenuItem>
                  <MenuItem value="Content">Content</MenuItem>
                  <MenuItem value="Documentation">Documentation</MenuItem>
                  <MenuItem value="Analysis">Analysis</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  label="Status"
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <MenuItem value="planning">Planning</MenuItem>
                  <MenuItem value="in-progress">In Progress</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {dialogMode === 'add' ? 'Create Task' : 'Update Task'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Tasks;