/**
 * Builds the fully static export and zips it for drag-and-drop hosting.
 *
 *   npm run package   ->  dist/spicemart-prototype-<date>.zip
 *
 * The zip's contents are the publish directory itself, so on Netlify you drop
 * the zip straight onto the deploy area — no build step, no configuration.
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync, statSync } from 'node:fs';

// Date plus the commit it was built from, so two builds on the same day are
// never mistaken for each other once they are sitting in a downloads folder.
const stamp = new Date().toISOString().slice(0, 10);
const sha = execFileSync('git', ['rev-parse', '--short', 'HEAD']).toString().trim();
const out = `dist/spicemart-prototype-${stamp}-${sha}.zip`;

rmSync('out', { recursive: true, force: true });
rmSync('dist', { recursive: true, force: true });
mkdirSync('dist', { recursive: true });

console.log('Building static export…');
execFileSync('npx', ['next', 'build'], {
  stdio: 'inherit',
  env: { ...process.env, STATIC_EXPORT: 'true' },
});

console.log('Zipping…');
// Zip the CONTENTS of out/, so the archive root is the site root.
execFileSync('zip', ['-rq', `../${out}`, '.'], { cwd: 'out', stdio: 'inherit' });

const mb = (statSync(out).size / 1024 / 1024).toFixed(1);
console.log(`\n${out}  (${mb} MB)`);
