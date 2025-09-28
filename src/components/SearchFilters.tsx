'use client';

import { useState } from 'react';

export default function SearchFilters() {
  const [activeTab, setActiveTab] = useState('stays');

  return (
    <div className="border-b border-gray-200 mb-8">
      <div className="flex items-center justify-center space-x-8 pb-4">
        <button
          onClick={() => setActiveTab('stays')}
          className={`flex items-center space-x-2 pb-3 border-b-2 transition-colors ${
            activeTab === 'stays'
              ? 'border-gray-800 text-gray-800'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          </svg>
          <span className="font-medium text-sm">Stays</span>
        </button>
        <button
          onClick={() => setActiveTab('experiences')}
          className={`flex items-center space-x-2 pb-3 border-b-2 transition-colors ${
            activeTab === 'experiences'
              ? 'border-gray-800 text-gray-800'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span className="font-medium text-sm">Experiences</span>
        </button>
        <button
          onClick={() => setActiveTab('online')}
          className={`flex items-center space-x-2 pb-3 border-b-2 transition-colors ${
            activeTab === 'online'
              ? 'border-gray-800 text-gray-800'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span className="font-medium text-sm">Online Experiences</span>
        </button>
      </div>
    </div>
  );
}