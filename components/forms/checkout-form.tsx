"use client";

import { Formik, FormikErrors } from 'formik';
import AppData from "@/data/app.json";

interface CheckoutFormValues {
    firstname: string
    lastname: string
    email: string
    tel: string
    company: string
    city: string
    address: string
    postcode: string
    message: string
    payment_method: number
}

const CheckoutForm = () => {
    return (
        <>
            {/* checkout form */}
            <Formik
                initialValues={{ firstname: '', lastname: '', email: '', tel: '', company: '', city: '', address: '', postcode: '', message: '', payment_method: 1 }}
                validate={values => {
                    const errors: FormikErrors<CheckoutFormValues> = {}
                    if (!values.email) {
                        errors.email = 'Verplicht'
                    } else if (
                        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                    ) {
                        errors.email = 'Ongeldige mailadres'
                    }
                    return errors;
                }}
                onSubmit={(values, { setSubmitting }) => {
                    const form = document.getElementById("checkoutForm") as HTMLFormElement
                    const status = document.getElementById("checkoutFormStatus")
                    const data = new FormData()

                    data.append('firstname', values.firstname)
                    data.append('lastname', values.lastname)
                    data.append('email', values.email)
                    data.append('tel', values.tel)
                    data.append('company', values.company)
                    data.append('city', values.city)
                    data.append('address', values.address)
                    data.append('postcode', values.postcode)
                    data.append('message', values.message)
                    data.append('payment_method', values.payment_method.toString())

                    if (form && status) {
                        fetch(form.action, {
                            method: 'POST',
                            body: data,
                            headers: {
                                'Accept': 'application/json'
                            }
                        }).then(response => {
                            if (response.ok) {
                                status.innerHTML = "<h5>Thanks, your message is sent successfully.</h5>";
                                form.reset()
                            } else {
                                response.json().then(data => {
                                    if (Object.hasOwn(data, 'errors')) {
                                        status.innerHTML = data["errors"].map((error: any) => error["message"]).join(", ")
                                    } else {
                                        status.innerHTML = "<h5>Oops! There was a problem submitting your form</h5>"
                                    }
                                })
                            }
                        }).catch(error => {
                            status.innerHTML = "<h5>Oops! There was a problem submitting your form</h5>"
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
                    <form onSubmit={handleSubmit} id="checkoutForm" action={AppData.settings.formspreeURL} className="tst-checkout-form">
                        <div className="tst-mb-30">
                            <h5>Factuurgegevens</h5>
                        </div>
                        <div className="row">
                            <div className="col-lg-6">
                                <div className="tst-group-input">
                                    <label>Voornaam</label>
                                    <input
                                        type="text"
                                        placeholder="Voornaam"
                                        name="firstname"
                                        required={true}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.firstname}
                                    />
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="tst-group-input">
                                    <label>Familienaam</label>
                                    <input
                                        type="text"
                                        placeholder="Familienaam"
                                        name="lastname"
                                        required={true}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.lastname}
                                    />
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="tst-group-input">
                                    <label>Bedrijfsnaam (optioneel)</label>
                                    <input
                                        type="text"
                                        placeholder="Bedrijfsnaam"
                                        name="company"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.company}
                                    />
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="tst-group-input">
                                    <label>Postcode</label>
                                    <input
                                        type="text"
                                        placeholder="2600"
                                        name="postcode"
                                        required={true}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.postcode}
                                    />
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="tst-group-input">
                                    <label>Stad</label>
                                    <input
                                        type="text"
                                        placeholder="Berchem"
                                        name="city"
                                        required={true}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.city}
                                    />
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="tst-group-input">
                                    <label>Adres</label>
                                    <input
                                        type="text"
                                        placeholder="Diksmuidelaan 170"
                                        name="address"
                                        required={true}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.address}
                                    />
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="tst-group-input">
                                    <label>Telefoon</label>
                                    <input
                                        type="tel"
                                        placeholder="04 XX XX XX XX"
                                        name="tel"
                                        required={true}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.tel}
                                    />
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="tst-group-input">
                                    <label>Email</label>
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
                            </div>
                        </div>
                        <div className="tst-mb-30">
                            <h5>Extra informatie</h5>
                        </div>
                        <div className="tst-group-input">
                            <label>Opmerking</label>
                            <textarea
                                placeholder="Extra opmerkingen"
                                name="message"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.message}
                            />
                        </div>
                        <div className="tst-mb-30">
                            <h5 className="tst-mb-30">Betaalmethode</h5>
                            <ul>
                                <li className="tst-radio">
                                    <input type="radio" id="option-1" name="payment_method" defaultChecked value="1" />
                                    <label htmlFor="option-1">Bankoverschrijving</label>
                                    <div className="tst-check"></div>
                                </li>
                                <li className="tst-radio">
                                    <input type="radio" id="option-2" name="payment_method" value="2" />
                                    <label htmlFor="option-2">Cash</label>
                                    <div className="tst-check"></div>
                                </li>
                            </ul>
                        </div>
                        {/* button */}
                        <button type="submit" className="tst-btn tst-btn-with-icon tst-m-0">
                            <span className="tst-icon">
                                <img src="/img/ui/icons/arrow.svg" alt="icon" />
                            </span>
                            <span>Plaats bestelling</span>
                        </button>
                        {/* button end */}

                        <div id="checkoutFormStatus" className="form-status"></div>
                    </form>
                )}
            </Formik>
            {/* contact form end */}
        </>
    )
}

export default CheckoutForm