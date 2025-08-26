import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';

const PublicOutlet = () => {
  const isAuthenticated = Cookies.get('accessToken');
  const location = useLocation();

  // Allow reset password page even if authenticated
  const isResetPasswordRoute = location.pathname.startsWith('/reset-password');

  return isAuthenticated && !isResetPasswordRoute ? (
    <Navigate to="/dashboard" />
  ) : (
    <Outlet />
  );
};

export default PublicOutlet;
