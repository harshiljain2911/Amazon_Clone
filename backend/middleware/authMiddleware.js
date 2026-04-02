import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

/**
 * protect — require a valid JWT.
 * Accepts token from:
 *   1. Authorization: Bearer <token>   (existing frontend behaviour)
 *   2. req.cookies.accessToken         (new httpOnly cookie flow)
 */
export const protect = async (req, res, next) => {
  let token;

  // 1. Bearer header
  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }
  // 2. HttpOnly cookie
  else if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    res.status(401);
    return next(new Error('Not authorized — no token'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password -refreshToken');
    if (!req.user) {
      res.status(401);
      return next(new Error('User not found'));
    }
    next();
  } catch (err) {
    res.status(401);
    next(new Error('Not authorized — token invalid or expired'));
  }
};

/**
 * optionalAuth — attach user if token provided, but don't block if missing.
 */
export const optionalAuth = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password -refreshToken');
    } catch {
      // silent — optional auth doesn't block
    }
  }
  next();
};
