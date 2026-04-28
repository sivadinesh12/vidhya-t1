/**
 * controllers/studyPlan.controller.js  –  Study Plan CRUD
 *
 * Each user has one active study plan at a time.
 * Sessions within the plan can be marked as completed.
 *
 * Routes:
 *   GET    /study-plans            – list own plans
 *   POST   /study-plans            – create plan
 *   GET    /study-plans/:id        – get one plan
 *   PUT    /study-plans/:id        – replace all sessions
 *   DELETE /study-plans/:id        – delete plan
 *   PATCH  /study-plans/:id/sessions/:sessionId/complete  – toggle session done
 */

const StudyPlan                  = require('../models/StudyPlan');
const { sendSuccess, sendError } = require('../utils/apiResponse');

// ── GET /api/v1/study-plans ───────────────────────────────────────────────────
const getStudyPlans = async (req, res, next) => {
  try {
    const plans = await StudyPlan.find({ owner: req.user._id }).sort({ createdAt: -1 });
    return sendSuccess(res, 200, 'Study plans fetched.', plans);
  } catch (err) {
    next(err);
  }
};

// ── POST /api/v1/study-plans ──────────────────────────────────────────────────
/**
 * Body: { weekLabel, sessions: [{ day, time, title, subject, durationMinutes }] }
 */
const createStudyPlan = async (req, res, next) => {
  try {
    const { weekLabel, sessions } = req.body;

    const plan = await StudyPlan.create({
      owner: req.user._id,
      weekLabel,
      sessions: sessions || [],
    });

    return sendSuccess(res, 201, 'Study plan created.', plan);
  } catch (err) {
    next(err);
  }
};

// ── GET /api/v1/study-plans/:id ───────────────────────────────────────────────
const getStudyPlanById = async (req, res, next) => {
  try {
    const plan = await StudyPlan.findOne({ _id: req.params.id, owner: req.user._id });
    if (!plan) return sendError(res, 404, 'Study plan not found.');
    return sendSuccess(res, 200, 'Study plan fetched.', plan);
  } catch (err) {
    next(err);
  }
};

// ── PUT /api/v1/study-plans/:id ───────────────────────────────────────────────
const updateStudyPlan = async (req, res, next) => {
  try {
    const { weekLabel, sessions, isActive } = req.body;

    const plan = await StudyPlan.findOne({ _id: req.params.id, owner: req.user._id });
    if (!plan) return sendError(res, 404, 'Study plan not found.');

    if (weekLabel !== undefined) plan.weekLabel = weekLabel;
    if (sessions  !== undefined) plan.sessions  = sessions;
    if (isActive  !== undefined) plan.isActive  = isActive;

    plan.recalculateAdherence();
    await plan.save();

    return sendSuccess(res, 200, 'Study plan updated.', plan);
  } catch (err) {
    next(err);
  }
};

// ── DELETE /api/v1/study-plans/:id ───────────────────────────────────────────
const deleteStudyPlan = async (req, res, next) => {
  try {
    const plan = await StudyPlan.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!plan) return sendError(res, 404, 'Study plan not found.');
    return sendSuccess(res, 200, 'Study plan deleted.', { id: plan._id });
  } catch (err) {
    next(err);
  }
};

// ── PATCH /api/v1/study-plans/:planId/sessions/:sessionId/complete ────────────
/**
 * Toggle a session's isCompleted flag and recalculate adherence.
 */
const toggleSession = async (req, res, next) => {
  try {
    const plan = await StudyPlan.findOne({ _id: req.params.planId, owner: req.user._id });
    if (!plan) return sendError(res, 404, 'Study plan not found.');

    const session = plan.sessions.id(req.params.sessionId);
    if (!session) return sendError(res, 404, 'Session not found in this plan.');

    session.isCompleted = !session.isCompleted;

    plan.recalculateAdherence();
    await plan.save();

    return sendSuccess(res, 200,
      `Session marked as ${session.isCompleted ? 'completed' : 'incomplete'}.`,
      plan
    );
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getStudyPlans, createStudyPlan, getStudyPlanById, updateStudyPlan, deleteStudyPlan, toggleSession,
};
