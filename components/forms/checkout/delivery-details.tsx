'use client'

import { FormFieldProps } from '@/lib/types';

interface DeliveryDetailsProps extends FormFieldProps { }

export const DeliveryDetails = ({ values, errors, touched, handleChange, handleBlur }: DeliveryDetailsProps) => {
    return (
        <>
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
                            id="checkout-firstname"
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
                <div className="col-lg-6">
                    <div className="tst-group-input">
                        <label>Familienaam</label>
                        <input
                            type="text"
                            placeholder="Familienaam"
                            name="lastname"
                            id="checkout-lastname"
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
                <div className="col-lg-6">
                    <div className="tst-group-input">
                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="Email"
                            name="email"
                            id="checkout-email"
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
                <div className="col-lg-6">
                    <div className="tst-group-input">
                        <label>Telefoon</label>
                        <input
                            type="tel"
                            placeholder="04 XX XX XX XX"
                            name="tel"
                            id="checkout-tel"
                            className={errors.tel && touched.tel ? 'error' : ''}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.tel}
                        />
                        {errors.tel && touched.tel && (
                            <div className="error-message">{errors.tel}</div>
                        )}
                    </div>
                </div>
                <div className="col-lg-6">
                    <div className="tst-group-input">
                        <label>Bedrijfsnaam (optioneel)</label>
                        <input
                            type="text"
                            placeholder="Bedrijfsnaam"
                            name="company"
                            id="checkout-company"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.company}
                        />
                    </div>
                </div>
                {values.company && (
                    <div className="col-lg-6">
                        <div className="tst-group-input">
                            <label>BTW nummer</label>
                            <input
                                type="text"
                                placeholder="BE0123456789"
                                name="vatNumber"
                                id="checkout-vatNumber"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.vatNumber}
                            />
                        </div>
                    </div>
                )}
                <div className="col-lg-6">
                    <div className="tst-group-input">
                        <label>Postcode</label>
                        <input
                            type="text"
                            placeholder="2600"
                            name="postcode"
                            id="checkout-postcode"
                            className={errors.postcode && touched.postcode ? 'error' : ''}
                            required={values.delivery_method === 'leveren'}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.postcode}
                        />
                        {errors.postcode && touched.postcode && (
                            <div className="error-message" data-testid="postcode-error">{errors.postcode}</div>
                        )}
                    </div>
                </div>
                <div className="col-lg-6">
                    <div className="tst-group-input">
                        <label>Stad</label>
                        <input
                            type="text"
                            placeholder="Berchem"
                            name="city"
                            id="checkout-city"
                            className={errors.city && touched.city ? 'error' : ''}
                            required={values.delivery_method === 'leveren'}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.city}
                        />
                        {errors.city && touched.city && (
                            <div className="error-message">{errors.city}</div>
                        )}
                    </div>
                </div>
                <div className="col-lg-6">
                    <div className="tst-group-input">
                        <label>Adres</label>
                        <input
                            type="text"
                            placeholder="Diksmuidelaan 170"
                            name="address"
                            id="checkout-address"
                            className={errors.address && touched.address ? 'error' : ''}
                            required={values.delivery_method === 'leveren'}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.address}
                        />
                        {errors.address && touched.address && (
                            <div className="error-message">{errors.address}</div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}; 