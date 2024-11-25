import { FormFieldProps } from '@/lib/types';

export const PaymentMethods = ({ values, handleChange }: Pick<FormFieldProps, 'values' | 'handleChange'>) => {
    //console.log('PaymentMethods - values:', values)

    return (
        <div className="tst-mb-30 tst-space-between">
            <div>
                <h5 className="tst-mb-30">Betaalmethode</h5>
                <ul>
                    <li className="tst-radio" data-testid="payconiq-radio">
                        <input
                            type="radio"
                            id="payconiq"
                            name="payment_method"
                            value="payconiq"
                            checked={values.payment_method === 'payconiq'}
                            onChange={handleChange}
                        />
                        <label htmlFor="payconiq">Bankoverschrijving</label>
                        <div className="tst-check"></div>
                    </li>
                    <li className="tst-radio" data-testid="cash-radio">
                        <input
                            type="radio"
                            id="cash"
                            name="payment_method"
                            value="cash"
                            checked={values.payment_method === 'cash'}
                            onChange={handleChange}
                        />
                        <label htmlFor="cash">Cash</label>
                        <div className="tst-check"></div>
                    </li>
                </ul>
            </div>
            <div>
                <h5 className="tst-mb-30">Afhalen of leveren?</h5>
                <ul>
                    <li className="tst-radio" data-testid="pickup-radio">
                        <input
                            type="radio"
                            id="pickup"
                            name="delivery_method"
                            value="pickup"
                            checked={values.delivery_method === 'pickup'}
                            onChange={handleChange}
                        />
                        <label htmlFor="pickup">Afhalen</label>
                        <div className="tst-check"></div>
                    </li>
                    <li className="tst-radio" data-testid="delivery-radio">
                        <input
                            type="radio"
                            id="delivery"
                            name="delivery_method"
                            value="delivery"
                            checked={values.delivery_method === 'delivery'}
                            onChange={handleChange}
                        />
                        <label htmlFor="delivery">Leveren</label>
                        <div className="tst-check"></div>
                    </li>
                </ul>
            </div>
        </div>
    );
}; 