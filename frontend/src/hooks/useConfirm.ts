import { useState, useCallback } from 'react';

export interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
}

export interface ConfirmState extends ConfirmOptions {
  isOpen: boolean;
}

export interface UseConfirmReturn {
  confirmState: ConfirmState;
  confirm: (options: ConfirmOptions) => Promise<boolean>;
  handleConfirm: () => Promise<void>;
  handleCancel: () => void;
  closeConfirm: () => void;
}

/**
 * Custom hook para gestionar diálogos de confirmación
 * Proporciona una forma sencilla de mostrar diálogos de confirmación y obtener la respuesta del usuario
 */
export const useConfirm = (): UseConfirmReturn => {
  const [confirmState, setConfirmState] = useState<ConfirmState>({
    isOpen: false,
    message: '',
    title: 'Confirmar',
    confirmText: 'Confirmar',
    cancelText: 'Cancelar',
    type: 'info',
  });

  const [resolvePromise, setResolvePromise] = useState<((value: boolean) => void) | null>(
    null
  );

  /**
   * Muestra el diálogo de confirmación y retorna una promesa con la respuesta
   */
  const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfirmState({
        isOpen: true,
        title: options.title || 'Confirmar',
        message: options.message,
        confirmText: options.confirmText || 'Confirmar',
        cancelText: options.cancelText || 'Cancelar',
        type: options.type || 'info',
        onConfirm: options.onConfirm,
        onCancel: options.onCancel,
      });

      setResolvePromise(() => resolve);
    });
  }, []);

  /**
   * Maneja la confirmación del usuario
   */
  const handleConfirm = useCallback(async () => {
    if (confirmState.onConfirm) {
      try {
        await confirmState.onConfirm();
      } catch (error) {
        console.error('Error in onConfirm callback:', error);
      }
    }

    if (resolvePromise) {
      resolvePromise(true);
    }

    setConfirmState((prev) => ({ ...prev, isOpen: false }));
    setResolvePromise(null);
  }, [confirmState, resolvePromise]);

  /**
   * Maneja la cancelación del usuario
   */
  const handleCancel = useCallback(() => {
    if (confirmState.onCancel) {
      try {
        confirmState.onCancel();
      } catch (error) {
        console.error('Error in onCancel callback:', error);
      }
    }

    if (resolvePromise) {
      resolvePromise(false);
    }

    setConfirmState((prev) => ({ ...prev, isOpen: false }));
    setResolvePromise(null);
  }, [confirmState, resolvePromise]);

  /**
   * Cierra el diálogo sin ejecutar callbacks
   */
  const closeConfirm = useCallback(() => {
    if (resolvePromise) {
      resolvePromise(false);
    }

    setConfirmState((prev) => ({ ...prev, isOpen: false }));
    setResolvePromise(null);
  }, [resolvePromise]);

  return {
    confirmState,
    confirm,
    handleConfirm,
    handleCancel,
    closeConfirm,
  };
};
