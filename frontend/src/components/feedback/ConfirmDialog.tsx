import React, { useState, useCallback, createContext, useContext } from 'react';
import Modal from './Modal';

// Confirm Dialog Types
export type ConfirmDialogType = 'info' | 'warning' | 'danger' | 'success';

export interface ConfirmDialogOptions {
  type?: ConfirmDialogType;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'primary' | 'secondary' | 'danger';
  icon?: React.ReactNode;
  showCancel?: boolean;
  confirmButtonLoading?: boolean;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
}

interface ConfirmDialogState extends ConfirmDialogOptions {
  isOpen: boolean;
  resolve?: (value: boolean) => void;
}

// Confirm Dialog Context
interface ConfirmDialogContextValue {
  confirm: (options: ConfirmDialogOptions) => Promise<boolean>;
  showConfirm: (options: ConfirmDialogOptions) => Promise<boolean>;
}

const ConfirmDialogContext = createContext<ConfirmDialogContextValue | undefined>(undefined);

// Hook to use Confirm Dialog
export const useConfirmDialog = (): ConfirmDialogContextValue => {
  const context = useContext(ConfirmDialogContext);
  if (!context) {
    throw new Error('useConfirmDialog must be used within a ConfirmDialogProvider');
  }
  return context;
};

// Confirm Dialog Component
export const ConfirmDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  type?: ConfirmDialogType;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'primary' | 'secondary' | 'danger';
  icon?: React.ReactNode;
  showCancel?: boolean;
  loading?: boolean;
}> = ({
  isOpen,
  onClose,
  onConfirm,
  type = 'info',
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  confirmVariant,
  icon,
  showCancel = true,
  loading = false,
}) => {
  const getTypeIcon = (): React.ReactNode => {
    if (icon) {
      return icon;
    }

    switch (type) {
      case 'danger':
        return (
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        );
      case 'warning':
        return (
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
            <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        );
      case 'success':
        return (
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case 'info':
      default:
        return (
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
            <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  const getDefaultTitle = (): string => {
    if (title) return title;
    
    switch (type) {
      case 'danger':
        return '¿Estás seguro?';
      case 'warning':
        return 'Advertencia';
      case 'success':
        return 'Confirmación';
      case 'info':
      default:
        return 'Información';
    }
  };

  const getConfirmVariant = (): 'primary' | 'secondary' | 'danger' => {
    if (confirmVariant) return confirmVariant;
    return type === 'danger' ? 'danger' : 'primary';
  };

  const actions = [
    ...(showCancel ? [{
      label: cancelText,
      onClick: onClose,
      variant: 'secondary' as const,
      disabled: loading,
    }] : []),
    {
      label: confirmText,
      onClick: onConfirm,
      variant: getConfirmVariant(),
      loading,
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="small"
      centered
      closeOnBackdropClick={!loading}
      closeOnEsc={!loading}
      showCloseButton={false}
      footerActions={actions}
    >
      <div className="text-center">
        {getTypeIcon()}
        <h3 className="mt-4 text-lg font-semibold text-gray-900">
          {getDefaultTitle()}
        </h3>
        <div className="mt-2">
          <p className="text-sm text-gray-600 whitespace-pre-line">
            {message}
          </p>
        </div>
      </div>
    </Modal>
  );
};

// Confirm Dialog Provider
export const ConfirmDialogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dialogState, setDialogState] = useState<ConfirmDialogState>({
    isOpen: false,
    message: '',
    type: 'info',
    showCancel: true,
  });

  const [isLoading, setIsLoading] = useState(false);

  const showConfirm = useCallback((options: ConfirmDialogOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setDialogState({
        ...options,
        isOpen: true,
        resolve,
        showCancel: options.showCancel !== false,
      });
    });
  }, []);

  const handleConfirm = async () => {
    setIsLoading(true);
    
    try {
      if (dialogState.onConfirm) {
        await dialogState.onConfirm();
      }
      
      dialogState.resolve?.(true);
      
      setDialogState((prev) => ({
        ...prev,
        isOpen: false,
      }));
    } catch (error) {
      console.error('Error en confirmación:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (dialogState.onCancel) {
      dialogState.onCancel();
    }
    
    dialogState.resolve?.(false);
    
    setDialogState((prev) => ({
      ...prev,
      isOpen: false,
    }));
  };

  const handleClose = () => {
    if (!isLoading) {
      handleCancel();
    }
  };

  const value: ConfirmDialogContextValue = {
    confirm: showConfirm,
    showConfirm,
  };

  return (
    <ConfirmDialogContext.Provider value={value}>
      {children}
      <ConfirmDialog
        isOpen={dialogState.isOpen}
        onClose={handleClose}
        onConfirm={handleConfirm}
        type={dialogState.type}
        title={dialogState.title}
        message={dialogState.message}
        confirmText={dialogState.confirmText}
        cancelText={dialogState.cancelText}
        confirmVariant={dialogState.confirmVariant}
        icon={dialogState.icon}
        showCancel={dialogState.showCancel}
        loading={isLoading || dialogState.confirmButtonLoading}
      />
    </ConfirmDialogContext.Provider>
  );
};

// Utility functions for common confirm dialogs
export const createConfirmDialog = (context: ConfirmDialogContextValue) => ({
  // Confirm deletion
  confirmDelete: (itemName?: string): Promise<boolean> => {
    return context.confirm({
      type: 'danger',
      title: 'Confirmar eliminación',
      message: itemName 
        ? `¿Estás seguro de que deseas eliminar "${itemName}"?\n\nEsta acción no se puede deshacer.`
        : '¿Estás seguro de que deseas eliminar este elemento?\n\nEsta acción no se puede deshacer.',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      confirmVariant: 'danger',
    });
  },

  // Confirm discard changes
  confirmDiscard: (): Promise<boolean> => {
    return context.confirm({
      type: 'warning',
      title: 'Descartar cambios',
      message: 'Tienes cambios sin guardar.\n\n¿Estás seguro de que deseas descartarlos?',
      confirmText: 'Descartar',
      cancelText: 'Continuar editando',
      confirmVariant: 'danger',
    });
  },

  // Confirm cancel action
  confirmCancel: (actionName?: string): Promise<boolean> => {
    return context.confirm({
      type: 'warning',
      title: 'Cancelar acción',
      message: actionName
        ? `¿Estás seguro de que deseas cancelar ${actionName}?`
        : '¿Estás seguro de que deseas cancelar esta acción?',
      confirmText: 'Sí, cancelar',
      cancelText: 'No',
    });
  },

  // Confirm proceed
  confirmProceed: (message: string, title?: string): Promise<boolean> => {
    return context.confirm({
      type: 'info',
      title: title || 'Confirmar',
      message,
      confirmText: 'Continuar',
      cancelText: 'Cancelar',
    });
  },

  // Confirm logout
  confirmLogout: (): Promise<boolean> => {
    return context.confirm({
      type: 'warning',
      title: 'Cerrar sesión',
      message: '¿Estás seguro de que deseas cerrar sesión?',
      confirmText: 'Cerrar sesión',
      cancelText: 'Cancelar',
    });
  },

  // Confirm submit
  confirmSubmit: (message?: string): Promise<boolean> => {
    return context.confirm({
      type: 'success',
      title: 'Confirmar envío',
      message: message || '¿Estás seguro de que deseas enviar esta información?',
      confirmText: 'Enviar',
      cancelText: 'Revisar',
    });
  },

  // Generic confirm
  confirm: context.confirm,
});

// Hook that combines useConfirmDialog with utility functions
export const useConfirm = () => {
  const context = useConfirmDialog();
  return createConfirmDialog(context);
};

export default ConfirmDialogProvider;
