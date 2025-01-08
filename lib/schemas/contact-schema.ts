import { z } from 'zod'

export const contactSchema = z.object({
    first_name: z.string().min(1, 'Voornaam is verplicht'),
    last_name: z.string().min(1, 'Familienaam is verplicht'),
    email: z.string().min(1, 'Email is verplicht').email('Ongeldige mailadres'),
    phone: z.string().min(1, 'Telefoonnummer is verplicht'),
    message: z.string().min(1, 'Bericht is verplicht'),
})

export type ContactFormValues = z.infer<typeof contactSchema>

export const defaultValues: ContactFormValues = {
    email: '',
    phone: '',
    first_name: '',
    last_name: '',
    message: ''
} 