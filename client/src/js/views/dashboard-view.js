/**
 * CreativeForge AI — User SaaS Dashboard View
 */
import { store } from '../state.js';
import { api } from '../api.js';
import { toast } from '../components/toast.js';
import { ModalManager } from '../components/modal.js';

export class DashboardView {
  constructor(container, onOpenStudio) {
    this.container = container;
    this.onOpenStudio = onOpenStudio;
    this.projects = [];
    this.jobs = [];
    this.currentTab = 'projects';
  }

  async loadData() {
    try {
      const projRes = await api.getProjects();
      this.projects = projRes.projects || [];
      const jobsRes = await api.getJobs();
      this.jobs = jobsRes.jobs || [];
    } catch (err) {
      console.warn('Dashboard data fetch note:', err);
    }
    this.render();
  }

  render() {
    const state = store.getState();
    const user = state.user;

    this.container.innerHTML = `
      <div class="dashboard-page">
        <!-- Top Nav -->
        <header class="landing-nav">
          <div style="display:flex; align-items:center; gap:12px; cursor:pointer;" id="dash-brand-home">
            <div class="brand-logo">CF</div>
            <div class="brand-title">
              <span>CreativeForge AI</span>
              <span class="brand-subtitle">User Workspace Dashboard</span>
            </div>
          </div>
          <div style="display:flex; align-items:center; gap:14px;">
            <button class="btn btn-secondary btn-sm" id="btn-dash-landing">Public Website</button>
            <button class="btn btn-primary btn-sm" id="btn-dash-studio">Open Creative Studio →</button>
          </div>
        </header>

        <div class="dashboard-container">
          <!-- Header -->
          <div class="dashboard-header">
            <div class="dashboard-title-area">
              <h1>Welcome back, ${user.name}</h1>
              <p>Plan: <span style="color:var(--accent-secondary); font-weight:700;">${user.plan_id}</span> • Manage your creative assets, projects, and processing queue.</p>
            </div>
            <button class="btn btn-primary" id="btn-new-project-dash">+ New Project</button>
          </div>

          <!-- Metric Cards -->
          <div class="metrics-grid">
            <div class="metric-card">
              <div class="metric-header"><span>Total Projects</span><span>📁</span></div>
              <div class="metric-value">${this.projects.length}</div>
              <div class="metric-subtext">Active creative workspaces</div>
            </div>
            <div class="metric-card">
              <div class="metric-header"><span>Processing Jobs</span><span>⚡</span></div>
              <div class="metric-value">${this.jobs.length}</div>
              <div class="metric-subtext">Completed & queued operations</div>
            </div>
            <div class="metric-card">
              <div class="metric-header"><span>Remaining Credits</span><span>💎</span></div>
              <div class="metric-value" style="color:#818cf8;">${user.credits}</div>
              <div class="metric-subtext">Renews monthly on ${user.plan_id}</div>
            </div>
            <div class="metric-card">
              <div class="metric-header"><span>Storage Used</span><span>☁</span></div>
              <div class="metric-value">14.2 MB</div>
              <div class="metric-subtext">Non-destructive cloud cache</div>
            </div>
          </div>

          <!-- Studio Quick Launchpad -->
          <div style="background:var(--bg-secondary); border:1px solid var(--border-subtle); border-radius:12px; padding:18px; margin-bottom:24px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
              <div style="font-size:0.95rem; font-weight:700; color:var(--text-primary); display:flex; align-items:center; gap:8px;">
                <span>✨</span> Quick Studio Launchpad
              </div>
              <span style="font-size:0.75rem; color:var(--text-secondary);">Direct access to Creative Vector Studio engines</span>
            </div>
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(110px, 1fr)); gap:10px;">
              <button class="btn btn-glass btn-sm btn-quick-tool" data-tool="tool_vector_convert" style="display:flex; flex-direction:column; align-items:center; gap:4px; padding:10px 6px;">
                <span style="font-size:1.2rem;">⬡</span>
                <span style="font-size:0.75rem; font-weight:600;">Vector Studio</span>
              </button>
              <button class="btn btn-glass btn-sm btn-quick-tool" data-tool="tool_bg_ai_photo" style="display:flex; flex-direction:column; align-items:center; gap:4px; padding:10px 6px;">
                <span style="font-size:1.2rem;">🤖</span>
                <span style="font-size:0.75rem; font-weight:600;">AI Cutout</span>
              </button>
              <button class="btn btn-glass btn-sm btn-quick-tool" data-tool="tool_upscaler" style="display:flex; flex-direction:column; align-items:center; gap:4px; padding:10px 6px;">
                <span style="font-size:1.2rem;">⚡</span>
                <span style="font-size:0.75rem; font-weight:600;">AI Upscaler</span>
              </button>
              <button class="btn btn-glass btn-sm btn-quick-tool" data-tool="tool_gradient_maker" style="display:flex; flex-direction:column; align-items:center; gap:4px; padding:10px 6px;">
                <span style="font-size:1.2rem;">🎨</span>
                <span style="font-size:0.75rem; font-weight:600;">Gradients</span>
              </button>
              <button class="btn btn-glass btn-sm btn-quick-tool" data-tool="tool_icon_sheet_1" style="display:flex; flex-direction:column; align-items:center; gap:4px; padding:10px 6px;">
                <span style="font-size:1.2rem;">田</span>
                <span style="font-size:0.75rem; font-weight:600;">Icon Sheets</span>
              </button>
              <button class="btn btn-glass btn-sm btn-quick-view" data-view="metadata-studio" style="display:flex; flex-direction:column; align-items:center; gap:4px; padding:10px 6px;">
                <span style="font-size:1.2rem;">🏷️</span>
                <span style="font-size:0.75rem; font-weight:600;">Metadata</span>
              </button>
              <button class="btn btn-glass btn-sm btn-quick-view" data-view="preset-manager" style="display:flex; flex-direction:column; align-items:center; gap:4px; padding:10px 6px;">
                <span style="font-size:1.2rem;">⭐</span>
                <span style="font-size:0.75rem; font-weight:600;">Presets</span>
              </button>
              <button class="btn btn-glass btn-sm btn-quick-view" data-view="project-manager" style="display:flex; flex-direction:column; align-items:center; gap:4px; padding:10px 6px;">
                <span style="font-size:1.2rem;">📁</span>
                <span style="font-size:0.75rem; font-weight:600;">Project Hub</span>
              </button>
              <button class="btn btn-glass btn-sm btn-quick-view" data-view="export-center" style="display:flex; flex-direction:column; align-items:center; gap:4px; padding:10px 6px;">
                <span style="font-size:1.2rem;">📦</span>
                <span style="font-size:0.75rem; font-weight:600;">Export Center</span>
              </button>
              <button class="btn btn-glass btn-sm btn-quick-view" data-view="settings" style="display:flex; flex-direction:column; align-items:center; gap:4px; padding:10px 6px;">
                <span style="font-size:1.2rem;">⚙️</span>
                <span style="font-size:0.75rem; font-weight:600;">Settings</span>
              </button>
              <button class="btn btn-glass btn-sm" id="btn-quick-batch-bg" style="display:flex; flex-direction:column; align-items:center; gap:4px; padding:10px 6px; border-color:rgba(6,182,212,0.4); color:var(--accent-secondary);">
                <span style="font-size:1.2rem;">✂</span>
                <span style="font-size:0.75rem; font-weight:600;">Batch BG</span>
              </button>
            </div>
          </div>

          <!-- Tab Bar -->
          <div class="dashboard-tabs">
            <div class="dash-tab ${this.currentTab === 'projects' ? 'active' : ''}" id="tab-btn-projects">Recent Projects</div>
            <div class="dash-tab ${this.currentTab === 'history' ? 'active' : ''}" id="tab-btn-history">Processing History (${this.jobs.length})</div>
          </div>

          <!-- Tab 1: Projects Grid -->
          <div id="tab-content-projects" style="${this.currentTab === 'projects' ? '' : 'display:none;'}">
            <div class="projects-grid">
              ${this.projects.map(p => `
                <div class="project-card">
                  <div class="project-thumbnail">
                    ${p.thumbnail ? `<img src="${p.thumbnail}" alt="${p.name}" />` : `
                      <div style="font-size:2.5rem; color:var(--text-muted);">✦</div>
                    `}
                  </div>
                  <div class="project-card-body">
                    <h3 class="project-card-title">${p.name}</h3>
                    <div class="project-card-meta">
                      <span>${new Date(p.created_at).toLocaleDateString()}</span>
                      <span class="badge badge-indigo">${p.assetCount || 1} Assets</span>
                    </div>
                    <div class="project-card-actions">
                      <button class="btn btn-primary btn-sm btn-open-project" data-proj-id="${p.id}">Open Studio</button>
                      <div style="display:flex; gap:6px;">
                        <button class="btn btn-secondary btn-sm btn-dup-project" data-proj-id="${p.id}" title="Duplicate">Copy</button>
                        <button class="btn btn-secondary btn-sm btn-del-project" data-proj-id="${p.id}" style="color:var(--status-danger);" title="Delete">✕</button>
                      </div>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Tab 2: Processing Jobs History Table -->
          <div id="tab-content-history" style="${this.currentTab === 'history' ? '' : 'display:none;'}">
            <div class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Job ID</th>
                    <th>Creative Tool</th>
                    <th>Status</th>
                    <th>Timestamp</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  ${this.jobs.length === 0 ? `
                    <tr><td colspan="5" style="text-align:center; padding:30px;">No processing jobs yet. Launch the studio to transform assets.</td></tr>
                  ` : this.jobs.map(j => `
                    <tr>
                      <td style="font-family:var(--font-mono); font-size:0.75rem;">${j.id}</td>
                      <td><strong>${j.tool.replace('tool_', '')}</strong></td>
                      <td><span class="status-pill status-${j.status}">${j.status}</span></td>
                      <td>${new Date(j.created_at).toLocaleString()}</td>
                      <td>
                        <button class="btn btn-secondary btn-sm btn-open-job-studio" data-tool="${j.tool}">Reopen Tool</button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    this.container.querySelector('#dash-brand-home').onclick = () => store.setState({ currentView: 'landing' });
    this.container.querySelector('#btn-dash-landing').onclick = () => store.setState({ currentView: 'landing' });
    this.container.querySelector('#btn-dash-studio').onclick = () => this.onOpenStudio();

    this.container.querySelector('#btn-new-project-dash').onclick = async () => {
      const name = prompt('Enter new project name:', 'Studio Artwork ' + (this.projects.length + 1));
      if (name) {
        const res = await api.createProject(name);
        store.setState({ project: res.project });
        toast.success(`Project "${name}" created!`);
        this.onOpenStudio();
      }
    };

    // Tab Switching
    const tabProj = this.container.querySelector('#tab-btn-projects');
    const tabHist = this.container.querySelector('#tab-btn-history');
    const cProj = this.container.querySelector('#tab-content-projects');
    const cHist = this.container.querySelector('#tab-content-history');

    tabProj.onclick = () => {
      this.currentTab = 'projects';
      tabProj.classList.add('active');
      tabHist.classList.remove('active');
      cProj.style.display = 'block';
      cHist.style.display = 'none';
    };

    tabHist.onclick = () => {
      this.currentTab = 'history';
      tabHist.classList.add('active');
      tabProj.classList.remove('active');
      cHist.style.display = 'block';
      cProj.style.display = 'none';
    };

    // Project Actions
    this.container.querySelectorAll('.btn-open-project').forEach(b => {
      b.onclick = (e) => {
        const id = e.target.getAttribute('data-proj-id');
        const p = this.projects.find(x => x.id === id);
        if (p) store.setState({ project: p });
        this.onOpenStudio();
      };
    });

    this.container.querySelectorAll('.btn-dup-project').forEach(b => {
      b.onclick = async (e) => {
        const id = e.target.getAttribute('data-proj-id');
        await api.duplicateProject(id);
        toast.success('Project duplicated!');
        this.loadData();
      };
    });

    this.container.querySelectorAll('.btn-del-project').forEach(b => {
      b.onclick = async (e) => {
        const id = e.target.getAttribute('data-proj-id');
        if (confirm('Are you sure you want to delete this project?')) {
          await api.deleteProject(id);
          toast.success('Project removed.');
          this.loadData();
        }
      };
    });

    this.container.querySelectorAll('.btn-open-job-studio').forEach(b => {
      b.onclick = (e) => {
        const tool = e.target.getAttribute('data-tool');
        store.setState({ activeTool: tool });
        this.onOpenStudio();
      };
    });

    // Quick Launchpad Handlers
    this.container.querySelectorAll('.btn-quick-tool').forEach(b => {
      b.onclick = () => {
        const tool = b.getAttribute('data-tool');
        store.setState({ activeTool: tool, currentView: 'studio' });
        this.onOpenStudio();
      };
    });

    this.container.querySelectorAll('.btn-quick-view').forEach(b => {
      b.onclick = () => {
        const view = b.getAttribute('data-view');
        store.setState({ currentView: view });
      };
    });

    // Batch BG Remover Quick-Launch
    const batchBgBtn = this.container.querySelector('#btn-quick-batch-bg');
    if (batchBgBtn) {
      batchBgBtn.onclick = () => ModalManager.openBatchBgRemoverModal();
    }
  }
}
