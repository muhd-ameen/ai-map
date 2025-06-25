// Updated API file using Google Places JavaScript API (no CORS issues)
import { Place, } from '../types';


// Declare global google object
declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

// Get API keys from environment variables
// If using Vite:
const DEFAULT_OPENAI_KEY = import.meta.env.VITE_OPENAI_API_KEY || '';
const DEFAULT_GOOGLE_MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

// If using Create React App, add the following type declaration at the top of the file or in a global.d.ts file:
// declare const process: {
//   env: {
//     REACT_APP_OPENAI_API_KEY?: string;
//     REACT_APP_GOOGLE_MAPS_API_KEY?: string;
//   };
// };

// Load Google Maps JavaScript API
export const loadGoogleMapsAPI = (apiKey: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if (window.google && window.google.maps) {
      resolve();
      return;
    }

    // Create script element
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initMap`;
    script.async = true;
    script.defer = true;

    // Set up callback
    window.initMap = () => {
      resolve();
    };

    script.onerror = () => {
      reject(new Error('Failed to load Google Maps API'));
    };

    document.head.appendChild(script);
  });
};

// Initialize Google Places service
let placesService: any = null;

const initializePlacesService = () => {
  if (!placesService && window.google) {
    // Create a hidden div for the places service
    const mapDiv = document.createElement('div');
    mapDiv.style.display = 'none';
    document.body.appendChild(mapDiv);
    
    const map = new window.google.maps.Map(mapDiv);
    placesService = new window.google.maps.places.PlacesService(map);
  }
  return placesService;
};

export const interpretPrompt = async (prompt: string, apiKey: string): Promise<string> => {
  const finalApiKey = apiKey.trim() || DEFAULT_OPENAI_KEY;
  const cacheKey = `prompt_${btoa(prompt.substring(0, 50))}`;
  
  // Check cache first
  const cached = sessionStorage.getItem(cacheKey);
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < 600000) { // 10 minutes
      return data;
    }
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${finalApiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that interprets user requests for finding places. Convert the user\'s natural language request into a clear description of what type of places they are looking for. Be specific about the type of business or location they want to find. Keep your response concise and focused on the search intent.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 150,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API Error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const result = data.choices[0]?.message?.content || 'restaurants near me';
    
    // Cache result
    sessionStorage.setItem(cacheKey, JSON.stringify({
      data: result,
      timestamp: Date.now()
    }));

    return result;
  } catch (error) {
    console.warn('OpenAI failed, using fallback interpretation:', error);
    return extractSearchQueryFallback(prompt);
  }
};

export const searchPlaces = async (
  interpretation: string,
  location: { lat: number; lng: number },
  apiKey: string
): Promise<Place[]> => {
  const finalApiKey = apiKey.trim() || DEFAULT_GOOGLE_MAPS_KEY;
  
  try {
    // Load Google Maps API if not already loaded
    await loadGoogleMapsAPI(finalApiKey);
    
    // Initialize places service
    const service = initializePlacesService();
    
    if (!service) {
      throw new Error('Google Places service not available');
    }

    return new Promise((resolve, reject) => {
      const request = {
        query: enhanceSearchQuery(interpretation),
        location: new window.google.maps.LatLng(location.lat, location.lng),
        radius: 10000, // 10km
        type: getPlaceType(interpretation)
      };

      service.textSearch(request, async (results: any[], status: any) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          // Transform basic results
          const places = results.slice(0, 15).map(transformGooglePlace);
          
          // Optionally enhance with detailed info (uncomment if you want full details)
          // const enhancedPlaces = await Promise.allSettled(
          //   places.map(async (place) => {
          //     try {
          //       const details = await getPlaceDetails(place.place_id, service);
          //       return { ...place, ...transformDetailedPlace(details) };
          //     } catch (error) {
          //       return place; // Return basic place if details fail
          //     }
          //   })
          // );
          // resolve(enhancedPlaces.map(result => 
          //   result.status === 'fulfilled' ? result.value : places.find(p => true)
          // ));
          
          resolve(places);
        } else if (status === window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
          resolve([]);
        } else {
          console.error('Places search failed:', status);
          reject(new Error(`Google Places search failed: ${status}`));
        }
      });
    });

  } catch (error) {
    console.error('Search places error:', error);
    throw error;
  }
};



// Transform Google Places result to match your Place interface
const transformGooglePlace = (place: any): Place => {
  return {
    place_id: place.place_id || '',
    name: place.name || 'Unknown Place',
    rating: place.rating,
    formatted_address: place.formatted_address || place.vicinity || '',
    formatted_phone_number: place.formatted_phone_number,
    opening_hours: place.opening_hours ? {
      open_now: false, // Deprecated field - always set to false to avoid warnings
      weekday_text: place.opening_hours.weekday_text || []
    } : undefined,
    geometry: place.geometry || {
      location: { lat: 0, lng: 0 }
    },
    photos: place.photos?.slice(0, 3).map((photo: any) => ({
      photo_reference: photo.getUrl ? photo.getUrl({ maxWidth: 400 }) : ''
    })) || [],
    price_level: place.price_level,
    types: place.types || []
  };
};

// Enhanced search query processing
const enhanceSearchQuery = (interpretation: string): string => {
  const businessTypes = {
    'coffee': 'coffee shop cafe',
    'food': 'restaurant dining',
    'soup': 'soup restaurant comfort food',
    'gym': 'fitness center gym',
    'medical': 'hospital clinic pharmacy',
    'shopping': 'shopping mall retail store',
    'entertainment': 'movie theater entertainment venue'
  };

  let enhanced = interpretation.toLowerCase();
  
  Object.entries(businessTypes).forEach(([key, expansion]) => {
    if (enhanced.includes(key)) {
      enhanced = enhanced.replace(key, expansion);
    }
  });

  return enhanced;
};

// Get appropriate place type
const getPlaceType = (searchQuery: string): string => {
  const typeMapping: Record<string, string> = {
    'restaurant': 'restaurant',
    'coffee': 'cafe',
    'food': 'restaurant',
    'bar': 'bar',
    'gym': 'gym',
    'hospital': 'hospital',
    'shopping': 'shopping_mall',
    'gas': 'gas_station',
    'hotel': 'lodging'
  };

  const query = searchQuery.toLowerCase();
  
  for (const [keyword, type] of Object.entries(typeMapping)) {
    if (query.includes(keyword)) {
      return type;
    }
  }
  
  return 'establishment';
};

// Fallback interpretation
const extractSearchQueryFallback = (prompt: string): string => {
  const keywords = {
    'hungry|food|eat|meal': 'restaurants',
    'coffee|caffeine': 'coffee shops',
    'soup|warm|comfort': 'soup restaurants',
    'drink|bar|beer': 'bars',
    'gym|workout|fitness': 'gyms',
    'shop|buy|store': 'shopping',
    'gas|fuel': 'gas stations',
    'medical|doctor|pharmacy': 'medical facilities'
  };

  const lowerPrompt = prompt.toLowerCase();
  
  for (const [pattern, result] of Object.entries(keywords)) {
    const regex = new RegExp(pattern, 'i');
    if (regex.test(lowerPrompt)) {
      return result;
    }
  }

  return 'restaurants near me';
};

// Default fallback locations
const DEFAULT_LOCATIONS = {
  'New York': { lat: 40.7128, lng: -74.0060 },
  'San Francisco': { lat: 37.7749, lng: -122.4194 },
  'Los Angeles': { lat: 34.0522, lng: -118.2437 },
  'London': { lat: 51.5074, lng: -0.1278 },
  'Mumbai': { lat: 19.0760, lng: 72.8777 },
  'Kochi': { lat: 9.9312, lng: 76.2673 }
};

export const getCurrentLocation = (): Promise<{ lat: number; lng: number }> => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      console.warn('Geolocation not supported, using fallback location');
      resolve(DEFAULT_LOCATIONS['Kochi']);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        console.warn('Location failed, using fallback:', error);
        resolve(DEFAULT_LOCATIONS['Kochi']);
      },
      { 
        timeout: 8000,
        enableHighAccuracy: true,
        maximumAge: 300000
      }
    );
  });
};

export const getLocationWithFallback = async (): Promise<{ 
  lat: number; 
  lng: number; 
  isDefault?: boolean; 
  location?: string 
}> => {
  try {
    const location = await getCurrentLocation();
    return { ...location, isDefault: false };
  } catch (error) {
    console.warn('Using default location due to error:', error);
    return { 
      ...DEFAULT_LOCATIONS['Kochi'], 
      isDefault: true, 
      location: 'Kochi (Default)' 
    };
  }
};

export const getLocationByCity = (cityName: string): { lat: number; lng: number } => {
  const city = Object.keys(DEFAULT_LOCATIONS).find(
    key => key.toLowerCase() === cityName.toLowerCase()
  );
  
  if (city) {
    return DEFAULT_LOCATIONS[city as keyof typeof DEFAULT_LOCATIONS];
  }
  
  return DEFAULT_LOCATIONS['Kochi'];
};