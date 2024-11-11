import { jsPDF } from 'jspdf';

export async function generateInvoice(orderData: {
    orderId: string;
    company: {
        name: string;
        vatNumber?: string;
    };
    items: Array<{
        title: string;
        quantity: number;
        price: number;
    }>;
    total: number;
    date: Date;
}) {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.text("Nacho's Antwerp", 20, 20);
    doc.setFontSize(12);
    doc.text('BTW: BE0123456789', 20, 30);
    doc.text('Diksmuidelaan 170', 20, 35);
    doc.text('2600 Berchem', 20, 40);

    // Invoice details
    doc.setFontSize(16);
    doc.text('FACTUUR', 150, 20);
    doc.setFontSize(12);
    doc.text(`Factuurnummer: ${orderData.orderId}`, 150, 30);
    doc.text(`Datum: ${orderData.date.toLocaleDateString()}`, 150, 35);

    // Company details
    doc.text('Factuur voor:', 20, 60);
    doc.text(orderData.company.name, 20, 65);
    if (orderData.company.vatNumber) {
        doc.text(`BTW: ${orderData.company.vatNumber}`, 20, 70);
    }

    // Items table header
    let y = 90;
    doc.text('Omschrijving', 20, y);
    doc.text('Aantal', 120, y);
    doc.text('Prijs', 150, y);
    doc.text('Totaal', 180, y);

    // Line under header
    y += 2;
    doc.line(20, y, 190, y);

    // Items
    y += 10;
    orderData.items.forEach(item => {
        doc.text(item.title, 20, y);
        doc.text(item.quantity.toString(), 120, y);
        doc.text(`€${item.price.toFixed(2)}`, 150, y);
        doc.text(`€${(item.quantity * item.price).toFixed(2)}`, 180, y);
        y += 8;
    });

    // Totals
    y += 10;
    doc.line(20, y, 190, y);
    y += 10;

    const totalExclVAT = orderData.total / 1.21;
    doc.text('Totaal excl. BTW:', 120, y);
    doc.text(`€${totalExclVAT.toFixed(2)}`, 180, y);
    y += 8;
    doc.text('BTW 21%:', 120, y);
    doc.text(`€${(orderData.total - totalExclVAT).toFixed(2)}`, 180, y);
    y += 8;
    doc.text('Totaal incl. BTW:', 120, y);
    doc.text(`€${orderData.total.toFixed(2)}`, 180, y);

    // Return as Buffer
    return Buffer.from(doc.output('arraybuffer'));
} 