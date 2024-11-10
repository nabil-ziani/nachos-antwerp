import { Resend } from 'resend';
import { OrderConfirmationEmail } from '@/components/emails/order-confirmation';
import { render } from '@react-email/render';

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

        const data = await resend.emails.send({
            from: `Nacho's Antwerp <${fromEmail}>`,
            to: customer.email,
            subject: emailSubject,
            html: emailHtml,
        });

        return Response.json(data);
    } catch (error) {
        return Response.json({ error });
    }
} 