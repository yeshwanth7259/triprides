// Complete Indian Cities, Tourist Destinations & Bangalore Localities Database
// Powers single-letter instant search & Ola-style outstation dropdowns

export interface PlaceItem {
  name: string;
  state: string;
  category: 'Popular Outstation' | 'Hill Station' | 'Beach' | 'Pilgrimage' | 'Major Metro' | 'Bangalore Locality' | 'Heritage';
  distanceKmFromBangalore: number;
  icon?: string;
  popular?: boolean;
}

export const ALL_INDIAN_PLACES: PlaceItem[] = [
  // --- POPULAR OUTSTATION DESTINATIONS FROM BANGALORE ---
  { name: 'Coorg (Madikeri)', state: 'Karnataka', category: 'Hill Station', distanceKmFromBangalore: 260, icon: '☕', popular: true },
  { name: 'Mysore (Mysuru)', state: 'Karnataka', category: 'Popular Outstation', distanceKmFromBangalore: 150, icon: '🏰', popular: true },
  { name: 'Ooty (Udhagamandalam)', state: 'Tamil Nadu', category: 'Hill Station', distanceKmFromBangalore: 280, icon: '🍵', popular: true },
  { name: 'Chikmagalur', state: 'Karnataka', category: 'Hill Station', distanceKmFromBangalore: 245, icon: '⛰️', popular: true },
  { name: 'Wayanad', state: 'Kerala', category: 'Hill Station', distanceKmFromBangalore: 285, icon: '🌴', popular: true },
  { name: 'Tirupati', state: 'Andhra Pradesh', category: 'Pilgrimage', distanceKmFromBangalore: 250, icon: '🛕', popular: true },
  { name: 'Goa (North & South Goa)', state: 'Goa', category: 'Beach', distanceKmFromBangalore: 580, icon: '🏖️', popular: true },
  { name: 'Pondicherry (Puducherry)', state: 'Puducherry', category: 'Beach', distanceKmFromBangalore: 315, icon: '🥐', popular: true },
  { name: 'Gokarna', state: 'Karnataka', category: 'Beach', distanceKmFromBangalore: 490, icon: '🌊', popular: true },
  { name: 'Kabini / Nagarhole', state: 'Karnataka', category: 'Popular Outstation', distanceKmFromBangalore: 220, icon: '🐅', popular: true },
  { name: 'Bandipur Tiger Reserve', state: 'Karnataka', category: 'Popular Outstation', distanceKmFromBangalore: 230, icon: '🦌', popular: true },
  { name: 'Hampi (Vijayanagara)', state: 'Karnataka', category: 'Heritage', distanceKmFromBangalore: 350, icon: '🏛️', popular: true },
  { name: 'Kodaikanal', state: 'Tamil Nadu', category: 'Hill Station', distanceKmFromBangalore: 465, icon: '🌸', popular: true },
  { name: 'Munnar', state: 'Kerala', category: 'Hill Station', distanceKmFromBangalore: 490, icon: '🌿', popular: true },
  { name: 'Nandi Hills', state: 'Karnataka', category: 'Hill Station', distanceKmFromBangalore: 60, icon: '🌄', popular: true },
  { name: 'Mangalore (Mangaluru)', state: 'Karnataka', category: 'Beach', distanceKmFromBangalore: 350, icon: '🐟', popular: true },
  { name: 'Udupi / Malpe Beach', state: 'Karnataka', category: 'Beach', distanceKmFromBangalore: 400, icon: '🥥', popular: true },
  { name: 'Murudeshwar', state: 'Karnataka', category: 'Pilgrimage', distanceKmFromBangalore: 480, icon: '🔱', popular: true },
  { name: 'Dharmasthala / Subramanya', state: 'Karnataka', category: 'Pilgrimage', distanceKmFromBangalore: 300, icon: '🙏', popular: true },
  { name: 'Shimoga / Jog Falls', state: 'Karnataka', category: 'Popular Outstation', distanceKmFromBangalore: 310, icon: '🌊', popular: true },
  { name: 'Sakleshpur', state: 'Karnataka', category: 'Hill Station', distanceKmFromBangalore: 220, icon: '🌲', popular: true },
  { name: 'Belur & Halebeedu', state: 'Karnataka', category: 'Heritage', distanceKmFromBangalore: 220, icon: '🗿', popular: true },
  { name: 'Yercaud', state: 'Tamil Nadu', category: 'Hill Station', distanceKmFromBangalore: 230, icon: '🍃', popular: true },
  { name: 'Coonoor', state: 'Tamil Nadu', category: 'Hill Station', distanceKmFromBangalore: 290, icon: '🚂', popular: true },
  { name: 'Madurai', state: 'Tamil Nadu', category: 'Pilgrimage', distanceKmFromBangalore: 435, icon: '🛕', popular: true },
  { name: 'Rameshwaram', state: 'Tamil Nadu', category: 'Pilgrimage', distanceKmFromBangalore: 600, icon: '🐚', popular: true },
  { name: 'Kanyakumari', state: 'Tamil Nadu', category: 'Beach', distanceKmFromBangalore: 670, icon: '🌅', popular: true },
  { name: 'Alleppey (Alappuzha Backwaters)', state: 'Kerala', category: 'Popular Outstation', distanceKmFromBangalore: 580, icon: '⛵', popular: true },
  { name: 'Kochi (Cochin)', state: 'Kerala', category: 'Popular Outstation', distanceKmFromBangalore: 540, icon: '⚓', popular: true },
  { name: 'Varkala Beach', state: 'Kerala', category: 'Beach', distanceKmFromBangalore: 680, icon: '🏄', popular: true },
  { name: 'Thekkady (Periyar)', state: 'Kerala', category: 'Popular Outstation', distanceKmFromBangalore: 510, icon: '🐘', popular: true },
  { name: 'Hyderabad', state: 'Telangana', category: 'Major Metro', distanceKmFromBangalore: 570, icon: '🏰', popular: true },
  { name: 'Chennai', state: 'Tamil Nadu', category: 'Major Metro', distanceKmFromBangalore: 340, icon: '🏖️', popular: true },
  { name: 'Coimbatore', state: 'Tamil Nadu', category: 'Major Metro', distanceKmFromBangalore: 360, icon: '🏭', popular: true },
  { name: 'Kurnool', state: 'Andhra Pradesh', category: 'Popular Outstation', distanceKmFromBangalore: 360, icon: '🏰' },
  { name: 'Anantapur / Lepakshi', state: 'Andhra Pradesh', category: 'Heritage', distanceKmFromBangalore: 140, icon: '🐂' },
  { name: 'Vijayawada', state: 'Andhra Pradesh', category: 'Major Metro', distanceKmFromBangalore: 660, icon: '🏙️' },
  { name: 'Visakhapatnam (Vizag)', state: 'Andhra Pradesh', category: 'Beach', distanceKmFromBangalore: 1000, icon: '🚢' },

  // --- KARNATAKA CITIES & DISTRICTS ---
  { name: 'Hubli (Hubballi)', state: 'Karnataka', category: 'Popular Outstation', distanceKmFromBangalore: 410 },
  { name: 'Dharwad', state: 'Karnataka', category: 'Popular Outstation', distanceKmFromBangalore: 430 },
  { name: 'Belgaum (Belagavi)', state: 'Karnataka', category: 'Popular Outstation', distanceKmFromBangalore: 505 },
  { name: 'Davangere', state: 'Karnataka', category: 'Popular Outstation', distanceKmFromBangalore: 260 },
  { name: 'Chitradurga (Fort)', state: 'Karnataka', category: 'Heritage', distanceKmFromBangalore: 200 },
  { name: 'Bellary (Ballari)', state: 'Karnataka', category: 'Popular Outstation', distanceKmFromBangalore: 310 },
  { name: 'Gulbarga (Kalaburagi)', state: 'Karnataka', category: 'Popular Outstation', distanceKmFromBangalore: 575 },
  { name: 'Bijapur (Vijayapura / Gol Gumbaz)', state: 'Karnataka', category: 'Heritage', distanceKmFromBangalore: 530 },
  { name: 'Bidar', state: 'Karnataka', category: 'Heritage', distanceKmFromBangalore: 670 },
  { name: 'Hassan', state: 'Karnataka', category: 'Popular Outstation', distanceKmFromBangalore: 180 },
  { name: 'Tumkur (Tumakuru)', state: 'Karnataka', category: 'Popular Outstation', distanceKmFromBangalore: 70 },
  { name: 'Mandya', state: 'Karnataka', category: 'Popular Outstation', distanceKmFromBangalore: 100 },
  { name: 'Kolar', state: 'Karnataka', category: 'Popular Outstation', distanceKmFromBangalore: 70 },
  { name: 'Chikkaballapur', state: 'Karnataka', category: 'Popular Outstation', distanceKmFromBangalore: 60 },
  { name: 'Koppal', state: 'Karnataka', category: 'Popular Outstation', distanceKmFromBangalore: 360 },
  { name: 'Gadag', state: 'Karnataka', category: 'Popular Outstation', distanceKmFromBangalore: 390 },
  { name: 'Haveri', state: 'Karnataka', category: 'Popular Outstation', distanceKmFromBangalore: 340 },
  { name: 'Sirsi', state: 'Karnataka', category: 'Hill Station', distanceKmFromBangalore: 410 },
  { name: 'Karwar', state: 'Karnataka', category: 'Beach', distanceKmFromBangalore: 520 },
  { name: 'Dandeli (River Rafting)', state: 'Karnataka', category: 'Popular Outstation', distanceKmFromBangalore: 460, icon: '🛶' },
  { name: 'Agumbe (Cherrapunji of South)', state: 'Karnataka', category: 'Hill Station', distanceKmFromBangalore: 350, icon: '🐍' },
  { name: 'Kudremukh', state: 'Karnataka', category: 'Hill Station', distanceKmFromBangalore: 310, icon: '🏞️' },
  { name: 'Sringeri (Sharada Peetham)', state: 'Karnataka', category: 'Pilgrimage', distanceKmFromBangalore: 320, icon: '🛕' },
  { name: 'Horanadu (Annapoorneshwari)', state: 'Karnataka', category: 'Pilgrimage', distanceKmFromBangalore: 310, icon: '🍚' },
  { name: 'Kukke Subramanya', state: 'Karnataka', category: 'Pilgrimage', distanceKmFromBangalore: 280, icon: '🐍' },
  { name: 'Channapatna (Toy City)', state: 'Karnataka', category: 'Popular Outstation', distanceKmFromBangalore: 60 },

  // --- BANGALORE LOCAL PICKUP HUBS & AREAS ---
  { name: 'Uttharhalli', state: 'Bangalore, Karnataka', category: 'Bangalore Locality', distanceKmFromBangalore: 0, icon: '📍', popular: true },
  { name: 'Jayanagar (1st to 9th Block)', state: 'Bangalore, Karnataka', category: 'Bangalore Locality', distanceKmFromBangalore: 0, icon: '📍', popular: true },
  { name: 'JP Nagar (Phases 1-9)', state: 'Bangalore, Karnataka', category: 'Bangalore Locality', distanceKmFromBangalore: 0, icon: '📍', popular: true },
  { name: 'Indiranagar / 100ft Road', state: 'Bangalore, Karnataka', category: 'Bangalore Locality', distanceKmFromBangalore: 0, icon: '📍', popular: true },
  { name: 'Koramangala', state: 'Bangalore, Karnataka', category: 'Bangalore Locality', distanceKmFromBangalore: 0, icon: '📍', popular: true },
  { name: 'Whitefield / ITPL', state: 'Bangalore, Karnataka', category: 'Bangalore Locality', distanceKmFromBangalore: 0, icon: '📍', popular: true },
  { name: 'Electronic City (Phase 1 & 2)', state: 'Bangalore, Karnataka', category: 'Bangalore Locality', distanceKmFromBangalore: 0, icon: '📍', popular: true },
  { name: 'Hebbal / Manyata Tech Park', state: 'Bangalore, Karnataka', category: 'Bangalore Locality', distanceKmFromBangalore: 0, icon: '📍', popular: true },
  { name: 'Kempegowda International Airport (BLR)', state: 'Bangalore, Karnataka', category: 'Bangalore Locality', distanceKmFromBangalore: 40, icon: '✈️', popular: true },
  { name: 'Majestic / KSR Railway Station', state: 'Bangalore, Karnataka', category: 'Bangalore Locality', distanceKmFromBangalore: 0, icon: '🚆', popular: true },
  { name: 'Marathahalli / Bellandur', state: 'Bangalore, Karnataka', category: 'Bangalore Locality', distanceKmFromBangalore: 0, icon: '📍' },
  { name: 'BTM Layout / Silk Board', state: 'Bangalore, Karnataka', category: 'Bangalore Locality', distanceKmFromBangalore: 0, icon: '📍' },
  { name: 'HSR Layout (Sectors 1-7)', state: 'Bangalore, Karnataka', category: 'Bangalore Locality', distanceKmFromBangalore: 0, icon: '📍' },
  { name: 'Banashankari (1st to 6th Stage)', state: 'Bangalore, Karnataka', category: 'Bangalore Locality', distanceKmFromBangalore: 0, icon: '📍' },
  { name: 'Rajarajeshwari Nagar (RR Nagar)', state: 'Bangalore, Karnataka', category: 'Bangalore Locality', distanceKmFromBangalore: 0, icon: '📍' },
  { name: 'Yelahanka / Sahakar Nagar', state: 'Bangalore, Karnataka', category: 'Bangalore Locality', distanceKmFromBangalore: 0, icon: '📍' },
  { name: 'Malleshwaram / Rajajinagar', state: 'Bangalore, Karnataka', category: 'Bangalore Locality', distanceKmFromBangalore: 0, icon: '📍' },
  { name: 'Yeshwanthpur Railway Station', state: 'Bangalore, Karnataka', category: 'Bangalore Locality', distanceKmFromBangalore: 0, icon: '🚆' },
  { name: 'Kengeri / Mysore Road', state: 'Bangalore, Karnataka', category: 'Bangalore Locality', distanceKmFromBangalore: 0, icon: '📍' },
  { name: 'Kanakapura Road / Art of Living', state: 'Bangalore, Karnataka', category: 'Bangalore Locality', distanceKmFromBangalore: 0, icon: '📍' },
  { name: 'Bannerghatta Road / National Park', state: 'Bangalore, Karnataka', category: 'Bangalore Locality', distanceKmFromBangalore: 0, icon: '📍' },
  { name: 'Sarjapur Road', state: 'Bangalore, Karnataka', category: 'Bangalore Locality', distanceKmFromBangalore: 0, icon: '📍' },

  // --- PAN INDIA MAJOR DESTINATIONS ---
  { name: 'Mumbai', state: 'Maharashtra', category: 'Major Metro', distanceKmFromBangalore: 980, icon: '🏙️' },
  { name: 'Pune', state: 'Maharashtra', category: 'Major Metro', distanceKmFromBangalore: 840, icon: '🏢' },
  { name: 'Mahabaleshwar', state: 'Maharashtra', category: 'Hill Station', distanceKmFromBangalore: 790, icon: '🍓' },
  { name: 'Lonavala & Khandala', state: 'Maharashtra', category: 'Hill Station', distanceKmFromBangalore: 900, icon: '🌄' },
  { name: 'Shirdi (Sai Baba)', state: 'Maharashtra', category: 'Pilgrimage', distanceKmFromBangalore: 950, icon: '🛕' },
  { name: 'Jaipur (Pink City)', state: 'Rajasthan', category: 'Heritage', distanceKmFromBangalore: 1980, icon: '🏰' },
  { name: 'Udaipur (City of Lakes)', state: 'Rajasthan', category: 'Heritage', distanceKmFromBangalore: 1650, icon: '⛵' },
  { name: 'Jodhpur', state: 'Rajasthan', category: 'Heritage', distanceKmFromBangalore: 1850, icon: '🏰' },
  { name: 'Jaisalmer (Golden City)', state: 'Rajasthan', category: 'Heritage', distanceKmFromBangalore: 2050, icon: '🐪' },
  { name: 'New Delhi / NCR', state: 'Delhi', category: 'Major Metro', distanceKmFromBangalore: 2150, icon: '🏛️' },
  { name: 'Agra (Taj Mahal)', state: 'Uttar Pradesh', category: 'Heritage', distanceKmFromBangalore: 1950, icon: '🕌' },
  { name: 'Varanasi (Kashi)', state: 'Uttar Pradesh', category: 'Pilgrimage', distanceKmFromBangalore: 1800, icon: '🪔' },
  { name: 'Rishikesh & Haridwar', state: 'Uttarakhand', category: 'Pilgrimage', distanceKmFromBangalore: 2350, icon: '🧘' },
  { name: 'Manali & Rohtang Pass', state: 'Himachal Pradesh', category: 'Hill Station', distanceKmFromBangalore: 2600, icon: '❄️' },
  { name: 'Shimla & Kufri', state: 'Himachal Pradesh', category: 'Hill Station', distanceKmFromBangalore: 2450, icon: '🏔️' },
  { name: 'Kolkata', state: 'West Bengal', category: 'Major Metro', distanceKmFromBangalore: 1880, icon: '🚋' },
  { name: 'Darjeeling', state: 'West Bengal', category: 'Hill Station', distanceKmFromBangalore: 2450, icon: '🍵' }
];

// Helper to filter places by user query (matches even on 1 letter)
export function searchPlaces(query: string, limit = 10): PlaceItem[] {
  if (!query || !query.trim()) {
    return ALL_INDIAN_PLACES.filter(p => p.popular).slice(0, limit);
  }

  const cleanQ = query.trim().toLowerCase();
  
  // 1. Exact or prefix matches first
  const prefixMatches = ALL_INDIAN_PLACES.filter(p => 
    p.name.toLowerCase().startsWith(cleanQ) || 
    p.state.toLowerCase().startsWith(cleanQ)
  );

  // 2. Substring matches second
  const substringMatches = ALL_INDIAN_PLACES.filter(p => 
    !p.name.toLowerCase().startsWith(cleanQ) && 
    !p.state.toLowerCase().startsWith(cleanQ) &&
    (p.name.toLowerCase().includes(cleanQ) || p.state.toLowerCase().includes(cleanQ) || p.category.toLowerCase().includes(cleanQ))
  );

  const combined = [...prefixMatches, ...substringMatches];
  return combined.slice(0, limit);
}
