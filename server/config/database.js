const mongoose = require('mongoose');

/**
 * Connect to MongoDB database
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/worklogz';
    if (!process.env.MONGODB_URI) {
      console.warn('MONGODB_URI not set; falling back to local MongoDB at 127.0.0.1:27017/worklogz');
    }

    // Mongoose 7+ no longer requires legacy parser/topology flags.
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

/**
 * Disconnect from MongoDB database
 * @returns {Promise<void>}
 */
const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('MongoDB Disconnected');
  } catch (error) {
    console.error('MongoDB disconnection error:', error.message);
  }
};

module.exports = {
  connectDB,
  disconnectDB,
};

