import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export interface MenuItem {
  id: string;
  label: string;
  path: string;
  icon: React.ReactNode;
  badge?: number | string;
  subItems?: SubMenuItem[];
}

export interface SubMenuItem {
  id: string;
  label: string;
  path: string;
  icon?: React.ReactNode;
}

export interface SidebarProps {
  isCollapsed?: boolean;
  isMobileOpen?: boolean;
  onClose?: () => void;
  menuItems?: MenuItem[];
}

const defaultMenuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    id: 'sales',
    label: 'Ventas',
    path: '/sales',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    subItems: [
      { id: 'pos', label: 'Punto de Venta', path: '/sales/pos' },
      { id: 'sales-list', label: 'Lista de Ventas', path: '/sales/list' },
      { id: 'sales-invoices', label: 'Facturación', path: '/sales/invoices' },
    ],
  },
  {
    id: 'purchases',
    label: 'Compras',
    path: '/purchases',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
    subItems: [
      { id: 'purchases-new', label: 'Nueva Compra', path: '/purchases/new' },
      { id: 'purchases-list', label: 'Lista de Compras', path: '/purchases/list' },
      { id: 'purchases-reception', label: 'Recepción', path: '/purchases/reception' },
    ],
  },
  {
    id: 'products',
    label: 'Productos',
    path: '/products',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    subItems: [
      { id: 'products-list', label: 'Lista de Productos', path: '/products/list' },
      { id: 'products-categories', label: 'Categorías', path: '/products/categories' },
      { id: 'products-inventory', label: 'Inventario', path: '/products/inventory' },
    ],
  },
  {
    id: 'clients',
    label: 'Clientes',
    path: '/clients',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    badge: 3,
  },
  {
    id: 'suppliers',
    label: 'Proveedores',
    path: '/suppliers',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    id: 'portfolio',
    label: 'Cartera',
    path: '/portfolio',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    badge: '!',
    subItems: [
      { id: 'portfolio-receivable', label: 'Cuentas por Cobrar', path: '/portfolio/receivable' },
      { id: 'portfolio-payable', label: 'Cuentas por Pagar', path: '/portfolio/payable' },
      { id: 'portfolio-payments', label: 'Pagos', path: '/portfolio/payments' },
    ],
  },
  {
    id: 'reports',
    label: 'Reportes',
    path: '/reports',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    subItems: [
      { id: 'reports-sales', label: 'Reporte de Ventas', path: '/reports/sales' },
      { id: 'reports-purchases', label: 'Reporte de Compras', path: '/reports/purchases' },
      { id: 'reports-inventory', label: 'Reporte de Inventario', path: '/reports/inventory' },
      { id: 'reports-financial', label: 'Reporte Financiero', path: '/reports/financial' },
    ],
  },
  {
    id: 'config',
    label: 'Configuración',
    path: '/config',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    subItems: [
      { id: 'config-company', label: 'Empresa', path: '/config/company' },
      { id: 'config-taxes', label: 'Impuestos', path: '/config/taxes' },
      { id: 'config-users', label: 'Usuarios', path: '/config/users' },
      { id: 'config-roles', label: 'Roles y Permisos', path: '/config/roles' },
    ],
  },
];

const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed = false,
  isMobileOpen = false,
  onClose,
  menuItems = defaultMenuItems,
}) => {
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  const isPathActive = (path: string, exact: boolean = false): boolean => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const toggleSubmenu = (menuId: string) => {
    setExpandedMenus((prev) =>
      prev.includes(menuId)
        ? prev.filter((id) => id !== menuId)
        : [...prev, menuId]
    );
  };

  const handleMenuClick = (item: MenuItem) => {
    if (item.subItems) {
      toggleSubmenu(item.id);
    } else if (isMobileOpen && onClose) {
      onClose();
    }
  };

  const handleSubItemClick = () => {
    if (isMobileOpen && onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-50 transition-all duration-300 ease-in-out
          ${isCollapsed ? 'w-16' : 'w-64'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:top-16 lg:h-[calc(100vh-4rem)]
        `}
      >
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">PE</span>
            </div>
            {!isCollapsed && (
              <span className="font-bold text-gray-800">POS-ERP</span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Cerrar menú"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const hasSubItems = item.subItems && item.subItems.length > 0;
              const isExpanded = expandedMenus.includes(item.id);
              const isActive = isPathActive(item.path, !hasSubItems);

              return (
                <li key={item.id}>
                  {/* Main Menu Item */}
                  {hasSubItems ? (
                    <button
                      onClick={() => handleMenuClick(item)}
                      className={`
                        w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                        ${isActive
                          ? 'bg-primary-50 text-primary-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                        }
                        ${isCollapsed ? 'justify-center' : ''}
                      `}
                      title={isCollapsed ? item.label : undefined}
                    >
                      <span className={`flex-shrink-0 ${isActive ? 'text-primary-600' : 'text-gray-500'}`}>
                        {item.icon}
                      </span>
                      
                      {!isCollapsed && (
                        <>
                          <span className="flex-1 text-left text-sm">{item.label}</span>
                          
                          {item.badge && (
                            <span className={`
                              px-2 py-0.5 text-xs font-semibold rounded-full
                              ${typeof item.badge === 'number'
                                ? 'bg-primary-100 text-primary-700'
                                : 'bg-danger-100 text-danger-700'
                              }
                            `}>
                              {item.badge}
                            </span>
                          )}
                          
                          <svg
                            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                              isExpanded ? 'transform rotate-180' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </>
                      )}
                    </button>
                  ) : (
                    <Link
                      to={item.path}
                      onClick={() => handleMenuClick(item)}
                      className={`
                        flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                        ${isActive
                          ? 'bg-primary-50 text-primary-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                        }
                        ${isCollapsed ? 'justify-center' : ''}
                      `}
                      title={isCollapsed ? item.label : undefined}
                    >
                      <span className={`flex-shrink-0 ${isActive ? 'text-primary-600' : 'text-gray-500'}`}>
                        {item.icon}
                      </span>
                      
                      {!isCollapsed && (
                        <>
                          <span className="flex-1 text-sm">{item.label}</span>
                          
                          {item.badge && (
                            <span className={`
                              px-2 py-0.5 text-xs font-semibold rounded-full
                              ${typeof item.badge === 'number'
                                ? 'bg-primary-100 text-primary-700'
                                : 'bg-danger-100 text-danger-700'
                              }
                            `}>
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </Link>
                  )}

                  {/* Submenu Items */}
                  {hasSubItems && !isCollapsed && (
                    <ul
                      className={`
                        mt-1 ml-4 pl-4 border-l-2 border-gray-200 space-y-1 overflow-hidden transition-all duration-300
                        ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
                      `}
                    >
                      {item.subItems!.map((subItem) => {
                        const isSubActive = isPathActive(subItem.path, true);
                        
                        return (
                          <li key={subItem.id}>
                            <Link
                              to={subItem.path}
                              onClick={handleSubItemClick}
                              className={`
                                flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors
                                ${isSubActive
                                  ? 'bg-primary-50 text-primary-700 font-medium'
                                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }
                              `}
                            >
                              {subItem.icon && (
                                <span className="flex-shrink-0 w-4 h-4">
                                  {subItem.icon}
                                </span>
                              )}
                              <span>{subItem.label}</span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sidebar Footer (collapsed indicator) */}
        {!isCollapsed && (
          <div className="hidden lg:block p-4 border-t border-gray-200">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>POS-ERP v1.0.0</span>
            </div>
          </div>
        )}
      </aside>

      {/* Sidebar Spacer (for main content) */}
      <div
        className={`
          hidden lg:block transition-all duration-300
          ${isCollapsed ? 'w-16' : 'w-64'}
        `}
        aria-hidden="true"
      />
    </>
  );
};

export default Sidebar;
