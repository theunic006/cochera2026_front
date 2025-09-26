# Documentación del Sistema de Gestión - Cochera 2025

Este documento proporciona una visión general de todos los módulos implementados en el sistema de gestión.

## 📋 Módulos Implementados

### 1. 👥 Gestión de Usuarios
- **Archivo de documentación:** [API_USERS_DOCUMENTATION.md](./API_USERS_DOCUMENTATION.md)
- **Componentes Frontend:**
  - `UserList.jsx` - Lista de usuarios con tabla responsiva
  - `UserForm.jsx` - Formulario para crear/editar usuarios
- **Servicio:** `userService.js`
- **Ruta:** `/usuarios`

**Funcionalidades principales:**
- ✅ Listar usuarios con paginación
- ✅ Crear nuevos usuarios
- ✅ Editar usuarios existentes
- ✅ Eliminar usuarios
- ✅ Buscar usuarios por nombre/email
- ✅ Gestión de roles de usuario

### 2. 🔐 Gestión de Roles
- **Archivo de documentación:** [API_ROLES_DOCUMENTATION.md](./API_ROLES_DOCUMENTATION.md)
- **Componentes Frontend:**
  - `RoleList.jsx` - Lista de roles con estadísticas
  - `RoleForm.jsx` - Formulario para crear/editar roles
- **Servicio:** `roleService.js`
- **Ruta:** `/roles`

**Funcionalidades principales:**
- ✅ Listar roles con paginación
- ✅ Crear nuevos roles
- ✅ Editar roles existentes
- ✅ Eliminar roles
- ✅ Buscar roles por descripción
- ✅ Gestión de estados (activo/suspendido)
- ✅ Contador de usuarios por rol

### 3. 🏢 Gestión de Empresas
- **Archivo de documentación:** [API_COMPANIES_DOCUMENTATION.md](./API_COMPANIES_DOCUMENTATION.md)
- **Componentes Frontend:**
  - `CompanyList.jsx` - Lista de empresas con filtros avanzados
  - `CompanyForm.jsx` - Formulario para crear/editar empresas
- **Servicio:** `companyService.js`
- **Ruta:** `/empresas`

**Funcionalidades principales:**
- ✅ Listar empresas con paginación
- ✅ Crear nuevas empresas
- ✅ Editar empresas existentes
- ✅ Eliminar empresas
- ✅ Buscar empresas por nombre
- ✅ Filtrar por estado
- ✅ Activar/Suspender empresas
- ✅ Cambio de estado en lote
- ✅ Contador de usuarios por empresa

## 🏗️ Arquitectura del Sistema

### Frontend (React + Vite)
```
src/
├── components/
│   ├── users/
│   │   ├── UserList.jsx
│   │   ├── UserForm.jsx
│   │   └── index.js
│   ├── roles/
│   │   ├── RoleList.jsx
│   │   ├── RoleForm.jsx
│   │   └── index.js
│   ├── companies/
│   │   ├── CompanyList.jsx
│   │   ├── CompanyForm.jsx
│   │   └── index.js
│   ├── AppLayout.jsx
│   └── ProtectedRoute.jsx
├── services/
│   ├── userService.js
│   ├── roleService.js
│   └── companyService.js
├── context/
│   ├── AuthContext.jsx
│   └── ThemeContext.jsx
└── App.jsx
```

### Backend (Laravel 12)
```
API Endpoints:
├── /api/users/*          (Gestión de usuarios)
├── /api/roles/*          (Gestión de roles)
└── /api/companies/*      (Gestión de empresas)
```

## 🛡️ Seguridad y Autenticación

### Autenticación JWT
- Todos los endpoints requieren autenticación Bearer Token
- Token almacenado en localStorage como `access_token`
- Redirección automática al login si el token expira

### Interceptores de Axios
Cada servicio incluye interceptores para:
- ✅ Inyección automática del Bearer Token
- ✅ Manejo de errores 401 (token expirado)
- ✅ Redirección automática al login
- ✅ Logging de requests para debugging

## 🎨 Características de la Interfaz

### Diseño Responsivo
- ✅ Adaptable a móviles, tablets y escritorio
- ✅ Tablas con scroll horizontal en dispositivos pequeños
- ✅ Menú lateral colapsible en móviles

### Componentes Reutilizables
- ✅ AppLayout: Layout principal con navegación
- ✅ ProtectedRoute: Protección de rutas autenticadas
- ✅ Modales consistentes para formularios
- ✅ Tablas con paginación estándar

### Funcionalidades Avanzadas
- ✅ Búsqueda en tiempo real
- ✅ Filtros por estado
- ✅ Estadísticas en tiempo real
- ✅ Notificaciones de éxito/error
- ✅ Confirmaciones de eliminación
- ✅ Validación de formularios

## 📊 Estadísticas y Métricas

Cada módulo incluye un dashboard con:
- **Total de registros**
- **Registros activos/inactivos**
- **Contadores específicos** (usuarios por rol, usuarios por empresa)
- **Fechas de creación**

## 🔄 Estados del Sistema

### Estados de Roles
- `activo`: Rol disponible para asignación
- `suspendido`: Rol no disponible temporalmente

### Estados de Empresas
- `activo`: Empresa operativa con acceso al sistema
- `suspendido`: Empresa sin acceso al sistema

### Estados de Usuarios
- Depende de la implementación específica en el backend

## 🚀 Endpoints Implementados

### Usuarios (según documentación existente)
- GET `/api/users` - Listar usuarios
- POST `/api/users` - Crear usuario
- GET `/api/users/{id}` - Obtener usuario
- PUT `/api/users/{id}` - Actualizar usuario
- DELETE `/api/users/{id}` - Eliminar usuario

### Roles (6 endpoints)
- GET `/api/roles` - Listar roles
- POST `/api/roles` - Crear rol
- GET `/api/roles/{id}` - Obtener rol
- PUT `/api/roles/{id}` - Actualizar rol
- DELETE `/api/roles/{id}` - Eliminar rol
- GET `/api/roles/search` - Buscar roles

### Empresas (11 endpoints)
- GET `/api/companies` - Listar empresas
- POST `/api/companies` - Crear empresa + usuario admin
- GET `/api/companies/{id}` - Obtener empresa
- PUT `/api/companies/{id}` - Actualizar empresa
- DELETE `/api/companies/{id}` - Eliminar empresa
- GET `/api/companies/search` - Buscar empresas
- GET `/api/companies/statuses` - Estados disponibles
- GET `/api/companies/by-status` - Filtrar por estado
- PATCH `/api/companies/{id}/activate` - Activar empresa
- PATCH `/api/companies/{id}/suspend` - Suspender empresa
- PATCH `/api/companies/{id}/change-status` - Cambiar estado

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 19** - Framework de JavaScript
- **Vite** - Build tool y dev server
- **Ant Design v5** - Biblioteca de componentes UI
- **React Router** - Navegación
- **Axios** - Cliente HTTP
- **Context API** - Gestión de estado global

### Backend
- **Laravel 12** - Framework PHP
- **MySQL** - Base de datos
- **JWT Authentication** - Autenticación
- **API Resources** - Transformación de datos

## 📝 Patrón de Desarrollo

Cada módulo sigue el mismo patrón consistente:

1. **Servicio (Service)**: Maneja todas las llamadas a la API
2. **Lista (List)**: Componente principal con tabla y estadísticas  
3. **Formulario (Form)**: Modal para crear/editar registros
4. **Index**: Archivo de exportación organizada
5. **Ruta**: Integración en el sistema de navegación
6. **Documentación**: API documentation completa

## 🔧 Configuración y Desarrollo

### Variables de Entorno
```
API_BASE_URL=http://localhost:8000/api
```

### Comandos de Desarrollo
```bash
# Instalar dependencias
npm install

# Servidor de desarrollo
npm run dev

# Build de producción
npm run build
```

## 📚 Próximos Pasos

Módulos potenciales para implementar siguiendo el mismo patrón:
- 🚗 Gestión de vehículos
- 💰 Gestión de pagos/cocheras
- 📊 Reportes y estadísticas
- ⚙️ Configuración del sistema
- 📧 Notificaciones
- 🔍 Auditoría de cambios

---

**Fecha de creación:** 25 de septiembre de 2025  
**Sistema:** Cochera 2026 Frontend  
**Repositorio:** theunic006/cochera2026_front  
**Desarrollador:** Sistema de Gestión Integral