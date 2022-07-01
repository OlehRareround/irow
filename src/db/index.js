require('dotenv').config();
const mongoose = require('mongoose');

async function connectDB() {
  try {
    await mongoose.connect(process.env.DB_CONFIG);
    console.log('DB connected');
  } catch (err) {
    console.error('Failed to connect to MongoDB.\n', err);
    process.exit(0);
  }
}

module.exports = { connectDB };
