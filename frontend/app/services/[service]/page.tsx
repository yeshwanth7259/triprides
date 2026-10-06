import type { Metadata } from 'next';
import { Shield, CheckCircle, Clock, MapPin, Droplets, Sparkles, Wind, FileText, ChevronRight, Bus } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// Mock data for services to generate pages dynamically
const serviceData: any = {
  'bus-bangalore': {
    title: 'Bus on Rent in Bangalore',
    description: 'Looking for a reliable Bus on Rent in Bangalore? TripRide offers premium 21 to 50 seater AC and Non-AC pushback buses for outstation trips, corporate events, and weddings.',
    heroImage: '/vehicles/bus3a.jpg',
    seoTitle: 'Bus on Rent in Bangalore | 21 to 50 Seater Pushback Buses',
    seoKeywords: 'Bus on rent in Bangalore, AC Bus Rental, 50 seater bus rent, Mini bus for rent, Corporate bus rent Bangalore'
  },
  'tempo-traveller-bangalore': {
    title: 'Tempo Traveller on Rent in Bangalore',
    description: 'Book luxury Tempo Travellers in Bangalore for family trips and outstation travel. 12 to 20 seater options available.',
    heroImage: '/vehicles/TEMPO-TRAVELLER-1.webp',
    seoTitle: 'Tempo Traveller on Rent in Bangalore | 12 to 20 Seater',
    seoKeywords: 'Tempo traveller on rent in Bangalore, 12 seater tempo traveller, luxury tempo traveller'
  }
};

export async function generateMetadata({ params }: { params: { service: string } }): Promise<Metadata> {
  const service = serviceData[params.service];
  if (!service) return { title: 'Service Not Found | TripRide' };
  
  return {
    title: service.seoTitle,
    description: service.description,
    keywords: service.seoKeywords,
  };
}

export default function ServicePage({ params }: { params: { service: string } }) {
  const service = serviceData[params.service];

  // If we don't have hardcoded data for this service yet, fallback safely
  if (!service && params.service !== 'bus-bangalore') {
    return (
      <main className="min-h-screen bg-[#F9FAFB] pt-32 pb-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-black text-[#0A3D73] mb-4">Service Details Coming Soon</h1>
          <p className="text-slate-500 mb-8">We are updating the detailed page for this service.</p>
          <Link href="/" className="bg-[#FF7020] text-white px-6 py-3 rounded-lg font-bold">Back to Home</Link>
        </div>
      </main>
    );
  }

  // Focus rendering specifically for bus-bangalore per user requirements
  const isBus = params.service === 'bus-bangalore';

  return (
    <main className="min-h-screen bg-[#F9FAFB] overflow-hidden">
      
      {/* 1. Hero Banner with Overlay */}
      <section className="relative w-full h-[500px] md:h-[600px] mt-[72px]">
        <img 
          src={isBus ? "/vehicles/bus3a.jpg" : service?.heroImage} 
          alt={service?.title} 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A3D73]/90 to-[#0A3D73]/40"></div>
        
        <div className="absolute inset-0 flex items-center">
          <div className="container-x w-full grid md:grid-cols-2 gap-8 items-center">
            
            <div className="text-white">
              <span className="inline-block bg-[#FF7020] text-white text-xs font-bold px-3 py-1 rounded-full mb-4">Top Rated Service</span>
              <h1 className="text-4xl md:text-6xl font-black font-display leading-tight mb-6">
                {service?.title || 'Premium Bus on Rent'}
              </h1>
              <p className="text-lg text-blue-100 mb-8 max-w-lg leading-relaxed">
                {service?.description || 'Book top-quality, highly maintained seating buses for corporate events, weddings, and family trips across Karnataka. (Strictly Seating/Pushback Only - No Sleeper Buses)'}
              </p>
              
              <div className="flex flex-wrap gap-4">
                <span className="flex items-center gap-2 text-sm font-bold bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm"><CheckCircle size={16} className="text-[#5CC13A]" /> Pushback Seats</span>
                <span className="flex items-center gap-2 text-sm font-bold bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm"><CheckCircle size={16} className="text-[#5CC13A]" /> Fully Air Conditioned</span>
                <span className="flex items-center gap-2 text-sm font-bold bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm"><CheckCircle size={16} className="text-[#5CC13A]" /> Professional Drivers</span>
              </div>
            </div>

            {/* Quick Enquiry Form embedded in Banner */}
            <div className="hidden md:block bg-white p-8 rounded-2xl shadow-2xl ml-auto w-full max-w-md border-t-8 border-[#FF7020]">
              <h3 className="text-2xl font-black text-[#0A3D73] mb-2">Get an Instant Quote</h3>
              <p className="text-slate-500 text-sm mb-6">Fill details below and we will contact you immediately.</p>
              
              <form className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Pickup Location</label>
                  <input type="text" className="w-full border-b-2 border-slate-200 py-2 focus:border-[#0F355C] outline-none font-semibold text-slate-800" placeholder="e.g., Bengaluru Airport" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Drop Location</label>
                  <input type="text" className="w-full border-b-2 border-slate-200 py-2 focus:border-[#0F355C] outline-none font-semibold text-slate-800" placeholder="e.g., Mysore" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Date</label>
                    <input type="date" className="w-full border-b-2 border-slate-200 py-2 focus:border-[#0F355C] outline-none font-semibold text-slate-800" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Phone</label>
                    <input type="tel" className="w-full border-b-2 border-slate-200 py-2 focus:border-[#0F355C] outline-none font-semibold text-slate-800" placeholder="+91" />
                  </div>
                </div>
                <button type="button" className="w-full bg-[#FF7020] text-white font-bold py-4 rounded-xl mt-4 hover:bg-[#E55C0C] transition-colors shadow-lg">
                  Submit Enquiry
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Available Bus Fleet (Strictly No Sleepers) */}
      {isBus && (
        <section className="py-20 bg-white">
          <div className="container-x">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-black font-display text-[#0A3D73] mb-4">Our Premium Bus Fleet</h2>
              <p className="text-slate-600 text-lg">We specialize exclusively in high-comfort seating and pushback buses. Perfect for daytime travel, corporate outings, and family functions.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { name: '21 Seater Mini Bus', img: '/vehicles/21seater-bus.webp', desc: 'Ideal for small groups, corporate airport transfers, and local sightseeing.', tags: ['AC available', 'Pushback seats'] },
                { name: '35 Seater Luxury Bus', img: '/vehicles/bus3a.jpg', desc: 'The most popular choice for weddings and medium-sized corporate outings.', tags: ['2x2 Seating', 'Premium AC', 'Video Coach'] },
                { name: '50 Seater Large Bus', img: '/vehicles/50-seater-bus1.jpg', desc: 'Economical option for very large groups traveling for events or school trips.', tags: ['AC/Non-AC', 'Spacious aisle'] }
              ].map((bus, i) => (
                <div key={i} className="bg-[#F9FAFB] rounded-2xl border border-slate-200 overflow-hidden group hover:shadow-xl transition-all">
                  <div className="h-48 overflow-hidden relative">
                    <img src={bus.img} alt={bus.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute top-4 right-4 bg-white px-3 py-1 text-xs font-bold text-[#0A3D73] rounded-full shadow-md">Seating Only</div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-black text-[#0A3D73] mb-2">{bus.name}</h3>
                    <p className="text-slate-500 text-sm mb-4 leading-relaxed">{bus.desc}</p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {bus.tags.map(tag => (
                        <span key={tag} className="text-[11px] font-bold uppercase tracking-wider bg-slate-200 text-slate-600 px-2 py-1 rounded">{tag}</span>
                      ))}
                    </div>
                    <button className="w-full bg-white border-2 border-[#0A3D73] text-[#0A3D73] font-bold py-2 rounded-lg hover:bg-[#0A3D73] hover:text-white transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 3. Dedicated Cleaning Process (As Requested) */}
      <section className="py-20 bg-[#0A3D73] relative overflow-hidden text-white">
        {/* Subtle background decoration */}
        <div className="absolute top-[-50%] left-[-10%] w-[60%] h-[200%] bg-white/5 rounded-full blur-3xl transform rotate-12"></div>

        <div className="container-x relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-full mb-6">
              <Sparkles size={32} className="text-[#FF7020]" />
            </div>
            <h2 className="text-3xl md:text-4xl font-black font-display mb-4">Our 5-Step Deep Cleaning Process</h2>
            <p className="text-blue-100 text-lg">Your health and hygiene are our absolute priority. Every single bus goes through a rigorous cleaning protocol before it reaches your pickup point.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[
              { step: '01', title: 'Trash Removal', desc: 'All leftover items, wrappers, and trash from previous trips are completely cleared out.', icon: <Droplets /> },
              { step: '02', title: 'Vacuuming', desc: 'Deep vacuuming of all seats, aisles, and hard-to-reach corners to remove dust.', icon: <Wind /> },
              { step: '03', title: 'Surface Sanitization', desc: 'Wiping down windows, armrests, handles, and AC vents with hospital-grade sanitizers.', icon: <Shield /> },
              { step: '04', title: 'Exterior Wash', desc: 'High-pressure water wash of the bus exterior, tires, and windows for a pristine look.', icon: <Droplets /> },
              { step: '05', title: 'Final Inspection', desc: 'A strict checklist review by our supervisor before the bus is dispatched to you.', icon: <CheckCircle /> }
            ].map((process, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:bg-white/20 transition-colors relative">
                <div className="text-4xl font-black text-white/10 absolute top-4 right-4">{process.step}</div>
                <div className="text-[#FF7020] mb-4">{process.icon}</div>
                <h3 className="text-xl font-bold mb-3">{process.title}</h3>
                <p className="text-blue-100 text-sm leading-relaxed">{process.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Pricing Section (Market Analyzed Pricing) */}
      <section className="py-20 bg-slate-50">
        <div className="container-x max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black font-display text-[#0A3D73] mb-4">Transparent Market Pricing</h2>
            <p className="text-slate-600 text-lg">We continuously analyze Bangalore market rates to ensure you get the most competitive and fair pricing. No hidden fees.</p>
          </div>

          <div className="bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden">
            <div className="grid grid-cols-4 bg-[#0A3D73] text-white p-6 font-bold text-sm md:text-base">
              <div className="col-span-1">Vehicle Type</div>
              <div className="col-span-1 text-center">Local (8hr/80km)</div>
              <div className="col-span-1 text-center">Outstation (Per KM)</div>
              <div className="col-span-1 text-center">Driver Bata/Day</div>
            </div>
            
            <div className="divide-y divide-slate-100">
              {[
                { name: '21 Seater Mini Bus (AC)', local: '₹6,500', out: '₹22 / km', bata: '₹600' },
                { name: '35 Seater Bus (AC)', local: '₹9,000', out: '₹30 / km', bata: '₹800' },
                { name: '50 Seater Bus (Non-AC)', local: '₹11,000', out: '₹38 / km', bata: '₹1000' },
                { name: '50 Seater Bus (AC)', local: '₹14,000', out: '₹45 / km', bata: '₹1000' }
              ].map((row, i) => (
                <div key={i} className="grid grid-cols-4 p-6 items-center hover:bg-slate-50 transition-colors">
                  <div className="col-span-1 font-bold text-slate-800 flex items-center gap-3">
                    <div className="hidden md:flex w-10 h-10 bg-orange-50 rounded-lg items-center justify-center text-[#FF7020]"><Bus size={20}/></div>
                    {row.name}
                  </div>
                  <div className="col-span-1 text-center font-semibold text-slate-600">{row.local}</div>
                  <div className="col-span-1 text-center font-semibold text-[#0F355C]">{row.out}</div>
                  <div className="col-span-1 text-center text-slate-500 text-sm">{row.bata}</div>
                </div>
              ))}
            </div>
            
            <div className="bg-slate-100 p-6 text-sm text-slate-500 text-center border-t border-slate-200">
              * Note: Tolls, parking, and state permit taxes (for outstation) are extra as per actuals. Minimum 300 KMs per day applies for outstation trips.
            </div>
          </div>
        </div>
      </section>

      {/* 5. Quick CTA */}
      <section className="py-16 bg-[#FF7020] text-white text-center">
        <div className="container-x">
          <h2 className="text-3xl font-black mb-6">Ready to book your bus in Bangalore?</h2>
          <div className="flex justify-center gap-4">
            <a href="tel:+917259335286" className="inline-block bg-white text-[#FF7020] font-black px-8 py-4 rounded-xl shadow-lg hover:scale-105 transition-transform">
              Call Now: +91 7259335286
            </a>
            <a href="https://wa.me/917259335286" target="_blank" className="inline-flex items-center gap-2 bg-[#25D366] text-white font-black px-8 py-4 rounded-xl shadow-lg hover:scale-105 transition-transform">
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>

    </main>
  );
}
