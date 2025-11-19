import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  base: '/Portafolio/',
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks - separate React and related libraries
          'react-vendor': ['react', 'react-dom', 'react-i18next', 'i18next'],

          // UI components chunk
          'ui-vendor': [
            'framer-motion',
            'lucide-react',
            '@radix-ui/react-accordion',
            '@radix-ui/react-avatar',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-tabs',
          ],

          // Charts library
          'charts': ['recharts'],

          // 3D libraries
          'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],

          // Map libraries
          'map-vendor': ['leaflet', 'react-leaflet'],
        },
      },
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    // Enable minification
    minify: 'esbuild',
  },
  // Performance optimizations
  optimizeDeps: {
    include: ['react', 'react-dom', 'framer-motion'],
  },
});
