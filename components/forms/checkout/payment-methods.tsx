import { FormFieldProps } from '@/lib/types';

export const PaymentMethods = ({ values, handleChange }: Pick<FormFieldProps, 'values' | 'handleChange'>) => {
    return (
        <div className="tst-mb-30 tst-space-between">
            <div>
                <h5 className="tst-mb-30">Betaalmethode</h5>
                <ul>
                    <li className="tst-radio">
                        <input
                            type="radio"
                            id="option-1"
                            name="payment_method"
                            value="bankoverschrijving"
                            checked={values.payment_method === 'bankoverschrijving'}
                            onChange={handleChange}
                        />
                        <label htmlFor="option-1">Bankoverschrijving</label>
                        <div className="tst-check"></div>
                    </li>
                    <li className="tst-radio">
                        <input
                            type="radio"
                            id="option-2"
                            name="payment_method"
                            value="cash"
                            checked={values.payment_method === 'cash'}
                            onChange={handleChange}
                        />
                        <label htmlFor="option-2">Cash</label>
                        <div className="tst-check"></div>
                    </li>
                </ul>
            </div>
            <div>
                <h5 className="tst-mb-30">Afhalen of leveren?</h5>
                <ul>
                    <li className="tst-radio">
                        <input
                            type="radio"
                            id="afhalen"
                            name="delivery_method"
                            value="afhalen"
                            checked={values.delivery_method === 'afhalen'}
                            onChange={handleChange}
                        />
                        <label htmlFor="afhalen">Afhalen</label>
                        <div className="tst-check"></div>
                    </li>
                    <li className="tst-radio">
                        <input
                            type="radio"
                            id="leveren"
                            name="delivery_method"
                            value="leveren"
                            checked={values.delivery_method === 'leveren'}
                            onChange={handleChange}
                        />
                        <label htmlFor="leveren">Leveren</label>
                        <div className="tst-check"></div>
                    </li>
                </ul>
            </div>
        </div>
    );
}; 