'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Car, Phone, Ticket, Tag } from 'lucide-react';
import { useBookingModal } from './BookingModalContext';
import { CONTACT_PHONE_TEL, CONTACT_PHONE_WA } from '../lib/fleetData';

export default function FloatingActions() {
  const pathname = usePathname();
  const { openBookingModal } = useBookingModal();

  return (
    <>
      {/* 1. Sleek, Small & Animated Floating WhatsApp Icon Button */}
      <aside 
        aria-label="WhatsApp Contact" 
        className="fixed bottom-20 md:bottom-8 right-4 sm:right-6 z-50 flex items-center pointer-events-auto"
      >
        <a
          href={`https://wa.me/${CONTACT_PHONE_WA}?text=Hi%2C%20I%20am%20looking%20for%20a%20vehicle%20rental%20quote%20on%20BookMyRoute.`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="group relative flex items-center justify-center w-13 h-13 sm:w-14 sm:h-14 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-full shadow-[0_8px_25px_rgba(37,211,102,0.45)] transition-all duration-300 hover:scale-110 active:scale-95"
        >
          {/* Animated Glowing Pulse Ring */}
          <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-70 animate-ping pointer-events-none"></span>

          {/* WhatsApp Icon */}
          <svg 
            width="28" 
            height="28" 
            viewBox="0 0 24 24" 
            fill="currentColor"
            className="relative z-10 transition-transform duration-300 group-hover:rotate-12"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
          </svg>

          {/* Subtle Hover Tooltip */}
          <span className="absolute right-full mr-3 px-3 py-1.5 bg-slate-900/90 text-white text-xs font-bold rounded-lg shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 hidden md:block">
            WhatsApp Quotation
          </span>
        </a>
      </aside>

      {/* 2. Mobile Sticky Bottom Bar (Tejas Travels Pattern) */}
      <nav 
        aria-label="Mobile Navigation" 
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0F355C] text-white border-t border-slate-700/50 shadow-[0_-10px_25px_rgba(0,0,0,0.25)] pb-[env(safe-area-inset-bottom)]"
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
