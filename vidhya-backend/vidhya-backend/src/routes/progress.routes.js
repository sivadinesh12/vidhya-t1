/**
 * routes/progress.routes.js  –  Progress Tracker Routes
 */

const express  = require('express');
const { body } = require('express-validator');

const {
  getProgress, addChapter, updateChapter, updateStreak, getLeaderboard,
} = require('../controllers/progress.controller');

const { protect, authorize } = require('../middleware/auth');
const validate               = require('../middleware/validate');

const router = express.Router();
router.use(protect);

const SUBJECTS = ['Biology', 'Physics', 'Chemistry', 'Mathematics'];

router.get ('/',                    getProgress);

router.post('/chapters',
  [
    body('chapterName').trim().notEmpty().withMessage('Chapter name is required.'),
    body('subject').isIn(SUBJECTS).withMessage(`Subject must be: ${SUBJECTS.join(', ')}.`),
  ],
  validate,
  addChapter
);

router.patch('/chapters/:chapterId',
  [
    body('completionPct')
      .notEmpty().withMessage('completionPct is required.')
      .isInt({ min: 0, max: 100 }).withMessage('completionPct must be 0–100.'),
  ],
  validate,
  updateChapter
);

router.patch('/streak',
  [
    body('studyMinutes').optional().isInt({ min: 0 }),
    body('flashcardsReviewed').optional().isInt({ min: 0 }),
    body('mockTestCompleted').optional().isBoolean(),
  ],
  validate,
  updateStreak
);

// Admin-only leaderboard
router.get('/leaderboard', authorize('admin'), getLeaderboard);

module.exports = router;
