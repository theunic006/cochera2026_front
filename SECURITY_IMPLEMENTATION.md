# 🔒 Sistema de Seguridad Anti-Bot Implementado

## 📋 Resumen de Implementación

Hemos implementado un sistema completo de seguridad para proteger los endpoints de login y registro contra ataques automatizados y bots maliciosos.

## 🛡️ Componentes de Seguridad

### 1. Google reCAPTCHA v3
- **Ubicación**: Frontend (React)
- **Archivos modificados**:
  - `src/context/RecaptchaContext.jsx` (nuevo)
  - `src/App.jsx` (agregado RecaptchaProvider)
  - `src/components/Register.jsx` (integración reCAPTCHA)
  - `src/components/Login.jsx` (integración reCAPTCHA)

### 2. Validación Backend
- **Ubicación**: Backend (Laravel)
- **Archivos creados**:
  - `app/Services/RecaptchaService.php` (nuevo)
  - `app/Http/Middleware/VerifyRecaptcha.php` (nuevo)
  - `app/Http/Middleware/CustomRateLimit.php` (nuevo)

### 3. Rate Limiting
- **Configuración**: Limita intentos por IP
- **Límites establecidos**:
  - Registro: 5 intentos por 15 minutos
  - Login: 5 intentos por 15 minutos

## 🔑 Configuración de reCAPTCHA

### Frontend (.env)
```env
VITE_RECAPTCHA_SITE_KEY=6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI
```

### Backend (.env) - Agregar estas líneas
```env
RECAPTCHA_SECRET_KEY=6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe


CLAVES:
SITIO WEB: 6LeWoOsrAAAAAJ2aU4_fodALjLZ-AVULKDwyzlqc
CLAVE SECRETA: 6LeWoOsrAAAAADWEmXx4rQcpyQ9-cBsrnpNYYF4G
```

⚠️ **IMPORTANTE**: Las claves mostradas son de prueba. Para producción:
1. Ve a https://www.google.com/recaptcha/admin/create
2. Registra tu dominio
3. Reemplaza las claves de prueba con las reales

## 🚀 Funcionalidades Implementadas

### ✅ Frontend
- [x] reCAPTCHA v3 integrado en Login y Register
- [x] Validación automática antes del envío
- [x] Indicadores visuales de seguridad
- [x] Manejo de errores de verificación

### ✅ Backend
- [x] Servicio de verificación reCAPTCHA
- [x] Middleware de rate limiting
- [x] Validación de score de reCAPTCHA (threshold: 0.5)
- [x] Logs de seguridad

## 🎯 Cómo Funciona

### Flujo de Registro/Login Seguro:
1. **Usuario llena formulario** → Se muestra indicador de protección
2. **Usuario envía formulario** → Se ejecuta reCAPTCHA automáticamente
3. **Token se envía al backend** → Se valida con Google
4. **Backend verifica score** → Debe ser > 0.5 para proceder
5. **Rate limiting aplica** → Máximo 5 intentos por 15 minutos
6. **Proceso continúa** → Solo si todas las validaciones pasan

### Protección Múltiple:
- 🛡️ **reCAPTCHA v3**: Detecta comportamiento de bot
- ⏱️ **Rate Limiting**: Previene ataques de fuerza bruta
- 📍 **IP Tracking**: Limita por dirección IP
- 📊 **Score Analysis**: Solo permite usuarios "humanos"

## 🔧 Configuración para Producción

### 1. Obtener Claves Reales
```bash
# 1. Ve a Google reCAPTCHA Admin Console
# 2. Crea un nuevo sitio v3
# 3. Agrega tu dominio
# 4. Copia las claves
```

### 2. Actualizar Variables de Entorno
```env
# Frontend (.env)
VITE_RECAPTCHA_SITE_KEY=tu_clave_publica_real

# Backend (.env)
RECAPTCHA_SECRET_KEY=tu_clave_secreta_real
```

### 3. Ajustar Configuraciones
```php
// En RecaptchaService.php - ajustar threshold si es necesario
$scoreThreshold = 0.7; // Más estricto para producción

// En CustomRateLimit.php - ajustar límites
$maxAttempts = 3; // Más estricto
$decayMinutes = 30; // Más tiempo de penalización
```

## 📊 Monitoreo y Logs

### Logs Generados:
- ✅ Verificaciones exitosas de reCAPTCHA
- ❌ Intentos fallidos de verificación
- 🚫 Rate limiting activado
- 📈 Scores de reCAPTCHA para análisis

### Ubicación de Logs:
```bash
# Laravel logs
storage/logs/laravel.log

# Buscar eventos de seguridad
grep "reCAPTCHA" storage/logs/laravel.log
grep "rate_limit" storage/logs/laravel.log
```

## 🧪 Testing

### Para probar la protección:
1. **Intenta registrar 6 empresas rápidamente** → Debería bloquear después de 5
2. **Usa herramientas como curl sin reCAPTCHA** → Debería fallar
3. **Monitorea logs** → Deberías ver eventos de seguridad

### Ejemplo de testing con curl:
```bash
# Esto debería fallar por falta de reCAPTCHA
curl -X POST http://127.0.0.1:8000/api/companies/register \
  -F "nombre=Test Company" \
  -F "ubicacion=Lima" \
  -F "capacidad=50"
```

## 🎉 Beneficios Obtenidos

1. **Protección contra bots** 🤖
2. **Prevención de spam** 📧
3. **Reducción de carga del servidor** ⚡
4. **Mejor experiencia de usuario legítimo** 👥
5. **Compliance con mejores prácticas** ✅

## 🆘 Solución de Problemas

### Error: "reCAPTCHA no disponible"
- Verificar que las claves estén en .env
- Comprobar conexión a internet
- Revisar consola del navegador

### Error: "Demasiados intentos"
- Esperar el tiempo indicado
- Verificar que no haya un bot haciendo requests
- Revisar logs del servidor

### Score muy bajo
- Ajustar threshold en RecaptchaService
- Verificar comportamiento del usuario
- Analizar logs para patrones

¡Tu sistema ahora está protegido contra ataques automatizados! 🛡️✨