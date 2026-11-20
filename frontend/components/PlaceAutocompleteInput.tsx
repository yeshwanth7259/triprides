'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Navigation, Search, X, Sparkles, Check } from 'lucide-react';
import { ALL_INDIAN_PLACES, PlaceItem, searchPlaces } from '../lib/indiaCitiesData';

interface PlaceAutocompleteProps {
  label?: string;
  value: string;
  onChange: (value: string, place?: PlaceItem) => void;
  placeholder?: string;
  iconType?: 'pickup' | 'drop';
  required?: boolean;
  className?: string;
  isOutstation?: boolean;
}

export default function PlaceAutocompleteInput({
  label,
  value,
  onChange,
  placeholder = 'Type city, town, or area...',
  iconType = 'drop',
  required = false,
  className = '',
  isOutstation = true
}: PlaceAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync internal search query with external value
  useEffect(() => {
    setSearchQuery(value);
  }, [value]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter places based on user input (even on 1 letter!)
  const results = searchPlaces(searchQuery, 8);

  const handleSelect = (place: PlaceItem) => {
    onChange(place.name, place);
    setSearchQuery(place.name);
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    onChange(val);
    setIsOpen(true);
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {label && (
        <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* Main Input Field */}
      <div 
        onClick={() => {
          setIsOpen(true);
          inputRef.current?.focus();
        }}
        className={`relative border rounded-2xl flex items-center bg-white transition-all cursor-text ${
          isOpen ? 'border-[#0A3D73] ring-2 ring-[#0A3D73]/15 shadow-md' : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        <div className="pl-3.5 pr-1 shrink-0">
          {iconType === 'pickup' ? (
            <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-[#FF7020]" />
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
              <MapPin size={14} className="text-[#0A3D73]" />
            </div>
          )}
        </div>

        <input
          ref={inputRef}
          type="text"
          required={required}
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full bg-transparent px-3 py-3.5 outline-none text-slate-900 font-bold text-sm sm:text-[15px] placeholder:text-slate-400 placeholder:font-normal"
        />

        {searchQuery && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSearchQuery('');
              onChange('');
              inputRef.current?.focus();
            }}
            className="p-2 text-slate-400 hover:text-slate-600 mr-1"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* Ola-Style Smart Suggestion Popover (Responsive Mobile & Desktop) */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 z-50 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800 animate-in fade-in slide-in-from-top-2 duration-150 max-h-[380px] flex flex-col">
          
          {/* Header Strip */}
          <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-500">
            <span className="flex items-center gap-1.5">
              <Sparkles size={12} className="text-[#FF7020]" />
              {searchQuery.trim() ? `Places matching "${searchQuery}"` : (iconType === 'pickup' ? 'Popular Bangalore Pickup Hubs' : 'Top Outstation Destinations')}
            </span>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">Type any Indian City</span>
          </div>

          {/* Quick Popular Chips (Shown when input is short) */}
          {(!searchQuery || searchQuery.length <= 1) && (
            <div className="p-3 border-b border-slate-100 bg-white overflow-x-auto hide-scrollbar flex items-center gap-1.5">
              {(iconType === 'pickup'
                ? ['Uttharhalli', 'Jayanagar', 'Indiranagar', 'Whitefield', 'Hebbal', 'Koramangala', 'BLR Airport']
                : ['Coorg', 'Mysore', 'Ooty', 'Chikmagalur', 'Wayanad', 'Tirupati', 'Goa', 'Pondicherry']
              ).map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => {
                    const match = ALL_INDIAN_PLACES.find(p => p.name.toLowerCase().includes(chip.toLowerCase()));
                    if (match) handleSelect(match);
                    else {
                      onChange(chip);
                      setSearchQuery(chip);
                      setIsOpen(false);
                    }
                  }}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 hover:bg-[#0A3D73] hover:text-white text-slate-700 transition-colors whitespace-nowrap cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </div>
          )}

          {/* Results List */}
          <div className="overflow-y-auto max-h-[260px] divide-y divide-slate-100">
            {results.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                <p className="font-bold text-slate-700">No exact location found for "{searchQuery}"</p>
                <p className="mt-1">You can still type your exact street or locality, and our driver will navigate there.</p>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="mt-3 bg-[#0A3D73] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold"
                >
                  Use "{searchQuery}"
                </button>
              </div>
            ) : (
              results.map((place, idx) => (
                <div
                  key={`${place.name}-${idx}`}
                  onClick={() => handleSelect(place)}
                  className="p-3 hover:bg-blue-50/70 transition-colors cursor-pointer flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center shrink-0 text-base">
                      {place.icon || (iconType === 'pickup' ? '📍' : '🚗')}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-black text-xs sm:text-sm text-slate-900 group-hover:text-[#0A3D73] truncate">
                          {place.name}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium truncate">
                        {place.state} • {place.category}
                      </p>
                    </div>
                  </div>

                  {place.distanceKmFromBangalore > 0 && (
                    <span className="shrink-0 text-[10px] font-black bg-slate-100 group-hover:bg-blue-200/60 text-slate-700 px-2 py-0.5 rounded-md">
                      {place.distanceKmFromBangalore} KM
                    </span>
                  )}
                </div>
              ))
            )}
          </div>

        </div>
      )}
    </div>
  );
}
