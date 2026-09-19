/**
 * RI Raster to Vector PRO — Strict SVG Sanitization & Security Engine
 * Defends against XSS, XXE, arbitrary script injection, and unsafe external entity references.
 */

class SvgSanitizer {
  /**
   * Sanitizes SVG string by removing executable scripts, event handlers,
   * XXE doctypes, and unsafe external references.
   * @param {string} rawSvg
   * @returns {string} Sanitized clean SVG string
   */
  static sanitize(rawSvg) {
    if (!rawSvg || typeof rawSvg !== 'string') return '';

    let clean = rawSvg;

    // 1. Remove XML External Entity (XXE) and DOCTYPE declarations with external references
    clean = clean.replace(/<!DOCTYPE[\s\S]*?\]>/gi, '');
    clean = clean.replace(/<!DOCTYPE[\s\S]*?>/gi, '');
    clean = clean.replace(/<!ENTITY[\s\S]*?>/gi, '');

    // 2. Strip <script> tags and any contents
    clean = clean.replace(/<script[\s\S]*?<\/script>/gi, '');
    clean = clean.replace(/<script[\s\S]*?\/>/gi, '');

    // 3. Strip dangerous <foreignObject> contents that may embed HTML/JS
    clean = clean.replace(/<foreignObject[\s\S]*?<\/foreignObject>/gi, '');
    clean = clean.replace(/<foreignObject[\s\S]*?\/>/gi, '');

    // 4. Strip <embed>, <object>, <iframe>, <audio>, <video>
    clean = clean.replace(/<(?:embed|object|iframe|audio|video)[\s\S]*?<\/(?:embed|object|iframe|audio|video)>/gi, '');
    clean = clean.replace(/<(?:embed|object|iframe|audio|video)[\s\S]*?\/>/gi, '');

    // 5. Remove all inline javascript: URLs in href and xlink:href
    clean = clean.replace(/href\s*=\s*["']\s*javascript:[\s\S]*?["']/gi, 'href="#"');
    clean = clean.replace(/xlink:href\s*=\s*["']\s*javascript:[\s\S]*?["']/gi, 'xlink:href="#"');
    clean = clean.replace(/href\s*=\s*["']\s*data:text\/html[\s\S]*?["']/gi, 'href="#"');
    clean = clean.replace(/xlink:href\s*=\s*["']\s*data:text\/html[\s\S]*?["']/gi, 'xlink:href="#"');

    // 6. Remove all inline event handlers (onload, onclick, onerror, onmouseover, etc.)
    clean = clean.replace(/\son[a-zA-Z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '');

    // 7. Strip css expressions and javascript behaviors inside style tags
    clean = clean.replace(/<style[\s\S]*?<\/style>/gi, (styleTag) => {
      let safeStyle = styleTag.replace(/expression\s*\(.*?\)/gi, 'none');
      safeStyle = safeStyle.replace(/behavior\s*:.*?;/gi, '');
      safeStyle = safeStyle.replace(/@import[\s\S]*?;/gi, '');
      safeStyle = safeStyle.replace(/url\s*\(\s*["']?\s*javascript:[\s\S]*?\)/gi, 'none');
      return safeStyle;
    });

    // 8. Ensure root SVG exists
    const hasSvgTag = /<svg[\s\S]*?>/i.test(clean);
    if (!hasSvgTag) {
      return '';
    }

    return clean.trim();
  }

  /**
   * Validates if a string represents valid, non-empty, and secure SVG markup
   * @param {string} svgContent
   * @returns {{ valid: boolean, errors: string[], pathCount: number }}
   */
  static validate(svgContent) {
    const errors = [];
    if (!svgContent || typeof svgContent !== 'string') {
      return { valid: false, errors: ['SVG content is empty or invalid type'], pathCount: 0 };
    }

    if (!svgContent.includes('<svg') || !svgContent.includes('</svg>')) {
      errors.push('Missing opening or closing <svg> tag');
    }

    if (/<script/i.test(svgContent)) {
      errors.push('Unsafe <script> tag detected');
    }

    if (/\son[a-zA-Z]+\s*=/i.test(svgContent)) {
      errors.push('Unsafe event handler attribute detected');
    }

    if (/javascript:/i.test(svgContent)) {
      errors.push('Unsafe javascript: protocol detected');
    }

    // Count paths and geometry elements
    const pathMatches = svgContent.match(/<path[\s\S]*?>/gi) || [];
    const polygonMatches = svgContent.match(/<(?:polygon|polyline|rect|circle|ellipse)[\s\S]*?>/gi) || [];
    const totalGeometry = pathMatches.length + polygonMatches.length;

    if (totalGeometry === 0) {
      errors.push('SVG contains zero vector geometry paths or shapes');
    }

    return {
      valid: errors.length === 0,
      errors,
      pathCount: pathMatches.length,
      totalShapes: totalGeometry
    };
  }
}

module.exports = SvgSanitizer;
