// src/App.jsx
// Este archivo define el componente principal de la aplicación, 'App'.

import { useState } from 'react' // Importa el hook 'useState' de React para manejar el estado.
import reactLogo from './assets/react.svg' // Importa el logo de React.
import viteLogo from '/vite.svg' // Importa el logo de Vite.
import './App.css' // Importa los estilos CSS específicos para este componente.

function App() {
  // Declara una variable de estado 'count' y una función 'setCount' para actualizarla.
  // El valor inicial de 'count' es 0.
  const [count, setCount] = useState(0)

  return (
    // Fragmento de React para agrupar múltiples elementos sin añadir un nodo extra al DOM.
    <>
      <div>
        {/* Enlace al sitio web de Vite */}
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        {/* Enlace al sitio web de React */}
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      {/* Título principal de la aplicación */}
      <h1>Vite + React</h1>
      {/* Contenedor para el botón y el párrafo de instrucciones */}
      <div className="card">
        {/* Botón que incrementa el contador al hacer clic */}
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        {/* Párrafo con instrucciones para probar Hot Module Replacement (HMR) */}
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      {/* Párrafo con instrucciones para aprender más sobre Vite y React */}
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

// Exporta el componente 'App' para que pueda ser utilizado en otras partes de la aplicación.
export default App