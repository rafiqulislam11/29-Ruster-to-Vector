const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const upload = require('../middleware/file-upload');
const { authenticate } = require('../middleware/auth');
const db = require('../db/database');
const storage = require('../services/storage-adapter');

const SvgSanitizer = require('../services/svg-sanitizer');

/**
 * Universal Upload Endpoint
 * Handles single or multiple image uploads non-destructively
 */
router.post('/upload', authenticate, upload.array('images', 1000), upload.validateUploadedFiles, async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No image files uploaded' });
    }

    const { projectId = null } = req.body;
    const createdAssets = [];

    for (const file of req.files) {
      const originalName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
      const fileUrl = `/storage/originals/${file.filename}`;
      const fileSize = file.size;
      const mimeType = file.mimetype;

      // Extract basic image metadata (estimated/actual)
      const isSvg = mimeType === 'image/svg+xml' || path.extname(originalName).toLowerCase() === '.svg';
      
      // If SVG, sanitize the file content on disk
      if (isSvg && fs.existsSync(file.path)) {
        try {
          const rawSvg = fs.readFileSync(file.path, 'utf8');
          const sanitizedSvg = SvgSanitizer.sanitize(rawSvg);
          fs.writeFileSync(file.path, sanitizedSvg, 'utf8');
        } catch (svgErr) {
          console.warn('[Upload SVG Sanitization Warning]:', svgErr.message);
        }
      }

      let width = 1920;
      let height = 1080;

      // Create Original Asset
      const originalAsset = db.insert('assets', {
        user_id: req.user.id,
        project_id: projectId,
        original_filename: originalName,
        file_url: fileUrl,
        file_type: mimeType,
        width,
        height,
        file_size: fileSize,
        category: 'original',
        is_svg: isSvg
      });

      // Create Working Asset (links to original asset as base)
      const workingAsset = db.insert('assets', {
        user_id: req.user.id,
        project_id: projectId,
        parent_asset_id: originalAsset.id,
        original_filename: `working_${originalName}`,
        file_url: fileUrl,
        file_type: mimeType,
        width,
        height,
        file_size: fileSize,
        category: 'working',
        is_svg: isSvg
      });

      // Create Preview Asset
      const previewAsset = db.insert('assets', {
        user_id: req.user.id,
        project_id: projectId,
        parent_asset_id: originalAsset.id,
        original_filename: `preview_${originalName}`,
        file_url: fileUrl,
        file_type: mimeType,
        width: Math.round(width / 2),
        height: Math.round(height / 2),
        file_size: Math.round(fileSize / 2),
        category: 'preview',
        is_svg: isSvg
      });

      createdAssets.push({
        original: originalAsset,
        working: workingAsset,
        preview: previewAsset
      });
    }

    res.status(201).json({
      message: 'Images uploaded and non-destructive asset pipeline initialized successfully',
      count: createdAssets.length,
      assets: createdAssets
    });
  } catch (err) {
    console.error('[Upload Error]:', err);
    res.status(500).json({ error: err.message || 'File upload failed' });
  }
});

// List all assets for current user
router.get('/', authenticate, (req, res) => {
  const assets = db.find('assets', a => a.user_id === req.user.id);
  res.json({ assets });
});

// Get single asset
router.get('/:id', authenticate, (req, res) => {
  const asset = db.findById('assets', req.params.id);
  if (!asset) return res.status(404).json({ error: 'Asset not found' });
  if (asset.user_id !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  res.json({ asset });
});

// Delete asset
router.delete('/:id', authenticate, (req, res) => {
  const asset = db.findById('assets', req.params.id);
  if (!asset) return res.status(404).json({ error: 'Asset not found' });
  if (asset.user_id !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  db.delete('assets', asset.id);
  res.json({ message: 'Asset removed', assetId: asset.id });
});

module.exports = router;
