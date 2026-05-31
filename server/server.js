require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const startupRoutes = require('./routes/startupRoutes');
const proposalRoutes = require('./routes/proposalRoutes');
const incubationRoutes = require('./routes/incubationRoutes');
const progressRoutes = require('./routes/progressRoutes');
const storyRoutes = require('./routes/storyRoutes');
const publicRoutes = require('./routes/publicRoutes');
const searchRoutes = require('./routes/searchRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Initialize database connection and seed admin
const seedAdmin = async () => {
  try {
    const Admin = require('./models/Admin');
    const adminExists = await Admin.findOne({ email: 'admin@startupcell.edu' });
    if (!adminExists) {
      await Admin.create({
        name: 'College Startup Cell Admin',
        email: 'admin@startupcell.edu',
        password: 'Admin@123', // Pre-save schema hook hashes this
        role: 'admin',
      });
      console.log('College Admin Account Seeded: admin@startupcell.edu / Admin@123');
    }
  } catch (error) {
    console.error('Failed to seed default admin:', error.message);
  }
};

connectDB().then(() => {
  if (!global.isMockDB) {
    seedAdmin();
  }
});

const app = express();

// Middlewares
app.use(cors({
  origin: '*', // Allow connections from any origin for this portal version
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Serve static uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Main Root API Status Route
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Student Innovation & Startup Cell Portal API is online.'
  });
});

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/startups', startupRoutes);
app.use('/api/proposals', proposalRoutes);
app.use('/api/incubations', incubationRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/admin', adminRoutes);

// 404 Not Found Middleware
app.use((req, res, next) => {
  res.status(404).json({ message: `Route not found - ${req.originalUrl}` });
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  console.error('API Error:', err.message);
  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// Configure server port
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections gracefully
process.on('unhandledRejection', (err, promise) => {
  console.error(`Unhandled Rejection Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
