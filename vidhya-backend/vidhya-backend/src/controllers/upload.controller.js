/**
 * controllers/upload.controller.js  –  File Upload Controller
 *
 * Routes:
 *   POST /upload/avatar  – upload profile photo (updates User.avatar)
 *   POST /upload/image   – upload question/diagram image (returns URL)
 */

const path                       = require('path');
const fs                         = require('fs');
const User                       = require('../models/User');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const logger                     = require('../utils/logger');

// ── POST /api/v1/upload/avatar ────────────────────────────────────────────────
/**
 * Multer (uploadAvatar middleware) runs before this handler.
 * req.file is populated by multer if a valid image was sent.
 */
const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return sendError(res, 400, 'No image file provided. Send a file under the "avatar" field.');
    }

    const avatarUrl = `/uploads/${req.file.filename}`;

    // Delete the old avatar file if it was a local upload
    const user = await User.findById(req.user._id);
    if (user.avatar && user.avatar.startsWith('/uploads/')) {
      const oldPath = path.join(__dirname, '..', user.avatar);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
        logger.debug(`Deleted old avatar: ${oldPath}`);
      }
    }

    // Persist new avatar path
    user.avatar = avatarUrl;
    await user.save({ validateBeforeSave: false });

    logger.info(`Avatar updated for user ${user.email}`);

    return sendSuccess(res, 200, 'Avatar uploaded.', {
      avatarUrl,
      user: user.toSafeObject(),
    });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/v1/upload/image ─────────────────────────────────────────────────
/**
 * Generic image upload (e.g. a photo of a question sent to VIDYA AI).
 * Returns the public URL so the frontend can pass it to the AI.
 */
const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return sendError(res, 400, 'No image file provided. Send a file under the "image" field.');
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    return sendSuccess(res, 200, 'Image uploaded.', {
      imageUrl,
      filename   : req.file.filename,
      originalName: req.file.originalname,
      sizeBytes  : req.file.size,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { uploadAvatar, uploadImage };
