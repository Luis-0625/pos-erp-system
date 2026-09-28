/**
 * Card Component
 * 
 * Componente de tarjeta reutilizable con soporte para:
 * - Header con título, subtítulo y acciones
 * - Footer con acciones
 * - Variantes de estilo
 * - Padding personalizable
 * - Bordes y sombras opcionales
 * - Accesibilidad completa
 */

import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'elevated' | 'flat';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  header?: React.ReactNode;
  footer?: React.ReactNode;
  title?: string;
  subtitle?: string;
  headerActions?: React.ReactNode;
  hoverable?: boolean;
  clickable?: boolean;
}

const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = 'md',
  header,
  footer,
  title,
  subtitle,
  headerActions,
  hoverable = false,
  clickable = false,
  children,
  className = '',
  ...props
}) => {
  // Clases base
  const baseClasses = `
    bg-white
    rounded-lg
    transition-all
    duration-200
  `;

  // Clases de variante
  const variantClasses = {
    default: 'border border-gray-200',
    bordered: 'border-2 border-gray-300',
    elevated: 'shadow-lg border border-gray-100',
    flat: 'border-0',
  };

  // Clases de padding
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
  };

  // Clases de interacción
  const interactionClasses = `
    ${hoverable ? 'hover:shadow-md hover:scale-[1.01]' : ''}
    ${clickable ? 'cursor-pointer active:scale-[0.99]' : ''}
  `;

  // Renderizar header personalizado o default
  const renderHeader = () => {
    if (header) {
      return <div className="border-b border-gray-200">{header}</div>;
    }

    if (title || subtitle || headerActions) {
      return (
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              {title && (
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                  {subtitle}
                </p>
              )}
            </div>
            {headerActions && (
              <div className="flex items-center gap-2 flex-shrink-0">
                {headerActions}
              </div>
            )}
          </div>
        </div>
      );
    }

    return null;
  };

  // Renderizar footer
  const renderFooter = () => {
    if (footer) {
      return (
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 rounded-b-lg">
          {footer}
        </div>
      );
    }
    return null;
  };

  const hasHeader = header || title || subtitle || headerActions;
  const hasFooter = footer;

  return (
    <div
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${interactionClasses}
        ${className}
      `.trim()}
      {...props}
    >
      {renderHeader()}
      
      <div
        className={`
          ${!hasHeader && !hasFooter ? paddingClasses[padding] : ''}
          ${hasHeader && !hasFooter ? `${paddingClasses[padding]} rounded-t-none` : ''}
          ${!hasHeader && hasFooter ? `${paddingClasses[padding]} rounded-b-none` : ''}
          ${hasHeader && hasFooter ? paddingClasses[padding] : ''}
        `.trim()}
      >
        {children}
      </div>

      {renderFooter()}
    </div>
  );
};

export default Card;
