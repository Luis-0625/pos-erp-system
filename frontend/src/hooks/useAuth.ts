import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../store';
import { login as loginAction, logout as logoutAction, setUser } from '../store/slices/authSlice';
import { LoginCredentials, User } from '../types';

/**
 * Custom hook para gestionar la autenticación del usuario
 * Proporciona acceso al estado de autenticación y funciones para login/logout
 */
export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const { user, isAuthenticated, loading, error } = useSelector(
    (state: RootState) => state.auth
  );

  /**
   * Inicia sesión con las credenciales proporcionadas
   */
  const login = useCallback(
    async (credentials: LoginCredentials) => {
      try {
        const result = await dispatch(loginAction(credentials)).unwrap();
        navigate('/dashboard');
        return result;
      } catch (error) {
        throw error;
      }
    },
    [dispatch, navigate]
  );

  /**
   * Cierra la sesión del usuario actual
   */
  const logout = useCallback(() => {
    dispatch(logoutAction());
    navigate('/login');
  }, [dispatch, navigate]);

  /**
   * Actualiza el usuario en el estado
   */
  const updateUser = useCallback(
    (userData: User) => {
      dispatch(setUser(userData));
    },
    [dispatch]
  );

  /**
   * Verifica si el usuario tiene un rol específico
   */
  const hasRole = useCallback(
    (role: string): boolean => {
      return user?.role === role;
    },
    [user]
  );

  /**
   * Verifica si el usuario tiene alguno de los roles proporcionados
   */
  const hasAnyRole = useCallback(
    (roles: string[]): boolean => {
      return user ? roles.includes(user.role) : false;
    },
    [user]
  );

  /**
   * Verifica si el usuario tiene permiso específico
   */
  const hasPermission = useCallback(
    (permission: string): boolean => {
      if (!user?.permissions) return false;
      return user.permissions.includes(permission);
    },
    [user]
  );

  /**
   * Verifica si el usuario tiene alguno de los permisos proporcionados
   */
  const hasAnyPermission = useCallback(
    (permissions: string[]): boolean => {
      if (!user?.permissions) return false;
      return permissions.some(permission => user.permissions?.includes(permission));
    },
    [user]
  );

  /**
   * Verifica si el usuario tiene todos los permisos proporcionados
   */
  const hasAllPermissions = useCallback(
    (permissions: string[]): boolean => {
      if (!user?.permissions) return false;
      return permissions.every(permission => user.permissions?.includes(permission));
    },
    [user]
  );

  return {
    // Estado
    user,
    isAuthenticated,
    loading,
    error,
    
    // Funciones
    login,
    logout,
    updateUser,
    
    // Verificaciones de roles y permisos
    hasRole,
    hasAnyRole,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  };
};
