'use client';

import { useState } from 'react';
import Image from 'next/image';

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

interface SearchResultsProps {
  results: SearchResult[];
  loading: boolean;
  error: string | null;
  searchQuery?: string;
  onPropertyClick?: (propertyId: string) => void;
}

export default function SearchResults({ results, loading, error, searchQuery, onPropertyClick }: SearchResultsProps) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });
  };

  if (loading) {
    return (
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF385C] mx-auto"></div>
            <p className="mt-4 text-gray-600">Searching for the perfect place...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <div className="text-red-500 text-lg font-medium">Search Error</div>
            <p className="mt-2 text-gray-600">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-[#FF385C] text-white rounded-lg hover:bg-[#E31C5F] transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <div className="text-2xl font-semibold text-gray-900 mb-2">No results found</div>
            <p className="text-gray-600 mb-6">
              {searchQuery 
                ? `We couldn't find any places matching "${searchQuery}". Try adjusting your search criteria.`
                : 'Try adjusting your search criteria to find more places to stay.'
              }
            </p>
            <div className="text-sm text-gray-500">
              <p>Try:</p>
              <ul className="mt-2 space-y-1">
                <li>• Changing your destination</li>
                <li>• Adjusting your dates</li>
                <li>• Reducing the number of guests</li>
                <li>• Expanding your price range</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Results header */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            {results.length} {results.length === 1 ? 'stay' : 'stays'} 
            {searchQuery && (
              <span className="text-gray-600 font-normal"> in {searchQuery}</span>
            )}
          </h2>
          <p className="text-gray-600">
            Book unique places to stay and things to do.
          </p>
        </div>

        {/* Results grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {results.map((property) => (
            <PropertyCard
              key={property._id}
              property={property}
              isFavorite={favorites.has(property._id)}
              onToggleFavorite={() => toggleFavorite(property._id)}
              onClick={() => onPropertyClick?.(property._id)}
            />
          ))}
        </div>

        {/* Load more button if many results */}
        {results.length >= 20 && (
          <div className="text-center mt-12">
            <button className="px-8 py-3 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
              Show more
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

interface PropertyCardProps {
  property: SearchResult;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onClick?: () => void;
}

function PropertyCard({ property, isFavorite, onToggleFavorite, onClick }: PropertyCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentImageIndex((prev) => 
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentImageIndex((prev) => 
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  return (
    <div className="group cursor-pointer" onClick={onClick}>
      {/* Image carousel */}
      <div className="relative aspect-square rounded-xl overflow-hidden mb-3">
        <Image
          src={property.images[currentImageIndex] || '/placeholder-image.jpg'}
          alt={property.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        
        {/* Navigation arrows */}
        {property.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Image indicators */}
        {property.images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-1">
            {property.images.map((_, index) => (
              <div
                key={index}
                className={`w-1.5 h-1.5 rounded-full ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}

        {/* Favorite button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            onToggleFavorite();
          }}
          className="absolute top-3 right-3 p-2 hover:scale-110 transition-transform"
        >
          <svg 
            className={`w-6 h-6 ${isFavorite ? 'fill-[#FF385C] stroke-[#FF385C]' : 'fill-none stroke-white'}`}
            stroke="currentColor" 
            strokeWidth={2} 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        {/* Guest favorite badge */}
        <div className="absolute top-3 left-3 bg-white px-2 py-1 rounded-full text-xs font-medium text-gray-800">
          Guest favorite
        </div>
      </div>

      {/* Property details */}
      <div className="space-y-1">
        {/* Location and rating */}
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 truncate pr-2">
            {property.location}
          </h3>
          <div className="flex items-center space-x-1 text-sm">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span className="font-medium">{property.rating}</span>
          </div>
        </div>

        {/* Property type and details */}
        <div className="text-gray-600 text-sm">
          {property.type} • {property.bedrooms} bed{property.bedrooms !== 1 ? 's' : ''} • {property.bathrooms} bath{property.bathrooms !== 1 ? 's' : ''}
        </div>

        {/* Dates */}
        <div className="text-gray-600 text-sm">
          Available now
        </div>

        {/* Price */}
        <div className="flex items-baseline space-x-1">
          <span className="font-semibold text-gray-900">${property.price}</span>
          <span className="text-gray-600 text-sm">night</span>
        </div>
      </div>
    </div>
  );
}