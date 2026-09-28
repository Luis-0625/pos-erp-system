/**
 * SearchBar Component
 * 
 * Componente especializado para búsqueda con icono, botón de limpiar y funcionalidad de búsqueda.
 * Incluye debounce opcional para optimizar búsquedas en tiempo real.
 * 
 * @example
 * ```tsx
 * <SearchBar
 *   value={searchTerm}
 *   onChange={setSearchTerm}
 *   onSearch={handleSearch}
 *   placeholder="Buscar productos..."
 * />
 * ```
 */

import React, { useState, useEffect, useRef } from 'react';

export interface SearchBarProps {
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'minimal' | 'rounded';
  debounceMs?: number;
  showSearchButton?: boolean;
  searchButtonText?: string;
  loading?: boolean;
  error?: boolean;
  errorMessage?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value = '',
  onChange,
  onSearch,
  onClear,
  placeholder = 'Buscar...',
  className = '',
  inputClassName = '',
  disabled = false,
  autoFocus = false,
  size = 'md',
  variant = 'default',
  debounceMs = 0,
  showSearchButton = false,
  searchButtonText = 'Buscar',
  loading = false,
  error = false,
  errorMessage,
}) => {
  const [internalValue, setInternalValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<number>();

  // Sincronizar valor interno con prop value
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  // Limpiar timer al desmontar
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInternalValue(newValue);

    // Llamar onChange inmediatamente
    if (onChange) {
      onChange(newValue);
    }

    // Aplicar debounce para onSearch si está configurado
    if (onSearch && debounceMs > 0) {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = setTimeout(() => {
        onSearch(newValue);
      }, debounceMs);
    } else if (onSearch && debounceMs === 0) {
      onSearch(newValue);
    }
  };

  const handleClear = () => {
    setInternalValue('');
    
    if (onChange) {
      onChange('');
    }
    
    if (onSearch) {
      onSearch('');
    }
    
    if (onClear) {
      onClear();
    }

    // Enfocar el input después de limpiar
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSearchClick = () => {
    if (onSearch) {
      onSearch(internalValue);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(internalValue);
    }
  };

  // Clases de tamaño
  const sizeClasses = {
    sm: 'h-8 text-sm',
    md: 'h-10 text-base',
    lg: 'h-12 text-lg',
  };

  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const paddingClasses = {
    sm: 'pl-8 pr-8',
    md: 'pl-10 pr-10',
    lg: 'pl-12 pr-12',
  };

  // Clases de variante
  const variantClasses = {
    default: 'border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
    minimal: 'border-0 border-b-2 border-gray-300 rounded-none focus:border-primary-500',
    rounded: 'border border-gray-300 rounded-full shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        {/* Icono de búsqueda */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
          {loading ? (
            <svg
              className={`${iconSizeClasses[size]} text-gray-400 animate-spin`}
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            <svg
              className={`${iconSizeClasses[size]} text-gray-400`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          )}
        </div>

        {/* Input de búsqueda */}
        <input
          ref={inputRef}
          type="text"
          value={internalValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={disabled || loading}
          autoFocus={autoFocus}
          className={`
            w-full
            ${sizeClasses[size]}
            ${paddingClasses[size]}
            ${variantClasses[variant]}
            ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
            ${disabled || loading ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
            transition-all duration-200
            outline-none
            ${inputClassName}
          `}
        />

        {/* Botón de limpiar */}
        {internalValue && !disabled && !loading && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Limpiar búsqueda"
          >
            <svg
              className={iconSizeClasses[size]}
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

        {/* Botón de búsqueda (opcional) */}
        {showSearchButton && (
          <button
            type="button"
            onClick={handleSearchClick}
            disabled={disabled || loading}
            className={`
              absolute right-2 top-1/2 -translate-y-1/2
              px-3 py-1
              bg-primary-600 text-white
              rounded
              hover:bg-primary-700
              disabled:bg-gray-300 disabled:cursor-not-allowed
              transition-colors
              ${size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm'}
            `}
          >
            {searchButtonText}
          </button>
        )}
      </div>

      {/* Mensaje de error */}
      {error && errorMessage && (
        <div className="mt-1 text-sm text-red-600 flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
