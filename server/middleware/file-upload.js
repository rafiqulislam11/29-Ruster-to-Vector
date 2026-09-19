const multer = require('multer');
const path = require('path');
const fs = require('fs');
const config = require('../config/env');
const storage = require('../services/storage-adapter');

const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.svg'];
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
  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowedExtensions.includes(ext)) {
    return cb(new Error(`Invalid file extension: ${ext}. Allowed extensions: JPG, PNG, WEBP, SVG`), false);
  }
  if (allowedMimes.includes(file.mimetype.toLowerCase())) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid MIME type: ${file.mimetype}. Allowed: JPG, PNG, WEBP, SVG`), false);
  }
};

const upload = multer({
  storage: multerStorage,
  limits: {
    fileSize: config.storage.maxSizeMb * 1024 * 1024
  },
  fileFilter
});

/**
 * Validates binary signature / magic bytes of an uploaded image file on disk
 * @param {string} filePath
 * @param {string} declaredExt
 * @returns {{ valid: boolean, detectedFormat: string, width?: number, height?: number }}
 */
function verifyMagicBytes(filePath, declaredExt) {
  const ext = declaredExt.toLowerCase();
  const buffer = Buffer.alloc(64);
  const fd = fs.openSync(filePath, 'r');
  const bytesRead = fs.readSync(fd, buffer, 0, 64, 0);
  fs.closeSync(fd);

  if (bytesRead < 4) {
    return { valid: false, detectedFormat: 'empty/truncated' };
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
    return { valid: ext === '.png', detectedFormat: 'png' };
  }

  // JPEG: FF D8 FF
  if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) {
    return { valid: ext === '.jpg' || ext === '.jpeg', detectedFormat: 'jpeg' };
  }

  // WEBP: RIFF....WEBP
  if (buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') {
    return { valid: ext === '.webp', detectedFormat: 'webp' };
  }

  // SVG: <?xml or <svg
  const textSnippet = buffer.toString('utf8', 0, Math.min(bytesRead, 64)).trim().toLowerCase();
  if (textSnippet.startsWith('<?xml') || textSnippet.startsWith('<svg') || textSnippet.includes('<svg')) {
    return { valid: ext === '.svg', detectedFormat: 'svg' };
  }

  return { valid: false, detectedFormat: 'unknown' };
}

/**
 * Post-upload Express middleware to guarantee zero MIME spoofing
 */
function validateUploadedFiles(req, res, next) {
  const files = req.files || (req.file ? [req.file] : []);
  if (!files || files.length === 0) return next();

  for (const file of files) {
    const ext = path.extname(file.originalname).toLowerCase();
    const result = verifyMagicBytes(file.path, ext);

    if (!result.valid) {
      // Remove unsafe/spoofed file from disk immediately
      try {
        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      } catch (e) {}

      return res.status(400).json({
        error: `Security verification failed for file "${file.originalname}". File signature (${result.detectedFormat}) does not match extension (${ext}).`,
        code: 'FILE_SIGNATURE_MISMATCH'
      });
    }
  }

  next();
}

upload.validateUploadedFiles = validateUploadedFiles;
upload.verifyMagicBytes = verifyMagicBytes;

module.exports = upload;
