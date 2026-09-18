/**
 * CreativeForge AI — High-Performance Batch Processing & Bulk Export Engine
 * Handles up to 500+ images in parallel with non-blocking concurrency,
 * authentic 300 PPI print metadata injection, and streaming ZIP generation.
 */
import JSZip from 'jszip';
import { VectorTracer } from './vector-tracer.js';
import { ImageUpscalerEngine } from './upscaler.js';
import { BackgroundRemovalEngine } from './bg-removal.js';
import { FractalGlassEngine } from './fractal-glass.js';
import { FilmGrainEngine } from './film-grain.js';
import { GradientEngine } from './gradient-engine.js';
import { IconSheetEngine } from './icon-sheet.js';
import { IconPackEngine } from './icon-pack.js';
import { PpiWriter } from '../utils/ppi-writer.js';
import { PrintExporter } from '../utils/print-exporter.js';

export class BatchProcessorEngine {
  /**
   * Process a single file or image element with the specified tool
   */
  static async processSingleAsset(fileOrImg, tool, params) {
    let img;
    let fileName = 'asset';

    if (fileOrImg instanceof File || fileOrImg instanceof Blob) {
      fileName = fileOrImg.name || 'image';
      const objectUrl = URL.createObjectURL(fileOrImg);
      img = new Image();
      img.src = objectUrl;
      await img.decode();
      URL.revokeObjectURL(objectUrl);
    } else if (fileOrImg instanceof HTMLImageElement) {
      img = fileOrImg;
      fileName = img.getAttribute('data-name') || 'image';
    } else {
      throw new Error('Unsupported asset format for batch processing');
    }

    const baseName = fileName.replace(/\.[^/.]+$/, '');
    let outCanvas = null;
    let outSvg = null;

    // Route to appropriate creative engine
    if (tool === 'tool_vector_convert' || tool === 'tool_vector_trace') {
      const vecRes = await VectorTracer.trace(img, {
        colors: params.vectorColors || 8,
        detail: params.vectorDetail || 60,
        smoothness: params.vectorSmoothness || 60,
        removeWhiteBg: params.vectorRemoveWhite !== false
      });
      outSvg = vecRes.svgString;

      outCanvas = document.createElement('canvas');
      outCanvas.width = vecRes.width;
      outCanvas.height = vecRes.height;
      const ctx = outCanvas.getContext('2d');
      const vImg = new Image();
      const svgBlob = new Blob([outSvg], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);
      vImg.src = svgUrl;
      await vImg.decode();
      ctx.drawImage(vImg, 0, 0);
      URL.revokeObjectURL(svgUrl);

    } else if (tool === 'tool_upscaler') {
      outCanvas = ImageUpscalerEngine.process(img, params.upscaleResolution || '300PPI', {
        sharpness: params.upscaleSharpness || 75,
        detailEnhancement: params.upscaleDetail || 60,
        noiseReduction: params.upscaleNoiseReduction || 30
      });

    } else if (tool.includes('remove') || tool.includes('transparent')) {
      outCanvas = BackgroundRemovalEngine.process(img, {
        tolerance: params.bgTolerance || 25,
        feather: params.bgFeather || 2,
        shadowPreservation: params.bgShadowPreserve !== false
      });

    } else if (tool.startsWith('tool_fractal_glass')) {
      const presetKey = tool.replace('tool_fractal_glass_', '').replace('_', '.');
      let tintRgba = null;
      if (params.glassTint) {
        const hex = params.glassTint;
        const r = parseInt(hex.slice(1, 3), 16) || 99;
        const g = parseInt(hex.slice(3, 5), 16) || 102;
        const b = parseInt(hex.slice(5, 7), 16) || 241;
        tintRgba = `rgba(${r},${g},${b},0.16)`;
      }
      outCanvas = FractalGlassEngine.render(img, presetKey, {
        refraction: params.glassRefraction || 40,
        distortion: params.glassDistortion || 30,
        transparency: params.glassTransparency || 70,
        light: params.glassLight || 50,
        tint: tintRgba
      });

    } else if (tool === 'tool_film_grain') {
      outCanvas = FilmGrainEngine.render(img, params.grainPreset || 'classic', {
        amount: params.grainAmount || 45,
        size: params.grainSize || 2,
        contrast: params.grainContrast || 30
      });

    } else if (tool === 'tool_gradient_extract' || tool.startsWith('tool_gradient_maker')) {
      const isMaker = tool.startsWith('tool_gradient_maker');
      const sys = isMaker ? parseInt(tool.replace('tool_gradient_maker_', ''), 10) : 1;
      outCanvas = GradientEngine.renderGradientCanvas({
        colors: params.gradientColors || ['#6366f1', '#06b6d4', '#ec4899'],
        type: params.gradientType || 'linear',
        angle: params.gradientAngle || 135,
        blur: params.gradientBlur || 0,
        noise: params.makerNoise || 15,
        makerSystem: isMaker ? sys : undefined,
        width: img.naturalWidth || 1200,
        height: img.naturalHeight || 800
      });

    } else if (tool === 'tool_icon_pack') {
      outCanvas = IconPackEngine.applyStyle(img, params.packStyle || 'flat', 512);

    } else if (tool.startsWith('tool_icon_sheet')) {
      const layoutKey = tool.replace('tool_icon_sheet_', '');
      outCanvas = IconSheetEngine.render([img], layoutKey, {
        columns: params.sheetColumns || 4,
        padding: params.sheetPadding || 20,
        showLabels: params.sheetLabels || false
      });

    } else {
      // Fallback
      outCanvas = document.createElement('canvas');
      outCanvas.width = img.naturalWidth || 800;
      outCanvas.height = img.naturalHeight || 600;
      outCanvas.getContext('2d').drawImage(img, 0, 0);
    }

    // Embed authentic 300 PPI print metadata into output PNG
    const ppiBlob = await PpiWriter.exportWithPpi(outCanvas, 'png', 300);

    return {
      baseName,
      pngBlob: ppiBlob,
      svgString: outSvg,
      width: outCanvas.width,
      height: outCanvas.height
    };
  }

  /**
   * Run full batch processing across all items with real-time progress & ZIP packaging
   * @param {Object} options
   * @param {Array<File|Blob>} options.files Array of 1 to 500+ files
   * @param {string} options.tool Selected creative studio tool
   * @param {Object} options.params Tool parameters
   * @param {number} options.concurrency Number of parallel workers (default 4)
   * @param {Function} options.onProgress Progress callback
   * @returns {Promise<{ zipBlob: Blob, total: number, processed: number, failed: number }>}
   */
  static async runBatch({
    files,
    tool,
    params = {},
    concurrency = 4,
    onProgress = () => {}
  }) {
    const total = files.length;
    let processed = 0;
    let failed = 0;
    const startTime = Date.now();

    const zip = new JSZip();
    const imagesFolder = zip.folder('300ppi_images');
    const isVector = tool === 'tool_vector_convert' || tool === 'tool_vector_trace';
    const svgFolder = isVector ? zip.folder('svg_vectors') : null;

    const manifest = {
      generator: 'CreativeForge AI — Batch Studio Engine',
      timestamp: new Date().toISOString(),
      toolApplied: tool,
      resolutionDpi: 300,
      totalFiles: total,
      items: []
    };

    onProgress({
      current: 0,
      total,
      percent: 0,
      currentFileName: 'Starting batch pipeline...',
      status: `Initializing 300 PPI batch engine for ${total} images...`,
      speed: 0
    });

    // Process in non-blocking worker pools
    let cursor = 0;

    const worker = async () => {
      while (cursor < total) {
        const index = cursor++;
        const file = files[index];
        const fileName = file.name || `image_${String(index + 1).padStart(3, '0')}.png`;

        try {
          const res = await this.processSingleAsset(file, tool, params);
          const buf = await res.pngBlob.arrayBuffer();
          const cleanName = `${res.baseName}_${tool.replace('tool_', '')}_300ppi.png`;

          imagesFolder.file(cleanName, buf);

          if (isVector && res.svgString) {
            if (svgFolder) svgFolder.file(`${res.baseName}.svg`, res.svgString);
            const layeredSvg = PrintExporter.generateLayeredSvg(res.svgString, res.baseName);
            zip.folder('layered_svg').file(`${res.baseName}_layered.svg`, layeredSvg);
            const dxf = PrintExporter.generateDxf(res.svgString);
            zip.folder('dxf_cad').file(`${res.baseName}.dxf`, dxf);
          }

          manifest.items.push({
            originalName: fileName,
            outputName: cleanName,
            width: res.width,
            height: res.height,
            ppi: 300,
            hasSvg: !!res.svgString
          });

          processed++;
        } catch (err) {
          console.warn(`[Batch Error on item ${fileName}]:`, err);
          failed++;
        }

        // Calculate progress & metrics
        const elapsedSec = (Date.now() - startTime) / 1000;
        const speed = elapsedSec > 0 ? (processed / elapsedSec).toFixed(1) : 0;
        const percent = Math.min(92, Math.round(((processed + failed) / total) * 92));

        onProgress({
          current: processed + failed,
          total,
          percent,
          currentFileName: fileName,
          status: `Processed ${processed} of ${total} images (${speed} img/sec @ 300 PPI)`,
          speed: parseFloat(speed)
        });

        // Yield execution to allow DOM repainting and keep UI responsive at 60fps
        await new Promise(r => setTimeout(r, 0));
      }
    };

    // Run parallel workers
    const activeWorkers = [];
    const poolSize = Math.min(concurrency, total);
    for (let w = 0; w < poolSize; w++) {
      activeWorkers.push(worker());
    }

    await Promise.all(activeWorkers);

    // Attach batch manifest
    zip.file('batch-manifest.json', JSON.stringify(manifest, null, 2));

    // README info
    zip.file('README.txt', [
      '====================================================',
      'CreativeForge AI — High-Resolution 300 PPI Batch Export',
      '====================================================',
      `Tool Applied: ${tool.replace('tool_', '').toUpperCase()}`,
      `Total Assets Processed: ${processed}`,
      `Print Density: 300 PPI (pHYs standard print calibration embedded)`,
      `Generated: ${new Date().toISOString()}`,
      '====================================================',
      'https://creativeforge.ai'
    ].join('\n'));

    // Zip compression phase
    onProgress({
      current: total,
      total,
      percent: 95,
      currentFileName: 'Packaging ZIP...',
      status: `Packaging all ${processed} assets into 300 PPI master ZIP...`,
      speed: 0
    });

    const zipBlob = await zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 }
    }, (meta) => {
      const zipPct = 95 + Math.round(meta.percent * 0.05);
      onProgress({
        current: total,
        total,
        percent: Math.min(100, zipPct),
        currentFileName: 'Compressing archive...',
        status: `Compressing ZIP archive (${meta.percent.toFixed(0)}%)...`,
        speed: 0
      });
    });

    onProgress({
      current: total,
      total,
      percent: 100,
      currentFileName: 'Complete!',
      status: `Successfully completed ${processed} images @ 300 PPI!`,
      speed: 0
    });

    return {
      zipBlob,
      total,
      processed,
      failed,
      durationMs: Date.now() - startTime
    };
  }
}
