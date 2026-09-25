// Tipos de usuario y autenticación
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  permissions: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  CASHIER = 'cashier',
  WAREHOUSE = 'warehouse',
  ACCOUNTANT = 'accountant',
  SELLER = 'seller',
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
}

// Tipos de respuestas de API
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Tipos de productos
export interface Product {
  id: number;
  sku: string;
  name: string;
  description?: string;
  categoryId: number;
  category?: Category;
  price: number;
  cost: number;
  stock: number;
  minStock: number;
  maxStock: number;
  barcode?: string;
  image?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  parentId?: number;
  isActive: boolean;
}

// Tipos de clientes
export interface Client {
  id: number;
  code: string;
  type: ClientType;
  documentType: string;
  documentNumber: string;
  firstName?: string;
  lastName?: string;
  businessName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  creditLimit: number;
  currentBalance: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export enum ClientType {
  INDIVIDUAL = 'individual',
  BUSINESS = 'business',
}

// Tipos de ventas
export interface Sale {
  id: number;
  invoiceNumber: string;
  clientId?: number;
  client?: Client;
  userId: number;
  user?: User;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  notes?: string;
  items: SaleItem[];
  createdAt: string;
  updatedAt: string;
}

export interface SaleItem {
  id: number;
  saleId: number;
  productId: number;
  product?: Product;
  quantity: number;
  unitPrice: number;
  discount: number;
  subtotal: number;
  tax: number;
  total: number;
}

export enum PaymentMethod {
  CASH = 'cash',
  CARD = 'card',
  TRANSFER = 'transfer',
  CHECK = 'check',
  CREDIT = 'credit',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PARTIAL = 'partial',
  PAID = 'paid',
  OVERDUE = 'overdue',
  CANCELLED = 'cancelled',
}

// Tipos para cartera (cuentas por cobrar/pagar)
export interface AccountReceivable {
  id: number;
  invoiceNumber: string;
  clientId: number;
  client?: Client;
  amount: number;
  balance: number;
  dueDate: string;
  status: PaymentStatus;
  notes?: string;
  payments: Payment[];
  createdAt: string;
  updatedAt: string;
}

export interface AccountPayable {
  id: number;
  invoiceNumber: string;
  supplierId: number;
  supplier?: Supplier;
  amount: number;
  balance: number;
  dueDate: string;
  status: PaymentStatus;
  notes?: string;
  payments: Payment[];
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: number;
  amount: number;
  paymentMethod: PaymentMethod;
  reference?: string;
  notes?: string;
  paymentDate: string;
  createdAt: string;
}

// Tipos de proveedores
export interface Supplier {
  id: number;
  code: string;
  businessName: string;
  documentType: string;
  documentNumber: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  contactName?: string;
  paymentTerms?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Tipos de compras
export interface Purchase {
  id: number;
  invoiceNumber: string;
  supplierId: number;
  supplier?: Supplier;
  userId: number;
  user?: User;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  status: DocumentStatus;
  notes?: string;
  items: PurchaseItem[];
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseItem {
  id: number;
  purchaseId: number;
  productId: number;
  product?: Product;
  quantity: number;
  unitCost: number;
  discount: number;
  subtotal: number;
  tax: number;
  total: number;
}

export enum DocumentStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
}

// Tipos de inventario
export interface InventoryMovement {
  id: number;
  productId: number;
  product?: Product;
  type: InventoryMovementType;
  quantity: number;
  reference?: string;
  notes?: string;
  userId: number;
  user?: User;
  createdAt: string;
}

export enum InventoryMovementType {
  ENTRY = 'entry',
  EXIT = 'exit',
  ADJUSTMENT = 'adjustment',
  TRANSFER = 'transfer',
}

// Tipos de filtros
export interface QueryFilters {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'ASC' | 'DESC';
  search?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  [key: string]: any;
}

// Tipos de Dashboard
export interface DashboardStats {
  totalSales: number;
  totalRevenue: number;
  totalOrders: number;
  totalClients: number;
  revenueChange: number;
  salesChange: number;
  ordersChange: number;
  clientsChange: number;
}

export interface ChartData {
  date: string;
  value: number;
  label?: string;
}
