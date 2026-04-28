/**
 * controllers/progress.controller.js  –  Progress Tracker
 *
 * Routes:
 *   GET   /progress                    – get my progress doc
 *   PATCH /progress/chapters/:chapterId – update a chapter's completion %
 *   POST  /progress/chapters            – add a new chapter to track
 *   PATCH /progress/streak              – record today's study (streak update)
 *   GET   /progress/leaderboard         – (admin) top students by streak
 */

const Progress                   = require('../models/Progress');
const { sendSuccess, sendError } = require('../utils/apiResponse');

// ── GET /api/v1/progress ──────────────────────────────────────────────────────
const getProgress = async (req, res, next) => {
  try {
    let progress = await Progress.findOne({ owner: req.user._id });

    // Lazily create if somehow missing
    if (!progress) {
      progress = await Progress.create({ owner: req.user._id });
    }

    return sendSuccess(res, 200, 'Progress fetched.', progress);
  } catch (err) {
    next(err);
  }
};

// ── POST /api/v1/progress/chapters ───────────────────────────────────────────
/**
 * Add a chapter to the student's progress tracker.
 * Body: { chapterName, subject }
 */
const addChapter = async (req, res, next) => {
  try {
    const { chapterName, subject } = req.body;

    const progress = await Progress.findOne({ owner: req.user._id });
    if (!progress) return sendError(res, 404, 'Progress record not found.');

    // Avoid duplicate chapters
    const exists = progress.chapters.some(
      c => c.chapterName === chapterName && c.subject === subject
    );
    if (exists) return sendError(res, 409, 'This chapter is already being tracked.');

    progress.chapters.push({ chapterName, subject });
    await progress.save();

    return sendSuccess(res, 201, 'Chapter added to progress tracker.', progress);
  } catch (err) {
    next(err);
  }
};

// ── PATCH /api/v1/progress/chapters/:chapterId ────────────────────────────────
/**
 * Update completion percentage for a specific chapter.
 * Body: { completionPct }
 */
const updateChapter = async (req, res, next) => {
  try {
    const { completionPct } = req.body;

    if (completionPct < 0 || completionPct > 100) {
      return sendError(res, 400, 'completionPct must be between 0 and 100.');
    }

    const progress = await Progress.findOne({ owner: req.user._id });
    if (!progress) return sendError(res, 404, 'Progress record not found.');

    const chapter = progress.chapters.id(req.params.chapterId);
    if (!chapter) return sendError(res, 404, 'Chapter not found in your progress.');

    chapter.completionPct = completionPct;
    chapter.lastStudied   = new Date();

    // Check milestone: first chapter to reach 80%+
    if (completionPct >= 80) {
      const milestone = progress.milestones.find(m => m.title === 'First Chapter Mastered' && !m.achieved);
      if (milestone) { milestone.achieved = true; milestone.achievedAt = new Date(); }
    }

    await progress.save();
    return sendSuccess(res, 200, 'Chapter progress updated.', progress);
  } catch (err) {
    next(err);
  }
};

// ── PATCH /api/v1/progress/streak ────────────────────────────────────────────
/**
 * Called after the student completes any study activity.
 * Increments the streak if not already updated today.
 * Body: { studyMinutes?, flashcardsReviewed?, mockTestCompleted? }
 */
const updateStreak = async (req, res, next) => {
  try {
    const { studyMinutes = 0, flashcardsReviewed = 0, mockTestCompleted = false } = req.body;

    const progress = await Progress.findOne({ owner: req.user._id });
    if (!progress) return sendError(res, 404, 'Progress record not found.');

    const today     = new Date();
    today.setHours(0, 0, 0, 0);

    const lastDate  = progress.lastStudyDate ? new Date(progress.lastStudyDate) : null;
    if (lastDate) lastDate.setHours(0, 0, 0, 0);

    const alreadyStudiedToday = lastDate && lastDate.getTime() === today.getTime();

    if (!alreadyStudiedToday) {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      const isConsecutive = lastDate && lastDate.getTime() === yesterday.getTime();

      progress.currentStreak = isConsecutive ? progress.currentStreak + 1 : 1;
      progress.longestStreak = Math.max(progress.longestStreak, progress.currentStreak);
      progress.lastStudyDate = today;
    }

    // Accumulate stats
    progress.totalStudyMinutes  += studyMinutes;
    progress.flashcardsReviewed += flashcardsReviewed;
    if (mockTestCompleted) progress.mockTestsAttempted += 1;

    // Check streak milestones
    const streakMilestone = progress.milestones.find(
      m => m.title === '7-Day Study Streak' && !m.achieved
    );
    if (streakMilestone && progress.currentStreak >= 7) {
      streakMilestone.achieved   = true;
      streakMilestone.achievedAt = new Date();
    }

    await progress.save();
    return sendSuccess(res, 200, 'Streak and stats updated.', progress);
  } catch (err) {
    next(err);
  }
};

// ── GET /api/v1/progress/leaderboard  (Admin) ─────────────────────────────────
const getLeaderboard = async (req, res, next) => {
  try {
    const top = await Progress.find()
      .sort({ currentStreak: -1 })
      .limit(20)
      .populate('owner', 'name avatar targetExam');

    return sendSuccess(res, 200, 'Leaderboard fetched.', top);
  } catch (err) {
    next(err);
  }
};

module.exports = { getProgress, addChapter, updateChapter, updateStreak, getLeaderboard };
