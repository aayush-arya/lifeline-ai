// Dual-mode data access: every function here works identically whether
// MongoDB is connected or not. Controllers call this module and never touch
// mongoose models or the in-memory store directly, so the rest of the app
// doesn't need to know or care which one is active.
const { isMongoConnected } = require('../config/db');
const { mockData } = require('./store');
const { genId } = require('./ids');
const User = require('../models/User');
const Patient = require('../models/Patient');
const Vital = require('../models/Vital');
const Hospital = require('../models/Hospital');
const Appointment = require('../models/Appointment');

// User objects have historically used `.id`, not `._id`, throughout this
// codebase (see the in-memory seed data). Normalizing here means every
// other file can keep reading `user.id` regardless of the backing store.
function toUserPojo(doc) {
  if (!doc) return null;
  const obj = typeof doc.toObject === 'function' ? doc.toObject() : doc;
  return { ...obj, id: obj._id };
}

const users = {
  async findByEmail(email) {
    if (isMongoConnected()) return toUserPojo(await User.findOne({ email }).lean());
    return mockData.users.find((u) => u.email === email) || null;
  },
  async findById(id) {
    if (isMongoConnected()) return toUserPojo(await User.findById(id).lean());
    return mockData.users.find((u) => u.id === id) || null;
  },
  async create(data) {
    const id = data.id || genId('user');
    if (isMongoConnected()) {
      const doc = await User.create({ ...data, _id: id });
      return toUserPojo(doc);
    }
    const user = { ...data, id, createdAt: new Date() };
    mockData.users.push(user);
    return user;
  },
  async update(id, patch) {
    if (isMongoConnected()) return toUserPojo(await User.findByIdAndUpdate(id, patch, { new: true }).lean());
    const user = mockData.users.find((u) => u.id === id);
    if (user) Object.assign(user, patch);
    return user || null;
  },
};

const patients = {
  async findAll() {
    if (isMongoConnected()) return Patient.find().lean();
    return mockData.patients;
  },
  async findById(id) {
    if (isMongoConnected()) return Patient.findById(id).lean();
    return mockData.patients.find((p) => p._id === id) || null;
  },
  async findByUserId(userId) {
    if (isMongoConnected()) return Patient.findOne({ userId }).lean();
    return mockData.patients.find((p) => p.userId === userId) || null;
  },
  async create(data) {
    const _id = genId('patient');
    if (isMongoConnected()) return (await Patient.create({ ...data, _id })).toObject();
    const patient = { ...data, _id, createdAt: new Date() };
    mockData.patients.push(patient);
    return patient;
  },
};

const vitals = {
  async findByUserId(userId, limit = 10) {
    if (isMongoConnected()) return Vital.find({ userId }).sort({ recordedAt: -1 }).limit(limit).lean();
    return mockData.vitals
      .filter((v) => v.userId === userId)
      .sort((a, b) => new Date(b.recordedAt) - new Date(a.recordedAt))
      .slice(0, limit);
  },
  async findLatestByUserId(userId) {
    if (isMongoConnected()) return Vital.findOne({ userId }).sort({ recordedAt: -1 }).lean();
    return mockData.vitals
      .filter((v) => v.userId === userId)
      .sort((a, b) => new Date(b.recordedAt) - new Date(a.recordedAt))[0];
  },
  async create(data) {
    const _id = genId('vital');
    const recordedAt = new Date();
    if (isMongoConnected()) return (await Vital.create({ ...data, _id, recordedAt })).toObject();
    const vital = { ...data, _id, recordedAt };
    mockData.vitals.unshift(vital);
    return vital;
  },
};

const hospitals = {
  async findAll() {
    if (isMongoConnected()) return Hospital.find().lean();
    return mockData.hospitals;
  },
  async create(data) {
    const _id = genId('hospital');
    if (isMongoConnected()) return (await Hospital.create({ ...data, _id })).toObject();
    const hospital = { ...data, _id, createdAt: new Date() };
    mockData.hospitals.push(hospital);
    return hospital;
  },
  // Used only by the periodic bed-occupancy simulation in server.js, which
  // needs live documents (not .lean()) so it can mutate and .save() them.
  async findAllLive() {
    if (isMongoConnected()) return Hospital.find();
    return mockData.hospitals;
  },
};

const appointments = {
  async findByPatientId(patientId) {
    if (isMongoConnected()) return Appointment.find({ patientId }).lean();
    return mockData.appointments.filter((a) => a.patientId === patientId);
  },
  async create(data) {
    const _id = genId('apt');
    if (isMongoConnected()) return (await Appointment.create({ ...data, _id })).toObject();
    const appointment = { ...data, _id, createdAt: new Date() };
    mockData.appointments.push(appointment);
    return appointment;
  },
};

module.exports = { users, patients, vitals, hospitals, appointments };
