import jwt from 'jsonwebtoken';

/**
 * Generate a short-lived ACCESS token (15 min)
 * Sent in response body → stored by client
 */
export const generateAccessToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '15m' });

/**
 * Generate a long-lived REFRESH token (30 days)
 * Set in httpOnly cookie by the auth controller
 */
export const generateRefreshToken = (id) =>
  jwt.sign({ id }, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET + '_refresh', {
    expiresIn: '30d',
  });

/**
 * Backward-compat helper — single token (30d) used on existing endpoints
 * that the frontend already calls.  Will be phased out later.
 */
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

export default generateToken;
