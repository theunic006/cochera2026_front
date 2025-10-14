# Guía de Despliegue en Producción - Garage Peru

## 🚀 Flujo de Trabajo para Desarrollo y Producción

### 1. Desarrollo Local
```bash
# Instalar dependencias (primera vez)
npm install

# Ejecutar en modo desarrollo
npm run dev

# La aplicación estará disponible en http://localhost:5173
```

### 2. Preparar para Producción
```bash
# Generar build optimizado
npm run build

# Esto creará una carpeta 'dist' con los archivos optimizados
```

### 3. Despliegue Automático (Linux/Mac/WSL)

#### Opción A - Despliegue Básico:
```bash
# Hacer ejecutable el script
chmod +x deploy.sh

# Ejecutar despliegue
./deploy.sh
```

#### Opción B - Despliegue Completo (Recomendado):
```bash
# Incluye reinicio de Apache y verificaciones
chmod +x deploy-full.sh

# Ejecutar despliegue completo
./deploy-full.sh
```

#### Verificar despliegue:
```bash
# Verificar que todo funciona correctamente
chmod +x check-deployment.sh
./check-deployment.sh
```

### 4. Despliegue Manual (Windows)
```batch
# Ejecutar script de Windows
deploy.bat

# O seguir los pasos manualmente:
```

#### Pasos Manuales:
1. **Generar build:**
   ```bash
   npm run build
   ```

2. **Subir archivos por SFTP:**
   - Servidor: `garage-peru.shop`
   - Usuario: `root`
   - Contraseña: `Mar1EsM1@m0rL30D@n`
   - Directorio remoto: `/home/ortegaestudios/public_html/garage`
   - Subir contenido de la carpeta `dist/` al directorio remoto

3. **Verificar estructura en servidor:**
   ```
   /home/ortegaestudios/public_html/garage/
   ├── index.html
   ├── .htaccess
   └── assets/
       ├── index-[hash].js
       └── index-[hash].css
   ```

### 5. Solución al Error 404 en Refrescar

#### Problema:
Cuando refrescas cualquier ruta como `/empresas`, `/usuarios`, etc., obtienes error 404.

#### Causa:
El servidor Apache busca un archivo físico `/empresas` que no existe, porque React maneja las rutas del lado del cliente.

#### Solución:
Necesitas que Apache redireccione todas las rutas no existentes a `index.html`:

1. **Reiniciar Apache para aplicar configuración:**
   ```bash
   ssh root@garage-peru.shop "systemctl restart httpd"
   ```

2. **Verificar que .htaccess funciona:**
   - El archivo `.htaccess` ya está correctamente configurado
   - Pero necesita que Apache tenga `AllowOverride All` habilitado
   - Ya agregamos la configuración en `/etc/apache2/conf.d/includes/post_virtualhost_global.conf`

3. **Comandos para debug:**
   ```bash
   # Verificar si .htaccess es leído
   ssh root@garage-peru.shop "httpd -M | grep rewrite"
   
   # Ver logs de Apache
   ssh root@garage-peru.shop "tail -f /var/log/httpd/error_log"
   
   # Verificar despliegue completo
   ./check-deployment.sh
   ```

### 6. Estructura de Archivos Recomendada

```
📁 proyecto-local/
├── 📁 frontend/          # Tu código React
│   ├── src/
│   ├── package.json
│   ├── deploy.sh
│   ├── deploy.bat
│   └── dist/            # Generado por npm run build
└── 📁 backend/          # Tu API Laravel
    └── ...

📁 servidor-producción/
└── 📁 /home/ortegaestudios/public_html/
    ├── 📁 garage/       # Frontend React (contenido de dist/)
    │   ├── index.html
    │   ├── .htaccess
    │   └── assets/
    └── 📁 api/          # Backend Laravel
        └── ...
```

### 7. Comandos Útiles

```bash
# Conectar al servidor
ssh root@garage-peru.shop

# Ver logs de Apache
tail -f /var/log/httpd/error_log
tail -f /var/log/httpd/access_log

# Verificar configuración de Apache
httpd -t

# Reiniciar Apache
systemctl restart httpd

# Ver archivos en producción
ls -la /home/ortegaestudios/public_html/garage/

# Verificar despliegue
cd /ruta/local/del/proyecto
./check-deployment.sh
```

### 8. Troubleshooting

#### Error 404 persiste:
1. Verificar que Apache fue reiniciado
2. Comprobar que mod_rewrite está habilitado
3. Verificar logs de Apache para errores específicos

#### Build falla:
1. Verificar variables de entorno en `.env`
2. Limpiar node_modules: `rm -rf node_modules && npm install`
3. Verificar que todas las dependencias están instaladas

#### SFTP falla:
1. Verificar credenciales de conexión
2. Comprobar permisos de escritura en directorio remoto
3. Usar cliente SFTP visual como FileZilla si el script falla

### 9. Automatización Avanzada (Opcional)

Para un flujo más profesional, puedes configurar:
- GitHub Actions para despliegue automático
- Webhooks para deploy al hacer push
- Script de rollback en caso de errores