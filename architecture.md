# Site Architecture

The site remains static and GitHub Pages friendly, but the content model is now bilingual and section-driven instead of hardcoded English copy.

## Layers

- document shell: `index.html`
- visual system: `styles.css`
- locale data: `locales/en.json`, `locales/pt.json`
- translation controller: `js/i18n.js`
- section renderer: `js/app.js`

## Translation Model

- every static text node in the document uses `data-i18n` or `data-i18n-attr`
- both locale files are preloaded on startup so the EN/PT toggle switches instantly
- language preference is persisted in `localStorage`
- dynamic sections are rerendered from the active locale instead of mixing untranslated strings into HTML or JS

## Rendering Model

- the hero, section headers, nav, footer, and metadata are translated through the i18n controller
- flagship systems, engineering domains, philosophy cards, case studies, stack groups, GitHub projects, and contact cards are rendered from locale JSON
- reveal transitions and active-nav state are lightweight and preserved across language changes

## Goals

- premium technical presentation without adding a build step
- recruiter comprehension inside the first 30 seconds
- bilingual support without separate pages
- maintainable content updates through locale files
