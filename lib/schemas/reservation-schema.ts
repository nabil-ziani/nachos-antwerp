import { z } from 'zod'

export const reservationSchema = z.object({
    firstname: z.string().min(1, 'Voornaam is verplicht'),
    lastname: z.string().min(1, 'Familienaam is verplicht'),
    email: z.string().min(1, 'Email is verplicht').email('Ongeldige mailadres'),
    phone: z.string().min(1, 'Telefoonnummer is verplicht'),
    date: z.string().min(1, 'Datum is verplicht'),
    time: z.string().min(1, 'Tijdstip is verplicht'),
    person: z.string().min(1, 'Aantal personen is verplicht'),
    message: z.string().optional(),
})

export type ReservationFormValues = z.infer<typeof reservationSchema>

export const defaultValues: ReservationFormValues = {
    email: '',
    firstname: '',
    lastname: '',
    time: '',
    date: '',
    person: '',
    message: '',
    phone: '',
} 