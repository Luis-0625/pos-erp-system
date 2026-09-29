import React from 'react';

/**
 * EmptyState Component
 * 
 * Displays a user-friendly message when no data is available.
 * Used in lists, tables, and search results to provide clear feedback
 * and optional action buttons to guide users.
 * 
 * Features:
 * - Multiple predefined states/themes
 * - Customizable icon (SVG or React node)
 * - Primary message and optional description
 * - Optional action button
 * - Configurable size (small, medium, large)
 * - Optional illustration/image support
 * - Responsive design
 */

export type EmptyStateSize = 'small' | 'medium' | 'large';

export type EmptyStateVariant = 
  | 'default'
  | 'search'
  | 'filter'
  | 'noData'
  | 'error'
  | 'maintenance'
  | 'unauthorized'
  | 'notFound';

export interface EmptyStateAction {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  icon?: React.ReactNode;
}

export interface EmptyStateProps {
  /**
   * Main message to display
   */
  message?: string;
  
  /**
   * Optional description/subtitle
   */
  description?: string;
  
  /**
   * Custom icon or illustration
   */
  icon?: React.ReactNode;
  
  /**
   * Image URL for illustration
   */
  image?: string;
  
  /**
   * Predefined variant with default icon and messages
   */
  variant?: EmptyStateVariant;
  
  /**
   * Size of the empty state
   * @default 'medium'
   */
  size?: EmptyStateSize;
  
  /**
   * Primary action button
   */
  action?: EmptyStateAction;
  
  /**
   * Secondary action button
   */
  secondaryAction?: EmptyStateAction;
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * Show border around the empty state
   * @default false
   */
  bordered?: boolean;
  
  /**
   * Custom background color
   */
  backgroundColor?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  message,
  description,
  icon,
  image,
  variant = 'default',
  size = 'medium',
  action,
  secondaryAction,
  className = '',
  bordered = false,
  backgroundColor,
}) => {
  // Size classes
  const sizeClasses = {
    small: {
      container: 'py-8',
      iconSize: 'w-12 h-12',
      imageSize: 'w-32 h-32',
      messageSize: 'text-base',
      descriptionSize: 'text-sm',
      gap: 'gap-3',
    },
    medium: {
      container: 'py-12',
      iconSize: 'w-16 h-16',
      imageSize: 'w-48 h-48',
      messageSize: 'text-lg',
      descriptionSize: 'text-base',
      gap: 'gap-4',
    },
    large: {
      container: 'py-16',
      iconSize: 'w-20 h-20',
      imageSize: 'w-64 h-64',
      messageSize: 'text-xl',
      descriptionSize: 'text-lg',
      gap: 'gap-6',
    },
  };

  // Variant configurations with default icons and messages
  const variantConfig: Record<EmptyStateVariant, {
    icon: React.ReactNode;
    defaultMessage: string;
    defaultDescription?: string;
    iconColor: string;
  }> = {
    default: {
      icon: (
        <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      ),
      defaultMessage: 'No hay datos disponibles',
      iconColor: 'text-gray-400',
    },
    search: {
      icon: (
        <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      defaultMessage: 'No se encontraron resultados',
      defaultDescription: 'Intenta con otros términos de búsqueda',
      iconColor: 'text-blue-400',
    },
    filter: {
      icon: (
        <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
      ),
      defaultMessage: 'Sin resultados para este filtro',
      defaultDescription: 'Prueba ajustando los filtros aplicados',
      iconColor: 'text-purple-400',
    },
    noData: {
      icon: (
        <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      defaultMessage: 'Aún no hay registros',
      defaultDescription: 'Comienza agregando tu primer registro',
      iconColor: 'text-gray-400',
    },
    error: {
      icon: (
        <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      defaultMessage: 'Error al cargar los datos',
      defaultDescription: 'Por favor, intenta nuevamente',
      iconColor: 'text-red-400',
    },
    maintenance: {
      icon: (
        <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      defaultMessage: 'Servicio en mantenimiento',
      defaultDescription: 'Volveremos pronto. Disculpa las molestias.',
      iconColor: 'text-yellow-400',
    },
    unauthorized: {
      icon: (
        <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      defaultMessage: 'Acceso no autorizado',
      defaultDescription: 'No tienes permisos para ver este contenido',
      iconColor: 'text-orange-400',
    },
    notFound: {
      icon: (
        <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      defaultMessage: 'Contenido no encontrado',
      defaultDescription: 'El recurso que buscas no existe',
      iconColor: 'text-gray-400',
    },
  };

  const currentSize = sizeClasses[size];
  const currentVariant = variantConfig[variant];

  // Determine which icon to show (priority: custom icon > image > variant icon)
  const displayIcon = icon || (image ? null : currentVariant.icon);
  
  // Use custom message or fallback to variant default
  const displayMessage = message || currentVariant.defaultMessage;
  const displayDescription = description !== undefined ? description : currentVariant.defaultDescription;

  // Button variant classes
  const getButtonClasses = (btnVariant: 'primary' | 'secondary' | 'outline' = 'primary') => {
    const baseClasses = 'inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
    
    const variants = {
      primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
      secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
      outline: 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
    };

    return `${baseClasses} ${variants[btnVariant]}`;
  };

  const containerClasses = `
    flex flex-col items-center justify-center text-center
    ${currentSize.container}
    ${currentSize.gap}
    ${bordered ? 'border-2 border-dashed border-gray-300 rounded-lg' : ''}
    ${className}
  `.trim();

  return (
    <div 
      className={containerClasses}
      style={backgroundColor ? { backgroundColor } : undefined}
    >
      {/* Icon or Image */}
      {image ? (
        <img 
          src={image} 
          alt={displayMessage}
          className={`${currentSize.imageSize} object-contain`}
        />
      ) : displayIcon && (
        <div className={`${currentSize.iconSize} ${currentVariant.iconColor}`}>
          {displayIcon}
        </div>
      )}

      {/* Message */}
      <div className="space-y-2">
        <h3 className={`${currentSize.messageSize} font-semibold text-gray-900`}>
          {displayMessage}
        </h3>
        
        {displayDescription && (
          <p className={`${currentSize.descriptionSize} text-gray-500 max-w-md`}>
            {displayDescription}
          </p>
        )}
      </div>

      {/* Actions */}
      {(action || secondaryAction) && (
        <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
          {action && (
            <button
              onClick={action.onClick}
              className={getButtonClasses(action.variant)}
            >
              {action.icon && <span>{action.icon}</span>}
              {action.label}
            </button>
          )}
          
          {secondaryAction && (
            <button
              onClick={secondaryAction.onClick}
              className={getButtonClasses(secondaryAction.variant || 'outline')}
            >
              {secondaryAction.icon && <span>{secondaryAction.icon}</span>}
              {secondaryAction.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
