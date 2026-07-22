#!/usr/bin/env node
'use strict';

/**
 * Convert the legacy HTML tree into Eleventy source pages.
 *
 * The default mode validates and reports only. Nothing is written unless the
 * caller explicitly passes --write.
 *
 *   node scripts/migrate-to-eleventy.js
 *   node scripts/migrate-to-eleventy.js --write
 */

const fs = require('fs');
const path = require('path');
const { TextDecoder } = require('util');
const cheerio = require('cheerio');
const YAML = require('yaml');
const {
  BASE_URL,
  LOCALES,
  liveUrlFor,
  permalinkFor,
  splitLocale,
  toPosix
} = require('./lib/site-paths');

const ROOT = path.resolve(__dirname, '..');
const OUTPUT_ROOT = path.join(ROOT, 'src');
const WRITE = process.argv.includes('--write');
const FORCE = process.argv.includes('--force');
const ALLOWED_FLAGS = ['--write', '--force'];
const UNKNOWN_ARGS = process.argv.slice(2).filter(argument => !ALLOWED_FLAGS.includes(argument));

const SKIP_DIRS = new Set(['.git', '.claude', 'node_modules', 'src', '_site']);
const STATIC_PAGES = new Set([
  'about.html',
  'contact.html',
  'disclaimer.html',
  'privacy-policy.html'
]);
const EXPECTED_COUNTS = {
  homepage: 10,
  standardArticle: 190,
  showcase: 10,
  static: 4,
  total: 214
};
const LAYOUTS = {
  homepage: 'layouts/homepage.njk',
  standardArticle: 'layouts/article.njk',
  showcase: 'layouts/showcase.njk',
  static: 'layouts/article.njk'
};
const EXPECTED_LANGS = new Set(LOCALES.map(locale => locale.code));
const UTF8_DECODER = new TextDecoder('utf-8', { fatal: true });

function fail(message) {
  throw new Error(message);
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
  return toPosix(path.relative(ROOT, absolutePath));
}

function readUtf8(absolutePath) {
  let bytes = fs.readFileSync(absolutePath);
  const hadBom = bytes.length >= 3 && bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf;
  if (hadBom) bytes = bytes.subarray(3);

  let source;
  try {
    source = UTF8_DECODER.decode(bytes);
  } catch {
    fail(`${relativePathFor(absolutePath)} is not valid UTF-8`);
  }

  return { source: source.replace(/\r\n?/g, '\n'), hadBom };
}

function exactlyOne($, selector, relativePath) {
  const matches = $(selector);
  if (matches.length !== 1) {
    fail(`${relativePath}: expected one ${selector}, found ${matches.length}`);
  }
  return matches.first();
}

function sourceLocation(element, relativePath, label) {
  const location = element && element.sourceCodeLocation;
  if (!location) fail(`${relativePath}: no source location for ${label}`);
  return location;
}

function outerSource(source, element, relativePath, label) {
  const location = sourceLocation(element, relativePath, label);
  return source.slice(location.startOffset, location.endOffset);
}

function innerSource(source, element, relativePath, label) {
  const location = sourceLocation(element, relativePath, label);
  if (!location.startTag || !location.endTag) {
    fail(`${relativePath}: ${label} does not have explicit opening and closing tags`);
  }
  return source.slice(location.startTag.endOffset, location.endTag.startOffset);
}

function requireAttribute(node, attribute, relativePath, label) {
  const value = node.attr(attribute);
  if (value === undefined || value === '') {
    fail(`${relativePath}: ${label} is missing ${attribute}`);
  }
  return value;
}

function classify($, relativePath) {
  const { subject } = splitLocale(relativePath);
  const isHomepagePath = subject === 'index.html';
  const isArticlePath = subject.startsWith('articles/');
  const isStaticPath = !relativePath.includes('/') && STATIC_PAGES.has(relativePath);
  const hasRankList = $('ol.rank-list').length === 1;
  const hasShowcase = $('.showcase-feed').length === 1;
  const hasLightbox = $('#imageLightbox').length === 1;

  const matches = [];
  if (isHomepagePath) matches.push('homepage');
  if (isArticlePath && hasRankList && !hasShowcase) matches.push('standardArticle');
  if (isArticlePath && hasShowcase && hasLightbox && !hasRankList) matches.push('showcase');
  if (isStaticPath && !hasRankList && !hasShowcase) matches.push('static');

  if (matches.length !== 1) {
    fail(`${relativePath}: expected one page family, matched ${matches.join(', ') || 'none'}`);
  }
  return matches[0];
}

function validateFamily($, family, relativePath) {
  if (family === 'homepage') {
    for (const selector of [
      '#preloader',
      '#preloaderCounter',
      '#preloaderBar',
      '#cursor',
      '#cursorLogo',
      '#sideNav',
      '#navCounter',
      '#scrollHint',
      '#container',
      '.site-footer',
      '.floating-promo-banner'
    ]) exactlyOne($, selector, relativePath);

    const bodyScripts = $('body script:not([src])').toArray()
      .map(element => $(element).text())
      .join('\n');
    for (const declaration of ['carThemes', 'cursorBrands', 'cars', 'angleNames', 'angleLabels']) {
      if (!new RegExp(`\\b(?:const|let|var)\\s+${declaration}\\b`).test(bodyScripts)) {
        fail(`${relativePath}: homepage data is missing ${declaration}`);
      }
    }
  }

  if (family === 'standardArticle') {
    exactlyOne($, '.article-hero', relativePath);
    exactlyOne($, 'ol.rank-list', relativePath);
    if ($('ol.rank-list > li').length !== 10) {
      fail(`${relativePath}: expected 10 ranked entries, found ${$('ol.rank-list > li').length}`);
    }
  }

  if (family === 'showcase') {
    exactlyOne($, '.article-hero', relativePath);
    exactlyOne($, '.showcase-feed', relativePath);
    exactlyOne($, '#imageLightbox', relativePath);
    if ($('.showcase-card').length !== 10) {
      fail(`${relativePath}: expected 10 showcase cards, found ${$('.showcase-card').length}`);
    }
    if ($('.bento-gallery img').length !== 30) {
      fail(`${relativePath}: expected 30 showcase images, found ${$('.bento-gallery img').length}`);
    }
  }

  if (family !== 'homepage') {
    exactlyOne($, 'body > nav.nav', relativePath);
    exactlyOne($, '.page-wrap', relativePath);
    exactlyOne($, '.page-wrap > .content', relativePath);
    exactlyOne($, '.page-wrap > .footer', relativePath);
    exactlyOne($, 'body > .mobile-menu', relativePath);
  }
}

function extractHeadFragments($, source, relativePath) {
  const head = exactlyOne($, 'head', relativePath)[0];
  const children = $(head).children().toArray();
  const managed = new Set();
  const lead = [];
  const tail = [];
  let seenManagedMetadata = false;

  for (const child of children) {
    const node = $(child);
    const tag = (child.tagName || '').toLowerCase();
    const isManaged =
      tag === 'title' ||
      (tag === 'meta' && ['charset', 'viewport', 'description', 'robots'].includes((node.attr('name') || (node.attr('charset') ? 'charset' : '')).toLowerCase())) ||
      (tag === 'link' && ((node.attr('rel') || '').toLowerCase() === 'canonical' || node.attr('hreflang') !== undefined));

    if (isManaged) {
      managed.add(child);
      seenManagedMetadata = true;
      continue;
    }

    const raw = outerSource(source, child, relativePath, `head ${tag || 'node'}`).trim();
    if (!raw) continue;
    if (!seenManagedMetadata && tag === 'script') lead.push(raw);
    else tail.push(raw);
  }

  return {
    headLeadHtml: lead.join('\n'),
    headTailHtml: tail.join('\n')
  };
}

function extractMetadata($, source, relativePath, family) {
  const html = exactlyOne($, 'html', relativePath);
  const title = exactlyOne($, 'head > title', relativePath).text();
  const description = requireAttribute(
    exactlyOne($, 'head > meta[name="description"]', relativePath),
    'content',
    relativePath,
    'description meta'
  );
  const robots = requireAttribute(
    exactlyOne($, 'head > meta[name="robots"]', relativePath),
    'content',
    relativePath,
    'robots meta'
  );
  const canonical = requireAttribute(
    exactlyOne($, 'head > link[rel="canonical"]', relativePath),
    'href',
    relativePath,
    'canonical link'
  );
  const hreflangs = $('head > link[hreflang]').toArray().map(element => {
    const node = $(element);
    return {
      hreflang: requireAttribute(node, 'hreflang', relativePath, 'alternate link'),
      href: requireAttribute(node, 'href', relativePath, 'alternate link')
    };
  });
  const lang = requireAttribute(html, 'lang', relativePath, 'html element');
  const dir = html.attr('dir') || 'ltr';
  const { code } = splitLocale(relativePath);

  if (!EXPECTED_LANGS.has(lang)) fail(`${relativePath}: unsupported html language ${lang}`);
  if (lang !== code) fail(`${relativePath}: path locale ${code} does not match html language ${lang}`);
  if (dir !== (lang === 'ar' ? 'rtl' : 'ltr')) fail(`${relativePath}: unexpected text direction ${dir}`);
  if (canonical !== liveUrlFor(relativePath)) {
    fail(`${relativePath}: canonical ${canonical} does not match ${liveUrlFor(relativePath)}`);
  }
  if (!canonical.startsWith(BASE_URL)) fail(`${relativePath}: unexpected canonical domain`);

  if (family === 'static' && hreflangs.length !== 0) {
    fail(`${relativePath}: static pages must not have hreflang links`);
  }
  if (family !== 'static' && hreflangs.length !== 11) {
    fail(`${relativePath}: expected 11 hreflang links, found ${hreflangs.length}`);
  }
  for (const alternate of hreflangs) {
    if (!alternate.href.startsWith(BASE_URL)) {
      fail(`${relativePath}: unexpected hreflang domain in ${alternate.href}`);
    }
  }

  return {
    layout: LAYOUTS[family],
    family: family === 'standardArticle' ? 'article' : family,
    title,
    description,
    robots,
    canonical,
    hreflangs,
    lang,
    dir,
    permalink: permalinkFor(relativePath),
    ...extractHeadFragments($, source, relativePath)
  };
}

function isSharedAppScript($, element) {
  return element.tagName === 'script' && $(element).attr('src') === '/app.js';
}

function bodyWithoutSharedScript($, source, relativePath) {
  const body = exactlyOne($, 'body', relativePath)[0];
  const bodyLocation = sourceLocation(body, relativePath, 'body');
  const sharedScripts = $('body > script[src="/app.js"]').toArray();
  if (sharedScripts.length !== 1) {
    fail(`${relativePath}: expected one shared /app.js script, found ${sharedScripts.length}`);
  }
  const scriptLocation = sourceLocation(sharedScripts[0], relativePath, 'shared app script');
  if (scriptLocation.startOffset < bodyLocation.startTag.endOffset || scriptLocation.endOffset > bodyLocation.endTag.startOffset) {
    fail(`${relativePath}: shared app script is outside the body range`);
  }

  const before = source.slice(bodyLocation.startTag.endOffset, scriptLocation.startOffset);
  const after = source.slice(scriptLocation.endOffset, bodyLocation.endTag.startOffset);
  return `${before}${after}`.trim();
}

function extractBodyFields($, source, relativePath, family) {
  const body = exactlyOne($, 'body', relativePath);
  const bodyClass = body.attr('class') || '';

  if (family === 'homepage') {
    return {
      bodyClass,
      content: bodyWithoutSharedScript($, source, relativePath)
    };
  }

  const nav = exactlyOne($, 'body > nav.nav', relativePath)[0];
  const content = exactlyOne($, '.page-wrap > .content', relativePath)[0];
  const footer = exactlyOne($, '.page-wrap > .footer', relativePath)[0];
  const mobileMenu = exactlyOne($, 'body > .mobile-menu', relativePath)[0];
  const fields = {
    bodyClass,
    navHtml: outerSource(source, nav, relativePath, 'navigation').trim(),
    content: innerSource(source, content, relativePath, 'content').trim(),
    footerHtml: innerSource(source, footer, relativePath, 'footer').trim(),
    mobileMenuHtml: outerSource(source, mobileMenu, relativePath, 'mobile menu').trim()
  };

  exactlyOne($, 'body > script[src="/app.js"]', relativePath);

  if (family === 'showcase') {
    const lightbox = exactlyOne($, 'body > #imageLightbox', relativePath)[0];
    const pageScripts = $('body > script:not([src])').toArray().filter(element => {
      const type = ($(element).attr('type') || '').toLowerCase();
      const script = $(element).text();
      return type !== 'application/ld+json' && /(?:\.bento-gallery|imageLightbox)/.test(script);
    });
    if (pageScripts.length !== 1) {
      fail(`${relativePath}: expected one showcase behavior script, found ${pageScripts.length}`);
    }
    fields.lightboxHtml = outerSource(source, lightbox, relativePath, 'lightbox').trim();
    fields.pageScriptHtml = outerSource(source, pageScripts[0], relativePath, 'showcase script').trim();
  }

  return fields;
}

function hasSuspiciousEncoding(source) {
  return /(?:Ã|â€|â€™|â€œ|â€|Â|�)/u.test(source);
}

function serializePage(frontMatter, content, relativePath) {
  const document = new YAML.Document(frontMatter);
  document.options.lineWidth = 0;
  document.options.defaultStringType = 'QUOTE_DOUBLE';
  document.options.defaultKeyType = 'PLAIN';

  const yaml = document.toString({ lineWidth: 0 });
  const parsed = YAML.parse(yaml);
  if (JSON.stringify(parsed) !== JSON.stringify(frontMatter)) {
    fail(`${relativePath}: front matter failed round-trip validation`);
  }

  return `---\n${yaml}---\n${content ? `${content.trim()}\n` : ''}`;
}

function outputPathFor(relativePath) {
  return path.resolve(OUTPUT_ROOT, ...relativePath.split('/'));
}

function assertInsideOutput(destination, relativePath) {
  const relative = path.relative(OUTPUT_ROOT, destination);
  if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) {
    fail(`${relativePath}: destination escapes src (${destination})`);
  }
}

function migrateFile(absolutePath) {
  const relativePath = relativePathFor(absolutePath);
  const { source, hadBom } = readUtf8(absolutePath);
  const $ = cheerio.load(source, {
    decodeEntities: false,
    sourceCodeLocationInfo: true,
    scriptingEnabled: true
  });

  const family = classify($, relativePath);
  validateFamily($, family, relativePath);
  const metadata = extractMetadata($, source, relativePath, family);
  const fields = extractBodyFields($, source, relativePath, family);
  const content = fields.content;
  delete fields.content;

  const frontMatter = { ...metadata, ...fields };
  for (const key of Object.keys(frontMatter)) {
    if (frontMatter[key] === '') delete frontMatter[key];
  }

  const destination = outputPathFor(relativePath);
  assertInsideOutput(destination, relativePath);

  return {
    relativePath,
    destination,
    family,
    hadBom,
    suspiciousEncoding: hasSuspiciousEncoding(source),
    permalink: metadata.permalink,
    output: serializePage(frontMatter, content, relativePath)
  };
}

function validateInventory(pages) {
  const counts = pages.reduce((result, page) => {
    result[page.family]++;
    result.total++;
    return result;
  }, { homepage: 0, standardArticle: 0, showcase: 0, static: 0, total: 0 });

  for (const [family, expected] of Object.entries(EXPECTED_COUNTS)) {
    if (counts[family] !== expected) {
      fail(`inventory mismatch for ${family}: expected ${expected}, found ${counts[family]}`);
    }
  }

  const destinations = new Set();
  const permalinks = new Set();
  for (const page of pages) {
    const destinationKey = page.destination.toLowerCase();
    if (destinations.has(destinationKey)) fail(`duplicate destination: ${page.destination}`);
    if (permalinks.has(page.permalink)) fail(`duplicate permalink: ${page.permalink}`);
    destinations.add(destinationKey);
    permalinks.add(page.permalink);
  }

  return counts;
}

function writePages(pages) {
  // Stage 1: write to .tmp paths atomically
  const tmpPaths = pages.map(page => `${page.destination}.migrate-tmp`);
  try {
    for (let i = 0; i < pages.length; i++) {
      fs.mkdirSync(path.dirname(pages[i].destination), { recursive: true });
      fs.writeFileSync(tmpPaths[i], pages[i].output, 'utf8');
    }
    // Stage 2: rename all .tmp → real
    for (let i = 0; i < pages.length; i++) {
      fs.renameSync(tmpPaths[i], pages[i].destination);
    }
  } catch (error) {
    for (const tmp of tmpPaths) {
      try { fs.unlinkSync(tmp); } catch { /* best-effort cleanup */ }
    }
    throw error;
  }
}

function main() {
  if (UNKNOWN_ARGS.length) fail(`unknown argument(s): ${UNKNOWN_ARGS.join(', ')}`);

  const inputs = walk(ROOT).sort((left, right) => left.localeCompare(right));
  const pages = inputs.map(migrateFile);
  const counts = validateInventory(pages);

  console.log(`Validated ${counts.total} legacy pages:`);
  console.log(`  homepages:         ${counts.homepage}`);
  console.log(`  standard articles: ${counts.standardArticle}`);
  console.log(`  showcases:         ${counts.showcase}`);
  console.log(`  static pages:      ${counts.static}`);
  console.log(`  UTF-8 BOM removed: ${pages.filter(page => page.hadBom).length}`);
  console.log(`  encoding warnings: ${pages.filter(page => page.suspiciousEncoding).length}`);
  console.log('');
  for (const page of pages) {
    const destination = toPosix(path.relative(ROOT, page.destination));
    const warning = page.suspiciousEncoding ? ' [encoding warning]' : '';
    console.log(`  ${page.relativePath} -> ${destination} (${page.permalink})${warning}`);
  }

  if (!WRITE) {
    console.log('\nCheck complete. No files were written; pass --write after review.');
    return;
  }

  if (FORCE && WRITE) {
    const srcDir = path.resolve(OUTPUT_ROOT);
    if (fs.existsSync(srcDir)) {
      const existing = fs.readdirSync(srcDir);
      for (const item of existing) {
        if (item === '_includes') continue;
        const itemPath = path.join(srcDir, item);
        fs.rmSync(itemPath, { recursive: true, force: true });
      }
    }
  }

  writePages(pages);
  console.log(`\nWrote ${pages.length} Eleventy source pages to src/.`);
}

try {
  main();
} catch (error) {
  console.error(`Migration aborted: ${error.message}`);
  process.exitCode = 1;
}
