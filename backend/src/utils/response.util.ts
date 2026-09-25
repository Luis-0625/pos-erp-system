import { Response } from 'express';
import { ApiResponse, PaginatedResponse } from '../types';

/**
 * Utilidad para enviar respuestas exitosas
 */
export const sendSuccess = <T>(
  res: Response,
  data: T,
  message: string = 'Operación exitosa',
  statusCode: number = 200
): Response => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
  };
  return res.status(statusCode).json(response);
};

/**
 * Utilidad para enviar respuestas de error
 */
export const sendError = (
  res: Response,
  message: string = 'Ha ocurrido un error',
  statusCode: number = 500,
  error?: string
): Response => {
  const response: ApiResponse = {
    success: false,
    message,
    error,
  };
  return res.status(statusCode).json(response);
};

/**
 * Utilidad para enviar respuestas paginadas
 */
export const sendPaginated = <T>(
  res: Response,
  data: T[],
  page: number,
  limit: number,
  total: number,
  message: string = 'Datos obtenidos correctamente'
): Response => {
  const response: PaginatedResponse<T[]> = {
    success: true,
    message,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
  return res.status(200).json(response);
};

/**
 * Utilidad para enviar respuesta de recurso creado
 */
export const sendCreated = <T>(
  res: Response,
  data: T,
  message: string = 'Recurso creado exitosamente'
): Response => {
  return sendSuccess(res, data, message, 201);
};

/**
 * Utilidad para enviar respuesta de no autorizado
 */
export const sendUnauthorized = (
  res: Response,
  message: string = 'No autorizado'
): Response => {
  return sendError(res, message, 401);
};

/**
 * Utilidad para enviar respuesta de prohibido
 */
export const sendForbidden = (
  res: Response,
  message: string = 'Acceso prohibido'
): Response => {
  return sendError(res, message, 403);
};

/**
 * Utilidad para enviar respuesta de no encontrado
 */
export const sendNotFound = (
  res: Response,
  message: string = 'Recurso no encontrado'
): Response => {
  return sendError(res, message, 404);
};

/**
 * Utilidad para enviar respuesta de validación fallida
 */
export const sendValidationError = (
  res: Response,
  message: string = 'Error de validación',
  errors?: any
): Response => {
  return sendError(res, message, 400, errors);
};
