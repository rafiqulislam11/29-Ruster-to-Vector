const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const jobQueue = require('../services/job-queue');
const db = require('../db/database');

/**
 * Generic processor dispatcher
 */
function handleProcessRequest(toolName, req, res) {
  const { projectId, assetId, parameters = {}, inputUrl } = req.body;

  // Credit validation
  const user = req.user;
  const toolConfig = db.findOne('tool_configs', t => t.name.toLowerCase().includes(toolName.toLowerCase())) || { credit_cost: 1, enabled: true };

  if (!toolConfig.enabled) {
    return res.status(403).json({ error: `The tool '${toolName}' is currently disabled by administrator.` });
  }

  if (user.credits < toolConfig.credit_cost) {
    return res.status(402).json({
      error: `Insufficient credits. This tool requires ${toolConfig.credit_cost} credits, but you have ${user.credits} remaining.`,
      required: toolConfig.credit_cost,
      available: user.credits
    });
  }

  // Create & Enqueue Job
  const job = jobQueue.createJob({
    userId: user.id,
    projectId: projectId || null,
    assetId: assetId || null,
    tool: toolName,
    parameters,
    inputUrl: inputUrl || ''
  });

  res.status(202).json({
    message: `Job ${job.id} queued successfully for ${toolName}`,
    jobId: job.id,
    status: job.status,
    creditCost: toolConfig.credit_cost,
    remainingCredits: user.credits - toolConfig.credit_cost
  });
}

// 1. Image → Gradient / Gradient Maker
router.post('/gradient', authenticate, (req, res) => {
  handleProcessRequest('tool_gradient_extract', req, res);
});

// 2. AI Image Upscaler
router.post('/upscale', authenticate, (req, res) => {
  handleProcessRequest('tool_upscaler', req, res);
});

// 3. Film Grain
router.post('/film-grain', authenticate, (req, res) => {
  handleProcessRequest('tool_film_grain', req, res);
});

// 4. Fractal Glass (Presets 1, 2, 3, 3.1, 3.2, 3.3)
router.post('/fractal-glass', authenticate, (req, res) => {
  const preset = req.body.parameters?.preset || '1';
  handleProcessRequest(`tool_fractal_glass_${preset.replace('.', '_')}`, req, res);
});

// 5. Image → Vector / Vector Trace
router.post('/vector', authenticate, (req, res) => {
  handleProcessRequest('tool_vector_convert', req, res);
});

// 6. Remove White Background / Transparent Background
router.post('/remove-background', authenticate, (req, res) => {
  handleProcessRequest('tool_bg_remove_white', req, res);
});

// 7. Icon Sheet Maker
router.post('/icon-sheet', authenticate, (req, res) => {
  const preset = req.body.parameters?.layout || '1';
  handleProcessRequest(`tool_icon_sheet_${preset}`, req, res);
});

// 8. Icon Pack Maker
router.post('/icon-pack', authenticate, (req, res) => {
  handleProcessRequest('tool_icon_pack', req, res);
});

module.exports = router;
