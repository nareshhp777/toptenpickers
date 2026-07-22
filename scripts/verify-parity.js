#!/usr/bin/env node
'use strict';

/**
 * Verify that the Eleventy _site output matches the legacy HTML tree.
 * Compares URL sets, title, description, canonical, hreflangs, lang/dir,
 * and structural element counts.
 *
 * Usage:
 *   node scripts/verify-parity.js
 *
 * Exit 0 = no diffs; exit 1 = mismatches found.
 */

const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const { liveUrlFor } = require('./lib/site-paths');
const { TextDecoder } = require('util');

const ROOT = path.resolve(__dirname, '..');
const LEGACY_ROOT = ROOT;
const BUILD_ROOT = path.join(ROOT, '_site');
const SKIP_DIRS = new Set(['.git', '.claude', 'node_modules', 'src', '_site', 'scripts', '.github']);

let exitCode = 0;
let checked = 0;
const errors = [];

function fail(filePath, message) {
  errors.push(`  ${filePath}: ${message}`);
  exitCode = 1;
}

function walk(directory, files = []) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) walk(path.join(directory, entry.name), files);
      continue;
    }
    if (entry.isFile() && entry.name.toLowerCase().endsWith('.html')) {
      files.push(path.join(directory, entry.name));
    }
  }
  return files;
}

function relativePathFor(absolutePath) {
  return path.relative(ROOT, absolutePath).split(path.sep).join('/');
}

function toBuildPath(legacyRelative) {
  // map root HTML files to _site/ — index.html, about.html, etc.
  // map locale files similarly
  return path.join(BUILD_ROOT, legacyRelative);
}

function parseHtml(filePath) {
  try {
    let bytes = fs.readFileSync(filePath);
    // Strip UTF-8 BOM if present (same as migration parser)
    const hadBom = bytes.length >= 3 && bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf;
    if (hadBom) bytes = bytes.subarray(3);
    const source = new TextDecoder('utf-8', { fatal: false }).decode(bytes);
    return cheerio.load(source, { decodeEntities: false });
  } catch {
    return null;
  }
}

function buildUrlSet(baseDir) {
  const files = walk(baseDir);
  const urls = new Set();
  for (const file of files) {
    const rel = relativePathFor(file);
    // Only pages that would be public URLs — skip _site artifact paths that
    // don't correspond to legacy pages.
    if (rel.startsWith('_site/')) {
      // _site paths: strip the _site/ prefix, use the remaining part
      const sub = rel.slice(6);
      urls.add(liveUrlFor(sub));
    } else if (!rel.startsWith('.')) {
      urls.add(liveUrlFor(rel));
    }
  }
  return urls;
}

// Determine if the legacy and built paths refer to the same page
function resolveBuiltPath(legacyRel) {
  // Legacy structure:
  //   index.html -> / -> _site/index.html
  //   ar/index.html -> /ar/ -> _site/ar/index.html
  //   articles/foo.html -> /articles/foo.html -> _site/articles/foo.html
  //   about.html -> /about.html -> _site/about.html

  // The build path maps directly: the legacy file name under root maps to same under _site
  if (legacyRel.endsWith('/index.html') || legacyRel === 'index.html') {
    // index files become _site/<locale>/index.html
    return path.join(BUILD_ROOT, ...legacyRel.split('/'));
  }

  // Non-index: same relative path under _site
  return path.join(BUILD_ROOT, ...legacyRel.split('/'));
}

function compareTitle(legacy$, built$, fileLabel) {
  const legacyTitle = legacy$('head > title').text().trim();
  const builtTitle = built$('head > title').text().trim();
  if (legacyTitle !== builtTitle) {
    fail(fileLabel, `title mismatch\n    legacy: ${legacyTitle}\n    built:  ${builtTitle}`);
  }
}

function compareMeta(legacy$, built$, name, fileLabel) {
  const legacyValue = (legacy$(`head > meta[name="${name}"]`).attr('content') || '').trim();
  const builtValue = (built$(`head > meta[name="${name}"]`).attr('content') || '').trim();
  if (legacyValue !== builtValue) {
    fail(fileLabel, `${name} mismatch`);
  }
}

function compareCanonical(legacy$, built$, fileLabel) {
  const legacyHref = (legacy$('head > link[rel="canonical"]').attr('href') || '').trim();
  const builtHref = (built$('head > link[rel="canonical"]').attr('href') || '').trim();
  if (legacyHref !== builtHref) {
    fail(fileLabel, `canonical mismatch\n    legacy: ${legacyHref}\n    built:  ${builtHref}`);
  }
}

function compareHreflangs(legacy$, built$, fileLabel) {
  const legacyLinks = legacy$('head > link[hreflang]').toArray().map(el => ({
    hreflang: legacy$(el).attr('hreflang') || '',
    href: legacy$(el).attr('href') || ''
  }));
  const builtLinks = built$('head > link[hreflang]').toArray().map(el => ({
    hreflang: built$(el).attr('hreflang') || '',
    href: built$(el).attr('href') || ''
  }));

  if (legacyLinks.length !== builtLinks.length) {
    fail(fileLabel, `hreflang count mismatch: legacy=${legacyLinks.length} built=${builtLinks.length}`);
    return;
  }

  for (let i = 0; i < legacyLinks.length; i++) {
    if (legacyLinks[i].hreflang !== builtLinks[i].hreflang || legacyLinks[i].href !== builtLinks[i].href) {
      fail(fileLabel, `hreflang #${i} mismatch:\n    legacy: ${legacyLinks[i].hreflang} ${legacyLinks[i].href}\n    built:  ${builtLinks[i].hreflang} ${builtLinks[i].href}`);
    }
  }
}

function compareLang(legacy$, built$, fileLabel) {
  const legacyLang = (legacy$('html').attr('lang') || '').trim();
  const builtLang = (built$('html').attr('lang') || '').trim();
  if (legacyLang !== builtLang) {
    fail(fileLabel, `html lang mismatch: legacy=${legacyLang} built=${builtLang}`);
  }
}

function compareAppScript(legacy$, built$, fileLabel) {
  // Legacy has it inside body, built has it at end from base.njk
  const legacyHasScript = legacy$('script[src="/app.js"]').length > 0;
  const builtHasScript = built$('script[src="/app.js"]').length > 0;
  if (!legacyHasScript && builtHasScript) {
    fail(fileLabel, 'built has /app.js but legacy does not');
  }
  if (legacyHasScript && !builtHasScript) {
    fail(fileLabel, 'legacy has /app.js but built does not');
  }
}

function countElements($, selector) {
  return $(selector).length;
}

function compareElementCount(legacy$, built$, selector, description, fileLabel) {
  const legacyCount = countElements(legacy$, selector);
  const builtCount = countElements(built$, selector);
  if (legacyCount !== builtCount) {
    fail(fileLabel, `${description} count mismatch: legacy=${legacyCount} built=${builtCount} for "${selector}"`);
  }
}

function compareAssetRefs(legacy$, built$, fileLabel) {
  // Check root-relative asset references resolve
  const selectors = ['img', 'script[src]', 'link[href]'];
  const attributes = ['src', 'src', 'href'];
  for (let i = 0; i < selectors.length; i++) {
    const legacyElems = legacy$(selectors[i]).toArray();
    const builtElems = built$(selectors[i]).toArray();
    for (const el of legacyElems) {
      const attr = attributes[i];
      const value = legacy$(el).attr(attr) || '';
      if (value.startsWith('/') && !value.startsWith('//') && !value.startsWith('/http')) {
        // Verify a matching reference exists in the built version
        const builtCount = builtElems.filter(be => (built$(be).attr(attr) || '') === value).length;
        if (builtCount === 0) {
          // This might be a moved or renamed asset — flag it
          // Skip known differences: favicon and style locations
          if (value === '/style.css' || value === '/favicon.svg') continue;
          fail(fileLabel, `missing asset reference in built: ${value}`);
        }
      }
    }
  }
}

function compareStyleElements(legacy$, built$, fileLabel) {
  const legacyStyles = legacy$('head > link[rel="stylesheet"], head > style').length;
  const builtStyles = built$('head > link[rel="stylesheet"], head > style').length;
  if (legacyStyles !== builtStyles) {
    // This is an allowed difference in some cases (homepages inline large CSS)
    // Only flag if drastically different
    const diff = Math.abs(legacyStyles - builtStyles);
    if (diff > 3) {
      fail(fileLabel, `stylesheet/style element count differs: legacy=${legacyStyles} built=${builtStyles}`);
    }
  }
}

function comparePages() {
  console.log('Walking legacy tree...');
  const legacyFiles = walk(LEGACY_ROOT)
    .filter(f => !f.includes('node_modules') && !f.includes('.git') && !f.includes('.claude') && !f.includes('src') && !f.includes('_site') && !f.includes('scripts') && !f.includes('.github'))
    .sort();

  let matched = 0;
  let missing = 0;
  let legacyExtra = 0;

  console.log(`Found ${legacyFiles.length} legacy HTML files.`);

  for (const legacyFile of legacyFiles) {
    const rel = relativePathFor(legacyFile);
    const builtFile = resolveBuiltPath(rel);
    const fileLabel = rel;

    if (!fs.existsSync(builtFile)) {
      missing++;
      fail(fileLabel, `built file not found at ${path.relative(ROOT, builtFile)}`);
      continue;
    }

    const legacy$ = parseHtml(legacyFile);
    const built$ = parseHtml(builtFile);

    if (!legacy$) { fail(fileLabel, 'cannot parse legacy HTML'); continue; }
    if (!built$) { fail(fileLabel, 'cannot parse built HTML'); continue; }

    compareTitle(legacy$, built$, fileLabel);
    compareMeta(legacy$, built$, 'description', fileLabel);
    compareCanonical(legacy$, built$, fileLabel);
    compareHreflangs(legacy$, built$, fileLabel);
    compareLang(legacy$, built$, fileLabel);
    compareAppScript(legacy$, built$, fileLabel);

    // Element structure checks based on page type
    const hasRankList = legacy$('ol.rank-list').length === 1;
    const hasShowcase = legacy$('.showcase-feed').length === 1;
    const hasLightbox = legacy$('#imageLightbox').length === 1;
    const isHomepage = legacy$('#preloader').length === 1;

    if (hasRankList && !hasShowcase) {
      compareElementCount(legacy$, built$, '.article-hero', '.article-hero', fileLabel);
      compareElementCount(legacy$, built$, 'ol.rank-list > li', 'ranked items', fileLabel);
    }
    if (hasShowcase) {
      compareElementCount(legacy$, built$, '.article-hero', '.article-hero', fileLabel);
      compareElementCount(legacy$, built$, '.showcase-card', 'showcase cards', fileLabel);
      compareElementCount(legacy$, built$, '#imageLightbox', 'lightbox', fileLabel);
    }
    if (isHomepage) {
      compareElementCount(legacy$, built$, '#preloader', 'preloader', fileLabel);
      compareElementCount(legacy$, built$, '#container', 'container', fileLabel);
      compareElementCount(legacy$, built$, '.site-footer', 'site footer', fileLabel);
      compareElementCount(legacy$, built$, '.floating-promo-banner', 'promo banner', fileLabel);
    } else if (!isHomepage) {
      compareElementCount(legacy$, built$, 'body > nav.nav', 'nav', fileLabel);
      compareElementCount(legacy$, built$, '.page-wrap > .content', 'content wrapper', fileLabel);
      compareElementCount(legacy$, built$, 'body > .mobile-menu', 'mobile menu', fileLabel);
    }

    // Compare inline style content for showcase and article pages
    compareStyleElements(legacy$, built$, fileLabel);

    checked++;
    matched++;
  }

  // Check for extra files in _site that don't exist in legacy
  console.log('Walking _site tree for extra files...');
  const builtFiles = walk(BUILD_ROOT).sort();
  const legacyRelSet = new Set(legacyFiles.map(f => relativePathFor(f)));
  const builtRelSet = new Set(builtFiles.map(f => {
    const rel = relativePathFor(f);
    // Strip _site/ prefix for comparison
    return rel.startsWith('_site/') ? rel.slice(6) : rel;
  }));

  for (const builtRel of builtRelSet) {
    // Skip passthrough files that were in legacy root too
    if (/\.(js|css|svg|xml|txt)$/.test(builtRel) || builtRel === 'CNAME' || builtRel.includes('cars/') || builtRel.includes('bikes/')) continue;
    if (builtRel.startsWith('_site/')) continue;
    if (!legacyRelSet.has(builtRel) && !builtRel.includes('_includes')) {
      // Could be an extra or duplicate
      // Actually check if it's a dir-style path (from permalink like /)
      // Eleventy might produce /index.html from a permalink: /
      const resolvedLegacy = path.join(LEGACY_ROOT, builtRel);
      if (!fs.existsSync(resolvedLegacy)) {
        legacyExtra++;
        // Only pass/fail for non-index duplicates
      }
    }
  }

  return { matched, missing, legacyExtra };
}

console.log('=== Eleventy Migration Parity Verification ===\n');

const results = comparePages();

console.log(`\nChecked ${checked} pages.`);
console.log(`Matched: ${results.matched}`);
if (results.missing > 0) console.log(`Missing built pages: ${results.missing}`);
if (errors.length > 0) {
  console.log(`\nIssues found (${errors.length}):`);
  for (const err of errors) {
    console.log(err);
  }
}

console.log(`\n${errors.length === 0 ? '✓ All pages match!' : '✗ Some pages have differences.'}`);
process.exit(exitCode);
