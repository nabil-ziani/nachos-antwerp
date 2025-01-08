import { Resend } from 'resend'
import { render } from '@react-email/render'
import { ReservationConfirmationEmail } from '@/components/emails/reservation/reservation-confirmation'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
    try {
        const { reservation } = await request.json()

        const emailSubject = process.env.NODE_ENV === 'production'
            ? 'Je Reservering bij Nacho\'s Antwerp is Bevestigd'
            : '[TEST] Je Reservering bij Nacho\'s Antwerp is Bevestigd'

        const fromEmail = process.env.NODE_ENV === 'production'
            ? 'reserveringen@nachosantwerp.be'
            : 'dev@nachosantwerp.be'

        const emailHtml = await render(ReservationConfirmationEmail({ reservation }))

        const data = await resend.emails.send({
            from: `Nacho's Antwerp <${fromEmail}>`,
            to: reservation.email,
            subject: emailSubject,
            html: emailHtml
        })

        return Response.json(data)
    } catch (error) {
        console.error('Failed to send reservation confirmation email:', error)
        return Response.json({ error })
    }
} 