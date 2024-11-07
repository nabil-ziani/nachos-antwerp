import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const payload = await request.json()
        console.log('Payconiq callback received:', payload)

        switch (payload.status) {
            case 'PENDING':
                // Store pending payment in your database
                break
            case 'SUCCEEDED':
                // Update order status and send confirmation email
                break
            case 'FAILED':
                // Handle failed payment
                break
            case 'CANCELLED':
                // Handle cancelled payment
                break
        }

        return NextResponse.json({ message: 'Webhook processed successfully' })
    } catch (error) {
        console.error('Error processing webhook:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}