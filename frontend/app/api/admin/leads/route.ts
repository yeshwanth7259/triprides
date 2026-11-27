import { NextResponse } from 'next/server';
import { getAllLeads, updateLeadStatus, deleteLead } from '../../../../lib/dbStore';

export async function GET() {
  try {
    const leads = getAllLeads();
    return NextResponse.json({
      success: true,
      count: leads.length,
      leads
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, status, notes } = await request.json();
    if (!id || !status) {
      return NextResponse.json({ success: false, message: 'id and status required' }, { status: 400 });
    }
    const updated = updateLeadStatus(id, status, notes);
    if (!updated) {
      return NextResponse.json({ success: false, message: 'Lead not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, lead: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, message: 'id required' }, { status: 400 });
    }
    const deleted = deleteLead(id);
    return NextResponse.json({ success: deleted });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message }, { status: 500 });
  }
}
