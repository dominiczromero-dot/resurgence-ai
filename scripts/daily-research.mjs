#!/usr/bin/env node
// Resurgence AI: daily research job.
// Usage:  YT_API_KEY=AIza... node scripts/daily-research.mjs
// Writes: data/latest.json, data/history.json, reports/YYYY-MM-DD.md (and saves resolved channel IDs into config.json)
// Never writes placeholder data: if the API fails completely, it exits with an error and leaves the previous files untouched.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const C = require(join(ROOT, 'core.js'));

function loadEnv() {
  const f = join(ROOT, '.env');
  if (!existsSync(f)) return;
  for (const line of readFileSync(f, 'utf8').split('\n')) {
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}
const readJson = (p, d) => { try { return JSON.parse(readFileSync(p, 'utf8')); } catch { return d; } };
const writeJson = (p, v) => { mkdirSync(dirname(p), { recursive: true }); writeFileSync(p, JSON.stringify(v, null, 1)); };

loadEnv();
const key = process.env.YT_API_KEY;
if (!key) { console.error('Missing YT_API_KEY. Set it as an environment variable, in .env, or as a GitHub Actions secret.'); process.exit(2); }

const cfgPath = join(ROOT, 'config.json');
const userCfg = readJson(cfgPath, {});
const config = C.mergeConfig(userCfg);
const histPath = join(ROOT, 'data', 'history.json');
const history = readJson(histPath, []);

const started = Date.now();
let research;
try {
  research = await C.research({ apiKey: key, config, onProgress: p => console.log(`[${String(p.quota).padStart(5)}u] ${p.msg}`) });
} catch (e) {
  console.error('Research failed:', e.message, e.reason ? `(${e.reason})` : '');
  process.exit(1);
}
if (!research.videos.length) {
  console.error('Research returned no videos. Errors:\n - ' + research.errors.join('\n - '));
  process.exit(1);
}

const analysis = C.analyze(research, config, history);
const newHistory = C.addSnapshot(history, C.snapshot(research, analysis));
const tz = config.timeZone || process.env.REPORT_TZ || 'America/Los_Angeles';
const md = C.report(analysis, { timeZone: tz });
const day = research.researchedAt.slice(0, 10);

writeJson(join(ROOT, 'data', 'latest.json'), research);
writeJson(histPath, newHistory);
mkdirSync(join(ROOT, 'reports'), { recursive: true });
writeFileSync(join(ROOT, 'reports', `${day}.md`), md);
writeFileSync(join(ROOT, 'reports', 'latest.md'), md);

// cache resolved channel IDs so name lookups (100 units each) only happen once
userCfg.competitors = research.competitors.map(c => {
  const prev = (userCfg.competitors || []).find(x => x.input === c.input) || {};
  const status = prev.id && prev.id === c.id && prev.status ? prev.status : (c.status || (c.id ? 'verified' : 'not found'));
  return { input: c.input, id: c.id, status, matchedBy: c.matchedBy || prev.matchedBy, title: c.title };
});
writeJson(cfgPath, userCfg);

console.log(`\nDone in ${((Date.now() - started) / 1000).toFixed(0)}s · ${research.quotaUsed} quota units · ${research.videos.length} videos · ${research.errors.length} error(s)`);
for (const c of userCfg.competitors.filter(c => c.status !== 'verified')) console.log(`  ! Check channel match for "${c.input}": ${c.status}${c.title ? ' → ' + c.title : ''}`);
const top = analysis.ideas[0];
if (top) console.log(`\n#1 video to make: ${top.titles[0]?.title}  (${top.score}/100, ${top.verdict})`);
console.log(`Report: reports/${day}.md`);
