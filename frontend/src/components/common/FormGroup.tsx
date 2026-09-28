/**
 * FormGroup Component
 * 
 * Agrupa múltiples campos de formulario con título y descripción opcional.
 * Útil para organizar formularios grandes en secciones lógicas.
 * 
 * @example
 * ```tsx
 * <FormGroup title="Información Personal" description="Datos básicos del usuario">
 *   <FormField label="Nombre" required>
 *     <Input name="firstName" />
 *   </FormField>
 *   <FormField label="Apellido" required>
 *     <Input name="lastName" />
 *   </FormField>
 * </FormGroup>
 * ```
 */

import React from 'react';

export interface FormGroupProps {
  /**
   * Título del grupo de campos
   */
  title?: string;
  
  /**
   * Descripción o ayuda adicional para el grupo
   */
  description?: string;
  
  /**
   * Campos del formulario a incluir en el grupo
   */
  children: React.ReactNode;
  
  /**
   * Clases CSS adicionales para el contenedor
   */
  className?: string;
  
  /**
   * Clases CSS adicionales para el título
   */
  titleClassName?: string;
  
  /**
   * Clases CSS adicionales para la descripción
   */
  descriptionClassName?: string;
  
  /**
   * Clases CSS adicionales para el contenedor de los campos
   */
  childrenClassName?: string;
  
  /**
   * Si se debe mostrar un borde alrededor del grupo
   * @default false
   */
  bordered?: boolean;
  
  /**
   * Si el grupo debe ser colapsable
   * @default false
   */
  collapsible?: boolean;
  
  /**
   * Estado inicial colapsado (solo si collapsible=true)
   * @default false
   */
  defaultCollapsed?: boolean;
  
  /**
   * Callback cuando el estado colapsado cambia
   */
  onCollapsedChange?: (collapsed: boolean) => void;
}

const FormGroup: React.FC<FormGroupProps> = ({
  title,
  description,
  children,
  className = '',
  titleClassName = '',
  descriptionClassName = '',
  childrenClassName = '',
  bordered = false,
  collapsible = false,
  defaultCollapsed = false,
  onCollapsedChange,
}) => {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);

  const handleToggleCollapse = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    
    if (onCollapsedChange) {
      onCollapsedChange(newCollapsedState);
    }
  };

  const containerClasses = `
    ${bordered ? 'border border-gray-200 rounded-lg p-6' : 'mb-6'}
    ${className}
  `.trim();

  const headerClasses = `
    ${collapsible ? 'cursor-pointer select-none' : ''}
    ${title || description ? 'mb-4' : ''}
  `.trim();

  const titleClasses = `
    text-lg font-semibold text-gray-900
    ${collapsible ? 'flex items-center justify-between' : ''}
    ${titleClassName}
  `.trim();

  const descriptionClasses = `
    text-sm text-gray-600 mt-1
    ${descriptionClassName}
  `.trim();

  const childrenContainerClasses = `
    space-y-4
    ${childrenClassName}
  `.trim();

  return (
    <div className={containerClasses}>
      {(title || description) && (
        <div 
          className={headerClasses}
          onClick={collapsible ? handleToggleCollapse : undefined}
        >
          {title && (
            <h3 className={titleClasses}>
              <span>{title}</span>
              {collapsible && (
                <svg
                  className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                    isCollapsed ? '' : 'rotate-180'
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
              )}
            </h3>
          )}
          {description && (
            <p className={descriptionClasses}>{description}</p>
          )}
        </div>
      )}
      
      {(!collapsible || !isCollapsed) && (
        <div className={childrenContainerClasses}>
          {children}
        </div>
      )}
    </div>
  );
};

export default FormGroup;
