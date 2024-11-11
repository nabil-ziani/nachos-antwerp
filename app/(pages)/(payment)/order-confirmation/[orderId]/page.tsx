'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { PaymentResult } from '@/components/payment-result'

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

export default function OrderConfirmationPage({ params }: { params: { orderId: string } }) {
    const [order, setOrder] = useState<OrderDetails | null>(null)
    const [emailSent, setEmailSent] = useState(false)
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
                console.error('Error fetching order:', error)
                router.push('/menu')
                return
            }

            setOrder(data)

            if (data.payment_status === 'completed' && !emailSent) {
                const emailKey = `email_sent_${params.orderId}`
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
                                    type: data.delivery_method === 'afhalen' ? 'pickup' : 'delivery',
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
                                    address: data.delivery_method === 'leveren'
                                        ? `${data.delivery_address.street}, ${data.delivery_address.postcode} ${data.delivery_address.city}`
                                        : null
                                },
                                restaurant: {
                                    name: "Nacho's Antwerp",
                                    address: data.restaurant_location === 'berchem'
                                        ? 'Diksmuidelaan 170, 2600 Berchem'
                                        : 'Oudebareellei 51, 2170 Merksem'
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

            localStorage.removeItem(`payment_${params.orderId}`)
        }

        fetchOrder()
    }, [params.orderId, emailSent])

    if (!order) return null

    return <PaymentResult status={order.payment_status} />
} 