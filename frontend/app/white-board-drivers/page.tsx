'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Car, ShieldCheck, Phone, Star, MapPin, CheckCircle, 
  Sparkles, MessageSquare, ArrowRight, Clock, Award, 
  Fuel, Check, X, Shield, Calendar, Compass, UserCheck,
  FileText, UploadCloud, ChevronRight, HelpCircle, AlertCircle, 
  Camera, Image as ImageIcon, CheckCircle2, Navigation,
  Briefcase, Moon, DollarSign, Users, KeyRound
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
  const driver = WHITE_BOARD_DRIVERS[0]; // Yeshwanth K details

  // Active section tab: 'hire' (hire driver / view pricing) or 'onboarding' (driver join form)
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
    tripType: 'Local 8Hr (Bangalore City)',
    tripDate: '',
    durationDays: '1',
    pickupAddress: '',
    destination: '',
    yourCarModel: 'Sedan / SUV',
    transmission: 'Automatic'
  });
  const [hireSuccess, setHireSuccess] = useState(false);
  const [isSubmittingHire, setIsSubmittingHire] = useState(false);

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

  const calculateDriverFare = () => {
    if (hireForm.tripType.includes('Local 4Hr')) return 499;
    if (hireForm.tripType.includes('Local 8Hr')) return 899;
    if (hireForm.tripType.includes('Outstation Round')) {
      const days = parseInt(hireForm.durationDays) || 1;
      return days * 1200;
    }
    if (hireForm.tripType.includes('One-Way')) return 1499;
    return 899;
  };

  const handleHireSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingHire(true);

    const calculatedFare = calculateDriverFare();

    const text = `*🚗 BookMyRoute - Hire Verified Driver for Personal Car*
----------------------------------------
*Driver Service:* Verified Personal Chauffeur
*Customer Name:* ${hireForm.customerName}
*Customer Mobile:* +91 ${hireForm.customerPhone.replace(/^\+?91/, '').trim()}
*Trip Package:* ${hireForm.tripType}
*Duration:* ${hireForm.durationDays} Day(s)
*Travel Date:* ${hireForm.tripDate || 'Immediate / Scheduled'}
*Pickup Address:* ${hireForm.pickupAddress}
*Destination / Route:* ${hireForm.destination || 'Bangalore City'}
*Customer Car:* ${hireForm.yourCarModel} (${hireForm.transmission})
*Estimated Fare:* ₹${calculatedFare} (Market Rate)
----------------------------------------
_Please confirm chauffeur dispatch and quotation for my car._`;

    // Save lead to backend and trigger email to bookmyroute06@gmail.com
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: hireForm.customerName,
          phone: hireForm.customerPhone,
          service: `White Board Driver (${hireForm.tripType})`,
          pickup: hireForm.pickupAddress,
          destination: hireForm.destination || 'Bangalore City',
          travelDate: hireForm.tripDate,
          passengers: 1,
          vehicle: `${hireForm.yourCarModel} (${hireForm.transmission})`,
          totalFare: calculatedFare,
          status: 'DRIVER_ENQUIRY',
          source: 'White Board Drivers Page'
        })
      });
    } catch (err) {
      console.error('Lead error', err);
    }

    setIsSubmittingHire(false);
    window.open(`https://wa.me/${CONTACT_PHONE_WA}?text=${encodeURIComponent(text)}`, '_blank');
    setHireSuccess(true);
  };

  const handleOnboardSubmit = async (e: React.FormEvent) => {
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
_Applicant has submitted onboarding details on BookMyRoute._`;

    // Save driver application to leads API
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `[DRIVER APPLICATION] ${onboardForm.fullName}`,
          phone: onboardForm.mobileNumber,
          service: 'Driver Partner Onboarding',
          pickup: onboardForm.cityArea,
          destination: 'Bangalore Chauffeur Fleet',
          status: 'DRIVER_ENQUIRY',
          source: 'Driver Partner Portal',
          notes: `DL: ${onboardForm.dlNumber}, Experience: ${onboardForm.experienceYears}, Transmission: ${onboardForm.transmissionSkill}`
        })
      });
    } catch {}

    window.open(`https://wa.me/${CONTACT_PHONE_WA}?text=${encodeURIComponent(text)}`, '_blank');
    setOnboardSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-20 font-sans">
      
      {/* 1. Official Banner (Edge-to-Edge) */}
      <section className="relative w-full bg-[#0A3D73] overflow-hidden mb-6 shadow-md -mt-2">
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

      {/* TAB 1: HIRE DRIVER & VIEW MARKET PRICING (DRIVEU PATTERN) */}
      {activeTab === 'hire' && (
        <div className="container-x max-w-6xl mx-auto px-4 space-y-12">

          {/* DriveU Hero Header */}
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-black uppercase tracking-wider text-[#FF7020] bg-orange-50 px-3 py-1 rounded-full border border-orange-200/60 inline-flex items-center gap-1.5 mb-3">
              <ShieldCheck size={14} className="text-[#0A3D73]" />
              <span>Bangalore's Most Trusted Driver Network</span>
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#0A3D73] font-display tracking-tight">
              Hire Temporary & Professional Drivers at Your Convenience
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
              Sit back and relax in your personal car (White Board). Verified, background-checked chauffeurs for daily city commutes, late-night events, outstation road trips & corporate travel.
            </p>
          </div>

          {/* DriveU 4 Trust Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow text-center">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0A3D73] flex items-center justify-center mx-auto mb-3">
                <ShieldCheck size={24} />
              </div>
              <h3 className="font-black text-slate-900 text-sm mb-1">100% Verified Trust</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Comprehensive background checks, police verification & RTO commercial driving license authentication.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow text-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-3">
                <Car size={24} />
              </div>
              <h3 className="font-black text-slate-900 text-sm mb-1">Secure & Skilled</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Expert handling of Hatchbacks, Sedans, Full SUVs, EVs, Manual & Automatic transmissions without worry.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow text-center">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#FF7020] flex items-center justify-center mx-auto mb-3">
                <Clock size={24} />
              </div>
              <h3 className="font-black text-slate-900 text-sm mb-1">Versatile & On-Demand</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Flexible packages from 4-hour city errands to multi-day outstation road trips across Karnataka & India.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow text-center">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center mx-auto mb-3">
                <Phone size={24} />
              </div>
              <h3 className="font-black text-slate-900 text-sm mb-1">Punctual & Supported</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Guaranteed on-time arrival at your doorstep in Bangalore with 24/7 route helpline support ({CONTACT_PHONE}).
              </p>
            </div>
          </div>

          {/* DriveU Transparent Market Pricing Cards */}
          <div>
            <div className="text-center mb-6">
              <span className="text-xs font-black uppercase tracking-wider text-[#FF7020]">Transparent Market Tariff</span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-display mt-0.5">
                Standard Driver Hire Charges (Zero Hidden Costs)
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              
              {/* Plan 1: 4 Hours Local */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:border-[#0A3D73] transition-all flex flex-col justify-between">
                <div>
                  <span className="bg-blue-50 text-[#0A3D73] text-[10px] font-black uppercase px-2.5 py-1 rounded-md">
                    Short Errand
                  </span>
                  <h4 className="font-black text-base text-slate-900 mt-2">Local City (4 Hours)</h4>
                  <div className="mt-3 mb-4">
                    <span className="text-3xl font-black text-[#0A3D73] font-mono">₹499</span>
                    <span className="text-xs text-slate-400 font-medium"> / 4 Hours</span>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-600 mb-6">
                    <li className="flex items-center gap-1.5"><Check size={14} className="text-emerald-600" /> Up to 40 KM driving in Bangalore</li>
                    <li className="flex items-center gap-1.5"><Check size={14} className="text-emerald-600" /> Extra hour @ ₹99 / hr</li>
                    <li className="flex items-center gap-1.5"><Check size={14} className="text-emerald-600" /> Shopping, hospital & meetings</li>
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setHireForm({ ...hireForm, tripType: 'Local 4Hr (Bangalore City)' });
                    setIsHireModalOpen(true);
                  }}
                  className="w-full bg-slate-900 hover:bg-black text-white font-black text-xs py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  Book 4-Hr Driver
                </button>
              </div>

              {/* Plan 2: 8 Hours Local (POPULAR) */}
              <div className="bg-white rounded-3xl p-6 border-2 border-[#0A3D73] shadow-md relative flex flex-col justify-between">
                <div className="absolute -top-3 right-5 bg-[#FF7020] text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-sm">
                  Most Popular
                </div>
                <div>
                  <span className="bg-blue-50 text-[#0A3D73] text-[10px] font-black uppercase px-2.5 py-1 rounded-md">
                    Full Day City
                  </span>
                  <h4 className="font-black text-base text-slate-900 mt-2">Local City (8 Hours)</h4>
                  <div className="mt-3 mb-4">
                    <span className="text-3xl font-black text-[#0A3D73] font-mono">₹899</span>
                    <span className="text-xs text-slate-400 font-medium"> / 8 Hours</span>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-600 mb-6">
                    <li className="flex items-center gap-1.5"><Check size={14} className="text-emerald-600" /> Up to 80 KM driving in Bangalore</li>
                    <li className="flex items-center gap-1.5"><Check size={14} className="text-emerald-600" /> Extra hour @ ₹99 / hr</li>
                    <li className="flex items-center gap-1.5"><Check size={14} className="text-emerald-600" /> Office commute & day-long visits</li>
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setHireForm({ ...hireForm, tripType: 'Local 8Hr (Bangalore City)' });
                    setIsHireModalOpen(true);
                  }}
                  className="w-full bg-[#0A3D73] hover:bg-[#072f59] text-white font-black text-xs py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  Book 8-Hr Driver
                </button>
              </div>

              {/* Plan 3: Outstation Round Trip */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:border-[#0A3D73] transition-all flex flex-col justify-between">
                <div>
                  <span className="bg-emerald-50 text-emerald-800 text-[10px] font-black uppercase px-2.5 py-1 rounded-md">
                    Highway Specialist
                  </span>
                  <h4 className="font-black text-base text-slate-900 mt-2">Outstation Round Trip</h4>
                  <div className="mt-3 mb-4">
                    <span className="text-3xl font-black text-[#0A3D73] font-mono">₹1,200</span>
                    <span className="text-xs text-slate-400 font-medium"> / Day (12 Hrs)</span>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-600 mb-6">
                    <li className="flex items-center gap-1.5"><Check size={14} className="text-emerald-600" /> Coorg, Ooty, Chikmagalur, Goa</li>
                    <li className="flex items-center gap-1.5"><Check size={14} className="text-emerald-600" /> Ghat roads & expressway expert</li>
                    <li className="flex items-center gap-1.5"><Check size={14} className="text-emerald-600" /> Night bata ₹300 (10 PM - 6 AM)</li>
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setHireForm({ ...hireForm, tripType: 'Outstation Round Trip (Personal Car)' });
                    setIsHireModalOpen(true);
                  }}
                  className="w-full bg-slate-900 hover:bg-black text-white font-black text-xs py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  Book Outstation Chauffeur
                </button>
              </div>

              {/* Plan 4: One-Way Outstation Drop */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:border-[#0A3D73] transition-all flex flex-col justify-between">
                <div>
                  <span className="bg-amber-50 text-amber-800 text-[10px] font-black uppercase px-2.5 py-1 rounded-md">
                    One-Way Relocation
                  </span>
                  <h4 className="font-black text-base text-slate-900 mt-2">One-Way City Drop</h4>
                  <div className="mt-3 mb-4">
                    <span className="text-3xl font-black text-[#0A3D73] font-mono">₹1,499</span>
                    <span className="text-xs text-slate-400 font-medium"> / Fixed Drop</span>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-600 mb-6">
                    <li className="flex items-center gap-1.5"><Check size={14} className="text-emerald-600" /> Drops to Mysore, Hassan, Tumkur</li>
                    <li className="flex items-center gap-1.5"><Check size={14} className="text-emerald-600" /> Driver return allowance included</li>
                    <li className="flex items-center gap-1.5"><Check size={14} className="text-emerald-600" /> Safe transit of your personal car</li>
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setHireForm({ ...hireForm, tripType: 'One-Way Outstation City Drop' });
                    setIsHireModalOpen(true);
                  }}
                  className="w-full bg-slate-900 hover:bg-black text-white font-black text-xs py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  Book One-Way Driver
                </button>
              </div>

            </div>
          </div>

          {/* DriveU Use Cases Section */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
            <h3 className="text-xl font-black text-slate-900 font-display mb-6 text-center">
              Why Bangalore Vehicle Owners Hire Our Chauffeurs
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#FF7020] flex items-center justify-center mb-3">
                  <Compass size={20} />
                </div>
                <h4 className="font-black text-slate-900 text-sm mb-1">Outstation Family Trips</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Avoid driver fatigue on Bangalore-Mysore expressway and steep Western Ghat hairpins. Enjoy scenic sights with your family while our professional chauffeur drives your car smoothly.
                </p>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#0A3D73] flex items-center justify-center mb-3">
                  <Briefcase size={20} />
                </div>
                <h4 className="font-black text-slate-900 text-sm mb-1">Corporate & Business Travel</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Make conference calls, prepare presentations, and arrive composed at meetings in Whitefield, Electronic City or Embassy Golf Links while your chauffeur handles Bangalore traffic.
                </p>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                  <Moon size={20} />
                </div>
                <h4 className="font-black text-slate-900 text-sm mb-1">Late Night Drives & Weddings</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Enjoy late-night parties, weddings, or family get-togethers without stressing about driving home late. Our verified chauffeurs guarantee safe doorstep arrival.
                </p>
              </div>
            </div>
          </div>

          {/* Verified Chauffeur Roster (NO DRIVER IMAGE - DETAILS & VERIFIED CREDENTIALS ONLY) */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#0A3D73] text-white flex items-center justify-center font-black text-lg shadow-sm">
                  <ShieldCheck size={26} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-slate-900">
                      Verified Personal Chauffeur Roster (Bangalore)
                    </h3>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full">
                      ✓ RTO Authenticated
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Lead Chauffeur: {driver.name} (10+ Yrs Exp) & Certified Drivers Team
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`tel:${CONTACT_PHONE_TEL}`}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2 px-3.5 rounded-xl transition-all flex items-center gap-1.5"
                >
                  <Phone size={13} />
                  <span>Call {CONTACT_PHONE}</span>
                </a>

                <button
                  type="button"
                  onClick={() => setIsHireModalOpen(true)}
                  className="bg-[#0A3D73] hover:bg-[#072f59] text-white font-black text-xs py-2 px-4 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Car size={14} />
                  <span>Request Driver</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="space-y-3">
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                  Vehicle Expertise & Transmission:
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-700 block">Sedan Models:</span>
                    <span className="text-slate-500 text-[11px]">Dzire, Etios, Honda City, Verna, Virtus</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-700 block">SUV & MPV Models:</span>
                    <span className="text-slate-500 text-[11px]">Innova Crysta, Fortuner, XUV700, Creta, Brezza</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-700 block">Transmission:</span>
                    <span className="text-slate-500 text-[11px]">Both Manual & Automatic (Torque, CVT, DCT)</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-700 block">Highway Certified:</span>
                    <span className="text-slate-500 text-[11px]">Ghat Sections, Night Driving, Expressways</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                  Verification & Safety Standards:
                </h4>
                <div className="space-y-2 text-slate-600">
                  <p className="flex items-center gap-2"><CheckCircle size={14} className="text-emerald-600" /> Government RTO Commercial Driving License Verified</p>
                  <p className="flex items-center gap-2"><CheckCircle size={14} className="text-emerald-600" /> Police Clearance & Background Verified</p>
                  <p className="flex items-center gap-2"><CheckCircle size={14} className="text-emerald-600" /> Non-Smoker, Courteous & Punctual Etiquette</p>
                  <p className="flex items-center gap-2"><CheckCircle size={14} className="text-emerald-600" /> Languages: Kannada, English, Hindi & Telugu</p>
                </div>
              </div>
            </div>

          </div>

          {/* Quick FAQ Strip */}
          <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div>
              <span className="font-black text-[#0A3D73] block text-sm">Need a driver within the next 2 hours in Bangalore?</span>
              <span className="text-slate-600">Call our direct dispatch desk for express assignment across all Bangalore zones.</span>
            </div>
            <a
              href={`tel:${CONTACT_PHONE_TEL}`}
              className="bg-[#0A3D73] hover:bg-[#072f59] text-white font-black text-xs py-2.5 px-5 rounded-xl transition-all shadow-xs shrink-0 flex items-center gap-1.5"
            >
              <Phone size={14} />
              <span>Call Helpline ({CONTACT_PHONE})</span>
            </a>
          </div>

        </div>
      )}

      {/* TAB 2: DRIVER ONBOARDING (JOIN AS DRIVER) */}
      {activeTab === 'onboarding' && (
        <div className="container-x max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200">
            <div className="text-center max-w-xl mx-auto mb-8">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Chauffeur Partner Portal
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-display mt-2">
                Join BookMyRoute as a Verified Personal Driver
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Earn ₹35,000 to ₹55,000/month driving customer personal cars. Upload your DL and details to get verified.
              </p>
            </div>

            {onboardSubmitted ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 text-center space-y-3">
                <CheckCircle size={48} className="text-emerald-600 mx-auto" />
                <h3 className="text-xl font-black text-slate-900">Application Submitted Successfully!</h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Our dispatch manager will review your DL details and contact you on WhatsApp (+91 {onboardForm.mobileNumber}) within 2 hours for document verification.
                </p>
                <button
                  type="button"
                  onClick={() => setOnboardSubmitted(false)}
                  className="bg-[#0A3D73] text-white text-xs font-black px-5 py-2.5 rounded-xl mt-3"
                >
                  Submit Another Application
                </button>
              </div>
            ) : (
              <form onSubmit={handleOnboardSubmit} className="space-y-6 text-xs">
                
                {/* Personal Information */}
                <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-2 mb-4 flex items-center gap-1.5">
                    <UserCheck size={16} className="text-emerald-600" />
                    <span>Personal Particulars</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Full Legal Name (as per DL) *</label>
                      <input
                        type="text"
                        required
                        value={onboardForm.fullName}
                        onChange={(e) => setOnboardForm({ ...onboardForm, fullName: e.target.value })}
                        placeholder="e.g. Ramesh K"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-semibold text-slate-800 text-base sm:text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">WhatsApp Mobile Number *</label>
                      <input
                        type="tel"
                        inputMode="tel"
                        required
                        value={onboardForm.mobileNumber}
                        onChange={(e) => setOnboardForm({ ...onboardForm, mobileNumber: e.target.value })}
                        placeholder="10-digit mobile number"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-semibold text-slate-800 text-base sm:text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Current Bangalore Location / Area *</label>
                      <input
                        type="text"
                        required
                        value={onboardForm.cityArea}
                        onChange={(e) => setOnboardForm({ ...onboardForm, cityArea: e.target.value })}
                        placeholder="e.g. Jayanagar, BTM, Uttarahalli, Whitefield"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-semibold text-slate-800 text-base sm:text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Total Driving Experience *</label>
                      <select
                        value={onboardForm.experienceYears}
                        onChange={(e) => setOnboardForm({ ...onboardForm, experienceYears: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-semibold text-slate-800 text-base sm:text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer"
                      >
                        <option>3 - 5 Years</option>
                        <option>5 - 8 Years</option>
                        <option>8 - 12 Years</option>
                        <option>12+ Years</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Driving License Particulars */}
                <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-2 mb-4 flex items-center gap-1.5">
                    <KeyRound size={16} className="text-[#0A3D73]" />
                    <span>Driving License & Skills</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">DL Number *</label>
                      <input
                        type="text"
                        required
                        value={onboardForm.dlNumber}
                        onChange={(e) => setOnboardForm({ ...onboardForm, dlNumber: e.target.value.toUpperCase() })}
                        placeholder="e.g. KA05 20150001234"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-mono font-semibold text-slate-800 text-base sm:text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Transmission Skill *</label>
                      <select
                        value={onboardForm.transmissionSkill}
                        onChange={(e) => setOnboardForm({ ...onboardForm, transmissionSkill: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-semibold text-slate-800 text-base sm:text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer"
                      >
                        <option>Both Manual & Automatic</option>
                        <option>Manual Only</option>
                        <option>Automatic Only</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Document Uploads (Photo, DL Front, DL Back) */}
                <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-2 mb-4 flex items-center gap-1.5">
                    <Camera size={16} className="text-[#FF7020]" />
                    <span>Upload Documents for Verification</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Driver Photo */}
                    <div className="border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center hover:border-emerald-500 transition-colors bg-slate-50/50">
                      <Camera size={24} className="mx-auto text-slate-400 mb-1" />
                      <span className="font-bold text-slate-800 block text-xs">Driver Profile Photo</span>
                      <span className="text-[10px] text-slate-400 block mb-2">Clear front face photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="text-[10px] w-full"
                      />
                      {driverPhotoFile && <span className="text-[10px] font-bold text-emerald-700 mt-1 block">✓ {driverPhotoFile.name}</span>}
                    </div>

                    {/* DL Front */}
                    <div className="border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center hover:border-emerald-500 transition-colors bg-slate-50/50">
                      <FileText size={24} className="mx-auto text-slate-400 mb-1" />
                      <span className="font-bold text-slate-800 block text-xs">DL Front Copy *</span>
                      <span className="text-[10px] text-slate-400 block mb-2">Photo & license number</span>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleDlFrontUpload}
                        className="text-[10px] w-full"
                      />
                      {dlFrontFile && <span className="text-[10px] font-bold text-emerald-700 mt-1 block">✓ {dlFrontFile.name}</span>}
                    </div>

                    {/* DL Back */}
                    <div className="border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center hover:border-emerald-500 transition-colors bg-slate-50/50">
                      <FileText size={24} className="mx-auto text-slate-400 mb-1" />
                      <span className="font-bold text-slate-800 block text-xs">DL Back Copy</span>
                      <span className="text-[10px] text-slate-400 block mb-2">Vehicle authorization & address</span>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleDlBackUpload}
                        className="text-[10px] w-full"
                      />
                      {dlBackFile && <span className="text-[10px] font-bold text-emerald-700 mt-1 block">✓ {dlBackFile.name}</span>}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-black text-sm py-3.5 px-6 rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldCheck size={18} />
                  <span>Submit Application for Approval</span>
                </button>
              </form>
            )}

          </div>
        </div>
      )}

      {/* HIRE DRIVER MODAL */}
      {isHireModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-slate-100 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => { setIsHireModalOpen(false); setHireSuccess(false); }}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 font-bold p-1 cursor-pointer"
            >
              ✕
            </button>

            <div className="mb-4">
              <span className="text-[10px] font-black uppercase text-[#FF7020] tracking-wider">Fast Chauffeur Booking</span>
              <h3 className="text-xl font-black text-[#0A3D73] font-display">
                Request a Verified Driver for Your Car
              </h3>
              <p className="text-xs text-slate-500">
                Package: <strong>{hireForm.tripType}</strong> • Standard Market Tariff
              </p>
            </div>

            {hireSuccess ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-2">
                <CheckCircle size={40} className="text-emerald-600 mx-auto" />
                <h4 className="font-black text-base text-slate-900">Driver Request Dispatched!</h4>
                <p className="text-xs text-slate-600">
                  Your details and quotation were sent to our operations desk ({CONTACT_PHONE}) and customer support email. A chauffeur will be confirmed shortly.
                </p>
                <button
                  onClick={() => setIsHireModalOpen(false)}
                  className="mt-3 bg-[#0A3D73] text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <form onSubmit={handleHireSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={hireForm.customerName}
                    onChange={(e) => setHireForm({ ...hireForm, customerName: e.target.value })}
                    placeholder="Enter full name"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-semibold text-slate-800 text-base sm:text-xs focus:outline-none focus:ring-2 focus:ring-[#0A3D73]"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Mobile / WhatsApp Number *</label>
                  <input
                    type="tel"
                    inputMode="tel"
                    required
                    value={hireForm.customerPhone}
                    onChange={(e) => setHireForm({ ...hireForm, customerPhone: e.target.value })}
                    placeholder="10-digit mobile number"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-semibold text-slate-800 text-base sm:text-xs focus:outline-none focus:ring-2 focus:ring-[#0A3D73]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Trip Service Type</label>
                    <select
                      value={hireForm.tripType}
                      onChange={(e) => setHireForm({ ...hireForm, tripType: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2.5 font-semibold text-slate-800 text-base sm:text-xs cursor-pointer"
                    >
                      <option>Local 4Hr (Bangalore City)</option>
                      <option>Local 8Hr (Bangalore City)</option>
                      <option>Outstation Round Trip (Personal Car)</option>
                      <option>One-Way Outstation City Drop</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Duration (Days)</label>
                    <input
                      type="number"
                      min="1"
                      max="15"
                      value={hireForm.durationDays}
                      onChange={(e) => setHireForm({ ...hireForm, durationDays: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2.5 font-semibold text-slate-800 text-base sm:text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Your Car Model *</label>
                    <input
                      type="text"
                      required
                      value={hireForm.yourCarModel}
                      onChange={(e) => setHireForm({ ...hireForm, yourCarModel: e.target.value })}
                      placeholder="e.g. Swift, Innova, Creta"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2.5 font-semibold text-slate-800 text-base sm:text-xs"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Transmission</label>
                    <select
                      value={hireForm.transmission}
                      onChange={(e) => setHireForm({ ...hireForm, transmission: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2.5 font-semibold text-slate-800 text-base sm:text-xs cursor-pointer"
                    >
                      <option>Automatic</option>
                      <option>Manual</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Pickup Address in Bangalore *</label>
                  <input
                    type="text"
                    required
                    value={hireForm.pickupAddress}
                    onChange={(e) => setHireForm({ ...hireForm, pickupAddress: e.target.value })}
                    placeholder="e.g. Uttarahalli, Indiranagar, Koramangala"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-semibold text-slate-800 text-base sm:text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Destination / Route (if outstation)</label>
                  <input
                    type="text"
                    value={hireForm.destination}
                    onChange={(e) => setHireForm({ ...hireForm, destination: e.target.value })}
                    placeholder="e.g. Coorg, Ooty, Mysore, Bangalore Local"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-semibold text-slate-800 text-base sm:text-xs"
                  />
                </div>

                <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-200 flex items-center justify-between">
                  <span className="font-bold text-slate-700">Estimated Driver Tariff:</span>
                  <span className="text-base font-black text-[#0A3D73] font-mono">
                    ₹{calculateDriverFare().toLocaleString()}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingHire}
                  className="w-full bg-[#0A3D73] hover:bg-[#072f59] text-white font-black text-xs py-3 px-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Car size={15} />
                  <span>{isSubmittingHire ? 'Dispatching Request...' : 'Confirm & Request Driver'}</span>
                </button>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
