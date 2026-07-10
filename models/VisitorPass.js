const mongoose = require('mongoose');

const visitorPassSchema = new mongoose.Schema({
  visitor_name: { type: String, required: true },
  phone_number: { type: String, required: true },
  purpose:      { type: String, required: true },
  date:         { type: String, required: true },
  in_time:      { type: String },
  out_time:     { type: String },
  status:       { type: String, default: 'Pending', enum: ['Pending', 'Approved', 'Rejected'] },
  approved_by:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('VisitorPass', visitorPassSchema);
