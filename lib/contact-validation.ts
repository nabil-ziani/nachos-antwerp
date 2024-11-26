import { FormikErrors } from 'formik';

interface ContactFormValues {
    email: string;
    phone: string;
    first_name: string;
    last_name: string;
    message: string;
}

export const validateContactForm = (values: ContactFormValues) => {
    const errors: FormikErrors<ContactFormValues> = {};

    if (!values.first_name) errors.first_name = 'Verplicht';
    if (!values.last_name) errors.last_name = 'Verplicht';

    if (!values.email) {
        errors.email = 'Verplicht';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
        errors.email = 'Ongeldige mailadres';
    }

    if (!values.phone) errors.phone = 'Verplicht';
    if (!values.message) errors.message = 'Verplicht';

    return errors;
};