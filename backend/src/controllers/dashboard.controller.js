const repo = require('../data/repository');

async function getDashboard(req, res) {
  try {
    const [latestVitals, appointments, patient] = await Promise.all([
      repo.vitals.findLatestByUserId(req.params.userId),
      repo.appointments.findByPatientId(req.params.userId),
      repo.patients.findByUserId(req.params.userId),
    ]);

    res.json({
      success: true,
      data: { latestVitals, appointments, patient },
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}

module.exports = { getDashboard };
