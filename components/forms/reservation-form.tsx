"use client";

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { useRestaurant } from '@/contexts/restaurant-context'
import { FormWrapper } from './layout/form-wrapper'
import { FormInput } from './layout/form-input'
import { reservationSchema, ReservationFormValues, defaultValues } from '@/lib/schemas/reservation-schema'

const ReservationForm = () => {
    const { selectedRestaurant } = useRestaurant()

    const form = useForm<ReservationFormValues>({
        defaultValues,
        resolver: zodResolver(reservationSchema),
        mode: 'onBlur'
    })

    const onSubmit = async (values: ReservationFormValues) => {
        try {
            // 1. Reservering opslaan in database
            await toast.promise(
                fetch('/api/reservation', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(values)
                }).then(async (response) => {
                    if (!response.ok) {
                        const error = await response.json()
                        throw new Error(error.message)
                    }
                }),
                {
                    loading: 'Reservering opslaan...',
                    success: 'Je reservering is succesvol ontvangen!',
                    error: 'Er ging iets mis bij het opslaan van je reservering.'
                }
            )

            // 2. Emails versturen
            Promise.allSettled([
                // Notificatie naar eigenaar
                fetch('/api/email/reservation-notification', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ reservation: values })
                }),
                // Bevestiging naar klant
                fetch('/api/email/reservation-confirmation', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        reservation: values,
                        restaurant: selectedRestaurant
                    })
                })
            ]).catch(error => {
                console.error('Error sending emails:', error)
            })

            // 3. Form resetten
            form.reset()
        } catch (error) {
            console.error('Error handling reservation:', error)
            if (error instanceof Error) {
                toast.error(error.message)
            } else {
                toast.error('Er ging iets mis tijdens het verwerken van je reservering')
            }
        }
    }

    return (
        <FormWrapper form={form} onSubmit={onSubmit} className="tst-reservation-form">
            <div className="row">
                <div className="col-12">
                    <FormInput
                        name="customerName"
                        type="text"
                        placeholder="Naam"
                        required
                    />
                </div>
                <div className="col-12 col-md-4">
                    <FormInput
                        name="customerEmail"
                        type="email"
                        placeholder="Email"
                        required
                    />
                </div>
                <div className="col-6 col-md-3">
                    <FormInput
                        name="numberOfPeople"
                        type="select"
                        placeholder="Aantal Personen"
                        required
                        options={[
                            { value: "", label: "Aantal Personen" },
                            { value: "1", label: "1" },
                            { value: "2", label: "2" },
                            { value: "3", label: "3" },
                            { value: "4", label: "4" },
                            { value: "5", label: "5" },
                            { value: "6", label: "6 of meer" }
                        ]}
                    />
                </div>
                <div className="col-6 col-md-3">
                    <FormInput
                        name="date"
                        type="date"
                        placeholder="Datum"
                        required
                    />
                </div>
                <div className="col-6 col-md-3">
                    <FormInput
                        name="time"
                        type="select"
                        placeholder="Tijdstip"
                        required
                        options={[
                            { value: "", label: "Tijdstip" },
                            { value: "17:00", label: "17:00" },
                            { value: "17:30", label: "17:30" },
                            { value: "18:00", label: "18:00" },
                            { value: "18:30", label: "18:30" },
                            { value: "19:00", label: "19:00" },
                            { value: "19:30", label: "19:30" },
                            { value: "20:00", label: "20:00" },
                            { value: "20:30", label: "20:30" },
                            { value: "21:00", label: "21:00" },
                            { value: "21:30", label: "21:30" }
                        ]}
                    />
                </div>
                <div className="col-6 col-md-3">
                    <FormInput
                        name="phoneNumber"
                        type="tel"
                        placeholder="Telefoonnummer"
                        required
                    />
                </div>
                <div className="col-12">
                    <FormInput
                        name="message"
                        type="textarea"
                        placeholder="Optioneel bericht"
                        rows={4}
                    />
                </div>
            </div>
            <div className="col-12">
                <button
                    type="submit"
                    className="tst-btn tst-btn-md"
                    disabled={form.formState.isSubmitting}
                >
                    {form.formState.isSubmitting ? 'Laden...' : 'Reserveer nu'}
                    {form.formState.isSubmitting && <div className="spinner" />}
                </button>
            </div>
        </FormWrapper>
    )
}

export default ReservationForm