"use client";

import { Formik } from 'formik';
import AppData from "@/data/app.json";
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import { useCart } from '@/hooks/useCart';
import { useRouter } from 'next/navigation';
import { useRestaurant } from '@/contexts/restaurant-context';
import { LocationConfirmation } from '@/components/location-confirmation';
import { defaultValues, validateCheckoutForm } from '@/lib/checkout-validation';
import { DeliveryDetails } from './checkout/delivery-details';
import { PaymentMethods } from './checkout/payment-methods';
import { FormButtons } from './checkout/form-buttons';
import { CheckoutFormValues } from '@/lib/types';
import { LoadingSpinner } from "@/components/loading-spinner";
import { findRestaurantByPostalCode } from '@/utils/location';
import { geocodeAddress } from '@/utils/geocode';
import { createOrderData } from '@/utils/order-utils';

const CheckoutForm = () => {
    const [orderId] = useState(crypto.randomUUID())
    const [isLoading, setIsLoading] = useState(true)
    const [initialValues, setInitialValues] = useState(defaultValues)

    const router = useRouter()
    const { cartTotal: totalAmount, cartItems } = useCart()
    const { selectedRestaurant, restaurants } = useRestaurant()

    useEffect(() => {
        const loadSavedDetails = () => {
            if (typeof window === 'undefined' || !selectedRestaurant) return;

            try {
                const saved = localStorage.getItem('user-checkout-details')
                if (!saved) {
                    setIsLoading(false)
                    return
                }

                const parsedDetails = JSON.parse(saved)

                // Validate all fields using existing validation
                const errors = validateCheckoutForm({ values: parsedDetails, totalAmount, selectedRestaurant, restaurants })

                // If there are validation errors, clear the problematic fields
                if (Object.keys(errors).length > 0) {
                    console.log('Validation errors:', errors)
                    Object.keys(errors).forEach(field => {
                        parsedDetails[field] = defaultValues[field as keyof CheckoutFormValues] || '';
                    });
                    // Save the cleaned details back to localStorage
                    localStorage.setItem('user-checkout-details', JSON.stringify(parsedDetails))
                }

                // Update initialValues with validated details
                setInitialValues(prev => ({
                    ...prev,
                    ...parsedDetails
                }))
            } catch (error) {
                console.error('Error loading saved details:', error)
            } finally {
                setIsLoading(false)
            }
        }

        loadSavedDetails()
    }, [selectedRestaurant, totalAmount])

    // Check localStorage before rendering form
    if (isLoading) {
        return (
            <div className="container py-5">
                <div className="row">
                    <div className="col-12 text-center">
                        <LoadingSpinner />
                        <p className="mt-3">Gegevens laden...</p>
                    </div>
                </div>
            </div>
        );
    }

    const handleSubmit = async (values: CheckoutFormValues, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
        try {
            // Check minimum order amount for delivery orders
            if (values.delivery_method === 'leveren' && values.postcode) {
                const { minimumAmount } = findRestaurantByPostalCode(restaurants, selectedRestaurant, values.postcode);
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
                    vatNumber: values.vatNumber,
                    city: values.city,
                    address: values.address,
                    postcode: values.postcode,
                    payment_method: values.payment_method,
                    delivery_method: values.delivery_method,
                    message: values.message
                }
                localStorage.setItem('user-checkout-details', JSON.stringify(detailsToSave))
            }

            // Geocode address
            const address = `${values.address}, ${values.postcode} ${values.city}`;
            const coordinates = await geocodeAddress(address);

            if (!coordinates) {
                console.error('Failed to geocode address');
                setSubmitting(false);
                return;
            }

            const orderData = createOrderData(
                orderId,
                values,
                totalAmount,
                cartItems,
                selectedRestaurant,
                coordinates
            );

            const supabase = createClient();
            const { error: dbError } = await supabase
                .from('orders')
                .insert([orderData]);

            if (dbError) throw dbError;

            router.push(`/order-confirmation/${orderId}`);
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
                validate={(values: CheckoutFormValues) => validateCheckoutForm({ values, totalAmount, selectedRestaurant, restaurants })}
                validateOnMount={true}
                onSubmit={handleSubmit}
                enableReinitialize={true}
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
                            selectedRestaurant={selectedRestaurant}
                        />

                        <div id="checkoutFormStatus" className="tst-form-status"></div>
                    </form>
                )}
            </Formik>
        </>
    )
}

export default CheckoutForm