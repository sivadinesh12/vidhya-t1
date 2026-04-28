/**
 * routes/auth.routes.js  –  Authentication Routes
 *
 * POST /api/v1/auth/signup
 * POST /api/v1/auth/login
 * POST /api/v1/auth/google
 * GET  /api/v1/auth/me
 */

const express   = require('express');
const { body }  = require('express-validator');

const { signup, login, googleAuth, getMe } = require('../controllers/auth.controller');
const { protect }   = require('../middleware/auth');
const validate      = require('../middleware/validate');

const router = express.Router();

// ── Validation rule sets ──────────────────────────────────────────────────────

const signupRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required.')
    .isLength({ min: 2, max: 60 }).withMessage('Name must be 2–60 characters.'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('Please enter a valid email address.')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required.')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters.')
    .matches(/\d/).withMessage('Password must contain at least one number.'),

  body('targetExam')
    .optional()
    .isIn(['NEET', 'JEE_MAINS', 'JEE_ADVANCED', 'BOARDS', 'OTHER'])
    .withMessage('Invalid exam target.'),

  body('targetYear')
    .optional()
    .isInt({ min: 2024, max: 2030 }).withMessage('Target year must be between 2024 and 2030.'),
];

const loginRules = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('Please enter a valid email.')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required.'),
];

const googleRules = [
  body('credential')
    .notEmpty().withMessage('Google credential token is required.'),
];

// ── Routes ────────────────────────────────────────────────────────────────────

// POST /api/v1/auth/signup
router.post('/signup', signupRules, validate, signup);

// POST /api/v1/auth/login
router.post('/login', loginRules, validate, login);

// POST /api/v1/auth/google  – exchange Google id_token for Vidhya JWT
router.post('/google', googleRules, validate, googleAuth);

// GET  /api/v1/auth/me  – protected: returns current user profile
router.get('/me', protect, getMe);

module.exports = router;
