const repo = require('../data/repository');

async function update(req, res) {
  try {
    const existing = await repo.users.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    const { name, email } = req.body;
    const patch = {};
    if (name !== undefined) patch.name = name;
    if (email !== undefined) patch.email = email;
    const user = await repo.users.update(req.params.id, patch);
    res.json({ success: true, user: { id: user.id, name: user.name, email: user.email, userType: user.userType } });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}

module.exports = { update };
