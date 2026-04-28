/**
 * middleware/auth.js  –  Authentication & Authorization Middleware
 *
 * protect()   – Verifies the JWT and attaches req.user
 * authorize() – Restricts access to specific roles
 *
 * Usage in routes:
 *   router.get('/admin', protect, authorize('admin'), handler)
 *   router.get('/me',    protect,                     handler)
 */

const { verifyToken }  = require('../utils/jwt');
const { sendError }    = require('../utils/apiResponse');
const User             = require('../models/User');
const logger           = require('../utils/logger');

/**
 * protect – must be called before any route that requires a logged-in user.
 * Reads the Bearer token from the Authorization header, verifies it,
 * fetches the user from MongoDB, and attaches the user to req.user.
 */
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 1. Check header exists and starts with "Bearer "
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 401, 'No token provided. Please log in.');
    }

    const token = authHeader.split(' ')[1];

    // 2. Verify the JWT signature and expiry
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (err) {
      const message = err.name === 'TokenExpiredError'
        ? 'Session expired. Please log in again.'
        : 'Invalid token. Please log in again.';
      return sendError(res, 401, message);
    }

    // 3. Fetch the user (ensures account still exists and is active)
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return sendError(res, 401, 'User account not found.');
    }

    if (!user.isActive) {
      return sendError(res, 403, 'Account has been deactivated. Contact support.');
    }

    // 4. Attach user to request for downstream handlers
    req.user = user;
    next();
  } catch (err) {
    logger.error('Auth middleware error:', err);
    return sendError(res, 500, 'Authentication error.');
  }
};

/**
 * authorize – factory that returns a middleware restricting access
 * to users whose role matches one of the provided roles.
 *
 * @param  {...string} roles  –  e.g. authorize('admin') or authorize('admin','moderator')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return sendError(
        res,
        403,
        `Access denied. Required role(s): ${roles.join(', ')}.`
      );
    }
    next();
  };
};

module.exports = { protect, authorize };
