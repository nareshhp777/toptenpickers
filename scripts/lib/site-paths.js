'use strict';

const path = require('path');

const BASE_URL = 'https://toptenpicker.com';
const LOCALES = [
  { dir: '', code: 'en' },
  { dir: 'es', code: 'es' },
  { dir: 'de', code: 'de' },
  { dir: 'fr', code: 'fr' },
  { dir: 'ja', code: 'ja' },
  { dir: 'pt', code: 'pt' },
  { dir: 'hi', code: 'hi' },
  { dir: 'ar', code: 'ar' },
  { dir: 'ko', code: 'ko' },
  { dir: 'it', code: 'it' }
];
const LOCALE_DIRS = new Set(LOCALES.filter(locale => locale.dir).map(locale => locale.dir));

function toPosix(filePath) {
  return filePath.split(path.sep).join('/');
}

function splitLocale(relativePath) {
  const normalized = toPosix(relativePath);
  const firstSegment = normalized.split('/')[0];
  if (LOCALE_DIRS.has(firstSegment)) {
    return {
      locale: firstSegment,
      code: firstSegment,
      subject: normalized.slice(firstSegment.length + 1)
    };
  }
  return { locale: '', code: 'en', subject: normalized };
}

function permalinkFor(relativePath) {
  const normalized = toPosix(relativePath);
  if (normalized === 'index.html') return '/';
  if (normalized.endsWith('/index.html')) {
    return `/${normalized.slice(0, -'index.html'.length)}`;
  }
  return `/${normalized}`;
}

function liveUrlFor(relativePath) {
  return `${BASE_URL}${permalinkFor(relativePath)}`;
}

module.exports = {
  BASE_URL,
  LOCALES,
  LOCALE_DIRS,
  liveUrlFor,
  permalinkFor,
  splitLocale,
  toPosix
};
