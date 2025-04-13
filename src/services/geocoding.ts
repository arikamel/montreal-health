import axios from 'axios';

export interface GeocodingResult {
  latitude: number;
  longitude: number;
  formattedAddress: string;
}

// Using Nominatim OpenStreetMap API for geocoding
export const geocodeAddress = async (address: string): Promise<GeocodingResult | null> => {
  try {
    // Add Montreal to the address if not already included
    const searchQuery = address.toLowerCase().includes('montreal') 
      ? address 
      : `${address}, Montreal, QC, Canada`;
    
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: searchQuery,
        format: 'json',
        limit: 1,
        countrycodes: 'ca',
      },
      headers: {
        'User-Agent': 'MontrealHealthApp/1.0',
      },
    });

    if (response.data && response.data.length > 0) {
      const result = response.data[0];
      return {
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon),
        formattedAddress: result.display_name,
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error geocoding address:', error);
    return null;
  }
}; 