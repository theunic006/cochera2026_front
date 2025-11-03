# 🏗️ Arquitectura React - Sistema de Gestión de Cochera# 🏗️ Arquitectura React Recomendada para Mejor Rendimiento



## 📋 Índice## 📋 Índice

1. [Resumen del Proyecto](#resumen-del-proyecto)1. [Estructura de Carpetas](#estructura-de-carpetas)
2. [Arquitectura Hybrid Approach](#arquitectura-hybrid-approach)2. [Patrón de Diseño Recomendado](#patrón-de-diseño-recomendado)
3. [Estructura de Carpetas](#estructura-de-carpetas)3. [Organización de Componentes](#organización-de-componentes)
4. [Roadmap de Fases](#roadmap-de-fases)4. [Manejo de Estado](#manejo-de-estado)
5. [FASE 4: Atomic Design](#fase-4-atomic-design)5. [Servicios y APIs](#servicios-y-apis)
6. [Guías de Implementación](#guías-de-implementación)6. [Hooks Personalizados](#hooks-personalizados)
7. [Optimizaciones de Performance](#optimizaciones-de-performance)

---

---

## 🎯 Resumen del Proyecto

## 📁 Estructura de Carpetas Recomendada

**Sistema:** Gestión de Cochera (Parking Management)  

**Stack:** React 19 + Vite + Ant Design + Zustand + React Router  ```

**Arquitectura:** **Hybrid Approach** (Feature-Based + Atomic Design)  src/

**Estado Actual:** FASE 3 Completada ✅ | FASE 4 En Progreso 🔄├── assets/                    # Recursos estáticos (imágenes, fonts, etc.)

│   ├── images/

### **Métricas Actuales:**│   ├── icons/

- ✅ **Módulos transformados:** 3137│   └── fonts/
- ✅ **Build Time:** ~5s│
- ✅ **Features funcionales:** 15├── components/                # Componentes reutilizables
- ✅ **Stores Zustand:** 2 (Auth, Theme)│   ├── common/               # Componentes compartidos globalmente
- ✅ **Path Aliases:** 8 configurados│   │   ├── Button/
- ✅ **Lazy Loading:** 100%│   │   │   ├── Button.jsx

│   │   │   ├── Button.module.css

---│   │   │   └── index.js

│   │   ├── Modal/

## 🏛️ Arquitectura Hybrid Approach│   │   ├── Table/

│   │   └── index.js

### **¿Qué es Hybrid Approach?**│   │

│   └── [feature]/            # Componentes específicos por módulo

Es una arquitectura que **combina lo mejor** de:│       ├── [ComponentName]/

- 📦 **Feature-Based:** Organización por funcionalidad de negocio│       │   ├── [ComponentName].jsx

- 🔬 **Atomic Design:** Componentes reutilizables por tamaño/complejidad│       │   ├── [ComponentName].module.css

│       │   ├── [ComponentName].test.jsx

### **Filosofía:**│       │   └── index.js

│       └── index.js

```│

┌─────────────────────────────────────┐├── features/                  # Módulos de funcionalidad (RECOMENDADO)

│  COMPONENTS (Atomic Design)         │  🔬 Reutilizables, genéricos│   ├── ingresos/

│  - atoms/                           │     Sin lógica de negocio│   │   ├── components/       # Componentes específicos de ingresos

│  - molecules/                       │     Configurables por props│   │   │   ├── IngresoForm/

│  - organisms/                       │     Usados por features│   │   │   ├── IngresoList/

└─────────────────────────────────────┘│   │   │   └── TerminarModal/

              ↓ usa ↓│   │   ├── hooks/            # Hooks personalizados

┌─────────────────────────────────────┐│   │   │   ├── useIngreso.js

│  FEATURES (Feature-Based)           │  📦 Específicos de negocio│   │   │   └── useIngresoCalculations.js

│  - roles/                           │     Lógica de dominio│   │   ├── services/         # Servicios API específicos

│  - usuarios/                        │     Hooks y services propios│   │   │   └── ingresoService.js

│  - vehiculos/                       │     Usan componentes atómicos│   │   ├── utils/            # Utilidades específicas

└─────────────────────────────────────┘│   │   │   └── calculations.js

```│   │   └── index.js          # Exportaciones del módulo

│   │

### **Regla de Oro:**│   ├── salidas/

> **"Si un componente se usa en 2+ features, muévelo a `components/`"**│   ├── vehiculos/

│   └── usuarios/

---│

├── hooks/                     # Custom hooks globales

## 📁 Estructura de Carpetas Completa│   ├── useAuth.js

│   ├── useApi.js

```│   ├── useDebounce.js

cochera2025/frontend/│   └── index.js

├── public/│

│   └── vite.svg├── services/                  # Servicios API globales

││   ├── api/

├── src/│   │   ├── client.js         # Instancia de axios configurada

│   ││   │   └── interceptors.js

│   ├── components/                 # 🔬 ATOMIC DESIGN│   ├── ingresoService.js

│   │   ││   ├── vehiculoService.js

│   │   ├── atoms/                 # Componentes básicos (8-10)│   └── index.js

│   │   │   ├── Button/│

│   │   │   │   ├── Button.jsx├── context/                   # Contextos de React

│   │   │   │   ├── Button.module.css│   ├── AuthContext.jsx

│   │   │   │   └── index.js│   ├── ThemeContext.jsx

│   │   │   ├── Input/│   └── index.js

│   │   │   ├── Badge/│

│   │   │   ├── Icon/├── utils/                     # Utilidades y helpers globales

│   │   │   ├── Avatar/│   ├── constants.js          # Constantes

│   │   │   ├── Tag/│   ├── formatters.js         # Funciones de formato

│   │   │   ├── Divider/│   ├── validators.js         # Validaciones

│   │   │   ├── Tooltip/│   └── CalValores.js

│   │   │   └── index.js           # Barrel export│

│   │   │├── config/                    # Configuración

│   │   ├── molecules/             # Combinaciones simples (6-8)│   ├── api.config.js

│   │   │   ├── SearchBar/         # Input + Icon + Button│   ├── app.config.js

│   │   │   ├── FormField/         # Label + Input + Error│   └── routes.config.js

│   │   │   ├── EmptyState/        # Icon + Title + Description│

│   │   │   ├── PageHeader/        # Title + Breadcrumb + Actions├── routes/                    # Configuración de rutas

│   │   │   ├── ActionButtons/     # Edit + Delete buttons│   ├── ProtectedRoute.jsx

│   │   │   ├── StatusBadge/       # Badge con colores│   ├── routes.jsx

│   │   │   └── index.js│   └── index.js

│   │   ││

│   │   ├── organisms/             # Componentes complejos (3-5)├── styles/                    # Estilos globales

│   │   │   ├── DataTable/│   ├── global.css

│   │   │   │   ├── DataTable.jsx│   ├── variables.css

│   │   │   │   ├── TableToolbar.jsx│   └── themes/

│   │   │   │   ├── TablePagination.jsx│

│   │   │   │   ├── DataTable.module.css├── types/                     # TypeScript types (si usas TS)

│   │   │   │   └── index.js│   ├── ingreso.types.ts

│   │   │   ├── FormModal/│   └── vehiculo.types.ts

│   │   │   ├── ConfirmDialog/│

│   │   │   ├── FilterPanel/├── App.jsx

│   │   │   └── index.js├── main.jsx

│   │   │└── index.css

│   │   └── common/                # LEGACY (migrar gradualmente)```

│   │       ├── ErrorBoundaries.jsx

│   │       ├── LoadingStates.jsx---

│   │       └── TableBase.jsx      # → Migrar a organisms/DataTable

│   │## 🎯 Patrón de Diseño Recomendado

│   ├── features/                   # 📦 FEATURE-BASED (15 módulos)

│   │   │### 1. **Container/Presentational Pattern**

│   │   ├── auth/

│   │   │   ├── components/```javascript

│   │   │   │   ├── Login.jsx// ❌ EVITAR: Todo en un componente

│   │   │   │   └── Register.jsxconst IngresoList = () => {

│   │   │   ├── hooks/  const [ingresos, setIngresos] = useState([]);

│   │   │   │   └── useLogin.js  const [loading, setLoading] = useState(false);

│   │   │   ├── services/  

│   │   │   │   └── authService.js  useEffect(() => {

│   │   │   └── index.js    fetchIngresos();

│   │   │  }, []);

│   │   ├── roles/                 # 🎯 EJEMPLO COMPLETO  

│   │   │   ├── components/  const fetchIngresos = async () => {

│   │   │   │   ├── RoleList.jsx           # Usa DataTable    setLoading(true);

│   │   │   │   └── RoleFormFields.jsx     # Solo campos específicos    const data = await ingresoService.getAll();

│   │   │   ├── hooks/    setIngresos(data);

│   │   │   │   ├── useRoles.js            # Fetch + CRUD    setLoading(false);

│   │   │   │   └── useRoleForm.js         # Validación  };

│   │   │   ├── services/  

│   │   │   │   └── roleService.js  return (

│   │   │   └── index.js    <div>

│   │   │      {loading ? <Spinner /> : <Table data={ingresos} />}

│   │   ├── usuarios/    </div>

│   │   ├── vehiculos/  );

│   │   ├── ingresos/};

│   │   ├── salidas/

│   │   ├── propietarios/// ✅ MEJOR: Separar lógica de presentación

│   │   ├── empresas/// Container (lógica)

│   │   ├── reportes/const IngresoListContainer = () => {

│   │   ├── dashboard/  const { ingresos, loading, error, refetch } = useIngresos();

│   │   ├── perfil/  

│   │   ├── registros/  return (

│   │   ├── observaciones/    <IngresoListView 

│   │   ├── vehicleTypes/      ingresos={ingresos}

│   │   └── configuracion/      loading={loading}

│   │      error={error}

│   ├── stores/                     # 🗄️ ZUSTAND STORES      onRefresh={refetch}

│   │   ├── authStore.js           # Estado de autenticación    />

│   │   ├── themeStore.js          # Estado de tema  );

│   │   └── index.js};

│   │

│   ├── hooks/                      # 🎣 CUSTOM HOOKS GLOBALES// Presentational (UI)

│   │   ├── useAuthInfo.jsconst IngresoListView = ({ ingresos, loading, error, onRefresh }) => {

│   │   ├── useDebounce.js  if (loading) return <Spinner />;

│   │   ├── usePagination.js       # NUEVO en FASE 4  if (error) return <ErrorMessage message={error} />;

│   │   ├── useTableActions.js     # NUEVO en FASE 4  

│   │   └── index.js  return (

│   │    <div>

│   ├── services/                   # 🔧 API SERVICES      <Button onClick={onRefresh}>Actualizar</Button>

│   │   ├── api/      <Table data={ingresos} />

│   │   │   ├── client.js          # Instancia axios    </div>

│   │   │   └── interceptors.js  );

│   │   ├── roleService.js};

│   │   ├── userService.js```

│   │   ├── vehicleService.js

│   │   └── index.js---

│   │

│   ├── utils/                      # 🛠️ UTILIDADES## 🧩 Organización de Componentes

│   │   ├── axios.js               # TODO: Mover a services/api/

│   │   ├── CalValores.js### Estructura de un Componente

│   │   ├── preloadRoutes.js

│   │   ├── formatters.js          # NUEVO en FASE 4```javascript

│   │   └── validators.js          # NUEVO en FASE 4// TerminarModal/TerminarModal.jsx

│   │

│   ├── config/                     # ⚙️ CONFIGURACIÓN// 1️⃣ IMPORTS

│   │   ├── api.config.js          # NUEVO en FASE 4// React y hooks

│   │   ├── app.config.js          # NUEVO en FASE 4import React, { useState, useEffect, useCallback, useMemo } from 'react';

│   │   └── constants.js           # NUEVO en FASE 4

│   │// Librerías de terceros

│   ├── context/                    # 📡 REACT CONTEXT (legacy)import { Modal, Button, message } from 'antd';

│   │   └── RecaptchaContext.jsximport { CarOutlined } from '@ant-design/icons';

│   │

│   ├── App.jsx// Hooks personalizados

│   ├── main.jsximport { useAuth } from '@/context/AuthContext';

│   ├── App.cssimport { useIngresoCalculations } from '../hooks/useIngresoCalculations';

│   └── index.css

│// Servicios

├── documentations/import { ingresoService } from '@/services';

│   ├── ARQUITECTURA.md            # ← Este archivo

│   ├── FASE3_ANALISIS_FINAL.md// Utilidades

│   ├── FASE4_GUIA_ATOMIC.md       # NUEVOimport { formatCurrency, formatTime } from '@/utils/formatters';

│   └── ...

│// Componentes locales

├── package.jsonimport ConsultaSunat from '../ConsultaSunat';

├── vite.config.js

├── jsconfig.json// Estilos

└── README.mdimport styles from './TerminarModal.module.css';

```

// 2️⃣ TIPOS/INTERFACES (si usas TypeScript)

---// interface TerminarModalProps { ... }



## 🗺️ Roadmap de Fases// 3️⃣ CONSTANTES LOCALES

const PAYMENT_TYPES = {

### **✅ FASE 1: Preparación (COMPLETADA)**  EFECTIVO: 'Efectivo',

**Duración:** 1-2 semanas    YAPE: 'Yape',

**Estado:** ✅ 100% Completada  TARJETA: 'Tarjeta'

};

**Logros:**

- ✅ Proyecto creado con Vite + React 19// 4️⃣ COMPONENTE

- ✅ Ant Design 5 integradoconst TerminarModal = ({ visible, onCancel, ingreso, ...props }) => {

- ✅ React Router configurado  // 4.1 Hooks de estado

- ✅ Estructura de carpetas básica  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

---  

  // 4.2 Hooks de contexto

### **✅ FASE 2: Features Básicos (COMPLETADA)**  const { user } = useAuth();

**Duración:** 3-4 semanas    

**Estado:** ✅ 100% Completada  // 4.3 Custom hooks

  const { total, tiempo, vehiculo } = useIngresoCalculations(ingreso);

**Logros:**  

- ✅ 15 módulos funcionales implementados  // 4.4 Valores calculados (useMemo)

- ✅ CRUD completo en cada feature  const precioFormateado = useMemo(

- ✅ Servicios API para cada módulo    () => formatCurrency(total),

- ✅ Formularios con Ant Design    [total]

- ✅ Navegación entre módulos  );

  

**Módulos:**  // 4.5 Efectos (useEffect)

1. ✅ Auth (Login, Register)  useEffect(() => {

2. ✅ Roles    if (visible) {

3. ✅ Usuarios      console.log('Modal abierto');

4. ✅ Empresas    }

5. ✅ Vehículos  }, [visible]);

6. ✅ Tipos de Vehículo  

7. ✅ Propietarios  // 4.6 Handlers (useCallback)

8. ✅ Ingresos  const handlePago = useCallback(async (tipoPago) => {

9. ✅ Salidas    try {

10. ✅ Registros      setLoading(true);

11. ✅ Observaciones      await ingresoService.registrarPago(ingreso.id, tipoPago);

12. ✅ Reportes      message.success('Pago registrado');

13. ✅ Dashboard      onCancel();

14. ✅ Perfil    } catch (err) {

15. ✅ Configuración (Tolerancias)      setError(err.message);

    } finally {

---      setLoading(false);

    }

### **✅ FASE 3: Optimizaciones (COMPLETADA)**  }, [ingreso, onCancel]);

**Duración:** 1 semana    

**Estado:** ✅ 100% Completada  // 4.7 Early returns

  if (!ingreso) return null;

**Logros:**  

- ✅ **Zustand Migration:**  // 4.8 Render

  - AuthContext → authStore.js (220 líneas)  return (

  - ThemeContext → themeStore.js (150 líneas)    <Modal visible={visible} onCancel={onCancel}>

  - Redux DevTools integrado      {/* ... JSX ... */}

  - Persistencia en localStorage    </Modal>

  - 0 re-renders innecesarios  );

};

- ✅ **Path Aliases:**

  - 8 aliases configurados (@stores, @components, etc.)// 5️⃣ EXPORTACIÓN

  - vite.config.js actualizadoexport default TerminarModal;

  - jsconfig.json para IntelliSense```

  - 5 archivos principales actualizados

---

- ✅ **Build Optimization:**

  - 3137 módulos en 5.14s## 🎣 Hooks Personalizados (Custom Hooks)

  - Lazy loading 100%

  - Code splitting automático### Ejemplo: useIngresoCalculations

  - Gzip compression ~70%

```javascript

- ✅ **Virtualización:**// hooks/useIngresoCalculations.js

  - ⏭️ Omitida (paginación del servidor ya implementada)

import { useMemo } from 'react';

**Métricas Finales:**import { calcularTiempoEstadiaConTolerancia } from '@/utils/CalValores';

```

✅ Build Time: 5.14sexport const useIngresoCalculations = (ingreso, tolerancia = null) => {

✅ Módulos: 3137  return useMemo(() => {

✅ Errores: 0    if (!ingreso) return null;

✅ Chunk más grande: ingresos (69 KB)    

✅ Compresión gzip: ~70%    const vehiculo = ingreso.vehiculo || {};

```    const tipoVehiculo = vehiculo.tipo_vehiculo || {};

    

---    const tiempoObj = calcularTiempoEstadiaConTolerancia(

      ingreso.fecha_ingreso,

### **🔄 FASE 4: Atomic Design (EN CURSO)** 🚀      ingreso.hora_ingreso,

      tolerancia

**Duración:** 1-2 semanas      );

**Estado:** 🔄 0% → 100%      

**Objetivo:** Implementar Hybrid Approach con componentes atómicos reutilizables    const precioHora = tipoVehiculo.valor || 0;

    const fracciones = tiempoObj.fracciones;

---    const total = precioHora * (fracciones > 0 ? fracciones : 1);

    

#### **FASE 4A: Atomic Components Base**    return {

**Duración:** 3-4 días        vehiculo,

**Estado:** ⏳ Pendiente      tipoVehiculo,

      tiempo: tiempoObj.texto,

**Tareas:**      tiempoHoras: tiempoObj.horas,

      tiempoMinutos: tiempoObj.minutos,

**Día 1-2: Átomos (8 componentes)**      fracciones,

1. ⏳ Crear estructura `components/{atoms,molecules,organisms}/`      precioHora,

2. ⏳ Implementar Button (wrapper de Ant Design)      total,

3. ⏳ Implementar Input      horaSalida: new Date().toLocaleTimeString('es-PE', { hour12: false })

4. ⏳ Implementar Badge    };

5. ⏳ Implementar Icon  }, [ingreso, tolerancia]);

6. ⏳ Implementar Avatar};

7. ⏳ Implementar Tag```

8. ⏳ Implementar Divider

9. ⏳ Implementar Tooltip### Ejemplo: useIngresos (data fetching)



**Día 3: Moléculas (6 componentes)**```javascript

10. ⏳ Implementar SearchBar (Input + Icon + Button)// hooks/useIngresos.js

11. ⏳ Implementar FormField (Label + Input + Error)

12. ⏳ Implementar EmptyState (Icon + Title + Description)import { useState, useEffect, useCallback } from 'react';

13. ⏳ Implementar PageHeader (Title + Breadcrumb + Actions)import { ingresoService } from '@/services';

14. ⏳ Implementar ActionButtons (Edit + Delete)

15. ⏳ Implementar StatusBadgeexport const useIngresos = (autoFetch = true) => {

  const [ingresos, setIngresos] = useState([]);

**Día 4: Organismos (3 componentes)**  const [loading, setLoading] = useState(false);

16. ⏳ Implementar DataTable (tabla genérica con CRUD)  const [error, setError] = useState(null);

17. ⏳ Implementar FormModal (modal genérico)  

18. ⏳ Implementar ConfirmDialog  const fetchIngresos = useCallback(async () => {

    try {

**Entregables:**      setLoading(true);

- `components/atoms/` con 8 componentes      setError(null);

- `components/molecules/` con 6 componentes      const data = await ingresoService.getAll();

- `components/organisms/` con 3 componentes      setIngresos(data);

- Barrel exports (`index.js`) en cada carpeta    } catch (err) {

- Tests unitarios (opcional)      setError(err.message);

      console.error('Error fetching ingresos:', err);

**Métricas Esperadas:**    } finally {

- 17 componentes reutilizables creados      setLoading(false);

- 100% tipados con PropTypes    }

- 0 dependencias de features  }, []);

  

---  useEffect(() => {

    if (autoFetch) {

#### **FASE 4B: Refactor de Roles (Piloto)**      fetchIngresos();

**Duración:** 1-2 días      }

**Estado:** ⏳ Pendiente  }, [autoFetch, fetchIngresos]);

  

**Objetivo:** Refactorizar el módulo de Roles como PILOTO para replicar en otros módulos.  const addIngreso = useCallback(async (ingresoData) => {

    try {

**Tareas:**      const newIngreso = await ingresoService.create(ingresoData);

      setIngresos(prev => [...prev, newIngreso]);

**Día 1:**      return { success: true, data: newIngreso };

1. ⏳ Crear `features/roles/hooks/useRoles.js`    } catch (err) {

   - Mover lógica de fetch a hook      return { success: false, error: err.message };

   - Implementar CRUD operations    }

   - Retornar `{ roles, loading, createRole, updateRole, deleteRole }`  }, []);

  

2. ⏳ Crear `features/roles/components/RoleFormFields.jsx`  const deleteIngreso = useCallback(async (id) => {

   - Extraer solo campos específicos de rol    try {

   - Props: `initialValues`, `onSubmit`      await ingresoService.delete(id);

   - Sin lógica de modal      setIngresos(prev => prev.filter(ing => ing.id !== id));

      return { success: true };

3. ⏳ Refactorizar `features/roles/components/RoleList.jsx`    } catch (err) {

   - Usar `DataTable` organism      return { success: false, error: err.message };

   - Usar `FormModal` organism    }

   - Usar `useRoles` hook  }, []);

   - Reducir de ~200 líneas a ~50 líneas  

  return {

**Día 2:**    ingresos,

4. ⏳ Testing y validación    loading,

   - Probar CRUD completo    error,

   - Validar que no haya regresiones    refetch: fetchIngresos,

   - Comparar código antes/después    addIngreso,

    deleteIngreso

**Antes del Refactor:**  };

```jsx};

// RoleList.jsx (200+ líneas)```

- Estado local (useState para modal, loading, etc.)

- useEffect para fetch---

- Lógica de tabla custom

- Modal con formulario inline## 🔧 Servicios y APIs

- Botones de acciones custom

- Paginación manual### Configuración de Axios (Client Base)

```

```javascript

**Después del Refactor:**// services/api/client.js

```jsx

// RoleList.jsx (~50 líneas)import axios from 'axios';

const RoleList = () => {

  const { roles, loading, createRole, updateRole, deleteRole } = useRoles();const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

  const [modalVisible, setModalVisible] = useState(false);

  const [selectedRole, setSelectedRole] = useState(null);export const apiClient = axios.create({

    baseURL: API_BASE_URL,

  const columns = [  headers: {

    { title: 'Nombre', dataIndex: 'name', key: 'name' },    'Content-Type': 'application/json',

    { title: 'Descripción', dataIndex: 'description', key: 'description' }    'Accept': 'application/json'

  ];  },

    timeout: 30000

  return (});

    <>

      <DataTable// Interceptor de Request

        title="Gestión de Roles"apiClient.interceptors.request.use(

        dataSource={roles}  (config) => {

        columns={columns}    const token = localStorage.getItem('token');

        loading={loading}    if (token) {

        onCreate={() => setModalVisible(true)}      config.headers.Authorization = `Bearer ${token}`;

        onEdit={(role) => { setSelectedRole(role); setModalVisible(true); }}    }

        onDelete={deleteRole}    

      />    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);

          return config;

      <FormModal  },

        visible={modalVisible}  (error) => {

        title={selectedRole ? 'Editar Rol' : 'Crear Rol'}    console.error('❌ Request Error:', error);

        onCancel={() => setModalVisible(false)}    return Promise.reject(error);

        onSubmit={selectedRole ? updateRole : createRole}  }

      >);

        <RoleFormFields initialValues={selectedRole} />

      </FormModal>// Interceptor de Response

    </>apiClient.interceptors.response.use(

  );  (response) => {

};    console.log(`✅ API Response: ${response.config.url}`, response.data);

```    return response;

  },

**Métricas Esperadas:**  (error) => {

- 75% menos código en RoleList    console.error('❌ Response Error:', error.response?.data || error.message);

- 100% reutilización de DataTable    

- 0 duplicación de lógica    // Manejo de errores comunes

    if (error.response?.status === 401) {

---      localStorage.removeItem('token');

      window.location.href = '/login';

#### **FASE 4C: Replicar en Otros Módulos**    }

**Duración:** 3-5 días      

**Estado:** ⏳ Pendiente    return Promise.reject(error);

  }

**Objetivo:** Aplicar el mismo patrón de Roles a todos los módulos CRUD.);



**Módulos a Refactorizar (8):**export default apiClient;

1. ⏳ Usuarios (UserList, UserFormFields, useUsers)```

2. ⏳ Empresas (CompanyList, CompanyFormFields, useCompanies)

3. ⏳ Vehículos (VehicleList, VehicleFormFields, useVehicles)### Servicio Específico

4. ⏳ Tipos de Vehículo (VehicleTypeList, VehicleTypeFormFields, useVehicleTypes)

5. ⏳ Propietarios (OwnerList, OwnerFormFields, useOwners)```javascript

6. ⏳ Observaciones (ObservacionesList, ObservacionFormFields, useObservaciones)// services/ingresoService.js

7. ⏳ Registros (RegistroList - solo lectura)

8. ⏳ Tolerancias (ToleranceList, ToleranceFormFields, useTolerances)import apiClient from './api/client';



**Patrón a Seguir:**class IngresoService {

```  // Obtener todos los ingresos

Para cada módulo:  async getAll() {

1. Crear custom hook: use[Module].js    try {

2. Extraer formulario: [Module]FormFields.jsx      const response = await apiClient.get('/ingresos');

3. Refactorizar lista: [Module]List.jsx      return response.data.data || response.data;

4. Usar DataTable organism    } catch (error) {

5. Usar FormModal organism      throw new Error(error.response?.data?.message || 'Error al obtener ingresos');

6. Testing básico    }

```  }

  

**Entregables:**  // Crear ingreso

- 8 módulos refactorizados  async create(ingresoData) {

- 8 custom hooks creados    try {

- 8 componentes FormFields extraídos      const response = await apiClient.post('/ingresos', ingresoData);

- Código total reducido en ~60%      return response.data.data || response.data;

    } catch (error) {

**Métricas Esperadas:**      throw new Error(error.response?.data?.message || 'Error al crear ingreso');

- 1200+ líneas de código eliminadas    }

- 8 módulos usando DataTable  }

- 100% consistencia en UX  

  // Registrar salida/pago

---  async registrarSalida(id, data) {

    try {

### **🔜 FASE 5: Testing & Quality**      console.group('📤 Registrando Salida');

**Duración:** 4-5 días        console.log('ID:', id);

**Estado:** ⏳ Pendiente      console.log('Datos a enviar:', data);

      console.groupEnd();

**Objetivo:** Asegurar calidad y estabilidad del código.      

      const response = await apiClient.delete(`/ingresos/${id}`, { data });

**Tareas:**      return response.data;

    } catch (error) {

**Día 1: Setup**      console.error('❌ Error en registrarSalida:', error);

1. ⏳ Instalar Vitest + React Testing Library      throw new Error(error.response?.data?.message || 'Error al registrar salida');

2. ⏳ Configurar `vitest.config.js`    }

3. ⏳ Configurar cobertura de código  }

4. ⏳ Configurar MSW (Mock Service Worker)  

  // Método con validación de datos

**Día 2-3: Unit Tests**  async registrarPago(id, tipoPago, tiempo, precio) {

5. ⏳ Tests para átomos (Button, Input, Badge, etc.)    // Validaciones

6. ⏳ Tests para moléculas (SearchBar, FormField, etc.)    if (!id) throw new Error('ID de ingreso requerido');

7. ⏳ Tests para custom hooks (useRoles, useUsers, etc.)    if (!tipoPago) throw new Error('Tipo de pago requerido');

8. ⏳ Tests para stores (authStore, themeStore)    if (!tiempo) throw new Error('Tiempo de estadía requerido');

    if (precio <= 0) throw new Error('Precio debe ser mayor a 0');

**Día 4: Integration Tests**    

9. ⏳ Tests para organismos (DataTable, FormModal)    const payload = {

10. ⏳ Tests para flujos CRUD      tiempo,

11. ⏳ Tests para autenticación      precio,

      tipo_pago: tipoPago.toUpperCase()

**Día 5: E2E Tests (opcional)**    };

12. ⏳ Instalar Playwright o Cypress    

13. ⏳ Tests E2E para flujos críticos:    console.log('💾 Guardando pago:', payload);

    - Login → Dashboard    

    - Crear Rol → Listar Roles    return this.registrarSalida(id, payload);

    - Editar Usuario → Guardar  }

}

**Herramientas:**

- Vitest (unit tests)export const ingresoService = new IngresoService();

- React Testing Libraryexport default ingresoService;

- MSW (API mocking)```

- Playwright (E2E)

---

**Métricas Objetivo:**

- 80%+ cobertura de código## 💾 Manejo de Estado

- 100% tests pasando

- 0 errores en CI/CD### Opción 1: Context API (Estado Global Simple)



---```javascript

// context/IngresoContext.jsx

### **🔜 FASE 6: Performance & Optimización**

**Duración:** 2-3 días  import React, { createContext, useContext, useState, useCallback } from 'react';

**Estado:** ⏳ Pendienteimport { ingresoService } from '@/services';



**Objetivo:** Optimizar rendimiento y experiencia de usuario.const IngresoContext = createContext(null);



**Tareas:**export const IngresoProvider = ({ children }) => {

  const [ingresos, setIngresos] = useState([]);

**Día 1: Análisis**  const [loading, setLoading] = useState(false);

1. ⏳ Ejecutar Lighthouse audit  

2. ⏳ Analizar bundle size  const fetchIngresos = useCallback(async () => {

3. ⏳ Identificar bottlenecks con React DevTools Profiler    setLoading(true);

4. ⏳ Identificar re-renders innecesarios    try {

      const data = await ingresoService.getAll();

**Día 2: Optimizaciones**      setIngresos(data);

5. ⏳ Implementar React.memo en componentes pesados    } finally {

6. ⏳ Optimizar imágenes (WebP, lazy loading)      setLoading(false);

7. ⏳ Implementar virtual scrolling en listas largas (si aplica)    }

8. ⏳ Optimizar Ant Design imports (tree shaking)  }, []);

9. ⏳ Configurar Service Worker (PWA)  

  const addIngreso = useCallback((ingreso) => {

**Día 3: Validación**    setIngresos(prev => [...prev, ingreso]);

10. ⏳ Re-ejecutar Lighthouse  }, []);

11. ⏳ Comparar métricas antes/después  

12. ⏳ Probar en dispositivos reales  const value = {

    ingresos,

**Métricas Objetivo:**    loading,

```    fetchIngresos,

Lighthouse Score:    addIngreso

- Performance: 90+  };

- Accessibility: 95+  

- Best Practices: 95+  return (

- SEO: 90+    <IngresoContext.Provider value={value}>

      {children}

Core Web Vitals:    </IngresoContext.Provider>

- FCP (First Contentful Paint): < 1.5s  );

- LCP (Largest Contentful Paint): < 2.5s};

- TTI (Time to Interactive): < 3.5s

- CLS (Cumulative Layout Shift): < 0.1export const useIngresoContext = () => {

  const context = useContext(IngresoContext);

Bundle Size:  if (!context) {

- Total (gzip): < 600 KB    throw new Error('useIngresoContext debe usarse dentro de IngresoProvider');

- Initial Load: < 200 KB  }

```  return context;

};

---```



### **🔜 FASE 7: Seguridad & Auditoría**### Opción 2: Zustand (Recomendado para estado complejo)

**Duración:** 1-2 días  

**Estado:** ⏳ Pendiente```javascript

// stores/ingresoStore.js

**Objetivo:** Asegurar la aplicación contra vulnerabilidades.

import { create } from 'zustand';

**Tareas:**import { ingresoService } from '@/services';



**Día 1: Auditoría**export const useIngresoStore = create((set, get) => ({

1. ⏳ Ejecutar `npm audit` y resolver vulnerabilidades  // Estado

2. ⏳ Auditar dependencias con Snyk  ingresos: [],

3. ⏳ Ejecutar OWASP ZAP scan  loading: false,

4. ⏳ Revisar almacenamiento de tokens  error: null,

  

**Día 2: Hardening**  // Acciones

5. ⏳ Implementar CSP (Content Security Policy)  fetchIngresos: async () => {

6. ⏳ Configurar HTTPS en producción    set({ loading: true, error: null });

7. ⏳ Sanitizar inputs (prevención XSS)    try {

8. ⏳ Implementar rate limiting en API calls      const data = await ingresoService.getAll();

9. ⏳ Configurar CORS correctamente      set({ ingresos: data, loading: false });

10. ⏳ Implementar validación de formularios server-side    } catch (error) {

      set({ error: error.message, loading: false });

**Checklist de Seguridad:**    }

```  },

✅ Autenticación  

- ✅ Tokens JWT con expiración  addIngreso: (ingreso) => {

- ✅ Refresh tokens    set(state => ({

- ⏳ 2FA (opcional)      ingresos: [...state.ingresos, ingreso]

    }));

✅ Autorización  },

- ✅ Roles y permisos  

- ✅ Protected routes  removeIngreso: (id) => {

- ⏳ RBAC (Role-Based Access Control)    set(state => ({

      ingresos: state.ingresos.filter(ing => ing.id !== id)

✅ Datos    }));

- ⏳ Encriptación en tránsito (HTTPS)  },

- ⏳ Sanitización de inputs  

- ⏳ Validación server-side  clearError: () => set({ error: null })

}));

✅ Infraestructura

- ⏳ CSP headers// Uso en componente

- ⏳ CORS configuradoconst IngresoList = () => {

- ⏳ Rate limiting  const { ingresos, loading, fetchIngresos } = useIngresoStore();

```  

  useEffect(() => {

---    fetchIngresos();

  }, [fetchIngresos]);

### **🔜 FASE 8: Documentación & Handoff**  

**Duración:** 1-2 días    return (

**Estado:** ⏳ Pendiente    <div>

      {loading ? <Spinner /> : <Table data={ingresos} />}

**Objetivo:** Documentar todo para el equipo.    </div>

  );

**Tareas:**};

```

**Día 1: Documentación Técnica**

1. ⏳ Actualizar README.md---

2. ⏳ Crear CONTRIBUTING.md

3. ⏳ Documentar API endpoints (API_DOCUMENTATION.md)## ⚡ Optimizaciones de Performance

4. ⏳ Crear diagramas de arquitectura (Mermaid)

5. ⏳ Documentar componentes atómicos (Storybook opcional)### 1. Code Splitting y Lazy Loading



**Día 2: Guías y Tutoriales**```javascript

6. ⏳ Crear DEPLOYMENT_GUIDE.md// App.jsx

7. ⏳ Crear guía de "Cómo agregar un nuevo módulo"import { lazy, Suspense } from 'react';

8. ⏳ Crear guía de "Cómo usar componentes atómicos"import { BrowserRouter, Routes, Route } from 'react-router-dom';

9. ⏳ Video tutorial para el equipo (opcional)

10. ⏳ Sesión de handoff con el equipo// Lazy loading de componentes pesados

const IngresoList = lazy(() => import('./features/ingresos/components/IngresoList'));

**Entregables:**const Dashboard = lazy(() => import('./features/dashboard/Dashboard'));

```

documentations/function App() {

├── ARQUITECTURA.md           # ✅ Arquitectura completa  return (

├── CONTRIBUTING.md           # ⏳ Guía de contribución    <BrowserRouter>

├── API_DOCUMENTATION.md      # ⏳ Documentación de API      <Suspense fallback={<LoadingSpinner />}>

├── DEPLOYMENT_GUIDE.md       # ⏳ Guía de despliegue        <Routes>

├── COMPONENT_LIBRARY.md      # ⏳ Catálogo de componentes          <Route path="/ingresos" element={<IngresoList />} />

└── TROUBLESHOOTING.md        # ⏳ Solución de problemas          <Route path="/dashboard" element={<Dashboard />} />

```        </Routes>

      </Suspense>

---    </BrowserRouter>

  );

## 🎯 Prioridades y Timeline}

```

### **Sprint Actual (Semana 1-2):**

```### 2. Memoización con React.memo

🔥 PRIORIDAD ALTA:

- FASE 4A: Crear componentes atómicos base```javascript

- FASE 4B: Refactorizar Roles (piloto)// ✅ Memoizar componentes que no cambian frecuentemente

const IngresoCard = React.memo(({ ingreso, onDelete }) => {

🟡 PRIORIDAD MEDIA:  return (

- FASE 4C: Replicar en 2-3 módulos más    <div className="card">

      <h3>{ingreso.vehiculo.placa}</h3>

🟢 PRIORIDAD BAJA:      <button onClick={() => onDelete(ingreso.id)}>Eliminar</button>

- Documentación inicial    </div>

```  );

}, (prevProps, nextProps) => {

### **Sprint 2 (Semana 3-4):**  // Solo re-renderizar si el ID cambia

```  return prevProps.ingreso.id === nextProps.ingreso.id;

🔥 PRIORIDAD ALTA:});

- FASE 4C: Completar todos los módulos```

- FASE 5: Setup de testing

### 3. Virtualización para Listas Largas

🟡 PRIORIDAD MEDIA:

- FASE 5: Unit tests básicos```javascript

- FASE 6: Análisis de performanceimport { FixedSizeList } from 'react-window';



🟢 PRIORIDAD BAJA:const IngresoList = ({ ingresos }) => {

- FASE 7: Auditoría de seguridad  const Row = ({ index, style }) => (

```    <div style={style}>

      <IngresoCard ingreso={ingresos[index]} />

### **Sprint 3 (Semana 5-6):**    </div>

```  );

🔥 PRIORIDAD ALTA:  

- FASE 5: Completar testing  return (

- FASE 6: Optimizaciones de performance    <FixedSizeList

      height={600}

🟡 PRIORIDAD MEDIA:      itemCount={ingresos.length}

- FASE 7: Hardening de seguridad      itemSize={100}

- FASE 8: Documentación      width="100%"

    >

🟢 PRIORIDAD BAJA:      {Row}

- Storybook (opcional)    </FixedSizeList>

- E2E tests avanzados  );

```};

```

---

### 4. Debounce en Búsquedas

## 📊 Métricas de Éxito

```javascript

### **FASE 3 (Actual):**// hooks/useDebounce.js

```import { useState, useEffect } from 'react';

✅ Código duplicado: ~40%

✅ Componentes reutilizables: 5export const useDebounce = (value, delay = 500) => {

✅ Líneas de código por feature: ~200  const [debouncedValue, setDebouncedValue] = useState(value);

✅ Tiempo para nuevo CRUD: 4 horas  

✅ Build time: 5.14s  useEffect(() => {

✅ Bundle size: 2.7 MB (gzip: 800 KB)    const handler = setTimeout(() => {

```      setDebouncedValue(value);

    }, delay);

### **FASE 4 (Objetivo):**    

```    return () => clearTimeout(handler);

🎯 Código duplicado: ~10%  }, [value, delay]);

🎯 Componentes reutilizables: 20+  

🎯 Líneas de código por feature: ~50  return debouncedValue;

🎯 Tiempo para nuevo CRUD: 30 minutos};

🎯 Build time: < 5s

🎯 Bundle size: < 600 KB (gzip)// Uso

```const SearchBar = () => {

  const [searchTerm, setSearchTerm] = useState('');

### **FASE 8 (Final):**  const debouncedSearch = useDebounce(searchTerm, 500);

```  

🏆 Test coverage: 80%+  useEffect(() => {

🏆 Lighthouse score: 90+    if (debouncedSearch) {

🏆 0 vulnerabilidades críticas      // Realizar búsqueda

🏆 Documentación: 100% completa      searchIngresos(debouncedSearch);

🏆 Equipo capacitado    }

```  }, [debouncedSearch]);

  

---  return (

    <input

## 🚀 ¡Empecemos con FASE 4A!      value={searchTerm}

      onChange={(e) => setSearchTerm(e.target.value)}

### **Próximo Comando:**      placeholder="Buscar..."

```bash    />

# Crear estructura de carpetas  );

mkdir -p src/components/{atoms,molecules,organisms}};

``````



### **Primer Componente:**---

**Button átomo** - Wrapper de Ant Design con estilos consistentes.

## 📊 Flujo de Datos Recomendado

---

```

**Última actualización:** 3 de noviembre de 2025  ┌─────────────────────────────────────────┐

**Versión:** 2.0 - Hybrid Approach  │         USER INTERACTION                │

**Estado:** FASE 3 ✅ | FASE 4 🔄│         (Click, Input, etc.)            │

└──────────────┬──────────────────────────┘

**¡VAMOS POR EL 100%!** 🚀               │

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


5. FASE 4 Desglosada
FASE 4A: Atomic Components (3-4 días)

Día 1-2: 8 átomos (Button, Input, Badge, Icon, Avatar, Tag, Divider, Tooltip)
Día 3: 6 moléculas (SearchBar, FormField, EmptyState, PageHeader, ActionButtons, StatusBadge)
Día 4: 3 organismos (DataTable, FormModal, ConfirmDialog)
FASE 4B: Refactor Roles (1-2 días)

Crear useRoles.js hook
Extraer RoleFormFields.jsx
Refactorizar RoleList.jsx de 200 → 50 líneas
Código de ejemplo incluido
FASE 4C: Replicar (3-5 días)

Aplicar el mismo patrón a 8 módulos más
Reducir código total en 60%
6. Métricas de Éxito
Antes (FASE 3):

Código duplicado: 40%
Tiempo nuevo CRUD: 4 horas
Líneas por feature: 200
Después (FASE 4):

Código duplicado: 10% 🎯
Tiempo nuevo CRUD: 30 minutos 🎯
Líneas por feature: 50 🎯