import { Resend } from 'resend'
import { render } from '@react-email/render'
import { ContactNotificationEmail } from '@/components/emails/contact/contact-notification'
import { prisma } from '@/lib/prisma'
import { contactSchema } from '@/lib/schemas/contact-schema'
import { Prisma } from '@prisma/client'
import { ZodError } from 'zod'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
    try {
        const data = await request.json()
        const validatedData = contactSchema.parse(data)

        // First save to database
        const contact = await prisma.contactMessage.create({
            data: validatedData
        })

        // Then send email notification
        const emailSubject = process.env.NODE_ENV === 'production'
            ? 'Nieuw contactbericht via Nacho\'s Antwerp'
            : '[TEST] Nieuw contactbericht via Nacho\'s Antwerp'

        const fromEmail = process.env.NODE_ENV === 'production'
            ? 'contact@nachosantwerp.be'
            : 'dev@nachosantwerp.be'

        const emailHtml = await render(ContactNotificationEmail({ contact }))

        const emailData = await resend.emails.send({
            from: `Nacho's Antwerp <${fromEmail}>`,
            to: 'info@nachosantwerp.be',
            subject: emailSubject,
            html: emailHtml
        })

        return Response.json({ contact, email: emailData })
    } catch (error) {
        console.error('Failed to process contact message:', error)

        if (error instanceof ZodError) {
            return Response.json(
                { error: 'Validatie error', details: error.errors },
                { status: 400 }
            )
        }

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            return Response.json(
                { error: 'Database error', code: error.code },
                { status: 500 }
            )
        }

        return Response.json(
            { error: 'Er is een onverwachte fout opgetreden' },
            { status: 500 }
        )
    }
} 