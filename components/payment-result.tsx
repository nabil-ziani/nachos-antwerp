'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Tables } from '@/types/database.types'
import { RealtimePostgresUpdatePayload } from '@supabase/supabase-js'

interface PaymentResultProps {
    status: string
    orderId: string
    customerName: string
    amount: number
    deliveryMethod: string
}

export function PaymentResult({ status: initialStatus, orderId, customerName, amount, deliveryMethod }: PaymentResultProps) {
    const router = useRouter()
    const [status, setStatus] = useState(initialStatus)

    useEffect(() => {
        const supabase = createClient()

        const handleUpdate = async (payload: RealtimePostgresUpdatePayload<Tables<'orders'>>) => {
            console.log('**** order updated ****', payload)
            const newStatus = payload.new.payment_status
            setStatus(newStatus)
        }

        // Subscribe to changes
        const orderSubscription = supabase
            .channel('order status')
            .on<Tables<'orders'>>('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders' }, handleUpdate)

        return () => {
            orderSubscription.unsubscribe()
        }
    }, [orderId])

    const getStatusContent = () => {
        switch (status) {
            case 'completed':
                return {
                    icon: (
                        <svg className="w-20 h-20 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    ),
                    title: 'Bedankt voor je bestelling!',
                    message: 'Je bestelling is succesvol verwerkt.',
                    details: 'Je ontvangt binnen enkele minuten een bevestigingsmail met alle details.'
                }
            case 'failed':
                return {
                    icon: (
                        <svg className="w-20 h-20 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ),
                    title: 'Betaling mislukt',
                    message: 'Er is helaas iets misgegaan met je betaling.',
                    details: 'Probeer het opnieuw of neem contact met ons op.'
                }
            case 'cancelled':
                return {
                    icon: (
                        <svg className="w-20 h-20 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    ),
                    title: 'Betaling geannuleerd',
                    message: 'Je hebt de betaling geannuleerd.',
                    details: 'Je kunt het opnieuw proberen of een andere betaalmethode kiezen.'
                }
            default:
                return {
                    icon: (
                        <svg className="w-20 h-20 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    ),
                    title: 'Status onbekend',
                    message: 'De status van je betaling is onbekend.',
                    details: 'Neem contact met ons op voor meer informatie.'
                }
        }
    }

    const content = getStatusContent()

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="tst-content-box max-w-2xl mx-auto text-center p-8">
                <div className="mb-8">
                    <div className="tst-status-icon mx-auto mb-6">
                        {content.icon}
                    </div>
                    <h1 className="text-3xl font-bold mb-4">{content.title}</h1>
                    <p className="text-gray-600 mb-6">
                        {content.message}
                    </p>
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                        <h2 className="text-xl font-semibold mb-4">Bestelgegevens</h2>
                        <div className="text-left space-y-2">
                            <p><strong>Bestelnummer:</strong> #{orderId}</p>
                            <p><strong>Naam:</strong> {customerName}</p>
                            <p><strong>Totaalbedrag:</strong> €{amount.toFixed(2)}</p>
                            <p><strong>Bezorgmethode:</strong> {deliveryMethod === 'leveren' ? 'Bezorgen' : 'Afhalen'}</p>
                        </div>
                    </div>
                    <p className="text-gray-600 mb-8">
                        {content.details}
                    </p>
                    <button
                        onClick={() => router.push('/menu')}
                        className="tst-btn tst-btn-with-icon"
                    >
                        <span className="tst-icon">
                            <img src="/img/ui/icons/arrow.svg" alt="icon" />
                        </span>
                        <span>Terug naar menu</span>
                    </button>
                </div>
            </div>
        </div>
    )
} 