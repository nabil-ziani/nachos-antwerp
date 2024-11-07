'use client'

import { useState } from "react"

interface PayconiqButtonProps {
    amount: number
    orderId: string
    className?: string
    onPaymentCreated?: (checkoutUrl: string) => void
    onPaymentError?: (error: Error) => void
    disabled: boolean
}

export function PayconiqButton({ amount, orderId, className, onPaymentCreated, onPaymentError, disabled }: PayconiqButtonProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null)

    const handlePayment = async (e: React.MouseEvent) => {
        e.preventDefault()
        if (disabled) return

        try {
            setIsLoading(true)
            const response = await fetch('/api/payconiq/create-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount,
                    reference: orderId.substring(0, 35),
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.details || 'Payment creation failed')
            }

            if (data._links?.qrcode?.href) {
                setQrCodeUrl(data._links.qrcode.href)
            }

            if (data._links?.deeplink?.href) {
                const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
                if (isMobile) {
                    onPaymentCreated?.(data._links.deeplink.href)
                    window.location.href = data._links.deeplink.href
                }
            }
        } catch (error) {
            console.error('Payment failed:', error)
            onPaymentError?.(error as Error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div>
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
            
            {qrCodeUrl && (
                <div className="mt-4">
                    <h5>Scan de QR code om te betalen</h5>
                    <img src={qrCodeUrl} alt="Payconiq QR Code" style={{ maxWidth: '200px' }} />
                </div>
            )}
        </div>
    )
} 