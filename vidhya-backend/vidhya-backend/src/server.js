/**
 * server.js  –  Vidhya Backend Entry Point
 * Boots Express, connects to MongoDB, and starts listening.
 */

require('dotenv').config();                   // Load .env variables first
const app        = require('./app');
const connectDB  = require('./config/database');
const logger     = require('./utils/logger');

const PORT = process.env.PORT || 5000;

// ── Connect to MongoDB, then start the HTTP server ──────────────────────────
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      logger.info(`✅  Vidhya server running on http://localhost:${PORT}`);
      logger.info(`📚  Environment : ${process.env.NODE_ENV}`);
    });
  } catch (err) {
    logger.error('❌  Failed to start server:', err);
    process.exit(1);                          // Exit so process manager can restart
  }
};

// ── Graceful shutdown ────────────────────────────────────────────────────────
process.on('SIGTERM', () => {
  logger.info('SIGTERM received – shutting down gracefully');
  process.exit(0);
});

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Rejection:', reason);
  process.exit(1);
});

startServer();
