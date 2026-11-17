const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const helper = fs.readFileSync(path.join(root, 'i18n.js'), 'utf8');
const pages = ['index.html', 'privacy-policy/index.html', 'terms-of-service/index.html'];

function getDictionary(html, page) {
  const script = /const i18n = (\{[\s\S]*?\n\});/.exec(html);
  assert.ok(script, `${page}: expected an i18n dictionary`);
  return vm.runInNewContext(`(${script[1]})`);
}

function makeElement(id = '') {
  const listeners = {};
  const classes = new Set();
  return {
    id,
    textContent: '',
    innerHTML: '',
    attributes: {},
    listeners,
    classList: {
      add(name) { classes.add(name); },
      remove(name) { classes.delete(name); },
      contains(name) { return classes.has(name); },
      toggle(name, force) {
        const enabled = force === undefined ? !classes.has(name) : Boolean(force);
        if (enabled) classes.add(name);
        else classes.delete(name);
        return enabled;
      },
    },
    setAttribute(name, value) { this.attributes[name] = String(value); },
    getAttribute(name) {
      if (name === 'data-i18n' || name === 'data-i18n-title') return this.key ?? null;
      return this.attributes[name] ?? null;
    },
    addEventListener(name, callback) {
      (listeners[name] ||= []).push(callback);
    },
    dispatch(name, event = {}) {
      for (const callback of listeners[name] || []) callback(event);
    },
    focus() { this.focused = true; },
    contains(target) { return target === this; },
  };
}

function makePageDom(html, initialStorage = {}, storageDisabled = false) {
  const elements = new Map();
  const listeners = {};
  const textNodes = [];
  const titleNodes = [];
  const metas = new Map();
  let lang = 'id';
  let title = '';

  const idPattern = /\bid="([^"]+)"/g;
  let match;
  while ((match = idPattern.exec(html))) elements.set(match[1], makeElement(match[1]));

  const menuButtonMarkup = /<button\b[^>]*id="navMenuBtn"[^>]*>/i.exec(html);
  const menuExpanded = menuButtonMarkup && /aria-expanded="([^"]+)"/.exec(menuButtonMarkup[0]);
  if (menuExpanded && elements.has('navMenuBtn')) {
    elements.get('navMenuBtn').setAttribute('aria-expanded', menuExpanded[1]);
  }

  const i18nPattern = /data-i18n="([^"]+)"/g;
  while ((match = i18nPattern.exec(html))) {
    const node = makeElement();
    node.key = match[1];
    textNodes.push(node);
  }
  const titlePattern = /data-i18n-title="([^"]+)"/g;
  while ((match = titlePattern.exec(html))) {
    const node = makeElement();
    node.key = match[1];
    titleNodes.push(node);
  }

  const metaDesc = /<meta name="description" content="([^"]*)"/i.exec(html);
  const metasToMock = [
    ['meta[name="description"]', metaDesc ? metaDesc[1] : ''],
    ['meta[property="og:title"]', ''],
    ['meta[property="og:description"]', ''],
    ['meta[property="og:locale"]', 'id_ID'],
    ['meta[name="twitter:title"]', ''],
    ['meta[name="twitter:description"]', ''],
  ];
  for (const [selector, content] of metasToMock) {
    metas.set(selector, {
      content,
      setAttribute(name, value) {
        if (name === 'content') this.content = value;
      },
    });
  }

  const navLinks = elements.get('navLinks');
  const menuLinks = Array.from(html.matchAll(/<a\b[^>]*data-i18n="(?:nav_features|nav_screens|nav_a11y|nav_download)"[^>]*>/g), () => makeElement());
  if (navLinks) {
    navLinks.querySelectorAll = () => menuLinks;
    navLinks.contains = (target) => target === navLinks || menuLinks.includes(target);
  }

  const document = {
    documentElement: {
      get lang() { return lang; },
      set lang(value) { lang = value; },
    },
    get title() { return title; },
    set title(value) { title = value; },
    getElementById(id) { return elements.get(id) || null; },
    querySelectorAll(selector) {
      if (selector === '[data-i18n]') return textNodes;
      if (selector === '[data-i18n-title]') return titleNodes;
      return [];
    },
    querySelector(selector) { return metas.get(selector) || null; },
    addEventListener(name, callback) {
      (listeners[name] ||= []).push(callback);
    },
    dispatch(name, event = {}) {
      for (const callback of listeners[name] || []) callback(event);
    },
  };

  const mediaListeners = [];
  const mediaQuery = {
    matches: true,
    addEventListener(name, callback) {
      if (name === 'change') mediaListeners.push(callback);
    },
    change(matches) {
      this.matches = matches;
      for (const callback of mediaListeners) callback({ matches });
    },
  };

  const storage = { ...initialStorage };
  const localStorage = {
    getItem(key) {
      if (storageDisabled) throw new Error('storage unavailable');
      return storage[key] ?? null;
    },
    setItem(key, value) {
      if (storageDisabled) throw new Error('storage unavailable');
      storage[key] = String(value);
    },
  };
  const sandbox = {
    document,
    localStorage,
    console,
    matchMedia: () => mediaQuery,
    addEventListener(name, callback) {
      (listeners[`window:${name}`] ||= []).push(callback);
    },
    dispatch(name, event = {}) {
      for (const callback of listeners[`window:${name}`] || []) callback(event);
    },
  };
  sandbox.window = sandbox;

  return { sandbox, window: sandbox, document, elements, textNodes, titleNodes, metas, storage, mediaQuery, menuLinks };
}

function runPage(page, initialStorage = {}, storageDisabled = false) {
  const html = fs.readFileSync(path.join(root, page), 'utf8');
  const dom = makePageDom(html, initialStorage, storageDisabled);
  const context = vm.createContext(dom.sandbox);
  vm.runInContext(helper, context, { filename: 'i18n.js' });
  vm.runInContext('var createI18n = window.createI18n', context);
  const scripts = Array.from(html.matchAll(/<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/gi))
    .filter((match) => !/application\/ld\+json/i.test(match[1]))
    .map((match) => match[2]);
  for (const [index, script] of scripts.entries()) {
    vm.runInContext(script, context, { filename: `${page}#script${index}` });
  }
  return { ...dom, context, dictionary: getDictionary(html, page) };
}

for (const page of pages) {
  test(`${page}: translations are complete and switch coherently`, () => {
    const html = fs.readFileSync(path.join(root, page), 'utf8');
    const dict = getDictionary(html, page);
    const idKeys = Object.keys(dict.id).sort();
    assert.deepEqual(Object.keys(dict.en).sort(), idKeys, 'ID/EN dictionary keys must match');

    const htmlKeys = Array.from(html.matchAll(/data-i18n(?:-title)?="([^"]+)"/g), (match) => match[1]);
    for (const key of htmlKeys) assert.ok(dict.id[key], `missing translation key: ${key}`);

    const state = runPage(page);
    assert.equal(state.document.documentElement.lang, 'id');
    assert.equal(state.document.title, dict.id.page_title);
    assert.equal(state.metas.get('meta[name="description"]').content, dict.id.page_desc);
    assert.equal(state.storage.ws_lang, 'id');
    assert.equal(state.elements.get('langBtn').getAttribute('lang'), 'en');
    assert.ok(state.textNodes.every((node) => node.innerHTML || node.textContent), `unrendered translation keys: ${state.textNodes.filter((node) => !node.innerHTML && !node.textContent).map((node) => node.key).join(', ')}`);

    state.elements.get('langBtn').dispatch('click');
    assert.equal(state.document.documentElement.lang, 'en');
    assert.equal(state.document.title, dict.en.page_title);
    assert.equal(state.metas.get('meta[name="description"]').content, dict.en.page_desc);
    assert.equal(state.metas.get('meta[property="og:locale"]').content, 'en_US');
    assert.equal(state.storage.ws_lang, 'en');
    assert.equal(state.elements.get('langBtn').getAttribute('lang'), 'id');
    assert.ok(state.textNodes.every((node) => node.innerHTML || node.textContent), 'English translations should render');

    state.window.dispatch('storage', { key: 'ws_lang', newValue: 'id' });
    assert.equal(state.document.documentElement.lang, 'id', 'another tab language change should sync');

    state.storage.ws_lang = 'invalid';
    state.elements.get('langBtn').dispatch('click');
    assert.equal(state.document.documentElement.lang, 'en', 'invalid stored values should not break toggling');

    const persistedEnglish = runPage(page, { ws_lang: 'en' });
    assert.equal(persistedEnglish.document.documentElement.lang, 'en', 'stored language should initialize every page consistently');
    assert.equal(persistedEnglish.document.title, dict.en.page_title);

    const unavailableStorage = runPage(page, {}, true);
    assert.equal(unavailableStorage.document.documentElement.lang, 'id', 'storage failures should fall back to the default language');
    unavailableStorage.elements.get('langBtn').dispatch('click');
    assert.equal(unavailableStorage.document.documentElement.lang, 'en', 'language switching should still work when storage is unavailable');
  });
}

test('landing page: mobile menu state stays synchronized and dismisses predictably', () => {
  const state = runPage('index.html');
  const button = state.elements.get('navMenuBtn');
  const panel = state.elements.get('navLinks');

  assert.equal(button.getAttribute('aria-expanded'), 'false');
  assert.equal(panel.classList.contains('open'), false);

  button.dispatch('click');
  assert.equal(button.getAttribute('aria-expanded'), 'true');
  assert.equal(panel.classList.contains('open'), true);

  state.document.dispatch('click', { target: state.menuLinks[0] });
  assert.equal(button.getAttribute('aria-expanded'), 'true', 'clicks inside the panel should not count as outside');

  state.document.dispatch('click', { target: makeElement('outside') });
  assert.equal(button.getAttribute('aria-expanded'), 'false');
  assert.equal(panel.classList.contains('open'), false);

  button.dispatch('click');
  state.document.dispatch('keydown', { key: 'Escape' });
  assert.equal(button.getAttribute('aria-expanded'), 'false');
  assert.equal(button.focused, true, 'Escape returns focus to the menu button');

  button.dispatch('click');
  state.mediaQuery.change(false);
  assert.equal(button.getAttribute('aria-expanded'), 'false', 'desktop breakpoint closes the mobile menu');

  state.elements.get('langBtn').dispatch('click');
  assert.equal(button.getAttribute('aria-label'), 'Open menu', 'menu action name follows the active language');
});

test('landing page: store availability has one explicit state and retains link semantics', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const available = html.match(/<a\b([^>]*class="dl-card"[^>]*)>/);
  assert.ok(available, 'available store remains an anchor');
  assert.match(available[1], /data-availability="available"/);
  assert.match(available[1], /target="_blank"/);
  assert.match(available[1], /rel="noopener"/);
  assert.match(available[1], /href="https:\/\/play\.google\.com/);
  assert.match(html, /<div class="dl-card" data-availability="soon">/);
  assert.doesNotMatch(html, /dl-status (?:available|soon)/);
});
