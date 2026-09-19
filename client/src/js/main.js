/**
 * CreativeForge AI — Main Application Controller
 * Professional Creative Vector Studio
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
import { i18n } from './utils/i18n.js';
import { createSampleArtwork } from './sample-asset.js';
import { StudioView } from './views/studio-view.js';
import { LandingView } from './views/landing-view.js';
import { DashboardView } from './views/dashboard-view.js';
import { AdminView } from './views/admin-view.js';
import { SettingsView } from './views/settings-view.js';
import { PresetManagerView } from './views/preset-manager.js';
import { ProjectManagerView } from './views/project-manager.js';
import { MetadataStudioView } from './views/metadata-studio.js';
import { ExportCenterView } from './views/export-center.js';

class App {
  constructor() {
    this.appRoot = document.getElementById('app');
    this.studioView = null;
    this.landingView = null;
    this.dashboardView = null;
    this.adminView = null;
    this.settingsView = null;
    this.presetManagerView = null;
    this.projectManagerView = null;
    this.metadataStudioView = null;
    this.exportCenterView = null;
    this.lastRenderedView = null;
  }

  async init() {
    this.appRoot = this.appRoot || document.getElementById('app') || document.querySelector('#app') || document.body;

    // 0. Initialize Localization (EN/BN/AR)
    try {
      if (i18n && typeof i18n.init === 'function') {
        i18n.init();
      }
    } catch (err) {
      console.warn('Localization init fallback:', err);
    }

    // 1. Initialize Default Sample Artwork so the studio is immediately alive and functional
    try {
      const { canvas, img } = createSampleArtwork();
      store.setState({
        originalImage: img,
        originalImageUrl: img.src,
        originalFileName: 'cyber-prism-artwork.png',
        originalWidth: 1200,
        originalHeight: 800
      });
    } catch (e) {
      console.warn('Sample artwork creation fallback:', e);
    }

    // 2. Initialize Views
    const returnToStudio = () => store.setState({ currentView: 'studio' });

    this.studioView = new StudioView(this.appRoot);
    this.landingView = new LandingView(this.appRoot, returnToStudio);
    this.dashboardView = new DashboardView(this.appRoot, returnToStudio);
    this.adminView = new AdminView(this.appRoot, returnToStudio);
    this.settingsView = new SettingsView(this.appRoot);
    this.presetManagerView = new PresetManagerView(this.appRoot, () => {
      returnToStudio();
    });
    this.projectManagerView = new ProjectManagerView(this.appRoot, () => {
      returnToStudio();
    });
    this.metadataStudioView = new MetadataStudioView(this.appRoot);
    this.exportCenterView = new ExportCenterView(this.appRoot);

    // 3. Listen to State View Changes
    store.subscribe((state) => {
      if (state.currentView !== this.lastRenderedView) {
        this.renderCurrentView(state.currentView);
      }
    });

    // 4. Handle initial route check (supports hash and GitHub Pages subpath)
    const initialRoute = this.resolveRoute();
    this.handleNavigation(initialRoute);

    // Render current view immediately so user sees UI instantly
    this.renderCurrentView(store.getState().currentView);
    this.bindGlobalShortcuts();

    // Listen to hash changes for single-page routing on static hosts
    window.addEventListener('hashchange', () => {
      const route = this.resolveRoute();
      this.handleNavigation(route);
    });

    // 5. Fetch User Profile & Session from API asynchronously in background (won't block UI render)
    api.getMe().then((meRes) => {
      if (meRes && meRes.user) {
        store.setState({ user: meRes.user });
      }
    }).catch(() => {
      console.log('[Offline/Demo User Active]');
    });
  }

  resolveRoute() {
    // 1. Hash take priority (e.g. #/dashboard or #admin)
    const hash = window.location.hash.replace(/^#\/?/, '').trim();
    if (hash) {
      const [hashRoute] = hash.split('?');
      return hashRoute;
    }

    // 2. Pathname route: strip leading/trailing slashes and repo subpath
    const cleanPath = window.location.pathname.replace(/^\//, '').replace(/\/$/, '');
    const segments = cleanPath.split('/').filter(Boolean);
    let route = segments.length > 0 ? segments[segments.length - 1] : '';
    if (route === '29-Ruster-to-Vector' || route === 'index.html') {
      route = '';
    }
    return route;
  }

  handleNavigation(route) {
    if (['image-upscaler', 'image-to-vector', 'background-remover', 'gradient-maker', 'icon-pack-maker', 'fractal-glass'].includes(route)) {
      store.setState({ currentView: 'landing', activeSeoTool: route });
    } else if (['landing', 'dashboard', 'admin', 'settings', 'preset-manager', 'project-manager', 'metadata-studio', 'export-center'].includes(route)) {
      store.setState({ currentView: route });
    } else {
      store.setState({ currentView: 'studio' });
    }
  }

  renderCurrentView(viewName) {
    this.lastRenderedView = viewName;
    window.scrollTo(0, 0);

    switch (viewName) {
      case 'landing':
        this.landingView.render(store.getState().activeSeoTool);
        break;
      case 'dashboard':
        this.dashboardView.loadData();
        break;
      case 'admin':
        this.adminView.loadData();
        break;
      case 'settings':
        this.settingsView.render();
        break;
      case 'preset-manager':
      case 'presets':
        this.presetManagerView.render();
        break;
      case 'project-manager':
      case 'projects':
        this.projectManagerView.loadData();
        break;
      case 'metadata-studio':
      case 'metadata':
        this.metadataStudioView.render();
        break;
      case 'export-center':
      case 'export':
        this.exportCenterView.render();
        break;
      case 'studio':
      default:
        this.studioView.render();
        break;
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

// Bootstrap Application reliably across all browsers & DOM ready states
const app = new App();
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    app.init();
  });
} else {
  // Document already ready (deferred module script)
  app.init();
}
