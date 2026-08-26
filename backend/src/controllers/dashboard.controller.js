const { mockData } = require('../data/store');

function getDashboard(req, res) {
  try {
    const vitals = mockData.vitals
      .filter((v) => v.userId === req.params.userId)
      .sort((a, b) => new Date(b.recordedAt) - new Date(a.recordedAt))[0];
    const appointments = mockData.appointments.filter((a) => a.patientId === req.params.userId);
    const patient = mockData.patients.find((p) => p.userId === req.params.userId);

    res.json({
      success: true,
      data: {
        latestVitals: vitals,
        appointments,
        patient,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}

module.exports = { getDashboard };
