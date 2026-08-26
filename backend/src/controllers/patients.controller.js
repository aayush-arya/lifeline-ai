const { mockData, nextId } = require('../data/store');

function getAll(req, res) {
  try {
    res.json({ success: true, patients: mockData.patients });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}

function create(req, res) {
  try {
    const patient = {
      _id: 'patient-' + nextId.patients++,
      ...req.body,
      createdAt: new Date(),
    };
    mockData.patients.push(patient);
    res.json({ success: true, patient });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}

function getById(req, res) {
  try {
    const patient = mockData.patients.find((p) => p._id === req.params.id);
    res.json({ success: true, patient });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}

module.exports = { getAll, create, getById };
