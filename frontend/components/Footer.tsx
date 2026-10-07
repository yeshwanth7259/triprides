'use client';
import Link from 'next/link';
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Footer() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <footer className="bg-white pt-16 pb-8 border-t-[6px] border-[#FF7020] relative overflow-hidden">
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
            <img src="/logo.png" alt="BookMyRoute Logo" className="h-[80px] w-auto mb-6 object-contain" />
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              BookMyRoute is Karnataka's most trusted travel partner, offering premium, safe, and comfortable transportation services including Tempo Travellers, Cars, and Buses for every kind of journey.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-9 h-9 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-[#FF7020] hover:text-white hover:border-[#FF7020] transition-all shadow-sm"><Facebook size={16} /></a>
              <a href="#" className="w-9 h-9 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-[#FF7020] hover:text-white hover:border-[#FF7020] transition-all shadow-sm"><Instagram size={16} /></a>
              <a href="#" className="w-9 h-9 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-[#FF7020] hover:text-white hover:border-[#FF7020] transition-all shadow-sm"><Twitter size={16} /></a>
              <a href="#" className="w-9 h-9 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-[#FF7020] hover:text-white hover:border-[#FF7020] transition-all shadow-sm"><Linkedin size={16} /></a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h4 className="text-[#0A3D73] font-black text-lg mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF7020]"></span> Quick Links
            </h4>
            <ul className="flex flex-col gap-3">
              <li><Link href="/" className="text-slate-500 hover:text-[#FF7020] hover:translate-x-1 inline-block transition-all font-medium text-sm">Home</Link></li>
              <li><Link href="/about" className="text-slate-500 hover:text-[#FF7020] hover:translate-x-1 inline-block transition-all font-medium text-sm">About Us</Link></li>
              <li><Link href="/vehicles" className="text-slate-500 hover:text-[#FF7020] hover:translate-x-1 inline-block transition-all font-medium text-sm">Our Vehicles</Link></li>
              <li><Link href="/blogs" className="text-slate-500 hover:text-[#FF7020] hover:translate-x-1 inline-block transition-all font-medium text-sm">Blogs</Link></li>
              <li><Link href="/support" className="text-slate-500 hover:text-[#FF7020] hover:translate-x-1 inline-block transition-all font-medium text-sm">Support & FAQ</Link></li>
            </ul>
          </motion.div>

          {/* Our Services */}
          <motion.div variants={itemVariants}>
            <h4 className="text-[#0A3D73] font-black text-lg mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF7020]"></span> Our Services
            </h4>
            <ul className="flex flex-col gap-3">
              <li><Link href="/services/tempo-traveller-bangalore" className="text-slate-500 hover:text-[#FF7020] hover:translate-x-1 inline-block transition-all font-medium text-sm">Tempo Traveller on Rent</Link></li>
              <li><Link href="/services/bus-bangalore" className="text-slate-500 hover:text-[#FF7020] hover:translate-x-1 inline-block transition-all font-medium text-sm">Bus on Rent</Link></li>
              <li><Link href="/services/cars" className="text-slate-500 hover:text-[#FF7020] hover:translate-x-1 inline-block transition-all font-medium text-sm">Car Rentals</Link></li>
              <li><Link href="/services/airport" className="text-slate-500 hover:text-[#FF7020] hover:translate-x-1 inline-block transition-all font-medium text-sm">Airport Taxi</Link></li>
              <li><Link href="/services/outstation" className="text-slate-500 hover:text-[#FF7020] hover:translate-x-1 inline-block transition-all font-medium text-sm">Outstation Trips</Link></li>
            </ul>
          </motion.div>

          {/* Contact Details */}
          <motion.div variants={itemVariants}>
            <h4 className="text-[#0A3D73] font-black text-lg mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF7020]"></span> Contact Us
            </h4>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <MapPin size={18} className="text-[#FF7020] mt-0.5 shrink-0" />
                <span className="text-slate-600 text-sm leading-relaxed font-medium">Uttharhalli, Bangalore<br/>Karnataka - 560061</span>
              </li>
              <li className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <Phone size={18} className="text-[#FF7020] shrink-0" />
                <a href="tel:+917259335286" className="text-slate-600 hover:text-[#0A3D73] font-bold transition-colors text-sm">+91 7259335286</a>
              </li>
              <li className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <Mail size={18} className="text-[#FF7020] shrink-0" />
                <a href="mailto:bookmyroute06@gmail.com" className="text-slate-600 hover:text-[#0A3D73] font-bold transition-colors text-sm">bookmyroute06@gmail.com</a>
              </li>
            </ul>
          </motion.div>

        </div>

        {/* Copyright Bottom Bar */}
        <motion.div variants={itemVariants} className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm text-center md:text-left font-medium">
            &copy; {new Date().getFullYear()} BookMyRoute Travel Services. All Rights Reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/terms" className="text-slate-400 hover:text-[#FF7020] transition-colors text-sm font-medium">Terms & Conditions</Link>
            <Link href="/privacy" className="text-slate-400 hover:text-[#FF7020] transition-colors text-sm font-medium">Privacy Policy</Link>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
}
