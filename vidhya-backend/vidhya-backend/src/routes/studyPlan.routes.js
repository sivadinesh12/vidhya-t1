/**
 * routes/studyPlan.routes.js  –  Study Plan Routes
 */

const express  = require('express');
const { body } = require('express-validator');

const {
  getStudyPlans, createStudyPlan, getStudyPlanById,
  updateStudyPlan, deleteStudyPlan, toggleSession,
} = require('../controllers/studyPlan.controller');

const { protect } = require('../middleware/auth');
const validate    = require('../middleware/validate');

const router = express.Router();
router.use(protect);

const DAYS     = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const SUBJECTS = ['Biology','Physics','Chemistry','Mathematics','Mock Test','Revision','Other'];

const sessionSchema = [
  body('sessions').optional().isArray(),
  body('sessions.*.day')
    .notEmpty().withMessage('Session day is required.')
    .isIn(DAYS).withMessage(`Day must be one of: ${DAYS.join(', ')}.`),
  body('sessions.*.time').notEmpty().withMessage('Session time is required.'),
  body('sessions.*.title').trim().notEmpty().withMessage('Session title is required.'),
  body('sessions.*.subject').optional().isIn(SUBJECTS),
  body('sessions.*.durationMinutes').optional().isInt({ min: 5, max: 480 }),
];

router.get  ('/',    getStudyPlans);
router.post ('/',    sessionSchema, validate, createStudyPlan);
router.get  ('/:id', getStudyPlanById);
router.put  ('/:id', sessionSchema, validate, updateStudyPlan);
router.delete('/:id', deleteStudyPlan);

// Toggle individual session done/not-done
router.patch('/:planId/sessions/:sessionId/complete', toggleSession);

module.exports = router;
