/**
 * middleware/errorHandler.js  –  Global Express Error Handler
 *
 * Catches all errors passed via next(err) and returns a
 * consistent JSON error envelope. Never leaks stack traces
 * in production.
 */

const logger = require('../utils/logger');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  // Default values
  let statusCode = err.statusCode || 500;
  let message    = err.message    || 'Internal Server Error';

  // ── Mongoose: duplicate key (e.g. duplicate email) ──────────────────────
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    statusCode = 409;
    message    = `A record with that ${field} already exists.`;
  }

  // ── Mongoose: validation error ───────────────────────────────────────────
  if (err.name === 'ValidationError') {
    statusCode = 422;
    const errors = Object.values(err.errors).map(e => ({
      field  : e.path,
      message: e.message,
    }));
    return res.status(statusCode).json({ success: false, message: 'Validation failed.', errors });
  }

  // ── Mongoose: invalid ObjectId ───────────────────────────────────────────
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 400;
    message    = 'Invalid resource ID format.';
  }

  // ── JWT errors (should normally be caught in auth middleware) ────────────
  if (err.name === 'JsonWebTokenError') { statusCode = 401; message = 'Invalid token.'; }
  if (err.name === 'TokenExpiredError') { statusCode = 401; message = 'Token expired.'; }

  // Log at the appropriate level
  if (statusCode >= 500) {
    logger.error(`${statusCode} ${message}`, { stack: err.stack, url: req.originalUrl });
  } else {
    logger.warn(`${statusCode} ${message}`, { url: req.originalUrl });
  }

  const body = { success: false, message };

  // Only attach stack trace in development
  if (process.env.NODE_ENV === 'development') {
    body.stack = err.stack;
  }

  res.status(statusCode).json(body);
};

module.exports = errorHandler;
