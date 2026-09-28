/**
 * PageContainer - Contenedor principal para el contenido de las páginas
 * 
 * Proporciona estructura consistente, padding, breadcrumbs, títulos y estados
 * de carga/error para todas las páginas de la aplicación.
 * 
 * Características:
 * - Layout responsivo con padding consistente
 * - Breadcrumbs opcionales para navegación
 * - Título de página con acciones opcionales
 * - Estados de carga y error
 * - Scroll automático al contenido
 * - Máximo ancho configurable
 */

import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Item del breadcrumb
 */
export interface BreadcrumbItem {
  label: string;
  path?: string;
  icon?: React.ReactNode;
}

/**
 * Props del PageContainer
 */
export interface PageContainerProps {
  /**
   * Título principal de la página
   */
  title?: string;

  /**
   * Subtítulo o descripción de la página
   */
  subtitle?: string;

  /**
   * Items del breadcrumb
   */
  breadcrumbs?: BreadcrumbItem[];

  /**
   * Acciones a mostrar en la cabecera (botones, etc.)
   */
  actions?: React.ReactNode;

  /**
   * Estado de carga
   */
  loading?: boolean;

  /**
   * Mensaje de carga personalizado
   */
  loadingMessage?: string;

  /**
   * Estado de error
   */
  error?: string | null;

  /**
   * Callback para reintentar después de un error
   */
  onRetry?: () => void;

  /**
   * Contenido de la página
   */
  children?: React.ReactNode;

  /**
   * Ancho máximo del contenedor
   * @default 'full' - Ancho completo
   */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';

  /**
   * Padding del contenedor
   * @default 'normal' - Padding estándar
   */
  padding?: 'none' | 'sm' | 'normal' | 'lg';

  /**
   * Mostrar fondo
   * @default false
   */
  background?: boolean;

  /**
   * Clase CSS adicional
   */
  className?: string;

  /**
   * ID del contenedor para scroll
   */
  id?: string;

  /**
   * Hacer scroll al top al montar
   * @default true
   */
  scrollToTop?: boolean;
}

/**
 * Componente PageContainer
 */
const PageContainer: React.FC<PageContainerProps> = ({
  title,
  subtitle,
  breadcrumbs,
  actions,
  loading = false,
  loadingMessage = 'Cargando...',
  error,
  onRetry,
  children,
  maxWidth = 'full',
  padding = 'normal',
  background = false,
  className = '',
  id = 'page-container',
  scrollToTop = true,
}) => {
  // Scroll al top al montar el componente
  React.useEffect(() => {
    if (scrollToTop) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [scrollToTop]);

  // Clases de ancho máximo
  const maxWidthClasses = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    '2xl': 'max-w-screen-2xl',
    full: 'max-w-full',
  };

  // Clases de padding
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-4',
    normal: 'p-4 md:p-6 lg:p-8',
    lg: 'p-6 md:p-8 lg:p-10',
  };

  return (
    <div
      id={id}
      className={`
        min-h-screen
        ${background ? 'bg-gray-50' : ''}
        ${className}
      `.trim()}
    >
      <div
        className={`
          mx-auto
          ${maxWidthClasses[maxWidth]}
          ${paddingClasses[padding]}
        `.trim()}
      >
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="mb-4 flex items-center gap-2 text-sm text-gray-600">
            {breadcrumbs.map((item, index) => (
              <React.Fragment key={index}>
                {index > 0 && (
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                )}
                {item.path ? (
                  <Link
                    to={item.path}
                    className="flex items-center gap-1.5 hover:text-primary-600 transition-colors"
                  >
                    {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                    <span>{item.label}</span>
                  </Link>
                ) : (
                  <span className="flex items-center gap-1.5 font-medium text-gray-900">
                    {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                    <span>{item.label}</span>
                  </span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}

        {/* Header */}
        {(title || actions) && (
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              {/* Título y subtítulo */}
              {title && (
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                    {title}
                  </h1>
                  {subtitle && (
                    <p className="text-sm md:text-base text-gray-600">
                      {subtitle}
                    </p>
                  )}
                </div>
              )}

              {/* Acciones */}
              {actions && (
                <div className="flex-shrink-0">
                  {actions}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Estado de error */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
            <div className="flex items-start gap-3">
              {/* Ícono de error */}
              <svg
                className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>

              {/* Mensaje de error */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-red-800 mb-1">
                  Error al cargar el contenido
                </h3>
                <p className="text-sm text-red-700">
                  {error}
                </p>

                {/* Botón de reintentar */}
                {onRetry && (
                  <button
                    onClick={onRetry}
                    className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200 transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    Reintentar
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Estado de carga */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12 md:py-20">
            {/* Spinner */}
            <div className="relative">
              <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
              <div className="w-16 h-16 border-4 border-primary-600 rounded-full animate-spin border-t-transparent absolute top-0 left-0"></div>
            </div>

            {/* Mensaje de carga */}
            <p className="mt-4 text-gray-600 font-medium">
              {loadingMessage}
            </p>
          </div>
        )}

        {/* Contenido */}
        {!loading && !error && children}
      </div>
    </div>
  );
};

export default PageContainer;
