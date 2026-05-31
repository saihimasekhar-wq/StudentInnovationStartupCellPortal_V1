const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/student_startup_portal';
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2000 // 2 seconds timeout for connection
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    global.isMockDB = false;
  } catch (error) {
    console.warn(`\n⚠️  Database Connection Error: ${error.message}`);
    console.warn(`⚠️  Falling back to local in-memory simulation database for seamless testing!\n`);
    global.isMockDB = true;
  }
};

module.exports = connectDB;
