// In-memory data store. Zero-config by design: the app runs immediately
// with no database to set up. Every entity shape here (User, Vital,
// Hospital, Appointment, Patient) is a plain object, so swapping this
// module for a real database later is a matter of giving each collection
// a persistent-store implementation with the same method shapes.

const mockData = {
  users: [
    {
      id: 'guest-' + Date.now(),
      name: 'Guest',
      email: null,
      userType: 'guest',
      createdAt: new Date(),
    },
    {
      // Seeded so the "Sign In" form has a real account to demo without
      // requiring a registration flow. Password: demo1234
      id: 'user-demo',
      name: 'Demo Patient',
      email: 'demo@lifeline.ai',
      phone: null,
      passwordHash: '$2b$10$XqA5JiMxbKA4TFNfD55AhO5Bl/rw21wXWDBa3zRQzb4qyixDqfBye',
      userType: 'patient',
      createdAt: new Date(),
    },
  ],
  patients: [
    {
      _id: '1',
      userId: 'user-demo',
      name: 'Demo Patient',
      age: 45,
      gender: 'Male',
      medicalHistory: ['Hypertension', 'Type 2 Diabetes'],
      allergies: ['Penicillin'],
      medications: ['Lisinopril', 'Metformin'],
      lastCheckup: new Date('2024-06-10'),
      nextAppointment: new Date('2024-07-15'),
    },
  ],
  vitals: [
    {
      _id: '1',
      userId: 'user-demo',
      heartRate: 72,
      bloodPressure: '120/80',
      temperature: 98.6,
      oxygenLevel: 98,
      weight: 75,
      height: 180,
      bloodGlucose: 95,
      recordedAt: new Date(),
    },
  ],
  hospitals: [
    {
      _id: '1',
      name: 'City General Hospital',
      address: '123 Health St, City Center',
      phone: '+1-800-123-4567',
      email: 'info@cityhospital.com',
      latitude: 40.7128,
      longitude: -74.006,
      specialties: ['Emergency', 'Cardiology', 'Neurology'],
      emergencyAvailable: true,
      rating: 4.8,
      beds: 500,
      availableBeds: 45,
      createdAt: new Date(),
    },
    {
      _id: '2',
      name: 'St. Mary Medical Center',
      address: '456 Medical Ave, Downtown',
      phone: '+1-800-234-5678',
      email: 'info@stmary.com',
      latitude: 40.758,
      longitude: -73.9855,
      specialties: ['Oncology', 'Pediatrics', 'Orthopedics'],
      emergencyAvailable: true,
      rating: 4.7,
      beds: 350,
      availableBeds: 28,
      createdAt: new Date(),
    },
    {
      _id: '3',
      name: 'Healthcare Plus',
      address: '789 Wellness Blvd, West Side',
      phone: '+1-800-345-6789',
      email: 'info@healthcareplus.com',
      latitude: 40.7489,
      longitude: -73.968,
      specialties: ['General Practice', 'Dermatology', 'ENT'],
      emergencyAvailable: true,
      rating: 4.6,
      beds: 200,
      availableBeds: 12,
      createdAt: new Date(),
    },
  ],
  appointments: [],
};

const nextId = {
  users: 2,
  patients: 2,
  vitals: 2,
  hospitals: 4,
  appointments: 1,
};

module.exports = { mockData, nextId };
