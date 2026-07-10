const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username:    { type: String, required: true, unique: true },
  password:    { type: String, required: true },
  name:        { type: String, required: true },
  role:        { type: String, required: true, enum: ['student', 'teacher', 'watchman', 'admin'] },
  roll_number: { type: String, unique: true, sparse: true },
  department:  { type: String },
  year:        { type: String },
  email:       { type: String, unique: true, sparse: true },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
