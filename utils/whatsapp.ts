export const sendWhatsAppNotification = async (orderDetails: {
    orderId: string;
    customerName: string;
    customerPhone: string;
    deliveryMethod: string;
    totalAmount: number;
    items: Array<{
        title: string;
        quantity: number;
        price: number;
        selectedVariations?: any;
    }>;
}) => {
    const { orderId, customerName, customerPhone, deliveryMethod, totalAmount, items } = orderDetails;

    // Format items with variations
    const formattedItems = items.map(item => {
        let itemText = `${item.quantity}x ${item.title}`;

        if (item.selectedVariations) {
            const variations = Object.entries(item.selectedVariations)
                .map(([_, variations]: [string, any]) =>
                    variations.map((v: any) =>
                        `  • ${v.name}${v.price > 0 ? ` (+€${v.price.toFixed(2)})` : ''}${v.quantity > 1 ? ` x${v.quantity}` : ''}`
                    ).join('\n')
                ).join('\n');
            if (variations) {
                itemText += '\n' + variations;
            }
        }

        return itemText;
    }).join('\n');

    // Format the message
    const message = `🔔 *Nieuwe bestelling #${orderId.substring(0, 8)}!*\n\n` +
        `👤 Klant: ${customerName}\n` +
        `📱 Tel: ${customerPhone}\n` +
        `🛵 Type: ${deliveryMethod === 'delivery' ? 'Bezorging' : 'Afhalen'}\n` +
        `💰 Totaal: €${totalAmount.toFixed(2)}\n\n` +
        `🛍️ *Bestelde items:*\n${formattedItems}`;

    try {
        const response = await fetch('https://graph.facebook.com/v17.0/' + process.env.WHATSAPP_PHONE_NUMBER_ID + '/messages', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messaging_product: "whatsapp",
                to: process.env.RESTAURANT_WHATSAPP_NUMBER,
                type: "text",
                text: {
                    body: message
                }
            })
        });

        if (!response.ok) {
            throw new Error('Failed to send WhatsApp message');
        }

        console.log('WhatsApp notification sent successfully');
    } catch (error) {
        console.error('Failed to send WhatsApp notification:', error);
    }
}; 