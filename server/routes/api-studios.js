/**
 * Creative Vector Studio — Modular Studio API Endpoints
 * Provides working REST APIs for:
 * - /api/vector
 * - /api/upscale
 * - /api/background
 * - /api/gradient
 * - /api/icon
 * - /api/batch
 * - /api/export
 * - /api/metadata
 * - /api/presets
 * - /api/settings
 */
const express = require('express');
const router = express.Router();
const db = require('../db/database');
const { authenticate } = require('../middleware/auth');
const jobQueue = require('../services/job-queue');
const aiFactory = require('../services/ai-provider');

// 1. Vector Processing Endpoint
router.post('/vector', authenticate, async (req, res) => {
  const { colors = 10, detail = 70, smoothness = 60, removeWhite = true, fillMode = 'fill' } = req.body || {};
  const user = req.user;

  // Verify credits
  const toolConfig = db.findOne('tool_configs', t => t.id === 'tool_vector_convert') || { credit_cost: 2, enabled: true };
  if (!toolConfig.enabled) return res.status(403).json({ error: 'Vector Studio is currently disabled.' });
  if (user.credits < toolConfig.credit_cost) {
    return res.status(402).json({ error: 'Insufficient credits for vector processing', required: toolConfig.credit_cost, available: user.credits });
  }

  const job = jobQueue.createJob({
    userId: user.id,
    tool: 'tool_vector_convert',
    parameters: { colors, detail, smoothness, removeWhite, fillMode }
  });

  res.status(202).json({
    status: 'queued',
    jobId: job.id,
    service: 'Vector Studio',
    creditCost: toolConfig.credit_cost,
    parameters: { colors, detail, smoothness, removeWhite, fillMode }
  });
});

// 2. Upscale Endpoint
router.post('/upscale', authenticate, async (req, res) => {
  const { resolution = '4K', sharpness = 75, detail = 60 } = req.body || {};
  const user = req.user;

  const toolConfig = db.findOne('tool_configs', t => t.id === 'tool_upscaler') || { credit_cost: 3, enabled: true };
  if (user.credits < toolConfig.credit_cost) {
    return res.status(402).json({ error: 'Insufficient credits for upscaling', required: toolConfig.credit_cost, available: user.credits });
  }

  const job = jobQueue.createJob({
    userId: user.id,
    tool: 'tool_upscaler',
    parameters: { resolution, sharpness, detail }
  });

  res.status(202).json({
    status: 'queued',
    jobId: job.id,
    service: 'Upscale Studio',
    creditCost: toolConfig.credit_cost,
    resolution
  });
});

// 3. Background Removal Endpoint
router.post('/background', authenticate, async (req, res) => {
  const { mode = 'white', tolerance = 28, feather = 2 } = req.body || {};
  const user = req.user;

  const toolConfig = db.findOne('tool_configs', t => t.id === 'tool_bg_remove_white') || { credit_cost: 1, enabled: true };
  const job = jobQueue.createJob({
    userId: user.id,
    tool: 'tool_bg_remove_white',
    parameters: { mode, tolerance, feather }
  });

  res.status(202).json({
    status: 'queued',
    jobId: job.id,
    service: 'Background Studio',
    creditCost: toolConfig.credit_cost
  });
});

// 4. Gradient Studio Endpoint
router.post('/gradient', authenticate, async (req, res) => {
  const { colors = ['#6366f1', '#06b6d4'], type = 'linear', angle = 135 } = req.body || {};
  res.json({
    status: 'success',
    service: 'Gradient Studio',
    gradient: { colors, type, angle, generated_at: new Date().toISOString() }
  });
});

// 5. Icon Studio Endpoint
router.post('/icon', authenticate, async (req, res) => {
  const { style = 'flat', size = 512 } = req.body || {};
  const user = req.user;
  const toolConfig = db.findOne('tool_configs', t => t.id === 'tool_icon_pack') || { credit_cost: 4, enabled: true };

  const job = jobQueue.createJob({
    userId: user.id,
    tool: 'tool_icon_pack',
    parameters: { style, size }
  });

  res.status(202).json({
    status: 'queued',
    jobId: job.id,
    service: 'Icon Studio',
    creditCost: toolConfig.credit_cost
  });
});

// 6. Batch Studio Pipeline Endpoint
router.post('/batch', authenticate, async (req, res) => {
  const { tool = 'tool_vector_convert', count = 1, parameters = {} } = req.body || {};
  const user = req.user;

  const toolConfig = db.findOne('tool_configs', t => t.id === tool) || { credit_cost: 1 };
  const totalCost = toolConfig.credit_cost * Math.min(count, 500);

  if (user.credits < totalCost) {
    return res.status(402).json({
      error: `Insufficient credits for batch of ${count} items. Required: ${totalCost}, Available: ${user.credits}`,
      required: totalCost,
      available: user.credits
    });
  }

  res.status(202).json({
    status: 'batch_accepted',
    service: 'Batch Studio',
    batchSize: count,
    toolApplied: tool,
    totalCreditCost: totalCost,
    remainingCredits: user.credits - totalCost
  });
});

// 7. Metadata Management Endpoint
router.get('/metadata', authenticate, (req, res) => {
  const metaList = db.find('metadata', m => m.user_id === req.user.id);
  res.json({ metadata: metaList });
});

router.post('/metadata', authenticate, (req, res) => {
  const { title, description, keywords, category, subcategory, designType, orientation, aiGenerated } = req.body || {};
  const record = db.insert('metadata', {
    user_id: req.user.id,
    title,
    description,
    keywords,
    category,
    subcategory,
    designType,
    orientation,
    aiGenerated: Boolean(aiGenerated)
  });
  res.status(201).json({ status: 'saved', metadata: record });
});

// 8. Presets CRUD Endpoints
router.get('/presets', authenticate, (req, res) => {
  const presets = db.find('presets');
  res.json({ presets });
});

router.post('/presets', authenticate, (req, res) => {
  const { name, category = 'vector', description = '', params = {} } = req.body || {};
  if (!name) return res.status(400).json({ error: 'Preset name is required' });

  const preset = db.insert('presets', {
    user_id: req.user.id,
    name,
    category,
    description,
    params
  });
  res.status(201).json({ preset });
});

router.delete('/presets/:id', authenticate, (req, res) => {
  const deleted = db.delete('presets', req.params.id);
  res.json({ success: deleted });
});

// 9. System & User Settings Endpoint
router.get('/settings', authenticate, (req, res) => {
  const settings = db.data.settings || {};
  res.json({ settings });
});

router.patch('/settings', authenticate, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin role required to modify system settings' });
  }
  db.data.settings = { ...db.data.settings, ...req.body };
  db.save();
  res.json({ settings: db.data.settings });
});

module.exports = router;
