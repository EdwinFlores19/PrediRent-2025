// src/main.jsx
// Este es el punto de entrada principal de la aplicación React.

import React from 'react' // Importa la librería React.
import ReactDOM from 'react-dom/client' // Importa ReactDOM para renderizar la aplicación en el DOM.
import App from './App.jsx' // Importa el componente principal de la aplicación.
import './index.css' // Importa los estilos CSS globales.

// Utiliza ReactDOM.createRoot para crear una raíz de React y renderizar la aplicación.
// El método getElementById('root') selecciona el elemento div con id="root" en index.html
ReactDOM.createRoot(document.getElementById('root')).render(
  // React.StrictMode es una herramienta para destacar problemas potenciales en una aplicación.
  // No renderiza ninguna UI visible. Activa advertencias y comprobaciones adicionales para sus descendientes.
  <React.StrictMode>
    {/* Renderiza el componente principal de la aplicación */}
    <App />
  </React.StrictMode>,
)