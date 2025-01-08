'use client'

import { UseFormReturn } from 'react-hook-form'
import { CheckoutFormValues } from '@/lib/schemas/checkout-schema'

interface PaymentMethodsProps {
    form: UseFormReturn<CheckoutFormValues>
}

export const PaymentMethods = ({ form }: PaymentMethodsProps) => {
    const { register, watch } = form
    const delivery_method = watch('delivery_method')
    const payment_method = watch('payment_method')

    return (
        <>
            <div className="tst-mb-30">
                <h5>Bezorgmethode</h5>
            </div>
            <div className="tst-group-input">
                <div className="tst-radio">
                    <input
                        type="radio"
                        id="pickup"
                        value="pickup"
                        {...register('delivery_method')}
                    />
                    <label htmlFor="pickup">Afhalen</label>
                    <div className="tst-check"></div>
                </div>
                <div className="tst-radio">
                    <input
                        type="radio"
                        id="delivery"
                        value="delivery"
                        {...register('delivery_method')}
                    />
                    <label htmlFor="delivery">Levering</label>
                    <div className="tst-check"></div>
                </div>
            </div>

            <div className="tst-mb-30">
                <h5>Betaalmethode</h5>
            </div>
            <div className="tst-group-input">
                <div className="tst-radio">
                    <input
                        type="radio"
                        id="cash"
                        value="cash"
                        {...register('payment_method')}
                    />
                    <label htmlFor="cash">Cash</label>
                    <div className="tst-check"></div>
                </div>
                <div className="tst-radio">
                    <input
                        type="radio"
                        id="payconiq"
                        value="payconiq"
                        {...register('payment_method')}
                    />
                    <label htmlFor="payconiq">Payconiq</label>
                    <div className="tst-check"></div>
                </div>
            </div>
        </>
    )
} 