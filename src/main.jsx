import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@ant-design/v5-patch-for-react-19' // Parche de compatibilidad para React 19
import './index.css'
import App from './App.jsx'
import './utils/axios.js' // Configuración de axios

// Manejo de errores globales para React 19
window.addEventListener('error', (event) => {
  console.error('Error global capturado:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Promesa rechazada no controlada:', event.reason);
});

const container = document.getElementById('root');
if (!container) {
  throw new Error('No se pudo encontrar el elemento root');
}

const root = createRoot(container);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
)
