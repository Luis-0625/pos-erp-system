import apiService from './api.service';
import {
  LoginCredentials,
  AuthResponse,
  ApiResponse,
  User,
} from '../types';

class AuthService {
  /**
   * Iniciar sesión
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiService.post<ApiResponse<AuthResponse>>(
      '/auth/login',
      credentials
    );
    
    if (response.success && response.data) {
      // Guardar token y usuario en localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data;
    }
    
    throw new Error(response.message || 'Error al iniciar sesión');
  }

  /**
   * Cerrar sesión
   */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  /**
   * Obtener usuario actual desde localStorage
   */
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        return null;
      }
    }
    return null;
  }

  /**
   * Verificar si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  /**
   * Obtener token
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Refrescar token
   */
  async refreshToken(): Promise<string> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiService.post<ApiResponse<{ token: string }>>(
      '/auth/refresh',
      { refreshToken }
    );

    if (response.success && response.data) {
      localStorage.setItem('token', response.data.token);
      return response.data.token;
    }

    throw new Error('Error al refrescar token');
  }

  /**
   * Cambiar contraseña
   */
  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const response = await apiService.post<ApiResponse>(
      '/auth/change-password',
      {
        currentPassword,
        newPassword,
      }
    );

    if (!response.success) {
      throw new Error(response.message || 'Error al cambiar contraseña');
    }
  }

  /**
   * Solicitar recuperación de contraseña
   */
  async forgotPassword(email: string): Promise<void> {
    const response = await apiService.post<ApiResponse>(
      '/auth/forgot-password',
      { email }
    );

    if (!response.success) {
      throw new Error(response.message || 'Error al solicitar recuperación');
    }
  }

  /**
   * Restablecer contraseña
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    const response = await apiService.post<ApiResponse>(
      '/auth/reset-password',
      {
        token,
        newPassword,
      }
    );

    if (!response.success) {
      throw new Error(response.message || 'Error al restablecer contraseña');
    }
  }
}

export default new AuthService();
