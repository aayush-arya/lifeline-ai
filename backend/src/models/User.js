const mongoose = require('mongoose');

// _id is an explicit application-generated string (not Mongo's default
// ObjectId) so ids look and behave exactly the same whether a record came
// from Mongo or from the in-memory fallback store - no branching needed
// anywhere that just wants "the id".
const userSchema = new mongoose.Schema(
  {
    _id: { type: String },
    name: { type: String, required: true },
    email: { type: String, default: null, unique: true, sparse: true },
    phone: { type: String, default: null },
    passwordHash: { type: String, default: null },
    userType: { type: String, enum: ['patient', 'doctor', 'admin', 'guest'], default: 'patient' },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: false } }
);

module.exports = mongoose.model('User', userSchema);
