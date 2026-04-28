/**
 * middleware/validate.js  –  express-validator Result Handler
 *
 * Place this middleware AFTER your validator chains in a route.
 * If any validator reports an error, it returns 422 immediately.
 *
 * Usage:
 *   router.post('/signup', [...validationRules], validate, signupController)
 */

const { validationResult } = require('express-validator');
const { sendError }        = require('../utils/apiResponse');

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // Map to a clean { field, message } array
    const formatted = errors.array().map(e => ({
      field  : e.path || e.param,
      message: e.msg,
    }));
    return sendError(res, 422, 'Validation failed.', formatted);
  }

  next();
};

module.exports = validate;
