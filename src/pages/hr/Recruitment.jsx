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
  Badge
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  CheckCircle as CheckCircleIcon,
  TrendingUp as TrendingUpIcon,
  Assignment as AssignmentIcon,
  LocationOn as LocationOnIcon,
  CalendarToday as CalendarTodayIcon
} from '@mui/icons-material';
import recruitmentService from '../../services/recruitmentService';

const Recruitment = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [dialogMode, setDialogMode] = useState('add');
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    positions: '',
    startDate: '',
    endDate: '',
    requirements: [''],
    benefits: ['']
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
      const [campaignsResponse, interviewsResponse] = await Promise.all([
        recruitmentService.getAllCampaigns(),
        recruitmentService.getAllInterviews()
      ]);
      setCampaigns(campaignsResponse.data);
      setInterviews(interviewsResponse.data);
    } catch (error) {
      console.error('Error loading data:', error);
      showSnackbar('Error loading recruitment data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (mode, campaign = null) => {
    setDialogMode(mode);
    if (mode === 'edit' && campaign) {
      setSelectedCampaign(campaign);
      setFormData({
        title: campaign.title,
        department: campaign.department,
        positions: campaign.positions.toString(),
        startDate: campaign.startDate,
        endDate: campaign.endDate,
        requirements: campaign.requirements,
        benefits: campaign.benefits
      });
    } else {
      setSelectedCampaign(null);
      setFormData({
        title: '',
        department: '',
        positions: '',
        startDate: '',
        endDate: '',
        requirements: [''],
        benefits: ['']
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCampaign(null);
  };

  const handleSubmit = async () => {
    try {
      const campaignData = {
        ...formData,
        positions: parseInt(formData.positions),
        createdBy: 3 // Current HR user ID
      };

      if (dialogMode === 'add') {
        await recruitmentService.createCampaign(campaignData);
        showSnackbar('Campaign created successfully', 'success');
      } else {
        await recruitmentService.updateCampaign(selectedCampaign.id, campaignData);
        showSnackbar('Campaign updated successfully', 'success');
      }

      handleCloseDialog();
      loadData();
    } catch (error) {
      console.error('Error saving campaign:', error);
      showSnackbar('Error saving campaign', 'error');
    }
  };

  const handleDeleteCampaign = async (campaignId) => {
    if (window.confirm('Bạn có chắc muốn xóa chiến dịch này không?')) {
      try {
        await recruitmentService.deleteCampaign(campaignId);
        showSnackbar('Campaign deleted successfully', 'success');
        loadData();
      } catch (error) {
        console.error('Error deleting campaign:', error);
        showSnackbar('Error deleting campaign', 'error');
      }
    }
  };

  const addRequirement = () => {
    setFormData({
      ...formData,
      requirements: [...formData.requirements, '']
    });
  };

  const removeRequirement = (index) => {
    const newRequirements = formData.requirements.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      requirements: newRequirements
    });
  };

  const updateRequirement = (index, value) => {
    const newRequirements = [...formData.requirements];
    newRequirements[index] = value;
    setFormData({
      ...formData,
      requirements: newRequirements
    });
  };

  const addBenefit = () => {
    setFormData({
      ...formData,
      benefits: [...formData.benefits, '']
    });
  };

  const removeBenefit = (index) => {
    const newBenefits = formData.benefits.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      benefits: newBenefits
    });
  };

  const updateBenefit = (index, value) => {
    const newBenefits = [...formData.benefits];
    newBenefits[index] = value;
    setFormData({
      ...formData,
      benefits: newBenefits
    });
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

  // Removed actions: View Applications & Schedule Interviews

  const getApplicationRatio = (applications, positions) => {
    return positions > 0 ? (applications / positions).toFixed(1) : 0;
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress />
        <Typography sx={{ mt: 2, textAlign: 'center' }}>
          Loading recruitment data...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Quản lý tuyển dụng
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog('add')}
        >
          Tạo chiến dịch
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
                  <Typography variant="h6">{campaigns.length}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tổng chiến dịch
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
                  <Typography variant="h6">
                    {campaigns.filter(c => c.status === 'active').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Đang hoạt động
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
                <PeopleIcon color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6">
                    {campaigns.reduce((sum, c) => sum + c.applications, 0)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tổng đơn ứng tuyển
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        {/* Removed card: Ứng tuyển/Vị trí (TB) */}
      </Grid>

      {/* Campaigns Grid */}
      <Grid container spacing={3}>
        {campaigns.map((campaign) => (
          <Grid item xs={12} md={6} key={campaign.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {campaign.title}
                  </Typography>
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog('edit', campaign)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteCampaign(campaign.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <BusinessIcon sx={{ mr: 1, fontSize: 16 }} />
                  <Typography variant="body2">
                    {campaign.department}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CalendarTodayIcon sx={{ mr: 1, fontSize: 16 }} />
                  <Typography variant="body2">
                    {campaign.startDate} - {campaign.endDate}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PeopleIcon sx={{ mr: 1, fontSize: 16 }} />
                  <Typography variant="body2">
                    {campaign.applications} đơn cho {campaign.positions} vị trí
                    (tỉ lệ {getApplicationRatio(campaign.applications, campaign.positions)}:1)
                  </Typography>
                </Box>

                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      Yêu cầu ({campaign.requirements.length})
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List dense>
                      {campaign.requirements.map((req, index) => (
                        <ListItem key={index} sx={{ py: 0 }}>
                          <ListItemIcon>
                            <CheckCircleIcon color="primary" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary={req} />
                        </ListItem>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>

                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      Lợi ích ({campaign.benefits.length})
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List dense>
                      {campaign.benefits.map((benefit, index) => (
                        <ListItem key={index} sx={{ py: 0 }}>
                          <ListItemIcon>
                            <TrendingUpIcon color="success" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary={benefit} />
                        </ListItem>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>

                {/* Actions removed: View Applications & Schedule Interviews */}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add/Edit Campaign Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {dialogMode === 'add' ? 'Create New Campaign' : 'Chỉnh sửa'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tiêu đề"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Phòng</InputLabel>
                <Select
                  value={formData.department}
                  label="Phòng"
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                >
                  <MenuItem value="Engineering">Engineering</MenuItem>
                  <MenuItem value="Marketing">Marketing</MenuItem>
                  <MenuItem value="Sales">Sales</MenuItem>
                  <MenuItem value="HR">HR</MenuItem>
                  <MenuItem value="Finance">Finance</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Số Lượng"
                type="number"
                value={formData.positions}
                onChange={(e) => setFormData({ ...formData, positions: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Ngày băt đầu"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Ngày Kết thúc"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            {/* Status field removed */}

            {/* Requirements */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Yêu cầu
              </Typography>
              {formData.requirements.map((req, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <TextField
                    fullWidth
                    label={`Requirement ${index + 1}`}
                    value={req}
                    onChange={(e) => updateRequirement(index, e.target.value)}
                  />
                  <IconButton
                    color="error"
                    onClick={() => removeRequirement(index)}
                    disabled={formData.requirements.length === 1}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
              <Button
                variant="outlined"
                size="small"
                onClick={addRequirement}
                startIcon={<AddIcon />}
              >
                Add Requirement
              </Button>
            </Grid>

            {/* Benefits */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Lợi ích
              </Typography>
              {formData.benefits.map((benefit, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <TextField
                    fullWidth
                    label={`Benefit ${index + 1}`}
                    value={benefit}
                    onChange={(e) => updateBenefit(index, e.target.value)}
                  />
                  <IconButton
                    color="error"
                    onClick={() => removeBenefit(index)}
                    disabled={formData.benefits.length === 1}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
              <Button
                variant="outlined"
                size="small"
                onClick={addBenefit}
                startIcon={<AddIcon />}
              >
                Add Benefit
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy bỏ</Button>
          <Button onClick={handleSubmit} variant="contained">
            {dialogMode === 'add' ? 'Create Campaign' : 'Câp nhật'}
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

export default Recruitment;
