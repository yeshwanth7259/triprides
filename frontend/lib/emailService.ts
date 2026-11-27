import nodemailer from 'nodemailer';
import { LeadRecord } from './dbStore';

const ADMIN_EMAIL = 'bookmyroute06@gmail.com';
const SUPPORT_PHONE = '+91 72593 35286';
const SUPPORT_PHONE_WA = '917259335286';

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

function buildTejasStyleQuotationHtml(lead: LeadRecord): string {
  const isAbandoned = lead.status === 'ABANDONED_INCOMPLETE';
  const isConfirmed = lead.status === 'BOOKING_CONFIRMED';
  const isDriver = lead.status === 'DRIVER_ENQUIRY';

  const quoteNo = `BMRQT${lead.id.replace(/\D/g, '').slice(-6) || '202601'}`;
  const quoteDate = new Date(lead.createdAt || Date.now()).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const cleanPhone = (lead.phone || '').replace(/\D/g, '').slice(-10);
  const totalKm = lead.distanceKm || 0;
  const ratePerKm = lead.ratePerKm || 0;
  const driverBata = lead.driverBata || 0;
  const tollEstimate = lead.tollEstimate || 0;
  const totalFare = lead.totalFare || 0;
  const baseFare = totalKm > 0 && ratePerKm > 0 ? totalKm * ratePerKm : Math.max(0, totalFare - driverBata - tollEstimate);
  const totalDays = totalKm > 0 ? Math.max(1, Math.ceil(totalKm / 500)) : 1;
  const minKmPerDay = totalKm > 0 ? Math.min(300, Math.round(totalKm / totalDays)) : 300;
  const bataPerDay = driverBata > 0 ? Math.round(driverBata / totalDays) : 0;

  const waConfirmText = encodeURIComponent(
    `Hi BookMyRoute, I received Quotation *${quoteNo}* for *${lead.vehicle || lead.service}* (${lead.pickup || 'Bangalore'} ➔ ${lead.destination || 'Destination'}). Total Estimate: ₹${totalFare.toLocaleString()}. Please confirm my booking!`
  );

  const statusBanner = isAbandoned
    ? `<div style="background:#fef3c7;border:1px solid #f59e0b;color:#92400e;padding:10px 14px;border-radius:8px;font-size:12px;font-weight:700;margin-bottom:14px;text-align:center;">
         🚨 HOT LEAD ALERT: Customer left mid-way before completing booking. Call +91 ${cleanPhone || lead.phone} immediately!
       </div>`
    : isDriver
    ? `<div style="background:#ecfdf5;border:1px solid #10b981;color:#065f46;padding:10px 14px;border-radius:8px;font-size:12px;font-weight:700;margin-bottom:14px;text-align:center;">
         🚗 WHITE BOARD PERSONAL DRIVER REQUEST — ${lead.service}
       </div>`
    : '';

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>BookMyRoute Quotation - ${quoteNo}</title>
</head>
<body style="margin:0;padding:0;background-color:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1e293b;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f3f4f6;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;">
          
          <!-- TOP BRAND HEADER CARD -->
          <tr>
            <td style="background:#ffffff;border:1px solid #e2e8f0;border-radius:10px;padding:18px 22px;margin-bottom:12px;">
              <table width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="left" valign="middle">
                    <div style="font-size:22px;font-weight:900;color:#0A3D73;letter-spacing:-0.5px;">
                      BOOK<span style="color:#FF7020;">MY</span>ROUTE
                    </div>
                    <div style="font-size:10px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:1px;margin-top:2px;">
                      Tours, Travels &amp; Verified Chauffeurs
                    </div>
                  </td>
                  <td align="right" valign="middle">
                    <span style="display:inline-block;background:#eff6ff;color:#0A3D73;border:1px solid #bfdbfe;font-size:11px;font-weight:800;padding:5px 12px;border-radius:999px;text-transform:uppercase;letter-spacing:0.6px;">
                      ${isConfirmed ? 'QUOTATION / ENQUIRY' : 'QUOTATION'}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr><td height="10"></td></tr>

          <!-- QUOTATION DATE & NUMBER BAR -->
          <tr>
            <td style="background:#ffffff;border:1px solid #e2e8f0;border-radius:10px;padding:12px 22px;">
              <table width="100%" cellspacing="0" cellpadding="0" style="font-size:12px;color:#475569;">
                <tr>
                  <td align="left">Quotation Date: <strong style="color:#0f172a;">${quoteDate}</strong></td>
                  <td align="right">Quotation No: <strong style="color:#0A3D73;">${quoteNo}</strong></td>
                </tr>
              </table>
            </td>
          </tr>

          <tr><td height="10"></td></tr>

          ${statusBanner ? `<tr><td>${statusBanner}</td></tr>` : ''}

          <!-- VEHICLE DETAILS CARD -->
          <tr>
            <td style="background:#ffffff;border:1px solid #e2e8f0;border-radius:10px;padding:18px 22px;">
              <div style="font-size:13px;font-weight:800;color:#0f172a;margin-bottom:12px;border-bottom:1px solid #f1f5f9;padding-bottom:8px;">
                Vehicle Details
              </div>
              <table width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td valign="middle">
                    <div style="font-size:15px;font-weight:800;color:#0A3D73;">${lead.vehicle || lead.service || 'Commercial AC Vehicle'}</div>
                    <div style="font-size:12px;color:#64748b;margin-top:3px;">
                      ${lead.passengers ? `Capacity / Group: ${lead.passengers} Passenger(s) • ` : ''}AC Pushback / GPS Tracked • Clean &amp; Sanitized
                    </div>
                  </td>
                  <td align="right" valign="middle">
                    <span style="display:inline-block;background:#f8fafc;border:1px solid #cbd5e1;border-radius:6px;padding:4px 10px;font-size:11px;font-weight:700;color:#334155;">
                      Verified Fleet
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr><td height="10"></td></tr>

          <!-- JOURNEY DETAILS CARD -->
          <tr>
            <td style="background:#ffffff;border:1px solid #e2e8f0;border-radius:10px;padding:18px 22px;">
              <div style="font-size:13px;font-weight:800;color:#0f172a;margin-bottom:12px;border-bottom:1px solid #f1f5f9;padding-bottom:8px;">
                Journey Details
              </div>
              <table width="100%" cellspacing="0" cellpadding="5" style="font-size:12px;line-height:1.5;">
                <tr>
                  <td style="color:#64748b;width:38%;">Journey Type</td>
                </tr>
                <tr>
                  <td style="color:#0f172a;font-weight:700;padding-bottom:8px;">${lead.service || 'Outstation Round Trip'}</td>
                </tr>
                <tr>
                  <td style="color:#64748b;">Pickup Location</td>
                </tr>
                <tr>
                  <td style="color:#0f172a;font-weight:700;padding-bottom:8px;">${lead.pickup || 'Bangalore, Karnataka'}</td>
                </tr>
                <tr>
                  <td style="color:#64748b;">Pickup Date &amp; Time</td>
                </tr>
                <tr>
                  <td style="color:#0f172a;font-weight:700;padding-bottom:8px;">${lead.travelDate || 'Flexible Date'}${lead.travelTime ? `, ${lead.travelTime}` : ''}</td>
                </tr>
                <tr>
                  <td style="color:#64748b;">Drop Location / Destination</td>
                </tr>
                <tr>
                  <td style="color:#0f172a;font-weight:700;padding-bottom:8px;">${lead.destination || 'To Be Confirmed'}</td>
                </tr>
                ${lead.returnDate ? `
                <tr>
                  <td style="color:#64748b;">Return Date</td>
                </tr>
                <tr>
                  <td style="color:#0f172a;font-weight:700;">${lead.returnDate}</td>
                </tr>` : ''}
              </table>
            </td>
          </tr>

          <tr><td height="10"></td></tr>

          <!-- PASSENGER DETAILS CARD -->
          <tr>
            <td style="background:#ffffff;border:1px solid #e2e8f0;border-radius:10px;padding:18px 22px;">
              <div style="font-size:13px;font-weight:800;color:#0f172a;margin-bottom:12px;border-bottom:1px solid #f1f5f9;padding-bottom:8px;">
                Passenger Details
              </div>
              <table width="100%" cellspacing="0" cellpadding="5" style="font-size:12px;">
                <tr>
                  <td style="color:#64748b;width:40%;">Name</td>
                  <td align="right" style="color:#0f172a;font-weight:700;">${lead.name}</td>
                </tr>
                <tr>
                  <td style="color:#64748b;">Contact No</td>
                  <td align="right" style="color:#0f172a;font-weight:700;">+91 ${cleanPhone || lead.phone}</td>
                </tr>
                <tr>
                  <td style="color:#64748b;">Email</td>
                  <td align="right" style="color:#0A3D73;font-weight:700;">${lead.email || 'Not Provided'}</td>
                </tr>
              </table>
            </td>
          </tr>

          <tr><td height="10"></td></tr>

          <!-- FARE BREAKUP CARD -->
          <tr>
            <td style="background:#ffffff;border:1px solid #e2e8f0;border-radius:10px;padding:18px 22px;">
              <div style="font-size:13px;font-weight:800;color:#0f172a;margin-bottom:12px;border-bottom:1px solid #f1f5f9;padding-bottom:8px;">
                Fare Breakup
              </div>
              ${totalFare > 0 ? `
              <table width="100%" cellspacing="0" cellpadding="6" style="font-size:12px;">
                <tr>
                  <td style="color:#64748b;">Approx Trip Distance (Round Trip / Billed)</td>
                  <td align="right" style="color:#0f172a;font-weight:700;">${totalKm} kms</td>
                </tr>
                <tr>
                  <td style="color:#64748b;">Total Days</td>
                  <td align="right" style="color:#0f172a;font-weight:700;">${totalDays}</td>
                </tr>
                <tr>
                  <td style="color:#64748b;">Minimum Km per day</td>
                  <td align="right" style="color:#0f172a;font-weight:700;">${minKmPerDay} kms</td>
                </tr>
                <tr>
                  <td style="color:#64748b;">Total Billable Kms</td>
                  <td align="right" style="color:#0f172a;font-weight:700;">${totalKm} kms</td>
                </tr>
                <tr>
                  <td style="color:#64748b;">Tariff Rate / Km</td>
                  <td align="right" style="color:#0f172a;font-weight:700;">₹${ratePerKm}</td>
                </tr>
                <tr>
                  <td style="color:#64748b;">Estimated Base Fare</td>
                  <td align="right" style="color:#0f172a;font-weight:700;">₹${baseFare.toLocaleString()}</td>
                </tr>
                <tr>
                  <td style="color:#64748b;">Driver Allowance Per Day</td>
                  <td align="right" style="color:#0f172a;font-weight:700;">₹${bataPerDay.toLocaleString()}</td>
                </tr>
                <tr>
                  <td style="color:#64748b;">Total Driver Allowance</td>
                  <td align="right" style="color:#0f172a;font-weight:700;">₹${driverBata.toLocaleString()}</td>
                </tr>
                ${tollEstimate > 0 ? `
                <tr>
                  <td style="color:#64748b;">Estimated Tolls &amp; State Permits</td>
                  <td align="right" style="color:#0f172a;font-weight:700;">₹${tollEstimate.toLocaleString()}</td>
                </tr>` : ''}
                <tr>
                  <td colspan="2" style="border-top:1px solid #e2e8f0;padding-top:10px;"></td>
                </tr>
                <tr>
                  <td style="font-size:14px;font-weight:900;color:#0f172a;">Total Estimate</td>
                  <td align="right" style="font-size:18px;font-weight:900;color:#0A3D73;">₹${totalFare.toLocaleString()}</td>
                </tr>
                <tr>
                  <td style="color:#64748b;font-size:11px;">Advance Payment Required</td>
                  <td align="right" style="color:#15803d;font-weight:800;font-size:11px;">₹0 (Pay Driver / Trip Start)</td>
                </tr>
              </table>
              ` : `
              <p style="font-size:12px;color:#475569;margin:0 0 12px;">
                Our dispatch team will share the exact custom fare breakup based on your route and vehicle availability.
              </p>
              `}

              <div style="margin-top:16px;">
                <a href="https://wa.me/${SUPPORT_PHONE_WA}?text=${waConfirmText}" style="display:block;width:100%;box-sizing:border-box;background:#0A3D73;color:#ffffff;text-align:center;text-decoration:none;font-weight:800;font-size:13px;padding:12px 16px;border-radius:8px;">
                  Confirm Booking / Download PDF Quote
                </a>
              </div>
            </td>
          </tr>

          <tr><td height="10"></td></tr>

          <!-- INCLUSIONS CARD -->
          <tr>
            <td style="background:#ffffff;border:1px solid #e2e8f0;border-radius:10px;padding:18px 22px;">
              <div style="font-size:13px;font-weight:800;color:#0f172a;margin-bottom:10px;">Inclusions</div>
              <table width="100%" cellspacing="0" cellpadding="4" style="font-size:12px;color:#475569;">
                <tr><td>✅ Driver Allowance &amp; Standard Daytime Charges</td></tr>
                <tr><td>✅ Seatbelt &amp; Live GPS Equipped Vehicle</td></tr>
                <tr><td>✅ Clean, Sanitized Commercial Vehicle with Professional Chauffeur</td></tr>
                <tr><td>✅ Zero Hidden Booking or Platform Fees</td></tr>
              </table>
            </td>
          </tr>

          <tr><td height="10"></td></tr>

          <!-- EXCLUSIONS CARD -->
          <tr>
            <td style="background:#ffffff;border:1px solid #e2e8f0;border-radius:10px;padding:18px 22px;">
              <div style="font-size:13px;font-weight:800;color:#0f172a;margin-bottom:10px;">Exclusions</div>
              <table width="100%" cellspacing="0" cellpadding="4" style="font-size:12px;color:#475569;">
                <tr><td>• Additional KM &amp; Extra Hour charges if trip exceeds minimum package</td></tr>
                <tr><td>• Toll, Parking, Airport Entry &amp; Interstate Border Permits (at actuals if not included)</td></tr>
                <tr><td>• Night Driver Allowance (10:00 PM to 06:00 AM) if applicable</td></tr>
              </table>
            </td>
          </tr>

          <tr><td height="10"></td></tr>

          <!-- GENERAL INFORMATION CARD -->
          <tr>
            <td style="background:#ffffff;border:1px solid #e2e8f0;border-radius:10px;padding:18px 22px;">
              <div style="font-size:13px;font-weight:800;color:#0f172a;margin-bottom:10px;">General Information</div>
              <ul style="margin:0;padding-left:18px;font-size:11.5px;color:#64748b;line-height:1.6;">
                <li><strong>Outstation Billing Limit:</strong> Distance is calculated on a garage-to-garage or pickup-to-drop basis as per minimum 300 km/day benchmark.</li>
                <li><strong>Toll &amp; Border Charges:</strong> State permits, FASTag tolls, and parking fees are payable directly at actuals as per receipts.</li>
                <li><strong>24/7 Route Assistance:</strong> Contact our Bangalore Operations Desk anytime during your trip for immediate support.</li>
              </ul>
            </td>
          </tr>

          <tr><td height="10"></td></tr>

          <!-- 24/7 CUSTOMER SUPPORT CARD -->
          <tr>
            <td style="background:#ffffff;border:1px solid #e2e8f0;border-radius:10px;padding:18px 22px;">
              <div style="font-size:13px;font-weight:800;color:#0f172a;margin-bottom:10px;">24/7 Customer Support</div>
              <table width="100%" cellspacing="0" cellpadding="4" style="font-size:12px;">
                <tr>
                  <td style="color:#64748b;">Call / WhatsApp</td>
                  <td align="right"><a href="tel:${SUPPORT_PHONE_WA}" style="color:#0A3D73;font-weight:800;text-decoration:none;">${SUPPORT_PHONE}</a></td>
                </tr>
                <tr>
                  <td style="color:#64748b;">Write to us</td>
                  <td align="right"><a href="mailto:${ADMIN_EMAIL}" style="color:#0A3D73;font-weight:800;text-decoration:none;">${ADMIN_EMAIL}</a></td>
                </tr>
                <tr>
                  <td style="color:#64748b;">Website</td>
                  <td align="right"><a href="https://www.bookmyroute.in" style="color:#0A3D73;font-weight:800;text-decoration:none;">www.bookmyroute.in</a></td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td align="center" style="padding:18px 10px;font-size:11px;color:#94a3b8;line-height:1.5;">
              © 2026 BookMyRoute Travels (India) Private Limited. All rights reserved.<br>
              Uttharhalli, Bangalore, Karnataka - 560061
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendLeadEmailNotification(lead: LeadRecord): Promise<{
  success: boolean;
  sentToClient?: boolean;
  sentToAdmin?: boolean;
  simulated?: boolean;
  error?: string;
}> {
  try {
    const isAbandoned = lead.status === 'ABANDONED_INCOMPLETE';
    const isConfirmed = lead.status === 'BOOKING_CONFIRMED';
    const isDriver = lead.status === 'DRIVER_ENQUIRY';
    const quoteNo = `BMRQT${lead.id.replace(/\D/g, '').slice(-6) || '202601'}`;

    const subject = isAbandoned
      ? `🚨 HOT LEAD (Left Mid-Way): ${lead.name} (${lead.phone}) - ${lead.pickup} ➔ ${lead.destination || 'Pending'}`
      : isDriver
      ? `ID: ${quoteNo} - WHITE BOARD DRIVER QUOTATION for ${lead.name}`
      : isConfirmed
      ? `ID: ${quoteNo} - QUOTATION for ${lead.vehicle || lead.service || 'Trip Booking'} | BookMyRoute`
      : `ID: ${quoteNo} - TRIP QUOTATION for ${lead.vehicle || lead.service || 'Travel'} | BookMyRoute`;

    const htmlContent = buildTejasStyleQuotationHtml(lead);
    const transporter = createTransporter();

    const hasValidClientEmail =
      !isAbandoned &&
      Boolean(lead.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email.trim()));

    if (transporter) {
      // 1. Always send notification / quotation copy to Admin (bookmyroute06@gmail.com)
      await transporter.sendMail({
        from: `"BookMyRoute Quotations" <${process.env.GMAIL_USER || ADMIN_EMAIL}>`,
        to: ADMIN_EMAIL,
        subject,
        html: htmlContent
      });

      // 2. If client provided an email & this is an active quote/booking (not abandoned), send formal quotation to client!
      let sentToClient = false;
      if (hasValidClientEmail && lead.email) {
        await transporter.sendMail({
          from: `"BookMyRoute Travels" <${process.env.GMAIL_USER || ADMIN_EMAIL}>`,
          to: lead.email.trim(),
          replyTo: ADMIN_EMAIL,
          subject: `ID: ${quoteNo} - Your Official Trip Quotation for ${lead.vehicle || lead.service} | BookMyRoute`,
          html: htmlContent
        });
        sentToClient = true;
      }

      console.log(`[Email Dispatched] Admin: ${ADMIN_EMAIL} | Client: ${sentToClient ? lead.email : 'N/A'} | Subject: ${subject}`);
      return { success: true, sentToAdmin: true, sentToClient };
    } else {
      console.log(`[Email Simulated - SMTP ENV missing] Admin: ${ADMIN_EMAIL} | Client: ${hasValidClientEmail ? lead.email : 'N/A'} | Subject: ${subject}`);
      return {
        success: true,
        sentToAdmin: true,
        sentToClient: hasValidClientEmail,
        simulated: true
      };
    }
  } catch (error: any) {
    console.error('[Email Notification Error]:', error?.message || error);
    return { success: false, error: error?.message || 'Email delivery failed' };
  }
}
