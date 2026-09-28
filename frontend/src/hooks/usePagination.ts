import { useState, useCallback, useMemo } from 'react';

export interface PaginationOptions {
  initialPage?: number;
  initialPageSize?: number;
  totalItems?: number;
}

export interface PaginationResult {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  goToPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  setPageSize: (size: number) => void;
  setTotalItems: (total: number) => void;
  reset: () => void;
}

/**
 * Custom hook para gestionar la paginación de listas
 * Proporciona funciones y estado para navegación entre páginas
 * 
 * @param options - Opciones de configuración inicial
 * @returns Objeto con estado y funciones de paginación
 */
export const usePagination = (options: PaginationOptions = {}): PaginationResult => {
  const {
    initialPage = 1,
    initialPageSize = 10,
    totalItems: initialTotalItems = 0,
  } = options;

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [totalItems, setTotalItems] = useState(initialTotalItems);

  // Calcula el número total de páginas
  const totalPages = useMemo(() => {
    return Math.ceil(totalItems / pageSize) || 1;
  }, [totalItems, pageSize]);

  // Calcula el índice de inicio (0-based)
  const startIndex = useMemo(() => {
    return (currentPage - 1) * pageSize;
  }, [currentPage, pageSize]);

  // Calcula el índice de fin
  const endIndex = useMemo(() => {
    return Math.min(startIndex + pageSize, totalItems);
  }, [startIndex, pageSize, totalItems]);

  // Verifica si hay página siguiente
  const hasNextPage = useMemo(() => {
    return currentPage < totalPages;
  }, [currentPage, totalPages]);

  // Verifica si hay página anterior
  const hasPreviousPage = useMemo(() => {
    return currentPage > 1;
  }, [currentPage]);

  /**
   * Navega a una página específica
   */
  const goToPage = useCallback(
    (page: number) => {
      const pageNumber = Math.max(1, Math.min(page, totalPages));
      setCurrentPage(pageNumber);
    },
    [totalPages]
  );

  /**
   * Navega a la página siguiente
   */
  const nextPage = useCallback(() => {
    if (hasNextPage) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [hasNextPage]);

  /**
   * Navega a la página anterior
   */
  const previousPage = useCallback(() => {
    if (hasPreviousPage) {
      setCurrentPage((prev) => prev - 1);
    }
  }, [hasPreviousPage]);

  /**
   * Cambia el tamaño de página y ajusta la página actual si es necesario
   */
  const handleSetPageSize = useCallback(
    (size: number) => {
      const newPageSize = Math.max(1, size);
      setPageSize(newPageSize);
      
      // Recalcula la página actual para mantener aproximadamente el mismo conjunto de elementos visible
      const newTotalPages = Math.ceil(totalItems / newPageSize) || 1;
      if (currentPage > newTotalPages) {
        setCurrentPage(newTotalPages);
      }
    },
    [currentPage, totalItems]
  );

  /**
   * Actualiza el total de elementos y ajusta la página actual si es necesario
   */
  const handleSetTotalItems = useCallback(
    (total: number) => {
      setTotalItems(Math.max(0, total));
      
      // Ajusta la página actual si excede el nuevo total de páginas
      const newTotalPages = Math.ceil(total / pageSize) || 1;
      if (currentPage > newTotalPages) {
        setCurrentPage(newTotalPages);
      }
    },
    [currentPage, pageSize]
  );

  /**
   * Resetea la paginación a los valores iniciales
   */
  const reset = useCallback(() => {
    setCurrentPage(initialPage);
    setPageSize(initialPageSize);
    setTotalItems(initialTotalItems);
  }, [initialPage, initialPageSize, initialTotalItems]);

  return {
    currentPage,
    pageSize,
    totalItems,
    totalPages,
    startIndex,
    endIndex,
    hasNextPage,
    hasPreviousPage,
    goToPage,
    nextPage,
    previousPage,
    setPageSize: handleSetPageSize,
    setTotalItems: handleSetTotalItems,
    reset,
  };
};
