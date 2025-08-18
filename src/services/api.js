import axios from 'axios';
import { toast } from 'react-hot-toast';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    }
    return Promise.reject(error);
  }
);

export default api;