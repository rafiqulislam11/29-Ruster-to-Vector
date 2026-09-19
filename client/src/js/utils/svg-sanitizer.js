/**
 * RI Raster to Vector PRO — Client-side SVG Sanitizer
 * Prevents DOM injection attacks, XXE, inline scripts, and unsafe protocols.
 */

export class ClientSvgSanitizer {
  /**
   * Cleans SVG markup string before injecting into innerHTML or creating Blobs
   * @param {string} rawSvg
   * @returns {string} Clean, safe SVG markup
   */
  static sanitize(rawSvg) {
    if (!rawSvg || typeof rawSvg !== 'string') return '';

    let clean = rawSvg;

    // 1. Remove XXE and DOCTYPE entities
    clean = clean.replace(/<!DOCTYPE[\s\S]*?\]>/gi, '');
    clean = clean.replace(/<!DOCTYPE[\s\S]*?>/gi, '');
    clean = clean.replace(/<!ENTITY[\s\S]*?>/gi, '');

    // 2. Strip scripts and foreign objects
    clean = clean.replace(/<script[\s\S]*?<\/script>/gi, '');
    clean = clean.replace(/<script[\s\S]*?\/>/gi, '');
    clean = clean.replace(/<foreignObject[\s\S]*?<\/foreignObject>/gi, '');
    clean = clean.replace(/<foreignObject[\s\S]*?\/>/gi, '');
    clean = clean.replace(/<(?:embed|object|iframe|audio|video)[\s\S]*?<\/(?:embed|object|iframe|audio|video)>/gi, '');
    clean = clean.replace(/<(?:embed|object|iframe|audio|video)[\s\S]*?\/>/gi, '');

    // 3. Remove inline event handlers
    clean = clean.replace(/\son[a-zA-Z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '');

    // 4. Remove javascript: URIs
    clean = clean.replace(/href\s*=\s*["']\s*javascript:[\s\S]*?["']/gi, 'href="#"');
    clean = clean.replace(/xlink:href\s*=\s*["']\s*javascript:[\s\S]*?["']/gi, 'xlink:href="#"');
    clean = clean.replace(/href\s*=\s*["']\s*data:text\/html[\s\S]*?["']/gi, 'href="#"');
    clean = clean.replace(/xlink:href\s*=\s*["']\s*data:text\/html[\s\S]*?["']/gi, 'xlink:href="#"');

    // 5. Clean style blocks
    clean = clean.replace(/<style[\s\S]*?<\/style>/gi, (styleTag) => {
      return styleTag
        .replace(/expression\s*\(.*?\)/gi, 'none')
        .replace(/behavior\s*:.*?;/gi, '')
        .replace(/@import[\s\S]*?;/gi, '')
        .replace(/url\s*\(\s*["']?\s*javascript:[\s\S]*?\)/gi, 'none');
    });

    return clean.trim();
  }

  /**
   * Safely injects sanitized SVG into a DOM container
   * @param {HTMLElement} container
   * @param {string} svgContent
   */
  static safeInject(container, svgContent) {
    if (!container) return;
    const sanitized = this.sanitize(svgContent);
    container.innerHTML = sanitized;
  }
}
