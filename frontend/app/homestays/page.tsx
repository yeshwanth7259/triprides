'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  MapPin, Star, Navigation, Search, ExternalLink, Car, Phone,
  Check, ShieldCheck, Sparkles, Compass, Filter, ArrowUpRight,
  MessageSquare, ChevronDown, ChevronUp, Heart, Home, TreePine,
  Coffee, Waves, Clock, CheckCircle2, Info
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
  const [activeCategory, setActiveCategory] = useState<'all' | 'top_picks' | 'exclusive' | 'curated' | 'hourly'>('all');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Filter listings based on StayEasy categories
  const filteredStays = HOMESTAYS_DATA.filter((stay) => {
    const matchesDest = selectedDest === 'All' || stay.destination.toLowerCase() === selectedDest.toLowerCase();
    const matchesSearch =
      stay.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stay.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stay.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stay.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stay.address.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesCategory = true;
    if (activeCategory === 'top_picks') {
      matchesCategory = stay.rating >= 4.7;
    } else if (activeCategory === 'exclusive') {
      matchesCategory = stay.scaleType === 'luxury';
    } else if (activeCategory === 'curated') {
      matchesCategory = stay.scaleType === 'mid' || stay.amenities.some(a => a.toLowerCase().includes('coffee') || a.toLowerCase().includes('tea') || a.toLowerCase().includes('nature'));
    } else if (activeCategory === 'hourly') {
      matchesCategory = stay.scaleType === 'budget';
    }

    return matchesDest && matchesSearch && matchesCategory;
  });

  const openGoogleDirections = (stay: Homestay) => {
    const url = stay.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(stay.name + ' ' + stay.address)}`;
    window.open(url, '_blank');
  };

  const handleBookCabForStay = (stay: Homestay) => {
    openBookingModal({
      category: 'tempo',
      vehicleId: 'tempo-12',
    });
  };

  const handleDiscussStay = (stay: Homestay) => {
    const text = `Hi, I am interested in visiting *${stay.name}* located in ${stay.destination}, ${stay.state}. Could you help me with property details and an outstation cab package?`;
    window.open(`https://wa.me/${CONTACT_PHONE_WA}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const faqs = [
    {
      q: 'Why are room prices not displayed on the stays list?',
      a: 'We connect travelers directly with homestay hosts and plantation estate owners via Google Maps and phone. By eliminating middlemen markups and platform commission fees, you get authentic direct-from-owner tariffs with zero hidden charges.'
    },
    {
      q: 'How do I speak directly with the homestay host?',
      a: 'Simply click "📍 View on Google Maps" on any stay card. It opens the verified property listing with direct phone numbers, authentic guest reviews, and GPS location to call and discuss booking directly.'
    },
    {
      q: 'Can I book an outstation cab and homestay travel together?',
      a: 'Yes! BookMyRoute provides door-to-door GPS-tracked outstation cabs (Sedans, Ertiga, Innova Crysta, Tempo Travellers, Force Urbania) from Bangalore directly to your chosen homestay anywhere in India.'
    },
    {
      q: 'How are the properties verified for safety & cleanliness?',
      a: 'Every listed property undergoes physical route inspection by our local fleet drivers, verified Google Business registration, and high traveler review thresholds for cleanliness and hospitable hosts.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAF9] pt-24 pb-20 font-sans">

      {/* 1. StayEasy Style Hero Section with Green Accent & Brand Identity */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0F3827] to-[#164E35] text-white py-12 md:py-16 -mt-4 mb-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.18),transparent_60%)] pointer-events-none"></div>
        <div className="container-x max-w-7xl mx-auto px-4 relative z-10">
          
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider mb-4">
              <Sparkles size={14} className="text-emerald-300" />
              <span>StayEasy Handpicked Homes & Villas • All India</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-white leading-tight mb-4">
              Discover Handpicked Villas, Stays & Nature Retreats
            </h1>
            
            <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed max-w-2xl">
              100% Zero Middlemen Commission. Verified authentic properties across Coorg, Ooty, Chikmagalur, Goa, Wayanad & beyond. Connect directly with owners on Google Maps and travel safely in BookMyRoute cabs.
            </p>
          </div>

          {/* StayEasy Style Floating Search Filter Bar */}
          <div className="mt-8 bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-2xl border border-white/20 text-slate-800">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              
              {/* Destination Search */}
              <div className="md:col-span-5 relative">
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                  Where would you like to stay?
                </label>
                <div className="relative flex items-center">
                  <MapPin size={18} className="absolute left-3.5 text-emerald-700" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Coorg, Ooty, Goa, Chikmagalur, Manali..."
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 text-xs text-slate-400 hover:text-slate-600 font-bold"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Destination Dropdown */}
              <div className="md:col-span-4">
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                  Select Popular Destination
                </label>
                <div className="relative">
                  <select
                    value={selectedDest}
                    onChange={(e) => setSelectedDest(e.target.value)}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 cursor-pointer appearance-none pr-8"
                  >
                    <option value="All">All Over India (Entire Country)</option>
                    {POPULAR_DESTINATIONS.filter(d => d.name !== 'All India').map(d => (
                      <option key={d.name} value={d.name}>{d.icon} {d.name}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Instant Cab Booking CTA */}
              <div className="md:col-span-3">
                <label className="hidden md:block text-[10px] font-black uppercase tracking-wider text-transparent mb-1">
                  Action
                </label>
                <button
                  type="button"
                  onClick={() => openBookingModal()}
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs sm:text-sm py-2.5 px-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Car size={16} />
                  <span>Book Outstation Cab</span>
                </button>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 2. StayEasy Category Tabs Bar */}
      <section className="container-x max-w-7xl mx-auto px-4 mb-8">
        <div className="bg-white rounded-2xl p-2 shadow-xs border border-slate-200 flex items-center gap-2 overflow-x-auto hide-scrollbar">
          
          <button
            onClick={() => setActiveCategory('all')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
              activeCategory === 'all'
                ? 'bg-[#164E35] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Sparkles size={14} />
            <span>All Stays ({HOMESTAYS_DATA.length})</span>
          </button>

          <button
            onClick={() => setActiveCategory('top_picks')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
              activeCategory === 'top_picks'
                ? 'bg-[#164E35] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Star size={14} className={activeCategory === 'top_picks' ? 'text-amber-400 fill-amber-400' : ''} />
            <span>Top Picks for You</span>
          </button>

          <button
            onClick={() => setActiveCategory('exclusive')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
              activeCategory === 'exclusive'
                ? 'bg-[#164E35] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Waves size={14} />
            <span>Exclusive Villas & Pool Stays</span>
          </button>

          <button
            onClick={() => setActiveCategory('curated')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
              activeCategory === 'curated'
                ? 'bg-[#164E35] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Coffee size={14} />
            <span>Curated Plantation Resorts</span>
          </button>

          <button
            onClick={() => setActiveCategory('hourly')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
              activeCategory === 'hourly'
                ? 'bg-[#164E35] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Clock size={14} />
            <span>Hourly Listed Cottages</span>
          </button>

        </div>
      </section>

      {/* 3. Stays Listings in Animated StayEasy Grid */}
      <section className="container-x max-w-7xl mx-auto px-4 mb-16">
        
        {/* Results Info Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
              {activeCategory === 'top_picks' ? 'Top Rated Traveler Picks' : activeCategory === 'exclusive' ? 'Exclusive Private Villas & Pool Estates' : activeCategory === 'curated' ? 'Curated Coffee & Nature Retreats' : activeCategory === 'hourly' ? 'Hourly Listed Homestay Cottages' : 'All Verified Homestays Across India'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Showing <span className="font-bold text-slate-800">{filteredStays.length}</span> properties • Zero commission • Direct host contact on Google Maps
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
            <CheckCircle2 size={14} className="text-emerald-600" />
            <span>No Hidden Middlemen Fees</span>
          </div>
        </div>

        {filteredStays.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm">
            <Home size={44} className="mx-auto text-slate-300 mb-3" />
            <h3 className="text-lg font-black text-slate-800">No properties found matching your filter</h3>
            <p className="text-xs text-slate-500 mt-1">Try resetting the destination or clearing search keywords.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedDest('All');
                setActiveCategory('all');
              }}
              className="mt-4 bg-[#164E35] text-white text-xs font-black px-5 py-2.5 rounded-xl"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {filteredStays.map((stay) => (
              <div
                key={stay.id}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-2xl hover:border-emerald-500/50 transition-all duration-300 overflow-hidden flex flex-col justify-between group"
              >
                {/* Stay Photo with StayEasy Badges */}
                <div className="relative h-60 sm:h-64 bg-slate-100 overflow-hidden shrink-0">
                  <img
                    src={stay.images[0]}
                    alt={stay.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    <span className="bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg shadow-sm">
                      ✓ Verified Stay
                    </span>
                    <span className="bg-[#0A3D73] text-white text-[9px] font-bold px-2 py-0.5 rounded-md shadow-sm">
                      {stay.scaleLabel}
                    </span>
                  </div>

                  {/* Star Rating */}
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-xl shadow-sm border border-slate-100 flex items-center gap-1 text-xs font-black text-amber-900">
                    <Star size={13} className="fill-amber-400 text-amber-400" />
                    <span>{stay.rating}</span>
                    <span className="text-[10px] text-slate-400 font-normal">({stay.reviewsCount})</span>
                  </div>

                  {/* Distance from Bangalore Pill */}
                  <div className="absolute bottom-3 left-3 right-3 bg-black/75 backdrop-blur-xs text-white text-[11px] font-semibold px-3 py-1.5 rounded-xl flex items-center justify-between">
                    <span>📍 {stay.distanceKmFromBangalore} KM from Bangalore</span>
                    <span className="text-emerald-400 font-bold">{stay.approxDriveTime}</span>
                  </div>
                </div>

                {/* Stay Information (NO PRICING SHOWN) */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Location & Category */}
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      <span className="text-emerald-800 font-black">{stay.destination}, {stay.state}</span>
                      <span className="text-slate-500">{stay.category}</span>
                    </div>

                    {/* Stay Title */}
                    <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-snug mb-2 group-hover:text-emerald-800 transition-colors">
                      {stay.name}
                    </h3>

                    {/* Exact Address Box */}
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 mb-3">
                      <div className="flex items-start gap-2">
                        <MapPin size={15} className="text-emerald-700 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">
                            Exact Property Address:
                          </span>
                          <p className="text-xs font-semibold text-slate-800 leading-snug mt-0.5">
                            {stay.address}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
                      {stay.description}
                    </p>

                    {/* Stay Features & Unique Amenities Chips */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {stay.amenities.slice(0, 4).map((amenity, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-bold text-slate-700 bg-emerald-50/70 border border-emerald-200/60 px-2 py-0.5 rounded-lg flex items-center gap-1"
                        >
                          <Check size={10} className="text-emerald-700" />
                          <span>{amenity}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* StayEasy Style Actions: Direct Google Maps & Direct WhatsApp Host Contact */}
                  <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => openGoogleDirections(stay)}
                      className="w-full bg-[#164E35] hover:bg-[#0F3827] text-white font-black text-xs py-2.5 px-4 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Navigation size={14} />
                      <span>View on Google Maps (Direct Phone & Photos)</span>
                      <ArrowUpRight size={14} />
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleDiscussStay(stay)}
                        className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <MessageSquare size={13} />
                        <span>Discuss with Host</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleBookCabForStay(stay)}
                        className="bg-[#0A3D73] hover:bg-[#082e56] text-white font-bold text-xs py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Car size={13} />
                        <span>Book Cab</span>
                      </button>
                    </div>
                  </div>

                </div>

              </div>
            ))}
          </div>
        )}

      </section>

      {/* 4. StayEasy: "How StayEasy Works" 3-Step Flow Banner */}
      <section className="container-x max-w-7xl mx-auto px-4 mb-16">
        <div className="bg-[#103D2A] text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-400">Simple & Transparent</span>
            <h2 className="text-2xl sm:text-4xl font-black font-display mt-1">
              How StayEasy Works
            </h2>
            <p className="text-emerald-100/80 text-xs sm:text-sm mt-2">
              Say goodbye to inflated hotel portal commissions. Directly connect with homestays across India.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-6 text-center">
              <span className="w-10 h-10 rounded-full bg-emerald-500 text-white font-black text-sm flex items-center justify-center mx-auto mb-4">
                01
              </span>
              <h3 className="font-black text-base mb-1.5">Discover Your Stay</h3>
              <p className="text-xs text-emerald-100/80 leading-relaxed">
                Browse handpicked plantation bungalows, pool villas & mountain cottages across Karnataka, Kerala, Tamil Nadu & Goa.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-6 text-center">
              <span className="w-10 h-10 rounded-full bg-emerald-500 text-white font-black text-sm flex items-center justify-center mx-auto mb-4">
                02
              </span>
              <h3 className="font-black text-base mb-1.5">Talk Directly with Host</h3>
              <p className="text-xs text-emerald-100/80 leading-relaxed">
                Click Google Maps to call the host directly, view authentic reviews, and negotiate private direct tariffs.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-6 text-center">
              <span className="w-10 h-10 rounded-full bg-emerald-500 text-white font-black text-sm flex items-center justify-center mx-auto mb-4">
                03
              </span>
              <h3 className="font-black text-base mb-1.5">Ride Safely with Us</h3>
              <p className="text-xs text-emerald-100/80 leading-relaxed">
                Get picked up right from your doorstep in Bangalore in a sanitized BookMyRoute cab or Tempo Traveller.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 5. StayEasy: "Earn more, Host with StayEasy" Section */}
      <section className="container-x max-w-7xl mx-auto px-4 mb-16">
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200/70 rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-emerald-800">For Property Owners</span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-display mt-1">
              Have a Villa or Homestay in India?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl mt-2 leading-relaxed">
              List your property on StayEasy & BookMyRoute with <strong>Zero Commission</strong>. Over 50,000+ Bangalore outstation travelers visit our portal every month looking for weekend stays.
            </p>
          </div>

          <a
            href={`https://wa.me/${CONTACT_PHONE_WA}?text=${encodeURIComponent('Hi, I am a homestay / villa owner and would like to list my property on StayEasy & BookMyRoute.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#164E35] hover:bg-[#0F3827] text-white font-black text-xs sm:text-sm py-3.5 px-6 rounded-2xl transition-all shadow-md shrink-0 flex items-center gap-2 cursor-pointer"
          >
            <span>List Your Stay (Free)</span>
            <ArrowUpRight size={16} />
          </a>
        </div>
      </section>

      {/* 6. Frequently Asked Questions Accordion */}
      <section className="container-x max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <span className="text-xs font-black uppercase tracking-wider text-emerald-800">Got Questions?</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-display mt-1">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs"
            >
              <button
                type="button"
                onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                className="w-full p-4 sm:p-5 text-left font-bold text-xs sm:text-sm text-slate-900 flex items-center justify-between gap-3 cursor-pointer"
              >
                <span>{faq.q}</span>
                {expandedFaq === idx ? (
                  <ChevronUp size={16} className="text-emerald-700 shrink-0" />
                ) : (
                  <ChevronDown size={16} className="text-slate-400 shrink-0" />
                )}
              </button>

              {expandedFaq === idx && (
                <div className="px-4 sm:px-5 pb-4 sm:pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
