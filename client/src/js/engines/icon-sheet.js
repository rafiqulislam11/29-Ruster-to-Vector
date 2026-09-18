/**
 * CreativeForge AI — Professional Icon Sheet Generator
 * Generates 3 distinct layout presets: Minimal Grid, Marketplace Layout, and Presentation Sheet.
 */

export class IconSheetEngine {
  static layouts = {
    '1': {
      name: 'Icon Sheet 1 (Minimal Grid)',
      columns: 4,
      rows: 4,
      padding: 16,
      margin: 24,
      iconSize: 64,
      background: 'transparent',
      showBorder: false,
      cardBg: 'transparent'
    },
    '2': {
      name: 'Icon Sheet 2 (Professional Marketplace)',
      columns: 4,
      rows: 3,
      padding: 24,
      margin: 40,
      iconSize: 80,
      background: '#0f1117',
      showBorder: true,
      cardBg: '#181b24',
      badge: 'MARKETPLACE READY'
    },
    '3': {
      name: 'Icon Sheet 3 (Premium Presentation Sheet)',
      columns: 3,
      rows: 2,
      padding: 36,
      margin: 48,
      iconSize: 96,
      background: 'linear-gradient(135deg, #111319 0%, #1e1b2e 100%)',
      showBorder: true,
      cardBg: 'rgba(255, 255, 255, 0.04)',
      accentGlow: true
    }
  };

  /**
   * Render an icon sheet onto a canvas
   * @param {Array<HTMLImageElement|HTMLCanvasElement>} iconSources
   * @param {string} layoutKey '1' | '2' | '3'
   * @param {Object} customSettings
   * @returns {HTMLCanvasElement}
   */
  static render(iconSources, layoutKey = '1', customSettings = {}) {
    const defaultLayout = this.layouts[layoutKey] || this.layouts['1'];
    const s = { ...defaultLayout, ...customSettings };

    const cols = parseInt(s.columns || 4, 10);
    const rows = parseInt(s.rows || Math.ceil((iconSources.length || 16) / cols), 10);
    const iconSize = parseInt(s.iconSize || 72, 10);
    const padding = parseInt(s.padding || 20, 10);
    const margin = parseInt(s.margin || 30, 10);

    const cellWidth = iconSize + padding * 2;
    const cellHeight = iconSize + padding * 2 + (s.showLabels ? 24 : 0);

    const sheetWidth = cols * cellWidth + margin * 2;
    const sheetHeight = rows * cellHeight + margin * 2 + (layoutKey === '3' ? 60 : 0);

    const canvas = document.createElement('canvas');
    canvas.width = sheetWidth;
    canvas.height = sheetHeight;
    const ctx = canvas.getContext('2d');

    // 1. Draw Background
    if (s.background && s.background !== 'transparent') {
      if (s.background.includes('gradient')) {
        const grad = ctx.createLinearGradient(0, 0, sheetWidth, sheetHeight);
        grad.addColorStop(0, '#10121a');
        grad.addColorStop(1, '#1c192d');
        ctx.fillStyle = grad;
      } else {
        ctx.fillStyle = s.background;
      }
      ctx.fillRect(0, 0, sheetWidth, sheetHeight);
    }

    // 2. Presentation header for Preset 3
    let startYOffset = margin;
    if (layoutKey === '3') {
      ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('CREATIVEFORGE ICON SYSTEM', margin, margin + 24);
      ctx.font = '12px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(`${cols}x${rows} Vector Spec • Non-destructive Asset Suite`, margin, margin + 46);
      startYOffset += 60;
    }

    // 3. Render icons onto grid
    let iconIndex = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = margin + c * cellWidth;
        const y = startYOffset + r * cellHeight;

        // Draw card frame if layout enables it
        if (s.showBorder || s.cardBg !== 'transparent') {
          ctx.save();
          ctx.fillStyle = s.cardBg || 'transparent';
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
          ctx.lineWidth = 1;

          // Rounded rectangle card
          this.roundRect(ctx, x + 4, y + 4, cellWidth - 8, cellHeight - 8, 8, true, s.showBorder);
          ctx.restore();
        }

        // Draw icon image
        const iconSrc = iconSources[iconIndex % iconSources.length];
        if (iconSrc) {
          const drawX = x + (cellWidth - iconSize) / 2;
          const drawY = y + padding;
          ctx.drawImage(iconSrc, drawX, drawY, iconSize, iconSize);

          if (s.showLabels) {
            ctx.font = '11px monospace';
            ctx.fillStyle = '#94a3b8';
            ctx.textAlign = 'center';
            ctx.fillText(`icon_${String(iconIndex + 1).padStart(2, '0')}`, x + cellWidth / 2, y + cellHeight - 10);
            ctx.textAlign = 'start';
          }
        }

        iconIndex++;
      }
    }

    return canvas;
  }

  static roundRect(ctx, x, y, w, h, r, fill, stroke) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    if (fill) ctx.fill();
    if (stroke) ctx.stroke();
  }
}
