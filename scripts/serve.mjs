// Dependency-free static file server for local previews.
//
//   node scripts/serve.mjs --dir out --base /Personal-Portfolio --port 3000   (npm run preview)
//   node scripts/serve.mjs --dir version2 --port 4000                         (npm run v2)
//
// --base mounts the folder under a URL prefix, the way GitHub Pages serves this repo, so the
// built site's basePath URLs resolve locally exactly as they will in production.
import { createServer } from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, join, normalize, resolve } from 'node:path';

const args = Object.fromEntries(
  process.argv.slice(2).reduce((pairs, arg, i, all) => {
    if (arg.startsWith('--')) pairs.push([arg.slice(2), all[i + 1]]);
    return pairs;
  }, [])
);

const root = resolve(args.dir ?? 'out');
const base = (args.base ?? '').replace(/\/+$/, '');
const port = Number(args.port ?? 3000);

if (!existsSync(root)) {
  const hint = args.dir === 'version2'
    ? 'Create it with: mkdir version2 && git archive v2-html-final | tar -x -C version2'
    : 'Run `npm run build` first.';
  console.error(`serve: ${root} does not exist. ${hint}`);
  process.exit(1);
}

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif',
  '.gif': 'image/gif', '.ico': 'image/x-icon', '.mp4': 'video/mp4', '.webm': 'video/webm',
  '.woff': 'font/woff', '.woff2': 'font/woff2', '.pdf': 'application/pdf',
};

function send(res, status, file) {
  res.writeHead(status, { 'Content-Type': TYPES[extname(file).toLowerCase()] ?? 'application/octet-stream' });
  createReadStream(file).pipe(res);
}

createServer((req, res) => {
  const url = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);

  if (base && (url === '/' || url === '')) {
    res.writeHead(302, { Location: `${base}/` });
    return res.end();
  }
  if (base && !url.startsWith(`${base}/`) && url !== base) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    return res.end(`Not under ${base}/`);
  }

  const rel = normalize(url.slice(base.length)).replace(/^([/\\])+/, '');
  let file = join(root, rel);
  if (!file.startsWith(root)) {
    res.writeHead(403);
    return res.end();
  }
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
  if (!existsSync(file) && existsSync(`${file}.html`)) file = `${file}.html`;

  if (existsSync(file)) return send(res, 200, file);

  const notFound = join(root, '404.html');
  if (existsSync(notFound)) return send(res, 404, notFound);
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not found');
}).listen(port, () => {
  console.log(`Serving ${root} at http://localhost:${port}${base}/`);
});
