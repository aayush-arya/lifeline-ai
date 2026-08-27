const express = require('express');
const cors = require('cors');
require('dotenv').config();

const apiRoutes = require('./src/routes');
const { mockData } = require('./src/data/store');
const { connectDB, isMongoConnected } = require('./src/config/db');
const { seedIfEmpty } = require('./src/data/seed');
const { nudgeBeds, bedsCache } = require('./src/services/bedSimulation');
const { GOOGLE_MAPS_API_KEY } = require('./src/services/googlePlaces');
const Hospital = require('./src/models/Hospital');

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
// See src/services/bedSimulation.js for why this is simulated rather than
// sourced. Reads/writes through Mongo when connected so it persists;
// mutates the in-memory records directly otherwise.
// unref() so this timer alone can't keep the process alive (e.g. in tests).
setInterval(async () => {
  if (isMongoConnected()) {
    const hospitals = await Hospital.find();
    await Promise.all(
      hospitals.map((h) => {
        nudgeBeds(h);
        return h.save();
      })
    );
  } else {
    mockData.hospitals.forEach(nudgeBeds);
  }
  Object.values(bedsCache).forEach(nudgeBeds);
}, 15000).unref();

const PORT = process.env.PORT || 5000;

// Fires immediately on require (not gated behind require.main) so tests that
// import `app` also get a deterministic point to await before making
// requests - see the `ready` export below. Deliberately NOT awaited before
// app.listen(): a slow or unreachable MONGODB_URI (e.g. a stale local .env)
// would otherwise delay every local `npm start` by several seconds. Until
// this resolves, requests are served from the in-memory store, then switch
// over automatically once connected.
const ready = connectDB()
  .then(async (connected) => {
    if (connected) await seedIfEmpty();
    console.log(connected ? '💾 Connected to MongoDB' : '💾 Using in-memory database (mock data)');
    return connected;
  })
  .catch((error) => {
    console.error('⚠️  MongoDB connection failed, falling back to in-memory store:', error.message);
    return false;
  });

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`✅ LifeLine AI Server running on http://localhost:${PORT}`);
    console.log(`📊 API ready at http://localhost:${PORT}/api`);
    console.log(
      GOOGLE_MAPS_API_KEY
        ? '🗺️  Google Places nearby-hospital search enabled'
        : '🗺️  GOOGLE_MAPS_API_KEY not set - using mock hospitals for nearby search'
    );
  });
}

module.exports = app;
module.exports.ready = ready;
