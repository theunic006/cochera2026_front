#!/bin/bash
# check-deployment.sh - Script para verificar el estado del despliegue

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 Verificación de Despliegue - Garage Peru${NC}"
echo -e "${BLUE}===========================================${NC}"

SERVER="garage-peru.shop"
USERNAME="root"
REMOTE_PATH="/home/ortegaestudios/public_html/garage"

echo -e "${YELLOW}1. Verificando conexión al servidor...${NC}"
ssh -o ConnectTimeout=10 ${USERNAME}@${SERVER} "echo 'Conexión exitosa'" 2>/dev/null
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Conexión al servidor OK${NC}"
else
    echo -e "${RED}❌ No se puede conectar al servidor${NC}"
    exit 1
fi

echo -e "${YELLOW}2. Verificando archivos en el servidor...${NC}"
FILES_CHECK=$(ssh ${USERNAME}@${SERVER} "
if [ -f ${REMOTE_PATH}/index.html ]; then
    echo 'index.html: OK'
else
    echo 'index.html: FALTA'
fi

if [ -f ${REMOTE_PATH}/.htaccess ]; then
    echo '.htaccess: OK'
else
    echo '.htaccess: FALTA'
fi

if [ -d ${REMOTE_PATH}/assets ]; then
    echo 'assets/: OK'
else
    echo 'assets/: FALTA'
fi
")
echo "$FILES_CHECK"

echo -e "${YELLOW}3. Verificando contenido de .htaccess...${NC}"
HTACCESS_CONTENT=$(ssh ${USERNAME}@${SERVER} "head -5 ${REMOTE_PATH}/.htaccess")
if [[ "$HTACCESS_CONTENT" == *"RewriteEngine On"* ]]; then
    echo -e "${GREEN}✅ .htaccess contiene reglas de reescritura${NC}"
else
    echo -e "${RED}❌ .htaccess no tiene reglas correctas${NC}"
fi

echo -e "${YELLOW}4. Verificando estado de Apache...${NC}"
APACHE_STATUS=$(ssh ${USERNAME}@${SERVER} "systemctl is-active httpd")
if [ "$APACHE_STATUS" = "active" ]; then
    echo -e "${GREEN}✅ Apache está activo${NC}"
else
    echo -e "${RED}❌ Apache no está activo: $APACHE_STATUS${NC}"
fi

echo -e "${YELLOW}5. Verificando mod_rewrite...${NC}"
MOD_REWRITE=$(ssh ${USERNAME}@${SERVER} "httpd -M 2>/dev/null | grep rewrite" 2>/dev/null)
if [[ "$MOD_REWRITE" == *"rewrite_module"* ]]; then
    echo -e "${GREEN}✅ mod_rewrite está cargado${NC}"
else
    echo -e "${RED}❌ mod_rewrite no está cargado${NC}"
fi

echo -e "${YELLOW}6. Verificando respuesta HTTP del sitio...${NC}"
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://garage-peru.shop)
case $HTTP_STATUS in
    200)
        echo -e "${GREEN}✅ Sitio responde correctamente (HTTP $HTTP_STATUS)${NC}"
        ;;
    404)
        echo -e "${RED}❌ Error 404 - Página no encontrada${NC}"
        ;;
    500)
        echo -e "${RED}❌ Error 500 - Error interno del servidor${NC}"
        ;;
    *)
        echo -e "${YELLOW}⚠️  Respuesta HTTP: $HTTP_STATUS${NC}"
        ;;
esac

echo -e "${YELLOW}7. Probando ruta específica (SPA routing)...${NC}"
SPA_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://garage-peru.shop/empresas)
if [ "$SPA_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ Routing de SPA funciona correctamente${NC}"
else
    echo -e "${RED}❌ Routing de SPA no funciona (HTTP $SPA_STATUS)${NC}"
    echo -e "${YELLOW}💡 Posible solución: Reiniciar Apache${NC}"
fi

echo -e "${YELLOW}8. Estructura de archivos actual:${NC}"
ssh ${USERNAME}@${SERVER} "ls -la ${REMOTE_PATH}/ | head -10"

echo -e "${BLUE}📋 Resumen de verificación completado${NC}"