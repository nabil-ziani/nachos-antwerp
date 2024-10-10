"use client";

import { Formik, FormikErrors } from 'formik';
import AppData from "@/data/app.json";

interface ContactFormValues {
    email: string
    phone: string
    first_name: string
    last_name: string
    message: string
}

const ContactForm = () => {
    return (
        <>
            {/* contact form */}
            <Formik
                initialValues={{ email: '', phone: '', first_name: '', last_name: '', message: '' }}
                validate={values => {
                    const errors: FormikErrors<ContactFormValues> = {};
                    if (!values.email) {
                        errors.email = 'Verplicht';
                    } else if (
                        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                    ) {
                        errors.email = 'Ongeldige mailadres';
                    }
                    return errors;
                }}
                onSubmit={(values, { setSubmitting }) => {
                    const form = document.getElementById("contactForm") as HTMLFormElement
                    const status = document.getElementById("contactFormStatus")
                    const data = new FormData();

                    data.append('first_name', values.first_name)
                    data.append('last_name', values.last_name)
                    data.append('email', values.email)
                    data.append('phone', values.phone)
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
                    <form onSubmit={handleSubmit} id="contactForm" action={AppData.settings.formspreeURL}>
                        <div className="row">
                            <div className="col-lg-6">
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
                            <div className="col-lg-6">
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
                            <div className="col-lg-6">
                                <input
                                    type="tel"
                                    placeholder="Telefoon"
                                    name="phone"
                                    required={true}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.phone}
                                />
                            </div>
                            <div className="col-lg-6">
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
                            <div className="col-lg-12">
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
                        <button className="tst-btn" type="submit" name="button">Stuur Bericht</button>

                        <div id="contactFormStatus" className="tst-form-status"></div>
                    </form>
                )}
            </Formik>
            {/* contact form end */}
        </>
    );
};
export default ContactForm;