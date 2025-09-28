import { useState, useEffect, useCallback } from 'react';
import { IApartment } from '@/models/Apartment';

interface UseApartmentsResult {
  apartments: IApartment[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

interface UseApartmentsOptions {
  city?: string;
  limit?: number;
  skip?: number;
}

export function useApartments(options: UseApartmentsOptions = {}): UseApartmentsResult {
  const [apartments, setApartments] = useState<IApartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApartments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (options.city) params.append('city', options.city);
      if (options.limit) params.append('limit', options.limit.toString());
      if (options.skip) params.append('skip', options.skip.toString());

      const response = await fetch(`/api/apartments?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setApartments(data.data);
      } else {
        setError(data.error || 'Failed to fetch apartments');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Error fetching apartments:', err);
    } finally {
      setLoading(false);
    }
  }, [options.city, options.limit, options.skip]);

  useEffect(() => {
    fetchApartments();
  }, [options.city, options.limit, options.skip, fetchApartments]);

  return {
    apartments,
    loading,
    error,
    refetch: fetchApartments,
  };
}