import React, { createContext, useState } from 'react';
import { mockUsers } from '../mocks/data';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const foundUser = mockUsers.find(
        (u) => u.email === email && u.password === password
      );
      if (foundUser) {
        setUser(foundUser);
        return { success: true, user: foundUser };
      }
      return { success: false, error: 'Invalid credentials' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);