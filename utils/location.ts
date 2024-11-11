import { Restaurant } from '@/lib/types'

// Helper function to calculate distance between two points in km
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

// Helper function to convert degrees to radians
function deg2rad(deg: number): number {
    return deg * (Math.PI / 180)
}

export function findNearestRestaurant(restaurants: Restaurant[], userLat: number, userLng: number): Restaurant | null {
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

export function getDefaultRestaurant(restaurants: Restaurant[]): Restaurant | null {
    console.log('Setting default restaurant, restaurants:', restaurants)

    if (!restaurants || restaurants.length === 0) {
        console.error('No restaurants available for setting default')
        return null
    }

    const defaultRestaurant = restaurants.find(r =>
        r.name.toLowerCase().includes('berchem')
    ) || restaurants[0]

    console.log('Selected default restaurant:', defaultRestaurant)

    if (!defaultRestaurant) {
        console.error('No default restaurant found in:', restaurants)
        return null
    }

    return defaultRestaurant
}

export function findRestaurantByPostalCode(restaurants: Restaurant[], selectedRestaurant: Restaurant | null, postalCode: string) {
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
}

export async function getCurrentPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 })
    });
}

export type LocationPermissionState = 'prompt' | 'granted' | 'denied' | 'unsupported'

export async function checkGeolocationPermission(): Promise<LocationPermissionState> {
    if (!navigator.geolocation) {
        return 'unsupported';
    }

    try {
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        return permission.state;
    } catch (error) {
        console.error('Error checking geolocation permission:', error);
        return 'denied';
    }
}