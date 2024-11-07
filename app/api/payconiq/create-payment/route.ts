import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const { amount, reference } = await request.json()
        
        const PAYCONIQ_API_KEY = process.env.PAYCONIQ_EXT_API_KEY
        const PAYCONIQ_MERCHANT_ID = process.env.PAYCONIQ_EXT_MERCHANT_ID
        const PAYCONIQ_PROFILE_ID = process.env.PAYCONIQ_EXT_PROFILE_ID

        console.log('Config:', {
            apiKey: PAYCONIQ_API_KEY ? 'Set' : 'Not set',
            merchantId: PAYCONIQ_MERCHANT_ID,
            profileId: PAYCONIQ_PROFILE_ID
        })

        console.log('Request payload:', {
            amount: Math.round(amount * 100),
            reference,
            merchantId: PAYCONIQ_MERCHANT_ID,
            profileId: PAYCONIQ_PROFILE_ID
        })

        const response = await fetch('https://api.ext.payconiq.com/v3/payments', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${PAYCONIQ_API_KEY}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                amount: Math.round(amount * 100),
                currency: 'EUR',
                reference: reference,
                callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payconiq/callback`,
                merchantId: PAYCONIQ_MERCHANT_ID,
                profileId: PAYCONIQ_PROFILE_ID,
                description: "Bestelling Nacho's Antwerp",
            })
        })

        const responseText = await response.text()
        console.log('Raw response:', responseText)

        let paymentData
        try {
            paymentData = JSON.parse(responseText)
        } catch (e) {
            throw new Error(`Invalid JSON response: ${responseText.substring(0, 200)}...`)
        }

        if (!response.ok) {
            throw new Error(`API error: ${JSON.stringify(paymentData)}`)
        }

        return NextResponse.json(paymentData)
    } catch (error) {
        console.error('Detailed error:', error)
        return NextResponse.json({ 
            error: 'Failed to create payment',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 })
    }
} 