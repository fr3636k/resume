import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
const root = fileURLToPath(new URL('../', import.meta.url));
const result = spawnSync(process.execPath, ['scripts/build.mjs'], { cwd: root, stdio: 'inherit' });
if (result.status) process.exit(result.status);
const dir = path.join(root, 'dist');
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8' };
const port = Number(process.env.PORT || 4173);
createServer(async (req, res) => {
  try {
    // Also serve the project path locally to catch GitHub Pages subpath issues.
    let url = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (url === '/resume') { res.writeHead(302, {Location: '/resume/'}); return res.end(); }
    if (url.startsWith('/resume/')) url = url.slice('/resume'.length);
    const file = path.resolve(dir, `.${url.endsWith('/') ? url + 'index.html' : url}`);
    if (!file.startsWith(dir + path.sep)) { res.writeHead(403); return res.end(); }
    if (!(await stat(file)).isFile()) throw new Error('Not a file');
    res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(await readFile(file));
  } catch { res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' }); res.end(await readFile(path.join(dir, '404.html'))); }
}).listen(port, '127.0.0.1', () => console.log(`Local preview: http://127.0.0.1:${port}/resume/\nAfter source changes run npm run build and refresh.`));
