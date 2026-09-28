# 🏗️ Arquitectura Frontend - Sistema POS ERP

## 📋 Índice
1. [Visión General](#visión-general)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Estructura de Directorios](#estructura-de-directorios)
4. [Arquitectura por Capas](#arquitectura-por-capas)
5. [Módulos del Sistema](#módulos-del-sistema)
6. [Componentes Reutilizables](#componentes-reutilizables)
7. [Gestión de Estado (Redux)](#gestión-de-estado-redux)
8. [Routing y Navegación](#routing-y-navegación)
9. [Patrones de Diseño](#patrones-de-diseño)
10. [Plan de Implementación](#plan-de-implementación)

---

## 🎯 Visión General

### Objetivo
Construir una aplicación frontend moderna, escalable y mantenible que consuma la API REST del backend y proporcione una experiencia de usuario fluida para gestionar todas las operaciones del negocio.

### Principios de Diseño
- **Componentes Reutilizables**: DRY (Don't Repeat Yourself)
- **Single Responsibility**: Cada componente tiene una única responsabilidad
- **Composición sobre Herencia**: Componentes pequeños y componibles
- **Tipado Fuerte**: TypeScript en toda la aplicación
- **Performance First**: Lazy loading, code splitting, optimizaciones
- **Mobile First**: Diseño responsive desde mobile hacia desktop
- **Accesibilidad**: WCAG 2.1 nivel AA como mínimo

---

## 🛠 Stack Tecnológico

### Core
- **React 18.2** - Biblioteca de UI con Concurrent Features
- **TypeScript 5.3** - Tipado estático
- **Vite 5.0** - Build tool y dev server ultra-rápido

### State Management
- **Redux Toolkit 2.0** - Gestión de estado global
- **React Redux 9.0** - Bindings de React para Redux
- **RTK Query** (opcional) - Data fetching y caching

### Routing
- **React Router DOM 6.20** - Navegación declarativa

### Styling
- **TailwindCSS 3.4** - Utility-first CSS framework
- **PostCSS + Autoprefixer** - Procesamiento CSS
- **Lucide React** - Iconos modernos

### Forms & Validation
- **React Hook Form 7.49** - Gestión de formularios performante
- **Zod 3.22** - Validación de esquemas TypeScript-first
- **@hookform/resolvers** - Integración Zod + React Hook Form

### Data Fetching
- **Axios 1.6** - Cliente HTTP con interceptors

### Charts & Visualization
- **Recharts 2.10** - Gráficos y visualizaciones

### Utilities
- **date-fns 3.0** - Manipulación de fechas (lightweight)
- **clsx + tailwind-merge** - Merge condicional de clases CSS
- **react-hot-toast** - Notificaciones toast

---

## 📁 Estructura de Directorios

```
frontend/src/
├── assets/               # Recursos estáticos (imágenes, fuentes, etc.)
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── components/           # Componentes reutilizables
│   ├── ui/              # Componentes UI básicos (Button, Input, Card, etc.)
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   └── Button.test.tsx
│   │   ├── Input/
│   │   ├── Card/
│   │   ├── Modal/
│   │   ├── Table/
│   │   ├── Badge/
│   │   ├── Alert/
│   │   ├── Spinner/
│   │   ├── Tooltip/
│   │   ├── Dropdown/
│   │   └── index.ts
│   │
│   ├── forms/           # Componentes de formularios específicos
│   │   ├── FormInput/
│   │   ├── FormSelect/
│   │   ├── FormTextarea/
│   │   ├── FormCheckbox/
│   │   ├── FormDatePicker/
│   │   └── index.ts
│   │
│   ├── layout/          # Componentes de layout
│   │   ├── MainLayout/
│   │   │   ├── MainLayout.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   ├── AuthLayout/
│   │   └── index.ts
│   │
│   ├── charts/          # Componentes de gráficos
│   │   ├── LineChart/
│   │   ├── BarChart/
│   │   ├── PieChart/
│   │   └── index.ts
│   │
│   └── common/          # Componentes comunes de negocio
│       ├── SearchBar/
│       ├── Pagination/
│       ├── DataTable/
│       ├── ConfirmDialog/
│       ├── EmptyState/
│       └── index.ts
│
├── pages/               # Páginas de la aplicación
│   ├── auth/           # Autenticación
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   └── ForgotPassword.tsx
│   │
│   ├── dashboard/      # Dashboard principal
│   │   ├── Dashboard.tsx
│   │   ├── components/
│   │   │   ├── StatsCard.tsx
│   │   │   ├── RecentSales.tsx
│   │   │   └── QuickActions.tsx
│   │   └── index.ts
│   │
│   ├── products/       # Módulo de productos
│   │   ├── ProductList.tsx
│   │   ├── ProductCreate.tsx
│   │   ├── ProductEdit.tsx
│   │   ├── ProductDetails.tsx
│   │   ├── CategoryList.tsx
│   │   ├── CategoryForm.tsx
│   │   └── components/
│   │       ├── ProductCard.tsx
│   │       ├── ProductFilters.tsx
│   │       └── StockAlert.tsx
│   │
│   ├── sales/          # Módulo de ventas
│   │   ├── SaleList.tsx
│   │   ├── SaleCreate.tsx
│   │   ├── SaleDetails.tsx
│   │   ├── POS.tsx      # Punto de Venta
│   │   └── components/
│   │       ├── POSCart.tsx
│   │       ├── ProductSelector.tsx
│   │       ├── PaymentModal.tsx
│   │       └── InvoicePrint.tsx
│   │
│   ├── purchases/      # Módulo de compras
│   │   ├── PurchaseList.tsx
│   │   ├── PurchaseCreate.tsx
│   │   ├── PurchaseDetails.tsx
│   │   └── components/
│   │       ├── PurchaseForm.tsx
│   │       └── PurchaseFilters.tsx
│   │
│   ├── clients/        # Módulo de clientes
│   │   ├── ClientList.tsx
│   │   ├── ClientCreate.tsx
│   │   ├── ClientEdit.tsx
│   │   ├── ClientDetails.tsx
│   │   └── components/
│   │       ├── ClientCard.tsx
│   │       └── ClientHistory.tsx
│   │
│   ├── suppliers/      # Módulo de proveedores
│   │   ├── SupplierList.tsx
│   │   ├── SupplierCreate.tsx
│   │   ├── SupplierEdit.tsx
│   │   ├── SupplierDetails.tsx
│   │   └── components/
│   │       └── SupplierCard.tsx
│   │
│   ├── portfolio/      # Módulo de cartera
│   │   ├── AccountsReceivable.tsx
│   │   ├── AccountsPayable.tsx
│   │   ├── PaymentList.tsx
│   │   ├── PaymentCreate.tsx
│   │   ├── CashFlow.tsx
│   │   └── components/
│   │       ├── AccountCard.tsx
│   │       ├── PaymentCalendar.tsx
│   │       └── AgingReport.tsx
│   │
│   ├── reports/        # Módulo de reportes
│   │   ├── ReportList.tsx
│   │   ├── SalesReport.tsx
│   │   ├── InventoryReport.tsx
│   │   ├── FinancialReport.tsx
│   │   ├── ProfitLossReport.tsx
│   │   └── components/
│   │       ├── ReportFilters.tsx
│   │       ├── ReportExport.tsx
│   │       └── ReportChart.tsx
│   │
│   ├── config/         # Configuración
│   │   ├── CompanySettings.tsx
│   │   ├── TaxRates.tsx
│   │   ├── UserManagement.tsx
│   │   └── SystemSettings.tsx
│   │
│   └── errors/         # Páginas de error
│       ├── NotFound.tsx
│       ├── Unauthorized.tsx
│       └── ServerError.tsx
│
├── services/           # Servicios de API
│   ├── api.service.ts           # Cliente HTTP base (Axios)
│   ├── auth.service.ts          # Autenticación
│   ├── product.service.ts       # Productos
│   ├── category.service.ts      # Categorías
│   ├── sale.service.ts          # Ventas
│   ├── purchase.service.ts      # Compras
│   ├── client.service.ts        # Clientes
│   ├── supplier.service.ts      # Proveedores
│   ├── portfolio.service.ts     # Cartera
│   ├── report.service.ts        # Reportes
│   ├── config.service.ts        # Configuración
│   └── index.ts
│
├── store/              # Redux store
│   ├── index.ts                 # Configuración del store
│   ├── hooks.ts                 # Hooks tipados (useAppDispatch, useAppSelector)
│   │
│   └── slices/                  # Redux slices
│       ├── authSlice.ts         # ✅ Ya existe
│       ├── uiSlice.ts           # ✅ Ya existe
│       ├── productSlice.ts      # Productos e inventario
│       ├── saleSlice.ts         # Ventas y POS
│       ├── purchaseSlice.ts     # Compras
│       ├── clientSlice.ts       # Clientes
│       ├── supplierSlice.ts     # Proveedores
│       ├── portfolioSlice.ts    # Cartera
│       ├── reportSlice.ts       # Reportes
│       └── configSlice.ts       # Configuración
│
├── hooks/              # Custom hooks
│   ├── useAuth.ts              # Hook de autenticación
│   ├── useDebounce.ts          # Debounce para búsquedas
│   ├── useLocalStorage.ts      # Persistencia local
│   ├── usePagination.ts        # Paginación
│   ├── useSort.ts              # Ordenamiento
│   ├── useFilters.ts           # Filtros
│   ├── useModal.ts             # Gestión de modales
│   ├── useToast.ts             # Notificaciones
│   └── index.ts
│
├── utils/              # Utilidades
│   ├── constants.ts            # Constantes globales
│   ├── formatters.ts           # Formateadores (moneda, fecha, etc.)
│   ├── validators.ts           # Validadores custom
│   ├── helpers.ts              # Funciones helper
│   ├── permissions.ts          # Lógica de permisos
│   └── cn.ts                   # clsx + tailwind-merge
│
├── types/              # Tipos TypeScript
│   ├── index.ts                # ✅ Ya existe (tipos compartidos)
│   ├── api.types.ts            # Tipos de respuestas API
│   ├── form.types.ts           # Tipos de formularios
│   └── store.types.ts          # Tipos de Redux
│
├── routes/             # Configuración de rutas
│   ├── index.tsx               # Rutas principales
│   ├── ProtectedRoute.tsx      # HOC para rutas protegidas
│   └── RoleRoute.tsx           # HOC para rutas por rol
│
├── config/             # Configuración
│   ├── env.ts                  # Variables de entorno
│   └── api.config.ts           # Configuración API
│
├── App.tsx             # ✅ Ya existe - Componente principal
├── main.tsx            # Entry point
└── index.css           # Estilos globales
```

---

## 🏛 Arquitectura por Capas

### 1. Capa de Presentación (UI)
**Responsabilidad**: Renderizar UI y manejar interacciones del usuario

**Componentes**:
- Páginas (`pages/`)
- Componentes de UI (`components/ui/`)
- Componentes de layout (`components/layout/`)

**Principios**:
- Componentes presentacionales puros (sin lógica de negocio)
- Reciben datos via props
- Emiten eventos via callbacks
- Altamente reutilizables

### 2. Capa de Lógica de Negocio (Business Logic)
**Responsabilidad**: Gestión de estado y lógica de negocio

**Componentes**:
- Redux Slices (`store/slices/`)
- Custom Hooks (`hooks/`)
- Utilidades (`utils/`)

**Principios**:
- Estado global en Redux (auth, datos compartidos)
- Estado local en React (UI temporal)
- Custom hooks para lógica reutilizable
- Validaciones con Zod

### 3. Capa de Servicios (API Layer)
**Responsabilidad**: Comunicación con el backend

**Componentes**:
- Servicios API (`services/`)
- Cliente HTTP (Axios)
- Interceptors

**Principios**:
- Un servicio por módulo de backend
- Manejo centralizado de errores
- Interceptors para autenticación
- Tipos TypeScript para todas las respuestas

---

## 📦 Módulos del Sistema

### 1. Módulo de Autenticación

**Páginas**:
- `Login.tsx` - Página de inicio de sesión
- `Register.tsx` - Registro de usuarios (admin)
- `ForgotPassword.tsx` - Recuperación de contraseña

**Redux Slice**: `authSlice.ts` ✅ Ya existe

**Servicios**: `auth.service.ts` ✅ Ya existe

**Funcionalidades**:
- Login con email/password
- Logout
- Refresh token automático
- Persistencia de sesión
- Cambio de contraseña
- Gestión de permisos

---

### 2. Módulo de Dashboard

**Página Principal**: `Dashboard.tsx`

**Componentes**:
- `StatsCard.tsx` - Tarjetas de estadísticas (ventas, inventario, etc.)
- `RecentSales.tsx` - Lista de ventas recientes
- `QuickActions.tsx` - Acciones rápidas (nueva venta, nuevo producto)
- Gráficos de ventas, inventario, cartera

**Redux Slice**: `uiSlice.ts` ✅ Ya existe (para UI global)

**Servicios**: Combina datos de varios servicios (sales, products, portfolio)

**Funcionalidades**:
- Resumen de ventas del día/mes
- Alertas de stock bajo
- Cuentas por cobrar vencidas
- Productos más vendidos
- Gráficos interactivos

---

### 3. Módulo de Productos

**Páginas**:
- `ProductList.tsx` - Lista de productos con filtros y búsqueda
- `ProductCreate.tsx` - Formulario de creación
- `ProductEdit.tsx` - Formulario de edición
- `ProductDetails.tsx` - Vista detallada con historial
- `CategoryList.tsx` - Gestión de categorías
- `CategoryForm.tsx` - Crear/editar categorías

**Componentes**:
- `ProductCard.tsx` - Tarjeta de producto
- `ProductFilters.tsx` - Filtros avanzados (categoría, precio, stock)
- `StockAlert.tsx` - Alerta de stock bajo

**Redux Slice**: `productSlice.ts`

```typescript
interface ProductState {
  products: Product[];
  categories: Category[];
  selectedProduct: Product | null;
  filters: ProductFilters;
  isLoading: boolean;
  error: string | null;
  pagination: PaginationState;
}
```

**Servicios**: 
- `product.service.ts`
- `category.service.ts`

**Funcionalidades**:
- CRUD completo de productos
- CRUD de categorías
- Búsqueda en tiempo real
- Filtros múltiples
- Importación/exportación CSV
- Gestión de imágenes
- Control de stock

---

### 4. Módulo de Ventas (Sales + POS)

**Páginas**:
- `POS.tsx` - Punto de venta (interfaz principal de ventas)
- `SaleList.tsx` - Lista de ventas
- `SaleCreate.tsx` - Crear venta (forma clásica)
- `SaleDetails.tsx` - Detalles de venta con opción de anular/devolver

**Componentes**:
- `POSCart.tsx` - Carrito de compras
- `ProductSelector.tsx` - Selector de productos
- `PaymentModal.tsx` - Modal de pago (múltiples métodos)
- `InvoicePrint.tsx` - Componente de impresión

**Redux Slice**: `saleSlice.ts`

```typescript
interface SaleState {
  sales: Sale[];
  currentSale: {
    items: SaleItem[];
    client: Client | null;
    paymentMethod: PaymentMethod;
    discount: number;
    total: number;
  };
  isProcessing: boolean;
  error: string | null;
}
```

**Servicios**: `sale.service.ts`

**Funcionalidades**:
- POS táctil y responsive
- Búsqueda rápida de productos (barcode/nombre)
- Carrito con cantidades y descuentos
- Múltiples métodos de pago
- Impresión de tickets
- Historial de ventas
- Anulaciones y devoluciones

---

### 5. Módulo de Compras

**Páginas**:
- `PurchaseList.tsx` - Lista de compras
- `PurchaseCreate.tsx` - Registrar nueva compra
- `PurchaseDetails.tsx` - Detalles de compra

**Componentes**:
- `PurchaseForm.tsx` - Formulario de compra
- `PurchaseFilters.tsx` - Filtros de búsqueda

**Redux Slice**: `purchaseSlice.ts`

```typescript
interface PurchaseState {
  purchases: Purchase[];
  selectedPurchase: Purchase | null;
  isLoading: boolean;
  error: string | null;
}
```

**Servicios**: `purchase.service.ts`

**Funcionalidades**:
- Registrar compras a proveedores
- Actualización automática de inventario
- Gestión de cuentas por pagar
- Historial de compras por proveedor

---

### 6. Módulo de Clientes

**Páginas**:
- `ClientList.tsx` - Lista de clientes
- `ClientCreate.tsx` - Crear cliente
- `ClientEdit.tsx` - Editar cliente
- `ClientDetails.tsx` - Perfil completo con historial de compras

**Componentes**:
- `ClientCard.tsx` - Tarjeta de cliente
- `ClientHistory.tsx` - Historial de transacciones

**Redux Slice**: `clientSlice.ts`

**Servicios**: `client.service.ts`

**Funcionalidades**:
- CRUD de clientes
- Gestión de límite de crédito
- Historial de compras
- Estado de cuenta

---

### 7. Módulo de Proveedores

**Páginas**:
- `SupplierList.tsx` - Lista de proveedores
- `SupplierCreate.tsx` - Crear proveedor
- `SupplierEdit.tsx` - Editar proveedor
- `SupplierDetails.tsx` - Perfil con historial de compras

**Componentes**:
- `SupplierCard.tsx` - Tarjeta de proveedor

**Redux Slice**: `supplierSlice.ts`

**Servicios**: `supplier.service.ts`

**Funcionalidades**:
- CRUD de proveedores
- Historial de compras
- Cuentas por pagar

---

### 8. Módulo de Cartera

**Páginas**:
- `AccountsReceivable.tsx` - Cuentas por cobrar
- `AccountsPayable.tsx` - Cuentas por pagar
- `PaymentList.tsx` - Lista de pagos
- `PaymentCreate.tsx` - Registrar pago
- `CashFlow.tsx` - Flujo de caja

**Componentes**:
- `AccountCard.tsx` - Tarjeta de cuenta
- `PaymentCalendar.tsx` - Calendario de pagos
- `AgingReport.tsx` - Reporte de antigüedad de saldos

**Redux Slice**: `portfolioSlice.ts`

```typescript
interface PortfolioState {
  accountsReceivable: AccountReceivable[];
  accountsPayable: AccountPayable[];
  payments: Payment[];
  cashFlow: CashFlowData;
  stats: PortfolioStats;
  isLoading: boolean;
}
```

**Servicios**: `portfolio.service.ts`

**Funcionalidades**:
- Gestión de cuentas por cobrar/pagar
- Registro de pagos
- Calendario de vencimientos
- Análisis de antigüedad
- Flujo de caja
- Recordatorios automáticos

---

### 9. Módulo de Reportes

**Páginas**:
- `ReportList.tsx` - Lista de reportes disponibles
- `SalesReport.tsx` - Reporte de ventas
- `InventoryReport.tsx` - Reporte de inventario
- `FinancialReport.tsx` - Reporte financiero
- `ProfitLossReport.tsx` - Estado de pérdidas y ganancias

**Componentes**:
- `ReportFilters.tsx` - Filtros de fecha y parámetros
- `ReportExport.tsx` - Exportación PDF/Excel
- `ReportChart.tsx` - Gráficos dinámicos

**Redux Slice**: `reportSlice.ts`

**Servicios**: `report.service.ts`

**Funcionalidades**:
- Reportes de ventas (por producto, cliente, fecha)
- Reportes de inventario
- Reportes financieros
- Exportación a PDF/Excel
- Gráficos interactivos
- Filtros avanzados

---

### 10. Módulo de Configuración

**Páginas**:
- `CompanySettings.tsx` - Configuración de empresa
- `TaxRates.tsx` - Gestión de tasas impositivas
- `UserManagement.tsx` - Administración de usuarios
- `SystemSettings.tsx` - Parámetros del sistema

**Redux Slice**: `configSlice.ts`

**Servicios**: `config.service.ts`

**Funcionalidades**:
- Configuración de empresa
- Gestión de impuestos
- Administración de usuarios y roles
- Parámetros del sistema

---

## 🧩 Componentes Reutilizables

### Componentes UI Base (40+ componentes)

#### 1. **Button** (`ui/Button/`)
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
}
```

#### 2. **Input** (`ui/Input/`)
```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  helperText?: string;
}
```

#### 3. **Card** (`ui/Card/`)
```typescript
interface CardProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}
```

#### 4. **Modal** (`ui/Modal/`)
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
}
```

#### 5. **Table** (`ui/Table/`)
```typescript
interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  pagination?: PaginationProps;
  onRowClick?: (row: T) => void;
}
```

#### 6. **Badge** (`ui/Badge/`)
```typescript
interface BadgeProps {
  variant?: 'success' | 'danger' | 'warning' | 'info';
  children: React.ReactNode;
}
```

#### Otros componentes UI:
- Alert
- Spinner/Loader
- Tooltip
- Dropdown/Select
- Checkbox
- Radio
- Switch/Toggle
- Tabs
- Accordion
- Breadcrumb
- Avatar
- Progress Bar
- Skeleton
- Divider

### Componentes de Formularios

#### FormInput, FormSelect, FormTextarea, FormCheckbox, FormDatePicker
- Integrados con React Hook Form
- Validación con Zod
- Estilos consistentes
- Mensajes de error

### Componentes de Layout

#### MainLayout
```typescript
interface MainLayoutProps {
  children: React.ReactNode;
}

// Incluye:
// - Sidebar con navegación
// - Header con usuario y notificaciones
// - Footer
// - Área de contenido principal
```

#### AuthLayout
```typescript
// Layout simple para páginas de autenticación
// - Centrado
// - Logo
// - Sin sidebar/header
```

### Componentes Comunes

#### DataTable
```typescript
// Tabla avanzada con:
// - Ordenamiento
// - Filtros
// - Paginación
// - Búsqueda
// - Acciones por fila
```

#### SearchBar
```typescript
// Barra de búsqueda con:
// - Debounce
// - Icono de búsqueda
// - Clear button
// - Sugerencias (opcional)
```

#### Pagination
```typescript
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}
```

#### ConfirmDialog
```typescript
interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'warning' | 'info';
}
```

#### EmptyState
```typescript
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}
```

---

## 🔄 Gestión de Estado (Redux)

### Configuración del Store

```typescript
// store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import productReducer from './slices/productSlice';
import saleReducer from './slices/saleSlice';
import purchaseReducer from './slices/purchaseSlice';
import clientReducer from './slices/clientSlice';
import supplierReducer from './slices/supplierSlice';
import portfolioReducer from './slices/portfolioSlice';
import reportReducer from './slices/reportSlice';
import configReducer from './slices/configSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,           // ✅ Ya existe
    ui: uiReducer,               // ✅ Ya existe
    products: productReducer,    // Pendiente
    sales: saleReducer,          // Pendiente
    purchases: purchaseReducer,  // Pendiente
    clients: clientReducer,      // Pendiente
    suppliers: supplierReducer,  // Pendiente
    portfolio: portfolioReducer, // Pendiente
    reports: reportReducer,      // Pendiente
    config: configReducer,       // Pendiente
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['auth/login/fulfilled'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### Redux Slices a Implementar

#### 1. productSlice.ts
```typescript
// Estado: productos, categorías, filtros, paginación
// Thunks: fetchProducts, createProduct, updateProduct, deleteProduct
// Thunks: fetchCategories, createCategory, updateCategory
```

#### 2. saleSlice.ts
```typescript
// Estado: ventas, carrito actual POS, estadísticas
// Thunks: fetchSales, createSale, cancelSale, refundSale
// Reducers: addToCart, removeFromCart, updateQuantity, clearCart
```

#### 3. purchaseSlice.ts
```typescript
// Estado: compras, filtros
// Thunks: fetchPurchases, createPurchase, updatePurchase
```

#### 4. clientSlice.ts
```typescript
// Estado: clientes, cliente seleccionado
// Thunks: fetchClients, createClient, updateClient, deleteClient
```

#### 5. supplierSlice.ts
```typescript
// Estado: proveedores, proveedor seleccionado
// Thunks: fetchSuppliers, createSupplier, updateSupplier, deleteSupplier
```

#### 6. portfolioSlice.ts
```typescript
// Estado: cuentas por cobrar/pagar, pagos, estadísticas
// Thunks: fetchAccountsReceivable, fetchAccountsPayable, createPayment
```

#### 7. reportSlice.ts
```typescript
// Estado: reportes generados, filtros, datos de gráficos
// Thunks: fetchSalesReport, fetchInventoryReport, fetchFinancialReport
```

#### 8. configSlice.ts
```typescript
// Estado: configuración de empresa, tasas impositivas
// Thunks: fetchCompanySettings, updateCompanySettings, fetchTaxRates
```

---

## 🛣 Routing y Navegación

### Estructura de Rutas

```typescript
// routes/index.tsx
const AppRoutes = () => (
  <Routes>
    {/* Rutas públicas */}
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />

    {/* Rutas protegidas */}
    <Route element={<ProtectedRoute />}>
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Productos */}
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/new" element={<ProductCreate />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/products/:id/edit" element={<ProductEdit />} />
        <Route path="/categories" element={<CategoryList />} />
        
        {/* Ventas */}
        <Route path="/pos" element={<POS />} />
        <Route path="/sales" element={<SaleList />} />
        <Route path="/sales/:id" element={<SaleDetails />} />
        
        {/* Compras */}
        <Route path="/purchases" element={<PurchaseList />} />
        <Route path="/purchases/new" element={<PurchaseCreate />} />
        <Route path="/purchases/:id" element={<PurchaseDetails />} />
        
        {/* Clientes */}
        <Route path="/clients" element={<ClientList />} />
        <Route path="/clients/new" element={<ClientCreate />} />
        <Route path="/clients/:id" element={<ClientDetails />} />
        <Route path="/clients/:id/edit" element={<ClientEdit />} />
        
        {/* Proveedores */}
        <Route path="/suppliers" element={<SupplierList />} />
        <Route path="/suppliers/new" element={<SupplierCreate />} />
        <Route path="/suppliers/:id" element={<SupplierDetails />} />
        <Route path="/suppliers/:id/edit" element={<SupplierEdit />} />
        
        {/* Cartera */}
        <Route path="/portfolio/receivables" element={<AccountsReceivable />} />
        <Route path="/portfolio/payables" element={<AccountsPayable />} />
        <Route path="/portfolio/payments" element={<PaymentList />} />
        <Route path="/portfolio/cashflow" element={<CashFlow />} />
        
        {/* Reportes */}
        <Route path="/reports" element={<ReportList />} />
        <Route path="/reports/sales" element={<SalesReport />} />
        <Route path="/reports/inventory" element={<InventoryReport />} />
        <Route path="/reports/financial" element={<FinancialReport />} />
        <Route path="/reports/profit-loss" element={<ProfitLossReport />} />
        
        {/* Configuración - Solo Admin */}
        <Route element={<RoleRoute roles={['ADMIN']} />}>
          <Route path="/config/company" element={<CompanySettings />} />
          <Route path="/config/taxes" element={<TaxRates />} />
          <Route path="/config/users" element={<UserManagement />} />
          <Route path="/config/system" element={<SystemSettings />} />
        </Route>
      </Route>
    </Route>

    {/* Rutas de error */}
    <Route path="/unauthorized" element={<Unauthorized />} />
    <Route path="/404" element={<NotFound />} />
    <Route path="*" element={<Navigate to="/404" replace />} />
  </Routes>
);
```

### HOCs de Protección

#### ProtectedRoute
```typescript
// Verifica autenticación
// Redirige a /login si no está autenticado
```

#### RoleRoute
```typescript
// Verifica roles específicos
// Redirige a /unauthorized si no tiene permisos
```

---

## 🎨 Patrones de Diseño

### 1. Container/Presentational Pattern
- **Container**: Lógica y estado (hooks, Redux)
- **Presentational**: UI pura (props, callbacks)

### 2. Compound Components Pattern
```typescript
// Ejemplo: Modal con subcomponentes
<Modal isOpen={isOpen} onClose={onClose}>
  <Modal.Header>Título</Modal.Header>
  <Modal.Body>Contenido</Modal.Body>
  <Modal.Footer>Acciones</Modal.Footer>
</Modal>
```

### 3. Render Props Pattern
```typescript
// Para componentes que comparten lógica
<DataFetcher url="/api/products">
  {({ data, loading, error }) => (
    // Render UI
  )}
</DataFetcher>
```

### 4. Custom Hooks Pattern
```typescript
// Encapsular lógica reutilizable
const useProducts = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector(state => state.products.items);
  
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);
  
  return { products };
};
```

### 5. HOC Pattern
```typescript
// Envolver componentes con lógica adicional
const withAuth = (Component) => {
  return (props) => {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) return <Navigate to="/login" />;
    return <Component {...props} />;
  };
};
```

---

## 📋 Plan de Implementación

### Fase 1: Infraestructura Base (Semana 1)
- [ ] Crear todos los servicios API (`services/`)
- [ ] Implementar Redux slices faltantes (`store/slices/`)
- [ ] Crear custom hooks base (`hooks/`)
- [ ] Implementar utilidades (`utils/`)
- [ ] Configurar rutas protegidas (`routes/`)

### Fase 2: Sistema de Diseño (Semana 1-2)
- [ ] Crear componentes UI base (Button, Input, Card, Modal, Table, etc.)
- [ ] Crear componentes de formularios
- [ ] Crear componentes de layout (MainLayout, AuthLayout)
- [ ] Crear componentes comunes (DataTable, SearchBar, Pagination)

### Fase 3: Módulos Core (Semana 2-3)
- [ ] Implementar páginas de autenticación (Login, Register)
- [ ] Implementar Dashboard principal
- [ ] Implementar módulo de Productos completo
- [ ] Implementar módulo de Clientes completo

### Fase 4: Módulos Operacionales (Semana 3-4)
- [ ] Implementar módulo de Ventas + POS
- [ ] Implementar módulo de Compras
- [ ] Implementar módulo de Proveedores

### Fase 5: Módulos Financieros (Semana 4-5)
- [ ] Implementar módulo de Cartera (Cuentas por cobrar/pagar)
- [ ] Implementar módulo de Reportes
- [ ] Implementar módulo de Configuración

### Fase 6: Optimización y Testing (Semana 5-6)
- [ ] Code splitting y lazy loading
- [ ] Optimización de performance
- [ ] Tests unitarios de componentes
- [ ] Tests de integración
- [ ] Pruebas de accesibilidad

---

## 🔍 Consideraciones Técnicas

### Performance
- **Code Splitting**: Lazy loading de páginas con `React.lazy()`
- **Memoization**: `React.memo()`, `useMemo()`, `useCallback()`
- **Virtual Scrolling**: Para listas largas (react-window)
- **Optimistic Updates**: Actualizar UI antes de respuesta del servidor

### Seguridad
- **Sanitización**: Sanitizar inputs del usuario
- **XSS Protection**: Evitar dangerouslySetInnerHTML
- **CSRF Protection**: Tokens en formularios críticos
- **Sensitive Data**: No exponer tokens en console.log

### Accesibilidad
- **Semantic HTML**: Usar tags semánticos
- **ARIA Labels**: Agregar atributos ARIA donde sea necesario
- **Keyboard Navigation**: Navegación completa con teclado
- **Focus Management**: Gestión adecuada del foco
- **Color Contrast**: Mínimo WCAG AA (4.5:1)

### SEO (si aplica)
- **Meta Tags**: Títulos y descripciones dinámicas
- **React Helmet**: Gestión de meta tags
- **Server-Side Rendering**: Considerar Next.js si se requiere SEO

---

## 📊 Métricas de Éxito

### Técnicas
- Bundle size < 500KB (gzipped)
- First Contentful Paint < 1.5s
- Time to Interactive < 3s
- Lighthouse Score > 90

### Funcionales
- 30+ páginas implementadas
- 40+ componentes reutilizables
- 8 Redux slices funcionando
- 10 servicios API integrados
- 100% de rutas protegidas

---

## 🎯 Próximos Pasos

1. **Revisar y aprobar** esta arquitectura
2. **Priorizar** módulos según necesidad de negocio
3. **Crear tareas detalladas** por módulo
4. **Iniciar implementación** siguiendo el plan por fases
5. **Iterar** basado en feedback

---

## 📚 Recursos y Referencias

- [React Documentation](https://react.dev)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org)
- [TailwindCSS Documentation](https://tailwindcss.com)
- [React Hook Form](https://react-hook-form.com)
- [Zod Documentation](https://zod.dev)
- [Recharts Documentation](https://recharts.org)
