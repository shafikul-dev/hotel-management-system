'use client';

import { useState, useRef, useEffect } from 'react';

interface SearchParams {
  destination: string;
  checkIn: Date | null;
  checkOut: Date | null;
  adults: number;
  children: number;
  infants: number;
  pets: number;
}



interface SearchBarProps {
  onSearch?: (params: SearchParams) => Promise<void>;
}

const suggestedDestinations = [
  { name: 'Toronto, Canada', subtitle: 'For sights like CN Tower', icon: '🏢' },
  { name: 'Kolkata, India', subtitle: 'For its top-notch dining', icon: '🍜' },
  { name: 'Edmonton, Canada', subtitle: 'For a trip abroad', icon: '✈️' },
  { name: 'Bangkok, Thailand', subtitle: 'For its bustling nightlife', icon: '🌃' },
  { name: 'Istanbul, Türkiye', subtitle: 'For sights like Galata Tower', icon: '🕌' },
  { name: 'Saskatoon, Canada', subtitle: 'For a trip abroad', icon: '🏔️' },
  { name: 'Chattogram, Bangladesh', subtitle: 'A hidden gem', icon: '💎' },
];

export default function SearchBar({ onSearch }: SearchBarProps = {}) {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    destination: '',
    checkIn: null,
    checkOut: null,
    adults: 0,
    children: 0,
    infants: 0,
    pets: 0,
  });

  const [activeField, setActiveField] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGuestPicker, setShowGuestPicker] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(() => {
    // Use current date to show current year
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const searchBarRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
        setActiveField(null);
        setShowSuggestions(false);
        setShowDatePicker(false);
        setShowGuestPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDestinationChange = (value: string) => {
    setSearchParams(prev => ({ ...prev, destination: value }));
    setShowSuggestions(value.length > 0);
  };

  const selectDestination = (destination: string) => {
    setSearchParams(prev => ({ ...prev, destination }));
    setShowSuggestions(false);
    // Auto-focus to check-in after selecting destination
    setActiveField('checkin');
    setShowDatePicker(true);
  };

  const handleDateSelect = (date: Date, type: 'checkIn' | 'checkOut') => {
    setSearchParams(prev => ({ ...prev, [type]: date }));
    
    if (type === 'checkIn') {
      // Auto-focus to check-out after selecting check-in
      setActiveField('checkout');
      // Keep date picker open for check-out selection
      return;
    }
    
    if (type === 'checkOut') {
      // Auto-focus to guests after selecting check-out
      setShowDatePicker(false);
      setActiveField('guests');
      setShowGuestPicker(true);
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'Add dates';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getTotalGuests = () => {
    const total = searchParams.adults + searchParams.children;
    if (total === 0) return 'Add guests';
    if (total === 1) return '1 guest';
    return `${total} guests`;
  };

  const updateGuestCount = (type: keyof SearchParams, delta: number) => {
    setSearchParams(prev => ({
      ...prev,
      [type]: Math.max(0, (prev[type] as number) + delta)
    }));
  };

  const handleGuestSelectionComplete = () => {
    // Close guest picker and focus on search button
    setShowGuestPicker(false);
    setActiveField(null);
    // Optional: Auto-trigger search after guest selection
    // handleSearch();
  };

  const generateCalendar = (month: Date) => {
    const start = new Date(month.getFullYear(), month.getMonth(), 1);
    const end = new Date(month.getFullYear(), month.getMonth() + 1, 0);
    const startDay = start.getDay();
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }

    // Days of the month
    for (let day = 1; day <= end.getDate(); day++) {
      days.push(new Date(month.getFullYear(), month.getMonth(), day));
    }

    return days;
  };

  const isDateSelected = (date: Date) => {
    return (searchParams.checkIn && date.toDateString() === searchParams.checkIn.toDateString()) ||
           (searchParams.checkOut && date.toDateString() === searchParams.checkOut.toDateString());
  };

  const handleSearch = async () => {
    if (!searchParams.destination && searchParams.adults === 0 && searchParams.children === 0) {
      return; // Don't search if no meaningful criteria
    }

    try {
      // Close all dropdowns
      setActiveField(null);
      setShowSuggestions(false);
      setShowDatePicker(false);
      setShowGuestPicker(false);

      // Trigger search - pass results to parent component
      if (onSearch) {
        await onSearch(searchParams);
      }
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  return (
    <div className="py-8 border-b border-gray-200 mb-8" ref={searchBarRef}>
      {/* Search Form */}
      <div className="max-w-4xl mx-auto relative">
        <div className="flex items-center bg-white border border-gray-300 rounded-full shadow-lg hover:shadow-xl transition-shadow p-1 md:p-2">
          {/* Where */}
          <div 
            className={`flex-1 px-2 text-xs md:px-6 py-1 md:py-3 rounded-full cursor-pointer transition-colors ${
              activeField === 'where' ? 'bg-white shadow-lg' : 'hover:bg-gray-100'
            }`}
            onClick={() => {
              setActiveField('where');
              setShowSuggestions(true);
              setShowDatePicker(false);
              setShowGuestPicker(false);
            }}
          >
            <div className="text-xs font-semibold text-gray-800 mb-1">Where</div>
            <input
              type="text"
              placeholder="Search destinations"
              value={searchParams.destination}
              onChange={(e) => handleDestinationChange(e.target.value)}
              className="w-full text-sm text-gray-700 placeholder-gray-400 bg-transparent border-none outline-none"
            />
          </div>

          <div className="w-px h-12 md:h-8 bg-gray-300"></div>

          {/* Check in */}
          <div 
            className={`flex-1 text-center md:text-left px-2 md:px-6 py-1 md:py-3 rounded-full cursor-pointer transition-colors ${
              activeField === 'checkin' ? 'bg-white shadow-lg' : 'hover:bg-gray-100'
            }`}
            onClick={() => {
              setActiveField('checkin');
              setShowDatePicker(true);
              setShowSuggestions(false);
              setShowGuestPicker(false);
            }}
          >
            <div className="text-xs font-semibold text-gray-800 mb-1">Check in</div>
            <div className="text-sm text-gray-700">{formatDate(searchParams.checkIn)}</div>
          </div>

          <div className="w-px h-8 bg-gray-300"></div>

          {/* Check out */}
          <div 
            className={`flex-1 px-2 md:text-left text-center  md:px-6 py-1 md:py-3 rounded-full cursor-pointer transition-colors ${
              activeField === 'checkout' ? 'bg-white shadow-lg' : 'hover:bg-gray-100'
            }`}
            onClick={() => {
              setActiveField('checkout');
              setShowDatePicker(true);
              setShowSuggestions(false);
              setShowGuestPicker(false);
            }}
          >
            <div className="text-xs font-semibold text-gray-800 mb-1">Check out</div>
            <div className="text-sm text-gray-700">{formatDate(searchParams.checkOut)}</div>
          </div>

          <div className="w-px h-8 bg-gray-300"></div>

          {/* Who */}
          <div 
            className={`flex-1 px-2 md:px-6 py-1 text-center md:text-left md:py-3 rounded-full cursor-pointer transition-colors ${
              activeField === 'guests' ? 'bg-white shadow-lg' : 'hover:bg-gray-100'
            }`}
            onClick={() => {
              setActiveField('guests');
              setShowGuestPicker(true);
              setShowSuggestions(false);
              setShowDatePicker(false);
            }}
          >
            <div className="text-xs font-semibold text-gray-800 mb-1">Who</div>
            <div className="text-sm text-gray-700">{getTotalGuests()}</div>
          </div>

          {/* Search button */}
          <button 
            onClick={handleSearch}
            className="bg-[#FF385C] text-white p-4 rounded-full hover:bg-[#E31C5F] transition-colors ml-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>

        {/* Destination Suggestions Dropdown */}
        {showSuggestions && (
          <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 z-50">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Suggested destinations</h3>
            <div className="space-y-2">
              {suggestedDestinations
                .filter(dest => 
                  searchParams.destination === '' || 
                  dest.name.toLowerCase().includes(searchParams.destination.toLowerCase())
                )
                .map((destination, index) => (
                <button
                  key={index}
                  onClick={() => selectDestination(destination.name)}
                  className="w-full flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
                >
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xl">
                    {destination.icon}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{destination.name}</div>
                    <div className="text-sm text-gray-500">{destination.subtitle}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Date Picker Modal */}
        {showDatePicker && (
          <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 z-50">
            {/* Date tabs */}
            <div className="flex items-center justify-center space-x-8 mb-6">
              <button className="px-6 py-2 rounded-full bg-gray-900 text-white text-sm font-medium">
                Dates
              </button>
              <button className="px-6 py-2 rounded-full text-gray-600 hover:bg-gray-100 text-sm font-medium">
                Months
              </button>
              <button className="px-6 py-2 rounded-full text-gray-600 hover:bg-gray-100 text-sm font-medium">
                Flexible
              </button>
            </div>

            {/* Calendar */}
            <div className="grid grid-cols-2 gap-8">
              {/* Current Month */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <h3 className="text-lg font-semibold">
                    {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </h3>
                  <div className="w-8"></div> {/* Spacer for alignment */}
                </div>
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day,index) => (
                    <div key={index} className="text-center text-xs font-medium text-gray-500 p-2">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {generateCalendar(currentMonth).map((date, index) => (
                    <button
                      key={index}
                      onClick={() => date && handleDateSelect(date, activeField === 'checkin' ? 'checkIn' : 'checkOut')}
                      disabled={!date || (typeof window !== 'undefined' && date < new Date())}
                      className={`p-2 text-sm rounded-full hover:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed ${
                        date && isDateSelected(date) ? 'bg-gray-900 text-white' : ''
                      }`}
                    >
                      {date?.getDate()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Next Month */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">
                    {new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </h3>
                  <button
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day,index) => (
                    <div key={index} className="text-center text-xs font-medium text-gray-500 p-2">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {generateCalendar(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)).map((date, index) => (
                    <button
                      key={index}
                      onClick={() => date && handleDateSelect(date, activeField === 'checkin' ? 'checkIn' : 'checkOut')}
                      disabled={!date || (typeof window !== 'undefined' && date < new Date())}
                      className={`p-2 text-sm rounded-full hover:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed ${
                        date && isDateSelected(date) ? 'bg-gray-900 text-white' : ''
                      }`}
                    >
                      {date?.getDate()}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick date options */}
            <div className="flex items-center justify-center space-x-4 mt-6 pt-6 border-t border-gray-200">
              <button className="px-4 py-2 border border-gray-300 rounded-full text-sm hover:border-gray-400">
                Exact dates
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-full text-sm hover:border-gray-400">
                ± 1 day
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-full text-sm hover:border-gray-400">
                ± 2 days
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-full text-sm hover:border-gray-400">
                ± 3 days
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-full text-sm hover:border-gray-400">
                ± 7 days
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-full text-sm hover:border-gray-400">
                ± 14 days
              </button>
            </div>
          </div>
        )}

        {/* Guest Picker Modal */}
        {showGuestPicker && (
          <div className="absolute top-full mt-2 right-0 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 z-50">
            {/* Adults */}
            <div className="flex items-center justify-between py-4">
              <div>
                <div className="font-medium text-gray-900">Adults</div>
                <div className="text-sm text-gray-500">Ages 13 or above</div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => updateGuestCount('adults', -1)}
                  disabled={searchParams.adults === 0}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:border-gray-400"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <span className="w-8 text-center font-medium">{searchParams.adults}</span>
                <button
                  onClick={() => updateGuestCount('adults', 1)}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Children */}
            <div className="flex items-center justify-between py-4 border-t border-gray-200">
              <div>
                <div className="font-medium text-gray-900">Children</div>
                <div className="text-sm text-gray-500">Ages 2–12</div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => updateGuestCount('children', -1)}
                  disabled={searchParams.children === 0}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:border-gray-400"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <span className="w-8 text-center font-medium">{searchParams.children}</span>
                <button
                  onClick={() => updateGuestCount('children', 1)}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Infants */}
            <div className="flex items-center justify-between py-4 border-t border-gray-200">
              <div>
                <div className="font-medium text-gray-900">Infants</div>
                <div className="text-sm text-gray-500">Under 2</div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => updateGuestCount('infants', -1)}
                  disabled={searchParams.infants === 0}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:border-gray-400"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <span className="w-8 text-center font-medium">{searchParams.infants}</span>
                <button
                  onClick={() => updateGuestCount('infants', 1)}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Pets */}
            <div className="flex items-center justify-between py-4 border-t border-gray-200">
              <div>
                <div className="font-medium text-gray-900">Pets</div>
                <div className="text-sm text-gray-500">
                  <button className="text-[#FF385C] underline">Bringing a service animal?</button>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => updateGuestCount('pets', -1)}
                  disabled={searchParams.pets === 0}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:border-gray-400"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <span className="w-8 text-center font-medium">{searchParams.pets}</span>
                <button
                  onClick={() => updateGuestCount('pets', 1)}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Done Button */}
            <div className="flex justify-end pt-4 border-t border-gray-200 mt-4">
              <button
                onClick={handleGuestSelectionComplete}
                className="px-6 py-2 bg-[#FF385C] text-white rounded-full hover:bg-[#E31C5F] transition-colors font-medium"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}