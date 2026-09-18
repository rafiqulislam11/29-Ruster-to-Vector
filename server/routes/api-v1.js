const express = require('express');
const crypto = require('crypto');
const db = require('../db/database');
const aiFactory = require('../services/ai-provider');

const router = express.Router();

// Memory store for demo developer API keys
const apiKeys = new Map([
  ['cf_live_sample_developer_key_999', { id: 'key_1', name: 'Default Development Key', tier: 'Pro (50,000 req/mo)', created: new Date().toISOString(), usage: 142 }]
]);

/**
 * Developer API Key verification middleware
 */
const requireApiKey = (req, res, next) => {
  const authHeader = req.headers['authorization'] || req.headers['x-api-key'];
  const key = authHeader ? authHeader.replace(/^Bearer\s+/i, '').trim() : null;

  if (!key) {
    return res.status(401).json({
      error: 'Unauthorized: Missing API key. Pass via Authorization: Bearer <key> or X-API-Key: <key>',
      docs: '/api/v1/docs'
    });
  }

  const keyData = apiKeys.get(key);
  if (!keyData && key !== 'cf_live_sample_developer_key_999') {
    return res.status(403).json({
      error: 'Forbidden: Invalid API key',
      docs: '/api/v1/docs'
    });
  }

  if (keyData) {
    keyData.usage++;
    req.apiKeyData = keyData;
  }
  next();
};

/**
 * GET /api/v1/keys — List developer API keys
 */
router.get('/keys', (req, res) => {
  const keysList = Array.from(apiKeys.entries()).map(([key, data]) => ({
    keyPreview: `${key.slice(0, 12)}...${key.slice(-4)}`,
    ...data
  }));
  res.json({ keys: keysList });
});

/**
 * POST /api/v1/keys — Generate a new Developer API Key
 */
router.post('/keys', (req, res) => {
  const { name = 'Production App Key', tier = 'pro' } = req.body || {};
  const newKey = `cf_live_${crypto.randomBytes(16).toString('hex')}`;
  
  const keyObj = {
    id: `key_${Date.now()}`,
    name,
    tier: tier === 'enterprise' ? 'Enterprise (Unlimited)' : 'Pro (50,000 req/mo)',
    created: new Date().toISOString(),
    usage: 0
  };

  apiKeys.set(newKey, keyObj);

  res.status(201).json({
    message: 'Developer API Key successfully generated',
    apiKey: newKey,
    keyMetadata: keyObj
  });
});

/**
 * POST /api/v1/vectorize — Public Developer Vectorizer API
 */
router.post('/vectorize', requireApiKey, async (req, res) => {
  const { colors = 8, detail = 60, smoothness = 60, removeWhite = true } = req.body || {};

  const vectorResult = await aiFactory.vector.process({ colors, detail, smoothness });

  res.json({
    status: 'success',
    engine: 'Potrace / Bézier Tracing Engine',
    format: 'svg',
    resolutionPpi: 300,
    parameters: { colors, detail, smoothness, removeWhite },
    meta: vectorResult
  });
});

/**
 * POST /api/v1/upscale — Public Developer AI Upscaler API
 */
router.post('/upscale', requireApiKey, async (req, res) => {
  const { resolution = '4K', sharpness = 80, noiseReduction = 30 } = req.body || {};

  const upscaleResult = await aiFactory.upscale.process({ resolution, sharpness, noiseReduction });

  res.json({
    status: 'success',
    resolution,
    printResolutionPpi: 300,
    parameters: { sharpness, noiseReduction },
    result: upscaleResult
  });
});

/**
 * POST /api/v1/remove-bg — Public Developer Background Removal API
 */
router.post('/remove-bg', requireApiKey, async (req, res) => {
  const { tolerance = 25, feather = 2 } = req.body || {};

  const bgResult = await aiFactory.bgRemoval.process({ tolerance, feather });

  res.json({
    status: 'success',
    engine: 'Alpha Luminance & Chroma Distance Keyer',
    format: 'png',
    parameters: { tolerance, feather },
    result: bgResult
  });
});

/**
 * GET /api/v1/presets — Public Studio Presets
 */
router.get('/presets', (req, res) => {
  res.json({
    vector: ['Minimalist Icon', 'Vintage Stamp', 'High-Contrast Logo', 'Technical Blueprint', 'Pop Art'],
    grain: ['Kodak Portra 400', 'Ilford HP5+ B&W', 'CineStill 800T', 'Vintage Super 8', 'Fuji Velvia 50'],
    glass: ['Frosted Fluted', 'Diamond Prism', 'Liquid Ripple', 'Cyber Wave', 'Shattered Crystal'],
    resolutionStandards: ['300 PPI Print Master', '600 PPI Ultra-HD Fine Art', '4K Digital']
  });
});

module.exports = router;
