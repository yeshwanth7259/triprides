import Link from 'next/link';
import { MapPin, Users, Calendar, Phone, CheckCircle, Shield, Clock, Banknote, Wind, Music, Map, Search, CarFront } from 'lucide-react';

export default function TempoTravellerBangalore() {
  return (
    <main className="min-h-screen bg-[#F9FAFB] pt-[104px]">
      
      {/* Hero Section */}
      <section className="bg-[#0A3D73] py-12 md:py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '24px 24px'}}></div>
        
        <div className="container-x relative z-10 flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1 text-white">
            <h1 className="text-4xl md:text-5xl font-black font-display leading-tight mb-4">
              Tempo Traveller on Rent in Bangalore
            </h1>
            <p className="text-blue-100 text-lg mb-8 max-w-xl leading-relaxed">
              Hire luxury Tempo Travellers for local sightseeing, outstation trips, and airport transfers. Best rates guaranteed with verified drivers.
            </p>
            <ul className="flex flex-col gap-3">
              <li className="flex items-center gap-3 font-semibold text-blue-50"><CheckCircle size={18} className="text-[#FF7020]" /> 12, 14, 17 & 20 Seater Available</li>
              <li className="flex items-center gap-3 font-semibold text-blue-50"><CheckCircle size={18} className="text-[#FF7020]" /> AC Pushback Seats</li>
              <li className="flex items-center gap-3 font-semibold text-blue-50"><CheckCircle size={18} className="text-[#FF7020]" /> Experienced Local Drivers</li>
            </ul>
          </div>
          
          {/* Hero Form */}
          <div className="w-full md:w-[420px] bg-white rounded-2xl p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-slate-800 mb-6 text-center">Get a Free Quote</h3>
            <form className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Trip Type</label>
                <select className="w-full border border-slate-200 rounded-lg p-3 bg-slate-50 text-slate-700 outline-none focus:border-[#0A3D73]">
                  <option>Outstation Trip</option>
                  <option>Local City Tour</option>
                  <option>Airport Transfer</option>
                </select>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Pickup City</label>
                  <input type="text" value="Bangalore" readOnly className="w-full border border-slate-200 rounded-lg p-3 bg-slate-100 text-slate-700 outline-none" />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Drop City</label>
                  <input type="text" placeholder="e.g. Coorg" className="w-full border border-slate-200 rounded-lg p-3 bg-white text-slate-700 outline-none focus:border-[#0A3D73]" />
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone Number</label>
                  <input type="tel" placeholder="+91" className="w-full border border-slate-200 rounded-lg p-3 bg-white text-slate-700 outline-none focus:border-[#0A3D73]" />
                </div>
              </div>
              <button type="button" className="w-full bg-[#FF7020] hover:bg-[#E55C0C] text-white font-bold py-3.5 rounded-lg transition-colors mt-2">
                Check Prices
              </button>
            </form>
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
          {/* Vehicle 1 */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
            <div className="h-[200px] bg-slate-100 flex items-center justify-center border-b border-slate-100 p-6">
               <CarFront size={80} className="text-[#0A3D73] opacity-20" />
               <span className="absolute font-bold text-slate-400">Image Here</span>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-2">12 Seater Tempo Traveller</h3>
              <p className="text-slate-500 text-sm mb-4">Perfect for small family trips and corporate outings.</p>
              
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-slate-600"><Users size={16} className="text-[#FF7020]"/> 12 Seats</div>
                <div className="flex items-center gap-2 text-sm text-slate-600"><Wind size={16} className="text-[#FF7020]"/> AC</div>
                <div className="flex items-center gap-2 text-sm text-slate-600"><Music size={16} className="text-[#FF7020]"/> Music</div>
                <div className="flex items-center gap-2 text-sm text-slate-600"><Shield size={16} className="text-[#FF7020]"/> GPS Tracking</div>
              </div>
              
              <div className="flex items-end justify-between mt-4 pt-4 border-t border-slate-100">
                <div>
                  <span className="text-xs text-slate-400 font-bold uppercase">Starting From</span>
                  <div className="text-xl font-black text-[#0A3D73]">₹22 / km</div>
                </div>
                <button className="bg-[#0A3D73] hover:bg-[#082f59] text-white px-5 py-2 rounded-lg font-bold text-sm transition-colors">Book Now</button>
              </div>
            </div>
          </div>

          {/* Vehicle 2 */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
            <div className="h-[200px] bg-slate-100 flex items-center justify-center border-b border-slate-100 p-6 relative">
               <div className="absolute top-4 left-4 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide">Most Popular</div>
               <CarFront size={80} className="text-[#0A3D73] opacity-20" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-2">14 Seater Tempo Traveller</h3>
              <p className="text-slate-500 text-sm mb-4">Ideal for medium-sized groups heading outstation.</p>
              
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-slate-600"><Users size={16} className="text-[#FF7020]"/> 14 Seats</div>
                <div className="flex items-center gap-2 text-sm text-slate-600"><Wind size={16} className="text-[#FF7020]"/> AC</div>
                <div className="flex items-center gap-2 text-sm text-slate-600"><Music size={16} className="text-[#FF7020]"/> Music</div>
                <div className="flex items-center gap-2 text-sm text-slate-600"><Shield size={16} className="text-[#FF7020]"/> GPS Tracking</div>
              </div>
              
              <div className="flex items-end justify-between mt-4 pt-4 border-t border-slate-100">
                <div>
                  <span className="text-xs text-slate-400 font-bold uppercase">Starting From</span>
                  <div className="text-xl font-black text-[#0A3D73]">₹24 / km</div>
                </div>
                <button className="bg-[#0A3D73] hover:bg-[#082f59] text-white px-5 py-2 rounded-lg font-bold text-sm transition-colors">Book Now</button>
              </div>
            </div>
          </div>

          {/* Vehicle 3 */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
            <div className="h-[200px] bg-slate-100 flex items-center justify-center border-b border-slate-100 p-6">
               <CarFront size={80} className="text-[#0A3D73] opacity-20" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-2">17 Seater Tempo Traveller</h3>
              <p className="text-slate-500 text-sm mb-4">Spacious and comfortable for large group travels.</p>
              
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-slate-600"><Users size={16} className="text-[#FF7020]"/> 17 Seats</div>
                <div className="flex items-center gap-2 text-sm text-slate-600"><Wind size={16} className="text-[#FF7020]"/> AC</div>
                <div className="flex items-center gap-2 text-sm text-slate-600"><Music size={16} className="text-[#FF7020]"/> LCD TV</div>
                <div className="flex items-center gap-2 text-sm text-slate-600"><Shield size={16} className="text-[#FF7020]"/> GPS Tracking</div>
              </div>
              
              <div className="flex items-end justify-between mt-4 pt-4 border-t border-slate-100">
                <div>
                  <span className="text-xs text-slate-400 font-bold uppercase">Starting From</span>
                  <div className="text-xl font-black text-[#0A3D73]">₹26 / km</div>
                </div>
                <button className="bg-[#0A3D73] hover:bg-[#082f59] text-white px-5 py-2 rounded-lg font-bold text-sm transition-colors">Book Now</button>
              </div>
            </div>
          </div>
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
                  <th className="p-4 font-bold border-r border-[#082f59]">Vehicle Type</th>
                  <th className="p-4 font-bold border-r border-[#082f59]">Outstation (Per KM)</th>
                  <th className="p-4 font-bold border-r border-[#082f59]">Local 8 Hr / 80 Km</th>
                  <th className="p-4 font-bold">Driver Allowance (Per Day)</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                <tr className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-4 font-semibold text-slate-800 border-r border-slate-100">12 Seater Tempo Traveller</td>
                  <td className="p-4 text-slate-600 border-r border-slate-100">₹ 22</td>
                  <td className="p-4 text-slate-600 border-r border-slate-100">₹ 3,500</td>
                  <td className="p-4 text-slate-600">₹ 500</td>
                </tr>
                <tr className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-4 font-semibold text-slate-800 border-r border-slate-100">14 Seater Tempo Traveller</td>
                  <td className="p-4 text-slate-600 border-r border-slate-100">₹ 24</td>
                  <td className="p-4 text-slate-600 border-r border-slate-100">₹ 4,000</td>
                  <td className="p-4 text-slate-600">₹ 500</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-4 font-semibold text-slate-800 border-r border-slate-100">17 Seater Tempo Traveller</td>
                  <td className="p-4 text-slate-600 border-r border-slate-100">₹ 26</td>
                  <td className="p-4 text-slate-600 border-r border-slate-100">₹ 4,500</td>
                  <td className="p-4 text-slate-600">₹ 600</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-400 mt-4 text-center">* Tolls, parking, and state taxes are extra as applicable.</p>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 container-x">
        <h2 className="text-3xl font-black font-display text-[#0A3D73] mb-12 text-center">Why Book With TripRide?</h2>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100 text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-[#0A3D73]"><Shield size={28}/></div>
            <h4 className="font-bold text-slate-800 mb-2">Verified Drivers</h4>
            <p className="text-sm text-slate-500">All our drivers undergo background checks and are highly experienced on outstation routes.</p>
          </div>
          <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100 text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-[#FF7020]"><Banknote size={28}/></div>
            <h4 className="font-bold text-slate-800 mb-2">Transparent Pricing</h4>
            <p className="text-sm text-slate-500">No hidden charges. You pay exactly what is quoted to you before the trip.</p>
          </div>
          <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100 text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-[#0A3D73]"><Clock size={28}/></div>
            <h4 className="font-bold text-slate-800 mb-2">On-Time Pickup</h4>
            <p className="text-sm text-slate-500">Punctuality is our priority. Your vehicle will arrive 15 minutes prior to departure.</p>
          </div>
          <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100 text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-[#FF7020]"><CarFront size={28}/></div>
            <h4 className="font-bold text-slate-800 mb-2">Clean Vehicles</h4>
            <p className="text-sm text-slate-500">Sanitized and well-maintained fleet ensuring a hygienic and comfortable journey.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-16 border-t border-slate-200">
        <div className="container-x max-w-4xl">
          <h2 className="text-3xl font-black font-display text-[#0A3D73] mb-8 text-center">Frequently Asked Questions</h2>
          <div className="flex flex-col gap-4">
            <div className="border border-slate-200 rounded-lg p-5">
              <h4 className="font-bold text-slate-800 mb-2">How do I calculate the total outstation trip cost?</h4>
              <p className="text-sm text-slate-600">The total cost is calculated as: (Total KMs Travelled × Per KM Rate) + (Number of Days × Driver Allowance) + Tolls + Parking + State Taxes (if crossing borders). Minimum 300 KMs are charged per day.</p>
            </div>
            <div className="border border-slate-200 rounded-lg p-5">
              <h4 className="font-bold text-slate-800 mb-2">Is advance payment required?</h4>
              <p className="text-sm text-slate-600">Yes, a nominal advance of 10-20% is required to confirm your booking. The rest can be paid directly to the driver during the trip.</p>
            </div>
            <div className="border border-slate-200 rounded-lg p-5">
              <h4 className="font-bold text-slate-800 mb-2">Are pets allowed in the Tempo Traveller?</h4>
              <p className="text-sm text-slate-600">This depends on the specific vehicle. Please inform us during booking if you plan to carry a pet, and we will arrange a pet-friendly vehicle for you.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
