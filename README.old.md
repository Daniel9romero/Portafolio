# 🌍 Portafolio Personal - José Martínez

[![Deploy to GitHub Pages](https://github.com/[TU-USUARIO]/portafolio/workflows/Deploy%20to%20GitHub%20Pages/badge.svg)](https://github.com/[TU-USUARIO]/portafolio/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> Portafolio personal interactivo con visualización de mapas LCZ (Local Climate Zones) de la Ciudad de México

## 🚀 Demo

Visita el portafolio en vivo: **[https://[TU-USUARIO].github.io/portafolio](https://[TU-USUARIO].github.io/portafolio)**

## ✨ Características

- 🎨 **Diseño Moderno**: Interface limpia y profesional con animaciones suaves
- 🌐 **Multiidioma**: Soporte para Español, Inglés y Portugués (i18n)
- 🗺️ **Mapa LCZ Interactivo**: Visualización de clasificación de zonas climáticas de CDMX
- 🎭 **Avatar 3D**: Modelo 3D interactivo con rotación
- 📱 **Responsive**: Optimizado para dispositivos móviles, tablets y desktop
- 🎯 **Performance**: Carga rápida y optimizada con Vite
- 🌙 **Modo Oscuro**: Soporte para tema claro/oscuro

## 🛠️ Tecnologías

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **3D Graphics**: Three.js + React Three Fiber
- **Maps**: Leaflet + React Leaflet
- **UI Components**: Radix UI
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod
- **Internationalization**: i18next

## 📦 Instalación

### Prerequisitos

- Node.js 20.x o superior
- npm o pnpm

### Pasos

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/[TU-USUARIO]/portafolio.git
   cd portafolio
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   # o
   pnpm install
   ```

3. **Iniciar servidor de desarrollo**
   ```bash
   npm run dev
   ```

4. **Abrir en el navegador**
   ```
   http://localhost:5173
   ```

## 🏗️ Build para Producción

```bash
npm run build
```

Los archivos compilados estarán en la carpeta `dist/`

## 🚀 Deploy a GitHub Pages

### Opción 1: Automático con GitHub Actions

1. **Crear repositorio en GitHub**
   ```bash
   git remote add origin https://github.com/[TU-USUARIO]/portafolio.git
   ```

2. **Habilitar GitHub Pages**
   - Ve a Settings → Pages
   - Source: **GitHub Actions**

3. **Push al repositorio**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push -u origin main
   ```

4. **El deploy es automático**
   - GitHub Actions construirá y desplegará automáticamente
   - Visita: `https://[TU-USUARIO].github.io/portafolio`

### Opción 2: Manual con gh-pages

```bash
npm run deploy
```

## 📂 Estructura del Proyecto

```
portafolio/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions workflow
├── public/
│   ├── profile-photo.jpg       # Tu foto de perfil
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── ui/                 # Componentes UI reutilizables
│   │   ├── Avatar3D.tsx        # Avatar 3D interactivo
│   │   ├── LCZMap.tsx          # Mapa de zonas climáticas
│   │   └── ProfilePhoto.tsx    # Componente de foto de perfil
│   ├── locales/
│   │   ├── es.json             # Traducciones español
│   │   ├── en.json             # Traducciones inglés
│   │   └── pt.json             # Traducciones portugués
│   ├── App.tsx                 # Componente principal
│   ├── main.tsx                # Punto de entrada
│   └── i18n.ts                 # Configuración i18n
├── index.html
├── package.json
├── vite.config.ts
└── README.md
```

## 🎨 Personalización

### Cambiar Foto de Perfil

Reemplaza el archivo `public/profile-photo.jpg` con tu propia foto.

### Actualizar Información Personal

Edita los archivos de traducción en `src/locales/`:
- `es.json` - Español
- `en.json` - Inglés
- `pt.json` - Portugués

### Modificar Datos del Mapa LCZ

Edita el archivo `src/components/LCZMap.tsx` y actualiza los datos de las zonas:

```typescript
const cdmxZones = [
  {
    name: 'Cuauhtémoc',
    lcz: 2,
    accuracy: 85.2,
    lat: 19.4326,
    lng: -99.1332
  },
  // ... más zonas
];
```

## 📊 Datos LCZ

El mapa incluye visualización de **Local Climate Zones (LCZ)** para la Ciudad de México basado en clasificación de 17 clases (2023-2025).

### Tipos LCZ:
- **1-10**: Zonas construidas (edificios, densidad urbana)
- **A-G**: Zonas naturales (vegetación, cuerpos de agua)

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 👤 Autor

**José Martínez**

- GitHub: [@[TU-USUARIO]](https://github.com/[TU-USUARIO])
- LinkedIn: [Tu LinkedIn]
- Email: tu-email@ejemplo.com

## 🙏 Agradecimientos

- [Vite](https://vitejs.dev/) - Build tool ultrarrápido
- [React](https://react.dev/) - Biblioteca UI
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS utility-first
- [Radix UI](https://www.radix-ui.com/) - Componentes UI accesibles
- [Three.js](https://threejs.org/) - Biblioteca 3D
- [Leaflet](https://leafletjs.com/) - Biblioteca de mapas

## 📈 Roadmap

- [ ] Integrar más proyectos al portafolio
- [ ] Añadir blog personal
- [ ] Conectar con API de datos climáticos en tiempo real
- [ ] Mejorar visualización 3D del mapa LCZ
- [ ] Añadir sección de contacto con formulario funcional

---

⭐ **Si te gusta este proyecto, dale una estrella en GitHub!**
