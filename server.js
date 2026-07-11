const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./db');

const userRoutes = require('./routes/userRoutes');
const gatepassRoutes = require('./routes/gatepassRoutes');
const visitorRoutes = require('./routes/visitorRoutes');

const app = express();

connectDB();

const allowedOrigins = [
  'https://gatepass-management-system-two.vercel.app',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  ...(process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : []),
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/gatepass', gatepassRoutes);
app.use('/api/visitor', visitorRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
