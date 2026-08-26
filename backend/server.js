const express = require('express');
const cors = require('cors');
require('dotenv').config();

const apiRoutes = require('./src/routes');
const { mockData } = require('./src/data/store');
const { nudgeBeds, bedsCache } = require('./src/services/bedSimulation');
const { GOOGLE_MAPS_API_KEY } = require('./src/services/googlePlaces');

const app = express();

app.use(cors());
app.use(express.json());

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
      auth: '/api/auth/*',
    },
  });
});

app.use('/api', apiRoutes);

// Simulate live bed-occupancy drift so the UI has something to poll.
// See src/services/bedSimulation.js for why this is simulated rather than sourced.
// unref() so this timer alone can't keep the process alive (e.g. in tests).
setInterval(() => {
  mockData.hospitals.forEach(nudgeBeds);
  Object.values(bedsCache).forEach(nudgeBeds);
}, 15000).unref();

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`✅ LifeLine AI Server running on http://localhost:${PORT}`);
    console.log(`📊 API ready at http://localhost:${PORT}/api`);
    console.log(`💾 Using in-memory database (mock data)`);
    console.log(`🏥 Pre-loaded ${mockData.hospitals.length} hospitals`);
    console.log(
      GOOGLE_MAPS_API_KEY
        ? '🗺️  Google Places nearby-hospital search enabled'
        : '🗺️  GOOGLE_MAPS_API_KEY not set - using mock hospitals for nearby search'
    );
  });
}

module.exports = app;
