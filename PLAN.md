# Plan de Mejora — Portafolio Profesional (Astro v7)

## Objetivo

Evolucionar el portafolio actual en Astro v7 + TypeScript hacia un perfil profesional Senior (Ingeniería de Software e IA/ML), con soporte multi-idioma (`en` por defecto, `pt`, `es`), detección automática por navegador con selector manual, descarga de CV sincronizada por idioma y casos de estudio completos (investigación + experiencia).

## Reglas Técnicas

- Mantener componentes `.astro` nativos y CSS con variables en `src/styles/global.css` + `<style>` scoped (sin añadir React ni Tailwind salvo que sea estrictamente necesario).
- Idioma por defecto: `en` (si no hay selección guardada en `localStorage`, detectar `navigator.language` para `pt` o `es`, y en cualquier otro caso usar `en`).
- Botón de descarga de CV dinámico apuntando a `/cv/cv-{lang}.pdf`.

## Fase 1: Arquitectura i18n y Selector de Idioma

- Crear módulo de traducciones (`en`, `pt`, `es`) y helper de detección/persistencia en `localStorage`.
- Añadir selector de idioma (`EN | PT | ES`) en `Header.astro`.
- Actualizar `<html lang>` dinámicamente según el idioma activo.

## Fase 2: Rediseño Visual y Estructura Senior

- Refinar tipografía, espaciado, jerarquía visual y tarjetas en `src/styles/global.css` y `src/pages/index.astro` manteniendo estética limpia y alto rendimiento.
- Integrar botón de descarga de CV que cambie según el idioma activo (`/cv/cv-en.pdf`, `/cv/cv-pt.pdf`, `/cv/cv-es.pdf`).

## Fase 3: Casos de Estudio (Investigación y Experiencia)

- Mantener y enriquecer `/caso-dron`, `/caso-moscas` y `/caso-quechua`.
- Añadir caso de estudio de tesis/investigación: _Hybrid Vector Filtering for Low-Resource Text Classification_ (HNSW + NCD, reducción de $O(N)$ a $O(\log N) + O(K)$, speedup de hasta 924x en AG News y FakeNewsFilipino).
- Añadir secciones/casos de experiencia y proyectos técnicos (enfoque de arquitectura e impacto, respetando confidencialidad de empresas: Smart Cities con Angular/Go/SQL Server, ML Orange con React Native/Electron/Express/MariaDB/SSH, Caja Cusco con Java/Spring Boot/Kotlin/SQL Server, y proyectos con React/Flask, Kotlin y Java/FastAPI/PostgreSQL/MinIO).
