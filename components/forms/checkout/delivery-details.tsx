'use client'

import { useState } from 'react'
import { LocationSwitchModal } from '@/components/modals/location-switch-modal'
import { FormFieldProps, Restaurant } from '@/lib/types';

type LocationSwitchData = {
    restaurant: Restaurant | null;
    postalCode: string;
}

interface DeliveryDetailsProps extends FormFieldProps {
    findRestaurantByPostalCode: any;
}

export const DeliveryDetails = ({ values, errors, touched, handleChange, handleBlur, findRestaurantByPostalCode }: DeliveryDetailsProps) => {
    const [showLocationModal, setShowLocationModal] = useState(false)
    const [locationSwitchData, setLocationSwitchData] = useState<LocationSwitchData>({ restaurant: null, postalCode: '' })

    const handlePostcodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const postalCode = e.target.value
        handleChange(e)

        if (values.delivery_method === 'leveren' && postalCode.length === 4) {
            const result = findRestaurantByPostalCode(postalCode)

            if (result.switchRequired) {
                setLocationSwitchData({
                    restaurant: result.restaurant,
                    postalCode: postalCode
                })
                setShowLocationModal(true)
            }
        }
    }

    return (
        <>
            <LocationSwitchModal
                isOpen={showLocationModal}
                onClose={() => setShowLocationModal(false)}
                onConfirm={() => setShowLocationModal(false)}
                alternativeRestaurant={locationSwitchData.restaurant}
                postalCode={locationSwitchData.postalCode}
            />

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
                            className={errors.postcode && touched.postcode ? 'error' : ''}
                            required={values.delivery_method === 'leveren'}
                            onChange={handlePostcodeChange}
                            onBlur={handleBlur}
                            value={values.postcode}
                        />
                        {errors.postcode && touched.postcode && (
                            <div className="error-message">{errors.postcode}</div>
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