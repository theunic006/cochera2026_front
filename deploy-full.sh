#!/bin/bash
# deploy-full.sh - Script completo para desplegar con reinicio de Apache

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Despliegue Completo - Garage Peru${NC}"
echo -e "${BLUE}====================================${NC}"

# Configuración
SERVER="garage-peru.shop"
USERNAME="root"
REMOTE_PATH="/home/ortegaestudios/public_html/garage"

# 1. Limpiar build anterior
echo -e "${YELLOW}📁 Limpiando build anterior...${NC}"
rm -rf dist/

# 2. Crear nuevo build
echo -e "${YELLOW}🔨 Generando build de producción...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error en el build. Abortando despliegue.${NC}"
    exit 1
fi

# 3. Verificar que existe la carpeta dist
if [ ! -d "dist" ]; then
    echo -e "${RED}❌ La carpeta dist no fue generada. Abortando.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build generado exitosamente${NC}"

# 4. Hacer backup del .htaccess actual
echo -e "${YELLOW}💾 Creando backup del .htaccess...${NC}"
ssh ${USERNAME}@${SERVER} "cp ${REMOTE_PATH}/.htaccess ${REMOTE_PATH}/.htaccess.backup.$(date +%Y%m%d_%H%M%S)"

# 5. Subir archivos nuevos
echo -e "${YELLOW}📤 Subiendo archivos a producción...${NC}"
scp -r dist/* ${USERNAME}@${SERVER}:${REMOTE_PATH}/

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error al subir archivos${NC}"
    exit 1
fi

# 6. Restaurar .htaccess si es necesario
echo -e "${YELLOW}🔧 Verificando .htaccess...${NC}"
ssh ${USERNAME}@${SERVER} "
if [ ! -f ${REMOTE_PATH}/.htaccess ]; then
    echo 'Restaurando .htaccess desde backup...'
    cp ${REMOTE_PATH}/.htaccess.backup.* ${REMOTE_PATH}/.htaccess
fi
"

# 7. Verificar y reiniciar Apache
echo -e "${YELLOW}🔄 Reiniciando Apache...${NC}"
ssh ${USERNAME}@${SERVER} "
systemctl restart httpd
if [ \$? -eq 0 ]; then
    echo 'Apache reiniciado exitosamente'
else
    echo 'Error al reiniciar Apache'
    exit 1
fi
"

# 8. Verificar que el sitio responde
echo -e "${YELLOW}🌐 Verificando que el sitio responde...${NC}"
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://garage-peru.shop)
if [ "$HTTP_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ Sitio web responde correctamente (HTTP $HTTP_STATUS)${NC}"
else
    echo -e "${YELLOW}⚠️  Sitio responde con código HTTP $HTTP_STATUS${NC}"
fi

# 9. Mostrar estructura de archivos desplegados
echo -e "${YELLOW}📋 Estructura de archivos desplegados:${NC}"
ssh ${USERNAME}@${SERVER} "ls -la ${REMOTE_PATH}/"

echo -e "${GREEN}🎉 ¡Despliegue completado exitosamente!${NC}"
echo -e "${GREEN}🌐 Tu aplicación está disponible en: https://garage-peru.shop${NC}"
echo -e "${BLUE}📝 Backup del .htaccess creado en el servidor${NC}"