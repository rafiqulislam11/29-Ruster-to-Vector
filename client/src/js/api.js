/**
 * CreativeForge AI — Frontend API Client
 */

class ApiClient {
  constructor() {
    this.baseUrl = '';
    this.token = localStorage.getItem('cf_token') || 'usr_pro';
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('cf_token', token);
    } else {
      localStorage.removeItem('cf_token');
    }
  }

  async request(endpoint, options = {}) {
    const headers = {
      ...(options.headers || {})
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
      headers['x-user-id'] = this.token;
    }

    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || `HTTP error ${response.status}`);
    }

    return data;
  }

  // Auth
  async getMe() {
    return this.request('/api/auth/me');
  }

  async login(email, password) {
    const res = await this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (res.token) this.setToken(res.token);
    return res;
  }

  async switchDemo(role) {
    const res = await this.request('/api/auth/switch-demo', {
      method: 'POST',
      body: JSON.stringify({ role })
    });
    if (res.token) this.setToken(res.token);
    return res;
  }

  // Projects
  async getProjects() {
    return this.request('/api/projects');
  }

  async getProject(id) {
    return this.request(`/api/projects/${id}`);
  }

  async createProject(name, initialAssetId) {
    return this.request('/api/projects', {
      method: 'POST',
      body: JSON.stringify({ name, initialAssetId })
    });
  }

  async updateProject(id, updates) {
    return this.request(`/api/projects/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
  }

  async duplicateProject(id) {
    return this.request(`/api/projects/${id}/duplicate`, {
      method: 'POST'
    });
  }

  async deleteProject(id) {
    return this.request(`/api/projects/${id}`, {
      method: 'DELETE'
    });
  }

  // Universal Upload
  async uploadFiles(files, projectId = null) {
    const formData = new FormData();
    for (const f of files) {
      formData.append('images', f);
    }
    if (projectId) formData.append('projectId', projectId);

    return this.request('/api/assets/upload', {
      method: 'POST',
      body: formData
    });
  }

  // Process & Jobs
  async startProcess(endpoint, payload) {
    return this.request(`/api/process/${endpoint}`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  async getJob(id) {
    return this.request(`/api/jobs/${id}`);
  }

  async getJobs() {
    return this.request('/api/jobs');
  }

  // Exports
  async saveExport(exportPayload) {
    return this.request('/api/exports/save-asset', {
      method: 'POST',
      body: JSON.stringify(exportPayload)
    });
  }

  async getExports() {
    return this.request('/api/exports');
  }

  // Admin
  async getAdminOverview() {
    return this.request('/api/admin/overview');
  }

  async getAdminUsers(search) {
    return this.request(`/api/admin/users${search ? '?search=' + encodeURIComponent(search) : ''}`);
  }

  async updateAdminUser(id, updates) {
    return this.request(`/api/admin/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
  }

  async getAdminTools() {
    return this.request('/api/admin/tools');
  }

  async updateAdminTool(id, updates) {
    return this.request(`/api/admin/tools/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
  }

  async triggerBackup() {
    return this.request('/api/admin/backup', { method: 'POST' });
  }

  // Studios, Presets, Metadata & Settings
  async getSettings() {
    return this.request('/api/settings');
  }

  async updateSettings(settings) {
    return this.request('/api/settings', {
      method: 'PATCH',
      body: JSON.stringify(settings)
    });
  }

  async getPresets() {
    return this.request('/api/presets');
  }

  async savePreset(preset) {
    return this.request('/api/presets', {
      method: 'POST',
      body: JSON.stringify(preset)
    });
  }

  async deletePreset(id) {
    return this.request(`/api/presets/${id}`, {
      method: 'DELETE'
    });
  }

  async getMetadataList() {
    return this.request('/api/metadata');
  }

  async saveMetadata(metadata) {
    return this.request('/api/metadata', {
      method: 'POST',
      body: JSON.stringify(metadata)
    });
  }

  async getHealth() {
    return this.request('/api/health');
  }
}

export const api = new ApiClient();
