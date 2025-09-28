'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function PropertyGrid() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [currentImageIndex, setCurrentImageIndex] = useState<{[key: string]: number}>({});

  const toggleFavorite = (propertyId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(propertyId)) {
      newFavorites.delete(propertyId);
    } else {
      newFavorites.add(propertyId);
    }
    setFavorites(newFavorites);
  };

  const nextImage = (propertyId: string, imageCount: number) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [propertyId]: ((prev[propertyId] || 0) + 1) % imageCount
    }));
  };

  const prevImage = (propertyId: string, imageCount: number) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [propertyId]: ((prev[propertyId] || 0) - 1 + imageCount) % imageCount
    }));
  };



  // Create sample property data with deterministic values to avoid hydration issues
  const sampleProperties = Array.from({ length: 20 }).map((_, index) => {
    // Use index-based deterministic values instead of Math.random()
    const distance = 5 + (index * 1.5) % 30;
    const price = 50 + (index * 7) % 200;
    const rating = 4.5 + (index * 0.1) % 0.5;
    const isGuestFavorite = index % 3 !== 0; // Every 3rd property is not a guest favorite
    
    return {
      _id: `grid-property-${index}`,
      title: index % 5 === 0 ? 'Apartment in Dhaka' :
             index % 5 === 1 ? 'Room in Dhaka' :
             index % 5 === 2 ? 'Apartment in Gulasana Thana' :
             index % 5 === 3 ? 'Apartment in Moham\'madapura Thana' :
             'Home in Dhaka',
      location: 'Dhaka, Bangladesh',
      distance: `${Math.floor(distance)} kilometers away`,
      dates: 'Oct 15–20',
      price: Math.floor(price),
      rating: Math.round(rating * 100) / 100,
      images: [
        'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?_gl=1*1iuiti5*_ga*MTcyNDAyNzY4MS4xNzU5MDQwOTU3*_ga_8JE65Q40S6*czE3NTkwNDA5NTYkbzEkZzEkdDE3NTkwNDA5NjAkajU2JGwwJGgw',
        'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?_gl=1*1iuiti5*_ga*MTcyNDAyNzY4MS4xNzU5MDQwOTU3*_ga_8JE65Q40S6*czE3NTkwNDA5NTYkbzEkZzEkdDE3NTkwNDA5NjAkajU2JGwwJGgw'
      ],
      isGuestFavorite
    };
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-10 mt-8">
      {sampleProperties.map((property) => (
        <div key={property._id} className="group cursor-pointer">
          {/* Image carousel */}
          <div className="relative mb-3 rounded-xl overflow-hidden">
            <div className="aspect-square relative">
              <Image
                src={property.images[currentImageIndex[property._id] || 0]}
                alt={property.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
              />
              
              {/* Guest favorite badge */}
              {property.isGuestFavorite && (
                <div className="absolute top-3 left-3 bg-white px-2 py-1 rounded-full text-xs font-medium shadow-md">
                  Guest favorite
                </div>
              )}
              
              {/* Heart button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(property._id);
                }}
                className="absolute top-3 right-3 p-2 hover:scale-110 transition-transform"
              >
                <svg
                  className={`w-6 h-6 ${
                    favorites.has(property._id)
                      ? 'text-[#FF385C] fill-current'
                      : 'text-white fill-black/20 hover:fill-black/40'
                  }`}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>

              {/* Navigation arrows */}
              {property.images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      prevImage(property._id, property.images.length);
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextImage(property._id, property.images.length);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}

              {/* Image dots */}
              {property.images.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-1">
                  {property.images.map((_, index) => (
                    <div
                      key={index}
                      className={`w-1.5 h-1.5 rounded-full ${
                        index === (currentImageIndex[property._id] || 0)
                          ? 'bg-white'
                          : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Property details */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900 truncate">{property.title}</h3>
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-sm font-medium text-gray-900">{property.rating}</span>
              </div>
            </div>
            <p className="text-gray-500 text-sm">{property.distance}</p>
            <p className="text-gray-500 text-sm">{property.dates}</p>
            <p className="text-gray-900 font-medium">
              <span className="font-semibold">${property.price}</span> night
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}