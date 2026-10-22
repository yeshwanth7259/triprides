'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import BookTripModal from './BookTripModal';
import { VehicleCategory } from '../lib/fleetData';

interface BookingModalOptions {
  category?: VehicleCategory;
  vehicleId?: string;
}

interface BookingModalContextType {
  openBookingModal: (options?: BookingModalOptions) => void;
  closeBookingModal: () => void;
}

const BookingModalContext = createContext<BookingModalContextType>({
  openBookingModal: () => {},
  closeBookingModal: () => {},
});

export const useBookingModal = () => useContext(BookingModalContext);

export function BookingModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState<VehicleCategory>('tempo');
  const [vehicleId, setVehicleId] = useState<string | undefined>(undefined);

  const openBookingModal = (options?: BookingModalOptions) => {
    if (options?.category) setCategory(options.category);
    if (options?.vehicleId) setVehicleId(options.vehicleId);
    setIsOpen(true);
  };

  const closeBookingModal = () => {
    setIsOpen(false);
  };

  // Support global custom events for triggering anywhere: window.dispatchEvent(new CustomEvent('open-booking-modal', { detail: { category, vehicleId } }))
  useEffect(() => {
    const handler = (e: any) => {
      const detail = e.detail || {};
      openBookingModal(detail);
    };
    window.addEventListener('open-booking-modal', handler);
    return () => window.removeEventListener('open-booking-modal', handler);
  }, []);

  return (
    <BookingModalContext.Provider value={{ openBookingModal, closeBookingModal }}>
      {children}
      <BookTripModal
        isOpen={isOpen}
        onClose={closeBookingModal}
        initialCategory={category}
        initialVehicleId={vehicleId}
      />
    </BookingModalContext.Provider>
  );
}
