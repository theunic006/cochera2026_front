#!/bin/bash
# deploy.sh - Script para desplegar el frontend React a producción

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🚀 Iniciando proceso de despliegue...${NC}"

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

# 4. Conectar por SFTP y subir archivos
echo -e "${YELLOW}📤 Subiendo archivos a producción...${NC}"

# Configuración del servidor
SERVER="garage-peru.shop"
USERNAME="root"
REMOTE_PATH="/home/ortegaestudios/public_html/garage"

# Usar scp para subir los archivos
echo -e "${YELLOW}📤 Conectando a ${SERVER}...${NC}"
scp -r dist/* ${USERNAME}@${SERVER}:${REMOTE_PATH}/

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Archivos subidos exitosamente${NC}"
    echo -e "${GREEN}🌐 Tu aplicación está disponible en: https://garage-peru.shop${NC}"
else
    echo -e "${RED}❌ Error al subir archivos${NC}"
    exit 1
fi

echo -e "${GREEN}🎉 ¡Despliegue completado!${NC}"