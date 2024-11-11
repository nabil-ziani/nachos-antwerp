import { jsPDF } from 'jspdf';
import { registerFonts } from './register-fonts';
import { getLogoAsBase64 } from './image-to-base64';

const COLORS = {
    primary: '#1a2f33',
    secondary: '#64748b',
    accent: '#f39c12',
    border: 'rgba(26, 47, 51, 0.2)'
};

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
    const doc = new jsPDF({
        format: 'a4',
        unit: 'mm'
    });

    const fontsRegistered = registerFonts(doc);
    const fonts = {
        heading: fontsRegistered ? 'Playfair Display' : 'helvetica',
        body: fontsRegistered ? 'Josefin Sans' : 'helvetica'
    };

    // Page dimensions
    const pageWidth = doc.internal.pageSize.width;
    const pageMargin = 20;
    const contentWidth = pageWidth - (pageMargin * 2);
    const centerX = pageWidth / 2;

    // Add logo (centered)
    const logoWidth = 40;
    const logoX = centerX - (logoWidth / 2);
    try {
        doc.addImage(getLogoAsBase64(), 'PNG', logoX, 20, logoWidth, 40);
    } catch (error) {
        console.error('Failed to add logo:', error);
    }

    // Header text (centered)
    doc.setFont(fonts.heading, 'bold');
    doc.setFontSize(24);
    doc.setTextColor(COLORS.primary);
    doc.text("Nacho's Antwerp", centerX, 70, { align: 'center' });

    // Company info (centered)
    doc.setFont(fonts.body, 'normal');
    doc.setFontSize(10);
    doc.setTextColor(COLORS.secondary);
    const companyInfo = [
        'BTW: BE0123456789',
        'Diksmuidelaan 170',
        '2600 Berchem',
        'Tel: +32 467 07 18 74',
        'bestellingen@nachosantwerp.be'
    ];
    doc.text(companyInfo, centerX, 80, { align: 'center' });

    // Invoice details (right-aligned)
    doc.setFont(fonts.body, 'normal');
    doc.setFontSize(10);
    doc.setTextColor(COLORS.secondary);
    doc.text([
        `Factuurnummer: ${orderData.orderId}`,
        `Datum: ${orderData.date.toLocaleDateString('nl-BE')}`,
    ], pageWidth - pageMargin, 30, { align: 'right' });

    // Dotted line separator
    drawDottedLine(doc, pageMargin, 110, pageWidth - pageMargin, 110);

    // Client details
    doc.setFont(fonts.heading, 'bold');
    doc.setFontSize(12);
    doc.setTextColor(COLORS.primary);
    doc.text('FACTUUR VOOR', pageMargin, 125);

    doc.setFont(fonts.body, 'normal');
    doc.setFontSize(10);
    doc.text([
        orderData.company.name,
        orderData.company.vatNumber ? `BTW: ${orderData.company.vatNumber}` : '',
    ], pageMargin, 135);

    // Items table
    const tableTop = 160;
    let currentY = tableTop;

    // Table header with fixed column widths
    const columns = {
        description: { x: pageMargin, width: 90 },
        quantity: { x: pageMargin + 100, width: 20 },
        price: { x: pageMargin + 130, width: 25 },
        total: { x: pageWidth - pageMargin - 25, width: 25 }
    };

    // Table header
    doc.setFont(fonts.heading, 'bold');
    doc.setFontSize(10);
    doc.setTextColor(COLORS.primary);

    doc.text('OMSCHRIJVING', columns.description.x, currentY);
    doc.text('AANTAL', columns.quantity.x, currentY);
    doc.text('PRIJS', columns.price.x, currentY);
    doc.text('TOTAAL', columns.total.x, currentY, { align: 'right' });

    currentY += 5;
    drawDottedLine(doc, pageMargin, currentY, pageWidth - pageMargin, currentY);
    currentY += 10;

    // Table items with consistent spacing
    doc.setFont(fonts.body, 'normal');
    doc.setTextColor(COLORS.secondary);

    orderData.items.forEach(item => {
        doc.text(item.title, columns.description.x, currentY);
        doc.text(item.quantity.toString(), columns.quantity.x, currentY);
        doc.text(`€ ${item.price.toFixed(2)}`, columns.price.x, currentY);
        doc.text(`€ ${(item.quantity * item.price).toFixed(2)}`, columns.total.x, currentY, { align: 'right' });

        currentY += 8;
    });

    // Totals section (right-aligned with proper spacing)
    currentY += 10;
    drawDottedLine(doc, pageMargin, currentY, pageWidth - pageMargin, currentY);
    currentY += 10;

    const totalExclVAT = orderData.total / 1.21;
    const totalsX = pageWidth - pageMargin - 60; // Left align point for labels
    const valuesX = pageWidth - pageMargin; // Right align point for values

    doc.setFont(fonts.body, 'normal');
    doc.text('Subtotaal excl. BTW:', totalsX, currentY);
    doc.text(`€ ${totalExclVAT.toFixed(2)}`, valuesX, currentY, { align: 'right' });
    currentY += 8;

    doc.text('BTW 21%:', totalsX, currentY);
    doc.text(`€ ${(orderData.total - totalExclVAT).toFixed(2)}`, valuesX, currentY, { align: 'right' });
    currentY += 8;

    doc.setFont(fonts.heading, 'bold');
    doc.setTextColor(COLORS.accent);
    doc.text('TOTAAL incl. BTW:', totalsX, currentY);
    doc.text(`€ ${orderData.total.toFixed(2)}`, valuesX, currentY, { align: 'right' });

    // Footer
    const footerY = 270;
    drawDottedLine(doc, pageMargin, footerY - 10, pageWidth - pageMargin, footerY - 10);

    doc.setFont(fonts.body, 'normal');
    doc.setFontSize(8);
    doc.setTextColor(COLORS.secondary);
    doc.text([
        "Nacho's Antwerp",
        'www.nachosantwerp.be',
        'Betalingsvoorwaarden: Direct bij bestelling'
    ], pageMargin, footerY);

    return Buffer.from(doc.output('arraybuffer'));
}

// Helper function for dotted lines
function drawDottedLine(doc: jsPDF, startX: number, startY: number, endX: number, endY: number) {
    const dotSpacing = 1;
    const numberOfDots = Math.floor((endX - startX) / dotSpacing);

    doc.setDrawColor(26, 47, 51); // RGB for your border color
    doc.setFillColor(26, 47, 51);

    for (let i = 0; i < numberOfDots; i++) {
        const x = startX + (i * dotSpacing);
        doc.circle(x, startY, 0.2, 'F');
    }
} 