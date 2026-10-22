'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  MapPin, Users, Plane, Car, Bus, Map, Clock, CheckCircle, 
  FileText, Send, Download, Mail, Calendar, Ticket, Phone, ArrowRight, ShieldCheck 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CONTACT_PHONE, 
  CONTACT_PHONE_TEL, 
  CONTACT_PHONE_WA, 
  FLEET_DATA, 
  VEHICLE_CATEGORIES_CONFIG 
} from '../lib/fleetData';
import { useBookingModal } from '../components/BookingModalContext';

export default function Home() {
  const { openBookingModal } = useBookingModal();
  const [activeTab, setActiveTab] = useState('tempo');
  const [form, setForm] = useState({ 
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

  const getEstimatedPrice = () => {
    const selected = form.vehicleInfo || vehicleOptions[activeTab]?.[0] || '';
    if (selected.includes('Sedan')) return '₹13/km (Local: ₹1,800)';
    if (selected.includes('Ertiga')) return '₹17/km (Local: ₹2,400)';
    if (selected.includes('Innova')) return '₹22/km (Local: ₹3,200)';
    if (selected.includes('9/10')) return '₹24/km (Local: ₹4,000)';
    if (selected.includes('12 Seater')) return '₹22/km (Local: ₹3,800)';
    if (selected.includes('14 Seater')) return '₹24/km (Local: ₹4,200)';
    if (selected.includes('17 Seater')) return '₹26/km (Local: ₹4,600)';
    if (selected.includes('20 Seater')) return '₹28/km (Local: ₹5,000)';
    if (selected.includes('21 Seater')) return '₹32/km (Local: ₹6,500)';
    if (selected.includes('25 Seater')) return '₹36/km (Local: ₹7,500)';
    if (selected.includes('32 Seater')) return '₹42/km (Local: ₹9,000)';
    if (selected.includes('40 Seater')) return '₹48/km (Local: ₹10,500)';
    if (selected.includes('50 Seater')) return '₹54/km (Local: ₹12,000)';
    return '₹22 - ₹28 / km';
  };

  function handleDirectWhatsAppQuote(e: React.FormEvent) {
    e.preventDefault();
    sendToWhatsApp();
  }

  function sendToWhatsApp() {
    const selectedVehicle = form.vehicleInfo || vehicleOptions[activeTab]?.[0] || 'Tempo Traveller';
    const selectedCategory = tabs.find(t => t.id === activeTab)?.label || 'Tempo Traveller';
    const pickupLoc = form.pickup || 'Bengaluru';
    const dropLoc = form.destination || 'Karnataka';
    const travelDate = form.date || new Date().toISOString().split('T')[0];
    const travelTime = form.time || '06:00';
    const pax = form.passengers || 'Standard';

    const details = `*🚕 BookMyRoute Official Trip Quotation Request*
----------------------------------------
*Category:* ${selectedCategory}
*Vehicle Selected:* ${selectedVehicle}
*Passengers:* ${pax}
*Pickup:* ${pickupLoc}
*Destination / Drop:* ${dropLoc}
*Travel Date:* ${travelDate} at ${travelTime}
*Estimated Pricing:* ${getEstimatedPrice()}
----------------------------------------
_Please send me the formal quotation and confirm vehicle availability._`;

    // Save lead in backend
    fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Website Direct WhatsApp Inquiry',
        phone: CONTACT_PHONE,
        service: `${selectedVehicle}`,
        pickup: pickupLoc,
        destination: dropLoc,
        travel_date: travelDate,
        passengers: Number(pax) || 4
      })
    }).catch(() => {});

    window.open(`https://wa.me/${CONTACT_PHONE_WA}?text=${encodeURIComponent(details)}`, '_blank');
  }

  return (
    <main className="min-h-screen bg-[#F9FAFB] overflow-hidden pb-16">
      {/* 1. End-to-End Hero Banner Graphic (Clean Image, No Overlay Text) */}
      <section className="relative w-full mt-[72px] bg-[#0A3D73] overflow-hidden">
        <h1 className="sr-only">BookMyRoute | Cab, Tempo Traveller, Mini Bus & Bus Rental in Bangalore</h1>
        <div className="w-full">
          <img 
            src="/banner.png" 
            alt="BookMyRoute Fleet Banner - Cabs, Tempo Travellers, Mini Buses and Coaches" 
            className="w-full h-auto block object-cover md:object-contain max-h-[580px] mx-auto"
          />
        </div>
      </section>

      {/* 2. Tejas Travels Search & Booking Card */}
      <div className="container-x relative -mt-4 sm:-mt-8 md:-mt-12 z-20 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.12)] overflow-hidden border border-slate-100"
        >
          {/* Form Header */}
          <div className="bg-slate-50 border-b border-slate-200 p-6 md:px-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-[#0A3D73] font-display">
                Where would you like to travel?
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm font-medium mt-0.5">
                Instant quotes sent straight to WhatsApp ({CONTACT_PHONE})
              </p>
            </div>
            <button
              type="button"
              onClick={() => openBookingModal({ category: activeTab as any })}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-black text-[#0A3D73] bg-blue-50 hover:bg-blue-100 px-3.5 py-2 rounded-lg transition-colors cursor-pointer"
            >
              <Ticket size={14} /> Open Full Booking Modal →
            </button>
          </div>

          {/* Tabs */}
          <div className="flex overflow-x-auto border-b border-slate-200 hide-scrollbar bg-white">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => { 
                  setActiveTab(tab.id); 
                  setForm({ ...form, vehicleInfo: vehicleOptions[tab.id]?.[0] || '' }); 
                }}
                className={`flex items-center gap-2 whitespace-nowrap px-6 sm:px-8 py-4 font-bold text-xs sm:text-sm transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#0A3D73] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleDirectWhatsAppQuote} className="p-6 sm:p-10">
            <div className="grid md:grid-cols-2 gap-5 mb-5">
              <div className="relative">
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">Pickup Location</label>
                <div className="relative border rounded-xl border-slate-200 flex items-center hover:border-slate-400 focus-within:border-[#0A3D73] transition-colors">
                  <MapPin className="ml-4 text-[#FF7020]" size={18} />
                  <input
                    required
                    list="locations"
                    placeholder="e.g. Uttharhalli / Bangalore Airport"
                    className="w-full bg-transparent px-4 py-3.5 outline-none text-slate-800 font-semibold text-[15px]"
                    value={form.pickup}
                    onChange={e => setForm({ ...form, pickup: e.target.value })}
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">Drop Location / Destination</label>
                <div className="relative border rounded-xl border-slate-200 flex items-center hover:border-slate-400 focus-within:border-[#0A3D73] transition-colors">
                  <MapPin className="ml-4 text-[#0A3D73]" size={18} />
                  <input
                    required
                    list="locations"
                    placeholder="e.g. Mysore / Coorg / Ooty"
                    className="w-full bg-transparent px-4 py-3.5 outline-none text-slate-800 font-semibold text-[15px]"
                    value={form.destination}
                    onChange={e => setForm({ ...form, destination: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <datalist id="locations">
              {karnatakaLocations.map(loc => <option key={loc} value={loc} />)}
            </datalist>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 items-end">
              <div className="relative">
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">Travel Date</label>
                <div className="relative border rounded-xl border-slate-200 flex items-center focus-within:border-[#0A3D73] transition-colors">
                  <input
                    type="date"
                    required
                    className="w-full bg-transparent px-3.5 py-3 outline-none text-slate-800 font-semibold text-sm"
                    value={form.date}
                    onChange={e => setForm({ ...form, date: e.target.value })}
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">Time</label>
                <div className="relative border rounded-xl border-slate-200 flex items-center focus-within:border-[#0A3D73] transition-colors">
                  <input
                    type="time"
                    required
                    className="w-full bg-transparent px-3.5 py-3 outline-none text-slate-800 font-semibold text-sm"
                    value={form.time}
                    onChange={e => setForm({ ...form, time: e.target.value })}
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">Passengers</label>
                <div className="relative border rounded-xl border-slate-200 flex items-center focus-within:border-[#0A3D73] transition-colors">
                  <input
                    type="number"
                    min="1"
                    placeholder="Count"
                    required
                    className="w-full bg-transparent px-3.5 py-3 outline-none text-slate-800 font-semibold text-sm"
                    value={form.passengers}
                    onChange={e => setForm({ ...form, passengers: e.target.value })}
                  />
                </div>
              </div>

              <div className="relative col-span-2 md:col-span-1">
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">Vehicle Model</label>
                <div className="relative border rounded-xl border-slate-200 flex items-center focus-within:border-[#0A3D73] transition-colors">
                  <select
                    className="w-full bg-transparent px-3 py-3 outline-none text-slate-800 font-semibold text-xs appearance-none cursor-pointer"
                    value={form.vehicleInfo}
                    onChange={e => setForm({ ...form, vehicleInfo: e.target.value })}
                  >
                    {vehicleOptions[activeTab]?.map((opt: string) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 pointer-events-none text-slate-400">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6" /></svg>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="bg-[#25D366] hover:bg-[#1EBE5D] text-white font-black py-3.5 px-4 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 col-span-2 md:col-span-1 h-[48px] cursor-pointer"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                </svg>
                <span>Get WhatsApp Quote</span>
              </button>
            </div>
          </form>
        </motion.div>
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
                  "100% Transparent Billing & GST",
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
