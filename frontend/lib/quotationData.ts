// Standard Transparent Market Rates & Route Quotation Data
// Clean Market Pricing across Karnataka and South India

export interface VehiclePricing {
  id: string;
  name: string;
  shortName: string;
  seats: string;
  ratePerKm: number;
  driverBataPerDay: number;
  minKmPerDay: number;
  localPackageRate: number; // 8 hr / 80 km
  localExtraKmRate: number;
  localExtraHrRate: number;
  image: string;
}

export const FLEET_PRICING: VehiclePricing[] = [
  {
    id: 'sedan',
    name: 'Swift Dzire / Toyota Etios (Sedan AC)',
    shortName: 'Sedan (Dzire / Etios)',
    seats: '4+1 Seats',
    ratePerKm: 12,
    driverBataPerDay: 400,
    minKmPerDay: 250,
    localPackageRate: 1800,
    localExtraKmRate: 12,
    localExtraHrRate: 150,
    image: '/vehicles/Toyota innova.webp'
  },
  {
    id: 'ertiga',
    name: 'Maruti Ertiga / Triber (6-Seater SUV)',
    shortName: 'Maruti Ertiga (6+1 Seats)',
    seats: '6+1 Seats',
    ratePerKm: 16,
    driverBataPerDay: 450,
    minKmPerDay: 250,
    localPackageRate: 2400,
    localExtraKmRate: 16,
    localExtraHrRate: 175,
    image: '/vehicles/Toyota innova.webp'
  },
  {
    id: 'innova',
    name: 'Toyota Innova Crysta (Luxury 7-Seater)',
    shortName: 'Innova Crysta (7+1 Seats)',
    seats: '7+1 Seats',
    ratePerKm: 21,
    driverBataPerDay: 500,
    minKmPerDay: 250,
    localPackageRate: 3200,
    localExtraKmRate: 21,
    localExtraHrRate: 200,
    image: '/vehicles/Toyota innova.webp'
  },
  {
    id: 'tempo-12',
    name: '12 Seater AC Tempo Traveller (Luxury Pushback)',
    shortName: '12 Seater TT (Pushback)',
    seats: '12+1 Seats',
    ratePerKm: 21,
    driverBataPerDay: 500,
    minKmPerDay: 300,
    localPackageRate: 3400,
    localExtraKmRate: 21,
    localExtraHrRate: 250,
    image: '/vehicles/tempo-traveller-17.jpg'
  },
  {
    id: 'tempo-17',
    name: '14/17 Seater Maharaja Luxury Tempo Traveller',
    shortName: '14/17 Seater Maharaja TT',
    seats: '14-17 Seats',
    ratePerKm: 24,
    driverBataPerDay: 600,
    minKmPerDay: 300,
    localPackageRate: 3800,
    localExtraKmRate: 24,
    localExtraHrRate: 300,
    image: '/vehicles/tempo-traveller-17.jpg'
  },
  {
    id: 'tempo-20',
    name: '20 Seater Executive AC Tempo Traveller',
    shortName: '20 Seater Executive TT',
    seats: '20+1 Seats',
    ratePerKm: 27,
    driverBataPerDay: 650,
    minKmPerDay: 300,
    localPackageRate: 4400,
    localExtraKmRate: 27,
    localExtraHrRate: 350,
    image: '/vehicles/tempo-traveller-17.jpg'
  },
  {
    id: 'minibus-21',
    name: '21/25 Seater AC Luxury Mini Bus',
    shortName: '21/25 Seater Mini Bus',
    seats: '21-25 Seats',
    ratePerKm: 32,
    driverBataPerDay: 700,
    minKmPerDay: 300,
    localPackageRate: 5400,
    localExtraKmRate: 32,
    localExtraHrRate: 400,
    image: '/vehicles/21seater-bus.webp'
  },
  {
    id: 'coach-32',
    name: '32/50 Seater Pushback Tourist Coach Bus',
    shortName: '32/50 Seater Coach Bus',
    seats: '32-50 Seats',
    ratePerKm: 42,
    driverBataPerDay: 900,
    minKmPerDay: 350,
    localPackageRate: 7800,
    localExtraKmRate: 42,
    localExtraHrRate: 600,
    image: '/vehicles/coach-bus-40.jpg'
  }
];

export interface DestinationRoute {
  name: string;
  state: string;
  roundTripKm: number;
  oneWayKm: number;
  standardDays: number;
  tollEstimate: number;
  permitEstimate: number;
  routeHighlights: string;
}

export const POPULAR_ROUTES: DestinationRoute[] = [
  { 
    name: 'Coorg (Madikeri / Kushalnagar / Virajpet)', 
    state: 'Karnataka', 
    roundTripKm: 560, 
    oneWayKm: 260, 
    standardDays: 2, 
    tollEstimate: 330, 
    permitEstimate: 0, 
    routeHighlights: 'Bengaluru → Mysuru Expressway → Hunsur → Kushalnagar → Madikeri' 
  },
  { 
    name: 'Mysore (Palace / Chamundi Hills / Brindavan)', 
    state: 'Karnataka', 
    roundTripKm: 320, 
    oneWayKm: 150, 
    standardDays: 1, 
    tollEstimate: 330, 
    permitEstimate: 0, 
    routeHighlights: 'Bengaluru-Mysuru 10-Lane Expressway' 
  },
  { 
    name: 'Ooty / Coonoor (The Nilgiris Hills)', 
    state: 'Tamil Nadu', 
    roundTripKm: 620, 
    oneWayKm: 280, 
    standardDays: 3, 
    tollEstimate: 450, 
    permitEstimate: 500, 
    routeHighlights: 'Mysore Expressway → Bandipur National Park → Mudumalai 36 Hairpin Bends' 
  },
  { 
    name: 'Chikmagalur (Mullayanagiri / Baba Budangiri)', 
    state: 'Karnataka', 
    roundTripKm: 520, 
    oneWayKm: 245, 
    standardDays: 2, 
    tollEstimate: 280, 
    permitEstimate: 0, 
    routeHighlights: 'NH75 Hassan Highway → Belur Cross → Chikmagalur' 
  },
  { 
    name: 'Wayanad (Kalpetta / Vythiri / Meppadi)', 
    state: 'Kerala', 
    roundTripKm: 600, 
    oneWayKm: 285, 
    standardDays: 2, 
    tollEstimate: 330, 
    permitEstimate: 700, 
    routeHighlights: 'Mysore Expressway → Gundlupet → Sultan Bathery → Kalpetta' 
  },
  { 
    name: 'Tirupati (Lord Balaji Temple Darshan)', 
    state: 'Andhra Pradesh', 
    roundTripKm: 520, 
    oneWayKm: 250, 
    standardDays: 2, 
    tollEstimate: 360, 
    permitEstimate: 600, 
    routeHighlights: 'Hosakote → Kolar Bypass → Mulbagal → Chittoor Expressway' 
  },
  { 
    name: 'Goa (North Goa Baga / Calangute & South Goa)', 
    state: 'Goa', 
    roundTripKm: 1250, 
    oneWayKm: 580, 
    standardDays: 4, 
    tollEstimate: 850, 
    permitEstimate: 900, 
    routeHighlights: 'Tumkur → Hubballi → Dharwad → Mollem Ghats / Chorla' 
  },
  { 
    name: 'Pondicherry (White Town & Rock Beach)', 
    state: 'Puducherry', 
    roundTripKm: 680, 
    oneWayKm: 315, 
    standardDays: 2, 
    tollEstimate: 420, 
    permitEstimate: 400, 
    routeHighlights: 'Hosur → Krishnagiri → Tiruvannamalai → Tindivanam' 
  },
  { 
    name: 'Gokarna / Murudeshwar (Coastal Temple & Beaches)', 
    state: 'Karnataka', 
    roundTripKm: 1050, 
    oneWayKm: 490, 
    standardDays: 3, 
    tollEstimate: 540, 
    permitEstimate: 0, 
    routeHighlights: 'Tumakuru → Chitradurga → Haveri → Sirsi Ghats → Kumta' 
  },
  { 
    name: 'Kabini / Bandipur (Jungle Safari & Tiger Reserve)', 
    state: 'Karnataka', 
    roundTripKm: 480, 
    oneWayKm: 220, 
    standardDays: 2, 
    tollEstimate: 330, 
    permitEstimate: 0, 
    routeHighlights: 'Mysore Expressway → Nanjangud → HD Kote / Gundlupet' 
  },
  { 
    name: 'Hampi / Badami (UNESCO Heritage Stone Chariot)', 
    state: 'Karnataka', 
    roundTripKm: 760, 
    oneWayKm: 350, 
    standardDays: 3, 
    tollEstimate: 460, 
    permitEstimate: 0, 
    routeHighlights: 'Chitradurga → Hospet → Hampi Ruins' 
  },
  { 
    name: 'Kodaikanal (Pillar Rocks & Kodai Lake)', 
    state: 'Tamil Nadu', 
    roundTripKm: 980, 
    oneWayKm: 465, 
    standardDays: 3, 
    tollEstimate: 680, 
    permitEstimate: 600, 
    routeHighlights: 'Salem → Namakkal → Dindigul → Ghat Road' 
  },
  { 
    name: 'Munnar (Tea Estates & Anamudi Peak)', 
    state: 'Kerala', 
    roundTripKm: 1050, 
    oneWayKm: 490, 
    standardDays: 3, 
    tollEstimate: 700, 
    permitEstimate: 750, 
    routeHighlights: 'Salem → Tiruppur → Udumalaipettai → Marayoor' 
  },
  { 
    name: 'Chennai / Mahabalipuram (East Coast Road)', 
    state: 'Tamil Nadu', 
    roundTripKm: 720, 
    oneWayKm: 340, 
    standardDays: 2, 
    tollEstimate: 520, 
    permitEstimate: 500, 
    routeHighlights: 'Hosur → Krishnagiri → Vellore → Sriperumbudur' 
  },
  { 
    name: 'Nandi Hills / Lepakshi (Historical Day Trip)', 
    state: 'Karnataka', 
    roundTripKm: 140, 
    oneWayKm: 65, 
    standardDays: 1, 
    tollEstimate: 120, 
    permitEstimate: 0, 
    routeHighlights: 'Bellary Road → Devanahalli → Nandi Foothills' 
  },
  { 
    name: 'Local Bangalore City Package (8 Hours / 80 KM)', 
    state: 'Karnataka', 
    roundTripKm: 80, 
    oneWayKm: 40, 
    standardDays: 1, 
    tollEstimate: 0, 
    permitEstimate: 0, 
    routeHighlights: 'Local sightseeing, shopping, meetings, and city commute' 
  },
  { 
    name: 'Bengaluru Kempegowda Airport (BLR) Transfer', 
    state: 'Karnataka', 
    roundTripKm: 90, 
    oneWayKm: 45, 
    standardDays: 1, 
    tollEstimate: 120, 
    permitEstimate: 0, 
    routeHighlights: 'Direct Airport expressway corridor via Hebbal toll' 
  },
  { 
    name: 'Custom Other Destination (Any City in India)', 
    state: 'India', 
    roundTripKm: 500, 
    oneWayKm: 250, 
    standardDays: 2, 
    tollEstimate: 400, 
    permitEstimate: 0, 
    routeHighlights: 'Pan-India route with commercial all-India permit' 
  }
];
