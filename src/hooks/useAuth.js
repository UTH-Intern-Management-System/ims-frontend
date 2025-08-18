import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

/**
 * Custom hook để truy cập thông tin authentication
 * @returns {object} { user, login, logout, isAuthenticated }
 */
const useAuth = () => {
  const context = useContext(AuthContext);
  const navigate = useNavigate();

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const { user, loading, login: contextLogin, logout: contextLogout } = context;

  const login = async (credentials) => {
    try {
      const result = await contextLogin(credentials);
      if (result.success) {
        navigate('/dashboard'); // Redirect sau khi login thành công
      }
      return result;
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    contextLogout();
    navigate('/login'); // Redirect về trang login sau khi logout
  };

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
    isHR: user?.role === 'HR'
  };
};

export default useAuth;