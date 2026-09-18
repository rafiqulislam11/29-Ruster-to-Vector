const express = require('express');
const router = express.Router();
const db = require('../db/database');
const { authenticate } = require('../middleware/auth');
const jobQueue = require('../services/job-queue');

// List jobs for current user
router.get('/', authenticate, (req, res) => {
  const jobs = db.find('processing_jobs', j => j.user_id === req.user.id);
  res.json({ jobs: jobs.reverse() });
});

// Get specific job status
router.get('/:id', authenticate, (req, res) => {
  const job = db.findById('processing_jobs', req.params.id);
  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }

  if (job.user_id !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  res.json({ job });
});

// Cancel a job
router.post('/:id/cancel', authenticate, (req, res) => {
  const job = db.findById('processing_jobs', req.params.id);
  if (!job) return res.status(404).json({ error: 'Job not found' });
  if (job.user_id !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const cancelled = jobQueue.cancelJob(job.id);
  res.json({ message: 'Job cancellation requested', success: cancelled });
});

module.exports = router;
