// Seeds MongoDB from the same seed data the in-memory store uses, so the
// demo account and demo hospitals exist either way. Only runs against empty
// collections, so it's safe to call on every boot.
const { mockData } = require('./store');
const User = require('../models/User');
const Patient = require('../models/Patient');
const Vital = require('../models/Vital');
const Hospital = require('../models/Hospital');

async function seedIfEmpty() {
  if ((await User.estimatedDocumentCount()) === 0) {
    await User.insertMany(mockData.users.map((u) => ({ ...u, _id: u.id })));
  }
  if ((await Hospital.estimatedDocumentCount()) === 0) {
    await Hospital.insertMany(mockData.hospitals);
  }
  if ((await Patient.estimatedDocumentCount()) === 0) {
    await Patient.insertMany(mockData.patients);
  }
  if ((await Vital.estimatedDocumentCount()) === 0) {
    await Vital.insertMany(mockData.vitals);
  }
}

module.exports = { seedIfEmpty };
