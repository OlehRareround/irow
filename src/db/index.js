const mongoose = require('mongoose');

async function connectDB(db_config) {
  try {
    await mongoose.connect(db_config);
    console.log('DB connected');
  } catch (err) {
    console.error('Failed to connect to MongoDB.\n', err);
    process.exit(0);
  }
}

module.exports = { connectDB };
