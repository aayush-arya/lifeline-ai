const { mockData, nextId } = require('../data/store');

function create(req, res) {
  try {
    const vital = {
      _id: 'vital-' + nextId.vitals++,
      ...req.body,
      userId: req.userId,
      recordedAt: new Date(),
    };
    mockData.vitals.unshift(vital);
    res.json({ success: true, vital });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}

function getByUserId(req, res) {
  try {
    const vitals = mockData.vitals
      .filter((v) => v.userId === req.params.userId)
      .sort((a, b) => new Date(b.recordedAt) - new Date(a.recordedAt))
      .slice(0, 10);
    res.json({ success: true, vitals });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}

module.exports = { create, getByUserId };
