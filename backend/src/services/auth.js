const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// A dev fallback keeps the app runnable with zero config, same philosophy
// as the Google Places and in-memory-store fallbacks elsewhere in this
// backend. Anything beyond local development should set a real secret.
const JWT_SECRET = process.env.JWT_SECRET || 'lifeline-dev-secret-do-not-use-in-production';
const TOKEN_TTL = '7d';

if (!process.env.JWT_SECRET) {
  console.warn('⚠️  JWT_SECRET not set - using an insecure development default. Set JWT_SECRET before deploying.');
}

function hashPassword(plain) {
  return bcrypt.hash(plain, 10);
}

function comparePassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}

function issueToken(user) {
  return jwt.sign({ sub: user.id, userType: user.userType }, JWT_SECRET, { expiresIn: TOKEN_TTL });
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

module.exports = { hashPassword, comparePassword, issueToken, verifyToken };
