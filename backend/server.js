const express = require('express');
const path = require('path');
require('dotenv').config();
const mongoConnect = require('./config/db');
const { connectRedis } = require('./config/redis');
const { initializeStorage } = require('./config/storage');
const cookieParser = require('cookie-parser');
const cors = require('cors');

// Import routes
const authRoutes = require('./routes/auth');
const boardRoutes = require('./routes/boards');
const taskRoutes = require('./routes/tasks');
const fileRoutes = require('./routes/files');
const systemRoutes = require('./routes/system');

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

// File serving routes (MinIO)
app.use('/api/files', fileRoutes);

// Connect to services
mongoConnect();
connectRedis();
initializeStorage();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/boards', boardRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/files', fileRoutes);
app.use('/api', systemRoutes);

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`Metrics: http://localhost:${PORT}/api/metrics`);
});