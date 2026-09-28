/**
 * Routes Configuration
 * 
 * Configuración central de todas las rutas de la aplicación
 */

import { lazy } from 'react';
import { UserRole } from '../types';

// Lazy load de páginas para code splitting
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Login = lazy(() => import('../pages/auth/Login'));
const Unauthorized = lazy(() => import('../pages/auth/Unauthorized'));
const NotFound = lazy(() => import('../pages/NotFound'));

// Productos
const ProductList = lazy(() => import('../pages/products/ProductList'));
const ProductCreate = lazy(() => import('../pages/products/ProductCreate'));
const ProductEdit = lazy(() => import('../pages/products/ProductEdit'));
const ProductDetail = lazy(() => import('../pages/products/ProductDetail'));
const CategoryList = lazy(() => import('../pages/products/CategoryList'));

// Ventas
const SalesList = lazy(() => import('../pages/sales/SalesList'));
const SaleCreate = lazy(() => import('../pages/sales/SaleCreate'));
const SaleDetail = lazy(() => import('../pages/sales/SaleDetail'));
const POS = lazy(() => import('../pages/sales/POS'));

// Compras
const PurchaseList = lazy(() => import('../pages/purchases/PurchaseList'));
const PurchaseCreate = lazy(() => import('../pages/purchases/PurchaseCreate'));
const PurchaseDetail = lazy(() => import('../pages/purchases/PurchaseDetail'));

// Clientes
const ClientList = lazy(() => import('../pages/clients/ClientList'));
const ClientCreate = lazy(() => import('../pages/clients/ClientCreate'));
const ClientEdit = lazy(() => import('../pages/clients/ClientEdit'));
const ClientDetail = lazy(() => import('../pages/clients/ClientDetail'));

// Proveedores
const SupplierList = lazy(() => import('../pages/suppliers/SupplierList'));
const SupplierCreate = lazy(() => import('../pages/suppliers/SupplierCreate'));
const SupplierEdit = lazy(() => import('../pages/suppliers/SupplierEdit'));
const SupplierDetail = lazy(() => import('../pages/suppliers/SupplierDetail'));

// Cartera
const AccountsReceivable = lazy(() => import('../pages/portfolio/AccountsReceivable'));
const AccountsPayable = lazy(() => import('../pages/portfolio/AccountsPayable'));
const Payments = lazy(() => import('../pages/portfolio/Payments'));
const PortfolioStats = lazy(() => import('../pages/portfolio/PortfolioStats'));

// Reportes
const ReportsDashboard = lazy(() => import('../pages/reports/ReportsDashboard'));
const SalesReport = lazy(() => import('../pages/reports/SalesReport'));
const PurchasesReport = lazy(() => import('../pages/reports/PurchasesReport'));
const InventoryReport = lazy(() => import('../pages/reports/InventoryReport'));
const FinancialReport = lazy(() => import('../pages/reports/FinancialReport'));
const PortfolioReport = lazy(() => import('../pages/reports/PortfolioReport'));

// Configuración
const Settings = lazy(() => import('../pages/settings/Settings'));
const CompanySettings = lazy(() => import('../pages/settings/CompanySettings'));
const TaxSettings = lazy(() => import('../pages/settings/TaxSettings'));
const UserManagement = lazy(() => import('../pages/settings/UserManagement'));
const RoleManagement = lazy(() => import('../pages/settings/RoleManagement'));

/**
 * Interfaz para definición de rutas
 */
export interface RouteConfig {
  path: string;
  component: React.LazyExoticComponent<React.FC>;
  title?: string;
  requiredRoles?: UserRole[];
  requiredPermissions?: string[];
  exact?: boolean;
  children?: RouteConfig[];
}

/**
 * Rutas públicas (sin autenticación)
 */
export const publicRoutes: RouteConfig[] = [
  {
    path: '/login',
    component: Login,
    title: 'Iniciar Sesión',
  },
  {
    path: '/unauthorized',
    component: Unauthorized,
    title: 'Acceso Denegado',
  },
  {
    path: '*',
    component: NotFound,
    title: 'Página No Encontrada',
  },
];

/**
 * Rutas protegidas (requieren autenticación)
 */
export const protectedRoutes: RouteConfig[] = [
  {
    path: '/',
    component: Dashboard,
    title: 'Dashboard',
    exact: true,
  },
  {
    path: '/dashboard',
    component: Dashboard,
    title: 'Dashboard',
  },

  // Productos
  {
    path: '/products',
    component: ProductList,
    title: 'Productos',
    requiredPermissions: ['products.view'],
  },
  {
    path: '/products/new',
    component: ProductCreate,
    title: 'Crear Producto',
    requiredPermissions: ['products.create'],
  },
  {
    path: '/products/:id/edit',
    component: ProductEdit,
    title: 'Editar Producto',
    requiredPermissions: ['products.update'],
  },
  {
    path: '/products/:id',
    component: ProductDetail,
    title: 'Detalle de Producto',
    requiredPermissions: ['products.view'],
  },
  {
    path: '/categories',
    component: CategoryList,
    title: 'Categorías',
    requiredPermissions: ['products.view'],
  },

  // Ventas
  {
    path: '/sales',
    component: SalesList,
    title: 'Ventas',
    requiredPermissions: ['sales.view'],
  },
  {
    path: '/sales/new',
    component: SaleCreate,
    title: 'Nueva Venta',
    requiredPermissions: ['sales.create'],
  },
  {
    path: '/sales/:id',
    component: SaleDetail,
    title: 'Detalle de Venta',
    requiredPermissions: ['sales.view'],
  },
  {
    path: '/pos',
    component: POS,
    title: 'Punto de Venta',
    requiredPermissions: ['sales.create'],
  },

  // Compras
  {
    path: '/purchases',
    component: PurchaseList,
    title: 'Compras',
    requiredPermissions: ['purchases.view'],
  },
  {
    path: '/purchases/new',
    component: PurchaseCreate,
    title: 'Nueva Compra',
    requiredPermissions: ['purchases.create'],
  },
  {
    path: '/purchases/:id',
    component: PurchaseDetail,
    title: 'Detalle de Compra',
    requiredPermissions: ['purchases.view'],
  },

  // Clientes
  {
    path: '/clients',
    component: ClientList,
    title: 'Clientes',
    requiredPermissions: ['clients.view'],
  },
  {
    path: '/clients/new',
    component: ClientCreate,
    title: 'Crear Cliente',
    requiredPermissions: ['clients.create'],
  },
  {
    path: '/clients/:id/edit',
    component: ClientEdit,
    title: 'Editar Cliente',
    requiredPermissions: ['clients.update'],
  },
  {
    path: '/clients/:id',
    component: ClientDetail,
    title: 'Detalle de Cliente',
    requiredPermissions: ['clients.view'],
  },

  // Proveedores
  {
    path: '/suppliers',
    component: SupplierList,
    title: 'Proveedores',
    requiredPermissions: ['suppliers.view'],
  },
  {
    path: '/suppliers/new',
    component: SupplierCreate,
    title: 'Crear Proveedor',
    requiredPermissions: ['suppliers.create'],
  },
  {
    path: '/suppliers/:id/edit',
    component: SupplierEdit,
    title: 'Editar Proveedor',
    requiredPermissions: ['suppliers.update'],
  },
  {
    path: '/suppliers/:id',
    component: SupplierDetail,
    title: 'Detalle de Proveedor',
    requiredPermissions: ['suppliers.view'],
  },

  // Cartera
  {
    path: '/portfolio/receivable',
    component: AccountsReceivable,
    title: 'Cuentas por Cobrar',
    requiredPermissions: ['portfolio.view'],
  },
  {
    path: '/portfolio/payable',
    component: AccountsPayable,
    title: 'Cuentas por Pagar',
    requiredPermissions: ['portfolio.view'],
  },
  {
    path: '/portfolio/payments',
    component: Payments,
    title: 'Pagos',
    requiredPermissions: ['portfolio.view'],
  },
  {
    path: '/portfolio/stats',
    component: PortfolioStats,
    title: 'Estadísticas de Cartera',
    requiredPermissions: ['portfolio.view'],
  },

  // Reportes
  {
    path: '/reports',
    component: ReportsDashboard,
    title: 'Reportes',
    requiredPermissions: ['reports.view'],
  },
  {
    path: '/reports/sales',
    component: SalesReport,
    title: 'Reporte de Ventas',
    requiredPermissions: ['reports.view'],
  },
  {
    path: '/reports/purchases',
    component: PurchasesReport,
    title: 'Reporte de Compras',
    requiredPermissions: ['reports.view'],
  },
  {
    path: '/reports/inventory',
    component: InventoryReport,
    title: 'Reporte de Inventario',
    requiredPermissions: ['reports.view'],
  },
  {
    path: '/reports/financial',
    component: FinancialReport,
    title: 'Reporte Financiero',
    requiredPermissions: ['reports.view'],
  },
  {
    path: '/reports/portfolio',
    component: PortfolioReport,
    title: 'Reporte de Cartera',
    requiredPermissions: ['reports.view'],
  },

  // Configuración
  {
    path: '/settings',
    component: Settings,
    title: 'Configuración',
    requiredRoles: [UserRole.ADMIN],
  },
  {
    path: '/settings/company',
    component: CompanySettings,
    title: 'Configuración de Empresa',
    requiredRoles: [UserRole.ADMIN],
  },
  {
    path: '/settings/taxes',
    component: TaxSettings,
    title: 'Configuración de Impuestos',
    requiredRoles: [UserRole.ADMIN],
  },
  {
    path: '/settings/users',
    component: UserManagement,
    title: 'Gestión de Usuarios',
    requiredRoles: [UserRole.ADMIN],
  },
  {
    path: '/settings/roles',
    component: RoleManagement,
    title: 'Gestión de Roles',
    requiredRoles: [UserRole.ADMIN],
  },
];

/**
 * Mapa de títulos de rutas
 */
export const getRouteTitle = (path: string): string => {
  const route = [...publicRoutes, ...protectedRoutes].find((r) => r.path === path);
  return route?.title || 'POS-ERP System';
};

/**
 * Configuración de navegación para el sidebar
 */
export interface NavItem {
  title: string;
  path: string;
  icon?: string;
  requiredPermissions?: string[];
  requiredRoles?: UserRole[];
  children?: NavItem[];
}

export const navigationConfig: NavItem[] = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: 'dashboard',
  },
  {
    title: 'Productos',
    path: '/products',
    icon: 'inventory',
    requiredPermissions: ['products.view'],
    children: [
      {
        title: 'Lista de Productos',
        path: '/products',
      },
      {
        title: 'Categorías',
        path: '/categories',
      },
    ],
  },
  {
    title: 'Ventas',
    path: '/sales',
    icon: 'shopping_cart',
    requiredPermissions: ['sales.view'],
    children: [
      {
        title: 'Punto de Venta',
        path: '/pos',
        requiredPermissions: ['sales.create'],
      },
      {
        title: 'Lista de Ventas',
        path: '/sales',
      },
    ],
  },
  {
    title: 'Compras',
    path: '/purchases',
    icon: 'shopping_bag',
    requiredPermissions: ['purchases.view'],
  },
  {
    title: 'Clientes',
    path: '/clients',
    icon: 'people',
    requiredPermissions: ['clients.view'],
  },
  {
    title: 'Proveedores',
    path: '/suppliers',
    icon: 'local_shipping',
    requiredPermissions: ['suppliers.view'],
  },
  {
    title: 'Cartera',
    path: '/portfolio',
    icon: 'account_balance_wallet',
    requiredPermissions: ['portfolio.view'],
    children: [
      {
        title: 'Cuentas por Cobrar',
        path: '/portfolio/receivable',
      },
      {
        title: 'Cuentas por Pagar',
        path: '/portfolio/payable',
      },
      {
        title: 'Pagos',
        path: '/portfolio/payments',
      },
      {
        title: 'Estadísticas',
        path: '/portfolio/stats',
      },
    ],
  },
  {
    title: 'Reportes',
    path: '/reports',
    icon: 'assessment',
    requiredPermissions: ['reports.view'],
    children: [
      {
        title: 'Ventas',
        path: '/reports/sales',
      },
      {
        title: 'Compras',
        path: '/reports/purchases',
      },
      {
        title: 'Inventario',
        path: '/reports/inventory',
      },
      {
        title: 'Financiero',
        path: '/reports/financial',
      },
      {
        title: 'Cartera',
        path: '/reports/portfolio',
      },
    ],
  },
  {
    title: 'Configuración',
    path: '/settings',
    icon: 'settings',
    requiredRoles: [UserRole.ADMIN],
    children: [
      {
        title: 'Empresa',
        path: '/settings/company',
      },
      {
        title: 'Impuestos',
        path: '/settings/taxes',
      },
      {
        title: 'Usuarios',
        path: '/settings/users',
      },
      {
        title: 'Roles',
        path: '/settings/roles',
      },
    ],
  },
];
