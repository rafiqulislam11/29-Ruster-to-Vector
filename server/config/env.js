const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  authSecret: process.env.AUTH_SECRET || 'creativeforge_dev_secret_key_123',
  databasePath: process.env.DATABASE_PATH || './data/creativeforge.json',
  storage: {
    driver: process.env.STORAGE_DRIVER || 'local',
    localDir: process.env.STORAGE_LOCAL_DIR || './storage',
    maxSizeMb: parseInt(process.env.MAX_UPLOAD_SIZE_MB || '50', 10)
  },
  ai: {
    provider: process.env.AI_PROVIDER || 'mock',
    apiKey: process.env.AI_PROVIDER_API_KEY || '',
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
