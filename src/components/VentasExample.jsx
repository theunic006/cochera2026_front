// src/pages/VentasExample.jsx
import { useState } from 'react';
import PluginTicketPrint from '../components/PluginTicketPrint';
import pluginPrintService from '../services/PluginPrintService';

function VentasExample() {
  const [ordenActual, setOrdenActual] = useState(null);
  const [loading, setLoading] = useState(false);

  // Ejemplo: Simular creación de orden
  const handleCrearOrden = async () => {
    setLoading(true);

    try {
      // Aquí harías tu llamada a Laravel
      const response = await fetch('https://tudominio.com/api/ordenes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          cliente_id: 1,
          vehiculo: 'Toyota Corolla 2020',
          placas: 'ABC-123',
          items: [
            { producto_id: 1, cantidad: 1, precio: 350 },
            { producto_id: 2, cantidad: 2, precio: 75 }
          ],
          metodo_pago: 'Efectivo'
        })
      });

      const data = await response.json();
      
      // Formatear datos para el ticket
      const orden = {
        id: data.id,
        fecha: data.created_at,
        cliente: data.cliente.nombre,
        vehiculo: data.vehiculo,
        placas: data.placas,
        items: data.items.map(item => ({
          nombre: item.producto.nombre,
          cantidad: item.cantidad,
          precio: parseFloat(item.precio)
        })),
        subtotal: parseFloat(data.subtotal),
        iva: parseFloat(data.iva),
        total: parseFloat(data.total),
        metodoPago: data.metodo_pago
      };

      setOrdenActual(orden);
      alert('✅ Orden creada exitosamente');

    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error al crear orden: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Ejemplo: Orden de prueba sin backend
  const handleOrdenPrueba = () => {
    const ordenPrueba = {
      id: '001-' + Date.now(),
      fecha: new Date().toLocaleString('es-MX'),
      cliente: 'Juan Pérez García',
      vehiculo: 'Honda Civic 2019',
      placas: 'XYZ-789',
      items: [
        { nombre: 'Cambio de aceite sintético', cantidad: 1, precio: 450.00 },
        { nombre: 'Filtro de aceite', cantidad: 1, precio: 120.00 },
        { nombre: 'Filtro de aire', cantidad: 1, precio: 180.00 },
        { nombre: 'Revisión de frenos', cantidad: 1, precio: 200.00 },
        { nombre: 'Mano de obra', cantidad: 1, precio: 150.00 }
      ],
      subtotal: 1100.00,
      iva: 176.00,
      total: 1276.00,
      metodoPago: 'Tarjeta de crédito'
    };

    setOrdenActual(ordenPrueba);
  };

  // Callback cuando se imprime
  const handlePrintComplete = (success, error) => {
    if (success) {
      console.log('✅ Impresión completada');
      // Aquí puedes hacer algo después de imprimir
      // Por ejemplo: actualizar estado en backend, limpiar formulario, etc.
    } else {
      console.error('❌ Error imprimiendo:', error);
    }
  };

  // Imprimir directamente sin botón
  const imprimirDirecto = async () => {
    if (!ordenActual) {
      alert('⚠️ Primero crea una orden');
      return;
    }

    try {
      const result = await pluginPrintService.printTicket(ordenActual);
      if (result.success) {
        alert('✅ Ticket impreso');
      } else {
        alert('❌ Error: ' + result.error);
      }
    } catch (error) {
      alert('❌ Error: ' + error.message);
    }
  };

  // Abrir cajón de dinero
  const abrirCajon = async () => {
    try {
      const result = await pluginPrintService.openDrawer();
      if (result.success) {
        console.log('✅ Cajón abierto');
      } else {
        alert('❌ Error: ' + result.error);
      }
    } catch (error) {
      alert('❌ Error: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          💼 Sistema de Ventas - MI GARAGE
        </h1>

        {/* Botones de prueba */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 text-gray-700">
            🧪 Pruebas
          </h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleOrdenPrueba}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
            >
              📝 Crear Orden de Prueba
            </button>
            
            <button
              onClick={handleCrearOrden}
              disabled={loading}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold disabled:opacity-50"
            >
              {loading ? '⏳ Creando...' : '🚀 Crear Orden Real (API)'}
            </button>

            <button
              onClick={abrirCajon}
              className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-semibold"
            >
              💰 Abrir Cajón
            </button>
          </div>
        </div>

        {/* Vista previa de la orden */}
        {ordenActual && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4 text-gray-700">
              📋 Orden Actual
            </h2>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Ticket:</p>
                <p className="font-semibold">#{ordenActual.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Fecha:</p>
                <p className="font-semibold">{ordenActual.fecha}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Cliente:</p>
                <p className="font-semibold">{ordenActual.cliente}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Vehículo:</p>
                <p className="font-semibold">{ordenActual.vehiculo}</p>
              </div>
            </div>

            {/* Items */}
            <div className="border-t pt-4 mb-4">
              <h3 className="font-semibold mb-2">Servicios/Productos:</h3>
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-2">Descripción</th>
                    <th className="text-center p-2">Cant.</th>
                    <th className="text-right p-2">Precio</th>
                    <th className="text-right p-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {ordenActual.items.map((item, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="p-2">{item.nombre}</td>
                      <td className="text-center p-2">{item.cantidad}</td>
                      <td className="text-right p-2">${item.precio.toFixed(2)}</td>
                      <td className="text-right p-2">
                        ${(item.cantidad * item.precio).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totales */}
            <div className="border-t pt-4 space-y-2">
              {ordenActual.subtotal && (
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold">${ordenActual.subtotal.toFixed(2)}</span>
                </div>
              )}
              {ordenActual.iva && (
                <div className="flex justify-between">
                  <span>IVA (16%):</span>
                  <span className="font-semibold">${ordenActual.iva.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold">
                <span>TOTAL:</span>
                <span>${ordenActual.total.toFixed(2)}</span>
              </div>
              {ordenActual.metodoPago && (
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Método de pago:</span>
                  <span className="font-semibold">{ordenActual.metodoPago}</span>
                </div>
              )}
            </div>

            {/* Botones de impresión */}
            <div className="border-t pt-4 mt-4 flex flex-wrap gap-3">
              {/* Componente con botón */}
              <PluginTicketPrint 
                orden={ordenActual}
                onPrintComplete={handlePrintComplete}
              />

              {/* Botón personalizado */}
              <button
                onClick={imprimirDirecto}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold"
              >
                🖨️ Imprimir Directo (sin componente)
              </button>

              <button
                onClick={() => setOrdenActual(null)}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-semibold"
              >
                🗑️ Limpiar Orden
              </button>
            </div>
          </div>
        )}

        {/* Información */}
        {!ordenActual && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-800 mb-2">
              ℹ️ Cómo usar:
            </h3>
            <ol className="text-sm text-blue-700 space-y-2 list-decimal list-inside">
              <li>Haz clic en "Crear Orden de Prueba" para generar una orden de ejemplo</li>
              <li>Verás la vista previa de la orden con todos los detalles</li>
              <li>Haz clic en "Imprimir Ticket" para enviar a la impresora</li>
              <li>El ticket se imprimirá automáticamente sin diálogos</li>
            </ol>

            <div className="mt-4 p-3 bg-white rounded border border-blue-300">
              <p className="text-sm font-semibold text-blue-900 mb-1">
                ⚠️ Requisito:
              </p>
              <p className="text-sm text-blue-800">
                Asegúrate de tener el <strong>plugin-impresion.exe</strong> corriendo.
                Si no lo tienes, descárgalo desde:{' '}
                <a 
                  href="https://github.com/abrazasoft/impresora_termica_javascript/releases" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline font-semibold"
                >
                  GitHub Releases
                </a>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default VentasExample;