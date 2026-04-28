/**
 * utils/logger.js  –  Winston Logger
 *
 * Levels used in this project:
 *   error  – unhandled exceptions, DB failures
 *   warn   – deprecations, disconnects
 *   info   – server start, route registration
 *   http   – HTTP request log (Morgan pipe)
 *   debug  – verbose dev-only output
 *
 * In production, only 'info' and above are written.
 * In development, 'debug' and above are shown in the console.
 */

const winston = require('winston');
const path    = require('path');
const fs      = require('fs');

// Ensure the logs directory exists
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });

// ── Pretty format for console output ────────────────────────────────────────
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message }) => {
    return `[${timestamp}] ${level}: ${message}`;
  })
);

// ── Structured JSON format for log files ─────────────────────────────────────
const fileFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',

  transports: [
    // Console – always on
    new winston.transports.Console({ format: consoleFormat }),

    // File – combined log (all levels)
    new winston.transports.File({
      filename : path.join(logsDir, 'combined.log'),
      format   : fileFormat,
      maxsize  : 5 * 1024 * 1024,    // 5 MB per file
      maxFiles : 5,
    }),

    // File – errors only
    new winston.transports.File({
      filename : path.join(logsDir, 'error.log'),
      level    : 'error',
      format   : fileFormat,
      maxsize  : 5 * 1024 * 1024,
      maxFiles : 3,
    }),
  ],
});

module.exports = logger;
