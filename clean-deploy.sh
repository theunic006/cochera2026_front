#!/bin/bash
# clean-deploy.sh - Limpieza completa y despliegue

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}🧹 Iniciando limpieza completa y despliegue...${NC}"

# 1. Limpiar archivos locales
echo -e "${YELLOW}📁 Limpiando archivos locales...${NC}"
rm -rf dist/
rm -rf node_modules/.vite
rm -rf .vite
echo -e "${GREEN}✅ Archivos locales limpiados${NC}"

# 2. Generar build limpio
echo -e "${YELLOW}🔨 Generando build completamente limpio...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error en el build. Abortando.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build limpio generado${NC}"

# 3. Limpiar archivos del servidor
echo -e "${YELLOW}🗑️ Limpiando archivos antiguos del servidor...${NC}"
ssh root@garage-peru.shop "
cd /home/ortegaestudios/public_html/garage
cp .htaccess .htaccess.backup.$(date +%Y%m%d_%H%M%S)
find . -name '*.js' -delete
find . -name '*.css' -delete  
find . -name '*.html' -delete
rm -rf assets/
echo 'Archivos antiguos eliminados del servidor'
"

# 4. Subir archivos nuevos
echo -e "${YELLOW}📤 Subiendo archivos nuevos...${NC}"
scp -r dist/* root@garage-peru.shop:/home/ortegaestudios/public_html/garage/

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Archivos subidos exitosamente${NC}"
else
    echo -e "${RED}❌ Error al subir archivos${NC}"
    exit 1
fi

# 5. Verificar que el sitio responde
echo -e "${YELLOW}🌐 Verificando que el sitio responde...${NC}"
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://garage-peru.shop)
if [ "$HTTP_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ Sitio web responde correctamente (HTTP $HTTP_STATUS)${NC}"
else
    echo -e "${YELLOW}⚠️  Sitio responde con código HTTP $HTTP_STATUS${NC}"
fi

echo -e "${GREEN}🎉 ¡Limpieza y despliegue completados!${NC}"
echo -e "${GREEN}🌐 URL: https://garage-peru.shop${NC}"
echo -e "${GREEN}📂 Las imágenes ahora deberían funcionar correctamente${NC}"