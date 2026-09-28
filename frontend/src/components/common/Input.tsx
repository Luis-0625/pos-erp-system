import React, { forwardRef } from 'react';

export type InputVariant = 'outlined' | 'filled';
export type InputSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search' | 'date' | 'time' | 'datetime-local';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: InputVariant;
  size?: InputSize;
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  isRequired?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  type?: InputType;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant = 'outlined',
      size = 'md',
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      fullWidth = false,
      isRequired = false,
      isDisabled = false,
      isReadOnly = false,
      type = 'text',
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;

    const baseClasses = 'transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';

    const variantClasses: Record<InputVariant, string> = {
      outlined: `border-2 bg-white ${
        hasError
          ? 'border-danger-500 focus:border-danger-600 focus:ring-2 focus:ring-danger-200'
          : 'border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200'
      }`,
      filled: `border-0 border-b-2 ${
        hasError
          ? 'bg-danger-50 border-danger-500 focus:border-danger-600'
          : 'bg-gray-100 border-gray-300 focus:border-primary-500 focus:bg-white'
      }`,
    };

    const sizeClasses: Record<InputSize, string> = {
      xs: 'px-2 py-1 text-xs rounded',
      sm: 'px-2.5 py-1.5 text-sm rounded-md',
      md: 'px-3 py-2 text-base rounded-lg',
      lg: 'px-4 py-2.5 text-lg rounded-lg',
      xl: 'px-5 py-3 text-xl rounded-xl',
    };

    const iconPadding = {
      left: leftIcon ? (size === 'xs' || size === 'sm' ? 'pl-8' : size === 'md' ? 'pl-10' : 'pl-12') : '',
      right: rightIcon ? (size === 'xs' || size === 'sm' ? 'pr-8' : size === 'md' ? 'pr-10' : 'pr-12') : '',
    };

    const widthClass = fullWidth ? 'w-full' : '';

    const inputClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${iconPadding.left} ${iconPadding.right} ${widthClass} ${className}`.trim();

    const containerWidthClass = fullWidth ? 'w-full' : '';

    const labelSizeClasses: Record<InputSize, string> = {
      xs: 'text-xs',
      sm: 'text-sm',
      md: 'text-sm',
      lg: 'text-base',
      xl: 'text-lg',
    };

    const iconSizeClasses: Record<InputSize, string> = {
      xs: 'w-4 h-4 text-sm',
      sm: 'w-4 h-4 text-sm',
      md: 'w-5 h-5 text-base',
      lg: 'w-6 h-6 text-lg',
      xl: 'w-7 h-7 text-xl',
    };

    const iconPositionClasses = {
      left: size === 'xs' || size === 'sm' ? 'left-2' : size === 'md' ? 'left-3' : 'left-4',
      right: size === 'xs' || size === 'sm' ? 'right-2' : size === 'md' ? 'right-3' : 'right-4',
    };

    return (
      <div className={`${containerWidthClass}`}>
        {label && (
          <label
            htmlFor={inputId}
            className={`block font-medium text-gray-700 mb-1.5 ${labelSizeClasses[size]}`}
          >
            {label}
            {isRequired && <span className="text-danger-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div
              className={`absolute ${iconPositionClasses.left} top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none ${iconSizeClasses[size]}`}
            >
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            type={type}
            className={inputClasses}
            disabled={isDisabled}
            readOnly={isReadOnly}
            required={isRequired}
            aria-invalid={hasError}
            aria-describedby={
              error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            {...props}
          />

          {rightIcon && (
            <div
              className={`absolute ${iconPositionClasses.right} top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none ${iconSizeClasses[size]}`}
            >
              {rightIcon}
            </div>
          )}
        </div>

        {error && (
          <p
            id={`${inputId}-error`}
            className={`mt-1.5 text-danger-600 ${labelSizeClasses[size]}`}
          >
            {error}
          </p>
        )}

        {!error && helperText && (
          <p
            id={`${inputId}-helper`}
            className={`mt-1.5 text-gray-500 ${labelSizeClasses[size]}`}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
