/**
 * controllers/user.controller.js  –  User Management Controller
 *
 * Routes:
 *   GET    /users          – (admin) list all users
 *   GET    /users/:id      – (admin | self) get one user
 *   PATCH  /users/:id      – (self) update own profile
 *   DELETE /users/:id      – (admin) deactivate account
 *   PATCH  /users/:id/role – (admin) change a user's role
 */

const User                       = require('../models/User');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const logger                     = require('../utils/logger');

// ── GET /api/v1/users  (Admin only) ──────────────────────────────────────────
const getAllUsers = async (req, res, next) => {
  try {
    // Pagination
    const page  = Math.max(1, parseInt(req.query.page  || '1'));
    const limit = Math.min(100, parseInt(req.query.limit || '20'));
    const skip  = (page - 1) * limit;

    // Optional filters
    const filter = {};
    if (req.query.role)     filter.role     = req.query.role;
    if (req.query.isActive) filter.isActive = req.query.isActive === 'true';
    if (req.query.exam)     filter.targetExam = req.query.exam;

    const [users, total] = await Promise.all([
      User.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
      User.countDocuments(filter),
    ]);

    return sendSuccess(res, 200, 'Users fetched.', users.map(u => u.toSafeObject()), {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/v1/users/:id  (Admin or self) ────────────────────────────────────
const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Non-admins can only view themselves
    if (req.user.role !== 'admin' && req.user._id.toString() !== id) {
      return sendError(res, 403, 'You can only view your own profile.');
    }

    const user = await User.findById(id);
    if (!user) return sendError(res, 404, 'User not found.');

    return sendSuccess(res, 200, 'User fetched.', user.toSafeObject());
  } catch (err) {
    next(err);
  }
};

// ── PATCH /api/v1/users/:id  (Self only) ──────────────────────────────────────
/**
 * Users can update their own name, targetExam, targetYear.
 * Password changes use a separate (not shown) endpoint in a real app.
 * Role changes are admin-only via a separate endpoint below.
 */
const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Only the user themselves can update their profile
    if (req.user._id.toString() !== id) {
      return sendError(res, 403, 'You can only update your own profile.');
    }

    // Whitelist of fields users are allowed to change
    const ALLOWED = ['name', 'targetExam', 'targetYear'];
    const updates = {};
    ALLOWED.forEach(field => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    // Handle avatar path if set by upload middleware
    if (req.file) {
      updates.avatar = `/uploads/${req.file.filename}`;
    }

    if (!Object.keys(updates).length) {
      return sendError(res, 400, 'No valid fields provided for update.');
    }

    const user = await User.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!user) return sendError(res, 404, 'User not found.');

    logger.info(`User profile updated: ${user.email}`);
    return sendSuccess(res, 200, 'Profile updated.', user.toSafeObject());
  } catch (err) {
    next(err);
  }
};

// ── DELETE /api/v1/users/:id  (Admin only) ───────────────────────────────────
// Soft-delete: sets isActive = false instead of dropping the document
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return sendError(res, 404, 'User not found.');

    user.isActive = false;
    await user.save({ validateBeforeSave: false });

    logger.warn(`User deactivated by admin: ${user.email}`);
    return sendSuccess(res, 200, 'User account deactivated.', { id: user._id });
  } catch (err) {
    next(err);
  }
};

// ── PATCH /api/v1/users/:id/role  (Admin only) ────────────────────────────────
const changeRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return sendError(res, 400, 'Role must be "user" or "admin".');
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );
    if (!user) return sendError(res, 404, 'User not found.');

    logger.info(`Role changed for ${user.email} → ${role}`);
    return sendSuccess(res, 200, `Role updated to "${role}".`, user.toSafeObject());
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllUsers, getUserById, updateUser, deleteUser, changeRole };
