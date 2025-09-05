import React, { createContext, useState, useEffect } from 'react';
import { mockUsers } from '../mocks/data';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on app load
  useEffect(() => {
    const checkExistingSession = () => {
      try {
        const savedUser = localStorage.getItem('ims_user');
        const sessionExpiry = localStorage.getItem('ims_session_expiry');
        
        if (savedUser && sessionExpiry) {
          const now = new Date().getTime();
          const expiry = parseInt(sessionExpiry);
          
          // Check if session is still valid (24 hours)
          if (now < expiry) {
            const userData = JSON.parse(savedUser);
            setUser(userData);
          } else {
            // Session expired, clear storage
            localStorage.removeItem('ims_user');
            localStorage.removeItem('ims_session_expiry');
          }
        }
      } catch (error) {
        console.error('Error checking existing session:', error);
        // Clear corrupted data
        localStorage.removeItem('ims_user');
        localStorage.removeItem('ims_session_expiry');
      } finally {
        setLoading(false);
      }
    };

    checkExistingSession();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const foundUser = mockUsers.find(
        (u) => u.email === email && u.password === password
      );
      if (foundUser) {
        // Remove password from stored user data for security
        const userToStore = { ...foundUser };
        delete userToStore.password;
        
        setUser(userToStore);
        
        // Store user data and session expiry in localStorage
        localStorage.setItem('ims_user', JSON.stringify(userToStore));
        // Set session to expire in 24 hours
        const expiryTime = new Date().getTime() + (24 * 60 * 60 * 1000);
        localStorage.setItem('ims_session_expiry', expiryTime.toString());
        
        return { success: true, user: userToStore };
      }
      return { success: false, error: 'Invalid credentials' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    // Clear stored session data
    localStorage.removeItem('ims_user');
    localStorage.removeItem('ims_session_expiry');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);