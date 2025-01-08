import { Resend } from 'resend'
import { render } from '@react-email/render'
import { ContactNotificationEmail } from '@/components/emails/contact/contact-notification'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
    try {
        const { contact } = await request.json()

        const emailSubject = process.env.NODE_ENV === 'production'
            ? 'Nieuw contactbericht via Nacho\'s Antwerp'
            : '[TEST] Nieuw contactbericht via Nacho\'s Antwerp'

        const fromEmail = process.env.NODE_ENV === 'production'
            ? 'contact@nachosantwerp.be'
            : 'dev@nachosantwerp.be'

        const emailHtml = await render(ContactNotificationEmail({ contact }))

        const data = await resend.emails.send({
            from: `Nacho's Antwerp <${fromEmail}>`,
            to: 'info@nachosantwerp.be',
            subject: emailSubject,
            html: emailHtml
        })

        return Response.json(data)
    } catch (error) {
        console.error('Failed to send contact notification email:', error)
        return Response.json({ error })
    }
} 