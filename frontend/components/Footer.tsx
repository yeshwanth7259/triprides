'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter, Linkedin, Ticket, FileText, Home, Car } from 'lucide-react';
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Company Info */}
          <motion.div variants={itemVariants}>
            <Link href="/" className="inline-block mb-4 transition-transform hover:scale-[1.02]">
              <img 
                src="/logo.png" 
                alt="BookMyRoute - Every Ride. Every Trip. One Place." 
                className="h-[52px] sm:h-[60px] w-auto object-contain drop-shadow-sm" 
              />
            </Link>
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed mb-6">
              BookMyRoute is India&apos;s all-in-one travel ecosystem: GPS-tracked commercial cabs, Tempo Travellers, verified White Board Drivers, and handpicked coffee estate homestays across India.
            </p>
            <div className="flex gap-2.5">
              <a href="#" className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-[#FF7020] hover:text-white transition-all shadow-xs"><Facebook size={14} /></a>
              <a href="#" className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-[#FF7020] hover:text-white transition-all shadow-xs"><Instagram size={14} /></a>
              <a href="#" className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-[#FF7020] hover:text-white transition-all shadow-xs"><Twitter size={14} /></a>
              <a href="#" className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-[#FF7020] hover:text-white transition-all shadow-xs"><Linkedin size={14} /></a>
            </div>
          </motion.div>

          {/* Quick Links & Services */}
          <motion.div variants={itemVariants}>
            <h4 className="text-[#0A3D73] font-black text-base mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF7020]"></span> All Services
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs sm:text-sm">
              <li><Link href="/vehicles" className="text-slate-600 hover:text-[#FF7020] transition-colors font-medium">Commercial Fleet (Cabs, TT, Buses)</Link></li>
              <li>
                <Link href="/homestays" className="text-slate-900 hover:text-[#FF7020] font-bold flex items-center justify-between">
                  <span>🏡 Villas & Homestays (India)</span>
                  <span className="text-[9px] bg-[#FF7020] text-white px-1.5 py-0.5 rounded font-black">NEW</span>
                </Link>
              </li>
              <li>
                <Link href="/white-board-drivers" className="text-slate-900 hover:text-[#FF7020] font-bold flex items-center justify-between">
                  <span>🚗 White Board Drivers Directory</span>
                  <span className="text-[9px] bg-emerald-600 text-white px-1.5 py-0.5 rounded font-black">POPULAR</span>
                </Link>
              </li>
              <li><Link href="/pricing" className="text-slate-600 hover:text-[#FF7020] transition-colors font-medium">Transparent Pricing & Tariff</Link></li>
              <li>
                <Link href="/invoice" className="text-[#0A3D73] hover:text-[#FF7020] font-bold flex items-center gap-1.5">
                  <FileText size={14} className="text-[#FF7020]" />
                  <span>Download Trip Invoice</span>
                </Link>
              </li>
              <li><Link href="/support" className="text-slate-600 hover:text-[#FF7020] transition-colors font-medium">Customer Support & FAQs</Link></li>
            </ul>
          </motion.div>

          {/* Homestay Destinations */}
          <motion.div variants={itemVariants}>
            <h4 className="text-[#0A3D73] font-black text-base mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF7020]"></span> Popular Homestays
            </h4>
            <ul className="flex flex-col gap-2 text-xs text-slate-600 font-medium">
              <li><Link href="/homestays" className="hover:text-[#FF7020] transition-colors">☕ Coorg Coffee Plantation Homestays</Link></li>
              <li><Link href="/homestays" className="hover:text-[#FF7020] transition-colors">⛰️ Chikmagalur Misty Peak Villas</Link></li>
              <li><Link href="/homestays" className="hover:text-[#FF7020] transition-colors">🍵 Ooty Colonial Heritage Bungalows</Link></li>
              <li><Link href="/homestays" className="hover:text-[#FF7020] transition-colors">🏖️ Goa Beachfront Portuguese Villas</Link></li>
              <li><Link href="/homestays" className="hover:text-[#FF7020] transition-colors">🌴 Wayanad Bamboo Rainforest Retreats</Link></li>
              <li><Link href="/homestays" className="hover:text-[#FF7020] transition-colors">❄️ Manali Alpine Cedar Chalets</Link></li>
              <li><Link href="/homestays" className="hover:text-[#FF7020] transition-colors">👑 Jaipur Royal Heritage Havelis</Link></li>
            </ul>
          </motion.div>

          {/* Contact Details */}
          <motion.div variants={itemVariants}>
            <h4 className="text-[#0A3D73] font-black text-base mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF7020]"></span> 24/7 Helpline
            </h4>
            <ul className="flex flex-col gap-3 text-xs">
              <li className="flex items-start gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <MapPin size={16} className="text-[#FF7020] mt-0.5 shrink-0" />
                <span className="text-slate-700 leading-relaxed font-semibold">{OFFICE_ADDRESS}</span>
              </li>
              <li className="flex items-center gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <Phone size={16} className="text-[#FF7020] shrink-0" />
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase">Call & WhatsApp:</span>
                  <a href={`tel:${CONTACT_PHONE_TEL}`} className="text-slate-900 hover:text-[#0A3D73] font-black transition-colors text-sm">{CONTACT_PHONE}</a>
                </div>
              </li>
              <li className="flex items-center gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <Mail size={16} className="text-[#FF7020] shrink-0" />
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase">Email:</span>
                  <a href={`mailto:${CONTACT_EMAIL}`} className="text-slate-900 hover:text-[#0A3D73] font-bold transition-colors text-xs">{CONTACT_EMAIL}</a>
                </div>
              </li>
            </ul>
          </motion.div>

        </div>

        {/* Copyright Bottom Bar */}
        <motion.div variants={itemVariants} className="border-t border-slate-200 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500 font-medium">
          <p className="text-center md:text-left">
            &copy; {new Date().getFullYear()} BookMyRoute Travels (India) Private Limited. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/invoice" className="hover:text-[#FF7020] transition-colors font-bold text-[#0A3D73]">Download Invoice</Link>
            <Link href="/white-board-drivers" className="hover:text-[#FF7020] transition-colors">White Board Drivers</Link>
            <Link href="/homestays" className="hover:text-[#FF7020] transition-colors">Homestays</Link>
            <Link href="/pricing" className="hover:text-[#FF7020] transition-colors">Pricing & Tariff</Link>
            <Link href="/support" className="hover:text-[#FF7020] transition-colors">Support</Link>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
}
