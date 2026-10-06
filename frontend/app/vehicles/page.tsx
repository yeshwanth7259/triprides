'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Wind, Shield, Check, Phone } from 'lucide-react';

const vehicles = [
  {
    id: 1,
    name: "12 Seater Tempo Traveller",
    category: "tempo",
    seats: "12+1",
    ac: true,
    image: "/vehicles/TEMPO-TRAVELLER-1.webp",
    features: ["Pushback Seats", "LED TV & Music", "Ample Luggage Space"]
  },
  {
    id: 2,
    name: "14 Seater Premium Tempo",
    category: "tempo",
    seats: "14+1",
    ac: true,
    image: "/vehicles/Traveller-3050WB-9D-12D-13D_mob.webp",
    features: ["Reclining Seats", "Reading Lights", "Charging Points"]
  },
  {
    id: 3,
    name: "21 Seater Mini Bus",
    category: "bus",
    seats: "21",
    ac: true,
    image: "/vehicles/21seater-bus.webp",
    features: ["Wide Aisle", "Air Suspension", "Curtains"]
  },
  {
    id: 4,
    name: "35 Seater Luxury Bus",
    category: "bus",
    seats: "35",
    ac: true,
    image: "/vehicles/bus3a.jpg",
    features: ["2x2 Pushback", "Full AC", "Video Coach"]
  },
  {
    id: 5,
    name: "50 Seater Bus (Non-AC)",
    category: "bus",
    seats: "50",
    ac: false,
    image: "/vehicles/50-seater-bus1.jpg",
    features: ["Budget Friendly", "Large Windows", "Spacious Seating"]
  },
  {
    id: 6,
    name: "Toyota Innova Crysta",
    category: "suv",
    seats: "6/7",
    ac: true,
    image: "/vehicles/Toyota innova.webp",
    features: ["Premium Comfort", "Silent Cabin", "Extra Legroom"]
  },
  {
    id: 7,
    name: "Sedan (Dzire/Etios)",
    category: "car",
    seats: "4",
    ac: true,
    image: "/vehicles/New-Maruti-Suzuki-Dzire-1-jpg.webp",
    features: ["City Rides", "Airport Transfers", "Comfortable"]
  }
];

const categories = [
  { id: 'all', label: 'All Vehicles' },
  { id: 'tempo', label: 'Tempo Travellers' },
  { id: 'bus', label: 'Buses & Mini Buses' },
  { id: 'suv', label: 'SUVs (Innova)' },
  { id: 'car', label: 'Cars (Sedan)' }
];

export default function VehiclesPage() {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredVehicles = activeCategory === 'all' 
    ? vehicles 
    : vehicles.filter(v => v.category === activeCategory || (activeCategory === 'bus' && v.category === 'bus'));

  return (
    <main className="min-h-screen bg-[#F9FAFB] pt-24 pb-20">
      
      {/* Header Section */}
      <div className="bg-[#0A3D73] py-16 mb-12">
        <div className="container-x">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-5xl font-black text-white font-display mb-4">Our Premium Fleet</h1>
            <p className="text-blue-100 text-lg">
              Explore our wide range of meticulously maintained vehicles. From 4-seater sedans to 50-seater buses, we have the perfect ride for every journey.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container-x">
        {/* Category Filters */}
        <div className="flex flex-wrap gap-3 mb-12 border-b border-slate-200 pb-6">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all ${
                activeCategory === cat.id 
                  ? 'bg-[#FF7020] text-white shadow-md' 
                  : 'bg-white text-slate-500 border border-slate-200 hover:border-[#FF7020] hover:text-[#FF7020]'
              }`}
            >
              {cat.label}
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
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={vehicle.id}
                className="bg-white rounded-2xl overflow-hidden shadow-[0_5px_15px_rgba(0,0,0,0.05)] border border-slate-100 group hover:shadow-xl transition-shadow"
              >
                {/* Image Container with Hover Zoom */}
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={vehicle.image} 
                    alt={vehicle.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg text-xs font-bold text-[#0A3D73] shadow-sm">
                    {vehicle.seats} Seats
                  </div>
                  {vehicle.ac ? (
                    <div className="absolute top-4 right-4 bg-[#5CC13A] text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm flex items-center gap-1">
                      <Wind size={12} /> AC
                    </div>
                  ) : (
                    <div className="absolute top-4 right-4 bg-slate-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm">
                      Non-AC
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-black text-slate-800 mb-4">{vehicle.name}</h3>
                  
                  <ul className="flex flex-col gap-2 mb-6">
                    {vehicle.features.map((feat, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                        <Check size={14} className="text-[#FF7020]" /> {feat}
                      </li>
                    ))}
                  </ul>

                  <a href="tel:+917259335286" className="w-full bg-[#0F355C] hover:bg-[#0A3D73] text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2">
                    <Phone size={16} /> Request Quote
                  </a>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredVehicles.length === 0 && (
          <div className="text-center py-20">
            <h3 className="text-xl font-bold text-slate-400">No vehicles found in this category.</h3>
          </div>
        )}
      </div>
    </main>
  );
}
