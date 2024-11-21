'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { PaymentResult } from '@/components/payment-result'
import { useRestaurant } from '@/contexts/restaurant-context'

interface OrderDetails {
    order_id: string
    customer_name: string
    customer_email: string
    customer_phone: string
    amount: number
    delivery_method: string
    payment_method: string
    payment_status: string
    order_items: any[]
    restaurant_location: string
    estimated_time?: string
}

export default function OrderConfirmationPage({ params }: { params: Promise<{ orderId: string }> }) {
    const [order, setOrder] = useState<OrderDetails | null>(null)
    const [emailSent, setEmailSent] = useState(false)

    const { selectedRestaurant } = useRestaurant()
    const router = useRouter()

    const orderId = use(params).orderId

    useEffect(() => {
        const fetchOrder = async () => {
            const supabase = createClient()
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .eq('order_id', orderId)
                .single()

            if (error || !data) {
                console.error('Error fetching order:', error)
                router.push('/menu')
                return
            }

            setOrder(data)

            if (data.payment_status === 'completed' && !emailSent) {
                const emailKey = `email_sent_${orderId}`
                if (!localStorage.getItem(emailKey)) {
                    try {
                        await fetch('/api/email/order-confirmation', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                order: {
                                    id: data.order_id.substring(0, 8),
                                    items: data.order_items.map((item: any) => ({
                                        title: item.title,
                                        quantity: item.quantity,
                                        price: item.price,
                                        currency: '€'
                                    })),
                                    total: data.amount,
                                    type: data.delivery_method,
                                    status: 'Bevestigd',
                                    estimatedTime: data.estimated_time || '30-45 minuten',
                                    paymentMethod: data.payment_method,
                                    paymentStatus: data.payment_status
                                },
                                customer: {
                                    name: data.customer_name,
                                    email: data.customer_email,
                                    phone: data.customer_phone,
                                    company: data.customer_company,
                                    vatNumber: data.customer_vatnumber,
                                    address: data.delivery_method === 'delivery'
                                        ? `${data.delivery_address.street}, ${data.delivery_address.postcode} ${data.delivery_address.city}`
                                        : null
                                },
                                restaurant: {
                                    name: selectedRestaurant?.name || "Nacho's Antwerp",
                                    address: selectedRestaurant?.address || 'Address not found'
                                }
                            })
                        })
                        setEmailSent(true)
                        localStorage.setItem(emailKey, 'true')
                        localStorage.removeItem('cart-storage')
                    } catch (error) {
                        console.error('Failed to send confirmation email:', error)
                    }
                }
            }

            localStorage.removeItem(`payment_${orderId}`)
        }

        fetchOrder()
    }, [orderId, emailSent])

    if (!order) return null

    return <PaymentResult status={order.payment_status} />
} 