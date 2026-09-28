# 📋 Plan de Implementación Frontend - Sistema POS ERP

## 🎯 Objetivo
Implementar el frontend completo del sistema POS ERP siguiendo la arquitectura definida en [`ARQUITECTURA_FRONTEND.md`](./ARQUITECTURA_FRONTEND.md).

---

## 📊 Estado Actual

### ✅ Completado (15%)
- Configuración base (Vite, TypeScript, TailwindCSS)
- Redux store con authSlice y uiSlice
- Servicios de API base (auth.service.ts, api.service.ts)
- Tipos TypeScript básicos
- Rutas de ejemplo en App.tsx

### 🔨 Por Implementar (85%)
- 8 Redux slices adicionales
- 10 servicios API adicionales
- 40+ componentes UI reutilizables
- 30+ páginas completas
- Sistema de rutas protegidas
- Custom hooks
- Utilidades y helpers

---

## 🗺️ Roadmap de Implementación

### 📦 FASE 1: Infraestructura Base (Prioridad: CRÍTICA)

#### 1.1 Servicios API
Crear todos los servicios para comunicación con el backend.

**Archivos a crear**:
- ✅ [`frontend/src/services/api.service.ts`](../frontend/src/services/api.service.ts) - Ya existe (cliente base Axios)
- ✅ [`frontend/src/services/auth.service.ts`](../frontend/src/services/auth.service.ts) - Ya existe
- [ ] [`frontend/src/services/product.service.ts`](../frontend/src/services/product.service.ts) - Productos
- [ ] [`frontend/src/services/category.service.ts`](../frontend/src/services/category.service.ts) - Categorías
- [ ] [`frontend/src/services/sale.service.ts`](../frontend/src/services/sale.service.ts) - Ventas
- [ ] [`frontend/src/services/purchase.service.ts`](../frontend/src/services/purchase.service.ts) - Compras
- [ ] [`frontend/src/services/client.service.ts`](../frontend/src/services/client.service.ts) - Clientes
- [ ] [`frontend/src/services/supplier.service.ts`](../frontend/src/services/supplier.service.ts) - Proveedores
- [ ] [`frontend/src/services/portfolio.service.ts`](../frontend/src/services/portfolio.service.ts) - Cartera
- [ ] [`frontend/src/services/report.service.ts`](../frontend/src/services/report.service.ts) - Reportes
- [ ] [`frontend/src/services/config.service.ts`](../frontend/src/services/config.service.ts) - Configuración

**Métodos por servicio** (ejemplo: product.service.ts):
```typescript
- fetchProducts(filters, pagination)
- getProductById(id)
- createProduct(data)
- updateProduct(id, data)
- deleteProduct(id)
- searchProducts(query)
- updateStock(id, quantity, type)
- getProductsByCategory(categoryId)
```

---

#### 1.2 Redux Slices
Implementar los slices de Redux para gestión de estado global.

**Archivos a crear**:
- ✅ [`frontend/src/store/slices/authSlice.ts`](../frontend/src/store/slices/authSlice.ts) - Ya existe
- ✅ [`frontend/src/store/slices/uiSlice.ts`](../frontend/src/store/slices/uiSlice.ts) - Ya existe
- [ ] [`frontend/src/store/slices/productSlice.ts`](../frontend/src/store/slices/productSlice.ts)
- [ ] [`frontend/src/store/slices/saleSlice.ts`](../frontend/src/store/slices/saleSlice.ts)
- [ ] [`frontend/src/store/slices/purchaseSlice.ts`](../frontend/src/store/slices/purchaseSlice.ts)
- [ ] [`frontend/src/store/slices/clientSlice.ts`](../frontend/src/store/slices/clientSlice.ts)
- [ ] [`frontend/src/store/slices/supplierSlice.ts`](../frontend/src/store/slices/supplierSlice.ts)
- [ ] [`frontend/src/store/slices/portfolioSlice.ts`](../frontend/src/store/slices/portfolioSlice.ts)
- [ ] [`frontend/src/store/slices/reportSlice.ts`](../frontend/src/store/slices/reportSlice.ts)
- [ ] [`frontend/src/store/slices/configSlice.ts`](../frontend/src/store/slices/configSlice.ts)

**Actualizar**:
- [ ] [`frontend/src/store/index.ts`](../frontend/src/store/index.ts) - Registrar todos los reducers

---

#### 1.3 Custom Hooks
Crear hooks reutilizables para lógica común.

**Archivos a crear**:
- [ ] [`frontend/src/hooks/useAuth.ts`](../frontend/src/hooks/useAuth.ts) - Autenticación y permisos
- [ ] [`frontend/src/hooks/useDebounce.ts`](../frontend/src/hooks/useDebounce.ts) - Debounce para búsquedas
- [ ] [`frontend/src/hooks/useLocalStorage.ts`](../frontend/src/hooks/useLocalStorage.ts) - Persistencia local
- [ ] [`frontend/src/hooks/usePagination.ts`](../frontend/src/hooks/usePagination.ts) - Lógica de paginación
- [ ] [`frontend/src/hooks/useSort.ts`](../frontend/src/hooks/useSort.ts) - Ordenamiento de listas
- [ ] [`frontend/src/hooks/useFilters.ts`](../frontend/src/hooks/useFilters.ts) - Gestión de filtros
- [ ] [`frontend/src/hooks/useModal.ts`](../frontend/src/hooks/useModal.ts) - Control de modales
- [ ] [`frontend/src/hooks/useToast.ts`](../frontend/src/hooks/useToast.ts) - Notificaciones toast
- [ ] [`frontend/src/hooks/index.ts`](../frontend/src/hooks/index.ts) - Exportaciones

---

#### 1.4 Utilidades
Crear funciones helper y constantes.

**Archivos a crear**:
- [ ] [`frontend/src/utils/constants.ts`](../frontend/src/utils/constants.ts) - Constantes globales
- [ ] [`frontend/src/utils/formatters.ts`](../frontend/src/utils/formatters.ts) - Formateo de moneda, fecha, etc.
- [ ] [`frontend/src/utils/validators.ts`](../frontend/src/utils/validators.ts) - Validadores custom
- [ ] [`frontend/src/utils/helpers.ts`](../frontend/src/utils/helpers.ts) - Funciones helper generales
- [ ] [`frontend/src/utils/permissions.ts`](../frontend/src/utils/permissions.ts) - Lógica de permisos
- [ ] [`frontend/src/utils/cn.ts`](../frontend/src/utils/cn.ts) - Merge de clases CSS (clsx + tailwind-merge)

---

#### 1.5 Sistema de Rutas
Configurar rutas protegidas y navegación.

**Archivos a crear**:
- [ ] [`frontend/src/routes/index.tsx`](../frontend/src/routes/index.tsx) - Configuración principal de rutas
- [ ] [`frontend/src/routes/ProtectedRoute.tsx`](../frontend/src/routes/ProtectedRoute.tsx) - HOC para rutas protegidas
- [ ] [`frontend/src/routes/RoleRoute.tsx`](../frontend/src/routes/RoleRoute.tsx) - HOC para rutas por rol

**Actualizar**:
- [ ] [`frontend/src/App.tsx`](../frontend/src/App.tsx) - Integrar sistema de rutas

---

### 🎨 FASE 2: Sistema de Diseño (Prioridad: ALTA)

#### 2.1 Componentes UI Base (15 componentes)

**Directorio**: `frontend/src/components/ui/`

1. [ ] **Button** - Botón con variantes y estados
2. [ ] **Input** - Input de texto con label y error
3. [ ] **Card** - Contenedor con título y acciones
4. [ ] **Modal** - Modal responsive con overlay
5. [ ] **Table** - Tabla con ordenamiento y selección
6. [ ] **Badge** - Badge de estado (success, danger, etc.)
7. [ ] **Alert** - Alertas de notificación
8. [ ] **Spinner** - Indicadores de carga
9. [ ] **Tooltip** - Tooltips informativos
10. [ ] **Dropdown** - Dropdown/Select personalizado
11. [ ] **Checkbox** - Checkbox estilizado
12. [ ] **Radio** - Radio button estilizado
13. [ ] **Switch** - Toggle switch
14. [ ] **Tabs** - Pestañas de navegación
15. [ ] **Breadcrumb** - Migas de pan

**Componentes adicionales** (25 más):
- [ ] Avatar, Progress Bar, Skeleton, Divider, Accordion
- [ ] Toast, Dialog, Popover, Context Menu, Command
- [ ] Calendar, Date Picker, Time Picker, Range Picker
- [ ] Select Multiple, Combobox, Tag Input, File Upload
- [ ] Slider, Rating, Stepper, Timeline, Empty State

---

#### 2.2 Componentes de Formularios (5 componentes)

**Directorio**: `frontend/src/components/forms/`

- [ ] **FormInput** - Input integrado con React Hook Form
- [ ] **FormSelect** - Select integrado con validación
- [ ] **FormTextarea** - Textarea con contador de caracteres
- [ ] **FormCheckbox** - Checkbox con React Hook Form
- [ ] **FormDatePicker** - Date picker con validación

---

#### 2.3 Componentes de Layout (2 layouts)

**Directorio**: `frontend/src/components/layout/`

1. [ ] **MainLayout** - Layout principal con sidebar
   - [ ] `MainLayout.tsx` - Componente principal
   - [ ] `Sidebar.tsx` - Sidebar de navegación
   - [ ] `Header.tsx` - Header con usuario y notificaciones
   - [ ] `Footer.tsx` - Footer opcional

2. [ ] **AuthLayout** - Layout para autenticación
   - [ ] `AuthLayout.tsx` - Layout simple centrado

---

#### 2.4 Componentes Comunes (8 componentes)

**Directorio**: `frontend/src/components/common/`

- [ ] **SearchBar** - Barra de búsqueda con debounce
- [ ] **Pagination** - Componente de paginación
- [ ] **DataTable** - Tabla avanzada con filtros y ordenamiento
- [ ] **ConfirmDialog** - Dialog de confirmación
- [ ] **EmptyState** - Estado vacío con acción
- [ ] **ErrorBoundary** - Boundary para errores
- [ ] **LoadingOverlay** - Overlay de carga
- [ ] **ImageUpload** - Upload de imágenes con preview

---

#### 2.5 Componentes de Charts (3 componentes)

**Directorio**: `frontend/src/components/charts/`

- [ ] **LineChart** - Gráfico de líneas (Recharts)
- [ ] **BarChart** - Gráfico de barras
- [ ] **PieChart** - Gráfico circular

---

### 📄 FASE 3: Módulos Core (Prioridad: ALTA)

#### 3.1 Módulo de Autenticación (3 páginas)

**Directorio**: `frontend/src/pages/auth/`

- [ ] **Login.tsx** - Página de inicio de sesión
  - Formulario con email y password
  - Validación con Zod
  - Integración con authSlice
  - Recordar sesión
  - Link a recuperar contraseña

- [ ] **Register.tsx** - Registro de usuarios (solo admin)
  - Formulario completo
  - Validación de contraseñas
  - Asignación de roles

- [ ] **ForgotPassword.tsx** - Recuperación de contraseña
  - Formulario de email
  - Envío de token de recuperación

---

#### 3.2 Módulo de Dashboard (1 página + 3 componentes)

**Directorio**: `frontend/src/pages/dashboard/`

- [ ] **Dashboard.tsx** - Dashboard principal
  - Grid de estadísticas
  - Gráficos de ventas
  - Alertas de stock
  - Cuentas por cobrar vencidas
  - Acciones rápidas

**Componentes**:
- [ ] `components/StatsCard.tsx` - Tarjeta de estadística
- [ ] `components/RecentSales.tsx` - Lista de ventas recientes
- [ ] `components/QuickActions.tsx` - Botones de acciones rápidas

---

#### 3.3 Módulo de Productos (6 páginas + 3 componentes)

**Directorio**: `frontend/src/pages/products/`

**Páginas**:
- [ ] **ProductList.tsx** - Lista de productos
  - DataTable con productos
  - Búsqueda en tiempo real
  - Filtros (categoría, precio, stock)
  - Paginación
  - Acciones (ver, editar, eliminar)

- [ ] **ProductCreate.tsx** - Crear producto
  - Formulario completo
  - Upload de imagen
  - Validación con Zod
  - Selección de categoría

- [ ] **ProductEdit.tsx** - Editar producto
  - Formulario pre-llenado
  - Actualización de imagen
  - Historial de cambios

- [ ] **ProductDetails.tsx** - Detalles de producto
  - Información completa
  - Historial de movimientos
  - Estadísticas de ventas
  - Gráfico de stock

- [ ] **CategoryList.tsx** - Lista de categorías
  - CRUD de categorías
  - Árbol jerárquico (opcional)

- [ ] **CategoryForm.tsx** - Formulario de categoría
  - Crear/editar categoría
  - Categoría padre (opcional)

**Componentes**:
- [ ] `components/ProductCard.tsx` - Tarjeta de producto
- [ ] `components/ProductFilters.tsx` - Filtros avanzados
- [ ] `components/StockAlert.tsx` - Alerta de stock bajo

---

#### 3.4 Módulo de Clientes (4 páginas + 2 componentes)

**Directorio**: `frontend/src/pages/clients/`

**Páginas**:
- [ ] **ClientList.tsx** - Lista de clientes
  - DataTable con clientes
  - Búsqueda por documento/nombre
  - Filtros (tipo, estado)
  - Exportar a Excel

- [ ] **ClientCreate.tsx** - Crear cliente
  - Formulario según tipo (persona/empresa)
  - Validación de documento
  - Configuración de crédito

- [ ] **ClientEdit.tsx** - Editar cliente
  - Formulario de actualización
  - Ajuste de límite de crédito

- [ ] **ClientDetails.tsx** - Detalles de cliente
  - Información completa
  - Historial de compras
  - Estado de cuenta
  - Gráfico de compras

**Componentes**:
- [ ] `components/ClientCard.tsx` - Tarjeta de cliente
- [ ] `components/ClientHistory.tsx` - Historial de transacciones

---

### 💼 FASE 4: Módulos Operacionales (Prioridad: ALTA)

#### 4.1 Módulo de Ventas + POS (4 páginas + 4 componentes)

**Directorio**: `frontend/src/pages/sales/`

**Páginas**:
- [ ] **POS.tsx** - Punto de Venta (interfaz principal)
  - Búsqueda rápida de productos
  - Carrito de compras
  - Selección de cliente
  - Múltiples métodos de pago
  - Impresión de ticket
  - Interfaz táctil y responsive

- [ ] **SaleList.tsx** - Lista de ventas
  - DataTable con ventas
  - Filtros por fecha, cliente, estado
  - Búsqueda por número de venta
  - Exportar reportes

- [ ] **SaleCreate.tsx** - Crear venta (modo clásico)
  - Formulario de venta manual
  - Agregar productos
  - Cálculo automático de totales

- [ ] **SaleDetails.tsx** - Detalles de venta
  - Información completa
  - Productos vendidos
  - Pagos realizados
  - Opciones: anular, devolver, imprimir

**Componentes**:
- [ ] `components/POSCart.tsx` - Carrito del POS
- [ ] `components/ProductSelector.tsx` - Selector de productos
- [ ] `components/PaymentModal.tsx` - Modal de pago
- [ ] `components/InvoicePrint.tsx` - Componente de impresión

---

#### 4.2 Módulo de Compras (3 páginas + 2 componentes)

**Directorio**: `frontend/src/pages/purchases/`

**Páginas**:
- [ ] **PurchaseList.tsx** - Lista de compras
  - DataTable con compras
  - Filtros por proveedor, fecha, estado
  - Estado de pagos

- [ ] **PurchaseCreate.tsx** - Registrar compra
  - Selección de proveedor
  - Agregar productos comprados
  - Cálculo de totales
  - Actualización automática de inventario

- [ ] **PurchaseDetails.tsx** - Detalles de compra
  - Información completa
  - Productos comprados
  - Estado de pago
  - Opciones: anular, pagar

**Componentes**:
- [ ] `components/PurchaseForm.tsx` - Formulario de compra
- [ ] `components/PurchaseFilters.tsx` - Filtros de búsqueda

---

#### 4.3 Módulo de Proveedores (4 páginas + 1 componente)

**Directorio**: `frontend/src/pages/suppliers/`

**Páginas**:
- [ ] **SupplierList.tsx** - Lista de proveedores
- [ ] **SupplierCreate.tsx** - Crear proveedor
- [ ] **SupplierEdit.tsx** - Editar proveedor
- [ ] **SupplierDetails.tsx** - Detalles con historial de compras

**Componentes**:
- [ ] `components/SupplierCard.tsx` - Tarjeta de proveedor

---

### 💰 FASE 5: Módulos Financieros (Prioridad: MEDIA)

#### 5.1 Módulo de Cartera (5 páginas + 3 componentes)

**Directorio**: `frontend/src/pages/portfolio/`

**Páginas**:
- [ ] **AccountsReceivable.tsx** - Cuentas por cobrar
  - Lista de cuentas pendientes
  - Filtros por cliente, vencimiento
  - Análisis de antigüedad
  - Totales por estado

- [ ] **AccountsPayable.tsx** - Cuentas por pagar
  - Lista de cuentas a proveedores
  - Filtros y análisis

- [ ] **PaymentList.tsx** - Lista de pagos
  - Historial de pagos recibidos/realizados
  - Filtros por método, fecha

- [ ] **PaymentCreate.tsx** - Registrar pago
  - Formulario de pago
  - Selección de cuenta
  - Métodos de pago
  - Comprobantes

- [ ] **CashFlow.tsx** - Flujo de caja
  - Gráfico de entradas/salidas
  - Proyección de flujo
  - Filtros por período

**Componentes**:
- [ ] `components/AccountCard.tsx` - Tarjeta de cuenta
- [ ] `components/PaymentCalendar.tsx` - Calendario de vencimientos
- [ ] `components/AgingReport.tsx` - Reporte de antigüedad

---

#### 5.2 Módulo de Reportes (5 páginas + 3 componentes)

**Directorio**: `frontend/src/pages/reports/`

**Páginas**:
- [ ] **ReportList.tsx** - Lista de reportes disponibles
  - Categorías de reportes
  - Acceso rápido

- [ ] **SalesReport.tsx** - Reporte de ventas
  - Ventas por período
  - Por producto, cliente, vendedor
  - Gráficos interactivos
  - Exportar PDF/Excel

- [ ] **InventoryReport.tsx** - Reporte de inventario
  - Stock actual
  - Movimientos
  - Valorización
  - Productos bajo stock

- [ ] **FinancialReport.tsx** - Reporte financiero
  - Balance general
  - Flujo de caja
  - Indicadores financieros

- [ ] **ProfitLossReport.tsx** - Estado de resultados
  - Ingresos vs gastos
  - Margen de ganancia
  - Comparación por períodos

**Componentes**:
- [ ] `components/ReportFilters.tsx` - Filtros de reportes
- [ ] `components/ReportExport.tsx` - Exportación a PDF/Excel
- [ ] `components/ReportChart.tsx` - Gráficos dinámicos

---

### ⚙️ FASE 6: Configuración y Admin (Prioridad: MEDIA)

#### 6.1 Módulo de Configuración (4 páginas)

**Directorio**: `frontend/src/pages/config/`

- [ ] **CompanySettings.tsx** - Configuración de empresa
  - Datos de la empresa
  - Logo
  - Configuración fiscal
  - Parámetros de facturación

- [ ] **TaxRates.tsx** - Gestión de impuestos
  - CRUD de tasas impositivas
  - Configuración por tipo
  - Vigencia de tasas

- [ ] **UserManagement.tsx** - Administración de usuarios
  - Lista de usuarios
  - CRUD de usuarios
  - Asignación de roles
  - Permisos

- [ ] **SystemSettings.tsx** - Configuración del sistema
  - Parámetros generales
  - Preferencias de UI
  - Configuración de reportes

---

### 🚨 FASE 7: Páginas de Error (Prioridad: BAJA)

**Directorio**: `frontend/src/pages/errors/`

- [ ] **NotFound.tsx** - Error 404
- [ ] **Unauthorized.tsx** - Error 403
- [ ] **ServerError.tsx** - Error 500

---

## 📊 Resumen de Entregables

### Servicios API: 10 servicios
- ✅ api.service.ts (base)
- ✅ auth.service.ts
- [ ] product.service.ts
- [ ] category.service.ts
- [ ] sale.service.ts
- [ ] purchase.service.ts
- [ ] client.service.ts
- [ ] supplier.service.ts
- [ ] portfolio.service.ts
- [ ] report.service.ts
- [ ] config.service.ts

### Redux Slices: 10 slices
- ✅ authSlice.ts
- ✅ uiSlice.ts
- [ ] productSlice.ts
- [ ] saleSlice.ts
- [ ] purchaseSlice.ts
- [ ] clientSlice.ts
- [ ] supplierSlice.ts
- [ ] portfolioSlice.ts
- [ ] reportSlice.ts
- [ ] configSlice.ts

### Componentes: 45+ componentes
- UI Base: 40 componentes
- Formularios: 5 componentes
- Layout: 2 layouts (con subcomponentes)
- Comunes: 8 componentes
- Charts: 3 componentes

### Páginas: 35+ páginas
- Auth: 3 páginas
- Dashboard: 1 página
- Productos: 6 páginas
- Clientes: 4 páginas
- Ventas: 4 páginas
- Compras: 3 páginas
- Proveedores: 4 páginas
- Cartera: 5 páginas
- Reportes: 5 páginas
- Configuración: 4 páginas
- Errores: 3 páginas

### Custom Hooks: 8 hooks
- useAuth, useDebounce, useLocalStorage, usePagination
- useSort, useFilters, useModal, useToast

### Utilidades: 6 archivos
- constants.ts, formatters.ts, validators.ts
- helpers.ts, permissions.ts, cn.ts

---

## ✅ Checklist de Implementación

### Fase 1: Infraestructura (Base)
- [ ] Crear 10 servicios API
- [ ] Implementar 8 Redux slices
- [ ] Crear 8 custom hooks
- [ ] Implementar 6 archivos de utilidades
- [ ] Configurar sistema de rutas protegidas

### Fase 2: Sistema de Diseño
- [ ] Crear 40 componentes UI base
- [ ] Crear 5 componentes de formularios
- [ ] Crear 2 layouts completos
- [ ] Crear 8 componentes comunes
- [ ] Crear 3 componentes de charts

### Fase 3: Módulos Core
- [ ] Implementar módulo de autenticación (3 páginas)
- [ ] Implementar Dashboard (1 página + 3 componentes)
- [ ] Implementar módulo de productos (6 páginas + 3 componentes)
- [ ] Implementar módulo de clientes (4 páginas + 2 componentes)

### Fase 4: Módulos Operacionales
- [ ] Implementar módulo de ventas + POS (4 páginas + 4 componentes)
- [ ] Implementar módulo de compras (3 páginas + 2 componentes)
- [ ] Implementar módulo de proveedores (4 páginas + 1 componente)

### Fase 5: Módulos Financieros
- [ ] Implementar módulo de cartera (5 páginas + 3 componentes)
- [ ] Implementar módulo de reportes (5 páginas + 3 componentes)

### Fase 6: Configuración
- [ ] Implementar módulo de configuración (4 páginas)

### Fase 7: Páginas de Error
- [ ] Crear páginas de error (3 páginas)

### Fase 8: Optimización
- [ ] Implementar lazy loading de páginas
- [ ] Optimizar bundle size
- [ ] Implementar code splitting
- [ ] Agregar memoization donde sea necesario

### Fase 9: Testing
- [ ] Tests unitarios de componentes
- [ ] Tests de integración
- [ ] Tests de Redux slices
- [ ] Tests E2E críticos

---

## 🎯 Próximos Pasos Inmediatos

1. **Revisar y aprobar** este plan de implementación
2. **Decidir** por qué fase comenzar (recomendado: Fase 1)
3. **Crear issues/tareas** en GitHub para tracking
4. **Iniciar desarrollo** de forma iterativa
5. **Iterar** basándose en feedback y prioridades de negocio

---

## 📝 Notas Importantes

- Cada componente debe tener su archivo de tipos si es necesario
- Todos los formularios deben usar React Hook Form + Zod
- Todos los componentes UI deben ser responsive (mobile-first)
- Implementar lazy loading para páginas grandes
- Usar Suspense para carga de componentes asíncronos
- Mantener consistencia en el diseño con TailwindCSS
- Documentar componentes complejos con JSDoc
- Crear tests para lógica crítica

---

## 🔗 Referencias

- [Arquitectura Frontend](./ARQUITECTURA_FRONTEND.md) - Documento de arquitectura completo
- [Plan de Implementación General](./PLAN_IMPLEMENTACION.md) - Plan general del proyecto
- [Esquema de Base de Datos](./DB_SCHEMA.md) - Esquema de la base de datos
