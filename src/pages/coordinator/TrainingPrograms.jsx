import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
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
  Divider,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  People as PeopleIcon,
  Schedule as ScheduleIcon,
  School as SchoolIcon
} from '@mui/icons-material';
import trainingService from '../../services/trainingService';

const TrainingPrograms = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [dialogMode, setDialogMode] = useState('add'); // 'add' or 'edit'
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    maxParticipants: '',
    startDate: '',
    endDate: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    loadPrograms();
  }, []);

  const loadPrograms = async () => {
    try {
      setLoading(true);
      const response = await trainingService.getAllPrograms();
      setPrograms(response.data);
    } catch (error) {
      console.error('Error loading programs:', error);
      showSnackbar('Error loading programs', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (mode, program = null) => {
    setDialogMode(mode);
    if (mode === 'edit' && program) {
      setSelectedProgram(program);
      setFormData({
        title: program.title,
        description: program.description,
        duration: program.duration,
        maxParticipants: program.maxParticipants.toString(),
        startDate: program.startDate,
        endDate: program.endDate
      });
    } else {
      setSelectedProgram(null);
      setFormData({
        title: '',
        description: '',
        duration: '',
        maxParticipants: '',
        startDate: '',
        endDate: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProgram(null);
    setFormData({
      title: '',
      description: '',
      duration: '',
      maxParticipants: '',
      startDate: '',
      endDate: ''
    });
  };

  const handleSubmit = async () => {
    try {
      const programData = {
        ...formData,
        maxParticipants: parseInt(formData.maxParticipants),
        coordinatorId: 5, // Current coordinator ID
        mentors: [],
        modules: []
      };

      if (dialogMode === 'add') {
        await trainingService.createProgram(programData);
        showSnackbar('Program created successfully', 'success');
      } else {
        await trainingService.updateProgram(selectedProgram.id, programData);
        showSnackbar('Program updated successfully', 'success');
      }

      handleCloseDialog();
      loadPrograms();
    } catch (error) {
      console.error('Error saving program:', error);
      showSnackbar('Error saving program', 'error');
    }
  };

  const handleDeleteProgram = async (programId) => {
    if (window.confirm('Are you sure you want to delete this program?')) {
      try {
        await trainingService.deleteProgram(programId);
        showSnackbar('Program deleted successfully', 'success');
        loadPrograms();
      } catch (error) {
        console.error('Error deleting program:', error);
        showSnackbar('Error deleting program', 'error');
      }
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

  const handleViewModules = (programId) => {
    const program = programs.find(p => p.id === programId);
    if (program) {
      alert(`Modules for ${program.title}:\n${program.modules.map(m => `- ${m.title} (${m.duration})`).join('\n')}`);
    }
  };

  const handleManageParticipants = (programId) => {
    const program = programs.find(p => p.id === programId);
    if (program) {
      alert(`Managing participants for ${program.title}\nCurrent: ${program.currentParticipants}/${program.maxParticipants}`);
    }
  };

  // Status display removed

  const getEnrollmentPercentage = (current, max) => {
    return Math.round((current / max) * 100);
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Loading training programs...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Chương trình đào tạo
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog('add')}
        >
          Thêm chương trình đào tạo
        </Button>
      </Box>

      <Grid container spacing={3}>
        {programs.map((program) => (
          <Grid item xs={12} md={6} key={program.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {program.title}
                  </Typography>
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog('edit', program)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteProgram(program.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>

                <Typography variant="body2" color="text.secondary" paragraph>
                  {program.description}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <ScheduleIcon sx={{ mr: 1, fontSize: 16 }} />
                  <Typography variant="body2">
                    {program.duration} • {program.startDate} - {program.endDate}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PeopleIcon sx={{ mr: 1, fontSize: 16 }} />
                  <Typography variant="body2">
                    {program.currentParticipants}/{program.maxParticipants} participants
                    ({getEnrollmentPercentage(program.currentParticipants, program.maxParticipants)}%)
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Modules ({program.modules.length}):
                  </Typography>
                  <List dense>
                    {program.modules.slice(0, 3).map((module) => (
                      <ListItem key={module.id} sx={{ py: 0 }}>
                        <ListItemText
                          primary={module.title}
                          secondary={`${module.duration} • ${module.topics.length} topics`}
                        />
                      </ListItem>
                    ))}
                    {program.modules.length > 3 && (
                      <ListItem sx={{ py: 0 }}>
                        <ListItemText
                          primary={`+${program.modules.length - 3} more modules`}
                          sx={{ fontStyle: 'italic' }}
                        />
                      </ListItem>
                    )}
                  </List>
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<SchoolIcon />}
                    onClick={() => handleViewModules(program.id)}
                  >
                    Xem modules
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<PeopleIcon />}
                    onClick={() => handleManageParticipants(program.id)}
                  >
                    Quản lý tham gia
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add/Edit Program Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {dialogMode === 'add' ? 'Add New Training Program' : 'Edit Training Program'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Program Title"
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
                label="Duration"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="e.g., 8 weeks"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Max Participants"
                type="number"
                value={formData.maxParticipants}
                onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="End Date"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            {/* Status field removed */}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy bỏ</Button>
          <Button onClick={handleSubmit} variant="contained">
            {dialogMode === 'add' ? 'Create Program' : 'Cập nhật Program'}
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

export default TrainingPrograms;