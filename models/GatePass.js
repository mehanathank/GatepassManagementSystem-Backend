const mongoose = require('mongoose');

const gatePassSchema = new mongoose.Schema({
  student_id:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reason:      { type: String, required: true },
  out_time:    { type: String },
  status:      { type: String, default: 'Pending', enum: ['Pending', 'Approved', 'Rejected', 'Used'] },
  approved_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('GatePass', gatePassSchema);
