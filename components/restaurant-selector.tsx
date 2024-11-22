'use client'

import { useRestaurant } from '@/contexts/restaurant-context'
import { CustomSelect } from './ui/custom-select'

export function RestaurantSelector() {
    const {
        selectedRestaurant,
        setSelectedRestaurant,
        restaurants,
        locationStatus,
        //findNearestLocation,
        isLoading
    } = useRestaurant()

    const handleChange = (value: string) => {
        /*if (value === 'nearest') {
            findNearestLocation()
            return
        }*/

        const restaurant = restaurants.find(r => r.id === value)
        if (restaurant) setSelectedRestaurant(restaurant)
    }

    const options = isLoading
        ? [{ value: '', label: 'Locatie laden...', disabled: true }]
        : [
            { value: '', label: 'Kies een locatie', disabled: true },
            ...(locationStatus === 'prompt' ? [
                { value: 'nearest', label: '📍 Dichtstbijzijnde locatie' }
            ] : []),
            ...(locationStatus === 'denied' ? [
                { value: '', label: 'ℹ️ Locatie delen uitgeschakeld', disabled: true }
            ] : []),
            ...restaurants.map(restaurant => ({
                value: restaurant.id,
                label: `🍴 ${restaurant.name}`
            }))
        ]

    return (
        <div className="tst-restaurant-selector">
            <CustomSelect
                value={selectedRestaurant?.id || ''}
                onChange={handleChange}
                options={options}
                disabled={isLoading}
                placeholder={isLoading ? 'Locatie laden...' : 'Kies een locatie'}
                testId="restaurant-selector"
            />
        </div>
    )
} 