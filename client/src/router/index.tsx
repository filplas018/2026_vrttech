import { createBrowserRouter, Navigate } from 'react-router';
import { LoginPage, RegisterPage } from '@/pages';
import { AuthLayout, PageLayout } from '@/layouts';
import { ProtectedRoute } from '@/components';
import { HomePage } from '@/pages/HomePage';

export const router = createBrowserRouter([
  // Protected routes
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <PageLayout />,
        children: [
          {
            path: '',
            element: <HomePage />,
          },
        ],
      },
    ],
  },
  // Auth routes
  {
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
    ],
  },
  // Catch-all route to redirect to /chats
  {
    path: '*',
    element: <Navigate to='/chats' replace />,
  },
]);
