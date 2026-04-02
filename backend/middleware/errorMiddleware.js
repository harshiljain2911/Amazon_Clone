/**
 * Global error handling middleware.
 * Must be registered AFTER all routes in server.js with:
 *   app.use(notFound);
 *   app.use(errorHandler);
 */

/* ── 404 handler ── */
export const notFound = (req, res, next) => {
  const error = new Error(`Not Found — ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/* ── Centralised error responder ── */
export const errorHandler = (err, req, res, next) => {
  // Express 5 sometimes wraps thrown strings; normalise
  const message = err.message || 'Internal Server Error';

  // If res.statusCode was set explicitly (e.g. res.status(400)) keep it,
  // otherwise default to 500
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  // Mongoose CastError → invalid ObjectId → 404
  if (err.name === 'CastError') statusCode = 404;

  // Mongoose duplicate key
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return res.status(statusCode).json({
      success: false,
      message: `Duplicate value for ${field}. Please use a different value.`,
    });
  }

  // Mongoose ValidationError
  if (err.name === 'ValidationError') {
    statusCode = 400;
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(statusCode).json({
      success: false,
      message: messages.join('. '),
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError')  { statusCode = 401; }
  if (err.name === 'TokenExpiredError')  { statusCode = 401; }

  res.status(statusCode).json({
    success: false,
    message,
    // Only expose stack in development
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
