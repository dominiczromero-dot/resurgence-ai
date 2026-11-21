#!/usr/bin/env node
// Tiny static server so the dashboard can auto-load data/latest.json written by the daily script.
// Usage: node scripts/server.mjs  →  http://localhost:5173
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join, normalize, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PORT = +process.env.PORT || 5173;
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.md': 'text/markdown; charset=utf-8', '.css': 'text/css' };
const BLOCK = /(^|\/)(\.env|\.git|node_modules)(\/|$)/;

createServer(async (req, res) => {
  const url = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  const rel = normalize(url === '/' ? '/index.html' : url).replace(/^(\.\.[/\\])+/, '');
  if (req.method !== 'GET' || BLOCK.test(rel)) { res.writeHead(404).end(); return; }
  try {
    const body = await readFile(join(ROOT, rel));
    res.writeHead(200, { 'content-type': TYPES[extname(rel)] || 'application/octet-stream', 'cache-control': 'no-store' }).end(body);
  } catch { res.writeHead(404).end('Not found'); }
}).listen(PORT, '127.0.0.1', () => console.log(`Resurgence AI → http://localhost:${PORT}`));
