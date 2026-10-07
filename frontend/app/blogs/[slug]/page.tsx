import type { Metadata } from 'next';
import { Calendar, User, Tag, ChevronLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// Dummy blog database (matches the listing on /blogs)
const blogData: any = {
  'multi-day-outstation-trips-planning': {
    title: 'Multi-Day Outstation Trips: How to Plan Your Journey',
    date: 'Oct 02, 2026',
    author: 'BookMyRoute Experts',
    tags: ['Outstation', 'Travel Tips', 'Family Trips'],
    image: '/vehicles/TEMPO-TRAVELLER-1.webp',
    content: `
      <h2>Why Multi-Day Trips Require Better Planning</h2>
      <p>When you are traveling for several days, comfort becomes just as important as the destination. Sitting cramped in a small car can ruin the experience before you even reach your resort in Coorg or Ooty.</p>
      
      <h2>1. Choose the Right Vehicle</h2>
      <p>For groups of 5-7, a Toyota Innova Crysta is perfect. However, if your group is between 10 to 14 people, renting a <strong>Tempo Traveller</strong> is the most economical and comfortable choice. They offer ample legroom, pushback seats, and a dedicated luggage compartment.</p>

      <h2>2. Plan Your Stops</h2>
      <p>Karnataka's highways are dotted with excellent eateries and scenic viewpoints. Discuss your route with our experienced drivers—they know all the best spots for a safe, hygienic break.</p>

      <h2>3. Transparent Pricing</h2>
      <p>Unlike regular city cabs, outstation trips are calculated based on a minimum of 300 KMs per day. Always ensure your rental agency clarifies driver allowances and state border taxes upfront to avoid surprises.</p>
    `
  },
  'top-corporate-outing-resorts-bangalore': {
    title: 'Top 7 Corporate Outing Resorts Around Bangalore',
    date: 'Sep 28, 2026',
    author: 'BookMyRoute Corporate Team',
    tags: ['Corporate', 'Resorts', 'Mini Bus'],
    image: '/vehicles/bus3a.jpg',
    content: `
      <h2>The Importance of Team Outings</h2>
      <p>Getting your team out of the city hustle is crucial for team building and relaxation. Bangalore is surrounded by fantastic resorts perfectly suited for corporate day-outs or weekend stays.</p>
      
      <h2>Top Resorts</h2>
      <ul>
        <li><strong>Guhantara Resort:</strong> India's first underground resort, perfect for adventure activities.</li>
        <li><strong>Mango Mist Resort:</strong> Eco-friendly environment with extensive team-building facilities.</li>
        <li><strong>Wonderla Resort:</strong> Great for combining a resort stay with amusement park thrills.</li>
      </ul>

      <h2>Getting There</h2>
      <p>For corporate groups of 20-50 people, hiring a fleet of cars is a logistical nightmare. Instead, booking a <strong>35 Seater Luxury Bus</strong> or a <strong>21 Seater Mini Bus</strong> ensures the entire team travels together safely, turning the journey itself into a fun bonding experience!</p>
    `
  },
  'round-trip-vs-one-way-taxi': {
    title: 'Round Trip vs One Way: Which is Better for Outstation?',
    date: 'Sep 15, 2026',
    author: 'BookMyRoute Pricing Team',
    tags: ['Taxi', 'Pricing', 'Outstation'],
    image: '/vehicles/New-Maruti-Suzuki-Dzire-1-jpg.webp',
    content: `
      <h2>Understanding the Difference</h2>
      <p>When booking a cab from Bangalore to another city, you usually have two options: One-Way Drop or a Round-Trip package. But which one actually saves you money?</p>
      
      <h2>When to choose One-Way</h2>
      <p>If you are relocating, heading to your hometown for a long holiday, or catching a flight from another city, a one-way taxi is perfect. You only pay for the drop distance.</p>

      <h2>When to choose Round-Trip</h2>
      <p>If you are going for a 2 or 3-day vacation (like a weekend trip to Mysore), booking a round-trip is always cheaper and much more convenient. You have the vehicle at your disposal for local sightseeing in the destination city, and you don't have to worry about finding a reliable cab for the return journey.</p>
    `
  }
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = blogData[params.slug];
  if (!post) {
    return { title: 'Blog Not Found | BookMyRoute' };
  }
  return {
    title: `${post.title} | BookMyRoute Blogs`,
    description: post.content.substring(0, 150).replace(/<[^>]*>?/gm, ''),
    keywords: post.tags.join(', ')
  };
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = blogData[params.slug];

  if (!post) {
    // If the slug doesn't match our dummy data, show a nice 404-ish state instead of crashing
    return (
      <main className="min-h-screen bg-[#F9FAFB] pt-32 pb-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-black text-[#0A3D73] mb-4">Article Not Found</h1>
          <p className="text-slate-500 mb-8">This article is being updated. Please check back later.</p>
          <Link href="/blogs" className="bg-[#FF7020] text-white px-6 py-3 rounded-lg font-bold">Back to Blogs</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F9FAFB] pt-24 pb-20">
      
      {/* Blog Hero Image */}
      <div className="w-full h-[300px] md:h-[450px] relative">
        <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[#0A3D73]/60 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A3D73] to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <div className="container-x max-w-4xl mx-auto">
            <Link href="/blogs" className="inline-flex items-center gap-2 text-white/80 hover:text-white font-bold text-sm mb-6 transition-colors">
              <ChevronLeft size={16} /> Back to all articles
            </Link>
            
            <div className="flex flex-wrap items-center gap-4 text-white/90 text-sm font-bold mb-4">
              <span className="flex items-center gap-1.5"><Calendar size={14} className="text-[#FF7020]" /> {post.date}</span>
              <span className="flex items-center gap-1.5"><User size={14} className="text-[#FF7020]" /> {post.author}</span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-black text-white font-display leading-tight drop-shadow-md">
              {post.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Blog Content */}
      <div className="container-x max-w-4xl mx-auto mt-12">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12">
          
          <div className="flex flex-wrap gap-2 mb-10 pb-10 border-b border-slate-100">
            {post.tags.map((tag: string, i: number) => (
              <span key={i} className="flex items-center gap-1.5 bg-slate-50 text-slate-600 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm">
                <Tag size={12} className="text-[#FF7020]" /> {tag}
              </span>
            ))}
          </div>

          <div 
            className="prose prose-lg prose-slate max-w-none prose-headings:font-black prose-headings:text-[#0A3D73] prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-p:text-slate-600 prose-p:leading-relaxed prose-li:text-slate-600 prose-strong:text-[#0A3D73]"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* CTA inside blog */}
          <div className="mt-16 bg-[#0A3D73] rounded-2xl p-8 md:p-10 text-center relative overflow-hidden shadow-lg border-b-4 border-[#FF7020]">
            <div className="relative z-10">
              <h3 className="text-2xl font-black text-white mb-4">Ready to plan your trip?</h3>
              <p className="text-blue-100 mb-8 max-w-lg mx-auto">Book a premium, highly maintained vehicle with BookMyRoute today and experience the difference.</p>
              <Link href="/" className="inline-flex items-center justify-center bg-[#FF7020] hover:bg-[#E55C0C] text-white font-bold py-3.5 px-8 rounded-xl transition-transform hover:scale-105">
                Book a Ride Now
              </Link>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
