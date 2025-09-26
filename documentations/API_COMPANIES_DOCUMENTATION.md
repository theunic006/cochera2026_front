# API CRUD de Empresas - Laravel 12

Esta documentación describe los endpoints disponibles para realizar CRUD (Create, Read, Update, Delete) de empresas en el sistema.

## Base URL
```
http://localhost:8000/api/companies
```

## Autenticación
Todos los endpoints requieren autenticación Bearer Token.
```
Authorization: Bearer {access_token}
```

## Endpoints Disponibles

### 1. Listar Empresas
**GET** `/api/companies`

Obtiene una lista paginada de todas las empresas del sistema.

**Parámetros de consulta opcionales:**
- `page` (int): Número de página (por defecto: 1)
- `per_page` (int): Elementos por página (por defecto: 15)

**Respuesta Exitosa:**
```json
{
    "success": true,
    "message": "Empresas obtenidas exitosamente",
    "data": [
        {
            "id": 16,
            "nombre": "Mercado de Flores",
            "ubicacion": "Lima, Perú",
            "logo": null,
            "descripcion": "Empresa de prueba para testing",
            "estado": "activo",
            "estado_info": {
                "label": "Activo",
                "is_active": true,
                "is_suspended": false
            },
            "users_count": 1,
            "created_at": "2025-09-25 19:01:56",
            "updated_at": "2025-09-25 19:01:56"
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

### 2. Crear Empresa
**POST** `/api/companies`

Crea una nueva empresa en el sistema y automáticamente crea un usuario administrador para ella.

**Parámetros requeridos:**
```json
{
    "nombre": "Tech Solutions SA",
    "ubicacion": "Madrid, España",
    "descripcion": "Empresa de desarrollo de software",
    "estado": "activo"
}
```

**Validaciones:**
- `nombre`: Requerido, string, mínimo 2 caracteres, máximo 255 caracteres
- `ubicacion`: Requerido, string, mínimo 3 caracteres, máximo 255 caracteres
- `descripcion`: Opcional, string, máximo 1000 caracteres
- `estado`: Opcional, string, valores permitidos: "activo", "suspendido" (por defecto: "activo")

**Respuesta Exitosa:**
```json
{
    "success": true,
    "message": "Empresa creada exitosamente",
    "data": {
        "id": 17,
        "nombre": "Tech Solutions SA",
        "ubicacion": "Madrid, España",
        "logo": null,
        "descripcion": "Empresa de desarrollo de software",
        "estado": "activo",
        "estado_info": {
            "label": "Activo",
            "is_active": true,
            "is_suspended": false
        },
        "users_count": 1,
        "created_at": "2025-09-25 20:00:00",
        "updated_at": "2025-09-25 20:00:00"
    }
}
```

### 3. Obtener Empresa por ID
**GET** `/api/companies/{id}`

Obtiene los datos de una empresa específica.

**Parámetros de URL:**
- `id` (int): ID de la empresa

**Respuesta Exitosa:**
```json
{
    "success": true,
    "message": "Empresa obtenida exitosamente",
    "data": {
        "id": 16,
        "nombre": "Mercado de Flores",
        "ubicacion": "Lima, Perú",
        "logo": null,
        "descripcion": "Empresa de prueba para testing",
        "estado": "activo",
        "estado_info": {
            "label": "Activo",
            "is_active": true,
            "is_suspended": false
        },
        "users_count": 1,
        "created_at": "2025-09-25 19:01:56",
        "updated_at": "2025-09-25 19:01:56"
    }
}
```

### 4. Actualizar Empresa
**PUT** `/api/companies/{id}`

Actualiza los datos de una empresa existente.

**Parámetros de URL:**
- `id` (int): ID de la empresa

**Parámetros del body:**
```json
{
    "nombre": "Mercado de Flores Premium",
    "ubicacion": "Lima, Perú",
    "descripcion": "Empresa especializada en flores y decoración",
    "estado": "activo"
}
```

**Validaciones:**
- `nombre`: Opcional, string, mínimo 2 caracteres, máximo 255 caracteres
- `ubicacion`: Opcional, string, mínimo 3 caracteres, máximo 255 caracteres
- `descripcion`: Opcional, string, máximo 1000 caracteres
- `estado`: Opcional, string, valores permitidos: "activo", "suspendido"

**Respuesta Exitosa:**
```json
{
    "success": true,
    "message": "Empresa actualizada exitosamente",
    "data": {
        "id": 16,
        "nombre": "Mercado de Flores Premium",
        "ubicacion": "Lima, Perú",
        "logo": null,
        "descripcion": "Empresa especializada en flores y decoración",
        "estado": "activo",
        "estado_info": {
            "label": "Activo",
            "is_active": true,
            "is_suspended": false
        },
        "users_count": 1,
        "created_at": "2025-09-25 19:01:56",
        "updated_at": "2025-09-25 20:15:00"
    }
}
```

### 5. Eliminar Empresa
**DELETE** `/api/companies/{id}`

Elimina una empresa del sistema.

**Parámetros de URL:**
- `id` (int): ID de la empresa

**Respuesta Exitosa:**
```json
{
    "success": true,
    "message": "Empresa eliminada exitosamente"
}
```

### 6. Buscar Empresas
**GET** `/api/companies/search`

Busca empresas por nombre.

**Parámetros de consulta:**
- `q` (string): Término de búsqueda
- `page` (int): Número de página (opcional)
- `per_page` (int): Elementos por página (opcional)

**Ejemplo de URL:**
```
GET /api/companies/search?q=mercado&page=1&per_page=10
```

**Respuesta Exitosa:**
```json
{
    "success": true,
    "message": "Búsqueda realizada exitosamente",
    "data": [
        {
            "id": 16,
            "nombre": "Mercado de Flores",
            "ubicacion": "Lima, Perú",
            "logo": null,
            "descripcion": "Empresa de prueba para testing",
            "estado": "activo",
            "estado_info": {
                "label": "Activo",
                "is_active": true,
                "is_suspended": false
            },
            "users_count": 1,
            "created_at": "2025-09-25 19:01:56",
            "updated_at": "2025-09-25 19:01:56"
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

### 7. Obtener Estados Disponibles
**GET** `/api/companies/statuses`

Obtiene la lista de estados disponibles para las empresas.

**Respuesta Exitosa:**
```json
{
    "success": true,
    "message": "Estados obtenidos exitosamente",
    "data": [
        {
            "value": "activo",
            "label": "Activo"
        },
        {
            "value": "suspendido",
            "label": "Suspendido"
        }
    ]
}
```

### 8. Filtrar Empresas por Estado
**GET** `/api/companies/by-status`

Filtra empresas por estado específico.

**Parámetros de consulta:**
- `status` (string): Estado a filtrar ("activo" o "suspendido")
- `page` (int): Número de página (opcional)
- `per_page` (int): Elementos por página (opcional)

**Ejemplo de URL:**
```
GET /api/companies/by-status?status=activo&page=1&per_page=15
```

**Respuesta Exitosa:**
```json
{
    "success": true,
    "message": "Empresas filtradas exitosamente",
    "data": [
        {
            "id": 16,
            "nombre": "Mercado de Flores",
            "ubicacion": "Lima, Perú",
            "logo": null,
            "descripcion": "Empresa de prueba para testing",
            "estado": "activo",
            "estado_info": {
                "label": "Activo",
                "is_active": true,
                "is_suspended": false
            },
            "users_count": 1,
            "created_at": "2025-09-25 19:01:56",
            "updated_at": "2025-09-25 19:01:56"
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

### 9. Activar Empresa
**PATCH** `/api/companies/{id}/activate`

Activa una empresa específica.

**Parámetros de URL:**
- `id` (int): ID de la empresa

**Respuesta Exitosa:**
```json
{
    "success": true,
    "message": "Empresa activada exitosamente",
    "data": {
        "id": 16,
        "nombre": "Mercado de Flores",
        "ubicacion": "Lima, Perú",
        "logo": null,
        "descripcion": "Empresa de prueba para testing",
        "estado": "activo",
        "estado_info": {
            "label": "Activo",
            "is_active": true,
            "is_suspended": false
        },
        "users_count": 1,
        "created_at": "2025-09-25 19:01:56",
        "updated_at": "2025-09-25 20:30:00"
    }
}
```

### 10. Suspender Empresa
**PATCH** `/api/companies/{id}/suspend`

Suspende una empresa específica.

**Parámetros de URL:**
- `id` (int): ID de la empresa

**Respuesta Exitosa:**
```json
{
    "success": true,
    "message": "Empresa suspendida exitosamente",
    "data": {
        "id": 16,
        "nombre": "Mercado de Flores",
        "ubicacion": "Lima, Perú",
        "logo": null,
        "descripcion": "Empresa de prueba para testing",
        "estado": "suspendido",
        "estado_info": {
            "label": "Suspendido",
            "is_active": false,
            "is_suspended": true
        },
        "users_count": 1,
        "created_at": "2025-09-25 19:01:56",
        "updated_at": "2025-09-25 20:35:00"
    }
}
```

### 11. Cambiar Estado de Empresa
**PATCH** `/api/companies/{id}/change-status`

Cambia el estado de una empresa a un valor específico.

**Parámetros de URL:**
- `id` (int): ID de la empresa

**Parámetros del body:**
```json
{
    "status": "suspendido"
}
```

**Validaciones:**
- `status`: Requerido, string, valores permitidos: "activo", "suspendido"

**Respuesta Exitosa:**
```json
{
    "success": true,
    "message": "Estado de empresa cambiado exitosamente",
    "data": {
        "id": 16,
        "nombre": "Mercado de Flores",
        "ubicacion": "Lima, Perú",
        "logo": null,
        "descripcion": "Empresa de prueba para testing",
        "estado": "suspendido",
        "estado_info": {
            "label": "Suspendido",
            "is_active": false,
            "is_suspended": true
        },
        "users_count": 1,
        "created_at": "2025-09-25 19:01:56",
        "updated_at": "2025-09-25 20:40:00"
    }
}
```

## Estructura de Datos

### Objeto Empresa
```json
{
    "id": 16,
    "nombre": "Mercado de Flores",
    "ubicacion": "Lima, Perú",
    "logo": null,
    "descripcion": "Empresa de prueba para testing",
    "estado": "activo",
    "estado_info": {
        "label": "Activo",
        "is_active": true,
        "is_suspended": false
    },
    "users_count": 1,
    "created_at": "2025-09-25 19:01:56",
    "updated_at": "2025-09-25 19:01:56"
}
```

### Campos Explicados
- `id`: Identificador único de la empresa
- `nombre`: Nombre de la empresa
- `ubicacion`: Ubicación geográfica de la empresa
- `logo`: URL del logo de la empresa (puede ser null)
- `descripcion`: Descripción detallada de la empresa
- `estado`: Estado actual de la empresa ("activo" o "suspendido")
- `estado_info`: Información adicional del estado
  - `label`: Etiqueta legible del estado
  - `is_active`: Booleano que indica si está activa
  - `is_suspended`: Booleano que indica si está suspendida
- `users_count`: Número de usuarios asignados a esta empresa
- `created_at`: Fecha y hora de creación
- `updated_at`: Fecha y hora de última actualización

## Códigos de Estado HTTP

- **200 OK**: Operación exitosa
- **201 Created**: Recurso creado exitosamente
- **400 Bad Request**: Datos de entrada inválidos
- **401 Unauthorized**: Token de autenticación inválido o faltante
- **403 Forbidden**: Sin permisos para realizar la acción
- **404 Not Found**: Empresa no encontrada
- **422 Unprocessable Entity**: Errores de validación
- **500 Internal Server Error**: Error interno del servidor

## Errores de Validación

Cuando hay errores de validación, la respuesta será:

```json
{
    "success": false,
    "message": "Errores de validación",
    "errors": {
        "nombre": [
            "El nombre es obligatorio"
        ],
        "ubicacion": [
            "La ubicación es obligatoria"
        ],
        "estado": [
            "El estado debe ser activo o suspendido"
        ]
    }
}
```

## Ejemplos de Uso con JavaScript

### Obtener todas las empresas
```javascript
const response = await fetch('/api/companies', {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
});
const data = await response.json();
```

### Crear una nueva empresa
```javascript
const response = await fetch('/api/companies', {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        nombre: 'Mi Nueva Empresa',
        ubicacion: 'Ciudad, País',
        descripcion: 'Descripción de la empresa',
        estado: 'activo'
    })
});
const data = await response.json();
```

### Buscar empresas
```javascript
const response = await fetch('/api/companies/search?q=mercado', {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
});
const data = await response.json();
```

### Cambiar estado de empresa
```javascript
const response = await fetch(`/api/companies/${companyId}/change-status`, {
    method: 'PATCH',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        status: 'suspendido'
    })
});
const data = await response.json();
```

---

**Última actualización:** 25 de septiembre de 2025
**Versión de la API:** v1.0
**Framework:** Laravel 12