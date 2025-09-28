'use client';

import Image from 'next/image';
import { useState, useRef } from 'react';

interface HomeCarouselsProps {
  onPropertyClick?: (propertyId: string) => void;
}

export default function HomeCarousels({ onPropertyClick }: HomeCarouselsProps = {}) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [scrollPositions, setScrollPositions] = useState<{[key: string]: number}>({});
  
  // Refs for each carousel section
  const dhakaRef = useRef<HTMLDivElement>(null);
  const klRef = useRef<HTMLDivElement>(null);
  const londonRef = useRef<HTMLDivElement>(null);
  const torontoRef = useRef<HTMLDivElement>(null);
  const seoulRef = useRef<HTMLDivElement>(null);
  const osakaRef = useRef<HTMLDivElement>(null);
  const tokyoRef = useRef<HTMLDivElement>(null);
  const melbourneRef = useRef<HTMLDivElement>(null);
  const britainRef = useRef<HTMLDivElement>(null);

  const toggleFavorite = (propertyId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(propertyId)) {
      newFavorites.delete(propertyId);
    } else {
      newFavorites.add(propertyId);
    }
    setFavorites(newFavorites);
  };

  // Carousel navigation functions
  const scrollCarousel = (ref: React.RefObject<HTMLDivElement>, direction: 'left' | 'right', sectionId: string) => {
    if (!ref.current) return;
    
    const scrollAmount = 300; // Adjust this value to control scroll distance
    const currentScroll = scrollPositions[sectionId] || 0;
    const newScroll = direction === 'left' 
      ? Math.max(0, currentScroll - scrollAmount)
      : currentScroll + scrollAmount;
    
    ref.current.scrollTo({
      left: newScroll,
      behavior: 'smooth'
    });
    
    setScrollPositions(prev => ({
      ...prev,
      [sectionId]: newScroll
    }));
  };

  const PropertyCard = ({ property, imageIndex = 0 }: { property: { _id: string; title: string; price: number; rating: number; images: string[]; isGuestFavorite: boolean }; imageIndex?: number }) => (
    <div key={`${property._id}-${imageIndex}`} className="flex-shrink-0 w-72 cursor-pointer" onClick={() => onPropertyClick?.(property._id)}>
      <div className="relative mb-3 rounded-xl overflow-hidden">
        <div className="aspect-[4/3] relative">
          <Image
            src={property.images?.[imageIndex] || 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?_gl=1*1iuiti5*_ga*MTcyNDAyNzY4MS4xNzU5MDQwOTU3*_ga_8JE65Q40S6*czE3NTkwNDA5NTYkbzEkZzEkdDE3NTkwNDA5NjAkajU2JGwwJGgw'}
            alt={property.title}
            width={288}
            height={216}
            className="object-cover w-full h-full"
            sizes="288px"
            priority={false}
            suppressHydrationWarning={true}
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
        </div>
      </div>

      {/* Property details */}
      <div className="space-y-1">
        <h3 className="font-medium text-gray-900 text-sm truncate">{property.title}</h3>
        <p className="text-gray-900 font-medium text-sm">
          ${property.price} for 2 nights • ⭐ {property.rating}
        </p>
      </div>
    </div>
  );



  return (
    <div className="space-y-10">
      {/* Popular homes in Dhaka District */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Popular homes in Dhaka District</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => scrollCarousel(dhakaRef, 'left', 'dhaka')}
              className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => scrollCarousel(dhakaRef, 'right', 'dhaka')}
              className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
        
        <div ref={dhakaRef} className="flex overflow-x-auto scrollbar-hide pb-4 space-x-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <PropertyCard key={`dhaka-${index}`} imageIndex={index} property={{
              _id: `dhaka-${index}`,
              title: index === 0 ? 'Apartment in Moham\'madapura Thana' : 
                    index === 1 ? 'Apartment in Dhaka' :
                    index === 2 ? 'Apartment in Dhaka' :
                    index === 3 ? 'Apartment in Gulasana Thana' :
                    index === 4 ? 'Home in Dhaka' :
                    'Apartment in Dhaka',
              price: index === 0 ? 48 : index === 1 ? 168 : index === 2 ? 63 : index === 3 ? 92 : index === 4 ? 56 : 105,
              rating: index === 0 ? 4.92 : index === 1 ? 5.0 : index === 2 ? 4.9 : index === 3 ? 4.98 : index === 4 ? 4.88 : 5.0,
              images: [
                'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?_gl=1*1iuiti5*_ga*MTcyNDAyNzY4MS4xNzU5MDQwOTU3*_ga_8JE65Q40S6*czE3NTkwNDA5NTYkbzEkZzEkdDE3NTkwNDA5NjAkajU2JGwwJGgw',
                'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?_gl=1*1iuiti5*_ga*MTcyNDAyNzY4MS4xNzU5MDQwOTU3*_ga_8JE65Q40S6*czE3NTkwNDA5NTYkbzEkZzEkdDE3NTkwNDA5NjAkajU2JGwwJGgw',
                'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?_gl=1*1iuiti5*_ga*MTcyNDAyNzY4MS4xNzU5MDQwOTU3*_ga_8JE65Q40S6*czE3NTkwNDA5NTYkbzEkZzEkdDE3NTkwNDA5NjAkajU2JGwwJGgw',
                'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?_gl=1*1iuiti5*_ga*MTcyNDAyNzY4MS4xNzU5MDQwOTU3*_ga_8JE65Q40S6*czE3NTkwNDA5NTYkbzEkZzEkdDE3NTkwNDA5NjAkajU2JGwwJGgw',
                'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?_gl=1*1iuiti5*_ga*MTcyNDAyNzY4MS4xNzU5MDQwOTU3*_ga_8JE65Q40S6*czE3NTkwNDA5NTYkbzEkZzEkdDE3NTkwNDA5NjAkajU2JGwwJGgw',
                'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?_gl=1*1iuiti5*_ga*MTcyNDAyNzY4MS4xNzU5MDQwOTU3*_ga_8JE65Q40S6*czE3NTkwNDA5NTYkbzEkZzEkdDE3NTkwNDA5NjAkajU2JGwwJGgw'
              ],
              isGuestFavorite: true
            }} />
          ))}
        </div>
      </section>

      {/* Available next month in Kuala Lumpur */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Available next month in Kuala Lumpur</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => scrollCarousel(klRef, 'left', 'kl')}
              className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => scrollCarousel(klRef, 'right', 'kl')}
              className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
        
        <div ref={klRef} className="flex overflow-x-auto scrollbar-hide pb-4 space-x-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <PropertyCard key={`kl-${index}`} imageIndex={index} property={{
              _id: `kl-${index}`,
              title: index === 0 ? 'Condo in PULAPOL' : 
                    index === 1 ? 'Apartment in Bukit Bintang' :
                    index === 2 ? 'Apartment in Kampung Datuk Keramat' :
                    index === 3 ? 'Apartment in Kampung Bahru' :
                    index === 4 ? 'Place to stay in Bukit Bintang' :
                    'Apartment in Bukit Bintang',
              price: index === 0 ? 75 : index === 1 ? 91 : index === 2 ? 224 : index === 3 ? 134 : index === 4 ? 45 : 95,
              rating: index === 0 ? 4.93 : index === 1 ? 4.95 : index === 2 ? 4.97 : index === 3 ? 4.98 : index === 4 ? 4.95 : 4.94,
              images: [
                'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?_gl=1*1iuiti5*_ga*MTcyNDAyNzY4MS4xNzU5MDQwOTU3*_ga_8JE65Q40S6*czE3NTkwNDA5NTYkbzEkZzEkdDE3NTkwNDA5NjAkajU2JGwwJGgw',
                'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?_gl=1*1iuiti5*_ga*MTcyNDAyNzY4MS4xNzU5MDQwOTU3*_ga_8JE65Q40S6*czE3NTkwNDA5NTYkbzEkZzEkdDE3NTkwNDA5NjAkajU2JGwwJGgw',
                'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?_gl=1*1iuiti5*_ga*MTcyNDAyNzY4MS4xNzU5MDQwOTU3*_ga_8JE65Q40S6*czE3NTkwNDA5NTYkbzEkZzEkdDE3NTkwNDA5NjAkajU2JGwwJGgw',
                'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?_gl=1*1iuiti5*_ga*MTcyNDAyNzY4MS4xNzU5MDQwOTU3*_ga_8JE65Q40S6*czE3NTkwNDA5NTYkbzEkZzEkdDE3NTkwNDA5NjAkajU2JGwwJGgw',
                'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?_gl=1*1iuiti5*_ga*MTcyNDAyNzY4MS4xNzU5MDQwOTU3*_ga_8JE65Q40S6*czE3NTkwNDA5NTYkbzEkZzEkdDE3NTkwNDA5NjAkajU2JGwwJGgw',
                'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?_gl=1*1iuiti5*_ga*MTcyNDAyNzY4MS4xNzU5MDQwOTU3*_ga_8JE65Q40S6*czE3NTkwNDA5NTYkbzEkZzEkdDE3NTkwNDA5NjAkajU2JGwwJGgw'
              ],
              isGuestFavorite: true
            }} />
          ))}
        </div>
      </section>

      {/* Available next month in London */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Available next month in London</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => scrollCarousel(londonRef, 'left', 'london')}
              className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => scrollCarousel(londonRef, 'right', 'london')}
              className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
        
        <div ref={londonRef} className="flex overflow-x-auto scrollbar-hide pb-4 space-x-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <PropertyCard key={`london-${index}`} imageIndex={index} property={{
              _id: `london-${index}`,
              title: index === 0 ? 'Room in London' : 
                    index === 1 ? 'Room in Paddington' :
                    index === 2 ? 'Room in Lambeth' :
                    index === 3 ? 'Room in London' :
                    index === 4 ? 'Room in London' :
                    'Room in Hammersmith',
              price: index === 0 ? 89 : index === 1 ? 145 : index === 2 ? 78 : index === 3 ? 92 : index === 4 ? 156 : 134,
              rating: index === 0 ? 4.8 : index === 1 ? 4.92 : index === 2 ? 4.76 : index === 3 ? 4.85 : index === 4 ? 4.91 : 4.88,
              images: [
                'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?_gl=1*1iuiti5*_ga*MTcyNDAyNzY4MS4xNzU5MDQwOTU3*_ga_8JE65Q40S6*czE3NTkwNDA5NTYkbzEkZzEkdDE3NTkwNDA5NjAkajU2JGwwJGgw',
                'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?_gl=1*1iuiti5*_ga*MTcyNDAyNzY4MS4xNzU5MDQwOTU3*_ga_8JE65Q40S6*czE3NTkwNDA5NTYkbzEkZzEkdDE3NTkwNDA5NjAkajU2JGwwJGgw',
                'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?_gl=1*1iuiti5*_ga*MTcyNDAyNzY4MS4xNzU5MDQwOTU3*_ga_8JE65Q40S6*czE3NTkwNDA5NTYkbzEkZzEkdDE3NTkwNDA5NjAkajU2JGwwJGgw',
                'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?_gl=1*1iuiti5*_ga*MTcyNDAyNzY4MS4xNzU5MDQwOTU3*_ga_8JE65Q40S6*czE3NTkwNDA5NTYkbzEkZzEkdDE3NTkwNDA5NjAkajU2JGwwJGgw',
                'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?_gl=1*1iuiti5*_ga*MTcyNDAyNzY4MS4xNzU5MDQwOTU3*_ga_8JE65Q40S6*czE3NTkwNDA5NTYkbzEkZzEkdDE3NTkwNDA5NjAkajU2JGwwJGgw',
                'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?_gl=1*1iuiti5*_ga*MTcyNDAyNzY4MS4xNzU5MDQwOTU3*_ga_8JE65Q40S6*czE3NTkwNDA5NTYkbzEkZzEkdDE3NTkwNDA5NjAkajU2JGwwJGgw'
              ],
              isGuestFavorite: true
            }} />
          ))}
        </div>
      </section>

      {/* Homes in Toronto */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Homes in Toronto</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => scrollCarousel(torontoRef, 'left', 'toronto')}
              className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => scrollCarousel(torontoRef, 'right', 'toronto')}
              className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
        
        <div ref={torontoRef} className="flex overflow-x-auto scrollbar-hide pb-4 space-x-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <PropertyCard key={`toronto-${index}`} imageIndex={index} property={{
              _id: `toronto-${index}`,
              title: index === 0 ? 'Room in Toronto' : 
                    index === 1 ? 'Room in Toronto' :
                    index === 2 ? 'Room in Toronto' :
                    index === 3 ? 'Room in Toronto' :
                    index === 4 ? 'Guesthouse in Toronto' : 'Room in North York',
              price: index === 0 ? 67 : index === 1 ? 89 : index === 2 ? 78 : index === 3 ? 92 : index === 4 ? 145 : 112,
              rating: index === 0 ? 4.8 : index === 1 ? 4.9 : index === 2 ? 4.85 : index === 3 ? 4.91 : index === 4 ? 4.93 : 4.87,
              images: [
                'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?_gl=1*1iuiti5*_ga*MTcyNDAyNzY4MS4xNzU5MDQwOTU3*_ga_8JE65Q40S6*czE3NTkwNDA5NTYkbzEkZzEkdDE3NTkwNDA5NjAkajU2JGwwJGgw',
                'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?_gl=1*1iuiti5*_ga*MTcyNDAyNzY4MS4xNzU5MDQwOTU3*_ga_8JE65Q40S6*czE3NTkwNDA5NTYkbzEkZzEkdDE3NTkwNDA5NjAkajU2JGwwJGgw',
                'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?_gl=1*1iuiti5*_ga*MTcyNDAyNzY4MS4xNzU5MDQwOTU3*_ga_8JE65Q40S6*czE3NTkwNDA5NTYkbzEkZzEkdDE3NTkwNDA5NjAkajU2JGwwJGgw',
                'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?_gl=1*1iuiti5*_ga*MTcyNDAyNzY4MS4xNzU5MDQwOTU3*_ga_8JE65Q40S6*czE3NTkwNDA5NTYkbzEkZzEkdDE3NTkwNDA5NjAkajU2JGwwJGgw',
                'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?_gl=1*1iuiti5*_ga*MTcyNDAyNzY4MS4xNzU5MDQwOTU3*_ga_8JE65Q40S6*czE3NTkwNDA5NTYkbzEkZzEkdDE3NTkwNDA5NjAkajU2JGwwJGgw',
                'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?_gl=1*1iuiti5*_ga*MTcyNDAyNzY4MS4xNzU5MDQwOTU3*_ga_8JE65Q40S6*czE3NTkwNDA5NTYkbzEkZzEkdDE3NTkwNDA5NjAkajU2JGwwJGgw'
              ],
              isGuestFavorite: true
            }} />
          ))}
        </div>
      </section>

      {/* Available next month in Seoul */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Available next month in Seoul</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => scrollCarousel(seoulRef, 'left', 'seoul')}
              className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => scrollCarousel(seoulRef, 'right', 'seoul')}
              className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
        
        <div ref={seoulRef} className="flex overflow-x-auto scrollbar-hide pb-4 space-x-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <PropertyCard key={`seoul-${index}`} imageIndex={index} property={{
              _id: `seoul-${index}`,
              title: index === 0 ? 'Guesthouse in Seoul' : 
                    index === 1 ? 'Guesthouse in Seoul' :
                    index === 2 ? 'Room in Jongno-gu' :
                    index === 3 ? 'Room in Mapo-gu' :
                    index === 4 ? 'Apartment in Seoul' : 'Room in Seoul',
              price: index === 0 ? 45 : index === 1 ? 67 : index === 2 ? 89 : index === 3 ? 78 : index === 4 ? 123 : 95,
              rating: index === 0 ? 4.85 : index === 1 ? 4.9 : index === 2 ? 4.82 : index === 3 ? 4.88 : index === 4 ? 4.94 : 4.87,
              images: [
                'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?_gl=1*1iuiti5*_ga*MTcyNDAyNzY4MS4xNzU5MDQwOTU3*_ga_8JE65Q40S6*czE3NTkwNDA5NTYkbzEkZzEkdDE3NTkwNDA5NjAkajU2JGwwJGgw',
                'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?_gl=1*1iuiti5*_ga*MTcyNDAyNzY4MS4xNzU5MDQwOTU3*_ga_8JE65Q40S6*czE3NTkwNDA5NTYkbzEkZzEkdDE3NTkwNDA5NjAkajU2JGwwJGgw',
                'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?_gl=1*1iuiti5*_ga*MTcyNDAyNzY4MS4xNzU5MDQwOTU3*_ga_8JE65Q40S6*czE3NTkwNDA5NTYkbzEkZzEkdDE3NTkwNDA5NjAkajU2JGwwJGgw',
                'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?_gl=1*1iuiti5*_ga*MTcyNDAyNzY4MS4xNzU5MDQwOTU3*_ga_8JE65Q40S6*czE3NTkwNDA5NTYkbzEkZzEkdDE3NTkwNDA5NjAkajU2JGwwJGgw',
                'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?_gl=1*1iuiti5*_ga*MTcyNDAyNzY4MS4xNzU5MDQwOTU3*_ga_8JE65Q40S6*czE3NTkwNDA5NTYkbzEkZzEkdDE3NTkwNDA5NjAkajU2JGwwJGgw',
                'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?_gl=1*1iuiti5*_ga*MTcyNDAyNzY4MS4xNzU5MDQwOTU3*_ga_8JE65Q40S6*czE3NTkwNDA5NTYkbzEkZzEkdDE3NTkwNDA5NjAkajU2JGwwJGgw'
              ],
              isGuestFavorite: true
            }} />
          ))}
        </div>
      </section>

      {/* Places to stay in Osaka */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Places to stay in Osaka</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => scrollCarousel(osakaRef, 'left', 'osaka')}
              className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => scrollCarousel(osakaRef, 'right', 'osaka')}
              className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
        
        <div ref={osakaRef} className="flex overflow-x-auto scrollbar-hide pb-4 space-x-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <PropertyCard key={`osaka-${index}`} imageIndex={index} property={{
              _id: `osaka-${index}`,
              title: index === 0 ? 'Apartment in Osaka' : 
                    index === 1 ? 'Room in Osaka' :
                    index === 2 ? 'Apartment in Osaka' :
                    index === 3 ? 'Apartment in Namba-Minami' :
                    index === 4 ? 'Apartment in Osaka' : 'Apartment in Sumiyoshi',
              price: index === 0 ? 89 : index === 1 ? 67 : index === 2 ? 145 : index === 3 ? 123 : index === 4 ? 98 : 112,
              rating: index === 0 ? 4.88 : index === 1 ? 4.85 : index === 2 ? 4.92 : index === 3 ? 4.89 : index === 4 ? 4.91 : 4.86,
              images: [
                'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?_gl=1*1iuiti5*_ga*MTcyNDAyNzY4MS4xNzU5MDQwOTU3*_ga_8JE65Q40S6*czE3NTkwNDA5NTYkbzEkZzEkdDE3NTkwNDA5NjAkajU2JGwwJGgw',
                'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?_gl=1*1iuiti5*_ga*MTcyNDAyNzY4MS4xNzU5MDQwOTU3*_ga_8JE65Q40S6*czE3NTkwNDA5NTYkbzEkZzEkdDE3NTkwNDA5NjAkajU2JGwwJGgw',
                'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?_gl=1*1iuiti5*_ga*MTcyNDAyNzY4MS4xNzU5MDQwOTU3*_ga_8JE65Q40S6*czE3NTkwNDA5NTYkbzEkZzEkdDE3NTkwNDA5NjAkajU2JGwwJGgw',
                'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?_gl=1*1iuiti5*_ga*MTcyNDAyNzY4MS4xNzU5MDQwOTU3*_ga_8JE65Q40S6*czE3NTkwNDA5NTYkbzEkZzEkdDE3NTkwNDA5NjAkajU2JGwwJGgw',
                'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?_gl=1*1iuiti5*_ga*MTcyNDAyNzY4MS4xNzU5MDQwOTU3*_ga_8JE65Q40S6*czE3NTkwNDA5NTYkbzEkZzEkdDE3NTkwNDA5NjAkajU2JGwwJGgw',
                'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?_gl=1*1iuiti5*_ga*MTcyNDAyNzY4MS4xNzU5MDQwOTU3*_ga_8JE65Q40S6*czE3NTkwNDA5NTYkbzEkZzEkdDE3NTkwNDA5NjAkajU2JGwwJGgw'
              ],
              isGuestFavorite: true
            }} />
          ))}
        </div>
      </section>

      {/* Check out homes in Tokyo */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Check out homes in Tokyo</h2>
          <button className="text-gray-600 hover:text-gray-900">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        {/* Navigation arrows - aligned with header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => scrollCarousel(londonRef, 'left', 'london')}
            className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => scrollCarousel(londonRef, 'right', 'london')}
            className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        <div ref={londonRef} className="flex overflow-x-auto scrollbar-hide pb-4 space-x-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <PropertyCard key={`tokyo-${index}`} imageIndex={index} property={{
              _id: `tokyo-${index}`,
              title: index === 0 ? 'Room in Sumida City' : 
                    index === 1 ? 'Apartment in Shibuya' :
                    index === 2 ? 'Room in Taito City' :
                    index === 3 ? 'Apartment in Shinjuku' :
                    index === 4 ? 'Apartment in Tokyo' : 'Room in Harajuku',
              price: index === 0 ? 134 : index === 1 ? 189 : index === 2 ? 98 : index === 3 ? 156 : index === 4 ? 145 : 123,
              rating: index === 0 ? 4.91 : index === 1 ? 4.94 : index === 2 ? 4.87 : index === 3 ? 4.89 : index === 4 ? 4.92 : 4.88,
              images: [
                'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?_gl=1*1iuiti5*_ga*MTcyNDAyNzY4MS4xNzU5MDQwOTU3*_ga_8JE65Q40S6*czE3NTkwNDA5NTYkbzEkZzEkdDE3NTkwNDA5NjAkajU2JGwwJGgw',
                'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?_gl=1*1iuiti5*_ga*MTcyNDAyNzY4MS4xNzU5MDQwOTU3*_ga_8JE65Q40S6*czE3NTkwNDA5NTYkbzEkZzEkdDE3NTkwNDA5NjAkajU2JGwwJGgw',
                'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?_gl=1*1iuiti5*_ga*MTcyNDAyNzY4MS4xNzU5MDQwOTU3*_ga_8JE65Q40S6*czE3NTkwNDA5NTYkbzEkZzEkdDE3NTkwNDA5NjAkajU2JGwwJGgw',
                'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?_gl=1*1iuiti5*_ga*MTcyNDAyNzY4MS4xNzU5MDQwOTU3*_ga_8JE65Q40S6*czE3NTkwNDA5NTYkbzEkZzEkdDE3NTkwNDA5NjAkajU2JGwwJGgw',
                'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?_gl=1*1iuiti5*_ga*MTcyNDAyNzY4MS4xNzU5MDQwOTU3*_ga_8JE65Q40S6*czE3NTkwNDA5NTYkbzEkZzEkdDE3NTkwNDA5NjAkajU2JGwwJGgw',
                'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?_gl=1*1iuiti5*_ga*MTcyNDAyNzY4MS4xNzU5MDQwOTU3*_ga_8JE65Q40S6*czE3NTkwNDA5NTYkbzEkZzEkdDE3NTkwNDA5NjAkajU2JGwwJGgw'
              ],
              isGuestFavorite: true
            }} />
          ))}
        </div>
      </section>

      {/* Popular homes in Melbourne */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Popular homes in Melbourne</h2>
          <button className="text-gray-600 hover:text-gray-900">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        {/* Navigation arrows - aligned with header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => scrollCarousel(londonRef, 'left', 'london')}
            className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => scrollCarousel(londonRef, 'right', 'london')}
            className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        <div ref={londonRef} className="flex overflow-x-auto scrollbar-hide pb-4 space-x-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <PropertyCard key={`melbourne-${index}`} imageIndex={index} property={{
              _id: `melbourne-${index}`,
              title: index === 0 ? 'Room in Southbank' : 
                    index === 1 ? 'Room in Melbourne' :
                    index === 2 ? 'Room in Collingwood' :
                    index === 3 ? 'Apartment in Melbourne' :
                    index === 4 ? 'Room in Melbourne' : 'Room in South Melbourne',
              price: index === 0 ? 145 : index === 1 ? 123 : index === 2 ? 98 : index === 3 ? 189 : index === 4 ? 156 : 134,
              rating: index === 0 ? 4.92 : index === 1 ? 4.89 : index === 2 ? 4.87 : index === 3 ? 4.94 : index === 4 ? 4.91 : 4.88,
              images: [
                'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?_gl=1*1iuiti5*_ga*MTcyNDAyNzY4MS4xNzU5MDQwOTU3*_ga_8JE65Q40S6*czE3NTkwNDA5NTYkbzEkZzEkdDE3NTkwNDA5NjAkajU2JGwwJGgw',
                'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?_gl=1*1iuiti5*_ga*MTcyNDAyNzY4MS4xNzU5MDQwOTU3*_ga_8JE65Q40S6*czE3NTkwNDA5NTYkbzEkZzEkdDE3NTkwNDA5NjAkajU2JGwwJGgw',
                'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?_gl=1*1iuiti5*_ga*MTcyNDAyNzY4MS4xNzU5MDQwOTU3*_ga_8JE65Q40S6*czE3NTkwNDA5NTYkbzEkZzEkdDE3NTkwNDA5NjAkajU2JGwwJGgw',
                'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?_gl=1*1iuiti5*_ga*MTcyNDAyNzY4MS4xNzU5MDQwOTU3*_ga_8JE65Q40S6*czE3NTkwNDA5NTYkbzEkZzEkdDE3NTkwNDA5NjAkajU2JGwwJGgw',
                'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?_gl=1*1iuiti5*_ga*MTcyNDAyNzY4MS4xNzU5MDQwOTU3*_ga_8JE65Q40S6*czE3NTkwNDA5NTYkbzEkZzEkdDE3NTkwNDA5NjAkajU2JGwwJGgw',
                'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?_gl=1*1iuiti5*_ga*MTcyNDAyNzY4MS4xNzU5MDQwOTU3*_ga_8JE65Q40S6*czE3NTkwNDA5NTYkbzEkZzEkdDE3NTkwNDA5NjAkajU2JGwwJGgw'
              ],
              isGuestFavorite: true
            }} />
          ))}
        </div>
      </section>

      {/* Stay in Britain */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Stay in Britain</h2>
          <button className="text-gray-600 hover:text-gray-900">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        {/* Navigation arrows - aligned with header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => scrollCarousel(londonRef, 'left', 'london')}
            className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => scrollCarousel(londonRef, 'right', 'london')}
            className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        <div ref={londonRef} className="flex overflow-x-auto scrollbar-hide pb-4 space-x-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <PropertyCard key={`britain-${index}`} imageIndex={index} property={{
              _id: `britain-${index}`,
              title: index === 0 ? 'Apartment in Hill along' : 
                    index === 1 ? 'Apartment in Greenwich Park' :
                    index === 2 ? 'Apartment in Birmingham' :
                    index === 3 ? 'Apartment in Hill along' :
                    index === 4 ? 'House in Long Hill' : 'Apartment in Birmingham',
              price: index === 0 ? 98 : index === 1 ? 134 : index === 2 ? 78 : index === 3 ? 145 : index === 4 ? 189 : 112,
              rating: index === 0 ? 4.87 : index === 1 ? 4.91 : index === 2 ? 4.84 : index === 3 ? 4.93 : index === 4 ? 4.89 : 4.86,
              images: [
                'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?_gl=1*1iuiti5*_ga*MTcyNDAyNzY4MS4xNzU5MDQwOTU3*_ga_8JE65Q40S6*czE3NTkwNDA5NTYkbzEkZzEkdDE3NTkwNDA5NjAkajU2JGwwJGgw',
                'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?_gl=1*1iuiti5*_ga*MTcyNDAyNzY4MS4xNzU5MDQwOTU3*_ga_8JE65Q40S6*czE3NTkwNDA5NTYkbzEkZzEkdDE3NTkwNDA5NjAkajU2JGwwJGgw',
                'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?_gl=1*1iuiti5*_ga*MTcyNDAyNzY4MS4xNzU5MDQwOTU3*_ga_8JE65Q40S6*czE3NTkwNDA5NTYkbzEkZzEkdDE3NTkwNDA5NjAkajU2JGwwJGgw',
                'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?_gl=1*1iuiti5*_ga*MTcyNDAyNzY4MS4xNzU5MDQwOTU3*_ga_8JE65Q40S6*czE3NTkwNDA5NTYkbzEkZzEkdDE3NTkwNDA5NjAkajU2JGwwJGgw',
                'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?_gl=1*1iuiti5*_ga*MTcyNDAyNzY4MS4xNzU5MDQwOTU3*_ga_8JE65Q40S6*czE3NTkwNDA5NTYkbzEkZzEkdDE3NTkwNDA5NjAkajU2JGwwJGgw',
                'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?_gl=1*1iuiti5*_ga*MTcyNDAyNzY4MS4xNzU5MDQwOTU3*_ga_8JE65Q40S6*czE3NTkwNDA5NTYkbzEkZzEkdDE3NTkwNDA5NjAkajU2JGwwJGgw'
              ],
              isGuestFavorite: true
            }} />
          ))}
        </div>
      </section>
    </div>
  );
}