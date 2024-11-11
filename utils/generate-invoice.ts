import { jsPDF } from 'jspdf';
import { getLogoAsBase64 } from './image-to-base64';
import { registerFonts } from './register-fonts';

// Constants for styling
const COLORS = {
    primary: '#1a2f33',
    secondary: '#64748b',
    accent: '#f39c12',
    border: 'rgba(26, 47, 51, 0.2)' // Matching your email template divider opacity
};

// Helper function to draw dotted line
function drawDottedLine(doc: jsPDF, startX: number, startY: number, endX: number, endY: number) {
    const dotLength = 1;
    const gapLength = 1;
    const numberOfDots = Math.floor((endX - startX) / (dotLength + gapLength));

    doc.setDrawColor(26, 47, 51); // RGB values for your border color
    doc.setFillColor(26, 47, 51);

    for (let i = 0; i < numberOfDots; i++) {
        const x = startX + i * (dotLength + gapLength);
        doc.circle(x, startY, 0.2, 'F');
    }
}

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
    // Create PDF with slightly larger format for better layout
    const doc = new jsPDF({
        format: 'a4',
        unit: 'mm'
    });

    // Register fonts
    const fontsRegistered = registerFonts(doc);


    // If fonts fail to register, fallback to helvetica
    const fonts = {
        heading: fontsRegistered ? 'Playfair Display' : 'helvetica',
        body: fontsRegistered ? 'Josefin Sans' : 'helvetica'
    };

    // Add logo (smaller and better positioned)
    const logoBase64 = getLogoAsBase64();
    if (logoBase64) {
        try {
            doc.addImage(logoBase64, 'PNG', 20, 20, 30, 30);
        } catch (error) {
            console.error('Failed to add logo:', error);
        }
    }

    // Header section (moved right to align with content)
    doc.setFont(fonts.heading, 'bold');
    doc.setFontSize(24);
    doc.setTextColor(COLORS.primary);
    doc.text("Nacho's Antwerp", 60, 35);

    // Company info (better aligned)
    doc.setFont(fonts.body, 'normal');
    doc.setFontSize(10);
    doc.setTextColor(COLORS.secondary);
    doc.text([
        'BTW: BE0123456789',
        'Diksmuidelaan 170',
        '2600 Berchem',
        'Tel: +32 467 07 18 74',
        'bestellingen@nachosantwerp.be'
    ], 60, 45);

    // Invoice details (right-aligned)
    doc.setFont(fonts.heading, 'bold');
    doc.setFontSize(14);
    doc.setTextColor(COLORS.accent);
    doc.text('FACTUUR', 150, 30);

    doc.setFont(fonts.body, 'normal');
    doc.setFontSize(10);
    doc.setTextColor(COLORS.secondary);
    doc.text([
        `Nummer: ${orderData.orderId}`,
        `Datum: ${orderData.date.toLocaleDateString('nl-BE')}`,
    ], 150, 40);

    // Dotted line separator (matching your email style)
    drawDottedLine(doc, 20, 65, 190, 65);

    // Client details (cleaner layout)
    doc.setFont(fonts.heading, 'bold');
    doc.setFontSize(12);
    doc.setTextColor(COLORS.primary);
    doc.text('FACTUUR VOOR', 20, 80);

    doc.setFont(fonts.body, 'normal');
    doc.setFontSize(10);
    doc.text([
        orderData.company.name,
        orderData.company.vatNumber ? `BTW: ${orderData.company.vatNumber}` : '',
    ], 20, 90);

    // Items table (with dotted lines between items)
    const tableTop = 120;
    let currentY = tableTop;

    // Table header
    doc.setFont(fonts.heading, 'bold');
    doc.setFontSize(10);
    doc.setTextColor(COLORS.primary);

    // Column headers
    const columns = {
        description: { x: 20, width: 80 },
        quantity: { x: 110, width: 20 },
        price: { x: 140, width: 25 },
        total: { x: 170, width: 25 }
    };

    doc.text('OMSCHRIJVING', columns.description.x, currentY);
    doc.text('AANTAL', columns.quantity.x, currentY);
    doc.text('PRIJS', columns.price.x, currentY);
    doc.text('TOTAAL', columns.total.x, currentY);

    currentY += 5;
    drawDottedLine(doc, 20, currentY, 190, currentY);
    currentY += 10;

    // Table items
    doc.setFont(fonts.body, 'normal');
    doc.setTextColor(COLORS.secondary);

    orderData.items.forEach(item => {
        doc.text(item.title, columns.description.x, currentY);
        doc.text(item.quantity.toString(), columns.quantity.x, currentY);
        doc.text(`€${item.price.toFixed(2)}`, columns.price.x, currentY);
        doc.text(`€${(item.quantity * item.price).toFixed(2)}`, columns.total.x, currentY);

        currentY += 8;
        drawDottedLine(doc, 20, currentY - 3, 190, currentY - 3);
    });

    // Totals section
    currentY += 10;
    const totalExclVAT = orderData.total / 1.21;

    // Right-aligned totals
    doc.setFont(fonts.body, 'normal');
    doc.text('Subtotaal excl. BTW:', 140, currentY);
    doc.text(`€${totalExclVAT.toFixed(2)}`, 175, currentY, { align: 'right' });
    currentY += 8;

    doc.text('BTW 21%:', 140, currentY);
    doc.text(`€${(orderData.total - totalExclVAT).toFixed(2)}`, 175, currentY, { align: 'right' });
    currentY += 8;

    doc.setFont(fonts.heading, 'bold');
    doc.setTextColor(COLORS.accent);
    doc.text('TOTAAL incl. BTW:', 140, currentY);
    doc.text(`€${orderData.total.toFixed(2)}`, 175, currentY, { align: 'right' });

    // Footer with dotted line above
    const footerY = 270;
    drawDottedLine(doc, 20, footerY - 10, 190, footerY - 10);

    doc.setFont(fonts.body, 'normal');
    doc.setFontSize(8);
    doc.setTextColor(COLORS.secondary);
    doc.text([
        "Nacho's Antwerp",
        'www.nachosantwerp.be',
        'Betalingsvoorwaarden: Direct bij bestelling'
    ], 20, footerY);

    // Return as Buffer
    return Buffer.from(doc.output('arraybuffer'));
} 