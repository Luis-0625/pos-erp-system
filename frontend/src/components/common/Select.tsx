/**
 * Select Component
 * 
 * Componente de selección dropdown con soporte para búsqueda, múltiple selección,
 * y estados de error. Diseñado para ser usado en formularios.
 * 
 * @example
 * ```tsx
 * <Select
 *   label="País"
 *   options={countries}
 *   value={selectedCountry}
 *   onChange={(value) => setSelectedCountry(value)}
 *   placeholder="Selecciona un país"
 * />
 * ```
 */

import React, { useState, useRef, useEffect, forwardRef } from 'react';

export type SelectVariant = 'outlined' | 'filled';
export type SelectSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export interface SelectProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  variant?: SelectVariant;
  size?: SelectSize;
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  value?: string | number | (string | number)[];
  onChange?: (value: string | number | (string | number)[]) => void;
  placeholder?: string;
  isMultiple?: boolean;
  isSearchable?: boolean;
  fullWidth?: boolean;
  isRequired?: boolean;
  isDisabled?: boolean;
  isClearable?: boolean;
  leftIcon?: React.ReactNode;
  maxHeight?: string;
}

const Select = forwardRef<HTMLDivElement, SelectProps>(
  (
    {
      variant = 'outlined',
      size = 'md',
      label,
      error,
      helperText,
      options,
      value,
      onChange,
      placeholder = 'Selecciona una opción',
      isMultiple = false,
      isSearchable = false,
      fullWidth = false,
      isRequired = false,
      isDisabled = false,
      isClearable = false,
      leftIcon,
      maxHeight = '300px',
      id,
      className = '',
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const containerRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;

    // Normalizar valor a array para manejo uniforme
    const normalizedValue = Array.isArray(value) ? value : value !== undefined ? [value] : [];

    // Filtrar opciones según búsqueda
    const filteredOptions = isSearchable && searchTerm
      ? options.filter((option) =>
          option.label.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : options;

    // Obtener etiqueta de opción seleccionada
    const getSelectedLabel = () => {
      if (normalizedValue.length === 0) return placeholder;
      if (!isMultiple) {
        const selectedOption = options.find((opt) => opt.value === normalizedValue[0]);
        return selectedOption?.label || placeholder;
      }
      return `${normalizedValue.length} seleccionado${normalizedValue.length > 1 ? 's' : ''}`;
    };

    // Manejar selección de opción
    const handleOptionClick = (optionValue: string | number) => {
      if (isMultiple) {
        const newValue = normalizedValue.includes(optionValue)
          ? normalizedValue.filter((v) => v !== optionValue)
          : [...normalizedValue, optionValue];
        onChange?.(newValue);
      } else {
        onChange?.(optionValue);
        setIsOpen(false);
      }
    };

    // Manejar limpieza de selección
    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange?.(isMultiple ? [] : '');
    };

    // Cerrar dropdown al hacer clic fuera
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
          setSearchTerm('');
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
        if (isSearchable && searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isOpen, isSearchable]);

    // Manejar navegación con teclado
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (isDisabled) return;

      switch (e.key) {
        case 'Enter':
        case ' ':
          if (!isOpen) {
            e.preventDefault();
            setIsOpen(true);
          } else if (focusedIndex >= 0 && focusedIndex < filteredOptions.length) {
            e.preventDefault();
            handleOptionClick(filteredOptions[focusedIndex].value);
          }
          break;
        case 'Escape':
          e.preventDefault();
          setIsOpen(false);
          setSearchTerm('');
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
          } else {
            setFocusedIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : prev));
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          setFocusedIndex((prev) => (prev > 0 ? prev - 1 : 0));
          break;
      }
    };

    // Clases de tamaño
    const sizeClasses = {
      xs: 'text-xs px-2 py-1',
      sm: 'text-sm px-3 py-1.5',
      md: 'text-base px-4 py-2',
      lg: 'text-lg px-5 py-2.5',
      xl: 'text-xl px-6 py-3',
    };

    const iconSizeClasses = {
      xs: 'w-3 h-3',
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
      xl: 'w-7 h-7',
    };

    // Clases de variante
    const variantClasses = {
      outlined: `border-2 ${
        hasError
          ? 'border-danger-500 focus:border-danger-600'
          : 'border-gray-300 focus:border-primary-500'
      } bg-white`,
      filled: `border-b-2 ${
        hasError
          ? 'border-danger-500 bg-danger-50'
          : 'border-gray-300 bg-gray-100 focus:bg-white focus:border-primary-500'
      }`,
    };

    // Clases del contenedor
    const containerWidthClass = fullWidth ? 'w-full' : 'w-auto';

    // Clases del trigger
    const triggerClasses = `
      ${sizeClasses[size]}
      ${variantClasses[variant]}
      ${leftIcon ? 'pl-10' : ''}
      ${containerWidthClass}
      flex items-center justify-between
      rounded-md
      cursor-pointer
      transition-all duration-200
      ${isDisabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : 'hover:border-primary-400'}
      ${isOpen ? 'ring-2 ring-primary-500 ring-opacity-50' : ''}
      ${className}
    `;

    // Clases de opciones
    const optionClasses = (option: SelectOption, index: number) => `
      px-4 py-2
      cursor-pointer
      transition-colors duration-150
      ${normalizedValue.includes(option.value) ? 'bg-primary-100 text-primary-700' : 'text-gray-700'}
      ${index === focusedIndex ? 'bg-primary-50' : ''}
      ${option.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-50'}
    `;

    return (
      <div className={containerWidthClass} ref={ref}>
        {/* Label */}
        {label && (
          <label
            htmlFor={selectId}
            className={`block text-sm font-medium mb-1 ${
              hasError ? 'text-danger-700' : 'text-gray-700'
            }`}
          >
            {label}
            {isRequired && <span className="text-danger-500 ml-1">*</span>}
          </label>
        )}

        {/* Select Container */}
        <div className="relative" ref={containerRef}>
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <div className={iconSizeClasses[size]}>{leftIcon}</div>
            </div>
          )}

          {/* Trigger */}
          <div
            id={selectId}
            role="combobox"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-controls={`${selectId}-listbox`}
            aria-invalid={hasError}
            aria-required={isRequired}
            aria-disabled={isDisabled}
            tabIndex={isDisabled ? -1 : 0}
            className={triggerClasses}
            onClick={() => !isDisabled && setIsOpen(!isOpen)}
            onKeyDown={handleKeyDown}
          >
            <span className={normalizedValue.length === 0 ? 'text-gray-400' : 'text-gray-900'}>
              {getSelectedLabel()}
            </span>

            <div className="flex items-center gap-2">
              {/* Clear Button */}
              {isClearable && normalizedValue.length > 0 && !isDisabled && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Limpiar selección"
                >
                  <svg className={iconSizeClasses[size]} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}

              {/* Dropdown Arrow */}
              <svg
                className={`${iconSizeClasses[size]} text-gray-400 transition-transform duration-200 ${
                  isOpen ? 'transform rotate-180' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Dropdown */}
          {isOpen && !isDisabled && (
            <div
              id={`${selectId}-listbox`}
              role="listbox"
              aria-multiselectable={isMultiple}
              className={`
                absolute z-50 mt-1 w-full
                bg-white border border-gray-200 rounded-md shadow-lg
                ${containerWidthClass}
              `}
              style={{ maxHeight }}
            >
              {/* Search Input */}
              {isSearchable && (
                <div className="p-2 border-b border-gray-200">
                  <input
                    ref={searchInputRef}
                    type="text"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              )}

              {/* Options List */}
              <div className="overflow-y-auto" style={{ maxHeight: isSearchable ? `calc(${maxHeight} - 60px)` : maxHeight }}>
                {filteredOptions.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-gray-500 text-center">
                    No se encontraron opciones
                  </div>
                ) : (
                  filteredOptions.map((option, index) => (
                    <div
                      key={option.value}
                      role="option"
                      aria-selected={normalizedValue.includes(option.value)}
                      aria-disabled={option.disabled}
                      className={optionClasses(option, index)}
                      onClick={() => !option.disabled && handleOptionClick(option.value)}
                      onMouseEnter={() => setFocusedIndex(index)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {option.icon && <span className={iconSizeClasses[size]}>{option.icon}</span>}
                          <span>{option.label}</span>
                        </div>

                        {/* Checkmark para selección múltiple */}
                        {isMultiple && normalizedValue.includes(option.value) && (
                          <svg className={`${iconSizeClasses[size]} text-primary-600`} fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <p id={`${selectId}-error`} className="mt-1 text-sm text-danger-600">
            {error}
          </p>
        )}

        {/* Helper Text */}
        {!error && helperText && (
          <p id={`${selectId}-helper`} className="mt-1 text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
