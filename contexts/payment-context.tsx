'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

interface PaymentContextType {
    paymentStatus: string | null
    orderId: string | null
    startPaymentTracking: (orderId: string, initialStatus: string) => void
    stopPaymentTracking: () => void
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined)

export function PaymentProvider({ children }: { children: React.ReactNode }) {
    const [paymentStatus, setPaymentStatus] = useState<string | null>(null)
    const [orderId, setOrderId] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        if (!orderId) return

        const supabase = createClient()
        // console.log('Starting payment tracking for order:', orderId)

        const subscription = supabase
            .channel('payment-tracking')
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'orders',
                    filter: `order_id=eq.${orderId}`
                },
                (payload) => {
                    // console.log('Payment status update received:', payload)
                    const newStatus = payload.new.payment_status
                    setPaymentStatus(newStatus)

                    if (newStatus === 'completed' || newStatus === 'failed' || newStatus === 'cancelled') {
                        // console.log(`Payment ${newStatus}, redirecting to confirmation`)
                        router.push(`/order-confirmation/${orderId}`)
                    }
                }
            )
            .subscribe()

        return () => {
            // console.log('Cleaning up payment tracking subscription')
            subscription.unsubscribe()
        }
    }, [orderId, router])

    const startPaymentTracking = (newOrderId: string, initialStatus: string) => {
        setOrderId(newOrderId)
        setPaymentStatus(initialStatus)
    }

    const stopPaymentTracking = () => {
        setOrderId(null)
        setPaymentStatus(null)
    }

    return (
        <PaymentContext.Provider value={{
            paymentStatus,
            orderId,
            startPaymentTracking,
            stopPaymentTracking
        }}>
            {children}
        </PaymentContext.Provider>
    )
}

export const usePayment = () => {
    const context = useContext(PaymentContext)
    if (context === undefined) {
        throw new Error('usePayment must be used within a PaymentProvider')
    }
    return context
} 