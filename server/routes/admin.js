const express = require('express');
const router = express.Router();
const db = require('../db/database');
const storage = require('../services/storage-adapter');
const jobQueue = require('../services/job-queue');
const backupService = require('../services/backup-service');
const aiFactory = require('../services/ai-provider');
const { requireAdmin } = require('../middleware/auth');

// Protect all admin endpoints with requireAdmin
router.use(requireAdmin);

// 1. Overview & Analytics
router.get('/overview', (req, res) => {
  const users = db.find('users');
  const projects = db.find('projects');
  const jobs = db.find('processing_jobs');
  const exportsList = db.find('exports');
  const usage = db.find('usage');
  const storageStats = storage.getStorageStats();
  const queueStats = jobQueue.getQueueStats();
  const backupStats = backupService.getBackupStatus();
  const aiStatus = aiFactory.getStatus();

  // Aggregate most used tools
  const toolUsageMap = {};
  for (const u of usage) {
    toolUsageMap[u.tool] = (toolUsageMap[u.tool] || 0) + (u.credits_used || 1);
  }
  const mostUsedTools = Object.entries(toolUsageMap)
    .map(([tool, count]) => ({ tool, count }))
    .sort((a, b) => b.count - a.count);

  // Revenue estimation
  const plans = db.find('plans');
  const estimatedMrr = users.reduce((acc, user) => {
    const p = plans.find(plan => plan.id === user.plan_id);
    return acc + (p ? p.price_monthly : 0);
  }, 0);

  res.json({
    metrics: {
      totalUsers: users.length,
      totalProjects: projects.length,
      totalJobs: jobs.length,
      totalExports: exportsList.length,
      storageUsedMb: storageStats.totalMb,
      estimatedMrr
    },
    queue: queueStats,
    storage: storageStats,
    backup: backupStats,
    ai: aiStatus,
    mostUsedTools
  });
});

// 2. Users Management
router.get('/users', (req, res) => {
  const { search } = req.query;
  let users = db.find('users');
  if (search) {
    const q = search.toLowerCase();
    users = users.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
  }
  res.json({ users });
});

router.patch('/users/:id', (req, res) => {
  const { credits, plan_id, role, suspended } = req.body;
  const updates = {};
  if (credits !== undefined) updates.credits = parseInt(credits, 10);
  if (plan_id !== undefined) updates.plan_id = plan_id;
  if (role !== undefined) updates.role = role;
  if (suspended !== undefined) updates.suspended = Boolean(suspended);

  const updated = db.update('users', req.params.id, updates);
  if (!updated) return res.status(404).json({ error: 'User not found' });
  res.json({ user: updated });
});

// 3. Tools Management
router.get('/tools', (req, res) => {
  const tools = db.find('tool_configs');
  res.json({ tools });
});

router.patch('/tools/:id', (req, res) => {
  const { credit_cost, enabled } = req.body;
  const updates = {};
  if (credit_cost !== undefined) updates.credit_cost = parseInt(credit_cost, 10);
  if (enabled !== undefined) updates.enabled = Boolean(enabled);

  const updated = db.update('tool_configs', req.params.id, updates);
  if (!updated) return res.status(404).json({ error: 'Tool configuration not found' });
  res.json({ tool: updated });
});

// 4. Pricing Plans Management
router.get('/plans', (req, res) => {
  const plans = db.find('plans');
  res.json({ plans });
});

router.patch('/plans/:id', (req, res) => {
  const { price_monthly, credits_per_month, max_resolution, features } = req.body;
  const updates = {};
  if (price_monthly !== undefined) updates.price_monthly = parseFloat(price_monthly);
  if (credits_per_month !== undefined) updates.credits_per_month = parseInt(credits_per_month, 10);
  if (max_resolution !== undefined) updates.max_resolution = max_resolution;
  if (features !== undefined) updates.features = features;

  const updated = db.update('plans', req.params.id, updates);
  if (!updated) return res.status(404).json({ error: 'Plan not found' });
  res.json({ plan: updated });
});

// 5. Jobs Queue Monitor
router.get('/jobs', (req, res) => {
  const jobs = db.find('processing_jobs');
  res.json({ jobs: jobs.slice(-50).reverse() });
});

// 6. Manual Trigger Backup
router.post('/backup', async (req, res) => {
  const backup = await backupService.createBackup('admin_manual');
  res.json({ message: 'Backup created successfully', backup });
});

module.exports = router;
