"use client";

import { Formik } from 'formik';
import { createClient } from '@/utils/supabase/client';
import { ReservationFormValues, validateReservationForm, defaultValues } from '@/lib/reservation-validation';
import { useRestaurant } from '@/contexts/restaurant-context';

const ReservationForm = () => {
    const supabase = createClient();
    const { selectedRestaurant } = useRestaurant();

    const handleSubmit = async (values: ReservationFormValues, { setSubmitting, resetForm }: { setSubmitting: (isSubmitting: boolean) => void, resetForm: () => void }) => {
        const status = document.getElementById("reservationFormStatus");

        try {
            const { error } = await supabase
                .from('reservations')
                .insert({
                    customer_name: `${values.firstname} ${values.lastname}`,
                    customer_email: values.email,
                    date: values.date,
                    time: values.time,
                    number_of_people: values.person,
                    message: values.message,
                    phone_number: values.phone,
                    restaurant_id: selectedRestaurant?.id
                });

            if (error) {
                console.error('Error saving reservation:', error);

                if (status) {
                    status.innerHTML = "<h5 style='color:red;'>Oeps! Er ging iets mis tijdens het opslaan van je reservering</h5>";
                }
                return;
            }

            // Send reservation notification email to restaurant owner
            const emailResponse = await fetch('/api/email/reservation-notification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ reservation: values })
            });

            if (emailResponse.ok) {
                if (status) {
                    status.innerHTML = "<h5 style='color:green;'>We hebben je reservering succesvol ontvangen!</h5>";
                }
                // Reset form after successful submission
                resetForm();
            } else {
                console.error('Error sending email:', await emailResponse.json());
            }
        } catch (error) {
            console.error('Error handling reservation:', error);

            if (status) {
                status.innerHTML = "<h5 style='color:red;'>Oeps! Er ging iets mis tijdens het verwerken van je reservering</h5>";
            }
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <>
            <Formik
                initialValues={defaultValues}
                validate={(values: ReservationFormValues) => validateReservationForm(values)}
                validateOnMount={true}
                onSubmit={handleSubmit}
                enableReinitialize={true}
            >
                {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, isValid }) => (
                    <form onSubmit={handleSubmit} id="reservationForm" className="tst-reservation-form">
                        <div className="row">
                            <div className="col-6 col-md-4">
                                <div className="tst-group-input">
                                    <input
                                        required={true}
                                        type="text"
                                        placeholder="Voornaam"
                                        name="firstname"
                                        className={errors.firstname && touched.firstname ? 'error' : ''}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.firstname}
                                    />
                                    {errors.firstname && touched.firstname && (
                                        <div className="error-message">{errors.firstname}</div>
                                    )}
                                </div>
                            </div>
                            <div className="col-6 col-md-4">
                                <div className="tst-group-input">
                                    <input
                                        required={true}
                                        type="text"
                                        placeholder="Familienaam"
                                        name="lastname"
                                        className={errors.lastname && touched.lastname ? 'error' : ''}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.lastname}
                                    />
                                    {errors.lastname && touched.lastname && (
                                        <div className="error-message">{errors.lastname}</div>
                                    )}
                                </div>
                            </div>
                            <div className="col-12 col-md-4">
                                <div className="tst-group-input">
                                    <input
                                        required={true}
                                        type="email"
                                        placeholder="Email"
                                        name="email"
                                        className={errors.email && touched.email ? 'error' : ''}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.email}
                                    />
                                    {errors.email && touched.email && (
                                        <div className="error-message">{errors.email}</div>
                                    )}
                                </div>
                            </div>
                            <div className="col-6 col-md-3">
                                <div className="tst-group-input">
                                    <select
                                        required={true}
                                        name="person"
                                        className={errors.person && touched.person ? 'error wide' : 'wide'}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.person}
                                    >
                                        <option value="">Aantal Personen</option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                        <option value="6">6 of meer</option>
                                    </select>
                                    {errors.person && touched.person && (
                                        <div className="error-message">{errors.person}</div>
                                    )}
                                </div>
                            </div>
                            <div className="col-6 col-md-3">
                                <div className="tst-group-input">
                                    <input
                                        required={true}
                                        type="date"
                                        name="date"
                                        className={errors.date && touched.date ? 'error' : ''}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.date}
                                    />
                                    {errors.date && touched.date && (
                                        <div className="error-message">{errors.date}</div>
                                    )}
                                </div>
                            </div>
                            <div className="col-6 col-md-3">
                                <div className="tst-group-input">
                                    <select
                                        required={true}
                                        name="time"
                                        className={errors.time && touched.time ? 'error wide' : 'wide'}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.time}
                                    >
                                        <option value="">Tijdstip</option>
                                        <option value="17:00">17:00</option>
                                        <option value="17:30">17:30</option>
                                        <option value="18:00">18:00</option>
                                        <option value="18:30">18:30</option>
                                        <option value="19:00">19:00</option>
                                        <option value="19:30">19:30</option>
                                        <option value="20:00">20:00</option>
                                        <option value="20:30">20:30</option>
                                        <option value="21:00">21:00</option>
                                        <option value="21:30">21:30</option>
                                    </select>
                                    {errors.time && touched.time && (
                                        <div className="error-message">{errors.time}</div>
                                    )}
                                </div>
                            </div>
                            <div className="col-6 col-md-3">
                                <div className="tst-group-input">
                                    <input
                                        required={true}
                                        type="tel"
                                        placeholder="Telefoonnummer"
                                        name="phone"
                                        className={errors.phone && touched.phone ? 'error' : ''}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.phone}
                                    />
                                    {errors.phone && touched.phone && (
                                        <div className="error-message">{errors.phone}</div>
                                    )}
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="tst-group-input">
                                    <textarea
                                        placeholder="Bericht"
                                        name="message"
                                        required={true}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.message}
                                        rows={4}
                                    />
                                    {errors.message && touched.message && (
                                        <div className="error-message">{errors.message}</div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="col-12">
                            <button
                                type="submit"
                                className="tst-btn tst-btn-md"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Laden...' : 'Reserveer nu'}
                                {isSubmitting && <div className="spinner" />}
                            </button>
                        </div>

                        <div id="reservationFormStatus" className="tst-form-status"></div>
                    </form>
                )}
            </Formik>
        </>
    )
}

export default ReservationForm