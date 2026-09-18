const db = require('../db/database');

/**
 * Authentication Middleware
 * Resolves user from Authorization header or custom header 'x-user-id'
 */
function authenticate(req, res, next) {
  // Allow authorization header or x-user-id for easy dev testing & session handling
  const authHeader = req.headers['authorization'];
  let userId = req.headers['x-user-id'];

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    // If token starts with usr_, extract it, or decode simulated token
    if (token.startsWith('usr_')) {
      userId = token;
    } else {
      userId = token;
    }
  }

  // Fallback to demo pro user if not specified in development
  if (!userId) {
    userId = 'usr_pro';
  }

  const user = db.findById('users', userId);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized: User not found' });
  }

  req.user = user;
  next();
}

/**
 * Role-based Authorization: Admin only
 */
function requireAdmin(req, res, next) {
  authenticate(req, res, () => {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: Admin privileges required' });
    }
    next();
  });
}

module.exports = {
  authenticate,
  requireAdmin
};
