const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema(
  {
    _id: { type: String },
    userId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    age: { type: Number },
    gender: { type: String },
    medicalHistory: { type: [String], default: [] },
    allergies: { type: [String], default: [] },
    medications: { type: [String], default: [] },
    lastCheckup: { type: Date },
    nextAppointment: { type: Date },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: false } }
);

module.exports = mongoose.model('Patient', patientSchema);
