// src/components/PluginPrinterConfig.jsx
import { useState, useEffect } from 'react';
import pluginPrintService from '../services/PluginPrintService';

function PluginPrinterConfig() {
  const [pluginRunning, setPluginRunning] = useState(false);
  const [printers, setPrinters] = useState([]);
  const [selectedPrinter, setSelectedPrinter] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    checkPlugin();
  }, []);

  const checkPlugin = async () => {
    setChecking(true);
    try {
      const isRunning = await pluginPrintService.isPluginRunning();
      setPluginRunning(isRunning);

      if (isRunning) {
        await loadPrinters();
      }
    } catch (error) {
      console.error('Error:', error);
      setPluginRunning(false);
    } finally {
      setChecking(false);
    }
  };

  const loadPrinters = async () => {
    setLoading(true);
    try {
      const printerList = await pluginPrintService.getPrinters();
      setPrinters(printerList);

      // Cargar impresora guardada
      const savedPrinter = pluginPrintService.getPrinter();
      if (savedPrinter && printerList.includes(savedPrinter)) {
        setSelectedPrinter(savedPrinter);
      }
    } catch (error) {
      console.error('Error cargando impresoras:', error);
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePrinter = () => {
    if (!selectedPrinter) {
      alert('⚠️ Por favor selecciona una impresora');
      return;
    }

    pluginPrintService.setPrinter(selectedPrinter);
    alert('✅ Impresora guardada correctamente');
  };

  const handleTestPrint = async () => {
    if (!selectedPrinter) {
      alert('⚠️ Por favor selecciona una impresora');
      return;
    }

    setLoading(true);
    pluginPrintService.setPrinter(selectedPrinter);

    try {
      const testTicket = {
        header: 'MI GARAGE',
        subheader: 'RFC: XXXX000000XXX\nTel: (123) 456-7890',
        id: '001-TEST',
        fecha: new Date().toLocaleString('es-MX'),
        cliente: 'Cliente de Prueba',
        vehiculo: 'Toyota Corolla 2020',
        placas: 'ABC-123',
        items: [
          { nombre: 'Cambio de aceite', cantidad: 1, precio: 350.00 },
          { nombre: 'Filtro de aire', cantidad: 1, precio: 150.00 },
          { nombre: 'Revision general', cantidad: 1, precio: 100.00 }
        ],
        subtotal: 600.00,
        iva: 96.00,
        total: 696.00,
        metodoPago: 'Efectivo',
        footer: 'Gracias por su preferencia',
        website: 'www.migarage.com'
      };

      const result = await pluginPrintService.printTicket(testTicket);

      if (result.success) {
        alert('✅ Impresión de prueba exitosa');
      } else {
        alert('❌ Error: ' + result.error);
      }
    } catch (error) {
      alert('❌ Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDrawer = async () => {
    if (!selectedPrinter) {
      alert('⚠️ Por favor selecciona una impresora');
      return;
    }

    setLoading(true);
    pluginPrintService.setPrinter(selectedPrinter);

    try {
      const result = await pluginPrintService.openDrawer();
      if (result.success) {
        alert('✅ Cajón abierto');
      } else {
        alert('❌ Error: ' + result.error);
      }
    } catch (error) {
      alert('❌ Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Verificando plugin...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        🖨️ Configuración de Impresora
      </h2>

      {/* Estado del plugin */}
      <div className={`mb-6 p-4 rounded-lg border ${
        pluginRunning 
          ? 'bg-green-100 border-green-400' 
          : 'bg-red-100 border-red-400'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${
              pluginRunning ? 'bg-green-500' : 'bg-red-500'
            } animate-pulse`}></div>
            <span className={`font-semibold ${
              pluginRunning ? 'text-green-700' : 'text-red-700'
            }`}>
              {pluginRunning 
                ? 'Plugin de Impresión Activo' 
                : 'Plugin de Impresión Inactivo'
              }
            </span>
          </div>
          <button
            onClick={checkPlugin}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Verificando...' : '🔄 Verificar'}
          </button>
        </div>

        {!pluginRunning && (
          <div className="mt-3 p-3 bg-white rounded border border-red-300">
            <p className="text-sm text-red-700 font-semibold mb-2">
              ⚠️ El plugin no está corriendo
            </p>
            <p className="text-sm text-gray-700 mb-2">
              Para usar la impresora, necesitas:
            </p>
            <ol className="text-sm text-gray-700 list-decimal list-inside space-y-1">
              <li>
                Descargar el plugin desde:{' '}
                <a 
                  href="https://github.com/abrazasoft/impresora_termica_javascript/releases" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline font-semibold"
                >
                  GitHub Releases
                </a>
              </li>
              <li>Ejecutar el archivo <code className="bg-gray-200 px-1 rounded">plugin-impresion.exe</code></li>
              <li>Verificar que aparezca el icono en la bandeja del sistema</li>
              <li>Hacer clic en "Verificar" arriba</li>
            </ol>
          </div>
        )}
      </div>

      {/* Configuración de impresora */}
      {pluginRunning && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seleccionar Impresora:
            </label>
            {printers.length > 0 ? (
              <select
                value={selectedPrinter}
                onChange={(e) => setSelectedPrinter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              >
                <option value="">-- Selecciona una impresora --</option>
                {printers.map((printer, index) => (
                  <option key={index} value={printer}>
                    {printer}
                  </option>
                ))}
              </select>
            ) : (
              <div className="p-4 bg-yellow-50 border border-yellow-300 rounded-lg">
                <p className="text-sm text-yellow-800">
                  ⚠️ No se encontraron impresoras. Asegúrate de que tu impresora esté conectada y encendida.
                </p>
              </div>
            )}
          </div>

          {/* Botones de acción */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleSavePrinter}
              disabled={!selectedPrinter || loading}
              className="flex-1 min-w-[150px] px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              💾 Guardar Configuración
            </button>

            <button
              onClick={handleTestPrint}
              disabled={!selectedPrinter || loading}
              className="flex-1 min-w-[150px] px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              {loading ? '⏳ Imprimiendo...' : '🖨️ Imprimir Prueba'}
            </button>

            <button
              onClick={handleOpenDrawer}
              disabled={!selectedPrinter || loading}
              className="flex-1 min-w-[150px] px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              💰 Abrir Cajón
            </button>

            <button
              onClick={loadPrinters}
              disabled={loading}
              className="px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
            >
              🔄 Actualizar Lista
            </button>
          </div>

          {/* Información adicional */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">ℹ️ Ventajas de este plugin:</h3>
            <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
              <li>✅ No requiere certificados ni configuraciones complejas</li>
              <li>✅ Imprime sin mensajes de advertencia</li>
              <li>✅ Muy ligero (~2MB) y rápido</li>
              <li>✅ Compatible con impresoras térmicas ESC/POS</li>
              <li>✅ Gratuito y open source</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default PluginPrinterConfig;