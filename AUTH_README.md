# 🚗 Sistema Cochera 2025 - Gestión Inteligente

Sistema completo de gestión de cochera desarrollado con React 19, Ant Design v5 y autenticación JWT. Incluye tema oscuro por defecto, diseño responsivo y navegación completa.

## ✨ Características Principales

### 🔐 **Autenticación Avanzada**
- ✅ Login con API REST y JWT tokens
- ✅ Protección de rutas automática
- ✅ Persistencia de sesión
- ✅ Interceptores HTTP automáticos
- ✅ Manejo de tokens expirados

### 🎨 **Interfaz Moderna**
- ✅ **Tema oscuro por defecto** con toggle claro/oscuro
- ✅ **Diseño responsivo** para móviles, tablets y desktop
- ✅ **Ant Design v5** compatible con React 19
- ✅ **Navegación lateral** con menú colapsible
- ✅ **Iconografía intuitiva** y animaciones suaves

### 📊 **Funcionalidades Completas**
- ✅ Dashboard con estadísticas en tiempo real
- ✅ Gestión de usuarios con tabla avanzada
- ✅ Control de vehículos y espacios
- ✅ Reportes y análisis visual
- ✅ Sistema de notificaciones

## 🛠️ Tecnologías Utilizadas

- **React 19** - Framework principal
- **Vite** - Build tool ultrarrápido
- **Ant Design v5** - Biblioteca de componentes UI
- **@ant-design/v5-patch-for-react-19** - Parche de compatibilidad
- **React Router DOM** - Enrutamiento SPA
- **Axios** - Cliente HTTP con interceptores
- **Context API** - Manejo de estado global

## 📦 Instalación y Configuración

```bash
# Clonar el repositorio
cd c:\xampp\htdocs\cochera2025\frontend

# Instalar dependencias (ya instaladas)
npm install

# Iniciar servidor de desarrollo
npm run dev
```

## 🔐 Credenciales de Acceso

```json
{
  "email": "admin@gmail.com",
  "password": "12345678"
}
```

## 🌐 API Endpoints

### Autenticación
- **POST** `http://localhost:8000/api/auth/login`
  - Body: `{ "email": "admin@gmail.com", "password": "12345678" }`
  - Response: Token JWT + datos del usuario

### Suscriptores
- **GET** `http://localhost:8000/api/suscribers` - Lista de suscriptores
- **POST** `http://localhost:8000/api/suscribers` - Crear suscriptor

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── Login.jsx           # 🔐 Login con tema oscuro
│   ├── AppLayout.jsx       # 🏗️ Layout principal responsivo
│   ├── Dashboard.jsx       # 📊 Panel principal con estadísticas
│   ├── Usuarios.jsx        # 👥 Gestión de usuarios
│   ├── Vehiculos.jsx       # 🚗 Control de vehículos
│   ├── Reportes.jsx        # 📈 Reportes y análisis
│   └── ProtectedRoute.jsx  # 🛡️ Protección de rutas
├── context/
│   ├── AuthContext.jsx     # 🔑 Contexto de autenticación
│   └── ThemeContext.jsx    # 🎨 Contexto de temas
├── utils/
│   └── axios.js           # ⚡ Interceptores HTTP
├── App.jsx                # 🚀 Componente principal
├── main.jsx              # 🎯 Punto de entrada
└── index.css             # 💅 Estilos globales
```

## � Rutas Disponibles

| Ruta | Descripción | Protegida |
|------|-------------|-----------|
| `/` | Redirección automática | ❌ |
| `/login` | Página de inicio de sesión | ❌ |
| `/dashboard` | Panel principal con estadísticas | ✅ |
| `/usuarios` | Gestión de usuarios del sistema | ✅ |
| `/vehiculos` | Control de vehículos registrados | ✅ |
| `/reportes` | Reportes y análisis de datos | ✅ |
| `/pagos` | Sistema de pagos (placeholder) | ✅ |
| `/seguridad` | Configuración de seguridad | ✅ |
| `/configuracion` | Ajustes del sistema | ✅ |

## 🎨 Características de Diseño

### 🌙 **Tema Oscuro Avanzado**
- **Por defecto**: Tema oscuro elegante
- **Toggle dinámico**: Cambio instantáneo claro ↔ oscuro
- **Persistencia**: El tema se guarda automáticamente
- **Gradientes**: Fondos con gradientes modernos
- **Colores personalizados**: Paleta optimizada para cada tema

### 📱 **Responsive Design**
- **Móviles** (< 768px): Menú lateral auto-colapsible
- **Tablets** (768px - 1024px): Layout optimizado
- **Desktop** (> 1024px): Experiencia completa
- **Breakpoints**: Diseño adaptativo inteligente

### 🧭 **Navegación Intuitiva**
- **Menú lateral**: Iconos + etiquetas descriptivas
- **Breadcrumbs**: Navegación contextual
- **Estados activos**: Indicadores visuales claros
- **Colapso automático**: En dispositivos móviles

## 🔧 Configuraciones Avanzadas

### ⚡ **Interceptores de Axios**
```javascript
// Automáticamente incluye Bearer token
Authorization: `Bearer ${token}`

// Manejo automático de errores 401
if (error.response?.status === 401) {
  // Redirige al login automáticamente
}
```

### 💾 **Persistencia de Estado**
- **localStorage**: Token + datos de usuario + tema
- **Recuperación automática**: Al recargar la página
- **Limpieza automática**: En logout o token expirado

### 🛡️ **Seguridad**
- **Rutas protegidas**: Verificación automática
- **Token validation**: Interceptores inteligentes
- **Auto-logout**: En caso de token expirado
- **Sanitización**: Datos seguros en toda la app

## 📊 Dashboard Features

### 📈 **Estadísticas en Tiempo Real**
- Total de vehículos registrados
- Espacios ocupados vs disponibles
- Ingresos mensuales
- Tiempo promedio de estacionamiento
- Gráficos de progreso visual

### 🎛️ **Controles Interactivos**
- Formularios validados en tiempo real
- Búsqueda instantánea
- Filtros avanzados
- Exportación de datos
- Refresh automático

## 🚀 Servidor de Desarrollo

La aplicación está corriendo en: **http://localhost:5173/**

### 🎯 **Características del Servidor**
- ✅ Hot Module Replacement (HMR)
- ✅ Fast Refresh para React
- ✅ Optimización automática de dependencias
- ✅ Rolldown-Vite para mejor rendimiento

## 🔮 Funcionalidades Avanzadas

### 🎨 **Temas Dinámicos**
- **Algoritmos de Ant Design**: `theme.darkAlgorithm` / `theme.defaultAlgorithm`
- **Tokens personalizados**: Colores, espaciado, tipografía
- **Componentes temáticos**: Cada componente respeta el tema
- **Transiciones suaves**: Cambios animados entre temas

### 📱 **Mobile-First Design**
- **Breakpoints**: Diseño que escala perfectamente
- **Touch-friendly**: Botones y controles optimizados
- **Menú hamburguesa**: Navegación móvil intuitiva
- **Gestos**: Soporte para swipe y touch

### ⚡ **Performance**
- **Code splitting**: Carga por rutas
- **Lazy loading**: Componentes bajo demanda
- **Memoización**: Optimización de re-renders
- **Bundle optimization**: Tamaño mínimo

## � Resolución de Problemas

### ✅ **React 19 Compatibility**
- **Solucionado**: Parche `@ant-design/v5-patch-for-react-19`
- **Wave effects**: Funcionales correctamente
- **Modal/Notification**: Métodos estáticos operando
- **DOM rendering**: Compatible con React 19

### 🔧 **Errores Comunes**
1. **Error de compatibilidad**: Instalado el parche oficial
2. **Temas no aplicando**: Context providers correctamente anidados
3. **Rutas no funcionando**: Router configurado adecuadamente
4. **API errors**: Interceptores manejando automáticamente

## 🎯 Próximas Mejoras

- [ ] 📊 Integración con Chart.js para gráficos reales
- [ ] 🔄 Refresh tokens automáticos
- [ ] 📧 Sistema de notificaciones por email
- [ ] 🌍 Internacionalización (i18n)
- [ ] 📱 PWA (Progressive Web App)
- [ ] 🔒 Roles y permisos granulares
- [ ] 📋 Exportación avanzada (PDF, Excel)
- [ ] 🎮 Modo de juego/gamificación

---

## 🚀 ¡Aplicación Lista para Usar!

### **Acceder ahora:** http://localhost:5173/
### **Credenciales:** admin@gmail.com / 12345678
### **Tema:** Oscuro por defecto con toggle claro/oscuro

**🎉 Desarrollado con ❤️ y las mejores prácticas de React 19 + Ant Design v5**