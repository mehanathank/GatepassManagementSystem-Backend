const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    if (user.password !== password) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    res.json({ success: true, message: 'Login successful', user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Register
router.post('/register', async (req, res) => {
  let { username, password, name, role, roll_number, department, year, email } = req.body;
  if (role && role.toLowerCase() === 'admin')
    return res.status(403).json({ success: false, message: 'Admin role can only be created directly in the database' });
  try {
    const user = new User({
      username, password, name,
      role: role.toLowerCase(),
      roll_number: roll_number || undefined,
      department, year,
      email: email || undefined,
    });
    await user.save();
    res.status(201).json({ success: true, user });
  } catch (err) {
    if (err.code === 11000) {
      const field = err.message.includes('username') ? 'Username'
        : err.message.includes('roll_number') ? 'Roll Number' : 'Email';
      return res.status(400).json({ success: false, message: `${field} already exists` });
    }
    res.status(500).json({ success: false, message: 'Server error: ' + err.message });
  }
});

module.exports = router;
