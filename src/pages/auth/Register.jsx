import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  Container, 
  Box, 
  Typography, 
  Paper, 
  InputAdornment, 
  IconButton,
  Alert,
  CircularProgress,
  Divider,
  Select,
  MenuItem,
  FormControl,
  FormHelperText,
  InputLabel
} from '@mui/material';
import { 
  Email, 
  Lock, 
  Visibility, 
  VisibilityOff,
  Business,
  School,
  Person,
  Phone,
  School as SchoolIcon,
  Work
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    department: '',
    university: '',
    major: '',
    expectedGraduation: ''
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    // Kiểm tra họ tên
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Vui lòng nhập họ tên';
    }

    // Kiểm tra email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    // Kiểm tra mật khẩu
    if (formData.password.length < 8) {
      newErrors.password = 'Mật khẩu phải có ít nhất 8 ký tự';
    }

    // Kiểm tra xác nhận mật khẩu
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu không khớp';
    }

    // Kiểm tra số điện thoại
    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }

    // Kiểm tra phòng ban
    if (!formData.department) {
      newErrors.department = 'Vui lòng chọn phòng ban';
    }

    // Kiểm tra trường đại học
    if (!formData.university) {
      newErrors.university = 'Vui lòng nhập tên trường';
    }

    // Kiểm tra chuyên ngành
    if (!formData.major) {
      newErrors.major = 'Vui lòng nhập chuyên ngành';
    }

    // Kiểm tra ngày tốt nghiệp dự kiến
    if (!formData.expectedGraduation) {
      newErrors.expectedGraduation = 'Vui lòng nhập ngày tốt nghiệp dự kiến';
    } else {
      const graduationDate = new Date(formData.expectedGraduation);
      const today = new Date();
      if (graduationDate < today) {
        newErrors.expectedGraduation = 'Ngày tốt nghiệp phải sau ngày hiện tại';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const result = await register(formData);
      if (result?.success) {
        navigate('/login', { 
          state: { 
            message: 'Đăng ký thành công! Vui lòng đăng nhập.' 
          } 
        });
      } else {
        setError(result?.message || 'Đăng ký không thành công');
      }
    } catch (err) {
      console.error('Lỗi đăng ký:', err);
      setError('Không thể kết nối đến server');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={24}
          sx={{
            p: 4,
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <Business sx={{ fontSize: 40, color: 'primary.main', mr: 1 }} />
              <School sx={{ fontSize: 40, color: 'secondary.main' }} />
            </Box>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'text.primary' }}>
              Đăng ký thực tập sinh
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Điền thông tin để đăng ký tài khoản thực tập sinh
            </Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Register Form */}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            {/* Họ tên */}
            <TextField
              name="fullName"
              label="Họ và tên"
              fullWidth
              margin="normal"
              required
              value={formData.fullName}
              onChange={handleChange}
              error={!!errors.fullName}
              helperText={errors.fullName}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
            />

            {/* Email */}
            <TextField
              name="email"
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              required
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
            />

            {/* Mật khẩu */}
            <TextField
              name="password"
              label="Mật khẩu"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              margin="normal"
              required
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => handleTogglePasswordVisibility('password')}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
            />

            {/* Xác nhận mật khẩu */}
            <TextField
              name="confirmPassword"
              label="Xác nhận mật khẩu"
              type={showConfirmPassword ? 'text' : 'password'}
              fullWidth
              margin="normal"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => handleTogglePasswordVisibility('confirm')}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
            />

            {/* Số điện thoại */}
            <TextField
              name="phone"
              label="Số điện thoại"
              fullWidth
              margin="normal"
              required
              value={formData.phone}
              onChange={handleChange}
              error={!!errors.phone}
              helperText={errors.phone}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
            />

            {/* Phòng ban */}
            <FormControl 
              fullWidth 
              margin="normal" 
              required
              error={!!errors.department}
            >
              <InputLabel>Phòng ban</InputLabel>
              <Select
                name="department"
                value={formData.department}
                onChange={handleChange}
                label="Phòng ban"
                startAdornment={
                  <InputAdornment position="start">
                    <Work color="action" />
                  </InputAdornment>
                }
                sx={{
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                }}
              >
                <MenuItem value="Engineering">Kỹ thuật</MenuItem>
                <MenuItem value="Marketing">Marketing</MenuItem>
                <MenuItem value="Design">Thiết kế</MenuItem>
                <MenuItem value="HR">Nhân sự</MenuItem>
              </Select>
              {errors.department && (
                <FormHelperText error>{errors.department}</FormHelperText>
              )}
            </FormControl>

            {/* Trường đại học */}
            <TextField
              name="university"
              label="Trường đại học"
              fullWidth
              margin="normal"
              required
              value={formData.university}
              onChange={handleChange}
              error={!!errors.university}
              helperText={errors.university}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SchoolIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
            />

            {/* Chuyên ngành */}
            <TextField
              name="major"
              label="Chuyên ngành"
              fullWidth
              margin="normal"
              required
              value={formData.major}
              onChange={handleChange}
              error={!!errors.major}
              helperText={errors.major}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SchoolIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
            />

            {/* Ngày tốt nghiệp dự kiến */}
            <TextField
              name="expectedGraduation"
              label="Ngày tốt nghiệp dự kiến"
              type="date"
              fullWidth
              margin="normal"
              required
              value={formData.expectedGraduation}
              onChange={handleChange}
              error={!!errors.expectedGraduation}
              helperText={errors.expectedGraduation}
              InputLabelProps={{
                shrink: true,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                color: "#fff",
                borderRadius: 2,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Đăng ký'
              )}
            </Button>

            {/* Login Link */}
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2">
                Đã có tài khoản?{' '}
                <Link
                  to="/login"
                  style={{
                    color: '#667eea',
                    textDecoration: 'none',
                    fontWeight: 'bold'
                  }}
                >
                  Đăng nhập
                </Link>
              </Typography>
            </Box>
          </Box>

          {/* Footer */}
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography variant="body2" color="text.secondary">
              © 2024 IMS Platform. Tất cả quyền được bảo lưu.
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Register;