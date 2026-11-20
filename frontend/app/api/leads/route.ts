import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log('[BookMyRoute Lead Captured]:', data);
    return NextResponse.json({ 
      success: true, 
      message: 'Trip lead captured successfully', 
      lead: data 
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      message: 'Invalid lead payload' 
    }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json({ status: 'ok', service: 'BookMyRoute Leads API' });
}
