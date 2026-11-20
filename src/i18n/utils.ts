import {
  defaultLang,
  languages,
  STORAGE_KEY,
  translations,
  type Lang,
  type TranslationKey,
} from './ui';

/**
 * Returns true if the string is a valid supported Lang.
 */
export function isValidLang(lang: string | null | undefined): lang is Lang {
  return Boolean(lang && Object.prototype.hasOwnProperty.call(languages, lang));
}

/**
 * Detect language following project rules:
 * 1. Saved preference in localStorage
 * 2. Browser navigator.language (pt -> 'pt', es -> 'es')
 * 3. Default fallback: 'en'
 */
export function detectLanguage(): Lang {
  if (typeof window === 'undefined') {
    return defaultLang;
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (isValidLang(saved)) {
      return saved;
    }

    const browserLang = (navigator.language || '').toLowerCase();
    if (browserLang.startsWith('pt')) {
      return 'pt';
    }
    if (browserLang.startsWith('es')) {
      return 'es';
    }
  } catch (error) {
    console.warn('[i18n] Error accessing localStorage or navigator:', error);
  }

  return defaultLang;
}

/**
 * Saves preferred language to localStorage.
 */
export function setStoredLanguage(lang: Lang): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch (error) {
    console.warn('[i18n] Error saving language to localStorage:', error);
  }
}

/**
 * Gets translation for a given language and key.
 */
export function useTranslations(lang: Lang = defaultLang) {
  return function t(key: TranslationKey): string {
    const dict = translations[lang] || translations[defaultLang];
    return (dict as Record<string, string>)[key] ?? (translations[defaultLang] as Record<string, string>)[key] ?? key;
  };
}

/**
 * Applies language to the document and updates all i18n DOM bindings:
 * - Updates <html lang="...">
 * - Updates document.title and meta description if marked with data-i18n
 * - Updates elements with [data-i18n] (safe innerHTML when tags detected, textContent otherwise)
 * - Updates elements with [data-i18n-html]
 * - Updates elements with [data-i18n-aria-label]
 * - Updates active states of buttons with [data-lang]
 * - Emits 'languagechange' CustomEvent for components to react
 */
export function applyLanguage(lang: Lang): void {
  if (typeof document === 'undefined') return;

  // 1. Update <html lang>
  document.documentElement.lang = lang;

  const currentDict = translations[lang] || translations[defaultLang];
  const fallbackDict = translations[defaultLang];

  const getTranslation = (key: TranslationKey): string | undefined => {
    return (currentDict as Record<string, string>)[key] ?? (fallbackDict as Record<string, string>)[key];
  };

  // 2. Update page title if marked with data-i18n
  const titleEl = document.querySelector('title[data-i18n]');
  if (titleEl) {
    const key = titleEl.getAttribute('data-i18n') as TranslationKey | null;
    if (key) {
      const translated = getTranslation(key);
      if (translated) {
        document.title = translated;
      }
    }
  }

  // 3. Update meta description if marked with data-i18n
  const metaDesc = document.querySelector('meta[name="description"][data-i18n]');
  if (metaDesc) {
    const key = metaDesc.getAttribute('data-i18n') as TranslationKey | null;
    if (key) {
      const translated = getTranslation(key);
      if (translated) {
        metaDesc.setAttribute('content', translated);
      }
    }
  }

  // 4. Update text / html content on [data-i18n]
  const textElements = document.querySelectorAll<HTMLElement>('[data-i18n]');
  textElements.forEach((el) => {
    // Avoid re-processing title/meta handled above
    if (el.tagName === 'TITLE') return;

    const key = el.getAttribute('data-i18n') as TranslationKey | null;
    if (key) {
      const translated = getTranslation(key);
      if (translated !== undefined) {
        if (/<[a-z][\s\S]*>/i.test(translated)) {
          el.innerHTML = translated;
        } else {
          el.textContent = translated;
        }
      }
    }
  });

  // 5. Update explicit [data-i18n-html] elements
  const htmlElements = document.querySelectorAll<HTMLElement>('[data-i18n-html]');
  htmlElements.forEach((el) => {
    const key = el.getAttribute('data-i18n-html') as TranslationKey | null;
    if (key) {
      const translated = getTranslation(key);
      if (translated !== undefined) {
        el.innerHTML = translated;
      }
    }
  });

  // 6. Update aria-labels
  const ariaElements = document.querySelectorAll<HTMLElement>('[data-i18n-aria-label]');
  ariaElements.forEach((el) => {
    const key = el.getAttribute('data-i18n-aria-label') as TranslationKey | null;
    if (key) {
      const translated = getTranslation(key);
      if (translated) {
        el.setAttribute('aria-label', translated);
      }
    }
  });

  // 7. Update language selector buttons state
  const langButtons = document.querySelectorAll<HTMLButtonElement>('button[data-lang]');
  langButtons.forEach((btn) => {
    const btnLang = btn.getAttribute('data-lang');
    const isActive = btnLang === lang;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });

  // 8. Update dynamic CV download links
  const cvLinks = document.querySelectorAll<HTMLAnchorElement>('a[data-cv-download]');
  cvLinks.forEach((link) => {
    link.href = `/cv/cv-${lang}.pdf`;
  });

  // 9. Dispatch global event for other components (e.g. CV download button)
  window.dispatchEvent(
    new CustomEvent<{ lang: Lang }>('languagechange', {
      detail: { lang },
    })
  );
}

/**
 * Initializes language listeners on client-side:
 * - Detects language and applies it
 * - Binds click handlers to language switch buttons
 * - Listens for storage events across browser tabs
 */
export function initI18n(): Lang {
  if (typeof window === 'undefined') return defaultLang;

  const currentLang = detectLanguage();
  applyLanguage(currentLang);

  // Bind click handlers to buttons with [data-lang]
  const selectorButtons = document.querySelectorAll<HTMLButtonElement>('button[data-lang]');
  selectorButtons.forEach((btn) => {
    // Avoid double attaching if already initialized
    if (btn.dataset.i18nBound === 'true') return;
    btn.dataset.i18nBound = 'true';

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetLang = btn.getAttribute('data-lang');
      if (isValidLang(targetLang)) {
        setStoredLanguage(targetLang);
        applyLanguage(targetLang);
      }
    });
  });

  // Keep multiple tabs in sync
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY && isValidLang(e.newValue)) {
      applyLanguage(e.newValue);
    }
  });

  return currentLang;
}
