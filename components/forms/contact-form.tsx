"use client";

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import AppData from "@/data/app.json"
import { FormWrapper } from './layout/form-wrapper'
import { FormInput } from './layout/form-input'
import { contactSchema, ContactFormValues, defaultValues } from '@/lib/schemas/contact-schema'

const ContactForm = () => {
    const form = useForm<ContactFormValues>({
        defaultValues,
        resolver: zodResolver(contactSchema),
        mode: 'onBlur'
    })

    const onSubmit = async (values: ContactFormValues) => {
        const data = new FormData()

        data.append('first_name', values.first_name)
        data.append('last_name', values.last_name)
        data.append('email', values.email)
        data.append('phone', values.phone)
        data.append('message', values.message)

        try {
            const response = await toast.promise(
                fetch(AppData.settings.formspreeURL, {
                    method: 'POST',
                    body: data,
                    headers: {
                        'Accept': 'application/json'
                    }
                }),
                {
                    loading: 'Bericht versturen...',
                    success: 'Bedankt voor je bericht!',
                    error: 'Er ging iets mis. Probeer het opnieuw.'
                }
            )

            if (response.ok) {
                form.reset()
            } else {
                const responseData = await response.json()
                if (Object.hasOwn(responseData, 'errors')) {
                    toast.error(responseData["errors"].map((error: any) => error["message"]).join(", "))
                }
            }
        } catch (error) {
            console.error(error)
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