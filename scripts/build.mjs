import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { basename, join } from 'node:path';

const outputDirectory = 'dist';
const sourceFiles = [
  'index.html',
  'style.css',
  'script.js',
  'devops.html',
  'devops.css',
  'devops.js',
  'health.json'
];

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });

for (const source of sourceFiles) {
  await cp(source, join(outputDirectory, basename(source)));
}

await cp('data', join(outputDirectory, 'data'), { recursive: true });

const packageJson = JSON.parse(await readFile('package.json', 'utf8'));
const commit = process.env.GITHUB_SHA?.slice(0, 7) ?? 'local';
const buildInfo = {
  version: `${packageJson.version}+${commit}`,
  commit,
  builtAt: new Date().toISOString()
};

await writeFile(join(outputDirectory, 'build-info.json'), `${JSON.stringify(buildInfo, null, 2)}\n`);
console.log(`Built ${outputDirectory}/ (${buildInfo.version})`);
