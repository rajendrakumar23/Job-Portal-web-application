import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import useAuthStore from './context/authStore.js';
import useThemeStore from './context/themeStore.js';

import Layout from './components/layout/Layout.jsx';
import HomePage from './pages/HomePage.jsx';
import JobsPage from './pages/JobsPage.jsx';
import JobDetailPage from './pages/JobDetailPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import UserDashboard from './pages/UserDashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import AdminJobs from './pages/AdminJobs.jsx';
import AdminUsers from './pages/AdminUsers.jsx';
import AdminApplications from './pages/AdminApplications.jsx';
import NotFound from './pages/NotFound.jsx';
import AIChatbot from "./components/ai/AIChatbot";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, initialized } = useAuthStore();
  if (!initialized) return <div className="min-h-screen flex items-center justify-center"><Spinner /></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
};

const Spinner = () => (
  <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
);

export default function App() {
  const { initialize } = useAuthStore();
  const { init } = useThemeStore();

  useEffect(() => {
    init();
    initialize();
  }, []);

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: { fontFamily: 'DM Sans, sans-serif', fontSize: '14px', borderRadius: '12px' },
          success: { iconTheme: { primary: '#4f5df7', secondary: '#fff' } },
        }}
      />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="jobs" element={<JobsPage />} />
          <Route path="jobs/:id" element={<JobDetailPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
          <Route path="admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
          <Route path="admin/jobs" element={<ProtectedRoute adminOnly><AdminJobs /></ProtectedRoute>} />
          <Route path="admin/users" element={<ProtectedRoute adminOnly><AdminUsers /></ProtectedRoute>} />
          <Route path="admin/applications" element={<ProtectedRoute adminOnly><AdminApplications /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      <AIChatbot />
    </BrowserRouter>
  );
}
