const axios = require('axios');
const { haversineKm } = require('./geo');
const { getOrSeedBeds } = require('./bedSimulation');

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

async function fetchNearbyHospitals(lat, lng) {
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

  return (data.results || []).slice(0, 20).map((place) => {
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
}

module.exports = { GOOGLE_MAPS_API_KEY, fetchNearbyHospitals };
