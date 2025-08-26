import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, useMemo } from 'react';
import { useSelector } from 'react-redux';
import EntityListPage from '../pages/entity/EntityListPage';
import CategoryListPage from '../pages/category/CategoryListPage';
import FeeHeadListPage from '../pages/feehead/FeeHeadListPage';
import GoogleLoginPage from '../pages/login/GoogleLoginPage';
import OrganizationListPage from '../pages/superadmin/OrganizationListPage';
import OrganizationDashboardPage from '../pages/organizations/DashboardPage';
import StaffListPage from '../pages/organizations/StaffListPage';
import StaffListDetailsPage from '../pages/organizations/StaffListDetailsPage';
import PlanListPage from '../pages/plan/PlanListPage';
// Lazy load the components
const PublicOutlet = lazy(() => import('./PublicOutlet'));
const PrivateOutlet = lazy(() => import('./PrivateOutlet'));
const HomePage = lazy(() => import('../pages/home/HomePage'));
const LoginPage = lazy(() => import('../pages/login/LoginPage'));
const ResetPassword = lazy(() => import('../components/ResetPassword'));
const SuperAdminDashboardPage = lazy(() => import('../pages/superadmin/DashboardPage'));
const DashboardPage = lazy(() => import('../pages/dashboard/DashboardPage'));
const NotFoundPage = lazy(() => import('../pages/notFound/NotFoundPage'));

const RouterComponent = () => {
  const { userRole } = useSelector((state) => state.userDetailsSlice.details);
  console.log("userRole",userRole);
  
const DashboardRoute = () => {
  if (userRole === '0') {
    return <SuperAdminDashboardPage />;
  }
  else if (userRole === '1') {
    return <OrganizationDashboardPage />;
  }

  return <DashboardPage />;
};


  // useMemo to prevent re-creation of router object on every render
  const router = useMemo(() => {
    return createBrowserRouter([
      {
        path: '/',
        element: <Navigate to="/login" replace />,
      },
      {
        path: '/google-login',
        element: <GoogleLoginPage />,
      },

      {
        path: '/login',
        element: <PublicOutlet />,
        children: [
          {
            index: true,
            element: <LoginPage />,
          },
        ],
      },
      {
        path: '/reset-password',
        element: <PublicOutlet />,
        children: [
          {
            index: true,
            element: <ResetPassword />,
          },
        ],
      },
      {
        path: '/',
        element: <PrivateOutlet />,
        children: [
          {
            element: <HomePage />,
            children: [
              {
                path: 'dashboard',
                element: <DashboardRoute />,
              },
              //Super Admin related routes
              {
                path: '/organization-master',
                element: <OrganizationListPage />,
              },
              {
                path: '/plan-master',
                element: < PlanListPage/>,
              },
              //Organization related routes
              {
                path: '/staff-master',
                element: <StaffListPage />,
              },
              {
                path: '/staff-list/staff-details/:staffId',
                element: <StaffListDetailsPage />,
              },

              //Staff related routes
              {
                path: '/category-list',
                element: <CategoryListPage />,
              },
              {
                path: '/feehead-list',
                element: <FeeHeadListPage />,
              },
            ],
          },
        ],
      },
      {
        path: '/',
        element: <PrivateOutlet />,
        children: [
          {
            element: <HomePage />,
            children: [
              {
                path: 'dashboard',
                element: <DashboardPage />,
              },
            ],
          },
        ],
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ]);
  }, [userRole]); // Only recreate the router if userRole changes

  return router;
};

export default RouterComponent;
