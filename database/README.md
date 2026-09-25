# Inicialización de Base de Datos

Este directorio contiene los scripts de base de datos para PostgreSQL.

## Archivos

- **schema.sql**: Esquema completo de la base de datos con todas las tablas, índices y triggers
- **seed.sql**: Datos de prueba para desarrollo

## Instrucciones de Configuración

### 1. Instalar PostgreSQL

```bash
# Windows: Descargar desde https://www.postgresql.org/download/windows/
# Linux: sudo apt-get install postgresql postgresql-contrib
# Mac: brew install postgresql
```

### 2. Crear la base de datos

```bash
# Conectar a PostgreSQL
psql -U postgres

# Ejecutar el script de schema
\i database/schema.sql

# Salir
\q
```

### 3. Configurar variables de entorno

Copiar `.env.example` a `.env` en el directorio backend y configurar:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=pos_erp_db
DB_USER=postgres
DB_PASSWORD=tu_contraseña
```

### 4. Verificar conexión

```bash
cd backend
npm run dev
```

Si todo está correcto, verás el mensaje: "✅ Conexión a PostgreSQL exitosa"

## Estructura de Tablas

### Módulo de Usuarios
- `users`: Usuarios del sistema
- `permissions`: Permisos disponibles
- `role_permissions`: Relación roles-permisos

### Módulo de Productos
- `categories`: Categorías de productos
- `products`: Productos del inventario

### Módulo de Clientes
- `clients`: Clientes individuales y empresas

### Módulo de Ventas
- `sales`: Cabecera de ventas
- `sale_items`: Detalle de items vendidos

### Módulo de Proveedores
- `suppliers`: Proveedores

### Módulo de Compras
- `purchases`: Cabecera de compras
- `purchase_items`: Detalle de items comprados

### Módulo de Inventario
- `inventory_movements`: Movimientos de inventario

### Módulo de Cartera
- `accounts_receivable`: Cuentas por cobrar
- `accounts_payable`: Cuentas por pagar
- `receivable_payments`: Pagos de cuentas por cobrar
- `payable_payments`: Pagos de cuentas por pagar

## Backup y Restauración

### Crear backup

```bash
pg_dump -U postgres pos_erp_db > backup.sql
```

### Restaurar backup

```bash
psql -U postgres pos_erp_db < backup.sql
```

## Migraciones

Para futuras actualizaciones del esquema, se recomienda usar una herramienta de migraciones como:
- Sequelize Migrations
- Knex.js
- node-pg-migrate
