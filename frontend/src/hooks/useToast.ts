import { useState, useCallback } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

export interface UseToastReturn {
  toasts: Toast[];
  showToast: (type: ToastType, message: string, duration?: number) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
  removeToast: (id: string) => void;
  clearAll: () => void;
}

/**
 * Custom hook para gestionar notificaciones toast
 * Proporciona funciones para mostrar diferentes tipos de notificaciones
 */
export const useToast = (): UseToastReturn => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  /**
   * Remueve un toast específico por ID
   */
  const removeToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  /**
   * Muestra un toast con tipo y mensaje específico
   */
  const showToast = useCallback(
    (type: ToastType, message: string, duration: number = 3000) => {
      const id = `toast-${Date.now()}-${Math.random()}`;
      
      const newToast: Toast = {
        id,
        type,
        message,
        duration,
      };

      setToasts((prevToasts) => [...prevToasts, newToast]);

      // Auto-remover el toast después de la duración especificada
      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  /**
   * Muestra un toast de éxito
   */
  const success = useCallback(
    (message: string, duration?: number) => {
      showToast('success', message, duration);
    },
    [showToast]
  );

  /**
   * Muestra un toast de error
   */
  const error = useCallback(
    (message: string, duration?: number) => {
      showToast('error', message, duration);
    },
    [showToast]
  );

  /**
   * Muestra un toast de advertencia
   */
  const warning = useCallback(
    (message: string, duration?: number) => {
      showToast('warning', message, duration);
    },
    [showToast]
  );

  /**
   * Muestra un toast informativo
   */
  const info = useCallback(
    (message: string, duration?: number) => {
      showToast('info', message, duration);
    },
    [showToast]
  );

  /**
   * Limpia todos los toasts
   */
  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  return {
    toasts,
    showToast,
    success,
    error,
    warning,
    info,
    removeToast,
    clearAll,
  };
};
