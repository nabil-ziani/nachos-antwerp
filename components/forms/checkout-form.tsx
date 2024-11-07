"use client";

import { Formik, FormikErrors } from 'formik';
import AppData from "@/data/app.json";
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import { Restaurant } from '@/lib/types';
import { PayconiqButton } from '../payconiq-button';
import { useCart } from '@/hooks/useCart';
import { v4 as uuidv4 } from 'uuid';

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
    const { cartTotal: totalAmount, cartItems } = useCart()
    const [orderId] = useState(uuidv4());

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

                    // Required fields validation
                    if (!values.firstname) errors.firstname = 'Verplicht'
                    if (!values.lastname) errors.lastname = 'Verplicht'
                    if (!values.tel) errors.tel = 'Verplicht'

                    // Email validation
                    if (!values.email) {
                        errors.email = 'Verplicht'
                    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
                        errors.email = 'Ongeldige mailadres'
                    }

                    // Address validation for delivery
                    if (values.delivery_method === 'leveren') {
                        if (!values.address) errors.address = 'Verplicht'
                        if (!values.city) errors.city = 'Verplicht'
                        if (!values.postcode) errors.postcode = 'Verplicht'
                    }

                    return errors
                }}

                onSubmit={async (values, { setSubmitting }) => {
                    try {
                        const form = document.getElementById("checkoutForm") as HTMLFormElement;
                        const status = document.getElementById("checkoutFormStatus");

                        if (!form || !status) return;

                        const orderData = {
                            order_id: orderId,
                            payment_method: values.payment_method === 'bankoverschrijving' ? 'payconiq' : 'cash',
                            payment_status: 'pending',
                            amount: totalAmount,
                            customer_name: `${values.firstname} ${values.lastname}`,
                            customer_email: values.email,
                            customer_phone: values.tel,
                            customer_company: values.company || null,
                            delivery_method: values.delivery_method,
                            delivery_address: values.delivery_method === 'leveren' ? {
                                street: values.address,
                                city: values.city,
                                postcode: values.postcode
                            } : null,
                            order_items: cartItems.map(item => ({
                                title: item.title,
                                price: item.price,
                                quantity: item.quantity,
                                total: item.price * item.quantity,
                                currency: item.currency,
                                image: item.image
                            })),
                            notes: values.message
                        };

                        // Store order in Supabase first
                        const supabase = createClient();
                        const { error: dbError } = await supabase
                            .from('orders')
                            .insert([orderData]);

                        if (dbError) throw dbError;

                        // Handle payment based on selected method
                        if (values.payment_method === 'cash') {
                            // Handle cash payment
                            const response = await fetch(form.action, {
                                method: 'POST',
                                body: JSON.stringify(orderData),
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json'
                                }
                            });

                            if (!response.ok) throw new Error('Form submission failed');

                            status.innerHTML = "<h5>Bedankt! Uw bestelling is succesvol geplaatst.</h5>";
                            form.reset();
                        }
                        // For Payconiq, the PayconiqButton component will handle the payment flow
                    } catch (error) {
                        console.error('Order submission failed:', error);
                        const status = document.getElementById("checkoutFormStatus");
                        if (status) {
                            status.innerHTML = "<h5>Er is een probleem opgetreden. Probeer het opnieuw.</h5>";
                        }
                    } finally {
                        setSubmitting(false);
                    }
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
                    isValid,
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
                                        <input
                                            type="radio"
                                            id="option-1"
                                            name="payment_method"
                                            value="bankoverschrijving"
                                            checked={values.payment_method === 'bankoverschrijving'}
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="option-1">Bankoverschrijving</label>
                                        <div className="tst-check"></div>
                                    </li>
                                    <li className="tst-radio">
                                        <input
                                            type="radio"
                                            id="option-2"
                                            name="payment_method"
                                            value="cash"
                                            checked={values.payment_method === 'cash'}
                                            onChange={handleChange}
                                        />
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
                        <div className="tst-button-group">
                            {values.payment_method === 'bankoverschrijving' ? (
                                // Payconiq payment flow
                                <PayconiqButton
                                    amount={totalAmount}
                                    orderId={orderId}
                                    className="tst-btn tst-btn-with-icon tst-m-0"
                                    disabled={!isValid || isSubmitting}
                                    formValues={{
                                        ...values,
                                        cartItems,
                                        delivery_method: values.delivery_method,
                                    }}
                                    onPaymentCreated={(checkoutUrl) => {
                                        const status = document.getElementById("checkoutFormStatus")
                                        if (status) {
                                            status.innerHTML = "<h5>U wordt doorgestuurd naar Payconiq...</h5>"
                                        }
                                    }}
                                    onPaymentError={(error) => {
                                        const status = document.getElementById("checkoutFormStatus")
                                        if (status) {
                                            status.innerHTML = "<h5>Er is een probleem opgetreden. Probeer het opnieuw.</h5>"
                                        }
                                    }}
                                />
                            ) : (
                                // Cash payment flow - regular form submission
                                <button
                                    type="submit"
                                    className="tst-btn tst-btn-with-icon tst-m-0"
                                    onClick={() => {
                                        // Here you can add any pre-submission logic
                                        console.log('Submitting cash payment order')
                                    }}
                                >
                                    <span className="tst-icon">
                                        <img src="/img/ui/icons/arrow.svg" alt="icon" />
                                    </span>
                                    <span>Plaats bestelling</span>
                                </button>
                            )}
                        </div>
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

    if (error) {
        console.error('Error fetching restaurants:', error)
        return null
    }

    return restaurants
}

export default CheckoutForm