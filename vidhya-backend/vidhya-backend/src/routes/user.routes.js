/**
 * routes/user.routes.js  –  User Management Routes
 *
 * GET    /api/v1/users           – (admin) list all users
 * GET    /api/v1/users/:id       – (admin | self) get one user
 * PATCH  /api/v1/users/:id       – (self) update profile
 * DELETE /api/v1/users/:id       – (admin) deactivate account
 * PATCH  /api/v1/users/:id/role  – (admin) change role
 */

const express  = require('express');
const { body } = require('express-validator');

const {
  getAllUsers, getUserById, updateUser, deleteUser, changeRole,
} = require('../controllers/user.controller');

const { protect, authorize } = require('../middleware/auth');
const { uploadAvatar }       = require('../middleware/upload');
const validate               = require('../middleware/validate');

const router = express.Router();

// All user routes require authentication
router.use(protect);

// ── GET  /api/v1/users  ───────────────────────────────────────────────────────
router.get('/', authorize('admin'), getAllUsers);

// ── GET  /api/v1/users/:id  ───────────────────────────────────────────────────
router.get('/:id', getUserById);

// ── PATCH /api/v1/users/:id  ─────────────────────────────────────────────────
const updateRules = [
  body('name').optional().trim().isLength({ min: 2, max: 60 }).withMessage('Name must be 2–60 chars.'),
  body('targetExam').optional().isIn(['NEET','JEE_MAINS','JEE_ADVANCED','BOARDS','OTHER']),
  body('targetYear').optional().isInt({ min: 2024, max: 2030 }),
];

// uploadAvatar runs multer (file handling) before validation + controller
router.patch('/:id', uploadAvatar, updateRules, validate, updateUser);

// ── DELETE /api/v1/users/:id  (admin) ─────────────────────────────────────────
router.delete('/:id', authorize('admin'), deleteUser);

// ── PATCH /api/v1/users/:id/role  (admin) ────────────────────────────────────
router.patch(
  '/:id/role',
  authorize('admin'),
  [body('role').isIn(['user', 'admin']).withMessage('Role must be "user" or "admin".')],
  validate,
  changeRole
);

module.exports = router;
