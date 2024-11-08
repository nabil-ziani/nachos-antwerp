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

    const handleBack = async () => {
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
            <div className="tst-back-link">
                <button 
                    onClick={handleBack}
                    className="tst-text-link"
                    style={{
                        background: 'none',
                        border: 'none',
                        color: '#666',
                        fontSize: '0.9rem',
                        padding: '0.5rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}
                >
                    <svg 
                        width="16" 
                        height="16" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2"
                    >
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    Terug naar menu
                </button>
            </div>

            <div className="tst-confirmation-box">
                <h1>Betaling</h1>
                <p>Scan de QR code met de Payconiq app</p>

                <div className="tst-payment-qr">
                    <img src={qrCode} alt="Payment QR Code" />
                </div>

                <div className="tst-payment-status">
                    <p>Wachten op betaling...</p>
                </div>
            </div>
        </div>
    )
} 