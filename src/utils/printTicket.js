// utils/printTicket.js
// Función para imprimir ticket en impresora térmica usando QZ Tray

export async function printTicketQZ({ placa, fecha, hora, tipoVehiculo, printerName = "T20" }) {
  const ticket =
    "      COCHERA 2025\n" +
    "----------------------------------------\n" +
    `Placa: ${placa}\n` +
    `Fecha ingreso: ${fecha}\n` +
    `Hora ingreso: ${hora}\n` +
    `Tipo vehículo: ${tipoVehiculo}\n` +
    "----------------------------------------\n" +
    "   Gracias por su visita\n\n";


  try {
    await window.qz.websocket.connect();
    const printer = await window.qz.printers.find(printerName);
    const config = window.qz.configs.create(printer);
    const data = [{ type: 'raw', format: 'plain', data: ticket }];
    await window.qz.print(config, data);
    window.qz.websocket.disconnect();
    alert("Ticket enviado directamente a la impresora");
  } catch (err) {
    alert("Error al imprimir: " + err);
  }
}
