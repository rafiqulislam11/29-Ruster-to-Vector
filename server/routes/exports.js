const express = require('express');
const router = express.Router();
const db = require('../db/database');
const storage = require('../services/storage-adapter');
const { authenticate } = require('../middleware/auth');

// List user exports
router.get('/', authenticate, (req, res) => {
  const exportsList = db.find('exports', e => e.user_id === req.user.id);
  res.json({ exports: exportsList.reverse() });
});

// Save client-generated asset / export file to server storage
router.post('/save-asset', authenticate, async (req, res) => {
  try {
    const { filename, dataBase64, format, resolution = 'original', projectId = null, jobId = null } = req.body;

    if (!dataBase64 || !filename) {
      return res.status(400).json({ error: 'Filename and dataBase64 are required' });
    }

    // Extract base64 payload
    const matches = dataBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let buffer;
    if (matches && matches.length === 3) {
      buffer = Buffer.from(matches[2], 'base64');
    } else {
      buffer = Buffer.from(dataBase64, 'base64');
    }

    const category = format === 'zip' ? 'zips' : 'exports';
    const saved = await storage.saveFile(category, filename, buffer);

    const exportRecord = db.insert('exports', {
      user_id: req.user.id,
      project_id: projectId,
      job_id: jobId,
      filename,
      format,
      resolution,
      file_url: saved.fileUrl,
      file_size: saved.size
    });

    res.status(201).json({
      message: 'Export file saved successfully to server storage',
      export: exportRecord
    });
  } catch (err) {
    console.error('[Export Error]:', err);
    res.status(500).json({ error: err.message || 'Failed to save export file' });
  }
});

module.exports = router;
