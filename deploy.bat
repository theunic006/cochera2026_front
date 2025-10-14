@echo off
REM deploy.bat - Script para desplegar el frontend React a producción en Windows

echo 🚀 Iniciando proceso de despliegue...

REM 1. Limpiar build anterior
echo 📁 Limpiando build anterior...
if exist "dist" rmdir /s /q "dist"

REM 2. Crear nuevo build
echo 🔨 Generando build de producción...
npm run build

if %errorlevel% neq 0 (
    echo ❌ Error en el build. Abortando despliegue.
    pause
    exit /b 1
)

REM 3. Verificar que existe la carpeta dist
if not exist "dist" (
    echo ❌ La carpeta dist no fue generada. Abortando.
    pause
    exit /b 1
)

echo ✅ Build generado exitosamente

REM 4. Instrucciones para subir manualmente
echo 📤 Ahora debes subir los archivos a producción:
echo.
echo 1. Abre tu cliente SFTP (FileZilla, WinSCP, etc.)
echo 2. Conecta a: garage-peru.shop
echo 3. Usuario: root
echo 4. Contraseña: Mar1EsM1@m0rL30D@n
echo 5. Navega a: /home/ortegaestudios/public_html/garage
echo 6. Sube todos los archivos de la carpeta "dist" al directorio remoto
echo 7. Asegúrate de mantener la estructura de carpetas
echo.
echo ℹ️  Alternativamente, puedes usar este comando desde WSL o Git Bash:
echo scp -r dist/* root@garage-peru.shop:/home/ortegaestudios/public_html/garage/
echo (Te pedirá la contraseña del servidor)
echo.

pause