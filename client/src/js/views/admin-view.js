/**
 * CreativeForge AI — SaaS Admin Panel View
 */
import { store } from '../state.js';
import { api } from '../api.js';
import { toast } from '../components/toast.js';

export class AdminView {
  constructor(container, onOpenStudio) {
    this.container = container;
    this.onOpenStudio = onOpenStudio;
    this.overview = null;
    this.users = [];
    this.tools = [];
    this.currentTab = 'overview';
  }

  async loadData() {
    try {
      this.overview = await api.getAdminOverview();
      const usersRes = await api.getAdminUsers();
      this.users = usersRes.users || [];
      const toolsRes = await api.getAdminTools();
      this.tools = toolsRes.tools || [];
    } catch (err) {
      console.warn('Admin fetch notice:', err);
    }
    this.render();
  }

  render() {
    const ov = this.overview || {
      metrics: { totalUsers: 3, totalProjects: 2, totalJobs: 0, estimatedMrr: 178, storageUsedMb: 14.2 },
      queue: { active: 0, queued: 0, completed: 0, failed: 0 },
      storage: { totalMb: 14.2 },
      backup: { enabled: true, backupCount: 1 },
      mostUsedTools: []
    };

    this.container.innerHTML = `
      <div class="dashboard-page">
        <!-- Top Nav -->
        <header class="landing-nav">
          <div style="display:flex; align-items:center; gap:12px; cursor:pointer;" id="admin-brand-home">
            <div class="brand-logo" style="background:linear-gradient(135deg, #ec4899, #f59e0b);">CF</div>
            <div class="brand-title">
              <span>CreativeForge Admin Console</span>
              <span class="brand-subtitle" style="color:var(--accent-tertiary);">Platform Operations & Control</span>
            </div>
          </div>
          <div style="display:flex; align-items:center; gap:14px;">
            <button class="btn btn-secondary btn-sm" id="btn-admin-dashboard">User Dashboard</button>
            <button class="btn btn-primary btn-sm" id="btn-admin-studio">Open Creative Studio →</button>
          </div>
        </header>

        <div class="dashboard-container">
          <!-- Admin Banner -->
          <div class="admin-badge-strip">
            <span style="font-size:1.3rem;">🛡</span>
            <div style="flex:1;">
              <strong>Admin Mode Active:</strong> You have system-level permissions to configure credits, enable/disable tools, trigger automated backups, and inspect the real-time background job queue.
            </div>
            <button class="btn btn-secondary btn-sm" id="btn-trigger-backup">Trigger Backup Now</button>
          </div>

          <!-- Overview Stats -->
          <div class="metrics-grid">
            <div class="metric-card">
              <div class="metric-header"><span>Monthly Run Rate</span><span>💰</span></div>
              <div class="metric-value" style="color:#34d399;">$${ov.metrics.estimatedMrr}</div>
              <div class="metric-subtext">Active SaaS subscriptions</div>
            </div>
            <div class="metric-card">
              <div class="metric-header"><span>Registered Users</span><span>👥</span></div>
              <div class="metric-value">${ov.metrics.totalUsers}</div>
              <div class="metric-subtext">Creators & enterprise accounts</div>
            </div>
            <div class="metric-card">
              <div class="metric-header"><span>Active Queue Workers</span><span>⚙</span></div>
              <div class="metric-value" style="color:#818cf8;">${ov.queue.active} Active / ${ov.queue.queued} Queued</div>
              <div class="metric-subtext">3 Max concurrent tasks</div>
            </div>
            <div class="metric-card">
              <div class="metric-header"><span>Storage Footprint</span><span>💾</span></div>
              <div class="metric-value">${ov.metrics.storageUsedMb} MB</div>
              <div class="metric-subtext">Originals, SVGs & ZIP packages</div>
            </div>
          </div>

          <!-- Tabs -->
          <div class="dashboard-tabs">
            <div class="dash-tab ${this.currentTab === 'overview' ? 'active' : ''}" id="adm-tab-ov">System Overview</div>
            <div class="dash-tab ${this.currentTab === 'users' ? 'active' : ''}" id="adm-tab-users">User Accounts (${this.users.length})</div>
            <div class="dash-tab ${this.currentTab === 'tools' ? 'active' : ''}" id="adm-tab-tools">Tools & Credit Pricing (${this.tools.length})</div>
          </div>

          <!-- Tab Content 1: System Overview & Analytics -->
          <div id="adm-content-ov" style="${this.currentTab === 'overview' ? '' : 'display:none;'}">
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:24px; margin-bottom:30px;">
              <div style="background:var(--bg-secondary); border:1px solid var(--border-subtle); border-radius:10px; padding:20px;">
                <h3 style="font-size:1.1rem; margin-bottom:14px;">Automated Backup Status</h3>
                <div style="font-size:0.85rem; color:var(--text-secondary); display:flex; flex-direction:column; gap:8px;">
                  <div>Automated Daily Backups: <strong style="color:var(--status-success);">Enabled (Every 24h)</strong></div>
                  <div>Retention Period: <strong>30 Days</strong></div>
                  <div>Total Snapshots: <strong>${ov.backup?.backupCount || 1}</strong></div>
                  <div>Storage Driver: <strong>Local Disk / S3 Object Compatible</strong></div>
                </div>
              </div>

              <div style="background:var(--bg-secondary); border:1px solid var(--border-subtle); border-radius:10px; padding:20px;">
                <h3 style="font-size:1.1rem; margin-bottom:14px;">AI Provider Abstraction Layer</h3>
                <div style="font-size:0.85rem; color:var(--text-secondary); display:flex; flex-direction:column; gap:8px;">
                  <div>Active Provider: <strong>Mock / Local Engine Mode</strong></div>
                  <div>API Key Hook: <strong>Extensible via AI_PROVIDER_API_KEY</strong></div>
                  <div>Supported Cloud Models: <strong>Replicate (Real-ESRGAN), Stability AI</strong></div>
                  <div>Fallback Status: <strong style="color:var(--status-success);">Operational (Deterministic bicubic/potrace)</strong></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Tab Content 2: Users Management Table -->
          <div id="adm-content-users" style="${this.currentTab === 'users' ? '' : 'display:none;'}">
            <div class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Plan</th>
                    <th>Credits Balance</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${this.users.map(u => `
                    <tr>
                      <td><strong>${u.name}</strong></td>
                      <td>${u.email}</td>
                      <td><span class="badge ${u.role === 'admin' ? 'badge-cyan' : 'badge-indigo'}">${u.role.toUpperCase()}</span></td>
                      <td><span class="badge badge-warning">${u.plan_id}</span></td>
                      <td>
                        <span style="font-family:var(--font-mono); font-weight:700;">${u.credits}</span>
                      </td>
                      <td>
                        <button class="btn btn-secondary btn-sm btn-adjust-credits" data-user-id="${u.id}" data-credits="${u.credits}">+ Adjust Credits</button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <!-- Tab Content 3: Tools Configuration & Credit Consumption -->
          <div id="adm-content-tools" style="${this.currentTab === 'tools' ? '' : 'display:none;'}">
            <div class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Tool Name</th>
                    <th>Category</th>
                    <th>Credit Cost</th>
                    <th>Status</th>
                    <th>Quick Edit</th>
                  </tr>
                </thead>
                <tbody>
                  ${this.tools.map(t => `
                    <tr>
                      <td><strong>${t.name}</strong></td>
                      <td><span class="badge badge-indigo">${t.category.toUpperCase()}</span></td>
                      <td>
                        <span style="font-family:var(--font-mono); font-weight:700;">${t.credit_cost} Credits</span>
                      </td>
                      <td>
                        <span class="status-pill ${t.enabled ? 'status-completed' : 'status-failed'}">
                          ${t.enabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </td>
                      <td>
                        <button class="btn btn-secondary btn-sm btn-edit-tool" data-tool-id="${t.id}" data-cost="${t.credit_cost}" data-enabled="${t.enabled}">
                          Edit Cost / State
                        </button>
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
    this.container.querySelector('#admin-brand-home').onclick = () => store.setState({ currentView: 'landing' });
    this.container.querySelector('#btn-admin-dashboard').onclick = () => store.setState({ currentView: 'dashboard' });
    this.container.querySelector('#btn-admin-studio').onclick = () => this.onOpenStudio();

    // Trigger backup
    const bkpBtn = this.container.querySelector('#btn-trigger-backup');
    if (bkpBtn) {
      bkpBtn.onclick = async () => {
        try {
          const res = await api.triggerBackup();
          toast.success(`Backup created: ${res.backup.filename} (${res.backup.size_kb} KB)`);
        } catch (e) {
          toast.error('Failed to trigger backup');
        }
      };
    }

    // Tab switching
    const tabOv = this.container.querySelector('#adm-tab-ov');
    const tabUsr = this.container.querySelector('#adm-tab-users');
    const tabTools = this.container.querySelector('#adm-tab-tools');
    const cOv = this.container.querySelector('#adm-content-ov');
    const cUsr = this.container.querySelector('#adm-content-users');
    const cTools = this.container.querySelector('#adm-content-tools');

    tabOv.onclick = () => {
      this.currentTab = 'overview';
      tabOv.classList.add('active'); tabUsr.classList.remove('active'); tabTools.classList.remove('active');
      cOv.style.display = 'block'; cUsr.style.display = 'none'; cTools.style.display = 'none';
    };
    tabUsr.onclick = () => {
      this.currentTab = 'users';
      tabUsr.classList.add('active'); tabOv.classList.remove('active'); tabTools.classList.remove('active');
      cUsr.style.display = 'block'; cOv.style.display = 'none'; cTools.style.display = 'none';
    };
    tabTools.onclick = () => {
      this.currentTab = 'tools';
      tabTools.classList.add('active'); tabOv.classList.remove('active'); tabUsr.classList.remove('active');
      cTools.style.display = 'block'; cOv.style.display = 'none'; cUsr.style.display = 'none';
    };

    // User credit adjustment
    this.container.querySelectorAll('.btn-adjust-credits').forEach(btn => {
      btn.onclick = async (e) => {
        const uid = e.target.getAttribute('data-user-id');
        const cur = e.target.getAttribute('data-credits');
        const nextVal = prompt('Set new credit balance for user:', cur);
        if (nextVal !== null) {
          await api.updateAdminUser(uid, { credits: parseInt(nextVal, 10) });
          toast.success('User credits updated!');
          this.loadData();
        }
      };
    });

    // Tool edit
    this.container.querySelectorAll('.btn-edit-tool').forEach(btn => {
      btn.onclick = async (e) => {
        const tid = e.target.getAttribute('data-tool-id');
        const cost = e.target.getAttribute('data-cost');
        const nextCost = prompt('Set credit cost for tool:', cost);
        if (nextCost !== null) {
          await api.updateAdminTool(tid, { credit_cost: parseInt(nextCost, 10) });
          toast.success('Tool credit consumption updated!');
          this.loadData();
        }
      };
    });
  }
}
