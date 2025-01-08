"use client";

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/hooks/useCart'
import { useRestaurant } from '@/contexts/restaurant-context'
import { createClient } from '@/utils/supabase/client'
import { LocationConfirmation } from '@/components/location-confirmation'
import { DeliveryDetails } from './checkout/delivery-details'
import { PaymentMethods } from './checkout/payment-methods'
import { FormButtons } from './checkout/form-buttons'
import { LoadingSpinner } from "@/components/loading-spinner"
import { createOrderData } from '@/utils/order-utils'
import { FormWrapper } from './layout/form-wrapper'
import { toast } from 'react-hot-toast'
import { createCheckoutSchema, defaultValues, CheckoutFormValues } from '@/lib/schemas/checkout-schema'
import { findRestaurantByPostalCode } from '@/utils/location'
import { PostgrestResponse } from '@supabase/supabase-js'

const CheckoutForm = () => {
    const [isLoading, setIsLoading] = useState(true)
    const orderId = crypto.randomUUID()

    const router = useRouter()
    const { cartTotal: totalAmount, cartItems } = useCart()
    const { selectedRestaurant, restaurants } = useRestaurant()

    const form = useForm<CheckoutFormValues>({
        defaultValues,
        resolver: zodResolver(createCheckoutSchema(totalAmount, selectedRestaurant, restaurants)),
        mode: 'onBlur'
    })

    // Load saved details
    useEffect(() => {
        const loadSavedDetails = async () => {
            if (typeof window === 'undefined' || !selectedRestaurant) return;

            try {
                const saved = localStorage.getItem('user-checkout-details')
                if (!saved) {
                    setIsLoading(false)
                    return
                }

                const parsedDetails = JSON.parse(saved)

                // Validate saved details using schema
                try {
                    const schema = createCheckoutSchema(totalAmount, selectedRestaurant, restaurants)
                    await schema.parseAsync(parsedDetails)
                    form.reset(parsedDetails)
                } catch (error) {
                    console.log('Validation errors:', error)
                    // If validation fails, use default values
                    form.reset(defaultValues)
                    // Save the cleaned details back to localStorage
                    localStorage.setItem('user-checkout-details', JSON.stringify(defaultValues))
                }
            } catch (error) {
                console.error('Error loading saved details:', error)
            } finally {
                setIsLoading(false)
            }
        }

        loadSavedDetails()
    }, [selectedRestaurant, totalAmount, form, restaurants])

    // Check localStorage before rendering form
    if (isLoading) {
        return (
            <div className="container py-5">
                <div className="row">
                    <div className="col-12 text-center">
                        <LoadingSpinner />
                        <p className="mt-3">Gegevens laden...</p>
                    </div>
                </div>
            </div>
        );
    }

    const onSubmit = async (values: CheckoutFormValues) => {
        try {
            // 1. Validatie
            if (values.delivery_method === 'delivery' && values.postcode) {
                const { minimumAmount } = findRestaurantByPostalCode(restaurants, selectedRestaurant, values.postcode)
                if (minimumAmount && totalAmount < minimumAmount) {
                    throw new Error(`Voor bezorging in ${values.postcode} is het minimum bestelbedrag €${minimumAmount.toFixed(2)}`)
                }
            }

            // 2. Details opslaan als nodig
            if (values.remember_details) {
                const detailsToSave = {
                    firstname: values.firstname,
                    lastname: values.lastname,
                    email: values.email,
                    tel: values.tel,
                    company: values.company,
                    vatNumber: values.vatNumber,
                    city: values.city,
                    address: values.address,
                    postcode: values.postcode,
                    payment_method: values.payment_method,
                    delivery_method: values.delivery_method,
                    message: values.message
                }
                localStorage.setItem('user-checkout-details', JSON.stringify(detailsToSave))
            }

            // 3. Order data voorbereiden
            const orderData = createOrderData(
                orderId,
                values,
                totalAmount,
                cartItems,
                selectedRestaurant
            )

            // 4. Order opslaan in database
            await toast.promise(
                (async () => {
                    const { error } = await createClient()
                        .from('orders')
                        .insert([orderData])
                    if (error) throw error
                })(),
                {
                    loading: 'Bestelling opslaan...',
                    success: 'Je bestelling is succesvol geplaatst!',
                    error: 'Er ging iets mis bij het opslaan van je bestelling.'
                }
            )

            // 5. Email versturen (zonder blocking)
            fetch('/api/email/order-confirmation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ order: orderData })
            }).catch(error => {
                console.error('Error sending confirmation email:', error)
                // Email fout negeren, gebruiker heeft al succesbericht
            })

            // 6. Redirect naar bevestigingspagina
            router.push(`/order-confirmation/${orderId}`)
        } catch (error) {
            console.error('Error handling order:', error)
            if (error instanceof Error) {
                toast.error(error.message)
            } else {
                toast.error('Er ging iets mis tijdens het verwerken van je bestelling')
            }
        }
    }

    return (
        <FormWrapper form={form} onSubmit={onSubmit} className="tst-checkout-form">
            <LocationConfirmation selectedRestaurant={selectedRestaurant} />
            <DeliveryDetails form={form} />
            <PaymentMethods form={form} />
            <FormButtons form={form} orderId={orderId} />
        </FormWrapper>
    )
}

export default CheckoutForm