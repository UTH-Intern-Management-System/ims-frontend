import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Switch,
  Button,
  TextField,
  Paper,
  Grid,
  Card,
  CardContent,
  Divider,
  Alert,
  Snackbar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Select,
  MenuItem,
  InputLabel,
  Chip,
  IconButton,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Settings as SettingsIcon,
  Security as SecurityIcon,
  People as PeopleIcon,
  Storage as StorageIcon,
  Backup as BackupIcon,
  Restore as RestoreIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const SystemConfig = () => {
  const { user } = useAuth();
  const [config, setConfig] = useState({
    // General Settings
    theme: 'light',
    language: 'vi',
    timezone: 'Asia/Ho_Chi_Minh',
    dateFormat: 'DD/MM/YYYY',
    
    // System Settings
    maintenance: false,
    maintenanceMessage: 'Hệ thống đang bảo trì. Vui lòng thử lại sau.',
    apiUrl: 'https://api.ims.com',
    maxFileSize: 10,
    sessionTimeout: 30,
    
    // Security Settings
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      expiryDays: 90
    },
    loginAttempts: 5,
    lockoutDuration: 15,
    twoFactorAuth: true,
    
    // User Permissions
    defaultUserRole: 'INTERN',
    allowSelfRegistration: true,
    requireEmailVerification: true,
    autoApproveInterns: false,
    
    // Data Settings
    backupFrequency: 'daily',
    backupRetention: 30,
    dataEncryption: true,
    auditLogging: true,
    
    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    notificationFrequency: 'realtime'
  });

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(false);
  const [systemStatus, setSystemStatus] = useState({
    database: 'healthy',
    api: 'healthy',
    storage: 'healthy',
    security: 'healthy'
  });

  useEffect(() => {
    loadSystemStatus();
  }, []);

  const loadSystemStatus = async () => {
    // Simulate loading system status
    setSystemStatus({
      database: 'healthy',
      api: 'healthy',
      storage: 'healthy',
      security: 'healthy'
    });
  };

  const handleChange = (section, field, value) => {
    if (section) {
      setConfig(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else {
      setConfig(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSaveConfig = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      showSnackbar('Cấu hình đã được lưu thành công!', 'success');
    } catch (error) {
      showSnackbar('Lỗi khi lưu cấu hình!', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResetConfig = () => {
    if (window.confirm('Bạn có chắc muốn đặt lại cấu hình về mặc định?')) {
      // Reset to default values
      showSnackbar('Cấu hình đã được đặt lại!', 'info');
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'success';
      case 'warning': return 'warning';
      case 'error': return 'error';
      default: return 'info';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy': return <CheckCircleIcon />;
      case 'warning': return <WarningIcon />;
      case 'error': return <ErrorIcon />;
      default: return <InfoIcon />;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Cấu hình hệ thống
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadSystemStatus}
          >
            Làm mới
          </Button>
          <Button
            variant="outlined"
            startIcon={<BackupIcon />}
            onClick={() => showSnackbar('Tính năng backup sẽ được tích hợp sau!', 'info')}
          >
            Backup
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSaveConfig}
            disabled={loading}
          >
            {loading ? 'Đang lưu...' : 'Lưu cấu hình'}
          </Button>
        </Box>
      </Box>

      {/* System Status */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                {getStatusIcon(systemStatus.database)}
              </Box>
              <Typography variant="h6" color={`${getStatusColor(systemStatus.database)}.main`}>
                Database
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {systemStatus.database === 'healthy' ? 'Hoạt động tốt' : 'Có vấn đề'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                {getStatusIcon(systemStatus.api)}
              </Box>
              <Typography variant="h6" color={`${getStatusColor(systemStatus.api)}.main`}>
                API Service
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {systemStatus.api === 'healthy' ? 'Hoạt động tốt' : 'Có vấn đề'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                {getStatusIcon(systemStatus.storage)}
              </Box>
              <Typography variant="h6" color={`${getStatusColor(systemStatus.storage)}.main`}>
                Storage
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {systemStatus.storage === 'healthy' ? 'Hoạt động tốt' : 'Có vấn đề'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                {getStatusIcon(systemStatus.security)}
              </Box>
              <Typography variant="h6" color={`${getStatusColor(systemStatus.security)}.main`}>
                Security
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {systemStatus.security === 'healthy' ? 'Hoạt động tốt' : 'Có vấn đề'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Configuration Sections */}
      <Grid container spacing={3}>
        {/* General Settings */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <SettingsIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6">Cài đặt chung</Typography>
            </Box>
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Giao diện</InputLabel>
              <Select
                value={config.theme}
                onChange={(e) => handleChange(null, 'theme', e.target.value)}
                label="Giao diện"
              >
                <MenuItem value="light">Sáng</MenuItem>
                <MenuItem value="dark">Tối</MenuItem>
                <MenuItem value="auto">Tự động</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Ngôn ngữ</InputLabel>
              <Select
                value={config.language}
                onChange={(e) => handleChange(null, 'language', e.target.value)}
                label="Ngôn ngữ"
              >
                <MenuItem value="vi">Tiếng Việt</MenuItem>
                <MenuItem value="en">English</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Múi giờ</InputLabel>
              <Select
                value={config.timezone}
                onChange={(e) => handleChange(null, 'timezone', e.target.value)}
                label="Múi giờ"
              >
                <MenuItem value="Asia/Ho_Chi_Minh">Asia/Ho_Chi_Minh</MenuItem>
                <MenuItem value="UTC">UTC</MenuItem>
              </Select>
            </FormControl>

            <FormControlLabel
              control={
                <Switch
                  checked={config.maintenance}
                  onChange={(e) => handleChange(null, 'maintenance', e.target.checked)}
                />
              }
              label="Chế độ bảo trì"
              sx={{ mb: 2, display: 'block' }}
            />

            {config.maintenance && (
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Thông báo bảo trì"
                value={config.maintenanceMessage}
                onChange={(e) => handleChange(null, 'maintenanceMessage', e.target.value)}
                sx={{ mb: 2 }}
              />
            )}
          </Paper>
        </Grid>

        {/* Security Settings */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <SecurityIcon sx={{ mr: 1, color: 'error.main' }} />
              <Typography variant="h6">Bảo mật</Typography>
            </Box>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Độ dài mật khẩu tối thiểu</InputLabel>
              <Select
                value={config.passwordPolicy.minLength}
                onChange={(e) => handleChange('passwordPolicy', 'minLength', e.target.value)}
                label="Độ dài mật khẩu tối thiểu"
              >
                <MenuItem value={6}>6 ký tự</MenuItem>
                <MenuItem value={8}>8 ký tự</MenuItem>
                <MenuItem value={10}>10 ký tự</MenuItem>
                <MenuItem value={12}>12 ký tự</MenuItem>
              </Select>
            </FormControl>

            <FormControlLabel
              control={
                <Switch
                  checked={config.passwordPolicy.requireUppercase}
                  onChange={(e) => handleChange('passwordPolicy', 'requireUppercase', e.target.checked)}
                />
              }
              label="Yêu cầu chữ hoa"
              sx={{ mb: 1, display: 'block' }}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={config.passwordPolicy.requireNumbers}
                  onChange={(e) => handleChange('passwordPolicy', 'requireNumbers', e.target.checked)}
                />
              }
              label="Yêu cầu số"
              sx={{ mb: 1, display: 'block' }}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={config.twoFactorAuth}
                  onChange={(e) => handleChange(null, 'twoFactorAuth', e.target.checked)}
                />
              }
              label="Xác thực 2 yếu tố"
              sx={{ mb: 2, display: 'block' }}
            />

            <TextField
              fullWidth
              type="number"
              label="Số lần đăng nhập sai tối đa"
              value={config.loginAttempts}
              onChange={(e) => handleChange(null, 'loginAttempts', parseInt(e.target.value))}
              sx={{ mb: 2 }}
            />
          </Paper>
        </Grid>

        {/* User Permissions */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PeopleIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6">Quyền người dùng</Typography>
            </Box>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Vai trò mặc định</InputLabel>
              <Select
                value={config.defaultUserRole}
                onChange={(e) => handleChange(null, 'defaultUserRole', e.target.value)}
                label="Vai trò mặc định"
              >
                <MenuItem value="INTERN">Thực tập sinh</MenuItem>
                <MenuItem value="MENTOR">Mentor</MenuItem>
                <MenuItem value="COORDINATOR">Điều phối viên</MenuItem>
                <MenuItem value="HR">HR</MenuItem>
              </Select>
            </FormControl>

            <FormControlLabel
              control={
                <Switch
                  checked={config.allowSelfRegistration}
                  onChange={(e) => handleChange(null, 'allowSelfRegistration', e.target.checked)}
                />
              }
              label="Cho phép đăng ký tự động"
              sx={{ mb: 1, display: 'block' }}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={config.requireEmailVerification}
                  onChange={(e) => handleChange(null, 'requireEmailVerification', e.target.checked)}
                />
              }
              label="Yêu cầu xác thực email"
              sx={{ mb: 1, display: 'block' }}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={config.autoApproveInterns}
                  onChange={(e) => handleChange(null, 'autoApproveInterns', e.target.checked)}
                />
              }
              label="Tự động phê duyệt thực tập sinh"
              sx={{ mb: 2, display: 'block' }}
            />
          </Paper>
        </Grid>

        {/* Data & Backup */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <StorageIcon sx={{ mr: 1, color: 'info.main' }} />
              <Typography variant="h6">Dữ liệu & Sao lưu</Typography>
            </Box>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Tần suất sao lưu</InputLabel>
              <Select
                value={config.backupFrequency}
                onChange={(e) => handleChange(null, 'backupFrequency', e.target.value)}
                label="Tần suất sao lưu"
              >
                <MenuItem value="hourly">Hàng giờ</MenuItem>
                <MenuItem value="daily">Hàng ngày</MenuItem>
                <MenuItem value="weekly">Hàng tuần</MenuItem>
                <MenuItem value="monthly">Hàng tháng</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              type="number"
              label="Giữ lại sao lưu (ngày)"
              value={config.backupRetention}
              onChange={(e) => handleChange(null, 'backupRetention', parseInt(e.target.value))}
              sx={{ mb: 2 }}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={config.dataEncryption}
                  onChange={(e) => handleChange(null, 'dataEncryption', e.target.checked)}
                />
              }
              label="Mã hóa dữ liệu"
              sx={{ mb: 1, display: 'block' }}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={config.auditLogging}
                  onChange={(e) => handleChange(null, 'auditLogging', e.target.checked)}
                />
              }
              label="Ghi log kiểm tra"
              sx={{ mb: 2, display: 'block' }}
            />
          </Paper>
        </Grid>

        {/* Advanced Settings */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">Cài đặt nâng cao</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="API Endpoint"
                      value={config.apiUrl}
                      onChange={(e) => handleChange(null, 'apiUrl', e.target.value)}
                      sx={{ mb: 2 }}
                    />
                    
                    <TextField
                      fullWidth
                      type="number"
                      label="Kích thước file tối đa (MB)"
                      value={config.maxFileSize}
                      onChange={(e) => handleChange(null, 'maxFileSize', parseInt(e.target.value))}
                      sx={{ mb: 2 }}
                    />
                    
                    <TextField
                      fullWidth
                      type="number"
                      label="Thời gian timeout session (phút)"
                      value={config.sessionTimeout}
                      onChange={(e) => handleChange(null, 'sessionTimeout', parseInt(e.target.value))}
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>Tần suất thông báo</InputLabel>
                      <Select
                        value={config.notificationFrequency}
                        onChange={(e) => handleChange(null, 'notificationFrequency', e.target.value)}
                        label="Tần suất thông báo"
                      >
                        <MenuItem value="realtime">Thời gian thực</MenuItem>
                        <MenuItem value="hourly">Hàng giờ</MenuItem>
                        <MenuItem value="daily">Hàng ngày</MenuItem>
                      </Select>
                    </FormControl>

                    <FormControlLabel
                      control={
                        <Switch
                          checked={config.emailNotifications}
                          onChange={(e) => handleChange(null, 'emailNotifications', e.target.checked)}
                        />
                      }
                      label="Thông báo email"
                      sx={{ mb: 1, display: 'block' }}
                    />

                    <FormControlLabel
                      control={
                        <Switch
                          checked={config.pushNotifications}
                          onChange={(e) => handleChange(null, 'pushNotifications', e.target.checked)}
                        />
                      }
                      label="Thông báo push"
                      sx={{ mb: 1, display: 'block' }}
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Paper>
        </Grid>
      </Grid>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
        <Button
          variant="outlined"
          onClick={handleResetConfig}
          sx={{ minWidth: 120 }}
        >
          Đặt lại
        </Button>
        <Button
          variant="contained"
          onClick={handleSaveConfig}
          disabled={loading}
          startIcon={<SaveIcon />}
          sx={{ minWidth: 120 }}
        >
          {loading ? 'Đang lưu...' : 'Lưu cấu hình'}
        </Button>
      </Box>

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

export default SystemConfig;