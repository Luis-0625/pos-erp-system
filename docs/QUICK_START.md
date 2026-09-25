# Guía de Inicio Rápido - POS ERP System

Esta guía te ayudará a configurar y ejecutar el proyecto completo en tu máquina local.

## 📋 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** 18+ ([descargar](https://nodejs.org/))
- **PostgreSQL** 14+ ([descargar](https://www.postgresql.org/download/))
- **Git** ([descargar](https://git-scm.com/downloads))
- **Editor de código** (VS Code recomendado)

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd pos-erp-system
```

### 2. Configurar la base de datos

```bash
# Conectar a PostgreSQL
psql -U postgres

# Ejecutar el script de schema
\i database/schema.sql

# Salir
\q
```

### 3. Configurar Backend

```bash
cd backend

# Instalar dependencias
npm install

# Copiar archivo de variables de entorno
copy .env.example .env    # Windows
# cp .env.example .env    # Linux/Mac

# Editar .env con tus credenciales de PostgreSQL
```

Configuración mínima en `.env`:
```env
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=pos_erp_db
DB_USER=postgres
DB_PASSWORD=tu_contraseña
JWT_SECRET=tu_clave_secreta_aqui
```

### 4. Configurar Frontend

```bash
cd ../frontend

# Instalar dependencias
npm install

# Copiar archivo de variables de entorno
copy .env.example .env    # Windows
# cp .env.example .env    # Linux/Mac
```

Configuración en `.env`:
```env
VITE_API_URL=http://localhost:5000/api/v1
```

## ▶️ Ejecutar el Proyecto

### Opción 1: Ejecutar Backend y Frontend por separado

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Opción 2: Usar scripts combinados (próximamente)

El backend estará disponible en: `http://localhost:5000`
El frontend estará disponible en: `http://localhost:5173`

## 🔑 Credenciales por Defecto

- **Email:** admin@pos-erp.com
- **Password:** admin123

> ⚠️ **Importante:** Cambia estas credenciales después del primer inicio de sesión.

## 🧪 Ejecutar Tests

**Backend:**
```bash
cd backend
npm test
```

**Frontend:**
```bash
cd frontend
npm run type-check
```

## 📦 Compilar para Producción

**Backend:**
```bash
cd backend
npm run build
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

## 📚 Documentación Adicional

- [Plan Técnico Completo](../plans/pos-erp-plan.md)
- [Módulo de Cartera](../plans/modulo-cartera.md)
- [Resumen Ejecutivo](../plans/resumen-ejecutivo.md)
- [Configuración de Base de Datos](../database/README.md)

## 🛠️ Herramientas de Desarrollo

### Linting y Formateo

**Backend:**
```bash
npm run lint
npm run format
```

**Frontend:**
```bash
npm run lint
npm run format
```

### Estructura del Proyecto

```
pos-erp-system/
├── backend/           # API REST con Node.js + Express
├── frontend/          # Aplicación React + Vite
├── database/          # Scripts SQL
├── docs/              # Documentación
├── plans/             # Planes técnicos
└── .github/           # GitHub Actions CI/CD
```

## 🐛 Solución de Problemas

### Error: No se puede conectar a PostgreSQL

1. Verifica que PostgreSQL esté ejecutándose
2. Confirma las credenciales en `.env`
3. Verifica que el puerto 5432 esté disponible

### Error: Puerto 5000 o 5173 en uso

Cambia el puerto en las variables de entorno:
- Backend: `PORT=5001` en `.env`
- Frontend: Edita `vite.config.ts`

### Error: Módulos no encontrados

```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

## 📞 Soporte

Si encuentras algún problema:
1. Revisa la documentación en `/plans`
2. Verifica los logs en consola
3. Consulta los issues en GitHub

## 🎯 Próximos Pasos

1. ✅ Configuración inicial completada
2. 📝 Crear usuario administrador adicional
3. 🏪 Configurar tu primera tienda
4. 📦 Agregar productos al inventario
5. 💰 Realizar tu primera venta

---

**¡Listo para comenzar! 🎉**
