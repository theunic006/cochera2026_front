# 🗺️ MAPEO COMPLETO DEL PROYECTO - FASE 3

**Fecha:** 3 de noviembre de 2025
**Estado:** Análisis completo antes de migración a arquitectura modular

---

## 📊 ESTRUCTURA ACTUAL

```
src/
├── App.jsx                           # Router principal con lazy loading
├── main.jsx                          # Entry point
├── components/                       # 🔴 MONOLÍTICO - A migrar a features/
│   ├── AppLayout.jsx                # ✅ Layout global (mantener)
│   ├── Dashboard.jsx                # → features/dashboard/
│   ├── Login.jsx                    # → features/auth/
│   ├── ProtectedRoute.jsx           # ✅ Route guard (mantener)
│   ├── ErrorBoundary.jsx            # ✅ Error boundary (mantener)
│   ├── Usuarios.jsx                 # 🗑️ DEPRECADO (hay users/)
│   ├── VentasExample.jsx            # 🗑️ DEPRECADO (ejemplo)
│   ├── Reportes.jsx                 # → features/reportes/
│   │
│   ├── common/                      # ✅ MANTENER (componentes compartidos)
│   │   ├── TableBase.jsx
│   │   ├── PreloadLink.jsx
│   │   ├── LoadingStates/
│   │   └── ErrorBoundaries/
│   │
│   ├── ingresos/                    # → features/ingresos/
│   │   ├── IngresoList.jsx          # Lista principal (529 líneas) 🔴 GRANDE
│   │   ├── IngresoForm.jsx          # Formulario de ingreso
│   │   ├── IngresoMobile.jsx        # Vista móvil
│   │   ├── IngresoTableCells.jsx    # Celdas memoizadas
│   │   ├── TerminarModal.jsx        # Modal de pago/salida
│   │   ├── EditarForm.jsx           # Editar ingreso
│   │   ├── consultaSunat.jsx        # Consulta SUNAT
│   │   ├── enviarFactura.jsx        # Envío factura
│   │   ├── imprimirTicketSunat.jsx  # Imprimir ticket
│   │   ├── TicketSunatTemplate.js   # Template ticket
│   │   └── index.jsx                # Exports
│   │
│   ├── salidas/                     # → features/salidas/
│   │   └── SalidasList.jsx          # Lista de salidas
│   │
│   ├── vehiculos/ (NO EXISTE)       # 🔴 FALTA carpeta
│   │
│   ├── vehicles/                    # → features/vehiculos/
│   │   ├── VehicleListSimple.jsx
│   │   ├── VehicleFormSimple.jsx
│   │   ├── VehicleTableCells.jsx
│   │   ├── VehicleOwnersModal.jsx
│   │   └── index.jsx
│   │
│   ├── vehicleTypes/                # → features/vehiculos/types/
│   │   ├── VehicleTypeListSimple.jsx
│   │   ├── VehicleTypeFormSimple.jsx
│   │   └── index.jsx
│   │
│   ├── owners/                      # → features/propietarios/
│   │   ├── OwnerList.jsx
│   │   ├── OwnerForm.jsx
│   │   ├── OwnerVehiclesModal.jsx
│   │   └── index.jsx
│   │
│   ├── users/                       # → features/usuarios/
│   │   ├── UserList.jsx
│   │   ├── UserForm.jsx
│   │   ├── PermissionsModal.jsx
│   │   └── index.jsx
│   │
│   ├── roles/                       # → features/usuarios/roles/
│   │   ├── RoleList.jsx
│   │   ├── RoleForm.jsx
│   │   └── index.jsx
│   │
│   ├── companies/                   # → features/empresas/
│   │   ├── CompanyList.jsx
│   │   ├── CompanyForm.jsx
│   │   └── index.jsx
│   │
│   ├── tolerances/                  # → features/configuracion/tolerancias/
│   │   ├── ToleranceListSimple.jsx
│   │   ├── ToleranceFormSimple.jsx
│   │   └── index.jsx
│   │
│   ├── registros/                   # → features/registros/
│   │   ├── RegistroList.jsx
│   │   ├── RegistroForm.jsx
│   │   └── index.jsx
│   │
│   ├── observaciones/               # → features/observaciones/
│   │   ├── ObservacionesList.jsx
│   │   └── index.jsx
│   │
│   └── perfil/                      # → features/perfil/
│       ├── PerfilUsuario.jsx
│       └── ConfigImpresora.jsx
│
├── services/                        # 🔴 SERVICIOS GLOBALES
│   ├── api/
│   │   └── client.js               # ✅ Base axios client
│   ├── ingresoService.js           # → features/ingresos/services/
│   ├── salidaService.js            # → features/salidas/services/
│   ├── vehicleService.js           # → features/vehiculos/services/
│   ├── vehicleTypeService.js       # → features/vehiculos/services/
│   ├── vehiculoService.js          # 🔴 DUPLICADO con vehicleService
│   ├── ownerService.js             # → features/propietarios/services/
│   ├── userService.js              # → features/usuarios/services/
│   ├── roleService.js              # → features/usuarios/services/
│   ├── companyService.js           # → features/empresas/services/
│   ├── toleranceService.js         # → features/configuracion/services/
│   ├── registroService.js          # → features/registros/services/
│   ├── observacionService.js       # → features/observaciones/services/
│   ├── permissionService.js        # ✅ MANTENER (usado globalmente)
│   ├── printerService.js           # ✅ MANTENER (usado globalmente)
│   ├── sunatService.js             # ✅ MANTENER (usado globalmente)
│   └── facturaService.js           # → features/ingresos/services/
│
├── hooks/                           # 🔴 HOOKS GLOBALES
│   ├── index.js                    # ✅ Barrel export
│   ├── useAuthInfo.js              # ✅ MANTENER (global)
│   ├── useDebounce.js              # ✅ MANTENER (global)
│   └── useIngresoCalculations.js   # → features/ingresos/hooks/
│
├── context/                         # 🟡 CONTEXTOS (migrar a Zustand)
│   ├── AuthContext.jsx             # ✅ MANTENER (o Zustand)
│   ├── ThemeContext.jsx            # ✅ MANTENER (o Zustand)
│   └── RecaptchaContext.jsx        # ✅ MANTENER
│
├── utils/                           # ✅ UTILIDADES GLOBALES
│   ├── apiClient.js                # ✅ Base API client
│   ├── apiFacturacion.js           # → features/ingresos/utils/
│   ├── apiHelpers.js               # ✅ MANTENER (helpers globales)
│   ├── axios.js                    # 🔴 DUPLICADO con apiClient
│   ├── CalValores.js               # → features/ingresos/utils/
│   ├── formatters.js               # ✅ MANTENER (global)
│   └── preloadRoutes.js            # ✅ MANTENER (router utils)
│
└── config/                          # ✅ CONFIGURACIÓN
    └── (vacío - crear aquí configs)
```

---

## 🎯 MÓDULOS IDENTIFICADOS (Features)

### 1. **features/ingresos/** (MÓDULO PRINCIPAL - CRÍTICO)
**Componentes:**
- IngresoList.jsx (529 líneas) 🔴
- IngresoForm.jsx
- IngresoMobile.jsx
- IngresoTableCells.jsx (memoizado)
- TerminarModal.jsx
- EditarForm.jsx
- consultaSunat.jsx
- enviarFactura.jsx
- imprimirTicketSunat.jsx
- TicketSunatTemplate.js

**Services:**
- ingresoService.js
- facturaService.js
- sunatService.js (compartido)

**Hooks:**
- useIngresoCalculations.js

**Utils:**
- CalValores.js (cálculos de tiempo/precio)
- apiFacturacion.js

**Dependencias Externas:**
- toleranceService (global)
- vehiculoService (global)
- vehicleTypeService (global)
- AuthContext
- printerService (global)

---

### 2. **features/salidas/** (MÓDULO SIMPLE)
**Componentes:**
- SalidasList.jsx

**Services:**
- salidaService.js

**Dependencias:**
- registroService (para historial)

---

### 3. **features/vehiculos/** (MÓDULO COMPLEJO)
**Componentes:**
- VehicleListSimple.jsx
- VehicleFormSimple.jsx
- VehicleTableCells.jsx
- VehicleOwnersModal.jsx
- VehicleTypeListSimple.jsx (submodule types/)
- VehicleTypeFormSimple.jsx (submodule types/)

**Services:**
- vehicleService.js
- vehicleTypeService.js
- vehiculoService.js (🔴 DUPLICADO - consolidar)

**Dependencias:**
- ownerService (relación many-to-many)

---

### 4. **features/propietarios/** (MÓDULO SIMPLE)
**Componentes:**
- OwnerList.jsx
- OwnerForm.jsx
- OwnerVehiclesModal.jsx

**Services:**
- ownerService.js

**Dependencias:**
- vehicleService (relación)

---

### 5. **features/usuarios/** (MÓDULO COMPLEJO)
**Componentes:**
- UserList.jsx
- UserForm.jsx
- PermissionsModal.jsx
- RoleList.jsx (submodule roles/)
- RoleForm.jsx (submodule roles/)

**Services:**
- userService.js
- roleService.js
- permissionService.js (global)

**Dependencias:**
- companyService (relación)
- AuthContext

---

### 6. **features/empresas/** (MÓDULO SIMPLE - SUPERUSER)
**Componentes:**
- CompanyList.jsx
- CompanyForm.jsx

**Services:**
- companyService.js

**Dependencias:**
- AuthContext (verificar rol superusuario)

---

### 7. **features/configuracion/** (MÓDULO AGRUPADOR)
**Submodules:**
- tolerancias/
  - ToleranceListSimple.jsx
  - ToleranceFormSimple.jsx
  - toleranceService.js

**Futuro:**
- impresoras/
- parametros/
- sistema/

---

### 8. **features/registros/** (MÓDULO SIMPLE)
**Componentes:**
- RegistroList.jsx
- RegistroForm.jsx

**Services:**
- registroService.js

**Dependencias:**
- Usado por salidas e ingresos

---

### 9. **features/observaciones/** (MÓDULO SIMPLE)
**Componentes:**
- ObservacionesList.jsx

**Services:**
- observacionService.js

**Dependencias:**
- Relacionado con ingresos

---

### 10. **features/reportes/** (MÓDULO FUTURO)
**Componentes:**
- Reportes.jsx

**Services:**
- (por crear)

**Dependencias:**
- Todos los servicios (lectura)

---

### 11. **features/dashboard/** (MÓDULO PRINCIPAL)
**Componentes:**
- Dashboard.jsx

**Services:**
- Todos (estadísticas)

**Dependencias:**
- Múltiples servicios para métricas

---

### 12. **features/auth/** (MÓDULO CRÍTICO)
**Componentes:**
- Login.jsx
- ProtectedRoute.jsx (shared)

**Context:**
- AuthContext (o Zustand)

**Services:**
- userService (login/logout)

---

### 13. **features/perfil/** (MÓDULO USUARIO)
**Componentes:**
- PerfilUsuario.jsx
- ConfigImpresora.jsx

**Services:**
- userService
- printerService
- companyService

---

## 🔗 MATRIZ DE DEPENDENCIAS

### Servicios Globales (MANTENER en src/services/)
```
✅ permissionService.js    → Usado por: AppLayout, UserList, UserForm
✅ printerService.js        → Usado por: PerfilUsuario, IngresoList
✅ sunatService.js          → Usado por: IngresoList, TerminarModal
```

### Servicios a Migrar a Features
```
ingresoService.js          → features/ingresos/services/
salidaService.js           → features/salidas/services/
vehicleService.js          → features/vehiculos/services/
vehicleTypeService.js      → features/vehiculos/services/
vehiculoService.js         → 🔴 CONSOLIDAR con vehicleService
ownerService.js            → features/propietarios/services/
userService.js             → features/usuarios/services/
roleService.js             → features/usuarios/services/
companyService.js          → features/empresas/services/
toleranceService.js        → features/configuracion/services/
registroService.js         → features/registros/services/
observacionService.js      → features/observaciones/services/
facturaService.js          → features/ingresos/services/
```

### Hooks a Migrar
```
useIngresoCalculations.js  → features/ingresos/hooks/
```

### Utils a Migrar
```
CalValores.js              → features/ingresos/utils/
apiFacturacion.js          → features/ingresos/utils/
```

---

## 🚨 PROBLEMAS IDENTIFICADOS

### 1. Duplicados
- ❌ `vehiculoService.js` vs `vehicleService.js` (mismo propósito)
- ❌ `axios.js` vs `apiClient.js` (misma config)
- ❌ `Usuarios.jsx` en components/ + users/ folder (deprecado)

### 2. Componentes Muy Grandes
- 🔴 `IngresoList.jsx` (529 líneas) → Refactorizar con hooks
- 🔴 `AppLayout.jsx` (513 líneas) → Ya optimizado, mantener

### 3. Falta de Organización
- No existe carpeta `features/`
- Servicios todos en root de `services/`
- Hooks específicos mezclados con globales

### 4. Context API Pesado
- `AuthContext` con mucha lógica
- `ThemeContext` simple pero podría ser Zustand
- No hay gestión de estado global para datos

---

## 📋 PLAN DE MIGRACIÓN - FASE 3

### **PASO 1: Crear Estructura Base (30 min)**
```bash
src/
└── features/
    ├── auth/
    ├── dashboard/
    ├── ingresos/
    ├── salidas/
    ├── vehiculos/
    ├── propietarios/
    ├── usuarios/
    ├── empresas/
    ├── configuracion/
    ├── registros/
    ├── observaciones/
    ├── reportes/
    └── perfil/
```

### **PASO 2: Migrar Módulo Simple (Testing) - Tolerancias (1h)**
- Mover `tolerances/` → `features/configuracion/tolerancias/`
- Mover `toleranceService.js` → `features/configuracion/services/`
- Actualizar imports
- Probar que funciona

### **PASO 3: Migrar Módulo Crítico - Ingresos (3h)**
- Mover `ingresos/` → `features/ingresos/components/`
- Mover servicios relacionados
- Mover hooks y utils
- Crear `features/ingresos/index.js` con exports
- Actualizar todos los imports

### **PASO 4: Migrar Módulos Relacionados (2h)**
- Salidas
- Vehículos (consolidar duplicados)
- Propietarios

### **PASO 5: Migrar Módulos de Gestión (2h)**
- Usuarios + Roles
- Empresas
- Registros
- Observaciones

### **PASO 6: Implementar Zustand (2h)**
- Crear `stores/authStore.js`
- Crear `stores/themeStore.js`
- Migrar AuthContext → Zustand
- Migrar ThemeContext → Zustand
- Opcional: `stores/ingresoStore.js` para cache

### **PASO 7: Optimizar Lazy Loading (1h)**
- Mejorar preload strategies
- Implementar route prefetching

### **PASO 8: Virtualización de Listas (2h)**
- Instalar `react-window`
- Implementar en IngresoList
- Implementar en UserList
- Implementar en VehicleList

### **PASO 9: Testing Final (2h)**
- Probar todas las rutas
- Verificar permisos
- Verificar funcionalidades críticas
- Performance testing

---

## ⏱️ TIEMPO ESTIMADO TOTAL
**15-20 horas** (2-3 días de trabajo)

---

## 🎯 PRIORIDADES

### CRÍTICO (No Romper)
1. ✅ Sistema de autenticación (AuthContext)
2. ✅ Permisos y roles (permissionService)
3. ✅ Ingresos y salidas (flujo principal del negocio)
4. ✅ Cálculos de precios (CalValores)
5. ✅ Integración SUNAT (sunatService, facturaService)

### IMPORTANTE (Mejorar)
1. 🟡 Performance en listas largas (virtualización)
2. 🟡 Estado global (Zustand)
3. 🟡 Code splitting mejorado

### OPCIONAL (Futuro)
1. ⚪ Tests unitarios
2. ⚪ Storybook para componentes
3. ⚪ Documentación técnica

---

## 🚀 SIGUIENTE PASO

**¿Quieres que comience con el PASO 1 (crear estructura base) o prefieres que analice algo más específico primero?**

Opciones:
1. ✅ Comenzar PASO 1: Crear estructura `features/`
2. 🔍 Analizar más a fondo un módulo específico (ej: ingresos)
3. 📝 Crear plan más detallado de un módulo específico
4. 🧪 Hacer prueba de concepto con un módulo pequeño

**¿Por cuál empezamos?** 🎯
