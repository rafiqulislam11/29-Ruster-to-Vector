/**
 * Creative Vector Studio — Professional Vector Tracing Engine
 * Converts raster images into authentic, editable SVG vector geometry using:
 * - Pre-filtering (Noise removal, small object elimination, edge enhancement)
 * - Color quantization (Original, Grayscale, Black & White silhouette, Custom user palette)
 * - Contour marching with hole preservation (evenodd fill rule)
 * - Smooth quadratic Bézier curves with corner angle thresholding
 * - Configurable Fill Mode, Stroke Mode, and Fill + Stroke
 * - Layer by Color (<g id="color_...">) vs Layer by Object (<g id="path_...">)
 */

export class VectorTracer {
  /**
   * Trace an image or canvas into authentic SVG vector paths
   * @param {HTMLImageElement|HTMLCanvasElement} sourceImage
   * @param {Object} options
   * @returns {Promise<{svgString: string, pathCount: number, colors: string[], width: number, height: number, paths: Array}>}
   */
  static async trace(sourceImage, options = {}) {
    const {
      colors = 10,
      detail = 70,             // 10 to 100
      smoothness = 60,         // 0 to 100
      simplification = 2,      // 1 to 5
      threshold = 128,         // 0 to 255
      noiseRemoval = 12,       // 0 to 50
      smallObjectRemoval = 8,  // 0 to 100
      edgeDetection = true,
      edgeSharpness = 65,      // 0 to 100
      pathPrecision = 2,       // 1 to 4 decimals
      cornerSmoothness = 45,   // 0 to 100
      removeWhiteBg = true,
      bgMode = 'transparent',   // 'transparent' | 'white' | 'none'
      preserveFineDetails = true,
      preserveHoles = true,
      fillMode = 'fill',       // 'fill' | 'stroke' | 'fillAndStroke'
      strokeWidth = 2,
      strokeColor = '#0a0b0e',
      paletteMode = 'original',// 'original' | 'grayscale' | 'bw' | 'custom'
      customPalette = ['#6366f1', '#06b6d4', '#ec4899', '#10b981', '#f59e0b'],
      layerMode = 'color'      // 'color' | 'object'
    } = options;

    const width = sourceImage.naturalWidth || sourceImage.width || 800;
    const height = sourceImage.naturalHeight || sourceImage.height || 600;

    // High fidelity processing dimensions
    const maxDimension = preserveFineDetails ? 960 : 640;
    const scale = Math.min(1, maxDimension / Math.max(width, height));
    const targetW = Math.round(width * scale);
    const targetH = Math.round(height * scale);

    const canvas = document.createElement('canvas');
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(sourceImage, 0, 0, targetW, targetH);

    // Apply Edge Sharpness if requested
    if (edgeDetection && edgeSharpness > 20) {
      this.applyEdgeSharpening(ctx, targetW, targetH, edgeSharpness);
    }

    const imgData = ctx.getImageData(0, 0, targetW, targetH);
    const data = imgData.data;
    const totalPixels = targetW * targetH;

    // 1. Determine Palette according to Palette Mode
    let palette = [];
    const skipWhite = removeWhiteBg || bgMode === 'transparent';

    if (paletteMode === 'bw') {
      palette = [
        { r: 0, g: 0, b: 0, hex: '#000000' }
      ];
    } else if (paletteMode === 'grayscale') {
      const step = Math.max(2, Math.floor(255 / (colors - 1 || 1)));
      palette = [];
      for (let gVal = 0; gVal <= 255; gVal += step) {
        if (skipWhite && gVal > 240) continue;
        palette.push({
          r: gVal, g: gVal, b: gVal,
          hex: this.rgbToHex(gVal, gVal, gVal)
        });
      }
      if (palette.length === 0) palette.push({ r: 0, g: 0, b: 0, hex: '#000000' });
    } else if (paletteMode === 'custom' && customPalette.length > 0) {
      palette = customPalette.map(hex => this.hexToRgb(hex));
    } else {
      // Original colors quantized
      palette = this.quantizePalette(data, colors, skipWhite);
    }

    const numPalette = palette.length;

    // 2. Pixel cluster assignment with distance checking & noise filtering
    const pixelLabels = new Int8Array(totalPixels);
    pixelLabels.fill(-1);

    const MAX_DIST_SQ = 65 * 65;

    for (let i = 0; i < totalPixels; i++) {
      const idx = i * 4;
      const a = data[idx + 3];
      if (a < 35) continue;

      let r = data[idx];
      let g = data[idx + 1];
      let b = data[idx + 2];

      if (skipWhite && r > 240 && g > 240 && b > 240) continue;

      if (paletteMode === 'bw') {
        const lum = (299 * r + 587 * g + 114 * b) >> 10;
        if (lum < threshold) {
          pixelLabels[i] = 0;
        }
        continue;
      }

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

    // 3. Noise removal: filter isolated single pixels/speckles
    if (noiseRemoval > 0) {
      this.filterNoise(pixelLabels, targetW, targetH, noiseRemoval);
    }

    // 4. Trace contours for each assigned color cluster
    const paths = [];
    const mask = new Uint8Array(totalPixels);
    let pathIndex = 1;

    for (let c = 0; c < numPalette; c++) {
      const targetColor = palette[c];
      let countPixels = 0;

      for (let i = 0; i < totalPixels; i++) {
        if (pixelLabels[i] === c) {
          mask[i] = 1;
          countPixels++;
        } else {
          mask[i] = 0;
        }
      }

      if (countPixels < Math.max(6, smallObjectRemoval)) continue;

      const contours = this.extractContours(mask, targetW, targetH, detail, smallObjectRemoval);
      if (contours.length > 0) {
        const svgPathD = this.contoursToSvgPath(
          contours,
          targetW,
          targetH,
          width,
          height,
          smoothness,
          simplification,
          cornerSmoothness,
          pathPrecision,
          preserveHoles
        );

        if (svgPathD) {
          const colorHex = targetColor.hex || this.rgbToHex(targetColor.r, targetColor.g, targetColor.b);
          paths.push({
            id: `vector_path_${pathIndex++}`,
            d: svgPathD,
            fill: fillMode === 'stroke' ? 'none' : colorHex,
            stroke: (fillMode === 'stroke' || fillMode === 'fillAndStroke') ? strokeColor : 'none',
            strokeWidth: (fillMode === 'stroke' || fillMode === 'fillAndStroke') ? strokeWidth : 0,
            colorIndex: c,
            colorHex,
            name: `Vector Shape ${paths.length + 1} (${colorHex})`
          });
        }
      }
    }

    // 5. Construct Authentic SVG
    let svgContent = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    svgContent += `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" fill-rule="evenodd">\n`;

    // Background rect if white background is selected
    if (bgMode === 'white' && !removeWhiteBg) {
      svgContent += `  <rect width="100%" height="100%" fill="#ffffff" />\n`;
    }

    if (layerMode === 'color') {
      // Group by color
      const groupedByColor = new Map();
      for (const p of paths) {
        if (!groupedByColor.has(p.colorHex)) groupedByColor.set(p.colorHex, []);
        groupedByColor.get(p.colorHex).push(p);
      }

      let groupIndex = 1;
      for (const [colorHex, groupPaths] of groupedByColor.entries()) {
        svgContent += `  <g id="layer_${groupIndex++}_${colorHex.replace('#', '')}" data-color="${colorHex}">\n`;
        for (const p of groupPaths) {
          svgContent += `    <path id="${p.id}" d="${p.d}" fill="${p.fill}" stroke="${p.stroke}" stroke-width="${p.strokeWidth}" />\n`;
        }
        svgContent += `  </g>\n`;
      }
    } else {
      // Layer by individual object
      svgContent += `  <g id="vector_objects">\n`;
      for (const p of paths) {
        svgContent += `    <path id="${p.id}" d="${p.d}" fill="${p.fill}" stroke="${p.stroke}" stroke-width="${p.strokeWidth}" />\n`;
      }
      svgContent += `  </g>\n`;
    }

    svgContent += `</svg>`;

    return {
      svgString: svgContent,
      pathCount: paths.length,
      colors: palette.map(p => p.hex || this.rgbToHex(p.r, p.g, p.b)),
      width,
      height,
      paths
    };
  }

  static applyEdgeSharpening(ctx, w, h, strength) {
    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;
    const factor = (strength / 100) * 0.5;
    const center = 1 + 4 * factor;
    const edge = -factor;

    for (let y = 1; y < h - 1; y++) {
      const row = y * w;
      for (let x = 1; x < w - 1; x++) {
        const idx = (row + x) * 4;
        for (let c = 0; c < 3; c++) {
          const val = data[idx + c] * center +
                      (data[((y - 1) * w + x) * 4 + c] +
                       data[((y + 1) * w + x) * 4 + c] +
                       data[(row + x - 1) * 4 + c] +
                       data[(row + x + 1) * 4 + c]) * edge;
          data[idx + c] = Math.min(255, Math.max(0, val));
        }
      }
    }
    ctx.putImageData(imgData, 0, 0);
  }

  static filterNoise(labels, w, h, threshold) {
    const radius = threshold > 25 ? 2 : 1;
    for (let y = radius; y < h - radius; y++) {
      const row = y * w;
      for (let x = radius; x < w - radius; x++) {
        const idx = row + x;
        const current = labels[idx];
        if (current === -1) continue;

        let sameCount = 0;
        let diffNeighbors = 0;
        let lastNeighbor = -1;

        for (let dy = -radius; dy <= radius; dy++) {
          for (let dx = -radius; dx <= radius; dx++) {
            if (dx === 0 && dy === 0) continue;
            const nIdx = (y + dy) * w + (x + dx);
            if (labels[nIdx] === current) sameCount++;
            else {
              diffNeighbors++;
              lastNeighbor = labels[nIdx];
            }
          }
        }

        // If isolated speckle, reassign to dominant neighbor
        if (sameCount <= 1 && diffNeighbors >= 4) {
          labels[idx] = lastNeighbor;
        }
      }
    }
  }

  static quantizePalette(data, numColors, skipWhite) {
    const colorBuckets = {};
    const step = 8;
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
      return [
        { r: 99, g: 102, b: 241, hex: '#6366f1' },
        { r: 6, g: 182, b: 212, hex: '#06b6d4' }
      ];
    }

    return sorted.map(([k]) => {
      const num = parseInt(k, 10);
      const r = (num >> 16) & 255;
      const g = (num >> 8) & 255;
      const b = num & 255;
      return { r, g, b, hex: this.rgbToHex(r, g, b) };
    });
  }

  static extractContours(mask, w, h, detailLevel, minAreaThreshold = 8) {
    const minArea = Math.max(4, Math.round(minAreaThreshold * (1 - detailLevel / 200)));
    const visited = new Uint8Array(w * h);
    const contours = [];
    const step = detailLevel > 75 ? 1 : 2;

    for (let y = 1; y < h - 1; y += step) {
      const rowOffset = y * w;
      for (let x = 1; x < w - 1; x += step) {
        const idx = rowOffset + x;
        if (mask[idx] && !visited[idx]) {
          // Boundary pixel check
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
    const maxSteps = 1200;
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

  static contoursToSvgPath(
    contours,
    srcW,
    srcH,
    targetW,
    targetH,
    smoothness,
    simplification,
    cornerSmoothness = 45,
    pathPrecision = 2,
    preserveHoles = true
  ) {
    const scaleX = targetW / srcW;
    const scaleY = targetH / srcH;
    let d = '';

    for (const contour of contours) {
      if (contour.length < 3) continue;
      const step = Math.max(1, Math.round(simplification));
      const points = [];
      for (let i = 0; i < contour.length; i += step) {
        points.push({
          x: +(contour[i].x * scaleX).toFixed(pathPrecision),
          y: +(contour[i].y * scaleY).toFixed(pathPrecision)
        });
      }
      if (points.length < 3) continue;

      d += `M ${points[0].x} ${points[0].y} `;

      if (smoothness > 20) {
        for (let i = 1; i < points.length - 1; i++) {
          const pPrev = points[i - 1];
          const pCurr = points[i];
          const pNext = points[i + 1];

          // Compute angle to decide between sharp corner vs smooth Bézier
          const angle = this.computeAngle(pPrev, pCurr, pNext);
          if (angle < (180 - cornerSmoothness * 1.2)) {
            // Sharp corner
            d += `L ${pCurr.x} ${pCurr.y} `;
          } else {
            // Smooth quadratic curve
            const xc = ((pCurr.x + pNext.x) / 2).toFixed(pathPrecision);
            const yc = ((pCurr.y + pNext.y) / 2).toFixed(pathPrecision);
            d += `Q ${pCurr.x} ${pCurr.y}, ${xc} ${yc} `;
          }
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

  static computeAngle(p1, p2, p3) {
    const d1x = p1.x - p2.x;
    const d1y = p1.y - p2.y;
    const d2x = p3.x - p2.x;
    const d2y = p3.y - p2.y;
    const dot = d1x * d2x + d1y * d2y;
    const mag1 = Math.sqrt(d1x * d1x + d1y * d1y) || 1;
    const mag2 = Math.sqrt(d2x * d2x + d2y * d2y) || 1;
    const cosAngle = Math.max(-1, Math.min(1, dot / (mag1 * mag2)));
    return (Math.acos(cosAngle) * 180) / Math.PI;
  }

  static rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(x => {
      const hex = Math.min(255, Math.max(0, x)).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  }

  static hexToRgb(hex) {
    let cleanHex = hex.replace('#', '');
    if (cleanHex.length === 3) {
      cleanHex = cleanHex.split('').map(c => c + c).join('');
    }
    const num = parseInt(cleanHex, 16) || 0;
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255,
      hex: '#' + cleanHex
    };
  }
}
