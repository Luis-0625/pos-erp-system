/**
 * Pagination Component
 * 
 * Componente de paginación con:
 * - Navegación entre páginas
 * - Salto a primera/última página
 * - Selector de elementos por página
 * - Información de rango de elementos
 * - Diseño responsivo
 */

import React from 'react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  showPageSizeSelector?: boolean;
  showPageInfo?: boolean;
  showFirstLast?: boolean;
  maxPageButtons?: number;
  disabled?: boolean;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
  showPageSizeSelector = true,
  showPageInfo = true,
  showFirstLast = true,
  maxPageButtons = 7,
  disabled = false,
  className = '',
}) => {
  // Calcular rango de elementos mostrados
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generar array de números de página a mostrar
  const getPageNumbers = (): (number | string)[] => {
    if (totalPages <= maxPageButtons) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [];
    const halfButtons = Math.floor(maxPageButtons / 2);
    
    let startPage = Math.max(1, currentPage - halfButtons);
    let endPage = Math.min(totalPages, currentPage + halfButtons);

    // Ajustar si estamos cerca del inicio o fin
    if (currentPage <= halfButtons) {
      endPage = maxPageButtons;
    } else if (currentPage >= totalPages - halfButtons) {
      startPage = totalPages - maxPageButtons + 1;
    }

    // Agregar primera página y elipsis si es necesario
    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push('...');
      }
    }

    // Agregar páginas del rango
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Agregar elipsis y última página si es necesario
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push('...');
      }
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  // Handlers
  const handlePageChange = (page: number) => {
    if (disabled || page < 1 || page > totalPages || page === currentPage) {
      return;
    }
    onPageChange(page);
  };

  const handlePageSizeChange = (newSize: number) => {
    if (disabled || !onPageSizeChange) return;
    onPageSizeChange(newSize);
  };

  // Clases de botón
  const getButtonClasses = (isActive: boolean = false, isDisabled: boolean = false) => {
    const baseClasses = 'px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150';
    
    if (isDisabled) {
      return `${baseClasses} bg-gray-100 text-gray-400 cursor-not-allowed`;
    }
    
    if (isActive) {
      return `${baseClasses} bg-primary-600 text-white`;
    }
    
    return `${baseClasses} bg-white text-gray-700 hover:bg-gray-50 border border-gray-300`;
  };

  // Si no hay páginas, no mostrar nada
  if (totalPages === 0) {
    return null;
  }

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
      {/* Información de elementos */}
      {showPageInfo && (
        <div className="text-sm text-gray-700 order-2 sm:order-1">
          Mostrando <span className="font-medium">{startItem}</span> a{' '}
          <span className="font-medium">{endItem}</span> de{' '}
          <span className="font-medium">{totalItems}</span> resultados
        </div>
      )}

      {/* Controles de paginación */}
      <div className="flex items-center gap-2 order-1 sm:order-2">
        {/* Botón Primera Página */}
        {showFirstLast && (
          <button
            onClick={() => handlePageChange(1)}
            disabled={disabled || currentPage === 1}
            className={getButtonClasses(false, disabled || currentPage === 1)}
            title="Primera página"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Botón Página Anterior */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={disabled || currentPage === 1}
          className={getButtonClasses(false, disabled || currentPage === 1)}
          title="Página anterior"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Números de página */}
        <div className="hidden sm:flex items-center gap-1">
          {pageNumbers.map((page, index) => {
            if (page === '...') {
              return (
                <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500">
                  ...
                </span>
              );
            }

            const pageNumber = page as number;
            return (
              <button
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
                disabled={disabled}
                className={getButtonClasses(currentPage === pageNumber, disabled)}
              >
                {pageNumber}
              </button>
            );
          })}
        </div>

        {/* Indicador de página actual en móvil */}
        <div className="sm:hidden px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md">
          {currentPage} / {totalPages}
        </div>

        {/* Botón Página Siguiente */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={disabled || currentPage === totalPages}
          className={getButtonClasses(false, disabled || currentPage === totalPages)}
          title="Página siguiente"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Botón Última Página */}
        {showFirstLast && (
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={disabled || currentPage === totalPages}
            className={getButtonClasses(false, disabled || currentPage === totalPages)}
            title="Última página"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>

      {/* Selector de elementos por página */}
      {showPageSizeSelector && onPageSizeChange && (
        <div className="flex items-center gap-2 text-sm order-3">
          <label htmlFor="pageSize" className="text-gray-700 whitespace-nowrap">
            Elementos por página:
          </label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            disabled={disabled}
            className="border border-gray-300 rounded-md px-3 py-1.5 text-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            {pageSizeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default Pagination;
