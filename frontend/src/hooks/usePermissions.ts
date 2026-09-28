import { useMemo } from 'react';
import { useAuth } from './useAuth';
import { UserRole } from '../types';

/**
 * Mapeo de permisos por rol
 * Define qué permisos tiene cada rol en el sistema
 */
const ROLE_PERMISSIONS: Record<string, string[]> = {
  [UserRole.ADMIN]: [
    // Permisos completos
    'users:create',
    'users:read',
    'users:update',
    'users:delete',
    'products:create',
    'products:read',
    'products:update',
    'products:delete',
    'sales:create',
    'sales:read',
    'sales:update',
    'sales:delete',
    'sales:refund',
    'purchases:create',
    'purchases:read',
    'purchases:update',
    'purchases:delete',
    'purchases:refund',
    'clients:create',
    'clients:read',
    'clients:update',
    'clients:delete',
    'suppliers:create',
    'suppliers:read',
    'suppliers:update',
    'suppliers:delete',
    'portfolio:create',
    'portfolio:read',
    'portfolio:update',
    'portfolio:delete',
    'reports:read',
    'reports:export',
    'config:read',
    'config:update',
    'inventory:read',
    'inventory:adjust',
  ],
  [UserRole.MANAGER]: [
    'users:read',
    'products:create',
    'products:read',
    'products:update',
    'sales:create',
    'sales:read',
    'sales:update',
    'sales:refund',
    'purchases:create',
    'purchases:read',
    'purchases:update',
    'clients:create',
    'clients:read',
    'clients:update',
    'suppliers:create',
    'suppliers:read',
    'suppliers:update',
    'portfolio:create',
    'portfolio:read',
    'portfolio:update',
    'reports:read',
    'reports:export',
    'config:read',
    'inventory:read',
    'inventory:adjust',
  ],
  [UserRole.CASHIER]: [
    'products:read',
    'sales:create',
    'sales:read',
    'clients:read',
    'clients:create',
    'inventory:read',
  ],
  [UserRole.WAREHOUSE]: [
    'products:read',
    'products:update',
    'purchases:create',
    'purchases:read',
    'suppliers:read',
    'inventory:read',
    'inventory:adjust',
  ],
};

/**
 * Custom hook para verificar permisos basados en roles
 * Proporciona funciones para verificar si el usuario tiene permisos específicos
 */
export const usePermissions = () => {
  const { user, hasRole, hasAnyRole } = useAuth();

  /**
   * Obtiene todos los permisos del usuario actual basado en su rol
   */
  const permissions = useMemo(() => {
    if (!user?.role) return [];
    return ROLE_PERMISSIONS[user.role] || [];
  }, [user?.role]);

  /**
   * Verifica si el usuario tiene un permiso específico
   */
  const can = useMemo(
    () => (permission: string): boolean => {
      return permissions.includes(permission);
    },
    [permissions]
  );

  /**
   * Verifica si el usuario tiene alguno de los permisos especificados
   */
  const canAny = useMemo(
    () => (permissionList: string[]): boolean => {
      return permissionList.some((permission) => permissions.includes(permission));
    },
    [permissions]
  );

  /**
   * Verifica si el usuario tiene todos los permisos especificados
   */
  const canAll = useMemo(
    () => (permissionList: string[]): boolean => {
      return permissionList.every((permission) => permissions.includes(permission));
    },
    [permissions]
  );

  /**
   * Verifica si el usuario puede crear un recurso específico
   */
  const canCreate = useMemo(
    () => (resource: string): boolean => {
      return permissions.includes(`${resource}:create`);
    },
    [permissions]
  );

  /**
   * Verifica si el usuario puede leer un recurso específico
   */
  const canRead = useMemo(
    () => (resource: string): boolean => {
      return permissions.includes(`${resource}:read`);
    },
    [permissions]
  );

  /**
   * Verifica si el usuario puede actualizar un recurso específico
   */
  const canUpdate = useMemo(
    () => (resource: string): boolean => {
      return permissions.includes(`${resource}:update`);
    },
    [permissions]
  );

  /**
   * Verifica si el usuario puede eliminar un recurso específico
   */
  const canDelete = useMemo(
    () => (resource: string): boolean => {
      return permissions.includes(`${resource}:delete`);
    },
    [permissions]
  );

  /**
   * Verifica si el usuario es administrador
   */
  const isAdmin = useMemo(() => {
    return hasRole(UserRole.ADMIN);
  }, [hasRole]);

  /**
   * Verifica si el usuario es gerente o administrador
   */
  const isManagerOrAdmin = useMemo(() => {
    return hasAnyRole([UserRole.ADMIN, UserRole.MANAGER]);
  }, [hasAnyRole]);

  return {
    permissions,
    can,
    canAny,
    canAll,
    canCreate,
    canRead,
    canUpdate,
    canDelete,
    isAdmin,
    isManagerOrAdmin,
  };
};
