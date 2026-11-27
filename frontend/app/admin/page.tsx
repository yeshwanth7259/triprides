'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users, Phone, MessageSquare, Car, MapPin, Calendar, 
  Clock, IndianRupee, AlertCircle, CheckCircle, RefreshCw, 
  Trash2, Search, Filter, ShieldCheck, ArrowUpRight, 
  FileText, Download, Eye, Sparkles, UserCheck, Lock, Unlock
} from 'lucide-react';
import { LeadRecord } from '../../lib/dbStore';
import { CONTACT_PHONE } from '../../lib/fleetData';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'abandoned' | 'confirmed' | 'quoted' | 'drivers'>('all');
  const [selectedLead, setSelectedLead] = useState<LeadRecord | null>(null);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/leads');
      const data = await res.json();
      if (data.success && Array.isArray(data.leads)) {
        setLeads(data.leads);
      }
    } catch (err) {
      console.error('Failed to fetch leads:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
    const interval = setInterval(fetchLeads, 15000); // 15-second polling for live updates
    return () => clearInterval(interval);
  }, []);

  const handleUpdateStatus = async (id: string, status: LeadRecord['status']) => {
    try {
      const res = await fetch('/api/admin/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      const data = await res.json();
      if (data.success) {
        setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
        if (selectedLead?.id === id) {
          setSelectedLead({ ...selectedLead, status });
        }
      }
    } catch (err) {
      console.error('Failed to update lead status:', err);
    }
  };

  const handleDeleteLead = async (id: string) => {
    if (!confirm('Are you sure you want to remove this lead?')) return;
    try {
      const res = await fetch(`/api/admin/leads?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setLeads(prev => prev.filter(l => l.id !== id));
        if (selectedLead?.id === id) setSelectedLead(null);
      }
    } catch (err) {
      console.error('Failed to delete lead:', err);
    }
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === '2026' || pinInput === 'admin') {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  // Filter leads
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      (lead.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lead.phone || '').includes(searchQuery) ||
      (lead.pickup || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lead.destination || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lead.vehicle || '').toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === 'abandoned') return lead.status === 'ABANDONED_INCOMPLETE';
    if (activeTab === 'confirmed') return lead.status === 'BOOKING_CONFIRMED';
    if (activeTab === 'quoted') return lead.status === 'QUOTATION_GENERATED';
    if (activeTab === 'drivers') return lead.status === 'DRIVER_ENQUIRY';

    return true;
  });

  // Calculate statistics
  const totalCount = leads.length;
  const abandonedCount = leads.filter(l => l.status === 'ABANDONED_INCOMPLETE').length;
  const confirmedCount = leads.filter(l => l.status === 'BOOKING_CONFIRMED').length;
  const quotedCount = leads.filter(l => l.status === 'QUOTATION_GENERATED').length;
  const driversCount = leads.filter(l => l.status === 'DRIVER_ENQUIRY').length;
  const totalRevenuePipeline = leads.reduce((acc, curr) => acc + (curr.totalFare || 0), 0);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#0A3D73] text-white flex items-center justify-center mx-auto shadow-md">
            <Lock size={28} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">BookMyRoute Admin Portal</h2>
            <p className="text-xs text-slate-500 mt-1">Enter PIN or click unlock to access live leads</p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-3">
            <input
              type="password"
              placeholder="Enter PIN (Default: 2026)"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              className="w-full text-center tracking-widest text-lg font-mono font-bold bg-slate-50 border border-slate-200 rounded-xl py-3 focus:outline-none focus:ring-2 focus:ring-[#0A3D73]"
            />
            {pinError && <p className="text-xs text-red-600 font-bold">Incorrect PIN. Try 2026.</p>}

            <button
              type="submit"
              className="w-full bg-[#0A3D73] hover:bg-[#082e56] text-white font-black text-xs py-3 rounded-xl transition-all shadow-md cursor-pointer"
            >
              Unlock Control Center
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 pt-24 pb-20 font-sans">
      <div className="container-x max-w-7xl mx-auto px-4 space-y-6">

        {/* Top Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-[#0A3D73] text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-md">
                Admin Control Center
              </span>
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                ● Live Database Active
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
              Leads & Booking Management Dashboard
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Live tracking of completed bookings, formal quotations & mid-way abandoned inquiries.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={fetchLeads}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2.5 px-4 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              <span>Refresh Leads</span>
            </button>

            <Link
              href="/invoice"
              className="bg-[#0A3D73] hover:bg-[#082e56] text-white font-black text-xs py-2.5 px-4 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
            >
              <FileText size={14} />
              <span>Quotation & Invoice Tool</span>
            </Link>
          </div>
        </div>

        {/* Alert Banner for Abandoned Leads */}
        {abandonedCount > 0 && (
          <div className="bg-amber-500/10 border-2 border-amber-500/40 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-amber-900">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                <AlertCircle size={22} />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-black">
                  ⚠️ {abandonedCount} Hot Lead(s) Left Mid-Way Without Booking!
                </h4>
                <p className="text-[11px] text-amber-800">
                  Users typed their phone number and travel route but closed the tab. Follow up on WhatsApp or Phone immediately to convert them into confirmed trips!
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('abandoned')}
              className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-black px-4 py-2 rounded-xl transition-all shrink-0 cursor-pointer shadow-xs"
            >
              View Abandoned Leads ({abandonedCount})
            </button>
          </div>
        )}

        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <span className="text-[10px] font-black uppercase text-slate-400 block mb-1">Total Enquiries</span>
            <div className="text-2xl font-black text-slate-900 font-mono">{totalCount}</div>
            <span className="text-[10px] text-slate-500 mt-1 block">All registered inquiries</span>
          </div>

          <div className="bg-amber-50/70 rounded-2xl p-5 border border-amber-200 shadow-xs">
            <span className="text-[10px] font-black uppercase text-amber-700 block mb-1">Left Mid-Way</span>
            <div className="text-2xl font-black text-amber-800 font-mono">{abandonedCount}</div>
            <span className="text-[10px] text-amber-600 font-bold mt-1 block">Needs follow-up</span>
          </div>

          <div className="bg-emerald-50/70 rounded-2xl p-5 border border-emerald-200 shadow-xs">
            <span className="text-[10px] font-black uppercase text-emerald-700 block mb-1">Confirmed Trips</span>
            <div className="text-2xl font-black text-emerald-800 font-mono">{confirmedCount}</div>
            <span className="text-[10px] text-emerald-600 font-bold mt-1 block">Ready for vehicle dispatch</span>
          </div>

          <div className="bg-blue-50/70 rounded-2xl p-5 border border-blue-200 shadow-xs">
            <span className="text-[10px] font-black uppercase text-[#0A3D73] block mb-1">Quotations Sent</span>
            <div className="text-2xl font-black text-[#0A3D73] font-mono">{quotedCount}</div>
            <span className="text-[10px] text-slate-500 mt-1 block">Rates calculated</span>
          </div>

          <div className="col-span-2 sm:col-span-1 bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <span className="text-[10px] font-black uppercase text-slate-400 block mb-1">Estimated Pipeline</span>
            <div className="text-2xl font-black text-emerald-700 font-mono">₹{totalRevenuePipeline.toLocaleString()}</div>
            <span className="text-[10px] text-slate-500 mt-1 block">Gross trip bookings value</span>
          </div>
        </div>

        {/* Filter Tabs & Search Bar */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 text-xs">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-2 rounded-xl font-black whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'all' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              All Leads ({totalCount})
            </button>

            <button
              onClick={() => setActiveTab('abandoned')}
              className={`px-3.5 py-2 rounded-xl font-black whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'abandoned' ? 'bg-amber-600 text-white shadow-xs' : 'text-amber-800 bg-amber-50 hover:bg-amber-100'
              }`}
            >
              <span>⚠️ Left Mid-Way ({abandonedCount})</span>
            </button>

            <button
              onClick={() => setActiveTab('confirmed')}
              className={`px-3.5 py-2 rounded-xl font-black whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'confirmed' ? 'bg-emerald-700 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>✓ Confirmed ({confirmedCount})</span>
            </button>

            <button
              onClick={() => setActiveTab('quoted')}
              className={`px-3.5 py-2 rounded-xl font-black whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'quoted' ? 'bg-[#0A3D73] text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Quotations ({quotedCount})
            </button>

            <button
              onClick={() => setActiveTab('drivers')}
              className={`px-3.5 py-2 rounded-xl font-black whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'drivers' ? 'bg-purple-700 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Drivers ({driversCount})
            </button>
          </div>

          <div className="relative w-full md:w-72">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, phone, city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0A3D73]"
            />
          </div>
        </div>

        {/* Main Leads Table & Side Drawer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          <div className={`${selectedLead ? 'lg:col-span-7' : 'lg:col-span-12'} bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden`}>
            {filteredLeads.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <Users size={36} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm font-bold">No leads found in this view</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Contact</th>
                      <th className="py-3 px-4">Route / Service</th>
                      <th className="py-3 px-4">Estimated Fare</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Quick Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {filteredLeads.map((lead) => {
                      const cleanPhone = (lead.phone || '').replace(/\D/g, '').slice(-10);
                      const isAbandoned = lead.status === 'ABANDONED_INCOMPLETE';

                      return (
                        <tr 
                          key={lead.id} 
                          onClick={() => setSelectedLead(lead)}
                          className={`hover:bg-blue-50/50 cursor-pointer transition-colors ${selectedLead?.id === lead.id ? 'bg-blue-50/80 font-semibold' : ''}`}
                        >
                          <td className="py-3 px-4">
                            <span className="font-bold text-slate-900 block">{lead.name || 'Anonymous Guest'}</span>
                            <span className="text-[10px] text-slate-400 block">{new Date(lead.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(lead.createdAt).toLocaleDateString()}</span>
                          </td>

                          <td className="py-3 px-4">
                            <span className="font-mono text-slate-900 font-bold block">+91 {cleanPhone || lead.phone}</span>
                            {lead.email && <span className="text-[10px] text-slate-400 block truncate max-w-[140px]">{lead.email}</span>}
                          </td>

                          <td className="py-3 px-4">
                            <span className="text-slate-900 font-semibold block">{lead.pickup || 'Bangalore'} ➔ {lead.destination || 'Pending'}</span>
                            <span className="text-[10px] text-slate-500 block">{lead.vehicle || lead.service || 'Outstation Cab'}</span>
                          </td>

                          <td className="py-3 px-4">
                            <span className="font-black text-[#0A3D73] font-mono block">
                              {lead.totalFare ? `₹${lead.totalFare.toLocaleString()}` : '—'}
                            </span>
                            {lead.distanceKm ? <span className="text-[10px] text-slate-400">{lead.distanceKm} KM</span> : null}
                          </td>

                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${
                              isAbandoned 
                                ? 'bg-amber-100 text-amber-800 border border-amber-300' 
                                : lead.status === 'BOOKING_CONFIRMED'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : lead.status === 'DRIVER_ENQUIRY'
                                ? 'bg-purple-100 text-purple-800 border border-purple-300'
                                : 'bg-blue-100 text-[#0A3D73] border border-blue-200'
                            }`}>
                              {isAbandoned ? '⚠️ Left Mid-Way' : lead.status === 'BOOKING_CONFIRMED' ? '✓ Confirmed' : lead.status === 'DRIVER_ENQUIRY' ? '🚗 Driver' : '📋 Quoted'}
                            </span>
                          </td>

                          <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-1.5">
                              {cleanPhone && (
                                <>
                                  <a
                                    href={`https://wa.me/91${cleanPhone}?text=${encodeURIComponent(
                                      isAbandoned 
                                        ? `Hi ${lead.name}, we noticed you checked cabs on BookMyRoute for ${lead.pickup} to ${lead.destination}. How can we assist you with special discount or vehicle options?`
                                        : `Hi ${lead.name}, thank you for choosing BookMyRoute for your trip from ${lead.pickup} to ${lead.destination}. We are ready with your vehicle quotation.`
                                    )}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title="WhatsApp Customer"
                                    className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                                  >
                                    <MessageSquare size={14} />
                                  </a>

                                  <a
                                    href={`tel:+91${cleanPhone}`}
                                    title="Call Customer"
                                    className="p-1.5 rounded-lg bg-blue-50 text-[#0A3D73] hover:bg-blue-100 transition-colors"
                                  >
                                    <Phone size={14} />
                                  </a>
                                </>
                              )}

                              <button
                                onClick={() => handleDeleteLead(lead.id)}
                                title="Delete Lead"
                                className="p-1.5 rounded-lg bg-slate-50 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Right Side Detail Drawer (When a lead is clicked) */}
          {selectedLead && (
            <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 shadow-md p-6 space-y-5 sticky top-24">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Lead Dossier</span>
                  <h3 className="text-base font-black text-slate-900">{selectedLead.name}</h3>
                </div>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="text-slate-400 hover:text-slate-600 text-xs font-bold"
                >
                  ✕ Close
                </button>
              </div>

              {/* Status Update Buttons */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-[10px] font-bold text-slate-400 mr-1">Mark:</span>
                <button
                  onClick={() => handleUpdateStatus(selectedLead.id, 'BOOKING_CONFIRMED')}
                  className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold"
                >
                  ✓ Confirmed
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedLead.id, 'CONTACTED')}
                  className="px-2.5 py-1 rounded-lg bg-blue-50 text-[#0A3D73] hover:bg-blue-100 font-bold"
                >
                  Contacted
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedLead.id, 'ABANDONED_INCOMPLETE')}
                  className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 hover:bg-amber-100 font-bold"
                >
                  Left Mid-Way
                </button>
              </div>

              {/* Lead Information Particulars */}
              <div className="bg-slate-50 rounded-2xl p-4 space-y-2 text-xs">
                <div className="flex justify-between"><span className="text-slate-500 font-medium">Customer:</span><span className="font-bold text-slate-900">{selectedLead.name}</span></div>
                <div className="flex justify-between"><span className="text-slate-500 font-medium">Phone:</span><span className="font-mono font-bold text-slate-900">+91 {selectedLead.phone}</span></div>
                {selectedLead.email && <div className="flex justify-between"><span className="text-slate-500 font-medium">Email:</span><span className="font-bold text-slate-900">{selectedLead.email}</span></div>}
                <div className="flex justify-between"><span className="text-slate-500 font-medium">Pickup:</span><span className="font-bold text-slate-900">{selectedLead.pickup || '—'}</span></div>
                <div className="flex justify-between"><span className="text-slate-500 font-medium">Destination:</span><span className="font-bold text-slate-900">{selectedLead.destination || '—'}</span></div>
                {selectedLead.travelDate && <div className="flex justify-between"><span className="text-slate-500 font-medium">Travel Date:</span><span className="font-bold text-slate-900">{selectedLead.travelDate}</span></div>}
                {selectedLead.vehicle && <div className="flex justify-between"><span className="text-slate-500 font-medium">Vehicle:</span><span className="font-bold text-slate-900">{selectedLead.vehicle}</span></div>}
                {selectedLead.distanceKm ? <div className="flex justify-between"><span className="text-slate-500 font-medium">Distance:</span><span className="font-mono font-bold text-slate-900">{selectedLead.distanceKm} KM</span></div> : null}
                {selectedLead.source && <div className="flex justify-between"><span className="text-slate-500 font-medium">Source:</span><span className="text-slate-700">{selectedLead.source}</span></div>}
              </div>

              {/* Fare Summary Box */}
              {selectedLead.totalFare && selectedLead.totalFare > 0 ? (
                <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 text-center">
                  <span className="text-[10px] uppercase font-bold text-emerald-700 block">Total Calculated Fare</span>
                  <span className="text-2xl font-black text-emerald-800 font-mono">
                    ₹{selectedLead.totalFare.toLocaleString()}
                  </span>
                </div>
              ) : null}

              {/* Quick Actions */}
              <div className="space-y-2 pt-2">
                <Link
                  href={`/invoice?name=${encodeURIComponent(selectedLead.name)}&phone=${encodeURIComponent(selectedLead.phone)}&pickup=${encodeURIComponent(selectedLead.pickup)}&drop=${encodeURIComponent(selectedLead.destination)}&vehicle=${encodeURIComponent(selectedLead.vehicle || '')}&date=${encodeURIComponent(selectedLead.travelDate || '')}`}
                  className="w-full bg-[#0A3D73] hover:bg-[#072f59] text-white font-black text-xs py-2.5 px-4 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5"
                >
                  <FileText size={14} />
                  <span>Generate / Print PDF Quotation</span>
                  <ArrowUpRight size={14} />
                </Link>

                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={`https://wa.me/91${(selectedLead.phone || '').replace(/\D/g, '').slice(-10)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#25D366] hover:bg-[#1ebe5a] text-white font-bold text-xs py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5"
                  >
                    <MessageSquare size={14} />
                    <span>WhatsApp</span>
                  </a>

                  <a
                    href={`tel:+91${(selectedLead.phone || '').replace(/\D/g, '').slice(-10)}`}
                    className="bg-slate-900 hover:bg-black text-white font-bold text-xs py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5"
                  >
                    <Phone size={14} />
                    <span>Call Now</span>
                  </a>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
