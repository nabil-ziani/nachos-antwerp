'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { PaymentResult } from '@/components/payment-result'
import { useRestaurant } from '@/contexts/restaurant-context'
import { sendWhatsAppNotification } from '@/utils/whatsapp'
import { CartItem } from '@/types'
import { prisma } from '@/lib/prisma'

interface OrderDetails {
    orderId: string
    customerName: string
    customerEmail: string
    customerPhone: string
    customerCompany: string | null
    customerVatNumber: string | null
    amount: number
    deliveryMethod: 'pickup' | 'delivery'
    paymentMethod: 'cash' | 'payconiq'
    paymentStatus: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'
    orderItems: CartItem[]
    restaurantId: string
    notes: string | null
    deliveryAddress: {
        street: string
        city: string
        postcode: string
    } | null
}

export default function OrderConfirmationPage({ params }: { params: Promise<{ orderId: string }> }) {
    const [order, setOrder] = useState<OrderDetails | null>(null)
    const [emailSent, setEmailSent] = useState(false)

    const { selectedRestaurant } = useRestaurant()
    const router = useRouter()

    const orderId = use(params).orderId

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const data = await prisma.order.findUnique({
                    where: {
                        orderId: orderId
                    }
                })

                if (!data) {
                    console.error('Order not found')
                    router.push('/menu')
                    return
                }

                // Parse JSON fields
                const orderDetails: OrderDetails = {
                    orderId: data.orderId,
                    customerName: data.customerName,
                    customerEmail: data.customerEmail,
                    customerPhone: data.customerPhone,
                    customerCompany: data.customerCompany,
                    customerVatNumber: data.customerVatNumber,
                    amount: data.amount,
                    deliveryMethod: data.deliveryMethod,
                    paymentMethod: data.paymentMethod,
                    paymentStatus: data.paymentStatus,
                    orderItems: data.orderItems as CartItem[],
                    restaurantId: data.restaurantId,
                    notes: data.notes,
                    deliveryAddress: data.deliveryAddress as { street: string; city: string; postcode: string; } | null
                }

                setOrder(orderDetails)

                if (data.paymentStatus === 'completed' && !emailSent) {
                    const emailKey = `email_sent_${orderId}`
                    if (!localStorage.getItem(emailKey)) {
                        try {
                            await fetch('/api/email/order-confirmation', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    order: orderDetails
                                })
                            })

                            await sendWhatsAppNotification({
                                orderId: data.orderId,
                                customerName: data.customerName,
                                customerPhone: data.customerPhone,
                                deliveryMethod: data.deliveryMethod,
                                totalAmount: data.amount,
                                items: orderDetails.orderItems
                            })

                            setEmailSent(true)
                            localStorage.setItem(emailKey, 'true')
                            localStorage.removeItem('cart-storage')
                        } catch (error) {
                            console.error('Failed to send notifications:', error)
                        }
                    }
                }

                localStorage.removeItem(`payment_${orderId}`)
            } catch (error) {
                console.error('Error fetching order:', error)
                router.push('/menu')
            }
        }

        fetchOrder()
    }, [orderId, emailSent, router, selectedRestaurant])

    if (!order) return null

    return <PaymentResult status={order.paymentStatus} />
} 