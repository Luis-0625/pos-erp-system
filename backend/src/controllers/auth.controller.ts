import { Request, Response, NextFunction } from 'express';
import authService from '../services/auth.service';
import { AuthenticatedRequest } from '../types';

class AuthController {
  /**
   * POST /api/auth/register
   * Registra un nuevo usuario
   */
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password, firstName, lastName, roleId } = req.body;

      // Validar datos requeridos
      if (!email || !password || !firstName || !lastName || !roleId) {
        res.status(400).json({
          success: false,
          message: 'Todos los campos son requeridos',
        });
        return;
      }

      // Registrar usuario
      const result = await authService.register({
        email,
        password,
        firstName,
        lastName,
        roleId: parseInt(roleId),
      });

      res.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente',
        data: result,
      });
    } catch (error: any) {
      if (error.message === 'EMAIL_ALREADY_EXISTS') {
        res.status(409).json({
          success: false,
          message: 'El email ya está registrado',
        });
        return;
      }
      if (error.message === 'ROLE_NOT_FOUND') {
        res.status(404).json({
          success: false,
          message: 'El rol especificado no existe',
        });
        return;
      }
      next(error);
    }
  }

  /**
   * POST /api/auth/login
   * Inicia sesión
   */
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;

      // Validar datos requeridos
      if (!email || !password) {
        res.status(400).json({
          success: false,
          message: 'Email y contraseña son requeridos',
        });
        return;
      }

      // Iniciar sesión
      const result = await authService.login({ email, password });

      res.status(200).json({
        success: true,
        message: 'Inicio de sesión exitoso',
        data: result,
      });
    } catch (error: any) {
      if (error.message === 'INVALID_CREDENTIALS') {
        res.status(401).json({
          success: false,
          message: 'Credenciales inválidas',
        });
        return;
      }
      if (error.message === 'USER_INACTIVE') {
        res.status(403).json({
          success: false,
          message: 'Usuario inactivo. Contacte al administrador',
        });
        return;
      }
      next(error);
    }
  }

  /**
   * POST /api/auth/refresh
   * Refresca el access token
   */
  async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        res.status(400).json({
          success: false,
          message: 'Refresh token es requerido',
        });
        return;
      }

      const result = await authService.refreshToken(refreshToken);

      res.status(200).json({
        success: true,
        message: 'Token refrescado exitosamente',
        data: result,
      });
    } catch (error: any) {
      if (
        error.message === 'REFRESH_TOKEN_EXPIRED' ||
        error.message === 'INVALID_REFRESH_TOKEN'
      ) {
        res.status(401).json({
          success: false,
          message: 'Refresh token inválido o expirado',
        });
        return;
      }
      if (error.message === 'USER_NOT_FOUND' || error.message === 'USER_INACTIVE') {
        res.status(403).json({
          success: false,
          message: 'Usuario no encontrado o inactivo',
        });
        return;
      }
      next(error);
    }
  }

  /**
   * GET /api/auth/me
   * Obtiene información del usuario autenticado
   */
  async getMe(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'No autenticado',
        });
        return;
      }

      const user = await authService.getAuthenticatedUser(req.user.id);

      res.status(200).json({
        success: true,
        message: 'Usuario obtenido exitosamente',
        data: user,
      });
    } catch (error: any) {
      if (error.message === 'USER_NOT_FOUND') {
        res.status(404).json({
          success: false,
          message: 'Usuario no encontrado',
        });
        return;
      }
      next(error);
    }
  }

  /**
   * POST /api/auth/change-password
   * Cambia la contraseña del usuario
   */
  async changePassword(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'No autenticado',
        });
        return;
      }

      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        res.status(400).json({
          success: false,
          message: 'Contraseña actual y nueva contraseña son requeridas',
        });
        return;
      }

      if (newPassword.length < 6) {
        res.status(400).json({
          success: false,
          message: 'La nueva contraseña debe tener al menos 6 caracteres',
        });
        return;
      }

      await authService.changePassword(req.user.id, currentPassword, newPassword);

      res.status(200).json({
        success: true,
        message: 'Contraseña cambiada exitosamente',
      });
    } catch (error: any) {
      if (error.message === 'USER_NOT_FOUND') {
        res.status(404).json({
          success: false,
          message: 'Usuario no encontrado',
        });
        return;
      }
      if (error.message === 'INVALID_CURRENT_PASSWORD') {
        res.status(400).json({
          success: false,
          message: 'Contraseña actual incorrecta',
        });
        return;
      }
      next(error);
    }
  }

  /**
   * POST /api/auth/request-password-reset
   * Solicita recuperación de contraseña
   */
  async requestPasswordReset(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email } = req.body;

      if (!email) {
        res.status(400).json({
          success: false,
          message: 'Email es requerido',
        });
        return;
      }

      await authService.requestPasswordReset(email);

      // Siempre devolver éxito por seguridad
      res.status(200).json({
        success: true,
        message: 'Si el email existe, recibirás instrucciones para recuperar tu contraseña',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/auth/permissions
   * Obtiene los permisos del usuario autenticado
   */
  async getPermissions(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'No autenticado',
        });
        return;
      }

      const permissions = await authService.getUserPermissions(req.user.id);

      res.status(200).json({
        success: true,
        message: 'Permisos obtenidos exitosamente',
        data: permissions,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/logout
   * Cierra la sesión (en el cliente se eliminan los tokens)
   */
  async logout(req: Request, res: Response): Promise<void> {
    // El logout se maneja en el cliente eliminando los tokens
    // Aquí solo confirmamos la acción
    res.status(200).json({
      success: true,
      message: 'Sesión cerrada exitosamente',
    });
  }
}

export default new AuthController();
