const express = require('express');
const router = express.Router();
const db = require('../db/database');
const { authenticate } = require('../middleware/auth');

// Register
router.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  const existing = db.findOne('users', u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ error: 'An account with this email already exists' });
  }

  const newUser = db.insert('users', {
    name,
    email,
    password_hash: password, // In production, bcrypt hash
    plan_id: 'FREE',
    role: 'user',
    credits: 15
  });

  // Assign Free Subscription
  db.insert('subscriptions', {
    user_id: newUser.id,
    plan: 'FREE',
    status: 'active',
    start_date: new Date().toISOString(),
    expiry_date: new Date(Date.now() + 30 * 86400000).toISOString()
  });

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
    token: newUser.id
  });
});

// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = db.findOne('users', u => u.email.toLowerCase() === email?.toLowerCase());

  if (!user || user.password_hash !== password) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

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
    token: user.id
  });
});

// Quick Switch Demo Account
router.post('/switch-demo', (req, res) => {
  const { role } = req.body; // 'admin' | 'pro' | 'free'
  let targetId = 'usr_pro';
  if (role === 'admin') targetId = 'usr_admin';
  if (role === 'free') targetId = 'usr_free';

  const user = db.findById('users', targetId);
  if (!user) return res.status(404).json({ error: 'User demo not found' });

  res.json({
    message: `Switched to demo account: ${user.name}`,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      plan_id: user.plan_id,
      role: user.role,
      credits: user.credits
    },
    token: user.id
  });
});

// Current User Profile
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

module.exports = router;
