const fs = require('fs');
const path = require('path');
const config = require('../config/env');

const DB_FILE = path.resolve(process.cwd(), config.databasePath);
const DB_DIR = path.dirname(DB_FILE);

if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// Initial seed data
const initialSchema = {
  users: [
    {
      id: 'usr_admin',
      name: 'Admin CreativeForge',
      email: 'admin@creativeforge.ai',
      password_hash: 'admin123',
      plan_id: 'BUSINESS',
      role: 'admin',
      credits: 99999,
      created_at: new Date('2026-01-01').toISOString()
    },
    {
      id: 'usr_pro',
      name: 'Elena Rostova',
      email: 'elena@designstudio.io',
      password_hash: 'demo123',
      plan_id: 'PROFESSIONAL',
      role: 'user',
      credits: 450,
      created_at: new Date('2026-02-15').toISOString()
    },
    {
      id: 'usr_free',
      name: 'Alex Vance',
      email: 'alex@vancecraft.com',
      password_hash: 'demo123',
      plan_id: 'FREE',
      role: 'user',
      credits: 10,
      created_at: new Date('2026-03-01').toISOString()
    }
  ],
  projects: [
    {
      id: 'proj_demo_1',
      user_id: 'usr_pro',
      name: 'Cyberpunk Brand Assets',
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'proj_demo_2',
      user_id: 'usr_pro',
      name: 'App Icon System 2026',
      created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  assets: [],
  processing_jobs: [],
  exports: [],
  presets: [
    {
      id: 'preset_adobe_stock',
      name: 'Adobe Stock Vector',
      category: 'vector',
      description: 'Clean closed contours, no tiny speckles, closed paths ready for stock submissions.',
      params: {
        vectorColors: 12,
        vectorDetail: 80,
        vectorSmoothness: 70,
        vectorSimplification: 2,
        vectorNoiseRemoval: 20,
        vectorSmallObjectRemoval: 15,
        vectorRemoveWhite: true,
        vectorFillMode: 'fill',
        vectorLayerMode: 'color'
      },
      created_at: new Date('2026-01-01').toISOString()
    },
    {
      id: 'preset_logo_vector',
      name: 'Logo Vector',
      category: 'vector',
      description: 'Ultra-crisp geometric contours, sharp corner preservation, minimal anchor points.',
      params: {
        vectorColors: 6,
        vectorDetail: 85,
        vectorSmoothness: 80,
        vectorSimplification: 3,
        vectorNoiseRemoval: 25,
        vectorCornerSmoothness: 30,
        vectorFillMode: 'fill',
        vectorLayerMode: 'color'
      },
      created_at: new Date('2026-01-01').toISOString()
    },
    {
      id: 'preset_print_300',
      name: 'Print 300 PPI Master',
      category: 'upscale',
      description: 'High-density unsharp masking and detail enhancement for fine art printing.',
      params: {
        upscaleResolution: '300PPI',
        upscaleSharpness: 80,
        upscaleDetail: 70,
        upscaleNoiseReduction: 25
      },
      created_at: new Date('2026-01-01').toISOString()
    }
  ],
  metadata: [],
  credit_transactions: [
    {
      id: 'tx_init_1',
      user_id: 'usr_pro',
      amount: 500,
      type: 'monthly_grant',
      description: 'Professional Plan Monthly Credits',
      timestamp: new Date().toISOString()
    }
  ],
  settings: {
    maintenance_mode: false,
    default_ppi: 300,
    default_export_format: 'svg',
    max_batch_size: 500,
    api_rate_limit: 100
  },
  history: [],
  audit_logs: [
    {
      id: 'log_init',
      action: 'SYSTEM_STARTUP',
      details: 'Creative Vector Studio Database Initialized',
      timestamp: new Date().toISOString()
    }
  ],
  subscriptions: [
    {
      id: 'sub_admin',
      user_id: 'usr_admin',
      plan: 'BUSINESS',
      status: 'active',
      start_date: new Date('2026-01-01').toISOString(),
      expiry_date: new Date('2028-01-01').toISOString()
    },
    {
      id: 'sub_pro',
      user_id: 'usr_pro',
      plan: 'PROFESSIONAL',
      status: 'active',
      start_date: new Date('2026-02-15').toISOString(),
      expiry_date: new Date('2027-02-15').toISOString()
    },
    {
      id: 'sub_free',
      user_id: 'usr_free',
      plan: 'FREE',
      status: 'active',
      start_date: new Date('2026-03-01').toISOString(),
      expiry_date: new Date('2027-03-01').toISOString()
    }
  ],
  usage: [],
  tool_configs: [
    { id: 'tool_gradient_extract', name: 'Image → Gradient', category: 'image', credit_cost: 1, enabled: true },
    { id: 'tool_upscaler', name: 'AI Image Upscaler', category: 'image', credit_cost: 3, enabled: true },
    { id: 'tool_film_grain', name: 'Film Grain Engine', category: 'image', credit_cost: 1, enabled: true },
    { id: 'tool_fractal_glass_1', name: 'Fractal Glass 1', category: 'image', credit_cost: 2, enabled: true },
    { id: 'tool_fractal_glass_2', name: 'Fractal Glass 2', category: 'image', credit_cost: 2, enabled: true },
    { id: 'tool_fractal_glass_3', name: 'Fractal Glass 3', category: 'image', credit_cost: 2, enabled: true },
    { id: 'tool_fractal_glass_3_1', name: 'Fractal Glass 3.1', category: 'image', credit_cost: 2, enabled: true },
    { id: 'tool_fractal_glass_3_2', name: 'Fractal Glass 3.2', category: 'image', credit_cost: 2, enabled: true },
    { id: 'tool_fractal_glass_3_3', name: 'Fractal Glass 3.3', category: 'image', credit_cost: 2, enabled: true },
    { id: 'tool_gradient_maker_1', name: 'Gradient Maker 1', category: 'image', credit_cost: 1, enabled: true },
    { id: 'tool_gradient_maker_2', name: 'Gradient Maker 2', category: 'image', credit_cost: 1, enabled: true },
    { id: 'tool_gradient_maker_3', name: 'Gradient Maker 3', category: 'image', credit_cost: 1, enabled: true },
    { id: 'tool_gradient_maker_4', name: 'Gradient Maker 4', category: 'image', credit_cost: 1, enabled: true },
    { id: 'tool_vector_convert', name: 'Image → Vector', category: 'vector', credit_cost: 2, enabled: true },
    { id: 'tool_vector_trace', name: 'Vector Trace', category: 'vector', credit_cost: 2, enabled: true },
    { id: 'tool_bg_remove_white', name: 'Remove White Background', category: 'vector', credit_cost: 1, enabled: true },
    { id: 'tool_bg_transparent', name: 'Transparent Background', category: 'vector', credit_cost: 1, enabled: true },
    { id: 'tool_icon_sheet_1', name: 'Icon Sheet Maker 1 (Minimal)', category: 'icon', credit_cost: 2, enabled: true },
    { id: 'tool_icon_sheet_2', name: 'Icon Sheet Maker 2 (Marketplace)', category: 'icon', credit_cost: 2, enabled: true },
    { id: 'tool_icon_sheet_3', name: 'Icon Sheet Maker 3 (Presentation)', category: 'icon', credit_cost: 2, enabled: true },
    { id: 'tool_icon_pack', name: 'Icon Pack Maker', category: 'icon', credit_cost: 4, enabled: true }
  ],
  plans: [
    {
      id: 'FREE',
      name: 'Free Starter',
      price_monthly: 0,
      credits_per_month: 10,
      max_resolution: '2K',
      max_projects: 3,
      features: ['2K Max Export', 'Standard Tools', 'Community Support', 'Watermark-free preview']
    },
    {
      id: 'CREATOR',
      name: 'Creator',
      price_monthly: 19,
      credits_per_month: 100,
      max_resolution: '4K',
      max_projects: 25,
      features: ['4K Ultra HD Export', 'Batch Processing', 'Advanced Film Grain', 'Fast Queue Priority']
    },
    {
      id: 'PROFESSIONAL',
      name: 'Professional',
      price_monthly: 49,
      credits_per_month: 500,
      max_resolution: '8K',
      max_projects: 100,
      features: ['8K Master Export', 'Vector SVG Generation', 'All Fractal Glass Shaders', 'Full Icon Pack ZIP Studio']
    },
    {
      id: 'BUSINESS',
      name: 'Business Studio',
      price_monthly: 129,
      credits_per_month: 2500,
      max_resolution: '8K',
      max_projects: 9999,
      features: ['Unlimited Projects', 'Team Collaboration', 'Dedicated AI Compute', 'Automated Daily Backups']
    }
  ],
  backups: []
};

class Database {
  constructor() {
    this.dbPath = DB_FILE;
    this.data = null;
    this.load();
  }

  load() {
    try {
      if (fs.existsSync(this.dbPath)) {
        const raw = fs.readFileSync(this.dbPath, 'utf8');
        this.data = JSON.parse(raw);
        // Automatic migration: ensure all collections exist
        let modified = false;
        for (const key of Object.keys(initialSchema)) {
          if (!this.data[key]) {
            this.data[key] = initialSchema[key];
            modified = true;
          }
        }
        if (modified) {
          this.save();
        }
      } else {
        this.data = JSON.parse(JSON.stringify(initialSchema));
        this.save();
      }
    } catch (err) {
      console.error('Error loading database, resetting to initial schema:', err);
      this.data = JSON.parse(JSON.stringify(initialSchema));
      this.save();
    }
  }

  save() {
    try {
      fs.writeFileSync(this.dbPath, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (err) {
      console.error('Failed to write database to disk:', err);
    }
  }

  // Generic Query Helpers
  find(collection, filterFn = null) {
    if (!this.data[collection]) return [];
    if (!filterFn) return [...this.data[collection]];
    return this.data[collection].filter(filterFn);
  }

  findOne(collection, filterFn) {
    if (!this.data[collection]) return null;
    return this.data[collection].find(filterFn) || null;
  }

  findById(collection, id) {
    return this.findOne(collection, item => item.id === id);
  }

  insert(collection, item) {
    if (!this.data[collection]) this.data[collection] = [];
    if (!item.id) {
      item.id = `${collection.slice(0, 4)}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    }
    if (!item.created_at) {
      item.created_at = new Date().toISOString();
    }
    this.data[collection].push(item);
    this.save();
    return item;
  }

  update(collection, id, updates) {
    if (!this.data[collection]) return null;
    const index = this.data[collection].findIndex(item => item.id === id);
    if (index === -1) return null;

    this.data[collection][index] = {
      ...this.data[collection][index],
      ...updates,
      updated_at: new Date().toISOString()
    };
    this.save();
    return this.data[collection][index];
  }

  delete(collection, id) {
    if (!this.data[collection]) return false;
    const initialLen = this.data[collection].length;
    this.data[collection] = this.data[collection].filter(item => item.id !== id);
    const deleted = this.data[collection].length < initialLen;
    if (deleted) this.save();
    return deleted;
  }
}

const db = new Database();
module.exports = db;
