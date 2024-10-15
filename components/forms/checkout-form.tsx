"use client";

import { Formik, FormikErrors } from 'formik';
import AppData from "@/data/app.json";
import { createClient } from '@/utils/supabase/client';
import { Tables } from '@/database.types';
import { useEffect, useState } from 'react';
import { Restaurant } from '@/lib/types';

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
    payment_method: string
    delivery_method: string
}

const CheckoutForm = () => {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([])

    useEffect(() => {
        (async () => {
            const restaurants = await getRestaurants()

            if (restaurants) {
                setRestaurants(restaurants)
            }
        })
    }, [])

    return (
        <>
            {/* checkout form */}
            <Formik
                initialValues={{ firstname: '', lastname: '', email: '', tel: '', company: '', city: '', address: '', postcode: '', message: '', payment_method: 'bankoverschrijving', delivery_method: 'afhalen' }}
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
                    data.append('delivery_method', values.delivery_method.toString())

                    if (form && status) {
                        fetch(form.action, {
                            method: 'POST',
                            body: data,
                            headers: {
                                'Accept': 'application/json'
                            }
                        }).then(response => {
                            if (response.ok) {
                                // check if it is in allowed_locations and show correct message based upon restaurant
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

                        <div className="tst-mb-30 tst-space-between">
                            <div>
                                <h5 className="tst-mb-30">Betaalmethode</h5>
                                <ul>
                                    <li className="tst-radio">
                                        <input type="radio" id="option-1" name="payment_method" defaultChecked value="bankoverschrijving" />
                                        <label htmlFor="option-1">Bankoverschrijving</label>
                                        <div className="tst-check"></div>
                                    </li>
                                    <li className="tst-radio">
                                        <input type="radio" id="option-2" name="payment_method" value="cash" />
                                        <label htmlFor="option-2">Cash</label>
                                        <div className="tst-check"></div>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h5 className="tst-mb-30">Afhalen of leveren?</h5>
                                <ul>
                                    <li className="tst-radio">
                                        <input
                                            type="radio"
                                            id="afhalen"
                                            name="delivery_method"
                                            value="afhalen"
                                            checked={values.delivery_method === 'afhalen'}
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="afhalen">Afhalen</label>
                                        <div className="tst-check"></div>
                                    </li>
                                    <li className="tst-radio">
                                        <input
                                            type="radio"
                                            id="leveren"
                                            name="delivery_method"
                                            value="leveren"
                                            checked={values.delivery_method === 'leveren'}
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="leveren">Leveren</label>
                                        <div className="tst-check"></div>
                                    </li>
                                </ul>
                            </div>
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

const getRestaurants = async () => {
    const supabase = createClient()

    const { data: restaurants, error } = await supabase
        .from('restaurant_location')
        .select(`*`)
        .returns<Restaurant[]>()

    if (restaurants) {
        console.error('Error fetching menu items:', error);
    }

    return restaurants
}

export default CheckoutForm