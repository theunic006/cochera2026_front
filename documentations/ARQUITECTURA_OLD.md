# 🏗️ Arquitectura React Recomendada para Mejor Rendimiento

## 📋 Índice
1. [Estructura de Carpetas](#estructura-de-carpetas)
2. [Patrón de Diseño Recomendado](#patrón-de-diseño-recomendado)
3. [Organización de Componentes](#organización-de-componentes)
4. [Manejo de Estado](#manejo-de-estado)
5. [Servicios y APIs](#servicios-y-apis)
6. [Hooks Personalizados](#hooks-personalizados)
7. [Optimizaciones de Performance](#optimizaciones-de-performance)

---

## 📁 Estructura de Carpetas Recomendada

```
src/
├── assets/                    # Recursos estáticos (imágenes, fonts, etc.)
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── components/                # Componentes reutilizables
│   ├── common/               # Componentes compartidos globalmente
│   │   ├── Button/
│   │   │   ├── Button.jsx
│   │   │   ├── Button.module.css
│   │   │   └── index.js
│   │   ├── Modal/
│   │   ├── Table/
│   │   └── index.js
│   │
│   └── [feature]/            # Componentes específicos por módulo
│       ├── [ComponentName]/
│       │   ├── [ComponentName].jsx
│       │   ├── [ComponentName].module.css
│       │   ├── [ComponentName].test.jsx
│       │   └── index.js
│       └── index.js
│
├── features/                  # Módulos de funcionalidad (RECOMENDADO)
│   ├── ingresos/
│   │   ├── components/       # Componentes específicos de ingresos
│   │   │   ├── IngresoForm/
│   │   │   ├── IngresoList/
│   │   │   └── TerminarModal/
│   │   ├── hooks/            # Hooks personalizados
│   │   │   ├── useIngreso.js
│   │   │   └── useIngresoCalculations.js
│   │   ├── services/         # Servicios API específicos
│   │   │   └── ingresoService.js
│   │   ├── utils/            # Utilidades específicas
│   │   │   └── calculations.js
│   │   └── index.js          # Exportaciones del módulo
│   │
│   ├── salidas/
│   ├── vehiculos/
│   └── usuarios/
│
├── hooks/                     # Custom hooks globales
│   ├── useAuth.js
│   ├── useApi.js
│   ├── useDebounce.js
│   └── index.js
│
├── services/                  # Servicios API globales
│   ├── api/
│   │   ├── client.js         # Instancia de axios configurada
│   │   └── interceptors.js
│   ├── ingresoService.js
│   ├── vehiculoService.js
│   └── index.js
│
├── context/                   # Contextos de React
│   ├── AuthContext.jsx
│   ├── ThemeContext.jsx
│   └── index.js
│
├── utils/                     # Utilidades y helpers globales
│   ├── constants.js          # Constantes
│   ├── formatters.js         # Funciones de formato
│   ├── validators.js         # Validaciones
│   └── CalValores.js
│
├── config/                    # Configuración
│   ├── api.config.js
│   ├── app.config.js
│   └── routes.config.js
│
├── routes/                    # Configuración de rutas
│   ├── ProtectedRoute.jsx
│   ├── routes.jsx
│   └── index.js
│
├── styles/                    # Estilos globales
│   ├── global.css
│   ├── variables.css
│   └── themes/
│
├── types/                     # TypeScript types (si usas TS)
│   ├── ingreso.types.ts
│   └── vehiculo.types.ts
│
├── App.jsx
├── main.jsx
└── index.css
```

---

## 🎯 Patrón de Diseño Recomendado

### 1. **Container/Presentational Pattern**

```javascript
// ❌ EVITAR: Todo en un componente
const IngresoList = () => {
  const [ingresos, setIngresos] = useState([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    fetchIngresos();
  }, []);
  
  const fetchIngresos = async () => {
    setLoading(true);
    const data = await ingresoService.getAll();
    setIngresos(data);
    setLoading(false);
  };
  
  return (
    <div>
      {loading ? <Spinner /> : <Table data={ingresos} />}
    </div>
  );
};

// ✅ MEJOR: Separar lógica de presentación
// Container (lógica)
const IngresoListContainer = () => {
  const { ingresos, loading, error, refetch } = useIngresos();
  
  return (
    <IngresoListView 
      ingresos={ingresos}
      loading={loading}
      error={error}
      onRefresh={refetch}
    />
  );
};

// Presentational (UI)
const IngresoListView = ({ ingresos, loading, error, onRefresh }) => {
  if (loading) return <Spinner />;
  if (error) return <ErrorMessage message={error} />;
  
  return (
    <div>
      <Button onClick={onRefresh}>Actualizar</Button>
      <Table data={ingresos} />
    </div>
  );
};
```

---

## 🧩 Organización de Componentes

### Estructura de un Componente

```javascript
// TerminarModal/TerminarModal.jsx

// 1️⃣ IMPORTS
// React y hooks
import React, { useState, useEffect, useCallback, useMemo } from 'react';

// Librerías de terceros
import { Modal, Button, message } from 'antd';
import { CarOutlined } from '@ant-design/icons';

// Hooks personalizados
import { useAuth } from '@/context/AuthContext';
import { useIngresoCalculations } from '../hooks/useIngresoCalculations';

// Servicios
import { ingresoService } from '@/services';

// Utilidades
import { formatCurrency, formatTime } from '@/utils/formatters';

// Componentes locales
import ConsultaSunat from '../ConsultaSunat';

// Estilos
import styles from './TerminarModal.module.css';

// 2️⃣ TIPOS/INTERFACES (si usas TypeScript)
// interface TerminarModalProps { ... }

// 3️⃣ CONSTANTES LOCALES
const PAYMENT_TYPES = {
  EFECTIVO: 'Efectivo',
  YAPE: 'Yape',
  TARJETA: 'Tarjeta'
};

// 4️⃣ COMPONENTE
const TerminarModal = ({ visible, onCancel, ingreso, ...props }) => {
  // 4.1 Hooks de estado
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // 4.2 Hooks de contexto
  const { user } = useAuth();
  
  // 4.3 Custom hooks
  const { total, tiempo, vehiculo } = useIngresoCalculations(ingreso);
  
  // 4.4 Valores calculados (useMemo)
  const precioFormateado = useMemo(
    () => formatCurrency(total),
    [total]
  );
  
  // 4.5 Efectos (useEffect)
  useEffect(() => {
    if (visible) {
      console.log('Modal abierto');
    }
  }, [visible]);
  
  // 4.6 Handlers (useCallback)
  const handlePago = useCallback(async (tipoPago) => {
    try {
      setLoading(true);
      await ingresoService.registrarPago(ingreso.id, tipoPago);
      message.success('Pago registrado');
      onCancel();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [ingreso, onCancel]);
  
  // 4.7 Early returns
  if (!ingreso) return null;
  
  // 4.8 Render
  return (
    <Modal visible={visible} onCancel={onCancel}>
      {/* ... JSX ... */}
    </Modal>
  );
};

// 5️⃣ EXPORTACIÓN
export default TerminarModal;
```

---

## 🎣 Hooks Personalizados (Custom Hooks)

### Ejemplo: useIngresoCalculations

```javascript
// hooks/useIngresoCalculations.js

import { useMemo } from 'react';
import { calcularTiempoEstadiaConTolerancia } from '@/utils/CalValores';

export const useIngresoCalculations = (ingreso, tolerancia = null) => {
  return useMemo(() => {
    if (!ingreso) return null;
    
    const vehiculo = ingreso.vehiculo || {};
    const tipoVehiculo = vehiculo.tipo_vehiculo || {};
    
    const tiempoObj = calcularTiempoEstadiaConTolerancia(
      ingreso.fecha_ingreso,
      ingreso.hora_ingreso,
      tolerancia
    );
    
    const precioHora = tipoVehiculo.valor || 0;
    const fracciones = tiempoObj.fracciones;
    const total = precioHora * (fracciones > 0 ? fracciones : 1);
    
    return {
      vehiculo,
      tipoVehiculo,
      tiempo: tiempoObj.texto,
      tiempoHoras: tiempoObj.horas,
      tiempoMinutos: tiempoObj.minutos,
      fracciones,
      precioHora,
      total,
      horaSalida: new Date().toLocaleTimeString('es-PE', { hour12: false })
    };
  }, [ingreso, tolerancia]);
};
```

### Ejemplo: useIngresos (data fetching)

```javascript
// hooks/useIngresos.js

import { useState, useEffect, useCallback } from 'react';
import { ingresoService } from '@/services';

export const useIngresos = (autoFetch = true) => {
  const [ingresos, setIngresos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const fetchIngresos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ingresoService.getAll();
      setIngresos(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching ingresos:', err);
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    if (autoFetch) {
      fetchIngresos();
    }
  }, [autoFetch, fetchIngresos]);
  
  const addIngreso = useCallback(async (ingresoData) => {
    try {
      const newIngreso = await ingresoService.create(ingresoData);
      setIngresos(prev => [...prev, newIngreso]);
      return { success: true, data: newIngreso };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);
  
  const deleteIngreso = useCallback(async (id) => {
    try {
      await ingresoService.delete(id);
      setIngresos(prev => prev.filter(ing => ing.id !== id));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);
  
  return {
    ingresos,
    loading,
    error,
    refetch: fetchIngresos,
    addIngreso,
    deleteIngreso
  };
};
```

---

## 🔧 Servicios y APIs

### Configuración de Axios (Client Base)

```javascript
// services/api/client.js

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 30000
});

// Interceptor de Request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Interceptor de Response
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', error.response?.data || error.message);
    
    // Manejo de errores comunes
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
```

### Servicio Específico

```javascript
// services/ingresoService.js

import apiClient from './api/client';

class IngresoService {
  // Obtener todos los ingresos
  async getAll() {
    try {
      const response = await apiClient.get('/ingresos');
      return response.data.data || response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener ingresos');
    }
  }
  
  // Crear ingreso
  async create(ingresoData) {
    try {
      const response = await apiClient.post('/ingresos', ingresoData);
      return response.data.data || response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al crear ingreso');
    }
  }
  
  // Registrar salida/pago
  async registrarSalida(id, data) {
    try {
      console.group('📤 Registrando Salida');
      console.log('ID:', id);
      console.log('Datos a enviar:', data);
      console.groupEnd();
      
      const response = await apiClient.delete(`/ingresos/${id}`, { data });
      return response.data;
    } catch (error) {
      console.error('❌ Error en registrarSalida:', error);
      throw new Error(error.response?.data?.message || 'Error al registrar salida');
    }
  }
  
  // Método con validación de datos
  async registrarPago(id, tipoPago, tiempo, precio) {
    // Validaciones
    if (!id) throw new Error('ID de ingreso requerido');
    if (!tipoPago) throw new Error('Tipo de pago requerido');
    if (!tiempo) throw new Error('Tiempo de estadía requerido');
    if (precio <= 0) throw new Error('Precio debe ser mayor a 0');
    
    const payload = {
      tiempo,
      precio,
      tipo_pago: tipoPago.toUpperCase()
    };
    
    console.log('💾 Guardando pago:', payload);
    
    return this.registrarSalida(id, payload);
  }
}

export const ingresoService = new IngresoService();
export default ingresoService;
```

---

## 💾 Manejo de Estado

### Opción 1: Context API (Estado Global Simple)

```javascript
// context/IngresoContext.jsx

import React, { createContext, useContext, useState, useCallback } from 'react';
import { ingresoService } from '@/services';

const IngresoContext = createContext(null);

export const IngresoProvider = ({ children }) => {
  const [ingresos, setIngresos] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const fetchIngresos = useCallback(async () => {
    setLoading(true);
    try {
      const data = await ingresoService.getAll();
      setIngresos(data);
    } finally {
      setLoading(false);
    }
  }, []);
  
  const addIngreso = useCallback((ingreso) => {
    setIngresos(prev => [...prev, ingreso]);
  }, []);
  
  const value = {
    ingresos,
    loading,
    fetchIngresos,
    addIngreso
  };
  
  return (
    <IngresoContext.Provider value={value}>
      {children}
    </IngresoContext.Provider>
  );
};

export const useIngresoContext = () => {
  const context = useContext(IngresoContext);
  if (!context) {
    throw new Error('useIngresoContext debe usarse dentro de IngresoProvider');
  }
  return context;
};
```

### Opción 2: Zustand (Recomendado para estado complejo)

```javascript
// stores/ingresoStore.js

import { create } from 'zustand';
import { ingresoService } from '@/services';

export const useIngresoStore = create((set, get) => ({
  // Estado
  ingresos: [],
  loading: false,
  error: null,
  
  // Acciones
  fetchIngresos: async () => {
    set({ loading: true, error: null });
    try {
      const data = await ingresoService.getAll();
      set({ ingresos: data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
  
  addIngreso: (ingreso) => {
    set(state => ({
      ingresos: [...state.ingresos, ingreso]
    }));
  },
  
  removeIngreso: (id) => {
    set(state => ({
      ingresos: state.ingresos.filter(ing => ing.id !== id)
    }));
  },
  
  clearError: () => set({ error: null })
}));

// Uso en componente
const IngresoList = () => {
  const { ingresos, loading, fetchIngresos } = useIngresoStore();
  
  useEffect(() => {
    fetchIngresos();
  }, [fetchIngresos]);
  
  return (
    <div>
      {loading ? <Spinner /> : <Table data={ingresos} />}
    </div>
  );
};
```

---

## ⚡ Optimizaciones de Performance

### 1. Code Splitting y Lazy Loading

```javascript
// App.jsx
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Lazy loading de componentes pesados
const IngresoList = lazy(() => import('./features/ingresos/components/IngresoList'));
const Dashboard = lazy(() => import('./features/dashboard/Dashboard'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/ingresos" element={<IngresoList />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
```

### 2. Memoización con React.memo

```javascript
// ✅ Memoizar componentes que no cambian frecuentemente
const IngresoCard = React.memo(({ ingreso, onDelete }) => {
  return (
    <div className="card">
      <h3>{ingreso.vehiculo.placa}</h3>
      <button onClick={() => onDelete(ingreso.id)}>Eliminar</button>
    </div>
  );
}, (prevProps, nextProps) => {
  // Solo re-renderizar si el ID cambia
  return prevProps.ingreso.id === nextProps.ingreso.id;
});
```

### 3. Virtualización para Listas Largas

```javascript
import { FixedSizeList } from 'react-window';

const IngresoList = ({ ingresos }) => {
  const Row = ({ index, style }) => (
    <div style={style}>
      <IngresoCard ingreso={ingresos[index]} />
    </div>
  );
  
  return (
    <FixedSizeList
      height={600}
      itemCount={ingresos.length}
      itemSize={100}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  );
};
```

### 4. Debounce en Búsquedas

```javascript
// hooks/useDebounce.js
import { useState, useEffect } from 'react';

export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => clearTimeout(handler);
  }, [value, delay]);
  
  return debouncedValue;
};

// Uso
const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);
  
  useEffect(() => {
    if (debouncedSearch) {
      // Realizar búsqueda
      searchIngresos(debouncedSearch);
    }
  }, [debouncedSearch]);
  
  return (
    <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Buscar..."
    />
  );
};
```

---

## 📊 Flujo de Datos Recomendado

```
┌─────────────────────────────────────────┐
│         USER INTERACTION                │
│         (Click, Input, etc.)            │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│         COMPONENT HANDLER               │
│      (handlePago, handleSubmit)         │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│         CUSTOM HOOK (opcional)          │
│    (useIngresos, useCalculations)       │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│            SERVICE LAYER                │
│      (ingresoService.create())          │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│            API CLIENT                   │
│      (axios, fetch, etc.)               │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│         BACKEND API                     │
│      (Laravel, Express, etc.)           │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│         RESPONSE HANDLING               │
│      (Success/Error)                    │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│         STATE UPDATE                    │
│      (setState, Context, Store)         │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│         RE-RENDER UI                    │
│      (React DOM update)                 │
└─────────────────────────────────────────┘
```

---

## 🎯 Plan de Migración para tu Proyecto

### Fase 1: Reorganización Básica (1-2 días)
1. ✅ Crear carpeta `hooks/` y mover hooks personalizados
2. ✅ Crear `services/api/client.js` con configuración de axios
3. ✅ Agregar console.logs en servicios para debugging
4. ✅ Separar constantes en archivos separados

### Fase 2: Optimización de Componentes (2-3 días)
1. ✅ Convertir componentes grandes en Container/Presentational
2. ✅ Crear custom hooks para lógica reutilizable
3. ✅ Implementar useMemo y useCallback en componentes críticos
4. ✅ Agregar React.memo a componentes de lista

### Fase 3: Arquitectura Modular (3-5 días)
1. ✅ Migrar a estructura `features/`
2. ✅ Implementar Zustand o mejorar Context API
3. ✅ Code splitting con lazy loading
4. ✅ Virtualización de listas largas

---

## 📚 Recursos Recomendados

- [React Docs - Hooks](https://react.dev/reference/react)
- [Patterns.dev - React Patterns](https://patterns.dev/)
- [Kent C. Dodds - Application State Management](https://kentcdodds.com/blog/application-state-management-with-react)
- [React Performance](https://react.dev/learn/render-and-commit)

---

**¡Tu proyecto tendrá mejor rendimiento, será más mantenible y escalable!** 🚀
