import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { createPortal } from 'react-dom';

// Toast Types
export type ToastType = 'success' | 'error' | 'warning' | 'info';
export type ToastPosition = 
  | 'top-left' 
  | 'top-center' 
  | 'top-right' 
  | 'bottom-left' 
  | 'bottom-center' 
  | 'bottom-right';

// Toast Interface
export interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
  dismissible?: boolean;
  action?: ToastAction;
  icon?: React.ReactNode;
  timestamp?: number;
}

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastOptions {
  type?: ToastType;
  title?: string;
  duration?: number;
  dismissible?: boolean;
  action?: ToastAction;
  icon?: React.ReactNode;
}

export interface ToastProps {
  toast: Toast;
  onDismiss: (id: string) => void;
  position: ToastPosition;
}

export interface ToastContainerProps {
  position?: ToastPosition;
  maxToasts?: number;
  className?: string;
}

// Toast Context
interface ToastContextValue {
  toasts: Toast[];
  showToast: (message: string, options?: ToastOptions) => string;
  success: (message: string, options?: Omit<ToastOptions, 'type'>) => string;
  error: (message: string, options?: Omit<ToastOptions, 'type'>) => string;
  warning: (message: string, options?: Omit<ToastOptions, 'type'>) => string;
  info: (message: string, options?: Omit<ToastOptions, 'type'>) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

// Hook to use Toast
export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Generate unique ID
const generateId = (): string => {
  return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Toast Component
const ToastComponent: React.FC<ToastProps> = ({ toast, onDismiss, position }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, toast.duration);

      return () => clearTimeout(timer);
    }
  }, [toast.duration]);

  const handleDismiss = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onDismiss(toast.id);
    }, 300); // Animation duration
  };

  const getTypeStyles = (): string => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getTypeIcon = (): React.ReactNode => {
    if (toast.icon) {
      return toast.icon;
    }

    switch (toast.type) {
      case 'success':
        return (
          <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'info':
        return (
          <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getAnimationClass = (): string => {
    const isTop = position.startsWith('top');
    const isRight = position.endsWith('right');
    const isLeft = position.endsWith('left');

    if (isLeaving) {
      if (isTop) {
        return 'toast-slide-out-top';
      }
      return 'toast-slide-out-bottom';
    }

    if (isVisible) {
      if (isTop) {
        if (isRight) return 'toast-slide-in-top-right';
        if (isLeft) return 'toast-slide-in-top-left';
        return 'toast-slide-in-top';
      } else {
        if (isRight) return 'toast-slide-in-bottom-right';
        if (isLeft) return 'toast-slide-in-bottom-left';
        return 'toast-slide-in-bottom';
      }
    }

    return '';
  };

  return (
    <div
      className={`
        toast-item
        ${getTypeStyles()}
        ${getAnimationClass()}
        border rounded-lg shadow-lg p-4 mb-3 min-w-[320px] max-w-md
        flex items-start gap-3
        transition-all duration-300
      `}
      role="alert"
      aria-live="polite"
    >
      {/* Icon */}
      <div className="flex-shrink-0 mt-0.5">
        {getTypeIcon()}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {toast.title && (
          <h4 className="font-semibold text-sm mb-1 leading-tight">
            {toast.title}
          </h4>
        )}
        <p className="text-sm leading-relaxed break-words">
          {toast.message}
        </p>

        {/* Action Button */}
        {toast.action && (
          <button
            onClick={() => {
              toast.action!.onClick();
              handleDismiss();
            }}
            className="mt-2 text-sm font-medium underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-current rounded"
          >
            {toast.action.label}
          </button>
        )}
      </div>

      {/* Dismiss Button */}
      {toast.dismissible !== false && (
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 rounded-lg p-1 hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-current transition-colors"
          aria-label="Cerrar notificación"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      )}

      {/* Progress Bar (optional) */}
      {toast.duration && toast.duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/10 rounded-b-lg overflow-hidden">
          <div
            className="h-full bg-current opacity-50 toast-progress"
            style={{ animationDuration: `${toast.duration}ms` }}
          />
        </div>
      )}
    </div>
  );
};

// Toast Container Component
export const ToastContainer: React.FC<ToastContainerProps> = ({
  position = 'top-right',
  maxToasts = 5,
  className = '',
}) => {
  const context = useToast();

  const getPositionStyles = (): string => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4';
      case 'top-center':
        return 'top-4 left-1/2 -translate-x-1/2';
      case 'top-right':
        return 'top-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-center':
        return 'bottom-4 left-1/2 -translate-x-1/2';
      case 'bottom-right':
        return 'bottom-4 right-4';
      default:
        return 'top-4 right-4';
    }
  };

  const visibleToasts = context.toasts.slice(0, maxToasts);

  return createPortal(
    <div
      className={`
        fixed z-50 pointer-events-none
        ${getPositionStyles()}
        ${className}
      `}
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="pointer-events-auto">
        {visibleToasts.map((toast) => (
          <ToastComponent
            key={toast.id}
            toast={toast}
            onDismiss={context.dismiss}
            position={position}
          />
        ))}
      </div>
    </div>,
    document.body
  );
};

// Toast Provider Component
export const ToastProvider: React.FC<{
  children: React.ReactNode;
  position?: ToastPosition;
  maxToasts?: number;
}> = ({ 
  children, 
  position = 'top-right',
  maxToasts = 5 
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, options: ToastOptions = {}): string => {
    const id = generateId();
    const newToast: Toast = {
      id,
      type: options.type || 'info',
      title: options.title,
      message,
      duration: options.duration !== undefined ? options.duration : 5000,
      dismissible: options.dismissible !== false,
      action: options.action,
      icon: options.icon,
      timestamp: Date.now(),
    };

    setToasts((prev) => [newToast, ...prev]);
    return id;
  }, []);

  const success = useCallback((message: string, options: Omit<ToastOptions, 'type'> = {}): string => {
    return showToast(message, { ...options, type: 'success' });
  }, [showToast]);

  const error = useCallback((message: string, options: Omit<ToastOptions, 'type'> = {}): string => {
    return showToast(message, { ...options, type: 'error' });
  }, [showToast]);

  const warning = useCallback((message: string, options: Omit<ToastOptions, 'type'> = {}): string => {
    return showToast(message, { ...options, type: 'warning' });
  }, [showToast]);

  const info = useCallback((message: string, options: Omit<ToastOptions, 'type'> = {}): string => {
    return showToast(message, { ...options, type: 'info' });
  }, [showToast]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const dismissAll = useCallback(() => {
    setToasts([]);
  }, []);

  const value: ToastContextValue = {
    toasts,
    showToast,
    success,
    error,
    warning,
    info,
    dismiss,
    dismissAll,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer position={position} maxToasts={maxToasts} />
      <style>{`
        @keyframes toast-slide-in-top-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes toast-slide-in-top-left {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes toast-slide-in-top {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes toast-slide-in-bottom-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes toast-slide-in-bottom-left {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes toast-slide-in-bottom {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes toast-slide-out-top {
          from {
            transform: translateY(0);
            opacity: 1;
          }
          to {
            transform: translateY(-100%);
            opacity: 0;
          }
        }

        @keyframes toast-slide-out-bottom {
          from {
            transform: translateY(0);
            opacity: 1;
          }
          to {
            transform: translateY(100%);
            opacity: 0;
          }
        }

        @keyframes toast-progress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }

        .toast-slide-in-top-right {
          animation: toast-slide-in-top-right 0.3s ease-out forwards;
        }

        .toast-slide-in-top-left {
          animation: toast-slide-in-top-left 0.3s ease-out forwards;
        }

        .toast-slide-in-top {
          animation: toast-slide-in-top 0.3s ease-out forwards;
        }

        .toast-slide-in-bottom-right {
          animation: toast-slide-in-bottom-right 0.3s ease-out forwards;
        }

        .toast-slide-in-bottom-left {
          animation: toast-slide-in-bottom-left 0.3s ease-out forwards;
        }

        .toast-slide-in-bottom {
          animation: toast-slide-in-bottom 0.3s ease-out forwards;
        }

        .toast-slide-out-top {
          animation: toast-slide-out-top 0.3s ease-in forwards;
        }

        .toast-slide-out-bottom {
          animation: toast-slide-out-bottom 0.3s ease-in forwards;
        }

        .toast-progress {
          animation: toast-progress linear forwards;
        }
      `}</style>
    </ToastContext.Provider>
  );
};

export default ToastProvider;
