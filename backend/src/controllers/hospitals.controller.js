const repo = require('../data/repository');
const { haversineKm } = require('../services/geo');
const { GOOGLE_MAPS_API_KEY, fetchNearbyHospitals } = require('../services/googlePlaces');

async function getAll(req, res) {
  try {
    const hospitals = await repo.hospitals.findAll();
    res.json({ success: true, hospitals });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}

// Real hospitals via Google Places when configured, mock/stored data sorted
// by real distance otherwise. Bed counts are always a live simulation
// layered on top - see services/bedSimulation.js.
async function getNearby(req, res) {
  const lat = parseFloat(req.query.lat);
  const lng = parseFloat(req.query.lng);
  const hasLocation = !Number.isNaN(lat) && !Number.isNaN(lng);

  if (!GOOGLE_MAPS_API_KEY) {
    const stored = await repo.hospitals.findAll();
    const hospitals = stored.map((h) => ({
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
    const hospitals = await fetchNearbyHospitals(lat, lng);
    res.json({ success: true, source: 'google-places', hospitals });
  } catch (error) {
    console.error('Google Places request failed, falling back to stored hospitals:', error.message);
    const stored = await repo.hospitals.findAll();
    const hospitals = stored
      .map((h) => ({
        ...h,
        distanceKm: Math.round(haversineKm(lat, lng, h.latitude, h.longitude) * 10) / 10,
      }))
      .sort((a, b) => a.distanceKm - b.distanceKm);
    res.json({ success: true, source: 'mock-fallback', error: error.message, hospitals });
  }
}

async function create(req, res) {
  try {
    const hospital = await repo.hospitals.create(req.body);
    res.json({ success: true, hospital });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}

module.exports = { getAll, getNearby, create };
