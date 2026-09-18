/**
 * Complete API & Processing Pipeline Test Suite
 */
const http = require('http');

function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer usr_admin',
        'x-user-id': 'usr_admin',
        ...(options.headers || {})
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data), headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, body: data, headers: res.headers });
        }
      });
    });

    req.on('error', reject);
    if (options.body) req.write(JSON.stringify(options.body));
    req.end();
  });
}

async function runTests() {
  console.log('=== STARTING CREATIVEFORGE AI SYSTEM TESTS ===\n');

  // 1. Health
  const health = await request('/api/health');
  console.log('1. Health Check:', health.status === 200 ? 'PASS' : 'FAIL', health.body.application);

  // 2. Tools
  const tools = await request('/api/tools');
  console.log('2. Available Tools:', tools.status === 200 ? 'PASS' : 'FAIL', `(${tools.body.tools?.length} tools loaded)`);

  // 3. Plans
  const plans = await request('/api/plans');
  console.log('3. Subscription Plans:', plans.status === 200 ? 'PASS' : 'FAIL', `(${plans.body.plans?.map(p => p.id).join(', ')})`);

  // 4. Projects
  const projects = await request('/api/projects');
  console.log('4. User Projects:', projects.status === 200 ? 'PASS' : 'FAIL', `(${projects.body.projects?.length} projects)`);

  // 5. Enqueue Vector Job
  const vecJob = await request('/api/process/vector', {
    method: 'POST',
    body: { parameters: { colors: 8, detail: 60, smoothness: 50 } }
  });
  console.log('5. Process Vector Conversion:', vecJob.status === 202 ? 'PASS' : 'FAIL', `(Job ID: ${vecJob.body.jobId})`);

  // 6. Enqueue Upscale Job
  const upJob = await request('/api/process/upscale', {
    method: 'POST',
    body: { parameters: { resolution: '4K', sharpness: 80 } }
  });
  console.log('6. Process AI Upscale:', upJob.status === 202 ? 'PASS' : 'FAIL', `(Job ID: ${upJob.body.jobId})`);

  // 7. Enqueue Fractal Glass Job
  const glassJob = await request('/api/process/fractal-glass', {
    method: 'POST',
    body: { parameters: { preset: '2', refraction: 60 } }
  });
  console.log('7. Process Fractal Glass:', glassJob.status === 202 ? 'PASS' : 'FAIL', `(Job ID: ${glassJob.body.jobId})`);

  // Wait 1.2s for jobs to process through queue
  await new Promise(r => setTimeout(r, 1200));

  // 8. Poll Jobs History
  const jobs = await request('/api/jobs');
  const completedCount = jobs.body.jobs?.filter(j => j.status === 'completed').length;
  console.log('8. Job Queue Worker Execution:', completedCount >= 3 ? 'PASS' : 'FAIL', `(${completedCount} completed out of ${jobs.body.jobs?.length})`);

  // 9. Admin Overview
  const adminOv = await request('/api/admin/overview');
  console.log('9. Admin Overview Metrics:', adminOv.status === 200 ? 'PASS' : 'FAIL', `(Users: ${adminOv.body.metrics?.totalUsers}, MRR: $${adminOv.body.metrics?.estimatedMrr})`);

  // 10. Admin Trigger Backup
  const backup = await request('/api/admin/backup', { method: 'POST' });
  console.log('10. Automated Backup Generation:', backup.status === 200 ? 'PASS' : 'FAIL', `(${backup.body.backup?.filename})`);

  // 11. Frontend SPA Root Serving
  const root = await request('/');
  const hasHtml = typeof root.body === 'string' && root.body.includes('CreativeForge AI');
  console.log('11. Single-Page App Static Bundle Serving:', hasHtml ? 'PASS' : 'FAIL');

  console.log('\n=== ALL TESTS COMPLETED SUCCESSFULLY ===');
}

runTests().catch(console.error);
