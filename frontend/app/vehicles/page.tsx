'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Wind, Shield, Check, Phone, ArrowRight, 
  Car, Bus, MapPin, Tag, Sparkles 
} from 'lucide-react';
import { 
  FLEET_DATA, 
  VEHICLE_CATEGORIES_CONFIG, 
  VehicleCategory, 
  CONTACT_PHONE, 
  CONTACT_PHONE_TEL, 
  CONTACT_PHONE_WA 
} from '../../lib/fleetData';
import { useBookingModal } from '../../components/BookingModalContext';

export default function VehiclesPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const { openBookingModal } = useBookingModal();

  const filteredVehicles = activeCategory === 'all'
    ? FLEET_DATA
    : FLEET_DATA.filter(v => v.category === activeCategory);

  return (
    <main className="min-h-screen bg-[#F9FAFB] pt-24 pb-24">
      {/* Header Banner */}
      <div className="bg-[#0A3D73] py-16 mb-10 text-white">
        <div className="container-x">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <span className="inline-block bg-[#FF7020] text-white text-xs font-black px-3.5 py-1.5 rounded-full mb-3 uppercase tracking-wider">
              Fleet & Transparent Rates
            </span>
            <h1 className="text-4xl md:text-5xl font-black font-display mb-4">
              Our Premium Fleet
            </h1>
            <p className="text-blue-100 text-lg leading-relaxed">
              From 4-seater sedans to 50-seater pushback buses, we provide sanitized, reliable, and GPS-tracked commercial vehicles with professional route drivers.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container-x">
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2.5 mb-10 border-b border-slate-200 pb-6">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all ${
              activeCategory === 'all'
                ? 'bg-[#0A3D73] text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-[#0A3D73]'
            }`}
          >
            All Vehicles ({FLEET_DATA.length})
          </button>
          {VEHICLE_CATEGORIES_CONFIG.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all ${
                activeCategory === cat.id 
                  ? 'bg-[#FF7020] text-white shadow-md' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-[#FF7020] hover:text-[#FF7020]'
              }`}
            >
              {cat.name} ({cat.seatRange})
            </button>
          ))}
        </div>

        {/* Vehicles Grid */}
        <motion.div 
          layout
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence>
            {filteredVehicles.map((vehicle) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                key={vehicle.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-200/80 group transition-all flex flex-col"
              >
                {/* Image Container with Zoom */}
                <div className="relative h-60 overflow-hidden bg-slate-100">
                  <img 
                    src={vehicle.image} 
                    alt={vehicle.name} 
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3.5 py-1.5 rounded-xl text-xs font-black text-[#0A3D73] shadow-sm">
                    {vehicle.seatsLabel}
                  </div>
                  <div className="absolute top-4 right-4 bg-[#5CC13A] text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm flex items-center gap-1">
                    <Wind size={13} /> Pushback AC
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#FF7020] mb-1">
                    {vehicle.categoryLabel}
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-2 leading-snug">{vehicle.name}</h3>
                  <p className="text-slate-500 text-xs mb-4 line-clamp-2 leading-relaxed">{vehicle.description}</p>
                  
                  {/* Pricing Overview Box */}
                  <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 mb-5 text-xs space-y-1.5">
                    <div className="flex justify-between font-bold">
                      <span className="text-slate-500">Outstation Rate:</span>
                      <span className="text-slate-900">₹{vehicle.pricing.outstationPerKm} / km (Min 300km)</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span className="text-slate-500">Local (8h / 80km):</span>
                      <span className="text-[#0A3D73]">₹{vehicle.pricing.local8Hr80Km.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span className="text-slate-500">Airport Transfer:</span>
                      <span className="text-emerald-700">₹{vehicle.pricing.airportFlatRate.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="flex flex-col gap-2 mb-6 text-xs text-slate-600">
                    {vehicle.features.slice(0, 3).map((feat, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check size={14} className="text-[#FF7020] shrink-0" /> {feat}
                      </li>
                    ))}
                  </ul>

                  {/* Buttons */}
                  <div className="mt-auto space-y-2">
                    <button
                      type="button"
                      onClick={() => openBookingModal({ category: vehicle.category, vehicleId: vehicle.id })}
                      className="w-full bg-[#0A3D73] hover:bg-[#072d54] text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm cursor-pointer shadow-sm"
                    >
                      <span>Book Trip Now</span>
                      <ArrowRight size={16} />
                    </button>

                    <a 
                      href={`https://wa.me/${CONTACT_PHONE_WA}?text=${encodeURIComponent(`Hi, I want a quotation for ${vehicle.name} (${vehicle.seatsLabel}).`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-[#25D366] hover:bg-[#1ebd5a] text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shadow-xs"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                      </svg>
                      <span>WhatsApp Quotation</span>
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </main>
  );
}
