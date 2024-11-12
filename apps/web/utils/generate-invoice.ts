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
    const pageHeight = doc.internal.pageSize.height;
    const pageMargin = 20;
    const contentWidth = pageWidth - (pageMargin * 2);
    const footerHeight = 20;
    const lineHeight = 8;

    // Helper function to check if we need a new page
    function checkNewPage(currentY: number, requiredSpace: number) {
        if (currentY + requiredSpace > pageHeight - footerHeight - pageMargin) {
            doc.addPage();
            return pageMargin; // Reset Y position to top of new page
        }
        return currentY;
    }

    // Add logo (centered)
    const logoWidth = 30;
    const logoX = pageWidth / 2 - (logoWidth / 2);
    try {
        doc.addImage(getLogoAsBase64(), 'PNG', logoX, 20, logoWidth, 30);
    } catch (error) {
        console.error('Failed to add logo:', error);
    }

    // Header text (centered)
    doc.setFont(fonts.heading, 'bold');
    doc.setFontSize(22);
    doc.setTextColor(COLORS.primary);
    doc.text("Nacho's Antwerp", pageWidth / 2, 60, { align: 'center' });

    // Company info (centered)
    doc.setFont(fonts.body, 'normal');
    doc.setFontSize(10);
    doc.setTextColor(COLORS.secondary);
    const companyInfo = [
        'BTW: BE1001145710',
        'Diksmuidelaan 170',
        '2600 Berchem',
        'Tel: +32 467 07 18 74',
        'info@nachosantwerp.be'
    ];
    doc.text(companyInfo, pageWidth / 2, 70, { align: 'center' });

    // Invoice details (right-aligned)
    doc.setFont(fonts.body, 'normal');
    doc.setFontSize(10);
    doc.setTextColor(COLORS.secondary);
    doc.text([
        `Bestellingnummer: ${orderData.orderId}`,
        `Datum: ${orderData.date.toLocaleDateString('nl-BE')}`,
    ], pageWidth - pageMargin, 30, { align: 'right' });

    // Dotted line separator
    drawDottedLine(doc, pageMargin, 100, pageWidth - pageMargin, 90);

    // Client details
    doc.setFont(fonts.heading, 'bold');
    doc.setFontSize(12);
    doc.setTextColor(COLORS.primary);
    doc.text('FACTUUR VOOR', pageMargin, 115);

    doc.setFont(fonts.body, 'normal');
    doc.setFontSize(10);
    doc.text([
        orderData.company.name,
        orderData.company.vatNumber ? `BTW: ${orderData.company.vatNumber}` : '',
    ], pageMargin, 130);

    // Items table
    const tableTop = 150;
    let currentY = tableTop;

    // Table layout using contentWidth
    const columns = {
        description: { x: pageMargin, width: contentWidth * 0.5 },    // 50% of content width
        quantity: { x: pageMargin + (contentWidth * 0.5), width: contentWidth * 0.15 },  // 15%
        price: { x: pageMargin + (contentWidth * 0.65), width: contentWidth * 0.15 },    // 15%
        total: { x: pageMargin + (contentWidth * 0.8), width: contentWidth * 0.2 }       // 20%
    };

    // Table header
    doc.setFont(fonts.heading, 'bold');
    doc.setFontSize(10);
    doc.setTextColor(COLORS.primary);

    currentY = checkNewPage(currentY, 20); // Check if header fits

    doc.text('OMSCHRIJVING', columns.description.x, currentY);
    doc.text('AANTAL', columns.quantity.x, currentY);
    doc.text('PRIJS', columns.price.x, currentY);
    doc.text('TOTAAL', columns.total.x + columns.total.width, currentY, { align: 'right' });

    currentY += lineHeight;
    drawDottedLine(doc, pageMargin, currentY, pageMargin + contentWidth, currentY);
    currentY += lineHeight;

    // Table items with page break checking
    orderData.items.forEach((item, index) => {
        // Check if we need space for this item plus a bit extra for spacing
        currentY = checkNewPage(currentY, lineHeight + 5);

        // If this is first item on new page and not the first item overall,
        // repeat the header
        doc.setTextColor(COLORS.primary);
        if (currentY === pageMargin && index > 0) {
            doc.setFont(fonts.heading, 'bold');
            doc.text('OMSCHRIJVING', columns.description.x, currentY);
            doc.text('AANTAL', columns.quantity.x, currentY);
            doc.text('PRIJS', columns.price.x, currentY);
            doc.text('TOTAAL', columns.total.x, currentY, { align: 'right' });
            currentY += lineHeight;
            drawDottedLine(doc, pageMargin, currentY, pageMargin + contentWidth, currentY);
            currentY += lineHeight;
        }

        doc.setFont(fonts.body, 'normal');
        doc.setTextColor(COLORS.secondary);

        // Handle long descriptions by wrapping text
        const splitTitle = doc.splitTextToSize(item.title, columns.description.width);
        const titleHeight = splitTitle.length * lineHeight;

        // Check if wrapped text needs a new page
        currentY = checkNewPage(currentY, titleHeight);

        doc.text(splitTitle, columns.description.x, currentY);
        doc.text(item.quantity.toString(), columns.quantity.x, currentY);
        doc.text(`€ ${item.price.toFixed(2)}`, columns.price.x, currentY);
        doc.text(
            `€ ${(item.quantity * item.price).toFixed(2)}`,
            columns.total.x + columns.total.width,
            currentY,
            { align: 'right' }
        );

        currentY += titleHeight + 2; // Add some padding after each item
    });

    // Totals section
    const totalsHeight = 50; // Approximate height needed for totals section
    currentY = checkNewPage(currentY, totalsHeight);

    // Totals section (right-aligned with proper spacing)
    drawDottedLine(doc, pageMargin, currentY, pageWidth - pageMargin, currentY);
    currentY += lineHeight;

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

    doc.setFont(fonts.body, 'bold');
    doc.setTextColor(COLORS.primary);

    drawDottedLine(doc, pageMargin, currentY, pageWidth - pageMargin, currentY);
    currentY += lineHeight;

    doc.text('TOTAAL incl. BTW:', totalsX, currentY);
    doc.text(`€ ${orderData.total.toFixed(2)}`, valuesX, currentY, { align: 'right' });

    // Footer - always on the current page
    const footerY = pageHeight - footerHeight;
    drawDottedLine(doc, pageMargin, footerY - 10, pageMargin + contentWidth, footerY - 10);

    doc.setFont(fonts.body, 'normal');
    doc.setFontSize(8);
    doc.setTextColor(COLORS.secondary);
    doc.text([
        "Nacho's Antwerp",
        'www.nachosantwerp.be',
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