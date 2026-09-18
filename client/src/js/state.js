/**
 * CreativeForge AI — Non-Destructive State Store
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
      currentView: 'studio', // 'landing' | 'studio' | 'dashboard' | 'admin' | 'seo-tool'
      activeSeoTool: null,

      // Project Context
      project: {
        id: 'proj_default',
        name: 'Creative Project 01',
        active_tool: 'tool_gradient_extract'
      },

      // Assets (Non-Destructive Core)
      originalImage: null,
      originalImageUrl: null,
      originalFileName: 'sample-artwork.png',
      originalWidth: 1200,
      originalHeight: 800,

      // Multiple batch items if loaded
      batchAssets: [],

      // Active Tool & Processed Output
      activeTool: 'tool_gradient_extract',
      processedResult: null, // { canvas, svgString, type, metadata }
      
      // Comparison & Viewport
      compareMode: 'slider', // 'slider' | 'split' | 'side-by-side'
      zoom: 100, // 25 to 800%
      sliderPos: 50, // 0 to 100%
      pan: { x: 0, y: 0 },
      isPanning: false,

      // Processing Status
      isProcessing: false,
      processingMessage: '',
      processingProgress: 0,
      jobId: null,

      // History Stacks
      undoStack: [],
      redoStack: [],

      // Tool Parameters Cache
      params: {
        // Gradient Extract
        gradientColors: ['#6366f1', '#06b6d4', '#ec4899', '#8b5cf6'],
        gradientType: 'linear',
        gradientAngle: 135,
        gradientBlur: 0,
        gradientOpacity: 100,

        // Upscaler
        upscaleResolution: '4K',
        upscaleSharpness: 75,
        upscaleDetail: 60,
        upscaleNoiseReduction: 30,

        // Film Grain
        grainPreset: 'classic',
        grainAmount: 45,
        grainSize: 2,
        grainSoftness: 3,
        grainContrast: 30,
        grainOpacity: 60,

        // Fractal Glass
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
        glassTint: '#6366f1',

        // Gradient Maker
        makerSystem: 1,
        makerType: 'linear',
        makerNoise: 15,

        // Vector
        vectorColors: 8,
        vectorDetail: 60,
        vectorSmoothness: 60,
        vectorThreshold: 128,
        vectorSimplification: 2,
        vectorRemoveWhite: true,

        // Remove Background
        bgTolerance: 25,
        bgFeather: 2,
        bgShadowPreserve: true,
        bgEdgeRefine: 50,

        // Icon Sheet
        sheetLayout: '1',
        sheetColumns: 4,
        sheetRows: 4,
        sheetPadding: 20,
        sheetMargin: 30,
        sheetBackground: 'transparent',
        sheetLabels: false,

        // Icon Pack
        packStyle: 'flat',
        packSize: 512
      },

      theme: localStorage.getItem('cf_theme') || 'dark'
    };
  }

  getState() {
    return this.state;
  }

  setState(updates) {
    // Record undo point if tool parameters or active tool changes
    if (updates.params || updates.activeTool) {
      if (this.state.undoStack.length > 20) this.state.undoStack.shift();
      this.state.undoStack.push({
        activeTool: this.state.activeTool,
        params: JSON.parse(JSON.stringify(this.state.params))
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

  undo() {
    if (this.state.undoStack.length === 0) return;
    const prev = this.state.undoStack.pop();
    this.state.redoStack.push({
      activeTool: this.state.activeTool,
      params: JSON.parse(JSON.stringify(this.state.params))
    });
    this.state.activeTool = prev.activeTool;
    this.state.params = prev.params;
    this.notify();
  }

  redo() {
    if (this.state.redoStack.length === 0) return;
    const next = this.state.redoStack.pop();
    this.state.undoStack.push({
      activeTool: this.state.activeTool,
      params: JSON.parse(JSON.stringify(this.state.params))
    });
    this.state.activeTool = next.activeTool;
    this.state.params = next.params;
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
