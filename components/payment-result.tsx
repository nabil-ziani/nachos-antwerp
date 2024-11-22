import Divider from "@/app/layouts/divider"
import Link from "next/link"
import { useCart } from '@/hooks/useCart'
import { useEffect } from 'react'

interface PaymentResultProps {
    status: string
}

export function PaymentResult({ status }: PaymentResultProps) {
    const { clearCart } = useCart()

    useEffect(() => {
        if (status === 'completed') {
            clearCart()
        }
    }, [status, clearCart])

    const getStatusContent = () => {
        switch (status) {
            case 'completed':
                return {
                    icon: (
                        <div className={`tst-status-icon ${status}`} data-testid="completed-icon">
                            <svg className="w-20 h-20 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    ),
                    title: 'Bedankt voor je bestelling!',
                    message: 'We hebben je bestelling ontvangen en gaan ermee aan de slag.',
                    details: 'Je ontvangt binnen enkele minuten een bevestigingsmail met alle details.'
                }
            case 'failed':
                return {
                    icon: (
                        <div className={`tst-status-icon ${status}`} data-testid="failed-icon">
                            <svg className="w-20 h-20 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                    ),
                    title: 'Betaling mislukt',
                    message: 'Er is helaas iets misgegaan met je betaling.',
                    details: 'Probeer het opnieuw of neem contact met ons op.'
                }
            case 'cancelled':
                return {
                    icon: (
                        <div className={`tst-status-icon ${status}`} data-testid="cancelled-icon">
                            <svg className="w-20 h-20 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                    ),
                    title: 'Betaling geannuleerd',
                    message: 'Je hebt de betaling geannuleerd.',
                    details: 'Je kunt het opnieuw proberen of een andere betaalmethode kiezen.'
                }
            default:
                return {
                    icon: (
                        <div className="tst-status-icon unknown" data-testid="unknown-icon">
                            <svg className="w-20 h-20 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                    ),
                    title: 'Status onbekend',
                    message: 'De status van je betaling is onbekend.',
                    details: 'Neem contact met ons op voor meer informatie.'
                }
        }
    }

    const content = getStatusContent()

    return (
        <div className="tst-confirmation-page">
            <div className="tst-confirmation-box">
                {content.icon}
                <h1>{content.title}</h1>
                <p>
                    {content.message}
                </p>
                <Divider />
                <p>
                    {content.details}
                </p>

                <div className="tst-button-group" style={{ marginTop: '2rem' }}>
                    {(status === 'completed' || status === 'cancelled') && (
                        <Link href="/" className="tst-btn" data-testid="back-to-website-button">
                            Terug naar website
                        </Link>
                    )}
                    {status === 'failed' && (
                        <Link href="/checkout" className="tst-btn tst-btn-secondary">
                            Opnieuw proberen
                        </Link>
                    )}
                </div>
            </div>
        </div >
    )
} 