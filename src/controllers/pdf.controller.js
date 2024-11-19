import PDFDocument from 'pdfkit';
const imagePath = 'public/images/Logo/Logo.png';

const response = await fetch("https://ve.dolarapi.com/v1/dolares/oficial");
const data = await response.json();
const dolar = data.promedio;

export const generatePDF = (productosFacturados, base, iva, total, fecha, direccion, control, nombre, apellido, cedula) => {
    
    const doc = new PDFDocument({ margin: 30 });

    // Encabezado
    doc.image(imagePath, doc.page.width - 140, 30, {
        fit: [75, 75],
        align: 'right',
        valign: 'top'
    });
    doc.fontSize(25).text('Factura de Compra', { align: 'left' });
    doc.moveDown();

    // Detalles de la factura
    doc.fontSize(15).text(`Fecha: ${fecha.toLocaleDateString()}`);
    doc.fontSize(15).text(`Dirección de Entrega: ${direccion}`);
    doc.fontSize(15).text(`Control: ${control}`);

    // Datos del cliente

    doc.fontSize(15).text(`Nombre: ${nombre} ${apellido}, C.I: ${cedula}`);


    // Tabla de productos
    doc.fontSize(15).text('Productos:', { underline: true });
    doc.moveDown();
    const tableTop = 200;
    const itemCodeX = 50;
    const descriptionX = 150;
    const quantityX = 300;
    const priceX = 350;
    const totalX = 450;

    doc.fontSize(12).text('Nombre', itemCodeX, tableTop);
    doc.fontSize(12).text('Precio', priceX, tableTop);
    doc.fontSize(12).text('Cantidad', quantityX, tableTop);
    doc.fontSize(12).text('Total', totalX, tableTop);

    let i;
    for (i = 0; i < productosFacturados.length; i++) {
        const product = productosFacturados[i];
        const y = tableTop + 25 + (i * 25);

        doc.fontSize(10).text(product.nombre, itemCodeX, y);
        doc.fontSize(10).text(product.precio.toFixed(2) + ' $', priceX, y);
        doc.fontSize(10).text(product.cantidad, quantityX, y);
        doc.fontSize(10).text((product.precio * product.cantidad).toFixed(2) + ' $', totalX, y);
    }

    doc.moveDown();
    // Totales
    const subtotalY = tableTop + 25 + (i * 25) + 20;
    doc.fontSize(12).text(`Tasa del Dolar: ${dolar.toFixed(2)} Bs`, totalX - 100, subtotalY);
    doc.fontSize(12).text(`Base Imponible: ${base.toFixed(2)} $`, totalX - 100, subtotalY + 15);
    doc.fontSize(12).text(`IVA: ${(base*(iva/100))} $`, totalX - 100, subtotalY + 30);
    doc.fontSize(12).text(`Total: ${total.toFixed(2)} $`, totalX - 100, subtotalY + 45);

    return doc;
}