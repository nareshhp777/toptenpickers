'use strict';
const fs = require('fs');
const path = require('path');
const files = [];
function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('.html')) files.push(p);
  }
}
walk('_site');
const pat = /href="([^"#][^"]*)"/g;
const broken = [];
for (const f of files) {
  const c = fs.readFileSync(f, 'utf8');
  const rel = path.relative('_site', f).replace(/\\/g, '/');
  const idx = rel.lastIndexOf('/');
  const base = idx >= 0 ? rel.slice(0, idx) : '';
  for (const m of c.matchAll(pat)) {
    const u = m[1];
    if (u.startsWith('http') || u.startsWith('mailto:') || u.startsWith('#')) continue;
    let t;
    if (u.startsWith('/')) {
      t = u.endsWith('/') ? u + 'index.html' : (u.endsWith('.html') ? u : u + '/index.html');
    } else {
      t = base + '/' + u;
    }
    const tp = path.join('_site', t);
    if (!fs.existsSync(tp)) {
      broken.push({ from: rel, url: u, target: t });
    }
  }
}
console.log('Broken links:', broken.length);
for (const b of broken.slice(0, 30)) {
  console.log('  ' + b.from + ' -> ' + b.url);
}
