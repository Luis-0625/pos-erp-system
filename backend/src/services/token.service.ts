import jwt from 'jsonwebtoken';
import { IUser } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

interface TokenPayload {
  userId: number;
  email: string;
  roleId: number;
  iat?: number;
  exp?: number;
}

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

class TokenService {
  /**
   * Genera un access token JWT
   */
  generateAccessToken(user: IUser): string {
    const payload: TokenPayload = {
      userId: user.id,
      email: user.email,
      roleId: user.roleId,
    };

    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });
  }

  /**
   * Genera un refresh token JWT
   */
  generateRefreshToken(user: IUser): string {
    const payload: TokenPayload = {
      userId: user.id,
      email: user.email,
      roleId: user.roleId,
    };

    return jwt.sign(payload, JWT_REFRESH_SECRET, {
      expiresIn: JWT_REFRESH_EXPIRES_IN,
    });
  }

  /**
   * Genera ambos tokens (access y refresh)
   */
  generateTokenPair(user: IUser): TokenPair {
    return {
      accessToken: this.generateAccessToken(user),
      refreshToken: this.generateRefreshToken(user),
    };
  }

  /**
   * Verifica un access token
   */
  verifyAccessToken(token: string): TokenPayload {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('TOKEN_EXPIRED');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('INVALID_TOKEN');
      }
      throw new Error('TOKEN_VERIFICATION_FAILED');
    }
  }

  /**
   * Verifica un refresh token
   */
  verifyRefreshToken(token: string): TokenPayload {
    try {
      const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as TokenPayload;
      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('REFRESH_TOKEN_EXPIRED');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('INVALID_REFRESH_TOKEN');
      }
      throw new Error('REFRESH_TOKEN_VERIFICATION_FAILED');
    }
  }

  /**
   * Decodifica un token sin verificar (útil para debugging)
   */
  decodeToken(token: string): TokenPayload | null {
    try {
      return jwt.decode(token) as TokenPayload;
    } catch (error) {
      return null;
    }
  }

  /**
   * Extrae el token del header Authorization
   */
  extractTokenFromHeader(authHeader: string | undefined): string | null {
    if (!authHeader) {
      return null;
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return null;
    }

    return parts[1];
  }

  /**
   * Calcula el tiempo restante de un token en segundos
   */
  getTokenExpirationTime(token: string): number | null {
    try {
      const decoded = this.decodeToken(token);
      if (!decoded || !decoded.exp) {
        return null;
      }

      const now = Math.floor(Date.now() / 1000);
      const expiresIn = decoded.exp - now;

      return expiresIn > 0 ? expiresIn : 0;
    } catch (error) {
      return null;
    }
  }

  /**
   * Verifica si un token está próximo a expirar
   * @param token - Token a verificar
   * @param thresholdSeconds - Umbral en segundos (por defecto 5 minutos)
   */
  isTokenExpiringSoon(token: string, thresholdSeconds: number = 300): boolean {
    const expiresIn = this.getTokenExpirationTime(token);
    if (expiresIn === null) {
      return true;
    }

    return expiresIn < thresholdSeconds;
  }
}

export default new TokenService();
