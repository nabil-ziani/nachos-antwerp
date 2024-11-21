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
    vatNumber: '',
    city: '',
    address: '',
    postcode: '',
    message: '',
    payment_method: 'cash',
    delivery_method: 'pickup',
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
    if (values.delivery_method === 'delivery') {
        if (!values.address) errors.address = 'Verplicht';
        if (!values.city) errors.city = 'Verplicht';
        if (!values.postcode) {
            errors.postcode = 'Verplicht';
        } else if (!/^\d{4}$/.test(values.postcode)) {
            errors.postcode = 'Ongeldige postcode';
        }
    }

    // Add minimum order validation for delivery
    if (values.delivery_method === 'delivery' && values.postcode) {
        const { restaurant, minimumAmount } = findRestaurantByPostalCode(restaurants, selectedRestaurant, values.postcode);
        if (restaurant && minimumAmount) {
            if (totalAmount < minimumAmount) {
                errors.postcode = `Minimum bestelbedrag voor ${values.postcode} is €${minimumAmount.toFixed(2)}`;
            }
        }
    }

    // Add strict postal code validation for delivery orders
    if (values.delivery_method === 'delivery' && values.postcode && selectedRestaurant) {
        if (!selectedRestaurant.allowed_postalcodes?.includes(values.postcode)) {
            const availableRestaurant = restaurants.find(r =>
                r.allowed_postalcodes?.includes(values.postcode)
            );

            errors.postcode = availableRestaurant
                ? `${selectedRestaurant.name} levert niet in ${values.postcode}. Kies ${availableRestaurant.name} voor bezorging in deze zone.`
                : `We bezorgen niet in ${values.postcode}.`;
        }
    }

    if (values.company && !values.vatNumber) {
        errors.vatNumber = 'BTW nummer is verplicht wanneer een bedrijfsnaam is ingevuld';
    }

    if (values.vatNumber) {
        // Basic Belgian VAT number validation
        const vatRegex = /^BE[0-9]{10}$/;
        if (!vatRegex.test(values.vatNumber.replace(/\s/g, ''))) {
            errors.vatNumber = 'Ongeldig BTW nummer formaat (bijv. BE0123456789)';
        }
    }

    return errors;
}; 