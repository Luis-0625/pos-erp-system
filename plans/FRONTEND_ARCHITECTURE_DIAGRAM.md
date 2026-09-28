# Diagramas de Arquitectura Frontend - Sistema POS ERP

## 1. Arquitectura General del Frontend

```mermaid
graph TB
    subgraph "Capa de Presentación"
        A[App.tsx]
        B[Router]
        C[Pages/Módulos]
        D[Components UI]
    end
    
    subgraph "Capa de Lógica de Negocio"
        E[Redux Store]
        F[Slices]
        G[Custom Hooks]
        H[Context API]
    end
    
    subgraph "Capa de Servicios"
        I[API Services]
        J[Auth Service]
        K[Utils/Helpers]
    end
    
    subgraph "Backend API"
        L[REST API]
        M[WebSocket]
    end
    
    A --> B
    B --> C
    C --> D
    C --> G
    G --> E
    E --> F
    F --> I
    I --> L
    J --> L
    H --> G
    K --> C
```

## 2. Estructura de Directorios

```mermaid
graph LR
    A[frontend/src] --> B[components]
    A --> C[pages]
    A --> D[services]
    A --> E[store]
    A --> F[hooks]
    A --> G[utils]
    A --> H[types]
    A --> I[routes]
    
    B --> B1[ui]
    B --> B2[layout]
    B --> B3[forms]
    B --> B4[data]
    
    C --> C1[Dashboard]
    C --> C2[Products]
    C --> C3[Sales]
    C --> C4[Purchases]
    C --> C5[Clients]
    C --> C6[Suppliers]
    C --> C7[Portfolio]
    C --> C8[Reports]
    C --> C9[Config]
    
    E --> E1[slices]
    E --> E2[store]
    
    D --> D1[api.service]
    D --> D2[auth.service]
    D --> D3[product.service]
    D --> D4[sale.service]
```

## 3. Flujo de Datos en Redux

```mermaid
sequenceDiagram
    participant C as Component
    participant H as Hook
    participant R as Redux
    participant T as Thunk
    participant S as Service
    participant A as API
    
    C->>H: useSelector/useDispatch
    H->>R: dispatch(action)
    R->>T: Async Thunk
    T->>S: Call Service
    S->>A: HTTP Request
    A-->>S: Response
    S-->>T: Data
    T-->>R: Update State
    R-->>H: State Changed
    H-->>C: Re-render
```

## 4. Flujo de Autenticación

```mermaid
graph TD
    A[Usuario ingresa credenciales] --> B[LoginPage]
    B --> C[dispatch login thunk]
    C --> D[auth.service.login]
    D --> E[API: POST /auth/login]
    E --> F{Éxito?}
    F -->|Sí| G[Guardar token en localStorage]
    F -->|No| H[Mostrar error]
    G --> I[Actualizar authSlice]
    I --> J[Guardar user en state]
    J --> K[Redirigir a Dashboard]
    H --> B
    
    K --> L[ProtectedRoute]
    L --> M{Token válido?}
    M -->|Sí| N[Renderizar componente]
    M -->|No| O[Redirigir a Login]
```

## 5. Arquitectura de Componentes (Atomic Design)

```mermaid
graph TB
    subgraph "Atoms - Componentes Básicos"
        A1[Button]
        A2[Input]
        A3[Badge]
        A4[Icon]
    end
    
    subgraph "Molecules - Componentes Compuestos"
        M1[FormField]
        M2[SearchBar]
        M3[Card]
    end
    
    subgraph "Organisms - Componentes Complejos"
        O1[DataTable]
        O2[Sidebar]
        O3[ProductCard]
    end
    
    subgraph "Templates - Layouts"
        T1[MainLayout]
        T2[AuthLayout]
    end
    
    subgraph "Pages - Páginas Completas"
        P1[Dashboard]
        P2[ProductList]
        P3[SaleForm]
    end
    
    A1 --> M1
    A2 --> M1
    A1 --> M2
    A2 --> M2
    
    M1 --> O1
    M2 --> O1
    M3 --> O3
    
    O1 --> P2
    O2 --> T1
    O3 --> P2
    
    T1 --> P1
    T1 --> P2
    T2 --> Login[LoginPage]
```

## 6. Flujo de Venta en POS

```mermaid
sequenceDiagram
    participant U as Usuario
    participant P as POSScreen
    participant C as Cart Component
    participant R as Redux saleSlice
    participant S as sale.service
    participant A as API
    
    U->>P: Buscar producto
    P->>R: searchProducts
    R->>S: searchProducts
    S->>A: GET /products/search
    A-->>S: Lista productos
    S-->>R: Actualizar state
    R-->>P: Mostrar resultados
    
    U->>P: Agregar al carrito
    P->>R: dispatch addToCart
    R->>C: Actualizar carrito
    
    U->>P: Proceder al pago
    P->>R: dispatch createSale
    R->>S: createSale
    S->>A: POST /sales
    A-->>S: Sale creada
    S-->>R: Actualizar state
    R-->>P: Mostrar confirmación
    P->>U: Imprimir factura
```

## 7. Sistema de Rutas

```mermaid
graph TD
    A[App Router] --> B{Autenticado?}
    B -->|No| C[Public Routes]
    B -->|Sí| D[Protected Routes]
    
    C --> C1[/login]
    C --> C2[/forgot-password]
    C --> C3[/reset-password]
    
    D --> D1[/dashboard]
    D --> D2[/products/*]
    D --> D3[/sales/*]
    D --> D4[/purchases/*]
    D --> D5[/clients/*]
    D --> D6[/suppliers/*]
    D --> D7[/portfolio/*]
    D --> D8[/reports/*]
    D --> D9[/config/*]
    
    D2 --> D2A[/products/list]
    D2 --> D2B[/products/new]
    D2 --> D2C[/products/:id]
    D2 --> D2D[/products/categories]
    
    D3 --> D3A[/sales/pos]
    D3 --> D3B[/sales/list]
    D3 --> D3C[/sales/:id]
    
    D --> E{Rol?}
    E -->|ADMIN| F[Todas las rutas]
    E -->|MANAGER| G[Rutas limitadas]
    E -->|CASHIER| H[Solo POS y ventas]
```

## 8. Gestión de Estado con Redux

```mermaid
graph TB
    subgraph "Redux Store"
        A[Root Reducer]
        
        A --> B[authSlice]
        A --> C[productSlice]
        A --> D[categorySlice]
        A --> E[saleSlice]
        A --> F[purchaseSlice]
        A --> G[clientSlice]
        A --> H[supplierSlice]
        A --> I[portfolioSlice]
        A --> J[configSlice]
    end
    
    subgraph "State Structure"
        B --> B1[user]
        B --> B2[token]
        B --> B3[isAuthenticated]
        
        C --> C1[products array]
        C --> C2[currentProduct]
        C --> C3[loading]
        C --> C4[error]
        C --> C5[pagination]
        
        E --> E1[sales array]
        E --> E2[cart array]
        E --> E3[currentSale]
        E --> E4[stats]
    end
```

## 9. Ciclo de Vida de un Componente con Redux

```mermaid
graph TD
    A[Component Mount] --> B[useEffect]
    B --> C[dispatch fetchData thunk]
    C --> D[Thunk ejecuta]
    D --> E[loading: true]
    E --> F[API Call]
    F --> G{Success?}
    G -->|Yes| H[Update state with data]
    G -->|No| I[Update state with error]
    H --> J[loading: false]
    I --> J
    J --> K[Component re-renders]
    K --> L{Has data?}
    L -->|Yes| M[Render content]
    L -->|No| N[Render empty state]
    L -->|Error| O[Render error state]
```

## 10. Patrón de Comunicación entre Componentes

```mermaid
graph TB
    subgraph "Container Component"
        A[ProductListContainer]
        A1[Lógica de negocio]
        A2[Redux hooks]
        A3[Event handlers]
    end
    
    subgraph "Presentational Components"
        B[ProductList]
        C[ProductCard]
        D[ProductFilters]
    end
    
    A --> A1
    A --> A2
    A --> A3
    
    A1 --> B
    A2 --> B
    A3 --> B
    
    B --> C
    B --> D
    
    C --> E[Props]
    D --> F[Props]
    
    E --> E1[onClick handler]
    F --> F1[onFilter handler]
    
    E1 -->|Emit event| A3
    F1 -->|Emit event| A3
```

## 11. Flujo de Manejo de Errores

```mermaid
graph TD
    A[Component] --> B[Try Action]
    B --> C{Error?}
    C -->|No| D[Success Path]
    C -->|Yes| E[Error Boundary]
    
    E --> F{Error Type}
    F -->|Network| G[Retry/Toast]
    F -->|Validation| H[Show Field Error]
    F -->|Auth| I[Redirect to Login]
    F -->|Server| J[Error Page]
    F -->|Unknown| K[Generic Error]
    
    G --> L[Log Error]
    H --> L
    I --> L
    J --> L
    K --> L
    
    L --> M[Send to Monitoring]
```

## 12. Optimización y Code Splitting

```mermaid
graph TB
    A[Main Bundle] --> B[Core]
    A --> C[Vendor]
    
    B --> D[App Shell]
    B --> E[Auth Module]
    
    C --> F[React/Redux]
    C --> G[UI Libraries]
    
    subgraph "Lazy Loaded Modules"
        H[Dashboard Module]
        I[Products Module]
        J[Sales Module]
        K[Reports Module]
    end
    
    D -.->|Lazy Load| H
    D -.->|Lazy Load| I
    D -.->|Lazy Load| J
    D -.->|Lazy Load| K
    
    H --> H1[Components]
    H --> H2[Services]
    
    I --> I1[Components]
    I --> I2[Services]
```

## 13. Flujo de Desarrollo de Funcionalidad

```mermaid
graph TD
    A[Requerimiento] --> B[Definir tipos TypeScript]
    B --> C[Crear servicio API]
    C --> D[Crear Redux slice]
    D --> E[Crear custom hooks]
    E --> F[Crear componentes UI]
    F --> G[Crear páginas]
    G --> H[Configurar rutas]
    H --> I[Escribir tests]
    I --> J[Code review]
    J --> K{Aprobado?}
    K -->|Sí| L[Merge a develop]
    K -->|No| M[Corregir]
    M --> J
```

## 14. Arquitectura de Testing

```mermaid
graph TB
    subgraph "Testing Pyramid"
        A[E2E Tests - 10%]
        B[Integration Tests - 30%]
        C[Unit Tests - 60%]
    end
    
    A --> A1[Playwright/Cypress]
    A1 --> A2[User Flows]
    
    B --> B1[React Testing Library]
    B1 --> B2[Component Integration]
    
    C --> C1[Jest]
    C1 --> C2[Utils/Helpers]
    C1 --> C3[Hooks]
    C1 --> C4[Services]
```

## 15. Pipeline de CI/CD

```mermaid
graph LR
    A[Git Push] --> B[GitHub Actions]
    B --> C[Install Dependencies]
    C --> D[Lint Code]
    D --> E[Run Tests]
    E --> F{Tests Pass?}
    F -->|Yes| G[Build]
    F -->|No| H[Fail & Notify]
    G --> I[Generate Bundle]
    I --> J{Branch?}
    J -->|main| K[Deploy Production]
    J -->|develop| L[Deploy Staging]
    J -->|feature| M[Preview Deploy]
    K --> N[Notify Success]
    L --> N
    M --> N
```

## Resumen de Patrones Utilizados

### Patrones de Diseño:
1. **Container/Presentational** - Separación de lógica y UI
2. **Compound Components** - Componentes compuestos flexibles
3. **Custom Hooks** - Reutilización de lógica
4. **Higher Order Components** - Funcionalidad compartida
5. **Render Props** - Patrones de renderizado flexible
6. **Provider Pattern** - Context API para estado global
7. **Singleton** - Servicios API únicos

### Patrones de Estado:
1. **Redux Toolkit** - Gestión de estado predecible
2. **Async Thunks** - Manejo de operaciones asíncronas
3. **Normalized State** - Estado normalizado para eficiencia
4. **Optimistic Updates** - Actualizaciones optimistas

### Patrones de Routing:
1. **Lazy Loading** - Carga diferida de módulos
2. **Protected Routes** - Rutas protegidas por autenticación
3. **Role-based Access** - Control de acceso por roles
4. **Nested Routes** - Rutas anidadas

### Patrones de UI:
1. **Atomic Design** - Estructura de componentes
2. **Composition** - Composición sobre herencia
3. **Controlled Components** - Formularios controlados
4. **Error Boundaries** - Manejo de errores en UI

---

**Nota**: Estos diagramas representan la arquitectura del frontend del sistema POS ERP. Cada diagrama muestra un aspecto diferente de la aplicación y cómo los diferentes componentes interactúan entre sí.
