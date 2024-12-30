"use client";

import { Formik } from 'formik';
import AppData from "@/data/app.json";
import { validateContactForm } from '@/lib/contact-validation';

interface ContactFormValues {
    email: string;
    phone: string;
    first_name: string;
    last_name: string;
    message: string;
}

const defaultValues: ContactFormValues = {
    email: '',
    phone: '',
    first_name: '',
    last_name: '',
    message: ''
};

const ContactForm = () => {
    return (
        <>
            <Formik
                initialValues={defaultValues}
                validate={validateContactForm}
                validateOnMount={true}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                    const form = document.getElementById("contactForm") as HTMLFormElement;
                    const status = document.getElementById("contactFormStatus");
                    const data = new FormData();

                    data.append('first_name', values.first_name);
                    data.append('last_name', values.last_name);
                    data.append('email', values.email);
                    data.append('phone', values.phone);
                    data.append('message', values.message);

                    if (form && status) {
                        fetch(form.action, {
                            method: 'POST',
                            body: data,
                            headers: {
                                'Accept': 'application/json'
                            }
                        }).then(response => {
                            if (response.ok) {
                                status.innerHTML = "<h5 style='color:green;'>Bedankt voor je bericht!</h5>";
                                resetForm();
                            } else {
                                response.json().then(data => {
                                    if (Object.hasOwn(data, 'errors')) {
                                        status.innerHTML = "<h5 style='color:red;'>" + data["errors"].map((error: any) => error["message"]).join(", ") + "</h5>";
                                    } else {
                                        status.innerHTML = "<h5 style='color:red;'>Oeps! Er ging iets mis tijdens het versturen van je bericht</h5>";
                                    }
                                });
                            }
                        }).catch(error => {
                            console.error(error);
                            status.innerHTML = "<h5 style='color:red;'>Oeps! Er ging iets mis tijdens het versturen van je bericht</h5>";
                        });
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
                }) => (
                    <form onSubmit={handleSubmit} id="contactForm" action={AppData.settings.formspreeURL}>
                        <div className="row">
                            <div className="col-lg-6">
                                <div className="tst-group-input">
                                    <input
                                        type="text"
                                        placeholder="Voornaam"
                                        name="first_name"
                                        className={errors.first_name && touched.first_name ? 'error' : ''}
                                        required={true}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.first_name}
                                    />
                                    {errors.first_name && touched.first_name && (
                                        <span className="error-message">{errors.first_name}</span>
                                    )}
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="tst-group-input">
                                    <input
                                        type="text"
                                        placeholder="Familienaam"
                                        name="last_name"
                                        className={errors.last_name && touched.last_name ? 'error' : ''}
                                        required={true}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.last_name}
                                    />
                                    {errors.last_name && touched.last_name && (
                                        <span className="error-message">{errors.last_name}</span>
                                    )}
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="tst-group-input">
                                    <input
                                        type="tel"
                                        placeholder="Telefoon"
                                        name="phone"
                                        className={errors.phone && touched.phone ? 'error' : ''}
                                        required={true}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.phone}
                                    />
                                    {errors.phone && touched.phone && (
                                        <span className="error-message">{errors.phone}</span>
                                    )}
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="tst-group-input">
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        name="email"
                                        className={errors.email && touched.email ? 'error' : ''}
                                        required={true}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.email}
                                    />
                                    {errors.email && touched.email && (
                                        <span className="error-message">{errors.email}</span>
                                    )}
                                </div>
                            </div>
                            <div className="col-lg-12">
                                <div className="tst-group-input">
                                    <textarea
                                        placeholder="Bericht"
                                        name="message"
                                        className={errors.message && touched.message ? 'error' : ''}
                                        required={true}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.message}
                                        rows={4}
                                    />
                                    {errors.message && touched.message && (
                                        <span className="error-message">{errors.message}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <button
                            className="tst-btn"
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Versturen...' : 'Stuur Bericht'}
                        </button>

                        <div id="contactFormStatus" className="tst-form-status"></div>
                    </form>
                )}
            </Formik>
        </>
    );
};

export default ContactForm;