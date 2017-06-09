'use strict';

const fs = require('fs');
const journalize = require('journalize');
const nunjucks = require('nunjucks');
const parse = require('date-fns/parse');
const path = require('path');
const url = require('url');

const config = require('../project.config');
const customFilters = require('../custom-filters');

const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const PROJECT_URL = `https://${config.bucket}/${config.folder}/`;

const env = nunjucks.configure('./app/templates', {
  autoescape: false,
  noCache: true
});

/*
Adds the current runtime state of the project. Good for excluding portions of
templates that do not need to be there during testing.
 */
env.addGlobal('IS_PRODUCTION', IS_PRODUCTION);

/*
Adds static function globally. Normalizes file paths for deployment.
 */
env.addGlobal('static', p => {
  if (IS_PRODUCTION) p = path.join(config.folder, p);

  return url.resolve('/', p);
});

/*
Creates an absolute path URL.
 */
env.addGlobal('staticAbsolute', (p, noSlash) => {
  noSlash = noSlash || false;

  if (p === '/') {
    noSlash = true;
    p = '';
  }

  return url.resolve(PROJECT_URL, p === '/' ? '' : p) + (noSlash ? '' : '/');
});

/*
Lets you inject the contents of a file into a template. Good for things like
SVG icons.
 */
env.addGlobal('inject', p => {
  if (IS_PRODUCTION) {
    return fs.readFileSync(path.join(config.distDir, p), 'utf8');
  }

  let s;

  try {
    s = fs.readFileSync(path.join('./.tmp', p), 'utf8');
  } catch (e) {
    if (e.code === 'ENOENT') {
      s = fs.readFileSync(path.join(config.srcDir, p), 'utf8');
    } else {
      throw e;
    }
  }

  return s;
});

/**
 * Map of AP month abbreviations.
 *
 * @type {Map}
 */
const AP_MONTHS = new Map([
  [1, 'Jan.'],
  [2, 'Feb.'],
  [3, 'March'],
  [4, 'April'],
  [5, 'May'],
  [6, 'June'],
  [7, 'July'],
  [8, 'Aug.'],
  [9, 'Sept.'],
  [10, 'Oct.'],
  [11, 'Nov.'],
  [12, 'Dec.']
]);

env.addGlobal('apFormatDate', input => {
  const date = parse(input);

  const month = AP_MONTHS.get(date.getMonth() + 1);
  const dayOfMonth = date.getDate();
  const year = date.getFullYear();

  return `${month} ${dayOfMonth}, ${year}`;
});

/*
Set up `journalize`.
 */
for (let key in journalize) {
  let func = journalize[key];

  if (typeof func === 'function') {
    env.addFilter(key, func);
  }
}

/*
Set up any custom filers.
 */
for (let key in customFilters) {
  let func = customFilters[key];

  if (typeof func === 'function') {
    env.addFilter(key, func);
  }
}

module.exports = env;
