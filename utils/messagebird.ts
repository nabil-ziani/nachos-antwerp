import messagebird from 'messagebird';

// Initialize the MessageBird client with your API key
const messageBirdClient = messagebird(process.env.MESSAGEBIRD_API_KEY || '');

export const sendOrderNotification = async (orderDetails: {
    orderId: string;
    customerName: string;
    deliveryMethod: string;
    totalAmount: number;
}) => {
    const { orderId, customerName, deliveryMethod, totalAmount } = orderDetails;

    // Format the message
    const message = `Nieuwe bestelling #${orderId.substring(0, 8)}!\n` +
        `Klant: ${customerName}\n` +
        `Type: ${deliveryMethod === 'delivery' ? 'Bezorging' : 'Afhalen'}\n` +
        `Totaal: €${totalAmount.toFixed(2)}`;

    try {
        await messageBirdClient.messages.create({
            originator: process.env.MESSAGEBIRD_ORIGINATOR || 'Nachos',
            recipients: [process.env.RESTAURANT_PHONE_NUMBER || ''],
            body: message
        });
        console.log('SMS notification sent successfully');
    } catch (error) {
        console.error('Failed to send SMS notification:', error);
    }
}; 