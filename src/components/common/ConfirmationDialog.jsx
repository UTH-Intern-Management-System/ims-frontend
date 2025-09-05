import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip
} from '@mui/material';
import {
  Warning as WarningIcon,
  Delete as DeleteIcon,
  Info as InfoIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Close as CloseIcon
} from '@mui/icons-material';

const ConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  title = 'Xác nhận',
  message = 'Bạn có chắc chắn muốn thực hiện hành động này?',
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  severity = 'warning', // 'warning', 'error', 'info', 'success'
  loading = false,
  disabled = false,
  showIcon = true,
  maxWidth = 'xs',
  details = null, // Array of detail items or string
  warningText = null,
  destructive = false
}) => {
  const getIcon = () => {
    switch (severity) {
      case 'error':
        return <ErrorIcon sx={{ fontSize: 48, color: 'error.main' }} />;
      case 'warning':
        return <WarningIcon sx={{ fontSize: 48, color: 'warning.main' }} />;
      case 'info':
        return <InfoIcon sx={{ fontSize: 48, color: 'info.main' }} />;
      case 'success':
        return <CheckIcon sx={{ fontSize: 48, color: 'success.main' }} />;
      default:
        return <WarningIcon sx={{ fontSize: 48, color: 'warning.main' }} />;
    }
  };

  const getConfirmButtonProps = () => {
    const baseProps = {
      onClick: onConfirm,
      disabled: disabled || loading,
      variant: 'contained'
    };

    if (destructive || severity === 'error') {
      return { ...baseProps, color: 'error' };
    }
    
    return baseProps;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {showIcon && getIcon()}
            <Typography variant="h6">{title}</Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {message}
        </Typography>

        {warningText && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            {warningText}
          </Alert>
        )}

        {details && (
          <Box sx={{ mt: 2 }}>
            {Array.isArray(details) ? (
              <List dense>
                {details.map((detail, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <InfoIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={detail} />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary">
                {details}
              </Typography>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button onClick={onClose} disabled={loading}>
          {cancelText}
        </Button>
        <Button {...getConfirmButtonProps()}>
          {loading ? 'Đang xử lý...' : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Specialized confirmation dialogs
export const DeleteConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  itemName = 'mục này',
  itemType = 'item',
  loading = false,
  cascadeDelete = false,
  relatedItems = []
}) => (
  <ConfirmationDialog
    open={open}
    onClose={onClose}
    onConfirm={onConfirm}
    title="Xác nhận xóa"
    message={`Bạn có chắc chắn muốn xóa ${itemName}?`}
    confirmText="Xóa"
    cancelText="Hủy"
    severity="error"
    destructive={true}
    loading={loading}
    warningText={cascadeDelete ? "Hành động này không thể hoàn tác và sẽ xóa tất cả dữ liệu liên quan." : "Hành động này không thể hoàn tác."}
    details={relatedItems.length > 0 ? [
      `Sẽ xóa ${relatedItems.length} mục liên quan:`,
      ...relatedItems.map(item => `• ${item}`)
    ] : null}
  />
);

export const BulkDeleteConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  selectedCount = 0,
  itemType = 'mục',
  loading = false
}) => (
  <ConfirmationDialog
    open={open}
    onClose={onClose}
    onConfirm={onConfirm}
    title="Xác nhận xóa hàng loạt"
    message={`Bạn có chắc chắn muốn xóa ${selectedCount} ${itemType} đã chọn?`}
    confirmText={`Xóa ${selectedCount} mục`}
    cancelText="Hủy"
    severity="error"
    destructive={true}
    loading={loading}
    warningText="Hành động này không thể hoàn tác và sẽ xóa tất cả các mục đã chọn."
  />
);

export const StatusChangeConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  currentStatus,
  newStatus,
  itemName,
  loading = false,
  consequences = []
}) => (
  <ConfirmationDialog
    open={open}
    onClose={onClose}
    onConfirm={onConfirm}
    title="Xác nhận thay đổi trạng thái"
    message={`Bạn có muốn thay đổi trạng thái của ${itemName} từ "${currentStatus}" thành "${newStatus}"?`}
    confirmText="Thay đổi"
    cancelText="Hủy"
    severity="info"
    loading={loading}
    details={consequences.length > 0 ? [
      'Hậu quả của việc thay đổi này:',
      ...consequences
    ] : null}
  />
);

export const LogoutConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  loading = false,
  unsavedChanges = false
}) => (
  <ConfirmationDialog
    open={open}
    onClose={onClose}
    onConfirm={onConfirm}
    title="Xác nhận đăng xuất"
    message="Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?"
    confirmText="Đăng xuất"
    cancelText="Hủy"
    severity="warning"
    loading={loading}
    warningText={unsavedChanges ? "Bạn có thay đổi chưa được lưu. Các thay đổi này sẽ bị mất khi đăng xuất." : null}
  />
);

export const FormSubmitConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  formType = 'biểu mẫu',
  loading = false,
  summary = []
}) => (
  <ConfirmationDialog
    open={open}
    onClose={onClose}
    onConfirm={onConfirm}
    title="Xác nhận gửi"
    message={`Bạn có chắc chắn muốn gửi ${formType} này?`}
    confirmText="Gửi"
    cancelText="Hủy"
    severity="info"
    loading={loading}
    details={summary.length > 0 ? [
      'Tóm tắt thông tin:',
      ...summary
    ] : null}
  />
);

export const UnsavedChangesDialog = ({
  open,
  onClose,
  onSave,
  onDiscard,
  loading = false
}) => (
  <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
    <DialogTitle>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <WarningIcon sx={{ color: 'warning.main' }} />
        Thay đổi chưa được lưu
      </Box>
    </DialogTitle>
    <DialogContent>
      <Typography>
        Bạn có thay đổi chưa được lưu. Bạn muốn làm gì?
      </Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={onDiscard} color="error" disabled={loading}>
        Bỏ qua
      </Button>
      <Button onClick={onClose} disabled={loading}>
        Tiếp tục chỉnh sửa
      </Button>
      <Button onClick={onSave} variant="contained" disabled={loading}>
        {loading ? 'Đang lưu...' : 'Lưu'}
      </Button>
    </DialogActions>
  </Dialog>
);

// Hook for confirmation dialogs
export const useConfirmation = () => {
  const [dialog, setDialog] = React.useState({
    open: false,
    title: '',
    message: '',
    onConfirm: null,
    severity: 'warning',
    loading: false
  });

  const showConfirmation = React.useCallback((options) => {
    setDialog({
      open: true,
      title: options.title || 'Xác nhận',
      message: options.message || 'Bạn có chắc chắn?',
      onConfirm: options.onConfirm,
      severity: options.severity || 'warning',
      loading: false,
      ...options
    });
  }, []);

  const hideConfirmation = React.useCallback(() => {
    setDialog(prev => ({ ...prev, open: false }));
  }, []);

  const handleConfirm = React.useCallback(async () => {
    if (dialog.onConfirm) {
      setDialog(prev => ({ ...prev, loading: true }));
      try {
        await dialog.onConfirm();
        hideConfirmation();
      } catch (error) {
        console.error('Confirmation action failed:', error);
        setDialog(prev => ({ ...prev, loading: false }));
      }
    }
  }, [dialog.onConfirm, hideConfirmation]);

  const ConfirmationComponent = React.useCallback(() => (
    <ConfirmationDialog
      {...dialog}
      onClose={hideConfirmation}
      onConfirm={handleConfirm}
    />
  ), [dialog, hideConfirmation, handleConfirm]);

  return {
    showConfirmation,
    hideConfirmation,
    ConfirmationComponent,
    isOpen: dialog.open
  };
};

export default ConfirmationDialog;
