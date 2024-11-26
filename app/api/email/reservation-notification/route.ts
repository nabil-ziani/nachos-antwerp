import { Resend } from 'resend';
import { render } from '@react-email/render';
import { ReservationNotificationEmail } from '@/components/emails/reservation-notification';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const { reservation } = await request.json();

        const emailSubject = process.env.NODE_ENV === 'production'
            ? 'Nieuwe Reservering bij Nacho\'s Antwerp'
            : '[TEST] Nieuwe Reservering bij Nacho\'s Antwerp';

        const fromEmail = process.env.NODE_ENV === 'production'
            ? 'reserveringen@nachosantwerp.be'
            : 'dev@nachosantwerp.be';

        const emailHtml = await render(ReservationNotificationEmail({ reservation }));

        const data = await resend.emails.send({
            from: `Nacho's Antwerp <${fromEmail}>`,
            to: 'info@nachosantwerp.be',
            subject: emailSubject,
            html: emailHtml
        });

        return Response.json(data);
    } catch (error) {
        console.error('Failed to send reservation notification email:', error);
        return Response.json({ error });
    }
}