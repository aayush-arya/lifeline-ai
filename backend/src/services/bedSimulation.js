// Real-time bed occupancy isn't published by any public API (Google Maps
// included) - hospitals don't expose this outside internal systems. We seed
// a plausible capacity per hospital and let it drift over time so the UI
// has something live to show, rather than pretending it's sourced data.

const bedsCache = {};

function seedFromString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return hash;
}

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

module.exports = { bedsCache, getOrSeedBeds, nudgeBeds };
