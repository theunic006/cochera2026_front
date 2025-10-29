# 🔄 Actualizar Proyecto Laravel en WHM/cPanel

## 🎯 Objetivo
Actualizar un proyecto Laravel existente en WHM/cPanel desde GitHub usando SSH, manteniendo la configuración y datos de producción.

## 📋 Requisitos Previos
- Proyecto Laravel ya desplegado en el servidor
- Acceso SSH al servidor
- Repositorio GitHub actualizado
- Backup de la base de datos (recomendado)

## 🌐 Información del Servidor
- **Dominio**: https://garage-peru.shop
- **API**: https://api.garage-peru.shop
- **Ruta Backend**: `/home/ortegaestudios/public_html/api`
- **Usuario SSH**: ortegaestudios

## 🔧 Proceso de Actualización

### 1. Conectar por SSH
```bash
ssh ortegaestudios@garage-peru.shop
```

### 2. Navegar al Directorio del Proyecto
```bash
cd /home/ortegaestudios/public_html/api
```

### 3. Verificar Estado Actual
```bash
# Verificar rama actual
git branch

# Verificar estado de archivos
git status

# Ver último commit
git log --oneline -5
```

### 4. Backup Preventivo (Recomendado)

#### Backup de Archivos
```bash
# Crear backup del proyecto
cd /home/ortegaestudios/public_html
tar -czf api_backup_$(date +%Y%m%d_%H%M%S).tar.gz api/

# Verificar backup creado
ls -la api_backup_*.tar.gz
```

#### Backup de Base de Datos
```bash
# Backup de la base de datos
mysqldump -u ortegaestudios_garage -p ortegaestudios_garage > db_backup_$(date +%Y%m%d_%H%M%S).sql
```

### 5. Activar Modo Mantenimiento
```bash
cd /home/ortegaestudios/public_html/api

# Activar modo mantenimiento
php artisan down --message="Actualizando sistema, estaremos de vuelta pronto"
```

### 6. Actualizar Código desde GitHub
```bash
# Limpiar caché antes de actualizar
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Realizar pull desde GitHub
git pull origin main
# O si usas otra rama
git pull origin production
```

### 7. Verificar Cambios
```bash
# Ver qué archivos cambiaron
git diff HEAD~1 --name-only

# Ver detalles de los cambios
git log --oneline -10
```

### 8. Actualizar Dependencias
```bash
# Actualizar dependencias de Composer
composer install --no-dev --optimize-autoloader

# Si hay nuevas dependencias, usar update
composer update --no-dev --optimize-autoloader
```

### 9. Ejecutar Migraciones (Si las hay)
```bash
# Verificar migraciones pendientes
php artisan migrate:status

# Ejecutar migraciones nuevas
php artisan migrate --force

# Si hay seeders nuevos (opcional)
# php artisan db:seed --class=NuevaSeederClass --force
```

### 10. Actualizar Configuraciones
```bash
# Regenerar cache de configuración
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Optimizar autoloader
composer dump-autoload --optimize
```

### 11. Verificar Permisos (Si es necesario)
```bash
# Verificar y ajustar permisos si hay archivos nuevos
chmod -R 775 storage
chmod -R 775 bootstrap/cache

# Verificar propietario
ls -la storage/
ls -la bootstrap/cache/
```

### 12. Probar la Aplicación
```bash
# Probar que la aplicación funciona
php artisan tinker
>>> App\Models\User::count();
>>> exit

# Probar endpoint de salud
curl -X GET https://api.garage-peru.shop/api/health
```

### 13. Desactivar Modo Mantenimiento
```bash
# Desactivar modo mantenimiento
php artisan up
```

## 🧪 Verificación Post-Actualización

### 1. Verificar API
```bash
# Probar endpoints principales
curl -X GET https://api.garage-peru.shop/api/companies
curl -X GET https://api.garage-peru.shop/api/users
```

### 2. Verificar Logs
```bash
# Verificar que no hay errores nuevos
tail -f storage/logs/laravel.log

# Verificar logs del servidor
tail -f /var/log/apache2/error_log  # Apache
# O
tail -f /var/log/nginx/error.log    # Nginx
```

### 3. Verificar Base de Datos
```bash
# Verificar conexión a BD
php artisan tinker
>>> DB::connection()->getPdo();
>>> App\Models\User::latest()->first();
>>> exit
```

## 🛠️ Script de Actualización Automatizada

Puedes crear un script para automatizar el proceso:

```bash
# Crear script de actualización
nano /home/ortegaestudios/scripts/update_laravel.sh
```

Contenido del script:
```bash
#!/bin/bash

# Script para actualizar Laravel en producción
# Autor: Tu Nombre
# Fecha: $(date)

echo "🚀 Iniciando actualización de Laravel..."

# Variables
PROJECT_DIR="/home/ortegaestudios/public_html/api"
BACKUP_DIR="/home/ortegaestudios/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Crear directorio de backup si no existe
mkdir -p $BACKUP_DIR

cd $PROJECT_DIR

echo "📦 Creando backup..."
tar -czf "$BACKUP_DIR/api_backup_$DATE.tar.gz" -C /home/ortegaestudios/public_html api/

echo "🔒 Activando modo mantenimiento..."
php artisan down --message="Actualizando sistema..."

echo "🧹 Limpiando caché..."
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

echo "📥 Actualizando código..."
git pull origin main

echo "📚 Actualizando dependencias..."
composer install --no-dev --optimize-autoloader

echo "🗃️ Ejecutando migraciones..."
php artisan migrate --force

echo "⚡ Optimizando aplicación..."
php artisan config:cache
php artisan route:cache
php artisan view:cache
composer dump-autoload --optimize

echo "✅ Desactivando modo mantenimiento..."
php artisan up

echo "🎉 ¡Actualización completada!"
echo "📊 Verificando estado..."
php artisan --version

# Mostrar último commit
echo "📝 Último commit aplicado:"
git log --oneline -1

echo "🔍 Para verificar logs: tail -f storage/logs/laravel.log"
```

Hacer el script ejecutable:
```bash
chmod +x /home/ortegaestudios/scripts/update_laravel.sh
```

Ejecutar el script:
```bash
/home/ortegaestudios/scripts/update_laravel.sh
```

## 🚨 Solución de Problemas

### Si la Actualización Falla

#### 1. Rollback con Git
```bash
# Ver commits recientes
git log --oneline -10

# Hacer rollback al commit anterior
git reset --hard HEAD~1

# O volver a un commit específico
git reset --hard [HASH_DEL_COMMIT]
```

#### 2. Restaurar desde Backup
```bash
# Detener servicios si es posible
php artisan down

# Restaurar desde backup
cd /home/ortegaestudios/public_html
rm -rf api/
tar -xzf api_backup_[FECHA].tar.gz

# Reactivar aplicación
cd api
php artisan up
```

#### 3. Restaurar Base de Datos
```bash
# Si hay problemas con migraciones
mysql -u ortegaestudios_garage -p ortegaestudios_garage < db_backup_[FECHA].sql
```

### Errores Comunes

#### Error de Permisos
```bash
# Restaurar permisos
chmod -R 775 storage/
chmod -R 775 bootstrap/cache/
chown -R ortegaestudios:ortegaestudios storage/
chown -R ortegaestudios:ortegaestudios bootstrap/cache/
```

#### Error de Dependencias
```bash
# Reinstalar dependencias
rm -rf vendor/
composer install --no-dev --optimize-autoloader
```

#### Error de Migraciones
```bash
# Verificar estado de migraciones
php artisan migrate:status

# Hacer rollback de migración problemática
php artisan migrate:rollback --step=1
```

## 📊 Monitoreo Post-Actualización

### 1. Configurar Alertas
```bash
# Crear script de monitoreo
nano /home/ortegaestudios/scripts/health_check.sh
```

```bash
#!/bin/bash
# Health check script
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" https://api.garage-peru.shop/api/health)

if [ $RESPONSE -ne 200 ]; then
    echo "❌ API no responde correctamente: HTTP $RESPONSE"
    # Aquí puedes agregar notificación por email/Slack
else
    echo "✅ API funcionando correctamente"
fi
```

### 2. Cron Job para Monitoreo
```bash
# Agregar a crontab
crontab -e
```

```bash
# Verificar API cada 5 minutos
*/5 * * * * /home/ortegaestudios/scripts/health_check.sh >> /home/ortegaestudios/logs/health_check.log 2>&1
```

## ✅ Checklist de Actualización

- [ ] Backup de archivos creado
- [ ] Backup de base de datos creado
- [ ] Modo mantenimiento activado
- [ ] Código actualizado desde GitHub
- [ ] Dependencias actualizadas
- [ ] Migraciones ejecutadas
- [ ] Cache regenerado
- [ ] Permisos verificados
- [ ] Aplicación probada
- [ ] Modo mantenimiento desactivado
- [ ] Logs verificados
- [ ] Monitoreo activado

## 📈 Mejores Prácticas

1. **Siempre hacer backup** antes de actualizar
2. **Probar en ambiente de staging** primero
3. **Actualizar en horarios de bajo tráfico**
4. **Monitorear logs** después de la actualización
5. **Tener plan de rollback** preparado
6. **Documentar cambios** importantes

---
**Fecha de creación**: Octubre 2025  
**Última actualización**: Octubre 2025  
**Versión**: 1.0