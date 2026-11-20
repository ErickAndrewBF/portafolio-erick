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
 * - Updates text of elements with [data-i18n]
 * - Updates aria-label of elements with [data-i18n-aria-label]
 * - Updates active states of buttons with [data-lang]
 * - Emits 'languagechange' CustomEvent for components to react
 */
export function applyLanguage(lang: Lang): void {
  if (typeof document === 'undefined') return;

  // 1. Update <html lang>
  document.documentElement.lang = lang;

  // 2. Update text content
  const textElements = document.querySelectorAll<HTMLElement>('[data-i18n]');
  textElements.forEach((el) => {
    const key = el.getAttribute('data-i18n') as TranslationKey | null;
    if (key) {
      const translated = (translations[lang] as Record<string, string>)[key] ??
        (translations[defaultLang] as Record<string, string>)[key];
      if (translated) {
        el.textContent = translated;
      }
    }
  });

  // 3. Update aria-labels
  const ariaElements = document.querySelectorAll<HTMLElement>('[data-i18n-aria-label]');
  ariaElements.forEach((el) => {
    const key = el.getAttribute('data-i18n-aria-label') as TranslationKey | null;
    if (key) {
      const translated = (translations[lang] as Record<string, string>)[key] ??
        (translations[defaultLang] as Record<string, string>)[key];
      if (translated) {
        el.setAttribute('aria-label', translated);
      }
    }
  });

  // 4. Update language selector buttons state
  const langButtons = document.querySelectorAll<HTMLButtonElement>('button[data-lang]');
  langButtons.forEach((btn) => {
    const btnLang = btn.getAttribute('data-lang');
    const isActive = btnLang === lang;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });

  // 5. Dispatch global event for other components (e.g. CV download button)
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
    btn.addEventListener('click', () => {
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
