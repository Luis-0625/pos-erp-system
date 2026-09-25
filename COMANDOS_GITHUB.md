# 🚀 Comandos Exactos para Subir a GitHub

## ⚠️ IMPORTANTE: Ubicación del Proyecto

Tu proyecto está en: `C:\Users\LUIS TIC\Desktop\pos-erp-system`

## 📝 Pasos Exactos

### 1️⃣ Abre una Terminal en VS Code

Presiona: **Ctrl + Shift + `** (acento grave)

O ve a: **Terminal → New Terminal**

### 2️⃣ Verifica que Git está inicializado

Ejecuta este comando para ver el estado:

```powershell
cd "C:\Users\LUIS TIC\Desktop\pos-erp-system"
git status
```

Deberías ver algo como:
```
On branch main
nothing to commit, working tree clean
```

### 3️⃣ Crea el Repositorio en GitHub

**ANTES de ejecutar comandos**, haz esto:

1. Ve a https://github.com/new
2. **Repository name:** `pos-erp-system`
3. **Description:** "Sistema POS ERP con gestión de inventario, ventas, cartera y reportes"
4. **Visibility:** Público o Privado (tú decides)
5. ⚠️ **NO marques** "Add a README file"
6. ⚠️ **NO agregues** .gitignore
7. ⚠️ **NO agregues** LICENSE
8. Haz clic en **"Create repository"**

### 4️⃣ Conecta tu Proyecto Local con GitHub

**IMPORTANTE:** Reemplaza `TU-USUARIO` con tu nombre de usuario de GitHub

En la terminal de VS Code, ejecuta estos comandos **UNO POR UNO**:

```powershell
# 1. Navega al proyecto (si no estás ahí)
cd "C:\Users\LUIS TIC\Desktop\pos-erp-system"

# 2. Agrega el repositorio remoto (CAMBIA TU-USUARIO)
git remote add origin https://github.com/TU-USUARIO/pos-erp-system.git

# 3. Verifica que el remoto se agregó correctamente
git remote -v

# 4. Sube el código a GitHub (rama main)
git push -u origin main

# 5. Sube también la rama develop
git push -u origin develop
```

### 5️⃣ Si te Pide Autenticación

GitHub ya no acepta contraseñas. Necesitas un **Personal Access Token**:

#### Opción A: Usar Token de Acceso Personal

1. Ve a: https://github.com/settings/tokens
2. Haz clic en "Generate new token" → "Generate new token (classic)"
3. **Note:** `POS ERP System`
4. **Expiration:** 90 días (o el tiempo que prefieras)
5. **Selecciona permisos:**
   - ✅ `repo` (todos los sub-permisos)
6. Haz clic en "Generate token"
7. **COPIA EL TOKEN** (solo se muestra una vez)
8. Cuando Git te pida credenciales:
   - **Username:** tu-usuario-github
   - **Password:** pega-el-token-aquí (no tu contraseña real)

#### Opción B: Usar GitHub CLI (más fácil)

Si tienes GitHub CLI instalado (`gh`):

```powershell
# Autenticarse
gh auth login

# Subir el repositorio
gh repo create pos-erp-system --public --source=. --remote=origin --push
```

### 6️⃣ Comandos Alternativos (si hay problemas)

Si los comandos anteriores dan error, intenta:

```powershell
# Si ya existe el remoto "origin"
git remote remove origin
git remote add origin https://github.com/TU-USUARIO/pos-erp-system.git

# Si necesitas forzar el push (usa con cuidado)
git push -u origin main --force

# Si la rama se llama "master" en lugar de "main"
git branch -M main
git push -u origin main
```

## ✅ Verificación Final

Después de ejecutar los comandos:

1. Ve a `https://github.com/TU-USUARIO/pos-erp-system`
2. Deberías ver todos tus archivos
3. Verifica que existan las ramas **main** y **develop**
4. El README.md debería mostrarse en la página principal

## 🔧 Solución de Problemas Comunes

### Error: "remote origin already exists"
```powershell
git remote remove origin
git remote add origin https://github.com/TU-USUARIO/pos-erp-system.git
```

### Error: "failed to push some refs"
```powershell
git pull origin main --allow-unrelated-histories
git push -u origin main
```

### Error: "authentication failed"
- Asegúrate de usar un **Personal Access Token**, no tu contraseña
- O usa `gh auth login` con GitHub CLI

### No puedo hacer cd a la carpeta
La carpeta YA EXISTE en tu Desktop. No necesitas crearla ni navegar con `cd` si:
- Abres VS Code
- Vas a File → Open Folder
- Seleccionas `C:\Users\LUIS TIC\Desktop\pos-erp-system`
- Usas la terminal integrada de VS Code (Ctrl + Shift + `)

## 📱 Método Más Fácil: GitHub Desktop

Si prefieres una interfaz gráfica:

1. Descarga GitHub Desktop: https://desktop.github.com/
2. Instálalo e inicia sesión
3. En GitHub Desktop: **File → Add Local Repository**
4. Selecciona: `C:\Users\LUIS TIC\Desktop\pos-erp-system`
5. Haz clic en **"Publish repository"**
6. Elige nombre, descripción y visibilidad
7. Haz clic en **"Publish Repository"**
8. ¡Listo! Tu código estará en GitHub

## 🎯 Resumen de la Ruta Correcta

```
Tu proyecto está aquí:
C:\Users\LUIS TIC\Desktop\pos-erp-system

Para navegar en PowerShell:
cd "C:\Users\LUIS TIC\Desktop\pos-erp-system"

O en la terminal de VS Code:
1. Abre VS Code
2. File → Open Folder
3. Selecciona: pos-erp-system del Desktop
4. Abre terminal integrada: Ctrl + Shift + `
5. Ya estarás en la carpeta correcta automáticamente
```

## 🌟 Recomendación

**La forma más fácil es:**

1. Abre VS Code
2. File → Open Folder → Selecciona `pos-erp-system` del Desktop
3. Abre la terminal integrada (Ctrl + Shift + `)
4. Ya estarás en la carpeta correcta
5. Ejecuta los comandos de git desde ahí

¡No necesitas hacer `cd` si abres la carpeta directamente en VS Code!
