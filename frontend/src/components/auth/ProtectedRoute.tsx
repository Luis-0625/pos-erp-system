/**
 * ProtectedRoute Component
 * 
 * Componente para proteger rutas que requieren autenticación
 * Redirige a login si el usuario no está autenticado
 */

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
  requiredPermissions?: string[];
  fallback?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles,
  requiredPermissions,
  fallback,
}) => {
  const { isAuthenticated, hasRole, hasPermission } = useAuth();
  const location = useLocation();

  // Si no está autenticado, redirigir a login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verificar roles requeridos
  if (requiredRoles && requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.some((role) => hasRole(role));
    
    if (!hasRequiredRole) {
      // Si hay un fallback personalizado, mostrarlo
      if (fallback) {
        return <>{fallback}</>;
      }
      
      // Si no, redirigir a página de acceso denegado
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Verificar permisos requeridos
  if (requiredPermissions && requiredPermissions.length > 0) {
    const hasRequiredPermission = requiredPermissions.every((permission) =>
      hasPermission(permission)
    );
    
    if (!hasRequiredPermission) {
      // Si hay un fallback personalizado, mostrarlo
      if (fallback) {
        return <>{fallback}</>;
      }
      
      // Si no, redirigir a página de acceso denegado
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Usuario autenticado y con los permisos necesarios
  return <>{children}</>;
};

export default ProtectedRoute;
