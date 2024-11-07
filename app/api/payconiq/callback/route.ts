import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(request: NextRequest) {
    try {
        const payload = await request.json()
        console.log('Payconiq callback received:', payload)

        const supabase = createClient()

        switch (payload.status) {
            case 'PENDING':
                await supabase
                    .from('orders')
                    .update({ payment_status: 'pending' })
                    .eq('order_id', payload.reference)
                break

            case 'SUCCEEDED':
            case 'AUTHORIZED':
                await supabase
                    .from('orders')
                    .update({ payment_status: 'completed' })
                    .eq('order_id', payload.reference)
                break

            case 'FAILED':
            case 'EXPIRED':
                await supabase
                    .from('orders')
                    .update({ payment_status: 'failed' })
                    .eq('order_id', payload.reference)
                break

            case 'CANCELLED':
                await supabase
                    .from('orders')
                    .update({ payment_status: 'cancelled' })
                    .eq('order_id', payload.reference)
                break
        }

        console.log('Updated order status to:', payload.status)
        return NextResponse.json({ message: 'Webhook processed successfully' })
    } catch (error) {
        console.error('Error processing webhook:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}