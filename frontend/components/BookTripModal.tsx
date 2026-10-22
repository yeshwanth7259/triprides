'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, Car, Users, Bus, MapPin, Navigation, Mail, User, Phone, 
  Calendar, Clock, CheckCircle2, Send, ArrowRight, ShieldCheck, 
  Sparkles, Check
} from 'lucide-react';
import { 
  FLEET_DATA, 
  VEHICLE_CATEGORIES_CONFIG, 
  VehicleCategory, 
  VehicleModel,
  CONTACT_PHONE, 
  CONTACT_PHONE_TEL,
  CONTACT_PHONE_WA,
  getWhatsAppBookingUrl,
  BookingDetails 
} from '../lib/fleetData';

interface BookTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: VehicleCategory;
  initialVehicleId?: string;
}

export default function BookTripModal({ 
  isOpen, 
  onClose, 
  initialCategory = 'tempo',
  initialVehicleId 
}: BookTripModalProps) {
  const [category, setCategory] = useState<VehicleCategory>(initialCategory);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(initialVehicleId || '');
  
  // Passenger details
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropLocation, setDropLocation] = useState('');
  
  // Trip details
  const [tripType, setTripType] = useState<'Outstation Round Trip' | 'Local 8Hr/80Km' | 'Airport Pickup/Drop' | 'One Way Outstation'>('Outstation Round Trip');
  const [travelDate, setTravelDate] = useState('');
  const [travelTime, setTravelTime] = useState('06:00');
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setPassengers] = useState<number | string>('');
  const [notes, setNotes] = useState('');

  // UI state
  const [step, setStep] = useState<'form' | 'quotation'>('form');
  const [locating, setLocating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Update default vehicle when category changes
  useEffect(() => {
    const available = FLEET_DATA.filter(v => v.category === category);
    if (available.length > 0 && !available.some(v => v.id === selectedVehicleId)) {
      setSelectedVehicleId(available[0].id);
    }
  }, [category, selectedVehicleId]);

  // Synchronize when opened with initialCategory or initialVehicleId
  useEffect(() => {
    if (isOpen) {
      if (initialCategory) setCategory(initialCategory);
      if (initialVehicleId) {
        setSelectedVehicleId(initialVehicleId);
        const v = FLEET_DATA.find(x => x.id === initialVehicleId);
        if (v) setCategory(v.category);
      }
      // Set default travel date as tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dateStr = tomorrow.toISOString().split('T')[0];
      if (!travelDate) setTravelDate(dateStr);
    }
  }, [isOpen, initialCategory, initialVehicleId]);

  if (!isOpen) return null;

  const currentVehicles = FLEET_DATA.filter(v => v.category === category);
  const selectedVehicle = FLEET_DATA.find(v => v.id === selectedVehicleId) || currentVehicles[0];

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Reverse geocode via openstreetmap
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          if (data && data.display_name) {
            setPickupLocation(data.address?.suburb || data.address?.neighbourhood || data.address?.city || data.display_name.split(',')[0] + ', Bangalore');
          } else {
            setPickupLocation(`Bengaluru (${latitude.toFixed(3)}, ${longitude.toFixed(3)})`);
          }
        } catch {
          setPickupLocation('Current Location (Bengaluru)');
        } finally {
          setLocating(false);
        }
      },
      () => {
        setLocating(false);
        alert('Could not detect location. Please type your pickup location.');
      }
    );
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!category) {
      setErrorMsg('Please select a vehicle type to continue.');
      return;
    }
    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    const cleanPhone = mobile.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!pickupLocation.trim()) {
      setErrorMsg('Please enter your pickup location.');
      return;
    }

    setStep('quotation');
  };

  const handleSendToWhatsApp = async () => {
    const details: BookingDetails = {
      fullName,
      mobile,
      email,
      pickupLocation,
      dropLocation: dropLocation || (tripType.includes('Airport') ? 'Kempegowda International Airport (BLR)' : 'Bangalore & Environs'),
      category,
      vehicleId: selectedVehicle?.id || '',
      vehicleName: selectedVehicle?.name || 'Tempo Traveller',
      tripType,
      travelDate,
      travelTime,
      returnDate: tripType === 'Outstation Round Trip' ? returnDate : undefined,
      passengers: passengers || selectedVehicle?.seats || 4,
      notes
    };

    // Save lead in backend asynchronously (safe fire-and-forget)
    try {
      fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fullName,
          phone: mobile,
          service: `${selectedVehicle?.name} (${tripType})`,
          pickup: pickupLocation,
          destination: dropLocation || 'Local/Outstation',
          travel_date: travelDate,
          passengers: Number(passengers) || Number(selectedVehicle?.seats) || 4
        })
      }).catch(() => {});
    } catch {}

    const waUrl = getWhatsAppBookingUrl(details);
    window.open(waUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-slate-100 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-5 sm:p-7 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#FF7020] animate-pulse"></span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0A3D73] font-display tracking-tight">
                Book Your Trip
              </h2>
            </div>
            <p className="text-slate-500 text-sm sm:text-base mt-1">
              Choose your vehicle and share your details — done in under a minute.
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
            aria-label="Close dialog"
          >
            <X size={24} />
          </button>
        </div>

        {step === 'form' ? (
          <form onSubmit={handleContinue} className="p-5 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* LEFT COLUMN: Vehicle Details & Seating Capacity */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-black text-slate-800 uppercase tracking-wider mb-3">
                    Vehicle Details
                  </label>
                  
                  {/* 4 Category Cards matching the screenshot */}
                  <div className="grid grid-cols-2 gap-3">
                    {VEHICLE_CATEGORIES_CONFIG.map((cat) => {
                      const isSelected = category === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => {
                            setCategory(cat.id);
                            setErrorMsg('');
                          }}
                          className={`flex flex-col items-center text-center p-4 rounded-xl border-2 transition-all relative ${
                            isSelected 
                              ? 'border-[#0A3D73] bg-blue-50/50 shadow-md ring-2 ring-[#0A3D73]/10' 
                              : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          <div className={`p-2.5 rounded-xl mb-2 ${isSelected ? 'text-[#0A3D73] bg-white shadow-sm' : 'text-slate-600 bg-slate-100'}`}>
                            {cat.id === 'cab' && <Car size={26} />}
                            {cat.id === 'tempo' && <Users size={26} />}
                            {cat.id === 'minibus' && <Bus size={26} />}
                            {cat.id === 'bus' && <Bus size={26} className="rotate-3" />}
                          </div>
                          <span className="font-black text-slate-900 text-sm sm:text-base leading-tight">
                            {cat.name}
                          </span>
                          <span className="text-xs text-slate-500 font-medium mt-0.5">
                            {cat.seatRange}
                          </span>
                          {isSelected && (
                            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#0A3D73]"></div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Seating Capacity Dropdown */}
                <div>
                  <label className="block text-sm font-black text-slate-800 uppercase tracking-wider mb-2">
                    Seating Capacity
                  </label>
                  <div className="relative">
                    <select
                      value={selectedVehicleId}
                      onChange={(e) => setSelectedVehicleId(e.target.value)}
                      className="w-full h-13 px-4 pl-11 bg-white border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:border-[#0A3D73] focus:ring-2 focus:ring-[#0A3D73]/10 appearance-none cursor-pointer"
                    >
                      {currentVehicles.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.name} ({v.seatsLabel}) — from ₹{v.pricing.outstationPerKm}/km
                        </option>
                      ))}
                    </select>
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <Users size={18} />
                    </div>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6"/></svg>
                    </div>
                  </div>
                </div>

                {/* Selected vehicle feature highlight */}
                {selectedVehicle && (
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 flex gap-4 items-center">
                    <img 
                      src={selectedVehicle.image} 
                      alt={selectedVehicle.name} 
                      className="w-20 h-14 object-cover rounded-lg shadow-xs shrink-0" 
                    />
                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-900 text-sm truncate">{selectedVehicle.name}</h4>
                      <p className="text-xs text-slate-500 line-clamp-1">{selectedVehicle.features.slice(0, 2).join(' • ')}</p>
                      <div className="text-xs font-black text-[#FF7020] mt-1">
                        Outstation: ₹{selectedVehicle.pricing.outstationPerKm}/km • Local: ₹{selectedVehicle.pricing.local8Hr80Km}
                      </div>
                    </div>
                  </div>
                )}

                {/* Trip Type */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Trip Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'Outstation Round Trip', label: 'Outstation' },
                      { id: 'Local 8Hr/80Km', label: 'Local (8Hr/80Km)' },
                      { id: 'Airport Pickup/Drop', label: 'Airport BLR' },
                      { id: 'One Way Outstation', label: 'One Way' }
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setTripType(t.id as any)}
                        className={`py-2 px-3 text-xs font-bold rounded-lg border text-left transition-colors ${
                          tripType === t.id
                            ? 'bg-[#0A3D73] text-white border-[#0A3D73]'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* RIGHT COLUMN: Passenger Details */}
              <div className="space-y-4">
                <label className="block text-sm font-black text-slate-800 uppercase tracking-wider">
                  Passenger Details
                </label>

                {/* Full Name */}
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Full Name *"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 font-semibold text-slate-800 focus:outline-none focus:border-[#0A3D73] focus:ring-2 focus:ring-[#0A3D73]/10"
                  />
                </div>

                {/* Mobile Number with +91 */}
                <div className="relative flex rounded-xl border border-slate-200 focus-within:border-[#0A3D73] focus-within:ring-2 focus-within:ring-[#0A3D73]/10 overflow-hidden">
                  <div className="bg-slate-50 px-3.5 py-3 border-r border-slate-200 text-slate-700 font-bold text-sm flex items-center gap-1 shrink-0">
                    <span>🇮🇳</span> +91
                  </div>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="Mobile Number *"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                    className="w-full h-12 px-4 font-semibold text-slate-800 focus:outline-none"
                  />
                </div>

                {/* Email Address */}
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    placeholder="Email Address (for quotation PDF)"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 font-semibold text-slate-800 focus:outline-none focus:border-[#0A3D73] focus:ring-2 focus:ring-[#0A3D73]/10"
                  />
                </div>

                {/* Pickup Location with GPS button */}
                <div className="space-y-1.5">
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <MapPin size={18} />
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="Enter a pickup location *"
                      value={pickupLocation}
                      onChange={(e) => setPickupLocation(e.target.value)}
                      className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 font-semibold text-slate-800 focus:outline-none focus:border-[#0A3D73] focus:ring-2 focus:ring-[#0A3D73]/10"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleGetCurrentLocation}
                    disabled={locating}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0A3D73] hover:text-[#FF7020] transition-colors pl-1 cursor-pointer"
                  >
                    <Navigation size={12} className={locating ? 'animate-spin' : ''} />
                    {locating ? 'Detecting current GPS location...' : 'Use my current location'}
                  </button>
                </div>

                {/* Drop Location */}
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <MapPin size={18} />
                  </div>
                  <input
                    type="text"
                    placeholder="Destination / Drop Location (e.g. Mysore, Coorg, Ooty)"
                    value={dropLocation}
                    onChange={(e) => setDropLocation(e.target.value)}
                    className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 font-semibold text-slate-800 focus:outline-none focus:border-[#0A3D73] focus:ring-2 focus:ring-[#0A3D73]/10"
                  />
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Travel Date</label>
                    <input
                      type="date"
                      required
                      value={travelDate}
                      onChange={(e) => setTravelDate(e.target.value)}
                      className="w-full h-11 px-3 rounded-lg border border-slate-200 font-semibold text-slate-800 text-sm focus:outline-none focus:border-[#0A3D73]"
                    />
                  </div>
                  <div className="relative">
                    <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Pickup Time</label>
                    <input
                      type="time"
                      value={travelTime}
                      onChange={(e) => setTravelTime(e.target.value)}
                      className="w-full h-11 px-3 rounded-lg border border-slate-200 font-semibold text-slate-800 text-sm focus:outline-none focus:border-[#0A3D73]"
                    />
                  </div>
                </div>

                {tripType === 'Outstation Round Trip' && (
                  <div className="relative">
                    <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Return Date</label>
                    <input
                      type="date"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="w-full h-11 px-3 rounded-lg border border-slate-200 font-semibold text-slate-800 text-sm focus:outline-none focus:border-[#0A3D73]"
                    />
                  </div>
                )}

              </div>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-semibold flex items-center gap-2">
                <span>⚠️</span> {errorMsg}
              </div>
            )}

            {/* Trust Badges matching screenshot */}
            <div className="pt-2 border-t border-slate-100">
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm font-bold text-slate-600">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={16} className="text-[#3B82F6]" /> Secure Booking
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={16} className="text-[#3B82F6]" /> Instant Confirmation
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={16} className="text-[#3B82F6]" /> Free Cancellation*
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={16} className="text-[#3B82F6]" /> 24×7 Support
                </span>
              </div>
            </div>

            {/* Primary Action Button */}
            <button
              type="submit"
              className="w-full bg-[#0A3D73] hover:bg-[#072d54] text-white font-black text-base py-4 rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-[0.99] flex items-center justify-center gap-2"
            >
              <span>Continue to Instant Quotation</span>
              <ArrowRight size={18} />
            </button>
          </form>
        ) : (
          /* STEP 2: Instant Quotation & WhatsApp Redirection */
          <div className="p-6 sm:p-8 space-y-6">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-emerald-900">
              <div className="flex items-center gap-2 text-emerald-700 font-black text-base sm:text-lg mb-1">
                <Sparkles size={20} />
                Quotation Preview Ready for {fullName}
              </div>
              <p className="text-xs sm:text-sm text-emerald-800">
                Review your journey estimate below. Click the WhatsApp button to get this quotation sent directly to WhatsApp and block your vehicle with our dispatch team.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-[#FF7020]">Selected Ride</span>
                  <h3 className="text-xl font-black text-[#0A3D73]">{selectedVehicle?.name}</h3>
                  <p className="text-xs text-slate-500 font-medium">{selectedVehicle?.seatsLabel} • All Pushback Air Conditioned</p>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-xs font-bold text-slate-400 uppercase">Estimated Pricing</span>
                  <div className="text-2xl font-black text-[#0A3D73]">
                    {tripType.includes('Local') && `₹${selectedVehicle?.pricing.local8Hr80Km.toLocaleString()}`}
                    {tripType.includes('Airport') && `₹${selectedVehicle?.pricing.airportFlatRate.toLocaleString()}`}
                    {tripType.includes('Outstation') && `₹${selectedVehicle?.pricing.outstationPerKm}/km`}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {tripType.includes('Local') ? '(8 Hours / 80 Kilometers)' : tripType.includes('Airport') ? '(Flat Airport BLR Transfer)' : `+ ₹${selectedVehicle?.pricing.driverBataPerDay}/day Driver Bata`}
                  </p>
                </div>
              </div>

              {/* Itinerary details grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-xs text-slate-400 font-bold uppercase">Pickup Location</span>
                  <p className="font-bold text-slate-800 mt-0.5">{pickupLocation}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-bold uppercase">Destination</span>
                  <p className="font-bold text-slate-800 mt-0.5">{dropLocation || 'Karnataka & South India'}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-bold uppercase">Travel Schedule</span>
                  <p className="font-bold text-slate-800 mt-0.5">{travelDate} {travelTime}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-bold uppercase">Trip Type</span>
                  <p className="font-bold text-slate-800 mt-0.5">{tripType}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-bold uppercase">Contact Phone</span>
                  <p className="font-bold text-slate-800 mt-0.5">+91 {mobile}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-bold uppercase">Dispatch Team</span>
                  <p className="font-bold text-emerald-700 mt-0.5">{CONTACT_PHONE}</p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-3.5 text-xs text-slate-600 space-y-1">
                <p>• <strong>Included:</strong> Vehicle hire, sanitized pushback vehicle, fuel charges, experienced commercial driver.</p>
                <p>• <strong>Excluded:</strong> Toll plaza fees, parking charges, interstate permit taxes (if crossing state border) billed at actuals.</p>
              </div>
            </div>

            {/* Direct WhatsApp Action Button */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleSendToWhatsApp}
                className="w-full bg-[#25D366] hover:bg-[#1ebd5a] text-white font-black text-lg py-4 px-6 rounded-xl transition-all shadow-[0_10px_25px_rgba(37,211,102,0.35)] hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-3 cursor-pointer"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                </svg>
                <span>Send Quotation Enquiry to WhatsApp</span>
              </button>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep('form')}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl text-sm transition-colors"
                >
                  ← Edit Trip Details
                </button>
                <a
                  href={`tel:${CONTACT_PHONE_TEL}`}
                  className="flex-1 border-2 border-[#0A3D73] text-[#0A3D73] hover:bg-[#0A3D73] hover:text-white font-bold py-3 px-4 rounded-xl text-sm transition-colors text-center flex items-center justify-center gap-1.5"
                >
                  <Phone size={16} /> Call {CONTACT_PHONE}
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
