const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// In-Memory Database
const mockData = {
  users: [
    {
      id: 'guest-' + Date.now(),
      name: 'Guest',
      email: null,
      userType: 'guest',
      createdAt: new Date()
    }
  ],
  patients: [
    {
      _id: '1',
      userId: 'user-1',
      name: 'John Doe',
      age: 45,
      gender: 'Male',
      medicalHistory: ['Hypertension', 'Type 2 Diabetes'],
      allergies: ['Penicillin'],
      medications: ['Lisinopril', 'Metformin'],
      lastCheckup: new Date('2024-06-10'),
      nextAppointment: new Date('2024-07-15')
    }
  ],
  vitals: [
    {
      _id: '1',
      userId: 'guest-demo',
      heartRate: 72,
      bloodPressure: '120/80',
      temperature: 98.6,
      oxygenLevel: 98,
      weight: 75,
      height: 180,
      bloodGlucose: 95,
      recordedAt: new Date()
    }
  ],
  hospitals: [
    {
      _id: '1',
      name: 'City General Hospital',
      address: '123 Health St, City Center',
      phone: '+1-800-123-4567',
      email: 'info@cityhospital.com',
      latitude: 40.7128,
      longitude: -74.0060,
      specialties: ['Emergency', 'Cardiology', 'Neurology'],
      emergencyAvailable: true,
      rating: 4.8,
      beds: 500,
      availableBeds: 45,
      createdAt: new Date()
    },
    {
      _id: '2',
      name: 'St. Mary Medical Center',
      address: '456 Medical Ave, Downtown',
      phone: '+1-800-234-5678',
      email: 'info@stmary.com',
      latitude: 40.7580,
      longitude: -73.9855,
      specialties: ['Oncology', 'Pediatrics', 'Orthopedics'],
      emergencyAvailable: true,
      rating: 4.7,
      beds: 350,
      availableBeds: 28,
      createdAt: new Date()
    },
    {
      _id: '3',
      name: 'Healthcare Plus',
      address: '789 Wellness Blvd, West Side',
      phone: '+1-800-345-6789',
      email: 'info@healthcareplus.com',
      latitude: 40.7489,
      longitude: -73.9680,
      specialties: ['General Practice', 'Dermatology', 'ENT'],
      emergencyAvailable: true,
      rating: 4.6,
      beds: 200,
      availableBeds: 12,
      createdAt: new Date()
    }
  ],
  appointments: []
};

let nextId = {
  users: 2,
  patients: 2,
  vitals: 2,
  hospitals: 4,
  appointments: 1
};

// Routes

// Root Route
app.get('/', (req, res) => {
  res.json({
    message: 'LifeLine AI Backend API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      hospitals: '/api/hospitals',
      patients: '/api/patients',
      vitals: '/api/vitals/:userId',
      appointments: '/api/appointments/:userId',
      auth: '/api/auth/*'
    }
  });
});

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

// Auth Routes
app.post('/api/auth/register', (req, res) => {
  try {
    const { name, email, phone, password, userType } = req.body;
    const user = {
      id: 'user-' + nextId.users++,
      name,
      email,
      phone,
      password,
      userType: userType || 'patient',
      createdAt: new Date()
    };
    mockData.users.push(user);
    res.json({ success: true, user: { id: user.id, name, email } });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    const user = mockData.users.find(u => u.email === email);
    if (!user || user.password !== password) {
      return res.status(400).json({ success: false, error: 'Invalid credentials' });
    }
    res.json({ success: true, user: { id: user.id, name: user.name, email, userType: user.userType } });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.post('/api/auth/guest', (req, res) => {
  const guestId = 'guest-' + Date.now();
  const guest = {
    id: guestId,
    name: 'Guest',
    email: null,
    userType: 'guest',
    createdAt: new Date()
  };
  mockData.users.push(guest);
  res.json({ success: true, user: guest });
});

// Patient Routes
app.get('/api/patients', (req, res) => {
  try {
    res.json({ success: true, patients: mockData.patients });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.post('/api/patients', (req, res) => {
  try {
    const patient = {
      _id: 'patient-' + nextId.patients++,
      ...req.body,
      createdAt: new Date()
    };
    mockData.patients.push(patient);
    res.json({ success: true, patient });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.get('/api/patients/:id', (req, res) => {
  try {
    const patient = mockData.patients.find(p => p._id === req.params.id);
    res.json({ success: true, patient });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Vitals Routes
app.post('/api/vitals', (req, res) => {
  try {
    const vital = {
      _id: 'vital-' + nextId.vitals++,
      ...req.body,
      recordedAt: new Date()
    };
    mockData.vitals.unshift(vital);
    res.json({ success: true, vital });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.get('/api/vitals/:userId', (req, res) => {
  try {
    const vitals = mockData.vitals
      .filter(v => v.userId === req.params.userId)
      .sort((a, b) => new Date(b.recordedAt) - new Date(a.recordedAt))
      .slice(0, 10);
    res.json({ success: true, vitals });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Hospital Routes
app.get('/api/hospitals', (req, res) => {
  try {
    res.json({ success: true, hospitals: mockData.hospitals });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.post('/api/hospitals', (req, res) => {
  try {
    const hospital = {
      _id: 'hospital-' + nextId.hospitals++,
      ...req.body,
      createdAt: new Date()
    };
    mockData.hospitals.push(hospital);
    res.json({ success: true, hospital });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Appointments Routes
app.post('/api/appointments', (req, res) => {
  try {
    const appointment = {
      _id: 'apt-' + nextId.appointments++,
      ...req.body,
      createdAt: new Date()
    };
    mockData.appointments.push(appointment);
    res.json({ success: true, appointment });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.get('/api/appointments/:userId', (req, res) => {
  try {
    const appointments = mockData.appointments.filter(a => a.patientId === req.params.userId);
    res.json({ success: true, appointments });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Dashboard Route
app.get('/api/dashboard/:userId', (req, res) => {
  try {
    const vitals = mockData.vitals
      .filter(v => v.userId === req.params.userId)
      .sort((a, b) => new Date(b.recordedAt) - new Date(a.recordedAt))[0];
    const appointments = mockData.appointments.filter(a => a.patientId === req.params.userId);
    const patient = mockData.patients.find(p => p.userId === req.params.userId);

    res.json({
      success: true,
      data: {
        latestVitals: vitals,
        appointments,
        patient
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ LifeLine AI Server running on http://localhost:${PORT}`);
  console.log(`📊 API ready at http://localhost:${PORT}/api`);
  console.log(`💾 Using in-memory database (mock data)`);
  console.log(`🏥 Pre-loaded ${mockData.hospitals.length} hospitals`);
});
