# API CRUD de Roles - Laravel 12

Esta documentación describe los endpoints disponibles para realizar CRUD (Create, Read, Update, Delete) de roles en el sistema.

## Base URL
```
http://localhost:8000/api/roles
```

## Autenticación
Todos los endpoints requieren autenticación Bearer Token.
```
Authorization: Bearer {access_token}
```

## Endpoints Disponibles

### 1. Listar Roles
**GET** `/api/roles`

Obtiene una lista paginada de todos los roles del sistema.

**Parámetros de consulta opcionales:**
- `page` (int): Número de página (por defecto: 1)
- `per_page` (int): Elementos por página (por defecto: 15)

**Respuesta Exitosa:**
```json
{
    "success": true,
    "message": "Roles obtenidos exitosamente",
    "data": [
        {
            "id": 1,
            "descripcion": "Super Administrador",
            "estado": "activo",
            "estado_info": {
                "label": "Activo",
                "is_active": true,
                "is_suspended": false
            },
            "users_count": 1,
            "created_at": "2025-09-25 16:54:00",
            "updated_at": "2025-09-25 16:54:00"
        }
    ],
    "pagination": {
        "current_page": 1,
        "last_page": 1,
        "per_page": 15,
        "total": 1
    }
}
```

### 2. Crear Rol
**POST** `/api/roles`

Crea un nuevo rol en el sistema.

**Parámetros requeridos:**
```json
{
    "descripcion": "Administrador",
    "estado": "activo"
}
```

**Validaciones:**
- `descripcion`: Requerido, string, mínimo 2 caracteres, máximo 255 caracteres
- `estado`: Opcional, string, valores permitidos: "activo", "suspendido" (por defecto: "activo")

**Respuesta Exitosa:**
```json
{
    "success": true,
    "message": "Rol creado exitosamente",
    "data": {
        "id": 2,
        "descripcion": "Administrador",
        "estado": "activo",
        "estado_info": {
            "label": "Activo",
            "is_active": true,
            "is_suspended": false
        },
        "users_count": 0,
        "created_at": "2025-09-25 17:30:00",
        "updated_at": "2025-09-25 17:30:00"
    }
}
```

### 3. Obtener Rol por ID
**GET** `/api/roles/{id}`

Obtiene los datos de un rol específico.

**Parámetros de URL:**
- `id` (int): ID del rol

**Respuesta Exitosa:**
```json
{
    "success": true,
    "message": "Rol obtenido exitosamente",
    "data": {
        "id": 1,
        "descripcion": "Super Administrador",
        "estado": "activo",
        "estado_info": {
            "label": "Activo",
            "is_active": true,
            "is_suspended": false
        },
        "users_count": 1,
        "created_at": "2025-09-25 16:54:00",
        "updated_at": "2025-09-25 16:54:00"
    }
}
```

### 4. Actualizar Rol
**PUT** `/api/roles/{id}`

Actualiza los datos de un rol existente.

**Parámetros de URL:**
- `id` (int): ID del rol

**Parámetros del body:**
```json
{
    "descripcion": "Super Administrador Actualizado",
    "estado": "suspendido"
}
```

**Validaciones:**
- `descripcion`: Opcional, string, mínimo 2 caracteres, máximo 255 caracteres
- `estado`: Opcional, string, valores permitidos: "activo", "suspendido"

**Respuesta Exitosa:**
```json
{
    "success": true,
    "message": "Rol actualizado exitosamente",
    "data": {
        "id": 1,
        "descripcion": "Super Administrador Actualizado",
        "estado": "suspendido",
        "estado_info": {
            "label": "Suspendido",
            "is_active": false,
            "is_suspended": true
        },
        "users_count": 1,
        "created_at": "2025-09-25 16:54:00",
        "updated_at": "2025-09-25 18:00:00"
    }
}
```

### 5. Eliminar Rol
**DELETE** `/api/roles/{id}`

Elimina un rol del sistema.

**Parámetros de URL:**
- `id` (int): ID del rol

**Respuesta Exitosa:**
```json
{
    "success": true,
    "message": "Rol eliminado exitosamente"
}
```

### 6. Buscar Roles
**GET** `/api/roles/search`

Busca roles por descripción.

**Parámetros de consulta:**
- `q` (string): Término de búsqueda
- `page` (int): Número de página (opcional)
- `per_page` (int): Elementos por página (opcional)

**Ejemplo de URL:**
```
GET /api/roles/search?q=admin&page=1&per_page=10
```

**Respuesta Exitosa:**
```json
{
    "success": true,
    "message": "Búsqueda realizada exitosamente",
    "data": [
        {
            "id": 1,
            "descripcion": "Super Administrador",
            "estado": "activo",
            "estado_info": {
                "label": "Activo",
                "is_active": true,
                "is_suspended": false
            },
            "users_count": 1,
            "created_at": "2025-09-25 16:54:00",
            "updated_at": "2025-09-25 16:54:00"
        }
    ],
    "pagination": {
        "current_page": 1,
        "last_page": 1,
        "per_page": 10,
        "total": 1
    }
}
```

## Estructura de Datos

### Objeto Rol
```json
{
    "id": 1,
    "descripcion": "Super Administrador",
    "estado": "activo",
    "estado_info": {
        "label": "Activo",
        "is_active": true,
        "is_suspended": false
    },
    "users_count": 1,
    "created_at": "2025-09-25 16:54:00",
    "updated_at": "2025-09-25 16:54:00"
}
```

### Campos Explicados
- `id`: Identificador único del rol
- `descripcion`: Nombre descriptivo del rol
- `estado`: Estado actual del rol ("activo" o "suspendido")
- `estado_info`: Información adicional del estado
  - `label`: Etiqueta legible del estado
  - `is_active`: Booleano que indica si está activo
  - `is_suspended`: Booleano que indica si está suspendido
- `users_count`: Número de usuarios asignados a este rol
- `created_at`: Fecha y hora de creación
- `updated_at`: Fecha y hora de última actualización

## Códigos de Estado HTTP

- **200 OK**: Operación exitosa
- **201 Created**: Recurso creado exitosamente
- **400 Bad Request**: Datos de entrada inválidos
- **401 Unauthorized**: Token de autenticación inválido o faltante
- **403 Forbidden**: Sin permisos para realizar la acción
- **404 Not Found**: Rol no encontrado
- **422 Unprocessable Entity**: Errores de validación
- **500 Internal Server Error**: Error interno del servidor

## Errores de Validación

Cuando hay errores de validación, la respuesta será:

```json
{
    "success": false,
    "message": "Errores de validación",
    "errors": {
        "descripcion": [
            "La descripción es obligatoria"
        ],
        "estado": [
            "El estado debe ser activo o suspendido"
        ]
    }
}
```

## Ejemplos de Uso con JavaScript

### Obtener todos los roles
```javascript
const response = await fetch('/api/roles', {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
});
const data = await response.json();
```

### Crear un nuevo rol
```javascript
const response = await fetch('/api/roles', {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        descripcion: 'Moderador',
        estado: 'activo'
    })
});
const data = await response.json();
```

### Actualizar un rol
```javascript
const response = await fetch(`/api/roles/${rolId}`, {
    method: 'PUT',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        descripcion: 'Moderador Senior',
        estado: 'activo'
    })
});
const data = await response.json();
```

---

**Última actualización:** 25 de septiembre de 2025
**Versión de la API:** v1.0
**Framework:** Laravel 12