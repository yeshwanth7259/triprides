import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FloatingActions from '../components/FloatingActions';
import { BookingModalProvider } from '../components/BookingModalContext';
import { SpeedInsights } from '@vercel/speed-insights/next';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
  title: 'BookMyRoute | Cab, Tempo Traveller, Mini Bus & Bus Rental Bangalore',
  description: 'Book Cabs (4-7 seats), Tempo Travellers (8-20 seats), Mini Buses (21-25 seats) and Coach Buses (32-50 seats) across Karnataka. Instant WhatsApp quotes: +91 73531 87804.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased text-slate-800 bg-[#F9FAFB]`}>
        {/* Google tag (gtag.js) */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=AW-18530500425"
          strategy="afterInteractive"
        />
        <Script id="google-ads-gtag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'AW-18530500425');
          `}
        </Script>
        
        <BookingModalProvider>
          <Header />
          {children}
          <Footer />
          <FloatingActions />
        </BookingModalProvider>
        
        <SpeedInsights />
      </body>
    </html>
  );
}
