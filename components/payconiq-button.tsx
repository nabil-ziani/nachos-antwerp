'use client'

import { useState } from "react"

interface PayconiqButtonProps {
    amount: number
    orderId: string
    className?: string
}

export function PayconiqButton({ amount, orderId, className }: PayconiqButtonProps) {
    const [isLoading, setIsLoading] = useState(false)

    const handlePayment = async () => {
        try {
            setIsLoading(true)

            const response = await fetch('/api/payconiq/create-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount,
                    reference: orderId,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.details || 'Payment creation failed')
            }

            if (data._links?.checkout?.href) {
                window.location.href = data._links.checkout.href
            } else {
                throw new Error('No checkout URL received')
            }
        } catch (error) {
            console.error('Payment failed:', error)
            alert('Payment creation failed. Please try again or contact support.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <button
            onClick={handlePayment}
            disabled={isLoading}
            className={className}
            type="button"
        >
            <span className="tst-icon">
                <img src="/img/ui/icons/arrow.svg" alt="icon" />
            </span>
            <span>{isLoading ? "Verwerken..." : "Betaal met Payconiq"}</span>
        </button>
    )
} 