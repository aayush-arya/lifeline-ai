const repo = require('../data/repository');

async function getAll(req, res) {
  try {
    const patients = await repo.patients.findAll();
    res.json({ success: true, patients });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}

async function create(req, res) {
  try {
    const patient = await repo.patients.create(req.body);
    res.json({ success: true, patient });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}

async function getById(req, res) {
  try {
    const patient = await repo.patients.findById(req.params.id);
    res.json({ success: true, patient });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}

module.exports = { getAll, create, getById };
