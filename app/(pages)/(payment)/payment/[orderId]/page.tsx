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
        const checkOrderStatus = async () => {
            try {
                const supabase = createClient()
                const { data: order, error } = await supabase
                    .from('orders')
                    .select('payment_status')
                    .eq('order_id', params.orderId)
                    .single()

                if (error) throw error

                // If payment is completed/failed/cancelled, redirect to confirmation
                if (['completed', 'failed', 'cancelled'].includes(order.payment_status)) {
                    router.push(`/order-confirmation/${params.orderId}`)
                    return
                }

                // Only check QR code if payment is still pending
                const storedQrCode = localStorage.getItem(`payment_${params.orderId}`)
                if (!storedQrCode) {
                    router.push('/menu')
                    return
                }

                const qrUrl = new URL(storedQrCode)
                qrUrl.searchParams.set('f', 'SVG')
                qrUrl.searchParams.set('s', 'L')
                qrUrl.searchParams.set('cl', 'black')

                setQrCode(qrUrl.toString())
                startPaymentTracking(params.orderId, 'pending')
            } catch (error) {
                console.error('Error checking order status:', error)
                router.push('/menu')
            } finally {
                setIsLoading(false)
            }
        }

        checkOrderStatus()
    }, [params.orderId, router, startPaymentTracking])

    if (!qrCode) return null

    return (
        <div className="tst-confirmation-page">
            <div className="tst-confirmation-box">
                <h1>Betaling</h1>
                <p>Scan de QR code met de Payconiq app</p>

                <div className="tst-payment-qr">
                    <img src={qrCode} alt="Payment QR Code" />
                </div>
            </div>
        </div>
    )
} 