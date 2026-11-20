'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  MapPin, Star, Navigation, Search, ExternalLink, Car, Phone,
  Check, ShieldCheck, Sparkles, Compass, Filter, ArrowUpRight
} from 'lucide-react';
import {
  HOMESTAYS_DATA,
  POPULAR_DESTINATIONS,
  Homestay
} from '../../lib/homestaysData';
import {
  CONTACT_PHONE,
  CONTACT_PHONE_TEL,
  CONTACT_PHONE_WA
} from '../../lib/fleetData';
import { useBookingModal } from '../../components/BookingModalContext';

export default function HomestaysPage() {
  const { openBookingModal } = useBookingModal();

  // Search & Filter state
  const [selectedDest, setSelectedDest] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [scaleFilter, setScaleFilter] = useState<'all' | 'budget' | 'mid' | 'luxury'>('all');

  // Filter listings
  const filteredStays = HOMESTAYS_DATA.filter((stay) => {
    const matchesDest = selectedDest === 'All' || stay.destination.toLowerCase() === selectedDest.toLowerCase();
    const matchesSearch =
      stay.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stay.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stay.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stay.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stay.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesScale = scaleFilter === 'all' || stay.scaleType === scaleFilter;

    return matchesDest && matchesSearch && matchesScale;
  });

  const handleBookCabForStay = (stay: Homestay) => {
    openBookingModal({
      category: 'tempo',
      vehicleId: 'tempo-12',
    });
  };

  const openGoogleDirections = (stay: Homestay) => {
    const url = stay.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(stay.name + ' ' + stay.address)}`;
    window.open(url, '_blank');
  };

  const openGoogleDetails = (stay: Homestay) => {
    const url = stay.googleSearchUrl || `https://www.google.com/search?q=${encodeURIComponent(stay.name + ' ' + stay.address)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20 font-sans">

      {/* 1. Official Full-Width Banner (Edge-to-Edge across entire screen, No overlays) */}
      <section className="relative w-full bg-[#0A3D73] overflow-hidden mb-8 shadow-md -mt-2 sm:-mt-4">
        <h1 className="sr-only">BookMyRoute Stays & Rooms | Outstation Travel from Bangalore to All Over India</h1>
        <div className="w-full">
          <img
            src="/banner-stays-vehicle.jpg"
            alt="Now Find Stays Too! Book Your Vehicle and Stay Together on BookMyRoute"
            className="w-full h-auto block object-cover md:object-contain max-h-[580px] mx-auto"
          />
        </div>
      </section>

      {/* 2. Search & Category / Scale Filter Section */}
      <section className="container-x max-w-7xl mx-auto px-4 mb-8">
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200">

          {/* Header Title */}
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                All India Homestays, Rooms & Villas
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                From small-scale budget rooms to high-end luxury villas. Click any stay to view exact address, live Google Maps directions & direct contact details.
              </p>
            </div>

            {/* Quick Outstation Cab CTA */}
            <button
              onClick={() => openBookingModal()}
              className="bg-[#FF7020] hover:bg-[#ea5e10] text-white text-xs sm:text-sm font-black px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <Car size={16} />
              <span>Book Cab from Bangalore</span>
            </button>
          </div>

          {/* Scale Filter Tabs (Small Scale Budget -> Mid Scale -> Luxury) */}
          <div className="flex flex-wrap items-center gap-2 mb-5 pb-4 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1 flex items-center gap-1">
              <Filter size={13} /> Scale:
            </span>
            <button
              onClick={() => setScaleFilter('all')}
              className={`text-xs font-black px-4 py-2 rounded-xl transition-all cursor-pointer ${scaleFilter === 'all'
                  ? 'bg-[#0A3D73] text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
            >
              All Types ({HOMESTAYS_DATA.length})
            </button>
            <button
              onClick={() => setScaleFilter('budget')}
              className={`text-xs font-black px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${scaleFilter === 'budget'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
                }`}
            >
              <span>🌱 Budget Rooms & Stays</span>
            </button>
            <button
              onClick={() => setScaleFilter('mid')}
              className={`text-xs font-black px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${scaleFilter === 'mid'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200'
                }`}
            >
              <span>🏡 Comfort Homestays & Cottages</span>
            </button>
            <button
              onClick={() => setScaleFilter('luxury')}
              className={`text-xs font-black px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${scaleFilter === 'luxury'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200'
                }`}
            >
              <span>👑 Luxury Private Pool Villas & Resorts</span>
            </button>
          </div>

          {/* Search Bar & Destination Pills */}
          <div className="space-y-4">
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by city, homestay name, address, or landmark (e.g. Coorg, Ooty, Goa, Kudle Beach, Solang)..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0A3D73] focus:bg-white transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Destination quick select buttons */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
              <button
                onClick={() => setSelectedDest('All')}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${selectedDest === 'All'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
              >
                All Destinations
              </button>
              {POPULAR_DESTINATIONS.filter(d => d.name !== 'All India').map((dest) => (
                <button
                  key={dest.name}
                  onClick={() => setSelectedDest(dest.name)}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${selectedDest.toLowerCase() === dest.name.toLowerCase()
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                >
                  <span>{dest.icon}</span>
                  <span>{dest.name}</span>
                </button>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 3. Stays Listings in Rows and Columns (Clean & Responsive) */}
      <section className="container-x max-w-7xl mx-auto px-4">

        {/* Counter Bar */}
        <div className="flex items-center justify-between mb-6 px-1">
          <p className="text-xs sm:text-sm font-bold text-slate-600">
            Showing <span className="text-slate-900 font-black">{filteredStays.length}</span> stays & rooms matching your criteria
          </p>
          <span className="text-xs text-slate-500 hidden sm:inline-block">
            📍 Click <strong className="text-slate-700">"View on Google Maps"</strong> to see full photos, reviews & live directions
          </span>
        </div>

        {filteredStays.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
            <MapPin size={48} className="mx-auto text-slate-300 mb-3" />
            <h3 className="text-lg font-black text-slate-800">No stays found matching your filter</h3>
            <p className="text-xs text-slate-500 mt-1">Try clearing your search query or switching to All Types.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedDest('All');
                setScaleFilter('all');
              }}
              className="mt-4 bg-[#0A3D73] text-white text-xs font-bold px-4 py-2 rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {filteredStays.map((stay) => {
              return (
                <div
                  key={stay.id}
                  className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-400 transition-all duration-300 overflow-hidden flex flex-col justify-between group"
                >
                  {/* Stay Image with Badges */}
                  <div className="relative h-56 sm:h-60 bg-slate-100 overflow-hidden shrink-0">
                    <img
                      src={stay.images[0]}
                      alt={stay.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Scale Badge (Budget / Mid / Luxury) */}
                    <div className="absolute top-3 left-3">
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg shadow-sm text-white ${stay.scaleType === 'budget'
                          ? 'bg-emerald-600'
                          : stay.scaleType === 'luxury'
                            ? 'bg-amber-600'
                            : 'bg-[#0A3D73]'
                        }`}>
                        {stay.scaleLabel}
                      </span>
                    </div>

                    {/* Rating Pill */}
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md text-amber-900 border border-amber-200/80 px-2 py-0.5 rounded-lg text-xs font-black flex items-center gap-1 shadow-sm">
                      <Star size={12} className="fill-amber-500 text-amber-500" />
                      <span>{stay.rating}</span>
                      <span className="text-[10px] text-slate-500 font-normal">({stay.reviewsCount})</span>
                    </div>

                    {/* Distance from Bangalore Badge */}
                    <div className="absolute bottom-3 left-3 right-3 bg-black/70 backdrop-blur-xs text-white text-[11px] font-medium px-2.5 py-1 rounded-lg truncate">
                      📍 {stay.distanceKmFromBangalore} KM from Bangalore • {stay.approxDriveTime}
                    </div>
                  </div>

                  {/* Stay Body Details */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Destination & Category */}
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                        <span className="text-[#0A3D73] font-black">{stay.destination}, {stay.state}</span>
                        <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-black">{stay.category}</span>
                      </div>

                      {/* Stay Name */}
                      <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-snug mb-2 group-hover:text-[#0A3D73] transition-colors">
                        {stay.name}
                      </h3>

                      {/* EXACT ADDRESS DISPLAY (As user explicitly requested: "in that show only direction and address thats it") */}
                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 mb-3">
                        <div className="flex items-start gap-2">
                          <MapPin size={15} className="text-[#FF7020] shrink-0 mt-0.5" />
                          <div>
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">
                              Exact Address:
                            </span>
                            <p className="text-xs font-semibold text-slate-800 leading-snug">
                              {stay.address}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Short description & highlights */}
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
                        {stay.description}
                      </p>

                      {/* Amenities Chips */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {stay.amenities.slice(0, 3).map((amenity, i) => (
                          <span key={i} className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-md">
                            ✓ {amenity}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Stay Direct Contact & Google Maps Direction Actions (Pricing hidden as requested) */}
                    <div className="pt-3 border-t border-slate-100 space-y-3">

                      {/* Direct Verification & Contact Badge */}
                      <div className="bg-blue-50/80 border border-blue-200/70 rounded-xl px-3 py-2 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-[#0A3D73] font-bold text-xs">
                          <Phone size={13} className="text-[#FF7020] shrink-0" />
                          <span>Check Live Rates & Discuss with Owner</span>
                        </div>
                        <span className="text-[10px] font-black text-emerald-800 bg-white border border-emerald-200 px-2 py-0.5 rounded shadow-2xs">
                          Verified
                        </span>
                      </div>

                      {/* Primary Action 1: View on Google Maps (Directions & Contact Phone) */}
                      <button
                        onClick={() => openGoogleDirections(stay)}
                        className="w-full bg-[#0A3D73] hover:bg-[#072c54] text-white font-black text-xs sm:text-sm py-3 px-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer group/btn"
                      >
                        <Navigation size={15} className="text-[#FF7020] group-hover/btn:scale-110 transition-transform shrink-0" />
                        <span>📍 View on Google Maps (Contact & Rates)</span>
                        <ArrowUpRight size={15} className="text-blue-200 shrink-0" />
                      </button>

                      {/* Secondary Actions Row: Google Details & Book Cab */}
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => openGoogleDetails(stay)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] py-2.5 px-2 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Search size={12} className="text-[#0A3D73]" />
                          <span>Google Photos</span>
                        </button>

                        <button
                          onClick={() => handleBookCabForStay(stay)}
                          className="bg-[#FF7020] hover:bg-[#e45f12] text-white font-black text-[11px] py-2.5 px-2 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Car size={12} />
                          <span>Book Cab to Stay</span>
                        </button>
                      </div>

                      <p className="text-[11px] text-slate-500 leading-snug pt-1">
                        💡 <strong className="text-slate-700">Direct Booking:</strong> Click <span className="text-[#0A3D73] font-bold">"View on Google Maps"</span> to call the property directly to discuss room tariff & availability.
                      </p>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </section>

      {/* 4. Help / WhatsApp Booking Bar */}
      <section className="container-x max-w-7xl mx-auto px-4 mt-12">
        <div className="bg-gradient-to-r from-[#0A3D73] to-[#0d4b8f] text-white p-6 sm:p-8 rounded-3xl shadow-lg flex flex-wrap items-center justify-between gap-6">
          <div>
            <h3 className="text-xl sm:text-2xl font-black">Need custom stay recommendations or group transport?</h3>
            <p className="text-xs sm:text-sm text-blue-100 mt-1 max-w-xl">
              We arrange door-to-door roundtrip Cabs, Tempo Travellers, and verified homestays across Karnataka, Kerala, Tamil Nadu, Goa, and all India.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={`tel:${CONTACT_PHONE_TEL}`}
              className="bg-white text-[#0A3D73] font-black text-xs sm:text-sm px-5 py-3 rounded-xl shadow-md hover:scale-105 transition-transform flex items-center gap-2"
            >
              <Phone size={16} />
              <span>{CONTACT_PHONE}</span>
            </a>
            <a
              href={`https://wa.me/${CONTACT_PHONE_WA}?text=${encodeURIComponent('Hi BookMyRoute, I want to book an outstation trip and stay.')}`}
              target="_blank"
              className="bg-[#25D366] text-white font-black text-xs sm:text-sm px-5 py-3 rounded-xl shadow-md hover:scale-105 transition-transform flex items-center gap-2"
            >
              <span>WhatsApp Us</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
