import { createBrowserRouter } from 'react-router-dom';

import ProtectedRoute from './ProtectedRoute';
import PublicLayout from '../layouts/PublicLayout';
import DashboardLayout from '../layouts/DashboardLayout';

import LoginPage from '../../features/auth/pages/LoginPage';
import { ForgotPasswordPage } from '../../features/auth/pages/ForgotPasswordPage';
import { ResetPasswordPage } from '../../features/auth/pages/ResetPasswordPage';
import { VerifyEmailPage } from '../../features/auth/pages/VerifyEmailPage';
import { RegisterPage } from '../../features/auth/pages/RegisterPage';
import ProductsPage from '../../features/products/pages/ProductsPage';
import ProductDetailPage from '../../features/products/pages/ProductDetailPage';
import AdminProductsPage from '../../features/products/pages/AdminProductsPage';
import { AdminUsersPage } from '../../features/auth/pages/AdminUsersPage';

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      {
        path: '/',
        element: <ProductsPage />,
      },
      {
        path: '/perfumes',
        element: <ProductsPage />,
      },
      {
        path: '/perfumes/:id',
        element: <ProductDetailPage />,
      },
    ],
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />,
  },
  {
    path: '/reset-password',
    element: <ResetPasswordPage />,
  },
  {
    path: '/verify-email',
    element: <VerifyEmailPage />,
  },
  {
    element: (
      <ProtectedRoute
        allowedRoles={['SUPER_ADMIN_ROLE', 'ADMIN_ROLE']}
      />
    ),
    children: [
      {
        element: <DashboardLayout />,
        children: [
          {
            path: '/dashboard',
            element: <AdminProductsPage />,
          },
          {
            path: '/dashboard/perfumes',
            element: <AdminProductsPage />,
          },
          {
            element: <ProtectedRoute allowedRoles={['SUPER_ADMIN_ROLE']} />,
            children: [
              {
                path: '/dashboard/admins',
                element: <AdminUsersPage />,
              },
            ],
          },
        ],
      },
    ],
  },
]);