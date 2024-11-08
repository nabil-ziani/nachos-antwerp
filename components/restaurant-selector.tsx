'use client'

import { useRestaurant } from '@/contexts/restaurant-context'

export function RestaurantSelector() {
    const {
        selectedRestaurant,
        setSelectedRestaurant,
        restaurants,
        locationStatus,
        findNearestLocation
    } = useRestaurant()

    if (restaurants.length === 0) {
        return (
            <div className="tst-restaurant-selector">
                <select disabled className="form-select">
                    <option>Locatie laden...</option>
                </select>
            </div>
        )
    }

    return (
        <div className="tst-restaurant-selector">
            {locationStatus === 'prompt' && (
                <div className="tst-location-prompt">
                    <button onClick={findNearestLocation} className="tst-location-button">
                        <i className="fas fa-location-arrow"></i>
                        Dichtstbijzijnde locatie zoeken
                    </button>
                </div>
            )}
            <select
                value={selectedRestaurant?.id || ''}
                onChange={(e) => {
                    const restaurant = restaurants.find(r => r.id === e.target.value)
                    if (restaurant) setSelectedRestaurant(restaurant)
                }}
                className="form-select"
            >
                <option value="" disabled>Kies een locatie</option>
                {locationStatus === 'denied' && (
                    <option value="" disabled>
                        ℹ️ Locatie delen uitgeschakeld
                    </option>
                )}
                {restaurants.map((restaurant) => (
                    <option key={restaurant.id} value={restaurant.id}>
                        Nacho's {restaurant.name}
                    </option>
                ))}
            </select>
        </div>
    )
} 