import { User, Role, Permission } from '../models';
import tokenService from './token.service';
import { IUser } from '../types';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  roleId: number;
}

interface AuthResponse {
  user: Partial<IUser>;
  accessToken: string;
  refreshToken: string;
}

class AuthService {
  /**
   * Registra un nuevo usuario
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      // Verificar si el email ya existe
      const existingUser = await User.findOne({ where: { email: data.email } });
      if (existingUser) {
        throw new Error('EMAIL_ALREADY_EXISTS');
      }

      // Verificar que el rol existe
      const role = await Role.findByPk(data.roleId);
      if (!role) {
        throw new Error('ROLE_NOT_FOUND');
      }

      // Crear el usuario
      const user = await User.create({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        roleId: data.roleId,
        isActive: true,
      });

      // Generar tokens
      const tokens = tokenService.generateTokenPair(user as any);

      // Obtener datos del usuario sin la contraseña
      const userData = user.toJSON();

      return {
        user: userData,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Inicia sesión de un usuario
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // Buscar usuario por email
      const user = await User.findOne({
        where: { email: credentials.email },
        include: [
          {
            model: Role,
            as: 'role',
            include: [
              {
                model: Permission,
                as: 'permissions',
                through: { attributes: [] },
              },
            ],
          },
        ],
      });

      if (!user) {
        throw new Error('INVALID_CREDENTIALS');
      }

      // Verificar que el usuario esté activo
      if (!user.isActive) {
        throw new Error('USER_INACTIVE');
      }

      // Verificar contraseña
      const isPasswordValid = await user.comparePassword(credentials.password);
      if (!isPasswordValid) {
        throw new Error('INVALID_CREDENTIALS');
      }

      // Actualizar último login
      await user.update({ lastLogin: new Date() });

      // Generar tokens
      const tokens = tokenService.generateTokenPair(user as any);

      // Obtener datos del usuario sin la contraseña
      const userData = user.toJSON();

      return {
        user: userData,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Refresca el access token usando un refresh token válido
   */
  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      // Verificar el refresh token
      const decoded = tokenService.verifyRefreshToken(refreshToken);

      // Buscar el usuario
      const user = await User.findByPk(decoded.userId);
      if (!user) {
        throw new Error('USER_NOT_FOUND');
      }

      // Verificar que el usuario esté activo
      if (!user.isActive) {
        throw new Error('USER_INACTIVE');
      }

      // Generar nuevo access token
      const accessToken = tokenService.generateAccessToken(user as any);

      return { accessToken };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtiene información del usuario autenticado
   */
  async getAuthenticatedUser(userId: number): Promise<Partial<IUser>> {
    try {
      const user = await User.findByPk(userId, {
        include: [
          {
            model: Role,
            as: 'role',
            include: [
              {
                model: Permission,
                as: 'permissions',
                through: { attributes: [] },
              },
            ],
          },
        ],
      });

      if (!user) {
        throw new Error('USER_NOT_FOUND');
      }

      return user.toJSON();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Cambia la contraseña del usuario
   */
  async changePassword(
    userId: number,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error('USER_NOT_FOUND');
      }

      // Verificar contraseña actual
      const isPasswordValid = await user.comparePassword(currentPassword);
      if (!isPasswordValid) {
        throw new Error('INVALID_CURRENT_PASSWORD');
      }

      // Actualizar contraseña
      await user.update({ password: newPassword });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Solicita recuperación de contraseña
   */
  async requestPasswordReset(email: string): Promise<void> {
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        // No revelar si el email existe o no por seguridad
        return;
      }

      // TODO: Implementar lógica de envío de email con token de recuperación
      // Por ahora solo registramos el intento
      console.log(`Password reset requested for: ${email}`);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Verifica si un usuario tiene un permiso específico
   */
  async hasPermission(userId: number, module: string, action: string): Promise<boolean> {
    try {
      const user = await User.findByPk(userId, {
        include: [
          {
            model: Role,
            as: 'role',
            include: [
              {
                model: Permission,
                as: 'permissions',
                where: { module, action },
                required: false,
                through: { attributes: [] },
              },
            ],
          },
        ],
      });

      if (!user) {
        return false;
      }

      const role = (user as any).role;
      if (!role || !role.permissions || role.permissions.length === 0) {
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Obtiene todos los permisos de un usuario
   */
  async getUserPermissions(userId: number): Promise<string[]> {
    try {
      const user = await User.findByPk(userId, {
        include: [
          {
            model: Role,
            as: 'role',
            include: [
              {
                model: Permission,
                as: 'permissions',
                through: { attributes: [] },
              },
            ],
          },
        ],
      });

      if (!user) {
        return [];
      }

      const role = (user as any).role;
      if (!role || !role.permissions) {
        return [];
      }

      return role.permissions.map((p: any) => `${p.module}:${p.action}`);
    } catch (error) {
      return [];
    }
  }
}

export default new AuthService();
