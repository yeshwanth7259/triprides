// Single source of truth for BookMyRoute Fleet, Pricing & Contact details
export const CONTACT_PHONE = "+91 73531 87804";
export const CONTACT_PHONE_TEL = "+917353187804";
export const CONTACT_PHONE_WA = "917353187804";
export const CONTACT_EMAIL = "bookmyroute06@gmail.com";
export const OFFICE_ADDRESS = "Uttharhalli, Bangalore, Karnataka - 560061";

export type VehicleCategory = 'cab' | 'tempo' | 'minibus' | 'bus';

export interface VehicleModel {
  id: string;
  name: string;
  category: VehicleCategory;
  categoryLabel: string;
  seats: number;
  seatsLabel: string;
  ac: boolean;
  pushback: boolean;
  image: string;
  description: string;
  features: string[];
  luggageCapacity: string;
  pricing: {
    outstationPerKm: number;
    minKmPerDay: number;
    driverBataPerDay: number;
    local8Hr80Km: number;
    extraKmRate: number;
    extraHrRate: number;
    airportFlatRate: number;
  };
}

export const FLEET_DATA: VehicleModel[] = [
  // --- CABS (4 - 7 SEATS) ---
  {
    id: 'sedan-4',
    name: 'Sedan (Swift Dzire / Etios)',
    category: 'cab',
    categoryLabel: 'Cab',
    seats: 4,
    seatsLabel: '4+1 Seats',
    ac: true,
    pushback: false,
    image: '/vehicles/New-Maruti-Suzuki-Dzire-1-jpg.webp',
    description: 'Comfortable, fuel-efficient sedan for small family trips, city sightseeing, and airport transfers.',
    features: ['Chilled Air Conditioning', 'Spacious Boot Space', 'Aux/USB Sound System', 'Clean & Sanitized Cabin'],
    luggageCapacity: '2 Large Bags + 2 Small Bags',
    pricing: {
      outstationPerKm: 13,
      minKmPerDay: 300,
      driverBataPerDay: 400,
      local8Hr80Km: 1800,
      extraKmRate: 14,
      extraHrRate: 150,
      airportFlatRate: 1200
    }
  },
  {
    id: 'suv-ertiga-6',
    name: 'Maruti Ertiga (6-Seater SUV)',
    category: 'cab',
    categoryLabel: 'Cab',
    seats: 6,
    seatsLabel: '6+1 Seats',
    ac: true,
    pushback: true,
    image: '/vehicles/maruti-ertiga.jpg',
    description: 'Spacious 6-seater family SUV with foldable rear seats, smooth ride, and great comfort for Karnataka highways.',
    features: ['Dual AC Vents', 'Reclining Middle Row', 'Rear USB Charging', 'Large Luggage Carrier Available'],
    luggageCapacity: '3 Large Bags + 3 Small Bags',
    pricing: {
      outstationPerKm: 17,
      minKmPerDay: 300,
      driverBataPerDay: 450,
      local8Hr80Km: 2400,
      extraKmRate: 17,
      extraHrRate: 175,
      airportFlatRate: 1600
    }
  },
  {
    id: 'suv-crysta-7',
    name: 'Toyota Innova Crysta (7-Seater Premium SUV)',
    category: 'cab',
    categoryLabel: 'Cab',
    seats: 7,
    seatsLabel: '7+1 Seats',
    ac: true,
    pushback: true,
    image: '/vehicles/Toyota innova.webp',
    description: 'The ultimate benchmark in long-distance comfort, supreme ride quality, captain seats, and powerful AC.',
    features: ['Captain Seat Layout', 'Independent Rear Climate Control', 'Ultra-Quiet Cabin', 'Premium Leatherette Seats'],
    luggageCapacity: '4 Large Bags + 3 Small Bags',
    pricing: {
      outstationPerKm: 22,
      minKmPerDay: 300,
      driverBataPerDay: 500,
      local8Hr80Km: 3200,
      extraKmRate: 22,
      extraHrRate: 200,
      airportFlatRate: 2200
    }
  },

  // --- TEMPO TRAVELLER (8 - 20 SEATS) ---
  {
    id: 'tempo-9-maharaja',
    name: '9/10 Seater Maharaja Luxury Tempo Traveller',
    category: 'tempo',
    categoryLabel: 'Tempo Traveller',
    seats: 10,
    seatsLabel: '9/10+1 Seats',
    ac: true,
    pushback: true,
    image: '/vehicles/TEMPO-TRAVELLER-1.webp',
    description: 'Ultra-luxurious 1x1 Maharaja captain seats with individual armrests, personal reading lights, and premium interior finish.',
    features: ['1x1 Maharaja Recliners', 'Ambient Ceiling Lights', 'LED TV & Subwoofer Audio', 'Individual AC Vents & Charging Ports'],
    luggageCapacity: '8 Large Bags Dedicated Boot',
    pricing: {
      outstationPerKm: 24,
      minKmPerDay: 300,
      driverBataPerDay: 500,
      local8Hr80Km: 4000,
      extraKmRate: 24,
      extraHrRate: 250,
      airportFlatRate: 3000
    }
  },
  {
    id: 'tempo-12',
    name: '12 Seater AC Tempo Traveller',
    category: 'tempo',
    categoryLabel: 'Tempo Traveller',
    seats: 12,
    seatsLabel: '12+1 Seats',
    ac: true,
    pushback: true,
    image: '/vehicles/TEMPO-TRAVELLER-1.webp',
    description: 'Best-selling group vehicle for family tours, temple visits, and Coorg/Ooty holidays with 2x1 seating configuration.',
    features: ['2x1 Pushback Seats', 'Rear Luggage Boot & Top Carrier', 'LED TV & High-Power Music', 'First Aid Kit & Fire Extinguisher'],
    luggageCapacity: '10 Large Bags + Cabin Packs',
    pricing: {
      outstationPerKm: 22,
      minKmPerDay: 300,
      driverBataPerDay: 500,
      local8Hr80Km: 3800,
      extraKmRate: 22,
      extraHrRate: 250,
      airportFlatRate: 2800
    }
  },
  {
    id: 'tempo-14',
    name: '14 Seater Premium Tempo Traveller',
    category: 'tempo',
    categoryLabel: 'Tempo Traveller',
    seats: 14,
    seatsLabel: '14+1 Seats',
    ac: true,
    pushback: true,
    image: '/vehicles/tempo-traveller-17.jpg',
    description: 'High-roof Force Traveller with extra headspace, generous legroom, and smooth suspension for long highway journeys.',
    features: ['Ergonomic Pushback Seats', 'Surround Sound Audio', 'Separate Luggage Chamber', 'Uniformed Route Driver'],
    luggageCapacity: '12 Large Bags',
    pricing: {
      outstationPerKm: 24,
      minKmPerDay: 300,
      driverBataPerDay: 500,
      local8Hr80Km: 4200,
      extraKmRate: 24,
      extraHrRate: 250,
      airportFlatRate: 3200
    }
  },
  {
    id: 'tempo-17',
    name: '17 Seater AC Tempo Traveller',
    category: 'tempo',
    categoryLabel: 'Tempo Traveller',
    seats: 17,
    seatsLabel: '17+1 Seats',
    ac: true,
    pushback: true,
    image: '/vehicles/tempo-traveller-17.jpg',
    description: 'Spacious 17-passenger vehicle tailored for medium wedding guest transport, corporate outings, and college trips.',
    features: ['2x1 Seating Layout', 'Individual AC Louvers', 'Microphone System for Tour Guides', 'Heavy Luggage Carrier'],
    luggageCapacity: '14 Large Bags + Rooftop Carrier',
    pricing: {
      outstationPerKm: 26,
      minKmPerDay: 300,
      driverBataPerDay: 550,
      local8Hr80Km: 4600,
      extraKmRate: 26,
      extraHrRate: 300,
      airportFlatRate: 3600
    }
  },
  {
    id: 'tempo-20',
    name: '20 Seater AC Tempo Traveller',
    category: 'tempo',
    categoryLabel: 'Tempo Traveller',
    seats: 20,
    seatsLabel: '20+1 Seats',
    ac: true,
    pushback: true,
    image: '/vehicles/Traveller-3050WB-9D-12D-13D_mob.webp',
    description: 'Maximum capacity tempo traveller offering bus-grade space with tempo agility on Karnataka winding routes.',
    features: ['2x2 Pushback Plush Seats', 'Twin AC Compressors for Rapid Cooling', 'Wide Center Aisle', 'Heavy-Duty Shock Absorbers'],
    luggageCapacity: '16 Bags + Roof Carrier',
    pricing: {
      outstationPerKm: 28,
      minKmPerDay: 300,
      driverBataPerDay: 600,
      local8Hr80Km: 5000,
      extraKmRate: 28,
      extraHrRate: 300,
      airportFlatRate: 4000
    }
  },

  // --- MINI BUS (12 - 25 SEATS) ---
  {
    id: 'minibus-21',
    name: '21 Seater AC Mini Bus',
    category: 'minibus',
    categoryLabel: 'Mini Bus',
    seats: 21,
    seatsLabel: '21+1 Seats',
    ac: true,
    pushback: true,
    image: '/vehicles/21seater-bus.webp',
    description: 'Compact coach experience for corporate teams, school excursions, and family functions with panoramic windows.',
    features: ['2x2 High Back Pushback Seats', 'Chilled Ducted AC', 'Panoramic Tinted Windows', 'Huge Under-Floor Luggage Space'],
    luggageCapacity: '20 Large Bags Dedicated Storage',
    pricing: {
      outstationPerKm: 32,
      minKmPerDay: 300,
      driverBataPerDay: 600,
      local8Hr80Km: 6500,
      extraKmRate: 32,
      extraHrRate: 350,
      airportFlatRate: 4800
    }
  },
  {
    id: 'minibus-25',
    name: '25 Seater Luxury AC Mini Bus',
    category: 'minibus',
    categoryLabel: 'Mini Bus',
    seats: 25,
    seatsLabel: '25+1 Seats',
    ac: true,
    pushback: true,
    image: '/vehicles/21seater-bus.webp',
    description: 'Premier 25-seater coach featuring air suspension, individual AC controls, and entertainment display.',
    features: ['Air Suspension for Bumper-Free Ride', 'Curtains on All Windows', 'HD Video Coach System', 'Underbelly Storage Hold'],
    luggageCapacity: '25 Large Suitcases',
    pricing: {
      outstationPerKm: 36,
      minKmPerDay: 300,
      driverBataPerDay: 700,
      local8Hr80Km: 7500,
      extraKmRate: 36,
      extraHrRate: 400,
      airportFlatRate: 5500
    }
  },

  // --- BUS (27 - 50 SEATS - Strictly Seating/Pushback Only, NO Sleeper, NO Luxury Multi-axle) ---
  {
    id: 'bus-32',
    name: '32 Seater Pushback Tourist Coach Bus',
    category: 'bus',
    categoryLabel: 'Bus',
    seats: 32,
    seatsLabel: '32+1 Seats',
    ac: true,
    pushback: true,
    image: '/vehicles/bus3a.jpg',
    description: 'Standard 32-seater pushback seating coach built for inter-city group travel, industrial visits, and pilgrimage tours.',
    features: ['2x2 Reclining Pushback Seats', 'Central High-Power AC', 'Surround Sound Audio System', 'Large Luggage Diky'],
    luggageCapacity: '30+ Large Bags Underbelly',
    pricing: {
      outstationPerKm: 42,
      minKmPerDay: 300,
      driverBataPerDay: 800,
      local8Hr80Km: 9000,
      extraKmRate: 42,
      extraHrRate: 450,
      airportFlatRate: 6500
    }
  },
  {
    id: 'bus-40',
    name: '40 Seater Deluxe Pushback Bus',
    category: 'bus',
    categoryLabel: 'Bus',
    seats: 40,
    seatsLabel: '40+1 Seats',
    ac: true,
    pushback: true,
    image: '/vehicles/coach-bus-40.jpg',
    description: 'Comfortable 40-seater pushback passenger coach for corporate employee transport, college fests, and wedding parties.',
    features: ['Wide 2x2 Pushback Seating', 'Dual Emergency Exits', 'High Roof Airy Interior', 'Massive Luggage Capacity'],
    luggageCapacity: '40+ Luggage Bags',
    pricing: {
      outstationPerKm: 48,
      minKmPerDay: 300,
      driverBataPerDay: 800,
      local8Hr80Km: 10500,
      extraKmRate: 48,
      extraHrRate: 500,
      airportFlatRate: 7500
    }
  },
  {
    id: 'bus-50',
    name: '50 Seater Standard Coach Bus (Pushback)',
    category: 'bus',
    categoryLabel: 'Bus',
    seats: 50,
    seatsLabel: '50+1 Seats',
    ac: true,
    pushback: true,
    image: '/vehicles/50-seater-bus1.jpg',
    description: 'Heavy passenger capacity 50-seater seating bus for large conferences, school excursions, and convention transfers.',
    features: ['2x3 / 2x2 Seating Structure', 'Generous Window Clearance', 'Experienced Heavy-Vehicle Driver', 'Large Under-Belly Luggage Compartments'],
    luggageCapacity: '50+ Large Suitcases',
    pricing: {
      outstationPerKm: 54,
      minKmPerDay: 300,
      driverBataPerDay: 900,
      local8Hr80Km: 12000,
      extraKmRate: 54,
      extraHrRate: 500,
      airportFlatRate: 8500
    }
  }
];

export const VEHICLE_CATEGORIES_CONFIG = [
  {
    id: 'cab' as VehicleCategory,
    name: 'Cab',
    seatRange: '4–7 Seats',
    desc: 'Sedans & SUVs for quick city & outstation runs',
    icon: 'cab'
  },
  {
    id: 'tempo' as VehicleCategory,
    name: 'Tempo Traveller',
    seatRange: '8–20 Seats',
    desc: 'Maharaja & Standard pushback TT for group holidays',
    icon: 'tempo'
  },
  {
    id: 'minibus' as VehicleCategory,
    name: 'Mini Bus',
    seatRange: '12–25 Seats',
    desc: 'Compact luxury coach with ample luggage hold',
    icon: 'minibus'
  },
  {
    id: 'bus' as VehicleCategory,
    name: 'Bus',
    seatRange: '27–50 Seats',
    desc: 'Pushback seating tourist coaches for events & tours',
    icon: 'bus'
  }
];

export interface BookingDetails {
  fullName: string;
  mobile: string;
  email?: string;
  pickupLocation: string;
  dropLocation?: string;
  category: VehicleCategory;
  vehicleId: string;
  vehicleName: string;
  tripType: 'Outstation Round Trip' | 'Local 8Hr/80Km' | 'Airport Pickup/Drop' | 'One Way Outstation';
  travelDate: string;
  travelTime?: string;
  returnDate?: string;
  passengers?: number | string;
  notes?: string;
}

export function formatWhatsAppMessage(details: BookingDetails): string {
  const tripTypeStr = details.tripType;
  const returnStr = details.returnDate ? `\n🔄 *Return Date:* ${details.returnDate}` : '';
  const timeStr = details.travelTime ? ` at ${details.travelTime}` : '';
  const emailStr = details.email ? `\n📧 *Email:* ${details.email}` : '';
  const notesStr = details.notes ? `\n📝 *Notes:* ${details.notes}` : '';
  const dropStr = details.dropLocation ? `\n🎯 *Destination / Drop:* ${details.dropLocation}` : '';

  const matchedVehicle = FLEET_DATA.find(v => v.id === details.vehicleId || v.name === details.vehicleName);
  let estInfo = '';
  if (matchedVehicle) {
    if (tripTypeStr.includes('Local')) {
      estInfo = `\n💰 *Base Package:* ₹${matchedVehicle.pricing.local8Hr80Km.toLocaleString()} (8Hr / 80Km)`;
    } else if (tripTypeStr.includes('Airport')) {
      estInfo = `\n💰 *Airport Flat Rate:* ₹${matchedVehicle.pricing.airportFlatRate.toLocaleString()}`;
    } else {
      estInfo = `\n💰 *Outstation Rate:* ₹${matchedVehicle.pricing.outstationPerKm}/km + ₹${matchedVehicle.pricing.driverBataPerDay}/day Driver Bata (Min 300km/day)`;
    }
  }

  return `*🚕 BookMyRoute Trip Quotation Request*
----------------------------------------
👤 *Name:* ${details.fullName}
📱 *Phone:* +91 ${details.mobile.replace(/^\+?91/, '').trim()}${emailStr}
📍 *Pickup:* ${details.pickupLocation}${dropStr}
🛣️ *Trip Type:* ${tripTypeStr}
📅 *Travel Date:* ${details.travelDate}${timeStr}${returnStr}
👥 *Passengers:* ${details.passengers || 'As per vehicle'}
🚐 *Vehicle:* ${details.vehicleName}${estInfo}${notesStr}
----------------------------------------
_Please send me the final price quotation and availability._`;
}

export function getWhatsAppBookingUrl(details: BookingDetails): string {
  const text = formatWhatsAppMessage(details);
  return `https://wa.me/${CONTACT_PHONE_WA}?text=${encodeURIComponent(text)}`;
}
