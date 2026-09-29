/**
 * DataTable Component
 * 
 * Componente de tabla de datos con funcionalidades avanzadas:
 * - Ordenamiento por columnas
 * - Selección múltiple de filas
 * - Renderizado personalizado de celdas
 * - Acciones por fila
 * - Estado de carga
 * - Estado vacío
 * - Estilos responsivos
 */

import React, { useState, useMemo } from 'react';

// Tipos de ordenamiento
export type SortDirection = 'asc' | 'desc' | null;

// Definición de columna
export interface DataTableColumn<T = any> {
  id: string;
  header: string;
  accessor?: keyof T | ((row: T) => any);
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: T, index: number) => React.ReactNode;
  headerRender?: () => React.ReactNode;
}

// Props del componente
export interface DataTableProps<T = any> {
  columns: DataTableColumn<T>[];
  data: T[];
  keyExtractor?: (row: T, index: number) => string | number;
  selectable?: boolean;
  selectedRows?: (string | number)[];
  onSelectionChange?: (selectedKeys: (string | number)[]) => void;
  onRowClick?: (row: T, index: number) => void;
  actions?: (row: T, index: number) => React.ReactNode;
  loading?: boolean;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  striped?: boolean;
  hoverable?: boolean;
  bordered?: boolean;
  compact?: boolean;
  stickyHeader?: boolean;
  maxHeight?: string;
  className?: string;
  rowClassName?: string | ((row: T, index: number) => string);
  sortBy?: string;
  sortDirection?: SortDirection;
  onSortChange?: (columnId: string, direction: SortDirection) => void;
}

const DataTable = <T extends Record<string, any>>({
  columns,
  data,
  keyExtractor = (_, index) => index,
  selectable = false,
  selectedRows = [],
  onSelectionChange,
  onRowClick,
  actions,
  loading = false,
  emptyMessage = 'No hay datos disponibles',
  emptyIcon,
  striped = true,
  hoverable = true,
  bordered = false,
  compact = false,
  stickyHeader = false,
  maxHeight,
  className = '',
  rowClassName,
  sortBy,
  sortDirection,
  onSortChange,
}: DataTableProps<T>) => {
  // Estado local de ordenamiento si no se controla externamente
  const [internalSortBy, setInternalSortBy] = useState<string | null>(null);
  const [internalSortDirection, setInternalSortDirection] = useState<SortDirection>(null);

  // Usar estado interno o externo
  const currentSortBy = sortBy !== undefined ? sortBy : internalSortBy;
  const currentSortDirection = sortDirection !== undefined ? sortDirection : internalSortDirection;

  // Función para obtener el valor de una celda
  const getCellValue = (row: T, column: DataTableColumn<T>): any => {
    if (column.accessor) {
      if (typeof column.accessor === 'function') {
        return column.accessor(row);
      }
      return row[column.accessor];
    }
    return row[column.id];
  };

  // Datos ordenados
  const sortedData = useMemo(() => {
    if (!currentSortBy || !currentSortDirection) {
      return data;
    }

    const column = columns.find((col) => col.id === currentSortBy);
    if (!column) {
      return data;
    }

    return [...data].sort((a, b) => {
      const aValue = getCellValue(a, column);
      const bValue = getCellValue(b, column);

      if (aValue === bValue) return 0;
      
      const comparison = aValue > bValue ? 1 : -1;
      return currentSortDirection === 'asc' ? comparison : -comparison;
    });
  }, [data, currentSortBy, currentSortDirection, columns]);

  // Manejar cambio de ordenamiento
  const handleSort = (columnId: string) => {
    const column = columns.find((col) => col.id === columnId);
    if (!column?.sortable) return;

    let newDirection: SortDirection = 'asc';

    if (currentSortBy === columnId) {
      if (currentSortDirection === 'asc') {
        newDirection = 'desc';
      } else if (currentSortDirection === 'desc') {
        newDirection = null;
      }
    }

    if (onSortChange) {
      onSortChange(columnId, newDirection);
    } else {
      setInternalSortBy(newDirection ? columnId : null);
      setInternalSortDirection(newDirection);
    }
  };

  // Manejar selección de todas las filas
  const handleSelectAll = (checked: boolean) => {
    if (!onSelectionChange) return;

    if (checked) {
      const allKeys = sortedData.map((row, index) => keyExtractor(row, index));
      onSelectionChange(allKeys);
    } else {
      onSelectionChange([]);
    }
  };

  // Manejar selección de una fila
  const handleSelectRow = (key: string | number, checked: boolean) => {
    if (!onSelectionChange) return;

    if (checked) {
      onSelectionChange([...selectedRows, key]);
    } else {
      onSelectionChange(selectedRows.filter((k) => k !== key));
    }
  };

  // Verificar si todas las filas están seleccionadas
  const allSelected = sortedData.length > 0 && sortedData.every((row, index) => {
    const key = keyExtractor(row, index);
    return selectedRows.includes(key);
  });

  // Verificar si algunas filas están seleccionadas
  const someSelected = selectedRows.length > 0 && !allSelected;

  // Renderizar icono de ordenamiento
  const renderSortIcon = (columnId: string) => {
    if (currentSortBy !== columnId) {
      return (
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }

    if (currentSortDirection === 'asc') {
      return (
        <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      );
    }

    return (
      <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  // Clases base de la tabla
  const tableClasses = `w-full ${className}`;
  const containerClasses = `overflow-x-auto ${bordered ? 'border border-gray-200 rounded-lg' : ''} ${
    maxHeight ? 'overflow-y-auto' : ''
  }`;

  // Renderizar estado de carga
  if (loading) {
    return (
      <div className={containerClasses}>
        <table className={tableClasses}>
          <thead className={`bg-gray-50 ${stickyHeader ? 'sticky top-0 z-10' : ''}`}>
            <tr>
              {selectable && <th className="w-12"></th>}
              {columns.map((column) => (
                <th
                  key={column.id}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    column.width ? `w-${column.width}` : ''
                  }`}
                  style={{ width: column.width }}
                >
                  {column.header}
                </th>
              ))}
              {actions && <th className="w-24"></th>}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {[...Array(5)].map((_, index) => (
              <tr key={index} className="animate-pulse">
                {selectable && (
                  <td className="px-6 py-4">
                    <div className="h-4 w-4 bg-gray-200 rounded"></div>
                  </td>
                )}
                {columns.map((column) => (
                  <td key={column.id} className="px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </td>
                ))}
                {actions && (
                  <td className="px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Renderizar estado vacío
  if (sortedData.length === 0) {
    return (
      <div className={`${containerClasses} bg-white`}>
        <div className="flex flex-col items-center justify-center py-12 px-4">
          {emptyIcon ? (
            emptyIcon
          ) : (
            <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          )}
          <p className="text-gray-500 text-center">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  // Renderizar tabla con datos
  return (
    <div className={containerClasses} style={{ maxHeight }}>
      <table className={tableClasses}>
        <thead className={`bg-gray-50 ${stickyHeader ? 'sticky top-0 z-10' : ''}`}>
          <tr>
            {selectable && (
              <th className="px-6 py-3 w-12">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(input) => {
                    if (input) {
                      input.indeterminate = someSelected;
                    }
                  }}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded cursor-pointer"
                />
              </th>
            )}
            {columns.map((column) => (
              <th
                key={column.id}
                className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${
                  column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : 'text-left'
                } ${column.sortable ? 'cursor-pointer select-none hover:bg-gray-100' : ''}`}
                style={{ width: column.width }}
                onClick={() => column.sortable && handleSort(column.id)}
              >
                <div className="flex items-center gap-2 justify-between">
                  <span>{column.headerRender ? column.headerRender() : column.header}</span>
                  {column.sortable && renderSortIcon(column.id)}
                </div>
              </th>
            ))}
            {actions && <th className="px-6 py-3 w-24 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>}
          </tr>
        </thead>
        <tbody className={`bg-white divide-y divide-gray-200 ${compact ? 'text-sm' : ''}`}>
          {sortedData.map((row, index) => {
            const rowKey = keyExtractor(row, index);
            const isSelected = selectedRows.includes(rowKey);
            const rowClasses = typeof rowClassName === 'function' ? rowClassName(row, index) : rowClassName;

            return (
              <tr
                key={rowKey}
                className={`
                  ${striped && index % 2 === 1 ? 'bg-gray-50' : ''}
                  ${hoverable ? 'hover:bg-gray-100' : ''}
                  ${isSelected ? 'bg-primary-50' : ''}
                  ${onRowClick ? 'cursor-pointer' : ''}
                  ${rowClasses || ''}
                  transition-colors duration-150
                `}
                onClick={() => onRowClick && onRowClick(row, index)}
              >
                {selectable && (
                  <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => handleSelectRow(rowKey, e.target.checked)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded cursor-pointer"
                    />
                  </td>
                )}
                {columns.map((column) => {
                  const value = getCellValue(row, column);
                  return (
                    <td
                      key={column.id}
                      className={`px-6 ${compact ? 'py-2' : 'py-4'} whitespace-nowrap ${
                        column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : 'text-left'
                      }`}
                    >
                      {column.render ? column.render(value, row, index) : value}
                    </td>
                  );
                })}
                {actions && (
                  <td className={`px-6 ${compact ? 'py-2' : 'py-4'} whitespace-nowrap text-right`} onClick={(e) => e.stopPropagation()}>
                    {actions(row, index)}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
