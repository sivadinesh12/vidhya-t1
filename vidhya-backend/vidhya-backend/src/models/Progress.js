/**
 * models/Progress.js  –  Student Progress Schema & Model
 *
 * Tracks chapter-level completion percentages, milestones,
 * and study streak data for the Progress dashboard page.
 */

const mongoose = require('mongoose');

// ── Sub-schema: one chapter's progress entry ──────────────────────────────────
const chapterProgressSchema = new mongoose.Schema(
  {
    chapterName: { type: String, required: true, trim: true },
    subject    : {
      type: String,
      enum: ['Biology', 'Physics', 'Chemistry', 'Mathematics'],
      required: true,
    },
    completionPct: {
      type   : Number,
      default: 0,
      min    : 0,
      max    : 100,
    },
    lastStudied: { type: Date, default: null },
  },
  { _id: true }
);

// ── Sub-schema: a milestone the student can unlock ────────────────────────────
const milestoneSchema = new mongoose.Schema(
  {
    icon    : { type: String, default: '🏆' },
    title   : { type: String, required: true },
    achieved: { type: Boolean, default: false },
    achievedAt: { type: Date, default: null },
  },
  { _id: true }
);

// ── Main progress schema ──────────────────────────────────────────────────────
const progressSchema = new mongoose.Schema(
  {
    owner: {
      type    : mongoose.Schema.Types.ObjectId,
      ref     : 'User',
      required: true,
      unique  : true,              // One progress document per user
    },

    chapters  : [chapterProgressSchema],
    milestones: [milestoneSchema],

    // ── Streak Tracking ───────────────────────────────────────────────────
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastStudyDate: { type: Date,   default: null },

    // ── Aggregate Stats ───────────────────────────────────────────────────
    totalStudyMinutes  : { type: Number, default: 0 },
    mockTestsAttempted : { type: Number, default: 0 },
    flashcardsReviewed : { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Progress', progressSchema);
