// src/services/PluginPrintService.js
/**
 * Servicio de impresión usando plugin-impresion de abrazasoft
 * GitHub: https://github.com/abrazasoft/impresora_termica_javascript
 */

class PluginPrintService {
  constructor() {
    this.baseURL = 'http://localhost:8000';
    this.printerName = null;
  }

  /**
   * Verificar si el plugin está corriendo
   */
  async isPluginRunning() {
    try {
      const response = await fetch(`${this.baseURL}/impresoras`, {
        method: 'GET',
        mode: 'cors'
      });
      return response.ok;
    } catch (error) {
      console.error('Plugin no está corriendo:', error);
      return false;
    }
  }

  /**
   * Obtener lista de impresoras disponibles
   */
  async getPrinters() {
    try {
      const response = await fetch(`${this.baseURL}/impresoras`);
      const data = await response.json();
      
      // El plugin devuelve array de nombres de impresoras
      return data || [];
    } catch (error) {
      console.error('Error obteniendo impresoras:', error);
      throw new Error('No se pudo conectar con el plugin de impresión. Asegúrate de que esté corriendo.');
    }
  }

  /**
   * Establecer impresora por defecto
   */
  setPrinter(printerName) {
    this.printerName = printerName;
    localStorage.setItem('pluginPrinter', printerName);
  }

  /**
   * Obtener impresora guardada
   */
  getPrinter() {
    if (!this.printerName) {
      this.printerName = localStorage.getItem('pluginPrinter');
    }
    return this.printerName;
  }

  /**
   * Crear comando ESC/POS para inicializar
   */
  cmdInit() {
    return '\x1B\x40'; // ESC @
  }

  /**
   * Centrar texto
   */
  cmdCenter() {
    return '\x1B\x61\x01'; // ESC a 1
  }

  /**
   * Alinear izquierda
   */
  cmdLeft() {
    return '\x1B\x61\x00'; // ESC a 0
  }

  /**
   * Alinear derecha
   */
  cmdRight() {
    return '\x1B\x61\x02'; // ESC a 2
  }

  /**
   * Texto normal
   */
  cmdNormal() {
    return '\x1B\x21\x00'; // ESC ! 0
  }

  /**
   * Texto grande (doble ancho y alto)
   */
  cmdLarge() {
    return '\x1B\x21\x30'; // ESC ! 48
  }

  /**
   * Texto negrita
   */
  cmdBold() {
    return '\x1B\x45\x01'; // ESC E 1
  }

  /**
   * Quitar negrita
   */
  cmdBoldOff() {
    return '\x1B\x45\x00'; // ESC E 0
  }

  /**
   * Cortar papel
   */
  cmdCut() {
    return '\x1D\x56\x00'; // GS V 0
  }

  /**
   * Abrir cajón de dinero
   */
  cmdOpenDrawer() {
    return '\x1B\x70\x00\x19\xFA'; // ESC p 0 25 250
  }

  /**
   * Crear línea separadora
   */
  createLine(char = '-', length = 32) {
    return char.repeat(length) + '\n';
  }

  /**
   * Formatear línea con dos columnas
   */
  formatLine(left, right, totalWidth = 32) {
    const leftStr = String(left);
    const rightStr = String(right);
    const spaces = totalWidth - leftStr.length - rightStr.length;
    return leftStr + ' '.repeat(Math.max(0, spaces)) + rightStr + '\n';
  }

  /**
   * Imprimir ticket completo
   */
  async printTicket(ticketData) {
    try {
      // Verificar plugin
      const isRunning = await this.isPluginRunning();
      if (!isRunning) {
        throw new Error('El plugin de impresión no está corriendo. Por favor, inicia plugin-impresion.exe');
      }

      // Verificar impresora
      const printer = this.getPrinter();
      if (!printer) {
        throw new Error('No hay impresora configurada. Por favor, configura una impresora primero.');
      }

      // Construir contenido del ticket
      let content = '';

      // Inicializar
      content += this.cmdInit();

      // Header
      content += this.cmdCenter();
      content += this.cmdLarge();
      content += ticketData.header || 'MI GARAGE';
      content += '\n';
      content += this.cmdNormal();

      if (ticketData.subheader) {
        content += ticketData.subheader + '\n';
      }

      content += '\n';
      content += this.cmdLeft();
      content += this.createLine('=', 32);

      // Información del ticket
      content += this.formatLine('Ticket:', `#${ticketData.id}`);
      content += this.formatLine('Fecha:', ticketData.fecha || new Date().toLocaleString('es-MX'));
      content += this.formatLine('Cliente:', ticketData.cliente || 'Publico General');

      if (ticketData.vehiculo) {
        content += this.formatLine('Vehiculo:', ticketData.vehiculo);
      }
      if (ticketData.placas) {
        content += this.formatLine('Placas:', ticketData.placas);
      }

      content += this.createLine('=', 32);
      content += '\n';

      // Items
      content += this.cmdBold();
      content += 'DESCRIPCION         CANT  PRECIO\n';
      content += this.cmdBoldOff();
      content += this.createLine('-', 32);

      ticketData.items.forEach(item => {
        const desc = String(item.nombre).substring(0, 20).padEnd(20);
        const cant = String(item.cantidad || 1).padStart(4);
        const precio = `$${item.precio.toFixed(2)}`.padStart(8);
        content += `${desc}${cant}${precio}\n`;
      });

      content += this.createLine('-', 32);

      // Totales
      if (ticketData.subtotal) {
        content += this.formatLine('Subtotal:', `$${ticketData.subtotal.toFixed(2)}`);
      }
      if (ticketData.descuento) {
        content += this.formatLine('Descuento:', `-$${ticketData.descuento.toFixed(2)}`);
      }
      if (ticketData.iva) {
        content += this.formatLine('IVA (16%):', `$${ticketData.iva.toFixed(2)}`);
      }

      content += this.createLine('=', 32);
      content += this.cmdLarge();
      content += this.formatLine('TOTAL:', `$${ticketData.total.toFixed(2)}`);
      content += this.cmdNormal();
      content += this.createLine('=', 32);

      // Método de pago
      if (ticketData.metodoPago) {
        content += '\n';
        content += this.formatLine('Pago:', ticketData.metodoPago);
      }

      // Footer
      content += '\n';
      content += this.cmdCenter();
      content += ticketData.footer || 'Gracias por su preferencia\n';
      if (ticketData.website) {
        content += ticketData.website + '\n';
      }

      // Espacios y corte
      content += '\n\n\n';
      content += this.cmdCut();

      // Enviar a imprimir
      const response = await fetch(`${this.baseURL}/imprimir`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          impresora: printer,
          texto: content
        })
      });

      const result = await response.json();

      if (result.success || response.ok) {
        console.log('✅ Ticket impreso correctamente');
        return { success: true, message: 'Ticket impreso correctamente' };
      } else {
        throw new Error(result.message || 'Error al imprimir');
      }

    } catch (error) {
      console.error('❌ Error imprimiendo:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Imprimir texto simple
   */
  async printText(text) {
    try {
      const printer = this.getPrinter();
      if (!printer) {
        throw new Error('No hay impresora configurada');
      }

      const response = await fetch(`${this.baseURL}/imprimir`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          impresora: printer,
          texto: this.cmdInit() + text + '\n\n\n' + this.cmdCut()
        })
      });

      const result = await response.json();
      return result.success || response.ok;

    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  /**
   * Abrir cajón de dinero
   */
  async openDrawer() {
    try {
      const printer = this.getPrinter();
      if (!printer) {
        throw new Error('No hay impresora configurada');
      }

      const response = await fetch(`${this.baseURL}/imprimir`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          impresora: printer,
          texto: this.cmdOpenDrawer()
        })
      });

      const result = await response.json();
      
      if (result.success || response.ok) {
        console.log('✅ Cajón abierto');
        return { success: true };
      } else {
        throw new Error('Error abriendo cajón');
      }

    } catch (error) {
      console.error('Error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Test de impresión
   */
  async printTest() {
    const testContent = 
      this.cmdInit() +
      this.cmdCenter() +
      this.cmdLarge() +
      'PRUEBA DE IMPRESION\n' +
      this.cmdNormal() +
      this.createLine('=', 32) +
      this.cmdLeft() +
      'Fecha: ' + new Date().toLocaleString('es-MX') + '\n' +
      'Impresora: ' + this.getPrinter() + '\n' +
      this.createLine('=', 32) +
      this.cmdCenter() +
      'Si puedes leer esto,\n' +
      'la impresora funciona correctamente\n\n\n' +
      this.cmdCut();

    return await this.printText(testContent);
  }
}

// Exportar instancia única
const pluginPrintService = new PluginPrintService();
export default pluginPrintService;