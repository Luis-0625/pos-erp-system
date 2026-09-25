import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from '../types';
import { sendUnauthorized, sendForbidden } from '../utils/response.util';

/**
 * Middleware para verificar el token JWT
 */
export const verifyToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Obtener token del header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      sendUnauthorized(res, 'Token no proporcionado');
      return;
    }

    const token = authHeader.substring(7); // Remover 'Bearer '

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;

    // Agregar información del usuario a la request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      permissions: decoded.permissions || [],
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      sendUnauthorized(res, 'Token expirado');
      return;
    }
    if (error instanceof jwt.JsonWebTokenError) {
      sendUnauthorized(res, 'Token inválido');
      return;
    }
    sendUnauthorized(res, 'Error al verificar token');
  }
};

/**
 * Middleware para verificar roles
 */
export const checkRole = (...allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendUnauthorized(res, 'Usuario no autenticado');
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      sendForbidden(res, 'No tiene permisos para realizar esta acción');
      return;
    }

    next();
  };
};

/**
 * Middleware para verificar permisos específicos
 */
export const checkPermission = (...requiredPermissions: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendUnauthorized(res, 'Usuario no autenticado');
      return;
    }

    const hasPermission = requiredPermissions.every((permission) =>
      req.user!.permissions.includes(permission)
    );

    if (!hasPermission) {
      sendForbidden(res, 'No tiene los permisos necesarios');
      return;
    }

    next();
  };
};
