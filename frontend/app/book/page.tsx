'use client';

import React, { useState } from 'react';
import { 
  Car, Users, Bus, MapPin, Navigation, Mail, User, Phone, 
  Calendar, Clock, CheckCircle2, ArrowRight, Sparkles, ShieldCheck 
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
} from '../../lib/fleetData';

export default function BookPage() {
  const [category, setCategory] = useState<VehicleCategory>('tempo');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('tempo-12');
  
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
  const [passengers, setPassengers] = useState<number | string>('12');
  const [notes, setNotes] = useState('');

  const [step, setStep] = useState<'form' | 'quotation'>('form');
  const [locating, setLocating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const currentVehicles = FLEET_DATA.filter(v => v.category === category);
  const selectedVehicle = FLEET_DATA.find(v => v.id === selectedVehicleId) || currentVehicles[0];

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation not supported.');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`);
          const d = await res.json();
          if (d && d.display_name) {
            setPickupLocation(d.address?.suburb || d.address?.city || d.display_name.split(',')[0] + ', Bangalore');
          } else {
            setPickupLocation('Bengaluru Current Location');
          }
        } catch {
          setPickupLocation('Bengaluru');
        } finally {
          setLocating(false);
        }
      },
      () => {
        setLocating(false);
        alert('Could not detect location. Please type manually.');
      }
    );
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (mobile.replace(/\D/g, '').length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!pickupLocation.trim()) {
      setErrorMsg('Please enter your pickup location.');
      return;
    }
    setStep('quotation');
  };

  const handleSendToWhatsApp = () => {
    const details: BookingDetails = {
      fullName,
      mobile,
      email,
      pickupLocation,
      dropLocation: dropLocation || 'Local/Outstation Tour',
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
        passengers: Number(passengers) || 4
      })
    }).catch(() => {});

    const waUrl = getWhatsAppBookingUrl(details);
    window.open(waUrl, '_blank');
  };

  return (
    <main className="min-h-screen bg-[#F9FAFB] pt-24 pb-28">
      {/* Banner */}
      <section className="bg-[#0A3D73] py-14 text-white">
        <div className="container-x max-w-4xl">
          <span className="bg-[#FF7020] text-white text-xs font-black px-3.5 py-1.5 rounded-full mb-3 inline-block uppercase tracking-wider">
            Fast Booking Workflow
          </span>
          <h1 className="text-3xl md:text-5xl font-black font-display tracking-tight mb-2">
            Book Your Ride
          </h1>
          <p className="text-blue-100 text-sm md:text-base">
            Select your vehicle, enter trip details, and receive an instant quotation directly on WhatsApp.
          </p>
        </div>
      </section>

      <div className="container-x max-w-4xl -mt-8 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          {step === 'form' ? (
            <form onSubmit={handleContinue} className="p-6 sm:p-10 space-y-8">
              
              {/* Category Grid */}
              <div>
                <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-3">
                  1. Select Vehicle Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {VEHICLE_CATEGORIES_CONFIG.map((cat) => {
                    const isSelected = category === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          setCategory(cat.id);
                          const first = FLEET_DATA.find(v => v.category === cat.id);
                          if (first) setSelectedVehicleId(first.id);
                        }}
                        className={`p-4 rounded-2xl border-2 text-center transition-all flex flex-col items-center gap-1.5 ${
                          isSelected
                            ? 'border-[#0A3D73] bg-blue-50/60 shadow-md ring-2 ring-[#0A3D73]/10'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-white text-[#0A3D73] shadow-xs' : 'bg-slate-100 text-slate-600'}`}>
                          {cat.id === 'cab' && <Car size={24} />}
                          {cat.id === 'tempo' && <Users size={24} />}
                          {cat.id === 'minibus' && <Bus size={24} />}
                          {cat.id === 'bus' && <Bus size={24} />}
                        </div>
                        <span className="font-black text-slate-900 text-sm">{cat.name}</span>
                        <span className="text-[11px] text-slate-400 font-medium">{cat.seatRange}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Seating Capacity Selection */}
              <div>
                <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-2">
                  2. Choose Exact Model & Capacity
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentVehicles.map((v) => {
                    const isSelected = selectedVehicleId === v.id;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedVehicleId(v.id)}
                        className={`p-3.5 rounded-xl border-2 text-left flex items-center gap-3 transition-all ${
                          isSelected
                            ? 'border-[#0A3D73] bg-blue-50/40 shadow-xs ring-1 ring-[#0A3D73]/20'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <img src={v.image} alt={v.name} className="w-16 h-12 object-cover rounded-lg shrink-0" />
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-slate-900 text-xs truncate">{v.name}</h4>
                          <span className="text-[11px] text-slate-500 font-medium">{v.seatsLabel} • Pushback AC</span>
                          <div className="text-xs font-black text-[#FF7020] mt-0.5">
                            ₹{v.pricing.outstationPerKm}/km • Local ₹{v.pricing.local8Hr80Km}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Passenger & Journey Details */}
              <div className="border-t border-slate-100 pt-6">
                <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-4">
                  3. Passenger & Journey Specifics
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl border border-slate-200 font-semibold text-slate-800 focus:outline-none focus:border-[#0A3D73]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Mobile Number (WhatsApp) *</label>
                    <div className="flex rounded-xl border border-slate-200 overflow-hidden focus-within:border-[#0A3D73]">
                      <span className="bg-slate-50 px-3 py-3 text-slate-700 font-bold text-sm border-r border-slate-200">🇮🇳 +91</span>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        placeholder="Mobile Number"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                        className="w-full h-12 px-4 font-semibold text-slate-800 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-bold text-slate-500">Pickup Location *</label>
                      <button
                        type="button"
                        onClick={handleGetCurrentLocation}
                        className="text-[11px] font-bold text-[#0A3D73] hover:underline"
                      >
                        {locating ? 'Detecting...' : '📍 Use GPS'}
                      </button>
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="Pickup address in Bangalore"
                      value={pickupLocation}
                      onChange={(e) => setPickupLocation(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl border border-slate-200 font-semibold text-slate-800 focus:outline-none focus:border-[#0A3D73]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Drop / Destination Location</label>
                    <input
                      type="text"
                      placeholder="e.g. Mysore, Coorg, Ooty, Airport"
                      value={dropLocation}
                      onChange={(e) => setDropLocation(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl border border-slate-200 font-semibold text-slate-800 focus:outline-none focus:border-[#0A3D73]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Trip Type</label>
                    <select
                      value={tripType}
                      onChange={(e) => setTripType(e.target.value as any)}
                      className="w-full h-12 px-4 rounded-xl border border-slate-200 font-semibold text-slate-800 bg-white focus:outline-none focus:border-[#0A3D73]"
                    >
                      <option>Outstation Round Trip</option>
                      <option>Local 8Hr/80Km</option>
                      <option>Airport Pickup/Drop</option>
                      <option>One Way Outstation</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Date</label>
                      <input
                        type="date"
                        required
                        value={travelDate}
                        onChange={(e) => setTravelDate(e.target.value)}
                        className="w-full h-12 px-3 rounded-xl border border-slate-200 font-semibold text-slate-800 text-sm focus:border-[#0A3D73]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Time</label>
                      <input
                        type="time"
                        value={travelTime}
                        onChange={(e) => setTravelTime(e.target.value)}
                        className="w-full h-12 px-3 rounded-xl border border-slate-200 font-semibold text-slate-800 text-sm focus:border-[#0A3D73]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {errorMsg && (
                <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-bold">
                  ⚠️ {errorMsg}
                </div>
              )}

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center justify-between text-xs font-bold text-slate-500 border-t border-slate-100 pt-5 gap-3">
                <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-[#3B82F6]" /> Instant Confirmation</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-[#3B82F6]" /> Verified Drivers</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-[#3B82F6]" /> Helpline: {CONTACT_PHONE}</span>
              </div>

              <button
                type="submit"
                className="w-full bg-[#0A3D73] hover:bg-[#072d54] text-white font-black text-lg py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Continue to Instant WhatsApp Quotation</span>
                <ArrowRight size={18} />
              </button>
            </form>
          ) : (
            /* STEP 2: Quotation Summary */
            <div className="p-6 sm:p-10 space-y-6">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-emerald-900">
                <h3 className="text-xl font-black text-emerald-800 flex items-center gap-2 mb-1">
                  <Sparkles size={20} /> Quotation Ready for {fullName}
                </h3>
                <p className="text-xs text-emerald-700">
                  Click the WhatsApp button below to send this booking enquiry straight to our reservation desk ({CONTACT_PHONE}) to confirm vehicle availability.
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                  <div>
                    <h4 className="font-black text-xl text-[#0A3D73]">{selectedVehicle?.name}</h4>
                    <p className="text-xs text-slate-500 font-medium">{selectedVehicle?.seatsLabel} • All Pushback Air Conditioned</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-400 uppercase">Estimated Pricing</span>
                    <div className="text-2xl font-black text-[#FF7020]">
                      {tripType.includes('Local') && `₹${selectedVehicle?.pricing.local8Hr80Km.toLocaleString()}`}
                      {tripType.includes('Airport') && `₹${selectedVehicle?.pricing.airportFlatRate.toLocaleString()}`}
                      {tripType.includes('Outstation') && `₹${selectedVehicle?.pricing.outstationPerKm}/km`}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 font-bold uppercase">Pickup</span>
                    <p className="font-bold text-slate-800 mt-0.5">{pickupLocation}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold uppercase">Destination</span>
                    <p className="font-bold text-slate-800 mt-0.5">{dropLocation || 'Karnataka'}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold uppercase">Schedule</span>
                    <p className="font-bold text-slate-800 mt-0.5">{travelDate} {travelTime}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold uppercase">Trip Type</span>
                    <p className="font-bold text-slate-800 mt-0.5">{tripType}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold uppercase">Customer Mobile</span>
                    <p className="font-bold text-slate-800 mt-0.5">+91 {mobile}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold uppercase">WhatsApp Dispatch</span>
                    <p className="font-bold text-emerald-700 mt-0.5">{CONTACT_PHONE}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleSendToWhatsApp}
                  className="w-full bg-[#25D366] hover:bg-[#1ebd5a] text-white font-black text-lg py-4 px-6 rounded-xl transition-all shadow-[0_10px_25px_rgba(37,211,102,0.35)] flex items-center justify-center gap-3 cursor-pointer"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                  </svg>
                  <span>Send Quotation Enquiry to WhatsApp ({CONTACT_PHONE})</span>
                </button>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep('form')}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl text-sm transition-colors"
                  >
                    ← Edit Details
                  </button>
                  <a
                    href={`tel:${CONTACT_PHONE_TEL}`}
                    className="flex-1 border-2 border-[#0A3D73] text-[#0A3D73] hover:bg-[#0A3D73] hover:text-white font-bold py-3 px-4 rounded-xl text-sm transition-colors text-center flex items-center justify-center gap-1.5"
                  >
                    <Phone size={16} /> Call Helpline
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
