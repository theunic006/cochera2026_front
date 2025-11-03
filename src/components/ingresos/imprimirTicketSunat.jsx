import { getTicketSunatHTML } from './TicketSunatTemplate';

/**
 * Imprime el ticket de comprobante electrónico enviado a SUNAT
 * @param {Object} params - Parámetros de impresión
 * @param {Object} params.respuestaSunat - Respuesta completa de SUNAT con toda la data
 * @param {Object} params.datosEmpresa - Datos de la empresa (user.company)
 * @param {Object} params.datosCliente - Datos del cliente ingresados en el modal
 */
export const imprimirTicketSunat = ({ respuestaSunat, datosEmpresa, datosCliente }) => {
  try {
    console.log('🖨️ Generando ticket de comprobante SUNAT...');
    console.log('📄 Datos recibidos:', { respuestaSunat, datosEmpresa, datosCliente });

    // Generar HTML del ticket
    const html = getTicketSunatHTML({
      respuestaSunat,
      datosEmpresa,
      datosCliente
    });

    // Crear iframe para mostrar e imprimir
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.top = '0';
    iframe.style.left = '0';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.style.zIndex = '9999';
    iframe.style.backgroundColor = 'white';
    
    document.body.appendChild(iframe);
    
    const iframeDoc = iframe.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write(html);
    iframeDoc.close();

    // Esperar carga y configurar limpieza después de imprimir
    iframe.onload = () => {
      setTimeout(() => {
        iframe.contentWindow.onafterprint = () => {
          document.body.removeChild(iframe);
        };
        // Remover también si el usuario cancela
        setTimeout(() => {
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
          }
        }, 2000);
      }, 500);
    };

    console.log('✅ Ticket generado exitosamente');
    return { success: true };
  } catch (error) {
    console.error('❌ Error al imprimir ticket SUNAT:', error);
    return { success: false, error };
  }
};

export default imprimirTicketSunat;
