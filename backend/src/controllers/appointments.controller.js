const { mockData, nextId } = require('../data/store');

function create(req, res) {
  try {
    const appointment = {
      _id: 'apt-' + nextId.appointments++,
      ...req.body,
      patientId: req.userId,
      createdAt: new Date(),
    };
    mockData.appointments.push(appointment);
    res.json({ success: true, appointment });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}

function getByUserId(req, res) {
  try {
    const appointments = mockData.appointments.filter((a) => a.patientId === req.params.userId);
    res.json({ success: true, appointments });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}

module.exports = { create, getByUserId };
