import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (path) => readFile(path, 'utf8');

test('home page contains semantic sections and accessible navigation', async () => {
  const html = await read('index.html');
  assert.match(html, /<main id="main-content">/);
  assert.match(html, /<nav[^>]+aria-label="Main navigation"/);
  assert.match(html, /id="programmes"/);
  assert.match(html, /id="admissions"/);
});

test('programme catalogue is structured and unique', async () => {
  const programmes = JSON.parse(await read('data/programmes.json'));
  assert.ok(programmes.length >= 3);
  assert.equal(new Set(programmes.map(({ id }) => id)).size, programmes.length);
  for (const programme of programmes) {
    assert.ok(programme.id && programme.name && programme.description && programme.icon);
    assert.equal(typeof programme.featured, 'boolean');
  }
});

test('health document describes a healthy service', async () => {
  const health = JSON.parse(await read('health.json'));
  assert.deepEqual(health, { status: 'ok', service: 'asteria-college-website' });
});

test('CI/CD workflow includes test, container and deployment stages', async () => {
  const workflow = await read('.github/workflows/ci-cd.yml');
  assert.match(workflow, /npm run ci/);
  assert.match(workflow, /docker\/build-push-action/);
  assert.match(workflow, /actions\/deploy-pages/);
});
