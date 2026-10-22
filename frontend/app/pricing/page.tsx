'use client';

import React, { useState } from 'react';
import type { Metadata } from 'next';
import { 
  Car, Users, Bus, Check, ArrowRight, ShieldCheck, 
  Sparkles, Phone, Calculator, Info, MapPin, Calendar, Clock 
} from 'lucide-react';
import { 
  FLEET_DATA, 
  VEHICLE_CATEGORIES_CONFIG, 
  VehicleCategory, 
  CONTACT_PHONE, 
  CONTACT_PHONE_TEL, 
  CONTACT_PHONE_WA,
  getWhatsAppBookingUrl
} from '../../lib/fleetData';
import { useBookingModal } from '../../components/BookingModalContext';

export default function PricingPage() {
  const [activeCategory, setActiveCategory] = useState<VehicleCategory>('tempo');
  const { openBookingModal } = useBookingModal();

  // Calculator state
  const [calcVehicleId, setCalcVehicleId] = useState<string>('tempo-12');
  const [calcTripType, setCalcTripType] = useState<'outstation' | 'local' | 'airport'>('outstation');
  const [calcDays, setCalcDays] = useState<number>(2);
  const [calcEstimatedKm, setCalcEstimatedKm] = useState<number>(650);

  const calcVehicle = FLEET_DATA.find(v => v.id === calcVehicleId) || FLEET_DATA[4];

  // Calculate fare
  const computeFare = () => {
    if (calcTripType === 'local') {
      return {
        base: calcVehicle.pricing.local8Hr80Km * calcDays,
        bata: 0,
        desc: `${calcDays} day(s) × ₹${calcVehicle.pricing.local8Hr80Km.toLocaleString()} (8 Hr / 80 Km per day)`
      };
    }
    if (calcTripType === 'airport') {
      return {
        base: calcVehicle.pricing.airportFlatRate,
        bata: 0,
        desc: `Kempegowda International Airport (BLR) Fixed Transfer`
      };
    }
    // Outstation
    const minKm = calcDays * calcVehicle.pricing.minKmPerDay;
    const billedKm = Math.max(calcEstimatedKm, minKm);
    const kmFare = billedKm * calcVehicle.pricing.outstationPerKm;
    const bata = calcDays * calcVehicle.pricing.driverBataPerDay;
    return {
      base: kmFare,
      bata: bata,
      total: kmFare + bata,
      desc: `${billedKm} KM × ₹${calcVehicle.pricing.outstationPerKm}/km + ₹${bata} (${calcDays} days driver allowance)`
    };
  };

  const calculated = computeFare();

  const handleCalculatorWhatsApp = () => {
    const waText = `*🚕 BookMyRoute Fare Calculation Enquiry*
----------------------------------------
🚐 *Vehicle:* ${calcVehicle.name} (${calcVehicle.seatsLabel})
🛣️ *Trip Mode:* ${calcTripType.toUpperCase()}
📅 *Duration:* ${calcDays} Day(s)
📏 *Est. Distance:* ${calcTripType === 'outstation' ? `${calcEstimatedKm} KM` : 'Standard Package'}
💰 *Estimated Total:* ₹${((calculated as any).total || calculated.base).toLocaleString()}
----------------------------------------
_Please send me the final official quotation for this journey._`;
    window.open(`https://wa.me/${CONTACT_PHONE_WA}?text=${encodeURIComponent(waText)}`, '_blank');
  };

  const filteredVehicles = FLEET_DATA.filter(v => v.category === activeCategory);

  return (
    <main className="min-h-screen bg-[#F9FAFB] pt-24 pb-28">
      {/* Header Banner */}
      <section className="bg-[#0A3D73] py-16 text-white relative overflow-hidden">
        <div className="container-x relative z-10">
          <div className="max-w-3xl">
            <span className="inline-block bg-[#FF7020] text-white text-xs font-black px-3.5 py-1.5 rounded-full mb-3 uppercase tracking-wider">
              100% Transparent Rates
            </span>
            <h1 className="text-4xl md:text-5xl font-black font-display tracking-tight mb-4">
              End-to-End Vehicle Rental Pricing
            </h1>
            <p className="text-blue-100 text-base md:text-lg leading-relaxed">
              Transparent, upfront fares for Cabs, Tempo Travellers, Mini Buses, and Buses across Bangalore and Karnataka. No hidden surcharges, no surprise fees.
            </p>
          </div>
        </div>
      </section>

      <div className="container-x -mt-8 relative z-20">
        
        {/* Category Tabs */}
        <div className="bg-white rounded-2xl p-2 shadow-lg border border-slate-100 flex overflow-x-auto hide-scrollbar gap-2 mb-10">
          {VEHICLE_CATEGORIES_CONFIG.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex-1 min-w-[140px] sm:min-w-[180px] py-4 px-5 rounded-xl font-black text-sm transition-all flex flex-col items-center gap-1 ${
                activeCategory === cat.id
                  ? 'bg-[#0A3D73] text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2">
                {cat.id === 'cab' && <Car size={18} />}
                {cat.id === 'tempo' && <Users size={18} />}
                {cat.id === 'minibus' && <Bus size={18} />}
                {cat.id === 'bus' && <Bus size={18} />}
                <span>{cat.name}</span>
              </div>
              <span className={`text-[11px] font-medium ${activeCategory === cat.id ? 'text-blue-200' : 'text-slate-400'}`}>
                {cat.seatRange}
              </span>
            </button>
          ))}
        </div>

        {/* Pricing Cards Grid for Selected Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredVehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col group"
            >
              <div className="relative h-48 overflow-hidden bg-slate-100">
                <img
                  src={vehicle.image}
                  alt={vehicle.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-black text-[#0A3D73] shadow-xs">
                  {vehicle.seatsLabel}
                </div>
                <div className="absolute top-3 right-3 bg-emerald-600 text-white px-2.5 py-1 rounded-lg text-xs font-bold shadow-xs">
                  Pushback AC
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-black text-slate-900 mb-2">{vehicle.name}</h3>
                <p className="text-slate-500 text-xs line-clamp-2 mb-4 leading-relaxed">{vehicle.description}</p>

                {/* Pricing Matrix */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 mb-6 space-y-3">
                  <div className="flex justify-between items-center text-sm border-b border-slate-200/60 pb-2">
                    <span className="text-slate-500 font-medium">Outstation Rate:</span>
                    <span className="font-black text-slate-900 text-base">₹{vehicle.pricing.outstationPerKm} / km</span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-b border-slate-200/60 pb-2">
                    <span className="text-slate-500 font-medium">Min. KM / Day:</span>
                    <span className="font-bold text-slate-700">{vehicle.pricing.minKmPerDay} KM</span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-b border-slate-200/60 pb-2">
                    <span className="text-slate-500 font-medium">Driver Bata (Daily):</span>
                    <span className="font-bold text-slate-700">₹{vehicle.pricing.driverBataPerDay}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-b border-slate-200/60 pb-2">
                    <span className="text-slate-500 font-medium">Local (8 Hr / 80 Km):</span>
                    <span className="font-black text-[#0A3D73]">₹{vehicle.pricing.local8Hr80Km.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 font-medium">BLR Airport Drop:</span>
                    <span className="font-black text-[#FF7020]">₹{vehicle.pricing.airportFlatRate.toLocaleString()}</span>
                  </div>
                </div>

                {/* Features List */}
                <ul className="space-y-1.5 mb-6 text-xs text-slate-600">
                  {vehicle.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 font-medium">
                      <Check size={14} className="text-[#FF7020] shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                {/* Action Buttons */}
                <div className="mt-auto pt-2 flex flex-col sm:flex-row gap-2.5">
                  <button
                    type="button"
                    onClick={() => openBookingModal({ category: vehicle.category, vehicleId: vehicle.id })}
                    className="flex-1 bg-[#0A3D73] hover:bg-[#072d54] text-white font-bold py-3 px-4 rounded-xl text-sm transition-colors text-center"
                  >
                    Book Now
                  </button>
                  <a
                    href={`https://wa.me/${CONTACT_PHONE_WA}?text=${encodeURIComponent(`Hi, I would like to book or get a quotation for ${vehicle.name} (${vehicle.seatsLabel}).`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-[#25D366] hover:bg-[#1ebd5a] text-white font-bold py-3 px-4 rounded-xl text-sm transition-colors text-center flex items-center justify-center gap-1.5"
                  >
                    WhatsApp Quote
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Instant Fare Calculator */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-100 mb-16">
          <div className="max-w-3xl mb-8">
            <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#FF7020] mb-2">
              <Calculator size={16} /> Instant Fare Calculator
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0A3D73] font-display">
              Calculate Your Estimated Fare
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Select your preferred ride and route type to see estimated vehicle hire and driver charges instantly.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Inputs */}
            <div className="lg:col-span-2 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase mb-2">
                    Choose Vehicle
                  </label>
                  <select
                    value={calcVehicleId}
                    onChange={(e) => setCalcVehicleId(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white font-bold text-slate-800 text-sm focus:border-[#0A3D73] outline-none"
                  >
                    {FLEET_DATA.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name} ({v.seatsLabel})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase mb-2">
                    Trip Type
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'outstation', label: 'Outstation' },
                      { id: 'local', label: 'Local (8h)' },
                      { id: 'airport', label: 'Airport' }
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setCalcTripType(t.id as any)}
                        className={`h-12 rounded-xl text-xs font-bold transition-all ${
                          calcTripType === t.id
                            ? 'bg-[#0A3D73] text-white shadow-sm'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {calcTripType === 'outstation' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase mb-2">
                      Total Days: <span className="text-[#FF7020] font-black">{calcDays} Days</span>
                    </label>
                    <input
                      type="range"
                      min={1}
                      max={14}
                      value={calcDays}
                      onChange={(e) => setCalcDays(Number(e.target.value))}
                      className="w-full accent-[#0A3D73]"
                    />
                    <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                      <span>1 Day</span>
                      <span>Min {calcDays * calcVehicle.pricing.minKmPerDay} KM included</span>
                      <span>14 Days</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase mb-2">
                      Estimated Distance: <span className="text-[#FF7020] font-black">{calcEstimatedKm} KM</span>
                    </label>
                    <input
                      type="number"
                      min={calcDays * calcVehicle.pricing.minKmPerDay}
                      step={50}
                      value={calcEstimatedKm}
                      onChange={(e) => setCalcEstimatedKm(Number(e.target.value))}
                      className="w-full h-11 px-4 rounded-xl border border-slate-200 font-bold text-slate-800 text-sm focus:border-[#0A3D73] outline-none"
                    />
                  </div>
                </div>
              )}

              {calcTripType === 'local' && (
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase mb-2">
                    Number of Days: <span className="text-[#FF7020] font-black">{calcDays} Day(s)</span>
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={7}
                    value={calcDays}
                    onChange={(e) => setCalcDays(Number(e.target.value))}
                    className="w-full accent-[#0A3D73]"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                    <span>1 Day (8h/80km)</span>
                    <span>7 Days</span>
                  </div>
                </div>
              )}
            </div>

            {/* Fare Summary Card */}
            <div className="bg-gradient-to-br from-[#0F355C] to-[#0A3D73] text-white rounded-2xl p-6 sm:p-7 shadow-xl">
              <span className="text-xs font-bold text-blue-200 uppercase tracking-wider">Estimated Fare</span>
              <div className="text-3xl sm:text-4xl font-black text-[#FF7020] mt-1 mb-2">
                ₹{((calculated as any).total || calculated.base).toLocaleString()}
              </div>
              <p className="text-xs text-blue-100/90 leading-relaxed mb-4">
                {calculated.desc}
              </p>

              <div className="border-t border-white/10 pt-4 space-y-2 text-xs text-blue-100">
                <div className="flex justify-between">
                  <span>Vehicle:</span>
                  <span className="font-bold text-white">{calcVehicle.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Capacity:</span>
                  <span className="font-bold text-white">{calcVehicle.seatsLabel}</span>
                </div>
                <div className="flex justify-between">
                  <span>Support:</span>
                  <span className="font-bold text-emerald-400">{CONTACT_PHONE}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCalculatorWhatsApp}
                className="w-full mt-6 bg-[#25D366] hover:bg-[#1ebd5a] text-white font-black py-3.5 px-4 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Book This on WhatsApp</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </section>

        {/* Terms & Transparency Notes */}
        <div className="bg-slate-100/80 rounded-2xl p-6 sm:p-8 border border-slate-200/80 space-y-4">
          <h3 className="text-lg font-black text-[#0A3D73] flex items-center gap-2">
            <Info size={20} className="text-[#FF7020]" />
            Rental Policies & Calculation Guidelines
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-600">
            <div>
              <p className="font-bold text-slate-800 mb-1">✓ What is included in your base quote:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Vehicle hire for full agreed duration</li>
                <li>Experienced, background-verified commercial route driver</li>
                <li>Chilled AC throughout the journey (on moving roads)</li>
                <li>24/7 round-the-clock trip coordination & emergency replacement support</li>
              </ul>
            </div>
            <div>
              <p className="font-bold text-slate-800 mb-1">✓ What is billed at actuals:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Highway Toll Plaza fees (billed transparently via Fastag statement)</li>
                <li>State entry permit taxes when entering Kerala, Tamil Nadu, Andhra, Goa</li>
                <li>Parking entry fees at monuments, airports, or hotels</li>
                <li>Strictly seating & pushback buses only — No sleeper or luxury multi-axle buses</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
