const fs = require('fs');
const path = require('path');
const config = require('../config/env');

class StorageAdapter {
  constructor() {
    this.driver = config.storage.driver;
    this.baseDir = path.resolve(process.cwd(), config.storage.localDir);
    this.subdirs = {
      originals: path.join(this.baseDir, 'originals'),
      previews: path.join(this.baseDir, 'previews'),
      processed: path.join(this.baseDir, 'processed'),
      exports: path.join(this.baseDir, 'exports'),
      zips: path.join(this.baseDir, 'zips'),
      backups: path.join(this.baseDir, 'backups')
    };
    this.initDirectories();
  }

  initDirectories() {
    for (const dir of Object.values(this.subdirs)) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    }
  }

  /**
   * Save a buffer or stream to storage
   * @param {string} category 'originals' | 'previews' | 'processed' | 'exports' | 'zips'
   * @param {string} filename target file name
   * @param {Buffer|string} data binary data or string (e.g. SVG)
   * @returns {Promise<{fileUrl: string, filePath: string, size: number}>}
   */
  async saveFile(category, filename, data) {
    const targetDir = this.subdirs[category] || this.subdirs.processed;
    const sanitizedName = filename.replace(/[^a-zA-Z0-9_.-]/g, '_');
    const uniqueName = `${Date.now()}_${sanitizedName}`;
    const filePath = path.join(targetDir, uniqueName);

    if (this.driver === 'local') {
      fs.writeFileSync(filePath, data);
      const stats = fs.statSync(filePath);
      const relativeUrl = `/storage/${category}/${uniqueName}`;
      return {
        fileUrl: relativeUrl,
        filePath,
        size: stats.size
      };
    } else {
      // Plug-in point for S3 or cloud object store
      console.log(`[StorageAdapter] Cloud storage (${this.driver}) upload stub for ${uniqueName}`);
      fs.writeFileSync(filePath, data);
      return {
        fileUrl: `/storage/${category}/${uniqueName}`,
        filePath,
        size: data.length
      };
    }
  }

  /**
   * Get absolute path for a stored file
   */
  getFilePath(category, filename) {
    const targetDir = this.subdirs[category] || this.subdirs.processed;
    return path.join(targetDir, filename);
  }

  /**
   * Delete file
   */
  deleteFile(category, filename) {
    const filePath = this.getFilePath(category, filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  }

  /**
   * Get storage usage statistics
   */
  getStorageStats() {
    let totalBytes = 0;
    const statsByCategory = {};

    for (const [cat, dir] of Object.entries(this.subdirs)) {
      let catBytes = 0;
      let catCount = 0;
      if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir);
        for (const file of files) {
          const p = path.join(dir, file);
          try {
            const st = fs.statSync(p);
            if (st.isFile()) {
              catBytes += st.size;
              catCount++;
            }
          } catch (e) {}
        }
      }
      statsByCategory[cat] = { sizeBytes: catBytes, fileCount: catCount };
      totalBytes += catBytes;
    }

    return {
      totalBytes,
      totalMb: +(totalBytes / (1024 * 1024)).toFixed(2),
      categories: statsByCategory
    };
  }
}

const storage = new StorageAdapter();
module.exports = storage;
