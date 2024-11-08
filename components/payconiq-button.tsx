'use client'

import { useState } from "react"
import { createClient } from '@/utils/supabase/client'
import { usePayment } from "@/contexts/payment-context"
import { useCart } from '@/hooks/useCart'

interface PayconiqButtonProps {
    amount: number
    orderId: string
    className?: string
    disabled?: boolean
    formValues: {
        firstname: string
        lastname: string
        email: string
        tel: string
        delivery_method: string
        street?: string
        number?: string
        city?: string
        postal_code?: string
        cartItems: any[]
    }
    onPaymentCreated?: (checkoutUrl: string) => void
    onPaymentError?: (error: Error) => void
}

export function PayconiqButton({ amount, orderId, className, onPaymentCreated, onPaymentError, disabled, formValues }: PayconiqButtonProps) {
    const [isLoading, setIsLoading] = useState(false)

    const { startPaymentTracking } = usePayment()

    const handlePayment = async (e: React.MouseEvent) => {
        e.preventDefault()
        if (disabled) return

        try {
            setIsLoading(true)

            // First create Payconiq payment
            const response = await fetch('/api/payconiq/create-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount,
                    reference: orderId, // We'll still use this as reference but not as order_id
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.details || 'Payment creation failed')
            }

            startPaymentTracking(data.paymentId, 'pending')

            // Now save the order to Supabase using the paymentId
            const supabase = createClient()
            const { error: orderError } = await supabase
                .from('orders')
                .insert({
                    order_id: data.paymentId,
                    amount: amount,
                    payment_method: 'payconiq',
                    payment_status: 'pending',
                    customer_name: `${formValues.firstname} ${formValues.lastname}`,
                    customer_email: formValues.email,
                    customer_phone: formValues.tel,
                    delivery_method: formValues.delivery_method,
                    delivery_address: formValues.delivery_method === 'leveren' ? {
                        street: formValues.street,
                        number: formValues.number,
                        city: formValues.city,
                        postal_code: formValues.postal_code
                    } : null,
                    order_items: formValues.cartItems,
                    created_at: new Date().toISOString()
                })

            if (orderError) {
                throw new Error(`Failed to save order: ${orderError.message}`)
            }

            // Store QR code
            if (data._links?.qrcode?.href) {
                localStorage.setItem(`payment_${data.paymentId}`, data._links.qrcode.href)
            }

            onPaymentCreated?.(data._links?.deeplink?.href || '')
            window.location.href = `/payment/${data.paymentId}`
        } catch (error) {
            console.error('Payment failed:', error)
            onPaymentError?.(error as Error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <button
            onClick={handlePayment}
            disabled={disabled || isLoading}
            className={className}
            type="button"
        >
            <span className="tst-icon">
                <img src="/img/ui/icons/arrow.svg" alt="icon" />
            </span>
            <span>{isLoading ? 'Even geduld...' : 'Betaal met Payconiq'}</span>
        </button>
    )
} 