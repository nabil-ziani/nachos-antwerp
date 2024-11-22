import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(request: NextRequest) {
    try {
        const payload = await request.json()

        // Get the original order_id from the database to compare
        const supabase = await createClient()

        const { data: existingOrder } = await supabase
            .from('orders')
            .select('order_id, payment_status')
            .eq('order_id', payload.paymentId)
            .single()

        if (!existingOrder) {
            console.error('No order found for paymentId:', payload.paymentId)
            return NextResponse.json({ error: 'Order not found' }, { status: 404 })
        }

        // Payconiq status mapping
        let newStatus: string
        switch (payload.status) {
            case 'PENDING':
                newStatus = 'pending'
                break
            case 'SUCCEEDED':
                newStatus = 'completed'
                break
            case 'FAILED':
            case 'EXPIRED':
                newStatus = 'failed'
                break
            case 'CANCELLED':
                newStatus = 'cancelled'
                break
            default:
                newStatus = 'failed'
        }

        // Update order status
        await supabase
            .from('orders')
            .update({ payment_status: newStatus })
            .eq('order_id', existingOrder.order_id)

        return NextResponse.json({
            message: 'Webhook processed successfully',
            status: newStatus
        })
    } catch (error) {
        console.error('Error processing webhook:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}