import { CartItem } from '@/lib/types';

import { PayconiqButton } from '@/components/payconiq-button';

interface FormButtonsProps {
    values: any;
    isValid: boolean;
    isSubmitting: boolean;
    orderId: string;
    totalAmount: number;
    cartItems: CartItem[];
}

export const FormButtons = ({ values, isValid, isSubmitting, orderId, totalAmount, cartItems }: FormButtonsProps) => {
    return (
        <div className="tst-button-group">
            {values.payment_method === 'bankoverschrijving' ? (
                <PayconiqButton
                    amount={totalAmount}
                    orderId={orderId}
                    className={`tst-btn tst-btn-with-icon tst-m-0 ${isSubmitting ? 'loading' : ''}`}
                    disabled={!isValid || isSubmitting}
                    formValues={{
                        ...values,
                        cartItems,
                        delivery_method: values.delivery_method,
                    }}
                    onPaymentCreated={(checkoutUrl) => {
                        // Remove status text update
                    }}
                    onPaymentError={(error) => {
                        const status = document.getElementById("checkoutFormStatus")
                        if (status) {
                            status.innerHTML = "<h5>Er is een probleem opgetreden. Probeer het opnieuw.</h5>"
                        }
                    }}
                >
                    <span className="tst-icon">
                        <img src="/img/ui/icons/arrow.svg" alt="icon" />
                    </span>
                    <span>{isSubmitting ? '' : 'Betaal met Payconiq'}</span>
                    {isSubmitting && <div className="spinner" />}
                </PayconiqButton>
            ) : (
                <button type="submit" className="tst-btn tst-btn-with-icon tst-m-0">
                    <span className="tst-icon">
                        <img src="/img/ui/icons/arrow.svg" alt="icon" />
                    </span>
                    <span>Plaats bestelling</span>
                </button>
            )}
        </div>
    );
}; 