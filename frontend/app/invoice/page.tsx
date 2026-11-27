'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FileText, Printer, Share2, Search, CheckCircle, 
  Phone, Mail, MapPin, Calendar, Car, 
  ArrowLeft, RefreshCw, QrCode, Sparkles, User, ShieldCheck,
  CreditCard, ArrowRight, Check, AlertCircle, FileCheck,
  ChevronDown, Calculator, Compass, Clock, Download
} from 'lucide-react';
import { 
  CONTACT_PHONE, 
  CONTACT_PHONE_TEL, 
  CONTACT_PHONE_WA, 
  CONTACT_EMAIL, 
  OFFICE_ADDRESS 
} from '../../lib/fleetData';
import { 
  FLEET_PRICING, 
  POPULAR_ROUTES, 
  VehiclePricing, 
  DestinationRoute 
} from '../../lib/quotationData';
import PlaceAutocompleteInput from '../../components/PlaceAutocompleteInput';
import { PlaceItem, ALL_INDIAN_PLACES } from '../../lib/indiaCitiesData';

// Helper to convert Indian currency number to words
function numberToWordsINR(amount: number): string {
  const rounded = Math.round(amount);
  const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function numToWords(n: number): string {
    if (n === 0) return '';
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + a[n % 10] : ' ');
    if (n < 1000) return a[Math.floor(n / 100)] + 'Hundred ' + numToWords(n % 100);
    if (n < 100000) return numToWords(Math.floor(n / 1000)) + 'Thousand ' + numToWords(n % 1000);
    if (n < 10000000) return numToWords(Math.floor(n / 100000)) + 'Lakh ' + numToWords(n % 100000);
    return numToWords(Math.floor(n / 10000000)) + 'Crore ' + numToWords(n % 10000000);
  }

  const words = numToWords(rounded).trim();
  return words ? `Indian Rupees ${words} Only` : 'Indian Rupees Zero Only';
}

export default function InvoicePage() {
  // Document mode: 'quotation' (initial estimate) or 'invoice' (paid offline receipt)
  const [docMode, setDocMode] = useState<'quotation' | 'invoice'>('quotation');

  // Core User Inputs (Clean & Empty by default for User to Fill)
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [tripType, setTripType] = useState<'roundtrip' | 'oneway' | 'local' | 'airport'>('roundtrip');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('tempo-12');
  const [selectedRouteName, setSelectedRouteName] = useState<string>('');
  const [customDestination, setCustomDestination] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [tripDays, setTripDays] = useState<number>(1);

  // Auto-calculated Fields (Calculated automatically as user fills form)
  const [distanceKm, setDistanceKm] = useState<number>(0);
  const [ratePerKm, setRatePerKm] = useState<number>(21);
  const [driverBata, setDriverBata] = useState<number>(0);
  const [tollParking, setTollParking] = useState<number>(0);
  const [baseFare, setBaseFare] = useState<number>(0);
  const [grandTotal, setGrandTotal] = useState<number>(0);

  // Quotation & Invoice Meta
  const [quotationNumber, setQuotationNumber] = useState('BMR/QUO/2026/41029');
  const [invoiceNumber, setInvoiceNumber] = useState('BMR/INV/2026/84920');
  const [bookingId, setBookingId] = useState('BMR-84920');
  const [vehicleRegNo, setVehicleRegNo] = useState('KA 01 AB 8921');
  const [chauffeurName, setChauffeurName] = useState('Manjunath Gowda');
  const [chauffeurPhone, setChauffeurPhone] = useState('+91 72593 35286');
  const [paymentMode, setPaymentMode] = useState('Cash to Driver (Offline)');
  const [paymentStatus, setPaymentStatus] = useState('PAID');
  const [notification, setNotification] = useState('');
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  // Handle URL query parameters if passed from booking modal
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const idParam = params.get('id');
      const nameParam = params.get('name');
      const phoneParam = params.get('phone');
      const emailParam = params.get('email');
      const pickupParam = params.get('pickup');
      const dropParam = params.get('drop');
      const vehicleParam = params.get('vehicle');
      const dateParam = params.get('date');
      const tabParam = params.get('tab');

      if (tabParam === 'invoice' || params.get('mode') === 'invoice') {
        setDocMode('invoice');
      }

      if (nameParam) setCustomerName(nameParam);
      if (phoneParam) setCustomerPhone(phoneParam);
      if (emailParam) setCustomerEmail(emailParam);
      if (pickupParam) setPickupLocation(pickupParam);
      if (dateParam) setTravelDate(dateParam);
      if (idParam) {
        setBookingId(idParam);
        setQuotationNumber(`BMR/QUO/2026/${idParam.replace(/[^0-9]/g, '').slice(-5) || '41029'}`);
        setInvoiceNumber(`BMR/INV/2026/${idParam.replace(/[^0-9]/g, '').slice(-5) || '84920'}`);
      }

      if (dropParam) {
        const found = POPULAR_ROUTES.find(r => r.name.toLowerCase().includes(dropParam.toLowerCase()));
        if (found) {
          setSelectedRouteName(found.name);
        } else {
          setSelectedRouteName('Custom Other Destination (Any City in India)');
          setCustomDestination(dropParam);
        }
      }

      if (vehicleParam) {
        const foundV = FLEET_PRICING.find(v => v.id === vehicleParam || v.name.toLowerCase().includes(vehicleParam.toLowerCase()));
        if (foundV) setSelectedVehicleId(foundV.id);
      }
    }
  }, []);

  // AUTOMATIC RE-CALCULATION ENGINE (Standard Transparent Market Rates)
  useEffect(() => {
    const vehicle = FLEET_PRICING.find(v => v.id === selectedVehicleId) || FLEET_PRICING[3];

    // If outstation destination is empty, maintain clean initial state
    if (!selectedRouteName.trim() && tripType !== 'local' && tripType !== 'airport') {
      setDistanceKm(0);
      setRatePerKm(vehicle.ratePerKm);
      setTripDays(tripDays || 1);
      setDriverBata(0);
      setTollParking(0);
      setBaseFare(0);
      setGrandTotal(0);
      return;
    }

    let route = POPULAR_ROUTES.find(r => r.name === selectedRouteName || selectedRouteName.toLowerCase().includes(r.name.toLowerCase()));
    
    // If not in popular predefined routes, check ALL_INDIAN_PLACES
    if (!route) {
      const matchedPlace = ALL_INDIAN_PLACES.find(p => 
        selectedRouteName.toLowerCase().includes(p.name.toLowerCase()) || 
        p.name.toLowerCase().includes(selectedRouteName.toLowerCase())
      );
      if (matchedPlace && matchedPlace.distanceKmFromBangalore > 0) {
        route = {
          name: matchedPlace.name,
          state: matchedPlace.state,
          roundTripKm: Math.round(matchedPlace.distanceKmFromBangalore * 2),
          oneWayKm: matchedPlace.distanceKmFromBangalore,
          standardDays: Math.max(1, Math.ceil(matchedPlace.distanceKmFromBangalore / 250)),
          tollEstimate: Math.round(matchedPlace.distanceKmFromBangalore * 0.7),
          permitEstimate: matchedPlace.state !== 'Karnataka' ? 600 : 0,
          routeHighlights: `${matchedPlace.name}, ${matchedPlace.state} via Pan-India Highway`
        };
      } else {
        route = POPULAR_ROUTES[0];
      }
    }

    let km = 0;
    let days = tripDays;
    let rate = vehicle.ratePerKm;
    let bata = 0;
    let toll = 0;
    let base = 0;
    let total = 0;

    if (tripType === 'local') {
      // Local 8 hr / 80 km package
      km = 80;
      days = 1;
      rate = vehicle.localExtraKmRate;
      bata = 0; // Included in local package
      toll = 0;
      base = vehicle.localPackageRate;
      total = base;
    } else if (tripType === 'airport') {
      // Airport transfer (45 km)
      km = 45;
      days = 1;
      rate = vehicle.ratePerKm;
      bata = 0;
      toll = 120;
      base = vehicle.ratePerKm * km;
      total = base + toll;
    } else if (tripType === 'oneway') {
      // Outstation One-Way Drop
      km = route.oneWayKm;
      days = 1;
      rate = vehicle.ratePerKm;
      bata = vehicle.driverBataPerDay;
      toll = Math.round(route.tollEstimate / 2);
      base = km * rate;
      total = base + bata + toll;
    } else {
      // Outstation Round Trip
      km = route.roundTripKm;
      days = Math.max(tripDays, route.standardDays);
      rate = vehicle.ratePerKm;
      // Minimum km enforcement per day (standard RTO Karnataka benchmark: 300km/day for TT/Bus, 250km/day for Cabs)
      const minBilledKm = days * vehicle.minKmPerDay;
      const billedKm = Math.max(km, minBilledKm);
      km = billedKm;
      bata = days * vehicle.driverBataPerDay;
      toll = route.tollEstimate + route.permitEstimate;
      base = billedKm * rate;
      total = base + bata + toll;
    }

    setDistanceKm(km);
    setRatePerKm(rate);
    setTripDays(days);
    setDriverBata(bata);
    setTollParking(toll);
    setBaseFare(base);
    setGrandTotal(total);
  }, [tripType, selectedVehicleId, selectedRouteName, tripDays]);

  const currentVehicle = FLEET_PRICING.find(v => v.id === selectedVehicleId) || FLEET_PRICING[3];
  
  // Resolve destination & route highlights cleanly across popular routes & all Indian cities
  const matchedPlace = ALL_INDIAN_PLACES.find(p => 
    selectedRouteName && (
      selectedRouteName.toLowerCase().includes(p.name.toLowerCase()) || 
      p.name.toLowerCase().includes(selectedRouteName.toLowerCase())
    )
  );
  const matchedPopular = POPULAR_ROUTES.find(r => 
    selectedRouteName && (
      r.name === selectedRouteName || 
      selectedRouteName.toLowerCase().includes(r.name.toLowerCase())
    )
  );
  
  const finalDestinationDisplay = !selectedRouteName.trim()
    ? '—'
    : selectedRouteName.includes('Custom') && customDestination 
    ? customDestination 
    : matchedPopular 
    ? matchedPopular.name 
    : matchedPlace 
    ? `${matchedPlace.name}, ${matchedPlace.state}` 
    : selectedRouteName;

  const routeHighlightsDisplay = !selectedRouteName.trim()
    ? ''
    : matchedPopular
    ? matchedPopular.routeHighlights
    : matchedPlace
    ? `Bangalore ➔ ${matchedPlace.name} (${matchedPlace.state}) Highway`
    : `Bangalore ➔ ${finalDestinationDisplay}`;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById('printable-area');
    if (!element) return;

    setIsDownloadingPdf(true);
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf')
      ]);

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 5) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      const cleanRef = (docMode === 'quotation' ? quotationNumber : invoiceNumber).replace(/[^a-zA-Z0-9_-]/g, '_');
      const fileName = docMode === 'quotation'
        ? `BookMyRoute_Quotation_${cleanRef}.pdf`
        : `BookMyRoute_Tax_Invoice_${cleanRef}.pdf`;

      pdf.save(fileName);
      setNotification(`${fileName} downloaded successfully!`);
    } catch (err) {
      console.error('PDF generation failed:', err);
      setNotification('Could not generate PDF directly. Please try again.');
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handleSendEmailQuote = async () => {
    if (!customerEmail.trim() && !customerPhone.trim()) {
      setNotification('Please enter Customer Email or Mobile Number first to dispatch quotation.');
      return;
    }
    setIsSendingEmail(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: customerName || 'Valued Passenger',
          phone: customerPhone || 'Not Provided',
          email: customerEmail.trim(),
          service: `${tripType.toUpperCase()} - ${currentVehicle.name}`,
          pickup: pickupLocation || 'Bangalore',
          destination: finalDestinationDisplay,
          travelDate: travelDate || 'Flexible Date',
          vehicle: currentVehicle.name,
          distanceKm,
          ratePerKm,
          driverBata,
          tollEstimate: tollParking,
          totalFare: grandTotal,
          status: 'QUOTATION_GENERATED',
          source: 'Invoice & Quotation Generator'
        })
      });
      const data = await res.json();
      if (data.success) {
        setNotification(
          customerEmail.trim()
            ? `Formal Quotation emailed to ${customerEmail.trim()} & BookMyRoute Dispatch (bookmyroute06@gmail.com)!`
            : 'Formal Quotation dispatched to BookMyRoute Operations (bookmyroute06@gmail.com)!'
        );
      } else {
        setNotification('Failed to send quotation email. Please try again.');
      }
    } catch {
      setNotification('Network error while sending quotation email.');
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleWhatsAppShare = () => {
    const isQuo = docMode === 'quotation';
    const text = isQuo
      ? `*📋 OFFICIAL TRIP QUOTATION & FARE ESTIMATE*
----------------------------------------
*Quotation Ref:* ${quotationNumber}
*Customer:* ${customerName} (${customerPhone})
*Route:* ${pickupLocation} ➔ ${finalDestinationDisplay}
*Trip Type:* ${tripType === 'roundtrip' ? 'Outstation Round Trip' : tripType === 'oneway' ? 'Outstation One Way' : tripType === 'local' ? 'Local Bangalore City' : 'Airport Transfer'}
*Vehicle:* ${currentVehicle.name} (${currentVehicle.seats})
*Duration:* ${tripDays} Day(s)
*Estimated KM:* ${distanceKm} KM @ ₹${ratePerKm}/km
*Base Fare:* ₹${baseFare.toLocaleString()}
*Driver Bata:* ₹${driverBata.toLocaleString()}
*Toll & Permits:* ₹${tollParking.toLocaleString()}
*TOTAL ESTIMATE:* ₹${grandTotal.toLocaleString()} (Zero GST Added)
----------------------------------------
_Valid for 7 days. BookMyRoute 24/7 Booking Helpline: ${CONTACT_PHONE}_`
      : `*🧾 OFFICIAL TRIP INVOICE & BILL (PAID)*
----------------------------------------
*Invoice No:* ${invoiceNumber}
*Booking ID:* ${bookingId}
*Customer:* ${customerName}
*Chauffeur:* ${chauffeurName} (${chauffeurPhone})
*Vehicle:* ${currentVehicle.name} (${vehicleRegNo})
*Route:* ${pickupLocation} ➔ ${finalDestinationDisplay}
*Amount Paid:* ₹${grandTotal.toLocaleString()}
*Payment Mode:* ${paymentMode}
*Status:* ✅ ${paymentStatus}
----------------------------------------
_Verified digital receipt by BookMyRoute. Helpline: ${CONTACT_PHONE}_`;

    window.open(`https://wa.me/${CONTACT_PHONE_WA}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleOfflinePaymentConfirm = () => {
    setDocMode('invoice');
    setPaymentStatus('PAID (OFFLINE VERIFIED)');
    setPaymentMode('Cash / Offline UPI to Driver');
    setNotification('Offline payment recorded! Official Tax Invoice receipt is now generated and ready for print/download.');
    setTimeout(() => setNotification(''), 7000);
  };

  return (
    <div className="min-h-screen bg-slate-100 pt-24 pb-20 font-sans print:pt-0 print:pb-0 print:bg-white">
      
      {/* Non-Printable Header & Controls */}
      <div className="container-x max-w-6xl mx-auto px-4 mb-6 print:hidden">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#0A3D73] transition-colors"
          >
            <ArrowLeft size={14} /> Back to Home
          </Link>

          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1.5">
            <CheckCircle size={13} /> Standard Transparent Market Rates • 100% Zero Hidden Charges
          </span>
        </div>

        {/* Notification Toast */}
        {notification && (
          <div className="bg-emerald-600 text-white text-xs font-bold p-3.5 rounded-2xl mb-4 flex items-center justify-between shadow-md">
            <span>✓ {notification}</span>
            <button onClick={() => setNotification('')} className="text-white/80 hover:text-white font-black text-sm">✕</button>
          </div>
        )}

        {/* 2-STAGE TABS SELECTOR */}
        <div className="bg-white rounded-2xl p-2.5 shadow-md border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setDocMode('quotation')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl font-black text-xs transition-all cursor-pointer ${
                docMode === 'quotation'
                  ? 'bg-[#0A3D73] text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <FileText size={15} className={docMode === 'quotation' ? 'text-amber-300' : ''} />
              <span>1. Trip Quotation & Fare Estimate</span>
            </button>

            <button
              onClick={() => setDocMode('invoice')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl font-black text-xs transition-all cursor-pointer ${
                docMode === 'invoice'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <FileCheck size={15} />
              <span>2. Final Paid Tax Invoice & Receipt</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleDownloadPDF}
              disabled={isDownloadingPdf}
              className="flex-1 sm:flex-initial bg-[#0A3D73] hover:bg-[#072d54] disabled:opacity-60 text-white font-black text-xs py-2.5 px-4 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Download size={14} />
              <span>{isDownloadingPdf ? 'Generating PDF...' : 'Download PDF'}</span>
            </button>

            <button
              type="button"
              onClick={handleSendEmailQuote}
              disabled={isSendingEmail}
              className="flex-1 sm:flex-initial bg-[#FF7020] hover:bg-[#e56015] disabled:opacity-60 text-white font-black text-xs py-2.5 px-4 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Mail size={14} />
              <span>{isSendingEmail ? 'Sending...' : 'Email Quotation'}</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="flex-1 sm:flex-initial bg-slate-900 hover:bg-black text-white font-black text-xs py-2.5 px-4 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Printer size={14} />
              <span>Print</span>
            </button>

            <button
              type="button"
              onClick={handleWhatsAppShare}
              className="w-full sm:w-auto bg-[#25D366] hover:bg-[#1ebd5a] text-white font-black text-xs py-2.5 px-4 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Share2 size={14} />
              <span>WhatsApp</span>
            </button>
          </div>
        </div>

        {/* =========================================================================
            INTELLIGENT QUOTATION INPUT CARD (ENTER NAME, NUMBER, ROUTE & VEHICLE ONLY)
            ========================================================================= */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4 mb-5">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-[#FF7020] flex items-center gap-1.5">
                <Calculator size={14} /> Instant Quotation Generator
              </span>
              <h3 className="text-lg sm:text-xl font-black text-[#0A3D73] font-display mt-0.5">
                Enter Passenger & Travel Details
              </h3>
              <p className="text-xs text-slate-500">
                Distance (KM), Rate per KM, Driver Bata, and Tolls are calculated automatically based on official Karnataka transport benchmarks.
              </p>
            </div>

            {docMode === 'quotation' && (
              <button
                type="button"
                onClick={handleOfflinePaymentConfirm}
                className="self-start sm:self-center bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <CheckCircle size={14} />
                <span>Paid Offline? Convert to Paid Invoice</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            
            {/* 1. Passenger Name */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Passenger / Customer Name *
              </label>
              <input
                type="text"
                required
                autoComplete="name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter full name..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-semibold text-slate-800 text-base sm:text-xs focus:outline-none focus:ring-2 focus:ring-[#0A3D73]"
              />
            </div>

            {/* 2. Customer Phone */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Mobile Number (WhatsApp) *
              </label>
              <input
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Enter 10-digit mobile number..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-semibold text-slate-800 text-base sm:text-xs focus:outline-none focus:ring-2 focus:ring-[#0A3D73]"
              />
            </div>

            {/* 3. Trip Type (Outstation vs Local) */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Trip Service Category *
              </label>
              <select
                value={tripType}
                onChange={(e) => setTripType(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-semibold text-slate-800 text-base sm:text-xs focus:outline-none focus:ring-2 focus:ring-[#0A3D73] cursor-pointer"
              >
                <option value="roundtrip">Outstation Round Trip (Standard)</option>
                <option value="oneway">Outstation One-Way Drop</option>
                <option value="local">Local Bangalore City (8h / 80km)</option>
                <option value="airport">BLR Kempegowda Airport Transfer</option>
              </select>
            </div>

            {/* 4. Vehicle Selection */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Vehicle Category *
              </label>
              <select
                value={selectedVehicleId}
                onChange={(e) => setSelectedVehicleId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-semibold text-slate-800 text-base sm:text-xs focus:outline-none focus:ring-2 focus:ring-[#0A3D73] cursor-pointer"
              >
                {FLEET_PRICING.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.shortName} (₹{v.ratePerKm}/km)
                  </option>
                ))}
              </select>
            </div>

            {/* 5. Pickup Location (Single-letter autocomplete across Bangalore & India) */}
            <div>
              <PlaceAutocompleteInput
                label="Pickup Location"
                value={pickupLocation}
                onChange={(val) => setPickupLocation(val)}
                placeholder="Type pickup area in Bangalore..."
                iconType="pickup"
                required
              />
            </div>

            {/* 6. Destination Route (Single-letter autocomplete across all Indian cities & states) */}
            <div className="sm:col-span-2">
              <PlaceAutocompleteInput
                label="Destination / Drop City (Entire India)"
                value={selectedRouteName}
                onChange={(val, place) => {
                  setSelectedRouteName(val);
                  if (place && place.distanceKmFromBangalore > 0) {
                    const rtKm = Math.round(place.distanceKmFromBangalore * 2);
                    const stdDays = Math.max(1, Math.ceil(place.distanceKmFromBangalore / 250));
                    setTripDays(stdDays);
                    setDistanceKm(rtKm);
                  }
                }}
                placeholder="Type 1 letter for any Indian city (e.g. Coorg, Ooty, Goa, Mysore)..."
                iconType="drop"
                required
              />
            </div>

            {/* 7. Travel Dates & Days */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Travel Date</label>
                <input
                  type="date"
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2.5 font-semibold text-slate-800 text-base sm:text-[11px]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Trip Days</label>
                <input
                  type="number"
                  inputMode="numeric"
                  min="1"
                  max="15"
                  value={tripDays}
                  onChange={(e) => setTripDays(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2.5 font-semibold text-slate-800 text-base sm:text-[11px]"
                />
              </div>
            </div>

          </div>

          {/* Quick Auto-Calculation Preview Strip */}
          <div className="mt-5 p-4 bg-blue-50/70 border border-blue-200/80 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
            <div className="flex flex-wrap items-center gap-4">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Auto Billed KM</span>
                <span className="font-black text-slate-900 font-mono text-sm">{distanceKm > 0 ? `${distanceKm} KM` : '—'}</span>
              </div>
              <div className="hidden sm:block text-slate-300">|</div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Vehicle Tariff</span>
                <span className="font-black text-[#0A3D73] font-mono text-sm">₹{ratePerKm} / KM</span>
              </div>
              <div className="hidden sm:block text-slate-300">|</div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Driver Bata</span>
                <span className="font-black text-slate-900 font-mono text-sm">{driverBata > 0 ? `₹${driverBata} (${tripDays} Days)` : '—'}</span>
              </div>
              <div className="hidden sm:block text-slate-300">|</div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Tolls & Permits</span>
                <span className="font-black text-slate-900 font-mono text-sm">{tollParking > 0 ? `₹${tollParking}` : '—'}</span>
              </div>
            </div>

            <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0 border-blue-200/60">
              <div className="text-left md:text-right">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Total Estimated Fare</span>
                <span className="font-black text-emerald-700 font-mono text-base sm:text-lg">
                  {grandTotal > 0 ? `₹${grandTotal.toLocaleString()}` : '₹0'}
                </span>
              </div>

              <button
                type="button"
                onClick={handleDownloadPDF}
                className="bg-[#0A3D73] hover:bg-[#072d54] text-white font-black text-xs py-2 px-3.5 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <Download size={13} />
                <span>Save PDF</span>
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* =========================================================================
          PRINTABLE DOCUMENT (SWITCHES BETWEEN OFFICIAL QUOTATION AND PAID INVOICE)
          ========================================================================= */}
      <div className="container-x max-w-5xl mx-auto px-4 print:p-0 print:max-w-none">
        <div id="printable-area" className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 sm:p-12 print:p-2 print:shadow-none print:border-none print:rounded-none text-slate-800">
          
          {/* Document Header Row: Official Logo & Contact */}
          <div className="border-b-2 border-slate-800 pb-6 mb-6 print:pb-2.5 print:mb-2.5">
            <div className="flex flex-col sm:flex-row print:flex-row sm:items-start justify-between gap-6 print:gap-3">
              
              {/* Brand Logo & Address */}
              <div>
                <div className="mb-3 print:mb-1.5">
                  <img 
                    src="/logo.png" 
                    alt="BookMyRoute Official Logo" 
                    className="h-14 sm:h-16 print:h-10 w-auto object-contain"
                  />
                </div>
                
                <p className="text-xs print:text-[10px] text-slate-600 max-w-sm leading-relaxed print:leading-snug">
                  <strong>Office:</strong> {OFFICE_ADDRESS}<br />
                  <strong>Helpline:</strong> {CONTACT_PHONE} | <strong>Email:</strong> {CONTACT_EMAIL}<br />
                  <strong>Website:</strong> www.bookmyroute.in
                </p>
              </div>

              {/* Document Title & Reference Details */}
              <div className="sm:text-right print:text-right">
                <div className={`inline-block text-white font-black text-xs print:text-[11px] uppercase tracking-wider px-4 py-1.5 print:px-3 print:py-1 rounded-lg mb-3 print:mb-1.5 shadow-xs ${
                  docMode === 'quotation' ? 'bg-[#0A3D73]' : 'bg-emerald-800'
                }`}>
                  {docMode === 'quotation' ? 'OFFICIAL TRAVEL QUOTATION' : 'TRIP INVOICE & BILL'}
                </div>

                <div className="space-y-1 print:space-y-0.5 text-xs print:text-[10px]">
                  {docMode === 'quotation' ? (
                    <>
                      <p><span className="text-slate-500 font-medium">Quotation No:</span> <strong className="font-mono text-slate-900">{quotationNumber}</strong></p>
                      <p><span className="text-slate-500 font-medium">Issue Date:</span> <strong>{travelDate}</strong></p>
                      <p><span className="text-slate-500 font-medium">Valid Until:</span> <strong className="text-emerald-700">7 Days from Issue</strong></p>
                      <p><span className="text-slate-500 font-medium">Trip Mode:</span> <strong>{tripType === 'roundtrip' ? 'Outstation Round Trip' : tripType === 'oneway' ? 'Outstation One Way' : tripType === 'local' ? 'Local Bangalore City' : 'Airport Transfer'}</strong></p>
                    </>
                  ) : (
                    <>
                      <p><span className="text-slate-500 font-medium">Invoice No:</span> <strong className="font-mono text-slate-900">{invoiceNumber}</strong></p>
                      <p><span className="text-slate-500 font-medium">Booking ID:</span> <strong className="font-mono text-[#0A3D73]">{bookingId}</strong></p>
                      <p><span className="text-slate-500 font-medium">Invoice Date:</span> <strong>{travelDate}</strong></p>
                      <p><span className="text-slate-500 font-medium">Payment Mode:</span> <strong>{paymentMode}</strong></p>
                      <div className="pt-1 print:pt-0.5">
                        <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[11px] print:text-[9.5px] font-black px-2.5 py-0.5 rounded-full">
                          <CheckCircle size={12} className="print:w-2.5 print:h-2.5" /> {paymentStatus}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* Customer Particulars & Route (Two Columns) */}
          <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-6 print:gap-2.5 mb-8 print:mb-2.5 text-xs print:text-[10.5px] page-break-avoid">
            
            {/* Customer Details */}
            <div className="bg-slate-50 p-4 print:p-2.5 rounded-xl border border-slate-200">
              <h3 className="font-black text-slate-900 uppercase tracking-wider text-[11px] print:text-[10px] border-b border-slate-200 pb-2 print:pb-1 mb-2.5 print:mb-1.5 flex items-center gap-1.5">
                <User size={13} className="text-[#0A3D73] print:w-3 print:h-3" /> Passenger / Customer Particulars
              </h3>
              <div className="space-y-1.5 print:space-y-0.5 text-slate-700">
                <p><span className="text-slate-500">Full Name:</span> <strong className="text-slate-900">{customerName.trim() || '— (Enter name above)'}</strong></p>
                <p><span className="text-slate-500">Contact Number:</span> <strong>{customerPhone.trim() || '— (Enter phone above)'}</strong></p>
                <p><span className="text-slate-500">Email Address:</span> {customerEmail.trim() || '—'}</p>
                <p><span className="text-slate-500">Origin City:</span> Bengaluru, Karnataka</p>
              </div>
            </div>

            {/* Trip Particulars */}
            <div className="bg-slate-50 p-4 print:p-2.5 rounded-xl border border-slate-200">
              <h3 className="font-black text-slate-900 uppercase tracking-wider text-[11px] print:text-[10px] border-b border-slate-200 pb-2 print:pb-1 mb-2.5 print:mb-1.5 flex items-center gap-1.5">
                <Car size={13} className="text-[#FF7020] print:w-3 print:h-3" /> Vehicle & Route Details
              </h3>
              <div className="space-y-1.5 print:space-y-0.5 text-slate-700">
                <p><span className="text-slate-500">Vehicle Booked:</span> <strong className="text-[#0A3D73]">{currentVehicle.name}</strong></p>
                <p><span className="text-slate-500">Seating Capacity:</span> <strong>{currentVehicle.seats} (Pushback AC)</strong></p>
                {docMode === 'invoice' && (
                  <p><span className="text-slate-500">Vehicle Reg No:</span> <strong className="font-mono">{vehicleRegNo}</strong></p>
                )}
                <p><span className="text-slate-500">Chauffeur:</span> <strong>{chauffeurName}</strong> ({chauffeurPhone})</p>
                <p><span className="text-slate-500">Pickup Location:</span> <strong>{pickupLocation.trim() || '— (Enter pickup)'}</strong></p>
                <p><span className="text-slate-500">Destination:</span> <strong>{finalDestinationDisplay}</strong></p>
                <p><span className="text-slate-500">Travel Date / Duration:</span> <strong>{travelDate || 'Date as scheduled'} ({tripDays} Days)</strong></p>
              </div>
            </div>

          </div>

          {/* Itemized Fare Estimation / Billing Table */}
          <div className="mb-6 print:mb-2.5 overflow-x-auto page-break-avoid">
            <table className="w-full text-xs print:text-[10.5px] text-left border-collapse border border-slate-300">
              <thead>
                <tr className="bg-[#0A3D73] text-white uppercase text-[10px] print:text-[9.5px] tracking-wider">
                  <th className="py-2.5 print:py-1 px-3 print:px-2 border border-slate-300 w-12 text-center">#</th>
                  <th className="py-2.5 print:py-1 px-4 print:px-2 border border-slate-300">Description of Service</th>
                  <th className="py-2.5 print:py-1 px-3 print:px-2 border border-slate-300 text-center w-24">Units</th>
                  <th className="py-2.5 print:py-1 px-3 print:px-2 border border-slate-300 text-right w-24">Rate (₹)</th>
                  <th className="py-2.5 print:py-1 px-4 print:px-2 border border-slate-300 text-right w-28">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                <tr>
                  <td className="py-3 print:py-1.5 px-3 print:px-2 border border-slate-200 text-center font-medium">1</td>
                  <td className="py-3 print:py-1.5 px-4 print:px-2 border border-slate-200">
                    <strong className="text-slate-900 block">
                      {tripType === 'roundtrip' ? 'Outstation Round Trip Vehicle Rental' : tripType === 'oneway' ? 'Outstation One-Way Drop' : tripType === 'local' ? 'Local Bangalore City Package' : 'Airport Transfer'}
                    </strong>
                    <span className="text-slate-500 text-[11px] print:text-[9px]">
                      From {pickupLocation.trim() || '[Pickup Location]'} to {finalDestinationDisplay === '—' ? '[Destination City]' : finalDestinationDisplay} {routeHighlightsDisplay ? `via ${routeHighlightsDisplay}` : ''}
                    </span>
                  </td>
                  <td className="py-3 print:py-1.5 px-3 print:px-2 border border-slate-200 text-center font-mono">{distanceKm} KM</td>
                  <td className="py-3 print:py-1.5 px-3 print:px-2 border border-slate-200 text-right font-mono">₹{ratePerKm}</td>
                  <td className="py-3 print:py-1.5 px-4 print:px-2 border border-slate-200 text-right font-mono font-bold">₹{baseFare.toLocaleString()}</td>
                </tr>

                <tr>
                  <td className="py-3 print:py-1.5 px-3 print:px-2 border border-slate-200 text-center font-medium">2</td>
                  <td className="py-3 print:py-1.5 px-4 print:px-2 border border-slate-200">
                    <strong className="text-slate-900 block">Driver Bata / Outstation Daily Allowance</strong>
                    <span className="text-slate-500 text-[11px] print:text-[9px]">Commercial chauffeur lodging & food allowance</span>
                  </td>
                  <td className="py-3 print:py-1.5 px-3 print:px-2 border border-slate-200 text-center font-mono">{tripDays} Day(s)</td>
                  <td className="py-3 print:py-1.5 px-3 print:px-2 border border-slate-200 text-right font-mono">₹{currentVehicle.driverBataPerDay}</td>
                  <td className="py-3 print:py-1.5 px-4 print:px-2 border border-slate-200 text-right font-mono font-bold">₹{driverBata.toLocaleString()}</td>
                </tr>

                <tr>
                  <td className="py-3 print:py-1.5 px-3 print:px-2 border border-slate-200 text-center font-medium">3</td>
                  <td className="py-3 print:py-1.5 px-4 print:px-2 border border-slate-200">
                    <strong className="text-slate-900 block">Tollway Toll Fees, Parking & State Permits (Estimate)</strong>
                    <span className="text-slate-500 text-[11px] print:text-[9px]">Highway FASTag electronic tolls & destination interstate permit charges</span>
                  </td>
                  <td className="py-3 print:py-1.5 px-3 print:px-2 border border-slate-200 text-center font-mono">Route Est.</td>
                  <td className="py-3 print:py-1.5 px-3 print:px-2 border border-slate-200 text-right font-mono">-</td>
                  <td className="py-3 print:py-1.5 px-4 print:px-2 border border-slate-200 text-right font-mono font-bold">₹{tollParking.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Amount In Words & Totals Block */}
          <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-6 print:gap-2.5 items-start mb-8 print:mb-2.5 text-xs print:text-[10.5px] page-break-avoid">
            <div className="bg-slate-50 p-4 print:p-2.5 rounded-xl border border-slate-200">
              <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px] print:text-[9px] block mb-1">
                Amount in Words:
              </span>
              <p className="font-bold text-slate-800 text-xs print:text-[10.5px] italic">
                {numberToWordsINR(grandTotal)}
              </p>
              
              <div className="mt-3 print:mt-1.5 pt-3 print:pt-1.5 border-t border-slate-200 space-y-1 print:space-y-0.5 text-[11px] print:text-[9.5px] text-slate-600">
                <p>
                  <strong>Billing Mode:</strong> {docMode === 'quotation' ? 'Estimated Commercial Fare (100% Zero GST Added)' : 'Settled via Offline Payment'}
                </p>
                {docMode === 'invoice' && (
                  <p>
                    <strong>Payment Mode:</strong> {paymentMode}
                  </p>
                )}
              </div>
            </div>

            <div className="bg-slate-50 p-4 print:p-2.5 rounded-xl border border-slate-200 space-y-2 print:space-y-1">
              <div className="flex justify-between text-slate-600">
                <span>Vehicle Distance Charge ({distanceKm} KM @ ₹{ratePerKm}/km):</span>
                <span className="font-mono font-bold">₹{baseFare.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Driver Allowance ({tripDays} Days @ ₹{currentVehicle.driverBataPerDay}/day):</span>
                <span className="font-mono font-bold">₹{driverBata.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Estimated Tolls & Permits:</span>
                <span className="font-mono font-bold">₹{tollParking.toLocaleString()}</span>
              </div>

              <div className="border-t-2 border-slate-800 pt-2 print:pt-1 flex justify-between items-baseline">
                <span className="text-sm print:text-xs font-black text-slate-900">
                  {docMode === 'quotation' ? 'Total Estimated Price:' : 'Total Amount Paid:'}
                </span>
                <span className="text-xl print:text-base font-black text-[#0A3D73] font-mono">
                  ₹{grandTotal.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Terms & Conditions (Quotation vs Invoice) */}
          <div className="p-4 print:p-2 bg-slate-50 rounded-xl border border-slate-200 mb-8 print:mb-2 text-[11px] print:text-[9px] print:leading-tight text-slate-600 space-y-1 print:space-y-0.5 page-break-avoid">
            <strong className="text-slate-900 block uppercase text-[11px] print:text-[9px] mb-1">
              {docMode === 'quotation' ? 'Quotation Terms & Travel Policies (Standard Transparent Market Pricing):' : 'Official Invoice Notes & Verification:'}
            </strong>
            <p>1. Kilometers and duty hours calculated garage-to-garage from Bangalore dispatch center as per Karnataka State Commercial Transport guidelines.</p>
            <p>2. Chilled AC operational throughout the trip except during vehicle idle parking or traversing steep uphill ghat sections.</p>
            <p>3. Fuel charges and chauffeur night lodging/food are included in the above quote. Tolls and state permits payable at actual FASTag receipts.</p>
            {docMode === 'quotation' ? (
              <p className="font-semibold text-[#0A3D73]">4. This quotation is valid for 7 days from issue date. Confirm your trip booking directly on 24/7 Helpline: {CONTACT_PHONE}.</p>
            ) : (
              <p className="font-semibold text-emerald-800">4. This is a computer-generated paid tax invoice. Verified and acknowledged by BookMyRoute Logistics.</p>
            )}
          </div>

          {/* Footer: QR Code & Authorized Signature */}
          <div className="pt-6 print:pt-2 border-t-2 border-slate-200 flex flex-col sm:flex-row print:flex-row items-center justify-between gap-6 print:gap-2 text-xs print:text-[10px] page-break-avoid">
            <div className="flex items-center gap-3 print:gap-2">
              <div className="p-2 print:p-1 border border-slate-300 rounded-lg bg-white shadow-xs">
                <QrCode size={48} className="text-slate-800 print:w-8 print:h-8" />
              </div>
              <div>
                <span className="font-bold text-slate-900 block print:text-[10px]">Verify Digitally</span>
                <span className="text-[10px] print:text-[8.5px] text-slate-500">
                  {docMode === 'quotation' ? `Quote Ref: ${quotationNumber}` : `Digital Invoice ID: ${bookingId}`}
                </span>
              </div>
            </div>

            <div className="text-center sm:text-right print:text-right">
              <span className="inline-flex items-center gap-1 text-[11px] print:text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 mb-1">
                ✓ DIGITALLY VERIFIED & APPROVED
              </span>
              <p className="text-xs print:text-[10px] font-black text-slate-900">For BookMyRoute Travel Logistics</p>
              <p className="text-[10px] print:text-[8.5px] text-slate-400">Authorized Dispatch Desk</p>
            </div>
          </div>

          <div className="mt-8 print:mt-1.5 pt-4 print:pt-1 border-t border-slate-100 text-center text-[10px] print:text-[8px] text-slate-400">
            Thank you for choosing BookMyRoute. For 24/7 route support or inquiries, call {CONTACT_PHONE} or email {CONTACT_EMAIL}.
          </div>

        </div>
      </div>

    </div>
  );
}
