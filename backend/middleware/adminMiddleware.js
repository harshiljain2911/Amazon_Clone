/**
 * Admin role guard.
 * Must be used AFTER protect middleware.
 *
 * Usage:
 *   router.delete('/:id', protect, isAdmin, deleteProduct);
 */
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    return next();
  }
  res.status(403);
  const err = new Error('Access denied — admin only');
  next(err);
};
