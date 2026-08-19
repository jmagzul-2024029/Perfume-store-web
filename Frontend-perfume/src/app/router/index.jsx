import { createBrowserRouter } from 'react-router-dom';

import ProtectedRoute from './ProtectedRoute';
import PublicLayout from '../layouts/PublicLayout';
import DashboardLayout from '../layouts/DashboardLayout';

import LoginPage from '../../features/auth/pages/LoginPage';
import ProductsPage from '../../features/products/pages/ProductsPage';
import ProductDetailPage from '../../features/products/pages/ProductDetailPage';
import AdminProductsPage from '../../features/products/pages/AdminProductsPage';

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
        ],
      },
    ],
  },
]);