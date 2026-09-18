const fs = require('fs');
const path = require('path');
const config = require('../config/env');
const db = require('../db/database');

class BackupService {
  constructor() {
    this.backupDir = path.resolve(process.cwd(), config.backup.storagePath);
    this.intervalHandle = null;
    this.init();
  }

  init() {
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }
    if (config.backup.enabled) {
      this.startScheduledBackups();
    }
  }

  startScheduledBackups() {
    if (this.intervalHandle) clearInterval(this.intervalHandle);
    const ms = config.backup.intervalHours * 60 * 60 * 1000;
    console.log(`[BackupService] Automated backups scheduled every ${config.backup.intervalHours} hours.`);
    this.intervalHandle = setInterval(() => {
      this.createBackup('scheduled');
    }, ms);
  }

  /**
   * Run backup operation
   */
  async createBackup(triggerType = 'manual') {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFileName = `backup_${triggerType}_${timestamp}.json`;
    const backupFilePath = path.join(this.backupDir, backupFileName);

    try {
      // Gather metadata, projects, assets, jobs, configs
      const snapshot = {
        metadata: {
          timestamp: new Date().toISOString(),
          trigger: triggerType,
          version: '1.0.0'
        },
        database: db.data
      };

      fs.writeFileSync(backupFilePath, JSON.stringify(snapshot, null, 2), 'utf8');
      const stats = fs.statSync(backupFilePath);

      const record = db.insert('backups', {
        filename: backupFileName,
        filepath: backupFilePath,
        size_bytes: stats.size,
        size_kb: +(stats.size / 1024).toFixed(1),
        trigger: triggerType,
        status: 'success'
      });

      this.pruneOldBackups();
      console.log(`[BackupService] Backup completed: ${backupFileName} (${record.size_kb} KB)`);
      return record;
    } catch (err) {
      console.error('[BackupService] Backup failed:', err);
      const record = db.insert('backups', {
        filename: backupFileName,
        trigger: triggerType,
        status: 'failed',
        error: err.message
      });
      return record;
    }
  }

  /**
   * Prune backups older than retention period
   */
  pruneOldBackups() {
    try {
      const maxAgeMs = config.backup.retentionDays * 24 * 60 * 60 * 1000;
      const now = Date.now();
      const files = fs.readdirSync(this.backupDir);

      for (const file of files) {
        const p = path.join(this.backupDir, file);
        const st = fs.statSync(p);
        if (now - st.mtimeMs > maxAgeMs) {
          fs.unlinkSync(p);
          console.log(`[BackupService] Pruned expired backup: ${file}`);
        }
      }
    } catch (e) {
      console.warn('[BackupService] Error pruning backups:', e);
    }
  }

  getBackupStatus() {
    return {
      enabled: config.backup.enabled,
      intervalHours: config.backup.intervalHours,
      retentionDays: config.backup.retentionDays,
      backupCount: db.find('backups').length,
      history: db.find('backups').slice(-10).reverse()
    };
  }
}

const backupService = new BackupService();
module.exports = backupService;
