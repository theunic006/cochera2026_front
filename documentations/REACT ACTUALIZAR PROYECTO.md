# 🔄 Actualizar Proyecto React 19 en WHM/cPanel

cp -r dist/* ../garage/

## 🎯 Objetivo
Actualizar un proyecto React 19 existente en WHM/cPanel desde GitHub usando SSH, manteniendo la configuración de producción y minimizando el tiempo de inactividad.

## 📋 Requisitos Previos
- Proyecto React 19 ya desplegado en el servidor
- Acceso SSH al servidor
- Node.js 18+ configurado
- Repositorio GitHub actualizado
- Backup de la aplicación actual (recomendado)

## 🌐 Información del Servidor
- **Dominio**: https://garage-peru.shop
- **API**: https://api.garage-peru.shop
- **Ruta Frontend**: `/home/ortegaestudios/public_html/garage`
- **Document Root**: `/home/ortegaestudios/public_html/`
- **Usuario SSH**: ortegaestudios

## 🔧 Proceso de Actualización

### 1. Conectar por SSH
```bash
ssh ortegaestudios@garage-peru.shop
```

### 2. Navegar al Directorio del Proyecto
```bash
cd /home/ortegaestudios/public_html/garage
```

### 3. Verificar Estado Actual
```bash
# Verificar rama actual
git branch

# Verificar estado de archivos
git status

# Ver último commit
git log --oneline -5

# Verificar versión de Node.js
node --version
```

### 4. Backup Preventivo (Recomendado)

#### Backup de Archivos del Frontend
```bash
# Crear backup del código fuente
cd /home/ortegaestudios/public_html
tar -czf frontend_backup_$(date +%Y%m%d_%H%M%S).tar.gz \
    --exclude='garage/node_modules' \
    --exclude='garage/dist' \
    garage/

# Backup del document root actual
tar -czf public_html_backup_$(date +%Y%m%d_%H%M%S).tar.gz \
    --exclude='garage' \
    --exclude='api' \
    .

# Verificar backups creados
ls -la *backup*.tar.gz
```

### 5. Crear Página de Mantenimiento (Opcional)
```bash
# Crear página temporal de mantenimiento
cat > /home/ortegaestudios/public_html/maintenance.html << 'EOF'
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cochera 2025 - En Mantenimiento</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 0;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container {
            text-align: center;
            background: white;
            padding: 3rem;
            border-radius: 16px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            max-width: 500px;
        }
        .icon { font-size: 4rem; margin-bottom: 1rem; }
        h1 { color: #1890ff; margin-bottom: 1rem; }
        p { color: #666; margin-bottom: 2rem; line-height: 1.6; }
        .spinner {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #1890ff;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 20px auto;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="icon">🚗</div>
        <h1>Cochera 2025</h1>
        <p>Estamos actualizando nuestro sistema para brindarte una mejor experiencia.</p>
        <div class="spinner"></div>
        <p><small>Estaremos de vuelta en unos minutos...</small></p>
    </div>
    <script>
        // Auto-refresh cada 30 segundos
        setTimeout(() => window.location.reload(), 30000);
    </script>
</body>
</html>
EOF

# Renombrar temporalmente el index.html actual
mv /home/ortegaestudios/public_html/index.html /home/ortegaestudios/public_html/index.html.updating
mv /home/ortegaestudios/public_html/maintenance.html /home/ortegaestudios/public_html/index.html
```

### 6. Actualizar Código desde GitHub
```bash
cd /home/ortegaestudios/public_html/garage

# Limpiar posibles cambios locales (si es seguro)
git stash

# Actualizar desde GitHub
git pull origin main
# O si usas otra rama
git pull origin production

# Verificar cambios
git log --oneline -5
```

### 7. Verificar y Actualizar Dependencias
```bash
# Verificar si package.json cambió
git diff HEAD~1 package.json

# Si hay cambios en dependencias, actualizar
if git diff HEAD~1 --name-only | grep -q package.json; then
    echo "📦 Actualizando dependencias..."
    
    # Limpiar cache de npm
    npm cache clean --force
    
    # Reinstalar dependencias
    rm -rf node_modules package-lock.json
    npm install
    
    echo "✅ Dependencias actualizadas"
else
    echo "ℹ️ No hay cambios en dependencias"
fi
```

### 8. Actualizar Variables de Entorno (Si es necesario)
```bash
# Verificar si hay cambios en archivos de configuración
git diff HEAD~1 --name-only | grep -E "\.(env|config)"

# Si hay cambios, revisar y actualizar .env.production
if [ -f .env.production ]; then
    echo "Revisando configuración de producción..."
    cat .env.production
    
    # Editar si es necesario
    # nano .env.production
fi
```

### 9. Construir Nueva Versión
```bash
# Limpiar build anterior
rm -rf dist/

# Construir aplicación optimizada
echo "🔨 Construyendo aplicación para producción..."
npm run build

# Verificar que el build fue exitoso
if [ -d "dist" ] && [ "$(ls -A dist)" ]; then
    echo "✅ Build completado exitosamente"
    ls -la dist/
else
    echo "❌ Error en el build"
    exit 1
fi
```

### 10. Actualizar Archivos en Document Root

#### Método Seguro con Respaldo
```bash
# Crear directorio temporal para nueva versión
mkdir -p /tmp/new_frontend_build

# Copiar nueva build
cp -r dist/* /tmp/new_frontend_build/

# Respaldar archivos actuales (excluyendo maintenance)
cd /home/ortegaestudios/public_html
mkdir -p .old_version_$(date +%Y%m%d_%H%M%S)

# Mover archivos actuales a backup (excepto maintenance y directorios especiales)
find . -maxdepth 1 -type f ! -name "index.html" ! -name "maintenance.html" ! -name ".htaccess" -exec mv {} .old_version_$(date +%Y%m%d_%H%M%S)/ \;
find . -maxdepth 1 -type d -name "assets" -exec mv {} .old_version_$(date +%Y%m%d_%H%M%S)/ \;

# Copiar nueva versión
cp -r /tmp/new_frontend_build/* ./

# Verificar que se copiaron correctamente
ls -la
```

### 11. Restaurar Configuraciones Importantes

#### Verificar .htaccess
```bash
# Verificar que .htaccess existe y tiene la configuración correcta
if [ ! -f .htaccess ]; then
    echo "⚠️ Recreando archivo .htaccess..."
    cat > .htaccess << 'EOF'
# Configuración para React SPA
RewriteEngine On

# Manejar rutas de React Router (SPA)
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !^/api/
RewriteRule . /index.html [L]

# Configuraciones de seguridad y CORS
<IfModule mod_headers.c>
    Header always set Access-Control-Allow-Origin "*"
    Header always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
    Header always set Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With"
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
</IfModule>

# Compresión y cache
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/css application/javascript
</IfModule>

<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/* "access plus 1 year"
</IfModule>
EOF
    echo "✅ .htaccess recreado"
fi
```

#### Verificar otros archivos importantes
```bash
# Verificar robots.txt
[ ! -f robots.txt ] && echo "User-agent: *\nAllow: /" > robots.txt

# Verificar manifest.json si tu app lo usa
[ ! -f manifest.json ] && echo "⚠️ manifest.json no encontrado"
```

### 12. Activar Nueva Versión
```bash
# Eliminar página de mantenimiento y activar nueva versión
rm -f maintenance.html

# Si existe index.html.updating, eliminarlo
rm -f index.html.updating

# Verificar que index.html de la nueva versión existe
if [ -f index.html ]; then
    echo "✅ Nueva versión activada"
else
    echo "❌ Error: index.html no encontrado"
    # Rollback si es necesario
fi
```

### 13. Verificar Permisos
```bash
# Establecer permisos correctos
find /home/ortegaestudios/public_html -type f -name "*.html" -exec chmod 644 {} \;
find /home/ortegaestudios/public_html -type f -name "*.css" -exec chmod 644 {} \;
find /home/ortegaestudios/public_html -type f -name "*.js" -exec chmod 644 {} \;
find /home/ortegaestudios/public_html -type d -exec chmod 755 {} \;

# Verificar propietario
chown -R ortegaestudios:ortegaestudios /home/ortegaestudios/public_html/
```

## 🧪 Verificación Post-Actualización

### 1. Verificar Aplicación Principal
```bash
# Verificar que el sitio responde
curl -I https://garage-peru.shop

# Verificar contenido HTML
curl -s https://garage-peru.shop | grep -i "cochera\|title"

# Verificar que no hay errores 404 en recursos
curl -I https://garage-peru.shop/assets/index.css
curl -I https://garage-peru.shop/assets/index.js
```

### 2. Verificar Rutas de React Router
```bash
# Probar diferentes rutas de la SPA
curl -I https://garage-peru.shop/dashboard
curl -I https://garage-peru.shop/login
curl -I https://garage-peru.shop/usuarios

# Todas deberían devolver 200 y servir index.html
```

### 3. Verificar Conectividad con API
```bash
# Probar desde el navegador o curl
curl -X GET https://api.garage-peru.shop/api/health
```

### 4. Monitorear Logs
```bash
# Verificar logs del servidor web (si tienes acceso)
tail -f /var/log/apache2/access_log | grep garage-peru.shop
tail -f /var/log/apache2/error_log | grep garage-peru.shop
```

## 🛠️ Script de Actualización Automatizada

Crear un script para automatizar el proceso:

```bash
# Crear script de actualización
mkdir -p /home/ortegaestudios/scripts
nano /home/ortegaestudios/scripts/update_react.sh
```

Contenido del script:
```bash
#!/bin/bash

# Script para actualizar React en producción
# Autor: Tu Nombre
# Fecha: $(date)

set -e  # Salir si hay algún error

echo "🚀 Iniciando actualización de React 19..."

# Variables
PROJECT_DIR="/home/ortegaestudios/public_html/garage"
PUBLIC_DIR="/home/ortegaestudios/public_html"
BACKUP_DIR="/home/ortegaestudios/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Crear directorio de backup si no existe
mkdir -p $BACKUP_DIR

# Función para rollback
rollback() {
    echo "❌ Error detectado. Iniciando rollback..."
    cd $PUBLIC_DIR
    
    # Restaurar desde backup más reciente
    LATEST_BACKUP=$(ls -t ${BACKUP_DIR}/frontend_backup_*.tar.gz 2>/dev/null | head -1)
    if [ -n "$LATEST_BACKUP" ]; then
        echo "📦 Restaurando desde backup: $LATEST_BACKUP"
        tar -xzf "$LATEST_BACKUP"
        echo "✅ Rollback completado"
    else
        echo "❌ No hay backups disponibles"
    fi
    exit 1
}

# Configurar trap para rollback en caso de error
trap rollback ERR

echo "📦 Creando backup..."
cd $PUBLIC_DIR
tar -czf "$BACKUP_DIR/frontend_backup_$DATE.tar.gz" \
    --exclude='garage/node_modules' \
    --exclude='garage/dist' \
    garage/ \
    index.html \
    assets/ \
    2>/dev/null || echo "Algunos archivos no existen, continuando..."

echo "🔧 Activando página de mantenimiento..."
cd $PUBLIC_DIR
[ -f index.html ] && mv index.html index.html.updating
cat > maintenance.html << 'EOF'
<!DOCTYPE html>
<html><head><title>Mantenimiento</title></head>
<body style="font-family:Arial;text-align:center;padding:50px;">
<h1>🚗 Cochera 2025</h1>
<p>Actualizando sistema...</p>
<script>setTimeout(()=>location.reload(),30000);</script>
</body></html>
EOF
mv maintenance.html index.html

echo "📥 Actualizando código..."
cd $PROJECT_DIR
git stash push -m "Auto-stash before update $DATE" || true
git pull origin main

echo "📚 Verificando dependencias..."
if git diff HEAD~1 --name-only | grep -q package.json; then
    echo "📦 Actualizando dependencias..."
    npm cache clean --force
    rm -rf node_modules package-lock.json
    npm install
fi

echo "🔨 Construyendo aplicación..."
rm -rf dist/
npm run build

# Verificar que build fue exitoso
if [ ! -d "dist" ] || [ ! "$(ls -A dist)" ]; then
    echo "❌ Build falló"
    exit 1
fi

echo "🚀 Desplegando nueva versión..."
cd $PUBLIC_DIR

# Respaldar archivos actuales
mkdir -p .old_version_$DATE
find . -maxdepth 1 -type f ! -name "index.html" ! -name ".htaccess" -exec mv {} .old_version_$DATE/ \; 2>/dev/null || true
find . -maxdepth 1 -type d -name "assets" -exec mv {} .old_version_$DATE/ \; 2>/dev/null || true

# Copiar nueva versión
cp -r $PROJECT_DIR/dist/* ./

# Verificar .htaccess
if [ ! -f .htaccess ]; then
    echo "RewriteEngine On" > .htaccess
    echo "RewriteCond %{REQUEST_FILENAME} !-f" >> .htaccess
    echo "RewriteCond %{REQUEST_FILENAME} !-d" >> .htaccess
    echo "RewriteRule . /index.html [L]" >> .htaccess
fi

echo "✅ Activando nueva versión..."
# El index.html ya fue copiado del build, remover mantenimiento si existe
rm -f maintenance.html index.html.updating

echo "🔧 Configurando permisos..."
find . -type f -name "*.html" -exec chmod 644 {} \;
find . -type f -name "*.css" -exec chmod 644 {} \;
find . -type f -name "*.js" -exec chmod 644 {} \;
find . -type d -exec chmod 755 {} \;
chown -R ortegaestudios:ortegaestudios .

echo "🧪 Verificando despliegue..."
sleep 2
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" https://garage-peru.shop)
if [ "$RESPONSE" = "200" ]; then
    echo "✅ ¡Actualización completada exitosamente!"
    echo "🌐 Sitio disponible en: https://garage-peru.shop"
else
    echo "⚠️ Advertencia: El sitio responde con código $RESPONSE"
fi

echo "📊 Resumen de la actualización:"
echo "- Backup creado: frontend_backup_$DATE.tar.gz"
echo "- Último commit aplicado:"
cd $PROJECT_DIR
git log --oneline -1

echo "🎉 ¡Actualización completada!"
```

Hacer el script ejecutable:
```bash
chmod +x /home/ortegaestudios/scripts/update_react.sh
```

Ejecutar el script:
```bash
/home/ortegaestudios/scripts/update_react.sh
```

## 🚨 Solución de Problemas

### Si la Actualización Falla

#### 1. Rollback Manual
```bash
cd /home/ortegaestudios/public_html

# Restaurar desde backup
LATEST_BACKUP=$(ls -t /home/ortegaestudios/backups/frontend_backup_*.tar.gz | head -1)
tar -xzf "$LATEST_BACKUP"

# Reactivar versión anterior
rm -f index.html
mv index.html.updating index.html 2>/dev/null || echo "No hay versión anterior"
```

#### 2. Rollback con Git
```bash
cd /home/ortegaestudios/public_html/garage

# Ver commits recientes
git log --oneline -10

# Volver al commit anterior
git reset --hard HEAD~1

# Reconstruir
npm run build
cp -r dist/* /home/ortegaestudios/public_html/
```

### Errores Comunes

#### Build Falla por Dependencias
```bash
# Limpiar completamente
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

# Verificar versión de Node
node --version  # Debe ser 18+
```

#### Error 404 en Rutas
```bash
# Verificar .htaccess
cat /home/ortegaestudios/public_html/.htaccess

# Recrear .htaccess si falta configuración SPA
```

#### Recursos Estáticos no Cargan
```bash
# Verificar que assets existe
ls -la /home/ortegaestudios/public_html/assets/

# Verificar permisos
chmod -R 644 /home/ortegaestudios/public_html/assets/*
```

## 📊 Monitoreo Post-Actualización

### 1. Health Check Automatizado
```bash
# Crear script de monitoreo
nano /home/ortegaestudios/scripts/health_check_frontend.sh
```

```bash
#!/bin/bash
SITE_URL="https://garage-peru.shop"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $SITE_URL)

if [ "$RESPONSE" = "200" ]; then
    echo "✅ Frontend funcionando correctamente"
else
    echo "❌ Frontend problema: HTTP $RESPONSE"
    # Aquí podrías agregar notificaciones
fi
```

### 2. Programar Verificaciones
```bash
# Agregar a crontab
crontab -e
```

```bash
# Verificar frontend cada 5 minutos
*/5 * * * * /home/ortegaestudios/scripts/health_check_frontend.sh >> /home/ortegaestudios/logs/frontend_health.log 2>&1
```

## ✅ Checklist de Actualización

- [ ] Backup de archivos creado
- [ ] Página de mantenimiento activada
- [ ] Código actualizado desde GitHub
- [ ] Dependencias verificadas/actualizadas
- [ ] Build de producción exitoso
- [ ] Archivos desplegados en document root
- [ ] .htaccess verificado
- [ ] Permisos configurados
- [ ] Página de mantenimiento removida
- [ ] Sitio accesible y funcionando
- [ ] Rutas de React funcionando
- [ ] Conexión con API verificada
- [ ] Monitoreo activado

## 📈 Mejores Prácticas

1. **Siempre hacer backup** antes de actualizar
2. **Usar página de mantenimiento** para mejor UX
3. **Verificar build localmente** antes de desplegar
4. **Monitorear después** de la actualización
5. **Tener plan de rollback** preparado
6. **Actualizar en horarios de bajo tráfico**
7. **Probar en staging** primero si es posible

---
**Fecha de creación**: Octubre 2025  
**Última actualización**: Octubre 2025  
**Versión**: 1.0