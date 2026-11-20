export const languages = {
  en: 'EN',
  pt: 'PT',
  es: 'ES',
} as const;

export type Lang = keyof typeof languages;

export const defaultLang: Lang = 'en';

export const STORAGE_KEY = 'preferred_lang';

export const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.experience': 'Experience',
    'nav.projects': 'Projects',
    'nav.about': 'About',
    'nav.blog': 'Blog',
    'nav.linkedin_aria': 'Connect with Erick on LinkedIn',
    'nav.github_aria': 'View project source code on GitHub',
    'nav.lang_selector_aria': 'Select language',

    // Actions & Common UI
    'action.download_cv': 'Download CV',
    'action.view_code': 'Source Code',
    'action.live_demo': 'Live Demo',
    'action.case_study': 'Read Case Study',
    'action.back': '← Back to Home',

    // Head / Meta
    'site.role': 'Software Engineer & AI/ML Specialist',
  },
  pt: {
    // Navigation
    'nav.home': 'Início',
    'nav.experience': 'Experiência',
    'nav.projects': 'Projetos',
    'nav.about': 'Sobre mim',
    'nav.blog': 'Blog',
    'nav.linkedin_aria': 'Conecte-se com Erick no LinkedIn',
    'nav.github_aria': 'Ver código do projeto no GitHub',
    'nav.lang_selector_aria': 'Selecionar idioma',

    // Actions & Common UI
    'action.download_cv': 'Baixar CV',
    'action.view_code': 'Código Fonte',
    'action.live_demo': 'Demonstração',
    'action.case_study': 'Ler Estudo de Caso',
    'action.back': '← Voltar ao Início',

    // Head / Meta
    'site.role': 'Engenheiro de Software & Especialista em IA/ML',
  },
  es: {
    // Navigation
    'nav.home': 'Inicio',
    'nav.experience': 'Experiencia',
    'nav.projects': 'Proyectos',
    'nav.about': 'Sobre mí',
    'nav.blog': 'Blog',
    'nav.linkedin_aria': 'Conecta con Erick en LinkedIn',
    'nav.github_aria': 'Conoce el código de este proyecto en GitHub',
    'nav.lang_selector_aria': 'Seleccionar idioma',

    // Actions & Common UI
    'action.download_cv': 'Descargar CV',
    'action.view_code': 'Código Fuente',
    'action.live_demo': 'Ver Proyecto',
    'action.case_study': 'Ver Caso de Estudio',
    'action.back': '← Volver al Inicio',

    // Head / Meta
    'site.role': 'Ingeniero de Software & Especialista en IA/ML',
  },
} as const;

export type TranslationKey = keyof typeof translations[typeof defaultLang];
