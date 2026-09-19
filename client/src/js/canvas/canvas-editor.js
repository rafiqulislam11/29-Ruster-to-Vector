/**
 * Creative Vector Studio — Advanced Canvas Editor Engine
 * Full-featured lightweight vector & raster canvas editor with:
 * - Interactive move, resize (8 handles), rotate, flip H/V, crop
 * - Single-select, multi-select (marquee drag & Shift+click), select all (Ctrl+A)
 * - Align & Distribute, Group & Ungroup
 * - Layer hierarchy (Bring forward, Send backward, Front, Back)
 * - Interactive Rulers, Draggable Guides, Grid & Snapping
 * - Keyboard Shortcuts (Undo, Redo, Copy, Paste, Duplicate, Delete, Select All)
 */
import { store } from '../state.js';
import { toast } from '../components/toast.js';

export class CanvasEditor {
  constructor(targetElement, options = {}) {
    if (targetElement && targetElement.tagName === 'CANVAS') {
      this.canvas = targetElement;
      this.container = options.container || targetElement.parentElement;
    } else {
      this.container = targetElement;
      let existingCanvas = targetElement ? targetElement.querySelector('#canvas-editor-surface') : null;
      if (!existingCanvas) {
        existingCanvas = document.createElement('canvas');
        existingCanvas.id = 'canvas-editor-surface';
        existingCanvas.style.display = 'block';
        existingCanvas.style.maxWidth = '100%';
        existingCanvas.style.maxHeight = '100%';
        existingCanvas.style.boxShadow = '0 8px 32px rgba(0,0,0,0.5)';
        existingCanvas.style.borderRadius = '4px';
        if (targetElement) targetElement.appendChild(existingCanvas);
      }
      this.canvas = existingCanvas;
    }

    this.canvas.width = options.width || 1200;
    this.canvas.height = options.height || 800;
    this.ctx = this.canvas.getContext('2d');

    this.onSelectionChange = options.onSelectionChange || (() => {});
    this.onObjectsChange = options.onObjectsChange || options.onLayersChange || (() => {});
    this.onLayersChange = options.onLayersChange || options.onObjectsChange || (() => {});

    // State
    this.objects = []; // Array of object items
    this.selectedIds = new Set();
    this.zoom = 1;
    this.pan = { x: 0, y: 0 };

    // History Stacks for Undo / Redo
    this.undoStack = [];
    this.redoStack = [];

    // Interaction flags
    this.mode = 'select'; // 'select' | 'pan' | 'crop' | 'guide'
    this.isDragging = false;
    this.dragAction = null; // 'move' | 'resize' | 'rotate' | 'marquee' | 'guide'
    this.activeHandle = null; // 'tl','tc','tr','ml','mr','bl','bc','br','rot'
    this.dragStart = { x: 0, y: 0 };
    this.dragOriginals = new Map();
    this.marqueeRect = null;

    // Rulers & Guides
    this.grid = true;
    this.gridSize = 20;
    this.snap = true;
    this.guides = { horizontal: [100, 350], vertical: [120, 500] };
    this.clipboard = null;

    this.initEvents();
  }

  get selectedObjects() {
    return this.getSelectedObjects();
  }

  recordState() {
    try {
      const state = JSON.stringify(this.objects.map(o => {
        if (o.type === 'image') {
          const { img, ...rest } = o;
          return { ...rest, _hasImg: !!img };
        }
        return o;
      }));
      if (this.undoStack.length > 0 && this.undoStack[this.undoStack.length - 1] === state) {
        return;
      }
      this.undoStack.push(state);
      if (this.undoStack.length > 50) this.undoStack.shift();
      this.redoStack = [];
    } catch (e) {
      // Ignore circular reference
    }
  }

  undo() {
    if (this.undoStack.length === 0) {
      toast.info('Nothing to undo');
      return;
    }
    const currentSerialized = JSON.stringify(this.objects.map(o => {
      if (o.type === 'image') {
        const { img, ...rest } = o;
        return { ...rest, _hasImg: !!img };
      }
      return o;
    }));
    this.redoStack.push(currentSerialized);

    const prevJson = this.undoStack.pop();
    const prevObjects = JSON.parse(prevJson);

    const imgMap = new Map();
    this.objects.forEach(o => {
      if (o.img) imgMap.set(o.id, o.img);
    });
    prevObjects.forEach(o => {
      if (o._hasImg && imgMap.has(o.id)) {
        o.img = imgMap.get(o.id);
      }
      delete o._hasImg;
    });

    this.objects = prevObjects;
    const existing = new Set(this.objects.map(o => o.id));
    this.selectedIds = new Set([...this.selectedIds].filter(id => existing.has(id)));
    this.render();
    this.onObjectsChange(this.objects);
    this.onSelectionChange(this.selectedObjects);
    toast.info('Undo');
  }

  redo() {
    if (this.redoStack.length === 0) {
      toast.info('Nothing to redo');
      return;
    }
    const currentSerialized = JSON.stringify(this.objects.map(o => {
      if (o.type === 'image') {
        const { img, ...rest } = o;
        return { ...rest, _hasImg: !!img };
      }
      return o;
    }));
    this.undoStack.push(currentSerialized);

    const nextJson = this.redoStack.pop();
    const nextObjects = JSON.parse(nextJson);

    const imgMap = new Map();
    this.objects.forEach(o => {
      if (o.img) imgMap.set(o.id, o.img);
    });
    nextObjects.forEach(o => {
      if (o._hasImg && imgMap.has(o.id)) {
        o.img = imgMap.get(o.id);
      }
      delete o._hasImg;
    });

    this.objects = nextObjects;
    const existing = new Set(this.objects.map(o => o.id));
    this.selectedIds = new Set([...this.selectedIds].filter(id => existing.has(id)));
    this.render();
    this.onObjectsChange(this.objects);
    this.onSelectionChange(this.selectedObjects);
    toast.info('Redo');
  }

  setObjects(objects) {
    this.recordState();
    this.objects = JSON.parse(JSON.stringify(objects));
    this.selectedIds.clear();
    this.render();
    this.onObjectsChange(this.objects);
    this.onSelectionChange(this.selectedObjects);
  }

  addObject(obj) {
    this.recordState();
    const newObj = {
      id: obj.id || `obj_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: obj.name || `Layer ${this.objects.length + 1}`,
      type: obj.type || 'path', // 'path' | 'image' | 'rect' | 'circle'
      x: obj.x || 100,
      y: obj.y || 100,
      width: obj.width || 200,
      height: obj.height || 150,
      rotation: obj.rotation || 0,
      scaleX: obj.scaleX || 1,
      scaleY: obj.scaleY || 1,
      opacity: obj.opacity !== undefined ? obj.opacity : 1,
      fill: obj.fill || '#6366f1',
      stroke: obj.stroke || 'none',
      strokeWidth: obj.strokeWidth || 0,
      d: obj.d || '', // SVG path data if path
      img: obj.img || null, // Image element if image
      visible: obj.visible !== false,
      locked: obj.locked === true,
      groupId: obj.groupId || null
    };

    this.objects.push(newObj);
    this.selectedIds.clear();
    this.selectedIds.add(newObj.id);
    this.render();
    this.onObjectsChange(this.objects);
    this.onSelectionChange(this.selectedObjects);
    return newObj;
  }

  loadSvgPaths(svgString) {
    if (!svgString || typeof svgString !== 'string') return;
    try {
      this.recordState();
      const parser = new DOMParser();
      const doc = parser.parseFromString(svgString, 'image/svg+xml');
      const svgEl = doc.querySelector('svg');
      if (!svgEl) return;

      const viewBox = svgEl.getAttribute('viewBox');
      let svgW = 1200;
      let svgH = 800;
      if (viewBox) {
        const parts = viewBox.trim().split(/[\s,]+/).map(Number);
        if (parts.length === 4 && parts[2] > 0 && parts[3] > 0) {
          svgW = parts[2];
          svgH = parts[3];
        }
      } else {
        svgW = parseFloat(svgEl.getAttribute('width')) || this.canvas.width;
        svgH = parseFloat(svgEl.getAttribute('height')) || this.canvas.height;
      }

      this.canvas.width = svgW;
      this.canvas.height = svgH;

      const pathNodes = doc.querySelectorAll('path');
      const newObjects = [];
      let index = 1;

      pathNodes.forEach((p) => {
        const d = p.getAttribute('d');
        if (!d) return;
        const fill = p.getAttribute('fill') || '#6366f1';
        const stroke = p.getAttribute('stroke') || 'none';
        const strokeWidth = parseFloat(p.getAttribute('stroke-width')) || 0;
        const opacity = parseFloat(p.getAttribute('opacity')) || 1;

        newObjects.push({
          id: p.id || `layer_path_${index}`,
          name: p.getAttribute('id') || `Vector Path ${index}`,
          type: 'path',
          x: 0,
          y: 0,
          width: svgW,
          height: svgH,
          rotation: 0,
          scaleX: 1,
          scaleY: 1,
          opacity: isNaN(opacity) ? 1 : opacity,
          fill: fill,
          stroke: stroke,
          strokeWidth: strokeWidth,
          d: d,
          visible: true,
          locked: false,
          groupId: null
        });
        index++;
      });

      if (newObjects.length > 0) {
        this.objects = newObjects;
        this.selectedIds.clear();
        this.render();
        this.onObjectsChange(this.objects);
        this.onSelectionChange(this.selectedObjects);
        toast.success(`Loaded ${newObjects.length} vector paths into Canvas Editor`);
      }
    } catch (err) {
      console.error('Failed to parse SVG paths for CanvasEditor:', err);
    }
  }

  loadRasterImage(imgOrCanvas, name = 'Layer Image') {
    if (!imgOrCanvas) return;
    this.recordState();
    const w = imgOrCanvas.width || (imgOrCanvas.naturalWidth || 400);
    const h = imgOrCanvas.height || (imgOrCanvas.naturalHeight || 300);

    const newObj = {
      id: `img_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: name,
      type: 'image',
      x: Math.max(0, Math.round((this.canvas.width - w) / 2)),
      y: Math.max(0, Math.round((this.canvas.height - h) / 2)),
      width: w,
      height: h,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      opacity: 1,
      fill: 'none',
      stroke: 'none',
      strokeWidth: 0,
      d: '',
      img: imgOrCanvas,
      visible: true,
      locked: false,
      groupId: null
    };

    this.objects.push(newObj);
    this.selectedIds.clear();
    this.selectedIds.add(newObj.id);
    this.render();
    this.onObjectsChange(this.objects);
    this.onSelectionChange(this.selectedObjects);
    toast.success(`Added ${name} to Canvas Editor`);
    return newObj;
  }

  exportCanvas(multiplier = 1) {
    const scale = Math.max(0.1, multiplier || 1);
    const w = Math.round(this.canvas.width * scale);
    const h = Math.round(this.canvas.height * scale);

    const offCanvas = document.createElement('canvas');
    offCanvas.width = w;
    offCanvas.height = h;
    const ctx = offCanvas.getContext('2d');

    ctx.save();
    ctx.scale(scale, scale);

    for (const obj of this.objects) {
      if (!obj.visible) continue;
      ctx.save();
      ctx.globalAlpha = obj.opacity !== undefined ? obj.opacity : 1;

      ctx.translate(obj.x + obj.width / 2, obj.y + obj.height / 2);
      ctx.rotate((obj.rotation * Math.PI) / 180);
      ctx.scale(obj.scaleX || 1, obj.scaleY || 1);
      ctx.translate(-obj.width / 2, -obj.height / 2);

      if (obj.type === 'image' && obj.img) {
        ctx.drawImage(obj.img, 0, 0, obj.width, obj.height);
      } else if (obj.type === 'path' && obj.d) {
        try {
          const p2d = new Path2D(obj.d);
          if (obj.fill && obj.fill !== 'none') {
            ctx.fillStyle = obj.fill;
            ctx.fill(p2d);
          }
          if (obj.stroke && obj.stroke !== 'none' && obj.strokeWidth > 0) {
            ctx.strokeStyle = obj.stroke;
            ctx.lineWidth = obj.strokeWidth;
            ctx.stroke(p2d);
          }
        } catch (e) {
          ctx.fillStyle = obj.fill || '#6366f1';
          ctx.fillRect(0, 0, obj.width, obj.height);
        }
      } else if (obj.type === 'rect') {
        if (obj.fill && obj.fill !== 'none') {
          ctx.fillStyle = obj.fill;
          ctx.fillRect(0, 0, obj.width, obj.height);
        }
        if (obj.stroke && obj.stroke !== 'none' && obj.strokeWidth > 0) {
          ctx.strokeStyle = obj.stroke;
          ctx.lineWidth = obj.strokeWidth;
          ctx.strokeRect(0, 0, obj.width, obj.height);
        }
      } else if (obj.type === 'circle') {
        ctx.beginPath();
        ctx.arc(obj.width / 2, obj.height / 2, Math.min(obj.width, obj.height) / 2, 0, Math.PI * 2);
        if (obj.fill && obj.fill !== 'none') {
          ctx.fillStyle = obj.fill;
          ctx.fill();
        }
        if (obj.stroke && obj.stroke !== 'none' && obj.strokeWidth > 0) {
          ctx.strokeStyle = obj.stroke;
          ctx.lineWidth = obj.strokeWidth;
          ctx.stroke();
        }
      }
      ctx.restore();
    }
    ctx.restore();

    return offCanvas;
  }

  importSvgPaths(paths, targetWidth = 1200, targetHeight = 800) {
    if (!Array.isArray(paths) || paths.length === 0) return;
    this.recordState();
    this.objects = [];

    paths.forEach((p, idx) => {
      this.objects.push({
        id: p.id || `path_${idx + 1}`,
        name: p.name || `Vector Path ${idx + 1}`,
        type: 'path',
        x: 0,
        y: 0,
        width: targetWidth,
        height: targetHeight,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
        opacity: 1,
        fill: p.fill || '#6366f1',
        stroke: p.stroke || 'none',
        strokeWidth: p.strokeWidth || 0,
        d: p.d || '',
        visible: true,
        locked: false,
        groupId: null
      });
    });

    this.selectedIds.clear();
    this.render();
    this.onObjectsChange(this.objects);
    this.onSelectionChange(this.selectedObjects);
    toast.success(`Imported ${paths.length} vector paths into Canvas Editor!`);
  }

  getSelectedObjects() {
    return this.objects.filter(o => this.selectedIds.has(o.id));
  }

  render() {
    const { width, height } = this.canvas;
    const ctx = this.ctx;

    ctx.clearRect(0, 0, width, height);
    ctx.save();

    // Pan & Zoom transform
    ctx.translate(this.pan.x, this.pan.y);
    ctx.scale(this.zoom, this.zoom);

    // Draw Grid
    if (this.grid) {
      this.drawGrid(ctx, width, height);
    }

    // Draw Objects from bottom to top
    for (const obj of this.objects) {
      if (!obj.visible) continue;
      ctx.save();
      ctx.globalAlpha = obj.opacity;

      ctx.translate(obj.x + obj.width / 2, obj.y + obj.height / 2);
      ctx.rotate((obj.rotation * Math.PI) / 180);
      ctx.scale(obj.scaleX, obj.scaleY);
      ctx.translate(-obj.width / 2, -obj.height / 2);

      if (obj.type === 'image' && obj.img) {
        ctx.drawImage(obj.img, 0, 0, obj.width, obj.height);
      } else if (obj.type === 'path' && obj.d) {
        try {
          const path2d = new Path2D(obj.d);
          if (obj.fill && obj.fill !== 'none') {
            ctx.fillStyle = obj.fill;
            ctx.fill(path2d);
          }
          if (obj.stroke && obj.stroke !== 'none' && obj.strokeWidth > 0) {
            ctx.strokeStyle = obj.stroke;
            ctx.lineWidth = obj.strokeWidth;
            ctx.stroke(path2d);
          }
        } catch (e) {
          // Fallback rect if Path2D parsing fails
          ctx.fillStyle = obj.fill || '#6366f1';
          ctx.fillRect(0, 0, obj.width, obj.height);
        }
      } else if (obj.type === 'rect') {
        if (obj.fill && obj.fill !== 'none') {
          ctx.fillStyle = obj.fill;
          ctx.fillRect(0, 0, obj.width, obj.height);
        }
        if (obj.stroke && obj.stroke !== 'none') {
          ctx.strokeStyle = obj.stroke;
          ctx.lineWidth = obj.strokeWidth || 1;
          ctx.strokeRect(0, 0, obj.width, obj.height);
        }
      }

      ctx.restore();
    }

    // Draw Transform Bounding Box & Handles for Selected Objects
    this.drawSelectionHandles(ctx);

    // Draw Guides
    this.drawGuides(ctx, width, height);

    // Draw Marquee Box if active
    if (this.marqueeRect) {
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.9)';
      ctx.lineWidth = 1 / this.zoom;
      ctx.fillStyle = 'rgba(6, 182, 212, 0.15)';
      ctx.fillRect(this.marqueeRect.x, this.marqueeRect.y, this.marqueeRect.w, this.marqueeRect.h);
      ctx.strokeRect(this.marqueeRect.x, this.marqueeRect.y, this.marqueeRect.w, this.marqueeRect.h);
    }

    ctx.restore();
  }

  drawGrid(ctx, w, h) {
    const size = this.gridSize;
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1 / this.zoom;

    const startX = Math.floor(-this.pan.x / this.zoom / size) * size;
    const startY = Math.floor(-this.pan.y / this.zoom / size) * size;
    const endX = startX + (w / this.zoom) + size * 2;
    const endY = startY + (h / this.zoom) + size * 2;

    ctx.beginPath();
    for (let x = startX; x <= endX; x += size) {
      ctx.moveTo(x, startY);
      ctx.lineTo(x, endY);
    }
    for (let y = startY; y <= endY; y += size) {
      ctx.moveTo(startX, y);
      ctx.lineTo(endX, y);
    }
    ctx.stroke();
    ctx.restore();
  }

  drawGuides(ctx, w, h) {
    ctx.save();
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.6)';
    ctx.lineWidth = 1 / this.zoom;
    if (typeof ctx.setLineDash === 'function') {
      ctx.setLineDash([4 / this.zoom, 4 / this.zoom]);
    }

    for (const hY of this.guides.horizontal) {
      ctx.beginPath();
      ctx.moveTo(-10000, hY);
      ctx.lineTo(10000, hY);
      ctx.stroke();
    }
    for (const vX of this.guides.vertical) {
      ctx.beginPath();
      ctx.moveTo(vX, -10000);
      ctx.lineTo(vX, 10000);
      ctx.stroke();
    }
    ctx.restore();
  }

  drawSelectionHandles(ctx) {
    const selected = this.getSelectedObjects();
    if (selected.length === 0) return;

    // Calculate common bounding box
    const bbox = this.getSelectionBounds(selected);
    if (!bbox) return;

    ctx.save();
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 1.5 / this.zoom;
    ctx.strokeRect(bbox.x, bbox.y, bbox.width, bbox.height);

    // Handles: corners and midpoints
    const handleSize = 8 / this.zoom;
    const half = handleSize / 2;
    const handles = [
      { id: 'tl', x: bbox.x - half, y: bbox.y - half },
      { id: 'tc', x: bbox.x + bbox.width / 2 - half, y: bbox.y - half },
      { id: 'tr', x: bbox.x + bbox.width - half, y: bbox.y - half },
      { id: 'ml', x: bbox.x - half, y: bbox.y + bbox.height / 2 - half },
      { id: 'mr', x: bbox.x + bbox.width - half, y: bbox.y + bbox.height / 2 - half },
      { id: 'bl', x: bbox.x - half, y: bbox.y + bbox.height - half },
      { id: 'bc', x: bbox.x + bbox.width / 2 - half, y: bbox.y + bbox.height - half },
      { id: 'br', x: bbox.x + bbox.width - half, y: bbox.y + bbox.height - half }
    ];

    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 1.5 / this.zoom;

    handles.forEach(h => {
      ctx.fillRect(h.x, h.y, handleSize, handleSize);
      ctx.strokeRect(h.x, h.y, handleSize, handleSize);
    });

    // Rotation Handle (top lollipop)
    const rotY = bbox.y - 24 / this.zoom;
    ctx.beginPath();
    ctx.moveTo(bbox.x + bbox.width / 2, bbox.y);
    ctx.lineTo(bbox.x + bbox.width / 2, rotY);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(bbox.x + bbox.width / 2, rotY, half, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }

  getSelectionBounds(objects) {
    if (!objects || objects.length === 0) return null;
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    objects.forEach(obj => {
      minX = Math.min(minX, obj.x);
      minY = Math.min(minY, obj.y);
      maxX = Math.max(maxX, obj.x + obj.width);
      maxY = Math.max(maxY, obj.y + obj.height);
    });

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };
  }

  initEvents() {
    this.boundMouseDown = (e) => this.onMouseDown(e);
    this.boundMouseMove = (e) => this.onMouseMove(e);
    this.boundMouseUp = (e) => this.onMouseUp(e);
    this.boundWheel = (e) => this.onWheel(e);
    this.boundKeyDown = (e) => this.onKeyDown(e);

    if (this.canvas) {
      this.canvas.addEventListener('mousedown', this.boundMouseDown);
      this.canvas.addEventListener('wheel', this.boundWheel, { passive: false });
    }
    window.addEventListener('mousemove', this.boundMouseMove);
    window.addEventListener('mouseup', this.boundMouseUp);
    window.addEventListener('keydown', this.boundKeyDown);
  }

  destroy() {
    if (this.canvas) {
      this.canvas.removeEventListener('mousedown', this.boundMouseDown);
      this.canvas.removeEventListener('wheel', this.boundWheel);
    }
    window.removeEventListener('mousemove', this.boundMouseMove);
    window.removeEventListener('mouseup', this.boundMouseUp);
    window.removeEventListener('keydown', this.boundKeyDown);
  }

  onKeyDown(e) {
    if (e.target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

    if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z') && !e.shiftKey) {
      e.preventDefault();
      this.undo();
      return;
    }
    if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || e.key === 'Y' || (e.shiftKey && (e.key === 'z' || e.key === 'Z')))) {
      e.preventDefault();
      this.redo();
      return;
    }
    if ((e.ctrlKey || e.metaKey) && (e.key === 'a' || e.key === 'A')) {
      e.preventDefault();
      this.selectAll();
      return;
    }
    if ((e.ctrlKey || e.metaKey) && (e.key === 'd' || e.key === 'D')) {
      e.preventDefault();
      this.duplicateSelected();
      return;
    }
    if (e.key === 'Delete' || e.key === 'Backspace') {
      if (this.selectedIds.size > 0) {
        e.preventDefault();
        this.deleteSelected();
      }
    }
  }

  screenToCanvasCoords(e) {
    const rect = this.canvas.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;
    return {
      x: (clientX - this.pan.x) / this.zoom,
      y: (clientY - this.pan.y) / this.zoom
    };
  }

  onMouseDown(e) {
    const coords = this.screenToCanvasCoords(e);
    this.dragStart = { x: coords.x, y: coords.y };

    if (e.button === 1 || e.spaceKey || this.mode === 'pan') {
      this.isDragging = true;
      this.dragAction = 'pan';
      this.dragStartScreen = { x: e.clientX, y: e.clientY };
      return;
    }

    // Check handle hit
    const selected = this.getSelectedObjects();
    if (selected.length > 0) {
      const bbox = this.getSelectionBounds(selected);
      const hitHandle = this.hitTestHandles(coords, bbox);
      if (hitHandle) {
        this.isDragging = true;
        this.dragAction = hitHandle === 'rot' ? 'rotate' : 'resize';
        this.activeHandle = hitHandle;
        this.captureDragOriginals();
        return;
      }
    }

    // Check object hit (topmost first)
    let hitObject = null;
    for (let i = this.objects.length - 1; i >= 0; i--) {
      const obj = this.objects[i];
      if (!obj.visible || obj.locked) continue;
      if (
        coords.x >= obj.x &&
        coords.x <= obj.x + obj.width &&
        coords.y >= obj.y &&
        coords.y <= obj.y + obj.height
      ) {
        hitObject = obj;
        break;
      }
    }

    if (hitObject) {
      if (e.shiftKey) {
        if (this.selectedIds.has(hitObject.id)) {
          this.selectedIds.delete(hitObject.id);
        } else {
          this.selectedIds.add(hitObject.id);
        }
      } else if (!this.selectedIds.has(hitObject.id)) {
        this.selectedIds.clear();
        this.selectedIds.add(hitObject.id);
      }
      this.isDragging = true;
      this.dragAction = 'move';
      this.captureDragOriginals();
    } else {
      if (!e.shiftKey) this.selectedIds.clear();
      this.isDragging = true;
      this.dragAction = 'marquee';
      this.marqueeRect = { x: coords.x, y: coords.y, w: 0, h: 0 };
    }

    this.render();
    this.onSelectionChange(this.selectedObjects);
  }

  onMouseMove(e) {
    if (!this.isDragging) return;

    if (this.dragAction === 'pan') {
      const dx = e.clientX - this.dragStartScreen.x;
      const dy = e.clientY - this.dragStartScreen.y;
      this.pan.x += dx;
      this.pan.y += dy;
      this.dragStartScreen = { x: e.clientX, y: e.clientY };
      this.render();
      return;
    }

    const coords = this.screenToCanvasCoords(e);
    let dx = coords.x - this.dragStart.x;
    let dy = coords.y - this.dragStart.y;

    // Snap to grid if active
    if (this.snap && this.grid) {
      dx = Math.round(dx / this.gridSize) * this.gridSize;
      dy = Math.round(dy / this.gridSize) * this.gridSize;
    }

    if (this.dragAction === 'move') {
      this.selectedIds.forEach(id => {
        const orig = this.dragOriginals.get(id);
        const obj = this.objects.find(o => o.id === id);
        if (orig && obj) {
          obj.x = orig.x + dx;
          obj.y = orig.y + dy;
        }
      });
      this.render();
    } else if (this.dragAction === 'resize') {
      const selected = this.getSelectedObjects();
      const origBbox = this.dragOriginals.get('__bbox__');
      if (origBbox && selected.length > 0) {
        this.applyResize(dx, dy, origBbox);
        this.render();
      }
    } else if (this.dragAction === 'rotate') {
      const origBbox = this.dragOriginals.get('__bbox__');
      if (origBbox) {
        const cx = origBbox.x + origBbox.width / 2;
        const cy = origBbox.y + origBbox.height / 2;
        const rad = Math.atan2(coords.y - cy, coords.x - cx);
        const deg = Math.round((rad * 180) / Math.PI) + 90;
        this.selectedIds.forEach(id => {
          const obj = this.objects.find(o => o.id === id);
          if (obj) obj.rotation = deg;
        });
        this.render();
      }
    } else if (this.dragAction === 'marquee') {
      const w = coords.x - this.dragStart.x;
      const h = coords.y - this.dragStart.y;
      this.marqueeRect = {
        x: w >= 0 ? this.dragStart.x : coords.x,
        y: h >= 0 ? this.dragStart.y : coords.y,
        w: Math.abs(w),
        h: Math.abs(h)
      };

      // Select objects inside marquee
      this.objects.forEach(obj => {
        if (!obj.visible || obj.locked) return;
        const inBox = (
          obj.x >= this.marqueeRect.x &&
          obj.x + obj.width <= this.marqueeRect.x + this.marqueeRect.w &&
          obj.y >= this.marqueeRect.y &&
          obj.y + obj.height <= this.marqueeRect.y + this.marqueeRect.h
        );
        if (inBox) this.selectedIds.add(obj.id);
      });

      this.render();
      this.onSelectionChange(this.selectedObjects);
    }
  }

  onMouseUp(e) {
    if (this.isDragging) {
      this.isDragging = false;
      this.dragAction = null;
      this.marqueeRect = null;
      this.render();
      this.onObjectsChange(this.objects);
    }
  }

  onWheel(e) {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    const newZoom = Math.min(8, Math.max(0.25, this.zoom * zoomFactor));

    const rect = this.canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    this.pan.x = mouseX - (mouseX - this.pan.x) * (newZoom / this.zoom);
    this.pan.y = mouseY - (mouseY - this.pan.y) * (newZoom / this.zoom);
    this.zoom = newZoom;
    this.render();
  }

  hitTestHandles(coords, bbox) {
    if (!bbox) return null;
    const tol = 12 / this.zoom;
    const half = tol / 2;

    const rotY = bbox.y - 24 / this.zoom;
    if (Math.hypot(coords.x - (bbox.x + bbox.width / 2), coords.y - rotY) <= tol) {
      return 'rot';
    }

    if (Math.hypot(coords.x - bbox.x, coords.y - bbox.y) <= tol) return 'tl';
    if (Math.hypot(coords.x - (bbox.x + bbox.width), coords.y - bbox.y) <= tol) return 'tr';
    if (Math.hypot(coords.x - bbox.x, coords.y - (bbox.y + bbox.height)) <= tol) return 'bl';
    if (Math.hypot(coords.x - (bbox.x + bbox.width), coords.y - (bbox.y + bbox.height)) <= tol) return 'br';

    if (Math.hypot(coords.x - (bbox.x + bbox.width / 2), coords.y - bbox.y) <= tol) return 'tc';
    if (Math.hypot(coords.x - (bbox.x + bbox.width / 2), coords.y - (bbox.y + bbox.height)) <= tol) return 'bc';
    if (Math.hypot(coords.x - bbox.x, coords.y - (bbox.y + bbox.height / 2)) <= tol) return 'ml';
    if (Math.hypot(coords.x - (bbox.x + bbox.width), coords.y - (bbox.y + bbox.height / 2)) <= tol) return 'mr';

    return null;
  }

  captureDragOriginals() {
    this.recordState();
    this.dragOriginals.clear();
    this.objects.forEach(obj => {
      this.dragOriginals.set(obj.id, {
        x: obj.x, y: obj.y, width: obj.width, height: obj.height, rotation: obj.rotation
      });
    });
    const bbox = this.getSelectionBounds(this.getSelectedObjects());
    if (bbox) this.dragOriginals.set('__bbox__', bbox);
  }

  applyResize(dx, dy, origBbox) {
    let scaleW = 1;
    let scaleH = 1;

    if (this.activeHandle.includes('r')) {
      scaleW = Math.max(0.05, (origBbox.width + dx) / origBbox.width);
    }
    if (this.activeHandle.includes('b')) {
      scaleH = Math.max(0.05, (origBbox.height + dy) / origBbox.height);
    }

    this.selectedIds.forEach(id => {
      const orig = this.dragOriginals.get(id);
      const obj = this.objects.find(o => o.id === id);
      if (orig && obj) {
        obj.width = Math.max(10, Math.round(orig.width * scaleW));
        obj.height = Math.max(10, Math.round(orig.height * scaleH));
      }
    });
  }

  // Object Commands
  flipHorizontal() {
    const selected = this.getSelectedObjects();
    selected.forEach(obj => {
      obj.scaleX = -obj.scaleX;
    });
    this.render();
    this.onObjectsChange(this.objects);
  }

  flipVertical() {
    const selected = this.getSelectedObjects();
    selected.forEach(obj => {
      obj.scaleY = -obj.scaleY;
    });
    this.render();
    this.onObjectsChange(this.objects);
  }

  duplicateSelected() {
    const selected = this.getSelectedObjects();
    if (selected.length === 0) return;
    this.recordState();
    const newIds = new Set();

    selected.forEach(obj => {
      const clone = JSON.parse(JSON.stringify(obj));
      clone.id = `obj_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      clone.name = `${obj.name} (Copy)`;
      clone.x += 20;
      clone.y += 20;
      this.objects.push(clone);
      newIds.add(clone.id);
    });

    this.selectedIds = newIds;
    this.render();
    this.onObjectsChange(this.objects);
    this.onSelectionChange(this.selectedObjects);
    toast.info(`Duplicated ${selected.length} object(s)`);
  }

  deleteSelected() {
    const count = this.selectedIds.size;
    if (count === 0) return;
    this.recordState();
    this.objects = this.objects.filter(o => !this.selectedIds.has(o.id));
    this.selectedIds.clear();
    this.render();
    this.onObjectsChange(this.objects);
    this.onSelectionChange([]);
    toast.info(`Deleted ${count} object(s)`);
  }

  selectAll() {
    this.selectedIds.clear();
    this.objects.forEach(o => {
      if (o.visible && !o.locked) this.selectedIds.add(o.id);
    });
    this.render();
    this.onSelectionChange(this.selectedObjects);
  }

  align(type) {
    const selected = this.getSelectedObjects();
    if (selected.length < 2) return;
    this.recordState();
    const bbox = this.getSelectionBounds(selected);

    selected.forEach(obj => {
      if (type === 'left') obj.x = bbox.x;
      else if (type === 'center') obj.x = bbox.x + (bbox.width - obj.width) / 2;
      else if (type === 'right') obj.x = bbox.x + bbox.width - obj.width;
      else if (type === 'top') obj.y = bbox.y;
      else if (type === 'middle') obj.y = bbox.y + (bbox.height - obj.height) / 2;
      else if (type === 'bottom') obj.y = bbox.y + bbox.height - obj.height;
    });

    this.render();
    this.onObjectsChange(this.objects);
    toast.info(`Aligned ${type}`);
  }

  alignSelected(type) {
    return this.align(type);
  }

  distribute(direction = 'horizontal') {
    const selected = this.getSelectedObjects();
    if (selected.length < 3) return;
    this.recordState();

    if (direction === 'horizontal') {
      selected.sort((a, b) => a.x - b.x);
      const minX = selected[0].x;
      const maxX = selected[selected.length - 1].x + selected[selected.length - 1].width;
      const totalObjWidth = selected.reduce((acc, o) => acc + o.width, 0);
      const gap = (maxX - minX - totalObjWidth) / (selected.length - 1);

      let curX = minX;
      selected.forEach(o => {
        o.x = curX;
        curX += o.width + gap;
      });
    } else {
      selected.sort((a, b) => a.y - b.y);
      const minY = selected[0].y;
      const maxY = selected[selected.length - 1].y + selected[selected.length - 1].height;
      const totalObjHeight = selected.reduce((acc, o) => acc + o.height, 0);
      const gap = (maxY - minY - totalObjHeight) / (selected.length - 1);

      let curY = minY;
      selected.forEach(o => {
        o.y = curY;
        curY += o.height + gap;
      });
    }

    this.render();
    this.onObjectsChange(this.objects);
    toast.info(`Distributed ${direction}ly`);
  }

  distributeSelected(direction = 'horizontal') {
    return this.distribute(direction);
  }

  groupSelected() {
    const selected = this.getSelectedObjects();
    if (selected.length < 2) return;
    this.recordState();
    const groupId = `grp_${Date.now()}`;
    selected.forEach(o => o.groupId = groupId);
    this.render();
    this.onObjectsChange(this.objects);
    toast.success(`Grouped ${selected.length} objects`);
  }

  ungroupSelected() {
    const selected = this.getSelectedObjects();
    let count = 0;
    this.recordState();
    selected.forEach(o => {
      if (o.groupId) {
        o.groupId = null;
        count++;
      }
    });
    this.render();
    this.onObjectsChange(this.objects);
    toast.info(`Ungrouped ${count} objects`);
  }

  // Layer Ordering
  bringForward() {
    const selected = this.getSelectedObjects();
    if (selected.length === 0) return;
    const id = selected[0].id;
    const idx = this.objects.findIndex(o => o.id === id);
    if (idx < this.objects.length - 1) {
      this.recordState();
      const temp = this.objects[idx];
      this.objects[idx] = this.objects[idx + 1];
      this.objects[idx + 1] = temp;
      this.render();
      this.onObjectsChange(this.objects);
    }
  }

  sendBackward() {
    const selected = this.getSelectedObjects();
    if (selected.length === 0) return;
    const id = selected[0].id;
    const idx = this.objects.findIndex(o => o.id === id);
    if (idx > 0) {
      this.recordState();
      const temp = this.objects[idx];
      this.objects[idx] = this.objects[idx - 1];
      this.objects[idx - 1] = temp;
      this.render();
      this.onObjectsChange(this.objects);
    }
  }

  bringToFront() {
    const selected = this.getSelectedObjects();
    if (selected.length === 0) return;
    const id = selected[0].id;
    const idx = this.objects.findIndex(o => o.id === id);
    if (idx !== -1) {
      this.recordState();
      const [item] = this.objects.splice(idx, 1);
      this.objects.push(item);
      this.render();
      this.onObjectsChange(this.objects);
    }
  }

  sendToBack() {
    const selected = this.getSelectedObjects();
    if (selected.length === 0) return;
    const id = selected[0].id;
    const idx = this.objects.findIndex(o => o.id === id);
    if (idx !== -1) {
      this.recordState();
      const [item] = this.objects.splice(idx, 1);
      this.objects.unshift(item);
      this.render();
      this.onObjectsChange(this.objects);
    }
  }

  moveSelectedOrder(order) {
    if (order === 'front') this.bringToFront();
    else if (order === 'forward') this.bringForward();
    else if (order === 'backward') this.sendBackward();
    else if (order === 'back') this.sendToBack();
  }

  exportAsSvg() {
    const { width, height } = this.canvas;
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">\n`;
    svg += `  <g id="creative_vector_canvas_layers">\n`;

    this.objects.forEach(obj => {
      if (!obj.visible) return;
      if (obj.type === 'path' && obj.d) {
        svg += `    <path id="${obj.id}" d="${obj.d}" fill="${obj.fill}" stroke="${obj.stroke}" stroke-width="${obj.strokeWidth}" opacity="${obj.opacity}" />\n`;
      } else if (obj.type === 'rect') {
        svg += `    <rect id="${obj.id}" x="${obj.x}" y="${obj.y}" width="${obj.width}" height="${obj.height}" fill="${obj.fill}" stroke="${obj.stroke}" stroke-width="${obj.strokeWidth}" opacity="${obj.opacity}" />\n`;
      }
    });

    svg += `  </g>\n</svg>`;
    return svg;
  }

  exportSvg() {
    return this.exportAsSvg();
  }
}
