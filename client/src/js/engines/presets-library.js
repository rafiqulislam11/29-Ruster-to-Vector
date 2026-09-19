/**
 * Creative Vector Studio — Comprehensive Presets Library & Manager
 * Provides curated industry presets for Adobe Stock, Logo Design, Line Art,
 * Sticker Vector, KDP, Print 300 PPI, etc.
 * Supports Save, Update, Duplicate, Rename, Delete, Import JSON, and Export JSON.
 */

const DEFAULT_PRESETS = [
  {
    id: 'preset_adobe_stock',
    name: 'Adobe Stock Vector',
    category: 'vector',
    description: 'High-contrast clean contours, no tiny speckles, closed paths ready for stock microstock submissions.',
    params: {
      vectorColors: 12,
      vectorDetail: 80,
      vectorSmoothness: 70,
      vectorSimplification: 2,
      vectorNoiseRemoval: 20,
      vectorSmallObjectRemoval: 15,
      vectorEdgeDetection: true,
      vectorCornerSmoothness: 50,
      vectorRemoveWhite: true,
      vectorFillMode: 'fill',
      vectorPaletteMode: 'original',
      vectorLayerMode: 'color'
    }
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
      vectorSmallObjectRemoval: 20,
      vectorEdgeDetection: true,
      vectorCornerSmoothness: 30,
      vectorRemoveWhite: true,
      vectorFillMode: 'fill',
      vectorPaletteMode: 'original',
      vectorLayerMode: 'color'
    }
  },
  {
    id: 'preset_bw_eps',
    name: 'Black & White EPS',
    category: 'vector',
    description: 'High-contrast monochrome silhouette tracing optimized for laser engraving, vinyl cutting, and monochrome EPS.',
    params: {
      vectorColors: 2,
      vectorDetail: 75,
      vectorSmoothness: 65,
      vectorSimplification: 2,
      vectorThreshold: 135,
      vectorNoiseRemoval: 15,
      vectorSmallObjectRemoval: 12,
      vectorRemoveWhite: true,
      vectorFillMode: 'fill',
      vectorPaletteMode: 'bw',
      vectorLayerMode: 'object'
    }
  },
  {
    id: 'preset_clean_svg',
    name: 'Clean SVG',
    category: 'vector',
    description: 'Balanced path precision, 10 vibrant color layers, lightweight SVG output for web development.',
    params: {
      vectorColors: 10,
      vectorDetail: 65,
      vectorSmoothness: 60,
      vectorSimplification: 2,
      vectorNoiseRemoval: 10,
      vectorRemoveWhite: true,
      vectorFillMode: 'fill',
      vectorPaletteMode: 'original',
      vectorLayerMode: 'color'
    }
  },
  {
    id: 'preset_sticker_vector',
    name: 'Sticker Vector',
    category: 'vector',
    description: 'Distinctive thick stroke outline, simplified shapes, and bold colors for die-cut stickers.',
    params: {
      vectorColors: 8,
      vectorDetail: 60,
      vectorSmoothness: 75,
      vectorSimplification: 3,
      vectorNoiseRemoval: 15,
      vectorRemoveWhite: true,
      vectorFillMode: 'fillAndStroke',
      vectorStrokeWidth: 4,
      vectorStrokeColor: '#ffffff',
      vectorPaletteMode: 'original',
      vectorLayerMode: 'color'
    }
  },
  {
    id: 'preset_line_art',
    name: 'Line Art',
    category: 'vector',
    description: 'Monoline stroke outline contours without solid fills, perfect for coloring books and technical schematics.',
    params: {
      vectorColors: 2,
      vectorDetail: 85,
      vectorSmoothness: 55,
      vectorSimplification: 1,
      vectorNoiseRemoval: 10,
      vectorRemoveWhite: true,
      vectorFillMode: 'stroke',
      vectorStrokeWidth: 2,
      vectorStrokeColor: '#111318',
      vectorPaletteMode: 'bw',
      vectorLayerMode: 'object'
    }
  },
  {
    id: 'preset_icon_pack',
    name: 'Icon Pack Master',
    category: 'icon',
    description: 'Standardized 512px icon rendering across filled and outline styles with clean transparent backgrounds.',
    params: {
      iconStyle: 'flat',
      iconSize: 512,
      iconStrokeWidth: 3,
      iconCornerRadius: 10,
      iconSpacing: 20,
      packStyle: 'flat',
      packSize: 512
    }
  },
  {
    id: 'preset_print_300',
    name: 'Print 300 PPI Master',
    category: 'upscale',
    description: '4500 x 3000 resolution synthesis at 300 DPI with unsharp masking and detail enhancement for fine art printing.',
    params: {
      upscaleResolution: '300PPI',
      upscaleSharpness: 80,
      upscaleDetail: 70,
      upscaleNoiseReduction: 25,
      upscaleTexturePreservation: 85
    }
  },
  {
    id: 'preset_social_media',
    name: 'Social Media 4K',
    category: 'upscale',
    description: 'Crisp 3840 x 2160 output optimized for Instagram, Behance, Dribbble, and portfolio presentations.',
    params: {
      upscaleResolution: '4K',
      upscaleSharpness: 75,
      upscaleDetail: 60,
      upscaleNoiseReduction: 20
    }
  },
  {
    id: 'preset_youtube',
    name: 'YouTube Thumbnail High-Vis',
    category: 'upscale',
    description: 'Ultra-vibrant saturation, sharpened edges, and high-frequency punch for 1280x720 / 1920x1080 thumbnails.',
    params: {
      upscaleResolution: '2K',
      upscaleSharpness: 90,
      upscaleDetail: 80,
      upscaleNoiseReduction: 15
    }
  },
  {
    id: 'preset_kdp',
    name: 'Amazon KDP Print Ready',
    category: 'vector',
    description: 'Pure black vector outlines at 300 DPI for Amazon Kindle Direct Publishing paperback and hardcover interiors.',
    params: {
      vectorColors: 2,
      vectorDetail: 90,
      vectorSmoothness: 60,
      vectorSimplification: 2,
      vectorThreshold: 140,
      vectorRemoveWhite: true,
      vectorFillMode: 'fill',
      vectorPaletteMode: 'bw',
      vectorLayerMode: 'color'
    }
  }
];

export class PresetsLibrary {
  static getStorageKey() {
    return 'cf_studio_custom_presets';
  }

  static getAllPresets() {
    try {
      const stored = localStorage.getItem(this.getStorageKey());
      const custom = stored ? JSON.parse(stored) : [];
      return [...DEFAULT_PRESETS, ...custom];
    } catch (e) {
      return [...DEFAULT_PRESETS];
    }
  }

  static getPresetsByCategory(category) {
    return this.getAllPresets().filter(p => p.category === category);
  }

  static getById(id) {
    return this.getAllPresets().find(p => p.id === id) || null;
  }

  static savePreset(name, category, params, description = '') {
    const newPreset = {
      id: `custom_preset_${Date.now()}`,
      name: name.trim() || 'Custom Preset',
      category: category || 'vector',
      description: description.trim() || 'User defined preset configuration',
      params: JSON.parse(JSON.stringify(params)),
      isCustom: true,
      created_at: new Date().toISOString()
    };

    const stored = localStorage.getItem(this.getStorageKey());
    const custom = stored ? JSON.parse(stored) : [];
    custom.push(newPreset);
    localStorage.setItem(this.getStorageKey(), JSON.stringify(custom));
    return newPreset;
  }

  static updatePreset(id, updates) {
    const stored = localStorage.getItem(this.getStorageKey());
    if (!stored) return null;
    let custom = JSON.parse(stored);
    const idx = custom.findIndex(p => p.id === id);
    if (idx === -1) return null;

    custom[idx] = { ...custom[idx], ...updates, updated_at: new Date().toISOString() };
    localStorage.setItem(this.getStorageKey(), JSON.stringify(custom));
    return custom[idx];
  }

  static duplicatePreset(id) {
    const original = this.getById(id);
    if (!original) return null;
    return this.savePreset(`${original.name} (Copy)`, original.category, original.params, original.description);
  }

  static deletePreset(id) {
    const stored = localStorage.getItem(this.getStorageKey());
    if (!stored) return false;
    let custom = JSON.parse(stored);
    const initialLen = custom.length;
    custom = custom.filter(p => p.id !== id);
    localStorage.setItem(this.getStorageKey(), JSON.stringify(custom));
    return custom.length < initialLen;
  }

  static exportPresetsAsJson() {
    const all = this.getAllPresets();
    return JSON.stringify(all, null, 2);
  }

  static importPresetsFromJson(jsonStr) {
    try {
      const parsed = JSON.parse(jsonStr);
      if (!Array.isArray(parsed)) throw new Error('Invalid JSON format: Expected an array of presets');
      const stored = localStorage.getItem(this.getStorageKey());
      const custom = stored ? JSON.parse(stored) : [];
      let importedCount = 0;

      for (const item of parsed) {
        if (item.name && item.params) {
          custom.push({
            id: `imported_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            name: item.name,
            category: item.category || 'vector',
            description: item.description || 'Imported preset',
            params: item.params,
            isCustom: true,
            imported_at: new Date().toISOString()
          });
          importedCount++;
        }
      }

      localStorage.setItem(this.getStorageKey(), JSON.stringify(custom));
      return { success: true, count: importedCount };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  // Backward-compatibility getters
  static get vector() {
    return this.getPresetsByCategory('vector');
  }
}
