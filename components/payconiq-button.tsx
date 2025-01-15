'use client'

import { useState } from "react"
import { createClient } from '@/utils/supabase/client'
import { usePayment } from "@/contexts/payment-context"
import { useRestaurant } from "@/contexts/restaurant-context"
// import { geocodeAddress } from '@/utils/geocode';
import { createOrderData } from "@/utils/order-utils"
import { CheckoutFormValues } from "@/types"

interface PayconiqButtonProps {
    amount: number
    orderId: string
    className?: string
    disabled?: boolean
    formValues: CheckoutFormValues & {
        cartItems: any[]
    }
    onPaymentCreated?: (checkoutUrl: string) => void
    onPaymentError?: (error: Error) => void
    children: React.ReactNode
}

export function PayconiqButton({ amount, orderId, className, onPaymentCreated, onPaymentError, disabled, formValues, children }: PayconiqButtonProps) {
    const [isLoading, setIsLoading] = useState(false)

    const { startPaymentTracking } = usePayment()
    const { selectedRestaurant } = useRestaurant()

    const handlePayment = async (e: React.MouseEvent) => {
        e.preventDefault()
        if (disabled) return

        try {
            setIsLoading(true)

            // Create PAYCONIQ payment
            const response = await fetch('/api/payconiq/create-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount,
                    reference: orderId,
                })
            })

            const data = await response.json()

            console.log('Payconiq API Response:', data)

            if (!response.ok) {
                throw new Error(data.details || 'Payment creation failed')
            }

            startPaymentTracking(data.paymentId, 'pending')

            // Get coordinates of customer address
            /*let coordinates = null
            if (formValues.deliveryMethod === 'delivery') {
                const address = `${formValues.address}, ${formValues.postcode} ${formValues.city}`;
                coordinates = await geocodeAddress(address);

                if (!coordinates) {
                    console.error('Failed to geocode address');
                    setIsLoading(false);
                    return;
                }
            }*/

            const orderData = createOrderData(data.paymentId, formValues, amount, formValues.cartItems, selectedRestaurant);

            const supabase = createClient()
            const { error: insertError } = await supabase.from('orders').insert(orderData)

            if (insertError) {
                throw new Error(`Failed to save order: ${insertError.message}`)
            }

            // Store QR code
            if (data._links?.qrcode?.href) {
                localStorage.setItem(`payment_${data.paymentId}`, data._links.qrcode.href)
            }

            const deeplinkUrl = data._links?.deeplink?.href
            const isMobile = /Mobi|Android/i.test(navigator.userAgent)

            if (isMobile && deeplinkUrl) {
                onPaymentCreated?.(deeplinkUrl)
                window.location.href = deeplinkUrl
            } else {
                onPaymentCreated?.('')
                window.location.href = `/payment/${data.paymentId}`
            }
        } catch (error) {
            console.error('Payment failed:', error)
            onPaymentError?.(error as Error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <button onClick={handlePayment} disabled={disabled || isLoading} className={className} type="button" data-testid="place-order-button">
            {children}
        </button>
    )
} 