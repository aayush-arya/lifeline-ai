const { verifyToken } = require('../services/auth');

// Verifies the bearer token and attaches the caller's identity to the
// request. Route handlers that also take a :userId/:id param should check
// it against req.userId so a valid token for one account can't be used to
// read or write another account's data.
function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ success: false, error: 'Missing or invalid Authorization header' });
  }

  try {
    const payload = verifyToken(token);
    req.userId = payload.sub;
    req.userType = payload.userType;
    next();
  } catch (error) {
    res.status(401).json({ success: false, error: 'Invalid or expired token' });
  }
}

// Blocks a request where the URL's :userId/:id doesn't match the
// authenticated caller. Mount after requireAuth.
function requireOwnUser(paramName) {
  return (req, res, next) => {
    if (req.params[paramName] !== req.userId) {
      return res.status(403).json({ success: false, error: 'Cannot access another user\'s data' });
    }
    next();
  };
}

module.exports = { requireAuth, requireOwnUser };
