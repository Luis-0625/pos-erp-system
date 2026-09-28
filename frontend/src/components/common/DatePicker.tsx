import React, { useState, useRef, useEffect } from 'react';

/**
 * DatePicker - Componente selector de fechas con calendario
 * 
 * Características:
 * - Selector de fecha única o rango de fechas
 * - Navegación por mes y año
 * - Validación de fechas (min/max)
 * - Estados de error y disabled
 * - Múltiples tamaños y formatos
 * - Limpieza de fecha
 * - Integración con formularios
 */

export interface DatePickerProps {
  value?: string | Date | null;
  onChange?: (date: string | null) => void;
  name?: string;
  label?: string;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  error?: string | boolean;
  disabled?: boolean;
  required?: boolean;
  size?: 'sm' | 'md' | 'lg';
  format?: 'YYYY-MM-DD' | 'DD/MM/YYYY' | 'MM/DD/YYYY';
  minDate?: string | Date;
  maxDate?: string | Date;
  clearable?: boolean;
  showIcon?: boolean;
  autoFocus?: boolean;
  onBlur?: () => void;
  onFocus?: () => void;
}

const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  name,
  label,
  placeholder = 'Seleccione una fecha',
  className = '',
  inputClassName = '',
  error,
  disabled = false,
  required = false,
  size = 'md',
  format = 'YYYY-MM-DD',
  minDate,
  maxDate,
  clearable = true,
  showIcon = true,
  autoFocus = false,
  onBlur,
  onFocus,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Convertir value a Date
  useEffect(() => {
    if (value) {
      const date = typeof value === 'string' ? new Date(value) : value;
      if (!isNaN(date.getTime())) {
        setSelectedDate(date);
        setCurrentMonth(date);
      }
    } else {
      setSelectedDate(null);
    }
  }, [value]);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Formatear fecha según el formato especificado
  const formatDate = (date: Date | null): string => {
    if (!date) return '';

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    switch (format) {
      case 'DD/MM/YYYY':
        return `${day}/${month}/${year}`;
      case 'MM/DD/YYYY':
        return `${month}/${day}/${year}`;
      case 'YYYY-MM-DD':
      default:
        return `${year}-${month}-${day}`;
    }
  };

  // Convertir fecha formateada a ISO string
  const toISOString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Validar si una fecha está dentro del rango permitido
  const isDateValid = (date: Date): boolean => {
    if (minDate) {
      const min = typeof minDate === 'string' ? new Date(minDate) : minDate;
      if (date < min) return false;
    }
    if (maxDate) {
      const max = typeof maxDate === 'string' ? new Date(maxDate) : maxDate;
      if (date > max) return false;
    }
    return true;
  };

  // Obtener días del mes
  const getDaysInMonth = (date: Date): Date[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: Date[] = [];

    // Días del mes anterior
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push(new Date(year, month - 1, prevMonthLastDay - i));
    }

    // Días del mes actual
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    // Días del mes siguiente
    const remainingDays = 42 - days.length; // 6 semanas * 7 días
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(year, month + 1, i));
    }

    return days;
  };

  const handleDateSelect = (date: Date) => {
    if (!isDateValid(date)) return;

    setSelectedDate(date);
    setIsOpen(false);

    if (onChange) {
      onChange(toISOString(date));
    }

    if (onBlur) {
      onBlur();
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedDate(null);
    if (onChange) {
      onChange(null);
    }
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    handleDateSelect(today);
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (date: Date): boolean => {
    if (!selectedDate) return false;
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const isCurrentMonth = (date: Date): boolean => {
    return date.getMonth() === currentMonth.getMonth();
  };

  // Clases de tamaño
  const sizeClasses = {
    sm: 'text-sm py-1.5 px-3',
    md: 'text-base py-2 px-4',
    lg: 'text-lg py-2.5 px-5',
  };

  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const days = getDaysInMonth(currentMonth);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          id={name}
          name={name}
          value={formatDate(selectedDate)}
          placeholder={placeholder}
          readOnly
          disabled={disabled}
          autoFocus={autoFocus}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onFocus={onFocus}
          className={`
            w-full rounded-lg border transition-colors
            ${sizeClasses[size]}
            ${showIcon ? 'pr-20' : 'pr-4'}
            ${disabled 
              ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
              : 'bg-white text-gray-900 cursor-pointer hover:border-primary-400'
            }
            ${error 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
              : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
            }
            focus:outline-none focus:ring-2 focus:ring-opacity-50
            ${inputClassName}
          `}
        />

        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {clearable && selectedDate && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              tabIndex={-1}
            >
              <svg className={iconSizeClasses[size]} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          {showIcon && (
            <button
              type="button"
              onClick={() => !disabled && setIsOpen(!isOpen)}
              className="p-1 text-gray-500"
              tabIndex={-1}
              disabled={disabled}
            >
              <svg className={iconSizeClasses[size]} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {error && typeof error === 'string' && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}

      {/* Calendario Desplegable */}
      {isOpen && (
        <div className="absolute z-50 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-80">
          {/* Header del calendario */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="font-semibold text-gray-900">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </div>

            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Nombres de los días */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map((day) => (
              <div
                key={day}
                className="text-center text-xs font-medium text-gray-500 py-1"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Días del calendario */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              const valid = isDateValid(day);
              const today = isToday(day);
              const selected = isSelected(day);
              const current = isCurrentMonth(day);

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => valid && handleDateSelect(day)}
                  disabled={!valid}
                  className={`
                    aspect-square p-2 text-sm rounded transition-colors
                    ${!current && 'text-gray-400'}
                    ${current && !selected && 'text-gray-900 hover:bg-gray-100'}
                    ${selected && 'bg-primary-600 text-white hover:bg-primary-700'}
                    ${today && !selected && 'border border-primary-600'}
                    ${!valid && 'opacity-30 cursor-not-allowed'}
                    ${valid && !selected && 'cursor-pointer'}
                  `}
                >
                  {day.getDate()}
                </button>
              );
            })}
          </div>

          {/* Footer con botón Hoy */}
          <div className="mt-4 pt-3 border-t border-gray-200">
            <button
              type="button"
              onClick={handleToday}
              className="w-full py-2 px-4 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded transition-colors"
            >
              Hoy
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;
