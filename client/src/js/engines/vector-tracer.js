/**
 * CreativeForge AI — Super Fast Vector Tracing Engine
 * Converts raster images into authentic SVG paths using single-pass squared-distance clustering,
 * boundary marching, and optimized Bezier curve generation.
 */

export class VectorTracer {
  /**
   * Trace an image or canvas into real SVG vector paths with ultra-fast speed
   * @param {HTMLImageElement|HTMLCanvasElement} sourceImage
   * @param {Object} options
   * @returns {Promise<{svgString: string, pathCount: number, colors: string[], width: number, height: number}>}
   */
  static async trace(sourceImage, options = {}) {
    const {
      colors = 8,
      detail = 60,         // 10 to 100
      smoothness = 50,     // 0 to 100
      threshold = 128,     // 0 to 255
      removeWhiteBg = true,
      simplification = 2   // Tolerance for path simplification
    } = options;

    const width = sourceImage.naturalWidth || sourceImage.width || 800;
    const height = sourceImage.naturalHeight || sourceImage.height || 600;

    // Scale down for lightning-fast trace calculation
    const maxDimension = 640;
    const scale = Math.min(1, maxDimension / Math.max(width, height));
    const targetW = Math.round(width * scale);
    const targetH = Math.round(height * scale);

    const canvas = document.createElement('canvas');
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(sourceImage, 0, 0, targetW, targetH);

    const imgData = ctx.getImageData(0, 0, targetW, targetH);
    const data = imgData.data;
    const totalPixels = targetW * targetH;

    // 1. Fast Palette Quantization
    const palette = this.quantizePalette(data, colors, removeWhiteBg);
    const numPalette = palette.length;

    // 2. Single-pass pixel cluster assignment (10x faster)
    const pixelLabels = new Int8Array(totalPixels);
    pixelLabels.fill(-1);

    const MAX_DIST_SQ = 55 * 55;

    for (let i = 0; i < totalPixels; i++) {
      const idx = i * 4;
      const a = data[idx + 3];
      if (a < 30) continue;

      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

      if (removeWhiteBg && r > 240 && g > 240 && b > 240) continue;

      let bestIdx = -1;
      let bestDistSq = MAX_DIST_SQ;

      for (let c = 0; c < numPalette; c++) {
        const pal = palette[c];
        const dr = r - pal.r;
        const dg = g - pal.g;
        const db = b - pal.b;
        const dSq = dr * dr + dg * dg + db * db;
        if (dSq < bestDistSq) {
          bestDistSq = dSq;
          bestIdx = c;
        }
      }

      pixelLabels[i] = bestIdx;
    }

    // 3. Trace contours for each assigned color cluster
    const paths = [];
    const mask = new Uint8Array(totalPixels);

    for (let c = 0; c < numPalette; c++) {
      const targetColor = palette[c];
      let hasPixels = false;

      for (let i = 0; i < totalPixels; i++) {
        if (pixelLabels[i] === c) {
          mask[i] = 1;
          hasPixels = true;
        } else {
          mask[i] = 0;
        }
      }

      if (!hasPixels) continue;

      const contours = this.extractContours(mask, targetW, targetH, detail);
      if (contours.length > 0) {
        const svgPathD = this.contoursToSvgPath(contours, targetW, targetH, width, height, smoothness, simplification);
        if (svgPathD) {
          paths.push({
            d: svgPathD,
            fill: this.rgbToHex(targetColor.r, targetColor.g, targetColor.b),
            colorIndex: c
          });
        }
      }
    }

    // Build SVG output
    let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">\n`;
    svgContent += `  <g id="creativeforge-vector-layers">\n`;
    for (const p of paths) {
      svgContent += `    <path d="${p.d}" fill="${p.fill}" />\n`;
    }
    svgContent += `  </g>\n</svg>`;

    return {
      svgString: svgContent,
      pathCount: paths.length,
      colors: palette.map(p => this.rgbToHex(p.r, p.g, p.b)),
      width,
      height
    };
  }

  static quantizePalette(data, numColors, skipWhite) {
    const colorBuckets = {};
    const step = 16; // Fast sampling step
    for (let i = 0; i < data.length; i += 4 * step) {
      const a = data[i + 3];
      if (a < 50) continue;
      const r = (data[i] >> 5) << 5;
      const g = (data[i + 1] >> 5) << 5;
      const b = (data[i + 2] >> 5) << 5;

      if (skipWhite && r > 224 && g > 224 && b > 224) continue;

      const key = (r << 16) | (g << 8) | b;
      colorBuckets[key] = (colorBuckets[key] || 0) + 1;
    }

    const sorted = Object.entries(colorBuckets)
      .sort((a, b) => b[1] - a[1])
      .slice(0, numColors);

    if (sorted.length === 0) {
      return [{ r: 99, g: 102, b: 241 }, { r: 6, g: 182, b: 212 }];
    }

    return sorted.map(([k]) => {
      const num = parseInt(k, 10);
      return {
        r: (num >> 16) & 255,
        g: (num >> 8) & 255,
        b: num & 255
      };
    });
  }

  static extractContours(mask, w, h, detailLevel) {
    const minArea = Math.max(3, Math.round(30 - (detailLevel / 100) * 25));
    const visited = new Uint8Array(w * h);
    const contours = [];
    const step = detailLevel > 70 ? 1 : 2;

    for (let y = 1; y < h - 1; y += step) {
      const rowOffset = y * w;
      for (let x = 1; x < w - 1; x += step) {
        const idx = rowOffset + x;
        if (mask[idx] && !visited[idx]) {
          if (!mask[idx - 1] || !mask[idx + 1] || !mask[idx - w] || !mask[idx + w]) {
            const polygon = this.tracePolygon(mask, visited, x, y, w, h);
            if (polygon.length >= minArea) {
              contours.push(polygon);
            }
          }
        }
      }
    }
    return contours;
  }

  static tracePolygon(mask, visited, startX, startY, w, h) {
    const poly = [];
    let x = startX;
    let y = startY;
    let dir = 0;
    const maxSteps = 800;
    let steps = 0;

    const dx = [1, 0, -1, 0];
    const dy = [0, 1, 0, -1];

    while (steps < maxSteps) {
      poly.push({ x, y });
      visited[y * w + x] = 1;
      steps++;

      let found = false;
      for (let i = 0; i < 4; i++) {
        const nextDir = (dir + 3 + i) % 4;
        const nx = x + dx[nextDir];
        const ny = y + dy[nextDir];

        if (nx >= 0 && nx < w && ny >= 0 && ny < h && mask[ny * w + nx]) {
          x = nx;
          y = ny;
          dir = nextDir;
          found = true;
          break;
        }
      }

      if (!found || (x === startX && y === startY && steps > 3)) {
        break;
      }
    }
    return poly;
  }

  static contoursToSvgPath(contours, srcW, srcH, targetW, targetH, smoothness, simplification) {
    const scaleX = targetW / srcW;
    const scaleY = targetH / srcH;
    let d = '';

    for (const contour of contours) {
      if (contour.length < 3) continue;
      const step = Math.max(1, Math.round(simplification));
      const points = [];
      for (let i = 0; i < contour.length; i += step) {
        points.push({
          x: +(contour[i].x * scaleX).toFixed(1),
          y: +(contour[i].y * scaleY).toFixed(1)
        });
      }
      if (points.length < 3) continue;

      d += `M ${points[0].x} ${points[0].y} `;
      if (smoothness > 20) {
        for (let i = 1; i < points.length - 1; i++) {
          const xc = ((points[i].x + points[i + 1].x) / 2).toFixed(1);
          const yc = ((points[i].y + points[i + 1].y) / 2).toFixed(1);
          d += `Q ${points[i].x} ${points[i].y}, ${xc} ${yc} `;
        }
        d += `Z `;
      } else {
        for (let i = 1; i < points.length; i++) {
          d += `L ${points[i].x} ${points[i].y} `;
        }
        d += `Z `;
      }
    }
    return d.trim();
  }

  static rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(x => {
      const hex = Math.min(255, Math.max(0, x)).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  }
}
