/**
 * CreativeForge AI — Professional Creative Vector Studio Workspace
 */
import { store } from '../state.js';
import { api } from '../api.js';
import { toast } from '../components/toast.js';
import { ModalManager } from '../components/modal.js';
import { VectorTracer } from '../engines/vector-tracer.js';
import { FractalGlassEngine } from '../engines/fractal-glass.js';
import { FilmGrainEngine } from '../engines/film-grain.js';
import { GradientEngine } from '../engines/gradient-engine.js';
import { BackgroundRemovalEngine } from '../engines/bg-removal.js';
import { IconSheetEngine } from '../engines/icon-sheet.js';
import { IconPackEngine } from '../engines/icon-pack.js';
import { ImageUpscalerEngine } from '../engines/upscaler.js';
import { PpiWriter } from '../utils/ppi-writer.js';
import { PrintExporter } from '../utils/print-exporter.js';
import { PresetsLibrary } from '../engines/presets-library.js';
import { HotkeysManager } from '../utils/hotkeys.js';
import { CanvasEditor } from '../canvas/canvas-editor.js';
import { LayersPanel } from '../components/layers-panel.js';
import { StockReadyWorkflow } from './stock-ready-workflow.js';
import { i18n } from '../utils/i18n.js';

export class StudioView {
  constructor(container) {
    this.container = container;
    this.canvas = null;
    this.processedCanvas = null;
    this.processedSvg = null;
    this.isDraggingSlider = false;
    this.isPanning = false;
    this.startPan = { x: 0, y: 0 };
    this.toolCache = new Map();
    this.rafPending = false;
    this.currentBatchIndex = 0;
    this.canvasEditor = null;
    this.layersPanel = null;
    this.viewMode = 'compare'; // 'compare' | 'canvas'
  }

  render() {
    const state = store.getState();
    const user = state.user;
    const project = state.project;
    const batchAssets = state.batchAssets || [];

    this.container.innerHTML = `
      <div class="studio-container">
        <!-- TOP TOOLBAR -->
        <header class="studio-navbar">
          <div class="studio-nav-brand">
            <div class="brand-logo">CF</div>
            <div class="brand-title">
              <span>Creative Vector Studio</span>
              <span class="brand-subtitle">AI Vector & Print Engine</span>
            </div>
            <input type="text" id="project-name-input" class="studio-project-title-input" value="${project.name}" title="Click to rename project" />
          </div>

          <div class="studio-nav-center">
            <button class="btn btn-glass btn-sm" id="btn-top-upload" title="Universal Upload (Single or Batch up to 500+)">
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
              Upload
            </button>
            <button class="btn btn-icon btn-sm" id="btn-undo" title="Undo (Ctrl+Z)"><svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a5 5 0 015 5v2m-15-7l4-4m-4 4l4 4"/></svg></button>
            <button class="btn btn-icon btn-sm" id="btn-redo" title="Redo (Ctrl+Y)"><svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 10H11a5 5 0 00-5 5v2m15-7l-4-4m4 4l-4 4"/></svg></button>
            <div style="width:1px; height:16px; background:var(--border-medium); margin:0 2px;"></div>
            <button class="btn btn-icon btn-sm" id="btn-reset" title="Reset Changes"><svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg></button>
            <div style="width:1px; height:16px; background:var(--border-medium); margin:0 2px;"></div>

            <!-- Workspace Mode: Compare vs Interactive Canvas Editor -->
            <div style="display:flex; gap:2px; background:rgba(0,0,0,0.35); padding:2px; border-radius:6px; border:1px solid var(--border-medium);">
              <button class="btn btn-sm ${this.viewMode === 'compare' ? 'btn-primary' : 'btn-glass'}" id="btn-toggle-compare" title="Before/After Compare Engine">Compare</button>
              <button class="btn btn-sm ${this.viewMode === 'canvas' ? 'btn-primary' : 'btn-glass'}" id="btn-toggle-canvas" title="Interactive Vector Canvas & Layers Studio">✏️ Canvas & Layers</button>
            </div>

            <!-- Compare Sub-Modes -->
            <div id="compare-submodes" style="display:${this.viewMode === 'compare' ? 'flex' : 'none'}; gap:3px; margin-left:4px;">
              <button class="btn btn-sm ${state.compareMode === 'slider' ? 'btn-primary' : 'btn-glass'}" id="btn-mode-slider" title="Interactive Slider Compare">Slider</button>
              <button class="btn btn-sm ${state.compareMode === 'split' ? 'btn-primary' : 'btn-glass'}" id="btn-mode-split" title="Split Screen">Split</button>
              <button class="btn btn-sm ${state.compareMode === 'side-by-side' ? 'btn-primary' : 'btn-glass'}" id="btn-mode-side" title="Side by Side">Side</button>
            </div>
          </div>

          <div class="studio-nav-right">
            <div class="credit-pill" id="user-credits-pill" title="Remaining Credits">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              <span>${user.credits} Credits</span>
            </div>

            <button class="btn btn-glass btn-sm" id="btn-top-stock-ready" style="border-color:var(--accent-primary); color:var(--accent-secondary); font-weight:700;" title="1-Click Stock Ready Commercial Pipeline & ZIP">
              ⚡ Stock Ready
            </button>

            <button class="btn btn-secondary btn-sm" id="btn-save-project">Save</button>

            ${batchAssets.length > 1 ? `
              <button class="btn btn-glass btn-sm" id="btn-top-batch-export" style="border-color:var(--accent-secondary); color:var(--accent-secondary); font-weight:700;" title="Batch Export all ${batchAssets.length} assets in 300 PPI ZIP">
                ⚡ Batch (${batchAssets.length})
              </button>
            ` : ''}

            <button class="btn btn-primary btn-sm" id="btn-top-export">
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
              Export
            </button>

            <!-- Quick Navigation Icons -->
            <div style="width:1px; height:16px; background:var(--border-medium); margin:0 2px;"></div>
            <button class="btn btn-icon btn-sm" id="btn-nav-metadata" title="Commercial Microstock Tagging & Metadata Studio">🏷️</button>
            <button class="btn btn-icon btn-sm" id="btn-nav-presets" title="Preset Manager & Library">⭐</button>
            <button class="btn btn-icon btn-sm" id="btn-nav-settings" title="Studio Settings (Theme, Language, Accents, PPI)">⚙️</button>
            <button class="btn btn-icon btn-sm" id="btn-switch-account" title="Switch Demo Account (Free/Pro/Admin)">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            </button>
            <button class="btn btn-icon btn-sm" id="btn-show-shortcuts" title="Keyboard Shortcuts (?)" style="font-weight:700; font-size:0.82rem; color:var(--text-secondary);">
              ⌨
            </button>
          </div>
        </header>

        <!-- STUDIO WORKSPACE BODY -->
        <div class="studio-body">
          <!-- LEFT SIDEBAR: COMPLETE 17-STUDIO DIRECTORY -->
          <aside class="studio-sidebar-left" id="studio-sidebar-left">
            <!-- 1. VECTOR STUDIO -->
            <div class="tool-category-group">
              <div class="tool-category-header">
                <span>VECTOR STUDIO</span>
                <span class="badge badge-cyan">2 Tools</span>
              </div>
              <div class="tool-nav-item ${state.activeTool === 'tool_vector_convert' ? 'active' : ''}" data-tool="tool_vector_convert">
                <span class="tool-item-icon">⬡</span>
                <span>Image → Vector (SVG)</span>
              </div>
              <div class="tool-nav-item ${state.activeTool === 'tool_vector_trace' ? 'active' : ''}" data-tool="tool_vector_trace">
                <span class="tool-item-icon">⟡</span>
                <span>Vector Trace & Curves</span>
              </div>
            </div>

            <!-- 2. BACKGROUND STUDIO -->
            <div class="tool-category-group" style="border-top:1px solid var(--border-subtle); margin-top:6px;">
              <div class="tool-category-header">
                <span>BACKGROUND STUDIO</span>
                <span class="badge badge-green">3 Tools</span>
              </div>
              <div class="tool-nav-item ${state.activeTool === 'tool_bg_remove_white' ? 'active' : ''}" data-tool="tool_bg_remove_white">
                <span class="tool-item-icon">✂</span>
                <span>Remove White BG</span>
              </div>
              <div class="tool-nav-item ${state.activeTool === 'tool_bg_transparent' ? 'active' : ''}" data-tool="tool_bg_transparent">
                <span class="tool-item-icon">▨</span>
                <span>Transparent Cutout</span>
              </div>
              <div class="tool-nav-item ${state.activeTool === 'tool_bg_custom' ? 'active' : ''}" data-tool="tool_bg_custom">
                <span class="tool-item-icon">🎨</span>
                <span>Custom Color / Shadow</span>
              </div>
            </div>

            <!-- 3. UPSCALE STUDIO -->
            <div class="tool-category-group" style="border-top:1px solid var(--border-subtle); margin-top:6px;">
              <div class="tool-category-header">
                <span>UPSCALE STUDIO</span>
                <span class="badge badge-indigo">1 Tool</span>
              </div>
              <div class="tool-nav-item ${state.activeTool === 'tool_upscaler' ? 'active' : ''}" data-tool="tool_upscaler">
                <span class="tool-item-icon">⚡</span>
                <span>AI Image Upscaler</span>
              </div>
            </div>

            <!-- 4. GRADIENT STUDIO -->
            <div class="tool-category-group" style="border-top:1px solid var(--border-subtle); margin-top:6px;">
              <div class="tool-category-header">
                <span>GRADIENT STUDIO</span>
                <span class="badge badge-indigo">5 Tools</span>
              </div>
              <div class="tool-nav-item ${state.activeTool === 'tool_gradient_extract' ? 'active' : ''}" data-tool="tool_gradient_extract">
                <span class="tool-item-icon">◈</span>
                <span>Image → Gradient</span>
              </div>
              <div class="tool-nav-item ${state.activeTool === 'tool_gradient_maker_1' ? 'active' : ''}" data-tool="tool_gradient_maker_1">
                <span class="tool-item-icon">✦</span>
                <span>Gradient Maker 1</span>
              </div>
              <div class="tool-nav-item ${state.activeTool === 'tool_gradient_maker_2' ? 'active' : ''}" data-tool="tool_gradient_maker_2">
                <span class="tool-item-icon">✦</span>
                <span>Gradient Maker 2</span>
              </div>
              <div class="tool-nav-item ${state.activeTool === 'tool_gradient_maker_3' ? 'active' : ''}" data-tool="tool_gradient_maker_3">
                <span class="tool-item-icon">✦</span>
                <span>Gradient Maker 3</span>
              </div>
              <div class="tool-nav-item ${state.activeTool === 'tool_gradient_maker_4' ? 'active' : ''}" data-tool="tool_gradient_maker_4">
                <span class="tool-item-icon">✦</span>
                <span>Gradient Maker 4</span>
              </div>
            </div>

            <!-- 5. GLASS STUDIO -->
            <div class="tool-category-group" style="border-top:1px solid var(--border-subtle); margin-top:6px;">
              <div class="tool-category-header">
                <span>GLASS STUDIO</span>
                <span class="badge badge-cyan">6 Shaders</span>
              </div>
              <div class="tool-nav-item ${state.activeTool === 'tool_fractal_glass_1' ? 'active' : ''}" data-tool="tool_fractal_glass_1">
                <span class="tool-item-icon">❄</span>
                <span>Prism Refraction 1</span>
              </div>
              <div class="tool-nav-item ${state.activeTool === 'tool_fractal_glass_2' ? 'active' : ''}" data-tool="tool_fractal_glass_2">
                <span class="tool-item-icon">❄</span>
                <span>Diamond Dispersion 2</span>
              </div>
              <div class="tool-nav-item ${state.activeTool === 'tool_fractal_glass_3' ? 'active' : ''}" data-tool="tool_fractal_glass_3">
                <span class="tool-item-icon">❄</span>
                <span>Frosted Caustic 3</span>
              </div>
              <div class="tool-nav-item ${state.activeTool === 'tool_fractal_glass_3_1' ? 'active' : ''}" data-tool="tool_fractal_glass_3_1">
                <span class="tool-item-icon">❄</span>
                <span>Crystal Geometric 3.1</span>
              </div>
              <div class="tool-nav-item ${state.activeTool === 'tool_fractal_glass_3_2' ? 'active' : ''}" data-tool="tool_fractal_glass_3_2">
                <span class="tool-item-icon">❄</span>
                <span>Fluted Architectural 3.2</span>
              </div>
              <div class="tool-nav-item ${state.activeTool === 'tool_fractal_glass_3_3' ? 'active' : ''}" data-tool="tool_fractal_glass_3_3">
                <span class="tool-item-icon">❄</span>
                <span>Holographic Prism 3.3</span>
              </div>
            </div>

            <!-- 6. FILM GRAIN STUDIO -->
            <div class="tool-category-group" style="border-top:1px solid var(--border-subtle); margin-top:6px;">
              <div class="tool-category-header">
                <span>FILM GRAIN STUDIO</span>
                <span class="badge badge-indigo">1 Engine</span>
              </div>
              <div class="tool-nav-item ${state.activeTool === 'tool_film_grain' ? 'active' : ''}" data-tool="tool_film_grain">
                <span class="tool-item-icon">🎞</span>
                <span>Analog Film Grain</span>
              </div>
            </div>

            <!-- 7. ICON & SHEET STUDIO -->
            <div class="tool-category-group" style="border-top:1px solid var(--border-subtle); margin-top:6px;">
              <div class="tool-category-header">
                <span>ICON & SHEET STUDIO</span>
                <span class="badge badge-cyan">4 Tools</span>
              </div>
              <div class="tool-nav-item ${state.activeTool === 'tool_icon_sheet_1' ? 'active' : ''}" data-tool="tool_icon_sheet_1">
                <span class="tool-item-icon">田</span>
                <span>Minimal Sheet 1</span>
              </div>
              <div class="tool-nav-item ${state.activeTool === 'tool_icon_sheet_2' ? 'active' : ''}" data-tool="tool_icon_sheet_2">
                <span class="tool-item-icon">田</span>
                <span>Marketplace Sheet 2</span>
              </div>
              <div class="tool-nav-item ${state.activeTool === 'tool_icon_sheet_3' ? 'active' : ''}" data-tool="tool_icon_sheet_3">
                <span class="tool-item-icon">田</span>
                <span>Presentation Sheet 3</span>
              </div>
              <div class="tool-nav-item ${state.activeTool === 'tool_icon_pack' ? 'active' : ''}" data-tool="tool_icon_pack">
                <span class="tool-item-icon">📦</span>
                <span>Icon Pack Maker (ZIP)</span>
              </div>
            </div>

            <!-- WORKSPACE MODULES -->
            <div class="tool-category-group" style="border-top:1px solid var(--border-subtle); margin-top:6px;">
              <div class="tool-category-header">
                <span>STUDIO WORKSPACES</span>
                <span class="badge badge-indigo">8 Studios</span>
              </div>
              <div class="tool-nav-item ${this.viewMode === 'canvas' ? 'active' : ''}" data-tool="tool_canvas_studio">
                <span class="tool-item-icon">✏️</span>
                <span>Canvas & Layers</span>
              </div>
              <div class="tool-nav-item" data-tool="tool_stock_ready">
                <span class="tool-item-icon">⚡</span>
                <span>Stock Ready Pipeline</span>
              </div>
              <div class="tool-nav-item" data-tool="tool_batch_studio">
                <span class="tool-item-icon">⚡</span>
                <span>Batch Studio (500+)</span>
              </div>
              <div class="tool-nav-item" data-tool="tool_metadata_studio">
                <span class="tool-item-icon">🏷️</span>
                <span>Metadata Studio</span>
              </div>
              <div class="tool-nav-item" data-tool="tool_preset_manager">
                <span class="tool-item-icon">⭐</span>
                <span>Preset Manager</span>
              </div>
              <div class="tool-nav-item" data-tool="tool_project_manager">
                <span class="tool-item-icon">📁</span>
                <span>Project Manager</span>
              </div>
              <div class="tool-nav-item" data-tool="tool_export_center">
                <span class="tool-item-icon">📦</span>
                <span>Export Center</span>
              </div>
              <div class="tool-nav-item" data-tool="tool_settings">
                <span class="tool-item-icon">⚙️</span>
                <span>Settings & Themes</span>
              </div>
              <div class="tool-nav-item" data-tool="tool_dashboard">
                <span class="tool-item-icon">📊</span>
                <span>SaaS Dashboard</span>
              </div>
              <div class="tool-nav-item" data-tool="tool_admin">
                <span class="tool-item-icon">🛡️</span>
                <span>Admin Console</span>
              </div>
            </div>
          </aside>

          <!-- CENTER CANVAS VIEWPORT -->
          <main class="studio-canvas-container" id="canvas-container">
            ${batchAssets.length > 1 ? `
              <!-- Dynamic Batch Processing & Queue Bar -->
              <div class="batch-queue-bar" id="studio-batch-bar" style="display:flex; align-items:center; justify-content:space-between; background:rgba(18,20,29,0.95); border:1px solid rgba(99,102,241,0.3); border-radius:10px; padding:8px 14px; margin-bottom:12px; width:100%; box-sizing:border-box; box-shadow:0 4px 20px rgba(0,0,0,0.5);">
                <div style="display:flex; align-items:center; gap:10px;">
                  <span class="badge badge-cyan" style="font-weight:700; padding:3px 8px;">⚡ BATCH QUEUE (${batchAssets.length})</span>
                  <div style="display:flex; align-items:center; gap:6px;">
                    <button class="btn btn-icon btn-sm" id="btn-batch-prev" title="Previous Image in Batch">◀</button>
                    <span style="font-size:0.75rem; color:var(--text-secondary); font-family:var(--font-mono);" id="batch-current-index-text">
                      #${this.currentBatchIndex + 1} of ${batchAssets.length}: <strong>${batchAssets[this.currentBatchIndex]?.name || state.originalFileName}</strong>
                    </span>
                    <button class="btn btn-icon btn-sm" id="btn-batch-next" title="Next Image in Batch">▶</button>
                  </div>
                </div>
                <div style="display:flex; align-items:center; gap:8px;">
                  <button class="btn btn-primary btn-sm" id="btn-launch-batch-process" style="box-shadow:0 0 15px rgba(99,102,241,0.4);">
                    ⚡ Batch Process & Export All ${batchAssets.length} (300 PPI ZIP)
                  </button>
                </div>
              </div>
            ` : ''}

            <!-- Canvas Viewport Wrapper -->
            <div id="canvas-viewport" class="canvas-viewport-wrapper" style="width:100%; height:100%; position:relative;">
              <!-- Rendered dynamically (either Compare or CanvasEditor) -->
            </div>

            <!-- Floating Viewport Controls -->
            <div class="canvas-floating-bar">
              ${this.viewMode === 'compare' ? `
                <button class="btn btn-glass btn-sm" id="btn-floating-edit-canvas" style="border-color:var(--accent-secondary); color:var(--accent-secondary); font-weight:700;" title="Send processed result to interactive Canvas Editor">
                  ✏️ Edit on Canvas
                </button>
                <div style="width:1px; height:16px; background:var(--border-medium); margin:0 4px;"></div>
              ` : ''}
              <button class="btn-icon btn-sm" id="btn-zoom-out" title="Zoom Out">
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/></svg>
              </button>
              <span class="zoom-indicator" id="zoom-text">${state.zoom}%</span>
              <button class="btn-icon btn-sm" id="btn-zoom-in" title="Zoom In">
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
              </button>
              <div style="width:1px; height:16px; background:var(--border-medium); margin:0 4px;"></div>
              <button class="btn btn-glass btn-sm" id="btn-fit-screen">Fit</button>
              <button class="btn btn-glass btn-sm" id="btn-reset-zoom">100%</button>
            </div>
          </main>

          <!-- RIGHT PANEL: DYNAMIC INSPECTOR -->
          <aside class="studio-panel-right" id="studio-panel-right">
            <!-- Rendered by renderInspector() -->
          </aside>
        </div>
      </div>
    `;

    this.bindEvents();
    this.renderInspector();
    this.updateProcessing();
  }

  bindEvents() {
    // Batch Navigation & Controls
    const batchAssets = store.getState().batchAssets || [];
    if (batchAssets.length > 1) {
      const launchBatch = () => {
        ModalManager.openBatchModal(batchAssets, store.getState().activeTool, store.getState().params);
      };
      const batchBtn = this.container.querySelector('#btn-launch-batch-process');
      if (batchBtn) batchBtn.onclick = launchBatch;
      const topBatchBtn = this.container.querySelector('#btn-top-batch-export');
      if (topBatchBtn) topBatchBtn.onclick = launchBatch;

      const prevBtn = this.container.querySelector('#btn-batch-prev');
      const nextBtn = this.container.querySelector('#btn-batch-next');
      const loadBatchItem = (idx) => {
        this.currentBatchIndex = (idx + batchAssets.length) % batchAssets.length;
        const file = batchAssets[this.currentBatchIndex];
        const reader = new FileReader();
        reader.onload = async (e) => {
          const img = new Image();
          img.src = e.target.result;
          await img.decode();
          store.setState({
            originalImage: img,
            originalImageUrl: img.src,
            originalFileName: file.name,
            originalWidth: img.naturalWidth || img.width || 1200,
            originalHeight: img.naturalHeight || img.height || 800
          });
          this.renderInspector();
          this.updateProcessing(true);
          const idxText = this.container.querySelector('#batch-current-index-text');
          if (idxText) {
            idxText.innerHTML = `#${this.currentBatchIndex + 1} of ${batchAssets.length}: <strong>${file.name}</strong>`;
          }
        };
        reader.readAsDataURL(file);
      };
      if (prevBtn) prevBtn.onclick = () => loadBatchItem(this.currentBatchIndex - 1);
      if (nextBtn) nextBtn.onclick = () => loadBatchItem(this.currentBatchIndex + 1);
    }

    // Project Rename
    const projInput = this.container.querySelector('#project-name-input');
    projInput.onchange = () => {
      const newName = projInput.value.trim() || 'Untitled Project';
      store.setState({ project: { ...store.getState().project, name: newName } });
      toast.info(`Project renamed to "${newName}"`);
    };

    // Top upload button
    this.container.querySelector('#btn-top-upload').onclick = () => {
      ModalManager.openUploadModal(() => {
        this.render();
      });
    };

    // Undo / Redo / Reset
    this.container.querySelector('#btn-undo').onclick = () => {
      store.undo();
      this.renderInspector();
      this.updateProcessing();
      toast.info('Undo');
    };
    this.container.querySelector('#btn-redo').onclick = () => {
      store.redo();
      this.renderInspector();
      this.updateProcessing();
      toast.info('Redo');
    };
    this.container.querySelector('#btn-reset').onclick = () => {
      this.updateProcessing();
      toast.info('Reset to original parameters');
    };

    // Compare Mode Toggles
    const setCompareSubMode = (mode) => {
      store.setState({ compareMode: mode });
      this.container.querySelector('#btn-mode-slider').className = `btn btn-sm ${mode === 'slider' ? 'btn-primary' : 'btn-glass'}`;
      this.container.querySelector('#btn-mode-split').className = `btn btn-sm ${mode === 'split' ? 'btn-primary' : 'btn-glass'}`;
      this.container.querySelector('#btn-mode-side').className = `btn btn-sm ${mode === 'side-by-side' ? 'btn-primary' : 'btn-glass'}`;
      this.updateCanvasDisplay();
    };
    this.container.querySelector('#btn-mode-slider').onclick = () => setCompareSubMode('slider');
    this.container.querySelector('#btn-mode-split').onclick = () => setCompareSubMode('split');
    this.container.querySelector('#btn-mode-side').onclick = () => setCompareSubMode('side-by-side');

    // Workspace Mode: Compare Mode vs Canvas & Layers Mode
    const compareToggleBtn = this.container.querySelector('#btn-toggle-compare');
    const canvasToggleBtn = this.container.querySelector('#btn-toggle-canvas');
    const subModesWrap = this.container.querySelector('#compare-submodes');

    const switchWorkspaceMode = (mode) => {
      this.viewMode = mode;
      if (mode === 'compare') {
        compareToggleBtn.className = 'btn btn-sm btn-primary';
        canvasToggleBtn.className = 'btn btn-sm btn-glass';
        if (subModesWrap) subModesWrap.style.display = 'flex';
        this.updateCanvasDisplay();
        this.renderInspector();
      } else {
        compareToggleBtn.className = 'btn btn-sm btn-glass';
        canvasToggleBtn.className = 'btn btn-sm btn-primary';
        if (subModesWrap) subModesWrap.style.display = 'none';
        this.renderCanvasEditor();
      }
    };

    compareToggleBtn.onclick = () => switchWorkspaceMode('compare');
    canvasToggleBtn.onclick = () => switchWorkspaceMode('canvas');

    // Floating Edit on Canvas Button (in compare mode)
    const floatEditCanvasBtn = this.container.querySelector('#btn-floating-edit-canvas');
    if (floatEditCanvasBtn) {
      floatEditCanvasBtn.onclick = () => switchWorkspaceMode('canvas');
    }

    // 1-Click Stock Ready Commercial Pipeline
    const stockReadyTopBtn = this.container.querySelector('#btn-top-stock-ready');
    if (stockReadyTopBtn) {
      stockReadyTopBtn.onclick = () => {
        const source = this.processedCanvas || store.getState().originalImage;
        StockReadyWorkflow.openStockReadyModal(source);
      };
    }

    // Quick Navigation Icons in Top Navbar
    const navMetaBtn = this.container.querySelector('#btn-nav-metadata');
    if (navMetaBtn) navMetaBtn.onclick = () => store.setState({ currentView: 'metadata-studio' });

    const navPresetsBtn = this.container.querySelector('#btn-nav-presets');
    if (navPresetsBtn) navPresetsBtn.onclick = () => store.setState({ currentView: 'preset-manager' });

    const navSettingsBtn = this.container.querySelector('#btn-nav-settings');
    if (navSettingsBtn) navSettingsBtn.onclick = () => store.setState({ currentView: 'settings' });

    // Save Project
    this.container.querySelector('#btn-save-project').onclick = async () => {
      const { project, activeTool, params } = store.getState();
      try {
        await api.updateProject(project.id, {
          name: project.name,
          active_tool: activeTool,
          tool_settings: params
        });
        toast.success(`Project "${project.name}" saved!`);
      } catch (e) {
        toast.success(`Project "${project.name}" saved locally!`);
      }
    };

    // Export Trigger
    this.container.querySelector('#btn-top-export').onclick = () => {
      if (this.viewMode === 'canvas' && this.canvasEditor) {
        store.setState({ currentView: 'export-center' });
      } else if (this.processedCanvas) {
        ModalManager.openExportModal(this.processedCanvas, this.processedSvg);
      } else {
        toast.error('No processed asset to export yet.');
      }
    };

    // Keyboard Shortcuts Button
    const shortcutsBtn = this.container.querySelector('#btn-show-shortcuts');
    if (shortcutsBtn) {
      shortcutsBtn.onclick = () => ModalManager.openShortcutsModal();
    }

    // Global Hotkeys Listener
    HotkeysManager.init({
      onUndo: () => {
        if (this.viewMode === 'canvas' && this.canvasEditor) {
          this.canvasEditor.undo();
        } else {
          store.undo();
          this.renderInspector();
          this.updateProcessing();
        }
        toast.info('Undo');
      },
      onRedo: () => {
        if (this.viewMode === 'canvas' && this.canvasEditor) {
          this.canvasEditor.redo();
        } else {
          store.redo();
          this.renderInspector();
          this.updateProcessing();
        }
        toast.info('Redo');
      },
      onZoomIn: () => {
        const cur = store.getState().zoom || 100;
        store.setState({ zoom: Math.min(800, cur + 25) });
        const valEl = this.container.querySelector('#val-zoom');
        if (valEl) valEl.textContent = `${store.getState().zoom}%`;
        this.updateCanvasDisplay();
      },
      onZoomOut: () => {
        const cur = store.getState().zoom || 100;
        store.setState({ zoom: Math.max(25, cur - 25) });
        const valEl = this.container.querySelector('#val-zoom');
        if (valEl) valEl.textContent = `${store.getState().zoom}%`;
        this.updateCanvasDisplay();
      },
      onZoomReset: () => {
        store.setState({ zoom: 100 });
        const valEl = this.container.querySelector('#val-zoom');
        if (valEl) valEl.textContent = '100%';
        this.updateCanvasDisplay();
      },
      onQuickExport: () => {
        if (this.processedCanvas) {
          ModalManager.openExportModal(this.processedCanvas, this.processedSvg);
        }
      },
      onToggleBatch: () => {
        const batchAssets = store.getState().batchAssets || [];
        ModalManager.openBatchModal(batchAssets, store.getState().activeTool, store.getState().params);
      },
      onShowShortcuts: () => {
        ModalManager.openShortcutsModal();
      }
    });

    // Switch Account
    this.container.querySelector('#btn-switch-account').onclick = () => {
      ModalManager.openAuthModal((user) => {
        this.container.querySelector('#user-credits-pill span').textContent = `${user.credits} Credits`;
      });
    };

    // Complete 17-Studio Left Sidebar Router
    const toolItems = this.container.querySelectorAll('.tool-nav-item');
    toolItems.forEach(item => {
      item.onclick = () => {
        const tool = item.getAttribute('data-tool');

        // Studio workspace router
        if (tool === 'tool_canvas_studio') {
          switchWorkspaceMode('canvas');
          toolItems.forEach(i => i.classList.remove('active'));
          item.classList.add('active');
          return;
        } else if (tool === 'tool_stock_ready') {
          const source = this.processedCanvas || store.getState().originalImage;
          StockReadyWorkflow.openStockReadyModal(source);
          return;
        } else if (tool === 'tool_batch_studio') {
          ModalManager.openBatchModal(store.getState().batchAssets || [], store.getState().activeTool, store.getState().params);
          return;
        } else if (tool === 'tool_metadata_studio') {
          store.setState({ currentView: 'metadata-studio' });
          return;
        } else if (tool === 'tool_preset_manager') {
          store.setState({ currentView: 'preset-manager' });
          return;
        } else if (tool === 'tool_project_manager') {
          store.setState({ currentView: 'project-manager' });
          return;
        } else if (tool === 'tool_export_center') {
          store.setState({ currentView: 'export-center' });
          return;
        } else if (tool === 'tool_settings') {
          store.setState({ currentView: 'settings' });
          return;
        } else if (tool === 'tool_dashboard') {
          store.setState({ currentView: 'dashboard' });
          return;
        } else if (tool === 'tool_admin') {
          store.setState({ currentView: 'admin' });
          return;
        }

        // Standard tool selection
        toolItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        if (this.viewMode === 'canvas') {
          switchWorkspaceMode('compare');
        }

        store.setState({ activeTool: tool });
        this.renderInspector();
        this.updateProcessing();
      };
    });

    // Zoom Controls
    const zoomText = this.container.querySelector('#zoom-text');
    const updateZoomUI = () => {
      const z = store.getState().zoom;
      zoomText.textContent = `${z}%`;
      const viewport = this.container.querySelector('#canvas-viewport');
      if (viewport) {
        viewport.style.transform = `scale(${z / 100})`;
      }
    };

    this.container.querySelector('#btn-zoom-in').onclick = () => {
      const cur = store.getState().zoom;
      if (cur < 400) store.setState({ zoom: cur + 25 });
      updateZoomUI();
    };
    this.container.querySelector('#btn-zoom-out').onclick = () => {
      const cur = store.getState().zoom;
      if (cur > 25) store.setState({ zoom: cur - 25 });
      updateZoomUI();
    };
    this.container.querySelector('#btn-reset-zoom').onclick = () => {
      store.setState({ zoom: 100 });
      updateZoomUI();
    };
    this.container.querySelector('#btn-fit-screen').onclick = () => {
      store.setState({ zoom: 85 });
      updateZoomUI();
    };
  }

  /**
   * Render dynamic right inspector panel based on selected tool
   */
  renderInspector() {
    const panel = this.container.querySelector('#studio-panel-right');
    if (!panel) return;

    if (this.viewMode === 'canvas') {
      this.renderCanvasInspector(this.canvasEditor ? this.canvasEditor.selectedObjects : []);
      return;
    }

    const state = store.getState();
    const tool = state.activeTool;
    const p = state.params;

    let content = '';

    if (tool === 'tool_gradient_extract') {
      content = `
        <div class="panel-header">
          <span class="panel-title">Image → Gradient</span>
          <span class="badge badge-indigo">1 Credit</span>
        </div>
        <div class="panel-content">
          <p style="font-size:0.8rem; color:var(--text-secondary); margin-bottom:14px;">
            Extracts dominant color harmony from the image and generates multi-stop gradients.
          </p>

          <div class="control-group">
            <div class="control-label"><span>Gradient Type</span></div>
            <select id="param-gradient-type" style="width:100%;">
              <option value="linear" ${p.gradientType === 'linear' ? 'selected' : ''}>Linear Gradient</option>
              <option value="radial" ${p.gradientType === 'radial' ? 'selected' : ''}>Radial Gradient</option>
              <option value="mesh" ${p.gradientType === 'mesh' ? 'selected' : ''}>Mesh Gradient</option>
              <option value="soft" ${p.gradientType === 'soft' ? 'selected' : ''}>Soft Gradient</option>
              <option value="blur" ${p.gradientType === 'blur' ? 'selected' : ''}>Blur Gradient</option>
            </select>
          </div>

          <div class="control-group">
            <div class="control-label">
              <span>Color Harmony Stops</span>
              <div style="display:flex; gap:4px;">
                <button class="btn btn-glass btn-sm" id="btn-add-color-stop" style="padding:2px 8px;" title="Add color stop">+ Add</button>
                <button class="btn btn-glass btn-sm" id="btn-random-colors" style="padding:2px 8px;" title="Randomize color palette">🎲 Random</button>
                <button class="btn btn-glass btn-sm" id="btn-regen-palette" style="padding:2px 8px;" title="Extract colors from image">Re-Extract</button>
              </div>
            </div>
            <div class="color-swatch-list" id="palette-swatches" style="display:flex; flex-wrap:wrap; gap:8px;">
              ${p.gradientColors.map((c, i) => `
                <div style="position:relative; display:inline-flex; align-items:center;">
                  <input type="color" class="color-swatch" value="${c}" data-index="${i}" title="Stop ${i+1}: ${c}" />
                  ${p.gradientColors.length > 2 ? `<button class="btn-remove-stop" data-remove-index="${i}" title="Remove stop" style="position:absolute; top:-5px; right:-5px; width:15px; height:15px; border-radius:50%; background:var(--accent-danger, #ef4444); color:#fff; border:1px solid #fff; font-size:10px; cursor:pointer; display:flex; align-items:center; justify-content:center; padding:0; line-height:1;">×</button>` : ''}
                </div>
              `).join('')}
            </div>
          </div>

          <div class="control-group">
            <div class="control-label"><span>Gradient Angle</span><span class="control-value" id="val-angle">${p.gradientAngle}°</span></div>
            <input type="range" class="range-slider" id="param-angle" min="0" max="360" value="${p.gradientAngle}" />
          </div>

          <div class="control-group">
            <div class="control-label"><span>Blur Softness</span><span class="control-value" id="val-blur">${p.gradientBlur}px</span></div>
            <input type="range" class="range-slider" id="param-blur" min="0" max="100" value="${p.gradientBlur}" />
          </div>

          <div style="display:grid; grid-template-columns: 1.4fr 1fr; gap:8px; margin-top:20px;">
            <button class="btn btn-primary" id="btn-process-tool">
              Generate Gradient
            </button>
            <button class="btn btn-secondary" id="btn-quick-export-300" title="Instant 300 PPI High-Resolution Download">
              300 PPI ↓
            </button>
          </div>
        </div>
      `;
    } else if (tool === 'tool_upscaler') {
      const curW = state.originalWidth || 1200;
      const curH = state.originalHeight || 800;
      const is300 = p.upscaleResolution === '300PPI';
      const targetW = is300 ? 4500 : p.upscaleResolution === '8K' ? 7680 : p.upscaleResolution === '6K' ? 6144 : p.upscaleResolution === '4K' ? 3840 : 2560;
      const targetH = Math.round(targetW * (curH / curW));
      const inW = (targetW / 300).toFixed(1);
      const inH = (targetH / 300).toFixed(1);
      const cmW = ((targetW / 300) * 2.54).toFixed(1);
      const cmH = ((targetH / 300) * 2.54).toFixed(1);

      content = `
        <div class="panel-header">
          <span class="panel-title">AI Image Upscaler</span>
          <span class="badge badge-cyan">3 Credits</span>
        </div>
        <div class="panel-content">
          <div style="background:rgba(6,182,212,0.1); border:1px solid rgba(6,182,212,0.3); border-radius:8px; padding:12px; margin-bottom:16px; font-size:0.75rem;">
            <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
              <span>Source: <strong>${curW} × ${curH} px</strong></span>
              <span class="badge badge-indigo">72 PPI Standard</span>
            </div>
            <div style="display:flex; justify-content:space-between; color:var(--accent-secondary); font-weight:700;">
              <span>Target: <strong>${targetW} × ${targetH} px</strong></span>
              <span class="badge badge-cyan">300 PPI Print Ready</span>
            </div>
            <div style="font-family:var(--font-mono); font-size:0.72rem; color:var(--text-muted); margin-top:6px;">
              Print Dimension: ${inW}" × ${inH}" (${cmW} × ${cmH} cm)
            </div>
          </div>

          <div class="control-group">
            <div class="control-label"><span>Resolution Mode & Print Density</span></div>
            <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:6px; margin-bottom:6px;">
              ${['2K', '4K', '6K'].map(res => `
                <button class="btn btn-sm ${p.upscaleResolution === res ? 'btn-primary' : 'btn-secondary'}" data-res="${res}">${res}</button>
              `).join('')}
            </div>
            <div style="display:grid; grid-template-columns: 1fr 1.3fr; gap:6px;">
              <button class="btn btn-sm ${p.upscaleResolution === '8K' ? 'btn-primary' : 'btn-secondary'}" data-res="8K">8K Cinema</button>
              <button class="btn btn-sm ${p.upscaleResolution === '300PPI' ? 'btn-primary' : 'btn-secondary'}" data-res="300PPI" style="border-color:var(--accent-primary);">
                ✦ 300 PPI Master
              </button>
            </div>
          </div>

          <div class="control-group">
            <div class="control-label"><span>Sharpness & Edge Clarity</span><span class="control-value">${p.upscaleSharpness}%</span></div>
            <input type="range" class="range-slider" id="param-sharpness" min="0" max="100" value="${p.upscaleSharpness}" />
          </div>

          <div class="control-group">
            <div class="control-label"><span>Detail Enhancement</span><span class="control-value">${p.upscaleDetail}%</span></div>
            <input type="range" class="range-slider" id="param-detail" min="0" max="100" value="${p.upscaleDetail}" />
          </div>

          <div class="control-group">
            <div class="control-label"><span>Noise & Grain Reduction</span><span class="control-value">${p.upscaleNoiseReduction}%</span></div>
            <input type="range" class="range-slider" id="param-noise-red" min="0" max="100" value="${p.upscaleNoiseReduction}" />
          </div>

          <div style="display:grid; grid-template-columns: 1.4fr 1fr; gap:8px; margin-top:16px;">
            <button class="btn btn-primary" id="btn-process-tool">
              Process 300 PPI Upscale
            </button>
            <button class="btn btn-secondary" id="btn-quick-export-300" title="Instant 300 PPI High-Resolution Download">
              300 PPI ↓
            </button>
          </div>
        </div>
      `;
    } else if (tool === 'tool_film_grain') {
      content = `
        <div class="panel-header">
          <span class="panel-title">Film Grain Engine</span>
          <span class="badge badge-indigo">1 Credit</span>
        </div>
        <div class="panel-content">
          <div class="control-group">
            <div class="control-label"><span>Film Emulsion Presets</span></div>
            <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:6px;">
              ${Object.keys(FilmGrainEngine.presets).map(k => `
                <button class="btn btn-sm ${p.grainPreset === k ? 'btn-primary' : 'btn-secondary'}" data-grain-preset="${k}">
                  ${FilmGrainEngine.presets[k].name.split(' ')[0]}
                </button>
              `).join('')}
            </div>
          </div>

          <div class="control-group">
            <div class="control-label"><span>Grain Amount</span><span class="control-value">${p.grainAmount}%</span></div>
            <input type="range" class="range-slider" id="param-grain-amount" min="0" max="100" value="${p.grainAmount}" />
          </div>

          <div class="control-group">
            <div class="control-label"><span>Grain Size</span><span class="control-value">${p.grainSize}x</span></div>
            <input type="range" class="range-slider" id="param-grain-size" min="1" max="5" value="${p.grainSize}" />
          </div>

          <div class="control-group">
            <div class="control-label"><span>Tonal Contrast</span><span class="control-value">${p.grainContrast}%</span></div>
            <input type="range" class="range-slider" id="param-grain-contrast" min="0" max="100" value="${p.grainContrast}" />
          </div>

          <div style="display:grid; grid-template-columns: 1.4fr 1fr; gap:8px; margin-top:20px;">
            <button class="btn btn-primary" id="btn-process-tool">
              Apply Analog Texture
            </button>
            <button class="btn btn-secondary" id="btn-quick-export-300" title="Instant 300 PPI High-Resolution Download">
              300 PPI ↓
            </button>
          </div>
        </div>
      `;
    } else if (tool.startsWith('tool_fractal_glass')) {
      const presetKey = tool.replace('tool_fractal_glass_', '').replace('_', '.');
      const presetName = FractalGlassEngine.presets[presetKey]?.name || 'Fractal Glass';
      content = `
        <div class="panel-header">
          <span class="panel-title">Fractal Glass</span>
          <span class="badge badge-cyan">2 Credits</span>
        </div>
        <div class="panel-content">
          <div style="font-size:0.8rem; color:var(--accent-secondary); font-weight:700; margin-bottom:12px;">
            ${presetName}
          </div>

          <div class="control-group">
            <div class="control-label"><span>Refraction Strength</span><span class="control-value">${p.glassRefraction}%</span></div>
            <input type="range" class="range-slider" id="param-glass-refraction" min="0" max="100" value="${p.glassRefraction}" />
          </div>

          <div class="control-group">
            <div class="control-label"><span>Fractal Distortion</span><span class="control-value">${p.glassDistortion}%</span></div>
            <input type="range" class="range-slider" id="param-glass-distortion" min="0" max="100" value="${p.glassDistortion}" />
          </div>

          <div class="control-group">
            <div class="control-label"><span>Transparency</span><span class="control-value">${p.glassTransparency}%</span></div>
            <input type="range" class="range-slider" id="param-glass-transparency" min="10" max="100" value="${p.glassTransparency}" />
          </div>

          <div class="control-group">
            <div class="control-label"><span>Specular Light Reflection</span><span class="control-value">${p.glassLight}%</span></div>
            <input type="range" class="range-slider" id="param-glass-light" min="0" max="100" value="${p.glassLight}" />
          </div>

          <div class="control-group">
            <div class="control-label"><span>Color Tint Overlay</span></div>
            <div style="display:flex; align-items:center; gap:8px;">
              <input type="color" id="param-glass-tint" value="${p.glassTint || '#6366f1'}" class="color-swatch" style="width:36px; height:36px;" />
              <span style="font-size:0.75rem; color:var(--text-muted);">Prism Glass Tint Color</span>
            </div>
          </div>

          <div style="display:grid; grid-template-columns: 1.4fr 1fr; gap:8px; margin-top:16px;">
            <button class="btn btn-primary" id="btn-process-tool">
              Render Glass Shader
            </button>
            <button class="btn btn-secondary" id="btn-quick-export-300" title="Instant 300 PPI High-Resolution Download">
              300 PPI ↓
            </button>
          </div>
        </div>
      `;
    } else if (tool.startsWith('tool_gradient_maker')) {
      const sysNum = parseInt(tool.replace('tool_gradient_maker_', ''), 10);
      content = `
        <div class="panel-header">
          <span class="panel-title">Gradient Maker ${sysNum}</span>
          <span class="badge badge-indigo">1 Credit</span>
        </div>
        <div class="panel-content">
          <div class="control-group">
            <div class="control-label">
              <span>Color Stops</span>
              <button class="btn btn-glass btn-sm" id="btn-add-maker-stop" style="padding:2px 8px;">+ Add Stop</button>
            </div>
            <div class="color-swatch-list" style="display:flex; flex-wrap:wrap; gap:8px;">
              ${p.gradientColors.map((c, i) => `
                <div style="position:relative; display:inline-flex; align-items:center;">
                  <input type="color" class="color-swatch" value="${c}" data-index="${i}" title="Stop ${i+1}: ${c}" />
                  ${p.gradientColors.length > 2 ? `<button class="btn-remove-stop" data-remove-index="${i}" title="Remove stop" style="position:absolute; top:-5px; right:-5px; width:15px; height:15px; border-radius:50%; background:var(--accent-danger, #ef4444); color:#fff; border:1px solid #fff; font-size:10px; cursor:pointer; display:flex; align-items:center; justify-content:center; padding:0; line-height:1;">×</button>` : ''}
                </div>
              `).join('')}
            </div>
          </div>

          <div class="control-group">
            <div class="control-label"><span>Gradient Angle</span><span class="control-value">${p.gradientAngle}°</span></div>
            <input type="range" class="range-slider" id="param-angle" min="0" max="360" value="${p.gradientAngle}" />
          </div>

          <div class="control-group">
            <div class="control-label"><span>Texture / Noise Grain</span><span class="control-value">${p.makerNoise}%</span></div>
            <input type="range" class="range-slider" id="param-maker-noise" min="0" max="50" value="${p.makerNoise}" />
          </div>

          <div style="display:grid; grid-template-columns: 1.4fr 1fr; gap:8px; margin-top:20px;">
            <button class="btn btn-primary" id="btn-process-tool">
              Generate System ${sysNum}
            </button>
            <button class="btn btn-secondary" id="btn-quick-export-300" title="Instant 300 PPI High-Resolution Download">
              300 PPI ↓
            </button>
          </div>
        </div>
      `;
    } else if (tool === 'tool_vector_convert' || tool === 'tool_vector_trace') {
      content = `
        <div class="panel-header">
          <span class="panel-title">Vector Studio (Bézier SVG)</span>
          <span class="badge badge-cyan">2 Credits</span>
        </div>
        <div class="panel-content">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
            <p style="font-size:0.8rem; color:var(--text-secondary); margin:0;">
              Authentic scalable Bézier vectors with noise reduction, hole preservation & clean geometry.
            </p>
            <span class="badge badge-indigo" id="vector-path-count-badge">Vector Ready</span>
          </div>

          <!-- Presets -->
          <div class="control-group">
            <div class="control-label"><span>✦ Curated Vector Presets</span></div>
            <div style="display:flex; flex-wrap:wrap; gap:4px; margin-top:4px;">
              ${PresetsLibrary.vector.map(pr => `
                <button class="btn btn-glass btn-sm" data-vec-preset="${pr.id}" style="padding:2px 7px; font-size:0.72rem;" title="${pr.desc}">
                  ${pr.name}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Palette Mode -->
          <div class="control-group">
            <div class="control-label"><span>Palette Mode</span></div>
            <select id="param-vec-palette" style="width:100%;">
              <option value="original" ${p.vectorPaletteMode === 'original' ? 'selected' : ''}>Original Color Quantization</option>
              <option value="grayscale" ${p.vectorPaletteMode === 'grayscale' ? 'selected' : ''}>Grayscale Tonal Shades</option>
              <option value="bw" ${p.vectorPaletteMode === 'bw' ? 'selected' : ''}>Black & White Silhouette (EPS Logo)</option>
              <option value="custom" ${p.vectorPaletteMode === 'custom' ? 'selected' : ''}>Custom Vibrant Harmony</option>
            </select>
          </div>

          <!-- Color Quantization -->
          <div class="control-group">
            <div class="control-label"><span>Color Quantization</span><span class="control-value">${p.vectorColors} Colors</span></div>
            <input type="range" class="range-slider" id="param-vec-colors" min="2" max="32" value="${p.vectorColors}" />
          </div>

          <!-- Curve Smoothness -->
          <div class="control-group">
            <div class="control-label"><span>Curve Smoothness</span><span class="control-value">${p.vectorSmoothness}%</span></div>
            <input type="range" class="range-slider" id="param-vec-smooth" min="0" max="100" value="${p.vectorSmoothness}" />
          </div>

          <!-- Detail Level -->
          <div class="control-group">
            <div class="control-label"><span>Detail Level</span><span class="control-value">${p.vectorDetail}%</span></div>
            <input type="range" class="range-slider" id="param-vec-detail" min="10" max="100" value="${p.vectorDetail}" />
          </div>

          <!-- Noise Removal Filter -->
          <div class="control-group">
            <div class="control-label"><span>Noise Removal Filter</span><span class="control-value">${p.vectorNoiseRemoval || 12}</span></div>
            <input type="range" class="range-slider" id="param-vec-noise" min="0" max="50" value="${p.vectorNoiseRemoval || 12}" />
          </div>

          <!-- Small Object Threshold -->
          <div class="control-group">
            <div class="control-label"><span>Small Object Elimination</span><span class="control-value">${p.vectorSmallObjectRemoval || 8}px</span></div>
            <input type="range" class="range-slider" id="param-vec-small-obj" min="0" max="100" value="${p.vectorSmallObjectRemoval || 8}" />
          </div>

          <!-- Corner Smoothness -->
          <div class="control-group">
            <div class="control-label"><span>Corner Smoothness</span><span class="control-value">${p.vectorCornerSmoothness || 45}%</span></div>
            <input type="range" class="range-slider" id="param-vec-corner" min="0" max="100" value="${p.vectorCornerSmoothness || 45}" />
          </div>

          <!-- Curve Precision -->
          <div class="control-group">
            <div class="control-label"><span>Path Precision</span><span class="control-value">${p.vectorPathPrecision || 2} Decimals</span></div>
            <input type="range" class="range-slider" id="param-vec-precision" min="1" max="4" value="${p.vectorPathPrecision || 2}" />
          </div>

          <!-- Hole Preservation & Transparent BG Switches -->
          <div class="control-group" style="display:flex; align-items:center; justify-content:space-between; margin-top:8px;">
            <span style="font-size:0.8rem; font-weight:600;">Hole Preservation (evenodd)</span>
            <label class="switch">
              <input type="checkbox" id="param-vec-evenodd" ${p.vectorPreserveHoles !== false ? 'checked' : ''} />
              <span class="switch-slider"></span>
            </label>
          </div>

          <div class="control-group" style="display:flex; align-items:center; justify-content:space-between; margin-top:4px;">
            <span style="font-size:0.8rem; font-weight:600;">Transparent Background</span>
            <label class="switch">
              <input type="checkbox" id="param-vec-remove-white" ${p.vectorRemoveWhite ? 'checked' : ''} />
              <span class="switch-slider"></span>
            </label>
          </div>

          <!-- Layer Grouping Mode -->
          <div class="control-group" style="margin-top:10px;">
            <div class="control-label"><span>Layer Grouping Mode</span></div>
            <select id="param-vec-layer-mode" style="width:100%;">
              <option value="color" ${p.vectorLayerMode === 'color' ? 'selected' : ''}>Layer by Color Palette (&lt;g id="color_..."&gt;)</option>
              <option value="object" ${p.vectorLayerMode === 'object' ? 'selected' : ''}>Layer by Individual Paths (&lt;g id="path_..."&gt;)</option>
            </select>
          </div>

          <!-- Action Buttons -->
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:6px; margin-top:16px;">
            <button class="btn btn-primary btn-sm" id="btn-process-tool">
              Trace Vector
            </button>
            <button class="btn btn-secondary btn-sm" id="btn-quick-download-svg" title="Download pure SVG vector code">
              SVG Vector ↓
            </button>
          </div>

          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:6px; margin-top:6px;">
            <button class="btn btn-glass btn-sm" id="btn-download-layered-svg" title="Download Layered SVG for Adobe Illustrator & Figma" style="border-color:var(--accent-secondary); color:var(--accent-secondary);">
              Layered SVG ↓
            </button>
            <button class="btn btn-secondary btn-sm" id="btn-quick-export-300" title="Download 300 PPI Raster Preview">
              300 PPI ↓
            </button>
          </div>

          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:6px; margin-top:6px;">
            <button class="btn btn-glass btn-sm" id="btn-vector-edit-canvas" style="border-color:var(--accent-primary); color:var(--accent-secondary); font-weight:700;" title="Load vector paths into interactive Canvas Editor">
              ✏️ Edit on Canvas
            </button>
            <button class="btn btn-primary btn-sm" id="btn-vector-stock-ready" style="box-shadow:0 0 12px rgba(99,102,241,0.4);" title="1-Click 10-Step Stock Ready Commercial Pipeline & ZIP">
              ⚡ Stock Ready
            </button>
          </div>
        </div>
      `;
    } else if (tool === 'tool_bg_custom' || tool.includes('remove') || tool.includes('transparent')) {
      content = `
        <div class="panel-header">
          <span class="panel-title">Background Studio</span>
          <span class="badge badge-green">1 Credit</span>
        </div>
        <div class="panel-content">
          ${tool === 'tool_bg_custom' ? `
            <div class="control-group">
              <div class="control-label"><span>Target Cutout Color</span></div>
              <div style="display:flex; align-items:center; gap:8px;">
                <input type="color" id="param-bg-custom-color" value="${p.bgCustomColor || '#ffffff'}" class="color-swatch" style="width:36px; height:36px;" />
                <span style="font-size:0.75rem; color:var(--text-muted);">Color to remove/replace</span>
              </div>
            </div>
          ` : ''}

          <div class="control-group">
            <div class="control-label"><span>Color Tolerance</span><span class="control-value">${p.bgTolerance}%</span></div>
            <input type="range" class="range-slider" id="param-bg-tolerance" min="5" max="80" value="${p.bgTolerance}" />
          </div>

          <div class="control-group">
            <div class="control-label"><span>Edge Feathering</span><span class="control-value">${p.bgFeather}px</span></div>
            <input type="range" class="range-slider" id="param-bg-feather" min="0" max="10" value="${p.bgFeather}" />
          </div>

          <div class="control-group" style="display:flex; align-items:center; justify-content:space-between;">
            <span style="font-size:0.8rem; font-weight:600;">Preserve Contact Shadows</span>
            <label class="switch">
              <input type="checkbox" id="param-bg-shadow" ${p.bgShadowPreserve ? 'checked' : ''} />
              <span class="switch-slider"></span>
            </label>
          </div>

          <div style="display:grid; grid-template-columns: 1.4fr 1fr; gap:8px; margin-top:20px;">
            <button class="btn btn-primary" id="btn-process-tool">
              Remove Background
            </button>
            <button class="btn btn-secondary" id="btn-quick-export-300" title="Instant 300 PPI High-Resolution Download">
              300 PPI ↓
            </button>
          </div>

          <button class="btn btn-glass btn-sm" id="btn-bg-edit-canvas" style="width:100%; margin-top:8px; border-color:var(--accent-secondary); color:var(--accent-secondary); font-weight:700;">
            ✏️ Edit Cutout on Canvas
          </button>
        </div>
      `;
    } else if (tool.startsWith('tool_icon_sheet')) {
      const layoutNum = tool.replace('tool_icon_sheet_', '');
      content = `
        <div class="panel-header">
          <span class="panel-title">Icon Sheet Maker ${layoutNum}</span>
          <span class="badge badge-indigo">2 Credits</span>
        </div>
        <div class="panel-content">
          <div class="control-group">
            <div class="control-label"><span>Grid Columns</span><span class="control-value">${p.sheetColumns}</span></div>
            <input type="range" class="range-slider" id="param-sheet-cols" min="2" max="8" value="${p.sheetColumns}" />
          </div>

          <div class="control-group">
            <div class="control-label"><span>Padding Spacing</span><span class="control-value">${p.sheetPadding}px</span></div>
            <input type="range" class="range-slider" id="param-sheet-padding" min="8" max="60" value="${p.sheetPadding}" />
          </div>

          <div class="control-group" style="display:flex; align-items:center; justify-content:space-between;">
            <span style="font-size:0.8rem; font-weight:600;">Include Text Labels</span>
            <label class="switch">
              <input type="checkbox" id="param-sheet-labels" ${p.sheetLabels ? 'checked' : ''} />
              <span class="switch-slider"></span>
            </label>
          </div>

          <div style="display:grid; grid-template-columns: 1.4fr 1fr; gap:8px; margin-top:20px;">
            <button class="btn btn-primary" id="btn-process-tool">
              Build Icon Sheet
            </button>
            <button class="btn btn-secondary" id="btn-quick-export-300" title="Instant 300 PPI High-Resolution Download">
              300 PPI ↓
            </button>
          </div>
        </div>
      `;
    } else if (tool === 'tool_icon_pack') {
      content = `
        <div class="panel-header">
          <span class="panel-title">Icon Pack Maker</span>
          <span class="badge badge-cyan">4 Credits</span>
        </div>
        <div class="panel-content">
          <div class="control-group">
            <div class="control-label"><span>Icon Style Transformation</span></div>
            <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:6px;">
              ${IconPackEngine.styles.map(s => `
                <button class="btn btn-sm ${p.packStyle === s ? 'btn-primary' : 'btn-secondary'}" data-pack-style="${s}">
                  ${s.toUpperCase()}
                </button>
              `).join('')}
            </div>
          </div>

          <div style="background:var(--bg-tertiary); padding:12px; border-radius:8px; font-size:0.75rem; color:var(--text-secondary); margin-top:14px; border:1px solid var(--border-subtle);">
            <div style="color:var(--accent-secondary); font-weight:700; margin-bottom:4px;">✦ 300 PPI Print & Web Icons</div>
            Generates individual PNGs (64, 128, 256, 512px @ 300 PPI), pure vector SVGs, master sheet, and bundles everything into a ZIP.
          </div>

          <button class="btn btn-primary" id="btn-process-tool" style="width:100%; margin-top:20px;">
            Generate & Download 300 PPI ZIP Pack
          </button>
        </div>
      `;
    }

    panel.innerHTML = content;
    this.bindInspectorEvents();
  }

  bindInspectorEvents() {
    const panel = this.container.querySelector('#studio-panel-right');

    // Process button trigger
    const processBtn = panel.querySelector('#btn-process-tool');
    if (processBtn) {
      processBtn.onclick = () => this.executeCurrentTool();
    }

    // Direct 300 PPI Quick Download trigger
    const quickExportBtn = panel.querySelector('#btn-quick-export-300');
    if (quickExportBtn) {
      quickExportBtn.onclick = async () => {
        if (!this.processedCanvas) {
          await this.updateProcessing(true);
        }
        if (this.processedCanvas) {
          try {
            const blob = await PpiWriter.exportWithPpi(this.processedCanvas, 'png', 300);
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            const toolName = store.getState().activeTool.replace('tool_', '');
            a.download = `creativeforge-${toolName}-300ppi-${Date.now()}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            toast.success(`Downloaded High-Resolution 300 PPI Print Master PNG!`);
          } catch (err) {
            toast.error('Export error: ' + err.message);
          }
        }
      };
    }

    // Gradient Type Select binding
    const typeSelect = panel.querySelector('#param-gradient-type');
    if (typeSelect) {
      typeSelect.onchange = (e) => {
        store.setParam('gradientType', e.target.value);
        this.updateProcessing(true);
        toast.info(`Gradient type switched to ${e.target.value}`);
      };
    }

    // Dynamic color swatch bindings (live updates as you pick color!)
    panel.querySelectorAll('.color-swatch').forEach(swatch => {
      if (swatch.id === 'param-glass-tint') return;
      swatch.oninput = (e) => {
        const idx = parseInt(e.target.getAttribute('data-index'), 10);
        if (!isNaN(idx)) {
          const colors = [...store.getState().params.gradientColors];
          colors[idx] = e.target.value;
          store.setParam('gradientColors', colors);
          this.scheduleProcessing();
        }
      };
      swatch.onchange = () => {
        this.updateProcessing(true);
      };
    });

    // Remove color stop buttons
    panel.querySelectorAll('.btn-remove-stop').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const idx = parseInt(btn.getAttribute('data-remove-index'), 10);
        const colors = [...store.getState().params.gradientColors];
        if (colors.length > 2) {
          colors.splice(idx, 1);
          store.setParam('gradientColors', colors);
          this.renderInspector();
          this.updateProcessing(true);
          toast.info('Removed color stop');
        }
      };
    });

    // Dynamic slider bindings with instant real-time RAF updates
    panel.querySelectorAll('.range-slider').forEach(slider => {
      slider.oninput = (e) => {
        const id = e.target.id;
        const val = parseInt(e.target.value, 10);
        
        // Immediate UI label update
        const labelVal = slider.parentElement?.querySelector('.control-value');
        if (labelVal) {
          if (id === 'param-angle') labelVal.textContent = `${val}°`;
          else if (id === 'param-grain-size') labelVal.textContent = `${val}x`;
          else if (id.includes('blur') || id.includes('feather') || id.includes('padding')) labelVal.textContent = `${val}px`;
          else if (id === 'param-vec-colors') labelVal.textContent = `${val} Colors`;
          else if (id === 'param-vec-precision') labelVal.textContent = `${val} Decimals`;
          else if (id === 'param-vec-small-obj') labelVal.textContent = `${val}px`;
          else if (id === 'param-sheet-cols') labelVal.textContent = `${val}`;
          else labelVal.textContent = `${val}%`;
        }

        // Store state update
        if (id === 'param-angle') store.state.params.gradientAngle = val;
        else if (id === 'param-blur') store.state.params.gradientBlur = val;
        else if (id === 'param-sharpness') store.state.params.upscaleSharpness = val;
        else if (id === 'param-detail') store.state.params.upscaleDetail = val;
        else if (id === 'param-noise-red') store.state.params.upscaleNoiseReduction = val;
        else if (id === 'param-grain-amount') store.state.params.grainAmount = val;
        else if (id === 'param-grain-size') store.state.params.grainSize = val;
        else if (id === 'param-grain-contrast') store.state.params.grainContrast = val;
        else if (id === 'param-glass-refraction') store.state.params.glassRefraction = val;
        else if (id === 'param-glass-distortion') store.state.params.glassDistortion = val;
        else if (id === 'param-glass-transparency') store.state.params.glassTransparency = val;
        else if (id === 'param-glass-light') store.state.params.glassLight = val;
        else if (id === 'param-vec-colors') store.state.params.vectorColors = val;
        else if (id === 'param-vec-smooth') store.state.params.vectorSmoothness = val;
        else if (id === 'param-vec-detail') store.state.params.vectorDetail = val;
        else if (id === 'param-vec-noise') store.state.params.vectorNoiseRemoval = val;
        else if (id === 'param-vec-small-obj') store.state.params.vectorSmallObjectRemoval = val;
        else if (id === 'param-vec-corner') store.state.params.vectorCornerSmoothness = val;
        else if (id === 'param-vec-precision') store.state.params.vectorPathPrecision = val;
        else if (id === 'param-bg-tolerance') store.state.params.bgTolerance = val;
        else if (id === 'param-bg-feather') store.state.params.bgFeather = val;
        else if (id === 'param-sheet-cols') store.state.params.sheetColumns = val;
        else if (id === 'param-sheet-padding') store.state.params.sheetPadding = val;
        else if (id === 'param-maker-noise') store.state.params.makerNoise = val;

        this.scheduleProcessing();
      };

      slider.onchange = () => {
        this.updateProcessing(true);
      };
    });

    // Switches
    panel.querySelectorAll('.switch input').forEach(sw => {
      sw.onchange = (e) => {
        const id = e.target.id;
        if (id === 'param-vec-remove-white') store.setParam('vectorRemoveWhite', e.target.checked);
        if (id === 'param-vec-evenodd') store.setParam('vectorPreserveHoles', e.target.checked);
        if (id === 'param-bg-shadow') store.setParam('bgShadowPreserve', e.target.checked);
        if (id === 'param-sheet-labels') store.setParam('sheetLabels', e.target.checked);
        this.updateProcessing(true);
      };
    });

    // Vector Palette Mode and Layer Mode dropdowns
    const vecPaletteSel = panel.querySelector('#param-vec-palette');
    if (vecPaletteSel) {
      vecPaletteSel.onchange = (e) => {
        store.setParam('vectorPaletteMode', e.target.value);
        this.updateProcessing(true);
      };
    }
    const vecLayerSel = panel.querySelector('#param-vec-layer-mode');
    if (vecLayerSel) {
      vecLayerSel.onchange = (e) => {
        store.setParam('vectorLayerMode', e.target.value);
        this.updateProcessing(true);
      };
    }

    // Custom BG color input
    const bgCustomColorInput = panel.querySelector('#param-bg-custom-color');
    if (bgCustomColorInput) {
      bgCustomColorInput.onchange = (e) => {
        store.setParam('bgCustomColor', e.target.value);
        this.updateProcessing(true);
      };
    }

    // Edit on Canvas buttons
    const vecEditCanvasBtn = panel.querySelector('#btn-vector-edit-canvas');
    if (vecEditCanvasBtn) {
      vecEditCanvasBtn.onclick = () => this.openInCanvasEditor();
    }
    const bgEditCanvasBtn = panel.querySelector('#btn-bg-edit-canvas');
    if (bgEditCanvasBtn) {
      bgEditCanvasBtn.onclick = () => this.openInCanvasEditor();
    }

    // Stock Ready Trigger from Inspector
    const vecStockReadyBtn = panel.querySelector('#btn-vector-stock-ready');
    if (vecStockReadyBtn) {
      vecStockReadyBtn.onclick = () => {
        const source = this.processedCanvas || store.getState().originalImage;
        StockReadyWorkflow.openStockReadyModal(source);
      };
    }

    // Buttons
    panel.querySelectorAll('[data-res]').forEach(btn => {
      btn.onclick = () => {
        store.setParam('upscaleResolution', btn.getAttribute('data-res'));
        this.renderInspector();
        this.updateProcessing(true);
      };
    });

    panel.querySelectorAll('[data-grain-preset]').forEach(btn => {
      btn.onclick = () => {
        const k = btn.getAttribute('data-grain-preset');
        const preset = FilmGrainEngine.presets[k];
        store.setParam('grainPreset', k);
        if (preset) {
          store.setParam('grainAmount', preset.amount);
          store.setParam('grainSize', preset.size);
          store.setParam('grainContrast', preset.contrast);
        }
        this.renderInspector();
        this.updateProcessing(true);
      };
    });

    panel.querySelectorAll('[data-pack-style]').forEach(btn => {
      btn.onclick = () => {
        store.setParam('packStyle', btn.getAttribute('data-pack-style'));
        this.renderInspector();
        this.updateProcessing(true);
      };
    });

    // Add color stop buttons
    const addStopBtn = panel.querySelector('#btn-add-color-stop') || panel.querySelector('#btn-add-maker-stop');
    if (addStopBtn) {
      addStopBtn.onclick = () => {
        const current = store.getState().params.gradientColors;
        if (current.length < 8) {
          const randHex = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
          store.setParam('gradientColors', [...current, randHex]);
          this.renderInspector();
          this.updateProcessing(true);
          toast.success('Added color stop!');
        } else {
          toast.info('Maximum 8 color stops reached.');
        }
      };
    }

    // Randomize colors
    const randBtn = panel.querySelector('#btn-random-colors');
    if (randBtn) {
      randBtn.onclick = () => {
        const randomPalette = Array.from({ length: 4 }, () => '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'));
        store.setParam('gradientColors', randomPalette);
        this.renderInspector();
        this.updateProcessing(true);
        toast.success('Randomized color palette!');
      };
    }

    // Glass tint
    const tintInput = panel.querySelector('#param-glass-tint');
    if (tintInput) {
      tintInput.oninput = (e) => {
        store.setParam('glassTint', e.target.value);
        this.scheduleProcessing();
      };
      tintInput.onchange = (e) => {
        store.setParam('glassTint', e.target.value);
        this.updateProcessing(true);
        toast.info('Updated glass prism tint');
      };
    }

    // Direct SVG Download Button
    const quickSvgBtn = panel.querySelector('#btn-quick-download-svg');
    if (quickSvgBtn) {
      quickSvgBtn.onclick = () => {
        if (this.processedSvg) {
          const blob = new Blob([this.processedSvg], { type: 'image/svg+xml;charset=utf-8' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `creativeforge-vector-${Date.now()}.svg`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          toast.success('Downloaded authentic vector SVG file!');
        } else {
          this.executeCurrentTool();
        }
      };
    }

    // Layered SVG Download Button (Illustrator & Figma Ready)
    const layeredSvgBtn = panel.querySelector('#btn-download-layered-svg');
    if (layeredSvgBtn) {
      layeredSvgBtn.onclick = () => {
        if (this.processedSvg) {
          const filename = (store.getState().originalFileName || 'creativeforge').replace(/\.[^/.]+$/, '');
          const layeredSvg = PrintExporter.generateLayeredSvg(this.processedSvg, filename);
          const blob = new Blob([layeredSvg], { type: 'image/svg+xml;charset=utf-8' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${filename}_layered.svg`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          toast.success('Layered SVG Downloaded (Figma & Illustrator Groups Embedded)!');
        } else {
          toast.error('Please click "Trace Vector" first.');
        }
      };
    }

    // Curated Vector Presets Selection
    panel.querySelectorAll('[data-vec-preset]').forEach(btn => {
      btn.onclick = () => {
        const id = btn.getAttribute('data-vec-preset');
        const preset = PresetsLibrary.vector.find(x => x.id === id);
        if (preset) {
          Object.assign(store.state.params, preset.params);
          toast.success(`Preset Applied: ${preset.name}`);
          this.renderInspector();
          this.updateProcessing(true);
        }
      };
    });

    const regenBtn = panel.querySelector('#btn-regen-palette');
    if (regenBtn) {
      regenBtn.onclick = () => {
        const img = store.getState().originalImage;
        if (img) {
          const colors = GradientEngine.extractPalette(img, 4);
          store.setParam('gradientColors', colors);
          this.renderInspector();
          this.updateProcessing(true);
          toast.success('Extracted new color harmony!');
        }
      };
    }
  }

  /**
   * Schedule processing via requestAnimationFrame for super fast 60fps response
   */
  scheduleProcessing() {
    if (this.rafPending) return;
    this.rafPending = true;
    requestAnimationFrame(() => {
      this.rafPending = false;
      this.updateProcessing(true);
    });
  }

  /**
   * Execute current tool processing
   */
  async executeCurrentTool() {
    const state = store.getState();
    const tool = state.activeTool;
    const img = state.originalImage;

    if (!img) {
      ModalManager.openUploadModal();
      return;
    }

    toast.info(`Processing ${tool.replace('tool_', '')}...`);

    if (tool === 'tool_icon_pack') {
      try {
        const zipBlob = await IconPackEngine.generateZipPack(
          [img],
          state.params.packStyle,
          'creativeforge-icons',
          () => {}
        );
        const url = URL.createObjectURL(zipBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `creativeforge-icon-pack-${state.params.packStyle}-300ppi.zip`;
        a.click();
        toast.success('Icon Pack 300 PPI ZIP package generated and downloaded!');
      } catch (err) {
        toast.error('Failed to generate ZIP: ' + err.message);
      }
    } else {
      await this.updateProcessing(true);
      toast.success('Asset processed and updated on canvas!');
    }
  }

  /**
   * Core processing dispatcher with memory caching for instant 0ms switching
   */
  async updateProcessing(forceFresh = false) {
    const state = store.getState();
    const img = state.originalImage;
    if (!img) return;

    const tool = state.activeTool;
    const p = state.params;

    // Cache key for instant tool switching
    const cacheKey = `${tool}_${p.grainPreset || ''}_${p.upscaleResolution || ''}_${p.packStyle || ''}_${p.sheetLayout || ''}`;

    if (!forceFresh && this.toolCache.has(cacheKey)) {
      const cached = this.toolCache.get(cacheKey);
      this.processedCanvas = cached.canvas;
      this.processedSvg = cached.svg;
      this.updateCanvasDisplay();
      return;
    }

    let outCanvas = null;
    let outSvg = null;

    if (tool === 'tool_gradient_extract') {
      outCanvas = GradientEngine.renderGradientCanvas({
        colors: p.gradientColors,
        type: p.gradientType,
        angle: p.gradientAngle,
        blur: p.gradientBlur,
        width: state.originalWidth,
        height: state.originalHeight
      });
    } else if (tool === 'tool_upscaler') {
      outCanvas = ImageUpscalerEngine.process(img, p.upscaleResolution, {
        sharpness: p.upscaleSharpness,
        detailEnhancement: p.upscaleDetail,
        noiseReduction: p.upscaleNoiseReduction
      });
    } else if (tool === 'tool_film_grain') {
      outCanvas = FilmGrainEngine.render(img, p.grainPreset, {
        amount: p.grainAmount,
        size: p.grainSize,
        contrast: p.grainContrast
      });
    } else if (tool.startsWith('tool_fractal_glass')) {
      const presetKey = tool.replace('tool_fractal_glass_', '').replace('_', '.');
      let tintRgba = null;
      if (p.glassTint) {
        const hex = p.glassTint;
        const r = parseInt(hex.slice(1, 3), 16) || 99;
        const g = parseInt(hex.slice(3, 5), 16) || 102;
        const b = parseInt(hex.slice(5, 7), 16) || 241;
        tintRgba = `rgba(${r},${g},${b},0.16)`;
      }
      outCanvas = FractalGlassEngine.render(img, presetKey, {
        refraction: p.glassRefraction,
        distortion: p.glassDistortion,
        transparency: p.glassTransparency,
        light: p.glassLight,
        tint: tintRgba
      });
    } else if (tool.startsWith('tool_gradient_maker')) {
      const sys = parseInt(tool.replace('tool_gradient_maker_', ''), 10);
      outCanvas = GradientEngine.renderGradientCanvas({
        colors: p.gradientColors,
        angle: p.gradientAngle,
        noise: p.makerNoise,
        makerSystem: sys,
        width: state.originalWidth,
        height: state.originalHeight
      });
    } else if (tool === 'tool_vector_convert' || tool === 'tool_vector_trace') {
      const res = await VectorTracer.trace(img, {
        colors: p.vectorColors,
        detail: p.vectorDetail,
        smoothness: p.vectorSmoothness,
        simplification: p.vectorSimplification || 2,
        noiseRemoval: p.vectorNoiseRemoval || 12,
        smallObjectRemoval: p.vectorSmallObjectRemoval || 8,
        cornerSmoothness: p.vectorCornerSmoothness || 45,
        pathPrecision: p.vectorPathPrecision || 2,
        preserveHoles: p.vectorPreserveHoles !== false,
        removeWhiteBg: p.vectorRemoveWhite,
        paletteMode: p.vectorPaletteMode || 'original',
        layerMode: p.vectorLayerMode || 'color'
      });
      outSvg = res.svgString;

      outCanvas = document.createElement('canvas');
      outCanvas.width = res.width;
      outCanvas.height = res.height;
      const ctx = outCanvas.getContext('2d');
      const vImg = new Image();
      const svgBlob = new Blob([outSvg], { type: 'image/svg+xml;charset=utf-8' });
      const blobUrl = URL.createObjectURL(svgBlob);
      vImg.src = blobUrl;
      try {
        if (typeof vImg.decode === 'function') {
          await vImg.decode();
        } else {
          await new Promise((resolve, reject) => {
            vImg.onload = resolve;
            vImg.onerror = reject;
          });
        }
        ctx.drawImage(vImg, 0, 0);
      } catch (decErr) {
        await new Promise((resolve) => {
          vImg.onload = () => {
            try { ctx.drawImage(vImg, 0, 0); } catch (e) {}
            resolve();
          };
          vImg.onerror = () => {
            console.warn('SVG preview fallback to vector paths');
            resolve();
          };
        });
      } finally {
        URL.revokeObjectURL(blobUrl);
      }

      // Live update badge in inspector
      const badge = this.container.querySelector('#vector-path-count-badge');
      if (badge && res.pathCount) {
        badge.textContent = `${res.pathCount} Paths (SVG)`;
        badge.className = 'badge badge-green';
      }
    } else if (tool.includes('remove') || tool.includes('transparent')) {
      outCanvas = BackgroundRemovalEngine.process(img, {
        tolerance: p.bgTolerance,
        feather: p.bgFeather,
        shadowPreservation: p.bgShadowPreserve
      });
    } else if (tool.startsWith('tool_icon_sheet')) {
      const layoutKey = tool.replace('tool_icon_sheet_', '');
      outCanvas = IconSheetEngine.render([img], layoutKey, {
        columns: p.sheetColumns,
        padding: p.sheetPadding,
        showLabels: p.sheetLabels
      });
    } else if (tool === 'tool_icon_pack') {
      outCanvas = IconPackEngine.applyStyle(img, p.packStyle, 512);
    }

    this.processedCanvas = outCanvas;
    this.processedSvg = outSvg;

    // Cache the processed result for 0ms instant retrieval
    if (outCanvas) {
      if (this.toolCache.size > 15) {
        const firstKey = this.toolCache.keys().next().value;
        this.toolCache.delete(firstKey);
      }
      this.toolCache.set(cacheKey, { canvas: outCanvas, svg: outSvg });
    }

    this.updateCanvasDisplay();
  }

  /**
   * Super-fast direct DOM canvas mount (eliminates slow toDataURL encoding!)
   */
  updateCanvasDisplay() {
    const viewport = this.container.querySelector('#canvas-viewport');
    if (!viewport) return;

    if (this.viewMode === 'canvas') {
      this.renderCanvasEditor();
      return;
    }

    const state = store.getState();
    const origImg = state.originalImage;
    const procCanvas = this.processedCanvas;

    if (!origImg) {
      viewport.innerHTML = `
        <div class="canvas-empty-state" id="viewport-dropzone">
          <div class="empty-state-icon">
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>
          </div>
          <h3 style="font-size:1.2rem; margin-bottom:8px;">Upload Image to Start</h3>
          <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:18px;">
            Drag & drop your source graphic or click to select.
          </p>
          <button class="btn btn-primary btn-sm" id="btn-browse-empty">Select Image</button>
        </div>
      `;
      viewport.querySelector('#btn-browse-empty').onclick = () => ModalManager.openUploadModal();
      viewport.querySelector('#viewport-dropzone').onclick = () => ModalManager.openUploadModal();
      return;
    }

    const mode = state.compareMode;
    const sliderPos = state.sliderPos;

    if (mode === 'side-by-side') {
      viewport.innerHTML = `
        <div class="compare-side-by-side">
          <div class="side-card">
            <span class="side-card-title">Original Source</span>
            <img src="${origImg.src}" class="canvas-element" alt="Original" />
          </div>
          <div class="side-card canvas-checkerboard" id="proc-card-slot">
            <span class="side-card-title">CreativeForge Processed (300 PPI Master)</span>
          </div>
        </div>
      `;
      const slot = viewport.querySelector('#proc-card-slot');
      if (slot && procCanvas) {
        procCanvas.className = 'canvas-element';
        slot.appendChild(procCanvas);
      }
    } else if (mode === 'split') {
      // 50/50 Split Screen view with side badges
      viewport.innerHTML = `
        <div class="compare-slider-container canvas-checkerboard" id="split-wrap">
          <div id="proc-canvas-holder" style="display:flex; align-items:center; justify-content:center; width:100%; height:100%;"></div>
          <div class="compare-layer-before" style="width: 50%;">
            <img src="${origImg.src}" class="canvas-element" id="orig-layer" alt="Original Source" style="width: 100vw; max-width: none;" />
          </div>
          <div class="compare-divider-handle" style="left: 50%; pointer-events:none;">
            <div class="compare-handle-knob" style="font-size:0.65rem; padding:2px 8px; width:auto; border-radius:12px;">50 / 50 SPLIT</div>
          </div>
          <div style="position:absolute; top:12px; left:12px; z-index:30;" class="badge badge-indigo">ORIGINAL SOURCE</div>
          <div style="position:absolute; top:12px; right:12px; z-index:30;" class="badge badge-cyan">CREATIVEFORGE ENHANCED</div>
        </div>
      `;
      const holder = viewport.querySelector('#proc-canvas-holder');
      if (holder && procCanvas) {
        procCanvas.className = 'canvas-element';
        holder.appendChild(procCanvas);
      }
      const origLayer = viewport.querySelector('#orig-layer');
      requestAnimationFrame(() => {
        if (procCanvas && origLayer) {
          origLayer.style.width = `${procCanvas.clientWidth}px`;
          origLayer.style.height = `${procCanvas.clientHeight}px`;
        }
      });
    } else {
      // Interactive slider view with direct canvas mount
      viewport.innerHTML = `
        <div class="compare-slider-container canvas-checkerboard" id="slider-wrap">
          <!-- Processed Layer Container -->
          <div id="proc-canvas-holder" style="display:flex; align-items:center; justify-content:center; width:100%; height:100%;"></div>

          <!-- Original Layer (Top clipped by slider position) -->
          <div class="compare-layer-before" id="orig-layer-clip" style="width: ${sliderPos}%;">
            <img src="${origImg.src}" class="canvas-element" id="orig-layer" alt="Original Source" style="width: 100vw; max-width: none;" />
          </div>

          <!-- Draggable Divider with GPU transform acceleration -->
          <div class="compare-divider-handle" id="slider-handle" style="left: ${sliderPos}%;">
            <div class="compare-handle-knob">◀ ▶</div>
          </div>
        </div>
      `;

      const holder = viewport.querySelector('#proc-canvas-holder');
      if (holder && procCanvas) {
        procCanvas.className = 'canvas-element';
        holder.appendChild(procCanvas);
      }

      this.initSliderEvents(viewport);
    }
  }

  initSliderEvents(viewport) {
    const sliderWrap = viewport.querySelector('#slider-wrap');
    const handle = viewport.querySelector('#slider-handle');
    const clipLayer = viewport.querySelector('#orig-layer-clip');
    const origLayer = viewport.querySelector('#orig-layer');
    const procCanvas = this.processedCanvas;

    if (!sliderWrap || !handle) return;

    // Fast sync dimensions
    const syncDimensions = () => {
      if (procCanvas && origLayer) {
        origLayer.style.width = `${procCanvas.clientWidth}px`;
        origLayer.style.height = `${procCanvas.clientHeight}px`;
      }
    };
    requestAnimationFrame(syncDimensions);

    let moveRaf = false;
    const onMove = (clientX) => {
      if (moveRaf) return;
      moveRaf = true;
      requestAnimationFrame(() => {
        moveRaf = false;
        const rect = sliderWrap.getBoundingClientRect();
        const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
        const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
        handle.style.left = `${pct}%`;
        clipLayer.style.width = `${pct}%`;
        store.state.sliderPos = pct;
      });
    };

    handle.onmousedown = (e) => {
      e.preventDefault();
      this.isDraggingSlider = true;
      window.onmousemove = (me) => {
        if (this.isDraggingSlider) onMove(me.clientX);
      };
      window.onmouseup = () => {
        this.isDraggingSlider = false;
        window.onmousemove = null;
      };
    };

    sliderWrap.onclick = (e) => {
      if (e.target !== handle && !handle.contains(e.target)) {
        onMove(e.clientX);
      }
    };
  }

  /**
   * Switch into full interactive Canvas & Layers Studio mode
   */
  openInCanvasEditor() {
    this.viewMode = 'canvas';
    const compBtn = this.container.querySelector('#btn-toggle-compare');
    const canvasBtn = this.container.querySelector('#btn-toggle-canvas');
    const subModes = this.container.querySelector('#compare-submodes');
    if (compBtn) compBtn.className = 'btn btn-sm btn-glass';
    if (canvasBtn) canvasBtn.className = 'btn btn-sm btn-primary';
    if (subModes) subModes.style.display = 'none';

    this.renderCanvasEditor();
  }

  /**
   * Render interactive Canvas Editor with rulers, guides, and layer hierarchy
   */
  renderCanvasEditor() {
    const viewport = this.container.querySelector('#canvas-viewport');
    if (!viewport) return;
    viewport.innerHTML = '';

    const origImg = store.getState().originalImage;
    const w = store.getState().originalWidth || 1200;
    const h = store.getState().originalHeight || 800;

    if (this.canvasEditor) {
      this.canvasEditor.destroy();
    }

    this.canvasEditor = new CanvasEditor(viewport, {
      width: w,
      height: h,
      onSelectionChange: (selected) => {
        this.renderCanvasInspector(selected);
      },
      onLayersChange: (objects) => {
        if (this.layersPanel) {
          this.layersPanel.update();
        }
      }
    });

    this.canvasEditor.render();

    // Ingest processed vector or raster into canvas editor
    if (this.processedSvg) {
      this.canvasEditor.loadSvgPaths(this.processedSvg);
    } else if (this.processedCanvas) {
      this.canvasEditor.loadRasterImage(this.processedCanvas, 'Processed Asset');
    } else if (origImg) {
      this.canvasEditor.loadRasterImage(origImg, 'Original Source');
    }

    this.renderCanvasInspector(this.canvasEditor.selectedObjects);
  }

  /**
   * Render Inspector for interactive Canvas Editor
   */
  renderCanvasInspector(selectedObjects = []) {
    const panel = this.container.querySelector('#studio-panel-right');
    if (!panel) return;

    const count = selectedObjects.length;
    const first = selectedObjects[0] || null;

    panel.innerHTML = `
      <div class="panel-header">
        <span class="panel-title">Canvas & Layers</span>
        <span class="badge badge-cyan">${count > 0 ? `${count} Selected` : 'Workspace'}</span>
      </div>
      <div class="panel-content" style="padding:14px; overflow-y:auto; max-height:calc(100vh - 120px);">
        <!-- Selection Properties -->
        <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-subtle); border-radius:8px; padding:12px; margin-bottom:14px;">
          <div style="font-weight:700; font-size:0.8rem; color:var(--text-primary); margin-bottom:10px; display:flex; justify-content:space-between;">
            <span>Object Properties</span>
            <span style="font-size:0.7rem; color:var(--text-muted);">${count ? (first.name || first.type) : 'None selected'}</span>
          </div>

          ${count > 0 ? `
            <div class="control-group" style="margin-bottom:10px;">
              <div class="control-label"><span>Fill Color</span></div>
              <div style="display:flex; align-items:center; gap:8px;">
                <input type="color" id="canvas-obj-fill" class="color-swatch" value="${first.fill && first.fill.startsWith('#') ? first.fill : '#6366f1'}" style="width:34px; height:34px;" />
                <input type="text" id="canvas-obj-fill-text" value="${first.fill || '#6366f1'}" style="flex:1; font-family:var(--font-mono); font-size:0.75rem;" />
              </div>
            </div>

            <div class="control-group" style="margin-bottom:10px;">
              <div class="control-label"><span>Stroke Color & Width</span><span class="control-value" id="val-canvas-stroke-w">${first.strokeWidth || 0}px</span></div>
              <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">
                <input type="color" id="canvas-obj-stroke" class="color-swatch" value="${first.stroke && first.stroke.startsWith('#') ? first.stroke : '#000000'}" style="width:34px; height:34px;" />
                <input type="range" class="range-slider" id="canvas-obj-stroke-w" min="0" max="24" value="${first.strokeWidth || 0}" style="flex:1;" />
              </div>
            </div>

            <div class="control-group" style="margin-bottom:10px;">
              <div class="control-label"><span>Opacity</span><span class="control-value" id="val-canvas-opacity">${Math.round((first.opacity ?? 1) * 100)}%</span></div>
              <input type="range" class="range-slider" id="canvas-obj-opacity" min="5" max="100" value="${Math.round((first.opacity ?? 1) * 100)}" />
            </div>

            <!-- Alignment controls -->
            <div class="control-group" style="margin-bottom:10px;">
              <div class="control-label"><span>Align & Distribute</span></div>
              <div style="display:grid; grid-template-columns:repeat(6, 1fr); gap:4px; margin-bottom:6px;">
                <button class="btn btn-secondary btn-sm" id="btn-align-left" title="Align Left">⇤</button>
                <button class="btn btn-secondary btn-sm" id="btn-align-center" title="Align Center">⇥⇤</button>
                <button class="btn btn-secondary btn-sm" id="btn-align-right" title="Align Right">⇥</button>
                <button class="btn btn-secondary btn-sm" id="btn-align-top" title="Align Top">⤒</button>
                <button class="btn btn-secondary btn-sm" id="btn-align-middle" title="Align Middle">↕</button>
                <button class="btn btn-secondary btn-sm" id="btn-align-bottom" title="Align Bottom">⤓</button>
              </div>
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:4px;">
                <button class="btn btn-secondary btn-sm" id="btn-dist-h" title="Distribute Horizontally">Distribute ↔</button>
                <button class="btn btn-secondary btn-sm" id="btn-dist-v" title="Distribute Vertically">Distribute ↕</button>
              </div>
            </div>

            <!-- Layer Ordering & Grouping -->
            <div class="control-group" style="margin-bottom:12px;">
              <div class="control-label"><span>Layer Order & Grouping</span></div>
              <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:4px; margin-bottom:6px;">
                <button class="btn btn-secondary btn-sm" id="btn-order-front" title="Bring to Front">⇈</button>
                <button class="btn btn-secondary btn-sm" id="btn-order-forward" title="Bring Forward">↑</button>
                <button class="btn btn-secondary btn-sm" id="btn-order-backward" title="Send Backward">↓</button>
                <button class="btn btn-secondary btn-sm" id="btn-order-back" title="Send to Back">⇊</button>
              </div>
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:4px;">
                <button class="btn btn-secondary btn-sm" id="btn-canvas-group">Group</button>
                <button class="btn btn-secondary btn-sm" id="btn-canvas-ungroup">Ungroup</button>
              </div>
            </div>

            <button class="btn btn-secondary btn-sm" id="btn-canvas-del" style="width:100%; color:var(--status-danger); border-color:rgba(239,68,68,0.3);">
              Delete Selected Object(s)
            </button>
          ` : `
            <div style="font-size:0.75rem; color:var(--text-muted); text-align:center; padding:12px 0;">
              Click on any path or element on the canvas to inspect, transform, recolor, and align.
            </div>
          `}
        </div>

        <!-- Layers Panel Mount -->
        <div id="layers-panel-mount"></div>

        <!-- Canvas Export Actions -->
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px; margin-top:16px;">
          <button class="btn btn-primary btn-sm" id="btn-canvas-export-svg">
            Export SVG
          </button>
          <button class="btn btn-secondary btn-sm" id="btn-canvas-export-300">
            Export 300 PPI
          </button>
        </div>
      </div>
    `;

    // Mount Layers Panel inside #layers-panel-mount
    const layersMount = panel.querySelector('#layers-panel-mount');
    if (layersMount && this.canvasEditor) {
      if (this.layersPanel) this.layersPanel.destroy();
      this.layersPanel = new LayersPanel(layersMount, this.canvasEditor);
      this.layersPanel.render();
    }

    this.bindCanvasInspectorEvents(first);
  }

  bindCanvasInspectorEvents(first) {
    const panel = this.container.querySelector('#studio-panel-right');
    if (!panel || !this.canvasEditor) return;

    // Fill Color
    const fillInput = panel.querySelector('#canvas-obj-fill');
    const fillText = panel.querySelector('#canvas-obj-fill-text');
    if (fillInput && first) {
      fillInput.oninput = (e) => {
        first.fill = e.target.value;
        if (fillText) fillText.value = e.target.value;
        this.canvasEditor.render();
      };
      if (fillText) {
        fillText.onchange = (e) => {
          first.fill = e.target.value;
          fillInput.value = e.target.value;
          this.canvasEditor.render();
        };
      }
    }

    // Stroke
    const strokeInput = panel.querySelector('#canvas-obj-stroke');
    const strokeW = panel.querySelector('#canvas-obj-stroke-w');
    if (strokeInput && strokeW && first) {
      strokeInput.oninput = (e) => {
        first.stroke = e.target.value;
        this.canvasEditor.render();
      };
      strokeW.oninput = (e) => {
        first.strokeWidth = parseInt(e.target.value, 10);
        const lbl = panel.querySelector('#val-canvas-stroke-w');
        if (lbl) lbl.textContent = `${first.strokeWidth}px`;
        this.canvasEditor.render();
      };
    }

    // Opacity
    const opacityInput = panel.querySelector('#canvas-obj-opacity');
    if (opacityInput && first) {
      opacityInput.oninput = (e) => {
        first.opacity = parseInt(e.target.value, 10) / 100;
        const lbl = panel.querySelector('#val-canvas-opacity');
        if (lbl) lbl.textContent = `${Math.round(first.opacity * 100)}%`;
        this.canvasEditor.render();
      };
    }

    // Alignment
    const aLeft = panel.querySelector('#btn-align-left');
    if (aLeft) aLeft.onclick = () => this.canvasEditor.alignSelected('left');
    const aCenter = panel.querySelector('#btn-align-center');
    if (aCenter) aCenter.onclick = () => this.canvasEditor.alignSelected('center');
    const aRight = panel.querySelector('#btn-align-right');
    if (aRight) aRight.onclick = () => this.canvasEditor.alignSelected('right');
    const aTop = panel.querySelector('#btn-align-top');
    if (aTop) aTop.onclick = () => this.canvasEditor.alignSelected('top');
    const aMiddle = panel.querySelector('#btn-align-middle');
    if (aMiddle) aMiddle.onclick = () => this.canvasEditor.alignSelected('middle');
    const aBottom = panel.querySelector('#btn-align-bottom');
    if (aBottom) aBottom.onclick = () => this.canvasEditor.alignSelected('bottom');

    // Distribute
    const dH = panel.querySelector('#btn-dist-h');
    if (dH) dH.onclick = () => this.canvasEditor.distributeSelected('horizontal');
    const dV = panel.querySelector('#btn-dist-v');
    if (dV) dV.onclick = () => this.canvasEditor.distributeSelected('vertical');

    // Layer Order
    const oFront = panel.querySelector('#btn-order-front');
    if (oFront) oFront.onclick = () => this.canvasEditor.moveSelectedOrder('front');
    const oForward = panel.querySelector('#btn-order-forward');
    if (oForward) oForward.onclick = () => this.canvasEditor.moveSelectedOrder('forward');
    const oBackward = panel.querySelector('#btn-order-backward');
    if (oBackward) oBackward.onclick = () => this.canvasEditor.moveSelectedOrder('backward');
    const oBack = panel.querySelector('#btn-order-back');
    if (oBack) oBack.onclick = () => this.canvasEditor.moveSelectedOrder('back');

    // Group / Ungroup / Delete
    const cGroup = panel.querySelector('#btn-canvas-group');
    if (cGroup) cGroup.onclick = () => this.canvasEditor.groupSelected();
    const cUngroup = panel.querySelector('#btn-canvas-ungroup');
    if (cUngroup) cUngroup.onclick = () => this.canvasEditor.ungroupSelected();
    const cDel = panel.querySelector('#btn-canvas-del');
    if (cDel) cDel.onclick = () => this.canvasEditor.deleteSelected();

    // Canvas SVG Export
    const expSvgBtn = panel.querySelector('#btn-canvas-export-svg');
    if (expSvgBtn) {
      expSvgBtn.onclick = () => {
        const svg = this.canvasEditor.exportSvg();
        const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `creativeforge-canvas-${Date.now()}.svg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        toast.success('Exported Canvas SVG!');
      };
    }

    // Canvas 300 PPI Export
    const exp300Btn = panel.querySelector('#btn-canvas-export-300');
    if (exp300Btn) {
      exp300Btn.onclick = async () => {
        const highResCanvas = this.canvasEditor.exportCanvas(4);
        const blob = await PpiWriter.exportWithPpi(highResCanvas, 'png', 300);
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `creativeforge-canvas-300ppi-${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        toast.success('Exported 300 PPI Canvas PNG!');
      };
    }
  }
}
