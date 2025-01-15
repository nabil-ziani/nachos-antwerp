'use client'

import { UseFormReturn } from 'react-hook-form'
import { CheckoutFormValues } from '@/lib/schemas/checkout-schema'
import { PayconiqButton } from '@/components/payconiq-button'
import { useCart } from '@/hooks/useCart'
import { useRestaurant } from '@/contexts/restaurant-context'

interface FormButtonsProps {
    form: UseFormReturn<CheckoutFormValues>
    orderId: string
}

export const FormButtons = ({ form, orderId }: FormButtonsProps) => {
    const { formState: { isSubmitting, isValid }, getValues } = form
    const paymentMethod = form.watch('paymentMethod')
    const { cartTotal: totalAmount, cartItems } = useCart()
    const { selectedRestaurant } = useRestaurant()

    const isButtonDisabled = !isValid || isSubmitting || !selectedRestaurant

    return (
        <div className="tst-button-group">
            {paymentMethod === 'payconiq' ? (
                <PayconiqButton
                    amount={totalAmount}
                    orderId={orderId}
                    className={`tst-btn tst-btn-with-icon tst-m-0 ${isSubmitting ? 'loading' : ''}`}
                    disabled={isButtonDisabled}
                    formValues={{ ...getValues(), cartItems }}
                    // TODO: Remove this code after testing
                    onPaymentCreated={(checkoutUrl) => { }}
                    onPaymentError={(error) => {
                        console.error(error)

                        const status = document.getElementById("checkoutFormStatus")
                        if (status) {
                            status.innerHTML = "<h5>Er is een probleem opgetreden. Probeer het opnieuw.</h5>"
                        }
                    }}
                >
                    <span className="tst-icon">
                        <img src="/img/ui/icons/arrow.svg" alt="icon" />
                    </span>
                    <span>{isSubmitting ? 'Betalen...' : 'Betaal met Payconiq'}</span>
                    {isSubmitting && <div className="spinner" />}
                </PayconiqButton>
            ) : (
                <button
                    type="submit"
                    className="tst-btn tst-btn-md"
                >
                    {form.formState.isSubmitting ? 'Bestelling plaatsen...' : 'Bestelling plaatsen'}
                    {form.formState.isSubmitting && <div className="spinner" />}
                </button>
            )}
        </div>
    )
} 