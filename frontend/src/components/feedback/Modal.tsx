/**
 * Modal Component
 * 
 * Componente de modal/diálogo reutilizable para mostrar contenido superpuesto.
 * Incluye backdrop, animaciones, tamaños personalizables, header/footer opcionales,
 * y gestión de foco para accesibilidad.
 * 
 * Características:
 * - Múltiples tamaños predefinidos (small, medium, large, xlarge, full)
 * - Header con título y botón de cierre
 * - Footer personalizable con acciones
 * - Overlay/backdrop con click para cerrar (opcional)
 * - Scroll interno cuando el contenido excede la altura
 * - Soporte para ESC para cerrar
 * - Portal para renderizar fuera del árbol DOM principal
 * - Animaciones de entrada/salida
 */

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export type ModalSize = 'small' | 'medium' | 'large' | 'xlarge' | 'full';

export interface ModalAction {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
}

export interface ModalProps {
  /** Si el modal está abierto */
  isOpen: boolean;
  
  /** Función para cerrar el modal */
  onClose: () => void;
  
  /** Título del modal */
  title?: string;
  
  /** Contenido del modal */
  children: React.ReactNode;
  
  /** Tamaño del modal */
  size?: ModalSize;
  
  /** Si se puede cerrar haciendo click en el backdrop */
  closeOnBackdropClick?: boolean;
  
  /** Si se puede cerrar con la tecla ESC */
  closeOnEsc?: boolean;
  
  /** Si se muestra el botón de cerrar en el header */
  showCloseButton?: boolean;
  
  /** Si se muestra el header */
  showHeader?: boolean;
  
  /** Si se muestra el footer */
  showFooter?: boolean;
  
  /** Acciones para el footer */
  footerActions?: ModalAction[];
  
  /** Contenido personalizado del footer (sobrescribe footerActions) */
  footer?: React.ReactNode;
  
  /** Contenido personalizado del header (sobrescribe title) */
  header?: React.ReactNode;
  
  /** Si el modal está centrado verticalmente */
  centered?: boolean;
  
  /** Clases CSS adicionales para el contenedor del modal */
  className?: string;
  
  /** Clases CSS para el contenido del body */
  bodyClassName?: string;
  
  /** Si se previene el scroll del body cuando el modal está abierto */
  preventBodyScroll?: boolean;
  
  /** Función que se ejecuta después de que el modal se abre */
  onAfterOpen?: () => void;
  
  /** Función que se ejecuta después de que el modal se cierra */
  onAfterClose?: () => void;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'medium',
  closeOnBackdropClick = true,
  closeOnEsc = true,
  showCloseButton = true,
  showHeader = true,
  showFooter = false,
  footerActions = [],
  footer,
  header,
  centered = true,
  className = '',
  bodyClassName = '',
  preventBodyScroll = true,
  onAfterOpen,
  onAfterClose,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Tamaños del modal
  const sizeClasses: Record<ModalSize, string> = {
    small: 'max-w-md',
    medium: 'max-w-2xl',
    large: 'max-w-4xl',
    xlarge: 'max-w-6xl',
    full: 'max-w-full mx-4',
  };

  // Variantes de botones para las acciones del footer
  const buttonVariants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-400',
  };

  // Manejar apertura y cierre con animaciones
  useEffect(() => {
    if (isOpen) {
      // Guardar el elemento activo actual para restaurar el foco después
      previousActiveElement.current = document.activeElement as HTMLElement;
      
      setIsVisible(true);
      setIsAnimating(true);
      
      // Prevenir scroll del body si está habilitado
      if (preventBodyScroll) {
        document.body.style.overflow = 'hidden';
      }
      
      // Callback después de abrir
      if (onAfterOpen) {
        setTimeout(onAfterOpen, 150); // Esperar a que termine la animación
      }
    } else if (isVisible) {
      setIsAnimating(false);
      
      // Esperar a que termine la animación antes de ocultar
      setTimeout(() => {
        setIsVisible(false);
        
        // Restaurar scroll del body
        if (preventBodyScroll) {
          document.body.style.overflow = '';
        }
        
        // Restaurar foco al elemento anterior
        if (previousActiveElement.current) {
          previousActiveElement.current.focus();
        }
        
        // Callback después de cerrar
        if (onAfterClose) {
          onAfterClose();
        }
      }, 150); // Duración de la animación de salida
    }
  }, [isOpen, isVisible, preventBodyScroll, onAfterOpen, onAfterClose]);

  // Manejar tecla ESC
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (closeOnEsc && event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, closeOnEsc, onClose]);

  // Trap focus dentro del modal
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const modal = modalRef.current;
    const focusableElements = modal.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTab = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement?.focus();
          event.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement?.focus();
          event.preventDefault();
        }
      }
    };

    modal.addEventListener('keydown', handleTab);
    
    // Focus en el primer elemento focusable
    setTimeout(() => firstElement?.focus(), 100);

    return () => modal.removeEventListener('keydown', handleTab);
  }, [isOpen]);

  // Manejar click en el backdrop
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnBackdropClick && event.target === event.currentTarget) {
      onClose();
    }
  };

  // Renderizar acción del footer
  const renderAction = (action: ModalAction, index: number) => {
    const variant = action.variant || 'primary';
    const baseClasses = 'px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2';
    const variantClasses = buttonVariants[variant];

    return (
      <button
        key={index}
        type="button"
        onClick={action.onClick}
        disabled={action.disabled || action.loading}
        className={`${baseClasses} ${variantClasses}`}
      >
        {action.loading && (
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {action.icon && !action.loading && action.icon}
        {action.label}
      </button>
    );
  };

  // Si no está visible, no renderizar nada
  if (!isVisible) {
    return null;
  }

  const modalContent = (
    <div
      className={`fixed inset-0 z-50 overflow-y-auto ${
        isAnimating ? 'animate-fade-in' : 'animate-fade-out'
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 ${
          isAnimating ? 'bg-opacity-50' : 'bg-opacity-0'
        }`}
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* Modal container */}
      <div
        className={`flex min-h-screen items-end justify-center p-4 text-center sm:items-center sm:p-0 ${
          centered ? 'items-center' : 'items-start pt-20'
        }`}
        onClick={handleBackdropClick}
      >
        {/* Modal panel */}
        <div
          ref={modalRef}
          className={`relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all duration-300 w-full ${
            sizeClasses[size]
          } ${isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'} ${className}`}
        >
          {/* Header */}
          {showHeader && (
            <div className="border-b border-gray-200 px-6 py-4">
              {header || (
                <div className="flex items-center justify-between">
                  <h3 id="modal-title" className="text-lg font-semibold text-gray-900">
                    {title}
                  </h3>
                  {showCloseButton && (
                    <button
                      type="button"
                      onClick={onClose}
                      className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-lg p-1 transition-colors"
                      aria-label="Cerrar modal"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Body */}
          <div className={`px-6 py-4 max-h-[calc(100vh-200px)] overflow-y-auto ${bodyClassName}`}>
            {children}
          </div>

          {/* Footer */}
          {showFooter && (
            <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
              {footer || (
                <div className="flex items-center justify-end gap-3">
                  {footerActions.map((action, index) => renderAction(action, index))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Renderizar en un portal
  return createPortal(modalContent, document.body);
};

// Animaciones CSS para las transiciones
const style = document.createElement('style');
style.textContent = `
  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes fade-out {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }

  .animate-fade-in {
    animation: fade-in 0.15s ease-out;
  }

  .animate-fade-out {
    animation: fade-out 0.15s ease-in;
  }
`;
document.head.appendChild(style);

export default Modal;
