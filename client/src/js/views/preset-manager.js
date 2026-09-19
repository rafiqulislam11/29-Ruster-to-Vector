/**
 * Creative Vector Studio — Preset Manager View
 * Browse, apply, save, edit, duplicate, delete, import JSON, and export JSON presets.
 */
import { store } from '../state.js';
import { toast } from '../components/toast.js';
import { PresetsLibrary } from '../engines/presets-library.js';

export class PresetManagerView {
  constructor(container, onApplyPreset = () => {}) {
    this.container = container;
    this.onApplyPreset = onApplyPreset;
    this.selectedCategory = 'all';
  }

  render() {
    const allPresets = PresetsLibrary.getAllPresets();
    const filtered = this.selectedCategory === 'all'
      ? allPresets
      : allPresets.filter(p => p.category === this.selectedCategory);

    this.container.innerHTML = `
      <div class="preset-manager-container" style="padding: 24px; max-width: 1000px; margin: 0 auto; color: var(--text-primary);">
        <!-- Header -->
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom: 1px solid var(--border-subtle); padding-bottom: 16px; margin-bottom: 20px;">
          <div>
            <h2 style="font-size: 1.4rem; font-weight: 800; margin-bottom: 4px; display:flex; align-items:center; gap:8px;">
              <span>✦</span> Preset Manager
            </h2>
            <p style="color: var(--text-secondary); font-size: 0.85rem;">
              Save and instantly apply professional vectorization, print resolution, and shader presets.
            </p>
          </div>
          <div style="display:flex; gap:8px;">
            <button class="btn btn-secondary btn-sm" id="btn-presets-back">← Back to Studio</button>
            <button class="btn btn-secondary btn-sm" id="btn-import-presets">Import JSON</button>
            <button class="btn btn-secondary btn-sm" id="btn-export-presets">Export All JSON</button>
            <button class="btn btn-primary btn-sm" id="btn-save-current-preset">+ Save Current Settings</button>
          </div>
        </div>

        <!-- Hidden file input for JSON import -->
        <input type="file" id="preset-import-file" accept=".json,application/json" style="display:none;" />

        <!-- Category Filter Tabs -->
        <div style="display:flex; gap:8px; margin-bottom: 20px;">
          ${[
            { id: 'all', label: 'All Presets' },
            { id: 'vector', label: 'Vector Tracing' },
            { id: 'upscale', label: 'Resolution & Print' },
            { id: 'icon', label: 'Icons & Packs' }
          ].map(c => `
            <button class="btn btn-sm ${this.selectedCategory === c.id ? 'btn-primary' : 'btn-glass'}" data-cat="${c.id}">
              ${c.label}
            </button>
          `).join('')}
        </div>

        <!-- Presets Grid -->
        <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(290px, 1fr)); gap:16px;">
          ${filtered.map(p => `
            <div class="preset-card" style="
              background:var(--bg-secondary); border:1px solid var(--border-subtle); border-radius:12px;
              padding:18px; display:flex; flex-direction:column; justify-content:space-between;
              transition:all 0.2s; position:relative;
            ">
              <div>
                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
                  <h4 style="font-size:0.95rem; font-weight:700; color:var(--text-primary); margin:0;">${p.name}</h4>
                  <span class="badge badge-indigo" style="font-size:9px;">${p.category.toUpperCase()}</span>
                </div>
                <p style="font-size:0.78rem; color:var(--text-secondary); line-height:1.4; margin-bottom:12px;">
                  ${p.description || 'Pre-configured workflow settings.'}
                </p>

                <!-- Parameter Highlights -->
                <div style="background:var(--bg-tertiary); border-radius:6px; padding:8px; font-size:0.72rem; color:var(--text-muted); font-family:var(--font-mono); margin-bottom:14px; max-height:80px; overflow-y:auto;">
                  ${Object.entries(p.params).slice(0, 5).map(([k, v]) => `
                    <div>${k.replace('vector', '').replace('upscale', '')}: <strong style="color:var(--text-primary);">${v}</strong></div>
                  `).join('')}
                </div>
              </div>

              <!-- Action Buttons -->
              <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border-subtle); padding-top:12px;">
                <div style="display:flex; gap:4px;">
                  <button class="btn-icon btn-sm btn-dup-preset" data-id="${p.id}" title="Duplicate Preset">❐</button>
                  ${p.isCustom ? `
                    <button class="btn-icon btn-sm btn-del-preset" data-id="${p.id}" title="Delete Preset" style="color:var(--status-danger);">🗑</button>
                  ` : ''}
                </div>
                <button class="btn btn-primary btn-sm btn-apply-preset" data-id="${p.id}">
                  Apply Preset
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    // Category tabs
    this.container.querySelectorAll('[data-cat]').forEach(btn => {
      btn.onclick = () => {
        this.selectedCategory = btn.getAttribute('data-cat');
        this.render();
      };
    });

    // Apply preset
    this.container.querySelectorAll('.btn-apply-preset').forEach(btn => {
      btn.onclick = () => {
        const id = btn.getAttribute('data-id');
        const preset = PresetsLibrary.getById(id);
        if (preset) {
          Object.assign(store.state.params, preset.params);
          store.notify();
          toast.success(`Applied "${preset.name}" preset!`);
          this.onApplyPreset(preset);
        }
      };
    });

    // Duplicate preset
    this.container.querySelectorAll('.btn-dup-preset').forEach(btn => {
      btn.onclick = () => {
        const id = btn.getAttribute('data-id');
        PresetsLibrary.duplicatePreset(id);
        toast.info('Preset duplicated');
        this.render();
      };
    });

    // Delete preset
    this.container.querySelectorAll('.btn-del-preset').forEach(btn => {
      btn.onclick = () => {
        const id = btn.getAttribute('data-id');
        PresetsLibrary.deletePreset(id);
        toast.info('Preset deleted');
        this.render();
      };
    });

    // Save current settings as preset
    this.container.querySelector('#btn-save-current-preset').onclick = () => {
      const name = prompt('Enter a name for your custom preset:');
      if (name && name.trim()) {
        const tool = store.getState().activeTool;
        const cat = tool.includes('vector') ? 'vector' : tool.includes('upscale') ? 'upscale' : 'icon';
        PresetsLibrary.savePreset(name, cat, store.getState().params);
        toast.success(`Preset "${name}" saved!`);
        this.render();
      }
    };

    // Export all JSON
    this.container.querySelector('#btn-export-presets').onclick = () => {
      const jsonStr = PresetsLibrary.exportPresetsAsJson();
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `creative-vector-presets-${Date.now()}.json`;
      a.click();
      toast.success('Presets exported to JSON');
    };

    // Import JSON trigger
    const fileInput = this.container.querySelector('#preset-import-file');
    this.container.querySelector('#btn-import-presets').onclick = () => fileInput.click();
    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (evt) => {
        const res = PresetsLibrary.importPresetsFromJson(evt.target.result);
        if (res.success) {
          toast.success(`Imported ${res.count} presets!`);
          this.render();
        } else {
          toast.error('Import failed: ' + res.error);
        }
      };
      reader.readAsText(file);
    };

    const backBtn = this.container.querySelector('#btn-presets-back');
    if (backBtn) {
      backBtn.onclick = () => store.setState({ currentView: 'studio' });
    }
  }
}
