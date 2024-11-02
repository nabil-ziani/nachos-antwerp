import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        // Verify the request is coming from Payconiq (you should add signature verification)
        const payload = await request.json()

        // Log the payment status update
        console.log('Payconiq callback received:', payload)

        // Handle different payment statuses
        switch (payload.status) {
            case 'PENDING':
                // Handle pending payment
                break
            case 'SUCCEEDED':
                // Handle successful payment
                break
            case 'FAILED':
                // Handle failed payment
                break
            case 'CANCELLED':
                // Handle cancelled payment
                break
        }

        // Return 200 OK to acknowledge receipt
        return NextResponse.json({ message: 'Webhook processed successfully' }, { status: 200 })
    } catch (error) {
        console.error('Error processing webhook:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}