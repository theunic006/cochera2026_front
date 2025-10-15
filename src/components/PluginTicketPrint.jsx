// src/components/PluginTicketPrint.jsx
import { useState } from 'react';
import pluginPrintService from '../services/PluginPrintService';

function PluginTicketPrint({ orden, onPrintComplete, autoprint = false }) {
  const [printing, setPrinting] = useState(false);

  // Auto-imprimir si autoprint es true
  useState(() => {
    if (autoprint && orden) {
      handlePrint();
    }
  }, [autoprint, orden]);

  const handlePrint = async () => {
    if (!orden) {
      alert('⚠️ No hay datos de orden para imprimir');
      return;
    }

    setPrinting(true);

    try {
      // Verificar que el plugin esté corriendo
      const isRunning = await pluginPrintService.isPluginRunning();
      if (!isRunning) {
        throw new Error('El plugin de impresión no está corriendo. Por favor, inicia plugin-impresion.exe');
      }

      // Verificar que haya impresora configurada
      const printer = pluginPrintService.getPrinter();
      if (!printer) {
        throw new Error('No hay impresora configurada. Ve a Configuración → Impresora');
      }

      // Preparar datos del ticket
      const ticketData = {
        header: orden.header || 'MI GARAGE',
        subheader: orden.subheader || 'RFC: XXXX000000XXX\nTel: (123) 456-7890\nDireccion: Av. Principal #123\n',
        id: orden.id || orden.numero || 'S/N',
        fecha: orden.fecha || new Date().toLocaleString('es-MX', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }),
        cliente: orden.cliente || orden.cliente_nombre || 'Público General',
        vehiculo: orden.vehiculo || orden.vehiculo_descripcion,
        placas: orden.placas,
        items: (orden.items || orden.detalles || []).map(item => ({
          nombre: item.nombre || item.descripcion || item.producto,
          cantidad: parseInt(item.cantidad) || 1,
          precio: parseFloat(item.precio) || parseFloat(item.precio_unitario) || 0
        })),
        subtotal: orden.subtotal ? parseFloat(orden.subtotal) : null,
        descuento: orden.descuento ? parseFloat(orden.descuento) : null,
        iva: orden.iva ? parseFloat(orden.iva) : null,
        total: parseFloat(orden.total) || 0,
        metodoPago: orden.metodoPago || orden.metodo_pago || orden.forma_pago,
        footer: orden.footer || 'Gracias por su preferencia\nVuelva pronto',
        website: orden.website || 'www.migarage.com'
      };

      // Imprimir
      const result = await pluginPrintService.printTicket(ticketData);

      if (result.success) {
        console.log('✅ Ticket impreso correctamente');
        
        // Notificar éxito
        if (onPrintComplete) {
          onPrintComplete(true);
        }

        // Mostrar notificación temporal
        showSuccessNotification();
      } else {
        throw new Error(result.error || 'Error desconocido al imprimir');
      }

    } catch (error) {
      console.error('❌ Error imprimiendo:', error);
      
      // Mensaje de error detallado
      let errorMessage = 'Error al imprimir:\n\n';
      errorMessage += error.message + '\n\n';
      errorMessage += 'Asegúrate de que:\n';
      errorMessage += '1. El plugin esté corriendo (plugin-impresion.exe)\n';
      errorMessage += '2. La impresora esté configurada\n';
      errorMessage += '3. La impresora esté encendida y conectada';
      
      alert(errorMessage);
      
      if (onPrintComplete) {
        onPrintComplete(false, error.message);
      }

      showErrorNotification();
    } finally {
      setPrinting(false);
    }
  };

  const showSuccessNotification = () => {
    // Puedes usar una librería de notificaciones como react-toastify
    console.log('✅ Impresión exitosa');
  };

  const showErrorNotification = () => {
    console.log('❌ Error en impresión');
  };

  return (
    <button
      onClick={handlePrint}
      disabled={printing || !orden}
      className={`
        px-6 py-3 rounded-lg font-semibold text-white
        flex items-center gap-2 justify-center
        transition-all duration-200 min-w-[180px]
        ${printing 
          ? 'bg-gray-400 cursor-not-allowed' 
          : 'bg-green-600 hover:bg-green-700 hover:shadow-lg active:scale-95'
        }
        ${!orden ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      title={!orden ? 'No hay orden para imprimir' : 'Imprimir ticket'}
    >
      {printing ? (
        <>
          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Imprimiendo...</span>
        </>
      ) : (
        <>
          <span className="text-xl">🖨️</span>
          <span>Imprimir Ticket</span>
        </>
      )}
    </button>
  );
}

export default PluginTicketPrint;