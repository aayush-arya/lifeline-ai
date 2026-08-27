const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema(
  {
    _id: { type: String },
    name: { type: String, required: true },
    address: { type: String },
    phone: { type: String, default: null },
    email: { type: String },
    latitude: { type: Number },
    longitude: { type: Number },
    specialties: { type: [String], default: [] },
    emergencyAvailable: { type: Boolean, default: true },
    rating: { type: Number },
    beds: { type: Number, required: true },
    availableBeds: { type: Number, required: true },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: false } }
);

module.exports = mongoose.model('Hospital', hospitalSchema);
