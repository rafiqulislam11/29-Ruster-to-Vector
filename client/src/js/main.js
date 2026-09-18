/**
 * CreativeForge AI — Main Application Controller
 */
import '../css/variables.css';
import '../css/base.css';
import '../css/components.css';
import '../css/studio.css';
import '../css/canvas.css';
import '../css/landing.css';
import '../css/dashboard.css';

import { store } from './state.js';
import { api } from './api.js';
import { createSampleArtwork } from './sample-asset.js';
import { StudioView } from './views/studio-view.js';
import { LandingView } from './views/landing-view.js';
import { DashboardView } from './views/dashboard-view.js';
import { AdminView } from './views/admin-view.js';

class App {
  constructor() {
    this.appRoot = document.getElementById('app');
    this.studioView = null;
    this.landingView = null;
    this.dashboardView = null;
    this.adminView = null;
    this.lastRenderedView = null;
  }

  async init() {
    // 1. Initialize Default Sample Artwork so the studio is immediately alive and wowing
    const { canvas, img } = createSampleArtwork();
    store.setState({
      originalImage: img,
      originalImageUrl: img.src,
      originalFileName: 'cyber-prism-artwork.png',
      originalWidth: 1200,
      originalHeight: 800
    });

    // 2. Fetch User Profile & Session from API
    try {
      const meRes = await api.getMe();
      if (meRes.user) {
        store.setState({ user: meRes.user });
      }
    } catch (e) {
      console.log('[Offline/Demo User Active]');
    }

    // 3. Initialize Views
    this.studioView = new StudioView(this.appRoot);
    this.landingView = new LandingView(this.appRoot, () => {
      store.setState({ currentView: 'studio' });
    });
    this.dashboardView = new DashboardView(this.appRoot, () => {
      store.setState({ currentView: 'studio' });
    });
    this.adminView = new AdminView(this.appRoot, () => {
      store.setState({ currentView: 'studio' });
    });

    // 4. Listen to State View Changes
    store.subscribe((state) => {
      if (state.currentView !== this.lastRenderedView) {
        this.renderCurrentView(state.currentView);
      }
    });

    // Handle initial route check (e.g. if URL contains a tool slug)
    const path = window.location.pathname.replace(/^\//, '');
    if (['image-upscaler', 'image-to-vector', 'background-remover', 'gradient-maker', 'icon-pack-maker', 'fractal-glass'].includes(path)) {
      store.setState({ currentView: 'landing', activeSeoTool: path });
    } else {
      // Default to Studio so user immediately lands on the creative workspace
      store.setState({ currentView: 'studio' });
    }

    this.renderCurrentView(store.getState().currentView);
    this.bindGlobalShortcuts();
  }

  renderCurrentView(viewName) {
    this.lastRenderedView = viewName;
    window.scrollTo(0, 0);

    if (viewName === 'landing') {
      this.landingView.render(store.getState().activeSeoTool);
    } else if (viewName === 'dashboard') {
      this.dashboardView.loadData();
    } else if (viewName === 'admin') {
      this.adminView.loadData();
    } else {
      this.studioView.render();
    }
  }

  bindGlobalShortcuts() {
    window.addEventListener('keydown', (e) => {
      // Undo: Ctrl+Z
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault();
        store.undo();
        if (this.studioView && store.getState().currentView === 'studio') {
          this.studioView.renderInspector();
          this.studioView.updateProcessing();
        }
      }
      // Redo: Ctrl+Y or Ctrl+Shift+Z
      if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'y' || (e.shiftKey && e.key.toLowerCase() === 'z'))) {
        e.preventDefault();
        store.redo();
        if (this.studioView && store.getState().currentView === 'studio') {
          this.studioView.renderInspector();
          this.studioView.updateProcessing();
        }
      }
    });
  }
}

// Bootstrap Application
const app = new App();
document.addEventListener('DOMContentLoaded', () => {
  app.init();
});
