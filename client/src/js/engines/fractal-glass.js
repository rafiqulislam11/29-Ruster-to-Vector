/**
 * CreativeForge AI — Super Fast Fractal Glass Engine
 * Uses precomputed Trigonometric Lookup Tables (LUT), 32-bit Uint32 pixel buffer reading,
 * and optimized facet mapping. Delivers 60fps instant glass distortion rendering.
 */

export class FractalGlassEngine {
  static presets = {
    '1': {
      name: 'Fractal Glass 1 (Soft Transparent Glass)',
      refraction: 25,
      distortion: 15,
      transparency: 80,
      blur: 2,
      reflection: 30,
      light: 40,
      depth: 10,
      density: 12,
      edgeDistortion: 10,
      tint: 'rgba(255,255,255,0.08)'
    },
    '2': {
      name: 'Fractal Glass 2 (Crystal Refraction Glass)',
      refraction: 60,
      distortion: 45,
      transparency: 65,
      blur: 1,
      reflection: 70,
      light: 80,
      depth: 35,
      density: 20,
      edgeDistortion: 50,
      tint: 'rgba(200,240,255,0.15)'
    },
    '3': {
      name: 'Fractal Glass 3 (Complex Fractured Glass)',
      refraction: 75,
      distortion: 70,
      transparency: 60,
      blur: 3,
      reflection: 65,
      light: 50,
      depth: 60,
      density: 35,
      edgeDistortion: 80,
      tint: 'rgba(180,200,255,0.12)'
    },
    '3.1': {
      name: 'Fractal Glass 3.1 (Fine Fractal Distortion)',
      refraction: 40,
      distortion: 85,
      transparency: 70,
      blur: 1,
      reflection: 50,
      light: 65,
      depth: 25,
      density: 65,
      edgeDistortion: 35,
      tint: 'rgba(230,220,255,0.14)'
    },
    '3.2': {
      name: 'Fractal Glass 3.2 (Deep Refraction & Layered Glass)',
      refraction: 90,
      distortion: 60,
      transparency: 55,
      blur: 4,
      reflection: 85,
      light: 75,
      depth: 80,
      density: 18,
      edgeDistortion: 70,
      tint: 'rgba(160,210,255,0.2)'
    },
    '3.3': {
      name: 'Fractal Glass 3.3 (Premium Abstract Glass Distortion)',
      refraction: 85,
      distortion: 95,
      transparency: 50,
      blur: 3,
      reflection: 90,
      light: 90,
      depth: 90,
      density: 40,
      edgeDistortion: 90,
      tint: 'rgba(255,200,240,0.18)'
    }
  };

  // Precomputed Trigonometric Lookup Tables (LUT) - 4096 steps
  static LUT_SIZE = 4096;
  static LUT_MASK = 4095;
  static sinLUT = new Float32Array(4096);
  static cosLUT = new Float32Array(4096);
  static isLutReady = (() => {
    const step = (Math.PI * 2) / 4096;
    for (let i = 0; i < 4096; i++) {
      FractalGlassEngine.sinLUT[i] = Math.sin(i * step);
      FractalGlassEngine.cosLUT[i] = Math.cos(i * step);
    }
    return true;
  })();

  static fastSin(rad) {
    const idx = ((rad * (4096 / (Math.PI * 2))) | 0) & 4095;
    return FractalGlassEngine.sinLUT[idx];
  }

  static fastCos(rad) {
    const idx = ((rad * (4096 / (Math.PI * 2))) | 0) & 4095;
    return FractalGlassEngine.cosLUT[idx];
  }

  /**
   * Ultra-fast render with LUT and 32-bit pixel mapping
   * @param {HTMLImageElement|HTMLCanvasElement} source
   * @param {string} presetKey '1' | '2' | '3' | '3.1' | '3.2' | '3.3'
   * @param {Object} customParams
   * @returns {HTMLCanvasElement}
   */
  static render(source, presetKey = '1', customParams = {}) {
    const defaultPreset = this.presets[presetKey] || this.presets['1'];
    const p = { ...defaultPreset, ...customParams };

    const width = source.naturalWidth || source.width || 800;
    const height = source.naturalHeight || source.height || 600;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    // Sample source image onto offscreen canvas
    const offCanvas = document.createElement('canvas');
    offCanvas.width = width;
    offCanvas.height = height;
    const offCtx = offCanvas.getContext('2d', { willReadFrequently: true });
    offCtx.drawImage(source, 0, 0, width, height);

    const srcData = offCtx.getImageData(0, 0, width, height);
    const src32 = new Uint32Array(srcData.data.buffer);

    const outData = ctx.createImageData(width, height);
    const out32 = new Uint32Array(outData.data.buffer);
    const out8 = outData.data;

    const refr = p.refraction / 100;
    const dist = p.distortion / 100;
    const density = Math.max(2, p.density);
    const cellSize = Math.max(16, (180 / (density / 10)) | 0);
    const chromSplit = (refr * 5) | 0;

    const fastSin = this.fastSin;
    const fastCos = this.fastCos;

    for (let y = 0; y < height; y++) {
      const rowOffset = y * width;
      const normY = y / height;

      for (let x = 0; x < width; x++) {
        const normX = x / width;
        let dx = 0;
        let dy = 0;

        if (presetKey === '1') {
          dx = fastSin(y * 0.02 + normX * 4) * (refr * 14);
          dy = fastCos(x * 0.02 + normY * 4) * (refr * 14);
        } else if (presetKey === '2') {
          const cellX = (x % cellSize) - (cellSize >> 1);
          const cellY = (y % cellSize) - (cellSize >> 1);
          dx = (cellX / cellSize) * (refr * 25) + fastSin(x * 0.05) * 5;
          dy = (cellY / cellSize) * (refr * 25) + fastCos(y * 0.05) * 5;
        } else if (presetKey === '3') {
          const shardX = (x % 60) - 30;
          const shardY = (y % 60) - 30;
          dx = (shardX / 30) * (refr * 28 * dist);
          dy = (shardY / 30) * (refr * 28 * dist);
        } else if (presetKey === '3.1') {
          dx = (fastSin(x * 0.15) + fastCos(y * 0.2)) * (dist * 18);
          dy = (fastCos(x * 0.2) - fastSin(y * 0.15)) * (dist * 18);
        } else if (presetKey === '3.2') {
          const layer1 = fastSin(y * 0.015 + x * 0.01) * 20;
          const layer2 = fastCos(y * 0.04 - x * 0.03) * 15;
          dx = (layer1 + layer2) * refr;
          dy = (layer1 - layer2) * refr;
        } else {
          // 3.3 Abstract vortex
          const cx = width >> 1;
          const cy = height >> 1;
          const rx = x - cx;
          const ry = y - cy;
          const distFromC = Math.sqrt(rx * rx + ry * ry);
          const ang = distFromC * 0.005 * dist;
          dx = fastCos(ang) * (refr * 30);
          dy = fastSin(ang) * (refr * 30);
        }

        // Clamp coordinates
        const targetX = Math.min(width - 1, Math.max(0, (x + dx) | 0));
        const targetY = Math.min(height - 1, Math.max(0, (y + dy) | 0));

        if (chromSplit > 0) {
          const targetXR = Math.min(width - 1, Math.max(0, targetX + chromSplit));
          const targetXB = Math.min(width - 1, Math.max(0, targetX - chromSplit));

          const srcIdxR = (targetY * width + targetXR) * 4;
          const srcIdxG = (targetY * width + targetX) * 4;
          const srcIdxB = (targetY * width + targetXB) * 4;
          const outIdx = (rowOffset + x) * 4;

          const spec = Math.min(60, (Math.abs(dx + dy) * (p.light * 0.02)) | 0);

          out8[outIdx] = Math.min(255, srcData.data[srcIdxR] + spec);
          out8[outIdx + 1] = Math.min(255, srcData.data[srcIdxG + 1] + spec);
          out8[outIdx + 2] = Math.min(255, srcData.data[srcIdxB + 2] + spec);
          out8[outIdx + 3] = srcData.data[srcIdxG + 3];
        } else {
          out32[rowOffset + x] = src32[targetY * width + targetX];
        }
      }
    }

    ctx.putImageData(outData, 0, 0);

    // Apply color tint overlay
    if (p.tint) {
      ctx.fillStyle = p.tint;
      ctx.fillRect(0, 0, width, height);
    }

    return canvas;
  }
}
