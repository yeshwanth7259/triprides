import nodemailer from 'nodemailer';
import { LeadRecord } from './dbStore';

const ADMIN_EMAIL = 'bookmyroute06@gmail.com';

function createTransporter() {
  const user = process.env.GMAIL_USER || process.env.SMTP_USER;
  const pass = process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS;

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user,
      pass
    }
  });
}

export async function sendLeadEmailNotification(lead: LeadRecord): Promise<{ success: boolean; simulated?: boolean; error?: string }> {
  try {
    const isAbandoned = lead.status === 'ABANDONED_INCOMPLETE';
    const isConfirmed = lead.status === 'BOOKING_CONFIRMED';
    const isDriver = lead.status === 'DRIVER_ENQUIRY';

    const subject = isAbandoned
      ? `🚨 HOT LEAD (Left Mid-Way): ${lead.name} (${lead.phone}) - ${lead.pickup} ➔ ${lead.destination || 'Pending'}`
      : isDriver
      ? `🚗 WHITE BOARD DRIVER HIRE: ${lead.name} (${lead.phone}) for ${lead.vehicle || 'Personal Car'}`
      : isConfirmed
      ? `✅ BOOKING REQUEST CONFIRMED: ${lead.name} (${lead.phone}) - ${lead.pickup} ➔ ${lead.destination}`
      : `📋 NEW TRIP QUOTATION: ${lead.name} (${lead.phone}) - ${lead.pickup} ➔ ${lead.destination}`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f8fafc; color: #1e293b; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.06); }
          .header { background: #0A3D73; color: #ffffff; padding: 24px; text-align: center; }
          .badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-weight: 800; text-transform: uppercase; margin-top: 8px; }
          .badge-alert { background: #fef3c7; color: #b45309; }
          .badge-success { background: #dcfce7; color: #15803d; }
          .badge-info { background: #dbeafe; color: #1e40af; }
          .content { padding: 24px; }
          .lead-box { background: #f1f5f9; border-radius: 12px; padding: 16px; margin-bottom: 20px; }
          .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0; font-size: 13px; }
          .row:last-child { border-bottom: none; }
          .label { color: #64748b; font-weight: 600; }
          .val { font-weight: 700; color: #0f172a; }
          .total-box { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px; padding: 16px; text-align: center; margin-top: 16px; }
          .total-amount { font-size: 24px; font-weight: 900; color: #0A3D73; margin-top: 4px; }
          .actions { display: flex; gap: 10px; margin-top: 24px; }
          .btn { display: inline-block; padding: 12px 20px; border-radius: 10px; text-decoration: none; font-weight: 800; font-size: 13px; text-align: center; }
          .btn-wa { background: #25D366; color: #ffffff; flex: 1; }
          .btn-call { background: #0A3D73; color: #ffffff; flex: 1; }
          .footer { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 16px; text-align: center; font-size: 11px; color: #94a3b8; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin:0; font-size:20px; font-weight:900; letter-spacing:0.5px;">BookMyRoute Travel Dispatch</h1>
            <p style="margin:4px 0 0; font-size:12px; opacity:0.85;">Official Customer Enquiry & Quotation System</p>
            <span class="badge ${isAbandoned ? 'badge-alert' : isConfirmed ? 'badge-success' : 'badge-info'}">
              ${isAbandoned ? '⚠️ User Left Mid-Way (Call Now)' : isConfirmed ? '✓ Booking Request Confirmed' : isDriver ? '🚗 White Board Driver' : '📋 Formal Trip Quotation'}
            </span>
          </div>

          <div class="content">
            <div class="lead-box">
              <div class="row"><span class="label">Customer Name</span><span class="val">${lead.name}</span></div>
              <div class="row"><span class="label">Mobile Number</span><span class="val"><a href="tel:${lead.phone}" style="color:#0A3D73; text-decoration:none;">+91 ${lead.phone}</a></span></div>
              ${lead.email ? `<div class="row"><span class="label">Email</span><span class="val">${lead.email}</span></div>` : ''}
              <div class="row"><span class="label">Service Mode</span><span class="val">${lead.service || 'Outstation Cabs'}</span></div>
              <div class="row"><span class="label">Pickup Location</span><span class="val">${lead.pickup || '—'}</span></div>
              <div class="row"><span class="label">Destination / Drop</span><span class="val">${lead.destination || '—'}</span></div>
              ${lead.travelDate ? `<div class="row"><span class="label">Travel Date & Time</span><span class="val">${lead.travelDate} ${lead.travelTime ? `at ${lead.travelTime}` : ''}</span></div>` : ''}
              ${lead.returnDate ? `<div class="row"><span class="label">Return Date</span><span class="val">${lead.returnDate}</span></div>` : ''}
              ${lead.passengers ? `<div class="row"><span class="label">Passengers</span><span class="val">${lead.passengers} Person(s)</span></div>` : ''}
              ${lead.vehicle ? `<div class="row"><span class="label">Vehicle Selected</span><span class="val">${lead.vehicle}</span></div>` : ''}
              <div class="row"><span class="label">Lead Source</span><span class="val">${lead.source || 'Website'}</span></div>
            </div>

            ${lead.totalFare && lead.totalFare > 0 ? `
              <div class="total-box">
                <span style="font-size:11px; text-transform:uppercase; font-weight:800; color:#64748b; letter-spacing:0.5px;">Estimated Trip Fare (100% Transparent Tariff)</span>
                <div class="total-amount">₹${lead.totalFare.toLocaleString()}</div>
                <div style="font-size:12px; color:#475569; margin-top:4px;">
                  Includes ${lead.distanceKm || 0} KM @ ₹${lead.ratePerKm || 0}/km + Driver Bata ₹${lead.driverBata || 0} + Estimated Tolls ₹${lead.tollEstimate || 0}
                </div>
              </div>
            ` : ''}

            ${lead.notes ? `
              <div style="background:#fffbeb; border:1px solid #fef3c7; border-radius:8px; padding:12px; margin-top:16px; font-size:12px; color:#92400e;">
                <strong>Admin Note:</strong> ${lead.notes}
              </div>
            ` : ''}

            <div class="actions">
              <a class="btn btn-wa" href="https://wa.me/91${lead.phone.replace(/\\D/g, '').slice(-10)}?text=${encodeURIComponent(`Hi ${lead.name}, thank you for contacting BookMyRoute regarding your travel from ${lead.pickup} to ${lead.destination}. How can we assist you with your booking?`)}">
                💬 WhatsApp Customer
              </a>
              <a class="btn btn-call" href="tel:+91${lead.phone.replace(/\\D/g, '').slice(-10)}">
                📞 Call Customer
              </a>
            </div>
          </div>

          <div class="footer">
            Sent automatically to BookMyRoute Operations (${ADMIN_EMAIL})<br>
            24/7 Helpline: +91 72593 35286 | Bangalore, Karnataka
          </div>
        </div>
      </body>
      </html>
    `;

    const transporter = createTransporter();

    if (transporter) {
      await transporter.sendMail({
        from: `"BookMyRoute Leads" <${process.env.GMAIL_USER || ADMIN_EMAIL}>`,
        to: ADMIN_EMAIL,
        subject,
        html: htmlContent
      });
      console.log(`[Email Dispatched Successfully] To: ${ADMIN_EMAIL} | Subject: ${subject}`);
      return { success: true };
    } else {
      console.log(`[Email Notification Simulated - SMTP not configured in ENV] To: ${ADMIN_EMAIL} | Subject: ${subject}`);
      return { success: true, simulated: true };
    }
  } catch (error: any) {
    console.error('[Email Notification Error]:', error?.message || error);
    return { success: false, error: error?.message || 'Email delivery failed' };
  }
}
