export interface User {
  id: string;
  name: string;
  email?: string;
  userType: 'patient' | 'doctor' | 'admin' | 'guest';
}

export interface Patient {
  _id: string;
  userId: string;
  name: string;
  age: number;
  gender: string;
  medicalHistory: string[];
  allergies: string[];
  medications: string[];
  lastCheckup: Date;
  nextAppointment: Date;
}

export interface Vital {
  _id: string;
  userId: string;
  heartRate: number;
  bloodPressure: string;
  temperature: number;
  oxygenLevel: number;
  weight: number;
  height: number;
  bloodGlucose: number;
  recordedAt: Date;
}

export interface Hospital {
  _id: string;
  name: string;
  address: string;
  phone: string | null;
  email?: string;
  latitude: number;
  longitude: number;
  specialties: string[];
  emergencyAvailable: boolean;
  rating: number;
  beds: number;
  availableBeds: number;
  distanceKm?: number | null;
  mapsUrl?: string;
  placeId?: string;
}

export interface Appointment {
  _id: string;
  patientId: string;
  doctorId: string;
  hospitalId: string;
  appointmentDate: Date;
  reason: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes: string;
}
