import { NextResponse } from 'next/server';
import { getAllLeads, saveLead } from '../../../lib/dbStore';
import { sendLeadEmailNotification } from '../../../lib/emailService';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (!data.phone && !data.name) {
      return NextResponse.json({ 
        success: false, 
        message: 'Name or phone is required' 
      }, { status: 400 });
    }

    // Save or update lead in persistent storage
    const saved = saveLead({
      name: data.name || data.customer_name || 'Guest User',
      phone: data.phone || data.mobile || '',
      email: data.email || '',
      service: data.service || data.service_type || 'Outstation Travel',
      pickup: data.pickup || data.pickup_location || '',
      destination: data.destination || data.drop_location || '',
      travelDate: data.travelDate || data.travel_date || '',
      travelTime: data.travelTime || data.travel_time || '',
      returnDate: data.returnDate || data.return_date || '',
      passengers: data.passengers || 1,
      vehicle: data.vehicle || data.vehicle_type || '',
      distanceKm: Number(data.distanceKm || data.distance_km || 0),
      ratePerKm: Number(data.ratePerKm || data.rate_per_km || 0),
      driverBata: Number(data.driverBata || data.driver_bata || 0),
      tollEstimate: Number(data.tollEstimate || data.toll_estimate || 0),
      totalFare: Number(data.totalFare || data.total_fare || data.amount || 0),
      status: data.status || 'QUOTATION_GENERATED',
      source: data.source || 'Website Booking Form',
      notes: data.notes || ''
    });

    // Send email notification to bookmyroute06@gmail.com asynchronously
    sendLeadEmailNotification(saved).catch(err => {
      console.error('[Background Email Error]:', err);
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Lead captured & quotation processed successfully', 
      lead: saved 
    }, { status: 201 });
  } catch (error: any) {
    console.error('[Leads API Error]:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to process lead',
      error: error?.message || 'Server error'
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const leads = getAllLeads();
    return NextResponse.json({
      success: true,
      count: leads.length,
      leads
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: 'Failed to retrieve leads',
      error: error?.message
    }, { status: 500 });
  }
}
