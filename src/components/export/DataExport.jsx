import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  FormGroup,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  Typography,
  Divider,
  Alert,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Grid,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  GetApp as ExportIcon,
  TableChart as ExcelIcon,
  PictureAsPdf as PdfIcon,
  Code as JsonIcon,
  Description as CsvIcon,
  Close as CloseIcon,
  Settings as SettingsIcon,
  Schedule as ScheduleIcon,
  Email as EmailIcon,
  CloudDownload as CloudIcon
} from '@mui/icons-material';

const DataExport = ({
  open,
  onClose,
  data = [],
  columns = [],
  title = 'Xuất dữ liệu',
  defaultFormat = 'excel',
  allowedFormats = ['excel', 'pdf', 'csv', 'json'],
  onExport,
  loading = false,
  maxRecords = 10000
}) => {
  const [exportFormat, setExportFormat] = useState(defaultFormat);
  const [selectedColumns, setSelectedColumns] = useState(columns.map(col => col.key));
  const [fileName, setFileName] = useState('');
  const [includeHeaders, setIncludeHeaders] = useState(true);
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [filters, setFilters] = useState({});
  const [exportProgress, setExportProgress] = useState(0);
  const [emailExport, setEmailExport] = useState(false);
  const [email, setEmail] = useState('');
  const [scheduleExport, setScheduleExport] = useState(false);
  const [schedule, setSchedule] = useState('once');

  const formatOptions = {
    excel: { label: 'Excel (.xlsx)', icon: <ExcelIcon />, color: 'success' },
    pdf: { label: 'PDF (.pdf)', icon: <PdfIcon />, color: 'error' },
    csv: { label: 'CSV (.csv)', icon: <CsvIcon />, color: 'info' },
    json: { label: 'JSON (.json)', icon: <JsonIcon />, color: 'warning' }
  };

  const handleColumnToggle = (columnKey) => {
    setSelectedColumns(prev => 
      prev.includes(columnKey)
        ? prev.filter(key => key !== columnKey)
        : [...prev, columnKey]
    );
  };

  const handleSelectAllColumns = () => {
    setSelectedColumns(columns.map(col => col.key));
  };

  const handleDeselectAllColumns = () => {
    setSelectedColumns([]);
  };

  const handleExport = async () => {
    const exportConfig = {
      format: exportFormat,
      columns: selectedColumns,
      fileName: fileName || `export_${Date.now()}`,
      includeHeaders,
      dateRange,
      filters,
      emailExport,
      email: emailExport ? email : null,
      scheduleExport,
      schedule: scheduleExport ? schedule : null
    };

    // Simulate export progress
    setExportProgress(0);
    const progressInterval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    try {
      await onExport?.(exportConfig);
      setTimeout(() => {
        setExportProgress(0);
        onClose();
      }, 1000);
    } catch (error) {
      clearInterval(progressInterval);
      setExportProgress(0);
      console.error('Export failed:', error);
    }
  };

  const getFilteredDataCount = () => {
    // Mock filtering logic
    return Math.min(data.length, maxRecords);
  };

  const generateFileName = () => {
    const timestamp = new Date().toISOString().split('T')[0];
    const formatExt = exportFormat === 'excel' ? 'xlsx' : exportFormat;
    return `${title.toLowerCase().replace(/\s+/g, '_')}_${timestamp}.${formatExt}`;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ExportIcon />
          {title}
        </Box>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {loading && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" gutterBottom>
              Đang xuất dữ liệu... {exportProgress}%
            </Typography>
            <LinearProgress variant="determinate" value={exportProgress} />
          </Box>
        )}

        <Grid container spacing={3}>
          {/* Export Format */}
          <Grid item xs={12} md={6}>
            <FormControl component="fieldset" fullWidth>
              <FormLabel component="legend">Định dạng xuất</FormLabel>
              <RadioGroup
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value)}
              >
                {allowedFormats.map(format => (
                  <FormControlLabel
                    key={format}
                    value={format}
                    control={<Radio />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {formatOptions[format].icon}
                        {formatOptions[format].label}
                      </Box>
                    }
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Grid>

          {/* File Settings */}
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label="Tên tệp"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder={generateFileName()}
                helperText="Để trống để tự động tạo tên"
              />
            </Box>

            <FormControlLabel
              control={
                <Checkbox
                  checked={includeHeaders}
                  onChange={(e) => setIncludeHeaders(e.target.checked)}
                />
              }
              label="Bao gồm tiêu đề cột"
            />
          </Grid>

          {/* Column Selection */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Chọn cột xuất</Typography>
              <Box>
                <Button size="small" onClick={handleSelectAllColumns}>
                  Chọn tất cả
                </Button>
                <Button size="small" onClick={handleDeselectAllColumns} sx={{ ml: 1 }}>
                  Bỏ chọn tất cả
                </Button>
              </Box>
            </Box>

            <Paper sx={{ p: 2, maxHeight: 200, overflow: 'auto' }}>
              <FormGroup>
                <Grid container>
                  {columns.map(column => (
                    <Grid item xs={12} sm={6} md={4} key={column.key}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={selectedColumns.includes(column.key)}
                            onChange={() => handleColumnToggle(column.key)}
                          />
                        }
                        label={column.label || column.key}
                      />
                    </Grid>
                  ))}
                </Grid>
              </FormGroup>
            </Paper>
          </Grid>

          {/* Advanced Options */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Tùy chọn nâng cao
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={emailExport}
                      onChange={(e) => setEmailExport(e.target.checked)}
                    />
                  }
                  label="Gửi qua email"
                />
                {emailExport && (
                  <TextField
                    fullWidth
                    size="small"
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{ mt: 1 }}
                  />
                )}
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={scheduleExport}
                      onChange={(e) => setScheduleExport(e.target.checked)}
                    />
                  }
                  label="Lập lịch xuất"
                />
                {scheduleExport && (
                  <FormControl fullWidth size="small" sx={{ mt: 1 }}>
                    <InputLabel>Tần suất</InputLabel>
                    <Select
                      value={schedule}
                      onChange={(e) => setSchedule(e.target.value)}
                      label="Tần suất"
                    >
                      <MenuItem value="once">Một lần</MenuItem>
                      <MenuItem value="daily">Hàng ngày</MenuItem>
                      <MenuItem value="weekly">Hàng tuần</MenuItem>
                      <MenuItem value="monthly">Hàng tháng</MenuItem>
                    </Select>
                  </FormControl>
                )}
              </Grid>
            </Grid>
          </Grid>

          {/* Export Summary */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Alert severity="info">
              <Typography variant="body2">
                <strong>Tóm tắt xuất:</strong>
              </Typography>
              <List dense>
                <ListItem sx={{ py: 0 }}>
                  <ListItemText primary={`Định dạng: ${formatOptions[exportFormat].label}`} />
                </ListItem>
                <ListItem sx={{ py: 0 }}>
                  <ListItemText primary={`Số cột: ${selectedColumns.length}/${columns.length}`} />
                </ListItem>
                <ListItem sx={{ py: 0 }}>
                  <ListItemText primary={`Số bản ghi: ${getFilteredDataCount()}`} />
                </ListItem>
                {emailExport && (
                  <ListItem sx={{ py: 0 }}>
                    <ListItemText primary={`Gửi đến: ${email}`} />
                  </ListItem>
                )}
              </List>
            </Alert>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} disabled={loading}>
          Hủy
        </Button>
        <Button
          onClick={handleExport}
          variant="contained"
          disabled={loading || selectedColumns.length === 0}
          startIcon={<ExportIcon />}
        >
          {loading ? 'Đang xuất...' : 'Xuất dữ liệu'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Quick Export Button Component
export const QuickExportButton = ({
  data = [],
  columns = [],
  title = 'Dữ liệu',
  formats = ['excel', 'pdf', 'csv'],
  onExport,
  disabled = false,
  size = 'medium',
  variant = 'outlined'
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [exportDialog, setExportDialog] = useState(false);

  const handleQuickExport = async (format) => {
    const config = {
      format,
      columns: columns.map(col => col.key),
      fileName: `${title.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`,
      includeHeaders: true
    };

    try {
      await onExport?.(config);
      setAnchorEl(null);
    } catch (error) {
      console.error('Quick export failed:', error);
    }
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        startIcon={<ExportIcon />}
        onClick={(e) => setAnchorEl(e.currentTarget)}
        disabled={disabled}
      >
        Xuất
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        {formats.map(format => {
          const option = {
            excel: { label: 'Xuất Excel', icon: <ExcelIcon /> },
            pdf: { label: 'Xuất PDF', icon: <PdfIcon /> },
            csv: { label: 'Xuất CSV', icon: <CsvIcon /> },
            json: { label: 'Xuất JSON', icon: <JsonIcon /> }
          }[format];

          return (
            <MenuItem key={format} onClick={() => handleQuickExport(format)}>
              <ListItemIcon>{option.icon}</ListItemIcon>
              <ListItemText>{option.label}</ListItemText>
            </MenuItem>
          );
        })}
        <Divider />
        <MenuItem onClick={() => {
          setExportDialog(true);
          setAnchorEl(null);
        }}>
          <ListItemIcon><SettingsIcon /></ListItemIcon>
          <ListItemText>Tùy chọn nâng cao...</ListItemText>
        </MenuItem>
      </Menu>

      <DataExport
        open={exportDialog}
        onClose={() => setExportDialog(false)}
        data={data}
        columns={columns}
        title={title}
        onExport={onExport}
      />
    </>
  );
};

// Export History Component
export const ExportHistory = ({ exports = [], onReExport, onDownload }) => {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Lịch sử xuất dữ liệu
      </Typography>
      
      {exports.length === 0 ? (
        <Typography color="text.secondary">
          Chưa có lịch sử xuất dữ liệu
        </Typography>
      ) : (
        <List>
          {exports.map((exportItem, index) => (
            <ListItem key={index} divider>
              <ListItemIcon>
                {exportItem.format === 'excel' && <ExcelIcon />}
                {exportItem.format === 'pdf' && <PdfIcon />}
                {exportItem.format === 'csv' && <CsvIcon />}
                {exportItem.format === 'json' && <JsonIcon />}
              </ListItemIcon>
              <ListItemText
                primary={exportItem.fileName}
                secondary={
                  <Box>
                    <Typography variant="caption" display="block">
                      {new Date(exportItem.timestamp).toLocaleString('vi-VN')}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                      <Chip size="small" label={exportItem.format.toUpperCase()} />
                      <Chip size="small" label={`${exportItem.records} bản ghi`} />
                      {exportItem.status === 'completed' && (
                        <Chip size="small" color="success" label="Hoàn thành" />
                      )}
                      {exportItem.status === 'failed' && (
                        <Chip size="small" color="error" label="Thất bại" />
                      )}
                    </Box>
                  </Box>
                }
              />
              <Box sx={{ display: 'flex', gap: 1 }}>
                {exportItem.status === 'completed' && (
                  <Tooltip title="Tải xuống">
                    <IconButton onClick={() => onDownload?.(exportItem)}>
                      <CloudIcon />
                    </IconButton>
                  </Tooltip>
                )}
                <Tooltip title="Xuất lại">
                  <IconButton onClick={() => onReExport?.(exportItem)}>
                    <ExportIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default DataExport;
