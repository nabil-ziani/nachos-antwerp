import { Resend } from 'resend';
import { OrderConfirmationEmail } from '@/components/emails/order-confirmation';
import { render } from '@react-email/render';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const { order, customer, restaurant } = await request.json();

        const emailHtml = await render(OrderConfirmationEmail({ order, customer, restaurant }));

        const data = await resend.emails.send({
            from: 'Nacho\'s Antwerp <bestellingen@nachosantwerp.be>',
            to: customer.email,
            subject: 'Bedankt voor je bestelling bij Nacho\'s Antwerp',
            html: emailHtml,
        });

        return Response.json(data);
    } catch (error) {
        return Response.json({ error });
    }
} 