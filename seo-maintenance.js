#!/usr/bin/env node
/**
 * seo-maintenance.js — three quick-win maintenance tasks for toptenpicker.com
 *
 *   Task 1: delete .png files that have an identical-basename .webp sibling
 *   Task 2: inject/replace canonical + hreflang tags in every .html <head>
 *   Task 3: regenerate sitemap.xml with every localized URL
 *
 * Zero dependencies — Node.js built-ins only.
 *
 * Usage:
 *   node seo-maintenance.js            # apply changes
 *   node seo-maintenance.js --dry-run  # report what would change, write nothing
 *
 * Idempotent: existing canonical/hreflang tags (including ones pointing at the
 * old typo domain "toptenpickers.com") are stripped and rebuilt, so running it
 * twice produces byte-identical output.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const BASE_URL = 'https://toptenpicker.com'; // matches CNAME — no "www"
const DRY_RUN = process.argv.includes('--dry-run');

// dir '' = English at the site root. Order here = order of the hreflang block.
const LOCALES = [
  { dir: '',   code: 'en' },
  { dir: 'es', code: 'es' },
  { dir: 'de', code: 'de' },
  { dir: 'fr', code: 'fr' },
  { dir: 'ja', code: 'ja' },
  { dir: 'pt', code: 'pt' },
  { dir: 'hi', code: 'hi' },
  { dir: 'ar', code: 'ar' },
  { dir: 'ko', code: 'ko' },
  { dir: 'it', code: 'it' },
];
const LOCALE_DIRS = new Set(LOCALES.filter(l => l.dir).map(l => l.dir));
const SKIP_DIRS = new Set(['.git', 'node_modules', '.claude']);

// ---------------------------------------------------------------- helpers

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) walk(path.join(dir, entry.name), out);
    } else {
      out.push(path.join(dir, entry.name));
    }
  }
  return out;
}

/** repo-relative path with forward slashes, e.g. "es/articles/foo.html" */
function relPosix(absPath) {
  return path.relative(ROOT, absPath).split(path.sep).join('/');
}

/** live URL for a repo-relative posix path; index.html collapses to dir/ */
function urlFor(rel) {
  if (rel === 'index.html') return BASE_URL + '/';
  if (rel.endsWith('/index.html')) return BASE_URL + '/' + rel.slice(0, -'index.html'.length);
  return BASE_URL + '/' + rel;
}

/**
 * Split "es/articles/foo.html" into { locale: 'es', sub: 'articles/foo.html' }.
 * Root files get locale ''.
 */
function splitLocale(rel) {
  const firstSeg = rel.split('/')[0];
  if (LOCALE_DIRS.has(firstSeg)) {
    return { locale: firstSeg, sub: rel.slice(firstSeg.length + 1) };
  }
  return { locale: '', sub: rel };
}

function isoDate(mtime) {
  return mtime.toISOString().slice(0, 10);
}

// ------------------------------------------------- Task 1: PNG bloat cleanup

function task1_cleanupPngs(allFiles) {
  console.log('\n=== Task 1: Image bloat cleanup (.png with matching .webp) ===');
  let deleted = 0;
  let savedBytes = 0;
  for (const file of allFiles) {
    if (!file.toLowerCase().endsWith('.png')) continue;
    const webpSibling = file.slice(0, -4) + '.webp';
    if (fs.existsSync(webpSibling)) {
      const size = fs.statSync(file).size;
      console.log(`  DELETE  ${relPosix(file)}  (${(size / 1024).toFixed(1)} KB)`);
      if (!DRY_RUN) fs.unlinkSync(file);
      deleted++;
      savedBytes += size;
    }
  }
  if (deleted === 0) {
    console.log('  No redundant .png files found — nothing to delete.');
  } else {
    console.log(`  ${DRY_RUN ? 'Would delete' : 'Deleted'} ${deleted} file(s), reclaiming ${(savedBytes / 1024 / 1024).toFixed(2)} MB.`);
  }
}

// --------------------------------------- Task 2: canonical + hreflang inject

// Any <link> carrying rel="canonical" or an hreflang attribute, plus its line.
const CANONICAL_RE = /[ \t]*<link\b[^>]*rel=["']canonical["'][^>]*>[ \t]*\r?\n?/gi;
const HREFLANG_RE  = /[ \t]*<link\b[^>]*\bhreflang=["'][^"']*["'][^>]*>[ \t]*\r?\n?/gi;

function buildSeoBlock(rel, eol, indent) {
  const lines = [`${indent}<link rel="canonical" href="${urlFor(rel)}">`];

  const { sub } = splitLocale(rel);
  // Only link language variants that actually exist on disk.
  const variants = LOCALES.filter(l =>
    fs.existsSync(path.join(ROOT, l.dir, ...sub.split('/')))
  );

  if (variants.length > 1) {
    for (const l of variants) {
      const variantRel = l.dir ? `${l.dir}/${sub}` : sub;
      lines.push(`${indent}<link rel="alternate" hreflang="${l.code}" href="${urlFor(variantRel)}">`);
    }
    if (variants.some(l => l.dir === '')) {
      lines.push(`${indent}<link rel="alternate" hreflang="x-default" href="${urlFor(sub)}">`);
    }
  }
  return lines.join(eol) + eol;
}

function task2_injectSeoTags(htmlFiles) {
  console.log('\n=== Task 2: Inject canonical + hreflang tags ===');
  let changed = 0;
  let untouched = 0;

  for (const file of htmlFiles) {
    const rel = relPosix(file);
    const original = fs.readFileSync(file, 'utf8');
    const eol = original.includes('\r\n') ? '\r\n' : '\n';

    // Strip every existing canonical/hreflang link so stale or typo'd tags
    // (e.g. the old "toptenpickers.com" canonicals) get rebuilt from scratch.
    let html = original.replace(CANONICAL_RE, '').replace(HREFLANG_RE, '');

    // Insert after the robots meta if present, otherwise just before </head>.
    const robotsMatch = html.match(/[ \t]*<meta\b[^>]*name=["']robots["'][^>]*>[ \t]*/i);
    let insertAt, indent;
    if (robotsMatch) {
      const lineEnd = html.indexOf('\n', robotsMatch.index);
      insertAt = lineEnd === -1 ? robotsMatch.index + robotsMatch[0].length : lineEnd + 1;
      indent = (robotsMatch[0].match(/^[ \t]*/) || [''])[0];
    } else {
      const headClose = html.search(/[ \t]*<\/head>/i);
      if (headClose === -1) {
        console.log(`  SKIP    ${rel}  (no </head> found)`);
        continue;
      }
      insertAt = headClose;
      indent = '  ';
    }

    const updated = html.slice(0, insertAt) + buildSeoBlock(rel, eol, indent) + html.slice(insertAt);

    if (updated === original) {
      untouched++;
      continue;
    }
    console.log(`  UPDATE  ${rel}`);
    if (!DRY_RUN) fs.writeFileSync(file, updated, 'utf8');
    changed++;
  }
  console.log(`  ${DRY_RUN ? 'Would update' : 'Updated'} ${changed} file(s); ${untouched} already correct.`);
}

// ------------------------------------------------- Task 3: sitemap.xml

function sitemapMeta(rel) {
  if (rel === 'index.html') return { priority: '1.0', changefreq: 'weekly' };
  if (rel.endsWith('/index.html')) return { priority: '0.9', changefreq: 'weekly' };
  if (/^(privacy-policy|disclaimer)\.html$/.test(rel)) return { priority: '0.3', changefreq: 'monthly' };
  if (/^(about|contact)\.html$/.test(rel)) return { priority: '0.5', changefreq: 'monthly' };
  return { priority: '0.8', changefreq: 'monthly' }; // articles
}

function task3_generateSitemap(htmlFiles) {
  console.log('\n=== Task 3: Generate sitemap.xml ===');
  const entries = htmlFiles
    .map(file => {
      const rel = relPosix(file);
      const { priority, changefreq } = sitemapMeta(rel);
      return {
        loc: urlFor(rel),
        lastmod: isoDate(fs.statSync(file).mtime),
        changefreq,
        priority,
      };
    })
    .sort((a, b) => b.priority - a.priority || a.loc.localeCompare(b.loc));

  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    entries.map(e =>
      '  <url>\n' +
      `    <loc>${e.loc}</loc>\n` +
      `    <lastmod>${e.lastmod}</lastmod>\n` +
      `    <changefreq>${e.changefreq}</changefreq>\n` +
      `    <priority>${e.priority}</priority>\n` +
      '  </url>\n'
    ).join('') +
    '</urlset>\n';

  const dest = path.join(ROOT, 'sitemap.xml');
  if (!DRY_RUN) fs.writeFileSync(dest, xml, 'utf8');
  console.log(`  ${DRY_RUN ? 'Would write' : 'Wrote'} ${entries.length} URLs to sitemap.xml`);
}

// ---------------------------------------------------------------- main

const allFiles = walk(ROOT);
const htmlFiles = allFiles.filter(f => f.toLowerCase().endsWith('.html')).sort();

console.log(`Scanning ${ROOT}`);
console.log(`Found ${htmlFiles.length} HTML files. ${DRY_RUN ? '(DRY RUN — no files will be modified)' : ''}`);

task1_cleanupPngs(allFiles);
task2_injectSeoTags(htmlFiles);
task3_generateSitemap(htmlFiles);

console.log('\nDone.');
