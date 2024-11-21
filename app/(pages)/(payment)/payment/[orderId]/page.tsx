'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePayment } from '@/contexts/payment-context'
import { createClient } from '@/utils/supabase/client'

export default function PaymentPage({ params }: { params: Promise<{ orderId: string }> }) {
    const [qrCode, setQrCode] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    const router = useRouter()
    const orderId = use(params).orderId

    const { startPaymentTracking } = usePayment()

    useEffect(() => {
        const checkOrderStatus = async () => {
            try {
                const supabase = createClient()
                const { data: order, error } = await supabase
                    .from('orders')
                    .select('payment_status')
                    .eq('order_id', orderId)
                    .single()

                if (error) throw error

                if (['completed', 'failed', 'cancelled'].includes(order.payment_status)) {
                    router.push(`/order-confirmation/${orderId}`)
                    return
                }

                const storedQrCode = localStorage.getItem(`payment_${orderId}`)

                if (!storedQrCode) {
                    router.push('/checkout')
                    return
                }

                const qrUrl = new URL(storedQrCode)
                qrUrl.searchParams.set('f', 'SVG')
                qrUrl.searchParams.set('s', 'L')
                qrUrl.searchParams.set('cl', 'black')

                setQrCode(qrUrl.toString())
                startPaymentTracking(orderId, 'pending')
            } catch (error) {
                console.error('Payment Page - Error:', error)
                router.push('/checkout')
            } finally {
                setIsLoading(false)
            }
        }

        checkOrderStatus()
    }, [orderId, router, startPaymentTracking])

    if (!qrCode) return null

    return (
        <div className="tst-confirmation-page">
            <div className="tst-confirmation-box">
                <h1>Betaling</h1>
                <p>Scan de QR code met de Payconiq app</p>

                <div className="tst-payment-qr">
                    <img src={qrCode} alt="Payment QR Code" data-testid="payment-qr-code" />
                </div>
            </div>
        </div>
    )
} 