import { useState, useEffect } from 'react';

/**
 * Custom hook para debouncing de valores
 * Útil para optimizar búsquedas en tiempo real y reducir llamadas a la API
 * 
 * @param value - Valor a debounce
 * @param delay - Tiempo de espera en milisegundos (default: 500ms)
 * @returns Valor debounced
 */
export const useDebounce = <T>(value: T, delay: number = 500): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Establece un timer que actualiza el valor debounced después del delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Limpia el timeout si el valor cambia antes de que se cumpla el delay
    // Esto previene actualizaciones innecesarias
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
