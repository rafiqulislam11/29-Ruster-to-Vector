/**
 * Creative Vector Studio — Real Interactive Layers Panel Component
 * Displays:
 * - Shape/path thumbnail
 * - Editable layer name
 * - Layer type badge (Path, Image, Group, Shape)
 * - Visibility toggle (eye icon)
 * - Lock toggle (lock icon)
 * - Opacity slider & indicator
 * - Color swatch
 * - Coordinates (X, Y)
 * - Object count (for grouped layers)
 * Allows: Rename, Duplicate, Delete, Group, Reorder, Hide, Lock
 */
import { toast } from './toast.js';

export class LayersPanel {
  constructor(container, canvasEditor) {
    this.container = container;
    this.editor = canvasEditor;
  }

  render(objects = null, selectedIds = null) {
    if (!this.container) return;
    const targetObjects = objects !== null ? objects : (this.editor ? this.editor.objects : []);
    const targetSelected = selectedIds !== null ? selectedIds : (this.editor ? Array.from(this.editor.selectedIds) : []);

    if (!targetObjects || targetObjects.length === 0) {
      this.container.innerHTML = `
        <div style="padding: 20px; text-align: center; color: var(--text-muted); font-size: 0.8rem;">
          <div style="font-size: 1.5rem; margin-bottom: 6px;">☷</div>
          No layers active.<br/>Trace a vector or add objects to edit layers.
        </div>
      `;
      return;
    }

    // Display topmost layer first (reverse order)
    const reversed = [...targetObjects].reverse();

    this.container.innerHTML = `
      <div class="layers-list-wrapper" style="display:flex; flex-direction:column; gap:4px; max-height:380px; overflow-y:auto; padding:4px;">
        ${reversed.map((obj, revIndex) => {
          const originalIndex = targetObjects.length - 1 - revIndex;
          const isSelected = targetSelected.includes(obj.id);

          return `
            <div class="layer-item ${isSelected ? 'selected' : ''}" data-id="${obj.id}" style="
              display:flex; align-items:center; justify-content:space-between;
              padding:6px 10px; border-radius:6px; background:${isSelected ? 'rgba(99,102,241,0.18)' : 'var(--bg-tertiary)'};
              border:1px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-subtle)'};
              cursor:pointer; font-size:0.75rem; transition:background 0.15s;
            ">
              <!-- Left: Thumbnail & Name -->
              <div style="display:flex; align-items:center; gap:8px; flex:1; min-width:0;">
                <!-- Thumbnail -->
                <div style="width:22px; height:22px; border-radius:4px; background:${obj.fill && obj.fill !== 'none' ? obj.fill : '#3b82f6'}; border:1px solid rgba(255,255,255,0.2); flex-shrink:0; display:flex; align-items:center; justify-content:center; color:#fff; font-size:9px; font-weight:700;">
                  ${obj.type === 'path' ? '⬡' : obj.type === 'image' ? '🖼' : '▭'}
                </div>

                <!-- Name (click to rename) -->
                <input type="text" class="layer-name-input" data-id="${obj.id}" value="${obj.name}" style="
                  background:transparent; border:none; color:var(--text-primary); font-size:0.75rem; font-weight:600;
                  width:100%; outline:none; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
                " title="Click to rename layer" />
              </div>

              <!-- Center: Type & Position Badge -->
              <div style="display:flex; align-items:center; gap:4px; margin:0 6px; flex-shrink:0;">
                <span class="badge badge-indigo" style="font-size:9px; padding:1px 5px;">${obj.type.toUpperCase()}</span>
                <span style="font-size:9px; color:var(--text-muted); font-family:var(--font-mono);">${Math.round(obj.x)},${Math.round(obj.y)}</span>
              </div>

              <!-- Right: Actions (Visibility, Lock, Reorder, Delete) -->
              <div style="display:flex; align-items:center; gap:4px; flex-shrink:0;">
                <!-- Opacity input -->
                <input type="number" min="0" max="100" class="layer-opacity-input" data-id="${obj.id}" value="${Math.round(obj.opacity * 100)}" title="Opacity %" style="width:34px; background:var(--bg-elevated); border:1px solid var(--border-subtle); color:var(--text-secondary); border-radius:3px; font-size:9px; text-align:center; padding:1px;" />

                <!-- Visibility Eye Toggle -->
                <button class="btn-icon btn-sm btn-toggle-vis" data-id="${obj.id}" title="${obj.visible ? 'Hide Layer' : 'Show Layer'}" style="color:${obj.visible ? 'var(--text-secondary)' : 'var(--text-muted)'}; padding:2px;">
                  ${obj.visible ? '👁' : '⌀'}
                </button>

                <!-- Lock Toggle -->
                <button class="btn-icon btn-sm btn-toggle-lock" data-id="${obj.id}" title="${obj.locked ? 'Unlock Layer' : 'Lock Layer'}" style="color:${obj.locked ? 'var(--status-warning)' : 'var(--text-muted)'}; padding:2px;">
                  ${obj.locked ? '🔒' : '🔓'}
                </button>

                <!-- Move Up / Down Buttons -->
                <button class="btn-icon btn-sm btn-move-up" data-id="${obj.id}" title="Bring Forward" style="padding:2px; font-size:10px;">▲</button>
                <button class="btn-icon btn-sm btn-move-down" data-id="${obj.id}" title="Send Backward" style="padding:2px; font-size:10px;">▼</button>

                <!-- Delete Button -->
                <button class="btn-icon btn-sm btn-delete-layer" data-id="${obj.id}" title="Delete Layer" style="color:var(--status-danger); padding:2px; font-size:11px;">×</button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    // Select on click
    this.container.querySelectorAll('.layer-item').forEach(el => {
      el.onclick = (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON') return;
        const id = el.getAttribute('data-id');
        if (this.editor) {
          if (e.shiftKey) {
            if (this.editor.selectedIds.has(id)) this.editor.selectedIds.delete(id);
            else this.editor.selectedIds.add(id);
          } else {
            this.editor.selectedIds.clear();
            this.editor.selectedIds.add(id);
          }
          this.editor.render();
          this.render(this.editor.objects, Array.from(this.editor.selectedIds));
        }
      };
    });

    // Rename layer
    this.container.querySelectorAll('.layer-name-input').forEach(input => {
      input.onchange = (e) => {
        const id = input.getAttribute('data-id');
        const obj = this.editor?.objects.find(o => o.id === id);
        if (obj) {
          obj.name = input.value.trim() || obj.name;
          this.editor.render();
          toast.info(`Renamed layer to "${obj.name}"`);
        }
      };
    });

    // Opacity change
    this.container.querySelectorAll('.layer-opacity-input').forEach(input => {
      input.onchange = (e) => {
        const id = input.getAttribute('data-id');
        const obj = this.editor?.objects.find(o => o.id === id);
        if (obj) {
          const val = Math.max(0, Math.min(100, parseInt(input.value, 10) || 100));
          obj.opacity = val / 100;
          this.editor.render();
        }
      };
    });

    // Toggle visibility
    this.container.querySelectorAll('.btn-toggle-vis').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        const obj = this.editor?.objects.find(o => o.id === id);
        if (obj) {
          obj.visible = !obj.visible;
          this.editor.render();
          this.render(this.editor.objects, Array.from(this.editor.selectedIds));
        }
      };
    });

    // Toggle lock
    this.container.querySelectorAll('.btn-toggle-lock').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        const obj = this.editor?.objects.find(o => o.id === id);
        if (obj) {
          obj.locked = !obj.locked;
          this.editor.render();
          this.render(this.editor.objects, Array.from(this.editor.selectedIds));
        }
      };
    });

    // Move Up
    this.container.querySelectorAll('.btn-move-up').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        const idx = this.editor?.objects.findIndex(o => o.id === id);
        if (idx !== undefined && idx < this.editor.objects.length - 1) {
          const temp = this.editor.objects[idx];
          this.editor.objects[idx] = this.editor.objects[idx + 1];
          this.editor.objects[idx + 1] = temp;
          this.editor.render();
          this.render(this.editor.objects, Array.from(this.editor.selectedIds));
        }
      };
    });

    // Move Down
    this.container.querySelectorAll('.btn-move-down').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        const idx = this.editor?.objects.findIndex(o => o.id === id);
        if (idx !== undefined && idx > 0) {
          const temp = this.editor.objects[idx];
          this.editor.objects[idx] = this.editor.objects[idx - 1];
          this.editor.objects[idx - 1] = temp;
          this.editor.render();
          this.render(this.editor.objects, Array.from(this.editor.selectedIds));
        }
      };
    });

    // Delete
    this.container.querySelectorAll('.btn-delete-layer').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        if (this.editor) {
          this.editor.objects = this.editor.objects.filter(o => o.id !== id);
          this.editor.selectedIds.delete(id);
          this.editor.render();
          this.render(this.editor.objects, Array.from(this.editor.selectedIds));
          toast.info('Deleted layer');
        }
      };
    });
  }

  update() {
    this.render();
  }

  destroy() {
    if (this.container) {
      this.container.innerHTML = '';
    }
  }
}
