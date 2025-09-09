// vite.config.js
// Este archivo configura Vite, la herramienta de construcción y servidor de desarrollo para el proyecto.

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // Importa el plugin de React para Vite

// https://vitejs.dev/config/
// Exporta la configuración por defecto de Vite.
export default defineConfig({
  // Define los plugins que Vite utilizará.
  plugins: [
    // Habilita el soporte para React, incluyendo Fast Refresh.
    react(),
  ],
})