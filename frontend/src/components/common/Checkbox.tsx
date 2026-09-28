/**
 * Checkbox Component
 * 
 * Componente de casilla de verificación reutilizable con soporte para:
 * - Múltiples tamaños
 * - Estados (normal, indeterminado, deshabilitado, error)
 * - Labels y helper text
 * - Accesibilidad completa
 * - Forwarding de refs
 */

import React, { forwardRef } from 'react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  label?: string;
  helperText?: string;
  error?: boolean;
  errorMessage?: string;
  size?: 'sm' | 'md' | 'lg';
  indeterminate?: boolean;
  containerClassName?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      helperText,
      error = false,
      errorMessage,
      size = 'md',
      indeterminate = false,
      disabled = false,
      className = '',
      containerClassName = '',
      id,
      ...props
    },
    ref
  ) => {
    // Generar ID único si no se proporciona
    const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

    // Clases de tamaño para el checkbox
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
    };

    // Clases de tamaño para el texto
    const textSizeClasses = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    };

    // Clases base del checkbox
    const baseClasses = `
      ${sizeClasses[size]}
      rounded
      border-2
      transition-all
      duration-200
      cursor-pointer
      focus:ring-2
      focus:ring-offset-2
    `;

    // Clases de estado
    const stateClasses = error
      ? `
        border-red-500
        text-red-600
        focus:ring-red-500
        hover:border-red-600
      `
      : disabled
      ? `
        border-gray-300
        bg-gray-100
        text-gray-400
        cursor-not-allowed
      `
      : `
        border-gray-300
        text-primary-600
        hover:border-primary-500
        focus:ring-primary-500
        checked:border-primary-600
        checked:bg-primary-600
      `;

    // Clases del label
    const labelClasses = `
      ${textSizeClasses[size]}
      font-medium
      cursor-pointer
      select-none
      ${disabled ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700'}
      ${error ? 'text-red-700' : ''}
    `;

    // Clases del helper text
    const helperClasses = `
      ${size === 'sm' ? 'text-xs' : 'text-sm'}
      ${error ? 'text-red-600' : 'text-gray-500'}
    `;

    // Ref interno para manejar indeterminate
    const internalRef = React.useRef<HTMLInputElement | null>(null);

    // Combinar refs
    React.useEffect(() => {
      const element = internalRef.current;
      if (element) {
        element.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    const setRefs = (element: HTMLInputElement | null) => {
      internalRef.current = element;
      if (typeof ref === 'function') {
        ref(element);
      } else if (ref) {
        ref.current = element;
      }
    };

    return (
      <div className={`flex flex-col gap-1 ${containerClassName}`}>
        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            id={checkboxId}
            ref={setRefs}
            disabled={disabled}
            className={`
              ${baseClasses}
              ${stateClasses}
              ${className}
            `.trim()}
            aria-invalid={error}
            aria-describedby={
              helperText || errorMessage
                ? `${checkboxId}-helper`
                : undefined
            }
            {...props}
          />

          {label && (
            <label htmlFor={checkboxId} className={labelClasses}>
              {label}
            </label>
          )}
        </div>

        {/* Helper text o mensaje de error */}
        {(helperText || errorMessage) && (
          <div
            id={`${checkboxId}-helper`}
            className={`${helperClasses} ml-7`}
            role={error ? 'alert' : undefined}
          >
            {error && errorMessage ? errorMessage : helperText}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
