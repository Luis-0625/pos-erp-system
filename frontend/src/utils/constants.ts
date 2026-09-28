/**
 * Constantes de la aplicación
 */

// API Configuration
export const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api/v1';
export const API_TIMEOUT = 30000; // 30 segundos

// Auth
export const TOKEN_KEY = 'auth_token';
export const USER_KEY = 'user_data';
export const REFRESH_TOKEN_KEY = 'refresh_token';

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

// Roles
export const ROLES = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  CASHIER: 'CASHIER',
  WAREHOUSE: 'WAREHOUSE',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

// Permissions
export const PERMISSIONS = {
  // Products
  PRODUCTS_CREATE: 'products:create',
  PRODUCTS_READ: 'products:read',
  PRODUCTS_UPDATE: 'products:update',
  PRODUCTS_DELETE: 'products:delete',
  
  // Sales
  SALES_CREATE: 'sales:create',
  SALES_READ: 'sales:read',
  SALES_UPDATE: 'sales:update',
  SALES_DELETE: 'sales:delete',
  SALES_CANCEL: 'sales:cancel',
  SALES_REFUND: 'sales:refund',
  
  // Purchases
  PURCHASES_CREATE: 'purchases:create',
  PURCHASES_READ: 'purchases:read',
  PURCHASES_UPDATE: 'purchases:update',
  PURCHASES_DELETE: 'purchases:delete',
  PURCHASES_CANCEL: 'purchases:cancel',
  
  // Clients
  CLIENTS_CREATE: 'clients:create',
  CLIENTS_READ: 'clients:read',
  CLIENTS_UPDATE: 'clients:update',
  CLIENTS_DELETE: 'clients:delete',
  
  // Suppliers
  SUPPLIERS_CREATE: 'suppliers:create',
  SUPPLIERS_READ: 'suppliers:read',
  SUPPLIERS_UPDATE: 'suppliers:update',
  SUPPLIERS_DELETE: 'suppliers:delete',
  
  // Portfolio
  PORTFOLIO_CREATE: 'portfolio:create',
  PORTFOLIO_READ: 'portfolio:read',
  PORTFOLIO_UPDATE: 'portfolio:update',
  PORTFOLIO_DELETE: 'portfolio:delete',
  
  // Reports
  REPORTS_READ: 'reports:read',
  REPORTS_EXPORT: 'reports:export',
  
  // Config
  CONFIG_READ: 'config:read',
  CONFIG_UPDATE: 'config:update',
  
  // Users
  USERS_CREATE: 'users:create',
  USERS_READ: 'users:read',
  USERS_UPDATE: 'users:update',
  USERS_DELETE: 'users:delete',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

// Payment Methods
export const PAYMENT_METHODS = {
  CASH: 'CASH',
  CARD: 'CARD',
  TRANSFER: 'TRANSFER',
  CHECK: 'CHECK',
  CREDIT: 'CREDIT',
  OTHER: 'OTHER',
} as const;

export const PAYMENT_METHOD_LABELS: Record<keyof typeof PAYMENT_METHODS, string> = {
  CASH: 'Efectivo',
  CARD: 'Tarjeta',
  TRANSFER: 'Transferencia',
  CHECK: 'Cheque',
  CREDIT: 'Crédito',
  OTHER: 'Otro',
};

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  PARTIAL: 'PARTIAL',
  PAID: 'PAID',
  OVERDUE: 'OVERDUE',
  CANCELLED: 'CANCELLED',
} as const;

export const PAYMENT_STATUS_LABELS: Record<keyof typeof PAYMENT_STATUS, string> = {
  PENDING: 'Pendiente',
  PARTIAL: 'Parcial',
  PAID: 'Pagado',
  OVERDUE: 'Vencido',
  CANCELLED: 'Cancelado',
};

export const PAYMENT_STATUS_COLORS: Record<keyof typeof PAYMENT_STATUS, string> = {
  PENDING: 'warning',
  PARTIAL: 'info',
  PAID: 'success',
  OVERDUE: 'danger',
  CANCELLED: 'secondary',
};

// Document Status
export const DOCUMENT_STATUS = {
  DRAFT: 'DRAFT',
  ACTIVE: 'ACTIVE',
  CANCELLED: 'CANCELLED',
  REFUNDED: 'REFUNDED',
} as const;

export const DOCUMENT_STATUS_LABELS: Record<keyof typeof DOCUMENT_STATUS, string> = {
  DRAFT: 'Borrador',
  ACTIVE: 'Activo',
  CANCELLED: 'Cancelado',
  REFUNDED: 'Reembolsado',
};

export const DOCUMENT_STATUS_COLORS: Record<keyof typeof DOCUMENT_STATUS, string> = {
  DRAFT: 'secondary',
  ACTIVE: 'success',
  CANCELLED: 'danger',
  REFUNDED: 'warning',
};

// Client Types
export const CLIENT_TYPES = {
  PERSON: 'PERSON',
  COMPANY: 'COMPANY',
} as const;

export const CLIENT_TYPE_LABELS: Record<keyof typeof CLIENT_TYPES, string> = {
  PERSON: 'Persona Natural',
  COMPANY: 'Empresa',
};

// Inventory Movement Types
export const INVENTORY_MOVEMENT_TYPES = {
  ENTRY: 'ENTRY',
  EXIT: 'EXIT',
  ADJUSTMENT: 'ADJUSTMENT',
  TRANSFER: 'TRANSFER',
} as const;

export const INVENTORY_MOVEMENT_TYPE_LABELS: Record<keyof typeof INVENTORY_MOVEMENT_TYPES, string> = {
  ENTRY: 'Entrada',
  EXIT: 'Salida',
  ADJUSTMENT: 'Ajuste',
  TRANSFER: 'Transferencia',
};

// Date Formats
export const DATE_FORMAT = 'DD/MM/YYYY';
export const DATETIME_FORMAT = 'DD/MM/YYYY HH:mm';
export const TIME_FORMAT = 'HH:mm';
export const ISO_DATE_FORMAT = 'YYYY-MM-DD';
export const ISO_DATETIME_FORMAT = 'YYYY-MM-DDTHH:mm:ss';

// Currency
export const CURRENCY_CODE = 'COP';
export const CURRENCY_SYMBOL = '$';
export const DECIMAL_PLACES = 2;

// Validation
export const VALIDATION_RULES = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 100,
  MIN_DESCRIPTION_LENGTH: 3,
  MAX_DESCRIPTION_LENGTH: 500,
  MIN_STOCK: 0,
  MAX_STOCK: 999999,
  MIN_PRICE: 0,
  MAX_PRICE: 999999999,
};

// Regular Expressions
export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[0-9]{7,10}$/,
  NIT: /^[0-9]{9,10}-[0-9]$/,
  DOCUMENT: /^[0-9]{6,10}$/,
  ALPHANUMERIC: /^[a-zA-Z0-9]+$/,
  DECIMAL: /^\d+(\.\d{1,2})?$/,
  BARCODE: /^[0-9]{8,13}$/,
  SKU: /^[A-Z0-9-]{3,20}$/,
};

// Toast Duration
export const TOAST_DURATION = {
  SHORT: 2000,
  MEDIUM: 3000,
  LONG: 5000,
};

// Debounce Delays
export const DEBOUNCE_DELAY = {
  SEARCH: 500,
  INPUT: 300,
  RESIZE: 200,
};

// File Upload
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
export const ALLOWED_DOCUMENT_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

// Chart Colors
export const CHART_COLORS = [
  '#3B82F6', // primary
  '#10B981', // success
  '#F59E0B', // warning
  '#EF4444', // danger
  '#8B5CF6', // purple
  '#EC4899', // pink
  '#14B8A6', // teal
  '#F97316', // orange
];

// Status Active/Inactive
export const STATUS = {
  ACTIVE: true,
  INACTIVE: false,
} as const;

export const STATUS_LABELS: Record<'ACTIVE' | 'INACTIVE', string> = {
  ACTIVE: 'Activo',
  INACTIVE: 'Inactivo',
};

export const STATUS_COLORS: Record<'ACTIVE' | 'INACTIVE', string> = {
  ACTIVE: 'success',
  INACTIVE: 'secondary',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: TOKEN_KEY,
  USER: USER_KEY,
  REFRESH_TOKEN: REFRESH_TOKEN_KEY,
  THEME: 'theme',
  LANGUAGE: 'language',
  SIDEBAR_COLLAPSED: 'sidebar_collapsed',
  TABLE_PREFERENCES: 'table_preferences',
  RECENT_SEARCHES: 'recent_searches',
} as const;

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  
  // Products
  PRODUCTS: '/products',
  PRODUCTS_CREATE: '/products/create',
  PRODUCTS_EDIT: '/products/:id/edit',
  PRODUCTS_DETAIL: '/products/:id',
  CATEGORIES: '/categories',
  
  // Sales
  SALES: '/sales',
  SALES_CREATE: '/sales/create',
  SALES_POS: '/sales/pos',
  SALES_DETAIL: '/sales/:id',
  
  // Purchases
  PURCHASES: '/purchases',
  PURCHASES_CREATE: '/purchases/create',
  PURCHASES_DETAIL: '/purchases/:id',
  
  // Clients
  CLIENTS: '/clients',
  CLIENTS_CREATE: '/clients/create',
  CLIENTS_EDIT: '/clients/:id/edit',
  CLIENTS_DETAIL: '/clients/:id',
  
  // Suppliers
  SUPPLIERS: '/suppliers',
  SUPPLIERS_CREATE: '/suppliers/create',
  SUPPLIERS_EDIT: '/suppliers/:id/edit',
  SUPPLIERS_DETAIL: '/suppliers/:id',
  
  // Portfolio
  PORTFOLIO: '/portfolio',
  ACCOUNTS_RECEIVABLE: '/portfolio/receivable',
  ACCOUNTS_PAYABLE: '/portfolio/payable',
  PAYMENTS: '/portfolio/payments',
  
  // Reports
  REPORTS: '/reports',
  REPORTS_SALES: '/reports/sales',
  REPORTS_PURCHASES: '/reports/purchases',
  REPORTS_INVENTORY: '/reports/inventory',
  REPORTS_FINANCIAL: '/reports/financial',
  
  // Config
  CONFIG: '/config',
  CONFIG_COMPANY: '/config/company',
  CONFIG_TAXES: '/config/taxes',
  CONFIG_USERS: '/config/users',
  
  // Other
  PROFILE: '/profile',
  NOT_FOUND: '/404',
} as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];
