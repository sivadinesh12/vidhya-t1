/**
 * routes/upload.routes.js  –  File Upload Routes
 *
 * POST /api/v1/upload/avatar  – profile photo
 * POST /api/v1/upload/image   – generic image (question photos for VIDYA AI)
 */

const express  = require('express');
const { protect }         = require('../middleware/auth');
const { uploadAvatar, uploadImage } = require('../middleware/upload');
const uploadController = require('../controllers/upload.controller');

const router = express.Router();
router.use(protect);

// Avatar upload – field name must be "avatar" in multipart form
router.post('/avatar', uploadAvatar, uploadController.uploadAvatar);

// Generic image upload – field name must be "image"
router.post('/image',  uploadImage,  uploadController.uploadImage);

module.exports = router;
