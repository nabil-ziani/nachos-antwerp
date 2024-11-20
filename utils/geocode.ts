import axios from 'axios';

export async function geocodeAddress(address: string): Promise<{ latitude: number, longitude: number } | null> {
    const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
    console.log('Mapbox Access Token:', accessToken);

    try {
        const response = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json`, {
            params: {
                access_token: accessToken,
                limit: 1
            }
        });

        const data = response.data;

        if (data.features && data.features.length > 0) {
            const location = data.features[0].geometry.coordinates;
            return { latitude: location[1], longitude: location[0] };
        }

        console.error('Geocoding failed: No results found');
        return null;
    } catch (error) {
        console.error('Error during geocoding:', error);
        return null;
    }
}