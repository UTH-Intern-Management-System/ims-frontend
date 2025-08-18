import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  IconButton,
  Tooltip,
  Badge,
  Divider,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import { 
  Send, 
  Message, 
  Person, 
  Search,
  MoreVert,
  AttachFile,
  EmojiEmotions,
  VideoCall,
  Phone,
  Archive,
  Block,
  Report
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const Communication = () => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [selectedIntern, setSelectedIntern] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const messagesEndRef = useRef(null);

  // Enhanced mock data for communication
  const interns = [
    { 
      id: 9, 
      name: 'Software Dev Intern', 
      avatar: 'SD', 
      status: 'online',
      department: 'Engineering',
      lastMessage: 'Em đang gặp vấn đề với React Hooks',
      lastMessageTime: '09:05',
      unreadCount: 2,
      skills: ['React', 'JavaScript', 'Node.js'],
      currentTask: 'React Component Development'
    },
    { 
      id: 13, 
      name: 'UI/UX Design Intern', 
      avatar: 'UI', 
      status: 'online',
      department: 'Design',
      lastMessage: 'Dạ thưa mentor, em đã hoàn thành prototype',
      lastMessageTime: '08:30',
      unreadCount: 0,
      skills: ['Figma', 'Adobe XD', 'User Research'],
      currentTask: 'User Research Survey'
    },
    { 
      id: 10, 
      name: 'Marketing Intern', 
      avatar: 'MI', 
      status: 'offline',
      department: 'Marketing',
      lastMessage: 'Em cần hỗ trợ về Google Ads',
      lastMessageTime: 'Yesterday',
      unreadCount: 1,
      skills: ['Social Media', 'Content Writing', 'Analytics'],
      currentTask: 'Content Calendar Creation'
    }
  ];

  const chatHistory = {
    9: [
      { id: 1, sender: 'mentor', text: 'Chào em, hôm nay có gì cần hỗ trợ không?', time: '09:00', type: 'text' },
      { id: 2, sender: 'intern', text: 'Dạ thưa anh, em đang gặp vấn đề với React Hooks', time: '09:05', type: 'text' },
      { id: 3, sender: 'mentor', text: 'Em có thể chia sẻ code để anh xem không?', time: '09:10', type: 'text' },
      { id: 4, sender: 'intern', text: 'Dạ, em sẽ gửi code qua email ạ', time: '09:12', type: 'text' },
      { id: 5, sender: 'mentor', text: 'Tốt, em gửi xong thì anh sẽ review và hướng dẫn', time: '09:15', type: 'text' }
    ],
    13: [
      { id: 1, sender: 'mentor', text: 'Chào em, prototype hôm nay thế nào?', time: '08:00', type: 'text' },
      { id: 2, sender: 'intern', text: 'Dạ thưa mentor, em đã hoàn thành prototype', time: '08:30', type: 'text' },
      { id: 3, sender: 'mentor', text: 'Tuyệt vời! Em có thể share link để mentor xem không?', time: '08:35', type: 'text' },
      { id: 4, sender: 'intern', text: 'Dạ, em sẽ gửi link Figma ạ', time: '08:40', type: 'text' }
    ],
    10: [
      { id: 1, sender: 'mentor', text: 'Chào em, có cần hỗ trợ gì không?', time: 'Yesterday', type: 'text' },
      { id: 2, sender: 'intern', text: 'Dạ thưa mentor, em cần hỗ trợ về Google Ads', time: 'Yesterday', type: 'text' },
      { id: 3, sender: 'mentor', text: 'Em có thể mô tả cụ thể vấn đề gì không?', time: 'Yesterday', type: 'text' }
    ]
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedIntern]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (message.trim() && selectedIntern) {
      const newMessage = {
        id: Date.now(),
        sender: 'mentor',
        text: message.trim(),
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        type: 'text'
      };

      // Add to chat history
      if (!chatHistory[selectedIntern.id]) {
        chatHistory[selectedIntern.id] = [];
      }
      chatHistory[selectedIntern.id].push(newMessage);

      // Update intern's last message
      const internIndex = interns.findIndex(intern => intern.id === selectedIntern.id);
      if (internIndex !== -1) {
        interns[internIndex].lastMessage = message.trim();
        interns[internIndex].lastMessageTime = newMessage.time;
      }

      setMessage('');
      scrollToBottom();
      showSnackbar('Tin nhắn đã được gửi!', 'success');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInternSelect = (intern) => {
    setSelectedIntern(intern);
    // Mark messages as read
    if (intern.unreadCount > 0) {
      const internIndex = interns.findIndex(i => i.id === intern.id);
      if (internIndex !== -1) {
        interns[internIndex].unreadCount = 0;
      }
    }
  };

  const filteredInterns = interns.filter(intern => {
    const matchesSearch = intern.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         intern.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || intern.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const getStatusColor = (status) => {
    return status === 'online' ? 'success' : 'default';
  };

  const getStatusText = (status) => {
    return status === 'online' ? 'Online' : 'Offline';
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Giao tiếp với thực tập sinh
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<VideoCall />}
            onClick={() => setOpenDialog(true)}
          >
            Tạo cuộc họp
          </Button>
          <Button
            variant="outlined"
            startIcon={<Phone />}
            onClick={() => setOpenDialog(true)}
          >
            Gọi điện
          </Button>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {interns.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Thực tập sinh
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main">
                {interns.filter(intern => intern.status === 'online').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Đang online
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main">
                {interns.reduce((sum, intern) => sum + intern.unreadCount, 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tin nhắn chưa đọc
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="info.main">
                {Object.keys(chatHistory).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Cuộc hội thoại
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', gap: 3, height: '70vh' }}>
        {/* Interns List */}
        <Paper sx={{ width: 350, p: 2 }}>
          {/* Search and Filter */}
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Tìm kiếm thực tập sinh..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ color: 'text.secondary', mr: 1 }} />
              }}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth size="small">
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                label="Trạng thái"
              >
                <MenuItem value="all">Tất cả</MenuItem>
                <MenuItem value="online">Online</MenuItem>
                <MenuItem value="offline">Offline</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Typography variant="h6" gutterBottom>
            Danh sách thực tập sinh
          </Typography>
          
          <List sx={{ maxHeight: 'calc(70vh - 200px)', overflow: 'auto' }}>
            {filteredInterns.map((intern) => (
              <ListItem
                key={intern.id}
                button
                selected={selectedIntern?.id === intern.id}
                onClick={() => handleInternSelect(intern)}
                sx={{
                  borderRadius: 1,
                  mb: 1,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.light',
                    '&:hover': {
                      backgroundColor: 'primary.light'
                    }
                  }
                }}
              >
                <ListItemAvatar>
                  <Badge
                    badgeContent={intern.unreadCount}
                    color="error"
                    invisible={intern.unreadCount === 0}
                  >
                    <Avatar sx={{ bgcolor: intern.status === 'online' ? 'success.main' : 'grey.500' }}>
                      {intern.avatar}
                    </Avatar>
                  </Badge>
                </ListItemAvatar>
                <ListItemText 
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {intern.name}
                      </Typography>
                      <Chip 
                        label={getStatusText(intern.status)} 
                        size="small" 
                        color={getStatusColor(intern.status)}
                        variant="outlined"
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        {intern.department}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        {intern.currentTask}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        {intern.lastMessage}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {intern.lastMessageTime}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Paper>

        {/* Chat Area */}
        <Paper sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {selectedIntern ? (
            <>
              {/* Chat Header */}
              <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h6">
                      {selectedIntern.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedIntern.department} • {getStatusText(selectedIntern.status)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Gọi video">
                      <IconButton size="small" color="primary">
                        <VideoCall />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Gọi điện">
                      <IconButton size="small" color="primary">
                        <Phone />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Thêm tùy chọn">
                      <IconButton size="small">
                        <MoreVert />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </Box>

              {/* Messages */}
              <Box sx={{ flex: 1, p: 2, overflow: 'auto', bgcolor: 'grey.50' }}>
                <List>
                  {chatHistory[selectedIntern.id]?.map((msg) => (
                    <ListItem key={msg.id} sx={{ flexDirection: 'column', alignItems: 'flex-start', px: 0 }}>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1, 
                        mb: 0.5,
                        alignSelf: msg.sender === 'mentor' ? 'flex-end' : 'flex-start'
                      }}>
                        {msg.sender === 'mentor' ? (
                          <Person color="primary" fontSize="small" />
                        ) : (
                          <Avatar sx={{ width: 20, height: 20, fontSize: 10 }}>
                            {selectedIntern.avatar}
                          </Avatar>
                        )}
                        <Typography variant="caption" color="textSecondary">
                          {msg.time}
                        </Typography>
                      </Box>
                      <Paper 
                        sx={{ 
                          p: 1.5, 
                          bgcolor: msg.sender === 'mentor' ? 'primary.main' : 'white',
                          color: msg.sender === 'mentor' ? 'white' : 'text.primary',
                          maxWidth: '70%',
                          alignSelf: msg.sender === 'mentor' ? 'flex-end' : 'flex-start',
                          boxShadow: 1,
                          borderRadius: 2
                        }}
                      >
                        <Typography variant="body2">{msg.text}</Typography>
                      </Paper>
                    </ListItem>
                  ))}
                  <div ref={messagesEndRef} />
                </List>
              </Box>

              {/* Message Input */}
              <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
                  <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                    <Tooltip title="Đính kèm file">
                      <IconButton size="small">
                        <AttachFile />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Emoji">
                      <IconButton size="small">
                        <EmojiEmotions />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    size="small"
                    placeholder="Nhập tin nhắn..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <Button
                    variant="contained"
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    startIcon={<Send />}
                    sx={{ minWidth: 'auto', px: 2 }}
                  >
                    Gửi
                  </Button>
                </Box>
              </Box>
            </>
          ) : (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              height: '100%',
              color: 'text.secondary'
            }}>
              <Message sx={{ fontSize: 64, mb: 2, color: 'primary.main' }} />
              <Typography variant="h6" gutterBottom>
                Chọn thực tập sinh để bắt đầu chat
              </Typography>
              <Typography variant="body2" textAlign="center">
                Sử dụng công cụ giao tiếp để hỗ trợ và hướng dẫn thực tập sinh
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>

      {/* Meeting/Call Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Tạo cuộc họp/Gọi điện
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Tính năng này sẽ được tích hợp với hệ thống video call trong tương lai.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Communication;
