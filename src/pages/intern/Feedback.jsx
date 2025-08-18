import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Rating,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
  Alert,
  Snackbar,
  CircularProgress
} from '@mui/material';
import { Send, History } from '@mui/icons-material';
import feedbackService from '../../services/feedbackService';
import { useAuth } from '../../context/AuthContext';

const Feedback = () => {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [feedbackHistory, setFeedbackHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    loadFeedbackHistory();
  }, []);

  const loadFeedbackHistory = async () => {
    try {
      setLoading(true);
      const response = await feedbackService.getFeedbackByIntern(user.id);
      setFeedbackHistory(response.data);
    } catch (error) {
      console.error('Error loading feedback history:', error);
      showSnackbar('Không thể tải lịch sử phản hồi', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      showSnackbar('Vui lòng chọn đánh giá', 'warning');
      return;
    }

    try {
      setSubmitting(true);
      const feedbackData = {
        internId: user.id,
        mentorId: user.mentorId,
        type: 'program',
        rating: rating,
        comment: comment,
        category: 'program_experience'
      };

      await feedbackService.createFeedback(feedbackData);
      showSnackbar('Phản hồi đã được gửi thành công!', 'success');
      
      // Reset form
      setRating(0);
      setComment('');
      
      // Reload feedback history
      await loadFeedbackHistory();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      showSnackbar('Không thể gửi phản hồi', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Phản hồi</Typography>
      
      <Box component="form" sx={{ maxWidth: 600 }}>
        <Typography component="legend">Đánh giá của bạn</Typography>
        <Rating
          value={rating}
          onChange={(event, newValue) => setRating(newValue)}
          size="large"
        />
        
        <TextField
          fullWidth
          multiline
          rows={4}
          margin="normal"
          label="Nhận xét chi tiết"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        
        <Button
          variant="contained"
          endIcon={<Send />}
          onClick={handleSubmit}
          sx={{ mt: 2 }}
        >
          Gửi phản hồi
        </Button>
      </Box>

      <Divider sx={{ my: 3 }} />
      
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <History />
        Phản hồi trước đây
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" p={3}>
          <CircularProgress />
        </Box>
      ) : feedbackHistory.length > 0 ? (
        <List>
          {feedbackHistory.map((feedback) => (
            <ListItem key={feedback.id} divider>
              <ListItemText
                primary={
                  <Box display="flex" alignItems="center" gap={2}>
                    <Rating value={feedback.rating} readOnly size="small" />
                    <Chip 
                      label={feedback.type === 'program' ? 'Chương trình' : 'Mentor'} 
                      color="primary" 
                      size="small" 
                    />
                  </Box>
                }
                secondary={
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      {feedback.comment}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {new Date(feedback.createdAt).toLocaleDateString('vi-VN')}
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant="body2" color="textSecondary" textAlign="center" py={3}>
          Chưa có phản hồi nào
        </Typography>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Feedback;