# 🔐 Credenciales de Acceso al Sistema

## Usuario Administrador (Por Defecto)

Estas credenciales están insertadas automáticamente en la base de datos cuando ejecutas el archivo [`schema.sql`](database/schema.sql:274-276).

### Credenciales de Login

```
Email:    admin@pos-erp.com
Password: admin123
```

### Información del Usuario

- **Nombre**: Admin Sistema
- **Rol**: admin
- **Estado**: Activo
- **Permisos**: Acceso completo a todos los módulos

---

## ⚙️ Pasos para Usar las Credenciales

### 1. Verificar que la Base de Datos esté Inicializada

Asegúrate de haber ejecutado el script de schema:

```bash
# Conectar a PostgreSQL
psql -U postgres

# Crear la base de datos (si no existe)
CREATE DATABASE pos_erp_db;

# Conectar a la base de datos
\c pos_erp_db

# Ejecutar el script de schema
\i database/schema.sql

# Salir
\q
```

### 2. Verificar que el Backend esté Corriendo

```bash
cd pos-erp-system/backend
npm run dev
```

Deberías ver: `✅ Conexión a PostgreSQL exitosa`

### 3. Iniciar el Frontend

```bash
cd pos-erp-system/frontend
npm run dev
```

### 4. Acceder al Sistema

1. Abre tu navegador en `http://localhost:5173` (o el puerto que muestre Vite)
2. En la pantalla de login, ingresa:
   - **Email**: `admin@pos-erp.com`
   - **Password**: `admin123`
3. Haz clic en "Iniciar Sesión"
4. Serás redirigido al Dashboard principal

---

## 👥 Usuarios Adicionales de Prueba

Si ejecutaste el archivo [`seed.sql`](database/seed.sql), también tendrás estos usuarios:

### Cajero
```
Email:    cajero@pos-erp.com
Password: cajero123
Rol:      cashier
```

### Vendedor
```
Email:    vendedor@pos-erp.com
Password: vendedor123
Rol:      seller
```

### Gerente
```
Email:    gerente@pos-erp.com
Password: gerente123
Rol:      manager
```

---

## 🔒 Notas de Seguridad

⚠️ **IMPORTANTE**: Estas credenciales son solo para desarrollo y pruebas.

**En producción debes**:
- Cambiar inmediatamente la contraseña del administrador
- Crear usuarios con contraseñas seguras
- Eliminar los usuarios de prueba
- Configurar políticas de contraseñas fuertes
- Habilitar autenticación de dos factores si es posible

---

## 🔑 Hash de Contraseña

El hash de contraseña en la base de datos está generado con bcrypt (10 rounds):

```javascript
// Ejemplo para generar nuevos hashes
const bcrypt = require('bcrypt');
const password = 'admin123';
const hash = await bcrypt.hash(password, 10);
console.log(hash);
```

---

## 🆘 Problemas Comunes

### No puedo iniciar sesión

1. **Verifica que el backend esté corriendo** en `http://localhost:3000`
2. **Revisa la conexión a la base de datos** en la consola del backend
3. **Confirma que el usuario existe**:
   ```sql
   SELECT email, role FROM users WHERE email = 'admin@pos-erp.com';
   ```

### La contraseña no funciona

El hash almacenado debe ser:
```
$2b$10$XqZ8YKZh8fvG8kXYz3L.8uKjZ9YJz7Yz9Zz9Zz9Zz9Zz9Zz9Zz9Zz
```

Si el hash es diferente, ejecuta:
```sql
UPDATE users 
SET password = '$2b$10$XqZ8YKZh8fvG8kXYz3L.8uKjZ9YJz7Yz9Zz9Zz9Zz9Zz9Zz9Zz9Zz'
WHERE email = 'admin@pos-erp.com';
```

### Token inválido o expirado

- Limpia el localStorage del navegador (F12 > Application > Local Storage > Clear)
- Intenta iniciar sesión nuevamente

---

## 📞 Contacto

Para más información, consulta la [Documentación del Proyecto](../README.md)
