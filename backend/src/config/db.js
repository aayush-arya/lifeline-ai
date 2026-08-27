const mongoose = require('mongoose');

// Same graceful-degradation philosophy as the Google Places integration:
// with MONGODB_URI set, everything persists in real MongoDB; without it,
// the app falls back to the in-memory store with zero config required.
async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) return false;

  // Fail fast rather than hanging on the driver's ~30s default when the URI
  // is unreachable (e.g. a stale local .env pointing at nothing).
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
  return true;
}

function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}

module.exports = { connectDB, isMongoConnected };
