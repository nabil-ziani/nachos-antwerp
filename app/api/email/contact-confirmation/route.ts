import { Resend } from 'resend'
import { render } from '@react-email/render'
import { ContactConfirmationEmail } from '@/components/emails/contact/contact-confirmation'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
    try {
        const { contact } = await request.json()

        const emailSubject = process.env.NODE_ENV === 'production'
            ? 'Bedankt voor je bericht aan Nacho\'s Antwerp'
            : '[TEST] Bedankt voor je bericht aan Nacho\'s Antwerp'

        const fromEmail = process.env.NODE_ENV === 'production'
            ? 'contact@nachosantwerp.be'
            : 'dev@nachosantwerp.be'

        const emailHtml = await render(ContactConfirmationEmail({ contact }))

        const data = await resend.emails.send({
            from: `Nacho's Antwerp <${fromEmail}>`,
            to: contact.email,
            subject: emailSubject,
            html: emailHtml
        })

        return Response.json(data)
    } catch (error) {
        console.error('Failed to send contact confirmation email:', error)
        return Response.json({ error })
    }
} 