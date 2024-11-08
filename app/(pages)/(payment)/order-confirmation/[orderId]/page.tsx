'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { PaymentResult } from '@/components/payment-result'

interface OrderDetails {
    order_id: string
    customer_name: string
    customer_email: string
    amount: number
    delivery_method: string
    payment_status: string
}

export default function OrderConfirmationPage({ params }: { params: { orderId: string } }) {
    const [order, setOrder] = useState<OrderDetails | null>(null)
    const router = useRouter()

    useEffect(() => {
        const fetchOrder = async () => {
            const supabase = createClient()
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .eq('order_id', params.orderId)
                .single()

            if (error || !data) {
                router.push('/menu')
                return
            }

            setOrder(data)
            localStorage.removeItem(`payment_${params.orderId}`)
        }

        fetchOrder()
    }, [params.orderId])

    if (!order) return null

    return <PaymentResult status={order.payment_status} />
} 