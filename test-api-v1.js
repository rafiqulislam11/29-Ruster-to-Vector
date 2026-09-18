/**
 * CreativeForge AI — Automated Test for Developer REST API v1
 * Tests API Key validation, vectorize, upscale, remove-bg, and presets endpoints
 */

const assert = require('assert');

async function runTests() {
  console.log('=== STARTING DEVELOPER REST API v1 TEST SUITE ===\n');

  const baseUrl = 'http://localhost:5000/api/v1';

  // 1. Test Presets Endpoint (Public)
  console.log('1. Testing GET /api/v1/presets...');
  const presetsRes = await fetch(`${baseUrl}/presets`);
  assert.strictEqual(presetsRes.status, 200, 'Presets must return 200 OK');
  const presets = await presetsRes.json();
  assert(presets.vector && presets.vector.length > 0, 'Vector presets must be returned');
  assert(presets.resolutionStandards.includes('300 PPI Print Master'), '300 PPI standard must be included');
  console.log('✓ Presets endpoint verified');

  // 2. Test Unauthorized Access (Missing Key)
  console.log('2. Testing missing API key protection...');
  const unauthRes = await fetch(`${baseUrl}/vectorize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ colors: 4 })
  });
  assert.strictEqual(unauthRes.status, 401, 'Must reject unauthenticated request with 401');
  console.log('✓ 401 Unauthorized protection verified');

  // 3. Test Authorized Vectorize with Live Sample Key
  console.log('3. Testing POST /api/v1/vectorize with valid key...');
  const vecRes = await fetch(`${baseUrl}/vectorize`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer cf_live_sample_developer_key_999'
    },
    body: JSON.stringify({ colors: 8, detail: 75, smoothness: 80 })
  });
  assert.strictEqual(vecRes.status, 200, 'Vectorize must return 200 OK');
  const vecData = await vecRes.json();
  assert.strictEqual(vecData.status, 'success', 'Vector status must be success');
  assert.strictEqual(vecData.resolutionPpi, 300, 'Vector resolution must be 300 PPI');
  console.log('✓ Developer Vectorize API verified with 300 PPI metadata');

  // 4. Test Authorized Upscaler
  console.log('4. Testing POST /api/v1/upscale...');
  const upRes = await fetch(`${baseUrl}/upscale`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': 'cf_live_sample_developer_key_999'
    },
    body: JSON.stringify({ resolution: '4K', sharpness: 90 })
  });
  assert.strictEqual(upRes.status, 200, 'Upscale must return 200 OK');
  const upData = await upRes.json();
  assert.strictEqual(upData.printResolutionPpi, 300, 'Upscale must report 300 PPI print resolution');
  console.log('✓ Developer Upscale API verified');

  // 5. Test Key Generation
  console.log('5. Testing POST /api/v1/keys...');
  const keyGenRes = await fetch(`${baseUrl}/keys`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Automated Test Runner', tier: 'enterprise' })
  });
  assert.strictEqual(keyGenRes.status, 201, 'Key creation must return 201 Created');
  const keyGenData = await keyGenRes.json();
  assert(keyGenData.apiKey.startsWith('cf_live_'), 'Key must start with cf_live_');
  console.log(`✓ New developer API key generated: ${keyGenData.apiKey}`);

  console.log('\n=== ALL DEVELOPER REST API v1 TESTS PASSED ===\n');
}

runTests().catch(err => {
  console.error('Test Suite Failed:', err);
  process.exit(1);
});
