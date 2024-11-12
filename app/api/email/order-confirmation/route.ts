import { Resend } from 'resend';
import { OrderConfirmationEmail } from '@/components/emails/order-confirmation';
import { render } from '@react-email/render';
import { generateInvoice } from '@/utils/generate-invoice';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const { order, customer, restaurant } = await request.json();

        const emailSubject = process.env.NODE_ENV === 'production'
            ? 'Bedankt voor je bestelling bij Nacho\'s Antwerp'
            : '[TEST] Bedankt voor je bestelling bij Nacho\'s Antwerp';

        const fromEmail = process.env.NODE_ENV === 'production'
            ? 'bestellingen@nachosantwerp.be'
            : 'dev@nachosantwerp.be';

        const emailHtml = await render(OrderConfirmationEmail({ order, customer, restaurant }));

        let attachments = [];

        // Generate invoice if company is present
        if (customer.company) {
            try {
                const invoicePdf = await generateInvoice({
                    orderId: order.id,
                    company: {
                        name: customer.company,
                        vatNumber: customer.vatNumber
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
            to: customer.email,
            subject: emailSubject,
            html: emailHtml,
            attachments
        });

        return Response.json(data);
    } catch (error) {
        return Response.json({ error });
    }
} 