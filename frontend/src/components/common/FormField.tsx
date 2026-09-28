/**
 * FormField Component
 * 
 * Wrapper component for form fields that provides consistent styling,
 * labels, error messages, and help text.
 */

import React from 'react';

export interface FormFieldProps {
  label?: string;
  name?: string;
  error?: string;
  helpText?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
  labelClassName?: string;
  errorClassName?: string;
  helpTextClassName?: string;
  layout?: 'vertical' | 'horizontal';
  labelWidth?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  error,
  helpText,
  required = false,
  children,
  className = '',
  labelClassName = '',
  errorClassName = '',
  helpTextClassName = '',
  layout = 'vertical',
  labelWidth = 'w-32',
}) => {
  const fieldId = name || `field-${Math.random().toString(36).substr(2, 9)}`;
  const hasError = !!error;

  if (layout === 'horizontal') {
    return (
      <div className={`flex items-start gap-4 ${className}`}>
        {label && (
          <label
            htmlFor={fieldId}
            className={`${labelWidth} pt-2 text-sm font-medium text-gray-700 flex-shrink-0 ${labelClassName}`}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="flex-1 min-w-0">
          <div className={hasError ? 'form-field-error' : ''}>
            {children}
          </div>
          
          {helpText && !hasError && (
            <p className={`mt-1 text-sm text-gray-500 ${helpTextClassName}`}>
              {helpText}
            </p>
          )}
          
          {hasError && (
            <p className={`mt-1 text-sm text-red-600 flex items-center gap-1 ${errorClassName}`}>
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{error}</span>
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label
          htmlFor={fieldId}
          className={`block text-sm font-medium text-gray-700 ${labelClassName}`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className={hasError ? 'form-field-error' : ''}>
        {children}
      </div>
      
      {helpText && !hasError && (
        <p className={`text-sm text-gray-500 ${helpTextClassName}`}>
          {helpText}
        </p>
      )}
      
      {hasError && (
        <p className={`text-sm text-red-600 flex items-center gap-1 ${errorClassName}`}>
          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};

export default FormField;
