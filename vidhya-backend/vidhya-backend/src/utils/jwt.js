/**
 * utils/jwt.js  –  JSON Web Token helpers
 * Centralises token generation and verification so
 * the logic never leaks into controllers.
 */

const jwt = require('jsonwebtoken');

const SECRET  = process.env.JWT_SECRET;
const EXPIRES = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Generate a signed JWT for a given user document.
 * The payload is intentionally small – only what's needed
 * for authorization checks in middleware.
 *
 * @param   {object} user  –  Mongoose user document
 * @returns {string}       –  Signed JWT string
 */
const generateToken = (user) => {
  const payload = {
    id   : user._id,
    role : user.role,          // 'admin' | 'user'
    email: user.email,
  };

  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES });
};

/**
 * Verify and decode a JWT string.
 *
 * @param   {string} token  –  JWT string (without "Bearer " prefix)
 * @returns {object}        –  Decoded payload
 * @throws  {JsonWebTokenError | TokenExpiredError}
 */
const verifyToken = (token) => {
  return jwt.verify(token, SECRET);
};

module.exports = { generateToken, verifyToken };
