'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Car, Phone, Ticket, Tag, Headset, X } from 'lucide-react';
import { useBookingModal } from './BookingModalContext';
import { CONTACT_PHONE, CONTACT_PHONE_TEL, CONTACT_PHONE_WA } from '../lib/fleetData';

export default function FloatingActions() {
  const pathname = usePathname();
  const { openBookingModal } = useBookingModal();
  const [showCallCard, setShowCallCard] = useState(false);

  return (
    <>
      {/* =========================================================================
          DUAL FLOATING WIDGET (CALL CENTER AGENT + WHATSAPP ICON) - MATCHES SCREENSHOT
          ========================================================================= */}
      <aside 
        aria-label="Instant Support & WhatsApp" 
        className="fixed bottom-20 md:bottom-8 right-4 sm:right-6 z-50 flex flex-col items-end gap-3 pointer-events-auto print:hidden"
      >
        {/* Quick Call Desk Card Popup when Call Avatar is clicked or hovered */}
        {showCallCard && (
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 w-72 mb-1 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
                  <Headset size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900">24/7 Booking Helpline</h4>
                  <p className="text-[10px] text-emerald-600 font-bold">● Operations Desk Online</p>
                </div>
              </div>
              <button 
                onClick={() => setShowCallCard(false)} 
                className="text-slate-400 hover:text-slate-600 font-bold text-xs p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-[11px] text-slate-600 leading-snug mb-3">
              Need instant quotation or vehicle dispatch? Talk directly to our Bangalore travel experts.
            </p>

            <a
              href={`tel:${CONTACT_PHONE_TEL}`}
              className="w-full bg-[#0A3D73] hover:bg-[#072f59] text-white font-black text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <Phone size={14} />
              <span>Call +91 72593 35286</span>
            </a>
          </div>
        )}

        {/* 1. TOP FLOATING BUTTON: CALL CENTER AGENT AVATAR (Matches User Screenshot) */}
        <div className="relative group flex items-center">
          <a
            href={`tel:${CONTACT_PHONE_TEL}`}
            onClick={(e) => {
              // On desktop show card popup, on mobile initiate direct call
              if (window.innerWidth > 768) {
                e.preventDefault();
                setShowCallCard(!showCallCard);
              }
            }}
            aria-label="Call 24/7 Helpline"
            className="relative flex items-center justify-center w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-[#0284c7] via-[#2563eb] to-[#38bdf8] text-white shadow-[0_8px_25px_rgba(37,99,235,0.45)] transition-all duration-300 hover:scale-110 active:scale-95 border-2 border-white/60"
          >
            {/* Animated Glow Pulse */}
            <span className="absolute -inset-1 rounded-full bg-blue-400 opacity-60 animate-ping pointer-events-none"></span>

            {/* Custom SVG Call Center Representative Avatar Icon with Headset (Matches User Screenshot) */}
            <svg 
              width="30" 
              height="30" 
              viewBox="0 0 36 36" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="relative z-10 transition-transform duration-300 group-hover:scale-105"
            >
              {/* Person Head & Face */}
              <circle cx="18" cy="15" r="7" fill="#FED7AA" />
              {/* Hair */}
              <path d="M12 14C12 10.6863 14.6863 8 18 8C21.3137 8 24 10.6863 24 14C24 14.5 23.5 15 22.5 15C21 15 20.5 13.5 19 13.5C17.5 13.5 17 15 15.5 15C14.5 15 12 14.5 12 14Z" fill="#1E293B" />
              {/* Shoulders / Shirt */}
              <path d="M10 30C10 24.4772 13.5817 21 18 21C22.4183 21 26 24.4772 26 30" fill="#EA580C" />
              {/* Headset Arc */}
              <path d="M11 16C11 12.134 14.134 9 18 9C21.866 9 25 12.134 25 16" stroke="#60A5FA" strokeWidth="2.5" strokeLinecap="round" />
              {/* Ear Cushions */}
              <rect x="9.5" y="14" width="3" height="5" rx="1.5" fill="#3B82F6" />
              <rect x="23.5" y="14" width="3" height="5" rx="1.5" fill="#3B82F6" />
              {/* Microphone Arm */}
              <path d="M12.5 17.5C12.5 20 14 21.5 16.5 21.5" stroke="#3B82F6" strokeWidth="1.8" strokeLinecap="round" />
              <circle cx="17.5" cy="21.5" r="1.5" fill="#1D4ED8" />
            </svg>

            {/* Online Indicator Dot */}
            <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full"></span>
          </a>

          {/* Desktop Hover Tooltip */}
          <span className="absolute right-full mr-3 px-3 py-1.5 bg-slate-900/95 text-white text-xs font-bold rounded-lg shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 hidden md:block">
            24/7 Helpline: {CONTACT_PHONE}
          </span>
        </div>

        {/* 2. BOTTOM FLOATING BUTTON: VIBRANT WHATSAPP ICON (Matches User Screenshot) */}
        <div className="relative group flex items-center">
          <a
            href={`https://wa.me/${CONTACT_PHONE_WA}?text=${encodeURIComponent('Hi BookMyRoute, I need a vehicle rental quotation and cab details.')}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="relative flex items-center justify-center w-13 h-13 sm:w-14 sm:h-14 bg-gradient-to-tr from-[#128C7E] via-[#25D366] to-[#25D366] hover:brightness-105 text-white rounded-full shadow-[0_8px_25px_rgba(37,211,102,0.45)] transition-all duration-300 hover:scale-110 active:scale-95 border-2 border-white/60"
          >
            {/* WhatsApp SVG Icon */}
            <svg 
              width="28" 
              height="28" 
              viewBox="0 0 24 24" 
              fill="currentColor"
              className="relative z-10 transition-transform duration-300 group-hover:rotate-12"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
            </svg>
          </a>

          {/* Desktop Hover Tooltip */}
          <span className="absolute right-full mr-3 px-3 py-1.5 bg-slate-900/95 text-white text-xs font-bold rounded-lg shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 hidden md:block">
            Instant WhatsApp Quotation
          </span>
        </div>
      </aside>

      {/* 2. Mobile Sticky Bottom Bar */}
      <nav 
        aria-label="Mobile Navigation" 
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0F355C] text-white border-t border-slate-700/50 shadow-[0_-10px_25px_rgba(0,0,0,0.25)] pb-[env(safe-area-inset-bottom)] print:hidden"
      >
        <div className="grid grid-cols-5 h-16 items-center">
          <Link
            href="/"
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${
              pathname === '/' ? 'text-[#FF7020] font-bold' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Home size={18} />
            <span className="text-[10px]">Home</span>
          </Link>

          <Link
            href="/vehicles"
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${
              pathname === '/vehicles' ? 'text-[#FF7020] font-bold' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Car size={18} />
            <span className="text-[10px]">Fleet</span>
          </Link>

          <button
            type="button"
            onClick={() => openBookingModal()}
            className="flex flex-col items-center justify-center -mt-5 cursor-pointer"
          >
            <div className="w-13 h-13 rounded-full bg-[#FF7020] hover:bg-[#e55c0c] text-white shadow-lg flex items-center justify-center border-4 border-[#0F355C] transition-transform active:scale-95">
              <Ticket size={22} />
            </div>
            <span className="text-[10px] font-black text-white mt-0.5">Book</span>
          </button>

          <Link
            href="/pricing"
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${
              pathname === '/pricing' ? 'text-[#FF7020] font-bold' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Tag size={18} />
            <span className="text-[10px]">Pricing</span>
          </Link>

          <a
            href={`tel:${CONTACT_PHONE_TEL}`}
            className="flex flex-col items-center justify-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <Phone size={18} />
            <span className="text-[10px] font-bold">Call</span>
          </a>
        </div>
      </nav>
    </>
  );
}
