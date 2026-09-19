/**
 * Creative Vector Studio — Non-Destructive State Store
 * Manages full studio modules, vector parameters, canvas objects,
 * layer hierarchy, history timeline, presets, and user settings.
 */

class StateStore {
  constructor() {
    this.subscribers = new Set();

    this.state = {
      // User & Auth
      user: {
        id: 'usr_pro',
        name: 'Elena Rostova',
        email: 'elena@designstudio.io',
        credits: 450,
        plan_id: 'PROFESSIONAL',
        role: 'user'
      },
      currentView: 'studio', // 'landing' | 'studio' | 'dashboard' | 'admin'
      activeStudio: 'vector', // 'vector' | 'canvas' | 'background' | 'upscale' | 'gradient' | 'glass' | 'grain' | 'icon' | 'icon_sheet' | 'batch' | 'metadata' | 'presets' | 'projects' | 'export' | 'settings' | 'account' | 'admin' | 'stock_ready'
      activeSeoTool: null,

      // Project Context
      project: {
        id: 'proj_default',
        name: 'Creative Vector Project 01',
        active_tool: 'tool_vector_convert',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },

      // Assets (Non-Destructive Core)
      originalImage: null,
      originalImageUrl: null,
      originalFileName: 'cyber-prism-artwork.png',
      originalWidth: 1200,
      originalHeight: 800,

      // Batch assets array
      batchAssets: [],

      // Active Tool & Processed Output
      activeTool: 'tool_vector_convert',
      processedResult: null, // { canvas, svgString, type, metadata }
      processedCanvas: null,
      processedSvg: null,

      // Comparison & Viewport
      compareMode: 'slider', // 'slider' | 'split' | 'side-by-side' | 'original' | 'processed'
      zoom: 100, // 25 to 800%
      sliderPos: 50, // 0 to 100%
      pan: { x: 0, y: 0 },
      isPanning: false,

      // Canvas Editor Specific State
      canvasObjects: [],
      selectedObjectIds: [],
      canvasGrid: true,
      canvasGridSize: 20,
      canvasSnap: true,
      canvasRulers: true,
      canvasGuides: { horizontal: [100, 400], vertical: [150, 600] },
      clipboard: null,

      // Processing Status & Queue
      isProcessing: false,
      processingMessage: '',
      processingProgress: 0,
      jobId: null,
      processingQueue: [], // [{ id, filename, tool, status, progress, time }]

      // History & Timeline Stacks
      undoStack: [],
      redoStack: [],
      historyTimeline: [
        {
          id: 'hist_init',
          actionName: 'Initial Canvas Asset Loaded',
          toolUsed: 'Asset Ingest',
          timestamp: new Date().toISOString(),
          settings: null
        }
      ],

      // Tool Parameters Cache
      params: {
        // Vector Studio
        vectorColors: 10,
        vectorDetail: 70,
        vectorSmoothness: 60,
        vectorSimplification: 2,
        vectorThreshold: 128,
        vectorNoiseRemoval: 12,
        vectorSmallObjectRemoval: 8,
        vectorEdgeDetection: true,
        vectorEdgeSharpness: 65,
        vectorPathPrecision: 2,
        vectorCornerSmoothness: 45,
        vectorRemoveWhite: true,
        vectorPreserveFineDetails: true,
        vectorPreserveHoles: true,
        vectorFillMode: 'fill', // 'fill' | 'stroke' | 'fillAndStroke'
        vectorStrokeWidth: 2,
        vectorStrokeColor: '#0a0b0e',
        vectorPaletteMode: 'original', // 'original' | 'grayscale' | 'bw' | 'custom'
        vectorCustomPalette: ['#6366f1', '#06b6d4', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6'],
        vectorLayerMode: 'color', // 'color' | 'object'
        vectorBgMode: 'transparent', // 'transparent' | 'white' | 'none'

        // Background Studio
        bgMode: 'white', // 'white' | 'black' | 'custom' | 'auto'
        bgCustomColor: '#ffffff',
        bgTolerance: 28,
        bgFeather: 2,
        bgShadowPreserve: true,
        bgEdgeRefine: 50,
        bgFineEdgePreserve: true,
        bgPreview: 'checkerboard', // 'checkerboard' | 'white' | 'black' | 'custom'
        bgPreviewColor: '#181b22',

        // Upscale Studio
        upscaleResolution: '4K', // '2K' | '4K' | '6K' | '8K' | '300PPI' | 'custom'
        upscaleMultiplier: '4x', // '2x' | '4x' | '6x' | '8x' | 'custom'
        upscaleCustomW: 3840,
        upscaleCustomH: 2160,
        upscaleSharpness: 75,
        upscaleDetail: 65,
        upscaleNoiseReduction: 30,
        upscaleTexturePreservation: 80,
        upscaleArtifactReduction: 40,

        // Gradient Studio
        gradientColors: ['#6366f1', '#06b6d4', '#ec4899', '#8b5cf6'],
        gradientType: 'linear', // 'linear' | 'radial' | 'angular' | 'mesh'
        gradientAngle: 135,
        gradientBlur: 0,
        gradientOpacity: 100,
        gradientScale: 100,
        gradientBlendMode: 'normal',
        gradientNoise: 15,
        gradientVariationsCount: 10,
        makerSystem: 1,
        makerType: 'linear',
        makerNoise: 15,

        // Film Grain Studio
        grainPreset: 'classic',
        grainAmount: 45,
        grainSize: 2,
        grainSoftness: 3,
        grainContrast: 30,
        grainOpacity: 60,
        grainDensity: 50,
        grainRandomness: 50,
        grainMonochrome: true,

        // Fractal Glass Studio
        glassPreset: '1',
        glassRefraction: 35,
        glassDistortion: 25,
        glassTransparency: 75,
        glassBlur: 2,
        glassReflection: 40,
        glassLight: 50,
        glassDepth: 20,
        glassDensity: 15,
        glassEdgeDistortion: 20,
        glassScale: 100,
        glassRotation: 0,
        glassNoise: 20,
        glassTint: '#6366f1',

        // Icon Studio
        iconStyle: 'flat', // 'outline' | 'filled' | 'monoline' | 'rounded' | 'sharp' | 'duotone' | 'flat' | '3d' | 'isometric'
        iconStrokeWidth: 3,
        iconCornerRadius: 8,
        iconSize: 512,
        iconSpacing: 16,
        iconColor: '#6366f1',
        iconBgColor: 'transparent',

        // Icon Sheet Studio
        sheetLayout: '1',
        sheetColumns: 4,
        sheetRows: 4,
        sheetIconSize: 128,
        sheetGap: 16,
        sheetPadding: 24,
        sheetMargin: 30,
        sheetBackground: 'transparent',
        sheetBorder: false,
        sheetBorderRadius: 8,
        sheetLabels: true,
        sheetNumbering: true,
        sheetFont: 'Plus Jakarta Sans',
        sheetFontSize: 13,
        sheetAlignment: 'center',

        // Icon Pack
        packStyle: 'flat',
        packSize: 512
      },

      // Metadata Studio Model
      metadata: {
        title: 'Creative Vector Asset',
        description: 'Clean scalable vector artwork generated in Creative Vector Studio.',
        keywords: 'vector, illustration, svg, eps, clean, graphic, design, artwork, icon',
        category: 'Graphics',
        subcategory: 'Vector Art',
        designType: 'Commercial',
        orientation: 'Landscape',
        colorDominance: 'Multicolor',
        vectorOrRaster: 'Vector',
        fileType: 'SVG / EPS',
        ppi: 300,
        width: 3840,
        height: 2160,
        aiGenerated: false
      },

      // Export Center Settings
      exportSettings: {
        format: 'svg', // 'svg' | 'eps' | 'pdf' | 'png' | 'jpg' | 'webp' | 'dxf' | 'tiff'
        svgMode: 'editable', // 'editable' | 'layered' | 'flat' | 'optimized'
        ppi: 300,
        quality: 95,
        compression: 6,
        background: 'transparent', // 'transparent' | 'white' | 'black' | 'custom'
        customBgColor: '#ffffff',
        colorMode: 'sRGB', // 'sRGB' | 'CMYK'
        namingTemplate: '{original}_{tool}_{width}x{height}_{ppi}ppi'
      },

      // Stock Ready Status & Report
      stockReadyStatus: 'idle', // 'idle' | 'running' | 'completed' | 'failed'
      stockReadyReport: null,

      // User Preferences & Settings
      theme: localStorage.getItem('cf_theme') || 'dark',
      accentColor: localStorage.getItem('cf_accent') || 'indigo',
      language: localStorage.getItem('cf_language') || 'en',
      density: localStorage.getItem('cf_density') || 'comfortable',
      autoSave: true,
      autoSaveInterval: 60, // seconds

      // Presets Collection
      presets: []
    };
  }

  getState() {
    return this.state;
  }

  setState(updates) {
    // Record undo point if tool parameters or active tool changes
    if (updates.params || updates.activeTool) {
      if (this.state.undoStack.length > 25) this.state.undoStack.shift();
      this.state.undoStack.push({
        activeTool: this.state.activeTool,
        params: JSON.parse(JSON.stringify(this.state.params)),
        canvasObjects: JSON.parse(JSON.stringify(this.state.canvasObjects))
      });
      this.state.redoStack = [];
    }

    this.state = {
      ...this.state,
      ...updates
    };

    this.notify();
  }

  setParam(key, value) {
    this.setState({
      params: {
        ...this.state.params,
        [key]: value
      }
    });
  }

  recordHistory(actionName, toolUsed, settings = null) {
    const item = {
      id: `hist_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      actionName,
      toolUsed,
      timestamp: new Date().toISOString(),
      settings: settings || JSON.parse(JSON.stringify(this.state.params))
    };
    const historyTimeline = [item, ...(this.state.historyTimeline || [])].slice(0, 50);
    this.setState({ historyTimeline });
  }

  undo() {
    if (this.state.undoStack.length === 0) return;
    const prev = this.state.undoStack.pop();
    this.state.redoStack.push({
      activeTool: this.state.activeTool,
      params: JSON.parse(JSON.stringify(this.state.params)),
      canvasObjects: JSON.parse(JSON.stringify(this.state.canvasObjects))
    });
    this.state.activeTool = prev.activeTool;
    this.state.params = prev.params;
    if (prev.canvasObjects) this.state.canvasObjects = prev.canvasObjects;
    this.notify();
  }

  redo() {
    if (this.state.redoStack.length === 0) return;
    const next = this.state.redoStack.pop();
    this.state.undoStack.push({
      activeTool: this.state.activeTool,
      params: JSON.parse(JSON.stringify(this.state.params)),
      canvasObjects: JSON.parse(JSON.stringify(this.state.canvasObjects))
    });
    this.state.activeTool = next.activeTool;
    this.state.params = next.params;
    if (next.canvasObjects) this.state.canvasObjects = next.canvasObjects;
    this.notify();
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  notify() {
    for (const cb of this.subscribers) {
      cb(this.state);
    }
  }
}

export const store = new StateStore();
