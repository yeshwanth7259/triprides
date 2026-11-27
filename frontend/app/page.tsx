'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  MapPin, Users, Plane, Car, Bus, Map, Clock, CheckCircle, 
  FileText, Send, Download, Mail, Calendar, Ticket, Phone, ArrowRight, ShieldCheck,
  Star, Navigation, Sparkles, ExternalLink, UserCheck, ChevronRight, Award, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CONTACT_PHONE, 
  CONTACT_PHONE_TEL, 
  CONTACT_PHONE_WA, 
  FLEET_DATA, 
  VEHICLE_CATEGORIES_CONFIG 
} from '../lib/fleetData';
import { HOMESTAYS_DATA } from '../lib/homestaysData';
import { WHITE_BOARD_DRIVERS } from '../lib/whiteBoardDriversData';
import { useBookingModal } from '../components/BookingModalContext';
import PlaceAutocompleteInput from '../components/PlaceAutocompleteInput';
import { PlaceItem } from '../lib/indiaCitiesData';
import { FLEET_PRICING, VehiclePricing } from '../lib/quotationData';

export default function Home() {
  const { openBookingModal } = useBookingModal();
  const [rideMode, setRideMode] = useState<'outstation' | 'local' | 'airport'>('outstation');
  const [outstationType, setOutstationType] = useState<'roundtrip' | 'oneway'>('roundtrip');
  const [selectedPlace, setSelectedPlace] = useState<PlaceItem | null>(null);
  const [activeTab, setActiveTab] = useState('tempo');
  const [quoteFeedback, setQuoteFeedback] = useState<string | null>(null);
  const [form, setForm] = useState({ 
    name: '',
    phone: '',
    email: '',
    pickup: '', 
    destination: '', 
    date: '', 
    time: '06:00', 
    passengers: '12', 
    vehicleInfo: '12 Seater AC Tempo Traveller' 
  });

  const karnatakaLocations = [
    "Bengaluru", "Kempegowda International Airport (BLR)", "Mysore", "Coorg (Madikeri)", 
    "Mangaluru", "Hubballi (Hubli)", "Belagavi (Belgaum)", "Udupi", "Chikmagalur",
    "Hampi", "Hassan", "Shimoga", "Tumkur", "Davangere", "Bijapur", "Gokarna", "Dandeli",
    "Ooty", "Wayanad", "Munnar", "Kochi", "Chennai", "Hyderabad", "Goa", "Tirupati", "Nandi Hills"
  ];

  const tabs = [
    { id: 'cab', label: 'Cabs (4–7 Seats)', icon: <Car size={16} /> },
    { id: 'tempo', label: 'Tempo Traveller (8–20)', icon: <Users size={16} /> },
    { id: 'minibus', label: 'Mini Bus (12–25)', icon: <Bus size={16} /> },
    { id: 'bus', label: 'Coach Bus (27–50)', icon: <Bus size={16} /> },
    { id: 'airport', label: 'Airport Taxi', icon: <Plane size={16} /> },
  ];

  const vehicleOptions: Record<string, string[]> = {
    'cab': [
      'Sedan (Swift Dzire / Etios) - 4 Seats',
      'Maruti Ertiga SUV - 6 Seats',
      'Toyota Innova Crysta - 7 Seats'
    ],
    'tempo': [
      '9/10 Seater Maharaja Luxury TT',
      '12 Seater AC Tempo Traveller',
      '14 Seater Premium Tempo Traveller',
      '17 Seater AC Tempo Traveller',
      '20 Seater AC Tempo Traveller'
    ],
    'minibus': [
      '21 Seater AC Mini Bus',
      '25 Seater Luxury AC Mini Bus'
    ],
    'bus': [
      '32 Seater Pushback Coach Bus',
      '40 Seater Deluxe Pushback Bus',
      '50 Seater Standard Coach Bus'
    ],
    'airport': [
      'Sedan (Dzire / Etios) BLR Transfer',
      'Innova Crysta BLR Transfer',
      '12 Seater Tempo BLR Transfer'
    ]
  };

  // Debounced Lead Capture for Abandoned Incomplete Inquiries (Captures user details if they leave mid-way)
  useEffect(() => {
    const cleanPhone = (form.phone || '').replace(/\D/g, '');
    if (cleanPhone.length >= 10 && form.name.trim().length >= 2) {
      const timer = setTimeout(() => {
        fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: form.name,
            phone: form.phone,
            email: form.email,
            service: `${rideMode.toUpperCase()} - ${form.vehicleInfo || 'Outstation Travel'}`,
            pickup: form.pickup,
            destination: form.destination,
            travelDate: form.date,
            travelTime: form.time,
            passengers: form.passengers,
            status: 'ABANDONED_INCOMPLETE',
            source: 'Homepage Form (Incomplete / Mid-Way)',
            notes: 'User filled contact and travel details but left without submitting. Hot lead for fast follow-up!'
          })
        }).catch(() => {});
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [form.name, form.phone, form.email, form.pickup, form.destination, form.date, form.time, form.vehicleInfo, rideMode]);

  const getCalculatedKm = () => {
    if (rideMode === 'local') return 80;
    if (rideMode === 'airport') return 45;
    if (selectedPlace && selectedPlace.distanceKmFromBangalore > 0) {
      return outstationType === 'roundtrip' 
        ? Math.round(selectedPlace.distanceKmFromBangalore * 2) 
        : selectedPlace.distanceKmFromBangalore;
    }
    return outstationType === 'roundtrip' ? 520 : 260;
  };

  const calculateFareForVehicle = (v: VehiclePricing) => {
    const km = getCalculatedKm();
    if (rideMode === 'local') {
      return {
        billedKm: 80,
        rate: v.localExtraKmRate,
        bata: 0,
        tolls: 0,
        totalFare: v.localPackageRate
      };
    }
    if (rideMode === 'airport') {
      return {
        billedKm: 45,
        rate: v.ratePerKm,
        bata: 0,
        tolls: 120,
        totalFare: (45 * v.ratePerKm) + 120
      };
    }
    const days = Math.max(1, Math.ceil(km / 500));
    const minKm = days * v.minKmPerDay;
    const billedKm = Math.max(km, minKm);
    const bata = days * v.driverBataPerDay;
    const tolls = Math.round(km * 0.7);
    const totalFare = (billedKm * v.ratePerKm) + bata + tolls;
    return {
      billedKm,
      rate: v.ratePerKm,
      bata,
      tolls,
      totalFare
    };
  };

  const bookSpecificVehicle = (v: VehiclePricing) => {
    const custName = form.name.trim() || 'Valued Passenger';
    const custPhone = form.phone.trim() || 'Not Provided';
    const pickupLoc = form.pickup.trim() || 'Bangalore';
    const dropLoc = form.destination.trim() || 'Outstation Destination';
    const travelDate = form.date || 'Flexible Date';
    const travelTime = form.time || '06:00';
    const pax = form.passengers || v.seats.replace(/[^0-9]/g, '').slice(0, 2) || '4';

    const calculated = calculateFareForVehicle(v);

    const details = `*🚕 BookMyRoute Official Trip Booking & Quotation Request*
----------------------------------------
*Passenger Name:* ${custName}
*Phone / WhatsApp:* ${custPhone}
*Vehicle Selected:* ${v.name} (${v.seats})
*Trip Mode:* ${rideMode.toUpperCase()} (${outstationType === 'roundtrip' ? 'Round Trip' : 'One-Way Drop'})
*Pickup Location:* ${pickupLoc}
*Destination / Drop:* ${dropLoc}
*Travel Date:* ${travelDate} at ${travelTime}
*Passengers:* ${pax}
*Rate Tariff:* ₹${v.ratePerKm}/km
*Total Estimated Price:* ₹${calculated.totalFare.toLocaleString()} (Zero Hidden Charges)
----------------------------------------
_Please confirm booking and vehicle assignment._`;

    // Save lead as BOOKING_CONFIRMED (dispatches Tejas-style quotation email to client & bookmyroute06@gmail.com)
    fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: custName,
        phone: custPhone,
        email: form.email.trim(),
        service: `${v.name}`,
        pickup: pickupLoc,
        destination: dropLoc,
        travelDate,
        travelTime,
        passengers: Number(pax) || 4,
        vehicle: v.name,
        distanceKm: calculated.billedKm,
        ratePerKm: v.ratePerKm,
        driverBata: calculated.bata,
        tollEstimate: calculated.tolls,
        totalFare: calculated.totalFare,
        status: 'BOOKING_CONFIRMED',
        source: 'Tejas Fleet Tariff Matrix'
      })
    }).catch(() => {});

    setQuoteFeedback(
      form.email.trim()
        ? `Official Quotation sent to ${form.email.trim()} & BookMyRoute Dispatch!`
        : 'Official Quotation sent to BookMyRoute Dispatch & WhatsApp!'
    );

    window.open(`https://wa.me/${CONTACT_PHONE_WA}?text=${encodeURIComponent(details)}`, '_blank');
  };

  const getEstimatedPrice = () => {
    const selected = form.vehicleInfo || vehicleOptions[activeTab]?.[0] || '';
    if (selected.includes('Sedan')) return '₹12/km (Local: ₹1,800)';
    if (selected.includes('Ertiga')) return '₹16/km (Local: ₹2,400)';
    if (selected.includes('Innova')) return '₹21/km (Local: ₹3,200)';
    if (selected.includes('9/10')) return '₹23/km (Local: ₹4,000)';
    if (selected.includes('12 Seater')) return '₹21/km (Local: ₹3,800)';
    if (selected.includes('14 Seater')) return '₹23/km (Local: ₹4,200)';
    if (selected.includes('17 Seater')) return '₹25/km (Local: ₹4,600)';
    if (selected.includes('20 Seater')) return '₹27/km (Local: ₹5,000)';
    if (selected.includes('21 Seater')) return '₹31/km (Local: ₹6,500)';
    if (selected.includes('25 Seater')) return '₹35/km (Local: ₹7,500)';
    if (selected.includes('32 Seater')) return '₹41/km (Local: ₹9,000)';
    if (selected.includes('40 Seater')) return '₹47/km (Local: ₹10,500)';
    if (selected.includes('50 Seater')) return '₹53/km (Local: ₹12,000)';
    return '₹21 - ₹27 / km';
  };

  function handleDirectWhatsAppQuote(e: React.FormEvent) {
    e.preventDefault();
    sendToWhatsApp();
  }

  function sendToWhatsApp() {
    const custName = form.name.trim() || 'Valued Passenger';
    const custPhone = form.phone.trim() || 'Not Provided';
    const selectedVehicle = form.vehicleInfo || vehicleOptions[activeTab]?.[0] || 'Tempo Traveller';
    const selectedCategory = tabs.find(t => t.id === activeTab)?.label || 'Tempo Traveller';
    const pickupLoc = form.pickup.trim() || 'Bangalore';
    const dropLoc = form.destination.trim() || 'Outstation Destination';
    const travelDate = form.date || 'Flexible Date';
    const travelTime = form.time || '06:00';
    const pax = form.passengers || 'Standard';

    const matchedVehiclePricing = FLEET_PRICING.find(v =>
      selectedVehicle.toLowerCase().includes(v.name.toLowerCase().split(' ')[0])
    ) || FLEET_PRICING[3];
    const calc = calculateFareForVehicle(matchedVehiclePricing);

    const details = `*🚕 BookMyRoute Official Trip Quotation Request*
----------------------------------------
*Passenger Name:* ${custName}
*Phone / WhatsApp:* ${custPhone}${form.email.trim() ? `\n*Email:* ${form.email.trim()}` : ''}
*Trip Mode:* ${rideMode.toUpperCase()} (${outstationType === 'roundtrip' ? 'Round Trip' : 'One-Way Drop'})
*Vehicle Category:* ${selectedCategory}
*Vehicle Selected:* ${selectedVehicle}
*Passengers:* ${pax}
*Pickup Location:* ${pickupLoc}
*Destination / Drop:* ${dropLoc}
*Travel Date:* ${travelDate} at ${travelTime}
*Estimated Total:* ₹${calc.totalFare.toLocaleString()} (${calc.billedKm} KM @ ₹${calc.rate}/km)
----------------------------------------
_Please send me the formal quotation and confirm vehicle availability._`;

    // Save lead in backend as QUOTATION_GENERATED (dispatches Tejas-style quotation email to client & bookmyroute06@gmail.com)
    fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: custName,
        phone: custPhone,
        email: form.email.trim(),
        service: `${selectedVehicle}`,
        pickup: pickupLoc,
        destination: dropLoc,
        travelDate,
        travelTime,
        passengers: Number(pax) || 4,
        vehicle: selectedVehicle,
        distanceKm: calc.billedKm,
        ratePerKm: calc.rate,
        driverBata: calc.bata,
        tollEstimate: calc.tolls,
        totalFare: calc.totalFare,
        status: 'QUOTATION_GENERATED',
        source: 'Homepage Quotation Form'
      })
    }).catch(() => {});

    setQuoteFeedback(
      form.email.trim()
        ? `Quotation sent to ${form.email.trim()} & BookMyRoute Dispatch!`
        : 'Quotation sent to BookMyRoute Dispatch & WhatsApp!'
    );

    window.open(`https://wa.me/${CONTACT_PHONE_WA}?text=${encodeURIComponent(details)}`, '_blank');
  }

  return (
    <main className="min-h-screen bg-[#F9FAFB] overflow-hidden pb-16">
      {/* 1. End-to-End Hero Banner Graphic - Bangalore to All Over India Outstation Travel */}
      <section className="relative w-full mt-[72px] bg-[#0A3D73] overflow-hidden">
        <h1 className="sr-only">BookMyRoute | Bangalore to All Over India Outstation Cabs & Tempo Travellers</h1>
        <div className="w-full">
          <img 
            src="/banner-outstation-india.jpg" 
            alt="Bangalore to All Over India - Outstation Travel from Bangalore - BookMyRoute" 
            className="w-full h-auto block object-cover md:object-contain max-h-[580px] mx-auto shadow-md"
          />
        </div>
      </section>

      {/* 2. MakeMyTrip Style Main Category Bar & Search Card (No overlap on banner) */}
      <div className="container-x relative mt-6 sm:mt-8 z-20 mb-16">
        
        {/* MakeMyTrip Top Category Bar */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-2 shadow-xl border border-slate-100 flex items-center justify-between overflow-x-auto hide-scrollbar gap-2 mb-3">
          <button
            onClick={() => { setActiveTab('tempo'); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'tempo' || activeTab === 'cab' 
                ? 'bg-[#0A3D73] text-white shadow-xs' 
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Car size={15} className={activeTab === 'tempo' || activeTab === 'cab' ? 'text-[#FF7020]' : ''} />
            <span>Outstation & Local Cabs</span>
          </button>

          <Link
            href="/homestays"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:text-[#0A3D73] hover:bg-blue-50 transition-all whitespace-nowrap"
          >
            <span>🏡 Villas & Homestays</span>
            <span className="bg-[#FF7020] text-white text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-xs">
              NEW
            </span>
          </Link>

          <Link
            href="/white-board-drivers"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:text-[#0A3D73] hover:bg-blue-50 transition-all whitespace-nowrap"
          >
            <span>🚗 White Board Drivers</span>
            <span className="bg-emerald-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-xs">
              Verified
            </span>
          </Link>

          <Link
            href="/pricing"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:text-[#0A3D73] hover:bg-blue-50 transition-all whitespace-nowrap"
          >
            <span>💰 Transparent Pricing</span>
          </Link>

          <Link
            href="/invoice"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-[#0A3D73] bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-all whitespace-nowrap"
          >
            <FileText size={14} className="text-[#FF7020]" />
            <span>Quotation & Invoice</span>
          </Link>
        </div>

        <div className="bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.12)] overflow-hidden border border-slate-100">
          {/* Form Header with Ola Cabs Style Primary Mode Selector */}
          <div className="bg-slate-50 border-b border-slate-200 p-5 md:px-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-4">
              <div>
                <h2 className="text-xl md:text-2xl font-black text-[#0A3D73] font-display">
                  Where would you like to travel?
                </h2>
                <p className="text-slate-500 text-xs sm:text-sm font-medium mt-0.5">
                  Instant quotes sent straight to WhatsApp ({CONTACT_PHONE})
                </p>
              </div>

              {/* Ola-Style Mode Switcher (Outstation / Local / Airport) */}
              <div className="bg-slate-200/80 p-1 rounded-2xl flex items-center gap-1 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setRideMode('outstation')}
                  className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    rideMode === 'outstation'
                      ? 'bg-[#0A3D73] text-white shadow-sm'
                      : 'text-slate-700 hover:text-slate-900'
                  }`}
                >
                  🚗 Outstation
                </button>
                <button
                  type="button"
                  onClick={() => setRideMode('local')}
                  className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    rideMode === 'local'
                      ? 'bg-[#0A3D73] text-white shadow-sm'
                      : 'text-slate-700 hover:text-slate-900'
                  }`}
                >
                  🏙️ Local Rentals
                </button>
                <button
                  type="button"
                  onClick={() => setRideMode('airport')}
                  className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    rideMode === 'airport'
                      ? 'bg-[#0A3D73] text-white shadow-sm'
                      : 'text-slate-700 hover:text-slate-900'
                  }`}
                >
                  ✈️ Airport Taxi
                </button>
              </div>
            </div>

            {/* Outstation Round-Trip vs One-Way Sub-Toggle (Ola Cabs Style) */}
            {rideMode === 'outstation' && (
              <div className="flex items-center gap-3 pt-2 text-xs">
                <span className="text-slate-500 font-bold uppercase tracking-wider text-[11px]">Outstation Mode:</span>
                <button
                  type="button"
                  onClick={() => setOutstationType('roundtrip')}
                  className={`px-3 py-1 rounded-lg font-black transition-all cursor-pointer ${
                    outstationType === 'roundtrip'
                      ? 'bg-orange-100 text-[#FF7020] border border-orange-300'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  ✓ Round Trip
                </button>
                <button
                  type="button"
                  onClick={() => setOutstationType('oneway')}
                  className={`px-3 py-1 rounded-lg font-black transition-all cursor-pointer ${
                    outstationType === 'oneway'
                      ? 'bg-orange-100 text-[#FF7020] border border-orange-300'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  One-Way Drop
                </button>
              </div>
            )}
          </div>

          {/* Vehicle Category Tabs */}
          <div className="flex overflow-x-auto border-b border-slate-200 hide-scrollbar bg-white">
            {tabs.map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => { 
                  setActiveTab(tab.id); 
                  setForm({ ...form, vehicleInfo: vehicleOptions[tab.id]?.[0] || '' }); 
                }}
                className={`flex items-center gap-2 whitespace-nowrap px-6 sm:px-8 py-3.5 font-bold text-xs sm:text-sm transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#0A3D73] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleDirectWhatsAppQuote} className="p-6 sm:p-8">
            
            {/* Row 1: Passenger Name, Phone Number, and Email Address Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide flex items-center gap-1.5">
                  <UserCheck size={14} className="text-[#0A3D73]" />
                  <span>Your Full Name *</span>
                </label>
                <div className="relative border rounded-2xl border-slate-200 flex items-center focus-within:border-[#0A3D73] bg-slate-50/50 hover:border-slate-300 transition-colors">
                  <input
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="Enter your full name..."
                    className="w-full bg-transparent px-4 py-3 outline-none text-slate-800 font-semibold text-base sm:text-sm"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide flex items-center gap-1.5">
                  <Phone size={14} className="text-emerald-600" />
                  <span>Mobile / WhatsApp Number *</span>
                </label>
                <div className="relative border rounded-2xl border-slate-200 flex items-center focus-within:border-[#0A3D73] bg-slate-50/50 hover:border-slate-300 transition-colors">
                  <input
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    required
                    placeholder="Enter 10-digit mobile number..."
                    className="w-full bg-transparent px-4 py-3 outline-none text-slate-800 font-semibold text-base sm:text-sm"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide flex items-center gap-1.5">
                  <Mail size={14} className="text-[#FF7020]" />
                  <span>Email Address (For Quotation) *</span>
                </label>
                <div className="relative border rounded-2xl border-slate-200 flex items-center focus-within:border-[#0A3D73] bg-slate-50/50 hover:border-slate-300 transition-colors">
                  <input
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    required
                    placeholder="Enter email for formal quote..."
                    className="w-full bg-transparent px-4 py-3 outline-none text-slate-800 font-semibold text-base sm:text-sm"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Row 2: Ola Cabs Style Single-Letter Search Autocomplete Row */}
            <div className="grid md:grid-cols-2 gap-5 mb-5">
              <PlaceAutocompleteInput
                label="Pickup Location in Bangalore"
                value={form.pickup}
                onChange={(val) => setForm({ ...form, pickup: val })}
                placeholder="Type pickup area (e.g. Uttharhalli, Jayanagar, Airport)..."
                iconType="pickup"
                required
              />

              <PlaceAutocompleteInput
                label={rideMode === 'outstation' ? 'Destination / Drop City (Entire India)' : rideMode === 'local' ? 'Local Destination / Drop Area' : 'Airport Drop / Pickup Area'}
                value={form.destination}
                onChange={(val, place) => {
                  setForm({ ...form, destination: val });
                  if (place) setSelectedPlace(place);
                }}
                placeholder={rideMode === 'outstation' ? 'Type 1 letter for any Indian city (e.g. Coorg, Ooty, Goa, Mysore)...' : 'Type drop area in Bangalore...'}
                iconType="drop"
                required
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
              {/* 1. Travel Date */}
              <div className="relative">
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">Travel Date</label>
                <div className="relative border rounded-2xl border-slate-200 flex items-center focus-within:border-[#0A3D73] bg-slate-50/50 hover:border-slate-300 transition-colors">
                  <input
                    type="date"
                    required
                    className="w-full bg-transparent px-3.5 py-3 outline-none text-slate-800 font-semibold text-base sm:text-sm cursor-pointer"
                    value={form.date}
                    onChange={e => setForm({ ...form, date: e.target.value })}
                  />
                </div>
              </div>

              {/* 2. Pickup Time */}
              <div className="relative">
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">Pickup Time</label>
                <div className="relative border rounded-2xl border-slate-200 flex items-center focus-within:border-[#0A3D73] bg-slate-50/50 hover:border-slate-300 transition-colors">
                  <input
                    type="time"
                    required
                    className="w-full bg-transparent px-3.5 py-3 outline-none text-slate-800 font-semibold text-base sm:text-sm cursor-pointer"
                    value={form.time}
                    onChange={e => setForm({ ...form, time: e.target.value })}
                  />
                </div>
              </div>

              {/* 3. Passengers */}
              <div className="relative">
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">Passengers</label>
                <div className="relative border rounded-2xl border-slate-200 flex items-center focus-within:border-[#0A3D73] bg-slate-50/50 hover:border-slate-300 transition-colors">
                  <input
                    type="number"
                    inputMode="numeric"
                    min="1"
                    placeholder="Count"
                    required
                    className="w-full bg-transparent px-3.5 py-3 outline-none text-slate-800 font-semibold text-base sm:text-sm"
                    value={form.passengers}
                    onChange={e => setForm({ ...form, passengers: e.target.value })}
                  />
                </div>
              </div>

              {/* 4. Vehicle Model */}
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Vehicle Model</label>
                  <span className="text-[10px] font-black text-[#FF7020] bg-orange-50 px-1.5 py-0.5 rounded border border-orange-200/50">
                    {getEstimatedPrice().split('(')[0].trim()}
                  </span>
                </div>
                <div className="relative border rounded-2xl border-slate-200 flex items-center focus-within:border-[#0A3D73] bg-slate-50/50 hover:border-slate-300 transition-colors">
                  <select
                    className="w-full bg-transparent px-3 py-3 outline-none text-slate-800 font-semibold text-xs sm:text-sm appearance-none cursor-pointer pr-8"
                    value={form.vehicleInfo}
                    onChange={e => setForm({ ...form, vehicleInfo: e.target.value })}
                  >
                    {vehicleOptions[activeTab]?.map((opt: string) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 pointer-events-none text-slate-400">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6" /></svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 3: Dedicated Action Bar with Beautifully Aligned WhatsApp Button & Quotation Link */}
            <div className="pt-5 border-t border-slate-100 flex flex-col lg:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-6 text-xs font-bold text-slate-500">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <CheckCircle size={15} className="text-emerald-500 shrink-0" />
                  <span>Instant WhatsApp Quotation</span>
                </span>
                <span className="flex items-center gap-1.5 text-slate-600">
                  <CheckCircle size={15} className="text-emerald-500 shrink-0" />
                  <span>Zero Advance Payment</span>
                </span>
                <span className="flex items-center gap-1.5 text-slate-600 hidden md:flex">
                  <CheckCircle size={15} className="text-emerald-500 shrink-0" />
                  <span>Helpline ({CONTACT_PHONE})</span>
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                <Link
                  href={`/invoice?name=${encodeURIComponent(form.name)}&phone=${encodeURIComponent(form.phone)}&email=${encodeURIComponent(form.email)}&pickup=${encodeURIComponent(form.pickup)}&drop=${encodeURIComponent(form.destination)}&vehicle=${encodeURIComponent(form.vehicleInfo)}&date=${encodeURIComponent(form.date)}`}
                  className="w-full sm:w-auto text-[#0A3D73] hover:text-[#FF7020] bg-blue-50/80 hover:bg-blue-100/80 border border-blue-200 font-black text-xs sm:text-sm py-3 px-5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <FileText size={16} />
                  <span>View / Download Formal Quote</span>
                </Link>

                <button
                  type="submit"
                  className="w-full sm:w-auto min-w-[260px] bg-[#25D366] hover:bg-[#1EBE5D] text-white font-black text-sm sm:text-base py-3 px-7 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2.5 cursor-pointer shrink-0"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                  </svg>
                  <span>Send Quote to Email &amp; WhatsApp</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
            {quoteFeedback && (
              <div className="mt-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold px-4 py-3 rounded-xl flex items-center justify-between">
                <span>✓ {quoteFeedback}</span>
                <button type="button" onClick={() => setQuoteFeedback(null)} className="text-emerald-600 hover:text-emerald-900 font-black">✕</button>
              </div>
            )}
          </form>

          {/* =========================================================================
              TEJAS TRAVELS STYLE FLEET TARIFF COMPARISON (SHOWN WHEN USER ENTERS ROUTE)
              ========================================================================= */}
          <div className="bg-slate-50/80 border-t border-slate-200 p-6 sm:p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-[#0A3D73] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded">
                    Tejas Travels Benchmark
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    ✓ 100% Transparent Market Rates
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-[#0A3D73] font-display mt-1">
                  Guaranteed Route Tariff: {form.pickup.trim() || 'Bangalore'} ➔ {form.destination.trim() || 'Outstation / Local'}
                </h3>
                <p className="text-xs text-slate-500">
                  Estimated Travel Distance: <strong className="text-slate-800 font-mono">{getCalculatedKm()} KM</strong> ({rideMode === 'outstation' ? (outstationType === 'roundtrip' ? 'Round Trip' : 'One-Way Drop') : rideMode === 'local' ? 'Local 8Hr/80Km' : 'Airport Transfer'}). Zero hidden fees.
                </p>
              </div>

              <div className="flex items-center gap-2 self-start md:self-center">
                <Link
                  href={`/invoice?name=${encodeURIComponent(form.name)}&phone=${encodeURIComponent(form.phone)}&email=${encodeURIComponent(form.email)}&pickup=${encodeURIComponent(form.pickup)}&drop=${encodeURIComponent(form.destination)}&vehicle=${encodeURIComponent(form.vehicleInfo)}&date=${encodeURIComponent(form.date)}`}
                  className="bg-white hover:bg-slate-100 text-[#0A3D73] border border-slate-300 font-black text-xs py-2 px-3.5 rounded-xl transition-all shadow-xs flex items-center gap-1.5"
                >
                  <FileText size={14} className="text-[#FF7020]" />
                  <span>Custom Quote PDF</span>
                </Link>
              </div>
            </div>

            {/* Grid of All Vehicles with Real-Time Calculated Fares */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {FLEET_PRICING.slice(0, 8).map((v) => {
                const fareData = calculateFareForVehicle(v);

                return (
                  <div
                    key={v.id}
                    className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs hover:shadow-lg hover:border-[#0A3D73] transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="relative h-32 rounded-xl bg-slate-100 overflow-hidden mb-3">
                        <img
                          src={v.image}
                          alt={v.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-xs text-white text-[10px] font-black px-2 py-0.5 rounded-md">
                          {v.seats}
                        </div>
                      </div>

                      <h4 className="font-black text-sm text-slate-900 leading-snug line-clamp-1 group-hover:text-[#0A3D73] transition-colors">
                        {v.shortName}
                      </h4>

                      <div className="mt-2 space-y-1 text-[11px] text-slate-500">
                        <div className="flex justify-between">
                          <span>Base Tariff:</span>
                          <span className="font-semibold text-slate-800 font-mono">₹{v.ratePerKm}/km</span>
                        </div>
                        {fareData.bata > 0 && (
                          <div className="flex justify-between">
                            <span>Driver Bata:</span>
                            <span className="font-semibold text-slate-800 font-mono">₹{fareData.bata}</span>
                          </div>
                        )}
                        {fareData.tolls > 0 && (
                          <div className="flex justify-between">
                            <span>Tolls Est.:</span>
                            <span className="font-semibold text-slate-800 font-mono">₹{fareData.tolls}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-3 mt-3 border-t border-slate-100">
                      <div className="flex items-baseline justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase text-slate-400">Total Est. Fare:</span>
                        <span className="text-base font-black text-emerald-700 font-mono">
                          ₹{fareData.totalFare.toLocaleString()}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => bookSpecificVehicle(v)}
                        className="w-full bg-[#0A3D73] hover:bg-[#082e56] text-white font-black text-xs py-2 px-3 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Car size={13} />
                        <span>Book {v.shortName.split(' ')[0]}</span>
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle size={14} className="text-emerald-600" />
                <span>Zero advance deposit required • Pay directly to driver after trip</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Mail size={14} className="text-[#0A3D73]" />
                <span>Formal quotations dispatched to <strong>bookmyroute06@gmail.com</strong></span>
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Fleet Categories Highlight */}
      <section className="container-x py-12 mb-12">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-black uppercase tracking-wider text-[#FF7020]">Karnataka's Largest Fleet</span>
          <h2 className="text-3xl md:text-4xl font-black text-[#0A3D73] font-display mt-1">
            Choose Your Travel Category
          </h2>
          <p className="text-slate-500 text-sm sm:text-base mt-2">
            Pristine condition, pushback seats, and verified commercial drivers for every group size.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              id: 'cab',
              name: 'Cabs & Sedans',
              seats: '4–7 Seats',
              image: '/vehicles/Toyota innova.webp',
              price: 'From ₹13 / km',
              desc: 'Swift Dzire, Etios, Maruti Ertiga & Toyota Innova Crysta for city & highway tours.'
            },
            {
              id: 'tempo',
              name: 'Tempo Travellers',
              seats: '8–20 Seats',
              image: '/vehicles/tempo-traveller-17.jpg',
              price: 'From ₹22 / km',
              desc: '9S Maharaja, 12S, 14S, 17S and 20S pushback AC tempo travellers for family & corporate.'
            },
            {
              id: 'minibus',
              name: 'Mini Buses',
              seats: '12–25 Seats',
              image: '/vehicles/21seater-bus.webp',
              price: 'From ₹32 / km',
              desc: '21 and 25-seater luxury AC mini buses with underbelly luggage holds and panoramic views.'
            },
            {
              id: 'bus',
              name: 'Coach Buses',
              seats: '27–50 Seats',
              image: '/vehicles/coach-bus-40.jpg',
              price: 'From ₹42 / km',
              desc: '32, 40 and 50-seater pushback tourist buses for weddings, conventions & pilgrimages.'
            }
          ].map((item) => (
            <div 
              key={item.id}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all flex flex-col group"
            >
              <div className="h-48 overflow-hidden relative bg-slate-100">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500" 
                />
                <div className="absolute top-3 left-3 bg-white/95 px-3 py-1 rounded-lg text-xs font-black text-[#0A3D73]">
                  {item.seats}
                </div>
                <div className="absolute top-3 right-3 bg-[#FF7020] text-white px-2.5 py-1 rounded-lg text-xs font-black">
                  {item.price}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-black text-lg text-slate-900 mb-1">{item.name}</h3>
                <p className="text-slate-500 text-xs leading-relaxed mb-4 flex-1">{item.desc}</p>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => openBookingModal({ category: item.id as any })}
                    className="flex-1 bg-[#0A3D73] hover:bg-[#072d54] text-white font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    Book Now
                  </button>
                  <Link
                    href="/vehicles"
                    className="px-3.5 py-2.5 border border-slate-200 hover:border-slate-300 text-slate-700 font-bold rounded-xl text-xs transition-colors flex items-center justify-center"
                  >
                    Fleet →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* NEW: MakeMyTrip Inspired Villas, Homestays & Budget Rooms Showcase */}
      <section className="container-x py-14 border-t border-slate-200">
        
        {/* Banner Uploaded by User: Now Find Stays Too! Book Your Vehicle & Stay Together */}
        <div className="mb-10 rounded-3xl overflow-hidden shadow-xl border border-slate-200 bg-slate-900 group">
          <Link href="/homestays" className="block relative">
            <img 
              src="/banner-stays-vehicle.jpg" 
              alt="Now Find Stays Too! Book Your Vehicle & Stay Together on BookMyRoute"
              className="w-full h-auto object-cover max-h-[360px] group-hover:scale-[1.01] transition-transform duration-300"
            />
          </Link>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#FF7020] mb-2 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
              <Sparkles size={13} /> Stays & Rooms Across Entire India
            </div>
            <h2 className="text-2xl sm:text-4xl font-black font-display text-[#0A3D73]">
              Handpicked Rooms, Homestays & Luxury Villas
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1.5 max-w-2xl leading-relaxed">
              Budget backpacker rooms from ₹699 to ultra-luxury private pool estates. Every stay features verified address details and direct 1-click Google Maps navigation.
            </p>
          </div>
          <Link
            href="/homestays"
            className="inline-flex items-center gap-1.5 bg-[#0A3D73] hover:bg-[#072d54] text-white font-black text-xs px-5 py-3 rounded-xl transition-all shadow-md shrink-0 self-start md:self-end"
          >
            <span>Browse All Stays & Rooms</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Stays Grid: Show Small Scale (Budget), Mid Scale (Homestay), and Luxury Villa */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {HOMESTAYS_DATA.slice(0, 3).map((stay) => (
            <div
              key={stay.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="h-52 overflow-hidden relative bg-slate-100">
                <img
                  src={stay.images[0]}
                  alt={stay.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-[#0A3D73]/95 text-white px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-sm">
                  {stay.scaleLabel}
                </div>
                <div className="absolute top-3 right-3 bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-lg text-xs font-black flex items-center gap-1 shadow-xs">
                  <Star size={12} className="fill-amber-500 text-amber-500" /> {stay.rating}
                </div>
                <div className="absolute bottom-3 left-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[10px] font-semibold px-2.5 py-1 rounded-md truncate">
                  📍 {stay.distanceKmFromBangalore} KM from Bangalore • {stay.approxDriveTime}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    <span className="text-[#0A3D73] font-black">{stay.destination}, {stay.state}</span>
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-black">{stay.category}</span>
                  </div>

                  <h3 className="font-black text-base text-slate-900 mb-2 leading-snug line-clamp-1 group-hover:text-[#0A3D73] transition-colors">
                    {stay.name}
                  </h3>

                  {/* Clean Address display */}
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5 mb-3 flex items-start gap-1.5">
                    <MapPin size={13} className="text-[#FF7020] shrink-0 mt-0.5" />
                    <p className="text-[11px] text-slate-600 font-medium line-clamp-2 leading-tight">
                      {stay.address}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-2.5">
                  <div className="flex items-center justify-between bg-blue-50/80 border border-blue-200/70 rounded-xl px-2.5 py-1.5 text-xs">
                    <span className="text-[#0A3D73] font-bold text-[11px] flex items-center gap-1">
                      <Phone size={12} className="text-[#FF7020]" />
                      <span>Direct Owner Rates on Google</span>
                    </span>
                    <span className="text-[10px] font-black text-emerald-800 bg-white border border-emerald-200 px-1.5 py-0.5 rounded shadow-2xs">
                      Verified
                    </span>
                  </div>

                  {/* 1-Click Google Maps Direction & Contact */}
                  <a
                    href={stay.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#0A3D73] hover:bg-[#072c54] text-white py-2.5 px-3 rounded-xl text-xs font-black transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Navigation size={13} className="text-[#FF7020]" />
                    <span>📍 View on Google Maps (Contact & Rates)</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* NEW: Hire Driver for Your Personal Car (White Board Vehicle) */}
      <section className="bg-slate-50 py-14 border-t border-slate-200">
        <div className="container-x">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-emerald-700 mb-2 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                <ShieldCheck size={14} /> Chauffeur on Demand for Your Car
              </div>
              <h2 className="text-2xl sm:text-4xl font-black font-display text-[#0A3D73]">
                Hire a Master Chauffeur for Your Personal Car
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm mt-1.5 max-w-2xl leading-relaxed">
                Sit back and relax in your own car. Hire an expert, verified driver skilled in driving <strong>all vehicle types</strong> (Manual, Automatic, SUV, EV, and Luxury) for outstation trips, airport transfers, or city commutes.
              </p>
            </div>
            <Link
              href="/white-board-drivers"
              className="inline-flex items-center gap-1.5 bg-[#0A3D73] hover:bg-[#072d54] text-white font-black text-xs px-5 py-3 rounded-xl transition-all shadow-md shrink-0 self-start md:self-end"
            >
              <span>Driver Details & Hire</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Featured Driver Card: Yeshwanth K */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <img
                src={WHITE_BOARD_DRIVERS[0].avatar}
                alt={WHITE_BOARD_DRIVERS[0].name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-slate-200 shadow-sm shrink-0"
              />
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-black text-slate-900 text-xl sm:text-2xl">{WHITE_BOARD_DRIVERS[0].name}</h3>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-200">
                    ✓ Verified Master Driver
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  {WHITE_BOARD_DRIVERS[0].roleTitle} • {WHITE_BOARD_DRIVERS[0].city}
                </p>
                <div className="flex items-center gap-2 mt-2 text-xs">
                  <span className="flex items-center gap-1 bg-amber-50 text-amber-900 border border-amber-200 font-black px-2 py-0.5 rounded-md">
                    <Star size={12} className="fill-amber-500 text-amber-500" /> {WHITE_BOARD_DRIVERS[0].rating} ({WHITE_BOARD_DRIVERS[0].reviewsCount} Reviews)
                  </span>
                  <span className="text-slate-600 font-bold">
                    {WHITE_BOARD_DRIVERS[0].experienceYears}+ Years Highway Driving
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5 text-[10px] font-bold text-slate-700">
                  <span className="bg-slate-100 px-2 py-0.5 rounded">All Sedans (Dzire, Etios, City)</span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded">All SUVs (Innova, Crysta, Fortuner)</span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded">Compact SUVs (Creta, Brezza)</span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded">Automatic & Manual Specialist</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 w-full md:w-auto shrink-0">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center mb-1">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Chauffeur Rates</span>
                <span className="text-sm font-black text-[#0A3D73]">Local: ₹799/8h • Outstation: ₹1,199/day</span>
              </div>
              <div className="flex gap-2">
                <a
                  href={`tel:${WHITE_BOARD_DRIVERS[0].phoneTel}`}
                  className="flex-1 bg-[#0A3D73] hover:bg-[#072d54] text-white font-black text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Phone size={13} className="text-[#FF7020]" /> Call {WHITE_BOARD_DRIVERS[0].phoneRaw}
                </a>
                <a
                  href={`https://wa.me/91${WHITE_BOARD_DRIVERS[0].phoneRaw}?text=Hi%20Yeshwanth%20K%2C%20I%20would%20like%20to%20hire%20you%20as%20a%20driver%20for%20my%20car.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-black text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Highlights */}
      <section className="bg-slate-100/70 py-16 border-y border-slate-200">
        <div className="container-x">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-[#FF7020]">Safe & Reliable</span>
              <h2 className="text-3xl md:text-4xl font-black font-display text-[#0A3D73] mt-1 mb-5">
                Karnataka's Most Trusted Travel Partner
              </h2>
              <p className="text-slate-600 text-base leading-relaxed mb-6">
                Whether you need an airport transfer to Kempegowda International Airport (BLR), a weekend getaway to Coorg or Ooty, or corporate conference buses, BookMyRoute delivers spotless vehicles with verified route drivers.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                {[
                  "Police-Verified Route Drivers",
                  "24/7 GPS Tracking on All Vehicles",
                  "100% Transparent Billing & Invoices",
                  "Zero Hidden Driver Allowance"
                ].map((text, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-white p-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-800">
                    <CheckCircle size={16} className="text-[#5CC13A] shrink-0" />
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#0A3D73] to-[#0F355C] text-white p-8 sm:p-10 rounded-3xl shadow-xl space-y-5">
              <span className="bg-[#FF7020] text-white text-[11px] font-black px-3 py-1 rounded-full uppercase">Instant Quotation</span>
              <h3 className="text-2xl sm:text-3xl font-black font-display">Need a custom itinerary quote?</h3>
              <p className="text-blue-100 text-sm leading-relaxed">
                Connect directly with our dispatch manager on WhatsApp for immediate vehicle availability, corporate packages, and customized trip rates.
              </p>

              <div className="pt-2">
                <a
                  href={`https://wa.me/${CONTACT_PHONE_WA}?text=Hi,%20I%20am%20looking%20for%20a%20vehicle%20quote%20for%20my%20trip.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 bg-[#25D366] hover:bg-[#1ebd5a] text-white font-black px-6 py-3.5 rounded-xl shadow-lg transition-transform hover:scale-102"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                  </svg>
                  <span>Chat on WhatsApp: {CONTACT_PHONE}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer FAQs */}
      <section className="container-x py-16">
        <h2 className="text-2xl sm:text-3xl font-black font-display text-[#0A3D73] mb-8 text-center">
          Frequently Asked Questions
        </h2>

        <div className="max-w-3xl mx-auto space-y-3 text-sm">
          {[
            {
              q: "How are outstation trip fares calculated?",
              a: "Outstation trips are calculated based on a minimum of 300 KMs per day. The total is: (Actual or Min KMs × Vehicle Per KM Rate) + Daily Driver Bata. Tolls, state taxes, and parking are extra as per actual receipts."
            },
            {
              q: "What types of buses are available for rent?",
              a: "We provide 21 to 25-seater Mini Buses and 32, 40, and 50-seater Pushback Coaches. We strictly operate pushback seating tour buses (we do not operate sleeper buses or luxury multi-axle buses)."
            },
            {
              q: "How do I confirm my booking on WhatsApp?",
              a: `Click any 'Book Now' or 'WhatsApp Quote' button. Your itinerary details will automatically open on WhatsApp to ${CONTACT_PHONE}. Our dispatch team will verify vehicle availability and confirm your ride instantly.`
            },
            {
              q: "Are the vehicles air-conditioned?",
              a: "Yes, all our Cabs, Tempo Travellers, Mini Buses, and Coaches come equipped with high-power AC systems to keep all passengers cool throughout the journey."
            }
          ].map((faq, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
              <h4 className="font-bold text-slate-800 text-base mb-2">{faq.q}</h4>
              <p className="text-slate-500 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
