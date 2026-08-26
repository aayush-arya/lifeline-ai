import { useOutletContext } from 'react-router-dom';
import type { User, Hospital, Vital, Appointment } from '../types';

export interface NewVitalForm {
  heartRate: string;
  bloodPressure: string;
  temperature: string;
  oxygenLevel: string;
}

export interface BookingForm {
  hospitalId: string;
  reason: string;
  date: string;
}

export interface AppContext {
  user: User;
  hospitals: Hospital[];
  hospitalsSource: string;
  locationDenied: boolean;
  onRetryLocation: () => void;
  vitals: Vital[];
  newVital: NewVitalForm;
  setNewVital: (v: NewVitalForm) => void;
  onAddVital: (e: React.FormEvent) => void;
  appointments: Appointment[];
  showBookingModal: boolean;
  setShowBookingModal: (v: boolean) => void;
  bookingForm: BookingForm;
  setBookingForm: (v: BookingForm) => void;
  onBookAppointment: (e: React.FormEvent) => void;
  onOpenBooking: () => void;
  onSaveProfile: (data: { name: string; email: string }) => Promise<void>;
  onSOSClick: () => void;
  onRecordVitals: () => void;
  onFindHospital: () => void;
}

export function useAppContext() {
  return useOutletContext<AppContext>();
}
