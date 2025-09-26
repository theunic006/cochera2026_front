# 📚 Documentaciones del Sistema

Esta carpeta contiene toda la documentación técnica del sistema de gestión Cochera 2025.

## 📋 Archivos Disponibles

### 🎯 Documentación General
- **[SISTEMA_OVERVIEW.md](./SISTEMA_OVERVIEW.md)** - Visión general completa del sistema

### 📖 Documentaciones de API por Módulo

#### 👥 Usuarios
- **[API_USERS_DOCUMENTATION.md](./API_USERS_DOCUMENTATION.md)**
- Endpoints para gestión de usuarios
- CRUD completo con autenticación
- Ejemplos de uso y validaciones

#### 🔐 Roles  
- **[API_ROLES_DOCUMENTATION.md](./API_ROLES_DOCUMENTATION.md)**
- Endpoints para gestión de roles
- Estados activo/suspendido
- Búsqueda y filtrado
- 6 endpoints implementados

#### 🏢 Empresas
- **[API_COMPANIES_DOCUMENTATION.md](./API_COMPANIES_DOCUMENTATION.md)**
- Endpoints para gestión de empresas
- Funcionalidades avanzadas de estado
- Búsqueda, filtrado y gestión en lote
- 11 endpoints implementados

## 🚀 Características Comunes

Todas las documentaciones incluyen:

- ✅ **Estructura de endpoints** completa
- ✅ **Ejemplos de request/response** en JSON
- ✅ **Códigos de estado HTTP** explicados
- ✅ **Validaciones** detalladas
- ✅ **Ejemplos de uso** en JavaScript
- ✅ **Manejo de errores** estándar
- ✅ **Autenticación Bearer Token** requerida

## 🔧 Formato Estándar

Cada documentación sigue este formato:

```markdown
# API CRUD de [Módulo] - Laravel 12
## Base URL
## Autenticación  
## Endpoints Disponibles
## Estructura de Datos
## Códigos de Estado HTTP
## Errores de Validación
## Ejemplos de Uso con JavaScript
```

## 📊 Resumen de Endpoints

| Módulo | Endpoints | Funcionalidades Especiales |
|--------|-----------|---------------------------|
| **Usuarios** | 5+ | Gestión básica CRUD |
| **Roles** | 6 | Estados, búsqueda, contadores |
| **Empresas** | 11 | Estados avanzados, filtros múltiples |

## 🎯 Cómo Usar Esta Documentación

1. **Para desarrolladores nuevos**: Empieza por `SISTEMA_OVERVIEW.md`
2. **Para implementar API**: Usa las documentaciones específicas de módulo
3. **Para frontend**: Los ejemplos JavaScript están listos para usar
4. **Para testing**: Todos los endpoints están documentados con ejemplos

## 🔄 Mantenimiento

- **Actualizar** cuando se añadan nuevos endpoints
- **Sincronizar** con cambios en el backend
- **Validar** ejemplos periódicamente
- **Expandir** con nuevos módulos

## 📞 Información Técnica

- **Base URL:** `http://localhost:8000/api`
- **Autenticación:** Bearer Token (JWT)
- **Framework Backend:** Laravel 12
- **Framework Frontend:** React 19 + Vite
- **UI Library:** Ant Design v5

---

**Última actualización:** 25 de septiembre de 2025  
**Mantenido por:** Sistema de Gestión Integral  
**Versión:** v1.0