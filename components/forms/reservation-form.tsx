"use client";

import { Formik } from 'formik';
import { createClient } from '@/utils/supabase/client';
import { ReservationFormValues, validateReservationForm, defaultValues } from '@/lib/reservation-validation';
import { useRestaurant } from '@/contexts/restaurant-context';

const ReservationForm = () => {
    const supabase = createClient();
    const { selectedRestaurant } = useRestaurant();

    const handleSubmit = async (values: ReservationFormValues, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
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
                                        type="text"
                                        placeholder="Familienaam"
                                        name="lastname"
                                        required={true}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.lastname}
                                    />
                                    {errors.lastname && touched.lastname && (
                                        <div className="error-message">{errors.lastname}</div>
                                    )}
                                </div>
                            </div>
                            <div className="col-6 col-md-4">
                                <div className="tst-group-input">
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        name="email"
                                        required={true}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.email}
                                    />
                                    {errors.email && touched.email && (
                                        <div className="error-message">{errors.email}</div>
                                    )}
                                </div>
                            </div>
                            <div className="col-6 col-md-4">
                                <div className="tst-group-input">
                                    <select name="person" className="wide" onChange={handleChange} onBlur={handleBlur} value={values.person}>
                                        <option>Aantal Personen</option>
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
                            <div className="col-6 col-md-4">
                                <div className="tst-group-input">
                                    <input
                                        type="date"
                                        name="date"
                                        required={true}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.date}
                                    />
                                    {errors.date && touched.date && (
                                        <div className="error-message">{errors.date}</div>
                                    )}
                                </div>
                            </div>
                            <div className="col-6 col-md-4">
                                <div className="tst-group-input">
                                    <select name="time" className="wide" onChange={handleChange} onBlur={handleBlur} value={values.time}>
                                        <option>Tijd</option>
                                        <option value="5:00pm">17:00</option>
                                        <option value="6:00pm">18:00</option>
                                        <option value="7:00pm">19:00</option>
                                        <option value="8:00pm">20:00</option>
                                        <option value="9:00pm">21:00</option>
                                        <option value="10:00pm">22:00</option>
                                        <option value="11:00pm">23:00</option>
                                    </select>
                                    {errors.time && touched.time && (
                                        <div className="error-message">{errors.time}</div>
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
                        <button className="tst-btn" type="submit" name="button" disabled={!isValid || isSubmitting}>
                            <span>{isSubmitting ? 'Laden...' : 'Reserveer Tafel'}</span>
                            {isSubmitting && <div className="spinner" />}
                        </button>

                        <div id="reservationFormStatus" className="tst-form-status"></div>
                    </form>
                )}
            </Formik>
        </>
    )
}

export default ReservationForm