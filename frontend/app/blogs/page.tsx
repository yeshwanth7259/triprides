import type { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Travel Blogs & Guides | TripRide Bangalore',
  description: 'Read the latest travel guides, tips for outstation trips, and vehicle rental advice from TripRide. Learn how to plan the perfect journey across Karnataka.',
  keywords: 'Travel Blog Bangalore, Tempo Traveller Tips, Outstation Journey Guide, Corporate Outing Resorts, TripRide Blog',
};

const blogs = [
  {
    id: 1,
    title: 'Multi-Day Outstation Trips: How to Plan Your Journey',
    date: 'Oct 02, 2026',
    excerpt: 'Planning a multi-day trip from Bangalore to Coorg, Mysore, or Ooty? Discover our top tips for booking the right vehicle and planning an itinerary that keeps everyone comfortable.',
    image: '/vehicles/TEMPO-TRAVELLER-1.webp',
    slug: 'multi-day-outstation-trips-planning'
  },
  {
    id: 2,
    title: 'Top 7 Corporate Outing Resorts Around Bangalore',
    date: 'Sep 28, 2026',
    excerpt: 'Looking for the perfect weekend getaway for your team? We have compiled a list of the top 7 corporate outing resorts near Bangalore, complete with transport recommendations.',
    image: '/vehicles/bus3a.jpg',
    slug: 'top-corporate-outing-resorts-bangalore'
  },
  {
    id: 3,
    title: 'Round Trip vs One Way: Which is Better for Outstation?',
    date: 'Sep 15, 2026',
    excerpt: 'Confused between booking a one-way taxi or a round-trip outstation cab? Read our comprehensive comparison on pricing, convenience, and flexibility to make the right choice.',
    image: '/vehicles/New-Maruti-Suzuki-Dzire-1-jpg.webp',
    slug: 'round-trip-vs-one-way-taxi'
  },
  {
    id: 4,
    title: 'The Best Tempo Traveller Rental Options in Bangalore',
    date: 'Sep 05, 2026',
    excerpt: 'Traveling with a group of 10 to 20 people? Explore the different seating capacities and luxury features of our Tempo Travellers to find the perfect fit for your group.',
    image: '/vehicles/Traveller-3050WB-9D-12D-13D_mob.webp',
    slug: 'best-tempo-traveller-rental-bangalore'
  },
  {
    id: 5,
    title: 'Features of the Luxury Maharaja Tempo Traveller',
    date: 'Aug 22, 2026',
    excerpt: 'Experience travel like royalty! Learn about the pushback seats, ambient lighting, LED screens, and massive legroom that make the Maharaja Tempo Traveller our most requested vehicle.',
    image: '/vehicles/TEMPO-TRAVELLER-1.webp',
    slug: 'features-maharaja-tempo-traveller'
  },
  {
    id: 6,
    title: 'Guide to Airport Transfers: Avoiding Bangalore Traffic',
    date: 'Aug 10, 2026',
    excerpt: 'Kempegowda International Airport (BLR) is notorious for traffic delays. Here is our guide on the best times to travel and how to pre-book a reliable airport taxi.',
    image: '/vehicles/Toyota innova.webp',
    slug: 'airport-transfers-bangalore-traffic-guide'
  }
];

export default function BlogsPage() {
  return (
    <main className="min-h-screen bg-[#F9FAFB] pt-24 pb-20">
      
      {/* Header Section */}
      <div className="bg-[#0A3D73] py-16 mb-12">
        <div className="container-x">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-black text-white font-display mb-4">
              TripRide Travel Blog
            </h1>
            <p className="text-blue-100 text-lg">
              Expert guides, travel tips, and vehicle rental advice for your journeys across Karnataka and beyond.
            </p>
          </div>
        </div>
      </div>

      <div className="container-x max-w-5xl">
        <div className="flex flex-col gap-8">
          {blogs.map((blog) => (
            <article 
              key={blog.id} 
              className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row hover:shadow-lg transition-shadow group"
            >
              {/* Blog Image */}
              <div className="md:w-2/5 h-64 md:h-auto relative overflow-hidden bg-slate-100">
                <img 
                  src={blog.image} 
                  alt={blog.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              
              {/* Blog Content */}
              <div className="md:w-3/5 p-8 md:p-10 flex flex-col justify-center">
                <div className="flex items-center gap-2 text-[#FF7020] text-sm font-bold mb-3">
                  <Calendar size={14} />
                  <time>{blog.date}</time>
                </div>
                
                <h2 className="text-2xl font-black text-[#0A3D73] mb-4 leading-tight group-hover:text-[#FF7020] transition-colors">
                  <Link href={`/blogs/${blog.slug}`}>{blog.title}</Link>
                </h2>
                
                <p className="text-slate-500 mb-8 leading-relaxed">
                  {blog.excerpt}
                </p>
                
                <div className="mt-auto">
                  <Link 
                    href={`/blogs/${blog.slug}`}
                    className="inline-flex items-center gap-2 bg-[#FF7020] hover:bg-[#E55C0C] text-white font-bold py-2.5 px-6 rounded-lg transition-colors text-sm"
                  >
                    Read More <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
        
        {/* Pagination Dummy */}
        <div className="flex justify-center mt-12 gap-2">
          <button className="w-10 h-10 rounded-lg bg-[#0A3D73] text-white font-bold">1</button>
          <button className="w-10 h-10 rounded-lg bg-white border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors">2</button>
          <button className="w-10 h-10 rounded-lg bg-white border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors">3</button>
        </div>
      </div>
    </main>
  );
}
