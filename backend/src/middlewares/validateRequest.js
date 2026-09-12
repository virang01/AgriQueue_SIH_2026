import { sendError } from '../utils/apiResponse.js';

export const validateFields = (fields) => {
  return (req, res, next) => {
    const missing = [];
    for (const field of fields) {
      if (req.body[field] === undefined || req.body[field] === null || req.body[field] === '') {
        missing.push(field);
      }
    }
    if (missing.length > 0) {
      return sendError(
        res,
        `Missing required request parameters: ${missing.join(', ')}`,
        'VALIDATION_ERROR',
        400
      );
    }
    next();
  };
};
