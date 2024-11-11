'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { Restaurant } from '@/lib/types'
import { createClient } from '@/utils/supabase/client'

interface RestaurantContextType {
    restaurants: Restaurant[]
    selectedRestaurant: Restaurant | null
    locationStatus: string
    isLoading: boolean
    findNearestLocation: () => Promise<void>
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
        console.log('Setting default restaurant, restaurants:', restaurants)
        if (!restaurants || restaurants.length === 0) {
            console.error('No restaurants available for setting default')
            setIsLoading(false)
            return
        }
        
        const defaultRestaurant = restaurants.find(r =>
            r.name.toLowerCase().includes('berchem')
        ) || restaurants[0]
        
        console.log('Selected default restaurant:', defaultRestaurant)
        if (!defaultRestaurant) {
            console.error('No default restaurant found in:', restaurants)
            setIsLoading(false)
            return
        }
        
        setSelectedRestaurant(defaultRestaurant)
    }

    useEffect(() => {
        let isMounted = true;

        const fetchRestaurants = async () => {
            try {
                const supabase = createClient()
                const { data } = await supabase
                    .from('restaurant')
                    .select('*')

                if (!isMounted) return;

                if (!data || data.length === 0) {
                    console.error('No restaurants found')
                    setIsLoading(false)
                    return
                }

                setRestaurants(data)

                // Check geolocation support
                if (!navigator.geolocation) {
                    setLocationStatus('unsupported')
                    setDefaultRestaurant(data)
                    setIsLoading(false)
                    return
                }

                // Check geolocation permission
                try {
                    const permission = await navigator.permissions.query({ name: 'geolocation' })

                    if (!isMounted) return;

                    setLocationStatus(permission.state as 'prompt' | 'granted' | 'denied')

                    if (permission.state === 'granted') {
                        try {
                            // Ensure we have restaurants data
                            if (data && data.length > 0) {
                                setRestaurants(data)
                                await findNearestLocation()
                            } else {
                                console.error('No restaurants data available')
                                setIsLoading(false)
                            }
                        } catch (error) {
                            console.error('Error finding nearest location:', error)
                            setDefaultRestaurant(data)
                            setIsLoading(false)
                        }
                    } else {
                        setDefaultRestaurant(data)
                        setIsLoading(false)
                    }

                    permission.addEventListener('change', function () {
                        if (!isMounted) return;
                        const newState = this.state as 'prompt' | 'granted' | 'denied'
                        setLocationStatus(newState)

                        if (newState === 'granted') {
                            findNearestLocation().catch(error => {
                                console.error('Error finding nearest location:', error)
                                setDefaultRestaurant(restaurants)
                            })
                        } else {
                            setDefaultRestaurant(restaurants)
                        }
                    })
                } catch (error) {
                    console.error('Geolocation permission error:', error)
                    if (isMounted) {
                        setLocationStatus('unsupported')
                        setDefaultRestaurant(data)
                        setIsLoading(false)
                    }
                }
            } catch (error) {
                console.error('Error fetching restaurants:', error)
                if (isMounted) {
                    setIsLoading(false)
                }
            }
        }

        fetchRestaurants()

        return () => {
            isMounted = false;
        }
    }, [])

    const findNearestLocation = async () => {
        try {
            setIsLoading(true)
            
            // Fetch restaurants if we don't have them
            let currentRestaurants = restaurants
            if (currentRestaurants.length === 0) {
                const supabase = createClient()
                const { data, error } = await supabase
                    .from('restaurant')
                    .select('*')
                
                if (error) throw error
                if (!data || data.length === 0) {
                    console.error('No restaurants found in database')
                    setIsLoading(false)
                    return
                }
                
                currentRestaurants = data
                setRestaurants(data)
            }

            // Get position
            const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 })
            })

            console.log('Got position:', position.coords)
            
            // Find nearest restaurant using the current restaurants data
            const nearest = findNearestRestaurant(
                currentRestaurants,
                position.coords.latitude,
                position.coords.longitude
            )

            if (nearest) {
                console.log('Found nearest restaurant:', nearest)
                setSelectedRestaurant(nearest)
            } else {
                console.log('No nearest restaurant found, setting default')
                setDefaultRestaurant(currentRestaurants)
            }
        } catch (error) {
            console.error('Error in findNearestLocation:', error)
            setLocationStatus('denied')
            setDefaultRestaurant(restaurants)
        } finally {
            setIsLoading(false)
        }
    }

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

    return (
        <RestaurantContext.Provider value={{ restaurants, selectedRestaurant, locationStatus, isLoading, findNearestLocation, findRestaurantByPostalCode, setSelectedRestaurant }}>
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
    console.log('Finding nearest restaurant with coordinates:', { userLat, userLng });
    console.log('Available restaurants:', restaurants);

    if (!restaurants.length) {
        console.log('No restaurants available');
        return null;
    }

    // Filter restaurants with valid coordinates first
    const validRestaurants = restaurants.filter(r =>
        r.latitude != null &&
        r.longitude != null
    );

    console.log('Valid restaurants with coordinates:', validRestaurants);

    if (!validRestaurants.length) {
        console.log('No restaurants with valid coordinates, returning first restaurant');
        return restaurants[0];
    }

    const nearest = validRestaurants.reduce((nearest, current) => {
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

        console.log(`Distance to ${current.name}: ${distanceToCurrent}km`);
        console.log(`Distance to ${nearest.name}: ${distanceToNearest}km`);

        return distanceToCurrent < distanceToNearest ? current : nearest;
    }, validRestaurants[0]);

    console.log('Selected nearest restaurant:', nearest);
    return nearest;
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