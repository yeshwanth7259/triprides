import type { Metadata } from 'next';
import { Shield, Users, Clock, MapPin, CheckCircle } from 'lucide-react';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'About BookMyRoute | Premium Tempo Traveller & Bus Rental in Bangalore',
  description: 'BookMyRoute is Karnataka\'s leading travel agency providing safe, reliable, and comfortable Tempo Travellers, Mini Buses, and Car rentals for outstation and local trips.',
  keywords: 'About BookMyRoute, Travel Agency Bangalore, Tempo Traveller Rental Bangalore, Mini Bus Rent Karnataka, Safe Cab Service, Outstation Taxi Bangalore',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#F9FAFB] pt-24 pb-20">
      
      {/* SEO Optimized H1 Header */}
      <div className="bg-[#0A3D73] py-16 mb-12">
        <div className="container-x">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-black text-white font-display mb-4">
              About BookMyRoute Travel Services
            </h1>
            <p className="text-blue-100 text-lg">
              Karnataka's most trusted and reliable transportation partner for safe, comfortable, and memorable journeys.
            </p>
          </div>
        </div>
      </div>

      <div className="container-x">
        {/* Main Content Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl font-black text-[#0A3D73] mb-6">Our Mission & Vision</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              At <strong>BookMyRoute</strong>, our mission is to revolutionize the travel experience across Karnataka by providing top-tier, highly maintained vehicles at transparent and affordable prices. Whether you need a <strong>Tempo Traveller on rent in Bangalore</strong> for a family trip to Coorg, or a large <strong>Bus for a corporate outing</strong>, we are dedicated to making your journey seamless.
            </p>
            <p className="text-slate-600 leading-relaxed mb-8">
              With years of experience in the travel and logistics industry, we pride ourselves on our fleet quality and our highly professional, background-verified drivers who prioritize your safety above all else.
            </p>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                <h3 className="font-black text-[#FF7020] text-3xl mb-1">10k+</h3>
                <p className="text-slate-500 font-bold text-sm">Happy Customers</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                <h3 className="font-black text-[#FF7020] text-3xl mb-1">50+</h3>
                <p className="text-slate-500 font-bold text-sm">Premium Vehicles</p>
              </div>
            </div>
          </div>
          
          <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
            {/* Using native img for strict SEO alt tags */}
            <img 
              src="/banner.png" 
              alt="BookMyRoute Premium Tempo Travellers and Buses fleet in Bangalore" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Why Choose Us Section (SEO Rich) */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-10 md:p-16">
          <h2 className="text-3xl font-black text-[#0A3D73] mb-12 text-center">Why Choose BookMyRoute in Bangalore?</h2>
          
          <div className="grid md:grid-cols-3 gap-10">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-50 text-[#0A3D73] rounded-full flex items-center justify-center mb-6">
                <Shield size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Uncompromised Safety</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Every vehicle in our fleet undergoes rigorous maintenance checks before dispatch. Our drivers are trained for highway safety and night driving across Karnataka's terrains.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-orange-50 text-[#FF7020] rounded-full flex items-center justify-center mb-6">
                <CheckCircle size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Transparent Pricing</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                No hidden fees or last-minute surprises. We provide clear quotations for toll, parking, driver allowance, and per-kilometer rates upfront.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-50 text-[#5CC13A] rounded-full flex items-center justify-center mb-6">
                <Clock size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Punctual Service</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                We value your time. Whether it's an early morning airport drop or a multi-day outstation trip, our vehicles arrive pristine and exactly on time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
