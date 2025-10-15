# 🚀 Subir Proyecto React 19 Inicial a WHM/cPanel

## 🎯 Objetivo
Desplegar por primera vez un proyecto React 19 desde GitHub a un servidor WHM/cPanel usando SSH, con optimización para producción.

## 📋 Requisitos Previos
- Acceso SSH al servidor
- Proyecto React 19 en GitHub
- Node.js 18+ en el servidor
- npm o yarn instalado
- WHM/cPanel configurado

## 🌐 Información del Servidor
- **Dominio**: https://garage-peru.shop
- **API**: https://api.garage-peru.shop
- **Ruta Frontend**: `/home/ortegaestudios/public_html/garage`
- **Document Root**: `/home/ortegaestudios/public_html/garage` (apunta a dominio principal)
- **Usuario SSH**: ortegaestudios

## 🔧 Pasos de Instalación

### 1. Conectar por SSH
```bash
ssh ortegaestudios@garage-peru.shop
# O usando la IP del servidor
ssh ortegaestudios@[IP_DEL_SERVIDOR]
```

### 2. Verificar Node.js y npm
```bash
# Verificar versión de Node.js (debe ser 18+)
node --version

# Verificar npm
npm --version

# Si Node.js no está instalado o es versión antigua
# Instalar nvm (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc

# Instalar y usar Node.js 18
nvm install 18
nvm use 18
nvm alias default 18
```

### 3. Navegar al Directorio de Destino
```bash
cd /home/ortegaestudios/public_html
```

### 4. Clonar el Repositorio React
```bash
# Clonar el proyecto React desde GitHub
git clone https://github.com/tu-usuario/tu-repo-react.git garage

# Entrar al directorio
cd garage
```

### 5. Instalar Dependencias
```bash
# Instalar dependencias del proyecto
npm install

# O si prefieres usar yarn
# yarn install

# Verificar que se instalaron correctamente
npm list --depth=0
```

### 6. Configurar Variables de Entorno

#### Crear archivo .env.production
```bash
# Crear archivo de configuración para producción
nano .env.production
```

Contenido del .env.production:
```env
# Configuración para PRODUCCIÓN
VITE_API_BASE_URL=https://api.garage-peru.shop/api

# reCAPTCHA Configuration para producción
VITE_RECAPTCHA_SITE_KEY=6LeWoOsrAAAAAJ2aU4_fodALjLZ-AVULKDwyzlqc

# Configuración de entorno
NODE_ENV=production
VITE_APP_ENV=production
VITE_APP_NAME="Cochera 2025"
VITE_APP_VERSION=1.0.0

# URLs del sistema
VITE_APP_URL=https://garage-peru.shop
VITE_API_URL=https://api.garage-peru.shop

# Configuración de logs
VITE_LOG_LEVEL=error

# Configuración de analytics (opcional)
# VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

#### Verificar archivo package.json
```bash
# Verificar scripts de build
cat package.json | grep -A 5 '"scripts"'
```

Asegurar que tenga script de build:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

### 7. Construir la Aplicación para Producción
```bash
# Limpiar cache si existe
npm run clean
# O manualmente
rm -rf dist/ node_modules/.vite/

# Construir aplicación optimizada para producción
npm run build

# Verificar que se creó el directorio dist
ls -la dist/
```

### 8. Configurar el Document Root

#### Opción A: Mover archivos al document root principal
```bash
# Crear backup del index.html actual si existe
mv /home/ortegaestudios/public_html/index.html /home/ortegaestudios/public_html/index.html.backup 2>/dev/null || true

# Copiar archivos construidos al document root
cp -r dist/* /home/ortegaestudios/public_html/

# Verificar que se copiaron correctamente
ls -la /home/ortegaestudios/public_html/
```

#### Opción B: Configurar subdirectorio (si prefieres mantener en /garage)
```bash
# Si quieres mantener en subdirectorio garage
# Los archivos quedan en /home/ortegaestudios/public_html/garage/dist/

# Crear enlace simbólico al document root principal
ln -sf /home/ortegaestudios/public_html/garage/dist/* /home/ortegaestudios/public_html/
```

### 9. Configurar Reescritura de URLs para SPA

#### Crear .htaccess para React Router
```bash
# Crear archivo .htaccess en el document root
nano /home/ortegaestudios/public_html/.htaccess
```

Contenido del .htaccess:
```apache
# Configuración para React SPA
RewriteEngine On

# Manejar preflight requests de CORS
RewriteCond %{REQUEST_METHOD} OPTIONS
RewriteRule ^(.*)$ $1 [R=200,L]

# Redireccionar API al subdominio/directorio correspondiente
RewriteCond %{HTTP_HOST} ^api\.garage-peru\.shop$ [NC]
RewriteRule ^(.*)$ - [L]

# Manejar rutas de React Router (SPA)
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !^/api/
RewriteRule . /index.html [L]

# Configuraciones de seguridad
<IfModule mod_headers.c>
    # CORS headers
    Header always set Access-Control-Allow-Origin "*"
    Header always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
    Header always set Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With"
    
    # Security headers
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>

# Compresión Gzip
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Cache para recursos estáticos
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
    ExpiresByType application/pdf "access plus 1 year"
    ExpiresByType text/html "access plus 1 hour"
</IfModule>
```

### 10. Configurar Permisos
```bash
# Establecer permisos correctos
find /home/ortegaestudios/public_html -type f -name "*.html" -exec chmod 644 {} \;
find /home/ortegaestudios/public_html -type f -name "*.css" -exec chmod 644 {} \;
find /home/ortegaestudios/public_html -type f -name "*.js" -exec chmod 644 {} \;
find /home/ortegaestudios/public_html -type f -name "*.json" -exec chmod 644 {} \;
find /home/ortegaestudios/public_html -type d -exec chmod 755 {} \;

# Cambiar propietario si es necesario
chown -R ortegaestudios:ortegaestudios /home/ortegaestudios/public_html/
```

### 11. Configurar SSL/HTTPS (En cPanel)

#### A través de cPanel:
1. Ir a **cPanel** → **SSL/TLS** → **Let's Encrypt SSL**
2. Seleccionar el dominio `garage-peru.shop`
3. Activar SSL
4. Forzar HTTPS

#### O configurar redirección en .htaccess:
```apache
# Agregar al inicio del .htaccess
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

### 12. Optimización Adicional

#### Configurar Service Worker (si tu proyecto lo incluye)
```bash
# Verificar si existe service worker
ls -la /home/ortegaestudios/public_html/sw.js
ls -la /home/ortegaestudios/public_html/service-worker.js
```

#### Crear archivo robots.txt
```bash
nano /home/ortegaestudios/public_html/robots.txt
```

Contenido:
```
User-agent: *
Allow: /

# Sitemap
Sitemap: https://garage-peru.shop/sitemap.xml

# Disallow admin routes
Disallow: /admin
Disallow: /dashboard
```

#### Crear archivo manifest.json (si no existe)
```bash
nano /home/ortegaestudios/public_html/manifest.json
```

Contenido:
```json
{
  "name": "Cochera 2025",
  "short_name": "Cochera",
  "description": "Sistema de Gestión de Cochera",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#1890ff",
  "icons": [
    {
      "src": "/favicon.ico",
      "sizes": "32x32",
      "type": "image/x-icon"
    }
  ]
}
```

## 🧪 Verificación

### 1. Probar la Aplicación
```bash
# Probar desde el servidor
curl -I https://garage-peru.shop

# Verificar que devuelve contenido HTML
curl -s https://garage-peru.shop | head -20
```

### 2. Verificar Recursos Estáticos
```bash
# Verificar archivos CSS y JS
ls -la /home/ortegaestudios/public_html/assets/

# Probar que los recursos cargan
curl -I https://garage-peru.shop/assets/index.css
curl -I https://garage-peru.shop/assets/index.js
```

### 3. Verificar Rutas de React
```bash
# Probar diferentes rutas de la SPA
curl -I https://garage-peru.shop/dashboard
curl -I https://garage-peru.shop/login
curl -I https://garage-peru.shop/usuarios
```

### 4. Verificar Conexión con API
```bash
# Desde el navegador del servidor o usando curl
curl -X GET https://api.garage-peru.shop/api/health
```

## 🛠️ Solución de Problemas Comunes

### Error 404 en Rutas de React
```bash
# Verificar .htaccess
cat /home/ortegaestudios/public_html/.htaccess

# Verificar que mod_rewrite está habilitado
# (Contactar soporte si es necesario)
```

### Recursos Estáticos no Cargan
```bash
# Verificar permisos
ls -la /home/ortegaestudios/public_html/assets/

# Verificar rutas en index.html
grep -n "assets/" /home/ortegaestudios/public_html/index.html
```

### Error de CORS con API
```bash
# Verificar configuración en .htaccess
grep -A 5 "CORS" /home/ortegaestudios/public_html/.htaccess
```

### Build Falla
```bash
# Limpiar y reinstalar dependencias
rm -rf node_modules package-lock.json
npm install

# Verificar versión de Node.js
node --version

# Construir con más verbose
npm run build -- --verbose
```

## 📊 Estructura Final
```
/home/ortegaestudios/public_html/
├── garage/                 # ← Código fuente React
│   ├── src/
│   ├── public/
│   ├── dist/              # ← Build de producción
│   ├── package.json
│   ├── vite.config.js
│   └── .env.production
├── index.html             # ← Archivo principal del SPA
├── assets/                # ← CSS, JS optimizados
│   ├── index.css
│   └── index.js
├── .htaccess             # ← Configuración Apache
├── robots.txt
├── manifest.json
└── favicon.ico
```

## ✅ Checklist de Verificación

- [ ] Node.js 18+ instalado
- [ ] Proyecto clonado correctamente
- [ ] Dependencias instaladas
- [ ] Variables de entorno configuradas
- [ ] Build de producción exitoso
- [ ] Archivos copiados al document root
- [ ] .htaccess configurado para SPA
- [ ] SSL configurado
- [ ] Permisos establecidos
- [ ] Aplicación accesible desde navegador
- [ ] Rutas de React funcionando
- [ ] Conexión con API funcionando
- [ ] Recursos estáticos cargando

## 🚀 Optimizaciones Post-Despliegue

### 1. Configurar CDN (Opcional)
```bash
# Si usas Cloudflare u otro CDN
# Configurar en cPanel o contactar soporte
```

### 2. Monitoreo de Performance
```bash
# Instalar herramientas de monitoreo si están disponibles
# Lighthouse, GTmetrix, etc.
```

### 3. Backup Automático
```bash
# Crear script de backup
nano /home/ortegaestudios/scripts/backup_frontend.sh
```

```bash
#!/bin/bash
# Backup del frontend
DATE=$(date +%Y%m%d_%H%M%S)
tar -czf "/home/ortegaestudios/backups/frontend_backup_$DATE.tar.gz" \
    -C /home/ortegaestudios/public_html \
    --exclude='garage/node_modules' \
    --exclude='garage/dist' \
    .
```

---
**Fecha de creación**: Octubre 2025  
**Última actualización**: Octubre 2025  
**Versión**: 1.0