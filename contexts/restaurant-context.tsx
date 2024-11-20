'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { Restaurant } from '@/lib/types'
import { createClient } from '@/utils/supabase/client'
import { checkGeolocationPermission, findNearestRestaurant, getCurrentPosition, LocationPermissionState } from '@/utils/location'

interface RestaurantContextType {
    restaurants: Restaurant[]
    selectedRestaurant: Restaurant | null
    locationStatus: string
    isLoading: boolean
    findNearestLocation: () => Promise<void>
    setSelectedRestaurant: (restaurant: Restaurant | null) => void
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined)

export function RestaurantProvider({ children }: { children: React.ReactNode }) {
    const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)
    const [restaurants, setRestaurants] = useState<Restaurant[]>([])
    const [locationStatus, setLocationStatus] = useState<'prompt' | 'granted' | 'denied' | 'unsupported'>('prompt')
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        let isMounted = true;

        const initialize = async () => {
            await fetchRestaurants();
            if (isMounted) {
                await handleLocationPermission();
            }
        };

        initialize();

        return () => {
            isMounted = false;
        }
    }, [])

    const fetchRestaurants = async () => {
        try {
            const supabase = createClient()
            const { data, error } = await supabase.from('restaurant').select('*')

            if (error || !data || data.length === 0) {
                console.error('No restaurants found')
                setIsLoading(false)
                return
            }

            console.log('Fetched restaurants:', data)
            setRestaurants(data)
            setSelectedRestaurant(data[0])
        } catch (error) {
            console.error('Error fetching restaurants:', error)
            setIsLoading(false)
        }
    }

    const handleLocationPermission = async () => {
        try {
            const permissionState = await checkGeolocationPermission()
            setLocationStatus(permissionState as LocationPermissionState)

            if (permissionState === 'granted' && restaurants.length > 0) {
                await findNearestLocation()
            } else {
                setIsLoading(false)
            }

            if (permissionState !== 'unsupported') {
                const permission = await navigator.permissions.query({ name: 'geolocation' })
                permission.addEventListener('change', async function () {
                    const newState = this.state as 'prompt' | 'granted' | 'denied'
                    setLocationStatus(newState)

                    if (newState === 'granted' && restaurants.length > 0) {
                        await findNearestLocation()
                    }
                })
            }
        } catch (error) {
            console.error('Error handling location permission:', error)
            setIsLoading(false)
        }
    }

    const findNearestLocation = async () => {
        try {
            setIsLoading(true)

            console.log('Attempting to find nearest location. Restaurants:', restaurants)

            if (restaurants.length === 0) {
                console.error('No restaurants available')
                setIsLoading(false)
                return
            }

            const position = await getCurrentPosition()
            const nearest = findNearestRestaurant(restaurants, position.coords.latitude, position.coords.longitude)

            if (nearest) {
                setSelectedRestaurant(nearest)
            }
        } catch (error) {
            console.error('Error in findNearestLocation:', error)
            setLocationStatus('denied')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <RestaurantContext.Provider value={{ restaurants, selectedRestaurant, locationStatus, isLoading, findNearestLocation, setSelectedRestaurant }}>
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