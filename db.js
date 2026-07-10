const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      family: 4, // Force IPv4
    });
    console.log('MongoDB connected successfully!');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    console.error('Make sure MongoDB Atlas is reachable and IP is whitelisted.');
    // Don't exit — let server stay up so you can debug
  }
};

module.exports = connectDB;
