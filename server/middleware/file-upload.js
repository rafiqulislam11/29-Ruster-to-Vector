const multer = require('multer');
const path = require('path');
const config = require('../config/env');
const storage = require('../services/storage-adapter');

const allowedMimes = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/svg+xml'
];

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, storage.subdirs.originals);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueSuffix = `${Date.now()}_${Math.round(Math.random() * 1e6)}`;
    cb(null, `${base}_${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (allowedMimes.includes(file.mimetype.toLowerCase())) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file format: ${file.mimetype}. Allowed: JPG, PNG, WEBP, SVG`), false);
  }
};

const upload = multer({
  storage: multerStorage,
  limits: {
    fileSize: config.storage.maxSizeMb * 1024 * 1024
  },
  fileFilter
});

module.exports = upload;
