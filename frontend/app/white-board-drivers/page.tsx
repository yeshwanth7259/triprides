'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Car, ShieldCheck, Phone, Star, MapPin, CheckCircle, 
  Sparkles, MessageSquare, ArrowRight, 
  Clock, Award, Fuel, Check, X, Shield, Calendar, Compass, UserCheck,
  FileText, UploadCloud, ChevronRight, HelpCircle, AlertCircle, Camera, Image as ImageIcon
} from 'lucide-react';
import { 
  WHITE_BOARD_DRIVERS, 
  WhiteBoardDriver 
} from '../../lib/whiteBoardDriversData';
import { 
  CONTACT_PHONE, 
  CONTACT_PHONE_TEL, 
  CONTACT_PHONE_WA 
} from '../../lib/fleetData';

export default function WhiteBoardDriversPage() {
  const driver = WHITE_BOARD_DRIVERS[0]; // Yeshwanth K

  // Active section tab: 'hire' (hire Yeshwanth / view pricing) or 'onboarding' (driver join form)
  const [activeTab, setActiveTab] = useState<'hire' | 'onboarding'>('hire');

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam === 'onboarding') {
        setActiveTab('onboarding');
      } else if (tabParam === 'hire') {
        setActiveTab('hire');
      }
    }
  }, []);

  // Hire modal state
  const [isHireModalOpen, setIsHireModalOpen] = useState(false);
  const [hireForm, setHireForm] = useState({
    customerName: '',
    customerPhone: '',
    tripType: 'Outstation Trip (Personal Car)',
    tripDate: '',
    durationDays: '2',
    pickupAddress: '',
    destination: '',
    yourCarModel: 'Sedan / SUV',
    transmission: 'Automatic'
  });
  const [hireSuccess, setHireSuccess] = useState(false);

  // Driver Onboarding Form state
  const [onboardForm, setOnboardForm] = useState({
    fullName: '',
    mobileNumber: '',
    altPhone: '',
    cityArea: 'Bangalore (South / North / East / West)',
    dlNumber: '',
    dlType: 'LMV (Light Motor Vehicle - Personal Car)',
    dlExpiry: '',
    aadhaarNumber: '',
    experienceYears: '5+ Years',
    transmissionSkill: 'Both Manual & Automatic',
    carCategories: ['Sedan', 'SUV & MPV'],
    previousExperience: 'Personal Family Chauffeur & Tour Driver',
    noAccidentRecord: true
  });
  const [onboardSubmitted, setOnboardSubmitted] = useState(false);

  // Document Upload States
  const [driverPhotoFile, setDriverPhotoFile] = useState<File | null>(null);
  const [driverPhotoPreview, setDriverPhotoPreview] = useState<string>('');
  const [dlFrontFile, setDlFrontFile] = useState<File | null>(null);
  const [dlFrontPreview, setDlFrontPreview] = useState<string>('');
  const [dlBackFile, setDlBackFile] = useState<File | null>(null);
  const [dlBackPreview, setDlBackPreview] = useState<string>('');

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDriverPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setDriverPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleDlFrontUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDlFrontFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setDlFrontPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleDlBackUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDlBackFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setDlBackPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleHireSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const text = `*🚗 BookMyRoute - Hire Driver for Personal Car*
----------------------------------------
*Driver Requested:* ${driver.name}
*Customer Name:* ${hireForm.customerName}
*Customer Mobile:* +91 ${hireForm.customerPhone.replace(/^\+?91/, '').trim()}
*Trip Mode:* ${hireForm.tripType}
*Travel Date:* ${hireForm.tripDate} (${hireForm.durationDays} Days)
*Pickup Address:* ${hireForm.pickupAddress}
*Destination / Route:* ${hireForm.destination}
*Customer Vehicle:* ${hireForm.yourCarModel} (${hireForm.transmission})
----------------------------------------
_Please confirm Yeshwanth K's availability and tariff quotation._`;

    // Also send to backend leads API
    fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_name: hireForm.customerName,
        phone: hireForm.customerPhone,
        service_type: 'White Board Driver Hire',
        vehicle_type: hireForm.yourCarModel,
        pickup: hireForm.pickupAddress,
        destination: hireForm.destination,
        travel_date: hireForm.tripDate
      })
    }).catch(() => {});

    window.open(`https://wa.me/${CONTACT_PHONE_WA}?text=${encodeURIComponent(text)}`, '_blank');
    setHireSuccess(true);
  };

  const handleOnboardSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const photoStatus = driverPhotoFile ? `✓ Attached (${driverPhotoFile.name} - ${(driverPhotoFile.size / 1024).toFixed(0)} KB)` : 'Ready to Send on WhatsApp';
    const dlFrontStatus = dlFrontFile ? `✓ Attached Front (${dlFrontFile.name} - ${(dlFrontFile.size / 1024).toFixed(0)} KB)` : 'Ready to Send on WhatsApp';
    const dlBackStatus = dlBackFile ? `✓ Attached Back (${dlBackFile.name} - ${(dlBackFile.size / 1024).toFixed(0)} KB)` : 'Ready to Send on WhatsApp';

    const text = `*🪪 NEW WHITE BOARD DRIVER ONBOARDING APPLICATION*
----------------------------------------
👤 *Driver Name:* ${onboardForm.fullName}
📱 *Mobile Number:* +91 ${onboardForm.mobileNumber.replace(/^\+?91/, '').trim()}
📞 *Alt Phone:* ${onboardForm.altPhone || 'N/A'}
📍 *Current Location:* ${onboardForm.cityArea}
⏳ *Driving Experience:* ${onboardForm.experienceYears}
🕹️ *Transmission:* ${onboardForm.transmissionSkill}
🚗 *Vehicles Driven:* ${onboardForm.carCategories.join(', ')}
🪪 *DL Number:* ${onboardForm.dlNumber}
🏷️ *DL Category:* ${onboardForm.dlType}
📅 *DL Expiry Date:* ${onboardForm.dlExpiry || 'Verified'}
🆔 *Aadhaar Number:* ${onboardForm.aadhaarNumber || 'Provided'}
📸 *Driver Photo:* ${photoStatus}
📄 *DL Front Copy:* ${dlFrontStatus}
📄 *DL Back Copy:* ${dlBackStatus}
💼 *Previous Background:* ${onboardForm.previousExperience}
✅ *Clean Driving Record:* ${onboardForm.noAccidentRecord ? 'Declared Clean & Verified' : 'Standard'}
----------------------------------------
_Applicant has uploaded DL documents & photo. Please verify and approve driver profile on BookMyRoute._`;

    // Also send to backend leads API
    fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_name: `[DRIVER APPLICANT] ${onboardForm.fullName}`,
        phone: onboardForm.mobileNumber,
        service_type: 'Driver Onboarding Application',
        notes: `DL: ${onboardForm.dlNumber}, Exp: ${onboardForm.experienceYears}, Loc: ${onboardForm.cityArea}, Photo: ${driverPhotoFile ? 'Yes' : 'No'}, DL Docs: ${dlFrontFile ? 'Yes' : 'No'}`
      })
    }).catch(() => {});

    window.open(`https://wa.me/${CONTACT_PHONE_WA}?text=${encodeURIComponent(text)}`, '_blank');
    setOnboardSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-20 font-sans">
      
      {/* 1. Official Banner Uploaded by User (Looking for a Trusted Driver for Your Own Car?) */}
      <section className="relative w-full bg-[#0A3D73] overflow-hidden mb-6 shadow-md">
        <h1 className="sr-only">Hire a Trusted Driver for Your Own Car | BookMyRoute Driver on Demand</h1>
        <div className="w-full">
          <img
            src="/banner-driver-demand.jpg"
            alt="Looking for a Trusted Driver for Your Own Car? BookMyRoute Driver on Demand"
            className="w-full h-auto block object-cover md:object-contain max-h-[580px] mx-auto"
          />
        </div>
      </section>

      {/* 2. Navigation Pills: Hire Driver vs Driver Onboarding */}
      <section className="container-x max-w-5xl mx-auto px-4 mb-8">
        <div className="bg-white rounded-2xl p-2 shadow-sm border border-slate-200 flex items-center justify-center gap-3">
          <button
            onClick={() => setActiveTab('hire')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
              activeTab === 'hire'
                ? 'bg-[#0A3D73] text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Car size={16} className={activeTab === 'hire' ? 'text-[#FF7020]' : ''} />
            <span>Hire Driver for Your Car</span>
          </button>

          <button
            onClick={() => setActiveTab('onboarding')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
              activeTab === 'onboarding'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileText size={16} />
            <span>Driver Onboarding (Join as Driver)</span>
          </button>
        </div>
      </section>

      {/* TAB 1: HIRE DRIVER & VIEW MARKET PRICING */}
      {activeTab === 'hire' && (
        <div className="container-x max-w-6xl mx-auto px-4 space-y-10">

          {/* Featured Chauffeur: Yeshwanth K */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-[#0A3D73] to-[#0f4f96] p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
                <div className="relative">
                  <img
                    src={driver.avatar}
                    alt={driver.name}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-4 border-white/20 shadow-lg"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1 rounded-full shadow-md" title="Verified Driver">
                    <CheckCircle size={18} />
                  </div>
                </div>

                <div>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight">{driver.name}</h2>
                    <span className="bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
                      ✓ Verified Master Chauffeur
                    </span>
                  </div>
                  <p className="text-blue-100 text-xs sm:text-sm font-medium mb-3">
                    Professional Personal Chauffeur (Sedan & SUV Specialist) • Based in Bengaluru
                  </p>
                  
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs">
                    <span className="bg-white/10 px-3 py-1 rounded-lg flex items-center gap-1 font-bold">
                      <Star size={13} className="fill-amber-400 text-amber-400" />
                      {driver.rating} ({driver.reviewsCount} Reviews)
                    </span>
                    <span className="bg-white/10 px-3 py-1 rounded-lg font-bold">
                      🏆 {driver.experienceYears}+ Years Highway Driving
                    </span>
                    <span className="bg-white/10 px-3 py-1 rounded-lg font-bold">
                      🛡️ {driver.tripsCompleted}+ Safe Trips
                    </span>
                  </div>
                </div>
              </div>

              {/* Instant Call / WhatsApp Buttons */}
              <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 w-full md:w-auto shrink-0">
                <a
                  href={`tel:${CONTACT_PHONE_TEL}`}
                  className="bg-white hover:bg-slate-100 text-[#0A3D73] font-black text-xs sm:text-sm px-6 py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Phone size={15} />
                  <span>Call {CONTACT_PHONE}</span>
                </a>

                <button
                  onClick={() => {
                    setIsHireModalOpen(true);
                    setHireSuccess(false);
                  }}
                  className="bg-[#FF7020] hover:bg-[#ea5e10] text-white font-black text-xs sm:text-sm px-6 py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Car size={15} />
                  <span>Book Yeshwanth for Your Car</span>
                </button>
              </div>
            </div>

            {/* Driver Details Body */}
            <div className="p-6 sm:p-8 space-y-6">
              
              {/* About */}
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">About The Chauffeur</h3>
                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                  {driver.bio}
                </p>
              </div>

              {/* Supported Vehicle Types */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                    Vehicles Yeshwanth Can Drive (Sedan & SUV Specialist)
                  </h3>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Manual & Automatic Certified
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { label: 'All Sedans (Swift Dzire, Toyota Etios, Honda City, Verna, Ciaz, Virtus)', type: 'Manual & AT' },
                    { label: 'Full-Size SUVs & MPVs (Innova Crysta, Fortuner, Scorpio-N, XUV700, Safari, Ertiga)', type: 'Manual & AT' },
                    { label: 'Compact & Mid SUVs (Creta, Seltos, Brezza, Nexon, Grand Vitara, Elevate)', type: 'Manual & AT' },
                    { label: 'Western Ghats Mountain Route Expert (Coorg, Ooty, Chikmagalur, Wayanad)', type: 'Hill Specialist' },
                    { label: 'Long Distance Highway Driving (Bangalore to All India Routes)', type: 'Interstate Highway' },
                    { label: 'Bangalore City Traffic & Daily Office Commutes', type: 'City Commute' },
                  ].map((v, i) => (
                    <div key={i} className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle size={15} className="text-emerald-600 shrink-0" />
                        <span className="text-xs font-bold text-slate-800">{v.label}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Verifications & Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 text-center">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-emerald-600 font-black text-sm block">✓ Aadhaar Verified</span>
                  <span className="text-[10px] text-slate-500">Government ID Verified</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-emerald-600 font-black text-sm block">✓ DL Background Checked</span>
                  <span className="text-[10px] text-slate-500">Clear RTO Record</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-emerald-600 font-black text-sm block">✓ Non-Smoker & Teetotaler</span>
                  <span className="text-[10px] text-slate-500">Professional Etiquette</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-emerald-600 font-black text-sm block">✓ Western Ghats Expert</span>
                  <span className="text-[10px] text-slate-500">Coorg, Ooty, Chikmagalur</span>
                </div>
              </div>

            </div>
          </div>

          {/* 3. Transparent Market Price Comparison Table for White Board Driver */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
            <div className="mb-6">
              <span className="text-xs font-black uppercase tracking-wider text-[#FF7020]">
                Market Benchmark & Fair Tariff Policy
              </span>
              <h3 className="text-2xl font-black text-[#0A3D73] font-display mt-1">
                Transparent Driver-On-Demand Pricing
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Standard offline market drivers charge varying hidden fees. Here is our completely transparent driver tariff for your personal car:
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#0A3D73] text-white">
                    <th className="py-3 px-4 rounded-tl-xl font-black">Duty Type</th>
                    <th className="py-3 px-4 font-black">Duration / Coverage</th>
                    <th className="py-3 px-4 font-black">Standard Market Rate</th>
                    <th className="py-3 px-4 font-black text-amber-300">BookMyRoute Rate</th>
                    <th className="py-3 px-4 rounded-tr-xl font-black">Driver Entitlement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr className="hover:bg-slate-50">
                    <td className="py-3.5 px-4 font-bold text-slate-900">City Short Duty</td>
                    <td className="py-3.5 px-4">Up to 4 Hours (Within City)</td>
                    <td className="py-3.5 px-4 line-through text-slate-400">₹550 - ₹600</td>
                    <td className="py-3.5 px-4 font-black text-emerald-700 bg-emerald-50/50">₹499</td>
                    <td className="py-3.5 px-4 text-slate-500">Local commute, hospital visit, shopping</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-3.5 px-4 font-bold text-slate-900">City Standard Duty</td>
                    <td className="py-3.5 px-4">Up to 8 Hours / 80 KM</td>
                    <td className="py-3.5 px-4 line-through text-slate-400">₹900 - ₹1,000</td>
                    <td className="py-3.5 px-4 font-black text-emerald-700 bg-emerald-50/50">₹799</td>
                    <td className="py-3.5 px-4 text-slate-500">Full day meetings, weddings, local sightseeing</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-3.5 px-4 font-bold text-slate-900">City Full Day Duty</td>
                    <td className="py-3.5 px-4">Up to 12 Hours</td>
                    <td className="py-3.5 px-4 line-through text-slate-400">₹1,200 - ₹1,400</td>
                    <td className="py-3.5 px-4 font-black text-emerald-700 bg-emerald-50/50">₹1,099</td>
                    <td className="py-3.5 px-4 text-slate-500">Extended day city events & airport transfers</td>
                  </tr>
                  <tr className="hover:bg-slate-50 bg-amber-50/30">
                    <td className="py-3.5 px-4 font-bold text-slate-900">Outstation Round Trip</td>
                    <td className="py-3.5 px-4 font-semibold">Per Calendar Day (Ghats & Highways)</td>
                    <td className="py-3.5 px-4 line-through text-slate-400">₹1,300 - ₹1,500 / day</td>
                    <td className="py-3.5 px-4 font-black text-[#0A3D73] bg-amber-100/50 text-sm">₹1,199 / day</td>
                    <td className="py-3.5 px-4 text-slate-600">Customer provides basic food & lodging during stay</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-3.5 px-4 font-bold text-slate-900">Night Allowance</td>
                    <td className="py-3.5 px-4">10:00 PM to 06:00 AM</td>
                    <td className="py-3.5 px-4 line-through text-slate-400">₹250 / night</td>
                    <td className="py-3.5 px-4 font-black text-emerald-700 bg-emerald-50/50">₹200 / night</td>
                    <td className="py-3.5 px-4 text-slate-500">Applicable only if driving after 10:00 PM</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-3.5 px-4 font-bold text-slate-900">Luxury / EV Specialist Surcharge</td>
                    <td className="py-3.5 px-4">BMW, Mercedes, Audi, Volvo, High-Tech EVs</td>
                    <td className="py-3.5 px-4 line-through text-slate-400">₹400 / day</td>
                    <td className="py-3.5 px-4 font-black text-emerald-700 bg-emerald-50/50">₹200 / day</td>
                    <td className="py-3.5 px-4 text-slate-500">Driver certified in luxury electronic cockpits</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between text-xs text-slate-700">
              <span className="font-semibold">💡 No advance deposit required. Pay driver directly after duty completion.</span>
              <button
                onClick={() => {
                  setIsHireModalOpen(true);
                  setHireSuccess(false);
                }}
                className="bg-[#0A3D73] text-white font-bold px-4 py-1.5 rounded-lg hover:bg-[#072d54] cursor-pointer"
              >
                Book Driver Now →
              </button>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: DRIVER ONBOARDING FORM */}
      {activeTab === 'onboarding' && (
        <div className="container-x max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-lg">
            
            <div className="text-center max-w-2xl mx-auto mb-8">
              <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-black uppercase px-3 py-1 rounded-full mb-2">
                <CheckCircle size={14} /> Join BookMyRoute Chauffeur Network
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0A3D73] font-display">
                Driver Onboarding & License Verification
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Are you a skilled, courteous personal car driver? Submit your driving license and details below. Our team verifies your credentials and connects you with high-paying daily and outstation trips.
              </p>
            </div>

            {onboardSubmitted ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center space-y-4">
                <CheckCircle size={48} className="text-emerald-600 mx-auto" />
                <h3 className="text-xl font-black text-emerald-900">Application Submitted for Verification!</h3>
                <p className="text-xs sm:text-sm text-emerald-800 max-w-lg mx-auto">
                  Thank you, <strong>{onboardForm.fullName}</strong>. Your driving license details and profile have been sent to our verification desk on WhatsApp (+91 72593 35286). We will complete background checks and contact you within 24 hours.
                </p>
                <button
                  onClick={() => setOnboardSubmitted(false)}
                  className="bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-emerald-800"
                >
                  Submit Another Application
                </button>
              </div>
            ) : (
              <form onSubmit={handleOnboardSubmit} className="space-y-6">
                
                {/* 1. Personal & Contact Details */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
                    1. Driver Personal Information
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Full Name (as per Driving License) *
                      </label>
                      <input
                        type="text"
                        required
                        value={onboardForm.fullName}
                        onChange={(e) => setOnboardForm({ ...onboardForm, fullName: e.target.value })}
                        placeholder="e.g. Ramesh Kumar"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0A3D73]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Mobile Number (WhatsApp Enabled) *
                      </label>
                      <input
                        type="tel"
                        required
                        value={onboardForm.mobileNumber}
                        onChange={(e) => setOnboardForm({ ...onboardForm, mobileNumber: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0A3D73]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Current Area / Location in Bangalore *
                      </label>
                      <input
                        type="text"
                        required
                        value={onboardForm.cityArea}
                        onChange={(e) => setOnboardForm({ ...onboardForm, cityArea: e.target.value })}
                        placeholder="e.g. Jayanagar, Whitefield, Hebbal, Yelahanka"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0A3D73]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Total Driving Experience *
                      </label>
                      <select
                        value={onboardForm.experienceYears}
                        onChange={(e) => setOnboardForm({ ...onboardForm, experienceYears: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0A3D73]"
                      >
                        <option value="3 to 5 Years">3 to 5 Years Experience</option>
                        <option value="5 to 8 Years">5 to 8 Years Experience</option>
                        <option value="8 to 12 Years">8 to 12 Years Experience</option>
                        <option value="12+ Years">12+ Years Veteran Chauffeur</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 2. License & ID Verification */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
                    2. Driving License (DL) & ID Verification Details
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Driving License (DL) Number *
                      </label>
                      <input
                        type="text"
                        required
                        value={onboardForm.dlNumber}
                        onChange={(e) => setOnboardForm({ ...onboardForm, dlNumber: e.target.value.toUpperCase() })}
                        placeholder="KA05 20180012345"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold uppercase focus:outline-none focus:ring-2 focus:ring-[#0A3D73]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        License Category *
                      </label>
                      <select
                        value={onboardForm.dlType}
                        onChange={(e) => setOnboardForm({ ...onboardForm, dlType: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0A3D73]"
                      >
                        <option value="LMV - Light Motor Vehicle">LMV - Light Motor Vehicle (Personal Car)</option>
                        <option value="LMV-TR - Commercial Transport">LMV-TR - Commercial Transport</option>
                        <option value="HMV / Heavy Vehicle">HMV / Heavy Vehicle</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Aadhaar Number (Last 4 digits or full)
                      </label>
                      <input
                        type="text"
                        value={onboardForm.aadhaarNumber}
                        onChange={(e) => setOnboardForm({ ...onboardForm, aadhaarNumber: e.target.value })}
                        placeholder="XXXX XXXX 1234"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0A3D73]"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Vehicle Capabilities */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
                    3. Driving Capabilities & Background
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Gear / Transmission Capability *
                      </label>
                      <select
                        value={onboardForm.transmissionSkill}
                        onChange={(e) => setOnboardForm({ ...onboardForm, transmissionSkill: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0A3D73]"
                      >
                        <option value="Both Manual & Automatic">Both Manual & Automatic</option>
                        <option value="Manual Transmission Only">Manual Transmission Only</option>
                        <option value="Automatic Transmission Only">Automatic Transmission Only</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Previous Driving Background
                      </label>
                      <input
                        type="text"
                        value={onboardForm.previousExperience}
                        onChange={(e) => setOnboardForm({ ...onboardForm, previousExperience: e.target.value })}
                        placeholder="e.g. Private family driver, corporate VIP driver"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0A3D73]"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Verification Document & Photo Uploads (DL & Profile Photo) */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                      4. Upload Verification Documents (Driving License & Photo)
                    </h4>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                      <ShieldCheck size={12} /> Instant 100% Verification
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Driver Profile Photo */}
                    <div className="bg-slate-50 border-2 border-dashed border-slate-200 hover:border-[#0A3D73] rounded-2xl p-4 transition-colors">
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        Driver Profile Photo *
                      </label>
                      <p className="text-[11px] text-slate-500 mb-3">Clear selfie or passport-style headshot</p>

                      {driverPhotoPreview ? (
                        <div className="space-y-2">
                          <img
                            src={driverPhotoPreview}
                            alt="Driver Photo Preview"
                            className="w-full h-32 object-cover rounded-xl border border-slate-200"
                          />
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="truncate max-w-[150px] font-medium text-slate-700">
                              {driverPhotoFile?.name}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setDriverPhotoFile(null);
                                setDriverPhotoPreview('');
                              }}
                              className="text-red-600 hover:text-red-700 font-bold cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center h-32 cursor-pointer bg-white rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
                          <Camera size={26} className="text-slate-400 mb-1.5" />
                          <span className="text-xs font-bold text-[#0A3D73]">Upload Photo</span>
                          <span className="text-[10px] text-slate-400">JPG, PNG, WebP</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoUpload}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>

                    {/* Driving License Front */}
                    <div className="bg-slate-50 border-2 border-dashed border-slate-200 hover:border-[#0A3D73] rounded-2xl p-4 transition-colors">
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        Driving License (Front Side) *
                      </label>
                      <p className="text-[11px] text-slate-500 mb-3">Photo showing DL number & validity</p>

                      {dlFrontPreview ? (
                        <div className="space-y-2">
                          <img
                            src={dlFrontPreview}
                            alt="DL Front Preview"
                            className="w-full h-32 object-cover rounded-xl border border-slate-200"
                          />
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="truncate max-w-[150px] font-medium text-slate-700">
                              {dlFrontFile?.name}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setDlFrontFile(null);
                                setDlFrontPreview('');
                              }}
                              className="text-red-600 hover:text-red-700 font-bold cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center h-32 cursor-pointer bg-white rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
                          <UploadCloud size={26} className="text-slate-400 mb-1.5" />
                          <span className="text-xs font-bold text-[#0A3D73]">Upload DL Front</span>
                          <span className="text-[10px] text-slate-400">JPG, PNG, PDF</span>
                          <input
                            type="file"
                            accept="image/*,application/pdf"
                            onChange={handleDlFrontUpload}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>

                    {/* Driving License Back */}
                    <div className="bg-slate-50 border-2 border-dashed border-slate-200 hover:border-[#0A3D73] rounded-2xl p-4 transition-colors">
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        Driving License (Back Side)
                      </label>
                      <p className="text-[11px] text-slate-500 mb-3">Showing vehicle classes & address</p>

                      {dlBackPreview ? (
                        <div className="space-y-2">
                          <img
                            src={dlBackPreview}
                            alt="DL Back Preview"
                            className="w-full h-32 object-cover rounded-xl border border-slate-200"
                          />
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="truncate max-w-[150px] font-medium text-slate-700">
                              {dlBackFile?.name}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setDlBackFile(null);
                                setDlBackPreview('');
                              }}
                              className="text-red-600 hover:text-red-700 font-bold cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center h-32 cursor-pointer bg-white rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
                          <UploadCloud size={26} className="text-slate-400 mb-1.5" />
                          <span className="text-xs font-bold text-[#0A3D73]">Upload DL Back</span>
                          <span className="text-[10px] text-slate-400">JPG, PNG, PDF</span>
                          <input
                            type="file"
                            accept="image/*,application/pdf"
                            onChange={handleDlBackUpload}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  </div>

                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-xs text-amber-900">
                    <input
                      type="checkbox"
                      id="cleanRecord"
                      checked={onboardForm.noAccidentRecord}
                      onChange={(e) => setOnboardForm({ ...onboardForm, noAccidentRecord: e.target.checked })}
                      className="rounded text-[#0A3D73] focus:ring-0"
                    />
                    <label htmlFor="cleanRecord" className="font-semibold cursor-pointer">
                      I declare that I hold an authentic Indian Driving License with a clean traffic record, no criminal complaints, and follow strict non-smoking professional etiquette.
                    </label>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full bg-[#25D366] hover:bg-[#1ebd5a] text-white font-black text-sm py-4 rounded-xl shadow-lg transition-transform hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageSquare size={18} />
                  <span>Submit Application & Verification Documents to WhatsApp (+91 72593 35286)</span>
                </button>
              </form>
            )}

          </div>
        </div>
      )}

      {/* HIRE YESHWANTH K MODAL */}
      {isHireModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setIsHireModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-black text-base"
            >
              ✕
            </button>

            <div className="mb-4">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                Verified Chauffeur
              </span>
              <h3 className="text-xl font-black text-[#0A3D73] mt-1">Hire Yeshwanth K</h3>
              <p className="text-xs text-slate-500">Provide trip details. Instant quotation sent to WhatsApp.</p>
            </div>

            <form onSubmit={handleHireSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-0.5">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={hireForm.customerName}
                  onChange={(e) => setHireForm({ ...hireForm, customerName: e.target.value })}
                  placeholder="e.g. Anand Sharma"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-0.5">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    value={hireForm.customerPhone}
                    onChange={(e) => setHireForm({ ...hireForm, customerPhone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-0.5">Duty Type</label>
                  <select
                    value={hireForm.tripType}
                    onChange={(e) => setHireForm({ ...hireForm, tripType: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold"
                  >
                    <option value="Local 8 Hrs (₹799)">Local 8 Hrs (₹799)</option>
                    <option value="Local 4 Hrs (₹499)">Local 4 Hrs (₹499)</option>
                    <option value="Outstation Trip (₹1,199/day)">Outstation Trip (₹1,199/day)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-0.5">Travel Date</label>
                  <input
                    type="date"
                    required
                    value={hireForm.tripDate}
                    onChange={(e) => setHireForm({ ...hireForm, tripDate: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-0.5">Your Car Model</label>
                  <input
                    type="text"
                    value={hireForm.yourCarModel}
                    onChange={(e) => setHireForm({ ...hireForm, yourCarModel: e.target.value })}
                    placeholder="e.g. Dzire / Etios / Creta / Innova / Fortuner (Sedan & SUV)"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-0.5">Pickup Location in Bangalore *</label>
                <input
                  type="text"
                  required
                  value={hireForm.pickupAddress}
                  onChange={(e) => setHireForm({ ...hireForm, pickupAddress: e.target.value })}
                  placeholder="e.g. Jayanagar 4th Block"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-0.5">Destination / Route</label>
                <input
                  type="text"
                  value={hireForm.destination}
                  onChange={(e) => setHireForm({ ...hireForm, destination: e.target.value })}
                  placeholder="e.g. Coorg, Ooty, or City Local"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#FF7020] hover:bg-[#e05f15] text-white font-black py-3 rounded-xl shadow-md transition-all mt-3"
              >
                Confirm & Send Request to Yeshwanth K
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
