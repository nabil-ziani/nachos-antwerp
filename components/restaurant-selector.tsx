'use client'

import { useRestaurant } from '@/contexts/restaurant-context'

export function RestaurantSelector() {
    const {
        selectedRestaurant,
        setSelectedRestaurant,
        restaurants,
        locationStatus,
        findNearestLocation,
        isLoading
    } = useRestaurant()

    if (isLoading) {
        return (
            <div className="tst-restaurant-selector">
                <select disabled className="form-select">
                    <option>Locatie laden...</option>
                </select>
            </div>
        )
    }

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (e.target.value === 'nearest') {
            findNearestLocation()
            return
        }

        const restaurant = restaurants.find(r => r.id === e.target.value)
        if (restaurant) setSelectedRestaurant(restaurant)
    }

    return (
        <div className="tst-restaurant-selector">
            <select
                value={selectedRestaurant?.id || ''}
                onChange={handleChange}
                className="form-select"
            >
                <option value="" disabled>Kies een locatie</option>
                {locationStatus === 'prompt' && (
                    <option value="nearest">
                        📍 Dichtstbijzijnde locatie zoeken
                    </option>
                )}
                {locationStatus === 'denied' && (
                    <option value="" disabled>
                        ℹ️ Locatie delen uitgeschakeld
                    </option>
                )}
                {restaurants.map((restaurant) => (
                    <option key={restaurant.id} value={restaurant.id}>
                        {restaurant.name}
                    </option>
                ))}
            </select>
        </div>
    )
} 