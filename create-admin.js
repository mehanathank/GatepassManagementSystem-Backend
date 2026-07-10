const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB Atlas');

    const existing = await User.findOne({ username: 'admin' });
    if (existing) {
      console.log('Admin already exists');
      process.exit();
    }

    await User.create({
      username: 'admin',
      password: 'admin123',
      name: 'System Admin',
      role: 'admin',
    });

    console.log('Admin created successfully');
    console.log('Username: admin');
    console.log('Password: admin123');
    process.exit();
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
};

seed();
