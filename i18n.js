(function () {
  const LANGS = ['id', 'en'];
  const DEFAULT_LANG = 'id';
  const STORAGE_KEY = 'ws_lang';

  function readStoredLang() {
    try {
      const value = localStorage.getItem(STORAGE_KEY);
      return LANGS.includes(value) ? value : null;
    } catch (error) {
      return null;
    }
  }

  function readUrlLang() {
    try {
      if (typeof window !== 'undefined' && window.location && window.location.search) {
        const params = new URLSearchParams(window.location.search);
        const lang = params.get('lang');
        return LANGS.includes(lang) ? lang : null;
      }
    } catch (error) {
      return null;
    }
    return null;
  }

  function writeStoredLang(lang) {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (error) {}
  }

  function syncUrl(lang) {
    try {
      if (typeof window !== 'undefined' && window.location && window.history && typeof window.history.replaceState === 'function') {
        const url = new URL(window.location.href);
        if (url.searchParams.get('lang') !== lang) {
          url.searchParams.set('lang', lang);
          window.history.replaceState(null, '', url.pathname + url.search + url.hash);
        }
      }
    } catch (error) {}
  }

  window.createI18n = function createI18n(config) {
    const dictionaries = config.dictionaries;
    const langButtons = config.langButtons || [];
    const titleKey = config.titleKey || 'page_title';
    const descKey = config.descKey || 'page_desc';
    const defaultLang = config.defaultLang || DEFAULT_LANG;
    const listeners = [];

    let current = readUrlLang() || readStoredLang() || defaultLang;

    function t(key, fallback) {
      const strings = dictionaries[current] || {};
      return Object.prototype.hasOwnProperty.call(strings, key) ? strings[key] : (fallback ?? key);
    }

    function notifyListeners() {
      listeners.forEach((fn) => fn(current));
    }

    function updateButtons() {
      const target = current === 'id' ? 'en' : 'id';
      const labelKey = target === 'en' ? 'switch_to_en' : 'switch_to_id';
      const visibleLabel = target === 'en' ? 'EN' : 'ID';
      const accessibleLabel = t(labelKey, target === 'en' ? 'Switch to English' : 'Switch to Bahasa Indonesia');

      langButtons.forEach((id) => {
        const button = document.getElementById(id);
        if (!button) return;
        button.textContent = visibleLabel;
        button.setAttribute('aria-label', accessibleLabel);
        button.setAttribute('lang', target);
      });
    }

    function render(lang) {
      current = lang;
      document.documentElement.lang = current;
      if (typeof document.documentElement.setAttribute === 'function') {
        document.documentElement.setAttribute('data-lang', current);
        document.documentElement.setAttribute('data-lang-state', 'ready');
      }

      const strings = dictionaries[current];
      if (!strings) return;

      document.querySelectorAll('[data-i18n]').forEach((element) => {
        const key = element.getAttribute('data-i18n');
        if (strings[key]) element.innerHTML = strings[key];
      });

      document.querySelectorAll('[data-i18n-title]').forEach((element) => {
        const key = element.getAttribute('data-i18n-title');
        if (strings[key]) element.textContent = strings[key];
      });

      if (strings[titleKey]) document.title = strings[titleKey];

      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription && strings[descKey]) {
        metaDescription.setAttribute('content', strings[descKey]);
      }

      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle && strings[titleKey]) ogTitle.setAttribute('content', strings[titleKey]);

      const ogDescription = document.querySelector('meta[property="og:description"]');
      if (ogDescription && strings[descKey]) ogDescription.setAttribute('content', strings[descKey]);

      const twitterTitle = document.querySelector('meta[name="twitter:title"]');
      if (twitterTitle && strings[titleKey]) twitterTitle.setAttribute('content', strings[titleKey]);

      const twitterDescription = document.querySelector('meta[name="twitter:description"]');
      if (twitterDescription && strings[descKey]) twitterDescription.setAttribute('content', strings[descKey]);

      const ogLocale = document.querySelector('meta[property="og:locale"]');
      if (ogLocale) ogLocale.setAttribute('content', current === 'id' ? 'id_ID' : 'en_US');

      updateButtons();
      notifyListeners();

      try {
        if (typeof document !== 'undefined' && typeof document.dispatchEvent === 'function') {
          const event = typeof CustomEvent === 'function'
            ? new CustomEvent('i18n:change', { detail: { lang: current } })
            : { type: 'i18n:change', detail: { lang: current } };
          document.dispatchEvent(event);
        }
      } catch (error) {}
    }

    function setLang(next) {
      const lang = LANGS.includes(next) ? next : defaultLang;
      writeStoredLang(lang);
      syncUrl(lang);
      render(lang);
    }

    function toggle() {
      setLang(current === 'id' ? 'en' : 'id');
    }

    langButtons.forEach((id) => {
      const button = document.getElementById(id);
      if (button) button.addEventListener('click', toggle);
    });

    window.addEventListener('storage', (event) => {
      if (event.key !== STORAGE_KEY) return;
      if (LANGS.includes(event.newValue)) render(event.newValue);
    });

    writeStoredLang(current);
    render(current);

    const instance = {
      get current() {
        return current;
      },
      set: setLang,
      toggle,
      t,
      onChange(fn) {
        listeners.push(fn);
        return () => {
          const index = listeners.indexOf(fn);
          if (index !== -1) listeners.splice(index, 1);
        };
      },
    };

    if (typeof window !== 'undefined') {
      window.__APP_STATE__ = window.__APP_STATE__ || {};
      window.__APP_STATE__.i18n = instance;
    }

    return instance;
  };
})();
