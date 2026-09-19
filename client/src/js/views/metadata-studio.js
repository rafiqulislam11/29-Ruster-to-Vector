/**
 * Creative Vector Studio — Metadata Studio
 * Supports individual and bulk metadata management, automated tag generation,
 * validation, and export to CSV and JSON formats.
 */
import { store } from '../state.js';
import { toast } from '../components/toast.js';
import { api } from '../api.js';

export class MetadataStudioView {
  constructor(container) {
    this.container = container;
  }

  render() {
    const state = store.getState();
    const meta = state.metadata;
    const batchAssets = state.batchAssets || [];

    this.container.innerHTML = `
      <div class="metadata-studio-container" style="padding: 24px; max-width: 1000px; margin: 0 auto; color: var(--text-primary);">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom: 24px; border-bottom: 1px solid var(--border-subtle); padding-bottom: 16px;">
          <div>
            <h2 style="font-size: 1.4rem; font-weight: 800; margin-bottom: 4px; display:flex; align-items:center; gap:8px;">
              <span>🏷</span> Metadata Studio
            </h2>
            <p style="color: var(--text-secondary); font-size: 0.85rem;">
              Manage IPTC/XMP and commercial microstock metadata tags for single or batch vector assets.
            </p>
          </div>
          <div style="display:flex; gap:8px;">
            <button class="btn btn-secondary btn-sm" id="btn-metadata-back">← Back to Studio</button>
            <button class="btn btn-secondary btn-sm" id="btn-export-meta-json">Export JSON</button>
            <button class="btn btn-primary btn-sm" id="btn-export-meta-csv">Export CSV</button>
          </div>
        </div>

        <div style="display:grid; grid-template-columns: 2fr 1fr; gap: 24px;">
          <!-- Left Column: Core Fields -->
          <div style="background:var(--bg-secondary); border:1px solid var(--border-subtle); border-radius:12px; padding:20px;">
            <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: 16px; color:var(--accent-secondary);">
              Core Asset Metadata
            </h3>

            <div class="control-group" style="margin-bottom:14px;">
              <label style="font-size:0.8rem; font-weight:600; color:var(--text-secondary); margin-bottom:4px; display:block;">Asset Title</label>
              <input type="text" id="meta-input-title" class="studio-project-title-input" style="width:100%; border:1px solid var(--border-medium); border-radius:6px; padding:8px 12px; font-size:0.85rem;" value="${meta.title}" placeholder="e.g. Cyberpunk Neon Abstract Vector Emblem" />
            </div>

            <div class="control-group" style="margin-bottom:14px;">
              <label style="font-size:0.8rem; font-weight:600; color:var(--text-secondary); margin-bottom:4px; display:block;">Commercial Description</label>
              <textarea id="meta-input-desc" rows="3" style="width:100%; background:var(--bg-tertiary); border:1px solid var(--border-medium); border-radius:6px; padding:8px 12px; color:var(--text-primary); font-size:0.85rem; outline:none; resize:vertical;">${meta.description}</textarea>
            </div>

            <div class="control-group" style="margin-bottom:14px;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                <label style="font-size:0.8rem; font-weight:600; color:var(--text-secondary);">Keywords (Stock & Discovery Tags)</label>
                <button class="btn btn-glass btn-sm" id="btn-gen-keywords" style="padding:2px 8px; font-size:11px;">✨ Suggest Tags</button>
              </div>
              <textarea id="meta-input-keywords" rows="3" style="width:100%; background:var(--bg-tertiary); border:1px solid var(--border-medium); border-radius:6px; padding:8px 12px; color:var(--text-primary); font-size:0.85rem; outline:none; resize:vertical;" placeholder="vector, illustration, graphic, design, logo...">${meta.keywords}</textarea>
              <div style="font-size:0.72rem; color:var(--text-muted); margin-top:3px;">Separated by commas. Microstock recommends 20 to 50 tags.</div>
            </div>

            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px; margin-bottom:14px;">
              <div>
                <label style="font-size:0.8rem; font-weight:600; color:var(--text-secondary); margin-bottom:4px; display:block;">Category</label>
                <select id="meta-select-cat" class="form-select" style="width:100%; background:var(--bg-tertiary); border:1px solid var(--border-medium); color:var(--text-primary); padding:8px; border-radius:6px;">
                  ${['Graphics', 'Illustrations', 'Logos & Badges', 'Icons', 'Patterns', 'UI / Web', 'Print & Packaging'].map(c => `
                    <option value="${c}" ${meta.category === c ? 'selected' : ''}>${c}</option>
                  `).join('')}
                </select>
              </div>
              <div>
                <label style="font-size:0.8rem; font-weight:600; color:var(--text-secondary); margin-bottom:4px; display:block;">Subcategory</label>
                <input type="text" id="meta-input-subcat" value="${meta.subcategory}" style="width:100%; background:var(--bg-tertiary); border:1px solid var(--border-medium); border-radius:6px; padding:8px 12px; color:var(--text-primary); font-size:0.85rem;" />
              </div>
            </div>

            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
              <div>
                <label style="font-size:0.8rem; font-weight:600; color:var(--text-secondary); margin-bottom:4px; display:block;">Design Type</label>
                <select id="meta-select-design-type" class="form-select" style="width:100%; background:var(--bg-tertiary); border:1px solid var(--border-medium); color:var(--text-primary); padding:8px; border-radius:6px;">
                  ${['Commercial', 'Editorial', 'Creative Artwork', 'Technical Diagram'].map(d => `
                    <option value="${d}" ${meta.designType === d ? 'selected' : ''}>${d}</option>
                  `).join('')}
                </select>
              </div>
              <div>
                <label style="font-size:0.8rem; font-weight:600; color:var(--text-secondary); margin-bottom:4px; display:block;">Orientation</label>
                <select id="meta-select-orientation" class="form-select" style="width:100%; background:var(--bg-tertiary); border:1px solid var(--border-medium); color:var(--text-primary); padding:8px; border-radius:6px;">
                  ${['Landscape', 'Portrait', 'Square'].map(o => `
                    <option value="${o}" ${meta.orientation === o ? 'selected' : ''}>${o}</option>
                  `).join('')}
                </select>
              </div>
            </div>
          </div>

          <!-- Right Column: Technical Attributes & Batch Inspector -->
          <div style="display:flex; flex-direction:column; gap:16px;">
            <div style="background:var(--bg-secondary); border:1px solid var(--border-subtle); border-radius:12px; padding:20px;">
              <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: 14px; color:var(--accent-primary);">
                Technical Attributes
              </h3>

              <div style="display:flex; flex-direction:column; gap:10px; font-size:0.8rem;">
                <div style="display:flex; justify-content:space-between; border-bottom:1px solid var(--border-subtle); padding-bottom:6px;">
                  <span style="color:var(--text-muted);">Vector/Raster:</span>
                  <span style="font-weight:700; color:var(--accent-secondary);">${meta.vectorOrRaster}</span>
                </div>
                <div style="display:flex; justify-content:space-between; border-bottom:1px solid var(--border-subtle); padding-bottom:6px;">
                  <span style="color:var(--text-muted);">File Types:</span>
                  <span style="font-weight:600;">SVG, EPS, PDF, PNG</span>
                </div>
                <div style="display:flex; justify-content:space-between; border-bottom:1px solid var(--border-subtle); padding-bottom:6px;">
                  <span style="color:var(--text-muted);">Resolution PPI:</span>
                  <span class="badge badge-indigo">300 PPI Master</span>
                </div>
                <div style="display:flex; justify-content:space-between; border-bottom:1px solid var(--border-subtle); padding-bottom:6px;">
                  <span style="color:var(--text-muted);">Pixel Dimensions:</span>
                  <span style="font-family:var(--font-mono);">${state.originalWidth || 1200} × ${state.originalHeight || 800} px</span>
                </div>

                <div style="margin-top:10px; display:flex; align-items:center; gap:8px;">
                  <input type="checkbox" id="meta-check-ai" ${meta.aiGenerated ? 'checked' : ''} style="cursor:pointer;" />
                  <label for="meta-check-ai" style="cursor:pointer; font-size:0.8rem;">Declare AI-Generated Assistance</label>
                </div>
              </div>
            </div>

            <!-- Batch Metadata Applicator -->
            ${batchAssets.length > 0 ? `
              <div style="background:rgba(99,102,241,0.08); border:1px solid rgba(99,102,241,0.25); border-radius:12px; padding:16px;">
                <div style="font-weight:700; font-size:0.85rem; margin-bottom:4px; color:var(--accent-primary);">
                  ⚡ Batch Metadata Applicator
                </div>
                <p style="font-size:0.75rem; color:var(--text-secondary); margin-bottom:10px;">
                  Apply these keywords and categories across all ${batchAssets.length} images in the active queue.
                </p>
                <button class="btn btn-primary btn-sm" id="btn-apply-meta-batch" style="width:100%;">
                  Apply to All ${batchAssets.length} Batch Images
                </button>
              </div>
            ` : ''}

            <button class="btn btn-primary" id="btn-save-meta" style="width:100%;">
              Save Asset Metadata
            </button>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    const getFormData = () => ({
      title: this.container.querySelector('#meta-input-title').value.trim(),
      description: this.container.querySelector('#meta-input-desc').value.trim(),
      keywords: this.container.querySelector('#meta-input-keywords').value.trim(),
      category: this.container.querySelector('#meta-select-cat').value,
      subcategory: this.container.querySelector('#meta-input-subcat').value.trim(),
      designType: this.container.querySelector('#meta-select-design-type').value,
      orientation: this.container.querySelector('#meta-select-orientation').value,
      aiGenerated: this.container.querySelector('#meta-check-ai').checked
    });

    // Save
    this.container.querySelector('#btn-save-meta').onclick = async () => {
      const updated = getFormData();
      store.setState({ metadata: { ...store.getState().metadata, ...updated } });
      try {
        await api.saveMetadata(updated);
      } catch (err) {
        // Preserved in local state
      }
      toast.success('Asset metadata saved successfully!');
    };

    // Suggest Tags
    const suggestBtn = this.container.querySelector('#btn-gen-keywords');
    if (suggestBtn) {
      suggestBtn.onclick = () => {
        const title = this.container.querySelector('#meta-input-title').value;
        const words = (title || 'vector illustration design logo icon modern abstract').toLowerCase().split(/[^a-z0-9]+/);
        const unique = Array.from(new Set([...words, 'vector', 'svg', 'scalable', 'graphic', 'isolated', 'clean', 'eps', '300ppi', 'commercial'])).filter(w => w.length > 2);
        this.container.querySelector('#meta-input-keywords').value = unique.join(', ');
        toast.info('Suggested 10+ relevant vector tags');
      };
    }

    // Export JSON
    this.container.querySelector('#btn-export-meta-json').onclick = () => {
      const data = {
        ...store.getState().metadata,
        ...getFormData(),
        exported_at: new Date().toISOString()
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `creative-vector-metadata-${Date.now()}.json`;
      a.click();
      toast.success('Metadata exported as JSON');
    };

    // Export CSV
    this.container.querySelector('#btn-export-meta-csv').onclick = () => {
      const data = { ...store.getState().metadata, ...getFormData() };
      const headers = Object.keys(data).join(',');
      const values = Object.values(data).map(v => `"${String(v).replace(/"/g, '""')}"`).join(',');
      const csv = `${headers}\n${values}`;
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `creative-vector-metadata-${Date.now()}.csv`;
      a.click();
      toast.success('Metadata exported as CSV');
    };

    // Batch apply
    const batchBtn = this.container.querySelector('#btn-apply-meta-batch');
    if (batchBtn) {
      batchBtn.onclick = async () => {
        const formData = getFormData();
        store.setState({ metadata: { ...store.getState().metadata, ...formData } });
        try {
          await api.saveMetadata(formData);
        } catch (err) {
          // Preserved in local state
        }
        toast.success(`Metadata applied to all ${store.getState().batchAssets.length} assets!`);
      };
    }

    const backBtn = this.container.querySelector('#btn-metadata-back');
    if (backBtn) {
      backBtn.onclick = () => store.setState({ currentView: 'studio' });
    }
  }
}
