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
  Button,
  IconButton,
  Chip,
  TextField,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Tooltip,
  Alert,
  Snackbar,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Badge
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Engineering as EngineeringIcon,
  Business as BusinessIcon,
  Science as ScienceIcon,
  Palette as ArtIcon
} from '@mui/icons-material';
import internService from '../../services/internService';

const InternProfiles = () => {
  const [interns, setInterns] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedIntern, setSelectedIntern] = useState(null);
  const [dialogMode, setDialogMode] = useState('add');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterYear, setFilterYear] = useState('all');

  // Using internService instead of duplicate mock data
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadInterns();
  }, []);

  const loadInterns = async () => {
    try {
      setLoading(true);
      const response = await internService.getAll();
      setInterns(response.data || []);
    } catch (error) {
      console.error('Error loading interns:', error);
      showSnackbar('Không thể tải danh sách thực tập sinh', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (mode, intern = null) => {
    setDialogMode(mode);
    setSelectedIntern(intern);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedIntern(null);
  };

  const handleSubmitIntern = async (internData) => {
    try {
      if (dialogMode === 'add') {
        const newIntern = {
          ...internData,
          status: 'pending',
          startDate: new Date().toISOString().split('T')[0]
        };
        await internService.create(newIntern);
        showSnackbar('Hồ sơ thực tập sinh đã được tạo thành công!', 'success');
      } else {
        await internService.update(selectedIntern.id, internData);
        showSnackbar('Hồ sơ thực tập sinh đã được cập nhật thành công!', 'success');
      }
      await loadInterns(); // Reload data
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving intern:', error);
      showSnackbar('Không thể lưu hồ sơ thực tập sinh', 'error');
    }
  };

  const handleDeleteIntern = async (internId) => {
    if (window.confirm('Bạn có chắc muốn xóa hồ sơ này?')) {
      try {
        await internService.delete(internId);
        showSnackbar('Hồ sơ thực tập sinh đã được xóa thành công!', 'success');
        await loadInterns(); // Reload data
      } catch (error) {
        console.error('Error deleting intern:', error);
        showSnackbar('Không thể xóa hồ sơ thực tập sinh', 'error');
      }
    }
  };

  const handleStatusChange = async (internId, newStatus) => {
    try {
      await internService.update(internId, { status: newStatus });
      showSnackbar('Trạng thái thực tập sinh đã được cập nhật!', 'success');
      await loadInterns(); // Reload data
    } catch (error) {
      console.error('Error updating intern status:', error);
      showSnackbar('Không thể cập nhật trạng thái thực tập sinh', 'error');
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'pending': return 'warning';
      case 'completed': return 'info';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Đang thực tập';
      case 'pending': return 'Chờ phê duyệt';
      case 'completed': return 'Hoàn thành';
      case 'rejected': return 'Từ chối';
      default: return status;
    }
  };

  const getDepartmentIcon = (department) => {
    switch (department) {
      case 'Engineering': return <EngineeringIcon />;
      case 'Business': return <BusinessIcon />;
      case 'Data Science': return <ScienceIcon />;
      case 'Design': return <ArtIcon />;
      case 'IT': return <EngineeringIcon />;
      case 'International Business': return <BusinessIcon />;
      default: return <PersonIcon />;
    }
  };

  const filteredInterns = interns.filter(intern => {
    const matchesSearch = intern.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         intern.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         intern.university.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === 'all' || intern.department === filterDepartment;
    const matchesStatus = filterStatus === 'all' || intern.status === filterStatus;
    const matchesYear = filterYear === 'all' || intern.year.toString() === filterYear;
    return matchesSearch && matchesDepartment && matchesStatus && matchesYear;
  });

  const internStats = {
    total: interns.length,
    active: interns.filter(i => i.status === 'active').length,
    pending: interns.filter(i => i.status === 'pending').length,
    completed: interns.filter(i => i.status === 'completed').length,
    engineering: interns.filter(i => i.department === 'Engineering').length,
    business: interns.filter(i => i.department === 'Business').length,
    design: interns.filter(i => i.department === 'Design').length
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Quản lý hồ sơ thực tập sinh
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog('add')}
        >
          Thêm thực tập sinh
        </Button>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {internStats.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tổng số
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main">
                {internStats.active}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Đang thực tập
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main">
                {internStats.pending}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Chờ phê duyệt
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="info.main">
                {internStats.completed}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Hoàn thành
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="secondary.main">
                {internStats.engineering}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Kỹ thuật
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="error.main">
                {internStats.business}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Kinh doanh
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              size="small"
              placeholder="Tìm kiếm theo tên, email, trường..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
              }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
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
                <MenuItem value="Data Science">Khoa học dữ liệu</MenuItem>
                <MenuItem value="Design">Thiết kế</MenuItem>
                <MenuItem value="IT">CNTT</MenuItem>
                <MenuItem value="International Business">Kinh doanh quốc tế</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                label="Trạng thái"
              >
                <MenuItem value="all">Tất cả</MenuItem>
                <MenuItem value="active">Đang thực tập</MenuItem>
                <MenuItem value="pending">Chờ phê duyệt</MenuItem>
                <MenuItem value="completed">Hoàn thành</MenuItem>
                <MenuItem value="rejected">Từ chối</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Năm học</InputLabel>
              <Select
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                label="Năm học"
              >
                <MenuItem value="all">Tất cả</MenuItem>
                <MenuItem value="1">Năm 1</MenuItem>
                <MenuItem value="2">Năm 2</MenuItem>
                <MenuItem value="3">Năm 3</MenuItem>
                <MenuItem value="4">Năm 4</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => {
                setSearchTerm('');
                setFilterDepartment('all');
                setFilterStatus('all');
                setFilterYear('all');
              }}
              fullWidth
            >
              Làm mới
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Interns Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'grey.100' }}>
              <TableCell><strong>Thông tin cá nhân</strong></TableCell>
              <TableCell><strong>Học vấn</strong></TableCell>
              <TableCell><strong>Vị trí & Phòng ban</strong></TableCell>
              <TableCell><strong>Trạng thái</strong></TableCell>
              <TableCell><strong>Kỹ năng & Ngôn ngữ</strong></TableCell>
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
                      <Typography variant="caption" color="text.secondary" display="block">
                        {intern.email}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {intern.phone}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2" fontWeight="bold">
                      {intern.university}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      {intern.major} - Năm {intern.year}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      GPA: {intern.gpa}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2" fontWeight="bold">
                      {intern.position}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                      {getDepartmentIcon(intern.department)}
                      <Typography variant="caption" color="text.secondary">
                        {intern.department}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box>
                    <Chip
                      label={getStatusText(intern.status)}
                      color={getStatusColor(intern.status)}
                      size="small"
                      sx={{ mb: 1 }}
                    />
                    <Typography variant="caption" color="text.secondary" display="block">
                      {intern.startDate} - {intern.endDate}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 1 }}>
                      {intern.skills.slice(0, 3).map((skill, index) => (
                        <Chip key={index} label={skill} size="small" variant="outlined" />
                      ))}
                      {intern.skills.length > 3 && (
                        <Chip label={`+${intern.skills.length - 3}`} size="small" />
                      )}
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {(intern.languages && Array.isArray(intern.languages)) ? intern.languages.join(', ') : ''}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Tooltip title="Xem chi tiết">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog('view', intern)}
                      >
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Chỉnh sửa">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleOpenDialog('edit', intern)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Thay đổi trạng thái">
                      <FormControl size="small" sx={{ minWidth: 120 }}>
                        <Select
                          value={intern.status}
                          onChange={(e) => handleStatusChange(intern.id, e.target.value)}
                          size="small"
                        >
                          <MenuItem value="pending">Chờ phê duyệt</MenuItem>
                          <MenuItem value="active">Đang thực tập</MenuItem>
                          <MenuItem value="completed">Hoàn thành</MenuItem>
                          <MenuItem value="rejected">Từ chối</MenuItem>
                        </Select>
                      </FormControl>
                    </Tooltip>
                    <Tooltip title="Xóa hồ sơ">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteIntern(intern.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Intern Detail Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {dialogMode === 'add' ? 'Thêm thực tập sinh mới' : 
           dialogMode === 'edit' ? 'Chỉnh sửa hồ sơ' : 'Chi tiết hồ sơ'}
        </DialogTitle>
        <DialogContent>
          <InternForm
            mode={dialogMode}
            intern={selectedIntern}
            onSubmit={handleSubmitIntern}
            onClose={handleCloseDialog}
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

// Intern Form Component
const InternForm = ({ mode, intern, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    name: intern?.name || '',
    email: intern?.email || '',
    phone: intern?.phone || '',
    university: intern?.university || '',
    major: intern?.major || '',
    year: intern?.year || 3,
    gpa: intern?.gpa || 3.0,
    department: intern?.department || 'Engineering',
    position: intern?.position || '',
    skills: intern?.skills || [],
    languages: intern?.languages || ['Tiếng Việt', 'Tiếng Anh']
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
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>Thông tin cá nhân</Typography>
            <List dense>
              <ListItem>
                <ListItemIcon><PersonIcon /></ListItemIcon>
                <ListItemText primary="Họ tên" secondary={intern.name} />
              </ListItem>
              <ListItem>
                <ListItemIcon><EmailIcon /></ListItemIcon>
                <ListItemText primary="Email" secondary={intern.email} />
              </ListItem>
              <ListItem>
                <ListItemIcon><PhoneIcon /></ListItemIcon>
                <ListItemText primary="Số điện thoại" secondary={intern.phone} />
              </ListItem>
              <ListItem>
                <ListItemIcon><LocationIcon /></ListItemIcon>
                <ListItemText primary="Địa chỉ" secondary={intern.address} />
              </ListItem>
            </List>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>Học vấn</Typography>
            <List dense>
              <ListItem>
                <ListItemIcon><SchoolIcon /></ListItemIcon>
                <ListItemText primary="Trường đại học" secondary={intern.university} />
              </ListItem>
              <ListItem>
                <ListItemIcon><WorkIcon /></ListItemIcon>
                <ListItemText primary="Chuyên ngành" secondary={intern.major} />
              </ListItem>
              <ListItem>
                <ListItemIcon><CalendarIcon /></ListItemIcon>
                <ListItemText primary="Năm học" secondary={`Năm ${intern.year}`} />
              </ListItem>
              <ListItem>
                <ListItemIcon><PersonIcon /></ListItemIcon>
                <ListItemText primary="GPA" secondary={intern.gpa} />
              </ListItem>
            </List>
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>Kỹ năng & Ngôn ngữ</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
              {intern.skills.map((skill, index) => (
                <Chip key={index} label={skill} color="primary" variant="outlined" />
              ))}
            </Box>
            <Typography variant="body2" color="text.secondary">
              Ngôn ngữ: {intern.languages.join(', ')}
            </Typography>
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>Ghi chú</Typography>
            <Typography variant="body2" color="text.secondary">
              {intern.notes}
            </Typography>
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
            label="Họ tên đầy đủ"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          
          <TextField
            fullWidth
            label="Số điện thoại"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            sx={{ mb: 2 }}
          />
          
          <TextField
            fullWidth
            label="Trường đại học"
            value={formData.university}
            onChange={(e) => handleChange('university', e.target.value)}
            required
            sx={{ mb: 2 }}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Chuyên ngành"
            value={formData.major}
            onChange={(e) => handleChange('major', e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Năm học</InputLabel>
            <Select
              value={formData.year}
              onChange={(e) => handleChange('year', e.target.value)}
              label="Năm học"
            >
              <MenuItem value={1}>Năm 1</MenuItem>
              <MenuItem value={2}>Năm 2</MenuItem>
              <MenuItem value={3}>Năm 3</MenuItem>
              <MenuItem value={4}>Năm 4</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            fullWidth
            label="GPA"
            type="number"
            inputProps={{ min: 0, max: 4, step: 0.1 }}
            value={formData.gpa}
            onChange={(e) => handleChange('gpa', parseFloat(e.target.value))}
            sx={{ mb: 2 }}
          />
          
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Phòng ban</InputLabel>
            <Select
              value={formData.department}
              onChange={(e) => handleChange('department', e.target.value)}
              label="Phòng ban"
            >
              <MenuItem value="Engineering">Kỹ thuật</MenuItem>
              <MenuItem value="Business">Kinh doanh</MenuItem>
              <MenuItem value="Data Science">Khoa học dữ liệu</MenuItem>
              <MenuItem value="Design">Thiết kế</MenuItem>
              <MenuItem value="IT">CNTT</MenuItem>
              <MenuItem value="International Business">Kinh doanh quốc tế</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Vị trí thực tập"
            value={formData.position}
            onChange={(e) => handleChange('position', e.target.value)}
            required
            sx={{ mb: 2 }}
          />
        </Grid>
      </Grid>
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
        <Button onClick={onClose}>Hủy</Button>
        <Button type="submit" variant="contained">
          {mode === 'add' ? 'Thêm thực tập sinh' : 'Cập nhật'}
        </Button>
      </Box>
    </Box>
  );
};

export default InternProfiles;
