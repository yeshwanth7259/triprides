'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { 
  CONTACT_PHONE, 
  CONTACT_PHONE_TEL, 
  CONTACT_PHONE_WA, 
  CONTACT_EMAIL, 
  OFFICE_ADDRESS,
  FLEET_DATA 
} from '../../lib/fleetData';

export default function SupportPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'Outstation Trip (Multi-Day)',
    vehicle: '12 Seater AC Tempo Traveller',
    passengers: '12',
    date: '',
    days: '2',
    message: ''
  });

  const [status, setStatus] = useState<'idle' | 'processing' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('processing');

    setTimeout(() => {
      // 1. Prepare WhatsApp message for +91 73531 87804
      const waText = `*🚕 New Booking Enquiry - BookMyRoute*
----------------------------------------
👤 *Name:* ${form.name}
📱 *Phone:* +91 ${form.phone.replace(/\D/g, '')}
📧 *Email:* ${form.email}
🛣️ *Service:* ${form.service}
🚐 *Vehicle Needed:* ${form.vehicle}
👥 *Total Passengers:* ${form.passengers}
📅 *Travel Date:* ${form.date}
⏱️ *Duration:* ${form.days} Days
📝 *Itinerary / Notes:* ${form.message || 'Standard route'}
----------------------------------------
_Please send me the quotation and confirm vehicle availability._`;
      
      const waUrl = `https://wa.me/${CONTACT_PHONE_WA}?text=${encodeURIComponent(waText)}`;
      window.open(waUrl, '_blank');

      // Post lead to backend
      fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          service: `${form.vehicle} (${form.service})`,
          pickup: 'Bangalore',
          destination: form.message || 'Outstation Trip',
          travel_date: form.date,
          passengers: Number(form.passengers) || 4
        })
      }).catch(() => {});

      setStatus('success');
      setTimeout(() => {
        setStatus('idle');
      }, 5000);
    }, 1200);
  };

  return (
    <main className="min-h-screen bg-[#F9FAFB] pb-24">
      
      {/* 1. Hero Banner */}
      <section className="relative h-[300px] md:h-[380px] mt-[72px] overflow-hidden bg-[#0F355C]">
        <motion.div 
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="absolute inset-0 bg-cover bg-left-top md:bg-[center_top] bg-no-repeat opacity-40 mix-blend-overlay"
          style={{ backgroundImage: 'url("/banner.png")' }}
        />
        <div className="absolute inset-0 bg-[#0A3D73]/80"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#F9FAFB] to-transparent"></div>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <span className="bg-[#FF7020] text-white text-xs font-black px-3.5 py-1.5 rounded-full mb-3 uppercase tracking-wider">
            24/7 Dedicated Support
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-white font-display mb-3 drop-shadow-lg">
            Support & Trip Enquiries
          </h1>
          <p className="text-blue-100 text-base md:text-lg font-medium max-w-2xl drop-shadow-md">
            Need an instant quote or custom vehicle arrangement? Connect directly with our dispatch team.
          </p>
        </div>
      </section>

      <div className="container-x -mt-10 relative z-20">
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* 2. Contact Information Cards */}
          <div className="md:col-span-1 space-y-5">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-7">
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-[#FF7020] mb-4">
                <MapPin size={24} />
              </div>
              <h3 className="text-lg font-black text-[#0A3D73] mb-2">Office Address</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                BookMyRoute Travel Services<br/>
                {OFFICE_ADDRESS}
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-7">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-[#25D366] mb-4">
                <Phone size={24} />
              </div>
              <h3 className="text-lg font-black text-[#0A3D73] mb-2">Call & WhatsApp</h3>
              <p className="text-slate-500 text-xs mb-2">Available 24/7 for booking & instant quotes</p>
              <a href={`tel:${CONTACT_PHONE_TEL}`} className="text-xl font-black text-[#0A3D73] hover:text-[#FF7020] block transition-colors">
                {CONTACT_PHONE}
              </a>
              <a 
                href={`https://wa.me/${CONTACT_PHONE_WA}?text=Hi%2C%20I%20need%20assistance%20with%20a%20vehicle%20booking.`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition-colors"
              >
                Chat on WhatsApp →
              </a>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-7">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-[#0A3D73] mb-4">
                <Mail size={24} />
              </div>
              <h3 className="text-lg font-black text-[#0A3D73] mb-2">Email Address</h3>
              <p className="text-slate-500 text-xs mb-2">Corporate contracts & detailed itineraries</p>
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-base font-bold text-[#0A3D73] hover:underline">
                {CONTACT_EMAIL}
              </a>
            </div>
          </div>

          {/* 3. Detailed Enquiry Form */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 sm:p-10 relative overflow-hidden">
              <AnimatePresence>
                {status === 'processing' && (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-white/95 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-6 text-center"
                  >
                    <div className="w-12 h-12 border-4 border-slate-200 border-t-[#25D366] rounded-full animate-spin mb-4"></div>
                    <h3 className="text-xl font-black text-[#0A3D73]">Opening WhatsApp for {CONTACT_PHONE}...</h3>
                    <p className="text-slate-500 text-sm mt-1">Routing your enquiry directly to dispatch team.</p>
                  </motion.div>
                )}
                
                {status === 'success' && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-emerald-50/95 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-center p-8"
                  >
                    <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-white mb-4 shadow-lg shadow-emerald-500/30">
                      <CheckCircle size={36} />
                    </div>
                    <h3 className="text-2xl font-black text-emerald-800 mb-2">Enquiry Sent to WhatsApp!</h3>
                    <p className="text-emerald-700 text-sm max-w-md mx-auto">
                      Your booking request has been submitted to <strong>{CONTACT_PHONE}</strong>. Our team is reviewing vehicle availability and will respond immediately.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mb-8 border-b border-slate-100 pb-6">
                <h2 className="text-2xl sm:text-3xl font-black font-display text-[#0A3D73] mb-2">
                  Request a Custom Quotation
                </h2>
                <p className="text-slate-500 text-sm">
                  Fill in your travel plan. Your quotation request goes straight to our WhatsApp helpline (<strong>{CONTACT_PHONE}</strong>) for instant confirmation.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Full Name *</label>
                    <input 
                      required 
                      type="text" 
                      value={form.name} 
                      onChange={e => setForm({...form, name: e.target.value})} 
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:border-[#0A3D73] outline-none font-semibold text-slate-800" 
                      placeholder="e.g. Rahul Sharma" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Mobile Number (WhatsApp) *</label>
                    <input 
                      required 
                      type="tel" 
                      value={form.phone} 
                      onChange={e => setForm({...form, phone: e.target.value})} 
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:border-[#0A3D73] outline-none font-semibold text-slate-800" 
                      placeholder="+91 98765 43210" 
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Email Address (Optional)</label>
                    <input 
                      type="email" 
                      value={form.email} 
                      onChange={e => setForm({...form, email: e.target.value})} 
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:border-[#0A3D73] outline-none font-semibold text-slate-800" 
                      placeholder="name@example.com" 
                    />
                  </div>
                </div>

                <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 space-y-4">
                  <h4 className="font-bold text-[#0A3D73] text-sm flex items-center gap-1.5">
                    <MapPin size={16} className="text-[#FF7020]"/> Journey Specifics
                  </h4>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Service Type</label>
                      <select 
                        value={form.service} 
                        onChange={e => setForm({...form, service: e.target.value})} 
                        className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 font-semibold text-slate-800 bg-white text-sm"
                      >
                        <option>Outstation Trip (Multi-Day)</option>
                        <option>Local Bangalore (8hr/80km)</option>
                        <option>Airport Transfer (BLR)</option>
                        <option>Corporate Event / Outing</option>
                        <option>Wedding Guest Transport</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Preferred Vehicle</label>
                      <select 
                        value={form.vehicle} 
                        onChange={e => setForm({...form, vehicle: e.target.value})} 
                        className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 font-semibold text-slate-800 bg-white text-sm"
                      >
                        {FLEET_DATA.map((v) => (
                          <option key={v.id} value={v.name}>
                            {v.name} ({v.seatsLabel})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Passengers</label>
                      <input 
                        type="number" 
                        min="1" 
                        value={form.passengers} 
                        onChange={e => setForm({...form, passengers: e.target.value})} 
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 font-semibold text-slate-800 bg-white text-sm" 
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Travel Date</label>
                      <input 
                        required 
                        type="date" 
                        value={form.date} 
                        onChange={e => setForm({...form, date: e.target.value})} 
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 font-semibold text-slate-800 bg-white text-sm" 
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Duration (Days)</label>
                      <input 
                        required 
                        type="number" 
                        min="1" 
                        value={form.days} 
                        onChange={e => setForm({...form, days: e.target.value})} 
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 font-semibold text-slate-800 bg-white text-sm" 
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Pickup / Drop & Route Details</label>
                  <textarea 
                    value={form.message} 
                    onChange={e => setForm({...form, message: e.target.value})} 
                    className="w-full border border-slate-200 rounded-xl p-3.5 focus:border-[#0A3D73] outline-none font-semibold text-slate-800 h-24 resize-none text-sm" 
                    placeholder="e.g. Pickup from Uttharhalli, Bangalore to Coorg for 3 days with family..."
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-[#25D366] hover:bg-[#1ebd5a] text-white font-black text-base py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                  </svg>
                  <span>Submit & Send Quote to WhatsApp (+91 73531 87804)</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
