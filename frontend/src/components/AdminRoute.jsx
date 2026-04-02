import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminRoute = () => {
  const { userInfo } = useSelector((state) => state.user);
  const location = useLocation();

  if (userInfo && userInfo.isAdmin) {
    return <Outlet />;
  } else {
    // Redirect to login if not logged in, or back to home if just not admin
    return <Navigate to={userInfo ? '/' : `/login?redirect=${location.pathname}`} replace />;
  }
};

export default AdminRoute;
