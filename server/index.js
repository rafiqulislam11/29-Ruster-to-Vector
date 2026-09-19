const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const config = require('./config/env');
const storage = require('./services/storage-adapter');

const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const assetRoutes = require('./routes/assets');
const processRoutes = require('./routes/process');
const jobRoutes = require('./routes/jobs');
const exportRoutes = require('./routes/exports');
const adminRoutes = require('./routes/admin');
const apiV1Routes = require('./routes/api-v1');
const aiFactory = require('./services/ai-provider');
const db = require('./db/database');

const app = express();

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id']
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static Storage serving
app.use('/storage', express.static(path.resolve(process.cwd(), config.storage.localDir)));

// Serve Client static build if present
const clientDist = path.resolve(process.cwd(), 'client/dist');
app.use(express.static(clientDist));

const apiStudiosRoutes = require('./routes/api-studios');

// Maintenance mode check middleware
app.use('/api', (req, res, next) => {
  if (req.path === '/health' || req.path === '/auth/login' || req.path.startsWith('/admin')) {
    return next();
  }
  const isMaintenance = db.data?.settings?.maintenance_mode;
  if (isMaintenance && req.user?.role !== 'admin') {
    return res.status(503).json({ error: 'System is currently in maintenance mode. Please try again shortly.' });
  }
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/process', processRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/exports', exportRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/v1', apiV1Routes);
app.use('/api', apiStudiosRoutes);

// General Public Health & Meta Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    application: 'CreativeForge AI - AI Image • Gradient • Glass • Vector • Icon Studio',
    version: '1.0.0',
    mode: config.nodeEnv,
    aiProvider: aiFactory.getStatus(),
    timestamp: new Date().toISOString()
  });
});

// Tool list public endpoint
app.get('/api/tools', (req, res) => {
  const tools = db.find('tool_configs');
  res.json({ tools });
});

// Plans public endpoint
app.get('/api/plans', (req, res) => {
  const plans = db.find('plans');
  res.json({ plans });
});

// SPA wildcard fallback
app.use((req, res, next) => {
  if (req.method !== 'GET' || req.path.startsWith('/api') || req.path.startsWith('/storage')) {
    return next();
  }
  const indexPath = path.resolve(process.cwd(), 'client/dist/index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.send('CreativeForge AI API is active. Build frontend via npm run build.');
  }
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Server Error]:', err);
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || 'An unexpected error occurred during processing',
    code: err.code || 'SERVER_ERROR'
  });
});

const PORT = config.port;
const server = app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` CreativeForge AI Engine & API Server is running!`);
  console.log(` Port: http://localhost:${PORT}`);
  console.log(` Storage Path: ${path.resolve(process.cwd(), config.storage.localDir)}`);
  console.log(` AI Provider Mode: ${aiFactory.getStatus().mode}`);
  console.log(`====================================================`);
});

module.exports = { app, server };
