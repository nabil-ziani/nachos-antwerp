"use client";

import { Formik, FormikErrors } from 'formik';
import AppData from "@/data/app.json";

interface ReservationFormValues {
    email: string
    first_name: string
    last_name: string
    time: string
    date: string
    person: string
    message: string
}

const ReservationForm = () => {
    return (
        <>
            {/* contact form */}
            <Formik
                initialValues={{ email: '', first_name: '', last_name: '', time: '', date: '', person: '', message: '' }}
                validate={values => {
                    const errors: FormikErrors<ReservationFormValues> = {}
                    if (!values.email) {
                        errors.email = 'Verplicht'
                    } else if (
                        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                    ) {
                        errors.email = 'Ongeldige mailadres'
                    }
                    return errors
                }}
                onSubmit={(values, { setSubmitting }) => {
                    const form = document.getElementById("reservationForm") as HTMLFormElement
                    const status = document.getElementById("reservationFormStatus")
                    const data = new FormData()

                    data.append('first_name', values.first_name)
                    data.append('last_name', values.last_name)
                    data.append('email', values.email)
                    data.append('person', values.person)
                    data.append('time', values.time)
                    data.append('date', values.date)
                    data.append('message', values.message)

                    if (form && status) {
                        fetch(form.action, {
                            method: 'POST',
                            body: data,
                            headers: {
                                'Accept': 'application/json'
                            }
                        }).then(response => {
                            if (response.ok) {
                                status.innerHTML = "<h5>Bedankt voor je bericht!</h5>"
                                form.reset()
                            } else {
                                response.json().then(data => {
                                    if (Object.hasOwn(data, 'errors')) {
                                        status.innerHTML = "<h5 style='color:red;'>" + data["errors"].map((error: any) => error["message"]).join(", ") + "</h5>"
                                    } else {
                                        status.innerHTML = "<h5 style='color:red;'>Oeps! Er ging iets mis tijdens het versturen van je bericht</h5>"
                                    }
                                })
                            }
                        }).catch(error => {
                            console.log(error)
                            status.innerHTML = "<h5 style='color:red;'>Oeps! Er ging iets mis tijdens het versturen van je bericht</h5>"
                        })
                    }

                    setSubmitting(false);
                }}
            >
                {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    isSubmitting,
                    /* and other goodies */
                }) => (
                    <form onSubmit={handleSubmit} id="reservationForm" action={AppData.settings.formspreeURL}>
                        <div className="row">
                            <div className="col-6 col-md-4">
                                <input
                                    type="text"
                                    placeholder="Voornaam"
                                    name="first_name"
                                    required={true}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.first_name}
                                />
                            </div>
                            <div className="col-6 col-md-4">
                                <input
                                    type="text"
                                    placeholder="Familienaam"
                                    name="last_name"
                                    required={true}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.last_name}
                                />
                            </div>
                            <div className="col-6 col-md-4">
                                <input
                                    type="email"
                                    placeholder="Email"
                                    name="email"
                                    required={true}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.email}
                                />
                            </div>
                            <div className="col-6 col-md-4">
                                <select name="person" className="wide">
                                    <option>Aantal Personen</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="3">5</option>
                                    <option value="3">6 of meer</option>
                                </select>
                            </div>
                            <div className="col-6 col-md-4">
                                <input
                                    type="date"
                                    name="date"
                                    required={true}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.date}
                                />
                            </div>
                            <div className="col-6 col-md-4">
                                <select name="time" className="wide">
                                    <option>Tijd</option>
                                    <option value="5:00pm">17:00</option>
                                    <option value="6:00pm">18:00</option>
                                    <option value="7:00pm">19:00</option>
                                    <option value="8:00pm">20:00</option>
                                    <option value="9:00pm">21:00</option>
                                    <option value="10:00pm">22:00</option>
                                    <option value="11:00pm">23:00</option>
                                </select>
                            </div>
                            <div className="col-12">
                                <textarea
                                    placeholder="Bericht"
                                    name="message"
                                    required={true}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.message}
                                    rows={4}
                                />
                            </div>
                        </div>
                        <button className="tst-btn" type="submit" name="button">Reserveer Tafel</button>

                        <div id="reservationFormStatus" className="tst-form-status"></div>
                    </form>
                )}
            </Formik>
            {/* contact form end */}
        </>
    );
};
export default ReservationForm;