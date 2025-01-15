import { z } from 'zod'

export const reservationSchema = z.object({
    firstName: z.string().min(2, 'Voornaam is verplicht'),
    lastName: z.string().min(2, 'Familienaam is verplicht'),
    customerEmail: z.string().email('Ongeldig emailadres'),
    phoneNumber: z.string().min(10, 'Ongeldig telefoonnummer'),
    date: z.string().min(1, 'Datum is verplicht'),
    time: z.string().min(1, 'Tijdstip is verplicht'),
    numberOfPeople: z.string().min(1, 'Aantal personen is verplicht'),
    message: z.string().optional()
})

export type ReservationFormValues = z.infer<typeof reservationSchema>

export const defaultValues: ReservationFormValues = {
    firstName: '',
    lastName: '',
    customerEmail: '',
    phoneNumber: '',
    date: '',
    time: '',
    numberOfPeople: '',
    message: ''
} 