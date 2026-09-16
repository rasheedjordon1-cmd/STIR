/**
 * Minimal static server that mimics Netlify's pretty-URL resolution, so the
 * exported bundle can be tested the way a host will actually serve it:
 *   /cart -> cart.html, /category/local -> category/local.html, else 404.html
 */
import { createServer } from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';

const ROOT = process.argv[2] ?? 'out';
const PORT = Number(process.env.PORT ?? 4321);

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.ico': 'image/x-icon',
  '.json': 'application/json', '.txt': 'text/plain; charset=utf-8', '.woff2': 'font/woff2',
};

const resolve = (pathname) => {
  const base = join(ROOT, normalize(pathname).replace(/^(\.\.[/\\])+/, ''));
  for (const candidate of [base, `${base}.html`, join(base, 'index.html')]) {
    if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
  }
  return null;
};

createServer((req, res) => {
  const { pathname } = new URL(req.url, 'http://localhost');
  const file = resolve(pathname === '/' ? '/index.html' : pathname);
  if (!file) {
    const notFound = join(ROOT, '404.html');
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    return existsSync(notFound) ? createReadStream(notFound).pipe(res) : res.end('Not found');
  }
  res.writeHead(200, { 'Content-Type': TYPES[extname(file)] ?? 'application/octet-stream' });
  createReadStream(file).pipe(res);
}).listen(PORT, () => console.log(`serving ${ROOT} on http://localhost:${PORT}`));
