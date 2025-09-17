const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    isVerified: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
    // permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Permission' }]
  });
  

  module.exports = mongoose.model('User', userSchema);
