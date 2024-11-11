'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { Restaurant } from '@/lib/types'
import { createClient } from '@/utils/supabase/client'

interface RestaurantContextType {
    restaurants: Restaurant[]
    selectedRestaurant: Restaurant | null
    locationStatus: string
    isLoading: boolean
    findNearestLocation: () => void
    findRestaurantByPostalCode: (postalCode: string) => {
        restaurant: Restaurant | null;
        minimumAmount: number | null;
        switchRequired?: boolean;
        message?: string;
    }
    setSelectedRestaurant: (restaurant: Restaurant | null) => void
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined)

export function RestaurantProvider({ children }: { children: React.ReactNode }) {
    const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)
    const [restaurants, setRestaurants] = useState<Restaurant[]>([])
    const [locationStatus, setLocationStatus] = useState<'prompt' | 'granted' | 'denied' | 'unsupported'>('prompt')
    const [isLoading, setIsLoading] = useState(true)

    // Helper function to set default restaurant
    const setDefaultRestaurant = (restaurants: Restaurant[]) => {
        const defaultRestaurant = restaurants.find(r => 
            r.name.toLowerCase().includes('berchem')
        ) || restaurants[0]
        setSelectedRestaurant(defaultRestaurant)
    }

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                setIsLoading(true)
                const supabase = createClient()
                const { data } = await supabase
                    .from('restaurant')
                    .select('*')

                if (!data || data.length === 0) {
                    console.error('No restaurants found')
                    setIsLoading(false)
                    return
                }

                setRestaurants(data)

                // Check geolocation support and permissions
                if (!navigator.geolocation) {
                    setLocationStatus('unsupported')
                    setDefaultRestaurant(data)
                    setIsLoading(false)
                    return
                }

                try {
                    const permission = await navigator.permissions.query({ name: 'geolocation' })
                    setLocationStatus(permission.state as 'prompt' | 'granted' | 'denied')

                    if (permission.state === 'granted') {
                        findNearestLocation()
                    } else {
                        // Set default for both 'prompt' and 'denied' states
                        setDefaultRestaurant(data)
                    }

                    permission.addEventListener('change', function(this: PermissionStatus) {
                        const newState = this.state as 'prompt' | 'granted' | 'denied'
                        setLocationStatus(newState)
                        
                        if (newState === 'granted') {
                            findNearestLocation()
                        } else {
                            setDefaultRestaurant(restaurants)
                        }
                    })
                } catch (error) {
                    console.error('Geolocation permission error:', error)
                    setLocationStatus('unsupported')
                    setDefaultRestaurant(data)
                }
            } catch (error) {
                console.error('Error fetching restaurants:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchRestaurants()
    }, [])

    const findNearestLocation = () => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const nearest = findNearestRestaurant(
                    restaurants,
                    position.coords.latitude,
                    position.coords.longitude
                );

                if (nearest) {
                    setSelectedRestaurant(nearest);
                } else {
                    // Fallback to default restaurant if no nearest found
                    const defaultRestaurant = restaurants.find(r =>
                        r.name.toLowerCase().includes('berchem')
                    ) || restaurants[0];
                    setSelectedRestaurant(defaultRestaurant);
                    console.warn('Could not find nearest restaurant, falling back to default');
                }
            },
            (error) => {
                console.error('Geolocation error:', error);
                setLocationStatus('denied');
            }
        );
    };

    const findRestaurantByPostalCode = (postalCode: string) => {
        // First check current restaurant
        if (selectedRestaurant?.allowed_postalcodes?.includes(postalCode)) {
            const minimumAmount = selectedRestaurant.delivery_minimums?.[postalCode] || null;
            return { restaurant: selectedRestaurant, minimumAmount, switchRequired: false };
        }

        // Check other restaurants
        const availableRestaurant = restaurants.find(r =>
            r.allowed_postalcodes?.includes(postalCode)
        );

        if (availableRestaurant) {
            const minimumAmount = availableRestaurant.delivery_minimums?.[postalCode] || null;
            return {
                restaurant: availableRestaurant,
                minimumAmount,
                switchRequired: true,
                message: `Wij bezorgen niet naar ${postalCode}, maar ${availableRestaurant.name} wel.`
            };
        }

        return {
            restaurant: null,
            minimumAmount: null,
            switchRequired: false,
            message: `Helaas, we bezorgen momenteel niet in ${postalCode}.`
        };
    };

    const handleSetSelectedRestaurant = (restaurant: Restaurant | null) => {
        console.log('Setting restaurant:', restaurant?.name || 'null')
        console.trace('Restaurant selection trace:')
        setSelectedRestaurant(restaurant)
    }

    return (
        <RestaurantContext.Provider value={{
            restaurants,
            selectedRestaurant,
            locationStatus,
            isLoading,
            findNearestLocation,
            findRestaurantByPostalCode,
            setSelectedRestaurant: handleSetSelectedRestaurant
        }}>
            {children}
        </RestaurantContext.Provider>
    )
}

export const useRestaurant = () => {
    const context = useContext(RestaurantContext)
    if (context === undefined) {
        throw new Error('useRestaurant must be used within a RestaurantProvider')
    }
    return context
}

// Helper function to calculate distance and find nearest restaurant
function findNearestRestaurant(restaurants: Restaurant[], userLat: number, userLng: number): Restaurant | null {
    if (!restaurants.length) return null;

    // Filter restaurants with valid coordinates first
    const validRestaurants = restaurants.filter(r =>
        r.latitude != null &&
        r.longitude != null
    );

    if (!validRestaurants.length) return restaurants[0];

    return validRestaurants.reduce((nearest, current) => {
        if (!current.latitude || !current.longitude || !nearest.latitude || !nearest.longitude) {
            return nearest;
        }

        const distanceToCurrent = calculateDistance(
            userLat,
            userLng,
            current.latitude,
            current.longitude
        );

        const distanceToNearest = calculateDistance(
            userLat,
            userLng,
            nearest.latitude,
            nearest.longitude
        );

        return distanceToCurrent < distanceToNearest ? current : nearest;
    }, validRestaurants[0]);
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371 // Earth's radius in km
    const dLat = deg2rad(lat2 - lat1)
    const dLon = deg2rad(lon2 - lon1)
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
}

function deg2rad(deg: number): number {
    return deg * (Math.PI / 180)
} 