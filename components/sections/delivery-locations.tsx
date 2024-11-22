'use client'

import { useRestaurant } from '@/contexts/restaurant-context'

export function DeliveryLocationsSection() {
    const { restaurants } = useRestaurant()

    return (
        <div className="tst-delivery-locations">
            <div className="text-center">
                <div className="tst-suptitle tst-suptitle-center tst-mb-15">Bezorggebieden</div>
                <h3 className="tst-mb-30">Waar bezorgen we?</h3>
                <p className="tst-text tst-mb-60">
                    Bekijk hieronder in welke postcodes we bezorgen vanuit onze restaurant.
                </p>
            </div>

            <div className="row">
                {restaurants.map((restaurant) => (
                    <div key={restaurant.id} className="col-lg-6 mb-4">
                        <div className="tst-location-card">
                            <h5 className="mb-3">{restaurant.name}</h5>
                            <p className="tst-text mb-3">{restaurant.address}</p>
                            <div className="tst-postal-codes">
                                <strong>Bezorging mogelijk in:</strong>
                                <p>{restaurant.allowed_postalcodes?.join(', ')}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
} 