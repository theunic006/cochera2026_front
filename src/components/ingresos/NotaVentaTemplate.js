// NotaVentaTemplate.js
// Genera el HTML de la nota de venta para impresión

export function getNotaVentaHTML({ user, vehiculo, tipoVehiculo, cantidadHoras, precioHora, total, totalGravado, igv, numeroBoleta, montoTexto }) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Boleta de Venta - ${vehiculo.placa}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, Helvetica, sans-serif; background-color: #f5f5f5; padding: 10px; }
        .nota-container { width: 80mm; margin: 0 auto; background-color: white; padding: 3mm; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        .nota-header { text-align: center; padding-bottom: 3mm; border-bottom: 1px solid #000; margin-bottom: 3mm; }
        .logo-placeholder { width: 45mm; height: 15mm; background-color: #000; color: #ffd700; display: flex; align-items: center; justify-content: center; margin: 0 auto 2mm; font-weight: bold; font-size: 14px; border-radius: 2px; }
        .nota-logo { width: 45mm; height: auto; max-height: 20mm; margin: 0 auto 2mm; display: block; }
        .nota-empresa-nombre { font-size: 11px; font-weight: bold; text-transform: uppercase; margin-bottom: 1mm; line-height: 1.2; }
        .nota-empresa-ruc { font-size: 10px; font-weight: bold; margin-bottom: 1mm; }
        .nota-empresa-info { font-size: 9px; line-height: 1.3; color: #333; }
        .nota-empresa-info div { margin-bottom: 0.5mm; }
        .nota-titulo { text-align: center; background-color: #000; color: #fff; font-size: 11px; font-weight: bold; padding: 2mm; margin: 3mm 0; letter-spacing: 0.5px; }
        .nota-numero { text-align: center; font-size: 10px; font-weight: bold; margin-bottom: 3mm; }
        .nota-cliente { margin-bottom: 2mm; padding-bottom: 2mm; border-bottom: 1px solid #ddd; }
        .nota-cliente-nombre { font-size: 10px; font-weight: bold; margin-bottom: 1mm; text-align: center; }
        .nota-cliente-dni { font-size: 9px; text-align: center; margin-bottom: 2mm; }
        .nota-fecha-hora { font-size: 9px; font-weight: bold; text-align: center; }
        .nota-tabla-header { display: grid; grid-template-columns: 15mm 10mm 18mm 1fr 15mm 15mm; gap: 0.5mm; font-size: 8px; font-weight: bold; text-align: center; padding: 1.5mm; background-color: #f0f0f0; border: 1px solid #000; border-bottom: none; }
        .nota-tabla-row { display: grid; grid-template-columns: 15mm 10mm 18mm 1fr 15mm 15mm; gap: 0.5mm; font-size: 8px; text-align: center; padding: 1.5mm; border: 1px solid #000; border-top: none; min-height: 8mm; align-items: center; }
        .nota-tabla-descripcion { text-align: left !important; font-size: 7px; line-height: 1.2; }
        .nota-totales { margin-top: 2mm; padding-top: 2mm; border-top: 2px solid #000; }
        .nota-total-row { display: flex; justify-content: space-between; font-size: 10px; margin-bottom: 1mm; padding: 0 2mm; }
        .nota-total-row span:first-child { flex: 1; font-weight: bold; }
        .nota-total-row span:nth-child(2) { width: 15mm; text-align: right; font-weight: bold; }
        .nota-total-row span:last-child { width: 20mm; text-align: right; font-weight: bold; }
        .nota-total-final { font-size: 12px !important; border-top: 1px solid #000; padding-top: 1mm; margin-top: 1mm; }
        .nota-pago { margin-top: 3mm; font-size: 9px; line-height: 1.5; }
        .nota-pago-row { display: flex; gap: 2mm; margin-bottom: 1mm; }
        .nota-pago-row strong { min-width: 35mm; }
        .nota-observaciones { margin-top: 3mm; padding-top: 2mm; border-top: 1px solid #ccc; font-size: 8px; }
        .nota-observaciones strong { display: block; margin-bottom: 1mm; }
        .nota-qr { text-align: center; margin-top: 3mm; padding-top: 3mm; border-top: 1px solid #ccc; }
        .nota-footer { text-align: center; font-size: 7px; margin-top: 3mm; line-height: 1.4; color: #666; }
        .nota-footer-logo { margin-top: 2mm; font-size: 8px; font-weight: bold; }
        @media print {
          body { background-color: white; padding: 0; }
          .nota-container { width: 80mm; box-shadow: none; padding: 2mm; }
          @page { size: 80mm auto; margin: 0; }
        }
      </style>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
    </head>
    <body>
      <div class="nota-container">
        <div class="nota-header">
          ${user?.company?.logo ? `<img src="${user.company.logo}" alt="Logo" class="nota-logo" />` : `
            <div class="logo-placeholder">
              ${(user?.company?.nombre?.substring(0, 15) || 'COCHERA').toUpperCase()}
            </div>
          `}
          <div class="nota-empresa-nombre">${(user?.company?.razon_social || user?.company?.nombre || 'DEMOMIFACT').toUpperCase()}</div>
          <div class="nota-empresa-nombre">${(user?.company?.nombre_comercial || 'EMPRESA DEMO SAC').toUpperCase()}</div>
          <div class="nota-empresa-ruc">RUC: ${user?.company?.ruc || '20100100100'}</div>
          <div class="nota-empresa-info">
            <div>${user?.company?.ubicacion || 'CALLE LAS NORMAS 123'}</div>
            <div>Telf: ${user?.company?.telefono || '987 654 321'}</div>
            <div>Correo: ${user?.company?.email || 'administrador@facturas.net'}</div>
            <div>Web: ${user?.company?.web || 'www.facturas.net'}</div>
          </div>
        </div>
        <div class="nota-titulo">BOLETA DE VENTA ELECTRÓNICA</div>
        <div class="nota-numero">${numeroBoleta}</div>
        <div class="nota-cliente">
          <div class="nota-cliente-nombre">${user?.name || 'CAMILO SANCHEZ'}</div>
          <div class="nota-cliente-dni">---</div>
          <div class="nota-cliente-dni">DNI ${user?.dni || '71262017'}</div>
          <div class="nota-fecha-hora">
            FECHA: ${new Date().toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' })} 
            HORA: ${new Date().toLocaleTimeString('es-PE', { hour12: true, hour: '2-digit', minute: '2-digit' }).toUpperCase()}
          </div>
        </div>
        <div class="nota-tabla-header">
          <div>Cant</div>
          <div>U.M</div>
          <div>DESCRIPCION</div>
          <div>PRECIO</div>
          <div>TOTAL</div>
        </div>
        <div class="nota-tabla-row">
          <div>${cantidadHoras}</div>
          <div>HUR</div>
          <div class="nota-tabla-descripcion">ESTACIONAMIENTO DE ${tipoVehiculo.nombre}</div>
          <div>${precioHora.toFixed(2)}</div>
          <div>${total.toFixed(2)}</div>
        </div>
        <div class="nota-totales">
          <div class="nota-total-row">
            <span>TOTAL GRAVADO</span>
            <span>(S/.)</span>
            <span>${totalGravado}</span>
          </div>
          <div class="nota-total-row">
            <span>I.G.V</span>
            <span>(S/.)</span>
            <span>${igv}</span>
          </div>
          <div class="nota-total-row nota-total-final">
            <span>TOTAL</span>
            <span>(S/.)</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
        <div class="nota-pago">
          <div class="nota-pago-row">
            <strong>SON:</strong>
            <span>${montoTexto}</span>
          </div>
          <div class="nota-pago-row">
            <strong>FORMA DE PAGO:</strong>
            <span>EFECTIVO</span>
          </div>
          <div class="nota-pago-row">
            <strong>COND. VENTA:</strong>
            <span>CONTADO</span>
          </div>
        </div>
        <div class="nota-observaciones">
          <strong>Observaciones:</strong>
        </div>
        <div class="nota-qr">
          <div id="qrcode"></div>
        </div>
        <div class="nota-footer">
          Representación Impresa de la BOLETA DE VENTA ELECTRÓNICA<br>
          Puede consultar en: ${user?.company?.web?.toUpperCase() || 'WWW.MIFACT.NET'}<br>
          Autorizado mediante Resolución 034-005-0007241
          <div class="nota-footer-logo">◎Mifact</div>
        </div>
      </div>
      <script>
        const qrData = '${vehiculo.placa || ''}-${new Date().toISOString()}-${total}-${user?.company?.ruc || ''}';
        new QRCode(document.getElementById("qrcode"), {
          text: qrData,
          width: 80,
          height: 80,
          colorDark: "#000000",
          colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.M
        });
        setTimeout(() => {
          window.print();
          window.onafterprint = function() { window.close(); };
        }, 500);
      </script>
    </body>
    </html>
  `;
}
