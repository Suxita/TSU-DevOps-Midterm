const { test, before, after } = require('node:test');
const assert = require('node:assert');
const app = require('../src/app');

let server;
let base;

before(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, resolve);
  });
  base = `http://127.0.0.1:${server.address().port}`;
});

after(() => server.close());

test('GET /health returns 200 and status ok', async () => {
  const res = await fetch(`${base}/health`);
  assert.strictEqual(res.status, 200);
  const body = await res.json();
  assert.strictEqual(body.status, 'ok');
  assert.ok(body.timestamp);
  assert.strictEqual(body.service, 'devops-midterm-app');
  assert.strictEqual(body.checks.app, 'ok');
  assert.strictEqual(typeof body.memory.rssMB, 'number');
  assert.strictEqual(typeof body.uptimeSeconds, 'number');
});

test('GET /api/info returns app message', async () => {
  const res = await fetch(`${base}/api/info`);
  assert.strictEqual(res.status, 200);
  const body = await res.json();
  assert.match(body.message, /running/);
});

test('GET / serves the index.html page', async () => {
  const res = await fetch(`${base}/`);
  assert.strictEqual(res.status, 200);
  assert.match(res.headers.get('content-type'), /text\/html/);
  const html = await res.text();
  assert.match(html, /DevOps Midterm App/);
});
