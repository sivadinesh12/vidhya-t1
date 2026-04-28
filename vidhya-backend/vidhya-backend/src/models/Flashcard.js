/**
 * models/Flashcard.js  –  Flashcard Schema & Model
 *
 * Flashcards belong to a user (creator) and are organised into
 * subject-level decks. A card has a front (question) and back (answer).
 * The spaced-repetition fields track when the student last reviewed the card.
 */

const mongoose = require('mongoose');

const flashcardSchema = new mongoose.Schema(
  {
    // ── Ownership ─────────────────────────────────────────────────────────
    owner: {
      type    : mongoose.Schema.Types.ObjectId,
      ref     : 'User',
      required: true,
      index   : true,
    },

    // ── Organisation ─────────────────────────────────────────────────────
    subject: {
      type    : String,
      required: [true, 'Subject is required'],
      enum    : ['Biology', 'Physics', 'Chemistry', 'Mathematics', 'Other'],
    },
    chapter: {
      type   : String,
      trim   : true,
      default: 'General',
    },
    deckTitle: {
      type : String,
      trim : true,
      default: 'My Deck',
    },

    // ── Content ───────────────────────────────────────────────────────────
    question: {
      type    : String,
      required: [true, 'Question is required'],
      trim    : true,
      maxlength: [1000, 'Question cannot exceed 1000 characters'],
    },
    answer: {
      type    : String,
      required: [true, 'Answer is required'],
      trim    : true,
      maxlength: [2000, 'Answer cannot exceed 2000 characters'],
    },

    // ── Spaced Repetition ─────────────────────────────────────────────────
    difficulty: {
      type   : String,
      enum   : ['easy', 'medium', 'hard'],
      default: 'medium',
    },
    lastReviewed: {
      type   : Date,
      default: null,
    },
    reviewCount: {
      type   : Number,
      default: 0,
    },
    isArchived: {
      type   : Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Compound index for efficient per-user queries filtered by subject
flashcardSchema.index({ owner: 1, subject: 1 });

module.exports = mongoose.model('Flashcard', flashcardSchema);
