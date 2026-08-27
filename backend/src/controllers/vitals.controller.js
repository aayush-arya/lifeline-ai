const repo = require('../data/repository');

async function create(req, res) {
  try {
    const vital = await repo.vitals.create({ ...req.body, userId: req.userId });
    res.json({ success: true, vital });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}

async function getByUserId(req, res) {
  try {
    const vitals = await repo.vitals.findByUserId(req.params.userId, 10);
    res.json({ success: true, vitals });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}

module.exports = { create, getByUserId };
