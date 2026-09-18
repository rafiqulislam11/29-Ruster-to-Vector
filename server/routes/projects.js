const express = require('express');
const router = express.Router();
const db = require('../db/database');
const { authenticate } = require('../middleware/auth');

// List all projects for authenticated user
router.get('/', authenticate, (req, res) => {
  const projects = db.find('projects', p => p.user_id === req.user.id);
  // Attach latest asset thumbnail and metrics
  const enhanced = projects.map(proj => {
    const assets = db.find('assets', a => a.project_id === proj.id);
    const jobs = db.find('processing_jobs', j => j.project_id === proj.id);
    const exportsList = db.find('exports', e => e.project_id === proj.id);
    const primaryAsset = assets.find(a => a.category === 'original') || assets[0] || null;

    return {
      ...proj,
      assetCount: assets.length,
      jobCount: jobs.length,
      exportCount: exportsList.length,
      thumbnail: primaryAsset ? primaryAsset.file_url : null,
      primaryAssetId: primaryAsset ? primaryAsset.id : null,
      lastToolUsed: jobs.length > 0 ? jobs[jobs.length - 1].tool : null
    };
  });

  res.json({ projects: enhanced });
});

// Create new project
router.post('/', authenticate, (req, res) => {
  const { name = 'Untitled Project', initialAssetId = null } = req.body;

  const project = db.insert('projects', {
    user_id: req.user.id,
    name,
    active_asset_id: initialAssetId,
    active_tool: 'tool_gradient_extract',
    tool_settings: {},
    history: [
      {
        action: 'Created project',
        timestamp: new Date().toISOString()
      }
    ]
  });

  // If initial asset is linked, link it to this project
  if (initialAssetId) {
    db.update('assets', initialAssetId, { project_id: project.id });
  }

  res.status(201).json({ project });
});

// Get single project with all assets and jobs
router.get('/:id', authenticate, (req, res) => {
  const project = db.findById('projects', req.params.id);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }
  if (project.user_id !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Unauthorized to view this project' });
  }

  const assets = db.find('assets', a => a.project_id === project.id);
  const jobs = db.find('processing_jobs', j => j.project_id === project.id);
  const exportsList = db.find('exports', e => e.project_id === project.id);

  res.json({
    project,
    assets,
    jobs,
    exports: exportsList
  });
});

// Update / Rename project / Save settings
router.patch('/:id', authenticate, (req, res) => {
  const project = db.findById('projects', req.params.id);
  if (!project) return res.status(404).json({ error: 'Project not found' });
  if (project.user_id !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const { name, tool_settings, active_tool, active_asset_id } = req.body;
  const updates = {};
  if (name !== undefined) updates.name = name;
  if (tool_settings !== undefined) updates.tool_settings = tool_settings;
  if (active_tool !== undefined) updates.active_tool = active_tool;
  if (active_asset_id !== undefined) updates.active_asset_id = active_asset_id;

  const updated = db.update('projects', project.id, updates);
  res.json({ project: updated });
});

// Duplicate project
router.post('/:id/duplicate', authenticate, (req, res) => {
  const original = db.findById('projects', req.params.id);
  if (!original) return res.status(404).json({ error: 'Original project not found' });

  const duplicated = db.insert('projects', {
    user_id: req.user.id,
    name: `${original.name} (Copy)`,
    active_tool: original.active_tool,
    tool_settings: original.tool_settings || {},
    history: [
      {
        action: `Duplicated from ${original.name}`,
        timestamp: new Date().toISOString()
      }
    ]
  });

  // Duplicate assets referencing the original
  const assets = db.find('assets', a => a.project_id === original.id);
  for (const a of assets) {
    db.insert('assets', {
      user_id: req.user.id,
      project_id: duplicated.id,
      original_filename: a.original_filename,
      file_url: a.file_url,
      file_type: a.file_type,
      width: a.width,
      height: a.height,
      file_size: a.file_size,
      category: a.category
    });
  }

  res.status(201).json({ project: duplicated });
});

// Delete project
router.delete('/:id', authenticate, (req, res) => {
  const project = db.findById('projects', req.params.id);
  if (!project) return res.status(404).json({ error: 'Project not found' });
  if (project.user_id !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  db.delete('projects', project.id);
  // Note: assets & jobs can be preserved or cleaned up
  res.json({ message: 'Project deleted successfully', projectId: project.id });
});

module.exports = router;
