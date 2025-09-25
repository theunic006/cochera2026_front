import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@ant-design/v5-patch-for-react-19' // Parche de compatibilidad para React 19
import './index.css'
import App from './App.jsx'
import './utils/axios.js' // Configuración de axios

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
