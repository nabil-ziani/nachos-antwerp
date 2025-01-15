'use client'

import { UseFormReturn } from 'react-hook-form'
import { CheckoutFormValues } from '@/lib/schemas/checkout-schema'
import { FormInput } from '../layout/form-input'

interface DeliveryDetailsProps {
    form: UseFormReturn<CheckoutFormValues>
}

export const DeliveryDetails = ({ form }: DeliveryDetailsProps) => {
    const { watch } = form
    const company = watch('company')
    const deliveryMethod = watch('deliveryMethod')

    return (
        <>
            <div className="tst-mb-30">
                <h5>Factuurgegevens</h5>
            </div>
            <div className="row">
                <div className="col-lg-6">
                    <FormInput
                        name="firstName"
                        label="Voornaam"
                        required
                        placeholder="Voornaam"
                        autoComplete="given-name"
                    />
                </div>
                <div className="col-lg-6">
                    <FormInput
                        name="lastName"
                        label="Familienaam"
                        required
                        placeholder="Familienaam"
                        autoComplete="family-name"
                    />
                </div>
                <div className="col-lg-6">
                    <FormInput
                        name="email"
                        label="Email"
                        type="email"
                        required
                        placeholder="Email"
                        autoComplete="email"
                    />
                </div>
                <div className="col-lg-6">
                    <FormInput
                        name="tel"
                        label="Telefoon"
                        type="tel"
                        required
                        placeholder="04 XX XX XX XX"
                        autoComplete="tel"
                    />
                </div>
                <div className="col-lg-6">
                    <FormInput
                        name="company"
                        label="Bedrijfsnaam (optioneel)"
                        placeholder="Bedrijfsnaam"
                        autoComplete="organization"
                    />
                </div>
                {company && (
                    <div className="col-lg-6">
                        <FormInput
                            name="vatNumber"
                            label="BTW nummer"
                            placeholder="BE0123456789"
                        />
                    </div>
                )}
                <div className="col-lg-6">
                    <FormInput
                        name="postcode"
                        label="Postcode"
                        required={deliveryMethod === 'delivery'}
                        placeholder="2600"
                        autoComplete="postal-code"
                    />
                </div>
                <div className="col-lg-6">
                    <FormInput
                        name="city"
                        label="Gemeente"
                        required={deliveryMethod === 'delivery'}
                        placeholder="Berchem"
                        autoComplete="address-level2"
                    />
                </div>
                <div className="col-lg-6">
                    <FormInput
                        name="address"
                        label="Adres"
                        required={deliveryMethod === 'delivery'}
                        placeholder="Diksmuidelaan 170"
                        autoComplete="street-address"
                    />
                </div>
            </div>
        </>
    )
} 