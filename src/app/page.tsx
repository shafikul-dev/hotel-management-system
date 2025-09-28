'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';

import HomeCarousels from '@/components/HomeCarousels';

import SearchResults from '@/components/SearchResults';
import PropertyDetails from '@/components/PropertyDetails';
import Footer from '@/components/Footer';
import { useSearch } from '@/hooks/useSearch';

interface SearchParams {
  destination: string;
  checkIn: Date | null;
  checkOut: Date | null;
  adults: number;
  children: number;
  infants: number;
  pets: number;
}

export default function Home() {
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPropertyDetails, setShowPropertyDetails] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  // State to track if user has scrolled down enough to show sticky search bar
  // const [isScrolled, setIsScrolled] = useState(false); // Disabled sticky animation
  const { results, loading, error, search } = useSearch();

  // Scroll detection system - DISABLED (sticky animation turned off)
  // useEffect(() => {
  //   const handleScroll = () => {
  //     const scrollTop = window.scrollY;
  //     const shouldShow = scrollTop > 100;
  //     console.log('Scroll position:', scrollTop, 'Should show sticky:', shouldShow);
  //     setIsScrolled(shouldShow);
  //   };
  //   window.addEventListener('scroll', handleScroll);
  //   return () => window.removeEventListener('scroll', handleScroll);
  // }, []);

  const handleSearch = async (params: SearchParams) => {
    setSearchQuery(params.destination || 'your search');
    setIsSearchMode(true);
    
    await search({
      ...params,
      minPrice: 0,
      maxPrice: 10000,
    });
  };

  const resetToHome = () => {
    setIsSearchMode(false);
    setSearchQuery('');
    setShowPropertyDetails(false);
    setSelectedPropertyId(null);
  };

  const handlePropertyClick = (propertyId: string) => {
    setSelectedPropertyId(propertyId);
    setShowPropertyDetails(true);
  };

  const handleBackFromProperty = () => {
    setShowPropertyDetails(false);
    setSelectedPropertyId(null);
  };

  return (
    <div className="min-h-screen bg-white">
      {showPropertyDetails && selectedPropertyId ? (
        <PropertyDetails 
          propertyId={selectedPropertyId}
          onBack={handleBackFromProperty}
        />
      ) : (
        <>
          <Header />
          
          {/* 
            STICKY SEARCH BAR - DISABLED
            This creates the Airbnb-style sticky search functionality
          */}
          {/* <div className={`fixed top-0 left-0 right-0 z-50 bg-white border-b-2 border-red-500 shadow-lg transition-all duration-300 ease-in-out ${
            // Animation logic: Show sticky bar when scrolled AND not in search mode
            isScrolled && !isSearchMode 
              ? 'translate-y-0 opacity-100'           // Visible: normal position, fully opaque
              : '-translate-y-full opacity-0 pointer-events-none'  // Hidden: moved up, transparent, no clicks
          }`}>
            <div className="px-6 lg:px-10 xl:px-20 py-4">
              <div className="text-sm text-red-500 mb-2">Sticky Search Bar Active!</div>
              <SearchBar onSearch={handleSearch} />
            </div>
          </div> */}
          
          {isSearchMode ? (
            <>
              {/* 
                STICKY SEARCH BAR FOR SEARCH RESULTS - DISABLED
                This ensures users can easily modify their search while browsing results
              */}
              {/* <div className={`fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-lg transition-all duration-300 ease-in-out ${
                // Show sticky bar when scrolled (no search mode check needed here)
                isScrolled 
                  ? 'translate-y-0 opacity-100'           // Visible: normal position, fully opaque
                  : '-translate-y-full opacity-0 pointer-events-none'  // Hidden: moved up, transparent, no clicks
              }`}>
                <div className="px-6 lg:px-10 xl:px-20 py-4">
                  <SearchBar onSearch={handleSearch} />
                </div>
              </div> */}
              
              {/* 
                MAIN CONTENT AREA - No padding adjustment needed since sticky bar is disabled
              */}
              <main className="px-6 lg:px-10 xl:px-20">
                {/* Regular search bar at top of content */}
                <SearchBar onSearch={handleSearch} />
                <div className="py-4">
                  {/* Back button to return to home page */}
                  <button
                    onClick={resetToHome}
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span>Back to browsing</span>
                  </button>
                </div>
                <SearchResults 
                  results={results} 
                  loading={loading} 
                  error={error}
                  searchQuery={searchQuery}
                  onPropertyClick={handlePropertyClick}
                />
              </main>
            </>
          ) : (
            <>
              {/* 
                HOME PAGE MAIN CONTENT - No padding adjustment needed since sticky bar is disabled
              */}
              <main className="px-6 lg:px-10 xl:px-6">
                {/* Regular search bar at top of home page */}
                <SearchBar onSearch={handleSearch} />
                {/* Property carousels - the main content of the home page */}
                <HomeCarousels onPropertyClick={handlePropertyClick} />
              </main>
              
              <Footer />
            </>
          )}
        </>
      )}
    </div>
  );
}
