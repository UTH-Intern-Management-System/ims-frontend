import { DATE_FORMATS } from './constants';
import dayjs from 'dayjs';

/**
 * Format date theo định dạng
 * @param {Date|string} date 
 * @param {string} format 
 * @returns {string}
 */
export const formatDate = (date, format = DATE_FORMATS.DISPLAY_DATE) => {
  return dayjs(date).format(format);
};

// Removed unused utility functions

/**
 * Xử lý lỗi từ API
 * @param {Error} error 
 * @returns {string}
 */
export const handleApiError = (error) => {
  console.error('API Error:', error);
  
  if (error.response) {
    // Server trả về lỗi
    return error.response.data.message || `Lỗi server: ${error.response.status}`;
  } else if (error.request) {
    // Không nhận được phản hồi từ server
    return 'Không thể kết nối đến server';
  } else {
    // Lỗi khi thiết lập request
    return 'Lỗi khi gửi yêu cầu';
  }
};

// Removed unused utility functions