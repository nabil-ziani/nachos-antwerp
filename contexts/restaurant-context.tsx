'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { Restaurant } from '@/lib/types'
import { createClient } from '@/utils/supabase/client'
import { checkGeolocationPermission, findNearestRestaurant, getCurrentPosition, getDefaultRestaurant, LocationPermissionState } from '@/utils/location'

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

    const setDefaultRestaurant = (restaurants: Restaurant[]) => {
        const defaultRestaurant = getDefaultRestaurant(restaurants)

        if (defaultRestaurant) {
            setSelectedRestaurant(defaultRestaurant)
        }
        setIsLoading(false)
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

                const permissionState = await checkGeolocationPermission()

                if (!isMounted) return;

                setLocationStatus(permissionState as LocationPermissionState)

                try {
                    const permission = await navigator.permissions.query({ name: 'geolocation' })

                    if (!isMounted) return;

                    setLocationStatus(permission.state as LocationPermissionState)

                    if (permissionState === 'granted') {
                        try {
                            await findNearestLocation()
                        } catch (error) {
                            console.error('Error finding nearest location:', error)
                            setDefaultRestaurant(data)
                            setIsLoading(false)
                        }
                    } else if (permissionState === 'denied' || permissionState === 'unsupported') {
                        setDefaultRestaurant(data)
                        setIsLoading(false)
                    } else {
                        setDefaultRestaurant(data)
                        setIsLoading(false)
                    }

                    // Add permission change listener
                    if (permissionState !== 'unsupported') {
                        const permission = await navigator.permissions.query({ name: 'geolocation' })
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
                    }
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
            const position = await getCurrentPosition()
            // console.log('Got position:', position.coords)

            // Find nearest restaurant using the current restaurants data
            const nearest = findNearestRestaurant(currentRestaurants, position.coords.latitude, position.coords.longitude)

            if (nearest) {
                // console.log('Found nearest restaurant:', nearest)
                setSelectedRestaurant(nearest)
            } else {
                // console.log('No nearest restaurant found, setting default')
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