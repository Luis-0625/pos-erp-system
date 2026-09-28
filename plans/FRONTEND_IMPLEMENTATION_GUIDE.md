# Guía de Implementación Frontend - Sistema POS ERP

## 📋 Índice
1. [Fase 1: Infraestructura Base](#fase-1-infraestructura-base)
2. [Fase 2: Design System](#fase-2-design-system)
3. [Fase 3: Módulos de Negocio](#fase-3-módulos-de-negocio)
4. [Fase 4: Optimización](#fase-4-optimización)
5. [Fase 5: Testing](#fase-5-testing)
6. [Fase 6: Documentación](#fase-6-documentación)

---

## Fase 1: Infraestructura Base

### 1.1 Servicios API (9 archivos)

#### 📁 `src/services/product.service.ts`
```typescript
class ProductService {
  async getProducts(filters?: QueryFilters): Promise<PaginatedResponse<Product>>
  async getProductById(id: number): Promise<Product>
  async getProductBySku(sku: string): Promise<Product>
  async createProduct(data: CreateProductDTO): Promise<Product>
  async updateProduct(id: number, data: UpdateProductDTO): Promise<Product>
  async deleteProduct(id: number): Promise<void>
  async updateStock(id: number, quantity: number, type: 'add' | 'subtract'): Promise<Product>
  async getLowStockProducts(): Promise<Product[]>
  async searchProducts(term: string): Promise<Product[]>
  async getProductStats(): Promise<any>
}
```

#### 📁 `src/services/category.service.ts`
```typescript
class CategoryService {
  async getCategories(filters?: QueryFilters): Promise<PaginatedResponse<Category>>
  async getCategoryById(id: number): Promise<Category>
  async createCategory(data: CreateCategoryDTO): Promise<Category>
  async updateCategory(id: number, data: UpdateCategoryDTO): Promise<Category>
  async deleteCategory(id: number): Promise<void>
  async getCategoryTree(): Promise<Category[]>
}
```

#### 📁 `src/services/sale.service.ts`
```typescript
class SaleService {
  async getSales(filters?: QueryFilters): Promise<PaginatedResponse<Sale>>
  async getSaleById(id: number): Promise<Sale>
  async getSaleByNumber(number: string): Promise<Sale>
  async createSale(data: CreateSaleDTO): Promise<Sale>
  async updateSale(id: number, data: UpdateSaleDTO): Promise<Sale>
  async cancelSale(id: number, reason: string): Promise<Sale>
  async refundSale(id: number, reason: string): Promise<Sale>
  async updatePaymentStatus(id: number, status: PaymentStatus): Promise<Sale>
  async getSaleStats(): Promise<any>
  async getSalesWithPendingPayment(): Promise<Sale[]>
  async searchSales(term: string): Promise<Sale[]>
}
```

#### 📁 `src/services/purchase.service.ts`
```typescript
class PurchaseService {
  async getPurchases(filters?: QueryFilters): Promise<PaginatedResponse<Purchase>>
  async getPurchaseById(id: number): Promise<Purchase>
  async getPurchaseByNumber(number: string): Promise<Purchase>
  async createPurchase(data: CreatePurchaseDTO): Promise<Purchase>
  async updatePurchase(id: number, data: UpdatePurchaseDTO): Promise<Purchase>
  async cancelPurchase(id: number, reason: string): Promise<Purchase>
  async refundPurchase(id: number, reason: string): Promise<Purchase>
  async getPurchaseStats(): Promise<any>
  async searchPurchases(term: string): Promise<Purchase[]>
}
```

#### 📁 `src/services/client.service.ts`
```typescript
class ClientService {
  async getClients(filters?: QueryFilters): Promise<PaginatedResponse<Client>>
  async getClientById(id: number): Promise<Client>
  async getClientByDocument(document: string): Promise<Client>
  async createClient(data: CreateClientDTO): Promise<Client>
  async updateClient(id: number, data: UpdateClientDTO): Promise<Client>
  async deleteClient(id: number): Promise<void>
  async updateBalance(id: number, amount: number, type: 'add' | 'subtract'): Promise<Client>
  async getClientsWithDebt(): Promise<Client[]>
  async searchClients(term: string): Promise<Client[]>
  async getClientStats(): Promise<any>
}
```

#### 📁 `src/services/supplier.service.ts`
```typescript
class SupplierService {
  async getSuppliers(filters?: QueryFilters): Promise<PaginatedResponse<Supplier>>
  async getSupplierById(id: number): Promise<Supplier>
  async createSupplier(data: CreateSupplierDTO): Promise<Supplier>
  async updateSupplier(id: number, data: UpdateSupplierDTO): Promise<Supplier>
  async deleteSupplier(id: number): Promise<void>
  async searchSuppliers(term: string): Promise<Supplier[]>
  async getSupplierStats(): Promise<any>
}
```

#### 📁 `src/services/portfolio.service.ts`
```typescript
class PortfolioService {
  async getAccountsReceivable(filters?: QueryFilters): Promise<PaginatedResponse<AccountReceivable>>
  async getAccountsPayable(filters?: QueryFilters): Promise<PaginatedResponse<AccountPayable>>
  async createPayment(data: CreatePaymentDTO): Promise<Payment>
  async getPayments(filters?: QueryFilters): Promise<PaginatedResponse<Payment>>
  async getOverdueReceivables(): Promise<AccountReceivable[]>
  async getOverduePayables(): Promise<AccountPayable[]>
  async getPortfolioStats(): Promise<any>
  async getCashFlow(days: number): Promise<any>
}
```

#### 📁 `src/services/report.service.ts`
```typescript
class ReportService {
  async getSalesReport(dateRange: DateRange): Promise<any>
  async getSalesByProduct(dateRange: DateRange): Promise<any>
  async getSalesByClient(dateRange: DateRange): Promise<any>
  async getPurchasesReport(dateRange: DateRange): Promise<any>
  async getProfitAndLossReport(dateRange: DateRange): Promise<any>
  async getCashFlowReport(dateRange: DateRange): Promise<any>
  async getInventoryReport(): Promise<any>
  async getDashboardReport(dateRange: DateRange): Promise<any>
}
```

#### 📁 `src/services/config.service.ts`
```typescript
class ConfigService {
  async getCompany(): Promise<Company>
  async updateCompany(data: UpdateCompanyDTO): Promise<Company>
  async getTaxRates(filters?: any): Promise<TaxRate[]>
  async createTaxRate(data: CreateTaxRateDTO): Promise<TaxRate>
  async updateTaxRate(id: number, data: UpdateTaxRateDTO): Promise<TaxRate>
  async deleteTaxRate(id: number): Promise<void>
}
```

---

### 1.2 Redux Slices (8 archivos)

#### 📁 `src/store/slices/productSlice.ts`
```typescript
interface ProductState {
  products: Product[];
  currentProduct: Product | null;
  loading: boolean;
  error: string | null;
  pagination: PaginationInfo;
  filters: QueryFilters;
}

// Async Thunks
export const fetchProducts = createAsyncThunk(...)
export const fetchProductById = createAsyncThunk(...)
export const createProduct = createAsyncThunk(...)
export const updateProduct = createAsyncThunk(...)
export const deleteProduct = createAsyncThunk(...)
export const searchProducts = createAsyncThunk(...)
```

#### 📁 `src/store/slices/categorySlice.ts`
```typescript
interface CategoryState {
  categories: Category[];
  currentCategory: Category | null;
  loading: boolean;
  error: string | null;
  categoryTree: Category[];
}
```

#### 📁 `src/store/slices/saleSlice.ts`
```typescript
interface SaleState {
  sales: Sale[];
  currentSale: Sale | null;
  cart: CartItem[];
  loading: boolean;
  error: string | null;
  pagination: PaginationInfo;
  stats: SaleStats | null;
}

// Incluir acciones para el carrito de POS
export const addToCart = (item: CartItem) => {}
export const removeFromCart = (itemId: number) => {}
export const updateCartQuantity = (itemId: number, quantity: number) => {}
export const clearCart = () => {}
```

#### 📁 `src/store/slices/purchaseSlice.ts`
```typescript
interface PurchaseState {
  purchases: Purchase[];
  currentPurchase: Purchase | null;
  loading: boolean;
  error: string | null;
  pagination: PaginationInfo;
}
```

#### 📁 `src/store/slices/clientSlice.ts`
```typescript
interface ClientState {
  clients: Client[];
  currentClient: Client | null;
  loading: boolean;
  error: string | null;
  pagination: PaginationInfo;
}
```

#### 📁 `src/store/slices/supplierSlice.ts`
```typescript
interface SupplierState {
  suppliers: Supplier[];
  currentSupplier: Supplier | null;
  loading: boolean;
  error: string | null;
  pagination: PaginationInfo;
}
```

#### 📁 `src/store/slices/portfolioSlice.ts`
```typescript
interface PortfolioState {
  accountsReceivable: AccountReceivable[];
  accountsPayable: AccountPayable[];
  payments: Payment[];
  loading: boolean;
  error: string | null;
  stats: PortfolioStats | null;
}
```

#### 📁 `src/store/slices/configSlice.ts`
```typescript
interface ConfigState {
  company: Company | null;
  taxRates: TaxRate[];
  loading: boolean;
  error: string | null;
}
```

---

### 1.3 Custom Hooks (8 archivos)

#### 📁 `src/hooks/useAuth.ts`
```typescript
export const useAuth = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  
  return {
    user,
    isAuthenticated,
    hasRole: (role: UserRole) => user?.role === role,
    hasAnyRole: (roles: UserRole[]) => roles.includes(user?.role),
    canAccess: (permission: string) => true, // Implementar lógica de permisos
  };
};
```

#### 📁 `src/hooks/useDebounce.ts`
```typescript
export const useDebounce = <T>(value: T, delay: number = 500): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  
  return debouncedValue;
};
```

#### 📁 `src/hooks/useLocalStorage.ts`
```typescript
export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });
  
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };
  
  return [storedValue, setValue] as const;
};
```

#### 📁 `src/hooks/usePagination.ts`
```typescript
export const usePagination = (totalItems: number, itemsPerPage: number = 10) => {
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  return {
    currentPage,
    totalPages,
    itemsPerPage,
    setCurrentPage,
    nextPage: () => setCurrentPage(p => Math.min(p + 1, totalPages)),
    prevPage: () => setCurrentPage(p => Math.max(p - 1, 1)),
    goToPage: (page: number) => setCurrentPage(Math.max(1, Math.min(page, totalPages))),
  };
};
```

#### 📁 `src/hooks/usePermissions.ts`
```typescript
export const usePermissions = () => {
  const { user } = useAuth();
  
  return {
    canCreate: (resource: string) => true,
    canRead: (resource: string) => true,
    canUpdate: (resource: string) => true,
    canDelete: (resource: string) => true,
    hasPermission: (permission: string) => true,
  };
};
```

#### 📁 `src/hooks/useForm.ts`
```typescript
export const useForm = <T extends Record<string, any>>(initialValues: T) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  
  const handleChange = (name: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (callback: (values: T) => void) => {
    return (e: React.FormEvent) => {
      e.preventDefault();
      callback(values);
    };
  };
  
  const reset = () => setValues(initialValues);
  
  return { values, errors, handleChange, handleSubmit, reset, setValues, setErrors };
};
```

#### 📁 `src/hooks/useToast.ts`
```typescript
export const useToast = () => {
  return {
    success: (message: string) => {
      // Implementar con biblioteca de toast o custom
    },
    error: (message: string) => {},
    warning: (message: string) => {},
    info: (message: string) => {},
  };
};
```

#### 📁 `src/hooks/useConfirm.ts`
```typescript
export const useConfirm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<ConfirmConfig | null>(null);
  
  const confirm = (options: ConfirmConfig): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfig({ ...options, onConfirm: () => resolve(true), onCancel: () => resolve(false) });
      setIsOpen(true);
    });
  };
  
  return { confirm, isOpen, setIsOpen, config };
};
```

---

### 1.4 Utilidades (6 archivos)

#### 📁 `src/utils/constants.ts`
```typescript
export const APP_NAME = 'POS ERP System';
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
export const DATE_FORMAT = 'DD/MM/YYYY';
export const DATETIME_FORMAT = 'DD/MM/YYYY HH:mm';
export const ITEMS_PER_PAGE = 10;

export const PAYMENT_METHODS = {
  CASH: 'Efectivo',
  CARD: 'Tarjeta',
  TRANSFER: 'Transferencia',
  CHECK: 'Cheque',
  CREDIT: 'Crédito',
};

export const PAYMENT_STATUS = {
  PENDING: 'Pendiente',
  PARTIAL: 'Parcial',
  PAID: 'Pagado',
  OVERDUE: 'Vencido',
  CANCELLED: 'Cancelado',
};

export const USER_ROLES = {
  ADMIN: 'Administrador',
  MANAGER: 'Gerente',
  CASHIER: 'Cajero',
  INVENTORY: 'Inventario',
  ACCOUNTANT: 'Contador',
};
```

#### 📁 `src/utils/formatters.ts`
```typescript
export const formatCurrency = (amount: number, currency: string = 'COP'): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency,
  }).format(amount);
};

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('es-CO').format(value);
};

export const formatDate = (date: Date | string): string => {
  return new Date(date).toLocaleDateString('es-CO');
};

export const formatDateTime = (date: Date | string): string => {
  return new Date(date).toLocaleString('es-CO');
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(2)}%`;
};

export const truncateText = (text: string, maxLength: number): string => {
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};
```

#### 📁 `src/utils/validators.ts`
```typescript
export const isValidEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  const regex = /^\+?[\d\s-()]+$/;
  return regex.test(phone);
};

export const isValidDocument = (doc: string): boolean => {
  return doc.length >= 5 && /^\d+$/.test(doc);
};

export const isValidSKU = (sku: string): boolean => {
  return sku.length >= 3 && /^[A-Z0-9-]+$/.test(sku);
};

export const isPositiveNumber = (value: number): boolean => {
  return !isNaN(value) && value > 0;
};

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const validateRequired = (value: any): string | null => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return 'Este campo es requerido';
  }
  return null;
};

export const validateMinLength = (value: string, min: number): string | null => {
  if (value.length < min) {
    return `Debe tener al menos ${min} caracteres`;
  }
  return null;
};

export const validateMaxLength = (value: string, max: number): string | null => {
  if (value.length > max) {
    return `No puede exceder ${max} caracteres`;
  }
  return null;
};
```

#### 📁 `src/utils/helpers.ts`
```typescript
export const generateSKU = (): string => {
  return `SKU-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`.toUpperCase();
};

export const calculateDiscount = (price: number, discount: number): number => {
  return price * (1 - discount / 100);
};

export const calculateTax = (amount: number, taxRate: number): number => {
  return amount * (taxRate / 100);
};

export const calculateTotal = (subtotal: number, tax: number, discount: number = 0): number => {
  return subtotal + tax - discount;
};

export const groupBy = <T>(array: T[], key: keyof T): Record<string, T[]> => {
  return array.reduce((result, item) => {
    const groupKey = String(item[key]);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {} as Record<string, T[]>);
};

export const sortBy = <T>(array: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] => {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const downloadFile = (data: Blob, filename: string): void => {
  const url = window.URL.createObjectURL(data);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  window.URL.revokeObjectURL(url);
};
```

#### 📁 `src/utils/date-utils.ts`
```typescript
export const isToday = (date: Date | string): boolean => {
  const today = new Date();
  const checkDate = new Date(date);
  return today.toDateString() === checkDate.toDateString();
};

export const isOverdue = (dueDate: Date | string): boolean => {
  return new Date(dueDate) < new Date();
};

export const getDaysUntil = (date: Date | string): number => {
  const today = new Date();
  const targetDate = new Date(date);
  const diffTime = targetDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const getStartOfMonth = (): Date => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
};

export const getEndOfMonth = (): Date => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0);
};

export const getDateRange = (range: 'today' | 'week' | 'month' | 'year'): { start: Date; end: Date } => {
  const end = new Date();
  let start = new Date();
  
  switch (range) {
    case 'today':
      start = new Date(end);
      break;
    case 'week':
      start = addDays(end, -7);
      break;
    case 'month':
      start = addDays(end, -30);
      break;
    case 'year':
      start = addDays(end, -365);
      break;
  }
  
  return { start, end };
};
```

#### 📁 `src/utils/storage.ts`
```typescript
export const storage = {
  set: <T>(key: string, value: T): void => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },
  
  get: <T>(key: string): T | null => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  },
  
  remove: (key: string): void => {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },
  
  clear: (): void => {
    try {
      window.localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },
};
```

---

### 1.5 Sistema de Rutas

#### 📁 `src/routes/index.tsx`
```typescript
import { lazy } from 'react';

// Lazy load de páginas
const Dashboard = lazy(() => import('../pages/Dashboard'));
const ProductList = lazy(() => import('../pages/Products/ProductList'));
const ProductForm = lazy(() => import('../pages/Products/ProductForm'));
// ... más importaciones lazy

export const routes = [
  {
    path: '/',
    element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
    roles: ['ADMIN', 'MANAGER', 'CASHIER'],
  },
  {
    path: '/products',
    element: <ProtectedRoute><ProductList /></ProtectedRoute>,
    roles: ['ADMIN', 'MANAGER', 'INVENTORY'],
  },
  // ... más rutas
];
```

#### 📁 `src/components/ProtectedRoute.tsx`
```typescript
interface Props {
  children: React.ReactNode;
  roles?: UserRole[];
  permission?: string;
}

export const ProtectedRoute: React.FC<Props> = ({ children, roles, permission }) => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (roles && !roles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return <>{children}</>;
};
```

---

## Fase 2: Design System

### 2.1 Componentes Base (15 componentes)

#### Componentes a crear:
1. **Button** - Botones con variantes (primary, secondary, danger, etc.)
2. **Input** - Campos de texto con validación
3. **Select** - Selectores con búsqueda
4. **Checkbox** - Casillas de verificación
5. **Radio** - Botones de radio
6. **Switch** - Interruptores toggle
7. **Textarea** - Áreas de texto
8. **Badge** - Etiquetas de estado
9. **Chip** - Etiquetas removibles
10. **Avatar** - Avatares de usuario
11. **Icon** - Sistema de iconos
12. **Divider** - Separadores
13. **Tooltip** - Tooltips informativos
14. **Spinner** - Indicadores de carga
15. **Progress** - Barras de progreso

#### 📁 Ejemplo: `src/components/ui/Button.tsx`
```typescript
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  onClick,
  type = 'button',
  icon,
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2';
  
  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
    secondary: 'bg-secondary-600 text-white hover:bg-secondary-700 focus:ring-secondary-500',
    danger: 'bg-danger-600 text-white hover:bg-danger-700 focus:ring-danger-500',
    success: 'bg-success-600 text-white hover:bg-success-700 focus:ring-success-500',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    fullWidth && 'w-full',
    (disabled || loading) && 'opacity-50 cursor-not-allowed',
  ].filter(Boolean).join(' ');
  
  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading && <Spinner className="mr-2" size="sm" />}
      {icon && !loading && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};
```

---

### 2.2 Componentes de Layout (8 componentes)

1. **Header** - Encabezado principal con navegación
2. **Sidebar** - Barra lateral con menú
3. **Footer** - Pie de página
4. **PageContainer** - Contenedor de página con padding
5. **Card** - Tarjetas de contenido
6. **Section** - Secciones de página
7. **Grid** - Sistema de grillas
8. **Breadcrumbs** - Migas de pan

#### 📁 `src/components/layout/Sidebar.tsx`
```typescript
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const menuItems = [
    { icon: HomeIcon, label: 'Dashboard', path: '/', roles: ['ADMIN', 'MANAGER', 'CASHIER'] },
    { icon: ShoppingCartIcon, label: 'Ventas', path: '/sales', roles: ['ADMIN', 'MANAGER', 'CASHIER'] },
    { icon: PackageIcon, label: 'Productos', path: '/products', roles: ['ADMIN', 'MANAGER', 'INVENTORY'] },
    { icon: UsersIcon, label: 'Clientes', path: '/clients', roles: ['ADMIN', 'MANAGER'] },
    { icon: TruckIcon, label: 'Compras', path: '/purchases', roles: ['ADMIN', 'MANAGER'] },
    { icon: BuildingIcon, label: 'Proveedores', path: '/suppliers', roles: ['ADMIN', 'MANAGER'] },
    { icon: WalletIcon, label: 'Cartera', path: '/portfolio', roles: ['ADMIN', 'MANAGER', 'ACCOUNTANT'] },
    { icon: ChartBarIcon, label: 'Reportes', path: '/reports', roles: ['ADMIN', 'MANAGER', 'ACCOUNTANT'] },
    { icon: SettingsIcon, label: 'Configuración', path: '/config', roles: ['ADMIN'] },
  ];
  
  const filteredMenu = menuItems.filter(item => 
    item.roles.includes(user?.role || '')
  );
  
  return (
    <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-primary-600">POS ERP</h2>
          <button onClick={onClose} className="md:hidden">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4">
          {filteredMenu.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                onClose();
              }}
              className="flex items-center w-full px-4 py-3 mb-2 text-gray-700 rounded-lg hover:bg-primary-50 hover:text-primary-600 transition-colors"
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </button>
          ))}
        </nav>
        
        <div className="p-4 border-t">
          <div className="flex items-center">
            <Avatar user={user} size="sm" />
            <div className="ml-3">
              <p className="text-sm font-medium">{user?.fullName}</p>
              <p className="text-xs text-gray-500">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
```

---

### 2.3 Componentes de Formularios (10 componentes)

1. **FormField** - Campo de formulario con label y error
2. **FormGroup** - Grupo de campos
3. **SearchBar** - Barra de búsqueda
4. **DatePicker** - Selector de fecha
5. **DateRangePicker** - Selector de rango de fechas
6. **FileUpload** - Subida de archivos
7. **AutoComplete** - Autocompletado
8. **MultiSelect** - Selector múltiple
9. **NumberInput** - Input numérico con controles
10. **CurrencyInput** - Input de moneda

---

### 2.4 Componentes de Datos (8 componentes)

1. **DataTable** - Tabla de datos con ordenamiento y filtros
2. **Pagination** - Paginación de resultados
3. **EmptyState** - Estado vacío
4. **LoadingState** - Estado de carga
5. **ErrorState** - Estado de error
6. **Stats** - Tarjetas de estadísticas
7. **Chart** - Gráficos (usar recharts o similar)
8. **Timeline** - Línea de tiempo

#### 📁 `src/components/data/DataTable.tsx`
```typescript
interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSort?: (key: string) => void;
}

export function DataTable<T extends { id: number | string }>({
  data,
  columns,
  loading = false,
  emptyMessage = 'No hay datos disponibles',
  onRowClick,
  sortBy,
  sortOrder,
  onSort,
}: DataTableProps<T>) {
  if (loading) {
    return <LoadingState />;
  }
  
  if (data.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }
  
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                style={{ width: column.width }}
              >
                {column.sortable ? (
                  <button
                    onClick={() => onSort?.(String(column.key))}
                    className="flex items-center hover:text-gray-700"
                  >
                    {column.header}
                    {sortBy === column.key && (
                      <span className="ml-2">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </button>
                ) : (
                  column.header
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item) => (
            <tr
              key={item.id}
              onClick={() => onRowClick?.(item)}
              className={onRowClick ? 'hover:bg-gray-50 cursor-pointer' : ''}
            >
              {columns.map((column) => (
                <td key={String(column.key)} className="px-6 py-4 whitespace-nowrap">
                  {column.render ? column.render(item) : String(item[column.key as keyof T])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

---

### 2.5 Componentes de Feedback (6 componentes)

1. **Modal** - Modales reutilizables
2. **Toast** - Notificaciones toast
3. **ConfirmDialog** - Diálogos de confirmación
4. **Alert** - Alertas
5. **ErrorBoundary** - Manejo de errores
6. **NotificationBell** - Campana de notificaciones

---

## Fase 3: Módulos de Negocio

### 3.1 Módulo Dashboard

#### Páginas:
- **Dashboard** (`src/pages/Dashboard/index.tsx`)

#### Componentes:
- `StatsCard` - Tarjeta de estadística
- `SalesChart` - Gráfico de ventas
- `RecentSales` - Ventas recientes
- `LowStockAlert` - Alerta de stock bajo
- `PendingPayments` - Pagos pendientes

---

### 3.2 Módulo Productos

#### Páginas:
- `ProductList` - Lista de productos
- `ProductForm` - Crear/editar producto
- `ProductDetail` - Detalle del producto
- `CategoryList` - Lista de categorías
- `CategoryForm` - Crear/editar categoría
- `InventoryMovements` - Movimientos de inventario

#### Componentes:
- `ProductCard` - Tarjeta de producto
- `ProductFilters` - Filtros de productos
- `StockBadge` - Badge de stock
- `CategoryTree` - Árbol de categorías

---

### 3.3 Módulo Ventas

#### Páginas:
- `POSScreen` - Pantalla de punto de venta
- `SaleList` - Lista de ventas
- `SaleDetail` - Detalle de venta
- `InvoicePreview` - Vista previa de factura

#### Componentes:
- `ProductSelector` - Selector de productos para POS
- `Cart` - Carrito de compra
- `PaymentModal` - Modal de pago
- `InvoiceTemplate` - Plantilla de factura

---

### 3.4 Módulo Compras

#### Páginas:
- `PurchaseList` - Lista de compras
- `PurchaseForm` - Crear/editar compra
- `PurchaseDetail` - Detalle de compra
- `PurchaseReceive` - Recepción de compra

---

### 3.5 Módulo Clientes

#### Páginas:
- `ClientList` - Lista de clientes
- `ClientForm` - Crear/editar cliente
- `ClientDetail` - Detalle de cliente
- `ClientHistory` - Historial de transacciones

---

### 3.6 Módulo Proveedores

#### Páginas:
- `SupplierList` - Lista de proveedores
- `SupplierForm` - Crear/editar proveedor
- `SupplierDetail` - Detalle de proveedor
- `SupplierHistory` - Historial de compras

---

### 3.7 Módulo Cartera

#### Páginas:
- `AccountsReceivable` - Cuentas por cobrar
- `AccountsPayable` - Cuentas por pagar
- `PaymentList` - Lista de pagos
- `PaymentForm` - Registrar pago
- `CashFlowReport` - Reporte de flujo de caja

---

### 3.8 Módulo Reportes

#### Páginas:
- `ReportDashboard` - Dashboard de reportes
- `SalesReport` - Reporte de ventas
- `PurchasesReport` - Reporte de compras
- `InventoryReport` - Reporte de inventario
- `FinancialReport` - Reporte financiero
- `CustomReport` - Reporte personalizado

---

### 3.9 Módulo Configuración

#### Páginas:
- `CompanySettings` - Configuración de empresa
- `TaxSettings` - Configuración de impuestos
- `UserManagement` - Gestión de usuarios
- `RoleManagement` - Gestión de roles
- `SystemSettings` - Configuración del sistema

---

## Fase 4: Optimización

### Tareas:
1. Implementar lazy loading de rutas
2. Configurar code splitting por módulos
3. Optimizar imágenes y assets
4. Implementar service workers para PWA
5. Configurar caching de datos
6. Optimizar renders con React.memo
7. Implementar virtualización para listas largas
8. Auditoría de performance con Lighthouse
9. Implementar accesibilidad (WCAG 2.1 AA)
10. Optimizar bundle size

---

## Fase 5: Testing

### Estructura de tests:
```
frontend/src/
├── __tests__/
│   ├── components/
│   ├── hooks/
│   ├── utils/
│   ├── services/
│   └── pages/
```

### Tipos de tests:
1. **Unit Tests** - Componentes, hooks, utils (Jest + React Testing Library)
2. **Integration Tests** - Flujos de usuario (React Testing Library)
3. **E2E Tests** - Flujos completos (Playwright o Cypress)

---

## Fase 6: Documentación

### Documentos a crear:
1. **README.md** - Guía de inicio rápido
2. **CONTRIBUTING.md** - Guía de contribución
3. **ARCHITECTURE.md** - Arquitectura del proyecto
4. **COMPONENTS.md** - Guía de componentes
5. **API_INTEGRATION.md** - Integración con API
6. **DEPLOYMENT.md** - Guía de despliegue
7. **Storybook** - Documentación visual de componentes

---

## Orden Recomendado de Implementación

### Prioridad CRÍTICA (Semana 1-2):
1. ✅ Servicios API (Fase 1.1)
2. ✅ Redux Slices (Fase 1.2)
3. ✅ Custom Hooks (Fase 1.3)
4. ✅ Utilidades (Fase 1.4)
5. ✅ Sistema de rutas (Fase 1.5)

### Prioridad ALTA (Semana 3-4):
6. ✅ Componentes base (Fase 2.1)
7. ✅ Componentes de layout (Fase 2.2)
8. ✅ Componentes de formularios (Fase 2.3)
9. ✅ Componentes de datos (Fase 2.4)
10. ✅ Componentes de feedback (Fase 2.5)

### Prioridad MEDIA (Semana 5-8):
11. ✅ Dashboard (Fase 3.1)
12. ✅ Módulo Productos (Fase 3.2)
13. ✅ Módulo Ventas/POS (Fase 3.3)
14. ✅ Módulo Clientes (Fase 3.5)
15. ✅ Módulo Cartera (Fase 3.7)

### Prioridad NORMAL (Semana 9-12):
16. ✅ Módulo Compras (Fase 3.4)
17. ✅ Módulo Proveedores (Fase 3.6)
18. ✅ Módulo Reportes (Fase 3.8)
19. ✅ Módulo Configuración (Fase 3.9)

### Prioridad BAJA (Semana 13-14):
20. ✅ Optimización (Fase 4)
21. ✅ Testing (Fase 5)
22. ✅ Documentación (Fase 6)

---

## Notas Importantes

### Convenciones de Código:
- **Componentes**: PascalCase (`ProductCard.tsx`)
- **Hooks**: camelCase con prefijo `use` (`useAuth.ts`)
- **Utils**: camelCase (`formatters.ts`)
- **Types**: PascalCase para interfaces (`Product`, `Sale`)
- **CSS**: Usar TailwindCSS utility classes
- **Comentarios**: JSDoc para funciones públicas

### Estructura de Archivos:
```
ComponentName/
├── index.tsx          # Componente principal
├── types.ts           # Tipos TypeScript
├── styles.module.css  # Estilos (si no usa Tailwind)
├── ComponentName.test.tsx  # Tests
└── ComponentName.stories.tsx  # Storybook (opcional)
```

### Git Workflow:
- Crear rama feature por cada módulo: `feature/products-module`
- Commits descriptivos: `feat: add product list page`
- Pull requests para revisión antes de merge a develop

---

## Resumen de Entregables

### Infraestructura (23 archivos):
- 9 servicios API
- 8 Redux slices
- 6 utilidades
- 8 custom hooks
- Sistema de rutas

### Design System (47 componentes):
- 15 componentes base
- 8 componentes de layout
- 10 componentes de formularios
- 8 componentes de datos
- 6 componentes de feedback

### Módulos de Negocio (35+ páginas):
- Dashboard (1 página)
- Productos (6 páginas)
- Ventas (4 páginas)
- Compras (4 páginas)
- Clientes (4 páginas)
- Proveedores (4 páginas)
- Cartera (5 páginas)
- Reportes (6 páginas)
- Configuración (5 páginas)

### Total estimado: ~105 archivos principales + tests + documentación

---

## Checklist de Completitud

- [ ] Todos los servicios API implementados
- [ ] Todos los Redux slices implementados
- [ ] Todos los hooks personalizados creados
- [ ] Todas las utilidades implementadas
- [ ] Sistema de rutas configurado
- [ ] Design system completo
- [ ] Todos los módulos de negocio implementados
- [ ] Optimización de performance
- [ ] Tests unitarios > 80% coverage
- [ ] Documentación completa
- [ ] PWA configurado
- [ ] CI/CD pipeline funcionando

---

**Última actualización**: 2026-09-28
