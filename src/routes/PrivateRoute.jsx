import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/common/Loading';

/**
 * Component bảo vệ route yêu cầu xác thực
 * @param {object} props 
 * @param {array} props.allowedRoles - Các role được phép truy cập
 * @param {JSX.Element} props.children - Component con sẽ render nếu được phép
 */
const PrivateRoute = ({ allowedRoles, children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loading fullHeight />;
  }

  // Nếu chưa đăng nhập, redirect đến trang login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Nếu role không được phép, redirect đến trang 404 hoặc trang không có quyền
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/not-authorized" replace />;
  }

  // Nếu đã đăng nhập và có quyền, render children
  return children;
};

export default PrivateRoute;