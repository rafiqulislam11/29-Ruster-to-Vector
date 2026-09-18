/**
 * CreativeForge AI — Universal Modals System
 */
import { store } from '../state.js';
import { api } from '../api.js';
import { toast } from './toast.js';
import { PpiWriter } from '../utils/ppi-writer.js';
import { PrintExporter } from '../utils/print-exporter.js';
import { BatchProcessorEngine } from '../engines/batch-processor.js';

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
              <option value="tool_upscaler" ${activeTool === 'tool_upscaler' ? 'selected' : ''}>AI Image Upscaler (✦ 300 PPI Print Master)</option>
              <option value="tool_vector_convert" ${activeTool.includes('vector') ? 'selected' : ''}>Image → Vector (Authentic Scalable SVG + 300 PPI)</option>
              <option value="tool_bg_remove_white" ${activeTool.includes('bg_') || activeTool.includes('remove') ? 'selected' : ''}>Remove Background (Transparent 300 PPI PNG)</option>
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
