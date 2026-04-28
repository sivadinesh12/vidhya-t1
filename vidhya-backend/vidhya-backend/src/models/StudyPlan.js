/**
 * models/StudyPlan.js  –  Weekly Study Plan Schema & Model
 *
 * A study plan is a weekly schedule owned by a user.
 * Each plan contains daily sessions (time-boxed study blocks).
 */

const mongoose = require('mongoose');

// ── Sub-schema: a single study session slot ───────────────────────────────────
const sessionSchema = new mongoose.Schema(
  {
    day: {
      type    : String,
      required: true,
      enum    : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    time: {
      type   : String,               // e.g. "9:00 AM"
      required: true,
    },
    title: {
      type    : String,
      required: [true, 'Session title is required'],
      trim    : true,
      maxlength: [120, 'Title too long'],
    },
    subject: {
      type : String,
      enum : ['Biology', 'Physics', 'Chemistry', 'Mathematics', 'Mock Test', 'Revision', 'Other'],
      default: 'Other',
    },
    durationMinutes: {
      type: Number,
      min : 5,
      max : 480,
    },
    isCompleted: {
      type   : Boolean,
      default: false,
    },
  },
  { _id: true }
);

// ── Main study plan schema ────────────────────────────────────────────────────
const studyPlanSchema = new mongoose.Schema(
  {
    owner: {
      type    : mongoose.Schema.Types.ObjectId,
      ref     : 'User',
      required: true,
      index   : true,
    },
    weekLabel: {
      type   : String,
      trim   : true,
      default: 'My Study Plan',      // e.g. "Week of Apr 28 – May 4"
    },
    sessions: [sessionSchema],

    // ── Meta ──────────────────────────────────────────────────────────────
    adherencePct: {
      type   : Number,
      default: 0,
      min    : 0,
      max    : 100,
    },
    isActive: {
      type   : Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Recompute adherence whenever sessions change
studyPlanSchema.methods.recalculateAdherence = function () {
  if (!this.sessions.length) { this.adherencePct = 0; return; }
  const done = this.sessions.filter(s => s.isCompleted).length;
  this.adherencePct = Math.round((done / this.sessions.length) * 100);
};

module.exports = mongoose.model('StudyPlan', studyPlanSchema);
