# 🚀 Guía Rápida de Deploy a GitHub Pages

## Pasos para Publicar tu Portafolio

### 1️⃣ Crear Repositorio en GitHub

1. Ve a [github.com](https://github.com) e inicia sesión
2. Click en el botón **"+"** en la esquina superior derecha
3. Selecciona **"New repository"**
4. Configura tu repositorio:
   - **Repository name**: `portafolio` (o el nombre que prefieras)
   - **Description**: "Mi portafolio personal con mapa LCZ de CDMX"
   - **Visibility**: Public
   - **NO marques** "Initialize this repository with a README"
5. Click en **"Create repository"**

### 2️⃣ Conectar tu Proyecto Local con GitHub

Abre la terminal en la carpeta de tu proyecto y ejecuta:

```bash
# Agregar el repositorio remoto (reemplaza [TU-USUARIO] con tu nombre de usuario de GitHub)
git remote add origin https://github.com/[TU-USUARIO]/portafolio.git

# Verificar que se agregó correctamente
git remote -v
```

### 3️⃣ Hacer el Primer Commit

```bash
# Agregar todos los archivos
git add .

# Crear el commit
git commit -m "Initial commit: Portafolio personal con mapa LCZ"

# Renombrar la rama a 'main' si es necesario
git branch -M main
```

### 4️⃣ Subir el Código a GitHub

```bash
# Subir el código
git push -u origin main
```

### 5️⃣ Configurar GitHub Pages

1. Ve a tu repositorio en GitHub
2. Click en **Settings** (Configuración)
3. En el menú lateral, click en **Pages**
4. En **Source**, selecciona:
   - **GitHub Actions** (NO "Deploy from a branch")
5. Guarda los cambios

### 6️⃣ Esperar el Deploy Automático

1. Ve a la pestaña **Actions** en tu repositorio
2. Verás un workflow ejecutándose llamado **"Deploy to GitHub Pages"**
3. Espera a que termine (tarda 2-3 minutos)
4. Una vez completado, verás un ✅ verde

### 7️⃣ Acceder a tu Portafolio

Tu portafolio estará disponible en:
```
https://[TU-USUARIO].github.io/portafolio
```

## 📝 Actualizar tu Portafolio

Cada vez que hagas cambios y quieras actualizarlos:

```bash
# 1. Agregar cambios
git add .

# 2. Crear commit con mensaje descriptivo
git commit -m "Descripción de tus cambios"

# 3. Subir a GitHub
git push

# El deploy se ejecutará automáticamente
```

## 🔧 Solución de Problemas

### Error: "fatal: remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/[TU-USUARIO]/portafolio.git
```

### Error: "GitHub Pages site is not available"
- Espera 5-10 minutos, a veces tarda en propagarse
- Verifica que el workflow en Actions haya terminado correctamente
- Asegúrate de que en Settings → Pages hayas seleccionado "GitHub Actions"

### Error en el Build
- Revisa la pestaña "Actions" para ver el error específico
- Usualmente son dependencias faltantes o errores de TypeScript

## ✅ Checklist Final

Antes de hacer el deploy, asegúrate de:

- [ ] Tu foto de perfil está en `public/profile-photo.jpg`
- [ ] Has actualizado tus datos personales en `src/locales/es.json`
- [ ] Has probado el proyecto localmente con `npm run dev`
- [ ] No hay errores en `npm run build`
- [ ] Has actualizado el README con tu nombre de usuario de GitHub

## 🎯 Personalizar el Dominio (Opcional)

Si tienes un dominio personalizado:

1. En Settings → Pages, ingresa tu dominio en "Custom domain"
2. Crea un archivo `public/CNAME` con tu dominio:
   ```
   tudominio.com
   ```
3. Configura los DNS de tu dominio apuntando a GitHub Pages

## 📞 Soporte

Si tienes problemas:
1. Revisa la documentación oficial: https://docs.github.com/en/pages
2. Verifica los logs en la pestaña Actions
3. Busca el error específico en Google o Stack Overflow

---

¡Listo! Tu portafolio ya está en línea 🎉
