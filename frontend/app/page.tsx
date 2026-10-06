'use client';
import Link from 'next/link';
import { MapPin, Users, Plane, Car, Bus, Map, Clock, CheckCircle, Clock3, FileText, Send, Download, Mail, Calendar } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [activeTab, setActiveTab] = useState('tempo');
  const [form, setForm] = useState({ pickup: '', destination: '', date: '', time: '', vehicleInfo: '' });
  const [quoteStatus, setQuoteStatus] = useState<'idle' | 'generating' | 'done'>('idle');

  const tabs = [
    { id: 'tempo', label: 'Tempo Traveller', icon: <Users size={14} /> },
    { id: 'minibus', label: 'Mini Bus', icon: <Bus size={14} /> },
    { id: 'bus', label: 'Bus', icon: <Bus size={14} /> },
    { id: 'outstation', label: 'Outstation', icon: <Map size={14} /> },
    { id: 'cars', label: 'Cars', icon: <Car size={14} /> },
    { id: 'airport', label: 'Airport Taxi', icon: <Plane size={14} /> },
  ];

  const vehicleOptions: any = {
    'tempo': ['12 Seater Tempo Traveller', '14 Seater Tempo Traveller', '17 Seater Tempo Traveller', '20 Seater Tempo Traveller'],
    'minibus': ['21 Seater Mini Bus', '25 Seater Mini Bus'],
    'bus': ['30 Seater Bus', '35 Seater Bus', '40 Seater Bus', '50 Seater Bus'],
    'outstation': ['Sedan (4 Seats)', 'SUV (6 Seats)', 'Innova Crysta (7 Seats)', 'Tempo Traveller (12+ Seats)'],
    'cars': ['Hatchback (4 Seats)', 'Sedan (4 Seats)', 'SUV (6 Seats)', 'Innova (6 Seats)'],
    'airport': ['Sedan (4 Seats)', 'SUV (6 Seats)', 'Innova Crysta (7 Seats)']
  };

  async function generateQuote(e: any) {
    e.preventDefault();
    setQuoteStatus('generating');
    setTimeout(() => {
      setQuoteStatus('done');
    }, 2000);
  }

  function sendToWhatsApp() {
    const details = `*TripRide Official Quote* 🚕
-----------------------
*Category:* ${tabs.find(t => t.id === activeTab)?.label}
*Vehicle Needed:* ${form.vehicleInfo || vehicleOptions[activeTab][0]}
*Route:* ${form.pickup} to ${form.destination}
*Date:* ${form.date}
*Time:* ${form.time}
-----------------------
*Estimated Fare:* ₹1,200 - ₹1,500
_Please confirm your booking._`;
    window.open(`https://wa.me/917259335286?text=${encodeURIComponent(details)}`, '_blank');
  }

  return (
    <main className="min-h-screen bg-[#F9FAFB] overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-[400px] md:h-[550px] mt-[72px] overflow-hidden bg-[#0F355C]">
        {/* Animated Banner Background */}
        <motion.div
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="absolute inset-0 bg-cover bg-[center_top] bg-no-repeat"
          style={{ backgroundImage: 'url("/banner.png")' }}
        />

        {/* Subtle bottom gradient to blend with the page */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#F9FAFB] to-transparent"></div>

        {/* Visually hidden H1 for SEO */}
        <h1 className="sr-only">Book Taxi, Cars, Tempo Traveller, Mini Buses & Buses Across Karnataka</h1>
      </section>

      {/* Search Card */}
      <div className="container-x relative -mt-[180px] md:-mt-[120px] z-20 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-[16px] shadow-[0_15px_50px_rgba(0,0,0,0.12)] overflow-hidden border border-slate-100"
        >
          {/* Form Header */}
          <div className="bg-slate-50 border-b border-slate-200 p-6 md:px-10 text-center md:text-left">
            <h2 className="text-xl md:text-2xl font-black text-[#0A3D73] font-display">Where would you like to travel?</h2>
            <p className="text-slate-500 text-sm font-medium mt-1">Get an instant, transparent quote for your journey.</p>
          </div>
          {/* Tabs */}
          <div className="flex overflow-x-auto border-b border-slate-200 hide-scrollbar">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setForm({ ...form, vehicleInfo: vehicleOptions[tab.id][0] }); }}
                className={`flex items-center gap-2 whitespace-nowrap px-8 py-5 font-bold text-[14px] transition-colors ${activeTab === tab.id
                    ? 'bg-[#0F355C] text-white'
                    : 'text-slate-500 hover:text-slate-800 bg-white hover:bg-slate-50'
                  }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          <form onSubmit={generateQuote} className="p-8 md:p-10">
            <div className="grid md:grid-cols-2 gap-6 items-end mb-6">
              <div className="relative">
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">Pickup Location</label>
                <div className="relative border rounded-lg border-slate-200 flex items-center hover:border-slate-400 focus-within:border-[#0F355C] transition-colors">
                  <MapPin className="ml-4 text-red-500" size={18} />
                  <input
                    required
                    placeholder="e.g. Bengaluru Airport"
                    className="w-full bg-transparent px-4 py-3.5 outline-none text-slate-800 font-semibold text-[15px]"
                    value={form.pickup}
                    onChange={e => setForm({ ...form, pickup: e.target.value })}
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">Drop Location</label>
                <div className="relative border rounded-lg border-slate-200 flex items-center hover:border-slate-400 focus-within:border-[#0F355C] transition-colors">
                  <MapPin className="ml-4 text-[#0F355C]" size={18} />
                  <input
                    required
                    placeholder="e.g. Mysore / Coorg"
                    className="w-full bg-transparent px-4 py-3.5 outline-none text-slate-800 font-semibold text-[15px]"
                    value={form.destination}
                    onChange={e => setForm({ ...form, destination: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-end">
              <div className="relative">
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">Travel Date</label>
                <div className="relative border rounded-lg border-slate-200 flex items-center hover:border-slate-400 focus-within:border-[#0F355C] transition-colors">
                  <input
                    type="date"
                    required
                    className="w-full bg-transparent px-4 py-3.5 outline-none text-slate-800 font-semibold text-[15px]"
                    value={form.date}
                    onChange={e => setForm({ ...form, date: e.target.value })}
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">Time</label>
                <div className="relative border rounded-lg border-slate-200 flex items-center hover:border-slate-400 focus-within:border-[#0F355C] transition-colors">
                  <input
                    type="time"
                    required
                    className="w-full bg-transparent px-4 py-3.5 outline-none text-slate-800 font-semibold text-[15px]"
                    value={form.time}
                    onChange={e => setForm({ ...form, time: e.target.value })}
                  />
                </div>
              </div>

              <div className="relative col-span-2 md:col-span-1">
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">Vehicle Type</label>
                <div className="relative border rounded-lg border-slate-200 flex items-center hover:border-slate-400 focus-within:border-[#0F355C] transition-colors">
                  <Users className="ml-4 text-[#0F355C] absolute pointer-events-none" size={16} />
                  <select
                    className="w-full bg-transparent pl-12 pr-4 py-3.5 outline-none text-slate-800 font-semibold text-[15px] appearance-none cursor-pointer"
                    value={form.vehicleInfo}
                    onChange={e => setForm({ ...form, vehicleInfo: e.target.value })}
                  >
                    <option value="" disabled>Select vehicle...</option>
                    {vehicleOptions[activeTab]?.map((opt: string) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 pointer-events-none">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-slate-400"><path d="M6 9l6 6 6-6" /></svg>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-[#FF7020] hover:bg-[#E55C0C] text-white font-bold py-3.5 px-6 rounded-lg transition-colors w-full h-[52px] shadow-sm flex items-center justify-center gap-2 col-span-2 md:col-span-1"
              >
                <FileText size={18} /> Get Quote
              </motion.button>
            </div>
          </form>

          {/* Quotation Generation UI */}
          <AnimatePresence>
            {quoteStatus !== 'idle' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="border-t border-slate-200 bg-slate-50 overflow-hidden"
              >
                {quoteStatus === 'generating' ? (
                  <div className="p-8 flex flex-col items-center justify-center text-slate-500">
                    <div className="w-10 h-10 border-4 border-slate-200 border-t-[#0F355C] rounded-full animate-spin mb-4"></div>
                    <p className="font-bold">Generating your custom quotation...</p>
                  </div>
                ) : (
                  <div className="p-8">
                    <div className="bg-white p-6 rounded-xl border border-[#0A3D73]/20 shadow-sm mb-6 relative overflow-hidden">
                      <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">Quote Ready</div>
                      <h3 className="text-xl font-black text-[#0A3D73] mb-4 border-b pb-4">Estimated Quotation</h3>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div>
                          <p className="text-xs text-slate-500 font-bold uppercase">Vehicle</p>
                          <p className="font-semibold text-slate-800">{tabs.find(t => t.id === activeTab)?.label}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 font-bold uppercase">Route</p>
                          <p className="font-semibold text-slate-800">{form.pickup} to {form.destination}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 font-bold uppercase">Date & Time</p>
                          <p className="font-semibold text-slate-800">{form.date}, {form.time}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 font-bold uppercase">Est. Price</p>
                          <p className="font-black text-2xl text-[#FF7020]">₹1,200 <span className="text-sm font-medium text-slate-500">- ₹1,500</span></p>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row gap-4 mt-6">
                        <button onClick={sendToWhatsApp} className="flex-1 bg-[#25D366] hover:bg-[#1ebd5a] text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors">
                          <Send size={18} /> Send Quote to WhatsApp
                        </button>
                        <button className="flex-1 bg-[#0A3D73] hover:bg-[#082f59] text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors">
                          <Mail size={18} /> Email Quote to Me
                        </button>
                        <button className="flex-1 bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors">
                          <Download size={18} /> Download PDF
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* About Us Highlights */}
      <section className="container-x py-16 mb-8 mt-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-black font-display text-[#0F355C] mb-6 leading-[1.2]">
              Karnataka's Most Trusted <br /><span className="text-[#FF7020]">Travel Partner</span>
            </h2>
            <p className="text-slate-600 text-lg mb-8 leading-relaxed">
              Whether you are planning a corporate outing, a family vacation, or a quick airport transfer, TripRide provides top-class, well-maintained vehicles with professional drivers to ensure your journey is safe, comfortable, and highly memorable.
            </p>
            <div className="flex flex-col gap-4">
              {[
                "Well-maintained, clean, and sanitized fleet",
                "Professional, highly experienced route drivers",
                "Transparent pricing with zero hidden charges",
                "24/7 dedicated customer support for your peace of mind"
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="bg-[#5CC13A]/20 text-[#5CC13A] rounded-full p-1"><CheckCircle size={16} /></div>
                  <span className="text-slate-700 font-bold">{text}</span>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative h-[400px] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(15,53,92,0.15)] border-4 border-white"
          >
            <img src="/banner.png" alt="TripRide Fleet" className="w-full h-full object-cover object-left" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F355C]/90 via-[#0F355C]/40 to-transparent flex items-end p-8">
              <div className="text-white">
                <h3 className="font-black text-3xl mb-2 flex items-center gap-2"><MapPin className="text-[#FF7020]" /> Across Karnataka</h3>
                <p className="text-blue-100 font-medium">Providing premium travel services everywhere.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Scrolling Services Card Section */}
      <section className="bg-[#0A3D73] py-20 relative overflow-hidden">
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[#0F355C] rounded-l-full blur-3xl opacity-50"></div>

        <div className="container-x mb-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row justify-between items-end gap-4"
          >
            <div>
              <h2 className="text-[32px] font-black font-display text-white mb-3 tracking-tight">Our Premium Fleet</h2>
              <p className="text-blue-200 text-lg">Swipe to explore the perfect vehicle for your group size and destination.</p>
            </div>
          </motion.div>
        </div>

        {/* Horizontal Scrolling Wrapper */}
        <div className="pl-4 md:pl-12 flex gap-6 overflow-x-auto hide-scrollbar pb-8 relative z-10 pt-4">
          {[
            { name: 'Tempo Traveller', desc: '12 to 20 Seater Premium AC', icon: <Users size={36} className="text-[#FF7020]" /> },
            { name: 'Mini Bus', desc: '21 to 25 Seater Luxury AC', icon: <Bus size={36} className="text-[#FF7020]" /> },
            { name: 'Bus On Rent', desc: '30 to 50 Seater Pushback AC', icon: <Bus size={36} className="text-[#FF7020]" /> },
            { name: 'Outstation Cars', desc: 'Sedans & SUVs for Long Trips', icon: <Map size={36} className="text-[#FF7020]" /> },
            { name: 'Airport Taxi', desc: 'Reliable Drop & Pickup', icon: <Plane size={36} className="text-[#FF7020]" /> }
          ].map((srv, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-3xl p-8 min-w-[300px] md:min-w-[340px] shadow-xl hover:-translate-y-3 transition-transform cursor-pointer group border-b-4 border-transparent hover:border-[#FF7020]"
            >
              <div className="bg-orange-50 w-20 h-20 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-sm">
                {srv.icon}
              </div>
              <h3 className="text-2xl font-black text-[#0A3D73] mb-3 font-display">{srv.name}</h3>
              <p className="text-slate-500 mb-8 font-medium">{srv.desc}</p>
              <Link href="/vehicles" className="text-[#FF7020] font-bold flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                Explore Vehicle <span className="text-xl">→</span>
              </Link>
            </motion.div>
          ))}
          {/* Spacing element at end of scroll */}
          <div className="min-w-[20px] md:min-w-[40px]"></div>
        </div>

        {/* WhatsApp Enquiry Button */}
        <div className="flex justify-center mt-8 relative z-10">
           <a href="https://wa.me/917259335286" target="_blank" className="bg-[#25D366] hover:bg-[#1ebd5a] text-white font-bold py-4 px-10 rounded-full flex items-center gap-3 transition-transform hover:scale-105 shadow-[0_10px_30px_rgba(37,211,102,0.3)]">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
               <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
             </svg>
             Enquiry for More Info
           </a>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white py-16 border-y border-slate-200">
        <div className="container-x">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-12"
          >
            <h2 className="text-[28px] md:text-3xl font-black font-display text-[#0A3D73] mb-4">What Our Travelers Say</h2>
            <p className="text-slate-500">Trusted by thousands of happy customers across Karnataka for safe, reliable, and comfortable journeys.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Rahul S.", text: "Booked a 14 seater Tempo Traveller for a family trip to Coorg. The vehicle was spotless, driver was very professional, and we had an amazing time!", rating: 5, trip: "Bangalore to Coorg" },
              { name: "Priya M.", text: "Excellent service! We rented a mini bus for our corporate outing. The entire process from booking to the actual trip was seamless and completely transparent.", rating: 5, trip: "Corporate Outing" },
              { name: "Amit K.", text: "I regularly use TripRide for airport transfers. They are always on time, the cars are clean, and the pricing is very reasonable compared to others.", rating: 4, trip: "Airport Transfer" }
            ].map((review, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="bg-slate-50 rounded-2xl p-8 border border-slate-100 relative"
              >
                <div className="flex gap-1 mb-4 text-[#FF7020]">
                  {[...Array(review.rating)].map((_, idx) => <svg key={idx} width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>)}
                </div>
                <p className="text-slate-700 italic mb-6">"{review.text}"</p>
                <div className="flex items-center gap-4 mt-auto">
                  <div className="w-10 h-10 bg-[#0A3D73] rounded-full flex items-center justify-center text-white font-bold">{review.name.charAt(0)}</div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{review.name}</h4>
                    <p className="text-xs text-slate-500">{review.trip}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="container-x py-20 mb-10">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-[28px] font-black font-display text-[#0F355C] mb-10 text-center"
        >
          Frequently Asked Questions
        </motion.h2>

        <div className="max-w-3xl mx-auto flex flex-col gap-4">
          {[
            { q: "How are the outstation trip charges calculated?", a: "Outstation trips are calculated based on a minimum of 300 KMs per day. The total cost includes the per KM rate of your chosen vehicle, plus a daily driver allowance. Tolls, parking, and state taxes are extra." },
            { q: "Do I need to pay an advance to confirm my booking?", a: "Yes, we require a nominal advance payment (usually 10-20%) to block the vehicle for your dates. The remaining balance can be paid directly to the driver during your trip." },
            { q: "Are your vehicles air-conditioned?", a: "Yes! All our vehicles, including Cars, Tempo Travellers, and Mini Buses, come with fully functional AC to ensure a comfortable journey." },
            { q: "What happens if the vehicle breaks down during the trip?", a: "We maintain our fleet strictly, but in the rare event of a breakdown, we provide a replacement vehicle at the earliest possible time to ensure your trip continues smoothly." },
            { q: "Can I book a vehicle for a local city tour?", a: "Absolutely! We offer 8 Hour / 80 KM packages for local city tours in Bangalore. Any extra hours or KMs are charged at standard rates." }
          ].map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow cursor-pointer group"
            >
              <h4 className="font-bold text-slate-800 text-lg group-hover:text-[#0A3D73] transition-colors flex justify-between items-center">
                {faq.q}
                <span className="text-[#FF7020] text-xl">+</span>
              </h4>
              <p className="text-slate-500 mt-3 text-sm leading-relaxed hidden group-hover:block">{faq.a}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}
