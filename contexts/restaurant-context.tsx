'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { Restaurant } from '@/lib/types'
import { createClient } from '@/utils/supabase/client'

interface RestaurantContextType {
    selectedRestaurant: Restaurant | null
    setSelectedRestaurant: (restaurant: Restaurant) => void
    restaurants: Restaurant[]
    locationStatus: 'prompt' | 'granted' | 'denied' | 'unsupported'
    findNearestLocation: () => void
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined)

export function RestaurantProvider({ children }: { children: React.ReactNode }) {
    const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)
    const [restaurants, setRestaurants] = useState<Restaurant[]>([])
    const [locationStatus, setLocationStatus] = useState<'prompt' | 'granted' | 'denied' | 'unsupported'>('prompt')

    useEffect(() => {
        const fetchRestaurants = async () => {
            const supabase = createClient()
            const { data } = await supabase
                .from('restaurant')
                .select('*')
                .returns<Restaurant[]>()

            if (!data) return

            setRestaurants(data)

            // Set default restaurant initially
            if (!selectedRestaurant) {
                setSelectedRestaurant(data[0])
            }

            // Check if geolocation is supported
            if (!navigator.geolocation) {
                setLocationStatus('unsupported')
                return
            }

            try {
                const permission = await navigator.permissions.query({ name: 'geolocation' })
                setLocationStatus(permission.state as 'prompt' | 'granted' | 'denied')

                // If permission is already granted, get location
                if (permission.state === 'granted') {
                    findNearestLocation()
                }

                // Listen for permission changes
                permission.addEventListener('change', () => {
                    setLocationStatus(permission.state as 'prompt' | 'granted' | 'denied')
                    if (permission.state === 'granted') {
                        findNearestLocation()
                    }
                })
            } catch (error) {
                console.error('Permission check error:', error)
                setLocationStatus('denied')
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
                )
                setSelectedRestaurant(nearest)
            },
            () => { } // Error is handled by the permission change listener
        )
    }

    return (
        <RestaurantContext.Provider value={{
            selectedRestaurant,
            setSelectedRestaurant,
            restaurants,
            locationStatus,
            findNearestLocation
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
function findNearestRestaurant(restaurants: Restaurant[], userLat: number, userLng: number): Restaurant {
    return restaurants.reduce((nearest, current) => {

        if (!current.latitude || !current.longitude || !nearest.latitude || !nearest.longitude) {
            return nearest;
        }
        const distanceToCurrent = calculateDistance(
            userLat,
            userLng,
            current.latitude,
            current.longitude
        )
        const distanceToNearest = calculateDistance(
            userLat,
            userLng,
            nearest.latitude,
            nearest.longitude
        )
        return distanceToCurrent < distanceToNearest ? current : nearest
    })
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