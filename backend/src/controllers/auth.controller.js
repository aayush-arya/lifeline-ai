const { mockData, nextId } = require('../data/store');
const { hashPassword, comparePassword, issueToken } = require('../services/auth');

async function register(req, res) {
  try {
    const { name, email, phone, password, userType } = req.body;
    const passwordHash = await hashPassword(password);
    const user = {
      id: 'user-' + nextId.users++,
      name,
      email,
      phone,
      passwordHash,
      userType: userType || 'patient',
      createdAt: new Date(),
    };
    mockData.users.push(user);
    const token = issueToken(user);
    res.json({ success: true, user: { id: user.id, name, email, userType: user.userType }, token });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = mockData.users.find((u) => u.email === email);
    const matches = user?.passwordHash ? await comparePassword(password, user.passwordHash) : false;
    if (!user || !matches) {
      return res.status(400).json({ success: false, error: 'Invalid credentials' });
    }
    const token = issueToken(user);
    res.json({ success: true, user: { id: user.id, name: user.name, email, userType: user.userType }, token });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}

function loginAsGuest(req, res) {
  const guestId = 'guest-' + Date.now();
  const guest = {
    id: guestId,
    name: 'Guest',
    email: null,
    userType: 'guest',
    createdAt: new Date(),
  };
  mockData.users.push(guest);
  const token = issueToken(guest);
  res.json({ success: true, user: guest, token });
}

module.exports = { register, login, loginAsGuest };
