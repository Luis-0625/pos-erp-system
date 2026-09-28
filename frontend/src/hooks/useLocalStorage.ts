import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook para gestionar el almacenamiento en localStorage con sincronización de estado
 * @param key - Clave para el localStorage
 * @param initialValue - Valor inicial si no existe en localStorage
 */
export const useLocalStorage = <T>(key: string, initialValue: T) => {
  // Estado para almacenar el valor
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  /**
   * Guarda el valor en localStorage y actualiza el estado
   */
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // Permite que el valor sea una función para una API consistente con useState
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        
        setStoredValue(valueToStore);
        
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
          
          // Dispara un evento personalizado para sincronizar entre tabs
          window.dispatchEvent(
            new CustomEvent('local-storage', {
              detail: { key, value: valueToStore },
            })
          );
        }
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  /**
   * Elimina el valor del localStorage
   */
  const removeValue = useCallback(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
        setStoredValue(initialValue);
        
        // Dispara un evento personalizado
        window.dispatchEvent(
          new CustomEvent('local-storage', {
            detail: { key, value: null },
          })
        );
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  /**
   * Sincroniza cambios entre diferentes tabs/ventanas
   */
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent | CustomEvent) => {
      if ('key' in e && e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error('Error parsing storage value:', error);
        }
      } else if ('detail' in e && e.detail.key === key) {
        setStoredValue(e.detail.value ?? initialValue);
      }
    };

    // Escucha cambios en localStorage de otras tabs
    window.addEventListener('storage', handleStorageChange as EventListener);
    
    // Escucha el evento personalizado para sincronización en la misma tab
    window.addEventListener('local-storage', handleStorageChange as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange as EventListener);
      window.removeEventListener('local-storage', handleStorageChange as EventListener);
    };
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue] as const;
};
