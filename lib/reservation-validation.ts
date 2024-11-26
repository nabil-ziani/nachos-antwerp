import { FormikErrors } from 'formik';

export interface ReservationFormValues {
    email: string;
    firstname: string;
    lastname: string;
    time: string;
    date: string;
    person: string;
    message: string;
}

export const defaultValues: ReservationFormValues = {
    email: '',
    firstname: '',
    lastname: '',
    time: '',
    date: '',
    person: '',
    message: '',
};

export const validateReservationForm = (values: ReservationFormValues) => {
    const errors: FormikErrors<ReservationFormValues> = {};

    if (!values.firstname) errors.firstname = 'Verplicht';
    if (!values.lastname) errors.lastname = 'Verplicht';

    if (!values.email) {
        errors.email = 'Verplicht';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
        errors.email = 'Ongeldige mailadres';
    }

    if (!values.date) errors.date = 'Verplicht';
    if (!values.time) errors.time = 'Verplicht';
    if (!values.person) errors.person = 'Verplicht';

    return errors;
};