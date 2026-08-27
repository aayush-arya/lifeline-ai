const repo = require('../data/repository');

async function create(req, res) {
  try {
    const appointment = await repo.appointments.create({ ...req.body, patientId: req.userId });
    res.json({ success: true, appointment });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}

async function getByUserId(req, res) {
  try {
    const appointments = await repo.appointments.findByPatientId(req.params.userId);
    res.json({ success: true, appointments });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}

module.exports = { create, getByUserId };
