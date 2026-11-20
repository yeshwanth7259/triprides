'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Logo from './Logo';
import { 
  MapPin, Phone, Mail, Ticket, ChevronDown, FileText, 
  Car, Home, Users, Sparkles, Menu, X 
} from 'lucide-react';
import { useBookingModal } from './BookingModalContext';
import { 
  CONTACT_PHONE, 
  CONTACT_PHONE_TEL, 
  CONTACT_PHONE_WA, 
  CONTACT_EMAIL, 
  OFFICE_ADDRESS 
} from '../lib/fleetData';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { openBookingModal } = useBookingModal();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-white'}`}>
      {/* Top Bar for Contact Info */}
      <div className="bg-[#0A3D73] text-blue-100 text-xs py-1.5 hidden md:block border-b border-blue-900/40">
        <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 flex justify-between items-center whitespace-nowrap">
          <div className="flex gap-6 items-center">
            <span className="flex items-center gap-1.5 hover:text-white transition-colors cursor-default">
              <MapPin size={13} className="text-[#FF7020] shrink-0" /> {OFFICE_ADDRESS}
            </span>
            <a href={`mailto:${CONTACT_EMAIL}`} className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Mail size={13} className="text-[#FF7020] shrink-0" /> {CONTACT_EMAIL}
            </a>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="/invoice" 
              className="text-amber-300 hover:text-white flex items-center gap-1 font-bold transition-colors"
            >
              <FileText size={12} className="shrink-0" /> Quotation & Invoice
            </Link>
            <span className="text-blue-300/60">|</span>
            <div className="flex items-center gap-1.5">
              <span className="text-blue-200 text-[11px]">24/7 Booking Helpline:</span>
              <a 
                href={`tel:${CONTACT_PHONE_TEL}`} 
                className="flex items-center gap-1 font-black text-white hover:text-[#FF7020] transition-colors"
              >
                <Phone size={12} className="text-[#FF7020] shrink-0" /> {CONTACT_PHONE}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Nav: Strictly ONE Single Line */}
      <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 h-[72px] flex items-center justify-between gap-2 xl:gap-4">
        
        {/* Logo with right spacing */}
        <div className="shrink-0 mr-1 xl:mr-3">
          <Logo />
        </div>
        
        {/* Desktop Navigation Links: Single line, no wrapping */}
        <nav className="hidden lg:flex items-center gap-3.5 xl:gap-5 2xl:gap-6 text-[13px] xl:text-[14px] font-semibold text-slate-700 whitespace-nowrap">
          <Link href="/" className="hover:text-[#0A3D73] transition-colors py-2">
            Home
          </Link>
          
          <Link href="/vehicles" className="hover:text-[#0A3D73] transition-colors py-2">
            Our Fleet
          </Link>

          {/* Villas & Homestays */}
          <Link 
            href="/homestays" 
            className="hover:text-[#0A3D73] transition-colors py-2 flex items-center gap-1.5"
          >
            <span>Homestays</span>
            <span className="bg-[#FF7020] text-white text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full shadow-xs">
              Stays
            </span>
          </Link>

          {/* White Board Drivers */}
          <Link 
            href="/white-board-drivers" 
            className="hover:text-[#0A3D73] transition-colors py-2 flex items-center gap-1.5"
          >
            <span>White Board Drivers</span>
            <span className="bg-emerald-600 text-white text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full shadow-xs">
              Verified
            </span>
          </Link>

          <Link href="/pricing" className="hover:text-[#0A3D73] transition-colors py-2">
            Pricing
          </Link>

          {/* Download Invoice */}
          <Link 
            href="/invoice" 
            className="hover:text-[#0A3D73] transition-colors py-2 flex items-center gap-1 text-[#0A3D73] font-bold"
          >
            <FileText size={14} className="text-[#FF7020] shrink-0" />
            <span>Invoice</span>
          </Link>

          {/* Rentals & Services Dropdown */}
          <div className="relative group">
            <button className="hover:text-[#0A3D73] transition-colors py-2 flex items-center gap-1 font-semibold cursor-pointer">
              <span>Services</span>
              <ChevronDown size={13} className="group-hover:rotate-180 transition-transform shrink-0" />
            </button>
            <div className="absolute top-full left-0 mt-0 w-[380px] bg-white shadow-2xl border border-slate-100 rounded-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all p-5 z-50 grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-[11px] font-black text-[#5CC13A] uppercase tracking-widest border-b border-slate-100 pb-2 mb-2.5">
                  Tempo Travellers
                </h4>
                <div className="space-y-1.5">
                  <Link href="/services/tempo-traveller-bangalore" className="block text-slate-700 hover:text-[#0A3D73] font-semibold text-xs">
                    • 12 Seater TT Bangalore
                  </Link>
                  <Link href="/services/tempo-traveller-bangalore" className="block text-slate-700 hover:text-[#0A3D73] font-semibold text-xs">
                    • 14 & 17 Seater Maharaja
                  </Link>
                  <Link href="/services/tempo-traveller-bangalore" className="block text-slate-700 hover:text-[#0A3D73] font-semibold text-xs">
                    • 20 Seater Tempo Traveller
                  </Link>
                </div>
              </div>

              <div>
                <h4 className="text-[11px] font-black text-[#5CC13A] uppercase tracking-widest border-b border-slate-100 pb-2 mb-2.5">
                  Buses & Cabs
                </h4>
                <div className="space-y-1.5">
                  <Link href="/services/bus-bangalore" className="block text-slate-700 hover:text-[#0A3D73] font-semibold text-xs">
                    • 21-25 Seater Mini Bus
                  </Link>
                  <Link href="/services/bus-bangalore" className="block text-slate-700 hover:text-[#0A3D73] font-semibold text-xs">
                    • 32-50 Seater Coach Bus
                  </Link>
                  <Link href="/vehicles" className="block text-slate-700 hover:text-[#0A3D73] font-semibold text-xs">
                    • Sedan & Innova Crysta
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <Link href="/support" className="hover:text-[#0A3D73] transition-colors py-2">
            Support
          </Link>
        </nav>
        
        {/* Right Action CTAs: strictly single line, no wrapping */}
        <div className="flex items-center gap-2 xl:gap-2.5 shrink-0 whitespace-nowrap">
          {/* Book Ride Button */}
          <button
            type="button"
            onClick={() => openBookingModal()}
            className="flex items-center gap-1.5 bg-[#FF7020] hover:bg-[#e55c0c] text-white font-black text-xs sm:text-sm px-3.5 sm:px-4 py-2.5 rounded-xl transition-all shadow-md hover:scale-102 active:scale-98 cursor-pointer whitespace-nowrap"
          >
            <Ticket size={15} className="shrink-0" />
            <span>Book Ride</span>
          </button>

          {/* Direct Phone Call Button */}
          <a 
            href={`tel:${CONTACT_PHONE_TEL}`} 
            className="hidden sm:flex items-center gap-1.5 border-2 border-[#0A3D73] text-[#0A3D73] hover:bg-[#0A3D73] hover:text-white font-bold text-xs sm:text-sm px-3 py-2 rounded-xl transition-colors whitespace-nowrap"
          >
            <Phone size={13} className="shrink-0" />
            <span>{CONTACT_PHONE}</span>
          </a>
          
          {/* Direct WhatsApp Button */}
          <a 
            href={`https://wa.me/${CONTACT_PHONE_WA}?text=Hi%2C%20I%20am%20looking%20for%20a%20vehicle%20or%20homestay%20booking%20quote%20on%20BookMyRoute.`} 
            target="_blank" 
            rel="noreferrer" 
            className="hidden md:flex items-center gap-1.5 bg-[#25D366] hover:bg-[#1ebd5a] text-white font-bold text-xs sm:text-sm px-3.5 py-2.5 rounded-xl transition-colors shadow-xs whitespace-nowrap"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" viewBox="0 0 16 16" className="shrink-0">
              <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
            </svg>
            <span>WhatsApp</span>
          </a>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-700 hover:text-[#0A3D73] rounded-xl hover:bg-slate-100 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-6 py-5 shadow-2xl animate-in slide-in-from-top duration-200">
          <div className="flex flex-col gap-3 font-semibold text-slate-800 text-sm">
            <Link 
              href="/" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-slate-100 hover:text-[#0A3D73]"
            >
              Home
            </Link>
            
            <Link 
              href="/vehicles" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-slate-100 hover:text-[#0A3D73]"
            >
              Our Fleet
            </Link>

            <Link 
              href="/homestays" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-slate-100 flex items-center justify-between text-[#0A3D73] font-bold"
            >
              <span>🏡 Villas & Homestays</span>
              <span className="bg-[#FF7020] text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                STAYS
              </span>
            </Link>

            <Link 
              href="/white-board-drivers" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-slate-100 flex items-center justify-between text-[#0A3D73] font-bold"
            >
              <span>🚗 White Board Drivers</span>
              <span className="bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                VERIFIED
              </span>
            </Link>

            <Link 
              href="/pricing" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-slate-100 hover:text-[#0A3D73]"
            >
              Pricing & Tariff
            </Link>

            <Link 
              href="/invoice" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-slate-100 flex items-center gap-2 text-slate-800 hover:text-[#0A3D73]"
            >
              <FileText size={16} className="text-[#FF7020]" />
              <span>Download Trip Invoice</span>
            </Link>

            <Link 
              href="/support" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-[#0A3D73]"
            >
              Support & Helpline
            </Link>

            <div className="pt-3 flex gap-2">
              <a
                href={`tel:${CONTACT_PHONE_TEL}`}
                className="flex-1 bg-[#0A3D73] text-white font-bold py-2.5 rounded-xl text-center text-xs flex items-center justify-center gap-1.5"
              >
                <Phone size={14} /> Call {CONTACT_PHONE}
              </a>
              <a
                href={`https://wa.me/${CONTACT_PHONE_WA}`}
                className="flex-1 bg-[#25D366] text-white font-bold py-2.5 rounded-xl text-center text-xs flex items-center justify-center gap-1.5"
              >
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
