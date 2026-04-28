/**
 * middleware/upload.js  –  Multer File Upload Configuration
 *
 * Supports uploading profile avatars and question images.
 * Files are stored on disk under src/uploads/ with a UUID-based filename.
 * Max file size and allowed MIME types are enforced here.
 */

const multer = require('multer');
const path   = require('path');
const crypto = require('crypto');
const fs     = require('fs');

const UPLOAD_PATH   = path.join(__dirname, '..', 'uploads');
const MAX_SIZE_BYTES = (parseInt(process.env.MAX_FILE_SIZE_MB || '5')) * 1024 * 1024;

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_PATH)) {
  fs.mkdirSync(UPLOAD_PATH, { recursive: true });
}

// ── Disk Storage Engine ───────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_PATH),

  filename: (_req, file, cb) => {
    // e.g.  a1b2c3d4-avatar.jpg
    const uniqueId = crypto.randomBytes(8).toString('hex');
    const ext      = path.extname(file.originalname).toLowerCase();
    cb(null, `${uniqueId}${ext}`);
  },
});

// ── MIME Type Filter ──────────────────────────────────────────────────────────
const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

const fileFilter = (_req, file, cb) => {
  if (ALLOWED_MIME.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type: ${file.mimetype}. Allowed: JPEG, PNG, WEBP, GIF`), false);
  }
};

// ── Export configured Multer instances ───────────────────────────────────────
/** Single image upload under the field name "avatar" */
const uploadAvatar = multer({ storage, fileFilter, limits: { fileSize: MAX_SIZE_BYTES } })
  .single('avatar');

/** Single image upload for question photos (field name "image") */
const uploadImage = multer({ storage, fileFilter, limits: { fileSize: MAX_SIZE_BYTES } })
  .single('image');

/**
 * Wrap multer middleware to pass errors to Express error handler.
 * Multer does NOT call next(err) by default for its own errors.
 */
const wrapMulter = (multerMiddleware) => (req, res, next) => {
  multerMiddleware(req, res, (err) => {
    if (err) {
      err.statusCode = 400;
      return next(err);
    }
    next();
  });
};

module.exports = {
  uploadAvatar : wrapMulter(uploadAvatar),
  uploadImage  : wrapMulter(uploadImage),
};
