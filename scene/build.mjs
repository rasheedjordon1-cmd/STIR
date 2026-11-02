/* Adapted from diorama/templates/build.mjs @ 077f604 (MIT).
   Changes: cobalt page instead of white, this scene's canvas id, and the
   standalone named for this project. The function-replacer guard is kept —
   String.replace expands $& and friends, and a minified bundle contains them. */
import { build } from 'esbuild';
import { readFile, writeFile, mkdir } from 'node:fs/promises';

const minify = process.argv.includes('--minify');
await mkdir('dist', { recursive: true });

await build({
  entryPoints: ['src/main.js'],
  bundle: true,
  format: 'iife',
  outfile: 'dist/app.js',
  minify,
  target: ['es2020'],
  logLevel: 'info',
});

const page = (inline) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#0451AB">
<title>STIR — street corner</title>
<style>
  *{box-sizing:border-box}
  html,body{width:100%;height:100%;margin:0;padding:0;overflow:hidden;background:#0451AB}
  #view{display:block;width:100%;height:100%;image-rendering:pixelated}
</style>
</head>
<body><canvas id="view"></canvas>
${inline}
</body>
</html>
`;

const js = await readFile('dist/app.js', 'utf8');
await writeFile('index.html', page('<script src="./dist/app.js"></script>'));
await writeFile(
  'standalone.html',
  page(`<script>${js.replace(/<\/script/gi, '<\\/script')}</script>`)
);
console.log(`built dist/app.js (${Math.round(js.length / 1024)} kB), index.html, standalone.html`);
