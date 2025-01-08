"use client";

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { FormWrapper } from './layout/form-wrapper'
import { FormInput } from './layout/form-input'
import { contactSchema, ContactFormValues, defaultValues } from '@/lib/schemas/contact-schema'
import { createClient } from '@/utils/supabase/client'

const ContactForm = () => {
    const form = useForm<ContactFormValues>({
        defaultValues,
        resolver: zodResolver(contactSchema),
        mode: 'onBlur'
    })

    const onSubmit = async (values: ContactFormValues) => {
        try {
            // 1. Bericht opslaan in database
            await toast.promise(
                (async () => {
                    const { error } = await createClient()
                        .from('contact_messages')
                        .insert([values])
                    if (error) throw error
                })(),
                {
                    loading: 'Bericht opslaan...',
                    success: 'Je bericht is succesvol verzonden!',
                    error: 'Er ging iets mis bij het opslaan van je bericht.'
                }
            )

            // 2. Emails versturen (zonder blocking)
            Promise.allSettled([
                // Notificatie naar eigenaar
                fetch('/api/email/contact-notification', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ contact: values })
                }),
                // Bevestiging naar klant
                fetch('/api/email/contact-confirmation', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ contact: values })
                })
            ]).catch(error => {
                console.error('Error sending emails:', error)
                // Email fouten negeren, gebruiker heeft al succesbericht
            })

            // 3. Form resetten
            form.reset()
        } catch (error) {
            console.error('Error handling contact form:', error)
            if (error instanceof Error) {
                toast.error(error.message)
            } else {
                toast.error('Er ging iets mis bij het versturen van je bericht')
            }
        }
    }

    return (
        <FormWrapper form={form} onSubmit={onSubmit} className="tst-contact-form">
            <div className="row">
                <div className="col-lg-6">
                    <FormInput
                        name="first_name"
                        type="text"
                        placeholder="Voornaam"
                        required
                    />
                </div>
                <div className="col-lg-6">
                    <FormInput
                        name="last_name"
                        type="text"
                        placeholder="Familienaam"
                        required
                    />
                </div>
                <div className="col-lg-6">
                    <FormInput
                        name="phone"
                        type="tel"
                        placeholder="Telefoon"
                        required
                    />
                </div>
                <div className="col-lg-6">
                    <FormInput
                        name="email"
                        type="email"
                        placeholder="Email"
                        required
                    />
                </div>
                <div className="col-lg-12">
                    <FormInput
                        name="message"
                        type="textarea"
                        placeholder="Bericht"
                        required
                        rows={4}
                    />
                </div>
            </div>
            <button
                className="tst-btn"
                type="submit"
                disabled={form.formState.isSubmitting}
            >
                {form.formState.isSubmitting ? 'Versturen...' : 'Stuur Bericht'}
            </button>
        </FormWrapper>
    )
}

export default ContactForm