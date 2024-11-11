import { FormikErrors } from 'formik';
import { CheckoutFormValues, Restaurant } from './types';
import { findRestaurantByPostalCode } from '@/utils/location';

interface ValidateCheckoutFormProps {
    values: CheckoutFormValues
    totalAmount: number
    selectedRestaurant: Restaurant | null
    restaurants: Restaurant[]
}

export const defaultValues: CheckoutFormValues = {
    firstname: '',
    lastname: '',
    email: '',
    tel: '',
    company: '',
    city: '',
    address: '',
    postcode: '',
    message: '',
    payment_method: 'bankoverschrijving',
    delivery_method: 'afhalen',
    remember_details: true
};

export const validateCheckoutForm = ({ values, totalAmount, selectedRestaurant, restaurants }: ValidateCheckoutFormProps) => {
    const errors: FormikErrors<CheckoutFormValues> = {};

    // Check if restaurant is selected
    if (!selectedRestaurant) {
        errors.delivery_method = 'Selecteer eerst een restaurant';
    }

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
        const { restaurant, minimumAmount } = findRestaurantByPostalCode(restaurants, selectedRestaurant, values.postcode);
        if (restaurant && minimumAmount) {
            if (totalAmount < minimumAmount) {
                errors.postcode = `Minimum bestelbedrag voor ${values.postcode} is €${minimumAmount.toFixed(2)}`;
            }
        }
    }

    return errors;
}; 