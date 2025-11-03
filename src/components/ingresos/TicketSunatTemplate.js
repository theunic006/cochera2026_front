// TicketSunatTemplate.js
// Genera el HTML del ticket de factura electrónica enviada a SUNAT

/**
 * Convierte un número a letras en español
 * @param {number} num - Número a convertir
 * @returns {string} Número en letras
 */
function numeroALetras(num) {
  const unidades = ['', 'UNO', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE'];
  const decenas = ['', 'DIEZ', 'VEINTE', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA'];
  const especiales = ['DIEZ', 'ONCE', 'DOCE', 'TRECE', 'CATORCE', 'QUINCE', 'DIECISEIS', 'DIECISIETE', 'DIECIOCHO', 'DIECINUEVE'];
  const centenas = ['', 'CIENTO', 'DOSCIENTOS', 'TRESCIENTOS', 'CUATROCIENTOS', 'QUINIENTOS', 'SEISCIENTOS', 'SETECIENTOS', 'OCHOCIENTOS', 'NOVECIENTOS'];

  if (num === 0) return 'CERO';
  if (num === 100) return 'CIEN';
  
  let resultado = '';
  
  // Millones
  if (num >= 1000000) {
    const millones = Math.floor(num / 1000000);
    resultado += (millones === 1 ? 'UN MILLON ' : numeroALetras(millones) + ' MILLONES ');
    num %= 1000000;
  }
  
  // Miles
  if (num >= 1000) {
    const miles = Math.floor(num / 1000);
    resultado += (miles === 1 ? 'MIL ' : numeroALetras(miles) + ' MIL ');
    num %= 1000;
  }
  
  // Centenas
  if (num >= 100) {
    const cent = Math.floor(num / 100);
    resultado += centenas[cent] + ' ';
    num %= 100;
  }
  
  // Decenas y unidades
  if (num >= 20) {
    const dec = Math.floor(num / 10);
    resultado += decenas[dec];
    num %= 10;
    if (num > 0) resultado += ' Y ' + unidades[num];
  } else if (num >= 10) {
    resultado += especiales[num - 10];
  } else if (num > 0) {
    resultado += unidades[num];
  }
  
  return resultado.trim();
}

/**
 * Genera el HTML del ticket basado en la respuesta de SUNAT
 * @param {Object} params - Parámetros del ticket
 * @param {Object} params.respuestaSunat - Respuesta completa de SUNAT
 * @param {Object} params.datosEmpresa - Datos de la empresa
 * @param {Object} params.datosCliente - Datos del cliente
 * @returns {string} HTML del ticket
 */
export function getTicketSunatHTML({ respuestaSunat, datosEmpresa, datosCliente }) {
  // Logging para debugging
  console.log('🎫 Generando ticket con datos completos:', { respuestaSunat, datosEmpresa, datosCliente });
  
  // ⭐ ESTRUCTURA REAL: respuestaSunat.data.local contiene cliente, detalles, empresa
  const data = respuestaSunat?.data || {};
  const local = data?.local || {};
  const payload = data?.payload || {};
  
  console.log('📦 Local extraído:', local);
  console.log('📦 Payload extraído:', payload);
  
  // Extraer datos de la estructura local
  const cliente = local?.cliente || {};
  const empresa = local?.empresa || {};
  const detalles = local?.detalles || [];
  
  console.log('👤 Cliente:', cliente);
  console.log('🏢 Empresa:', empresa);
  console.log('📋 Detalles:', detalles);
  
  // Extraer primer detalle (índice 0)
  const detalle = detalles[0] || {};
  
  // =============================================
  // DATOS DE LA EMPRESA
  // =============================================
  const empresaRuc = empresa?.ruc || datosEmpresa?.ruc || '20559179818';
  const empresaNombre = empresa?.razon_social || datosEmpresa?.razon_social || 'EMPRESA DEMO';
  const empresaDireccion = empresa?.direccion || datosEmpresa?.ubicacion || datosEmpresa?.direccion || 'AV. EJEMPLO NRO. 100';
  const empresaEmail = empresa?.email || datosEmpresa?.email || 'contacto@empresa.com';
  const empresaTelefono = empresa?.telefono || datosEmpresa?.telefono || '999-999-999';
  
  // =============================================
  // DATOS DEL COMPROBANTE (serie y numero están en respuestaSunat.data)
  // =============================================
  const serie = data?.serie || payload?.serie || local?.serie || 'F001';
  const numero = data?.numero || payload?.numero || local?.numero || '00000001';
  const tipoComprobante = payload?.tipo_comprobante || local?.tipo_comprobante || '03';
  const fechaEmision = payload?.fecha_emision || local?.fecha_emision || new Date().toLocaleDateString('es-PE');
  const condicionPago = cliente?.condicion_pago || 'CONTADO';
  const moneda = payload?.moneda || 'PEN';
  
  // =============================================
  // DATOS DEL CLIENTE
  // =============================================
  const clienteDocumento = cliente?.numero_documento || datosCliente?.documento || '';
  const clienteNombre = cliente?.razon_social || cliente?.nombres || datosCliente?.razonSocial || 'CLIENTE';
  const clienteDireccion = cliente?.direccion || datosCliente?.direccion || '-';
  
  // =============================================
  // TOTALES DESDE detalles[0] - FORMATEADOS A 2 DECIMALES
  // =============================================
  const cantidad = parseFloat(detalle?.cantidad || '1.00').toFixed(2);
  const descripcion = detalle?.descripcion || 'Servicio de Estacionamiento';
  const importe = parseFloat(detalle?.total || '0.00').toFixed(2);
  const subtotal = parseFloat(detalle?.subtotal || '0.00').toFixed(2);
  const igv = parseFloat(detalle?.igv || '0.00').toFixed(2);
  const total = parseFloat(detalle?.total || '0.00').toFixed(2);
  
  // =============================================
  // URLs Y ESTADO
  // =============================================
  const estado = payload?.estado || 'ACEPTADO';
  const hashUrl = payload?.hash || '';
  const pdfUrl = payload?.enlace_del_pdf || payload?.pdf || '';
  const xmlUrl = payload?.xml || '';
  const ticketUrl = payload?.ticket || '';
  
  console.log('📋 Datos procesados para el ticket:', {
    serie, numero, tipoComprobante, fechaEmision,
    empresaRuc, empresaNombre, empresaDireccion,
    clienteDocumento, clienteNombre, clienteDireccion,
    cantidad, descripcion, importe, subtotal, igv, total, estado
  });
  
  const tipoComprobanteTexto = tipoComprobante === '01' ? 'FACTURA ELECTRÓNICA' : 'BOLETA DE VENTA ELECTRÓNICA';
  const numeroCompleto = `${serie}-${String(numero).padStart(8, '0')}`;
  
  // Fecha y hora actual en formato YYYY-MM-DD HH:mm:ss
  const now = new Date();
  const fechaHoraActual = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
  
  // Convertir total a letras
  const totalNumero = parseFloat(total);
  const parteEntera = Math.floor(totalNumero);
  const parteDecimal = Math.round((totalNumero - parteEntera) * 100);
  const totalEnLetras = `${numeroALetras(parteEntera)} CON ${String(parteDecimal).padStart(2, '0')}/100`;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Comprobante Electrónico - ${numeroCompleto}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: 'Courier New', monospace; 
          background-color: white; 
          padding: 0;
          font-size: 10px;
        }
        .ticket-container { 
          width: 80mm; 
          margin: 0 auto; 
          background-color: white; 
          padding: 3mm 7mm;
          border: 2px solid #000;
        }
        
        /* HEADER */
        .ticket-header { 
          text-align: center; 
          padding-bottom: 3mm; 
          border-bottom: 2px dashed #000; 
          margin-bottom: 3mm; 
        }
        .logo-box {
          text-align: center;
          margin-bottom: 2mm;
          padding: 2mm 0;
        }
        .logo-img {
          max-width: 100%;
          max-height: 20mm;
          height: auto;
          display: block;
          margin: 0 auto;
        }
        .logo-text {
          font-size: 18px;
          font-weight: bold;
          letter-spacing: 1px;
        }
        .logo-subtitle {
          font-size: 11px;
          margin-top: 1mm;
        }
        .empresa-info { 
          font-size: 9px; 
          line-height: 1.4;
          margin-top: 2mm;
        }
        .empresa-contacto {
          display: flex;
          justify-content: space-between;
          font-size: 8px;
          margin-top: 1mm;
          padding-top: 1mm;
        }
        .empresa-ruc { 
          font-size: 11px; 
          font-weight: bold; 
          margin: 2mm 0;
        }
        
        /* TÍTULO */
        .ticket-tipo { 
          text-align: center; 
          font-size: 11px; 
          font-weight: bold; 
          margin: 2mm 0;
          padding: 2mm;
          background-color: #000;
          color: #fff;
        }
        .ticket-numero { 
          text-align: center; 
          font-size: 13px; 
          font-weight: bold; 
          margin: 2mm 0;
          letter-spacing: 1px;
        }
        
        /* SECCIÓN */
        .seccion {
          margin: 3mm 0;
          padding: 2mm 0;
        }
        .seccion:last-of-type {
          border-bottom: 2px solid #000;
        }
        .seccion-titulo {
          font-weight: bold;
          font-size: 9px;
          margin-bottom: 1mm;
          text-decoration: underline;
        }
        .dato-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1mm;
          font-size: 9px;
          line-height: 1.3;
        }
        .dato-label {
          font-weight: bold;
          flex-shrink: 0;
        }
        .dato-valor {
          text-align: right;
          max-width: 42mm;
          word-wrap: break-word;
        }
        
        /* ITEMS */
        .items-header {
          display: grid;
          grid-template-columns: 12mm 1fr 18mm;
          font-size: 8px;
          font-weight: bold;
          padding: 1mm 0;
          border-top: 1px solid #000;
          border-bottom: 1px solid #000;
          margin-top: 2mm;
        }
        .item-row {
          display: grid;
          grid-template-columns: 12mm 1fr 18mm;
          font-size: 8px;
          padding: 2mm 0;
          border-bottom: 1px dashed #ccc;
          align-items: start;
        }
        .item-descripcion {
          padding: 0 1mm;
          line-height: 1.3;
        }
        
        /* TOTALES */
        .totales {
          margin-top: 3mm;
          font-size: 9px;
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1mm;
          padding: 1mm 2mm;
        }
        .total-label {
          font-weight: bold;
        }
        .total-valor {
          font-weight: bold;
        }
        .total-final {
          border-top: 2px solid #000;
          padding-top: 2mm !important;
          margin-top: 2mm;
          font-size: 11px;
          background-color: #f0f0f0;
        }
        
        /* QR */
        .qr-section {
          text-align: center;
          margin: 4mm 0;
          padding: 3mm 0;
          border-top: 2px dashed #000;
          border-bottom: 2px dashed #000;
        }
        #qrcode {
          display: inline-block;
          margin: 2mm auto;
        }
        
        /* ENLACES */
        .enlaces-section {
          margin: 3mm 0;
          font-size: 7px;
          line-height: 1.5;
        }
        .enlace-row {
          margin-bottom: 2mm;
          word-wrap: break-word;
        }
        .enlace-label {
          font-weight: bold;
          display: block;
          margin-bottom: 0.5mm;
        }
        
        /* FOOTER */
        .ticket-footer { 
          text-align: center; 
          font-size: 8px; 
          margin-top: 3mm; 
          line-height: 1.5;
          padding-top: 2mm;
          border-top: 1px solid #000;
        }
        .footer-bold {
          font-weight: bold;
          margin-bottom: 2mm;
        }
        .footer-sunat {
          font-size: 7px;
          color: #666;
          margin-top: 2mm;
        }
        
        @media print {
          body { background-color: white; padding: 0; }
          .ticket-container { border: none; }
          @page { size: 80mm auto; margin: 0; }
        }
      </style>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
    </head>
    <body>
      <div class="ticket-container">
        
        <!-- HEADER -->
        <div class="ticket-header">
          <div class="logo-box">
            <img src="http://127.0.0.1:8000/storage/companies/garage.png" alt="Logo Empresa" class="logo-img" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';" />
            <div class="logo-text" style="display: none;">${empresaNombre.substring(0, 20)}</div>
          </div>
          <div class="empresa-info">
            <div><strong>${empresaNombre}</strong></div>
            <div>${empresaDireccion}</div>
            <div class="empresa-contacto">
              <span>Ruc: ${empresaRuc}</span>
              <span>Tel: +51 ${empresaTelefono}</span>
            </div>
            <div style="text-align: right; font-size: 8px; margin-top: 1mm;">
              Fecha: ${fechaHoraActual}
            </div>
          </div>
        </div>
        
        <!-- TIPO Y NÚMERO -->
        <div class="ticket-tipo">${tipoComprobanteTexto}: ${numeroCompleto}</div>
        
        <!-- DATOS DEL CLIENTE -->
        <div class="seccion">
          <div class="seccion-titulo">CLIENTE</div> <!-- SECCIÓN CLIENTE -->
          <div class="dato-row">
            <span class="dato-label">${clienteDocumento.length === 11 ? 'RUC' : 'DNI'}:</span>
            <span class="dato-valor">${clienteDocumento}</span>
          </div>
          <div class="dato-row">
            <span class="dato-label">NOMBRE:</span>
            <span class="dato-valor">${clienteNombre}</span>
          </div>
          <div class="dato-row">
            <span class="dato-label">DIRECCIÓN:</span>
            <span class="dato-valor">${clienteDireccion}</span>
          </div>
        </div>
        
        <!-- DATOS DEL COMPROBANTE -->
        <div class="seccion">
          <div class="dato-row">
            <span class="dato-label">FECHA EMISIÓN:</span>
            <span class="dato-valor">${fechaHoraActual}</span>
          </div>
          <div class="dato-row">
            <span class="dato-label">FORMA DE PAGO:</span>
            <span class="dato-valor">${condicionPago}</span>
          </div>
          <div class="dato-row">
            <span class="dato-label">MONEDA:</span>
            <span class="dato-valor">${moneda === 'PEN' ? 'SOLES' : moneda}</span>
          </div>
        </div>
        
        <!-- ITEMS -->
        <div class="items-header">
          <div>CANT.</div>
          <div>DESCRIPCIÓN</div>
          <div>IMPORTE</div>
        </div>
        <div class="item-row">
          <div>${cantidad}</div>
          <div class="item-descripcion">${descripcion}</div>
          <div>${importe}</div>
        </div>
        
        <!-- TOTALES -->
        <div class="totales">
          <div class="total-row">
            <span class="total-label">OP. GRAVADAS:</span>
            <span class="total-valor">S/ ${subtotal}</span>
          </div>
          <div class="total-row">
            <span class="total-label">OP. EXONERADAS:</span>
            <span class="total-valor">S/ 0.00</span>
          </div>
          <div class="total-row">
            <span class="total-label">OP. INAFECTAS:</span>
            <span class="total-valor">S/ 0.00</span>
          </div>
          <div class="total-row">
            <span class="total-label">IGV 18%:</span>
            <span class="total-valor">S/ ${igv}</span>
          </div>
          <div class="total-row total-final">
            <span class="total-label">TOTAL:</span>
            <span class="total-valor">S/ ${total}</span>
          </div>
        </div>
        
        <!-- IMPORTE EN LETRAS -->
        <div style="margin: 3mm 0; padding: 2mm; font-size: 8px; line-height: 1.4; text align:center;">
          <div>IMPORTE EN LETRAS: ${totalEnLetras} SOLES</div>
        </div>
        
        <!-- QR CODE -->
        <div class="qr-section">
          <div id="qrcode"></div>
        </div>
        
        <!-- ENLACES DE DESCARGA -->
        ${pdfUrl || xmlUrl || ticketUrl ? `
        <div class="enlaces-section">
          <div class="seccion-titulo">ENLACES DE DESCARGA</div>
          ${pdfUrl ? `
          <div class="enlace-row">
            <span class="enlace-label">📄 PDF:</span>
            <span>${pdfUrl}</span>
          </div>
          ` : ''}
          ${xmlUrl ? `
          <div class="enlace-row">
            <span class="enlace-label">📋 XML:</span>
            <span>${xmlUrl}</span>
          </div>
          ` : ''}
          ${ticketUrl ? `
          <div class="enlace-row">
            <span class="enlace-label">🎫 Ticket:</span>
            <span>${ticketUrl}</span>
          </div>
          ` : ''}
        </div>
        ` : ''}
        
        <!-- FOOTER -->
        <div class="ticket-footer">
          <div class="footer-bold">✓ COMPROBANTE ELECTRÓNICO ACEPTADO POR SUNAT</div>
          <div>Estado: ${estado}</div>
          <div style="margin-top: 2mm;">GRACIAS POR SU PREFERENCIA</div>
          <div class="footer-sunat">
            Representación impresa de ${tipoComprobanteTexto}<br>
            Autorizado mediante resolución N° 054-005-0001490/SUNAT<br>
            Consulte su comprobante en www.smartclic.pe
          </div>
        </div>
        
        <!-- ESPACIO FINAL -->
        <div style="height: 10mm;"></div>
        
      </div>
      
      <script>
        // Generar QR con los datos del comprobante (formato SUNAT estándar)
        const qrData = '${empresaRuc}|${tipoComprobante}|${serie}|${numero}|${igv}|${total}|${fechaEmision}|${clienteDocumento}|${hashUrl}';
        
        console.log('🔲 Generando QR con datos:', qrData);
        
        new QRCode(document.getElementById("qrcode"), {
          text: qrData,
          width: 120,
          height: 120,
          colorDark: "#000000",
          colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.H
        });
        
        // Imprimir automáticamente después de cargar
        setTimeout(() => {
          window.print();
        }, 1000);
      </script>
    </body>
    </html>
  `;
}
