/**
 * Badge Component
 * 
 * Componente de insignia/etiqueta reutilizable con soporte para:
 * - Múltiples variantes de color
 * - Diferentes tamaños
 * - Iconos (izquierda/derecha)
 * - Botón de cierre opcional
 * - Dot indicator opcional
 * - Bordes redondeados personalizables
 */

import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'gray';
  size?: 'sm' | 'md' | 'lg';
  rounded?: 'sm' | 'md' | 'lg' | 'full';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  dot?: boolean;
  onRemove?: () => void;
  removable?: boolean;
}

const Badge: React.FC<BadgeProps> = ({
  variant = 'primary',
  size = 'md',
  rounded = 'md',
  leftIcon,
  rightIcon,
  dot = false,
  onRemove,
  removable = false,
  children,
  className = '',
  ...props
}) => {
  // Clases base
  const baseClasses = `
    inline-flex
    items-center
    gap-1
    font-medium
    transition-colors
    duration-200
  `;

  // Clases de variante
  const variantClasses = {
    primary: 'bg-primary-100 text-primary-800 border border-primary-200',
    secondary: 'bg-gray-100 text-gray-800 border border-gray-200',
    success: 'bg-green-100 text-green-800 border border-green-200',
    danger: 'bg-red-100 text-red-800 border border-red-200',
    warning: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    info: 'bg-blue-100 text-blue-800 border border-blue-200',
    gray: 'bg-gray-100 text-gray-600 border border-gray-300',
  };

  // Clases de tamaño
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  // Clases de redondeo
  const roundedClasses = {
    sm: 'rounded',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };

  // Tamaño del dot según el tamaño del badge
  const dotSizeClasses = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  };

  // Color del dot según la variante
  const dotColorClasses = {
    primary: 'bg-primary-600',
    secondary: 'bg-gray-600',
    success: 'bg-green-600',
    danger: 'bg-red-600',
    warning: 'bg-yellow-600',
    info: 'bg-blue-600',
    gray: 'bg-gray-500',
  };

  // Tamaño del icono según el tamaño del badge
  const iconSizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  // Manejar el clic en el botón de cierre
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove?.();
  };

  return (
    <span
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${roundedClasses[rounded]}
        ${className}
      `.trim()}
      {...props}
    >
      {/* Dot indicator */}
      {dot && (
        <span
          className={`
            ${dotSizeClasses[size]}
            ${dotColorClasses[variant]}
            rounded-full
            flex-shrink-0
          `.trim()}
          aria-hidden="true"
        />
      )}

      {/* Left icon */}
      {leftIcon && (
        <span className={`${iconSizeClasses[size]} flex-shrink-0`} aria-hidden="true">
          {leftIcon}
        </span>
      )}

      {/* Content */}
      <span className="truncate">{children}</span>

      {/* Right icon */}
      {rightIcon && (
        <span className={`${iconSizeClasses[size]} flex-shrink-0`} aria-hidden="true">
          {rightIcon}
        </span>
      )}

      {/* Remove button */}
      {(removable || onRemove) && (
        <button
          type="button"
          onClick={handleRemove}
          className={`
            ${iconSizeClasses[size]}
            flex-shrink-0
            rounded-sm
            hover:bg-black/10
            focus:outline-none
            focus:ring-1
            focus:ring-offset-1
            focus:ring-current
            transition-colors
          `.trim()}
          aria-label="Remover"
        >
          <svg
            className="w-full h-full"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </span>
  );
};

export default Badge;
