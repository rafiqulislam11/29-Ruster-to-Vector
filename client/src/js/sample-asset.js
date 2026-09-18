/**
 * CreativeForge AI — Sample Artwork Generator
 * Creates a beautiful initial showcase graphic with geometric shapes,
 * vibrant gradients, and high-frequency details to immediately demonstrate all studio tools.
 */

export function createSampleArtwork() {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 800;
  const ctx = canvas.getContext('2d');

  // Deep obsidian backdrop
  ctx.fillStyle = '#0a0b12';
  ctx.fillRect(0, 0, 1200, 800);

  // Background gradient orbs
  const orb1 = ctx.createRadialGradient(300, 250, 0, 300, 250, 450);
  orb1.addColorStop(0, 'rgba(99, 102, 241, 0.55)');
  orb1.addColorStop(0.6, 'rgba(6, 182, 212, 0.2)');
  orb1.addColorStop(1, 'transparent');
  ctx.fillStyle = orb1;
  ctx.fillRect(0, 0, 1200, 800);

  const orb2 = ctx.createRadialGradient(900, 550, 0, 900, 550, 400);
  orb2.addColorStop(0, 'rgba(236, 72, 153, 0.45)');
  orb2.addColorStop(0.7, 'rgba(139, 92, 246, 0.15)');
  orb2.addColorStop(1, 'transparent');
  ctx.fillStyle = orb2;
  ctx.fillRect(0, 0, 1200, 800);

  // Center Geometric Creative Icon Mark
  const cx = 600;
  const cy = 400;

  // Outer prism hexagon
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(Math.PI / 6);

  const hexGrad = ctx.createLinearGradient(-180, -180, 180, 180);
  hexGrad.addColorStop(0, '#06b6d4');
  hexGrad.addColorStop(0.5, '#6366f1');
  hexGrad.addColorStop(1, '#ec4899');

  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3;
    const x = Math.cos(angle) * 190;
    const y = Math.sin(angle) * 190;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fillStyle = hexGrad;
  ctx.shadowColor = 'rgba(99, 102, 241, 0.5)';
  ctx.shadowBlur = 40;
  ctx.fill();
  ctx.restore();

  // Inner floating crystal diamond
  ctx.save();
  ctx.translate(cx, cy);
  const diamondGrad = ctx.createLinearGradient(-100, -100, 100, 100);
  diamondGrad.addColorStop(0, '#ffffff');
  diamondGrad.addColorStop(0.4, '#a5f3fc');
  diamondGrad.addColorStop(1, '#818cf8');

  ctx.beginPath();
  ctx.moveTo(0, -130);
  ctx.lineTo(100, 0);
  ctx.lineTo(0, 130);
  ctx.lineTo(-100, 0);
  ctx.closePath();
  ctx.fillStyle = diamondGrad;
  ctx.shadowColor = 'rgba(6, 182, 212, 0.7)';
  ctx.shadowBlur = 30;
  ctx.fill();

  // Facet cuts
  ctx.beginPath();
  ctx.moveTo(0, -130);
  ctx.lineTo(0, 130);
  ctx.moveTo(-100, 0);
  ctx.lineTo(100, 0);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Modern typography
  ctx.restore();
  ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
  ctx.shadowBlur = 10;
  ctx.fillText('CREATIVEFORGE AI', cx, cy + 220);

  ctx.font = '600 16px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#22d3ee';
  ctx.letterSpacing = '3px';
  ctx.fillText('STUDIO MASTER ASSET', cx, cy + 255);

  const img = new Image();
  img.src = canvas.toDataURL('image/png');
  return { canvas, img };
}
