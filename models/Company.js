const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name:        { type: String, required: true },
  description: { type: String },
  logo:        { type: String },
  website:     { type: String },
  email:       { type: String },
  phone:       { type: String },
  address:     { type: String },
  isActive:    { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Company', companySchema);
