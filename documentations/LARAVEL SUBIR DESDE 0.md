# 📚 Subir Proyecto Laravel Initial a WHM/cPanel

## 🎯 Objetivo
Desplegar por primera vez un proyecto Laravel desde GitHub a un servidor WHM/cPanel usando SSH.

## 📋 Requisitos Previos
- Acceso SSH al servidor
- Proyecto Laravel en GitHub
- WHM/cPanel configurado
- PHP 8.1+ en el servidor
- Composer instalado en el servidor

## 🌐 Información del Servidor
- **Dominio**: https://garage-peru.shop
- **API**: https://api.garage-peru.shop
- **Ruta Backend**: `/home/ortegaestudios/public_html/api`
- **Usuario SSH**: ortegaestudios

## 🔧 Pasos de Instalación

### 1. Conectar por SSH
```bash
ssh ortegaestudios@garage-peru.shop
# O usando la IP del servidor
ssh ortegaestudios@[IP_DEL_SERVIDOR]
```

### 2. Navegar al Directorio de Destino
```bash
cd /home/ortegaestudios/public_html
```

### 3. Clonar el Repositorio
```bash
# Clonar el proyecto Laravel desde GitHub
git clone https://github.com/tu-usuario/tu-repo-laravel.git api

# Entrar al directorio
cd api
```

### 4. Instalar Dependencias
```bash
# Instalar dependencias de Composer
composer install --no-dev --optimize-autoloader

# Verificar que se instalaron correctamente
composer --version
```

### 5. Configurar Variables de Entorno
```bash
# Copiar el archivo de configuración
cp .env.example .env

# Editar el archivo .env
nano .env
```

### 6. Configuración del Archivo .env
```env
APP_NAME="Garage Peru Api"
APP_ENV=production
APP_KEY=base64:5KtOzobX0p8kl0k0++aiPA6dKiqrKAV699VH07kNDzM=
APP_DEBUG=false
APP_URL=https://api.garage-peru.shop

# Base de datos
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ortegaestudios_garage
DB_USERNAME=ortegaestudios_garage
DB_PASSWORD=TU_PASSWORD_DB

# Configuración CORS
SANCTUM_STATEFUL_DOMAINS=garage-peru.shop,api.garage-peru.shop
SESSION_DOMAIN=.garage-peru.shop
CORS_ALLOWED_ORIGINS=https://garage-peru.shop,https://api.garage-peru.shop
CORS_ALLOWED_METHODS=GET,POST,PUT,DELETE,OPTIONS
CORS_ALLOWED_HEADERS=Content-Type,Authorization,X-Requested-With,Accept,Origin
CORS_SUPPORTS_CREDENTIALS=true
```

### 7. Generar Clave de Aplicación
```bash
php artisan key:generate
```

### 8. Ejecutar Migraciones
```bash
# Ejecutar migraciones (primera vez)
php artisan migrate --force

# Si tienes seeders
php artisan db:seed --force
```

### 9. Configurar Permisos
```bash
# Dar permisos a storage y bootstrap/cache
chmod -R 775 storage
chmod -R 775 bootstrap/cache

# Cambiar propietario si es necesario
chown -R ortegaestudios:ortegaestudios storage
chown -R ortegaestudios:ortegaestudios bootstrap/cache
```

### 10. Configurar el Documento Root en cPanel

#### Opción A: Através de cPanel
1. Ir a **cPanel** → **Subdomains**
2. Crear subdominio `api` apuntando a `/home/ortegaestudios/public_html/api/public`

#### Opción B: Através de .htaccess (si api está en el root)
```bash
# Crear .htaccess en public_html
nano /home/ortegaestudios/public_html/.htaccess
```

Contenido del .htaccess:
```apache
# Redireccionar API al subdirectorio
RewriteEngine On
RewriteCond %{HTTP_HOST} ^api\.garage-peru\.shop$ [NC]
RewriteCond %{REQUEST_URI} !^/api/
RewriteRule ^(.*)$ /api/public/$1 [L]
```

### 11. Optimizar para Producción
```bash
# Cache de configuración
php artisan config:cache

# Cache de rutas
php artisan route:cache

# Cache de vistas
php artisan view:cache

# Optimizar autoloader
composer dump-autoload --optimize
```

### 12. Configurar Trabajos en Cola (Opcional)
```bash
# Si usas colas, configurar cron job
crontab -e
```

Agregar línea:
```bash
* * * * * cd /home/ortegaestudios/public_html/api && php artisan schedule:run >> /dev/null 2>&1
```

## 🧪 Verificación

### 1. Probar API
```bash
# Desde el servidor
curl -X GET https://api.garage-peru.shop/api/health

# O probar endpoint específico
curl -X POST https://api.garage-peru.shop/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password"}'
```

### 2. Verificar Logs
```bash
# Ver logs de Laravel
tail -f storage/logs/laravel.log

# Ver logs del servidor (si tienes acceso)
tail -f /var/log/apache2/error_log
# O
tail -f /var/log/nginx/error.log
```

## 🛠️ Solución de Problemas Comunes

### Error 500 - Internal Server Error
```bash
# Verificar permisos
ls -la storage/
ls -la bootstrap/cache/


### EDAR PERMISOS A LAS CARPETASDar permisos de escritura a toda la carpeta storage
chmod -R 775 storage/

# Cambiar propietario a usuario web (puede ser www-data, apache, o tu usuario)
chown -R ortegaestudios:ortegaestudios storage/

# Permisos específicos para subcarpetas
chmod -R 775 storage/app/
chmod -R 775 storage/app/public/
chmod -R 775 storage/framework/
chmod -R 775 storage/logs/

### Error de Base de Datos
```bash
# Verificar conexión
php artisan tinker
>>> DB::connection()->getPdo();
```

### Error de CORS
```bash
# Verificar configuración
php artisan config:show cors
```

### Cache de Configuración Corrupto
```bash
# Limpiar caches
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear
```

## 📝 Estructura Final
```
/home/ortegaestudios/public_html/api/
├── app/
├── bootstrap/
├── config/
├── database/
├── public/          # ← Document root del subdominio
├── resources/
├── routes/
├── storage/
├── vendor/
├── .env            # ← Configuración de producción
├── artisan
└── composer.json
```

## ✅ Checklist de Verificación

- [ ] Proyecto clonado correctamente
- [ ] Dependencias instaladas
- [ ] Archivo .env configurado
- [ ] Clave de aplicación generada
- [ ] Migraciones ejecutadas
- [ ] Permisos configurados
- [ ] Subdominio configurado
- [ ] Cache optimizado
- [ ] API responde correctamente
- [ ] CORS configurado
- [ ] Logs funcionando

## 📞 Contacto y Soporte
Si encuentras problemas durante el despliegue, verifica:
1. Los logs de Laravel en `storage/logs/laravel.log`
2. Los logs del servidor web
3. La configuración de permisos
4. La configuración de la base de datos

---
**Fecha de creación**: Octubre 2025  
**Última actualización**: Octubre 2025  
**Versión**: 1.0