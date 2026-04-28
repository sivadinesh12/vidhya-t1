/**
 * controllers/flashcard.controller.js  –  Flashcard CRUD
 *
 * All operations are scoped to req.user so students only
 * see and modify their own flashcards.
 *
 * Routes:
 *   GET    /flashcards             – list (with filters: subject, difficulty)
 *   POST   /flashcards             – create one
 *   GET    /flashcards/:id         – get one
 *   PUT    /flashcards/:id         – full update
 *   DELETE /flashcards/:id         – delete
 *   PATCH  /flashcards/:id/review  – mark as reviewed (spaced repetition update)
 */

const Flashcard                  = require('../models/Flashcard');
const { sendSuccess, sendError } = require('../utils/apiResponse');

// ── GET /api/v1/flashcards ────────────────────────────────────────────────────
const getFlashcards = async (req, res, next) => {
  try {
    const { subject, difficulty, archived, page = '1', limit = '20' } = req.query;

    const filter = { owner: req.user._id };

    if (subject)    filter.subject    = subject;
    if (difficulty) filter.difficulty = difficulty;

    // By default hide archived cards; pass archived=true to see them
    filter.isArchived = archived === 'true';

    const p = Math.max(1, parseInt(page));
    const l = Math.min(100, parseInt(limit));

    const [cards, total] = await Promise.all([
      Flashcard.find(filter).skip((p - 1) * l).limit(l).sort({ createdAt: -1 }),
      Flashcard.countDocuments(filter),
    ]);

    return sendSuccess(res, 200, 'Flashcards fetched.', cards, {
      page: p, limit: l, total, totalPages: Math.ceil(total / l),
    });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/v1/flashcards ───────────────────────────────────────────────────
const createFlashcard = async (req, res, next) => {
  try {
    const { subject, chapter, deckTitle, question, answer, difficulty } = req.body;

    const card = await Flashcard.create({
      owner: req.user._id,
      subject, chapter, deckTitle, question, answer, difficulty,
    });

    return sendSuccess(res, 201, 'Flashcard created.', card);
  } catch (err) {
    next(err);
  }
};

// ── GET /api/v1/flashcards/:id ────────────────────────────────────────────────
const getFlashcardById = async (req, res, next) => {
  try {
    const card = await Flashcard.findOne({ _id: req.params.id, owner: req.user._id });
    if (!card) return sendError(res, 404, 'Flashcard not found.');
    return sendSuccess(res, 200, 'Flashcard fetched.', card);
  } catch (err) {
    next(err);
  }
};

// ── PUT /api/v1/flashcards/:id ────────────────────────────────────────────────
const updateFlashcard = async (req, res, next) => {
  try {
    const { subject, chapter, deckTitle, question, answer, difficulty, isArchived } = req.body;

    const card = await Flashcard.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      { subject, chapter, deckTitle, question, answer, difficulty, isArchived },
      { new: true, runValidators: true }
    );

    if (!card) return sendError(res, 404, 'Flashcard not found.');
    return sendSuccess(res, 200, 'Flashcard updated.', card);
  } catch (err) {
    next(err);
  }
};

// ── DELETE /api/v1/flashcards/:id ────────────────────────────────────────────
const deleteFlashcard = async (req, res, next) => {
  try {
    const card = await Flashcard.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!card) return sendError(res, 404, 'Flashcard not found.');
    return sendSuccess(res, 200, 'Flashcard deleted.', { id: card._id });
  } catch (err) {
    next(err);
  }
};

// ── PATCH /api/v1/flashcards/:id/review ──────────────────────────────────────
/**
 * Called when a student finishes reviewing a card.
 * Updates lastReviewed and reviewCount.
 * Body: { difficulty? }  – student self-rates the card difficulty after review
 */
const reviewFlashcard = async (req, res, next) => {
  try {
    const updates = {
      lastReviewed: new Date(),
      $inc: { reviewCount: 1 },
    };
    if (req.body.difficulty) updates.difficulty = req.body.difficulty;

    const card = await Flashcard.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      updates,
      { new: true }
    );

    if (!card) return sendError(res, 404, 'Flashcard not found.');
    return sendSuccess(res, 200, 'Flashcard review recorded.', card);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getFlashcards,
  createFlashcard,
  getFlashcardById,
  updateFlashcard,
  deleteFlashcard,
  reviewFlashcard,
};
