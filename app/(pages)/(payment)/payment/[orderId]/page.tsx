'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePayment } from '@/contexts/payment-context'
import { createClient } from '@/utils/supabase/client'

export default function PaymentPage({ params }: { params: { orderId: string } }) {
    const [qrCode, setQrCode] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()
    const { startPaymentTracking } = usePayment()

    useEffect(() => {
        const storedQrCode = localStorage.getItem(`payment_${params.orderId}`)
        if (!storedQrCode) {
            router.push('/menu')
            return
        }

        // Modify QR code URL to use SVG format and black color
        const qrUrl = new URL(storedQrCode)
        qrUrl.searchParams.set('f', 'SVG') // Use SVG for sharper image
        qrUrl.searchParams.set('s', 'L')   // Large size (400x400)
        qrUrl.searchParams.set('cl', 'black') // Black color for better contrast

        setQrCode(qrUrl.toString())
        startPaymentTracking(params.orderId, 'pending')
        setIsLoading(false)
    }, [params.orderId, router, startPaymentTracking])

    const handleCancel = async () => {
        try {
            const supabase = createClient()
            await supabase
                .from('orders')
                .update({ payment_status: 'cancelled' })
                .eq('order_id', params.orderId)

            router.push('/menu')
        } catch (error) {
            console.error('Error cancelling payment:', error)
        }
    }

    if (!qrCode) return null

    return (
        <div className="tst-confirmation-page">
            <div className="tst-confirmation-box">
                <h1>Betaling</h1>
                <p>Scan de QR code met de Payconiq app</p>

                <div className="tst-payment-qr">
                    <img src={qrCode} alt="Payment QR Code" />
                </div>

                <div className="tst-button-group" style={{ marginTop: '2rem' }}>
                    <button
                        onClick={handleCancel}
                        className="tst-btn tst-btn-secondary"
                    >
                        Annuleren
                    </button>
                </div>
            </div>
        </div>
    )
} 