import { jsPDF } from 'jspdf';
import { getLogoAsBase64 } from './image-to-base64';

// Constants for styling
const COLORS = {
    primary: '#1a2f33',
    secondary: '#64748b',
    accent: '#f39c12',
    border: '#e2e8f0'
};

const FONTS = {
    heading: 'Playfair Display',
    body: 'Josefin Sans'
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
    // Create PDF with slightly larger format for better layout
    const doc = new jsPDF({
        format: 'a4',
        unit: 'mm'
    });

    // Register fonts
    doc.addFont('/fonts/PlayfairDisplay-Regular.ttf', 'Playfair Display', 'normal');
    doc.addFont('/fonts/PlayfairDisplay-Bold.ttf', 'Playfair Display', 'bold');
    doc.addFont('/fonts/JosefinSans-Regular.ttf', 'Josefin Sans', 'normal');
    doc.addFont('/fonts/JosefinSans-Bold.ttf', 'Josefin Sans', 'bold');

    // Set default font
    doc.setFont('Josefin Sans', 'normal');

    // Add logo
    const logoBase64 = getLogoAsBase64();
    if (logoBase64) {
        try {
            doc.addImage(logoBase64, 'PNG', 20, 20, 40, 40);
        } catch (error) {
            console.error('Failed to add logo:', error);
        }
    }

    // Header section
    doc.setFont('Playfair Display', 'bold');
    doc.setFontSize(24);
    doc.setTextColor(COLORS.primary);
    doc.text("Nacho's Antwerp", 70, 35);

    // Company info
    doc.setFont('Josefin Sans', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(COLORS.secondary);
    doc.text([
        'BTW: BE0123456789',
        'Diksmuidelaan 170',
        '2600 Berchem',
        'Tel: +32 467 07 18 74',
        'bestellingen@nachosantwerp.be'
    ], 70, 45);

    // Invoice details box
    doc.setDrawColor(COLORS.border);
    doc.setFillColor(247, 248, 250); // Light gray background
    doc.roundedRect(140, 20, 50, 40, 3, 3, 'FD');

    doc.setFont('Playfair Display', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(COLORS.accent);
    doc.text('FACTUUR', 145, 30);

    doc.setFont('Josefin Sans', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(COLORS.secondary);
    doc.text([
        `Nummer: ${orderData.orderId}`,
        `Datum: ${orderData.date.toLocaleDateString('nl-BE')}`,
    ], 145, 38);

    // Client details
    doc.setFillColor(247, 248, 250);
    doc.roundedRect(20, 70, 170, 35, 3, 3, 'FD');

    doc.setFont('Playfair Display', 'bold');
    doc.setFontSize(12);
    doc.text('FACTUUR VOOR', 25, 80);

    doc.setFont('Josefin Sans', 'normal');
    doc.setFontSize(10);
    doc.text([
        orderData.company.name,
        orderData.company.vatNumber ? `BTW: ${orderData.company.vatNumber}` : '',
    ], 25, 88);

    // Items table
    const tableTop = 120;
    let currentY = tableTop;

    // Table header
    doc.setFillColor(247, 248, 250);
    doc.rect(20, currentY, 170, 10, 'F');

    doc.setFont('Playfair Display', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(COLORS.primary);
    doc.text('OMSCHRIJVING', 25, currentY + 7);
    doc.text('AANTAL', 100, currentY + 7);
    doc.text('PRIJS', 130, currentY + 7);
    doc.text('TOTAAL', 160, currentY + 7);

    currentY += 15;

    // Table items
    doc.setFont('Josefin Sans', 'normal');
    doc.setTextColor(COLORS.secondary);

    orderData.items.forEach(item => {
        doc.text(item.title, 25, currentY);
        doc.text(item.quantity.toString(), 100, currentY);
        doc.text(`€${item.price.toFixed(2)}`, 130, currentY);
        doc.text(`€${(item.quantity * item.price).toFixed(2)}`, 160, currentY);
        currentY += 8;
    });

    // Totals section
    currentY += 10;
    doc.setDrawColor(COLORS.border);
    doc.line(20, currentY, 190, currentY);
    currentY += 10;

    const totalExclVAT = orderData.total / 1.21;

    // Totals alignment
    const totalsX = 130;
    const totalsValueX = 160;

    doc.setFont('Josefin Sans', 'normal');
    doc.text('Subtotaal excl. BTW:', totalsX, currentY);
    doc.text(`€${totalExclVAT.toFixed(2)}`, totalsValueX, currentY);
    currentY += 8;

    doc.text('BTW 21%:', totalsX, currentY);
    doc.text(`€${(orderData.total - totalExclVAT).toFixed(2)}`, totalsValueX, currentY);
    currentY += 8;

    doc.setFont('Playfair Display', 'bold');
    doc.setTextColor(COLORS.primary);
    doc.text('TOTAAL incl. BTW:', totalsX, currentY);
    doc.text(`€${orderData.total.toFixed(2)}`, totalsValueX, currentY);

    // Footer
    const footerY = 270;
    doc.setFont('Josefin Sans', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(COLORS.secondary);
    doc.text([
        "Nacho's Antwerp",
        'www.nachosantwerp.be',
        'Betalingsvoorwaarden: Direct bij bestelling'
    ], 20, footerY, { align: 'left' });

    // Return as Buffer
    return Buffer.from(doc.output('arraybuffer'));
} 