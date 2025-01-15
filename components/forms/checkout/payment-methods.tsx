'use client'

import { UseFormReturn } from 'react-hook-form'
import { CheckoutFormValues } from '@/lib/schemas/checkout-schema'

interface PaymentMethodsProps {
    form: UseFormReturn<CheckoutFormValues>
}

export const PaymentMethods = ({ form }: PaymentMethodsProps) => {
    const { register, watch } = form
    const deliveryMethod = watch('deliveryMethod')
    const paymentMethod = watch('paymentMethod')

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
                        {...register('deliveryMethod')}
                    />
                    <label htmlFor="pickup">Afhalen</label>
                    <div className="tst-check"></div>
                </div>
                <div className="tst-radio">
                    <input
                        type="radio"
                        id="delivery"
                        value="delivery"
                        {...register('deliveryMethod')}
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
                        {...register('paymentMethod')}
                    />
                    <label htmlFor="cash">Cash</label>
                    <div className="tst-check"></div>
                </div>
                <div className="tst-radio">
                    <input
                        type="radio"
                        id="payconiq"
                        value="payconiq"
                        {...register('paymentMethod')}
                    />
                    <label htmlFor="payconiq">Payconiq</label>
                    <div className="tst-check"></div>
                </div>
            </div>
        </>
    )
} 