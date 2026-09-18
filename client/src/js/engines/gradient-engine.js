/**
 * CreativeForge AI — Gradient & Color Extraction Engine
 * Extracts dominant color palettes from images and generates Linear, Radial,
 * Mesh, Multi-Color, Soft, and Blur gradients. Supports 4 Gradient Maker architectures.
 */

export class GradientEngine {
  /**
   * Extract dominant colors from an image or canvas
   * @param {HTMLImageElement|HTMLCanvasElement} source
   * @param {number} count Number of colors (2 to 10)
   * @returns {string[]} Array of hex color strings
   */
  static extractPalette(source, count = 5) {
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(source, 0, 0, 100, 100);

    const imgData = ctx.getImageData(0, 0, 100, 100);
    const data = imgData.data;
    const colorMap = {};

    for (let i = 0; i < data.length; i += 16) {
      const a = data[i + 3];
      if (a < 128) continue;
      // Quantize to bucket of 32
      const r = Math.round(data[i] / 32) * 32;
      const g = Math.round(data[i + 1] / 32) * 32;
      const b = Math.round(data[i + 2] / 32) * 32;
      const key = `${r},${g},${b}`;
      colorMap[key] = (colorMap[key] || 0) + 1;
    }

    const sorted = Object.entries(colorMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, count);

    if (sorted.length === 0) {
      return ['#6366f1', '#06b6d4', '#ec4899', '#8b5cf6'];
    }

    return sorted.map(([k]) => {
      const [r, g, b] = k.split(',').map(Number);
      return this.rgbToHex(r, g, b);
    });
  }

  /**
   * Render gradient canvas
   * @param {Object} options
   * @returns {HTMLCanvasElement}
   */
  static renderGradientCanvas(options = {}) {
    const {
      colors = ['#6366f1', '#06b6d4', '#ec4899'],
      type = 'linear', // 'linear' | 'radial' | 'mesh' | 'multi' | 'soft' | 'blur'
      angle = 135,
      blur = 0,
      opacity = 100,
      width = 1200,
      height = 800,
      noise = 0,
      makerSystem = 1 // 1: simple, 2: advanced multi, 3: mesh, 4: textured light
    } = options;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    ctx.globalAlpha = opacity / 100;

    if (type === 'mesh' || makerSystem === 3) {
      this.drawMeshGradient(ctx, width, height, colors, blur);
    } else if (type === 'radial') {
      const cx = width / 2;
      const cy = height / 2;
      const r = Math.hypot(cx, cy);
      const radGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      colors.forEach((c, idx) => {
        radGrad.addColorStop(idx / (colors.length - 1 || 1), c);
      });
      ctx.fillStyle = radGrad;
      ctx.fillRect(0, 0, width, height);
    } else {
      // Linear / Multi-color
      const rad = (angle * Math.PI) / 180;
      const x1 = width / 2 - (Math.cos(rad) * width) / 2;
      const y1 = height / 2 - (Math.sin(rad) * height) / 2;
      const x2 = width / 2 + (Math.cos(rad) * width) / 2;
      const y2 = height / 2 + (Math.sin(rad) * height) / 2;

      const linGrad = ctx.createLinearGradient(x1, y1, x2, y2);
      colors.forEach((c, idx) => {
        linGrad.addColorStop(idx / (colors.length - 1 || 1), c);
      });
      ctx.fillStyle = linGrad;
      ctx.fillRect(0, 0, width, height);
    }

    // Apply Blur / Softness filter if requested
    if (blur > 0 || type === 'soft' || type === 'blur') {
      const blurPx = blur || (type === 'soft' ? 30 : 60);
      const copy = document.createElement('canvas');
      copy.width = width;
      copy.height = height;
      copy.getContext('2d').drawImage(canvas, 0, 0);

      ctx.filter = `blur(${blurPx}px)`;
      ctx.drawImage(copy, 0, 0);
      ctx.filter = 'none';
    }

    // Gradient Maker 4: Textured lighting & organic noise
    if (makerSystem === 4 || noise > 0) {
      this.applyTextureAndLighting(ctx, width, height, noise || 15);
    }

    return canvas;
  }

  /**
   * Draw multi-point fluid mesh gradient
   */
  static drawMeshGradient(ctx, w, h, colors, blurAmount) {
    // Fill base color
    ctx.fillStyle = colors[0] || '#6366f1';
    ctx.fillRect(0, 0, w, h);

    // Mesh points with radial orbs
    const points = [
      { x: w * 0.2, y: h * 0.2, r: Math.min(w, h) * 0.6, color: colors[1] || '#06b6d4' },
      { x: w * 0.8, y: h * 0.3, r: Math.min(w, h) * 0.7, color: colors[2] || '#ec4899' },
      { x: w * 0.3, y: h * 0.8, r: Math.min(w, h) * 0.65, color: colors[3] || '#8b5cf6' },
      { x: w * 0.85, y: h * 0.85, r: Math.min(w, h) * 0.55, color: colors[0] || '#3b82f6' }
    ];

    points.forEach(pt => {
      const g = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, pt.r);
      g.addColorStop(0, pt.color);
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    });
  }

  /**
   * Apply subtle grain texture and vignette lighting
   */
  static applyTextureAndLighting(ctx, w, h, noiseAmount) {
    // Vignette / Lighting
    const cx = w / 2;
    const cy = h / 2;
    const light = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.hypot(cx, cy));
    light.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
    light.addColorStop(0.6, 'transparent');
    light.addColorStop(1, 'rgba(0, 0, 0, 0.35)');
    ctx.fillStyle = light;
    ctx.fillRect(0, 0, w, h);

    // Noise
    const noiseCanvas = document.createElement('canvas');
    noiseCanvas.width = 200;
    noiseCanvas.height = 200;
    const nCtx = noiseCanvas.getContext('2d');
    const nImg = nCtx.createImageData(200, 200);
    for (let i = 0; i < nImg.data.length; i += 4) {
      const v = Math.random() * 255;
      nImg.data[i] = v;
      nImg.data[i + 1] = v;
      nImg.data[i + 2] = v;
      nImg.data[i + 3] = (noiseAmount / 100) * 45;
    }
    nCtx.putImageData(nImg, 0, 0);

    ctx.save();
    ctx.globalCompositeOperation = 'overlay';
    const pattern = ctx.createPattern(noiseCanvas, 'repeat');
    ctx.fillStyle = pattern;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  }

  /**
   * Generate CSS gradient string
   */
  static getCssGradient(type, angle, colors) {
    if (type === 'radial') {
      return `radial-gradient(circle at center, ${colors.join(', ')})`;
    }
    return `linear-gradient(${angle}deg, ${colors.join(', ')})`;
  }

  static rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(x => {
      const hex = Math.min(255, Math.max(0, x)).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  }
}
