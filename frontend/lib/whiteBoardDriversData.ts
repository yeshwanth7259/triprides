// Verified Drivers for Hire - Personal & White Board Vehicles
// Hire an experienced chauffeur to drive your personal car safely across Karnataka & South India

export interface WhiteBoardDriver {
  id: string;
  name: string;
  phone: string;
  phoneTel: string;
  phoneRaw: string;
  city: string;
  state: string;
  roleTitle: string;
  vehiclesDriven: string[]; // All types of vehicles he can drive
  transmissionTypes: ('Manual' | 'Automatic')[];
  rating: number;
  reviewsCount: number;
  experienceYears: number;
  tripsCompleted: number;
  dayRateLocal: number; // 8 hrs / local city
  dayRateOutstation: number; // Per day outstation
  serviceTypes: string[];
  languages: string[];
  avatar: string;
  verified: boolean;
  aadhaarVerified: boolean;
  policeVerified: boolean;
  dlVerified: boolean;
  bio: string;
  specialties: string[];
  popularRoutes: string[];
}

export const WHITE_BOARD_DRIVERS: WhiteBoardDriver[] = [
  {
    id: 'driver-yeshwanth-k',
    name: 'Yeshwanth K',
    phone: '+91 72593 35286',
    phoneTel: '+917259335286',
    phoneRaw: '7259335286',
    city: 'Bengaluru',
    state: 'Karnataka',
    roleTitle: 'Professional Personal Chauffeur (Sedan & SUV Specialist)',
    vehiclesDriven: [
      'All Sedans (Swift Dzire, Toyota Etios, Honda City, Hyundai Verna, Ciaz, Virtus, Slavia)',
      'Full-Size SUVs & MPVs (Innova Crysta, Fortuner, Scorpio-N, XUV700, Tata Safari, Ertiga)',
      'Compact & Mid SUVs (Creta, Seltos, Brezza, Nexon, Grand Vitara, Elevate)',
      'Manual & Automatic Transmission Certified'
    ],
    transmissionTypes: ['Manual', 'Automatic'],
    rating: 4.96,
    reviewsCount: 342,
    experienceYears: 10,
    tripsCompleted: 850,
    dayRateLocal: 799,       // 8 Hr local Bangalore city driving
    dayRateOutstation: 1199, // Per day outstation driving
    serviceTypes: [
      'Outstation Weekend Trips (Coorg, Ooty, Chikmagalur, Goa)',
      'Daily Office Commute (Electronic City, Whitefield, ORR)',
      'Airport Pickup & Drop in Your Personal Car',
      'Night Driving & Family Function Chauffeur',
      'Interstate Highway Long Distance Travel'
    ],
    languages: ['Kannada (Fluent)', 'English (Fluent)', 'Hindi (Fluent)', 'Telugu (Conversational)'],
    avatar: '/drivers/yeshwanth-k.jpg',
    verified: true,
    aadhaarVerified: true,
    policeVerified: true,
    dlVerified: true,
    bio: 'Highly skilled, verified personal driver with 10+ years of flawless highway and city driving record. Dedicated specialist in driving all Sedans and SUVs with both Manual and Automatic transmissions. Expert in navigating Western Ghats (Coorg, Chikmagalur, Ooty 36 hairpins) and Karnataka expressways safely. Non-smoker, punctual, courteous professional etiquette.',
    specialties: [
      'Sedan & SUV Specialist (Manual & Automatic)',
      'Western Ghats & Mountain Route Specialist',
      'Flawless Bangalore City & Highway Navigation',
      'Defensive Driving Certified & 100% Punctual',
      'Family & Corporate Executive Etiquette'
    ],
    popularRoutes: [
      'Bengaluru ⇄ Mysore Expressway',
      'Bengaluru ⇄ Coorg / Chikmagalur',
      'Bengaluru ⇄ Ooty / Wayanad',
      'Bengaluru ⇄ Tirupati / Chennai',
      'BLR Kempegowda Airport Runs',
      'City Daily Office Commutes'
    ]
  }
];
