'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ArrowLeftIcon, HeartIcon, ShareIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid, StarIcon as StarSolid } from '@heroicons/react/24/solid';
import Header from './Header';

interface PropertyDetailsProps {
  propertyId: string;
  onBack: () => void;
}

interface Review {
  id: string;
  author: string;
  avatar: string;
  date: string;
  rating: number;
  content: string;
}

interface Host {
  name: string;
  avatar: string;
  joinedYear: string;
  reviews: number;
  verified: boolean;
  superhost: boolean;
}

interface PropertyData {
  id: string;
  title: string;
  location: string;
  images: string[];
  price: number;
  rating: number;
  reviewCount: number;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  beds: number;
  propertyType: string;
  host: Host;
  amenities: string[];
  description: string;
  houseRules: string[];
  safetyFeatures: string[];
  cancellationPolicy: string;
  reviews: Review[];
  coordinates: { lat: number; lng: number };
}

// Mock data - in real app this would come from API
const mockPropertyData: PropertyData = {
  id: '1',
  title: 'Modern Suite @ Golf Residences | Sungai Wifi',
  location: 'Entire rental unit in Kuala Lumpur, Malaysia',
  images: [
    'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?_gl=1*1iuiti5*_ga*MTcyNDAyNzY4MS4xNzU5MDQwOTU3*_ga_8JE65Q40S6*czE3NTkwNDA5NTYkbzEkZzEkdDE3NTkwNDA5NjAkajU2JGwwJGgw',
    'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?_gl=1*1iuiti5*_ga*MTcyNDAyNzY4MS4xNzU5MDQwOTU3*_ga_8JE65Q40S6*czE3NTkwNDA5NTYkbzEkZzEkdDE3NTkwNDA5NjAkajU2JGwwJGgw',
    'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?_gl=1*1iuiti5*_ga*MTcyNDAyNzY4MS4xNzU5MDQwOTU3*_ga_8JE65Q40S6*czE3NTkwNDA5NTYkbzEkZzEkdDE3NTkwNDA5NjAkajU2JGwwJGgw',
    'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?_gl=1*1iuiti5*_ga*MTcyNDAyNzY4MS4xNzU5MDQwOTU3*_ga_8JE65Q40S6*czE3NTkwNDA5NTYkbzEkZzEkdDE3NTkwNDA5NjAkajU2JGwwJGgw',
    'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?_gl=1*1iuiti5*_ga*MTcyNDAyNzY4MS4xNzU5MDQwOTU3*_ga_8JE65Q40S6*czE3NTkwNDA5NTYkbzEkZzEkdDE3NTkwNDA5NjAkajU2JGwwJGgw'
  ],
  price: 89,
  rating: 4.94,
  reviewCount: 67,
  maxGuests: 4,
  bedrooms: 2,
  bathrooms: 1,
  beds: 2,
  propertyType: 'Entire rental unit',
  host: {
    name: 'Vector',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
    joinedYear: '2018',
    reviews: 134,
    verified: true,
    superhost: true
  },
  amenities: [
    'Free WiFi',
    'Air conditioning',
    'Kitchen',
    'Pool',
    'Gym',
    'Parking',
    'TV',
    'Washer',
    'Free parking on premises',
    'Elevator',
    'Security cameras',
    'Smoke alarm'
  ],
  description: 'Welcome to our beautiful modern suite located in the prestigious Golf Residences. This fully furnished apartment offers stunning city views and all the amenities you need for a comfortable stay. The space features contemporary design with high-quality furnishings and is perfect for both business and leisure travelers.',
  houseRules: [
    'Check-in: 3:00 PM - 11:00 PM',
    'Checkout: 11:00 AM',
    'Self check-in with lockbox',
    'No smoking',
    'No parties or events',
    'No pets'
  ],
  safetyFeatures: [
    'Smoke alarm',
    'Carbon monoxide alarm',
    'Security deposit not required'
  ],
  cancellationPolicy: 'Free cancellation before Dec 20',
  reviews: [
    {
      id: '1',
      author: 'Sarah',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100',
      date: 'September 2025',
      rating: 5,
      content: 'Amazing place! Very clean and modern. The host was super responsive and helpful. Would definitely stay again!'
    },
    {
      id: '2',
      author: 'Mike',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      date: 'August 2025',
      rating: 5,
      content: 'Perfect location and beautiful apartment. Everything was exactly as described. Highly recommend!'
    },
    {
      id: '3',
      author: 'Lisa',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
      date: 'July 2025',
      rating: 4,
      content: 'Great stay overall. The apartment is modern and clean. Only minor issue was the WiFi was a bit slow.'
    }
  ],
  coordinates: { lat: 3.1319, lng: 101.6841 }
};

export default function PropertyDetails({ onBack }: PropertyDetailsProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [guests, setGuests] = useState({ adults: 1, children: 0, infants: 0 });

  const property = mockPropertyData; // In real app, fetch by propertyId

  const totalGuests = guests.adults + guests.children;
  const totalNights = checkIn && checkOut ? 
    Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)) : 0;
  const totalPrice = totalNights * property.price;
  const serviceFee = Math.round(totalPrice * 0.12);
  const cleaningFee = 25;
  const finalTotal = totalPrice + serviceFee + cleaningFee;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      {/* Name and Tittle */}
      <div className="sticky top-0 z-50 bg-white ">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              <span>Back to results</span>
            </button>
            
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
                <ShareIcon className="w-5 h-5" />
                <span className="hidden sm:inline">Share</span>
              </button>
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                {isFavorite ? (
                  <HeartSolid className="w-5 h-5 text-red-500" />
                ) : (
                  <HeartIcon className="w-5 h-5" />
                )}
                <span className="hidden sm:inline">Save</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Title and basic info */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            {property.title}
          </h1>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <StarSolid className="w-4 h-4 text-yellow-400" />
              <span className="font-medium">{property.rating}</span>
              <span className="text-gray-600">({property.reviewCount} reviews)</span>
            </div>
            <span className="text-gray-600">{property.location}</span>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 rounded-xl overflow-hidden">
            {/* Main image */}
            <div className="relative aspect-square md:row-span-2">
              <Image
                src={property.images[0]}
                alt={property.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            
            {/* Smaller images */}
            <div className="hidden md:grid grid-cols-2 gap-2">
              {property.images.slice(1, 5).map((image, index) => (
                <div key={index} className="relative aspect-square">
                  <Image
                    src={image}
                    alt={`${property.title} ${index + 2}`}
                    fill
                    className="object-cover"
                    sizes="25vw"
                  />
                  {index === 3 && property.images.length > 5 && (
                    <button
                      onClick={() => alert('Photo gallery would open here')}
                      className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-medium hover:bg-black/60 transition-colors"
                    >
                      Show all {property.images.length} photos
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Property details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Host info and property basics */}
            <div className="border-b border-gray-200 pb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {property.propertyType} hosted by {property.host.name}
                  </h2>
                  <p className="text-gray-600">
                    {property.maxGuests} guests · {property.bedrooms} bedrooms · {property.beds} beds · {property.bathrooms} bathroom
                  </p>
                </div>
                <div className="relative">
                  <Image
                    src={property.host.avatar}
                    alt={property.host.name}
                    width={56}
                    height={56}
                    className="rounded-full"
                  />
                  {property.host.superhost && (
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1">
                      <StarSolid className="w-4 h-4 text-yellow-400" />
                    </div>
                  )}
                </div>
              </div>

              {/* Host badges */}
              <div className="space-y-3">
                {property.host.superhost && (
                  <div className="flex items-center space-x-3">
                    <StarSolid className="w-5 h-5 text-yellow-400" />
                    <div>
                      <p className="font-medium text-gray-900">Superhost</p>
                      <p className="text-sm text-gray-600">Superhosts are experienced, highly rated hosts.</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Self check-in</p>
                    <p className="text-sm text-gray-600">Check yourself in with the lockbox.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="border-b border-gray-200 pb-8">
              <p className="text-gray-700 leading-relaxed">
                {property.description}
              </p>
            </div>

            {/* Where you'll sleep */}
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Where you&apos;ll sleep</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="relative aspect-video rounded-lg overflow-hidden mb-3">
                  <Image
                    src={property.images[1]}
                    alt="Bedroom"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 66vw"
                  />
                </div>
                <h4 className="font-medium text-gray-900">Bedroom</h4>
                <p className="text-sm text-gray-600">{property.beds} bed{property.beds > 1 ? 's' : ''}</p>
              </div>
            </div>

            {/* Amenities */}
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">What this place offers</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(showAllAmenities ? property.amenities : property.amenities.slice(0, 10)).map((amenity, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-6 h-6 flex items-center justify-center">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700">{amenity}</span>
                  </div>
                ))}
              </div>
              {property.amenities.length > 10 && (
                <button
                  onClick={() => setShowAllAmenities(!showAllAmenities)}
                  className="mt-4 px-6 py-2 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
                >
                  {showAllAmenities ? 'Show less' : `Show all ${property.amenities.length} amenities`}
                </button>
              )}
            </div>

            {/* Calendar */}
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Select check-in date</h3>
              <p className="text-gray-600 mb-4">Add your travel dates for exact pricing</p>
              {/* Simple calendar placeholder */}
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <p className="text-gray-500">Calendar component would go here</p>
                <p className="text-sm text-gray-400 mt-2">Minimum stay: 2 nights</p>
              </div>
            </div>
          </div>

          {/* Right column - Booking widget */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="border border-gray-200 rounded-xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-baseline space-x-1">
                    <span className="text-2xl font-semibold text-gray-900">${property.price}</span>
                    <span className="text-gray-600">night</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <StarSolid className="w-4 h-4 text-yellow-400" />
                    <span className="font-medium">{property.rating}</span>
                    <span className="text-gray-600 text-sm">({property.reviewCount})</span>
                  </div>
                </div>

                {/* Booking form */}
                <div className="space-y-4">
                  {/* Dates */}
                  <div className="grid grid-cols-2 border border-gray-300 rounded-lg overflow-hidden">
                    <div className="p-3 border-r border-gray-300">
                      <label className="block text-xs font-semibold text-gray-800 mb-1">CHECK-IN</label>
                      <input
                        type="date"
                        className="w-full text-sm bg-transparent border-none outline-none"
                        onChange={(e) => setCheckIn(new Date(e.target.value))}
                      />
                    </div>
                    <div className="p-3">
                      <label className="block text-xs font-semibold text-gray-800 mb-1">CHECKOUT</label>
                      <input
                        type="date"
                        className="w-full text-sm bg-transparent border-none outline-none"
                        onChange={(e) => setCheckOut(new Date(e.target.value))}
                      />
                    </div>
                  </div>

                  {/* Guests */}
                  <div className="border border-gray-300 rounded-lg p-3">
                    <label className="block text-xs font-semibold text-gray-800 mb-1">GUESTS</label>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{totalGuests} guest{totalGuests !== 1 ? 's' : ''}</span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setGuests(prev => ({ ...prev, adults: Math.max(1, prev.adults - 1) }))}
                          className="w-6 h-6 rounded-full border border-gray-400 flex items-center justify-center text-sm hover:border-gray-600"
                        >
                          -
                        </button>
                        <span className="text-sm w-8 text-center">{guests.adults}</span>
                        <button
                          onClick={() => setGuests(prev => ({ ...prev, adults: prev.adults + 1 }))}
                          className="w-6 h-6 rounded-full border border-gray-400 flex items-center justify-center text-sm hover:border-gray-600"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Reserve button */}
                  <button className="w-full bg-[#FF385C] text-white py-3 rounded-lg font-semibold hover:bg-[#E31C5F] transition-colors">
                    Reserve
                  </button>

                  <p className="text-center text-sm text-gray-600">You won&apos;t be charged yet</p>

                  {/* Price breakdown */}
                  {totalNights > 0 && (
                    <div className="space-y-3 pt-4 border-t border-gray-200">
                      <div className="flex justify-between text-sm">
                        <span>${property.price} x {totalNights} nights</span>
                        <span>${totalPrice}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Cleaning fee</span>
                        <span>${cleaningFee}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Service fee</span>
                        <span>${serviceFee}</span>
                      </div>
                      <div className="flex justify-between font-semibold pt-3 border-t border-gray-200">
                        <span>Total</span>
                        <span>${finalTotal}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews section */}
        <div className="mt-12 border-t border-gray-200 pt-8">
          <div className="flex items-center space-x-2 mb-6">
            <StarSolid className="w-6 h-6 text-yellow-400" />
            <h3 className="text-2xl font-semibold text-gray-900">
              {property.rating} · {property.reviewCount} reviews
            </h3>
          </div>

          {/* Review stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {[
              { label: 'Cleanliness', rating: 4.9 },
              { label: 'Accuracy', rating: 4.8 },
              { label: 'Check-in', rating: 5.0 },
              { label: 'Communication', rating: 4.9 },
              { label: 'Location', rating: 4.7 },
              { label: 'Value', rating: 4.8 }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{item.label}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-1">
                    <div 
                      className="bg-gray-900 h-1 rounded-full" 
                      style={{ width: `${(item.rating / 5) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium w-8">{item.rating}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Individual reviews */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {(showAllReviews ? property.reviews : property.reviews.slice(0, 6)).map((review) => (
              <div key={review.id} className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Image
                    src={review.avatar}
                    alt={review.author}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{review.author}</p>
                    <p className="text-sm text-gray-600">{review.date}</p>
                  </div>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">{review.content}</p>
              </div>
            ))}
          </div>

          {property.reviews.length > 6 && (
            <button
              onClick={() => setShowAllReviews(!showAllReviews)}
              className="mt-6 px-6 py-2 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
            >
              {showAllReviews ? 'Show less' : `Show all ${property.reviews.length} reviews`}
            </button>
          )}
        </div>

        {/* Location */}
        <div className="mt-12 border-t border-gray-200 pt-8">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">Where you&apos;ll be</h3>
          <p className="text-gray-600 mb-6">{property.location}</p>
          
          {/* Map placeholder */}
          <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-500 font-medium">Interactive Map</p>
              <p className="text-sm text-gray-400 mt-1">Google Maps integration would go here</p>
            </div>
          </div>
        </div>

        {/* Host info */}
        <div className="mt-12 border-t border-gray-200 pt-8">
          <div className="flex items-center space-x-4 mb-6">
            <Image
              src={property.host.avatar}
              alt={property.host.name}
              width={64}
              height={64}
              className="rounded-full"
            />
            <div>
              <h3 className="text-2xl font-semibold text-gray-900">
                Meet your host, {property.host.name}
              </h3>
              <p className="text-gray-600">Joined in {property.host.joinedYear}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center space-x-2">
              <StarSolid className="w-5 h-5 text-yellow-400" />
              <span className="font-medium">{property.host.reviews} Reviews</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <span className="font-medium">Identity verified</span>
            </div>
            {property.host.superhost && (
              <div className="flex items-center space-x-2">
                <StarSolid className="w-5 h-5 text-yellow-400" />
                <span className="font-medium">Superhost</span>
              </div>
            )}
          </div>

          <button className="px-6 py-2 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
            Contact Host
          </button>
        </div>

        {/* Things to know */}
        <div className="mt-12 border-t border-gray-200 pt-8">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6">Things to know</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">House rules</h4>
              <ul className="space-y-2">
                {property.houseRules.map((rule, index) => (
                  <li key={index} className="text-sm text-gray-700">{rule}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Safety & property</h4>
              <ul className="space-y-2">
                {property.safetyFeatures.map((feature, index) => (
                  <li key={index} className="text-sm text-gray-700">{feature}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Cancellation policy</h4>
              <p className="text-sm text-gray-700">{property.cancellationPolicy}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}