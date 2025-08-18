import { mockFeedback, mockUsers } from '../mocks/data';

const feedbackService = {
  // Get all feedback
  getAllFeedback: () => Promise.resolve({ data: mockFeedback }),
  
  // Get feedback by ID
  getFeedbackById: (id) => Promise.resolve({
    data: mockFeedback.find(feedback => feedback.id === id)
  }),
  
  // Get feedback by intern
  getFeedbackByIntern: (internId) => Promise.resolve({
    data: mockFeedback.filter(feedback => feedback.internId === internId)
  }),
  
  // Get feedback by mentor
  getFeedbackByMentor: (mentorId) => Promise.resolve({
    data: mockFeedback.filter(feedback => feedback.mentorId === mentorId)
  }),
  
  // Get feedback by type
  getFeedbackByType: (type) => Promise.resolve({
    data: mockFeedback.filter(feedback => feedback.type === type)
  }),
  
  // Create new feedback
  createFeedback: (feedbackData) => {
    const newFeedback = {
      ...feedbackData,
      id: Math.max(...mockFeedback.map(f => f.id)) + 1,
      createdAt: new Date().toISOString().split('T')[0],
      status: "submitted"
    };
    mockFeedback.push(newFeedback);
    return Promise.resolve({ data: newFeedback });
  },
  
  // Update feedback
  updateFeedback: (id, updatedData) => {
    const index = mockFeedback.findIndex(feedback => feedback.id === id);
    if (index > -1) {
      mockFeedback[index] = { ...mockFeedback[index], ...updatedData };
      return Promise.resolve({ data: mockFeedback[index] });
    }
    return Promise.reject(new Error("Feedback not found"));
  },
  
  // Delete feedback
  deleteFeedback: (id) => {
    const initialLength = mockFeedback.length;
    const filtered = mockFeedback.filter(feedback => feedback.id !== id);
    if (filtered.length < initialLength) {
      return Promise.resolve({ success: true });
    }
    return Promise.reject(new Error("Feedback not found"));
  },
  
  // Get feedback analytics
  getFeedbackAnalytics: () => {
    const totalFeedback = mockFeedback.length;
    const averageRating = mockFeedback.reduce((sum, f) => sum + f.rating, 0) / totalFeedback;
    const feedbackByType = mockFeedback.reduce((acc, f) => {
      acc[f.type] = (acc[f.type] || 0) + 1;
      return acc;
    }, {});
    
    const ratingDistribution = {
      "5.0": mockFeedback.filter(f => f.rating === 5.0).length,
      "4.0-4.9": mockFeedback.filter(f => f.rating >= 4.0 && f.rating < 5.0).length,
      "3.0-3.9": mockFeedback.filter(f => f.rating >= 3.0 && f.rating < 4.0).length,
      "2.0-2.9": mockFeedback.filter(f => f.rating >= 2.0 && f.rating < 3.0).length,
      "1.0-1.9": mockFeedback.filter(f => f.rating >= 1.0 && f.rating < 2.0).length
    };
    
    return Promise.resolve({
      data: {
        totalFeedback,
        averageRating: averageRating.toFixed(1),
        feedbackByType,
        ratingDistribution
      }
    });
  }
};

export default feedbackService;
