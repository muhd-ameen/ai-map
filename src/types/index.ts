export interface Place {
  place_id: string;
  name: string;
  rating?: number;
  formatted_address: string;
  formatted_phone_number?: string;
  opening_hours?: {
    open_now: boolean;
    weekday_text: string[];
  };
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  photos?: Array<{
    photo_reference: string;
  }>;
  price_level?: number;
  types: string[];
}

export interface SearchResult {
  query: string;
  interpretation: string;
  places: Place[];
}

export interface ApiKeys {
  openai: string;
  googleMaps: string;
}