import fetch from 'node-fetch';

export async function geocodeAddress(address: string): Promise<{ latitude: number, longitude: number } | null> {
    // TODO: add google maps api key
    const apiKey = 'GOOGLE_MAPS_API_KEY';
    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`);
    const data: any = await response.json();

    if (data.status === 'OK' && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        return { latitude: location.lat, longitude: location.lng };
    }

    console.error('Geocoding failed:', data.status);
    return null;
}