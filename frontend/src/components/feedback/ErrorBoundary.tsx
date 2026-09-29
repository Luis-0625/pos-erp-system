/// <reference types="vite/client" />

/**
 * ErrorBoundary Component
 * 
 * Componente de límite de error de React que captura errores de JavaScript
 * en cualquier parte del árbol de componentes hijo, registra esos errores
 * y muestra una interfaz de respaldo en lugar del árbol de componentes que falló.
 * 
 * Características:
 * - Captura errores en componentes hijos
 * - Muestra UI de respaldo personalizable
 * - Registra información del error
 * - Permite reintentar la carga
 * - Soporte para diferentes niveles de error
 * - Información de error detallada en desarrollo
 * - Reportes de error opcionales
 * 
 * @example
 * // Uso básico
 * <ErrorBoundary>
 *   <MyComponent />
 * </ErrorBoundary>
 * 
 * @example
 * // Con fallback personalizado
 * <ErrorBoundary
 *   fallback={<CustomErrorUI />}
 *   onError={(error, errorInfo) => logError(error, errorInfo)}
 * >
 *   <MyComponent />
 * </ErrorBoundary>
 * 
 * @example
 * // Con reinicio automático
 * <ErrorBoundary
 *   resetKeys={[userId, dataVersion]}
 *   onReset={() => console.log('Resetting...')}
 * >
 *   <MyComponent />
 * </ErrorBoundary>
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';

// ========================================
// INTERFACES Y TIPOS
// ========================================

export interface ErrorBoundaryProps {
  /** Contenido a renderizar */
  children: ReactNode;
  /** Componente de respaldo personalizado */
  fallback?: ReactNode | ((error: Error, errorInfo: ErrorInfo, reset: () => void) => ReactNode);
  /** Callback cuando ocurre un error */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  /** Callback cuando se resetea el error */
  onReset?: () => void;
  /** Claves que al cambiar resetean el error automáticamente */
  resetKeys?: Array<string | number | boolean | null | undefined>;
  /** Nivel de error para logging */
  level?: 'error' | 'warning' | 'info';
  /** Mostrar información detallada del error (dev) */
  showDetails?: boolean;
  /** Permitir reintentar */
  showRetry?: boolean;
  /** Mensaje de error personalizado */
  errorMessage?: string;
  /** Título del error personalizado */
  errorTitle?: string;
  /** Clase CSS adicional */
  className?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

// ========================================
// ERROR BOUNDARY
// ========================================

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  /**
   * Método estático de React para capturar errores
   */
  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  /**
   * Método del ciclo de vida para manejar errores capturados
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const { onError, level = 'error' } = this.props;

    // Actualizar estado con información del error
    this.setState({
      errorInfo,
    });

    // Log del error basado en el nivel
    if (level === 'error') {
      console.error('ErrorBoundary capturó un error:', error, errorInfo);
    } else if (level === 'warning') {
      console.warn('ErrorBoundary capturó un warning:', error, errorInfo);
    } else {
      console.info('ErrorBoundary capturó información:', error, errorInfo);
    }

    // Llamar callback de error si existe
    if (onError) {
      onError(error, errorInfo);
    }

    // En producción, aquí se podría enviar el error a un servicio de logging
    // como Sentry, LogRocket, etc.
    if (import.meta.env.PROD) {
      // Ejemplo: logErrorToService(error, errorInfo);
    }
  }

  /**
   * Método del ciclo de vida para resetear automáticamente cuando cambian las resetKeys
   */
  componentDidUpdate(prevProps: ErrorBoundaryProps): void {
    const { resetKeys } = this.props;
    const { hasError } = this.state;

    if (hasError && resetKeys) {
      const prevResetKeys = prevProps.resetKeys || [];
      const hasResetKeyChanged = resetKeys.some(
        (key, index) => key !== prevResetKeys[index]
      );

      if (hasResetKeyChanged) {
        this.reset();
      }
    }
  }

  /**
   * Resetea el estado del error
   */
  reset = (): void => {
    const { onReset } = this.props;

    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });

    if (onReset) {
      onReset();
    }
  };

  /**
   * Renderiza la UI de respaldo cuando hay un error
   */
  renderFallback(): ReactNode {
    const { fallback, errorMessage, errorTitle, showDetails = false, showRetry = true } = this.props;
    const { error, errorInfo } = this.state;

    // Si hay un fallback personalizado, usarlo
    if (fallback) {
      if (typeof fallback === 'function' && error && errorInfo) {
        return fallback(error, errorInfo, this.reset);
      }
      return fallback as ReactNode;
    }

    // UI de respaldo por defecto
    return (
      <DefaultErrorFallback
        error={error}
        errorInfo={errorInfo}
        onReset={this.reset}
        errorTitle={errorTitle}
        errorMessage={errorMessage}
        showDetails={showDetails}
        showRetry={showRetry}
      />
    );
  }

  render(): ReactNode {
    const { hasError } = this.state;
    const { children, className } = this.props;

    if (hasError) {
      return (
        <div className={className}>
          {this.renderFallback()}
        </div>
      );
    }

    return children;
  }
}

// ========================================
// DEFAULT ERROR FALLBACK
// ========================================

interface DefaultErrorFallbackProps {
  error: Error | null;
  errorInfo: ErrorInfo | null;
  onReset: () => void;
  errorTitle?: string;
  errorMessage?: string;
  showDetails?: boolean;
  showRetry?: boolean;
}

const DefaultErrorFallback: React.FC<DefaultErrorFallbackProps> = ({
  error,
  errorInfo,
  onReset,
  errorTitle = 'Algo salió mal',
  errorMessage = 'Lo sentimos, ha ocurrido un error inesperado. Por favor, intenta nuevamente.',
  showDetails = import.meta.env.DEV,
  showRetry = true,
}) => {
  const [showErrorDetails, setShowErrorDetails] = React.useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Icono de error */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>

          {/* Título y mensaje */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {errorTitle}
            </h1>
            <p className="text-gray-600">
              {errorMessage}
            </p>
          </div>

          {/* Detalles del error (solo en desarrollo o si se solicita) */}
          {showDetails && error && (
            <div className="mb-6">
              <button
                onClick={() => setShowErrorDetails(!showErrorDetails)}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
              >
                <span className="font-medium text-gray-700">
                  Detalles del error
                </span>
                <svg
                  className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                    showErrorDetails ? 'transform rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {showErrorDetails && (
                <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="mb-3">
                    <h3 className="text-sm font-semibold text-red-800 mb-1">
                      Mensaje de error:
                    </h3>
                    <p className="text-sm text-red-700 font-mono">
                      {error.message}
                    </p>
                  </div>

                  {error.stack && (
                    <div className="mb-3">
                      <h3 className="text-sm font-semibold text-red-800 mb-1">
                        Stack trace:
                      </h3>
                      <pre className="text-xs text-red-700 font-mono overflow-x-auto bg-white p-3 rounded border border-red-200 max-h-64 overflow-y-auto">
                        {error.stack}
                      </pre>
                    </div>
                  )}

                  {errorInfo?.componentStack && (
                    <div>
                      <h3 className="text-sm font-semibold text-red-800 mb-1">
                        Component stack:
                      </h3>
                      <pre className="text-xs text-red-700 font-mono overflow-x-auto bg-white p-3 rounded border border-red-200 max-h-64 overflow-y-auto">
                        {errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Acciones */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {showRetry && (
              <button
                onClick={onReset}
                className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <svg
                  className="w-5 h-5"
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
                Intentar nuevamente
              </button>
            )}

            <button
              onClick={() => window.location.href = '/'}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Ir al inicio
            </button>
          </div>

          {/* Información de soporte */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              Si el problema persiste, por favor contacta a soporte técnico
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ========================================
// HOOK PARA MANEJAR ERRORES IMPERATIVAMENTE
// ========================================

/**
 * Hook para lanzar errores que serán capturados por ErrorBoundary
 * 
 * @example
 * const throwError = useErrorHandler();
 * 
 * try {
 *   // código que puede fallar
 * } catch (error) {
 *   throwError(error);
 * }
 */
export const useErrorHandler = (): ((error: Error) => void) => {
  const [, setError] = React.useState<Error | null>(null);

  return React.useCallback((error: Error) => {
    setError(() => {
      throw error;
    });
  }, []);
};

// ========================================
// COMPONENTE WRAPPER CON TIPADO
// ========================================

/**
 * HOC para envolver componentes con ErrorBoundary
 * 
 * @example
 * const SafeComponent = withErrorBoundary(MyComponent, {
 *   fallback: <div>Error!</div>,
 *   onError: (error) => console.error(error)
 * });
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
): React.ComponentType<P> {
  const WrappedComponent: React.FC<P> = (props) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name || 'Component'})`;

  return WrappedComponent;
}

export default ErrorBoundary;
