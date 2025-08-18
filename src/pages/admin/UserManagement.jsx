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
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  Grid,
  Card,
  CardContent,
  Avatar,
  Tooltip
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Visibility as ViewIcon,
  Lock as LockIcon,
  LockOpen as UnlockIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const UserManagement = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [dialogMode, setDialogMode] = useState('add');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Enhanced mock data for user management
  const mockUsers = [
    {
      id: 1,
      name: 'System Administrator',
      email: 'admin@ims.com',
      role: 'ADMIN',
      status: 'active',
      department: 'IT',
      lastLogin: '2024-01-20T10:30:00Z',
      createdAt: '2023-01-01T00:00:00Z',
      permissions: ['all'],
      twoFactorEnabled: true,
      emailVerified: true,
      phone: '+84 123 456 789',
      avatar: 'SA'
    },
    {
      id: 2,
      name: 'HR Manager',
      email: 'hr.manager@ims.com',
      role: 'HR',
      status: 'active',
      department: 'Human Resources',
      lastLogin: '2024-01-20T09:15:00Z',
      createdAt: '2023-02-01T00:00:00Z',
      permissions: ['hr_management', 'intern_management', 'reports'],
      twoFactorEnabled: false,
      emailVerified: true,
      phone: '+84 987 654 321',
      avatar: 'HM'
    },
    {
      id: 3,
      name: 'Senior Developer Mentor',
      email: 'dev.mentor@ims.com',
      role: 'MENTOR',
      status: 'active',
      department: 'Engineering',
      lastLogin: '2024-01-19T16:45:00Z',
      createdAt: '2023-03-01T00:00:00Z',
      permissions: ['intern_management', 'skill_assessment', 'communication'],
      twoFactorEnabled: true,
      emailVerified: true,
      phone: '+84 555 123 456',
      avatar: 'SM'
    },
    {
      id: 4,
      name: 'Internship Coordinator',
      email: 'coordinator@ims.com',
      role: 'COORDINATOR',
      status: 'active',
      department: 'Training',
      lastLogin: '2024-01-20T08:30:00Z',
      createdAt: '2023-04-01T00:00:00Z',
      permissions: ['training_management', 'interview_scheduling', 'performance_tracking'],
      twoFactorEnabled: false,
      emailVerified: true,
      phone: '+84 777 888 999',
      avatar: 'IC'
    },
    {
      id: 5,
      name: 'Software Dev Intern',
      email: 'dev.intern@ims.com',
      role: 'INTERN',
      status: 'active',
      department: 'Engineering',
      lastLogin: '2024-01-20T07:20:00Z',
      createdAt: '2023-06-01T00:00:00Z',
      permissions: ['task_management', 'skill_tracking', 'feedback'],
      twoFactorEnabled: false,
      emailVerified: true,
      phone: '+84 111 222 333',
      avatar: 'SD'
    },
    {
      id: 6,
      name: 'Inactive User',
      email: 'inactive@ims.com',
      role: 'INTERN',
      status: 'inactive',
      department: 'Marketing',
      lastLogin: '2023-12-15T10:00:00Z',
      createdAt: '2023-05-01T00:00:00Z',
      permissions: ['basic_access'],
      twoFactorEnabled: false,
      emailVerified: false,
      phone: '+84 444 555 666',
      avatar: 'IU'
    }
  ];

  useEffect(() => {
    setUsers(mockUsers);
  }, []);

  const handleOpenDialog = (mode, user = null) => {
    setDialogMode(mode);
    setSelectedUser(user);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
  };

  const handleSubmitUser = (userData) => {
    if (dialogMode === 'add') {
      const newUser = {
        id: Date.now(),
        ...userData,
        status: 'active',
        createdAt: new Date().toISOString(),
        lastLogin: null,
        emailVerified: false,
        twoFactorEnabled: false
      };
      setUsers([...users, newUser]);
      showSnackbar('Người dùng đã được tạo thành công!', 'success');
    } else {
      const updatedUsers = users.map(user => 
        user.id === selectedUser.id ? { ...user, ...userData } : user
      );
      setUsers(updatedUsers);
      showSnackbar('Người dùng đã được cập nhật thành công!', 'success');
    }
    handleCloseDialog();
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Bạn có chắc muốn xóa người dùng này?')) {
      const updatedUsers = users.filter(user => user.id !== userId);
      setUsers(updatedUsers);
      showSnackbar('Người dùng đã được xóa thành công!', 'success');
    }
  };

  const handleToggleStatus = (userId) => {
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' } : user
    );
    setUsers(updatedUsers);
    showSnackbar('Trạng thái người dùng đã được cập nhật!', 'success');
  };

  const handleToggleTwoFactor = (userId) => {
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, twoFactorEnabled: !user.twoFactorEnabled } : user
    );
    setUsers(updatedUsers);
    showSnackbar('Cài đặt 2FA đã được cập nhật!', 'success');
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'ADMIN': return 'error';
      case 'HR': return 'primary';
      case 'MENTOR': return 'warning';
      case 'COORDINATOR': return 'info';
      case 'INTERN': return 'success';
      default: return 'default';
    }
  };

  const getStatusColor = (status) => {
    return status === 'active' ? 'success' : 'error';
  };

  const getStatusText = (status) => {
    return status === 'active' ? 'Hoạt động' : 'Không hoạt động';
  };

  const getRoleText = (role) => {
    switch (role) {
      case 'ADMIN': return 'Quản trị viên';
      case 'HR': return 'Quản lý nhân sự';
      case 'MENTOR': return 'Mentor';
      case 'COORDINATOR': return 'Điều phối viên';
      case 'INTERN': return 'Thực tập sinh';
      default: return role;
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const userStats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    inactive: users.filter(u => u.status === 'inactive').length,
    admin: users.filter(u => u.role === 'ADMIN').length,
    hr: users.filter(u => u.role === 'HR').length,
    mentor: users.filter(u => u.role === 'MENTOR').length,
    coordinator: users.filter(u => u.role === 'COORDINATOR').length,
    intern: users.filter(u => u.role === 'INTERN').length
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Quản lý người dùng
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog('add')}
        >
          Thêm người dùng
        </Button>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {userStats.total}
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
                {userStats.active}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Hoạt động
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="error.main">
                {userStats.inactive}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Không hoạt động
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main">
                {userStats.mentor}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Mentor
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="info.main">
                {userStats.coordinator}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Điều phối viên
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main">
                {userStats.intern}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Thực tập sinh
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
              placeholder="Tìm kiếm người dùng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Vai trò</InputLabel>
              <Select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                label="Vai trò"
              >
                <MenuItem value="all">Tất cả</MenuItem>
                <MenuItem value="ADMIN">Quản trị viên</MenuItem>
                <MenuItem value="HR">Quản lý nhân sự</MenuItem>
                <MenuItem value="MENTOR">Mentor</MenuItem>
                <MenuItem value="COORDINATOR">Điều phối viên</MenuItem>
                <MenuItem value="INTERN">Thực tập sinh</MenuItem>
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
                <MenuItem value="active">Hoạt động</MenuItem>
                <MenuItem value="inactive">Không hoạt động</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => {
                setSearchTerm('');
                setFilterRole('all');
                setFilterStatus('all');
              }}
              fullWidth
            >
              Làm mới
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Users Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'grey.100' }}>
              <TableCell><strong>Người dùng</strong></TableCell>
              <TableCell><strong>Thông tin liên hệ</strong></TableCell>
              <TableCell><strong>Vai trò & Phòng ban</strong></TableCell>
              <TableCell><strong>Trạng thái</strong></TableCell>
              <TableCell><strong>Bảo mật</strong></TableCell>
              <TableCell><strong>Hoạt động</strong></TableCell>
              <TableCell><strong>Thao tác</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: user.role === 'ADMIN' ? 'error.main' : 'primary.main' }}>
                      {user.avatar}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {user.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ID: {user.id}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2" fontWeight="bold">
                      {user.email}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {user.phone}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box>
                    <Chip
                      label={getRoleText(user.role)}
                      color={getRoleColor(user.role)}
                      size="small"
                      sx={{ mb: 1 }}
                    />
                    <Typography variant="caption" color="text.secondary" display="block">
                      {user.department}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={getStatusText(user.status)}
                    color={getStatusColor(user.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Chip
                      icon={user.twoFactorEnabled ? <CheckCircleIcon /> : <WarningIcon />}
                      label={user.twoFactorEnabled ? '2FA Bật' : '2FA Tắt'}
                      color={user.twoFactorEnabled ? 'success' : 'warning'}
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      icon={user.emailVerified ? <CheckCircleIcon /> : <WarningIcon />}
                      label={user.emailVerified ? 'Email xác thực' : 'Email chưa xác thực'}
                      color={user.emailVerified ? 'success' : 'warning'}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Đăng nhập cuối:
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('vi-VN') : 'Chưa đăng nhập'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Tạo: {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Tooltip title="Xem chi tiết">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog('view', user)}
                      >
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Chỉnh sửa">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleOpenDialog('edit', user)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={user.status === 'active' ? 'Vô hiệu hóa' : 'Kích hoạt'}>
                      <IconButton
                        size="small"
                        color={user.status === 'active' ? 'warning' : 'success'}
                        onClick={() => handleToggleStatus(user.id)}
                      >
                        {user.status === 'active' ? <BlockIcon /> : <CheckCircleIcon />}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={user.twoFactorEnabled ? 'Tắt 2FA' : 'Bật 2FA'}>
                      <IconButton
                        size="small"
                        color={user.twoFactorEnabled ? 'warning' : 'success'}
                        onClick={() => handleToggleTwoFactor(user.id)}
                      >
                        {user.twoFactorEnabled ? <LockIcon /> : <UnlockIcon />}
                      </IconButton>
                    </Tooltip>
                    {user.role !== 'ADMIN' && (
                      <Tooltip title="Xóa người dùng">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* User Detail Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {dialogMode === 'add' ? 'Thêm người dùng mới' : 
           dialogMode === 'edit' ? 'Chỉnh sửa người dùng' : 'Chi tiết người dùng'}
        </DialogTitle>
        <DialogContent>
          <UserForm
            mode={dialogMode}
            user={selectedUser}
            onSubmit={handleSubmitUser}
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

// User Form Component
const UserForm = ({ mode, user, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'INTERN',
    department: user?.department || '',
    phone: user?.phone || '',
    permissions: user?.permissions || []
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
            <Typography variant="subtitle2" color="text.secondary">Tên</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>{user.name}</Typography>
            
            <Typography variant="subtitle2" color="text.secondary">Email</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>{user.email}</Typography>
            
            <Typography variant="subtitle2" color="text.secondary">Vai trò</Typography>
            <Chip
              label={user.role === 'ADMIN' ? 'Quản trị viên' : 
                     user.role === 'HR' ? 'Quản lý nhân sự' :
                     user.role === 'MENTOR' ? 'Mentor' :
                     user.role === 'COORDINATOR' ? 'Điều phối viên' : 'Thực tập sinh'}
              color={user.role === 'ADMIN' ? 'error' : 'primary'}
              sx={{ mb: 2 }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">Phòng ban</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>{user.department}</Typography>
            
            <Typography variant="subtitle2" color="text.secondary">Số điện thoại</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>{user.phone}</Typography>
            
            <Typography variant="subtitle2" color="text.secondary">Trạng thái</Typography>
            <Chip
              label={user.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
              color={user.status === 'active' ? 'success' : 'error'}
              sx={{ mb: 2 }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary">Quyền hạn</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
              {user.permissions.map((permission, index) => (
                <Chip key={index} label={permission} size="small" variant="outlined" />
              ))}
            </Box>
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
            label="Tên đầy đủ"
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
          
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Vai trò</InputLabel>
            <Select
              value={formData.role}
              onChange={(e) => handleChange('role', e.target.value)}
              label="Vai trò"
            >
              <MenuItem value="INTERN">Thực tập sinh</MenuItem>
              <MenuItem value="MENTOR">Mentor</MenuItem>
              <MenuItem value="COORDINATOR">Điều phối viên</MenuItem>
              <MenuItem value="HR">Quản lý nhân sự</MenuItem>
              <MenuItem value="ADMIN">Quản trị viên</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Phòng ban"
            value={formData.department}
            onChange={(e) => handleChange('department', e.target.value)}
            sx={{ mb: 2 }}
          />
          
          <TextField
            fullWidth
            label="Số điện thoại"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            sx={{ mb: 2 }}
          />
        </Grid>
      </Grid>
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
        <Button onClick={onClose}>Hủy</Button>
        <Button type="submit" variant="contained">
          {mode === 'add' ? 'Thêm người dùng' : 'Cập nhật'}
        </Button>
      </Box>
    </Box>
  );
};

export default UserManagement;