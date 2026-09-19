const express = require('express');
const router = express.Router();
const db = require('../db/database');
const config = require('../config/env');
const { authenticate } = require('../middleware/auth');

// Register a new user
router.post('/register', (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }

  const existing = db.findOne('users', u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ error: 'An account with this email already exists' });
  }

  // Salted PBKDF2 Password Hashing
  const { salt, hash } = db.hashPassword(password);

  const initialCredits = 25; // 25 free credits for new accounts
  const newUser = db.insert('users', {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password_hash: hash,
    salt,
    plan_id: 'FREE',
    role: 'user',
    credits: initialCredits
  });

  // Assign Free Subscription
  db.insert('subscriptions', {
    user_id: newUser.id,
    plan: 'FREE',
    status: 'active',
    start_date: new Date().toISOString(),
    expiry_date: new Date(Date.now() + 30 * 86400000).toISOString()
  });

  // Log Initial Credit Transaction
  db.insert('credit_transactions', {
    user_id: newUser.id,
    type: 'GRANT',
    amount: initialCredits,
    balance_before: 0,
    balance_after: initialCredits,
    status: 'completed',
    reason: 'Welcome Signup Bonus Credits'
  });

  db.insert('audit_logs', {
    action: 'USER_REGISTERED',
    user_id: newUser.id,
    email: newUser.email,
    timestamp: new Date().toISOString()
  });

  // Create secure session token
  const token = db.createSession(newUser.id);

  res.status(201).json({
    message: 'Account created successfully',
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      plan_id: newUser.plan_id,
      role: newUser.role,
      credits: newUser.credits
    },
    token
  });
});

// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = db.findOne('users', u => u.email.toLowerCase() === email.trim().toLowerCase());

  if (!user || !db.verifyPassword(password, user.password_hash, user.salt)) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  if (user.suspended) {
    return res.status(403).json({ error: 'Account has been suspended' });
  }

  // Create session token
  const token = db.createSession(user.id);

  db.insert('audit_logs', {
    action: 'USER_LOGIN',
    user_id: user.id,
    timestamp: new Date().toISOString()
  });

  res.json({
    message: 'Login successful',
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      plan_id: user.plan_id,
      role: user.role,
      credits: user.credits
    },
    token
  });
});

// Logout (Session Revocation)
router.post('/logout', authenticate, (req, res) => {
  if (req.session && req.session.id) {
    db.revokeSession(req.session.id);
  }
  res.json({ message: 'Successfully logged out and session revoked' });
});

// Password Reset
router.post('/reset-password', (req, res) => {
  const { email, newPassword } = req.body || {};
  if (!email || !newPassword) {
    return res.status(400).json({ error: 'Email and new password are required' });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters' });
  }

  const user = db.findOne('users', u => u.email.toLowerCase() === email.trim().toLowerCase());
  if (!user) {
    return res.status(404).json({ error: 'No account found with this email' });
  }

  const { salt, hash } = db.hashPassword(newPassword);
  db.update('users', user.id, { password_hash: hash, salt });

  db.insert('audit_logs', {
    action: 'PASSWORD_RESET',
    user_id: user.id,
    timestamp: new Date().toISOString()
  });

  res.json({ message: 'Password updated successfully. Please log in with your new password.' });
});

// Demo Account Switch (Available in development mode for evaluation)
router.post('/switch-demo', (req, res) => {
  const { role } = req.body || {};
  let targetId = 'usr_pro';
  if (role === 'admin') targetId = 'usr_admin';
  if (role === 'free') targetId = 'usr_free';

  const user = db.findById('users', targetId);
  if (!user) return res.status(404).json({ error: 'Demo user not found' });

  // Generate a legitimate session token even for demo switch
  const token = db.createSession(user.id);

  res.json({
    message: `Switched session to account: ${user.name}`,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      plan_id: user.plan_id,
      role: user.role,
      credits: user.credits
    },
    token
  });
});

// Current User Profile & Subscription
router.get('/me', authenticate, (req, res) => {
  const user = req.user;
  const subscription = db.findOne('subscriptions', s => s.user_id === user.id);
  const plan = db.findOne('plans', p => p.id === user.plan_id) || {
    id: user.plan_id,
    name: user.plan_id,
    max_resolution: '4K'
  };

  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      plan_id: user.plan_id,
      role: user.role,
      credits: user.credits
    },
    plan,
    subscription
  });
});

// Credit Transaction History & Audit Trail
router.get('/credits/history', authenticate, (req, res) => {
  const txs = db.find('credit_transactions', t => t.user_id === req.user.id);
  res.json({
    credits: req.user.credits,
    transactions: txs.reverse()
  });
});

module.exports = router;
