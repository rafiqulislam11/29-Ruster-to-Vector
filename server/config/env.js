const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.APP_ENV || process.env.NODE_ENV || 'development',
  authSecret: process.env.SESSION_SECRET || process.env.AUTH_SECRET || 'creativeforge_dev_secret_key_123',
  databaseUrl: process.env.DATABASE_URL || '',
  databasePath: process.env.DATABASE_PATH || './data/creativeforge.json',
  storage: {
    driver: process.env.STORAGE_PROVIDER || process.env.STORAGE_DRIVER || 'local',
    localDir: process.env.STORAGE_LOCAL_DIR || './storage',
    maxSizeMb: parseInt(process.env.MAX_UPLOAD_SIZE_MB || '50', 10),
    maxBatchFiles: parseInt(process.env.MAX_BATCH_FILES || '500', 10)
  },
  ai: {
    provider: process.env.AI_PROVIDER || 'none',
    apiKey: process.env.AI_API_KEY || process.env.AI_PROVIDER_API_KEY || '',
    model: process.env.AI_MODEL || '',
    endpoint: process.env.AI_PROVIDER_ENDPOINT || ''
  },
  backup: {
    enabled: process.env.BACKUP_ENABLED === 'true',
    intervalHours: parseInt(process.env.BACKUP_INTERVAL_HOURS || '24', 10),
    retentionDays: parseInt(process.env.BACKUP_RETENTION_DAYS || '30', 10),
    storagePath: process.env.BACKUP_STORAGE_PATH || './storage/backups'
  }
};

module.exports = config;
