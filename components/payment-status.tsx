'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface PaymentStatusProps {
    orderId: string
    qrCodeUrl: string
}

export function PaymentStatus({ orderId, qrCodeUrl }: PaymentStatusProps) {
    const [status, setStatus] = useState('pending')
    const router = useRouter()

    useEffect(() => {
        const checkStatus = async () => {
            const response = await fetch(`/api/payconiq/status/${orderId}`)
            const data = await response.json()
            
            setStatus(data.status)
            
            if (data.status === 'completed') {
                setTimeout(() => {
                    router.push(`/order-confirmation/${orderId}`)
                }, 2000)
            } else if (data.status === 'failed' || data.status === 'cancelled') {
                router.push(`/payment-failed/${orderId}`)
            }
        }

        const interval = setInterval(checkStatus, 3000)
        return () => clearInterval(interval)
    }, [orderId])

    return (
        <div className="tst-payment-container">
            <img src={qrCodeUrl} alt="Payment QR Code" className="mb-4" />
            <div className="tst-payment-status">
                {status === 'pending' && (
                    <div className="alert alert-info">
                        Wachten op betaling...
                    </div>
                )}
            </div>
        </div>
    )
} 