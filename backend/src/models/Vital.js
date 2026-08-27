const mongoose = require('mongoose');

const vitalSchema = new mongoose.Schema(
  {
    _id: { type: String },
    userId: { type: String, required: true, index: true },
    heartRate: { type: Number },
    bloodPressure: { type: String },
    temperature: { type: Number },
    oxygenLevel: { type: Number },
    weight: { type: Number },
    height: { type: Number },
    bloodGlucose: { type: Number },
    recordedAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

module.exports = mongoose.model('Vital', vitalSchema);
