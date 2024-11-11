import { jsPDF } from 'jspdf';
import { readFileSync } from 'fs';
import { join } from 'path';

export function registerFonts(doc: jsPDF) {
    try {
        // Read font files
        const playfairRegular = readFileSync(
            join(process.cwd(), 'public', 'fonts', 'PlayfairDisplay-Regular.ttf')
        );
        const playfairBold = readFileSync(
            join(process.cwd(), 'public', 'fonts', 'PlayfairDisplay-Bold.ttf')
        );
        const josefinRegular = readFileSync(
            join(process.cwd(), 'public', 'fonts', 'JosefinSans-Regular.ttf')
        );
        const josefinBold = readFileSync(
            join(process.cwd(), 'public', 'fonts', 'JosefinSans-Bold.ttf')
        );

        // Register fonts with base64 encoding
        doc.addFileToVFS('PlayfairDisplay-Regular.ttf', playfairRegular.toString('base64'));
        doc.addFileToVFS('PlayfairDisplay-Bold.ttf', playfairBold.toString('base64'));
        doc.addFileToVFS('JosefinSans-Regular.ttf', josefinRegular.toString('base64'));
        doc.addFileToVFS('JosefinSans-Bold.ttf', josefinBold.toString('base64'));

        // Add fonts
        doc.addFont('PlayfairDisplay-Regular.ttf', 'Playfair Display', 'normal');
        doc.addFont('PlayfairDisplay-Bold.ttf', 'Playfair Display', 'bold');
        doc.addFont('JosefinSans-Regular.ttf', 'Josefin Sans', 'normal');
        doc.addFont('JosefinSans-Bold.ttf', 'Josefin Sans', 'bold');

        return true;
    } catch (error) {
        console.error('Failed to register fonts:', error);
        return false;
    }
} 