# 📤 Cómo Subir el Proyecto a GitHub

## ✅ Estado Actual

El repositorio Git ya está inicializado y el commit inicial ha sido creado con todos los archivos del proyecto.

```
✓ Git inicializado
✓ Archivos agregados al stage
✓ Commit inicial creado
✓ Rama main configurada
✓ Rama develop creada
```

## 🚀 Pasos para Subir a GitHub

### Opción 1: Crear Repositorio desde GitHub.com (Recomendado)

1. **Ve a GitHub.com:**
   - Abre tu navegador y ve a https://github.com
   - Inicia sesión con tu cuenta

2. **Crea un Nuevo Repositorio:**
   - Haz clic en el botón "+" en la esquina superior derecha
   - Selecciona "New repository"
   
3. **Configuración del Repositorio:**
   - **Repository name:** `pos-erp-system`
   - **Description:** "Sistema POS ERP con gestión de inventario, ventas, cartera y reportes"
   - **Visibility:** Elige "Public" o "Private" según tus necesidades
   - ⚠️ **IMPORTANTE:** NO marques "Add a README file"
   - ⚠️ **IMPORTANTE:** NO agregues .gitignore ni LICENSE (ya los tenemos)
   - Haz clic en "Create repository"

4. **Conectar y Subir el Código:**
   
   Después de crear el repositorio, GitHub te mostrará instrucciones. Ejecuta estos comandos en tu terminal desde la carpeta `pos-erp-system`:

   ```bash
   # Agrega el repositorio remoto (CAMBIA tu-usuario por tu nombre de usuario de GitHub)
   git remote add origin https://github.com/tu-usuario/pos-erp-system.git
   
   # Sube el código a GitHub
   git push -u origin main
   
   # Sube también la rama develop
   git checkout develop
   git push -u origin develop
   git checkout main
   ```

### Opción 2: Usar GitHub CLI (gh)

Si tienes GitHub CLI instalado:

```bash
# Desde la carpeta pos-erp-system
gh repo create pos-erp-system --public --source=. --remote=origin --push

# O si prefieres privado
gh repo create pos-erp-system --private --source=. --remote=origin --push

# Sube la rama develop
git checkout develop
git push -u origin develop
git checkout main
```

### Opción 3: Usar GitHub Desktop

1. Abre GitHub Desktop
2. Selecciona "Add" → "Add Existing Repository"
3. Navega hasta la carpeta `pos-erp-system`
4. Haz clic en "Publish repository"
5. Completa los detalles y haz clic en "Publish Repository"

## 🔐 Autenticación

Si te pide credenciales al hacer `git push`, tienes dos opciones:

### Opción A: Token de Acceso Personal (Recomendado)

1. Ve a GitHub.com → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Genera un nuevo token con permisos de "repo"
3. Copia el token
4. Cuando Git te pida la contraseña, usa el token en lugar de tu contraseña

### Opción B: SSH

1. Configura SSH keys en GitHub (más seguro para uso frecuente)
2. Usa la URL SSH en lugar de HTTPS:
   ```bash
   git remote set-url origin git@github.com:tu-usuario/pos-erp-system.git
   ```

## 📋 Verificación

Después de subir el código, verifica en GitHub:

- ✓ Todos los archivos están presentes
- ✓ El README.md se muestra correctamente
- ✓ Las dos ramas (main y develop) están disponibles
- ✓ El archivo .gitignore funciona (no se subieron node_modules ni .env)

## 🎯 Próximos Pasos

Una vez subido el proyecto a GitHub:

1. **Configurar Reglas de Protección:**
   - Ve a Settings → Branches
   - Agrega regla de protección para `main`
   - Requiere pull request reviews antes de merge

2. **Configurar Secrets para GitHub Actions:**
   - Ve a Settings → Secrets and variables → Actions
   - Agrega los secrets necesarios para CI/CD

3. **Invitar Colaboradores:**
   - Ve a Settings → Collaborators
   - Invita a tu equipo

4. **Crear el Primer Issue:**
   - Crea issues para las siguientes tareas del proyecto

## 🆘 Problemas Comunes

### Error: "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/tu-usuario/pos-erp-system.git
```

### Error: "failed to push some refs"
```bash
git pull origin main --allow-unrelated-histories
git push -u origin main
```

### Error de autenticación
- Usa un Personal Access Token en lugar de tu contraseña
- O configura SSH keys

## 📞 Comandos Útiles

```bash
# Ver el estado del repositorio
git status

# Ver los remotos configurados
git remote -v

# Ver el historial de commits
git log --oneline

# Ver las ramas
git branch -a

# Cambiar de rama
git checkout develop
git checkout main
```

---

**Nota:** Recuerda nunca subir archivos `.env` con credenciales reales. Usa `.env.example` como plantilla.
