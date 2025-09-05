import React, { Component } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Alert,
  AlertTitle,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  IconButton,
  Collapse,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip
} from '@mui/material';
import {
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  CheckCircle as SuccessIcon,
  Refresh,
  Home,
  BugReport,
  ExpandMore,
  ExpandLess,
  Close,
  ContentCopy
} from '@mui/icons-material';

// Error Boundary Component
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error, errorInfo);
    }

    // In production, you would send this to an error reporting service
    // this.logErrorToService(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  copyErrorDetails = () => {
    const errorDetails = `
Error: ${this.state.error?.message}
Stack: ${this.state.error?.stack}
Component Stack: ${this.state.errorInfo?.componentStack}
    `.trim();
    
    navigator.clipboard.writeText(errorDetails);
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '50vh',
            p: 3
          }}
        >
          <Paper sx={{ p: 4, maxWidth: 600, textAlign: 'center' }}>
            <ErrorIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
            <Typography variant="h4" gutterBottom>
              Oops! Có lỗi xảy ra
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {this.props.fallbackMessage || 'Ứng dụng gặp lỗi không mong muốn. Vui lòng thử lại hoặc liên hệ hỗ trợ.'}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 3 }}>
              <Button
                variant="contained"
                startIcon={<Refresh />}
                onClick={this.handleRetry}
              >
                Thử lại
              </Button>
              <Button
                variant="outlined"
                startIcon={<Home />}
                onClick={this.handleGoHome}
              >
                Về trang chủ
              </Button>
            </Box>

            {process.env.NODE_ENV === 'development' && (
              <Box sx={{ textAlign: 'left' }}>
                <Button
                  variant="text"
                  startIcon={this.state.showDetails ? <ExpandLess /> : <ExpandMore />}
                  onClick={() => this.setState({ showDetails: !this.state.showDetails })}
                  size="small"
                >
                  Chi tiết lỗi
                </Button>
                <Collapse in={this.state.showDetails}>
                  <Card sx={{ mt: 2, bgcolor: 'grey.100' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="subtitle2">Error Details</Typography>
                        <IconButton size="small" onClick={this.copyErrorDetails}>
                          <ContentCopy fontSize="small" />
                        </IconButton>
                      </Box>
                      <Typography variant="body2" component="pre" sx={{ fontSize: 12, overflow: 'auto' }}>
                        {this.state.error?.message}
                      </Typography>
                      {this.state.error?.stack && (
                        <Typography variant="body2" component="pre" sx={{ fontSize: 10, mt: 1, overflow: 'auto' }}>
                          {this.state.error.stack}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Collapse>
              </Box>
            )}
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}

// Error Display Component
export const ErrorDisplay = ({ 
  error, 
  title = 'Có lỗi xảy ra', 
  onRetry, 
  onDismiss,
  severity = 'error',
  showDetails = false 
}) => {
  const [detailsOpen, setDetailsOpen] = React.useState(false);

  const getIcon = () => {
    switch (severity) {
      case 'error': return <ErrorIcon />;
      case 'warning': return <WarningIcon />;
      case 'info': return <InfoIcon />;
      case 'success': return <SuccessIcon />;
      default: return <ErrorIcon />;
    }
  };

  return (
    <Alert 
      severity={severity}
      action={
        <Box sx={{ display: 'flex', gap: 1 }}>
          {onRetry && (
            <Button size="small" onClick={onRetry}>
              Thử lại
            </Button>
          )}
          {showDetails && error?.stack && (
            <Button 
              size="small" 
              onClick={() => setDetailsOpen(!detailsOpen)}
            >
              Chi tiết
            </Button>
          )}
          {onDismiss && (
            <IconButton size="small" onClick={onDismiss}>
              <Close fontSize="small" />
            </IconButton>
          )}
        </Box>
      }
    >
      <AlertTitle>{title}</AlertTitle>
      {typeof error === 'string' ? error : error?.message || 'Lỗi không xác định'}
      
      {showDetails && detailsOpen && error?.stack && (
        <Collapse in={detailsOpen}>
          <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(0,0,0,0.1)', borderRadius: 1 }}>
            <Typography variant="body2" component="pre" sx={{ fontSize: 12, overflow: 'auto' }}>
              {error.stack}
            </Typography>
          </Box>
        </Collapse>
      )}
    </Alert>
  );
};

// Network Error Component
export const NetworkError = ({ onRetry, message }) => (
  <Box sx={{ textAlign: 'center', p: 3 }}>
    <ErrorIcon sx={{ fontSize: 48, color: 'error.main', mb: 2 }} />
    <Typography variant="h6" gutterBottom>
      Lỗi kết nối mạng
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
      {message || 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối internet và thử lại.'}
    </Typography>
    {onRetry && (
      <Button variant="contained" onClick={onRetry} startIcon={<Refresh />}>
        Thử lại
      </Button>
    )}
  </Box>
);

// Not Found Component
export const NotFound = ({ 
  title = 'Không tìm thấy trang', 
  message = 'Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.',
  showHomeButton = true 
}) => (
  <Box sx={{ textAlign: 'center', p: 3 }}>
    <Typography variant="h1" sx={{ fontSize: 120, color: 'text.secondary', mb: 2 }}>
      404
    </Typography>
    <Typography variant="h4" gutterBottom>
      {title}
    </Typography>
    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
      {message}
    </Typography>
    {showHomeButton && (
      <Button variant="contained" href="/" startIcon={<Home />}>
        Về trang chủ
      </Button>
    )}
  </Box>
);

// Permission Denied Component
export const PermissionDenied = ({ 
  message = 'Bạn không có quyền truy cập vào trang này.',
  onGoBack 
}) => (
  <Box sx={{ textAlign: 'center', p: 3 }}>
    <WarningIcon sx={{ fontSize: 64, color: 'warning.main', mb: 2 }} />
    <Typography variant="h5" gutterBottom>
      Không có quyền truy cập
    </Typography>
    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
      {message}
    </Typography>
    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
      {onGoBack && (
        <Button variant="outlined" onClick={onGoBack}>
          Quay lại
        </Button>
      )}
      <Button variant="contained" href="/">
        Về trang chủ
      </Button>
    </Box>
  </Box>
);

// Toast Notification Component
export const Toast = ({ 
  open, 
  onClose, 
  message, 
  severity = 'info', 
  autoHideDuration = 6000,
  action 
}) => (
  <Snackbar
    open={open}
    autoHideDuration={autoHideDuration}
    onClose={onClose}
    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
  >
    <Alert 
      onClose={onClose} 
      severity={severity} 
      sx={{ width: '100%' }}
      action={action}
    >
      {message}
    </Alert>
  </Snackbar>
);

// Error Dialog Component
export const ErrorDialog = ({ 
  open, 
  onClose, 
  title = 'Lỗi', 
  error, 
  onRetry,
  showDetails = false 
}) => {
  const [detailsOpen, setDetailsOpen] = React.useState(false);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <ErrorIcon color="error" />
        {title}
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {typeof error === 'string' ? error : error?.message || 'Đã xảy ra lỗi không xác định'}
        </Typography>
        
        {showDetails && error?.stack && (
          <>
            <Button
              size="small"
              onClick={() => setDetailsOpen(!detailsOpen)}
              startIcon={detailsOpen ? <ExpandLess /> : <ExpandMore />}
            >
              Chi tiết kỹ thuật
            </Button>
            <Collapse in={detailsOpen}>
              <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                <Typography variant="body2" component="pre" sx={{ fontSize: 12, overflow: 'auto' }}>
                  {error.stack}
                </Typography>
              </Box>
            </Collapse>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
        {onRetry && (
          <Button onClick={onRetry} variant="contained">
            Thử lại
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

// Validation Error List
export const ValidationErrors = ({ errors, onDismiss }) => {
  if (!errors || errors.length === 0) return null;

  return (
    <Alert 
      severity="error" 
      onClose={onDismiss}
      sx={{ mb: 2 }}
    >
      <AlertTitle>Vui lòng sửa các lỗi sau:</AlertTitle>
      <List dense>
        {errors.map((error, index) => (
          <ListItem key={index} sx={{ py: 0 }}>
            <ListItemIcon sx={{ minWidth: 32 }}>
              <ErrorIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={error} />
          </ListItem>
        ))}
      </List>
    </Alert>
  );
};

// Error Summary Component
export const ErrorSummary = ({ errors, title = 'Tổng hợp lỗi' }) => {
  if (!errors || Object.keys(errors).length === 0) return null;

  return (
    <Paper sx={{ p: 2, mb: 2, bgcolor: 'error.light', color: 'error.contrastText' }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {Object.entries(errors).map(([field, error]) => (
        <Chip
          key={field}
          label={`${field}: ${error}`}
          size="small"
          sx={{ mr: 1, mb: 1 }}
          color="error"
          variant="outlined"
        />
      ))}
    </Paper>
  );
};

// Hook for error handling
export const useErrorHandler = () => {
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const handleAsync = React.useCallback(async (asyncFunction) => {
    try {
      setLoading(true);
      setError(null);
      const result = await asyncFunction();
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = React.useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    loading,
    handleAsync,
    clearError,
    setError
  };
};

export default {
  ErrorBoundary,
  ErrorDisplay,
  NetworkError,
  NotFound,
  PermissionDenied,
  Toast,
  ErrorDialog,
  ValidationErrors,
  ErrorSummary,
  useErrorHandler
};
