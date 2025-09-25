# API CRUD de Usuarios - Laravel 12

Esta documentación describe las endpoints disponibles para realizar CRUD (Create, Read, Update, Delete) de usuarios en el sistema.

## Base URL
```
http://localhost/api/users
```

## Endpoints Disponibles

### 1. Listar Usuarios
**GET** `/api/users`

Obtiene una lista paginada de todos los usuarios del sistema.

**Respuesta Exitosa:**
```json
{
    "success": true,
    "message": "Usuarios obtenidos exitosamente",
    "data": [
        {
            "id": 1,
            "name": "Juan Pérez",
            "email": "juan@example.com",
            "email_verified_at": null,
            "created_at": "2025-09-24 10:30:00",
            "updated_at": "2025-09-24 10:30:00"
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

### 2. Crear Usuario
**POST** `/api/users`

Crea un nuevo usuario en el sistema.

**Parámetros requeridos:**
```json
{
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "password": "password123",
    "password_confirmation": "password123"
}
```

**Ejemplo con cURL:**
```bash
curl -X POST http://localhost/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "password": "password123",
    "password_confirmation": "password123"
  }'
```

**Respuesta Exitosa:**
```json
{
    "success": true,
    "message": "Usuario creado exitosamente",
    "data": {
        "id": 1,
        "name": "Juan Pérez",
        "email": "juan@example.com",
        "email_verified_at": null,
        "created_at": "2025-09-24 10:30:00",
        "updated_at": "2025-09-24 10:30:00"
    }
}
```

### 3. Mostrar Usuario Específico
**GET** `/api/users/{id}`

Obtiene los detalles de un usuario específico.

**Ejemplo:**
```bash
curl -X GET http://localhost/api/users/1
```

**Respuesta Exitosa:**
```json
{
    "success": true,
    "message": "Usuario obtenido exitosamente",
    "data": {
        "id": 1,
        "name": "Juan Pérez",
        "email": "juan@example.com",
        "email_verified_at": null,
        "created_at": "2025-09-24 10:30:00",
        "updated_at": "2025-09-24 10:30:00"
    }
}
```

### 4. Actualizar Usuario
**PUT** `/api/users/{id}`

Actualiza los datos de un usuario existente. Todos los parámetros son opcionales.

**Parámetros opcionales:**
```json
{
    "name": "Juan Carlos Pérez",
    "email": "juancarlos@example.com",
    "password": "newpassword123",
    "password_confirmation": "newpassword123"
}
```

**Ejemplo con cURL:**
```bash
curl -X PUT http://localhost/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Carlos Pérez",
    "email": "juancarlos@example.com"
  }'
```

**Respuesta Exitosa:**
```json
{
    "success": true,
    "message": "Usuario actualizado exitosamente",
    "data": {
        "id": 1,
        "name": "Juan Carlos Pérez",
        "email": "juancarlos@example.com",
        "email_verified_at": null,
        "created_at": "2025-09-24 10:30:00",
        "updated_at": "2025-09-24 11:45:00"
    }
}
```

### 5. Eliminar Usuario
**DELETE** `/api/users/{id}`

Elimina un usuario del sistema.

**Ejemplo:**
```bash
curl -X DELETE http://localhost/api/users/1
```

**Respuesta Exitosa:**
```json
{
    "success": true,
    "message": "Usuario eliminado exitosamente"
}
```

### 6. Buscar Usuarios
**GET** `/api/users/search?q={término}`

Busca usuarios por nombre o email.

**Ejemplo:**
```bash
curl -X GET "http://localhost/api/users/search?q=juan"
```

**Respuesta Exitosa:**
```json
{
    "success": true,
    "message": "Búsqueda completada exitosamente",
    "data": [
        {
            "id": 1,
            "name": "Juan Pérez",
            "email": "juan@example.com",
            "email_verified_at": null,
            "created_at": "2025-09-24 10:30:00",
            "updated_at": "2025-09-24 10:30:00"
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

## Códigos de Estado HTTP

- **200 OK**: Operación exitosa
- **201 Created**: Usuario creado exitosamente
- **400 Bad Request**: Parámetros faltantes o incorrectos
- **404 Not Found**: Usuario no encontrado
- **422 Unprocessable Entity**: Errores de validación
- **500 Internal Server Error**: Error interno del servidor

## Errores de Validación

Cuando hay errores de validación, la respuesta incluye detalles específicos:

```json
{
    "success": false,
    "message": "Errores de validación",
    "errors": {
        "email": ["Este correo electrónico ya está registrado."],
        "password": ["La contraseña debe tener al menos 8 caracteres."]
    }
}
```

## Validaciones

### Crear Usuario:
- `name`: Requerido, máximo 255 caracteres
- `email`: Requerido, formato de email válido, único en el sistema
- `password`: Requerido, mínimo 8 caracteres, debe confirmarse

### Actualizar Usuario:
- `name`: Opcional, máximo 255 caracteres
- `email`: Opcional, formato de email válido, único (excepto el usuario actual)
- `password`: Opcional, mínimo 8 caracteres, debe confirmarse

## Notas Técnicas

1. Todas las respuestas están en formato JSON
2. Las contraseñas se encriptan automáticamente con Hash
3. Los timestamps se formatean en 'Y-m-d H:i:s'
4. La paginación muestra 15 elementos por página por defecto
5. Los errores incluyen manejo de excepciones completo
