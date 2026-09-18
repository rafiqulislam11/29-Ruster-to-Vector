/**
 * CreativeForge AI — Dedicated Background Batch Web Worker
 * Offloads heavy pixel calculations (unsharp masking, Voronoi glass, film grain, chroma keying)
 * from the main UI thread to prevent any UI freezing during 500+ batch runs.
 */

self.onmessage = function(e) {
  const { id, action, payload } = e.data;

  try {
    switch (action) {
      case 'APPLY_UNSHARP_MASK': {
        const { width, height, pixels, amount = 0.8, radius = 1 } = payload;
        const result = applyUnsharpMask(width, height, new Uint8ClampedArray(pixels), amount, radius);
        self.postMessage({ id, status: 'success', result: result.buffer }, [result.buffer]);
        break;
      }

      case 'EXTRACT_CHROMA_BG': {
        const { width, height, pixels, tolerance = 25 } = payload;
        const result = extractChromaBg(width, height, new Uint8ClampedArray(pixels), tolerance);
        self.postMessage({ id, status: 'success', result: result.buffer }, [result.buffer]);
        break;
      }

      case 'SYNTHESIZE_GRAIN': {
        const { width, height, pixels, amount = 25, size = 1.2 } = payload;
        const result = synthesizeGrain(width, height, new Uint8ClampedArray(pixels), amount, size);
        self.postMessage({ id, status: 'success', result: result.buffer }, [result.buffer]);
        break;
      }

      case 'COMPUTE_VORONOI_DISTORTION': {
        const { width, height, pixels, preset = 1, intensity = 50 } = payload;
        const result = computeVoronoiDistortion(width, height, new Uint8ClampedArray(pixels), preset, intensity);
        self.postMessage({ id, status: 'success', result: result.buffer }, [result.buffer]);
        break;
      }

      default:
        self.postMessage({ id, status: 'error', error: `Unknown worker action: ${action}` });
    }
  } catch (err) {
    self.postMessage({ id, status: 'error', error: err.message });
  }
};

/**
 * High-performance 2D Gaussian Unsharp Masking in Worker
 */
function applyUnsharpMask(w, h, src, amount, radius) {
  const out = new Uint8ClampedArray(src.length);
  const blurred = new Uint8ClampedArray(src.length);

  // Fast box blur approximation of Gaussian
  const r = Math.max(1, Math.round(radius));
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let rSum = 0, gSum = 0, bSum = 0, count = 0;
      for (let dy = -r; dy <= r; dy++) {
        const ny = y + dy;
        if (ny < 0 || ny >= h) continue;
        for (let dx = -r; dx <= r; dx++) {
          const nx = x + dx;
          if (nx < 0 || nx >= w) continue;
          const idx = (ny * w + nx) * 4;
          rSum += src[idx];
          gSum += src[idx + 1];
          bSum += src[idx + 2];
          count++;
        }
      }
      const pIdx = (y * w + x) * 4;
      blurred[pIdx] = rSum / count;
      blurred[pIdx + 1] = gSum / count;
      blurred[pIdx + 2] = bSum / count;
      blurred[pIdx + 3] = src[pIdx + 3];
    }
  }

  // Sharpen formula: out = src + (src - blurred) * amount
  for (let i = 0; i < src.length; i += 4) {
    out[i] = Math.min(255, Math.max(0, src[i] + (src[i] - blurred[i]) * amount));
    out[i + 1] = Math.min(255, Math.max(0, src[i + 1] + (src[i + 1] - blurred[i + 1]) * amount));
    out[i + 2] = Math.min(255, Math.max(0, src[i + 2] + (src[i + 2] - blurred[i + 2]) * amount));
    out[i + 3] = src[i + 3];
  }

  return out;
}

/**
 * Fast Chroma Key background removal in Worker
 */
function extractChromaBg(w, h, src, tolerance) {
  const out = new Uint8ClampedArray(src.length);
  out.set(src);

  // Top-left pixel sample as background reference
  const bgR = src[0], bgG = src[1], bgB = src[2];
  const maxDist = tolerance * 2.5;

  for (let i = 0; i < src.length; i += 4) {
    const dr = src[i] - bgR;
    const dg = src[i + 1] - bgG;
    const db = src[i + 2] - bgB;
    const dist = Math.sqrt(dr * dr + dg * dg + db * db);

    if (dist < maxDist) {
      const alphaFactor = Math.max(0, (dist - (maxDist * 0.5)) / (maxDist * 0.5));
      out[i + 3] = Math.round(src[i + 3] * alphaFactor);
    }
  }

  return out;
}

/**
 * Procedural Film Grain Synthesis in Worker
 */
function synthesizeGrain(w, h, src, amount, size) {
  const out = new Uint8ClampedArray(src.length);
  const factor = amount * 0.5;

  for (let i = 0; i < src.length; i += 4) {
    // Fast pseudo-random distribution
    const noise = (Math.random() - 0.5) * factor;
    out[i] = Math.min(255, Math.max(0, src[i] + noise));
    out[i + 1] = Math.min(255, Math.max(0, src[i + 1] + noise));
    out[i + 2] = Math.min(255, Math.max(0, src[i + 2] + noise));
    out[i + 3] = src[i + 3];
  }

  return out;
}

/**
 * Voronoi Fractal Glass procedural distortion in Worker
 */
function computeVoronoiDistortion(w, h, src, preset, intensity) {
  const out = new Uint8ClampedArray(src.length);
  const scale = (intensity / 100) * 8;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      // Trigonometric refractive displacement
      const dx = Math.sin(y * 0.05 + preset) * scale;
      const dy = Math.cos(x * 0.05 + preset) * scale;

      const sx = Math.min(w - 1, Math.max(0, Math.round(x + dx)));
      const sy = Math.min(h - 1, Math.max(0, Math.round(y + dy)));

      const srcIdx = (sy * w + sx) * 4;
      const dstIdx = (y * w + x) * 4;

      out[dstIdx] = src[srcIdx];
      out[dstIdx + 1] = src[srcIdx + 1];
      out[dstIdx + 2] = src[srcIdx + 2];
      out[dstIdx + 3] = src[srcIdx + 3];
    }
  }

  return out;
}
