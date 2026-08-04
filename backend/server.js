const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Deterministic pseudo-random seed from a string (place_id), so a given
// hospital's simulated bed capacity stays stable across requests.
function seedFromString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return hash;
}

// Real-time bed occupancy isn't published by any public API (Google Maps
// included) - hospitals don't expose this outside internal systems. We seed
// a plausible capacity per hospital and let it drift over time so the UI
// has something live to show, rather than pretending it's sourced data.
const bedsCache = {};

function getOrSeedBeds(placeId, seedKey) {
  if (!bedsCache[placeId]) {
    const seed = seedFromString(seedKey || placeId);
    const beds = 80 + (seed % 520);
    const availableBeds = Math.max(1, Math.round(beds * (0.1 + (seed % 30) / 100)));
    bedsCache[placeId] = { beds, availableBeds };
  }
  return bedsCache[placeId];
}

function nudgeBeds(record) {
  const delta = Math.floor(Math.random() * 7) - 3;
  record.availableBeds = Math.max(0, Math.min(record.beds, record.availableBeds + delta));
}

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

// User Routes
app.put('/api/users/:id', (req, res) => {
  try {
    const user = mockData.users.find(u => u.id === req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    const { name, email } = req.body;
    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    res.json({ success: true, user: { id: user.id, name: user.name, email: user.email, userType: user.userType } });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
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

// Nearby Hospitals (real hospitals via Google Places when configured,
// mock data sorted by real distance otherwise). Bed counts are always a
// live simulation layered on top - see bedsCache comment above.
app.get('/api/hospitals/nearby', async (req, res) => {
  const lat = parseFloat(req.query.lat);
  const lng = parseFloat(req.query.lng);
  const hasLocation = !Number.isNaN(lat) && !Number.isNaN(lng);

  if (!GOOGLE_MAPS_API_KEY) {
    const hospitals = mockData.hospitals.map(h => ({
      ...h,
      distanceKm: hasLocation ? Math.round(haversineKm(lat, lng, h.latitude, h.longitude) * 10) / 10 : null,
    }));
    if (hasLocation) hospitals.sort((a, b) => a.distanceKm - b.distanceKm);
    return res.json({ success: true, source: 'mock', hospitals });
  }

  if (!hasLocation) {
    return res.status(400).json({ success: false, error: 'lat and lng query params are required' });
  }

  try {
    const { data } = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
      params: {
        location: `${lat},${lng}`,
        rankby: 'distance',
        type: 'hospital',
        key: GOOGLE_MAPS_API_KEY,
      },
    });

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      throw new Error(data.error_message || data.status);
    }

    const hospitals = (data.results || []).slice(0, 20).map(place => {
      const beds = getOrSeedBeds(place.place_id);
      return {
        _id: place.place_id,
        placeId: place.place_id,
        name: place.name,
        address: place.vicinity || '',
        phone: null,
        mapsUrl: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
        latitude: place.geometry?.location?.lat,
        longitude: place.geometry?.location?.lng,
        specialties: ['General Medicine'],
        emergencyAvailable: true,
        rating: place.rating || 4.0,
        beds: beds.beds,
        availableBeds: beds.availableBeds,
        distanceKm: Math.round(haversineKm(lat, lng, place.geometry?.location?.lat, place.geometry?.location?.lng) * 10) / 10,
      };
    });

    res.json({ success: true, source: 'google-places', hospitals });
  } catch (error) {
    console.error('Google Places request failed, falling back to mock hospitals:', error.message);
    const hospitals = mockData.hospitals.map(h => ({
      ...h,
      distanceKm: Math.round(haversineKm(lat, lng, h.latitude, h.longitude) * 10) / 10,
    })).sort((a, b) => a.distanceKm - b.distanceKm);
    res.json({ success: true, source: 'mock-fallback', error: error.message, hospitals });
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

setInterval(() => {
  mockData.hospitals.forEach(nudgeBeds);
  Object.values(bedsCache).forEach(nudgeBeds);
}, 15000);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ LifeLine AI Server running on http://localhost:${PORT}`);
  console.log(`📊 API ready at http://localhost:${PORT}/api`);
  console.log(`💾 Using in-memory database (mock data)`);
  console.log(`🏥 Pre-loaded ${mockData.hospitals.length} hospitals`);
  console.log(GOOGLE_MAPS_API_KEY ? '🗺️  Google Places nearby-hospital search enabled' : '🗺️  GOOGLE_MAPS_API_KEY not set - using mock hospitals for nearby search');
});
