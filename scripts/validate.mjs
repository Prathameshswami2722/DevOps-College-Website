import { access, readFile } from 'node:fs/promises';

const requiredFiles = [
  'index.html',
  'style.css',
  'script.js',
  'data/programmes.json',
  'health.json',
  'Dockerfile',
  '.github/workflows/ci-cd.yml'
];

const errors = [];
for (const file of requiredFiles) {
  try {
    await access(file);
  } catch {
    errors.push(`Missing required file: ${file}`);
  }
}

const html = await readFile('index.html', 'utf8');
const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
if (duplicateIds.length) errors.push(`Duplicate HTML IDs: ${[...new Set(duplicateIds)].join(', ')}`);

for (const anchor of [...html.matchAll(/href="#([^"]+)"/g)].map((match) => match[1])) {
  if (!ids.includes(anchor)) errors.push(`Broken page anchor: #${anchor}`);
}

for (const jsonFile of ['data/programmes.json', 'health.json']) {
  try {
    JSON.parse(await readFile(jsonFile, 'utf8'));
  } catch (error) {
    errors.push(`Invalid JSON in ${jsonFile}: ${error.message}`);
  }
}

if (!html.includes('<meta name="viewport"')) errors.push('Missing responsive viewport meta tag');
if (!html.includes('class="skip-link"')) errors.push('Missing accessibility skip link');

if (errors.length) {
  console.error(errors.map((error) => `✗ ${error}`).join('\n'));
  process.exit(1);
}

console.log(`✓ Validation passed (${requiredFiles.length} required files, ${ids.length} unique IDs)`);
