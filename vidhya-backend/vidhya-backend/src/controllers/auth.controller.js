/**
 * controllers/auth.controller.js  –  Authentication Controller
 *
 * Handles: signup, login, Google OAuth (token exchange), and /me.
 * No password is ever returned to the client.
 */

const { OAuth2Client }       = require('google-auth-library').default
  ? require('google-auth-library').default
  : require('google-auth-library');          // safe import regardless of version

const User                   = require('../models/User');
const Progress               = require('../models/Progress');
const { generateToken }      = require('../utils/jwt');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const logger                 = require('../utils/logger');

// Lazy-init Google client (only if GOOGLE_CLIENT_ID is set)
const getGoogleClient = () => {
  const { OAuth2Client } = require('google-auth-library');
  return new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
};

// ── Helper: create a blank progress doc for a new user ────────────────────────
const createInitialProgress = async (userId) => {
  await Progress.create({
    owner: userId,
    milestones: [
      { icon: '🚀', title: 'Account Created',         achieved: true, achievedAt: new Date() },
      { icon: '📖', title: 'First Study Session',     achieved: false },
      { icon: '🔥', title: '7-Day Study Streak',      achieved: false },
      { icon: '🃏', title: 'Reviewed 50 Flashcards',  achieved: false },
      { icon: '🧪', title: 'Completed First Mock Test',achieved: false },
    ],
  });
};

// ── POST /api/v1/auth/signup ──────────────────────────────────────────────────
/**
 * Register a new student account.
 * Body: { name, email, password, targetExam?, targetYear? }
 */
const signup = async (req, res, next) => {
  try {
    const { name, email, password, targetExam, targetYear } = req.body;

    // Check for existing account
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return sendError(res, 409, 'An account with this email already exists.');
    }

    // Create user (password is hashed in the pre-save hook on the model)
    const user = await User.create({ name, email, password, targetExam, targetYear });

    // Bootstrap an empty progress document for the new user
    await createInitialProgress(user._id);

    // Update lastLogin
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const token = generateToken(user);

    logger.info(`New user registered: ${user.email}`);

    return sendSuccess(res, 201, 'Account created successfully.', {
      token,
      user: user.toSafeObject(),
    });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/v1/auth/login ───────────────────────────────────────────────────
/**
 * Log in with email + password.
 * Body: { email, password }
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Fetch user with password (select: false on schema means we must be explicit)
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user || !user.password) {
      return sendError(res, 401, 'Invalid email or password.');
    }

    if (!user.isActive) {
      return sendError(res, 403, 'Account deactivated. Please contact support.');
    }

    const passwordMatch = await user.comparePassword(password);
    if (!passwordMatch) {
      return sendError(res, 401, 'Invalid email or password.');
    }

    // Update last login time
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const token = generateToken(user);

    logger.info(`User logged in: ${user.email}`);

    return sendSuccess(res, 200, 'Login successful.', {
      token,
      user: user.toSafeObject(),
    });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/v1/auth/google ──────────────────────────────────────────────────
/**
 * Exchange a Google OAuth credential (id_token) for a Vidhya JWT.
 * The React frontend sends the credential it received from Google's SDK.
 * Body: { credential }  (the Google id_token string)
 */
const googleAuth = async (req, res, next) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return sendError(res, 400, 'Google credential is required.');
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
      return sendError(res, 500, 'Google OAuth is not configured on the server.');
    }

    const client  = getGoogleClient();
    const ticket  = await client.verifyIdToken({
      idToken : credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { sub: googleId, email, name, picture } = ticket.getPayload();

    // Find or create user
    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (user) {
      // Link Google ID if not already linked
      if (!user.googleId) { user.googleId = googleId; }
      if (picture && !user.avatar) { user.avatar = picture; }
      user.lastLogin = new Date();
      await user.save({ validateBeforeSave: false });
    } else {
      // First-time Google login → create account (no password)
      user = await User.create({ name, email, googleId, avatar: picture });
      await createInitialProgress(user._id);
    }

    const token = generateToken(user);

    logger.info(`Google auth: ${user.email}`);

    return sendSuccess(res, 200, 'Google authentication successful.', {
      token,
      user: user.toSafeObject(),
    });
  } catch (err) {
    logger.error('Google auth error:', err.message);
    if (err.message?.includes('Token used too late')) {
      return sendError(res, 401, 'Google token expired. Please try again.');
    }
    next(err);
  }
};

// ── GET /api/v1/auth/me ───────────────────────────────────────────────────────
/**
 * Return the currently authenticated user's profile.
 * Requires a valid Bearer token (protect middleware).
 */
const getMe = async (req, res, next) => {
  try {
    // req.user is attached by the protect middleware
    return sendSuccess(res, 200, 'Profile fetched.', req.user.toSafeObject());
  } catch (err) {
    next(err);
  }
};

module.exports = { signup, login, googleAuth, getMe };
