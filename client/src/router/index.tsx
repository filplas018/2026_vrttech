import { createBrowserRouter, Navigate } from 'react-router';
import {
  LoginPage,
  ContactsSettingsPage,
  ProjectDetailPage,
  ProjectsPage,
  RegisterPage,
  UsersSettingsPage,
} from '@/pages';
import { AuthLayout, PageLayout } from '@/layouts';
import { ProtectedRoute } from '@/components';

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
            element: <ProjectsPage />,
            handle: { title: 'Vítejte na VRT domovské stránce' },

          },
          {
            path: 'projects',
            element: <ProjectsPage />,
            handle: { title: 'Projekty' },
          },
          {
            path: 'projects/:id',
            element: <ProjectDetailPage />,
            // handle: { },
          },
          {
            path: 'users/settings',
            element: <UsersSettingsPage />,
            handle: { title: 'Uživatelé' },
          },
          {
            path: 'contacts/settings',
            element: <ContactsSettingsPage />,
            handle: { title: 'Kontakty' },
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
  // Catch-all route to the project overview
  {
    path: '*',
    element: <Navigate to='/projects' replace />,
  },
]);
