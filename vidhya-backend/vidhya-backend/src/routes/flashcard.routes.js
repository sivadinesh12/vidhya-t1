/**
 * routes/flashcard.routes.js  –  Flashcard Routes
 *
 * GET    /api/v1/flashcards
 * POST   /api/v1/flashcards
 * GET    /api/v1/flashcards/:id
 * PUT    /api/v1/flashcards/:id
 * DELETE /api/v1/flashcards/:id
 * PATCH  /api/v1/flashcards/:id/review
 */

const express  = require('express');
const { body } = require('express-validator');

const {
  getFlashcards, createFlashcard, getFlashcardById,
  updateFlashcard, deleteFlashcard, reviewFlashcard,
} = require('../controllers/flashcard.controller');

const { protect } = require('../middleware/auth');
const validate    = require('../middleware/validate');

const router = express.Router();

router.use(protect);                        // All flashcard routes require auth

const SUBJECTS    = ['Biology', 'Physics', 'Chemistry', 'Mathematics', 'Other'];
const DIFFICULTIES = ['easy', 'medium', 'hard'];

const cardRules = [
  body('subject')
    .notEmpty().withMessage('Subject is required.')
    .isIn(SUBJECTS).withMessage(`Subject must be one of: ${SUBJECTS.join(', ')}.`),
  body('question')
    .trim()
    .notEmpty().withMessage('Question is required.')
    .isLength({ max: 1000 }).withMessage('Question too long (max 1000 chars).'),
  body('answer')
    .trim()
    .notEmpty().withMessage('Answer is required.')
    .isLength({ max: 2000 }).withMessage('Answer too long (max 2000 chars).'),
  body('difficulty')
    .optional()
    .isIn(DIFFICULTIES).withMessage(`Difficulty must be: ${DIFFICULTIES.join(', ')}.`),
];

router.get  ('/',              getFlashcards);
router.post ('/',  cardRules, validate, createFlashcard);
router.get  ('/:id',           getFlashcardById);
router.put  ('/:id', cardRules, validate, updateFlashcard);
router.delete('/:id',          deleteFlashcard);
router.patch('/:id/review',
  [body('difficulty').optional().isIn(DIFFICULTIES)],
  validate,
  reviewFlashcard
);

module.exports = router;
