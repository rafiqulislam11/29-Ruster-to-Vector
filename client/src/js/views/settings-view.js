/**
 * Creative Vector Studio — User Settings View
 * Manages Themes (Light/Dark/System), Accent Colors, Languages (English/Bangla/Arabic),
 * Interface Density, Default PPI, Export Defaults, and Auto-save settings.
 */
import { store } from '../state.js';
import { toast } from '../components/toast.js';
import { i18n } from '../utils/i18n.js';

export class SettingsView {
  constructor(container) {
    this.container = container;
  }

  render() {
    const state = store.getState();

    this.container.innerHTML = `
      <div class="settings-page-container" style="padding: 24px; max-width: 800px; margin: 0 auto; color: var(--text-primary);">
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom: 1px solid var(--border-subtle); padding-bottom: 16px; margin-bottom: 24px;">
          <div>
            <h2 style="font-size: 1.4rem; font-weight: 800; margin-bottom: 4px; display:flex; align-items:center; gap:8px;">
              <span>⚙</span> User Preferences & Settings
            </h2>
            <p style="color: var(--text-secondary); font-size: 0.85rem;">
              Customize workspace aesthetics, default print resolution, export rules, and localization.
            </p>
          </div>
          <button class="btn btn-secondary btn-sm" id="btn-settings-back">← Back to Studio</button>
        </div>

        <div style="display:flex; flex-direction:column; gap:20px;">
          <!-- 1. Appearance & Theme -->
          <div style="background:var(--bg-secondary); border:1px solid var(--border-subtle); border-radius:12px; padding:20px;">
            <h3 style="font-size:1rem; font-weight:700; margin-bottom:14px; color:var(--accent-primary);">
              Appearance & Theme
            </h3>

            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px;">
              <div>
                <label style="font-size:0.8rem; font-weight:600; color:var(--text-secondary); margin-bottom:6px; display:block;">Color Theme</label>
                <div style="display:flex; gap:8px;">
                  <button class="btn btn-sm ${state.theme === 'dark' ? 'btn-primary' : 'btn-secondary'}" id="btn-theme-dark">Dark</button>
                  <button class="btn btn-sm ${state.theme === 'light' ? 'btn-primary' : 'btn-secondary'}" id="btn-theme-light">Light</button>
                  <button class="btn btn-sm ${state.theme === 'system' ? 'btn-primary' : 'btn-secondary'}" id="btn-theme-system">System</button>
                </div>
              </div>

              <div>
                <label style="font-size:0.8rem; font-weight:600; color:var(--text-secondary); margin-bottom:6px; display:block;">Accent Color</label>
                <div style="display:flex; gap:8px; align-items:center;">
                  ${[
                    { id: 'indigo', color: '#6366f1' },
                    { id: 'cyan', color: '#06b6d4' },
                    { id: 'emerald', color: '#10b981' },
                    { id: 'rose', color: '#f43f5e' },
                    { id: 'amber', color: '#f59e0b' },
                    { id: 'purple', color: '#a855f7' }
                  ].map(a => `
                    <button class="btn-accent-swatch" data-accent="${a.id}" style="
                      width:26px; height:26px; border-radius:50%; background:${a.color}; border:2px solid ${state.accentColor === a.id ? '#ffffff' : 'transparent'};
                      cursor:pointer; box-shadow:0 2px 8px rgba(0,0,0,0.3); transition:transform 0.15s;
                    " title="${a.id.toUpperCase()}"></button>
                  `).join('')}
                </div>
              </div>
            </div>

            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px; margin-top:16px;">
              <div>
                <label style="font-size:0.8rem; font-weight:600; color:var(--text-secondary); margin-bottom:6px; display:block;">Language (i18n)</label>
                <select id="select-setting-lang" class="form-select" style="width:100%; background:var(--bg-tertiary); border:1px solid var(--border-medium); color:var(--text-primary); padding:8px; border-radius:6px;">
                  <option value="en" ${state.language === 'en' ? 'selected' : ''}>English (EN)</option>
                  <option value="bn" ${state.language === 'bn' ? 'selected' : ''}>বাংলা (Bangla - BN)</option>
                  <option value="ar" ${state.language === 'ar' ? 'selected' : ''}>العربية (Arabic - RTL)</option>
                </select>
              </div>
              <div>
                <label style="font-size:0.8rem; font-weight:600; color:var(--text-secondary); margin-bottom:6px; display:block;">Interface Density</label>
                <select id="select-setting-density" class="form-select" style="width:100%; background:var(--bg-tertiary); border:1px solid var(--border-medium); color:var(--text-primary); padding:8px; border-radius:6px;">
                  <option value="compact" ${state.density === 'compact' ? 'selected' : ''}>Compact (Pro)</option>
                  <option value="comfortable" ${state.density === 'comfortable' ? 'selected' : ''}>Comfortable (Default)</option>
                  <option value="spacious" ${state.density === 'spacious' ? 'selected' : ''}>Spacious</option>
                </select>
              </div>
            </div>
          </div>

          <!-- 2. Export & Resolution Defaults -->
          <div style="background:var(--bg-secondary); border:1px solid var(--border-subtle); border-radius:12px; padding:20px;">
            <h3 style="font-size:1rem; font-weight:700; margin-bottom:14px; color:var(--accent-secondary);">
              Export & Resolution Standards
            </h3>

            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px; margin-bottom:14px;">
              <div>
                <label style="font-size:0.8rem; font-weight:600; color:var(--text-secondary); margin-bottom:6px; display:block;">Default Resolution (PPI)</label>
                <select id="select-default-ppi" class="form-select" style="width:100%; background:var(--bg-tertiary); border:1px solid var(--border-medium); color:var(--text-primary); padding:8px; border-radius:6px;">
                  <option value="72">72 PPI (Standard Web)</option>
                  <option value="96">96 PPI (Screen HD)</option>
                  <option value="150">150 PPI (Medium Print)</option>
                  <option value="300" selected>300 PPI (Commercial Print Standard)</option>
                  <option value="600">600 PPI (Ultra High-Definition Fine Art)</option>
                </select>
              </div>

              <div>
                <label style="font-size:0.8rem; font-weight:600; color:var(--text-secondary); margin-bottom:6px; display:block;">Default Vector Export Format</label>
                <select id="select-default-format" class="form-select" style="width:100%; background:var(--bg-tertiary); border:1px solid var(--border-medium); color:var(--text-primary); padding:8px; border-radius:6px;">
                  <option value="svg" selected>SVG (Scalable Vector Graphics)</option>
                  <option value="eps">EPS (Encapsulated PostScript 3.0)</option>
                  <option value="pdf">PDF (Print Master with Trim Box)</option>
                  <option value="png">PNG (300 PPI Raster Master)</option>
                  <option value="dxf">DXF (AutoCAD / Laser Cutting Polyline)</option>
                </select>
              </div>
            </div>

            <div class="control-group">
              <label style="font-size:0.8rem; font-weight:600; color:var(--text-secondary); margin-bottom:4px; display:block;">
                Default Smart File Naming Pattern
              </label>
              <input type="text" id="input-naming-pattern" value="${state.exportSettings?.namingTemplate || '{original}_{tool}_{width}x{height}_{ppi}ppi'}" style="width:100%; background:var(--bg-tertiary); border:1px solid var(--border-medium); border-radius:6px; padding:8px 12px; color:var(--text-primary); font-size:0.85rem; font-family:var(--font-mono);" />
              <div style="font-size:0.72rem; color:var(--text-muted); margin-top:4px;">
                Tokens: {original}, {tool}, {width}, {height}, {ppi}, {date}, {time}, {index}
              </div>
            </div>
          </div>

          <!-- 3. Workflow & Auto-save -->
          <div style="background:var(--bg-secondary); border:1px solid var(--border-subtle); border-radius:12px; padding:20px;">
            <h3 style="font-size:1rem; font-weight:700; margin-bottom:14px; color:var(--accent-primary);">
              Automation & Workflow
            </h3>

            <div style="display:flex; align-items:center; justify-content:space-between; padding-bottom:12px; border-bottom:1px solid var(--border-subtle);">
              <div>
                <div style="font-weight:600; font-size:0.85rem;">Project Auto-Save</div>
                <div style="font-size:0.75rem; color:var(--text-muted);">Periodically sync canvas edits and vector settings to project storage</div>
              </div>
              <label class="switch">
                <input type="checkbox" id="check-autosave" ${state.autoSave !== false ? 'checked' : ''} />
                <span class="slider"></span>
              </label>
            </div>

            <div style="display:flex; align-items:center; justify-content:space-between; margin-top:12px;">
              <div>
                <div style="font-weight:600; font-size:0.85rem;">Auto-Save Interval</div>
                <div style="font-size:0.75rem; color:var(--text-muted);">Frequency in seconds</div>
              </div>
              <select id="select-autosave-interval" style="background:var(--bg-tertiary); border:1px solid var(--border-medium); color:var(--text-primary); padding:4px 8px; border-radius:6px; font-size:0.8rem;">
                <option value="30">Every 30 seconds</option>
                <option value="60" selected>Every 60 seconds</option>
                <option value="120">Every 2 minutes</option>
                <option value="300">Every 5 minutes</option>
              </select>
            </div>
          </div>

          <button class="btn btn-primary" id="btn-save-settings" style="width:100%; padding:10px;">
            Save All Preferences
          </button>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    // Theme
    const setTheme = (t) => {
      document.documentElement.setAttribute('data-theme', t);
      localStorage.setItem('cf_theme', t);
      store.setState({ theme: t });
      toast.info(`Theme set to ${t.toUpperCase()}`);
      this.render();
    };
    this.container.querySelector('#btn-theme-dark').onclick = () => setTheme('dark');
    this.container.querySelector('#btn-theme-light').onclick = () => setTheme('light');
    this.container.querySelector('#btn-theme-system').onclick = () => setTheme('dark');

    // Accent
    this.container.querySelectorAll('.btn-accent-swatch').forEach(btn => {
      btn.onclick = () => {
        const accent = btn.getAttribute('data-accent');
        document.documentElement.setAttribute('data-accent', accent);
        localStorage.setItem('cf_accent', accent);
        store.setState({ accentColor: accent });
        toast.success(`Accent color updated to ${accent.toUpperCase()}`);
        this.render();
      };
    });

    // Language
    const langSelect = this.container.querySelector('#select-setting-lang');
    if (langSelect) {
      langSelect.onchange = (e) => {
        const val = e.target.value;
        i18n.setLanguage(val);
        toast.success(`Language switched to ${val.toUpperCase()}`);
      };
    }

    // Density
    const densitySelect = this.container.querySelector('#select-setting-density');
    if (densitySelect) {
      densitySelect.onchange = (e) => {
        const val = e.target.value;
        document.documentElement.setAttribute('data-density', val);
        localStorage.setItem('cf_density', val);
        store.setState({ density: val });
        toast.info(`Interface density set to ${val}`);
      };
    }

    // Save All
    this.container.querySelector('#btn-save-settings').onclick = () => {
      const namingTemplate = this.container.querySelector('#input-naming-pattern').value.trim();
      const defaultPpi = parseInt(this.container.querySelector('#select-default-ppi').value, 10);
      const defaultFormat = this.container.querySelector('#select-default-format').value;
      const autoSave = this.container.querySelector('#check-autosave').checked;
      const autoSaveInterval = parseInt(this.container.querySelector('#select-autosave-interval').value, 10);

      store.setState({
        autoSave,
        autoSaveInterval,
        exportSettings: {
          ...store.getState().exportSettings,
          namingTemplate,
          ppi: defaultPpi,
          format: defaultFormat
        }
      });

      toast.success('All settings and defaults saved!');
    };

    const backBtn = this.container.querySelector('#btn-settings-back');
    if (backBtn) {
      backBtn.onclick = () => store.setState({ currentView: 'studio' });
    }
  }
}
