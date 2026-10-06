'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Logo from './Logo';
import { MapPin, Phone, Mail } from 'lucide-react';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-white'}`}>
      {/* Top Bar for Contact Info */}
      <div className="bg-[#0A3D73] text-blue-100 text-xs py-2 hidden md:block">
        <div className="container-x flex justify-between items-center">
          <div className="flex gap-6 items-center">
            <span className="flex items-center gap-1.5 hover:text-white transition-colors cursor-default">
              <MapPin size={14} className="text-[#FF7020]" /> Uttharhalli, Bangalore - 560061
            </span>
            <a href="mailto:yesh5yash@gmail.com" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Mail size={14} className="text-[#FF7020]" /> yesh5yash@gmail.com
            </a>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 font-bold text-white transition-colors">
              <Phone size={12} /> +91 7259335286
            </span>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <div className="container-x h-[72px] flex items-center justify-between">
        <div className="pt-2">
          <Logo />
        </div>
        
        <nav className="hidden md:flex items-center gap-8 text-[15px] font-medium text-slate-600">
          <Link href="/" className="text-[#0A3D73] font-bold">Home</Link>
          
          <div className="relative group">
            <button className="hover:text-[#0A3D73] transition-colors py-2 flex items-center gap-1">
              Our Services
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="mt-0.5"><path d="M6 9l6 6 6-6"/></svg>
            </button>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-0 w-[450px] bg-white shadow-xl border border-slate-100 rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all p-6 z-50 flex gap-6">
              <div className="flex-1">
                <h4 className="text-[11px] font-black text-[#5CC13A] uppercase tracking-widest border-b-2 border-[#5CC13A] pb-2 mb-3">Tempo Traveller On Rent</h4>
                <Link href="/services/tempo-traveller-bangalore" className="block text-slate-700 hover:text-[#5CC13A] py-2 font-bold text-[14px] flex items-center gap-2">
                  <span className="text-[#5CC13A]">›</span> Bangalore
                </Link>
              </div>
              <div className="flex-1">
                <h4 className="text-[11px] font-black text-[#5CC13A] uppercase tracking-widest border-b-2 border-[#5CC13A] pb-2 mb-3">Bus On Rent</h4>
                <Link href="/services/bus-bangalore" className="block text-slate-700 hover:text-[#5CC13A] py-2 font-bold text-[14px] flex items-center gap-2">
                  <span className="text-[#5CC13A]">›</span> Bangalore
                </Link>
              </div>
            </div>
          </div>

          <Link href="/vehicles" className="hover:text-[#0A3D73] transition-colors">Our Vehicles</Link>
          <Link href="/blogs" className="hover:text-[#0A3D73] transition-colors">Blogs</Link>
          <Link href="/support" className="hover:text-[#0A3D73] transition-colors">Support</Link>
        </nav>
        
        <div className="flex gap-3 items-center">
          <a 
            href="tel:+917259335286" 
            className="hidden lg:flex items-center gap-2 border-2 border-[#0A3D73] text-[#0A3D73] hover:bg-[#0A3D73] hover:text-white font-semibold text-sm px-5 py-2 rounded-full transition-colors"
          >
            <Phone size={16} />
            Call Now
          </a>
          
          <a 
            href="https://wa.me/917259335286" 
            target="_blank" 
            rel="noreferrer" 
            className="flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebd5a] text-white font-semibold text-sm px-5 py-2 rounded-full transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
            </svg>
            WhatsApp
          </a>
        </div>
      </div>
    </header>
  );
}
