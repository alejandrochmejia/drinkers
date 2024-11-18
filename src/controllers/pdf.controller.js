import PDFDocument from 'pdfkit';
const imagePath = 'public/images/Logo/Logo.png'; // Cambia esto a la ruta de tu imagen

export const generatePDF = (productosFacturados, base, iva, total, fecha, direccion, control) => {
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
    doc.moveDown();

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

    // Totales
    const subtotalY = tableTop + 25 + (i * 25) + 20;
    doc.fontSize(12).text(`Base Imponible: ${base.toFixed(2)} $`, totalX - 100, subtotalY);
    doc.fontSize(12).text(`IVA: ${iva.toFixed(2)} %`, totalX - 100, subtotalY + 15);
    doc.fontSize(12).text(`Total: ${total.toFixed(2)} $`, totalX - 100, subtotalY + 30);

    return doc;
}