import { Resend } from 'resend';
import { render } from '@react-email/render';
import { OrderConfirmationEmail } from '@/components/emails/order/order-confirmation';
import { generateInvoice } from '@/utils/generate-invoice';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const { order } = await request.json();

        const emailSubject = process.env.NODE_ENV === 'production'
            ? 'Bedankt voor je bestelling bij Nacho\'s Antwerp'
            : '[TEST] Bedankt voor je bestelling bij Nacho\'s Antwerp';

        const fromEmail = process.env.NODE_ENV === 'production'
            ? 'bestellingen@nachosantwerp.be'
            : 'dev@nachosantwerp.be';

        const emailHtml = await render(OrderConfirmationEmail({ order }));

        let attachments = [];

        // Generate invoice if company is present
        if (order.customer.company) {
            try {
                const invoicePdf = await generateInvoice({
                    orderId: order.id,
                    company: {
                        name: order.customer.company,
                        vatNumber: order.customer.vatNumber
                    },
                    items: order.items,
                    total: order.total,
                    date: new Date()
                });

                attachments.push({
                    filename: `factuur-${order.id}.pdf`,
                    content: invoicePdf,
                    contentType: 'application/pdf'
                });
            } catch (error) {
                console.error('Failed to generate invoice:', error);
                // Continue without attachment if invoice generation fails
            }
        }

        const data = await resend.emails.send({
            from: `Nacho's Antwerp <${fromEmail}>`,
            to: order.customer.email,
            subject: emailSubject,
            html: emailHtml,
            attachments
        });

        return Response.json(data);
    } catch (error) {
        console.error('Failed to send order confirmation email:', error);
        return Response.json({ error });
    }
} 