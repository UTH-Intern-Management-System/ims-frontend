import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Button,
  List,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Badge,
  Avatar,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Send as SendIcon,
  Support as SupportIcon,
  BugReport as BugReportIcon,
  QuestionAnswer as QuestionAnswerIcon,
  PriorityHigh as PriorityHighIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Error as ErrorIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Assignment as AssignmentIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const TechnicalSupport = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [dialogMode, setDialogMode] = useState('add');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  // Enhanced mock data for technical support
  const mockTickets = [
    {
      id: 1,
      title: "Không thể đăng nhập vào hệ thống",
      description: "Tôi đã nhập đúng email và mật khẩu nhưng vẫn không thể đăng nhập. Hệ thống hiển thị lỗi 'Invalid credentials'",
      category: "Authentication",
      priority: "high",
      status: "open",
      userId: 9,
      userName: "Software Dev Intern",
      userEmail: "dev.intern@ims.com",
      userRole: "INTERN",
      createdAt: "2024-01-20T09:00:00Z",
      updatedAt: "2024-01-20T09:00:00Z",
      assignedTo: null,
      assignedToName: null,
      response: null,
      resolution: null,
      tags: ["login", "authentication", "error"]
    },
    {
      id: 2,
      title: "Lỗi khi tải file đính kèm",
      description: "Khi tôi cố gắng tải file PDF từ task, hệ thống hiển thị lỗi 'File not found'. File này đã được upload thành công trước đó",
      category: "File Management",
      priority: "medium",
      status: "in-progress",
      userId: 13,
      userName: "UI/UX Design Intern",
      userEmail: "uiux.intern@ims.com",
      userRole: "INTERN",
      createdAt: "2024-01-19T14:30:00Z",
      updatedAt: "2024-01-20T10:15:00Z",
      assignedTo: 1,
      assignedToName: "System Admin",
      response: "Chúng tôi đang kiểm tra vấn đề với file storage. Vui lòng thử lại sau 2 giờ.",
      resolution: null,
      tags: ["file", "download", "storage"]
    },
    {
      id: 3,
      title: "Giao diện không hiển thị đúng trên mobile",
      description: "Trang dashboard không responsive trên điện thoại. Các button bị che khuất và layout bị vỡ",
      category: "UI/UX",
      priority: "low",
      status: "resolved",
      userId: 10,
      userName: "Marketing Intern",
      userEmail: "mkt.intern@ims.com",
      userRole: "INTERN",
      createdAt: "2024-01-18T11:20:00Z",
      updatedAt: "2024-01-19T16:45:00Z",
      assignedTo: 1,
      assignedToName: "System Admin",
      response: "Vấn đề đã được xác định và sửa chữa. Giao diện mobile đã được tối ưu hóa.",
      resolution: "Fixed responsive design issues for mobile devices. Updated CSS media queries and component layouts.",
      tags: ["mobile", "responsive", "ui", "fixed"]
    },
    {
      id: 4,
      title: "Thông báo email không được gửi",
      description: "Tôi đã cấu hình email notifications nhưng không nhận được email nào từ hệ thống",
      category: "Notifications",
      priority: "medium",
      status: "open",
      userId: 7,
      userName: "Senior Developer Mentor",
      userEmail: "dev.mentor@ims.com",
      userRole: "MENTOR",
      createdAt: "2024-01-20T08:15:00Z",
      updatedAt: "2024-01-20T08:15:00Z",
      assignedTo: null,
      assignedToName: null,
      response: null,
      resolution: null,
      tags: ["email", "notifications", "configuration"]
    }
  ];

  // FAQ data
  const faqData = [
    {
      id: 1,
      question: "Làm cách nào reset mật khẩu?",
      answer: "Truy cập trang đăng nhập, click vào 'Quên mật khẩu', nhập email của bạn và làm theo hướng dẫn trong email.",
      category: "Authentication",
      tags: ["password", "reset", "login"]
    },
    {
      id: 2,
      question: "Cách thêm mới thực tập sinh?",
      answer: "Vào menu HR -> Quản lý thực tập sinh -> Click 'Thêm mới' và điền đầy đủ thông tin theo form.",
      category: "User Management",
      tags: ["intern", "add", "hr"]
    },
    {
      id: 3,
      question: "Làm sao để thay đổi thông tin cá nhân?",
      answer: "Vào Profile -> Chỉnh sửa thông tin -> Cập nhật các trường cần thiết -> Lưu thay đổi.",
      category: "Profile",
      tags: ["profile", "edit", "personal"]
    },
    {
      id: 4,
      question: "Cách tạo task mới cho thực tập sinh?",
      answer: "Vào menu Mentor -> Nhiệm vụ -> Click 'Thêm task' -> Điền thông tin task và gán cho thực tập sinh.",
      category: "Task Management",
      tags: ["task", "create", "mentor"]
    }
  ];

  useEffect(() => {
    setTickets(mockTickets);
  }, []);

  const handleOpenDialog = (mode, ticket = null) => {
    setDialogMode(mode);
    setSelectedTicket(ticket);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTicket(null);
  };

  const handleSubmitTicket = (ticketData) => {
    if (dialogMode === 'add') {
      const newTicket = {
        id: Date.now(),
        ...ticketData,
        status: 'open',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        assignedTo: null,
        assignedToName: null,
        response: null,
        resolution: null
      };
      setTickets([...tickets, newTicket]);
      showSnackbar('Ticket đã được tạo thành công!', 'success');
    } else {
      const updatedTickets = tickets.map(ticket => 
        ticket.id === selectedTicket.id ? { ...ticket, ...ticketData, updatedAt: new Date().toISOString() } : ticket
      );
      setTickets(updatedTickets);
      showSnackbar('Ticket đã được cập nhật thành công!', 'success');
    }
    handleCloseDialog();
  };

  const handleAssignTicket = (ticketId, adminId, adminName) => {
    const updatedTickets = tickets.map(ticket => 
      ticket.id === ticketId ? { ...ticket, assignedTo: adminId, assignedToName: adminName, status: 'in-progress' } : ticket
    );
    setTickets(updatedTickets);
    showSnackbar('Ticket đã được gán thành công!', 'success');
  };

  const handleResolveTicket = (ticketId, resolution) => {
    const updatedTickets = tickets.map(ticket => 
      ticket.id === ticketId ? { ...ticket, status: 'resolved', resolution, updatedAt: new Date().toISOString() } : ticket
    );
    setTickets(updatedTickets);
    showSnackbar('Ticket đã được giải quyết!', 'success');
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'error';
      case 'in-progress': return 'warning';
      case 'resolved': return 'success';
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'open': return 'Mở';
      case 'in-progress': return 'Đang xử lý';
      case 'resolved': return 'Đã giải quyết';
      default: return status;
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case 'high': return 'Cao';
      case 'medium': return 'Trung bình';
      case 'low': return 'Thấp';
      default: return priority;
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || ticket.priority === filterPriority;
    return matchesStatus && matchesPriority;
  });

  const ticketStats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    inProgress: tickets.filter(t => t.status === 'in-progress').length,
    resolved: tickets.filter(t => t.status === 'resolved').length
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Hỗ trợ kỹ thuật
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog('add')}
        >
          Tạo ticket mới
        </Button>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {ticketStats.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tổng số ticket
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="error.main">
                {ticketStats.open}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Đang chờ xử lý
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main">
                {ticketStats.inProgress}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Đang xử lý
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main">
                {ticketStats.resolved}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Đã giải quyết
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                label="Trạng thái"
              >
                <MenuItem value="all">Tất cả</MenuItem>
                <MenuItem value="open">Mở</MenuItem>
                <MenuItem value="in-progress">Đang xử lý</MenuItem>
                <MenuItem value="resolved">Đã giải quyết</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Độ ưu tiên</InputLabel>
              <Select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                label="Độ ưu tiên"
              >
                <MenuItem value="all">Tất cả</MenuItem>
                <MenuItem value="high">Cao</MenuItem>
                <MenuItem value="medium">Trung bình</MenuItem>
                <MenuItem value="low">Thấp</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Tickets Table */}
      <Paper sx={{ mb: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'grey.100' }}>
                <TableCell><strong>ID</strong></TableCell>
                <TableCell><strong>Tiêu đề</strong></TableCell>
                <TableCell><strong>Người dùng</strong></TableCell>
                <TableCell><strong>Danh mục</strong></TableCell>
                <TableCell><strong>Độ ưu tiên</strong></TableCell>
                <TableCell><strong>Trạng thái</strong></TableCell>
                <TableCell><strong>Người xử lý</strong></TableCell>
                <TableCell><strong>Ngày tạo</strong></TableCell>
                <TableCell><strong>Thao tác</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTickets.map((ticket) => (
                <TableRow key={ticket.id} hover>
                  <TableCell>#{ticket.id}</TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {ticket.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {ticket.description.substring(0, 50)}...
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>
                        {ticket.userName.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {ticket.userName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {ticket.userRole}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={ticket.category} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getPriorityText(ticket.priority)}
                      color={getPriorityColor(ticket.priority)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusText(ticket.status)}
                      color={getStatusColor(ticket.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {ticket.assignedToName ? (
                      <Typography variant="body2">{ticket.assignedToName}</Typography>
                    ) : (
                      <Typography variant="body2" color="text.secondary">Chưa gán</Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(ticket.createdAt).toLocaleDateString('vi-VN')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Xem chi tiết">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog('view', ticket)}
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Chỉnh sửa">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog('edit', ticket)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Gán ticket">
                        <IconButton
                          size="small"
                          onClick={() => handleAssignTicket(ticket.id, user.id, user.name)}
                        >
                          <AssignmentIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* FAQ Section */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <QuestionAnswerIcon color="primary" />
          Câu hỏi thường gặp (FAQ)
        </Typography>
        
        <Grid container spacing={2}>
          {faqData.map((faq) => (
            <Grid item xs={12} md={6} key={faq.id}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {faq.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {faq.answer}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip label={faq.category} size="small" variant="outlined" />
                    {faq.tags.map((tag, index) => (
                      <Chip key={index} label={tag} size="small" variant="outlined" />
                    ))}
                  </Box>
                </AccordionDetails>
              </Accordion>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Ticket Detail Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {dialogMode === 'add' ? 'Tạo ticket mới' : 
           dialogMode === 'edit' ? 'Chỉnh sửa ticket' : 'Chi tiết ticket'}
        </DialogTitle>
        <DialogContent>
          <TicketForm
            mode={dialogMode}
            ticket={selectedTicket}
            onSubmit={handleSubmitTicket}
            onClose={handleCloseDialog}
            onResolve={handleResolveTicket}
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

// Ticket Form Component
const TicketForm = ({ mode, ticket, onSubmit, onClose, onResolve }) => {
  const [formData, setFormData] = useState({
    title: ticket?.title || '',
    description: ticket?.description || '',
    category: ticket?.category || 'General',
    priority: ticket?.priority || 'medium',
    response: ticket?.response || '',
    resolution: ticket?.resolution || ''
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleResolve = () => {
    if (formData.resolution.trim()) {
      onResolve(ticket.id, formData.resolution);
      onClose();
    }
  };

  if (mode === 'view') {
    return (
      <Box sx={{ pt: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">Tiêu đề</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>{ticket.title}</Typography>
            
            <Typography variant="subtitle2" color="text.secondary">Danh mục</Typography>
            <Chip label={ticket.category} sx={{ mb: 2 }} />
            
            <Typography variant="subtitle2" color="text.secondary">Độ ưu tiên</Typography>
            <Chip
              label={ticket.priority === 'high' ? 'Cao' : ticket.priority === 'medium' ? 'Trung bình' : 'Thấp'}
              color={ticket.priority === 'high' ? 'error' : ticket.priority === 'medium' ? 'warning' : 'info'}
              sx={{ mb: 2 }}
            />
            
            <Typography variant="subtitle2" color="text.secondary">Trạng thái</Typography>
            <Chip
              label={ticket.status === 'open' ? 'Mở' : ticket.status === 'in-progress' ? 'Đang xử lý' : 'Đã giải quyết'}
              color={ticket.status === 'open' ? 'error' : ticket.status === 'in-progress' ? 'warning' : 'success'}
              sx={{ mb: 2 }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">Người dùng</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>{ticket.userName} ({ticket.userRole})</Typography>
            
            <Typography variant="subtitle2" color="text.secondary">Email</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>{ticket.userEmail}</Typography>
            
            <Typography variant="subtitle2" color="text.secondary">Ngày tạo</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {new Date(ticket.createdAt).toLocaleString('vi-VN')}
            </Typography>
            
            <Typography variant="subtitle2" color="text.secondary">Người xử lý</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {ticket.assignedToName || 'Chưa gán'}
            </Typography>
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary">Mô tả</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>{ticket.description}</Typography>
            
            {ticket.response && (
              <>
                <Typography variant="subtitle2" color="text.secondary">Phản hồi</Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>{ticket.response}</Typography>
              </>
            )}
            
            {ticket.resolution && (
              <>
                <Typography variant="subtitle2" color="text.secondary">Giải pháp</Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>{ticket.resolution}</Typography>
              </>
            )}
          </Grid>
          
          {ticket.status !== 'resolved' && (
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Giải pháp"
                value={formData.resolution}
                onChange={(e) => handleChange('resolution', e.target.value)}
                placeholder="Nhập giải pháp cho vấn đề này..."
                sx={{ mb: 2 }}
              />
              <Button
                variant="contained"
                color="success"
                onClick={handleResolve}
                disabled={!formData.resolution.trim()}
              >
                Đánh dấu đã giải quyết
              </Button>
            </Grid>
          )}
        </Grid>
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ pt: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Tiêu đề"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            required
            sx={{ mb: 2 }}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Danh mục</InputLabel>
            <Select
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              label="Danh mục"
            >
              <MenuItem value="General">Chung</MenuItem>
              <MenuItem value="Authentication">Xác thực</MenuItem>
              <MenuItem value="File Management">Quản lý file</MenuItem>
              <MenuItem value="UI/UX">Giao diện</MenuItem>
              <MenuItem value="Notifications">Thông báo</MenuItem>
              <MenuItem value="Performance">Hiệu suất</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Độ ưu tiên</InputLabel>
            <Select
              value={formData.priority}
              onChange={(e) => handleChange('priority', e.target.value)}
              label="Độ ưu tiên"
            >
              <MenuItem value="low">Thấp</MenuItem>
              <MenuItem value="medium">Trung bình</MenuItem>
              <MenuItem value="high">Cao</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Mô tả chi tiết"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Mô tả chi tiết vấn đề bạn gặp phải..."
            required
            sx={{ mb: 2 }}
          />
        </Grid>
        
        {mode === 'edit' && (
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Phản hồi"
              value={formData.response}
              onChange={(e) => handleChange('response', e.target.value)}
              placeholder="Nhập phản hồi cho người dùng..."
              sx={{ mb: 2 }}
            />
          </Grid>
        )}
      </Grid>
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
        <Button onClick={onClose}>Hủy</Button>
        <Button type="submit" variant="contained">
          {mode === 'add' ? 'Tạo ticket' : 'Cập nhật'}
        </Button>
      </Box>
    </Box>
  );
};

export default TechnicalSupport;