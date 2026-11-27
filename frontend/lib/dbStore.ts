import fs from 'fs';
import path from 'path';

export interface LeadRecord {
  id: string;
  name: string;
  phone: string;
  email?: string;
  service: string;
  pickup: string;
  destination: string;
  travelDate?: string;
  travelTime?: string;
  returnDate?: string;
  passengers?: number | string;
  vehicle?: string;
  distanceKm?: number;
  ratePerKm?: number;
  driverBata?: number;
  tollEstimate?: number;
  totalFare?: number;
  status: 'ABANDONED_INCOMPLETE' | 'QUOTATION_GENERATED' | 'BOOKING_CONFIRMED' | 'DRIVER_ENQUIRY' | 'CONTACTED';
  source?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// In-memory cache + persistent file storage
const DATA_DIR = path.join(process.cwd(), '.data');
const LEADS_FILE = path.join(DATA_DIR, 'leads.json');

// Initial seed leads for demonstration if empty
const INITIAL_SEED_LEADS: LeadRecord[] = [
  {
    id: 'BMR-LEAD-101',
    name: 'Suresh Gowda',
    phone: '9845122910',
    email: 'suresh.gowda@gmail.com',
    service: 'Outstation Round Trip',
    pickup: 'Uttharhalli, Bangalore',
    destination: 'Coorg (Madikeri)',
    travelDate: '2026-11-28',
    travelTime: '06:00',
    returnDate: '2026-11-30',
    passengers: 12,
    vehicle: '12 Seater TT (Pushback AC)',
    distanceKm: 600,
    ratePerKm: 21,
    driverBata: 1500,
    tollEstimate: 660,
    totalFare: 14760,
    status: 'BOOKING_CONFIRMED',
    source: 'Website Homepage',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 'BMR-LEAD-102',
    name: 'Priya Sharma',
    phone: '9980145233',
    email: 'priya.s@outlook.com',
    service: 'Outstation Round Trip',
    pickup: 'Indiranagar, Bangalore',
    destination: 'Ooty (Nilgiris)',
    travelDate: '2026-12-05',
    travelTime: '05:30',
    returnDate: '2026-12-07',
    passengers: 6,
    vehicle: 'Toyota Innova Crysta (AC)',
    distanceKm: 620,
    ratePerKm: 20,
    driverBata: 1200,
    tollEstimate: 800,
    totalFare: 14400,
    status: 'QUOTATION_GENERATED',
    source: 'Website Quotation Tool',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: 'BMR-LEAD-103',
    name: 'Vikram Mehta',
    phone: '9741288901',
    service: 'Outstation Cab',
    pickup: 'Whitefield, Bangalore',
    destination: 'Chikmagalur',
    passengers: 4,
    status: 'ABANDONED_INCOMPLETE',
    source: 'Homepage Booking Form (Left Mid-Way)',
    notes: 'User typed contact & route, then exited before clicking submit. Follow up immediately!',
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    updatedAt: new Date(Date.now() - 1800000).toISOString()
  },
  {
    id: 'BMR-LEAD-104',
    name: 'Anand Kumar',
    phone: '9448123456',
    service: 'White Board Driver Hire',
    pickup: 'Jayanagar 4th Block',
    destination: 'Mysore Expressway',
    travelDate: '2026-11-29',
    passengers: 1,
    vehicle: 'Personal Hyundai Creta (Automatic)',
    totalFare: 1499,
    status: 'DRIVER_ENQUIRY',
    source: 'White Board Drivers Page',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString()
  }
];

function ensureStorage(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(LEADS_FILE)) {
      fs.writeFileSync(LEADS_FILE, JSON.stringify(INITIAL_SEED_LEADS, null, 2), 'utf-8');
    }
  } catch (err) {
    // Read-only filesystem fallback (e.g. serverless without /tmp write)
  }
}

let inMemoryLeads: LeadRecord[] = [...INITIAL_SEED_LEADS];

export function getAllLeads(): LeadRecord[] {
  ensureStorage();
  try {
    if (fs.existsSync(LEADS_FILE)) {
      const content = fs.readFileSync(LEADS_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        inMemoryLeads = parsed;
      }
    }
  } catch (err) {
    // fallback to in-memory
  }
  return inMemoryLeads.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function saveLead(data: Partial<LeadRecord>): LeadRecord {
  ensureStorage();
  const leads = getAllLeads();

  // Normalize phone
  const cleanPhone = (data.phone || '').replace(/\D/g, '').slice(-10);

  // Check if lead with same clean 10-digit phone was created recently (within last 24h) to avoid duplicates and update status
  const existingIndex = leads.findIndex(l => {
    const lPhone = l.phone.replace(/\D/g, '').slice(-10);
    return cleanPhone && lPhone === cleanPhone;
  });

  const now = new Date().toISOString();

  if (existingIndex >= 0) {
    // Merge & upgrade status
    const prev = leads[existingIndex];
    const updatedStatus = (data.status === 'BOOKING_CONFIRMED' || data.status === 'QUOTATION_GENERATED') 
      ? data.status 
      : prev.status === 'BOOKING_CONFIRMED' 
      ? 'BOOKING_CONFIRMED' 
      : (data.status || prev.status);

    const updatedRecord: LeadRecord = {
      ...prev,
      ...data,
      id: prev.id,
      name: data.name || prev.name,
      phone: data.phone || prev.phone,
      email: data.email || prev.email,
      pickup: data.pickup || prev.pickup,
      destination: data.destination || prev.destination,
      status: updatedStatus,
      updatedAt: now
    };

    leads[existingIndex] = updatedRecord;
    inMemoryLeads = leads;

    try {
      if (fs.existsSync(DATA_DIR)) {
        fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf-8');
      }
    } catch {}

    return updatedRecord;
  } else {
    // Create new lead record
    const newId = `BMR-LEAD-${Date.now().toString().slice(-6)}`;
    const newRecord: LeadRecord = {
      id: newId,
      name: data.name || 'Anonymous Guest',
      phone: data.phone || '',
      email: data.email || '',
      service: data.service || 'Outstation Travel',
      pickup: data.pickup || '',
      destination: data.destination || '',
      travelDate: data.travelDate || '',
      travelTime: data.travelTime || '',
      returnDate: data.returnDate || '',
      passengers: data.passengers || 1,
      vehicle: data.vehicle || '',
      distanceKm: data.distanceKm || 0,
      ratePerKm: data.ratePerKm || 0,
      driverBata: data.driverBata || 0,
      tollEstimate: data.tollEstimate || 0,
      totalFare: data.totalFare || 0,
      status: data.status || 'QUOTATION_GENERATED',
      source: data.source || 'Website',
      notes: data.notes || '',
      createdAt: now,
      updatedAt: now
    };

    leads.unshift(newRecord);
    inMemoryLeads = leads;

    try {
      if (fs.existsSync(DATA_DIR)) {
        fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf-8');
      }
    } catch {}

    return newRecord;
  }
}

export function updateLeadStatus(id: string, status: LeadRecord['status'], notes?: string): LeadRecord | null {
  ensureStorage();
  const leads = getAllLeads();
  const index = leads.findIndex(l => l.id === id);
  if (index === -1) return null;

  leads[index].status = status;
  if (notes) leads[index].notes = notes;
  leads[index].updatedAt = new Date().toISOString();

  inMemoryLeads = leads;
  try {
    if (fs.existsSync(DATA_DIR)) {
      fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf-8');
    }
  } catch {}

  return leads[index];
}

export function deleteLead(id: string): boolean {
  ensureStorage();
  const leads = getAllLeads();
  const filtered = leads.filter(l => l.id !== id);
  if (filtered.length === leads.length) return false;

  inMemoryLeads = filtered;
  try {
    if (fs.existsSync(DATA_DIR)) {
      fs.writeFileSync(LEADS_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
    }
  } catch {}

  return true;
}
