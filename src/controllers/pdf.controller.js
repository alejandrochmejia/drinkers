import PDFDocument from 'pdfkit';

export const generatePDF = (productosFacturados, base, iva, total, fecha, direccion, control) => {
    const doc = new PDFDocument();
    doc.fontSize(25).text('Factura de Compra');
    doc.fontSize(15).text(`Fecha: ${fecha.toLocaleDateString()}`);
    doc.fontSize(15).text(`Direccion de Entrega: ${direccion}`);
    doc.fontSize(15).text(`Control: ${control}`);
    doc.fontSize(15).text(`Base Imponible: ${base} $`);
    doc.fontSize(15).text(`IVA: ${iva} %`);
    doc.fontSize(15).text(`Total: ${total} $`);
    doc.fontSize(15).text('Productos:');
    productosFacturados.forEach(product => {
        doc.fontSize(12).text(`     Nombre: ${product.nombre}`);
        doc.fontSize(12).text(`     Precio: ${product.precio}`);
        doc.fontSize(12).text(`     Cantidad: ${product.cantidad}`);
        doc.lineWidth(0.5).moveTo(0, 0).lineTo(500, 0).stroke();
    });
    return doc;
}