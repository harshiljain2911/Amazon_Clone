import { validationResult } from 'express-validator';

/**
 * Run after express-validator check() chains.
 * If validation fails → 422 with structured errors.
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => `${e.path}: ${e.msg}`);
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors:  errors.array(),
    });
  }
  next();
};
