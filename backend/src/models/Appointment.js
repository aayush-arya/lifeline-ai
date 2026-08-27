const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    _id: { type: String },
    patientId: { type: String, required: true, index: true },
    doctorId: { type: String, default: '' },
    hospitalId: { type: String },
    appointmentDate: { type: Date },
    reason: { type: String },
    status: { type: String, enum: ['scheduled', 'completed', 'cancelled'], default: 'scheduled' },
    notes: { type: String, default: '' },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: false } }
);

module.exports = mongoose.model('Appointment', appointmentSchema);
