import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector } from './store/hooks';

// Components
import ProtectedRoute from './components/auth/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';

// Pages
import Login from './pages/auth/Login';
import Unauthorized from './pages/auth/Unauthorized';
import NotFound from './pages/NotFound';
import Dashboard from './pages/Dashboard';

// Loading fallback component
const LoadingFallback: React.FC = () => (
  <div className="flex min-h-screen items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600"></div>
      <p className="mt-4 text-gray-600">Cargando...</p>
    </div>
  </div>
);

function App() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return (
    <div className="App">
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
            }
          />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Protected Routes with MainLayout */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            {/* Dashboard */}
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />

            {/* Placeholder routes for future modules */}
            {/* 
            TODO: Implement in Phase 3
            - Products module (list, create, edit, categories)
            - Sales module (POS, list, details)
            - Purchases module (list, create, details)
            - Clients module (list, create, edit)
            - Suppliers module (list, create, edit)
            - Portfolio module (receivables, payables, payments)
            - Reports module (sales, purchases, inventory, financial)
            - Settings module (company, taxes, users, roles)
            */}
          </Route>

          {/* 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
