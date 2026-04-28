/**
 * config/database.js  –  MongoDB Connection (Mongoose)
 * Called once at startup. Returns a promise so server.js
 * can await it before starting the HTTP listener.
 */

const mongoose = require('mongoose');
const logger   = require('../utils/logger');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('MONGODB_URI is not defined in .env');
  }

  // Mongoose 7+ default: no need for deprecated options
  await mongoose.connect(uri);

  logger.info(`🗄️  MongoDB connected: ${mongoose.connection.host}`);

  // ── Connection event listeners ───────────────────────────────────────────
  mongoose.connection.on('error', (err) => {
    logger.error('MongoDB connection error:', err);
  });

  mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB disconnected – attempting to reconnect…');
  });
};

module.exports = connectDB;
