import fs from 'fs';
import path from 'path';

export function getLogoAsBase64(): string {
    try {
        const logoPath = path.join(process.cwd(), 'public', 'img', 'logo-sm.png');
        const logoBuffer = fs.readFileSync(logoPath);
        return `data:image/png;base64,${logoBuffer.toString('base64')}`;
    } catch (error) {
        console.error('Failed to load logo:', error);
        return '';
    }
} 