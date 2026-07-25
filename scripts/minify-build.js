#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');
const lightningcss = require('lightningcss');

const SITE_DIR = path.resolve(__dirname, '..', '_site');
const MINIFIED_EXT = new Map([
  ['.js', 'application/javascript'],
  ['.css', 'text/css'],
]);

async function minifyFile(filePath) {
  const ext = path.extname(filePath);
  if (ext === '.js') {
    const result = await esbuild.build({
      entryPoints: [filePath],
      outfile: filePath,
      allowOverwrite: true,
      minify: true,
      write: true,
      logLevel: 'silent'
    });
    return true;
  } else if (ext === '.css') {
    const source = fs.readFileSync(filePath);
    const result = lightningcss.transform({
      filename: filePath,
      code: source,
      minify: true,
      sourceMap: false,
    });
    fs.writeFileSync(filePath, result.code);
    return true;
  }
  return false;
}

async function main() {
  const filesToMinify = [
    path.join(SITE_DIR, 'app.js'),
    path.join(SITE_DIR, 'style.css'),
  ];

  let minified = 0;
  for (const file of filesToMinify) {
    if (fs.existsSync(file)) {
      const before = fs.statSync(file).size;
      await minifyFile(file);
      const after = fs.statSync(file).size;
      const saved = ((before - after) / 1024).toFixed(1);
      console.log(`  Minified ${path.relative(SITE_DIR, file)}: ${(before/1024).toFixed(1)} KB → ${(after/1024).toFixed(1)} KB (-${saved} KB)`);
      minified++;
    }
  }
  console.log(`\nMinified ${minified} file(s).`);
}

main().catch(err => {
  console.error('Minification failed:', err);
  process.exit(1);
});
