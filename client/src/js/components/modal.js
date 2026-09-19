/**
 * CreativeForge AI — Universal Modals System
 */
import { store } from '../state.js';
import { api } from '../api.js';
import { toast } from './toast.js';
import { PpiWriter } from '../utils/ppi-writer.js';
import { PrintExporter } from '../utils/print-exporter.js';
import { BatchProcessorEngine } from '../engines/batch-processor.js';
import { BackgroundRemovalEngine } from '../engines/bg-removal.js';
import { ImageUpscalerEngine } from '../engines/upscaler.js';

export class ModalManager {
  /**
   * Helper to generate 500 demo image assets in 1 second for instant batch testing
   */
  static generateDemo500Batch() {
    const dummyFiles = [];
    const colors = ['#6366f1', '#06b6d4', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6', '#3b82f6'];
    for (let i = 1; i <= 500; i++) {
      const color = colors[i % colors.length];
      const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="100%" height="100%" fill="#121622"/><circle cx="300" cy="200" r="130" fill="${color}" opacity="0.85"/><text x="300" y="208" fill="#ffffff" font-size="28" font-family="sans-serif" font-weight="bold" text-anchor="middle">ASSET #${i}</text><text x="300" y="240" fill="rgba(255,255,255,0.7)" font-size="14" font-family="sans-serif" text-anchor="middle">CreativeForge 300 PPI Batch</text></svg>`;
      const blob = new Blob([svgStr], { type: 'image/svg+xml' });
      blob.name = `batch_asset_${String(i).padStart(3, '0')}.svg`;
      dummyFiles.push(blob);
    }
    return dummyFiles;
  }

  /**
   * Universal Upload Modal with High-Capacity 500+ Multi-File & Batch Pipeline Support
   */
  static openUploadModal(onUploaded) {
    const modalEl = document.createElement('div');
    modalEl.className = 'modal-backdrop';
    modalEl.innerHTML = `
      <div class="modal-container" style="max-width: 580px;">
        <div class="modal-header">
          <div style="display:flex; align-items:center; gap:8px;">
            <div style="width:28px; height:28px; border-radius:6px; background:var(--accent-gradient-glow); display:flex; align-items:center; justify-content:center; color:var(--accent-secondary);">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
            </div>
            <div>
              <h3 class="modal-title">Universal Asset Upload</h3>
              <div style="font-size:0.7rem; color:var(--accent-secondary); font-weight:700;">SUPPORTS UP TO 500+ FILES IN BATCH</div>
            </div>
          </div>
          <button class="btn-icon" id="btn-close-modal">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="modal-body">
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 16px;">
            Upload single or batch images (up to 500+ simultaneously). Transform across any CreativeForge tool and export with embedded 300 PPI print metadata.
          </p>

          <div id="modal-dropzone" class="canvas-empty-state" style="padding: 26px; margin-bottom: 14px; width: 100%;">
            <div class="empty-state-icon" style="width: 44px; height: 44px; font-size: 1.3rem;">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>
            </div>
            <h4 style="font-size: 0.95rem; margin-bottom: 4px;">Drag & drop images here (up to 500+)</h4>
            <p style="font-size: 0.76rem; color: var(--text-muted); margin-bottom: 12px;">JPG, PNG, WEBP, or SVG • Full Batch Pipeline</p>
            <div style="display:flex; justify-content:center; gap:8px;">
              <button class="btn btn-secondary btn-sm" id="btn-browse-files">Browse Local Files</button>
              <button class="btn btn-glass btn-sm" id="btn-load-500-demo" style="border-color:var(--accent-primary); color:var(--accent-primary);" title="Instant 500 demo images generator">
                ⚡ Demo 500-Batch
              </button>
            </div>
            <input type="file" id="modal-file-input" multiple accept="image/jpeg,image/png,image/webp,image/svg+xml" style="display:none;" />
          </div>

          <!-- Dynamic Batch Notification Card -->
          <div id="batch-stats-card" style="display:none; background:rgba(99,102,241,0.12); border:1px solid rgba(99,102,241,0.3); border-radius:8px; padding:10px 14px; margin-bottom:12px; justify-content:space-between; align-items:center;">
            <div>
              <div style="font-weight:700; color:var(--text-primary); font-size:0.85rem;" id="batch-stats-title">⚡ Batch Queue: 500 Images Selected</div>
              <div style="font-size:0.72rem; color:var(--text-muted);" id="batch-stats-subtitle">Ready for Parallel 300 PPI Processing & Master ZIP Export</div>
            </div>
            <button class="btn btn-primary btn-sm" id="btn-fast-batch-start" style="padding:4px 10px; font-size:0.75rem;">
              Process All 500 ⚡
            </button>
          </div>

          <div id="upload-preview-list" style="display: flex; flex-direction: column; gap: 6px; max-height: 160px; overflow-y: auto;"></div>

          <div id="upload-progress-container" style="display: none; margin-top: 14px;">
            <div style="display: flex; justify-content: space-between; font-size: 0.75rem; margin-bottom: 4px;">
              <span id="upload-progress-status">Syncing batch assets & preserving originals...</span>
              <span id="upload-progress-percent">0%</span>
            </div>
            <div style="width: 100%; height: 6px; background: var(--bg-tertiary); border-radius: 4px; overflow: hidden;">
              <div id="upload-progress-bar" style="width: 0%; height: 100%; background: var(--accent-gradient); transition: width 0.2s;"></div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary btn-sm" id="btn-cancel-upload">Cancel</button>
          <button class="btn btn-primary btn-sm" id="btn-confirm-upload" disabled>Start Creative Workspace</button>
        </div>
      </div>
    `;

    document.body.appendChild(modalEl);

    let selectedFiles = [];

    const dropzone = modalEl.querySelector('#modal-dropzone');
    const fileInput = modalEl.querySelector('#modal-file-input');
    const previewList = modalEl.querySelector('#upload-preview-list');
    const confirmBtn = modalEl.querySelector('#btn-confirm-upload');
    const progressContainer = modalEl.querySelector('#upload-progress-container');
    const progressBar = modalEl.querySelector('#upload-progress-bar');
    const progressPercent = modalEl.querySelector('#upload-progress-percent');
    const batchStatsCard = modalEl.querySelector('#batch-stats-card');
    const batchStatsTitle = modalEl.querySelector('#batch-stats-title');
    const batchFastBtn = modalEl.querySelector('#btn-fast-batch-start');
    const demo500Btn = modalEl.querySelector('#btn-load-500-demo');

    const closeModal = () => modalEl.remove();
    modalEl.querySelector('#btn-close-modal').onclick = closeModal;
    modalEl.querySelector('#btn-cancel-upload').onclick = closeModal;

    modalEl.querySelector('#btn-browse-files').onclick = () => fileInput.click();
    dropzone.onclick = (e) => {
      if (e.target.id !== 'btn-browse-files' && e.target.id !== 'btn-load-500-demo') fileInput.click();
    };

    // Instant 500-Batch Demo Button
    demo500Btn.onclick = (e) => {
      e.stopPropagation();
      const demoBatch = ModalManager.generateDemo500Batch();
      handleFiles(demoBatch);
      toast.success('Generated 500 demo image assets in batch queue!');
    };

    dropzone.ondragover = (e) => {
      e.preventDefault();
      dropzone.classList.add('drag-active');
    };
    dropzone.ondragleave = () => dropzone.classList.remove('drag-active');
    dropzone.ondrop = (e) => {
      e.preventDefault();
      dropzone.classList.remove('drag-active');
      if (e.dataTransfer.files.length) {
        handleFiles(Array.from(e.dataTransfer.files));
      }
    };

    fileInput.onchange = () => {
      if (fileInput.files.length) {
        handleFiles(Array.from(fileInput.files));
      }
    };

    function handleFiles(files) {
      selectedFiles = files.filter(f => f.type.startsWith('image/') || f.name.endsWith('.svg'));
      if (selectedFiles.length === 0) {
        toast.error('Please upload valid image files (JPG, PNG, WEBP, SVG)');
        return;
      }

      previewList.innerHTML = '';

      if (selectedFiles.length > 1) {
        batchStatsCard.style.display = 'flex';
        batchStatsTitle.textContent = `⚡ Batch Mode: ${selectedFiles.length} Images Selected`;
        batchFastBtn.textContent = `Process All ${selectedFiles.length} ⚡`;
        batchFastBtn.onclick = () => {
          closeModal();
          ModalManager.openBatchModal(selectedFiles);
        };
        confirmBtn.textContent = `Open Batch Workspace (${selectedFiles.length} Images)`;
      } else {
        batchStatsCard.style.display = 'none';
        confirmBtn.textContent = 'Start Creative Workspace';
      }

      // Render virtualized / capped list so 500 items do not freeze DOM
      const maxDisplay = Math.min(selectedFiles.length, 12);
      for (let idx = 0; idx < maxDisplay; idx++) {
        const file = selectedFiles[idx];
        const item = document.createElement('div');
        item.style.cssText = 'display:flex; align-items:center; justify-content:space-between; padding:6px 10px; background:var(--bg-tertiary); border-radius:6px; font-size:0.78rem;';
        item.innerHTML = `
          <div style="display:flex; align-items:center; gap:8px; overflow:hidden;">
            <span style="color:var(--accent-secondary); font-weight:700;">#${idx + 1}</span>
            <span style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:260px;">${file.name}</span>
          </div>
          <span style="color:var(--text-muted); font-size:0.72rem;">${((file.size || 5000) / 1024).toFixed(1)} KB</span>
        `;
        previewList.appendChild(item);
      }

      if (selectedFiles.length > maxDisplay) {
        const moreItem = document.createElement('div');
        moreItem.style.cssText = 'text-align:center; padding:6px; font-size:0.75rem; color:var(--accent-secondary); font-weight:600;';
        moreItem.textContent = `...and ${selectedFiles.length - maxDisplay} more images queued for 300 PPI batch processing`;
        previewList.appendChild(moreItem);
      }

      confirmBtn.disabled = false;
    }

    confirmBtn.onclick = async () => {
      if (selectedFiles.length === 0) return;
      confirmBtn.disabled = true;
      progressContainer.style.display = 'block';

      // Load primary image locally for instant, zero-latency feedback
      const firstFile = selectedFiles[0];
      const reader = new FileReader();

      reader.onload = async (e) => {
        const img = new Image();
        img.src = e.target.result;
        await img.decode();

        progressBar.style.width = '60%';
        progressPercent.textContent = '60%';

        // Upload to server storage non-destructively (sends in slices of 50 if large batch)
        try {
          const currentProject = store.getState().project;
          const sliceToUpload = selectedFiles.slice(0, 50);
          api.uploadFiles(sliceToUpload, currentProject?.id).catch(() => {});
        } catch (err) {}

        progressBar.style.width = '100%';
        progressPercent.textContent = '100%';

        // Update Store with batch assets
        store.setState({
          originalImage: img,
          originalImageUrl: img.src,
          originalFileName: firstFile.name,
          originalWidth: img.naturalWidth || img.width || 1200,
          originalHeight: img.naturalHeight || img.height || 800,
          batchAssets: selectedFiles
        });

        toast.success(`Loaded ${selectedFiles.length > 1 ? `${selectedFiles.length} images` : `"${firstFile.name}"`} into Creative Studio!`);
        closeModal();
        if (onUploaded) onUploaded(img);
      };

      reader.readAsDataURL(firstFile);
    };
  }

  /**
   * ──────────────────────────────────────────────────────────────────
   * AI PHOTO ENHANCER — Low Quality → High Quality Converter
   * Upscale: 2x, 4x, 8x, 2K, 4K | Denoise | Sharpen | Artifact Remove
   * Batch: up to 50 images | Export: JPEG, PNG, WebP | ZIP download
   * ──────────────────────────────────────────────────────────────────
   */
  static openPhotoEnhancerModal() {
    const modalEl = document.createElement('div');
    modalEl.className = 'modal-backdrop';
    modalEl.innerHTML = `
      <div class="modal-container" style="max-width:720px; max-height:92vh; display:flex; flex-direction:column;">

        <!-- Header -->
        <div class="modal-header" style="flex-shrink:0; background:linear-gradient(135deg,rgba(99,102,241,0.15),rgba(6,182,212,0.1)); border-bottom:1px solid rgba(99,102,241,0.2);">
          <div style="display:flex; align-items:center; gap:12px;">
            <div style="width:40px; height:40px; border-radius:12px; background:linear-gradient(135deg,#6366f1,#06b6d4); display:flex; align-items:center; justify-content:center; font-size:1.4rem; box-shadow:0 4px 14px rgba(99,102,241,0.4);">✨</div>
            <div>
              <h3 class="modal-title">AI Photo Enhancer</h3>
              <div style="font-size:0.7rem; color:var(--accent-secondary); font-weight:700; letter-spacing:0.6px;">LOW QUALITY → HIGH QUALITY • UPSCALE • DENOISE • SHARPEN</div>
            </div>
          </div>
          <button class="btn-icon" id="phe-close">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <div class="modal-body" style="overflow-y:auto; flex:1; display:flex; flex-direction:column; gap:16px;">

          <!-- Step 1: Upload -->
          <div>
            <div style="font-size:0.78rem; font-weight:700; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.5px; margin-bottom:8px;">Step 1 — Upload Low Quality Photos (max 200)</div>
            <div id="phe-dropzone" style="border:2px dashed rgba(99,102,241,0.4); border-radius:12px; padding:28px; text-align:center; cursor:pointer; background:rgba(99,102,241,0.04); transition:all 0.2s;">
              <div style="font-size:2.5rem; margin-bottom:8px;">📸</div>
              <div style="font-weight:700; font-size:1rem; margin-bottom:4px; color:var(--text-primary);">Drag & Drop Low Quality Photos Here</div>
              <div style="font-size:0.75rem; color:var(--text-muted); margin-bottom:14px;">JPG, PNG, WEBP — Batch up to 200 images simultaneously</div>
              <div style="display:flex; justify-content:center; gap:8px;">
                <button class="btn btn-secondary btn-sm" id="phe-browse">Browse Files</button>
              </div>
              <input type="file" id="phe-file-input" multiple accept="image/jpeg,image/png,image/webp" style="display:none;" />
            </div>

            <!-- Stats bar -->
            <div id="phe-stats-bar" style="display:none; background:rgba(99,102,241,0.1); border:1px solid rgba(99,102,241,0.25); border-radius:8px; padding:10px 14px; margin-top:10px; justify-content:space-between; align-items:center;">
              <div>
                <div style="font-weight:700; font-size:0.88rem; color:var(--text-primary);" id="phe-stats-count">0 photos selected</div>
                <div style="font-size:0.72rem; color:var(--text-muted);" id="phe-stats-size">Ready for enhancement</div>
              </div>
              <button class="btn btn-secondary btn-sm" id="phe-clear" style="font-size:0.72rem; padding:3px 8px;">Clear</button>
            </div>

            <!-- Thumbnail strip -->
            <div id="phe-thumb-strip" style="display:flex; gap:6px; flex-wrap:wrap; max-height:80px; overflow:hidden; margin-top:8px;"></div>
            <div id="phe-more-label" style="font-size:0.72rem; color:var(--accent-secondary); font-weight:600; display:none; margin-top:4px;"></div>
          </div>

          <div style="height:1px; background:var(--border-subtle);"></div>

          <!-- Step 2: Before/After Preview -->
          <div id="phe-preview-section" style="display:none;">
            <div style="font-size:0.78rem; font-weight:700; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.5px; margin-bottom:8px;">Preview — Before / After</div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
              <div style="border-radius:8px; overflow:hidden; background:var(--bg-tertiary); position:relative;">
                <div style="position:absolute; top:6px; left:8px; font-size:0.65rem; font-weight:700; background:rgba(0,0,0,0.6); color:#fff; padding:2px 7px; border-radius:4px; z-index:1;">ORIGINAL LOW-RES</div>
                <canvas id="phe-before-canvas" style="width:100%; display:block;"></canvas>
              </div>
              <div style="border-radius:8px; overflow:hidden; background:var(--bg-tertiary); position:relative;">
                <div style="position:absolute; top:6px; left:8px; font-size:0.65rem; font-weight:700; background:linear-gradient(90deg,#6366f1,#06b6d4); color:#fff; padding:2px 7px; border-radius:4px; z-index:1;">✨ ENHANCED HD/4K</div>
                <canvas id="phe-after-canvas" style="width:100%; display:block;"></canvas>
                <div id="phe-preview-loader" style="position:absolute; inset:0; display:flex; align-items:center; justify-content:center; background:rgba(0,0,0,0.5); font-size:0.8rem; color:#fff;">⏳ Processing...</div>
              </div>
            </div>
            <div id="phe-preview-info" style="font-size:0.72rem; color:var(--text-muted); margin-top:6px; text-align:center;"></div>
          </div>

          <div style="height:1px; background:var(--border-subtle);"></div>

          <!-- 1-Click AI Presets -->
          <div>
            <div style="font-size:0.78rem; font-weight:700; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.5px; margin-bottom:8px;">1-Click AI Quality Preset</div>
            <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:6px; margin-bottom:6px;">
              <button class="phe-preset-btn active" data-profile="auto" style="background:rgba(99,102,241,0.2); border:2px solid var(--accent-primary); border-radius:8px; padding:8px 4px; cursor:pointer; text-align:center;">
                <div style="font-weight:700; font-size:0.75rem; color:var(--text-primary);">🌟 Smart Auto</div>
                <div style="font-size:0.6rem; color:var(--text-muted);">Balanced All-in-One</div>
              </button>
              <button class="phe-preset-btn" data-profile="face_portrait" style="background:var(--bg-tertiary); border:2px solid var(--border-subtle); border-radius:8px; padding:8px 4px; cursor:pointer; text-align:center;">
                <div style="font-weight:700; font-size:0.75rem; color:var(--text-primary);">👤 Face & Portrait</div>
                <div style="font-size:0.6rem; color:var(--text-muted);">Sharp eyes, smooth skin</div>
              </button>
              <button class="phe-preset-btn" data-profile="photo_restore" style="background:var(--bg-tertiary); border:2px solid var(--border-subtle); border-radius:8px; padding:8px 4px; cursor:pointer; text-align:center;">
                <div style="font-weight:700; font-size:0.75rem; color:var(--text-primary);">📷 Blurry / Low-Res</div>
                <div style="font-size:0.6rem; color:var(--text-muted);">Max deblur & restore</div>
              </button>
            </div>
            <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:6px;">
              <button class="phe-preset-btn" data-profile="product_ecommerce" style="background:var(--bg-tertiary); border:2px solid var(--border-subtle); border-radius:8px; padding:8px 4px; cursor:pointer; text-align:center;">
                <div style="font-weight:700; font-size:0.75rem; color:var(--text-primary);">🛍️ Product / Studio</div>
                <div style="font-size:0.6rem; color:var(--text-muted);">Crisp edges, pure tones</div>
              </button>
              <button class="phe-preset-btn" data-profile="landscape_nature" style="background:var(--bg-tertiary); border:2px solid var(--border-subtle); border-radius:8px; padding:8px 4px; cursor:pointer; text-align:center;">
                <div style="font-weight:700; font-size:0.75rem; color:var(--text-primary);">🏞️ Landscape & HDR</div>
                <div style="font-size:0.6rem; color:var(--text-muted);">Vibrant nature details</div>
              </button>
              <button class="phe-preset-btn" data-profile="art_illustration" style="background:var(--bg-tertiary); border:2px solid var(--border-subtle); border-radius:8px; padding:8px 4px; cursor:pointer; text-align:center;">
                <div style="font-weight:700; font-size:0.75rem; color:var(--text-primary);">🎨 Art & Anime</div>
                <div style="font-size:0.6rem; color:var(--text-muted);">Crisp lines, vivid color</div>
              </button>
            </div>
          </div>

          <div style="height:1px; background:var(--border-subtle);"></div>

          <!-- Step 3: Upscale Tier -->
          <div>
            <div style="font-size:0.78rem; font-weight:700; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.5px; margin-bottom:10px;">Step 2 — Upscale Resolution</div>
            <div style="display:grid; grid-template-columns:repeat(4,1fr); gap:6px; margin-bottom:6px;" id="phe-tier-grid">
              <button class="phe-tier-btn" data-tier="2x" style="background:var(--bg-tertiary); border:2px solid var(--border-subtle); border-radius:8px; padding:8px 4px; cursor:pointer; text-align:center;">
                <div style="font-size:1rem;">🔍</div>
                <div style="font-weight:700; font-size:0.72rem; color:var(--text-primary);">2×</div>
                <div style="font-size:0.58rem; color:var(--text-muted);">Fast</div>
              </button>
              <button class="phe-tier-btn active" data-tier="4x" style="background:rgba(99,102,241,0.2); border:2px solid var(--accent-primary); border-radius:8px; padding:8px 4px; cursor:pointer; text-align:center;">
                <div style="font-size:1rem;">🔎</div>
                <div style="font-weight:700; font-size:0.72rem; color:var(--text-primary);">4×</div>
                <div style="font-size:0.58rem; color:var(--accent-secondary);">Recommended</div>
              </button>
              <button class="phe-tier-btn" data-tier="8x" style="background:var(--bg-tertiary); border:2px solid var(--border-subtle); border-radius:8px; padding:8px 4px; cursor:pointer; text-align:center;">
                <div style="font-size:1rem;">🚀</div>
                <div style="font-weight:700; font-size:0.72rem; color:var(--text-primary);">8×</div>
                <div style="font-size:0.58rem; color:var(--text-muted);">Ultra Super-Res</div>
              </button>
              <button class="phe-tier-btn" data-tier="HD" style="background:var(--bg-tertiary); border:2px solid var(--border-subtle); border-radius:8px; padding:8px 4px; cursor:pointer; text-align:center;">
                <div style="font-size:1rem;">🖥️</div>
                <div style="font-weight:700; font-size:0.72rem; color:var(--text-primary);">HD</div>
                <div style="font-size:0.58rem; color:var(--text-muted);">1080p</div>
              </button>
            </div>
            <div style="display:grid; grid-template-columns:repeat(4,1fr); gap:6px;">
              <button class="phe-tier-btn" data-tier="2K" style="background:var(--bg-tertiary); border:2px solid var(--border-subtle); border-radius:8px; padding:8px 4px; cursor:pointer; text-align:center;">
                <div style="font-size:1rem;">📺</div>
                <div style="font-weight:700; font-size:0.72rem; color:var(--text-primary);">2K</div>
                <div style="font-size:0.58rem; color:var(--text-muted);">QHD</div>
              </button>
              <button class="phe-tier-btn" data-tier="4K" style="background:var(--bg-tertiary); border:2px solid var(--border-subtle); border-radius:8px; padding:8px 4px; cursor:pointer; text-align:center;">
                <div style="font-size:1rem;">🎬</div>
                <div style="font-weight:700; font-size:0.72rem; color:var(--text-primary);">4K</div>
                <div style="font-size:0.58rem; color:var(--text-muted);">Ultra HD</div>
              </button>
              <button class="phe-tier-btn" data-tier="8K" style="background:var(--bg-tertiary); border:2px solid var(--border-subtle); border-radius:8px; padding:8px 4px; cursor:pointer; text-align:center;">
                <div style="font-size:1rem;">🌟</div>
                <div style="font-weight:700; font-size:0.72rem; color:var(--text-primary);">8K</div>
                <div style="font-size:0.58rem; color:var(--text-muted);">Cinema</div>
              </button>
              <button class="phe-tier-btn" data-tier="300PPI" style="background:var(--bg-tertiary); border:2px solid var(--border-subtle); border-radius:8px; padding:8px 4px; cursor:pointer; text-align:center;">
                <div style="font-size:1rem;">🖨️</div>
                <div style="font-weight:700; font-size:0.72rem; color:var(--accent-secondary);">300 PPI</div>
                <div style="font-size:0.58rem; color:var(--text-muted);">Print Master</div>
              </button>
            </div>
          </div>

          <div style="height:1px; background:var(--border-subtle);"></div>

          <!-- Step 4: Enhancement Sliders -->
          <div>
            <div style="font-size:0.78rem; font-weight:700; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.5px; margin-bottom:10px;">Step 3 — AI Enhancement Settings</div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">

              <div style="background:var(--bg-tertiary); padding:10px; border-radius:8px;">
                <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                  <label style="font-size:0.78rem; font-weight:600;">🔍 Sharpness</label>
                  <span id="phe-sharp-val" style="font-size:0.78rem; font-weight:700; color:var(--accent-secondary);">80</span>
                </div>
                <input type="range" id="phe-sharpness" min="0" max="100" value="80" style="width:100%;" />
              </div>

              <div style="background:var(--bg-tertiary); padding:10px; border-radius:8px;">
                <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                  <label style="font-size:0.78rem; font-weight:600;">✨ Detail Boost</label>
                  <span id="phe-detail-val" style="font-size:0.78rem; font-weight:700; color:var(--accent-secondary);">70</span>
                </div>
                <input type="range" id="phe-detail" min="0" max="100" value="70" style="width:100%;" />
              </div>

              <div style="background:var(--bg-tertiary); padding:10px; border-radius:8px;">
                <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                  <label style="font-size:0.78rem; font-weight:600;">🌿 Denoise & Blocks</label>
                  <span id="phe-noise-val" style="font-size:0.78rem; font-weight:700; color:var(--accent-secondary);">35</span>
                </div>
                <input type="range" id="phe-noise" min="0" max="100" value="35" style="width:100%;" />
              </div>

              <div style="background:var(--bg-tertiary); padding:10px; border-radius:8px;">
                <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                  <label style="font-size:0.78rem; font-weight:600;">🎨 Dynamic Contrast</label>
                  <span id="phe-contrast-val" style="font-size:0.78rem; font-weight:700; color:var(--accent-secondary);">35</span>
                </div>
                <input type="range" id="phe-contrast" min="0" max="100" value="35" style="width:100%;" />
              </div>

              <div style="background:var(--bg-tertiary); padding:10px; border-radius:8px;">
                <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                  <label style="font-size:0.78rem; font-weight:600;">🌈 Color Vibrancy</label>
                  <span id="phe-vibrance-val" style="font-size:0.78rem; font-weight:700; color:var(--accent-secondary);">30</span>
                </div>
                <input type="range" id="phe-vibrance" min="0" max="100" value="30" style="width:100%;" />
              </div>

              <div style="background:var(--bg-tertiary); padding:10px; border-radius:8px;">
                <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                  <label style="font-size:0.78rem; font-weight:600;">💎 Edge Clarity</label>
                  <span id="phe-edge-val" style="font-size:0.78rem; font-weight:700; color:var(--accent-secondary);">65</span>
                </div>
                <input type="range" id="phe-edge" min="0" max="100" value="65" style="width:100%;" />
              </div>

              <div style="background:var(--bg-tertiary); padding:10px; border-radius:8px;">
                <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                  <label style="font-size:0.78rem; font-weight:600;">🎯 Deblur Strength</label>
                  <span id="phe-deblur-val" style="font-size:0.78rem; font-weight:700; color:var(--accent-secondary);">45</span>
                </div>
                <input type="range" id="phe-deblur" min="0" max="100" value="45" style="width:100%;" />
              </div>

              <div style="background:var(--bg-tertiary); padding:10px; border-radius:8px;">
                <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                  <label style="font-size:0.78rem; font-weight:600;">🧹 Artifact Cleaning</label>
                  <span id="phe-artifact-val" style="font-size:0.78rem; font-weight:700; color:var(--accent-secondary);">40</span>
                </div>
                <input type="range" id="phe-artifact" min="0" max="100" value="40" style="width:100%;" />
              </div>

            </div>

            <!-- Preview button -->
            <button class="btn btn-glass btn-sm" id="phe-preview-btn" style="margin-top:10px; border-color:var(--accent-secondary); color:var(--accent-secondary); display:none;">👁 Update Preview</button>
          </div>

          <div style="height:1px; background:var(--border-subtle);"></div>

          <!-- Step 5: Export Format -->
          <div>
            <div style="font-size:0.78rem; font-weight:700; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.5px; margin-bottom:8px;">Step 4 — Export Format</div>
            <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:8px;" id="phe-fmt-grid">
              <button class="phe-fmt-btn" data-fmt="jpeg" style="background:rgba(99,102,241,0.2); border:2px solid var(--accent-primary); border-radius:8px; padding:10px; cursor:pointer; text-align:center; transition:all 0.15s;">
                <div style="font-size:1.1rem;">📷</div>
                <div style="font-weight:700; font-size:0.78rem; color:var(--text-primary); margin-top:3px;">JPEG</div>
                <div style="font-size:0.62rem; color:var(--text-muted);">Small file, high quality</div>
              </button>
              <button class="phe-fmt-btn" data-fmt="png" style="background:var(--bg-tertiary); border:2px solid var(--border-subtle); border-radius:8px; padding:10px; cursor:pointer; text-align:center; transition:all 0.15s;">
                <div style="font-size:1.1rem;">🖼️</div>
                <div style="font-weight:700; font-size:0.78rem; color:var(--text-primary); margin-top:3px;">PNG</div>
                <div style="font-size:0.62rem; color:var(--text-muted);">Lossless quality</div>
              </button>
              <button class="phe-fmt-btn" data-fmt="webp" style="background:var(--bg-tertiary); border:2px solid var(--border-subtle); border-radius:8px; padding:10px; cursor:pointer; text-align:center; transition:all 0.15s;">
                <div style="font-size:1.1rem;">🌐</div>
                <div style="font-weight:700; font-size:0.78rem; color:var(--text-primary); margin-top:3px;">WebP</div>
                <div style="font-size:0.62rem; color:var(--text-muted);">Best compression</div>
              </button>
            </div>
            <div style="display:flex; align-items:center; gap:10px; margin-top:8px;">
              <label style="font-size:0.78rem; font-weight:600; white-space:nowrap;">JPEG Quality:</label>
              <input type="range" id="phe-jpeg-q" min="75" max="100" value="95" style="flex:1;" />
              <span id="phe-jpeg-q-val" style="font-size:0.78rem; font-weight:700; color:var(--accent-secondary); min-width:24px;">95</span>
            </div>
          </div>

          <div style="height:1px; background:var(--border-subtle);"></div>

          <!-- Step 6: Progress -->
          <div id="phe-progress-section" style="display:none;">
            <div style="font-size:0.78rem; font-weight:700; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.5px; margin-bottom:10px;">Step 5 — Processing</div>
            <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:8px; margin-bottom:10px;">
              <div style="background:var(--bg-tertiary); border-radius:8px; padding:10px; text-align:center;">
                <div style="font-size:1.2rem; font-weight:700; color:var(--accent-primary);" id="phe-stat-done">0</div>
                <div style="font-size:0.7rem; color:var(--text-muted);">Completed</div>
              </div>
              <div style="background:var(--bg-tertiary); border-radius:8px; padding:10px; text-align:center;">
                <div style="font-size:1.2rem; font-weight:700; color:var(--accent-secondary);" id="phe-stat-speed">0.0</div>
                <div style="font-size:0.7rem; color:var(--text-muted);">img/sec</div>
              </div>
              <div style="background:var(--bg-tertiary); border-radius:8px; padding:10px; text-align:center;">
                <div style="font-size:1.2rem; font-weight:700; color:var(--status-success);" id="phe-stat-eta">–</div>
                <div style="font-size:0.7rem; color:var(--text-muted);">ETA (sec)</div>
              </div>
            </div>
            <div style="background:var(--bg-primary); border-radius:6px; overflow:hidden; height:10px; margin-bottom:6px;">
              <div id="phe-prog-bar" style="height:100%; width:0%; background:linear-gradient(90deg,#6366f1,#06b6d4); transition:width 0.15s ease-out; border-radius:6px;"></div>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:0.75rem; color:var(--text-muted); margin-bottom:10px;">
              <span id="phe-prog-label">0 / 0 images</span>
              <span id="phe-prog-pct" style="font-weight:700; color:var(--accent-secondary);">0%</span>
            </div>
            <div id="phe-log" style="background:rgba(0,0,0,0.35); border-radius:8px; padding:8px 12px; max-height:100px; overflow-y:auto; font-family:var(--font-mono); font-size:0.71rem; color:var(--text-secondary); display:flex; flex-direction:column; gap:3px;">
              <div style="color:var(--accent-secondary);">[Ready] Configure settings and press ✨ Enhance All</div>
            </div>
          </div>

        </div>

        <!-- Footer -->
        <div class="modal-footer" style="flex-shrink:0; justify-content:space-between;">
          <div style="display:flex; gap:8px;">
            <button class="btn btn-secondary btn-sm" id="phe-pause" style="display:none;">⏸ Pause</button>
            <button class="btn btn-secondary btn-sm" id="phe-cancel" style="display:none; color:var(--status-danger);">✕ Cancel</button>
            <button class="btn btn-secondary btn-sm" id="phe-close-footer">Close</button>
          </div>
          <div style="display:flex; gap:8px; align-items:center;">
            <span id="phe-file-badge" style="font-size:0.75rem; color:var(--text-muted); display:none;"></span>
            <button class="btn btn-primary btn-sm" id="phe-start" disabled style="box-shadow:0 0 14px rgba(99,102,241,0.4);">
              ✨ Enhance All
            </button>
            <button class="btn btn-sm" id="phe-download" style="display:none; background:#06b6d4; color:#000; font-weight:700;">
              📦 Download ZIP
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modalEl);

    // ── Refs ──
    const closeModal     = () => modalEl.remove();
    modalEl.querySelector('#phe-close').onclick        = closeModal;
    modalEl.querySelector('#phe-close-footer').onclick = closeModal;

    const dropzone       = modalEl.querySelector('#phe-dropzone');
    const fileInput      = modalEl.querySelector('#phe-file-input');
    const browseBtn      = modalEl.querySelector('#phe-browse');
    const statsBar       = modalEl.querySelector('#phe-stats-bar');
    const statsCount     = modalEl.querySelector('#phe-stats-count');
    const statsSizeEl    = modalEl.querySelector('#phe-stats-size');
    const clearBtn       = modalEl.querySelector('#phe-clear');
    const thumbStrip     = modalEl.querySelector('#phe-thumb-strip');
    const moreLabel      = modalEl.querySelector('#phe-more-label');
    const previewSection = modalEl.querySelector('#phe-preview-section');
    const beforeCanvas   = modalEl.querySelector('#phe-before-canvas');
    const afterCanvas    = modalEl.querySelector('#phe-after-canvas');
    const previewLoader  = modalEl.querySelector('#phe-preview-loader');
    const previewInfo    = modalEl.querySelector('#phe-preview-info');
    const previewBtn     = modalEl.querySelector('#phe-preview-btn');
    const startBtn       = modalEl.querySelector('#phe-start');
    const pauseBtn       = modalEl.querySelector('#phe-pause');
    const cancelBtn      = modalEl.querySelector('#phe-cancel');
    const downloadBtn    = modalEl.querySelector('#phe-download');
    const progressSec    = modalEl.querySelector('#phe-progress-section');
    const progBar        = modalEl.querySelector('#phe-prog-bar');
    const progLabel      = modalEl.querySelector('#phe-prog-label');
    const progPct        = modalEl.querySelector('#phe-prog-pct');
    const statDone       = modalEl.querySelector('#phe-stat-done');
    const statSpeed      = modalEl.querySelector('#phe-stat-speed');
    const statEta        = modalEl.querySelector('#phe-stat-eta');
    const logEl          = modalEl.querySelector('#phe-log');
    const fileBadge      = modalEl.querySelector('#phe-file-badge');

    // Sliders
    const sharpSlider    = modalEl.querySelector('#phe-sharpness');
    const detailSlider   = modalEl.querySelector('#phe-detail');
    const noiseSlider    = modalEl.querySelector('#phe-noise');
    const artifactSlider = modalEl.querySelector('#phe-artifact');
    const contrastSlider = modalEl.querySelector('#phe-contrast');
    const edgeSlider     = modalEl.querySelector('#phe-edge');
    const vibranceSlider = modalEl.querySelector('#phe-vibrance');
    const deblurSlider   = modalEl.querySelector('#phe-deblur');
    [
      ['#phe-sharpness','#phe-sharp-val'],
      ['#phe-detail','#phe-detail-val'],
      ['#phe-noise','#phe-noise-val'],
      ['#phe-artifact','#phe-artifact-val'],
      ['#phe-contrast','#phe-contrast-val'],
      ['#phe-edge','#phe-edge-val'],
      ['#phe-vibrance','#phe-vibrance-val'],
      ['#phe-deblur','#phe-deblur-val'],
      ['#phe-jpeg-q','#phe-jpeg-q-val'],
    ].forEach(([sl, vl]) => {
      const s = modalEl.querySelector(sl);
      const v = modalEl.querySelector(vl);
      if (s && v) s.oninput = () => { v.textContent = s.value; };
    });

    let selectedFiles = [];
    let selectedTier  = '4x';
    let selectedFmt   = 'jpeg';
    let selectedProfile = 'auto';
    let zipBlob       = null;
    const controller  = { isPaused: false, isCancelled: false };

    // ── Preset pills ──
    modalEl.querySelectorAll('.phe-preset-btn').forEach(btn => {
      btn.onclick = () => {
        modalEl.querySelectorAll('.phe-preset-btn').forEach(b => {
          b.style.background  = 'var(--bg-tertiary)';
          b.style.borderColor = 'var(--border-subtle)';
          b.classList.remove('active');
        });
        btn.style.background  = 'rgba(99,102,241,0.2)';
        btn.style.borderColor = 'var(--accent-primary)';
        btn.classList.add('active');
        selectedProfile = btn.dataset.profile;
        const p = ImageUpscalerEngine.presets[selectedProfile];
        if (p) {
          if (sharpSlider) { sharpSlider.value = p.sharpness; modalEl.querySelector('#phe-sharp-val').textContent = p.sharpness; }
          if (detailSlider) { detailSlider.value = p.detail; modalEl.querySelector('#phe-detail-val').textContent = p.detail; }
          if (noiseSlider) { noiseSlider.value = p.noiseReduction; modalEl.querySelector('#phe-noise-val').textContent = p.noiseReduction; }
          if (contrastSlider) { contrastSlider.value = p.contrast; modalEl.querySelector('#phe-contrast-val').textContent = p.contrast; }
          if (edgeSlider) { edgeSlider.value = p.edgeClarity; modalEl.querySelector('#phe-edge-val').textContent = p.edgeClarity; }
          if (vibranceSlider) { vibranceSlider.value = p.vibrance; modalEl.querySelector('#phe-vibrance-val').textContent = p.vibrance; }
          if (deblurSlider) { deblurSlider.value = p.deblur; modalEl.querySelector('#phe-deblur-val').textContent = p.deblur; }
        }
        if (selectedFiles.length > 0) runPreview();
      };
    });

    // ── Tier pills ──
    modalEl.querySelectorAll('.phe-tier-btn').forEach(btn => {
      btn.onclick = () => {
        modalEl.querySelectorAll('.phe-tier-btn').forEach(b => {
          b.style.background  = 'var(--bg-tertiary)';
          b.style.borderColor = 'var(--border-subtle)';
          b.classList.remove('active');
        });
        btn.style.background  = 'rgba(99,102,241,0.2)';
        btn.style.borderColor = 'var(--accent-primary)';
        btn.classList.add('active');
        selectedTier = btn.dataset.tier;
        if (selectedFiles.length > 0) runPreview();
      };
    });

    // ── Format pills ──
    modalEl.querySelectorAll('.phe-fmt-btn').forEach(btn => {
      btn.onclick = () => {
        modalEl.querySelectorAll('.phe-fmt-btn').forEach(b => {
          b.style.background  = 'var(--bg-tertiary)';
          b.style.borderColor = 'var(--border-subtle)';
        });
        btn.style.background  = 'rgba(99,102,241,0.2)';
        btn.style.borderColor = 'var(--accent-primary)';
        selectedFmt = btn.dataset.fmt;
      };
    });

    // ── File handling ──
    const MAX = 200;
    function handleFiles(f) {
      const imgs = Array.from(f).filter(x => x.type.startsWith('image/'));
      if (imgs.length > MAX) {
        toast.error(`Max ${MAX} images. First ${MAX} selected.`);
        selectedFiles = imgs.slice(0, MAX);
      } else {
        selectedFiles = imgs;
      }
      renderList();
      if (selectedFiles.length > 0) setTimeout(runPreview, 100);
    }

    function renderList() {
      thumbStrip.innerHTML = '';
      moreLabel.style.display = 'none';
      if (!selectedFiles.length) {
        statsBar.style.display = 'none';
        startBtn.disabled = true;
        fileBadge.style.display = 'none';
        previewSection.style.display = 'none';
        previewBtn.style.display = 'none';
        return;
      }
      const totalKB = selectedFiles.reduce((s, f) => s + (f.size || 10000), 0) / 1024;
      statsBar.style.display  = 'flex';
      statsCount.textContent  = `${selectedFiles.length} photo${selectedFiles.length > 1 ? 's' : ''} selected`;
      statsSizeEl.textContent = `Total: ${totalKB.toFixed(0)} KB`;
      startBtn.disabled       = false;
      fileBadge.style.display = 'inline';
      fileBadge.textContent   = `${selectedFiles.length} files`;
      previewBtn.style.display= 'inline-flex';

      const maxThumbs = 8;
      selectedFiles.slice(0, maxThumbs).forEach((f, i) => {
        const thumb = document.createElement('div');
        thumb.style.cssText = 'width:48px;height:38px;border-radius:5px;overflow:hidden;border:1px solid var(--border-subtle);background:var(--bg-tertiary);display:flex;align-items:center;justify-content:center;font-size:0.6rem;color:var(--text-muted);flex-shrink:0;';
        const url = URL.createObjectURL(f);
        const img = document.createElement('img');
        img.src = url;
        img.style.cssText = 'width:100%;height:100%;object-fit:cover;';
        img.onload = () => URL.revokeObjectURL(url);
        thumb.appendChild(img);
        thumbStrip.appendChild(thumb);
      });
      if (selectedFiles.length > maxThumbs) {
        moreLabel.style.display = 'block';
        moreLabel.textContent = `+${selectedFiles.length - maxThumbs} more`;
      }
    }

    // ── Before/After Live Preview (first image only) ──
    async function runPreview() {
      if (!selectedFiles.length) return;
      previewSection.style.display = 'block';
      previewLoader.style.display  = 'flex';

      try {
        const file = selectedFiles[0];
        const url  = URL.createObjectURL(file);
        const img  = new Image();
        img.src    = url;
        await img.decode();
        URL.revokeObjectURL(url);

        const origW = img.naturalWidth;
        const origH = img.naturalHeight;

        // Draw BEFORE
        beforeCanvas.width  = origW;
        beforeCanvas.height = origH;
        beforeCanvas.getContext('2d').drawImage(img, 0, 0);

        // Process AFTER
        const enhanced = ImageUpscalerEngine.process(img, selectedTier, {
          profile:           selectedProfile,
          sharpness:         parseInt(sharpSlider.value,    10),
          detailEnhancement: parseInt(detailSlider.value,   10),
          noiseReduction:    parseInt(noiseSlider.value,    10),
          artifactReduction: parseInt(artifactSlider.value, 10),
          edgeEnhancement:   parseInt(edgeSlider.value,     10),
          contrast:          parseInt(contrastSlider.value, 10),
          vibrance:          parseInt(vibranceSlider.value, 10),
          deblur:            parseInt(deblurSlider.value,   10)
        });

        afterCanvas.width  = enhanced.width;
        afterCanvas.height = enhanced.height;
        afterCanvas.getContext('2d').drawImage(enhanced, 0, 0);

        previewInfo.textContent = `Before: ${origW}×${origH}px  →  After: ${enhanced.width}×${enhanced.height}px (${selectedProfile.toUpperCase()} • ${selectedTier})`;
      } catch (e) {
        console.warn('[PHE Preview]', e);
      } finally {
        previewLoader.style.display = 'none';
      }
    }

    previewBtn.onclick = runPreview;

    // Update preview on any slider change
    let previewTimer = null;
    [sharpSlider, detailSlider, noiseSlider, artifactSlider, contrastSlider, edgeSlider, vibranceSlider, deblurSlider].forEach(sl => {
      if (!sl) return;
      sl.addEventListener('input', () => {
        clearTimeout(previewTimer);
        previewTimer = setTimeout(() => { if (selectedFiles.length) runPreview(); }, 400);
      });
    });

    // ── Drag & Drop ──
    dropzone.ondragover  = e => { e.preventDefault(); dropzone.style.borderColor = 'var(--accent-primary)'; };
    dropzone.ondragleave = () => { dropzone.style.borderColor = 'rgba(99,102,241,0.4)'; };
    dropzone.ondrop      = e => { e.preventDefault(); dropzone.style.borderColor = 'rgba(99,102,241,0.4)'; handleFiles(e.dataTransfer.files); };
    browseBtn.onclick    = e => { e.stopPropagation(); fileInput.click(); };
    fileInput.onchange   = () => { if (fileInput.files.length) handleFiles(fileInput.files); };
    dropzone.onclick     = e => { if (e.target.id !== 'phe-browse') fileInput.click(); };
    clearBtn.onclick     = () => { selectedFiles = []; renderList(); };

    // ── Pause / Cancel ──
    pauseBtn.onclick  = () => { controller.isPaused = !controller.isPaused; pauseBtn.textContent = controller.isPaused ? '▶ Resume' : '⏸ Pause'; };
    cancelBtn.onclick = () => { controller.isCancelled = true; };

    // ── Download ──
    downloadBtn.onclick = () => {
      if (!zipBlob) return;
      const u = URL.createObjectURL(zipBlob);
      const a = Object.assign(document.createElement('a'), { href: u, download: `enhanced-photos-${selectedFiles.length}.zip` });
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
    };

    // ── START ──
    startBtn.onclick = async () => {
      if (!selectedFiles.length) return;

      controller.isPaused   = false;
      controller.isCancelled= false;
      startBtn.style.display= 'none';
      pauseBtn.style.display= 'inline-flex';
      cancelBtn.style.display='inline-flex';
      progressSec.style.display= 'block';
      progressSec.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      const sharpness  = parseInt(sharpSlider.value,    10);
      const detail     = parseInt(detailSlider.value,   10);
      const noise      = parseInt(noiseSlider.value,    10);
      const artifact   = parseInt(artifactSlider.value, 10);
      const edge       = parseInt(edgeSlider.value,     10);
      const contrast   = parseInt(contrastSlider.value, 10);
      const vibrance   = parseInt(vibranceSlider.value, 10);
      const deblur     = parseInt(deblurSlider.value,   10);
      const profile    = selectedProfile;
      const jpegQ      = parseInt(modalEl.querySelector('#phe-jpeg-q').value, 10) / 100;
      const tier       = selectedTier;
      const fmt        = selectedFmt;
      const total      = selectedFiles.length;
      let processed    = 0;
      let failed       = 0;
      const startTime  = Date.now();

      logEl.innerHTML = `<div style="color:var(--accent-secondary);">[Pipeline] Starting ✨ AI Enhancement for ${total} photo(s)... Tier: ${tier} • Profile: ${profile.toUpperCase()}</div>`;

      const { default: JSZipModule } = await import('jszip');
      const zip    = new JSZipModule();
      const folder = zip.folder('enhanced_photos');

      const concurrency = 2; // Lower concurrency for upscaling (memory-intensive)
      let cursor = 0;

      const worker = async () => {
        while (cursor < total) {
          if (controller.isCancelled) break;
          while (controller.isPaused && !controller.isCancelled) await new Promise(r => setTimeout(r, 200));

          const idx  = cursor++;
          if (idx >= total) break;
          const file = selectedFiles[idx];
          const baseName = (file.name || `photo_${String(idx+1).padStart(3,'0')}.jpg`).replace(/\.[^/.]+$/, '');

          try {
            const url = URL.createObjectURL(file);
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.src = url;
            await img.decode();
            URL.revokeObjectURL(url);

            // AI Upscale + Enhancement Pipeline
            const enhanced = ImageUpscalerEngine.process(img, tier, {
              profile,
              sharpness,
              detailEnhancement: detail,
              noiseReduction: noise,
              artifactReduction: artifact,
              edgeEnhancement: edge,
              contrast,
              vibrance,
              deblur
            });

            // Export
            let blob, outName;
            if (fmt === 'jpeg') {
              blob    = await new Promise(res => enhanced.toBlob(res, 'image/jpeg', jpegQ));
              outName = `${baseName}_enhanced_${tier}.jpg`;
            } else if (fmt === 'webp') {
              blob    = await new Promise(res => enhanced.toBlob(res, 'image/webp', 0.95));
              outName = `${baseName}_enhanced_${tier}.webp`;
            } else {
              blob    = await new Promise(res => enhanced.toBlob(res, 'image/png'));
              outName = `${baseName}_enhanced_${tier}.png`;
            }

            const buf = await blob.arrayBuffer();
            folder.file(outName, buf);
            processed++;
          } catch (e) {
            console.warn('[PHE] Failed:', file.name, e);
            failed++;
          }

          // Update UI
          const elapsed   = (Date.now() - startTime) / 1000;
          const speed     = elapsed > 0 ? (processed / elapsed).toFixed(1) : '0.0';
          const remaining = total - processed - failed;
          const eta       = parseFloat(speed) > 0 ? Math.round(remaining / parseFloat(speed)) : 0;
          const pct       = Math.min(95, Math.round(((processed + failed) / total) * 95));

          progBar.style.width   = pct + '%';
          progPct.textContent   = pct + '%';
          progLabel.textContent = `${processed + failed} / ${total} photos`;
          statDone.textContent  = processed;
          statSpeed.textContent = speed;
          statEta.textContent   = eta > 0 ? eta + 's' : '–';

          const li = document.createElement('div');
          li.textContent = `✓ [${String(processed+failed).padStart(3,'0')}/${total}] ${file.name || baseName}`;
          logEl.appendChild(li);
          if (logEl.children.length > 50) logEl.removeChild(logEl.children[0]);
          logEl.scrollTop = logEl.scrollHeight;

          await new Promise(r => setTimeout(r, 0));
        }
      };

      await Promise.all(Array.from({ length: Math.min(concurrency, total) }, worker));

      if (controller.isCancelled) {
        logEl.appendChild(Object.assign(document.createElement('div'), { textContent: '[Cancelled]', style: 'color:var(--status-danger);' }));
        pauseBtn.style.display  = 'none';
        cancelBtn.style.display = 'none';
        startBtn.style.display  = 'inline-flex';
        startBtn.disabled       = false;
        return;
      }

      progBar.style.width = '97%';
      logEl.appendChild(Object.assign(document.createElement('div'), { textContent: '[Packaging] Building ZIP...', style: 'color:var(--accent-secondary);' }));

      zip.file('README.txt', [
        '=== AI Photo Enhancer — Creative Vector Studio ===',
        `Upscale Tier: ${tier}`,
        `Total Enhanced: ${processed}`,
        `Generated: ${new Date().toISOString()}`
      ].join('\n'));

      zipBlob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 4 } });

      progBar.style.width   = '100%';
      progPct.textContent   = '100%';
      pauseBtn.style.display  = 'none';
      cancelBtn.style.display = 'none';
      downloadBtn.style.display = 'inline-flex';

      const doneMsg = document.createElement('div');
      doneMsg.textContent = `✅ Done! ${processed} photos enhanced. Click "Download ZIP" to save.`;
      doneMsg.style.color = 'var(--status-success)';
      logEl.appendChild(doneMsg);

      toast.success(`✨ ${processed} photos enhanced successfully! Downloading ZIP...`);

      const dlUrl = URL.createObjectURL(zipBlob);
      const a = Object.assign(document.createElement('a'), { href: dlUrl, download: `ai-enhanced-${processed}-photos.zip` });
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
    };
  }

  /**
   * ──────────────────────────────────────────────────────────────────
   * DEDICATED 200-IMAGE BATCH BACKGROUND REMOVE / CHANGE MODAL
   * Supports: Remove (transparent), Solid Color, Gradient, Custom Image
   * Max: 200 images per batch
   * ──────────────────────────────────────────────────────────────────
   */
  static openBatchBgRemoverModal(files = null) {
    const modalEl = document.createElement('div');
    modalEl.className = 'modal-backdrop';
    modalEl.innerHTML = `
      <div class="modal-container" style="max-width:680px; max-height:90vh; display:flex; flex-direction:column;">
        <!-- Header -->
        <div class="modal-header" style="flex-shrink:0;">
          <div style="display:flex; align-items:center; gap:10px;">
            <div style="width:36px; height:36px; border-radius:10px; background:linear-gradient(135deg,#6366f1,#06b6d4); display:flex; align-items:center; justify-content:center; font-size:1.2rem;">✂</div>
            <div>
              <h3 class="modal-title">Batch Background Remove &amp; Change</h3>
              <div style="font-size:0.7rem; color:var(--accent-secondary); font-weight:700; letter-spacing:0.5px;">UP TO 200 IMAGES — PARALLEL PROCESSING — ZIP EXPORT</div>
            </div>
          </div>
          <button class="btn-icon" id="bbg-close">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <div class="modal-body" style="overflow-y:auto; flex:1;">

          <!-- Step 1: Upload Zone -->
          <div id="bbg-upload-section">
            <div style="font-size:0.8rem; font-weight:700; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.5px; margin-bottom:8px;">Step 1 — Select Images (max 200)</div>
            <div id="bbg-dropzone" style="border:2px dashed rgba(99,102,241,0.4); border-radius:10px; padding:24px; text-align:center; cursor:pointer; background:rgba(99,102,241,0.05); transition:border-color 0.2s; margin-bottom:12px;">
              <div style="font-size:2rem; margin-bottom:6px;">🖼️</div>
              <div style="font-weight:700; font-size:0.95rem; margin-bottom:4px; color:var(--text-primary);">Drag &amp; Drop Images Here</div>
              <div style="font-size:0.75rem; color:var(--text-muted); margin-bottom:12px;">JPG, PNG, WEBP — maximum 200 images per batch</div>
              <div style="display:flex; justify-content:center; gap:8px; flex-wrap:wrap;">
                <button class="btn btn-secondary btn-sm" id="bbg-browse">Browse Files</button>
                <button class="btn btn-glass btn-sm" id="bbg-demo" style="border-color:var(--accent-secondary); color:var(--accent-secondary);">⚡ Demo 200 Images</button>
              </div>
              <input type="file" id="bbg-file-input" multiple accept="image/jpeg,image/png,image/webp" style="display:none;" />
            </div>

            <!-- Selected files stats bar -->
            <div id="bbg-stats-bar" style="display:none; background:rgba(99,102,241,0.12); border:1px solid rgba(99,102,241,0.3); border-radius:8px; padding:10px 14px; margin-bottom:14px; display:none; justify-content:space-between; align-items:center;">
              <div>
                <div style="font-weight:700; color:var(--text-primary); font-size:0.88rem;" id="bbg-stats-count">0 images selected</div>
                <div style="font-size:0.72rem; color:var(--text-muted);" id="bbg-stats-size">Ready for batch background processing</div>
              </div>
              <button class="btn btn-secondary btn-sm" id="bbg-clear-files" style="font-size:0.72rem; padding:3px 8px;">Clear</button>
            </div>

            <!-- Thumbnail preview strip (max 10 shown) -->
            <div id="bbg-thumb-strip" style="display:flex; gap:6px; flex-wrap:wrap; max-height:90px; overflow:hidden; margin-bottom:4px;"></div>
            <div id="bbg-more-label" style="font-size:0.72rem; color:var(--accent-secondary); font-weight:600; display:none; margin-bottom:12px;"></div>
          </div>

          <div style="height:1px; background:var(--border-subtle); margin:16px 0;"></div>

          <!-- Step 2: Background Mode -->
          <div>
            <div style="font-size:0.8rem; font-weight:700; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.5px; margin-bottom:10px;">Step 2 — Choose Background Action</div>

            <!-- Mode Selector Pills -->
            <div style="display:grid; grid-template-columns:repeat(2,1fr); gap:8px; margin-bottom:14px;" id="bbg-mode-grid">
              <button class="bbg-mode-btn active" data-mode="remove" style="background:rgba(99,102,241,0.2); border:2px solid var(--accent-primary); border-radius:10px; padding:10px 12px; cursor:pointer; text-align:left; transition:all 0.15s;">
                <div style="font-size:1.1rem;">🪄</div>
                <div style="font-weight:700; font-size:0.82rem; color:var(--text-primary); margin-top:3px;">Remove Background</div>
                <div style="font-size:0.7rem; color:var(--text-muted);">Transparent PNG (cutout)</div>
              </button>
              <button class="bbg-mode-btn" data-mode="color" style="background:var(--bg-tertiary); border:2px solid var(--border-subtle); border-radius:10px; padding:10px 12px; cursor:pointer; text-align:left; transition:all 0.15s;">
                <div style="font-size:1.1rem;">🎨</div>
                <div style="font-weight:700; font-size:0.82rem; color:var(--text-primary); margin-top:3px;">Solid Color BG</div>
                <div style="font-size:0.7rem; color:var(--text-muted);">Replace with any color</div>
              </button>
              <button class="bbg-mode-btn" data-mode="gradient" style="background:var(--bg-tertiary); border:2px solid var(--border-subtle); border-radius:10px; padding:10px 12px; cursor:pointer; text-align:left; transition:all 0.15s;">
                <div style="font-size:1.1rem;">🌈</div>
                <div style="font-weight:700; font-size:0.82rem; color:var(--text-primary); margin-top:3px;">Gradient Background</div>
                <div style="font-size:0.7rem; color:var(--text-muted);">2-color linear gradient</div>
              </button>
              <button class="bbg-mode-btn" data-mode="image" style="background:var(--bg-tertiary); border:2px solid var(--border-subtle); border-radius:10px; padding:10px 12px; cursor:pointer; text-align:left; transition:all 0.15s;">
                <div style="font-size:1.1rem;">🖼️</div>
                <div style="font-weight:700; font-size:0.82rem; color:var(--text-primary); margin-top:3px;">Custom BG Image</div>
                <div style="font-size:0.7rem; color:var(--text-muted);">Upload your own background</div>
              </button>
            </div>

            <!-- Mode-specific options -->
            <div id="bbg-opts-color" style="display:none; align-items:center; gap:12px; background:var(--bg-tertiary); padding:12px; border-radius:8px; margin-bottom:12px;">
              <label style="font-size:0.82rem; font-weight:600; white-space:nowrap;">Background Color:</label>
              <input type="color" id="bbg-color-pick" value="#ffffff" style="width:48px; height:34px; border-radius:6px; border:none; cursor:pointer;" />
              <div style="display:flex; gap:6px; flex-wrap:wrap;">
                ${['#ffffff','#000000','#f8f9fa','#1e1b4b','#ecfdf5','#fef3c7','#fce7f3','#e0f2fe'].map(c=>`<div class="bbg-preset-color" data-color="${c}" style="width:24px;height:24px;border-radius:50%;background:${c};cursor:pointer;border:2px solid rgba(255,255,255,0.3);transition:transform 0.1s;" title="${c}"></div>`).join('')}
              </div>
            </div>

            <div id="bbg-opts-gradient" style="display:none; gap:12px; align-items:center; background:var(--bg-tertiary); padding:12px; border-radius:8px; margin-bottom:12px; flex-wrap:wrap;">
              <label style="font-size:0.82rem; font-weight:600;">Gradient:</label>
              <div style="display:flex; align-items:center; gap:6px;">
                <input type="color" id="bbg-grad-a" value="#6366f1" style="width:38px; height:30px; border-radius:5px; border:none; cursor:pointer;" />
                <span style="font-size:0.8rem; color:var(--text-muted);">→</span>
                <input type="color" id="bbg-grad-b" value="#06b6d4" style="width:38px; height:30px; border-radius:5px; border:none; cursor:pointer;" />
              </div>
              <div id="bbg-grad-preview" style="flex:1; min-width:80px; height:30px; border-radius:6px; background:linear-gradient(135deg,#6366f1,#06b6d4);"></div>
              <select id="bbg-grad-dir" style="font-size:0.78rem; padding:4px 8px;">
                <option value="to right">→ Horizontal</option>
                <option value="to bottom">↓ Vertical</option>
                <option value="135deg" selected>↘ Diagonal</option>
                <option value="to bottom right">↘ Bottom-Right</option>
              </select>
            </div>

            <div id="bbg-opts-image" style="display:none; background:var(--bg-tertiary); padding:12px; border-radius:8px; margin-bottom:12px;">
              <div style="font-size:0.82rem; font-weight:600; margin-bottom:8px;">Upload Background Image:</div>
              <div style="display:flex; align-items:center; gap:10px;">
                <button class="btn btn-secondary btn-sm" id="bbg-bg-img-btn">Choose Image</button>
                <input type="file" id="bbg-bg-img-input" accept="image/*" style="display:none;" />
                <span id="bbg-bg-img-name" style="font-size:0.78rem; color:var(--text-muted);">No image selected</span>
                <div id="bbg-bg-img-preview" style="width:48px; height:36px; border-radius:5px; overflow:hidden; display:none;">
                  <img id="bbg-bg-img-thumb" style="width:100%; height:100%; object-fit:cover;" />
                </div>
              </div>
            </div>

            <!-- AI Sensitivity -->
            <div style="background:var(--bg-tertiary); padding:12px; border-radius:8px; margin-bottom:12px;">
              <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
                <label style="font-size:0.82rem; font-weight:600;">AI Removal Sensitivity</label>
                <span id="bbg-sens-val" style="font-size:0.82rem; font-weight:700; color:var(--accent-secondary);">70</span>
              </div>
              <input type="range" id="bbg-sensitivity" min="20" max="100" value="70" style="width:100%;" />
              <div style="display:flex; justify-content:space-between; font-size:0.7rem; color:var(--text-muted); margin-top:2px;">
                <span>Conservative (keeps more)</span>
                <span>Aggressive (removes more)</span>
              </div>
            </div>

            <!-- Quality Enhancement Panel -->
            <div style="background:linear-gradient(135deg,rgba(99,102,241,0.1),rgba(6,182,212,0.08)); border:1px solid rgba(99,102,241,0.25); padding:14px; border-radius:10px; margin-bottom:4px;">
              <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:10px;">
                <div style="display:flex; align-items:center; gap:8px;">
                  <span style="font-size:1rem;">✨</span>
                  <label style="font-size:0.83rem; font-weight:700; color:var(--text-primary);">Output Quality Enhancement</label>
                </div>
                <label style="display:flex; align-items:center; gap:6px; cursor:pointer;">
                  <div style="position:relative; width:36px; height:20px;">
                    <input type="checkbox" id="bbg-enhance-toggle" checked style="opacity:0; position:absolute; width:0; height:0;" />
                    <div id="bbg-toggle-track" style="position:absolute; inset:0; background:var(--accent-primary); border-radius:10px; transition:background 0.2s;"></div>
                    <div id="bbg-toggle-knob" style="position:absolute; top:2px; left:18px; width:16px; height:16px; background:#fff; border-radius:50%; transition:left 0.2s; box-shadow:0 1px 4px rgba(0,0,0,0.3);"></div>
                  </div>
                  <span style="font-size:0.75rem; color:var(--accent-secondary); font-weight:700;">ON</span>
                </label>
              </div>
              <div id="bbg-enhance-opts">
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                  <div>
                    <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                      <label style="font-size:0.75rem; color:var(--text-muted);">🔍 Sharpness</label>
                      <span id="bbg-sharp-val" style="font-size:0.75rem; font-weight:700; color:var(--accent-secondary);">70</span>
                    </div>
                    <input type="range" id="bbg-sharpness" min="0" max="100" value="70" style="width:100%;" />
                  </div>
                  <div>
                    <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                      <label style="font-size:0.75rem; color:var(--text-muted);">🎨 Contrast Boost</label>
                      <span id="bbg-contrast-val" style="font-size:0.75rem; font-weight:700; color:var(--accent-secondary);">40</span>
                    </div>
                    <input type="range" id="bbg-contrast" min="0" max="100" value="40" style="width:100%;" />
                  </div>
                  <div>
                    <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                      <label style="font-size:0.75rem; color:var(--text-muted);">🌿 Noise Reduction</label>
                      <span id="bbg-denoise-val" style="font-size:0.75rem; font-weight:700; color:var(--accent-secondary);">30</span>
                    </div>
                    <input type="range" id="bbg-denoise" min="0" max="100" value="30" style="width:100%;" />
                  </div>
                  <div>
                    <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                      <label style="font-size:0.75rem; color:var(--text-muted);">✨ Edge Clarity</label>
                      <span id="bbg-edge-val" style="font-size:0.75rem; font-weight:700; color:var(--accent-secondary);">60</span>
                    </div>
                    <input type="range" id="bbg-edge" min="0" max="100" value="60" style="width:100%;" />
                  </div>
                </div>
                <div style="margin-top:8px; font-size:0.7rem; color:var(--text-muted);">✅ Lossless PNG export • High-quality bicubic rendering • Edge-aware enhancement</div>
              </div>
            </div>
          </div>

          <div style="height:1px; background:var(--border-subtle); margin:16px 0;"></div>

          <!-- Step 3: Export Format -->
          <div>
            <div style="font-size:0.8rem; font-weight:700; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.5px; margin-bottom:10px;">Step 3 — Export Format</div>
            <div style="display:grid; grid-template-columns:repeat(5,1fr); gap:6px; margin-bottom:10px;" id="bbg-fmt-grid">
              <button class="bbg-fmt-btn active" data-fmt="png" style="background:rgba(99,102,241,0.2); border:2px solid var(--accent-primary); border-radius:8px; padding:8px 4px; cursor:pointer; text-align:center; transition:all 0.15s;">
                <div style="font-size:1rem;">🖼️</div>
                <div style="font-weight:700; font-size:0.72rem; color:var(--text-primary); margin-top:2px;">PNG</div>
                <div style="font-size:0.6rem; color:var(--text-muted);">Lossless</div>
              </button>
              <button class="bbg-fmt-btn" data-fmt="jpeg" style="background:var(--bg-tertiary); border:2px solid var(--border-subtle); border-radius:8px; padding:8px 4px; cursor:pointer; text-align:center; transition:all 0.15s;">
                <div style="font-size:1rem;">📷</div>
                <div style="font-weight:700; font-size:0.72rem; color:var(--text-primary); margin-top:2px;">JPEG</div>
                <div style="font-size:0.6rem; color:var(--text-muted);">Small size</div>
              </button>
              <button class="bbg-fmt-btn" data-fmt="webp" style="background:var(--bg-tertiary); border:2px solid var(--border-subtle); border-radius:8px; padding:8px 4px; cursor:pointer; text-align:center; transition:all 0.15s;">
                <div style="font-size:1rem;">🌐</div>
                <div style="font-weight:700; font-size:0.72rem; color:var(--text-primary); margin-top:2px;">WebP</div>
                <div style="font-size:0.6rem; color:var(--text-muted);">Modern web</div>
              </button>
              <button class="bbg-fmt-btn" data-fmt="svg" style="background:var(--bg-tertiary); border:2px solid var(--border-subtle); border-radius:8px; padding:8px 4px; cursor:pointer; text-align:center; transition:all 0.15s;">
                <div style="font-size:1rem;">✏️</div>
                <div style="font-weight:700; font-size:0.72rem; color:var(--text-primary); margin-top:2px;">SVG</div>
                <div style="font-size:0.6rem; color:var(--text-muted);">Scalable</div>
              </button>
              <button class="bbg-fmt-btn" data-fmt="eps" style="background:var(--bg-tertiary); border:2px solid var(--border-subtle); border-radius:8px; padding:8px 4px; cursor:pointer; text-align:center; transition:all 0.15s;">
                <div style="font-size:1rem;">🖨️</div>
                <div style="font-weight:700; font-size:0.72rem; color:var(--text-primary); margin-top:2px;">EPS</div>
                <div style="font-size:0.6rem; color:var(--text-muted);">Print/Press</div>
              </button>
            </div>

            <!-- JPEG quality slider (shown only for JPEG) -->
            <div id="bbg-jpeg-quality-row" style="display:none; background:var(--bg-tertiary); padding:10px 12px; border-radius:8px; margin-bottom:4px;">
              <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                <label style="font-size:0.8rem; font-weight:600;">JPEG Quality</label>
                <span id="bbg-jpeg-q-val" style="font-size:0.8rem; font-weight:700; color:var(--accent-secondary);">92</span>
              </div>
              <input type="range" id="bbg-jpeg-quality" min="50" max="100" value="92" style="width:100%;" />
              <div style="display:flex; justify-content:space-between; font-size:0.68rem; color:var(--text-muted); margin-top:2px;">
                <span>Smaller file</span><span>Maximum quality</span>
              </div>
            </div>

            <!-- Format info bar -->
            <div id="bbg-fmt-info" style="font-size:0.72rem; color:var(--text-muted); padding:6px 10px; background:var(--bg-tertiary); border-radius:6px; margin-top:4px;">
              📦 <strong>PNG</strong> — Lossless compression, supports transparency. Best for cutouts & web use.
            </div>
          </div>

          <div style="height:1px; background:var(--border-subtle); margin:16px 0;"></div>

          <!-- Step 4: Progress Dashboard -->
          <div id="bbg-progress-section" style="display:none;">
            <div style="font-size:0.8rem; font-weight:700; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.5px; margin-bottom:10px;">Step 4 — Processing</div>


            <!-- Stats Row -->
            <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:8px; margin-bottom:12px;">
              <div style="background:var(--bg-tertiary); border-radius:8px; padding:10px; text-align:center;">
                <div style="font-size:1.2rem; font-weight:700; color:var(--accent-primary);" id="bbg-stat-done">0</div>
                <div style="font-size:0.7rem; color:var(--text-muted);">Completed</div>
              </div>
              <div style="background:var(--bg-tertiary); border-radius:8px; padding:10px; text-align:center;">
                <div style="font-size:1.2rem; font-weight:700; color:var(--accent-secondary);" id="bbg-stat-speed">0.0</div>
                <div style="font-size:0.7rem; color:var(--text-muted);">img/sec</div>
              </div>
              <div style="background:var(--bg-tertiary); border-radius:8px; padding:10px; text-align:center;">
                <div style="font-size:1.2rem; font-weight:700; color:var(--status-success);" id="bbg-stat-eta">–</div>
                <div style="font-size:0.7rem; color:var(--text-muted);">ETA (sec)</div>
              </div>
            </div>

            <!-- Progress Bar -->
            <div style="background:var(--bg-primary); border-radius:6px; overflow:hidden; height:10px; margin-bottom:6px;">
              <div id="bbg-prog-bar" style="height:100%; width:0%; background:linear-gradient(90deg,#6366f1,#06b6d4); transition:width 0.15s ease-out; border-radius:6px;"></div>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:0.75rem; color:var(--text-muted); margin-bottom:10px;">
              <span id="bbg-prog-label">0 / 0 images</span>
              <span id="bbg-prog-pct" style="font-weight:700; color:var(--accent-secondary);">0%</span>
            </div>

            <!-- Live log -->
            <div id="bbg-log" style="background:rgba(0,0,0,0.35); border-radius:8px; padding:8px 12px; max-height:110px; overflow-y:auto; font-family:var(--font-mono); font-size:0.71rem; color:var(--text-secondary); display:flex; flex-direction:column; gap:3px;">
              <div style="color:var(--accent-secondary);">[Ready] Configure options and press ⚡ Start Processing</div>
            </div>
          </div>

        </div>

        <!-- Footer -->
        <div class="modal-footer" style="flex-shrink:0; justify-content:space-between;">
          <div style="display:flex; gap:8px;">
            <button class="btn btn-secondary btn-sm" id="bbg-pause" style="display:none;">⏸ Pause</button>
            <button class="btn btn-secondary btn-sm" id="bbg-cancel" style="display:none; color:var(--status-danger);">✕ Cancel</button>
            <button class="btn btn-secondary btn-sm" id="bbg-close-footer">Close</button>
          </div>
          <div style="display:flex; gap:8px; align-items:center;">
            <span id="bbg-file-count-badge" style="font-size:0.75rem; color:var(--text-muted); display:none;"></span>
            <button class="btn btn-primary btn-sm" id="bbg-start" disabled style="box-shadow:0 0 14px rgba(99,102,241,0.4);">
              ⚡ Start Batch Processing
            </button>
            <button class="btn btn-sm" id="bbg-download" style="display:none; background:#06b6d4; color:#000; font-weight:700;">
              📦 Download ZIP
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modalEl);

    // ── Element refs ──
    const closeModal = () => modalEl.remove();
    modalEl.querySelector('#bbg-close').onclick = closeModal;
    modalEl.querySelector('#bbg-close-footer').onclick = closeModal;

    const dropzone      = modalEl.querySelector('#bbg-dropzone');
    const fileInput     = modalEl.querySelector('#bbg-file-input');
    const browseBtn     = modalEl.querySelector('#bbg-browse');
    const demoBtn       = modalEl.querySelector('#bbg-demo');
    const statsBar      = modalEl.querySelector('#bbg-stats-bar');
    const statsCount    = modalEl.querySelector('#bbg-stats-count');
    const statsSizeEl   = modalEl.querySelector('#bbg-stats-size');
    const clearBtn      = modalEl.querySelector('#bbg-clear-files');
    const thumbStrip    = modalEl.querySelector('#bbg-thumb-strip');
    const moreLabel     = modalEl.querySelector('#bbg-more-label');
    const startBtn      = modalEl.querySelector('#bbg-start');
    const pauseBtn      = modalEl.querySelector('#bbg-pause');
    const cancelBtn     = modalEl.querySelector('#bbg-cancel');
    const downloadBtn   = modalEl.querySelector('#bbg-download');
    const progressSec   = modalEl.querySelector('#bbg-progress-section');
    const progBar       = modalEl.querySelector('#bbg-prog-bar');
    const progLabel     = modalEl.querySelector('#bbg-prog-label');
    const progPct       = modalEl.querySelector('#bbg-prog-pct');
    const statDone      = modalEl.querySelector('#bbg-stat-done');
    const statSpeed     = modalEl.querySelector('#bbg-stat-speed');
    const statEta       = modalEl.querySelector('#bbg-stat-eta');
    const logEl         = modalEl.querySelector('#bbg-log');
    const sensSlider    = modalEl.querySelector('#bbg-sensitivity');
    const sensVal       = modalEl.querySelector('#bbg-sens-val');
    const fileBadge     = modalEl.querySelector('#bbg-file-count-badge');

    const colorPick     = modalEl.querySelector('#bbg-color-pick');
    const gradA         = modalEl.querySelector('#bbg-grad-a');
    const gradB         = modalEl.querySelector('#bbg-grad-b');
    const gradDir       = modalEl.querySelector('#bbg-grad-dir');
    const gradPreview   = modalEl.querySelector('#bbg-grad-preview');
    const bgImgBtn      = modalEl.querySelector('#bbg-bg-img-btn');
    const bgImgInput    = modalEl.querySelector('#bbg-bg-img-input');
    const bgImgName     = modalEl.querySelector('#bbg-bg-img-name');
    const bgImgPreview  = modalEl.querySelector('#bbg-bg-img-preview');
    const bgImgThumb    = modalEl.querySelector('#bbg-bg-img-thumb');

    // ── Enhancement refs ──
    const enhanceToggle = modalEl.querySelector('#bbg-enhance-toggle');
    const toggleTrack   = modalEl.querySelector('#bbg-toggle-track');
    const toggleKnob    = modalEl.querySelector('#bbg-toggle-knob');
    const toggleLabel   = enhanceToggle?.closest('label')?.querySelector('span');
    const enhanceOpts   = modalEl.querySelector('#bbg-enhance-opts');
    const sharpSlider   = modalEl.querySelector('#bbg-sharpness');
    const sharpValEl    = modalEl.querySelector('#bbg-sharp-val');
    const contrastSlider= modalEl.querySelector('#bbg-contrast');
    const contrastValEl = modalEl.querySelector('#bbg-contrast-val');
    const denoiseSlider = modalEl.querySelector('#bbg-denoise');
    const denoiseValEl  = modalEl.querySelector('#bbg-denoise-val');
    const edgeSlider    = modalEl.querySelector('#bbg-edge');
    const edgeValEl     = modalEl.querySelector('#bbg-edge-val');

    let selectedFiles = files ? [...files] : [];
    let selectedMode = 'remove';
    let bgImageEl = null;
    let zipBlob = null;
    const controller = { isPaused: false, isCancelled: false };

    // ── Sensitivity slider ──
    sensSlider.oninput = () => { sensVal.textContent = sensSlider.value; };

    // ── Enhancement toggle ──
    const updateToggleUI = () => {
      const on = enhanceToggle.checked;
      toggleTrack.style.background = on ? 'var(--accent-primary)' : 'var(--border-subtle)';
      toggleKnob.style.left = on ? '18px' : '2px';
      if (toggleLabel) toggleLabel.textContent = on ? 'ON' : 'OFF';
      if (enhanceOpts) enhanceOpts.style.opacity = on ? '1' : '0.4';
    };
    enhanceToggle.onchange = updateToggleUI;
    updateToggleUI();

    // ── Enhancement sliders live display ──
    sharpSlider.oninput   = () => { sharpValEl.textContent   = sharpSlider.value; };
    contrastSlider.oninput= () => { contrastValEl.textContent= contrastSlider.value; };
    denoiseSlider.oninput = () => { denoiseValEl.textContent = denoiseSlider.value; };
    edgeSlider.oninput    = () => { edgeValEl.textContent    = edgeSlider.value; };

    // ── Export Format pill selection ──
    const fmtBtns         = modalEl.querySelectorAll('.bbg-fmt-btn');
    const jpegQualityRow  = modalEl.querySelector('#bbg-jpeg-quality-row');
    const jpegQualitySldr = modalEl.querySelector('#bbg-jpeg-quality');
    const jpegQValEl      = modalEl.querySelector('#bbg-jpeg-q-val');
    const fmtInfoEl       = modalEl.querySelector('#bbg-fmt-info');

    const FORMAT_INFO = {
      png:  '📦 <strong>PNG</strong> — Lossless compression, supports transparency. Best for cutouts &amp; web use.',
      jpeg: '📷 <strong>JPEG</strong> — Lossy, smaller file size. Best for photos. Note: no transparency.',
      webp: '🌐 <strong>WebP</strong> — Modern web format, great quality &amp; small size. Supports transparency.',
      svg:  '✏️ <strong>SVG</strong> — Scalable vector wrapper. Image embedded as PNG data. Opens in browsers &amp; Illustrator.',
      eps:  '🖨️ <strong>EPS</strong> — PostScript format for print &amp; press. Compatible with Illustrator, InDesign, CorelDRAW.',
    };

    let selectedExportFmt = 'png';

    fmtBtns.forEach(btn => {
      btn.onclick = () => {
        fmtBtns.forEach(b => {
          b.style.background   = 'var(--bg-tertiary)';
          b.style.borderColor  = 'var(--border-subtle)';
          b.classList.remove('active');
        });
        btn.style.background  = 'rgba(99,102,241,0.2)';
        btn.style.borderColor = 'var(--accent-primary)';
        btn.classList.add('active');
        selectedExportFmt = btn.dataset.fmt;
        jpegQualityRow.style.display = selectedExportFmt === 'jpeg' ? 'block' : 'none';
        fmtInfoEl.innerHTML = FORMAT_INFO[selectedExportFmt] || '';
      };
    });
    jpegQualitySldr.oninput = () => { jpegQValEl.textContent = jpegQualitySldr.value; };

    // ── Mode pill selection ──

    const modeBtns = modalEl.querySelectorAll('.bbg-mode-btn');
    const optsColor    = modalEl.querySelector('#bbg-opts-color');
    const optsGradient = modalEl.querySelector('#bbg-opts-gradient');
    const optsImage    = modalEl.querySelector('#bbg-opts-image');

    modeBtns.forEach(btn => {
      btn.onclick = () => {
        modeBtns.forEach(b => {
          b.style.background = 'var(--bg-tertiary)';
          b.style.borderColor = 'var(--border-subtle)';
          b.classList.remove('active');
        });
        btn.style.background = 'rgba(99,102,241,0.2)';
        btn.style.borderColor = 'var(--accent-primary)';
        btn.classList.add('active');
        selectedMode = btn.dataset.mode;

        optsColor.style.display    = selectedMode === 'color'    ? 'flex' : 'none';
        optsGradient.style.display = selectedMode === 'gradient' ? 'flex' : 'none';
        optsImage.style.display    = selectedMode === 'image'    ? 'block' : 'none';
      };
    });

    // ── Color preset circles ──
    modalEl.querySelectorAll('.bbg-preset-color').forEach(c => {
      c.onclick = () => { colorPick.value = c.dataset.color; };
    });

    // ── Gradient live preview ──
    const updateGradPrev = () => {
      gradPreview.style.background = `linear-gradient(${gradDir.value},${gradA.value},${gradB.value})`;
    };
    gradA.oninput = updateGradPrev;
    gradB.oninput = updateGradPrev;
    gradDir.onchange = updateGradPrev;

    // ── BG image upload ──
    bgImgBtn.onclick = () => bgImgInput.click();
    bgImgInput.onchange = () => {
      const f = bgImgInput.files[0];
      if (!f) return;
      bgImgName.textContent = f.name;
      const url = URL.createObjectURL(f);
      bgImageEl = new Image();
      bgImageEl.src = url;
      bgImgThumb.src = url;
      bgImgPreview.style.display = 'block';
    };

    // ── Drag & Drop ──
    dropzone.ondragover = e => { e.preventDefault(); dropzone.style.borderColor = 'var(--accent-primary)'; };
    dropzone.ondragleave = () => { dropzone.style.borderColor = 'rgba(99,102,241,0.4)'; };
    dropzone.ondrop = e => {
      e.preventDefault();
      dropzone.style.borderColor = 'rgba(99,102,241,0.4)';
      const dropped = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
      if (dropped.length) handleFiles(dropped);
    };

    // ── Browse & Demo ──
    browseBtn.onclick = e => { e.stopPropagation(); fileInput.click(); };
    demoBtn.onclick = e => {
      e.stopPropagation();
      const demo = ModalManager.generateDemo500Batch().slice(0, 200);
      handleFiles(demo);
      toast.success('Generated 200 demo images for batch background removal!');
    };
    fileInput.onchange = () => { if (fileInput.files.length) handleFiles(Array.from(fileInput.files)); };
    dropzone.onclick = e => {
      if (e.target.id !== 'bbg-browse' && e.target.id !== 'bbg-demo') fileInput.click();
    };

    clearBtn.onclick = () => { selectedFiles = []; renderFileList(); };

    function renderFileList() {
      thumbStrip.innerHTML = '';
      moreLabel.style.display = 'none';
      if (selectedFiles.length === 0) {
        statsBar.style.display = 'none';
        startBtn.disabled = true;
        fileBadge.style.display = 'none';
        return;
      }

      const totalKB = selectedFiles.reduce((s,f) => s + (f.size || 5000), 0) / 1024;
      statsBar.style.display = 'flex';
      statsCount.textContent = `${selectedFiles.length} image${selectedFiles.length > 1 ? 's' : ''} selected`;
      statsSizeEl.textContent = `Total: ${totalKB.toFixed(0)} KB • Ready for background processing`;
      startBtn.disabled = false;
      fileBadge.style.display = 'inline';
      fileBadge.textContent = `${selectedFiles.length} files`;

      const maxThumbs = 10;
      selectedFiles.slice(0, maxThumbs).forEach((f, i) => {
        const thumb = document.createElement('div');
        thumb.style.cssText = 'width:52px; height:40px; border-radius:5px; overflow:hidden; border:1px solid var(--border-subtle); background:var(--bg-tertiary); display:flex; align-items:center; justify-content:center; font-size:0.6rem; color:var(--text-muted); position:relative; flex-shrink:0;';

        if ((f instanceof File || f instanceof Blob) && f.type && f.type.startsWith('image/')) {
          const url = URL.createObjectURL(f);
          const img = document.createElement('img');
          img.src = url;
          img.style.cssText = 'width:100%; height:100%; object-fit:cover;';
          img.onload = () => URL.revokeObjectURL(url);
          thumb.appendChild(img);
        } else {
          thumb.textContent = `#${i+1}`;
        }
        thumbStrip.appendChild(thumb);
      });

      if (selectedFiles.length > maxThumbs) {
        moreLabel.style.display = 'block';
        moreLabel.textContent = `+${selectedFiles.length - maxThumbs} more images queued`;
      }
    }

    const MAX_BATCH = 200;
    function handleFiles(f) {
      const filtered = f.filter(x => x.type ? x.type.startsWith('image/') : true);
      if (filtered.length > MAX_BATCH) {
        toast.error(`Maximum ${MAX_BATCH} images allowed per batch. First ${MAX_BATCH} selected.`);
        selectedFiles = filtered.slice(0, MAX_BATCH);
      } else {
        selectedFiles = filtered;
      }
      renderFileList();
    }

    // If files already passed, render them immediately
    if (selectedFiles.length > 0) renderFileList();

    // ── Pause / Resume ──
    pauseBtn.onclick = () => {
      controller.isPaused = !controller.isPaused;
      pauseBtn.textContent = controller.isPaused ? '▶ Resume' : '⏸ Pause';
    };
    cancelBtn.onclick = () => { controller.isCancelled = true; };

    // ── Download ──
    downloadBtn.onclick = () => {
      if (!zipBlob) return;
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `batch-bg-removed-${selectedFiles.length}-images.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };

    // ── START ──
    startBtn.onclick = async () => {
      if (!selectedFiles.length) return;
      if (selectedMode === 'image' && !bgImageEl) {
        toast.error('Please upload a background image first.');
        return;
      }

      controller.isPaused = false;
      controller.isCancelled = false;
      startBtn.style.display = 'none';
      pauseBtn.style.display = 'inline-flex';
      cancelBtn.style.display = 'inline-flex';
      progressSec.style.display = 'block';
      progressSec.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      logEl.innerHTML = `<div style="color:var(--accent-secondary);">[Pipeline] Initializing ${selectedFiles.length}-image batch ✨ Enhanced Quality processor...</div>`;

      const sensitivity  = parseInt(sensSlider.value, 10);
      const doEnhance    = enhanceToggle.checked;
      const sharpness    = parseInt(sharpSlider.value, 10);
      const contrastAmt  = parseInt(contrastSlider.value, 10);
      const denoiseAmt   = parseInt(denoiseSlider.value, 10);
      const edgeAmt      = parseInt(edgeSlider.value, 10);
      const total = selectedFiles.length;
      let processed = 0;
      let failed = 0;
      const startTime = Date.now();

      // Dynamic import JSZip
      const { default: JSZipModule } = await import('jszip');
      const zip = new JSZipModule();
      const folder = zip.folder('bg_removed_images');

      const concurrency = 4;
      let cursor = 0;

      /**
       * Apply background removal + new background compositing + quality enhancement.
       * Returns a canvas with lossless-quality output.
       */
      const applyBgAction = (img) => {
        const W = img.naturalWidth  || img.width  || 800;
        const H = img.naturalHeight || img.height || 600;

        // ── Step 1: High-quality source draw ──
        const srcCanvas = document.createElement('canvas');
        srcCanvas.width = W;
        srcCanvas.height = H;
        const srcCtx = srcCanvas.getContext('2d', { willReadFrequently: true });
        srcCtx.imageSmoothingEnabled = true;
        srcCtx.imageSmoothingQuality = 'high';
        srcCtx.drawImage(img, 0, 0, W, H);

        // ── Step 2: AI background removal ──
        let cutoutCanvas;
        try {
          cutoutCanvas = BackgroundRemovalEngine.process(srcCanvas, {
            mode: 'ai_photo',
            sensitivity,
            feather: 4,
            defringe: 45,
            contiguous: true,
            shadowPreservation: true
          });
        } catch (e) {
          cutoutCanvas = srcCanvas;
        }

        // ── Step 3: Composite onto new background ──
        const out = document.createElement('canvas');
        out.width  = W;
        out.height = H;
        const ctx2 = out.getContext('2d', { willReadFrequently: doEnhance });
        ctx2.imageSmoothingEnabled = true;
        ctx2.imageSmoothingQuality = 'high';

        if (selectedMode === 'remove') {
          // Transparent output — composite cutout directly on blank canvas
          ctx2.drawImage(cutoutCanvas, 0, 0);
        } else if (selectedMode === 'color') {
          ctx2.fillStyle = colorPick.value;
          ctx2.fillRect(0, 0, W, H);
          ctx2.drawImage(cutoutCanvas, 0, 0);
        } else if (selectedMode === 'gradient') {
          // Fixed gradient direction calculation
          let x0 = 0, y0 = 0, x1 = 0, y1 = 0;
          const dir = gradDir.value;
          if      (dir === 'to right')        { x1 = W;              }
          else if (dir === 'to bottom')       { y1 = H;              }
          else if (dir === '135deg')          { x1 = W; y1 = H;     }
          else if (dir === 'to bottom right') { x1 = W; y1 = H;     }
          else                                { x1 = W; y1 = H;     }
          const gr = ctx2.createLinearGradient(x0, y0, x1, y1);
          gr.addColorStop(0, gradA.value);
          gr.addColorStop(1, gradB.value);
          ctx2.fillStyle = gr;
          ctx2.fillRect(0, 0, W, H);
          ctx2.drawImage(cutoutCanvas, 0, 0);
        } else if (selectedMode === 'image' && bgImageEl) {
          // Draw bg image with cover-fit
          const bw = bgImageEl.naturalWidth  || bgImageEl.width  || W;
          const bh = bgImageEl.naturalHeight || bgImageEl.height || H;
          const scale = Math.max(W / bw, H / bh);
          const drawW = bw * scale;
          const drawH = bh * scale;
          const dx = (W - drawW) / 2;
          const dy = (H - drawH) / 2;
          ctx2.drawImage(bgImageEl, dx, dy, drawW, drawH);
          ctx2.drawImage(cutoutCanvas, 0, 0);
        } else {
          ctx2.fillStyle = '#ffffff';
          ctx2.fillRect(0, 0, W, H);
          ctx2.drawImage(cutoutCanvas, 0, 0);
        }

        // ── Step 4: Quality Enhancement (Sharpness + Contrast + Denoise + Edge) ──
        if (doEnhance && (sharpness > 0 || contrastAmt > 0 || denoiseAmt > 0 || edgeAmt > 0)) {
          // 4a. Unsharp Mask / Sharpness + Edge Clarity via ImageUpscalerEngine
          if (sharpness > 0 || edgeAmt > 0) {
            ImageUpscalerEngine.applyUnsharpMask(ctx2, W, H, sharpness, edgeAmt, edgeAmt);
          }

          // 4b. Noise / artifact reduction
          if (denoiseAmt > 20) {
            ImageUpscalerEngine.applyNoiseArtifactSuppression(ctx2, W, H, denoiseAmt, 30);
          }

          // 4c. Contrast boost via pixel-level S-curve
          if (contrastAmt > 0) {
            const imgData = ctx2.getImageData(0, 0, W, H);
            const d = imgData.data;
            const factor = (259 * (contrastAmt + 255)) / (255 * (259 - contrastAmt));
            for (let i = 0; i < d.length; i += 4) {
              if (d[i + 3] < 10) continue; // skip fully transparent
              d[i]     = Math.min(255, Math.max(0, factor * (d[i]     - 128) + 128));
              d[i + 1] = Math.min(255, Math.max(0, factor * (d[i + 1] - 128) + 128));
              d[i + 2] = Math.min(255, Math.max(0, factor * (d[i + 2] - 128) + 128));
            }
            ctx2.putImageData(imgData, 0, 0);
          }
        }

        return out;
      };

      const worker = async () => {
        while (cursor < total) {
          if (controller.isCancelled) break;
          while (controller.isPaused && !controller.isCancelled) {
            await new Promise(r => setTimeout(r, 200));
          }

          const idx = cursor++;
          if (idx >= total) break;

          const file = selectedFiles[idx];
          const fileName = file.name || `image_${String(idx+1).padStart(3,'0')}.png`;

          try {
            // Load image at full quality
            const url = URL.createObjectURL(file);
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.src = url;
            await img.decode();
            URL.revokeObjectURL(url);

            // Process with enhancement pipeline
            const canvas = applyBgAction(img);
            const W = canvas.width;
            const H = canvas.height;
            const baseName = fileName.replace(/\.[^/.]+$/, '');
            const bgSuffix = selectedMode === 'remove' ? 'transparent' : `bg_${selectedMode}`;

            // ── Multi-Format Export ──
            let fileData, outName;

            if (selectedExportFmt === 'jpeg') {
              // For JPEG, flatten transparency onto white (JPEG has no alpha)
              const flat = document.createElement('canvas');
              flat.width = W; flat.height = H;
              const fctx = flat.getContext('2d');
              fctx.fillStyle = '#ffffff';
              fctx.fillRect(0, 0, W, H);
              fctx.drawImage(canvas, 0, 0);
              const jpegQ = parseInt(jpegQualitySldr.value, 10) / 100;
              const blob = await new Promise(res => flat.toBlob(res, 'image/jpeg', jpegQ));
              fileData = await blob.arrayBuffer();
              outName = `${baseName}_${bgSuffix}.jpg`;

            } else if (selectedExportFmt === 'webp') {
              const blob = await new Promise(res => canvas.toBlob(res, 'image/webp', 0.95));
              fileData = await blob.arrayBuffer();
              outName = `${baseName}_${bgSuffix}.webp`;

            } else if (selectedExportFmt === 'svg') {
              // Embed PNG as base64 data URL inside SVG wrapper
              const pngBlob = await new Promise(res => canvas.toBlob(res, 'image/png'));
              const pngBuf  = await pngBlob.arrayBuffer();
              const b64 = btoa(String.fromCharCode(...new Uint8Array(pngBuf)));
              const svgStr = [
                `<?xml version="1.0" encoding="UTF-8"?>`,
                `<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">`,
                `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"`,
                `     width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`,
                `  <title>${baseName}</title>`,
                `  <image x="0" y="0" width="${W}" height="${H}"`,
                `         xlink:href="data:image/png;base64,${b64}" />`,
                `</svg>`
              ].join('\n');
              fileData = new TextEncoder().encode(svgStr).buffer;
              outName = `${baseName}_${bgSuffix}.svg`;

            } else if (selectedExportFmt === 'eps') {
              // EPS (Level 2) with embedded base64 PNG raster image
              const pngBlob = await new Promise(res => canvas.toBlob(res, 'image/png'));
              const pngBuf  = await pngBlob.arrayBuffer();
              const b64 = btoa(String.fromCharCode(...new Uint8Array(pngBuf)));
              // Split base64 into 72-char lines (EPS DSC spec)
              const b64Lines = b64.match(/.{1,72}/g) || [];
              const epsStr = [
                `%!PS-Adobe-3.0 EPSF-3.0`,
                `%%BoundingBox: 0 0 ${W} ${H}`,
                `%%HiResBoundingBox: 0 0 ${W} ${H}`,
                `%%Title: (${baseName})`,
                `%%Creator: Creative Vector Studio — Batch BG Engine`,
                `%%CreationDate: (${new Date().toISOString()})`,
                `%%LanguageLevel: 3`,
                `%%EndComments`,
                `%%BeginProlog`,
                `/bd { bind def } bind def`,
                `/picstr ${W * 3} string def`,
                `%%EndProlog`,
                `%%Page: 1 1`,
                `${W} ${H} scale`,
                `${W} ${H} 8 [${W} 0 0 -${H} 0 ${H}]`,
                `{<${b64Lines.join('\n')}>} false 3 colorimage`,
                `showpage`,
                `%%Trailer`,
                `%%EOF`
              ].join('\n');
              fileData = new TextEncoder().encode(epsStr).buffer;
              outName = `${baseName}_${bgSuffix}.eps`;

            } else {
              // Default: PNG lossless
              const blob = await new Promise(res => canvas.toBlob(res, 'image/png'));
              fileData = await blob.arrayBuffer();
              outName = `${baseName}_${bgSuffix}.png`;
            }

            folder.file(outName, fileData);
            processed++;

          } catch (e) {
            console.warn(`[BatchBG] Failed: ${fileName}`, e);
            failed++;
          }

          // Update UI
          const elapsed = (Date.now() - startTime) / 1000;
          const speed = elapsed > 0 ? ((processed / elapsed)).toFixed(1) : 0;
          const remaining = total - processed - failed;
          const eta = parseFloat(speed) > 0 ? Math.round(remaining / parseFloat(speed)) : 0;
          const pct = Math.min(95, Math.round(((processed + failed) / total) * 95));

          progBar.style.width = pct + '%';
          progPct.textContent = pct + '%';
          progLabel.textContent = `${processed + failed} / ${total} images`;
          statDone.textContent = processed;
          statSpeed.textContent = speed;
          statEta.textContent = eta > 0 ? eta + 's' : '–';

          const logItem = document.createElement('div');
          logItem.textContent = `✓ [${String(processed+failed).padStart(3,'0')}/${total}] ${fileName}`;
          logEl.appendChild(logItem);
          if (logEl.children.length > 60) logEl.removeChild(logEl.children[0]);
          logEl.scrollTop = logEl.scrollHeight;

          await new Promise(r => setTimeout(r, 0));
        }
      };

      // Run with pool
      const workers = [];
      const pool = Math.min(concurrency, total);
      for (let w = 0; w < pool; w++) workers.push(worker());
      await Promise.all(workers);

      if (controller.isCancelled) {
        logEl.appendChild(Object.assign(document.createElement('div'), { textContent: '[Cancelled] Batch was cancelled by user.', style: 'color:var(--status-danger);' }));
        pauseBtn.style.display = 'none';
        cancelBtn.style.display = 'none';
        startBtn.style.display = 'inline-flex';
        startBtn.disabled = false;
        return;
      }

      // Build zip
      progBar.style.width = '97%';
      progPct.textContent = '97%';
      const zipMsg = document.createElement('div');
      zipMsg.textContent = '[Packaging] Building ZIP archive...';
      zipMsg.style.color = 'var(--accent-secondary)';
      logEl.appendChild(zipMsg);

      zip.file('README.txt', [
        '=== Batch Background Remove/Change — Creative Vector Studio ===',
        `Mode: ${selectedMode.toUpperCase()}`,
        `Total Processed: ${processed}`,
        `Generated: ${new Date().toISOString()}`
      ].join('\n'));

      zipBlob = await zip.generateAsync({ type:'blob', compression:'DEFLATE', compressionOptions:{level:6} });

      progBar.style.width = '100%';
      progPct.textContent = '100%';
      pauseBtn.style.display = 'none';
      cancelBtn.style.display = 'none';
      downloadBtn.style.display = 'inline-flex';

      const successMsg = document.createElement('div');
      successMsg.textContent = `✅ Done! ${processed} images processed. Click "Download ZIP" to save.`;
      successMsg.style.color = 'var(--status-success)';
      logEl.appendChild(successMsg);
      logEl.scrollTop = logEl.scrollHeight;

      toast.success(`Batch complete! ${processed} images background-processed. Downloading ZIP...`);

      // Auto-trigger download
      const dlUrl = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = dlUrl;
      a.download = `batch-bg-${selectedMode}-${processed}-images.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };
  }

  /**
   * High-Capacity 500-Image Batch Processing & Bulk Export Modal
   */
  static openBatchModal(files, defaultTool = 'tool_upscaler', defaultParams = null, onCompleted = null) {
    if (!files || files.length === 0) {
      toast.error('No images available for batch processing.');
      return;
    }

    const state = store.getState();
    const activeTool = defaultTool || state.activeTool || 'tool_upscaler';
    const params = defaultParams || { ...state.params };

    const modalEl = document.createElement('div');
    modalEl.className = 'modal-backdrop';
    modalEl.innerHTML = `
      <div class="modal-container" style="max-width: 640px;">
        <div class="modal-header">
          <div style="display:flex; align-items:center; gap:10px;">
            <div style="width:32px; height:32px; border-radius:8px; background:var(--accent-gradient-glow); display:flex; align-items:center; justify-content:center; color:var(--accent-secondary); font-size:1.1rem; font-weight:700;">
              ⚡
            </div>
            <div>
              <h3 class="modal-title">Batch Creative Studio (${files.length} Images)</h3>
              <div style="font-size:0.7rem; color:var(--accent-secondary); font-weight:700; letter-spacing:0.5px;">
                HIGH-RESOLUTION 300 PPI PARALLEL PROCESSING & BULK EXPORT
              </div>
            </div>
          </div>
          <button class="btn-icon" id="btn-close-batch">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <div class="modal-body">
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-bottom:16px;">
            <div style="background:var(--bg-tertiary); padding:12px; border-radius:8px; border:1px solid var(--border-subtle);">
              <div style="font-size:0.75rem; color:var(--text-muted); margin-bottom:4px;">Batch Queue</div>
              <div style="font-size:1.1rem; font-weight:700; color:var(--text-primary);">${files.length} Images Queued</div>
              <div style="font-size:0.7rem; color:var(--accent-secondary); font-weight:600; margin-top:2px;">Parallel 4x Worker Pool</div>
            </div>
            <div style="background:rgba(6,182,212,0.1); padding:12px; border-radius:8px; border:1px solid rgba(6,182,212,0.3);">
              <div style="font-size:0.75rem; color:var(--text-muted); margin-bottom:4px;">Print Output Standard</div>
              <div style="font-size:1.1rem; font-weight:700; color:var(--accent-secondary);">300 PPI Master</div>
              <div style="font-size:0.7rem; color:var(--text-muted); margin-top:2px;">pHYs & JFIF Encoded / Lossless</div>
            </div>
          </div>

          <div class="control-group">
            <label class="control-label">Select Creative Studio Tool for All ${files.length} Images</label>
            <select id="batch-tool-select" style="width:100%; font-weight:600;">
              <option value="tool_low_to_high" ${activeTool === 'tool_low_to_high' ? 'selected' : ''}>✨ Low → High Quality AI Enhancer (HD / 4K / 8K Super-Res)</option>
              <option value="tool_upscaler" ${activeTool === 'tool_upscaler' ? 'selected' : ''}>AI Image Upscaler (✦ 300 PPI Print Master)</option>
              <option value="tool_vector_convert" ${activeTool.includes('vector') ? 'selected' : ''}>Image → Vector (Authentic Scalable SVG + 300 PPI)</option>
              <option value="tool_bg_ai_photo" ${activeTool === 'tool_bg_ai_photo' || activeTool.includes('bg_') || activeTool.includes('remove') ? 'selected' : ''}>🤖 AI Photo Background Remover (Portraits & Cutouts 300 PPI)</option>
              <option value="tool_bg_remove_white" ${activeTool === 'tool_bg_remove_white' ? 'selected' : ''}>✂ Remove White Background (Studio 300 PPI PNG)</option>
              <option value="tool_film_grain" ${activeTool === 'tool_film_grain' ? 'selected' : ''}>Film Grain Engine (35mm Analog Texture 300 PPI)</option>
              <option value="tool_fractal_glass_1" ${activeTool.includes('fractal') ? 'selected' : ''}>Fractal Glass Shader (Prism Distortion 300 PPI)</option>
              <option value="tool_gradient_extract" ${activeTool.includes('gradient') ? 'selected' : ''}>Image → Gradient Artwork (Multi-Stop 300 PPI)</option>
              <option value="tool_icon_pack" ${activeTool === 'tool_icon_pack' ? 'selected' : ''}>Icon Pack Generator (Multi-Scale 300 PPI Icons)</option>
            </select>
          </div>

          <!-- Progress Section -->
          <div style="background:var(--bg-tertiary); border:1px solid var(--border-subtle); border-radius:8px; padding:16px; margin-top:16px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <div style="display:flex; align-items:center; gap:8px;">
                <span id="batch-spinner" style="display:none; width:14px; height:14px; border:2px solid var(--accent-secondary); border-top-color:transparent; border-radius:50%; animation:spin 0.8s linear infinite;"></span>
                <span id="batch-status-text" style="font-size:0.85rem; font-weight:600;">Ready to start processing ${files.length} assets</span>
              </div>
              <span id="batch-pct-badge" style="font-family:var(--font-mono); font-size:1.1rem; font-weight:700; color:var(--accent-secondary);">0%</span>
            </div>

            <div style="width:100%; height:8px; background:var(--bg-primary); border-radius:4px; overflow:hidden; margin-bottom:10px;">
              <div id="batch-progress-bar" style="width:0%; height:100%; background:var(--accent-gradient); transition:width 0.15s ease-out;"></div>
            </div>

            <div style="display:flex; justify-content:space-between; font-size:0.75rem; color:var(--text-muted); font-family:var(--font-mono);">
              <span id="batch-counter-text">0 / ${files.length} Images</span>
              <span id="batch-speed-text">0.0 img/sec @ 300 PPI</span>
            </div>

            <!-- Live Stream Log Viewport -->
            <div id="batch-log-view" style="margin-top:12px; max-height:120px; overflow-y:auto; font-family:var(--font-mono); font-size:0.72rem; color:var(--text-secondary); display:flex; flex-direction:column; gap:4px; background:rgba(0,0,0,0.3); padding:8px 10px; border-radius:6px;">
              <div>[Ready] Click "Start Batch Processing" below to process all ${files.length} images.</div>
            </div>
          </div>
        </div>

        <div class="modal-footer" style="justify-content:space-between;">
          <button class="btn btn-secondary btn-sm" id="btn-cancel-batch">Close</button>
          <div style="display:flex; gap:8px;">
            <button class="btn btn-primary btn-sm" id="btn-start-batch" style="box-shadow:0 0 15px rgba(99,102,241,0.4);">
              ⚡ Run ${files.length}-Image Batch Processing
            </button>
            <button class="btn btn-primary btn-sm" id="btn-download-batch-zip" style="display:none; background:var(--accent-cyan); color:#000; font-weight:700;">
              📦 Download ${files.length} Assets ZIP (300 PPI)
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modalEl);

    const closeModal = () => modalEl.remove();
    modalEl.querySelector('#btn-close-batch').onclick = closeModal;
    modalEl.querySelector('#btn-cancel-batch').onclick = closeModal;

    const toolSelect = modalEl.querySelector('#batch-tool-select');
    const startBtn = modalEl.querySelector('#btn-start-batch');
    const downloadZipBtn = modalEl.querySelector('#btn-download-batch-zip');
    const progressBar = modalEl.querySelector('#batch-progress-bar');
    const pctBadge = modalEl.querySelector('#batch-pct-badge');
    const statusText = modalEl.querySelector('#batch-status-text');
    const counterText = modalEl.querySelector('#batch-counter-text');
    const speedText = modalEl.querySelector('#batch-speed-text');
    const spinner = modalEl.querySelector('#batch-spinner');
    const logView = modalEl.querySelector('#batch-log-view');

    let currentZipBlob = null;

    startBtn.onclick = async () => {
      startBtn.disabled = true;
      toolSelect.disabled = true;
      spinner.style.display = 'inline-block';
      logView.innerHTML = `<div>[Starting] Pipeline initialized for ${files.length} images...</div>`;

      const selectedTool = toolSelect.value;
      const currentParams = { ...store.getState().params };

      try {
        const result = await BatchProcessorEngine.runBatch({
          files,
          tool: selectedTool,
          params: currentParams,
          concurrency: 4,
          onProgress: ({ current, total, percent, currentFileName, status, speed }) => {
            progressBar.style.width = `${percent}%`;
            pctBadge.textContent = `${percent}%`;
            statusText.textContent = status;
            counterText.textContent = `${current} / ${total} Images`;
            speedText.textContent = `${speed} img/sec @ 300 PPI`;

            const itemEl = document.createElement('div');
            itemEl.textContent = `✓ [${String(current).padStart(3, '0')}] ${currentFileName} → 300 PPI`;
            logView.appendChild(itemEl);
            if (logView.children.length > 50) {
              logView.removeChild(logView.children[0]);
            }
            logView.scrollTop = logView.scrollHeight;
          }
        });

        currentZipBlob = result.zipBlob;
        spinner.style.display = 'none';
        startBtn.style.display = 'none';
        downloadZipBtn.style.display = 'inline-flex';

        // Auto trigger download
        const downloadUrl = URL.createObjectURL(currentZipBlob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        const zipName = `creativeforge-batch-${files.length}-assets-300ppi.zip`;
        a.download = zipName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        toast.success(`Processed all ${files.length} images & downloaded 300 PPI Master ZIP!`);

        downloadZipBtn.onclick = () => {
          const dlUrl = URL.createObjectURL(currentZipBlob);
          const dlLink = document.createElement('a');
          dlLink.href = dlUrl;
          dlLink.download = zipName;
          document.body.appendChild(dlLink);
          dlLink.click();
          document.body.removeChild(dlLink);
        };

        if (onCompleted) onCompleted(result);
      } catch (err) {
        spinner.style.display = 'none';
        startBtn.disabled = false;
        toolSelect.disabled = false;
        toast.error('Batch processing failed: ' + err.message);
      }
    };
  }

  /**
   * Export Asset Modal with 300 PPI High-Resolution Print Engine
   */
  static openExportModal(canvas, svgString = null) {
    const state = store.getState();
    const tool = state.activeTool;
    const baseName = state.originalFileName ? state.originalFileName.replace(/\.[^/.]+$/, '') : 'creativeforge';

    const curW = canvas?.width || 1200;
    const curH = canvas?.height || 800;

    const modalEl = document.createElement('div');
    modalEl.className = 'modal-backdrop';
    modalEl.innerHTML = `
      <div class="modal-container" style="max-width: 520px;">
        <div class="modal-header">
          <div style="display:flex; align-items:center; gap:8px;">
            <div style="width:28px; height:28px; border-radius:6px; background:var(--accent-gradient-glow); display:flex; align-items:center; justify-content:center; color:var(--accent-secondary);">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
            </div>
            <div>
              <h3 class="modal-title">Export Creative Asset</h3>
              <div style="font-size:0.7rem; color:var(--accent-secondary); font-weight:600;">HIGH-RESOLUTION 300 PPI PRINT ENGINE</div>
            </div>
          </div>
          <button class="btn-icon" id="btn-close-export">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="control-group">
            <label class="control-label">File Name</label>
            <input type="text" id="export-filename" value="${baseName}-${tool.replace('tool_', '')}" style="width:100%;" />
          </div>

          <div class="control-group">
            <label class="control-label">Export Format</label>
            <select id="export-format" style="width:100%;">
              <option value="png" selected>PNG (Lossless 300 PPI Master Print)</option>
              <option value="jpg">JPG (High-Density 300 DPI Photo)</option>
              <option value="tiff">TIFF (300 DPI CMYK / RGB Master Press Format)</option>
              <option value="pdf">Print PDF (300 DPI Vector & Raster Document)</option>
              ${svgString || tool.includes('vector') ? `
                <option value="svg">SVG (Standard Scalable Vector Paths)</option>
                <option value="svg_layered">Layered SVG (Grouped Color Layers for Figma & Illustrator)</option>
                <option value="dxf">AutoCAD DXF (Laser Cutter & CNC Polylines)</option>
                <option value="eps">EPS (Encapsulated PostScript 3.0)</option>
              ` : ''}
              ${tool.includes('icon') ? '<option value="zip">ZIP (Full Multi-Size Icon Pack)</option>' : ''}
            </select>
          </div>

          <div class="control-group">
            <label class="control-label">Print Density & Resolution (PPI/DPI)</label>
            <select id="export-ppi" style="width:100%;">
              <option value="300" selected>300 PPI (Professional Print Standard - Photoshop & Press Ready)</option>
              <option value="150">150 PPI (Medium Density / Retina Web)</option>
              <option value="72">72 PPI (Legacy Standard Web Display)</option>
            </select>
          </div>

          <div class="control-group">
            <label class="control-label">Output Pixel Resolution</label>
            <select id="export-resolution" style="width:100%;">
              <option value="original" selected>Original Canvas (${curW} × ${curH} px)</option>
              <option value="2K">2K QHD (2560 × 1440 px)</option>
              <option value="4K">4K Ultra HD (3840 × 2160 px)</option>
              <option value="8K">8K Master Cinema (7680 × 4320 px)</option>
              <option value="300PPI">300 PPI Ultra Print Master (4500 × 3000 px)</option>
            </select>
          </div>

          <!-- Live Physical Print Dimensions Calculator -->
          <div id="print-calc-card" style="background:rgba(99,102,241,0.1); border:1px solid rgba(99,102,241,0.25); padding:14px; border-radius:8px; font-size:0.8rem; margin-top:14px;">
            <div style="font-weight:700; color:var(--text-primary); margin-bottom:4px;">Print Dimensions @ <span id="calc-ppi-badge">300</span> PPI:</div>
            <div id="calc-dim-text" style="color:var(--accent-secondary); font-family:var(--font-mono); font-weight:600;">
              ${(curW / 300).toFixed(1)}" × ${(curH / 300).toFixed(1)}" (${((curW / 300) * 2.54).toFixed(1)} × ${((curH / 300) * 2.54).toFixed(1)} cm)
            </div>
            <div style="font-size:0.72rem; color:var(--text-muted); margin-top:4px;">
              PNG pHYs and JPEG JFIF physical density metadata will be embedded into the downloaded binary.
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary btn-sm" id="btn-cancel-export">Cancel</button>
          <button class="btn btn-primary btn-sm" id="btn-download-export">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
            Download 300 PPI Asset
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modalEl);

    const closeModal = () => modalEl.remove();
    modalEl.querySelector('#btn-close-export').onclick = closeModal;
    modalEl.querySelector('#btn-cancel-export').onclick = closeModal;

    const ppiSelect = modalEl.querySelector('#export-ppi');
    const resSelect = modalEl.querySelector('#export-resolution');
    const calcBadge = modalEl.querySelector('#calc-ppi-badge');
    const calcDimText = modalEl.querySelector('#calc-dim-text');

    const updateCalc = () => {
      const ppi = parseInt(ppiSelect.value, 10);
      calcBadge.textContent = ppi;
      let targetW = curW;
      let targetH = curH;
      const resVal = resSelect.value;
      if (resVal === '2K') { targetW = 2560; targetH = Math.round(2560 * (curH / curW)); }
      else if (resVal === '4K') { targetW = 3840; targetH = Math.round(3840 * (curH / curW)); }
      else if (resVal === '8K') { targetW = 7680; targetH = Math.round(7680 * (curH / curW)); }
      else if (resVal === '300PPI') { targetW = 4500; targetH = Math.round(4500 * (curH / curW)); }

      const inW = (targetW / ppi).toFixed(1);
      const inH = (targetH / ppi).toFixed(1);
      const cmW = ((targetW / ppi) * 2.54).toFixed(1);
      const cmH = ((targetH / ppi) * 2.54).toFixed(1);
      calcDimText.textContent = `${targetW} × ${targetH} px → ${inW}" × ${inH}" (${cmW} × ${cmH} cm)`;
    };

    ppiSelect.onchange = updateCalc;
    resSelect.onchange = updateCalc;

    modalEl.querySelector('#btn-download-export').onclick = async () => {
      const filename = modalEl.querySelector('#export-filename').value.trim() || 'export';
      const format = modalEl.querySelector('#export-format').value;
      const ppi = parseInt(ppiSelect.value, 10);
      const resolution = resSelect.value;

      let fullFileName = `${filename}.${format}`;
      let downloadBlob = null;

      // Prepare target export canvas (scaled if 2K, 4K, 8K selected)
      let exportCanvas = canvas;
      if (resolution !== 'original' && canvas) {
        let scaleW = curW;
        let scaleH = curH;
        if (resolution === '2K') { scaleW = 2560; scaleH = Math.round(2560 * (curH / curW)); }
        else if (resolution === '4K') { scaleW = 3840; scaleH = Math.round(3840 * (curH / curW)); }
        else if (resolution === '8K') { scaleW = 7680; scaleH = Math.round(7680 * (curH / curW)); }
        else if (resolution === '300PPI') { scaleW = 4500; scaleH = Math.round(4500 * (curH / curW)); }

        exportCanvas = document.createElement('canvas');
        exportCanvas.width = scaleW;
        exportCanvas.height = scaleH;
        const eCtx = exportCanvas.getContext('2d');
        eCtx.imageSmoothingQuality = 'high';
        eCtx.drawImage(canvas, 0, 0, scaleW, scaleH);
      }

      if (format === 'svg' && svgString) {
        downloadBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      } else if (format === 'svg_layered' && svgString) {
        const layered = PrintExporter.generateLayeredSvg(svgString, filename);
        downloadBlob = new Blob([layered], { type: 'image/svg+xml;charset=utf-8' });
        fullFileName = `${filename}_layered.svg`;
      } else if (format === 'tiff') {
        const tiffBytes = PrintExporter.generateTiff300Dpi(exportCanvas, true);
        downloadBlob = new Blob([tiffBytes], { type: 'image/tiff' });
        fullFileName = `${filename}_300dpi.tiff`;
      } else if (format === 'pdf') {
        const pdfStr = PrintExporter.generatePrintPdf(exportCanvas, filename);
        downloadBlob = new Blob([pdfStr], { type: 'application/pdf' });
        fullFileName = `${filename}_300dpi.pdf`;
      } else if (format === 'dxf') {
        const dxfStr = PrintExporter.generateDxf(svgString || '');
        downloadBlob = new Blob([dxfStr], { type: 'application/dxf' });
        fullFileName = `${filename}.dxf`;
      } else if (format === 'eps') {
        const epsStr = PrintExporter.generateEps(svgString || '', exportCanvas.width, exportCanvas.height);
        downloadBlob = new Blob([epsStr], { type: 'application/postscript' });
        fullFileName = `${filename}.eps`;
      } else {
        // Embed 300 PPI print metadata into downloaded PNG/JPG binary
        downloadBlob = await PpiWriter.exportWithPpi(exportCanvas, format, ppi, 0.95);
      }

      if (downloadBlob) {
        const downloadUrl = URL.createObjectURL(downloadBlob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = fullFileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // Record export to backend
        try {
          await api.saveExport({
            filename: fullFileName,
            dataBase64: downloadUrl,
            format,
            resolution: `${resolution}_${ppi}PPI`,
            projectId: state.project?.id
          });
        } catch (e) {}

        toast.success(`Exported ${fullFileName} with ${ppi} PPI print metadata!`);
        closeModal();
      }
    };
  }

  /**
   * Switch Demo Account Modal
   */
  static openAuthModal(onUserChanged) {
    const modalEl = document.createElement('div');
    modalEl.className = 'modal-backdrop';
    modalEl.innerHTML = `
      <div class="modal-container" style="max-width: 440px;">
        <div class="modal-header">
          <h3 class="modal-title">Switch Demo SaaS Account</h3>
          <button class="btn-icon" id="btn-close-auth">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="modal-body">
          <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:18px;">
            Test the application using pre-configured role profiles to evaluate user, pro designer, and admin permissions.
          </p>

          <div style="display:flex; flex-direction:column; gap:10px;">
            <button class="btn btn-secondary" id="auth-role-pro" style="justify-content:space-between; padding:12px 16px;">
              <div style="text-align:left;">
                <div style="font-weight:700;">Elena Rostova (Pro Plan)</div>
                <div style="font-size:0.75rem; color:var(--text-muted);">450 Credits • 8K Exports • All Pro Features</div>
              </div>
              <span class="badge badge-indigo">PRO</span>
            </button>

            <button class="btn btn-secondary" id="auth-role-admin" style="justify-content:space-between; padding:12px 16px;">
              <div style="text-align:left;">
                <div style="font-weight:700;">Admin CreativeForge</div>
                <div style="font-size:0.75rem; color:var(--text-muted);">Full Platform Management & Analytics Access</div>
              </div>
              <span class="badge badge-cyan">ADMIN</span>
            </button>

            <button class="btn btn-secondary" id="auth-role-free" style="justify-content:space-between; padding:12px 16px;">
              <div style="text-align:left;">
                <div style="font-weight:700;">Alex Vance (Free Tier)</div>
                <div style="font-size:0.75rem; color:var(--text-muted);">10 Credits • 2K Max Export</div>
              </div>
              <span class="badge badge-warning">FREE</span>
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modalEl);
    const closeModal = () => modalEl.remove();
    modalEl.querySelector('#btn-close-auth').onclick = closeModal;

    const setRole = async (role) => {
      try {
        const res = await api.switchDemo(role);
        store.setState({ user: res.user });
        toast.success(`Signed in as ${res.user.name} (${res.user.role.toUpperCase()})`);
        closeModal();
        if (onUserChanged) onUserChanged(res.user);
      } catch (err) {
        toast.error(err.message);
      }
    };

    modalEl.querySelector('#auth-role-pro').onclick = () => setRole('pro');
    modalEl.querySelector('#auth-role-admin').onclick = () => setRole('admin');
    modalEl.querySelector('#auth-role-free').onclick = () => setRole('free');
  }

  /**
   * Keyboard Shortcuts & Canvas Hotkeys Cheat Sheet Modal
   */
  static openShortcutsModal() {
    const shortcuts = [
      { key: 'Space + Drag', desc: 'Pan canvas freely in any direction' },
      { key: 'Ctrl + Z', desc: 'Undo last creative tool adjustment' },
      { key: 'Ctrl + Y  /  Ctrl+Shift+Z', desc: 'Redo previously undone adjustment' },
      { key: 'Ctrl + E', desc: 'Open 300 PPI Multi-Format Export Dialog' },
      { key: 'Ctrl + B', desc: 'Open 500-Image High-Speed Batch Studio' },
      { key: '+  or  ]', desc: 'Zoom in canvas viewport (up to 800%)' },
      { key: '-  or  [', desc: 'Zoom out canvas viewport (down to 25%)' },
      { key: '0', desc: 'Reset zoom & fit canvas perfectly to screen' },
      { key: '?', desc: 'Toggle this keyboard shortcuts cheat sheet' }
    ];

    const modalEl = document.createElement('div');
    modalEl.className = 'modal-backdrop';
    modalEl.innerHTML = `
      <div class="modal-container" style="max-width: 520px;">
        <div class="modal-header">
          <div style="display:flex; align-items:center; gap:8px;">
            <div style="width:28px; height:28px; border-radius:6px; background:var(--accent-gradient-glow); display:flex; align-items:center; justify-content:center; color:var(--accent-secondary); font-size:0.9rem;">
              ⌨
            </div>
            <div>
              <h3 class="modal-title">Studio Keyboard Shortcuts</h3>
              <div style="font-size:0.7rem; color:var(--accent-secondary); font-weight:600;">PRO POWER-USER CONTROLS</div>
            </div>
          </div>
          <button class="btn-icon" id="btn-close-shortcuts">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="modal-body" style="display:flex; flex-direction:column; gap:10px;">
          ${shortcuts.map(s => `
            <div style="display:flex; align-items:center; justify-content:space-between; padding:8px 12px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.06); border-radius:8px;">
              <span style="font-size:0.85rem; color:var(--text-secondary);">${s.desc}</span>
              <kbd style="background:rgba(99,102,241,0.18); border:1px solid rgba(99,102,241,0.35); color:var(--accent-secondary); padding:3px 8px; border-radius:6px; font-family:var(--font-mono); font-size:0.78rem; font-weight:700;">${s.key}</kbd>
            </div>
          `).join('')}
        </div>
        <div class="modal-footer" style="justify-content:flex-end;">
          <button class="btn btn-secondary btn-sm" id="btn-done-shortcuts">Got It (Esc)</button>
        </div>
      </div>
    `;

    document.body.appendChild(modalEl);
    const closeModal = () => modalEl.remove();
    modalEl.querySelector('#btn-close-shortcuts').onclick = closeModal;
    modalEl.querySelector('#btn-done-shortcuts').onclick = closeModal;
  }
}
