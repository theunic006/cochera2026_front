# 🧾 Sistema de Facturación Electrónica Integrado

## 📋 Resumen

Este sistema integra completamente la **Facturación Electrónica SUNAT** con el módulo de ingresos de la cochera. Permite emitir facturas y boletas directamente desde el modal de "Terminar Ingreso" y guarda toda la información en la base de datos `factura2026`.

---

## 🏗️ Arquitectura del Sistema

### **Componentes Creados**

1. **`apiFacturacion.js`** (`src/utils/`)
   - Cliente Axios configurado para la API de facturación
   - Base URL: `http://127.0.0.1:8000/apifactura`
   - Maneja autenticación con token Bearer
   - Interceptores para logging y manejo de errores

2. **`facturaService.js`** (`src/services/`)
   - Servicio completo para operaciones con BD `factura2026`
   - Métodos:
     - `getSeries()` - Obtener series disponibles
     - `guardarComprobante()` - Guardar en BD local
     - `actualizarCorrelativo()` - Actualizar numeración
     - `getComprobantes()` - Listar comprobantes
     - `anularComprobante()` - Anular documentos

3. **`enviarFactura.jsx`** (`src/components/ingresos/`)
   - Lógica completa de emisión de comprobantes
   - Funciones exportadas:
     - `enviarFacturaSunat()` - Proceso completo (SUNAT + BD)
     - `construirBodySunat()` - Construye el payload
     - `puedeEmitirFactura()` - Validación de RUC
     - `determinarTipoComprobante()` - Auto-detección

4. **`TerminarModal.jsx`** (Modificado)
   - Botón "Enviar SUNAT" integrado
   - Validaciones de datos de cliente
   - Manejo de loading y mensajes

---

## 🔄 Flujo Completo de Emisión

### **1. Preparación de Datos**
```javascript
const datosComprobante = {
  tipoComprobante: 'boleta', // o 'factura'
  rucCliente: '12345678',
  razonSocial: 'Juan Pérez',
  direccion: 'Av. Principal 123',
  placa: 'ABC-123',
  horaIngreso: '10:30',
  totalPagar: 10.00,
  idEmpresa: 1
}
```

### **2. Obtención de Serie y Correlativo**
- Consulta tabla `series` en BD `factura2026`
- Filtra por tipo de comprobante (01=Factura, 03=Boleta)
- Obtiene siguiente correlativo: `correlativo_actual + 1`

### **3. Construcción del Body SUNAT**
```json
{
  "documento": "boleta",
  "serie": "B001",
  "numero": 2989,
  "fecha_de_emision": "2025-10-30",
  "fecha_de_vencimiento": "2025-10-31",
  "moneda": "PEN",
  "tipo_operacion": "0101",
  "cliente_tipo_de_documento": "1",
  "cliente_numero_de_documento": "12345678",
  "cliente_denominacion": "Juan Pérez",
  "cliente_direccion": "Av. Principal 123",
  "items": [{
    "unidad_de_medida": "NIU",
    "descripcion": "Servicio de estacionamiento - Placa: ABC-123 - Ingreso: 10:30",
    "cantidad": "1",
    "valor_unitario": "8.474576",
    "porcentaje_igv": "18",
    "codigo_tipo_afectacion_igv": "10"
  }],
  "total_igv": "1.525424",
  "total_gravada": "8.474576",
  "total": "10.000000"
}
```

### **4. Emisión a SUNAT**
- **POST** a `https://app.apisunat.pe/api/v2/documents`
- Headers: `Authorization: Bearer {token}`
- Timeout: 60 segundos
- Retorna: XML, CDR, PDF, Hash

### **5. Guardado en BD Local**
Tabla: `comprobantes` en BD `factura2026`

Campos guardados:
```javascript
{
  id_empresa: 1,
  documento: 'boleta',
  serie: 'B001',
  numero: 2989,
  fecha_de_emision: '2025-10-30',
  fecha_de_vencimiento: '2025-10-31',
  moneda: 'PEN',
  tipo_operacion: '0101',
  cliente_tipo_de_documento: '1',
  cliente_numero_de_documento: '12345678',
  cliente_denominacion: 'Juan Pérez',
  cliente_direccion: 'Av. Principal 123',
  items: [...],
  total_igv: '1.525424',
  total_gravada: '8.474576',
  total: '10.000000',
  payload: { 
    // Respuesta completa de SUNAT
    estado: 'aceptado',
    hash: '...',
    xml: '...',
    cdr: '...',
    pdf: '...'
  }
}
```

### **6. Actualización de Correlativo**
- **PUT** a `/apifactura/series/{id}`
- Actualiza `correlativo_actual` al nuevo número
- Prepara para el siguiente comprobante

---

## 🎯 Uso en TerminarModal

### **Botón "Enviar SUNAT"**
```jsx
<Button
  type="primary"
  icon={<SendOutlined />}
  onClick={handleEnviarSunat}
  loading={enviandoSunat}
  style={{ background: "#52c41a", borderColor: "#52c41a" }}
>
  Enviar SUNAT
</Button>
```

### **Handler Completo**
```javascript
const handleEnviarSunat = async () => {
  // 1. Validar datos del cliente
  if (!rucCliente || !razonSocial) {
    message.warning('Complete los datos del cliente');
    return;
  }

  // 2. Determinar tipo de comprobante
  const tipoComprobante = determinarTipoComprobante(rucCliente);

  // 3. Preparar datos
  const datosComprobante = {
    tipoComprobante,
    rucCliente,
    razonSocial,
    direccion: direccion || '-',
    placa: vehiculo.placa,
    horaIngreso: ingreso.hora_ingreso,
    totalPagar: total
  };

  // 4. Enviar a SUNAT y guardar
  const resultado = await enviarFacturaSunat(datosComprobante);

  // 5. Mostrar resultado
  if (resultado.success) {
    message.success(resultado.message);
  } else {
    message.error(resultado.message);
  }
};
```

---

## 📊 Códigos SUNAT

### **Tipos de Documento**
- `1` = DNI
- `6` = RUC
- `4` = Carnet de Extranjería
- `7` = Pasaporte

### **Tipos de Comprobante**
- `01` = Factura
- `03` = Boleta
- `07` = Nota de Crédito
- `08` = Nota de Débito

### **Tipo de Operación**
- `0101` = Venta interna

### **Afectación IGV**
- `10` = Gravado - Operación Onerosa
- `20` = Exonerado
- `30` = Inafecto

---

## 🔧 Configuración Requerida

### **Base de Datos `factura2026`**

**Tabla `series`:**
```sql
CREATE TABLE series (
  id INT PRIMARY KEY AUTO_INCREMENT,
  tipo_comprobante VARCHAR(2), -- '01', '03'
  serie VARCHAR(4), -- 'F001', 'B001'
  correlativo_actual INT DEFAULT 0,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

**Tabla `comprobantes`:**
```sql
CREATE TABLE comprobantes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  id_empresa INT,
  documento VARCHAR(20),
  serie VARCHAR(4),
  numero INT,
  fecha_de_emision DATE,
  fecha_de_vencimiento DATE,
  moneda VARCHAR(3),
  tipo_operacion VARCHAR(4),
  cliente_tipo_de_documento VARCHAR(2),
  cliente_numero_de_documento VARCHAR(20),
  cliente_denominacion VARCHAR(255),
  cliente_direccion TEXT,
  items JSON,
  total_igv DECIMAL(10,6),
  total_gravada DECIMAL(10,6),
  total DECIMAL(10,6),
  payload JSON,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### **API Laravel (`http://127.0.0.1:8000/apifactura`)**

**Endpoints Requeridos:**
- `GET /series` - Listar series
- `PUT /series/{id}` - Actualizar correlativo
- `POST /comprobantes` - Guardar comprobante
- `GET /comprobantes` - Listar comprobantes
- `GET /comprobantes/{id}` - Ver detalle

### **Token SUNAT**
Configurado en `sunatService.js`:
```javascript
const DEFAULT_TOKEN = '344.wUlqHz28sGi...'
```

---

## ✅ Validaciones Implementadas

1. **Cliente Obligatorio:**
   - RUC/DNI requerido
   - Razón Social requerida

2. **Tipo de Comprobante:**
   - Factura: Requiere RUC (11 dígitos)
   - Boleta: Acepta DNI (8 dígitos) o RUC

3. **Auto-detección:**
   - 11 dígitos → Factura
   - 8 dígitos → Boleta

4. **Total:**
   - Debe ser mayor a 0

---

## 📝 Logs y Debugging

El sistema genera logs detallados en consola:

```
====================================
📤 INICIANDO EMISIÓN DE COMPROBANTE
====================================
📋 Datos recibidos del modal: {...}
📊 Obteniendo series de la BD...
🔢 Serie y correlativo obtenidos: {...}
====================================
🚀 PAYLOAD COMPLETO PARA SUNAT:
====================================
{...}
🌐 Enviando comprobante a SUNAT...
✅ Comprobante aceptado por SUNAT
💾 Guardando comprobante en BD local...
🔄 Actualizando correlativo en BD...
====================================
✅ PROCESO COMPLETADO EXITOSAMENTE
====================================
```

---

## 🚨 Manejo de Errores

### **Errores Comunes:**

1. **"No se pudieron obtener las series"**
   - Verificar que el servidor Laravel esté corriendo
   - Verificar tabla `series` en BD

2. **"No se encontró una serie configurada"**
   - Insertar serie en la tabla:
   ```sql
   INSERT INTO series (tipo_comprobante, serie, correlativo_actual) 
   VALUES ('03', 'B001', 0);
   ```

3. **"Error al emitir comprobante en SUNAT"**
   - Verificar token de SUNAT
   - Verificar conectividad a internet
   - Revisar logs de respuesta de SUNAT

4. **"No se pudo guardar en BD local"**
   - No bloquea el proceso (ya se emitió en SUNAT)
   - Revisar permisos de base de datos
   - Verificar estructura de tabla

---

## 🎉 Resultado Final

Al hacer clic en **"Enviar SUNAT"**, el sistema:

✅ Valida todos los datos  
✅ Obtiene serie y correlativo automáticamente  
✅ Construye el payload según especificaciones SUNAT  
✅ Envía a SUNAT y obtiene respuesta (XML, CDR, PDF)  
✅ Guarda todo en BD local `factura2026`  
✅ Actualiza el correlativo para el siguiente comprobante  
✅ Muestra mensaje de éxito al usuario  

**Mensaje final:**
```
Boleta B001-2989 emitida y guardada correctamente ✅
```

---

## 📞 Soporte

Para cualquier duda sobre la integración, revisar:
- Logs en consola del navegador
- Respuestas de la API en Network tab
- Logs del servidor Laravel
- Documentación SUNAT: https://docs.apisunat.pe/

---

**¡Sistema completamente funcional y listo para producción! 🚀**
