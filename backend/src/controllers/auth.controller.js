const repo = require('../data/repository');
const { hashPassword, comparePassword, issueToken } = require('../services/auth');

async function register(req, res) {
  try {
    const { name, email, phone, password, userType } = req.body;
    const passwordHash = await hashPassword(password);
    const user = await repo.users.create({ name, email, phone, passwordHash, userType: userType || 'patient' });
    const token = issueToken(user);
    res.json({ success: true, user: { id: user.id, name, email, userType: user.userType }, token });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await repo.users.findByEmail(email);
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

async function loginAsGuest(req, res) {
  try {
    const guest = await repo.users.create({
      id: 'guest-' + Date.now(),
      name: 'Guest',
      email: null,
      userType: 'guest',
    });
    const token = issueToken(guest);
    res.json({ success: true, user: guest, token });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}

module.exports = { register, login, loginAsGuest };
