import { FormikErrors } from 'formik';
import { CheckoutFormValues } from './types';

export const validateCheckoutForm = (values: CheckoutFormValues, totalAmount: number, findRestaurantByPostalCode: any) => {
    const errors: FormikErrors<CheckoutFormValues> = {};

    // Basic required fields
    if (!values.firstname) errors.firstname = 'Verplicht';
    if (!values.lastname) errors.lastname = 'Verplicht';
    if (!values.tel) errors.tel = 'Verplicht';

    if (!values.email) {
        errors.email = 'Verplicht';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
        errors.email = 'Ongeldige mailadres';
    }

    // Delivery-specific validation
    if (values.delivery_method === 'leveren') {
        if (!values.address) errors.address = 'Verplicht';
        if (!values.city) errors.city = 'Verplicht';
        if (!values.postcode) {
            errors.postcode = 'Verplicht';
        } else if (!/^\d{4}$/.test(values.postcode)) {
            errors.postcode = 'Ongeldige postcode';
        }
    }

    // Add minimum order validation for delivery
    if (values.delivery_method === 'leveren' && values.postcode) {
        const { restaurant, minimumAmount } = findRestaurantByPostalCode(values.postcode);
        if (restaurant && minimumAmount) {
            if (totalAmount < minimumAmount) {
                errors.postcode = `Minimum bestelbedrag voor ${values.postcode} is €${minimumAmount.toFixed(2)}`;
            }
        }
    }

    return errors;
}; 