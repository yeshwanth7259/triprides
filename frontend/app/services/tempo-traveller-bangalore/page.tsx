'use client';

import React from 'react';
import Link from 'next/link';
import { 
  MapPin, Users, Calendar, Phone, CheckCircle, Shield, 
  Clock, Banknote, Wind, Music, Map, Search, CarFront, ArrowRight 
} from 'lucide-react';
import { 
  CONTACT_PHONE, 
  CONTACT_PHONE_TEL, 
  CONTACT_PHONE_WA, 
  FLEET_DATA 
} from '../../../lib/fleetData';
import { useBookingModal } from '../../../components/BookingModalContext';

export default function TempoTravellerBangalore() {
  const { openBookingModal } = useBookingModal();
  const tempoVehicles = FLEET_DATA.filter(v => v.category === 'tempo');

  return (
    <main className="min-h-screen bg-[#F9FAFB] pt-[104px] pb-24">
      
      {/* Hero Section */}
      <section className="bg-[#0A3D73] py-12 md:py-20 px-4 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-left-top md:bg-[center_top] bg-no-repeat opacity-30 mix-blend-overlay"
          style={{ backgroundImage: 'url("/banner.png")' }}
        />
        <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '24px 24px'}}></div>
        
        <div className="container-x relative z-10 flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1 text-white">
            <span className="bg-[#FF7020] text-white text-xs font-black px-3.5 py-1.5 rounded-full mb-3 inline-block uppercase tracking-wider">
              Top Rated in Karnataka
            </span>
            <h1 className="text-4xl md:text-5xl font-black font-display leading-tight mb-4 drop-shadow-lg">
              Tempo Traveller on Rent in Bangalore
            </h1>
            <p className="text-blue-100 text-lg mb-8 max-w-xl leading-relaxed drop-shadow-md font-medium">
              Hire luxury 9 to 20-seater Tempo Travellers for outstation tours, family vacations, temple visits, and airport transfers. Best rates guaranteed with verified route drivers.
            </p>
            <ul className="flex flex-col gap-3">
              <li className="flex items-center gap-3 font-bold text-white drop-shadow-md">
                <CheckCircle size={18} className="text-[#FF7020]" /> 9, 12, 14, 17 & 20 Seater Pushback Coaches
              </li>
              <li className="flex items-center gap-3 font-bold text-white drop-shadow-md">
                <CheckCircle size={18} className="text-[#FF7020]" /> Chilled AC & Ambient LED Cabin Lighting
              </li>
              <li className="flex items-center gap-3 font-bold text-white drop-shadow-md">
                <CheckCircle size={18} className="text-[#FF7020]" /> Verified Drivers with Ghat-Road & Night Expertise
              </li>
            </ul>
          </div>
          
          {/* Hero Form */}
          <div className="w-full md:w-[420px] bg-white rounded-3xl p-7 shadow-2xl border-t-8 border-[#FF7020]">
            <h3 className="text-xl font-black text-slate-800 mb-2 text-center">Get Instant WhatsApp Quote</h3>
            <p className="text-xs text-slate-500 text-center mb-6">Dispatch Helpline: <strong>{CONTACT_PHONE}</strong></p>
            
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => openBookingModal({ category: 'tempo' })}
                className="w-full bg-[#0A3D73] hover:bg-[#072d54] text-white font-black py-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Book Tempo Traveller Online</span>
                <ArrowRight size={18} />
              </button>

              <a 
                href={`https://wa.me/${CONTACT_PHONE_WA}?text=Hi,%20I%20am%20looking%20for%20a%20Tempo%20Traveller%20on%20rent%20in%20Bangalore.`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#1ebd5a] text-white font-black py-4 rounded-xl transition-transform hover:scale-102 flex items-center justify-center gap-2 shadow-[0_5px_20px_rgba(37,211,102,0.3)]"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                </svg>
                <span>WhatsApp Quotation</span>
              </a>

              <a 
                href={`tel:${CONTACT_PHONE_TEL}`}
                className="w-full border-2 border-[#0A3D73] text-[#0A3D73] hover:bg-[#0A3D73] hover:text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm text-center"
              >
                <Phone size={16} /> Call {CONTACT_PHONE}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Fleet Section */}
      <section className="py-16 container-x">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black font-display text-[#0A3D73] mb-4">Our Tempo Traveller Fleet in Bangalore</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">Choose from our wide range of well-maintained, comfortable, and sanitized tempo travellers.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {tempoVehicles.map((vehicle) => (
            <div key={vehicle.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col group">
              <div className="h-52 overflow-hidden relative bg-slate-100">
                <img 
                  src={vehicle.image} 
                  alt={vehicle.name} 
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500" 
                />
                <div className="absolute top-3 left-3 bg-white/95 px-3 py-1 rounded-lg text-xs font-black text-[#0A3D73]">
                  {vehicle.seatsLabel}
                </div>
                <div className="absolute top-3 right-3 bg-emerald-600 text-white px-2.5 py-1 rounded-lg text-xs font-bold">
                  Pushback AC
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-slate-800 mb-2">{vehicle.name}</h3>
                <p className="text-slate-500 text-xs mb-4 line-clamp-2">{vehicle.description}</p>
                
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mb-6 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-1.5"><Users size={14} className="text-[#FF7020]"/> {vehicle.seats} Seats</div>
                  <div className="flex items-center gap-1.5"><Wind size={14} className="text-[#FF7020]"/> Chilled AC</div>
                  <div className="flex items-center gap-1.5"><Music size={14} className="text-[#FF7020]"/> Music/LED</div>
                  <div className="flex items-center gap-1.5"><Shield size={14} className="text-[#FF7020]"/> GPS Tracked</div>
                </div>
                
                <div className="flex items-end justify-between mt-auto pt-4 border-t border-slate-100">
                  <div>
                    <span className="text-[11px] text-slate-400 font-bold uppercase">Outstation Rate</span>
                    <div className="text-xl font-black text-[#0A3D73]">₹{vehicle.pricing.outstationPerKm} / km</div>
                    <span className="text-[10px] text-slate-400">+ ₹{vehicle.pricing.driverBataPerDay} Bata</span>
                  </div>
                  <button 
                    onClick={() => openBookingModal({ category: 'tempo', vehicleId: vehicle.id })}
                    className="bg-[#0A3D73] hover:bg-[#072d54] text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors cursor-pointer"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing / Packages */}
      <section className="bg-white py-16 border-y border-slate-200">
        <div className="container-x">
          <h2 className="text-3xl font-black font-display text-[#0A3D73] mb-8 text-center">Tempo Traveller Fare in Bangalore</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <thead className="bg-[#0A3D73] text-white text-left">
                <tr>
                  <th className="p-4 font-bold border-r border-[#082f59]">Vehicle Model</th>
                  <th className="p-4 font-bold border-r border-[#082f59]">Outstation (Per KM)</th>
                  <th className="p-4 font-bold border-r border-[#082f59]">Local (8 Hr / 80 Km)</th>
                  <th className="p-4 font-bold border-r border-[#082f59]">Airport Drop (BLR)</th>
                  <th className="p-4 font-bold">Driver Bata / Day</th>
                </tr>
              </thead>
              <tbody className="bg-white text-sm">
                {tempoVehicles.map((tv, idx) => (
                  <tr key={tv.id} className={`${idx % 2 === 1 ? 'bg-slate-50' : ''} hover:bg-blue-50/50`}>
                    <td className="p-4 font-bold text-slate-800 border-r border-slate-100">{tv.name}</td>
                    <td className="p-4 font-black text-slate-900 border-r border-slate-100">₹{tv.pricing.outstationPerKm} / km</td>
                    <td className="p-4 text-slate-700 font-bold border-r border-slate-100">₹{tv.pricing.local8Hr80Km.toLocaleString()}</td>
                    <td className="p-4 text-emerald-700 font-bold border-r border-slate-100">₹{tv.pricing.airportFlatRate.toLocaleString()}</td>
                    <td className="p-4 text-slate-600 font-semibold">₹{tv.pricing.driverBataPerDay}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-500 mt-4 text-center">
            * Note: Tolls, parking, and interstate permit taxes are charged at actuals. Minimum 300 KMs per day for outstation journeys.
          </p>
        </div>
      </section>

      {/* Quick Booking CTA */}
      <section className="py-16 bg-[#0A3D73] text-white text-center mt-12">
        <div className="container-x">
          <h2 className="text-3xl font-black mb-4">Ready to Book a Tempo Traveller?</h2>
          <p className="text-blue-200 mb-8 max-w-xl mx-auto">
            Book online or chat with our reservations team on WhatsApp for guaranteed lowest rates and verified drivers.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => openBookingModal({ category: 'tempo' })}
              className="bg-[#FF7020] hover:bg-[#e55c0c] text-white font-black px-8 py-4 rounded-xl shadow-lg transition-transform hover:scale-105 cursor-pointer"
            >
              Book Your Trip Online
            </button>
            <a 
              href={`https://wa.me/${CONTACT_PHONE_WA}?text=Hi,%20I%20am%20looking%20for%20a%20Tempo%20Traveller%20on%20rent%20in%20Bangalore.`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white font-black px-8 py-4 rounded-xl shadow-lg hover:scale-105 transition-transform"
            >
              WhatsApp: {CONTACT_PHONE}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
