'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, Car, Users, Bus, MapPin, Navigation, Mail, User, Phone, 
  Calendar, Clock, CheckCircle2, ArrowRight, Sparkles, Check, ChevronDown
} from 'lucide-react';
import { 
  FLEET_DATA, 
  VEHICLE_CATEGORIES_CONFIG, 
  VehicleCategory, 
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
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropLocation, setDropLocation] = useState('');
  
  // Trip details
  const [tripType, setTripType] = useState<'Outstation Round Trip' | 'Local 8Hr/80Km' | 'Airport Pickup/Drop' | 'One Way Outstation'>('Outstation Round Trip');
  const [travelDate, setTravelDate] = useState('');
  const [travelTime, setTravelTime] = useState('06:00');
  const [returnDate, setReturnDate] = useState('');

  // UI state
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [locating, setLocating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Update default vehicle when category changes
  useEffect(() => {
    const available = FLEET_DATA.filter(v => v.category === category);
    if (available.length > 0 && !available.some(v => v.id === selectedVehicleId)) {
      setSelectedVehicleId(available[0].id);
    }
  }, [category, selectedVehicleId]);

  useEffect(() => {
    if (isOpen) {
      if (initialCategory) setCategory(initialCategory);
      if (initialVehicleId) {
        setSelectedVehicleId(initialVehicleId);
        const v = FLEET_DATA.find(x => x.id === initialVehicleId);
        if (v) setCategory(v.category);
      }
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dateStr = tomorrow.toISOString().split('T')[0];
      if (!travelDate) setTravelDate(dateStr);
      setStep('form');
      setErrorMsg('');
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
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          if (data && data.display_name) {
            setPickupLocation(data.address?.suburb || data.address?.neighbourhood || data.address?.city || data.display_name.split(',')[0] + ', Bangalore');
          } else {
            setPickupLocation(`Bengaluru (${latitude.toFixed(3)}, ${longitude.toFixed(3)})`);
          }
        } catch {
          setPickupLocation('Bangalore');
        } finally {
          setLocating(false);
        }
      },
      () => {
        setLocating(false);
        alert('Could not detect location. Please enter manually.');
      }
    );
  };

  const handleSubmitToWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

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
      setErrorMsg('Please enter pickup location.');
      return;
    }

    const details: BookingDetails = {
      fullName,
      mobile: cleanPhone,
      pickupLocation,
      dropLocation: dropLocation || (tripType.includes('Airport') ? 'Kempegowda International Airport (BLR)' : 'Bangalore / Outstation'),
      category,
      vehicleId: selectedVehicle?.id || '',
      vehicleName: selectedVehicle?.name || 'Tempo Traveller',
      tripType,
      travelDate,
      travelTime,
      returnDate: tripType === 'Outstation Round Trip' ? returnDate : undefined,
      passengers: selectedVehicle?.seats || 4,
    };

    // Store lead silently
    fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: fullName,
        phone: cleanPhone,
        service: `${selectedVehicle?.name} (${tripType})`,
        pickup: pickupLocation,
        destination: dropLocation || 'Local/Outstation',
        travel_date: travelDate,
        passengers: selectedVehicle?.seats || 4
      })
    }).catch(() => {});

    // Open WhatsApp
    const waUrl = getWhatsAppBookingUrl(details);
    window.open(waUrl, '_blank');
    setStep('success');
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-[480px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Compact Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[#0A3D73] to-[#0d4b8f] text-white shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF7020] animate-ping" />
            <div>
              <h3 className="text-sm sm:text-base font-black tracking-tight leading-none">
                Book Your Ride
              </h3>
              <p className="text-[10px] text-blue-200 font-medium mt-0.5">
                Instant WhatsApp Quote • {CONTACT_PHONE}
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-1 text-blue-200 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        {step === 'form' ? (
          <form onSubmit={handleSubmitToWhatsApp} className="flex-1 flex flex-col overflow-hidden">
            {/* Scrollable Form Body */}
            <div className="overflow-y-auto p-4 space-y-3 flex-1 text-slate-800">
              
              {/* 1. Category Selector (4 Compact Tabs in 1 Row) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                    Select Vehicle Type
                  </label>
                  <span className="text-[10px] text-[#0A3D73] font-bold">Bangalore Fleet</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5 bg-slate-100 p-1 rounded-xl">
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
                        className={`py-1.5 px-1 rounded-lg text-center transition-all flex flex-col items-center justify-center cursor-pointer ${
                          isSelected 
                            ? 'bg-white text-[#0A3D73] font-black shadow-xs ring-1 ring-slate-200' 
                            : 'text-slate-600 hover:text-slate-900 font-semibold hover:bg-white/50'
                        }`}
                      >
                        <div className="text-xs mb-0.5">
                          {cat.id === 'cab' && <Car size={15} />}
                          {cat.id === 'tempo' && <Users size={15} />}
                          {cat.id === 'minibus' && <Bus size={15} />}
                          {cat.id === 'bus' && <Bus size={15} />}
                        </div>
                        <span className="text-[11px] leading-tight block">
                          {cat.name}
                        </span>
                        <span className="text-[8px] text-slate-400 font-normal leading-none block">
                          {cat.seatRange}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Specific Model Dropdown + Live Pricing Badge */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                    Model & Rate
                  </label>
                  {selectedVehicle && (
                    <span className="text-[10px] font-black text-[#FF7020] bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200/60">
                      ₹{selectedVehicle.pricing.outstationPerKm}/km • Local: ₹{selectedVehicle.pricing.local8Hr80Km}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <select
                    value={selectedVehicleId}
                    onChange={(e) => setSelectedVehicleId(e.target.value)}
                    className="w-full h-9 px-2.5 pl-8 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:border-[#0A3D73] appearance-none cursor-pointer"
                  >
                    {currentVehicles.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name} ({v.seatsLabel})
                      </option>
                    ))}
                  </select>
                  <Users size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* 3. Passenger Details (Name & Phone side by side) */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">
                    Your Name *
                  </label>
                  <div className="relative">
                    <User size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh K"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full h-9 pl-7 pr-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-[#0A3D73]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">
                    WhatsApp Number *
                  </label>
                  <div className="relative flex rounded-lg bg-slate-50 border border-slate-200 overflow-hidden focus-within:border-[#0A3D73] focus-within:bg-white">
                    <span className="bg-slate-100 px-2 py-1.5 text-slate-600 font-bold text-[11px] border-r border-slate-200 flex items-center">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="9876543210"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                      className="w-full h-9 px-2 text-xs font-semibold text-slate-800 focus:outline-none bg-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* 4. Pickup & Drop Locations */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                      Pickup Location *
                    </label>
                    <button
                      type="button"
                      onClick={handleGetCurrentLocation}
                      className="text-[9px] font-bold text-[#0A3D73] hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      <Navigation size={9} />
                      {locating ? 'Locating...' : 'GPS Detect'}
                    </button>
                  </div>
                  <div className="relative">
                    <MapPin size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#FF7020]" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Uttarahalli / Indiranagar"
                      value={pickupLocation}
                      onChange={(e) => setPickupLocation(e.target.value)}
                      className="w-full h-9 pl-7 pr-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-[#0A3D73]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">
                    Drop / Destination
                  </label>
                  <div className="relative">
                    <MapPin size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="e.g. Coorg, Mysore, Airport"
                      value={dropLocation}
                      onChange={(e) => setDropLocation(e.target.value)}
                      className="w-full h-9 pl-7 pr-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-[#0A3D73]"
                    />
                  </div>
                </div>
              </div>

              {/* 5. Trip Type & Schedule */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">
                    Trip Type
                  </label>
                  <select
                    value={tripType}
                    onChange={(e) => setTripType(e.target.value as any)}
                    className="w-full h-9 px-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-[#0A3D73]"
                  >
                    <option>Outstation Round Trip</option>
                    <option>Local 8Hr/80Km</option>
                    <option>Airport Pickup/Drop</option>
                    <option>One Way Outstation</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">
                    Travel Date & Time
                  </label>
                  <div className="grid grid-cols-2 gap-1">
                    <input
                      type="date"
                      required
                      value={travelDate}
                      onChange={(e) => setTravelDate(e.target.value)}
                      className="w-full h-9 px-1.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-[#0A3D73]"
                    />
                    <input
                      type="time"
                      value={travelTime}
                      onChange={(e) => setTravelTime(e.target.value)}
                      className="w-full h-9 px-1 rounded-lg bg-slate-50 border border-slate-200 text-[11px] font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-[#0A3D73]"
                    />
                  </div>
                </div>
              </div>

              {tripType === 'Outstation Round Trip' && (
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">
                    Return Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full h-9 px-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-[#0A3D73]"
                  />
                </div>
              )}

              {errorMsg && (
                <div className="p-2 bg-red-50 border border-red-200 rounded-lg text-red-600 text-xs font-bold">
                  ⚠️ {errorMsg}
                </div>
              )}
            </div>

            {/* Compact Footer with WhatsApp CTA */}
            <div className="p-3 bg-slate-50 border-t border-slate-100 shrink-0">
              <button
                type="submit"
                className="w-full bg-[#25D366] hover:bg-[#1EBE5D] text-white font-black text-xs sm:text-sm py-2.5 px-4 rounded-xl transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                </svg>
                <span>Get Instant Quote on WhatsApp</span>
                <ArrowRight size={14} />
              </button>

              <div className="flex items-center justify-center gap-3 text-[10px] text-slate-500 font-semibold mt-2">
                <span className="flex items-center gap-1">
                  <CheckCircle2 size={11} className="text-emerald-600" /> Transparent Rates
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 size={11} className="text-emerald-600" /> Direct WhatsApp
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 size={11} className="text-emerald-600" /> No Advance Needed
                </span>
              </div>
            </div>
          </form>
        ) : (
          /* SUCCESS VIEW: Instant confirmation with WhatsApp and Call direct actions */
          <div className="p-5 flex flex-col items-center text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 shadow-inner">
              <Check size={28} className="stroke-[3]" />
            </div>

            <div>
              <h4 className="text-base font-black text-[#0A3D73]">
                Enquiry Sent to WhatsApp!
              </h4>
              <p className="text-xs text-slate-600 mt-1 max-w-xs mx-auto">
                Thank you, <span className="font-bold text-slate-900">{fullName}</span>. Your vehicle request for <span className="font-bold text-[#FF7020]">{selectedVehicle?.name}</span> has been dispatched to WhatsApp ({CONTACT_PHONE}).
              </p>
            </div>

            <div className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-left text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Pickup:</span>
                <span className="font-bold text-slate-800 truncate max-w-[200px]">{pickupLocation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Destination:</span>
                <span className="font-bold text-slate-800 truncate max-w-[200px]">{dropLocation || 'Bangalore'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date & Time:</span>
                <span className="font-bold text-slate-800">{travelDate} at {travelTime}</span>
              </div>
            </div>

            <div className="w-full space-y-2">
              <button
                type="button"
                onClick={() => {
                  const details: BookingDetails = {
                    fullName,
                    mobile,
                    pickupLocation,
                    dropLocation: dropLocation || 'Bangalore',
                    category,
                    vehicleId: selectedVehicle?.id || '',
                    vehicleName: selectedVehicle?.name || 'Tempo Traveller',
                    tripType,
                    travelDate,
                    travelTime,
                    passengers: selectedVehicle?.seats || 4,
                  };
                  window.open(getWhatsAppBookingUrl(details), '_blank');
                }}
                className="w-full bg-[#25D366] hover:bg-[#1EBE5D] text-white font-black text-xs py-2.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Re-open WhatsApp Chat</span>
              </button>

              <div className="flex gap-2">
                <a
                  href={`tel:${CONTACT_PHONE_TEL}`}
                  className="flex-1 border border-[#0A3D73] text-[#0A3D73] hover:bg-[#0A3D73] hover:text-white font-bold py-2 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Phone size={13} /> Call Helpline
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 rounded-xl text-xs transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
