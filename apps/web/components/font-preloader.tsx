import { useEffect } from 'react';

export function FontPreloader() {
    useEffect(() => {
        const fonts = [
            '/fonts/PlayfairDisplay-Regular.ttf',
            '/fonts/PlayfairDisplay-Bold.ttf',
            '/fonts/JosefinSans-Regular.ttf',
            '/fonts/JosefinSans-Bold.ttf'
        ];

        fonts.forEach(font => {
            const link = document.createElement('link');
            link.href = font;
            link.rel = 'preload';
            link.as = 'font';
            link.type = 'font/ttf';
            link.crossOrigin = 'anonymous';
            document.head.appendChild(link);
        });
    }, []);

    return null;
} 