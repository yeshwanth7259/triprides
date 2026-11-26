'use client';

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
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
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close on outside click or touch
  useEffect(() => {
    const handleOutsideInteraction = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideInteraction, { passive: true });
    document.addEventListener('touchstart', handleOutsideInteraction, { passive: true });
    return () => {
      document.removeEventListener('mousedown', handleOutsideInteraction);
      document.removeEventListener('touchstart', handleOutsideInteraction);
    };
  }, []);

  // Instant memoized search calculation
  const results = useMemo(() => {
    return searchPlaces(value || '', 8);
  }, [value]);

  const handleSelect = useCallback((place: PlaceItem) => {
    onChange(place.name, place);
    setIsOpen(false);
  }, [onChange]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange(val);
    if (!isOpen) setIsOpen(true);
  }, [onChange, isOpen]);

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {label && (
        <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* Main Input Field - text-base (16px) on mobile prevents iOS Safari auto-zoom lag */}
      <div 
        onClick={() => {
          setIsOpen(true);
          inputRef.current?.focus();
        }}
        className={`relative border rounded-2xl flex items-center bg-white transition-all cursor-text ${
          isOpen ? 'border-[#0A3D73] ring-2 ring-[#0A3D73]/15 shadow-sm' : 'border-slate-200 hover:border-slate-300'
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
          value={value}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="none"
          spellCheck={false}
          className="w-full bg-transparent px-3 py-3 outline-none text-slate-900 font-bold text-base sm:text-sm placeholder:text-slate-400 placeholder:font-normal"
        />

        {value && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange('');
              inputRef.current?.focus();
            }}
            className="p-2 text-slate-400 hover:text-slate-600 mr-1 cursor-pointer"
            aria-label="Clear location"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* Ola-Style Smart Suggestion Popover (Touch & Mobile Fast Tap) */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-[60] bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden text-slate-800 max-h-[320px] flex flex-col">
          
          {/* Header Strip */}
          <div className="px-3 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-500">
            <span className="flex items-center gap-1.5 truncate">
              <Sparkles size={12} className="text-[#FF7020] shrink-0" />
              {value.trim() ? `Places matching "${value}"` : (iconType === 'pickup' ? 'Popular Bangalore Pickup Hubs' : 'Top Outstation Destinations')}
            </span>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider shrink-0 ml-2">Type any Indian City</span>
          </div>

          {/* Quick Popular Chips */}
          {(!value || value.length <= 1) && (
            <div className="p-2.5 border-b border-slate-100 bg-white overflow-x-auto hide-scrollbar flex items-center gap-1.5">
              {(iconType === 'pickup'
                ? ['Uttharhalli', 'Jayanagar', 'Indiranagar', 'Whitefield', 'Hebbal', 'Koramangala', 'BLR Airport']
                : ['Coorg', 'Mysore', 'Ooty', 'Chikmagalur', 'Wayanad', 'Tirupati', 'Goa', 'Pondicherry']
              ).map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    const match = ALL_INDIAN_PLACES.find(p => p.name.toLowerCase().includes(chip.toLowerCase()));
                    if (match) handleSelect(match);
                    else {
                      onChange(chip);
                      setIsOpen(false);
                    }
                  }}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 hover:bg-[#0A3D73] hover:text-white text-slate-700 transition-colors whitespace-nowrap cursor-pointer active:scale-95"
                >
                  {chip}
                </button>
              ))}
            </div>
          )}

          {/* Results List */}
          <div className="overflow-y-auto max-h-[220px] divide-y divide-slate-100 overscroll-contain">
            {results.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-500">
                <p className="font-bold text-slate-700">No exact location found for "{value}"</p>
                <p className="mt-1">You can still type your exact street or locality.</p>
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setIsOpen(false);
                  }}
                  className="mt-2.5 bg-[#0A3D73] text-white px-3 py-1 rounded-lg text-xs font-bold cursor-pointer"
                >
                  Use "{value}"
                </button>
              </div>
            ) : (
              results.map((place, idx) => (
                <div
                  key={`${place.name}-${idx}`}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelect(place);
                  }}
                  className="p-2.5 hover:bg-blue-50/70 transition-colors cursor-pointer flex items-center justify-between gap-2.5 group active:bg-blue-100"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center shrink-0 text-sm">
                      {place.icon || (iconType === 'pickup' ? '📍' : '🚗')}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-black text-xs sm:text-sm text-slate-900 group-hover:text-[#0A3D73] truncate">
                          {place.name}
                        </span>
                      </div>
                      <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium truncate">
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
