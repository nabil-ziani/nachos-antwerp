"use client";

import { Formik } from 'formik';
import AppData from "@/data/app.json";
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import { useCart } from '@/hooks/useCart';
import { useRouter } from 'next/navigation';
import { useRestaurant } from '@/contexts/restaurant-context';
import { LocationConfirmation } from '@/components/location-confirmation';
import { validateCheckoutForm } from '@/lib/checkout-validation';
import { DeliveryDetails } from './checkout/delivery-details';
import { PaymentMethods } from './checkout/payment-methods';
import { FormButtons } from './checkout/form-buttons';
import { CheckoutFormValues } from '@/lib/types';

const CheckoutForm = () => {
    const [orderId] = useState(crypto.randomUUID())
    const [savedDetails, setSavedDetails] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)

    const router = useRouter()
    const { cartTotal: totalAmount, cartItems } = useCart()
    const { findRestaurantByPostalCode, selectedRestaurant } = useRestaurant()

    useEffect(() => {
        const loadSavedDetails = () => {
            if (typeof window === 'undefined') return null;

            try {
                const saved = localStorage.getItem('user-checkout-details')
                return saved ? JSON.parse(saved) : null
            } catch (error) {
                console.error('Error loading saved details:', error)
                return null
            }
        }

        const details = loadSavedDetails()
        setSavedDetails(details)
        setIsLoading(false)
    }, [])

    // Check localStorage before rendering form
    if (isLoading) return null;

    const initialValues: CheckoutFormValues = {
        firstname: savedDetails?.firstname || '',
        lastname: savedDetails?.lastname || '',
        email: savedDetails?.email || '',
        tel: savedDetails?.tel || '',
        company: savedDetails?.company || '',
        city: savedDetails?.city || '',
        address: savedDetails?.address || '',
        postcode: savedDetails?.postcode || '',
        message: '',
        payment_method: 'bankoverschrijving',
        delivery_method: 'afhalen',
        remember_details: true
    }

    const handleSubmit = async (values: CheckoutFormValues, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
        try {
            // Check minimum order amount for delivery orders
            if (values.delivery_method === 'leveren' && values.postcode) {
                const { minimumAmount } = findRestaurantByPostalCode(values.postcode);
                if (minimumAmount && totalAmount < minimumAmount) {
                    const status = document.getElementById("checkoutFormStatus");
                    if (status) {
                        status.className = "tst-form-status error";
                        status.innerHTML = `
                            <h5>Minimum bestelbedrag niet bereikt</h5>
                            <p>Voor bezorging in ${values.postcode} is het minimum bestelbedrag €${minimumAmount.toFixed(2)}</p>
                        `;
                    }
                    setSubmitting(false);
                    return;
                }
            }

            if (values.remember_details) {
                const detailsToSave = {
                    firstname: values.firstname,
                    lastname: values.lastname,
                    email: values.email,
                    tel: values.tel,
                    company: values.company,
                    city: values.city,
                    address: values.address,
                    postcode: values.postcode,
                }
                localStorage.setItem('user-checkout-details', JSON.stringify(detailsToSave))
            }

            if (values.payment_method === 'cash') {
                const orderData = {
                    order_id: orderId,
                    payment_method: 'cash',
                    payment_status: 'completed',
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

                const supabase = createClient();
                const { error: dbError } = await supabase
                    .from('orders')
                    .insert([orderData]);

                if (dbError) throw dbError;
                router.push(`/order-confirmation/${orderId}`);
            }
        } catch (error) {
            console.error('Order submission failed:', error);
            const status = document.getElementById("checkoutFormStatus");
            if (status) {
                status.className = "tst-form-status error";
                status.innerHTML = `
                    <h5>Er is een probleem opgetreden</h5>
                    <p>Probeer het opnieuw of neem contact met ons op.</p>
                `;
            }
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <>
            <Formik
                initialValues={initialValues}
                validate={(values) => validateCheckoutForm(values, totalAmount, findRestaurantByPostalCode)}
                onSubmit={handleSubmit}
            >
                {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, isValid }) => (
                    <form onSubmit={handleSubmit} id="checkoutForm" action={AppData.settings.formspreeURL} className="tst-checkout-form">
                        <LocationConfirmation selectedRestaurant={selectedRestaurant} />

                        <DeliveryDetails
                            values={values}
                            errors={errors}
                            touched={touched}
                            handleChange={handleChange}
                            handleBlur={handleBlur}
                            findRestaurantByPostalCode={findRestaurantByPostalCode}
                        />

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

                        <div className="tst-group-input">
                            <div className="tst-radio">
                                <input
                                    type="checkbox"
                                    id="remember-details"
                                    name="remember_details"
                                    checked={values.remember_details}
                                    onChange={handleChange}
                                />
                                <label htmlFor="remember-details">Onthoud mijn gegevens voor de volgende keer</label>
                                <div className="tst-check"></div>
                            </div>
                        </div>

                        <PaymentMethods
                            values={values}
                            handleChange={handleChange}
                        />

                        <FormButtons
                            values={values}
                            isValid={isValid}
                            isSubmitting={isSubmitting}
                            orderId={orderId}
                            totalAmount={totalAmount}
                            cartItems={cartItems}
                        />

                        <div id="checkoutFormStatus" className="tst-form-status"></div>
                    </form>
                )}
            </Formik>
        </>
    )
}

export default CheckoutForm