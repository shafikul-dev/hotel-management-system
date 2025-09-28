import { useState, useCallback } from 'react';

interface SearchParams {
  destination: string;
  checkIn: Date | null;
  checkOut: Date | null;
  adults: number;
  children: number;
  infants: number;
  pets: number;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  propertyType?: string;
  amenities?: string[];
  instantBook?: boolean;
}

interface SearchResult {
  _id: string;
  title: string;
  location: string;
  price: number;
  rating: number;
  reviews: number;
  images: string[];
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  type: string;
  amenities: string[];
  relevanceScore: number;
}

interface SearchResponse {
  success: boolean;
  data: SearchResult[];
  count: number;
  searchParams: {
    destination: string;
    checkIn: string | null;
    checkOut: string | null;
    guests: {
      adults: number;
      children: number;
      infants: number;
      pets: number;
    };
    priceRange: {
      min: number;
      max: number;
    };
    bedrooms: number;
    bathrooms: number;
    propertyType: string;
    amenities: string[];
    instantBook: boolean;
  };
}

export const useSearch = () => {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (params: SearchParams) => {
    setLoading(true);
    setError(null);

    try {
      // Build search URL
      const searchParams = new URLSearchParams();
      
      if (params.destination) searchParams.set('destination', params.destination);
      if (params.checkIn) searchParams.set('checkIn', params.checkIn.toISOString());
      if (params.checkOut) searchParams.set('checkOut', params.checkOut.toISOString());
      if (params.adults > 0) searchParams.set('adults', params.adults.toString());
      if (params.children > 0) searchParams.set('children', params.children.toString());
      if (params.infants > 0) searchParams.set('infants', params.infants.toString());
      if (params.pets > 0) searchParams.set('pets', params.pets.toString());
      if (params.minPrice !== undefined) searchParams.set('minPrice', params.minPrice.toString());
      if (params.maxPrice !== undefined) searchParams.set('maxPrice', params.maxPrice.toString());
      if (params.bedrooms !== undefined && params.bedrooms > 0) searchParams.set('bedrooms', params.bedrooms.toString());
      if (params.bathrooms !== undefined && params.bathrooms > 0) searchParams.set('bathrooms', params.bathrooms.toString());
      if (params.propertyType) searchParams.set('propertyType', params.propertyType);
      if (params.amenities && params.amenities.length > 0) searchParams.set('amenities', params.amenities.join(','));
      if (params.instantBook) searchParams.set('instantBook', 'true');

      const response = await fetch(`/api/search?${searchParams.toString()}`);
      
      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data: SearchResponse = await response.json();
      
      if (data.success) {
        setResults(data.data);
      } else {
        throw new Error('Search request failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return {
    results,
    loading,
    error,
    search,
    clearResults
  };
};

// Hook for getting filter options
export const useSearchFilters = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getFilterOptions = useCallback(async (type: 'destinations' | 'propertyTypes' | 'amenities' | 'priceRange') => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch filter options');
      }

      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error('Filter request failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch filter options');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    getFilterOptions,
    loading,
    error
  };
};