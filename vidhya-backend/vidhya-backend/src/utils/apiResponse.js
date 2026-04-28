/**
 * utils/apiResponse.js  –  Standardised API response helpers
 *
 * All API responses follow the same envelope:
 *   { success: boolean, message: string, data?: any, meta?: any }
 *
 * Using helpers ensures consistency across every controller.
 */

/**
 * Send a successful response.
 * @param {object}  res      – Express response object
 * @param {number}  status   – HTTP status code (default 200)
 * @param {string}  message  – Human-readable success message
 * @param {any}     data     – Payload to return to the client
 * @param {object}  meta     – Optional pagination / extra info
 */
const sendSuccess = (res, status = 200, message = 'Success', data = null, meta = null) => {
  const body = { success: true, message };
  if (data !== null) body.data = data;
  if (meta !== null) body.meta = meta;
  return res.status(status).json(body);
};

/**
 * Send an error response.
 * @param {object}  res      – Express response object
 * @param {number}  status   – HTTP status code (default 500)
 * @param {string}  message  – Human-readable error message
 * @param {any}     errors   – Optional validation error details
 */
const sendError = (res, status = 500, message = 'Internal Server Error', errors = null) => {
  const body = { success: false, message };
  if (errors !== null) body.errors = errors;
  return res.status(status).json(body);
};

module.exports = { sendSuccess, sendError };
