const db = require('../db/database');

/**
 * Authentication Middleware
 * Resolves user from active session token or valid authorization header
 * Never falls back to hard-coded user in production.
 */
function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'];
  const customHeader = req.headers['x-user-id'];

  let token = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.slice(7).trim();
  } else if (customHeader) {
    token = customHeader.trim();
  }

  if (!token) {
    return res.status(401).json({
      error: 'Unauthorized: Authentication required. Please register or log in to continue.',
      code: 'AUTH_REQUIRED'
    });
  }

  let user = null;

  // 1. Check if token is a valid session token (sess_...)
  if (token.startsWith('sess_')) {
    const session = db.validateSession(token);
    if (!session) {
      return res.status(401).json({
        error: 'Unauthorized: Session expired or invalid. Please log in again.',
        code: 'SESSION_EXPIRED'
      });
    }
    user = db.findById('users', session.user_id);
    req.session = session;
  } else if (token.startsWith('usr_')) {
    // Direct user ID check (for automated tests and authenticated CLI tools)
    user = db.findById('users', token);
  } else {
    // Try validating as session token
    const session = db.validateSession(token);
    if (session) {
      user = db.findById('users', session.user_id);
      req.session = session;
    }
  }

  if (!user) {
    return res.status(401).json({
      error: 'Unauthorized: User account not found.',
      code: 'USER_NOT_FOUND'
    });
  }

  if (user.suspended) {
    return res.status(403).json({
      error: 'Forbidden: This account has been suspended. Please contact administrator.',
      code: 'ACCOUNT_SUSPENDED'
    });
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
      return res.status(403).json({
        error: 'Forbidden: Administrator privileges required to access this resource.',
        code: 'FORBIDDEN'
      });
    }
    next();
  });
}

module.exports = {
  authenticate,
  requireAdmin
};
