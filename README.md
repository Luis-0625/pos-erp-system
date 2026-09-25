# 🛒 Sistema POS ERP

Sistema completo de Punto de Venta (POS) y Planificación de Recursos Empresariales (ERP) desarrollado con tecnologías modernas.

## 🚀 Stack Tecnológico

### Frontend
- **React 18** - Librería de UI
- **Vite** - Build tool y dev server
- **TypeScript** - Tipado estático
- **TailwindCSS** - Estilos y diseño
- **Redux Toolkit** - Gestión de estado
- **React Router** - Navegación
- **Axios** - Cliente HTTP

### Backend
- **Node.js** - Runtime
- **Express** - Framework web
- **TypeScript** - Tipado estático
- **PostgreSQL** - Base de datos
- **Sequelize** - ORM
- **JWT** - Autenticación
- **Bcrypt** - Hash de contraseñas

## 📂 Estructura del Proyecto

```
pos-erp-system/
├── backend/              # API REST con Express
│   ├── src/
│   │   ├── config/      # Configuraciones
│   │   ├── controllers/ # Controladores
│   │   ├── models/      # Modelos de BD
│   │   ├── routes/      # Rutas de API
│   │   ├── middleware/  # Middleware
│   │   ├── services/    # Lógica de negocio
│   │   └── utils/       # Utilidades
│   ├── package.json
│   └── tsconfig.json
├── frontend/            # Aplicación React
│   ├── src/
│   │   ├── components/  # Componentes React
│   │   ├── pages/       # Páginas
│   │   ├── services/    # Servicios API
│   │   ├── store/       # Redux store
│   │   ├── types/       # Tipos TypeScript
│   │   └── utils/       # Utilidades
│   ├── package.json
│   └── vite.config.ts
├── database/            # Scripts SQL
├── docs/               # Documentación
├── shared/             # Código compartido
├── .github/            # GitHub Actions
└── README.md
```

## 🎯 Módulos del Sistema

### 1. 🔐 Autenticación y Usuarios
- Sistema de login/logout seguro
- Gestión de roles y permisos
- Recuperación de contraseña
- Perfiles de usuario

### 2. 🛒 POS (Punto de Venta)
- Interfaz de venta rápida
- Búsqueda de productos
- Múltiples métodos de pago
- Impresión de tickets
- Gestión de turnos de caja
- Corte de caja

### 3. 📦 Inventario
- Gestión de productos
- Categorías y subcategorías
- Control de stock
- Alertas de stock mínimo
- Códigos de barras

### 4. 📊 Ventas
- Historial de ventas
- Devoluciones y cancelaciones
- Cotizaciones
- Reportes de ventas
- Análisis de productos

### 5. 👥 Clientes
- Base de datos de clientes
- Historial de compras
- Programa de lealtad
- Límites de crédito

### 6. 🏭 Compras y Proveedores
- Gestión de proveedores
- Órdenes de compra
- Recepción de mercancía
- Evaluación de proveedores

### 7. 💼 Cartera
**Cuentas por Cobrar**:
- Configuración de crédito
- Facturas a crédito
- Recepción de pagos
- Cartera vencida
- Recordatorios automáticos

**Cuentas por Pagar**:
- Registro de obligaciones
- Programación de pagos
- Estado de cuenta con proveedores

### 8. 📈 Reportes y Análisis
- Dashboard ejecutivo
- Reportes de ventas
- Reportes de inventario
- Análisis financiero
- Exportación PDF/Excel

### 9. ⚙️ Configuración
- Datos de la empresa
- Impuestos
- Métodos de pago
- Multi-sucursal

## 🚀 Inicio Rápido

### Prerequisitos

- Node.js >= 18
- PostgreSQL >= 14
- Git

### Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/TU-USUARIO/pos-erp-system.git
cd pos-erp-system
```

2. **Configurar Backend**
```bash
cd backend
npm install
cp .env.example .env
# Editar .env con tus configuraciones
npm run dev
```

3. **Configurar Frontend**
```bash
cd frontend
npm install
cp .env.example .env
# Editar .env con tus configuraciones
npm run dev
```

4. **Configurar Base de Datos**
```bash
# Crear base de datos PostgreSQL
psql -U postgres
CREATE DATABASE pos_erp;
\q
```

### URLs de Desarrollo

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000
- **API Health**: http://localhost:5000/api/health

## 📚 Documentación

- [Plan de Desarrollo](./plans/pos-erp-plan.md)
- [Guía de Inicio](./plans/getting-started.md)
- [Módulo de Cartera](./plans/modulo-cartera.md)
- [Resumen Ejecutivo](./plans/resumen-ejecutivo.md)

## 🔐 Seguridad

- Autenticación JWT
- Contraseñas hasheadas con bcrypt
- Headers de seguridad con Helmet
- CORS configurado
- Validación de inputs
- Rate limiting

## 🧪 Testing

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

## 📦 Despliegue

### Backend
- Railway
- Render
- Heroku
- DigitalOcean

### Frontend
- Vercel
- Netlify
- Cloudflare Pages

### Base de Datos
- Railway PostgreSQL
- Supabase
- AWS RDS

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'feat: agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📋 Convención de Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Documentación
- `style`: Formato de código
- `refactor`: Refactorización
- `test`: Tests
- `chore`: Mantenimiento

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👥 Autores

- Tu Nombre - Desarrollo inicial

## 🔗 Enlaces Útiles

- [Express.js](https://expressjs.com/)
- [React](https://react.dev/)
- [PostgreSQL](https://www.postgresql.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Redux Toolkit](https://redux-toolkit.js.org/)

## 📞 Soporte

Para soporte, crea un issue en GitHub o contacta al equipo de desarrollo.

---

**Estado**: 🚧 En Desarrollo  
**Versión**: 1.0.0  
**Última Actualización**: 2026-09-25
