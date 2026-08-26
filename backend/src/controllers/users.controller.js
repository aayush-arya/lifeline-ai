const { mockData } = require('../data/store');

function update(req, res) {
  try {
    const user = mockData.users.find((u) => u.id === req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    const { name, email } = req.body;
    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    res.json({ success: true, user: { id: user.id, name: user.name, email: user.email, userType: user.userType } });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}

module.exports = { update };
