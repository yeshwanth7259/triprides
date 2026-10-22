'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter, Linkedin, Ticket } from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  CONTACT_PHONE, 
  CONTACT_PHONE_TEL, 
  CONTACT_EMAIL, 
  OFFICE_ADDRESS 
} from '../lib/fleetData';
import { useBookingModal } from './BookingModalContext';

export default function Footer() {
  const { openBookingModal } = useBookingModal();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <footer className="bg-white pt-16 pb-12 border-t-[6px] border-[#FF7020] relative overflow-hidden">
      {/* Decorative top fade */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF7020]/20 via-[#FF7020]/60 to-[#FF7020]/20"></div>
      
      <motion.div 
        className="container-x"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Company Info */}
          <motion.div variants={itemVariants}>
            <img src="/logo.png" alt="BookMyRoute Logo" className="h-[75px] w-auto mb-6 object-contain" />
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              BookMyRoute is Karnataka's premier travel partner, offering transparent pricing and GPS-tracked commercial vehicles — Cabs, Tempo Travellers, Mini Buses, and Coach Buses — across South India.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-[#FF7020] hover:text-white hover:border-[#FF7020] transition-all shadow-xs"><Facebook size={16} /></a>
              <a href="#" className="w-9 h-9 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-[#FF7020] hover:text-white hover:border-[#FF7020] transition-all shadow-xs"><Instagram size={16} /></a>
              <a href="#" className="w-9 h-9 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-[#FF7020] hover:text-white hover:border-[#FF7020] transition-all shadow-xs"><Twitter size={16} /></a>
              <a href="#" className="w-9 h-9 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-[#FF7020] hover:text-white hover:border-[#FF7020] transition-all shadow-xs"><Linkedin size={16} /></a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h4 className="text-[#0A3D73] font-black text-lg mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF7020]"></span> Quick Links
            </h4>
            <ul className="flex flex-col gap-3">
              <li><Link href="/" className="text-slate-600 hover:text-[#FF7020] transition-colors font-medium text-sm">Home</Link></li>
              <li><Link href="/vehicles" className="text-slate-600 hover:text-[#FF7020] transition-colors font-medium text-sm">Our Fleet (Cabs, TT & Buses)</Link></li>
              <li><Link href="/pricing" className="text-slate-600 hover:text-[#FF7020] transition-colors font-medium text-sm">Transparent Pricing & Rates</Link></li>
              <li><Link href="/about" className="text-slate-600 hover:text-[#FF7020] transition-colors font-medium text-sm">About Us</Link></li>
              <li><Link href="/blogs" className="text-slate-600 hover:text-[#FF7020] transition-colors font-medium text-sm">Travel Blogs & Guides</Link></li>
              <li><Link href="/support" className="text-slate-600 hover:text-[#FF7020] transition-colors font-medium text-sm">Support & Enquiry</Link></li>
            </ul>
          </motion.div>

          {/* Our Fleet Services */}
          <motion.div variants={itemVariants}>
            <h4 className="text-[#0A3D73] font-black text-lg mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF7020]"></span> Fleet Categories
            </h4>
            <ul className="flex flex-col gap-3">
              <li>
                <button 
                  onClick={() => openBookingModal({ category: 'cab' })}
                  className="text-slate-600 hover:text-[#FF7020] transition-colors font-medium text-sm text-left cursor-pointer"
                >
                  Cabs (4-7 Seater Sedan & Innova Crysta)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => openBookingModal({ category: 'tempo' })}
                  className="text-slate-600 hover:text-[#FF7020] transition-colors font-medium text-sm text-left cursor-pointer"
                >
                  Tempo Travellers (9, 12, 14, 17, 20 Seater)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => openBookingModal({ category: 'minibus' })}
                  className="text-slate-600 hover:text-[#FF7020] transition-colors font-medium text-sm text-left cursor-pointer"
                >
                  Mini Buses (21 & 25 Seater AC Coaches)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => openBookingModal({ category: 'bus' })}
                  className="text-slate-600 hover:text-[#FF7020] transition-colors font-medium text-sm text-left cursor-pointer"
                >
                  Pushback Buses (32, 40, 50 Seater)
                </button>
              </li>
              <li><Link href="/services/tempo-traveller-bangalore" className="text-slate-600 hover:text-[#FF7020] transition-colors font-medium text-sm">Tempo Traveller in Bangalore</Link></li>
              <li><Link href="/services/bus-bangalore" className="text-slate-600 hover:text-[#FF7020] transition-colors font-medium text-sm">Bus on Rent in Bangalore</Link></li>
            </ul>
          </motion.div>

          {/* Contact Details */}
          <motion.div variants={itemVariants}>
            <h4 className="text-[#0A3D73] font-black text-lg mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF7020]"></span> Official Helpline
            </h4>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <MapPin size={18} className="text-[#FF7020] mt-0.5 shrink-0" />
                <span className="text-slate-700 text-sm leading-relaxed font-semibold">{OFFICE_ADDRESS}</span>
              </li>
              <li className="flex items-center gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <Phone size={18} className="text-[#FF7020] shrink-0" />
                <div>
                  <span className="block text-[11px] text-slate-400 font-bold uppercase">Call & WhatsApp:</span>
                  <a href={`tel:${CONTACT_PHONE_TEL}`} className="text-slate-900 hover:text-[#0A3D73] font-black transition-colors text-base">{CONTACT_PHONE}</a>
                </div>
              </li>
              <li className="flex items-center gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <Mail size={18} className="text-[#FF7020] shrink-0" />
                <div>
                  <span className="block text-[11px] text-slate-400 font-bold uppercase">Email:</span>
                  <a href={`mailto:${CONTACT_EMAIL}`} className="text-slate-900 hover:text-[#0A3D73] font-bold transition-colors text-sm">{CONTACT_EMAIL}</a>
                </div>
              </li>
            </ul>
          </motion.div>

        </div>

        {/* Copyright Bottom Bar */}
        <motion.div variants={itemVariants} className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm text-center md:text-left font-medium">
            &copy; {new Date().getFullYear()} BookMyRoute Travel Services. Official Booking Partner: <strong>{CONTACT_PHONE}</strong>
          </p>
          <div className="flex gap-6">
            <Link href="/pricing" className="text-slate-500 hover:text-[#FF7020] transition-colors text-sm font-semibold">Pricing Rates</Link>
            <Link href="/about" className="text-slate-500 hover:text-[#FF7020] transition-colors text-sm font-semibold">About</Link>
            <Link href="/support" className="text-slate-500 hover:text-[#FF7020] transition-colors text-sm font-semibold">Support</Link>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
}
