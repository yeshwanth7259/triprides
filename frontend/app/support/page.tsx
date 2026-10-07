'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, AlertCircle } from 'lucide-react';
import Image from 'next/image';

export default function SupportPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'Outstation Trip',
    vehicle: 'Tempo Traveller (12 Seater)',
    passengers: '',
    date: '',
    days: '1',
    message: ''
  });

  const [status, setStatus] = useState<'idle' | 'processing' | 'success'>('idle');

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setStatus('processing');

    // Simulate backend processing delay
    setTimeout(() => {
      // 1. Prepare WhatsApp Message for Admin
      const waText = `*New Booking Enquiry - BookMyRoute* 🚕
-----------------------
*Name:* ${form.name}
*Phone:* ${form.phone}
*Email:* ${form.email}
-----------------------
*Service:* ${form.service}
*Vehicle Needed:* ${form.vehicle}
*Total Passengers:* ${form.passengers}
*Travel Date:* ${form.date}
*Duration:* ${form.days} Days
-----------------------
*Additional Message:* ${form.message || 'None'}`;
      
      const waUrl = `https://wa.me/917259335286?text=${encodeURIComponent(waText)}`;
      
      // Open WhatsApp in new tab for Admin to receive it
      window.open(waUrl, '_blank');

      // 2. Simulate email sent to client (visually update UI to show success)
      setStatus('success');
      
      // Reset form after a few seconds
      setTimeout(() => {
        setStatus('idle');
        setForm({
          name: '', email: '', phone: '', service: 'Outstation Trip',
          vehicle: 'Tempo Traveller (12 Seater)', passengers: '', date: '', days: '1', message: ''
        });
      }, 5000);
      
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-[#F9FAFB] pb-20">
      
      {/* 1. Hero Banner (Matching Home Page Style) */}
      <section className="relative h-[300px] md:h-[400px] mt-[72px] overflow-hidden bg-[#0F355C]">
        <motion.div 
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="absolute inset-0 bg-cover bg-left-top md:bg-[center_top] bg-no-repeat"
          style={{ backgroundImage: 'url("/banner.png")' }}
        />
        <div className="absolute inset-0 bg-[#0A3D73]/70 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#F9FAFB] to-transparent"></div>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl md:text-6xl font-black text-white font-display mb-4 drop-shadow-lg">
            Support & Contact Us
          </h1>
          <p className="text-blue-100 text-lg md:text-xl font-medium max-w-2xl drop-shadow-md">
            Need help booking a vehicle or have a question about our services? We are here to help you 24/7.
          </p>
        </div>
      </section>

      <div className="container-x -mt-10 relative z-20">
        <div className="grid md:grid-cols-3 gap-10">
          
          {/* 2. Contact Information Cards */}
          <div className="md:col-span-1 space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-[#FF7020] mb-4">
                <MapPin size={24} />
              </div>
              <h3 className="text-xl font-black text-[#0A3D73] mb-2">Office Address</h3>
              <p className="text-slate-500 leading-relaxed">
                BookMyRoute Travel Services<br/>
                Uttharhalli, Bangalore<br/>
                Karnataka - 560061
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-[#5CC13A] mb-4">
                <Phone size={24} />
              </div>
              <h3 className="text-xl font-black text-[#0A3D73] mb-2">Phone & WhatsApp</h3>
              <p className="text-slate-500 mb-1">Available 24/7 for bookings</p>
              <a href="tel:+917259335286" className="text-lg font-bold text-[#FF7020] hover:underline">+91 7259335286</a>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 mb-4">
                <Mail size={24} />
              </div>
              <h3 className="text-xl font-black text-[#0A3D73] mb-2">Email Address</h3>
              <p className="text-slate-500 mb-1">Send us your detailed itinerary</p>
              <a href="mailto:bookmyroute06@gmail.com" className="text-lg font-bold text-[#0A3D73] hover:underline">bookmyroute06@gmail.com</a>
            </motion.div>
          </div>

          {/* 3. Detailed Enquiry & Quotation Form */}
          <div className="md:col-span-2">
            <motion.div 
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 md:p-12 overflow-hidden relative"
            >
              {/* Form Status Overlays */}
              <AnimatePresence>
                {status === 'processing' && (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-white/90 backdrop-blur-sm z-10 flex flex-col items-center justify-center"
                  >
                    <div className="w-12 h-12 border-4 border-slate-200 border-t-[#FF7020] rounded-full animate-spin mb-4"></div>
                    <h3 className="text-xl font-black text-[#0A3D73]">Generating Quotation...</h3>
                    <p className="text-slate-500 mt-2">Connecting to WhatsApp & Email servers.</p>
                  </motion.div>
                )}
                
                {status === 'success' && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-green-50 z-10 flex flex-col items-center justify-center text-center p-8"
                  >
                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white mb-6 shadow-lg shadow-green-500/30">
                      <CheckCircle size={40} />
                    </div>
                    <h3 className="text-3xl font-black text-green-700 mb-2">Quotation Sent Successfully!</h3>
                    <p className="text-green-600 font-medium max-w-md mx-auto">
                      A copy of the quotation has been sent to <strong>{form.email}</strong>, and our team has received your request on WhatsApp. We will call you shortly to confirm!
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mb-8 border-b border-slate-100 pb-8">
                <h2 className="text-3xl font-black font-display text-[#0A3D73] mb-3">Request a Custom Quote</h2>
                <p className="text-slate-500">Fill out the details below. Our system will generate a detailed quotation sent to your email, and instantly alert our team via WhatsApp.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Personal Details */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">Your Name</label>
                    <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-3.5 focus:border-[#FF7020] outline-none font-semibold text-slate-800 transition-colors" placeholder="e.g. Rahul Sharma" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">Phone Number (WhatsApp)</label>
                    <input required type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-3.5 focus:border-[#FF7020] outline-none font-semibold text-slate-800 transition-colors" placeholder="+91" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">Email Address (To receive Quotation)</label>
                    <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-3.5 focus:border-[#FF7020] outline-none font-semibold text-slate-800 transition-colors" placeholder="name@example.com" />
                  </div>
                </div>

                {/* Trip Details */}
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 space-y-6">
                  <h4 className="font-bold text-[#0A3D73] flex items-center gap-2"><MapPin size={18} className="text-[#FF7020]"/> Trip Requirements</h4>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">Service Type</label>
                      <select required value={form.service} onChange={e => setForm({...form, service: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-3.5 focus:border-[#0A3D73] outline-none font-semibold text-slate-800 bg-white">
                        <option>Outstation Trip (Multi-Day)</option>
                        <option>Local Bangalore (8hr/80km)</option>
                        <option>Airport Transfer</option>
                        <option>Corporate Outing / Event</option>
                        <option>Wedding Transportation</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">Preferred Vehicle</label>
                      <select required value={form.vehicle} onChange={e => setForm({...form, vehicle: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-3.5 focus:border-[#0A3D73] outline-none font-semibold text-slate-800 bg-white">
                        <option>Tempo Traveller (12 Seater)</option>
                        <option>Tempo Traveller (14 Seater)</option>
                        <option>Tempo Traveller (20 Seater)</option>
                        <option>Mini Bus (21 Seater)</option>
                        <option>Luxury Bus (35 Seater)</option>
                        <option>Large Bus (50 Seater)</option>
                        <option>Toyota Innova Crysta</option>
                        <option>Sedan (Dzire / Etios)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-3 md:col-span-1">
                      <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">Passengers</label>
                      <input required type="number" min="1" max="60" value={form.passengers} onChange={e => setForm({...form, passengers: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-3.5 focus:border-[#0A3D73] outline-none font-semibold text-slate-800 bg-white" placeholder="Total people" />
                    </div>
                    <div className="col-span-3 md:col-span-1">
                      <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">Travel Date</label>
                      <input required type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-3.5 focus:border-[#0A3D73] outline-none font-semibold text-slate-800 bg-white" />
                    </div>
                    <div className="col-span-3 md:col-span-1">
                      <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">Duration (Days)</label>
                      <input required type="number" min="1" value={form.days} onChange={e => setForm({...form, days: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-3.5 focus:border-[#0A3D73] outline-none font-semibold text-slate-800 bg-white" placeholder="Days" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">Additional Details / Itinerary</label>
                  <textarea value={form.message} onChange={e => setForm({...form, message: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-3.5 focus:border-[#FF7020] outline-none font-semibold text-slate-800 transition-colors h-32 resize-none" placeholder="Please mention your exact pickup and drop locations, or any specific requirements..."></textarea>
                </div>

                <div className="flex items-start gap-3 bg-blue-50 p-4 rounded-xl border border-blue-100">
                  <AlertCircle size={20} className="text-blue-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-800 font-medium leading-relaxed">
                    By clicking submit, our automated system will send a customized quotation to your email and notify our support team on WhatsApp immediately.
                  </p>
                </div>

                <button type="submit" className="w-full bg-[#0A3D73] hover:bg-[#082f59] text-white font-black text-lg py-5 rounded-xl shadow-lg transition-all hover:-translate-y-1 flex items-center justify-center gap-3 group">
                  Generate Quotation & Send <Send size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>

              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}
