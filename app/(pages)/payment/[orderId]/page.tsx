'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import PageBanner from "@/components/page-banner"

export default function PaymentPage({ params }: { params: { orderId: string } }) {
    const [qrCode, setQrCode] = useState<string | null>(null)
    const router = useRouter()

    // Get QR code on mount
    useEffect(() => {
        const storedQrCode = localStorage.getItem(`payment_${params.orderId}`)
        if (!storedQrCode) {
            router.push('/menu')
            return
        }
        setQrCode(storedQrCode)
    }, [params.orderId, router])

    if (!qrCode) return null

    return (
        <div className="tst-payment-page">
            <div id="tst-dynamic-banner" className="tst-dynamic-banner">
                <PageBanner
                    pageTitle="Betaling"
                    description="Scan de QR code met de Payconiq app"
                    breadTitle="Betaling"
                />
            </div>
            <div id="tst-dynamic-content" className="tst-dynamic-content">
                <div className="tst-content-frame">
                    <div className="tst-content-box">
                        <div className="container tst-p-60-60">
                            <div className="row justify-content-center">
                                <div className="col-md-6 text-center">
                                    <div className="tst-payment-status">
                                        <img src={qrCode} alt="Payment QR Code" className="mb-4" style={{ maxWidth: '300px' }} />
                                        <div className="alert alert-info">
                                            Wachten op betaling...
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
} 