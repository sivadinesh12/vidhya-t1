/**
 * app.js  –  Express Application Factory
 * Registers all middleware, routes, and error handlers.
 * Kept separate from server.js so it's easier to test.
 */

const express      = require('express');
const helmet       = require('helmet');
const cors         = require('cors');
const morgan       = require('morgan');
const rateLimit    = require('express-rate-limit');
const path         = require('path');

// ── Route Imports ────────────────────────────────────────────────────────────
const authRoutes        = require('./routes/auth.routes');
const userRoutes        = require('./routes/user.routes');
const flashcardRoutes   = require('./routes/flashcard.routes');
const studyPlanRoutes   = require('./routes/studyPlan.routes');
const progressRoutes    = require('./routes/progress.routes');
const uploadRoutes      = require('./routes/upload.routes');

const errorHandler = require('./middleware/errorHandler');
const logger       = require('./utils/logger');

const app = express();

// ── Security Headers (Helmet) ────────────────────────────────────────────────
app.use(helmet());

// ── CORS ─────────────────────────────────────────────────────────────────────
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:3000')
  .split(',')
  .map(s => s.trim());

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,                          // Allow cookies / Authorization header
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
}));

// ── Request Parsing ───────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── HTTP Request Logging (Morgan → Winston) ──────────────────────────────────
app.use(morgan('combined', {
  stream: { write: (msg) => logger.http(msg.trim()) },
}));

// ── Global Rate Limiter ───────────────────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs : parseInt(process.env.RATE_LIMIT_WINDOW_MINUTES || '15') * 60 * 1000,
  max      : parseInt(process.env.RATE_LIMIT_MAX_REQUESTS   || '100'),
  standardHeaders: true,
  legacyHeaders  : false,
  message  : { success: false, message: 'Too many requests. Please try again later.' },
});
app.use(globalLimiter);

// Stricter limiter for auth endpoints (prevent brute-force)
const authLimiter = rateLimit({
  windowMs : 15 * 60 * 1000,               // 15 minutes
  max      : 20,                            // 20 attempts per window
  message  : { success: false, message: 'Too many login attempts. Please try again in 15 minutes.' },
});

// ── Static Files (profile photos / uploads) ──────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ success: true, message: 'Vidhya API is healthy 🚀', env: process.env.NODE_ENV });
});

// ── API Routes ────────────────────────────────────────────────────────────────
const API = '/api/v1';

app.use(`${API}/auth`,        authLimiter, authRoutes);
app.use(`${API}/users`,       userRoutes);
app.use(`${API}/flashcards`,  flashcardRoutes);
app.use(`${API}/study-plans`, studyPlanRoutes);
app.use(`${API}/progress`,    progressRoutes);
app.use(`${API}/upload`,      uploadRoutes);

// ── 404 Handler ───────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
});

// ── Global Error Handler ──────────────────────────────────────────────────────
app.use(errorHandler);

module.exports = app;
