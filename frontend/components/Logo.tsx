'use client';
import Link from 'next/link';

export default function Logo() {
  return (
    <Link href="/" className="flex items-center">
      <img 
        src="/logo.png" 
        alt="BookMyRoute Logo" 
        className="h-[52px] md:h-[60px] w-auto object-contain drop-shadow-sm" 
      />
    </Link>
  );
}
