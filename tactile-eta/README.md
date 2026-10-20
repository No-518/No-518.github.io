# Tactile-ETA project page

Static GitHub Pages site (plain HTML/CSS/JS, no build step). Relative paths support deployment under `/tactile-eta/`.

Preview: `python3 -m http.server 18764 --bind 127.0.0.1`, then open `http://127.0.0.1:18764/tactile-eta/`.

## Bilingual page

The page is bilingual (EN / 中文). Every translatable element has a `data-l="en"` / `data-l="zh"` sibling; `html[data-lang]` hides the inactive one. Language is chosen by `?lang=zh`, then `localStorage` (`te-lang`), defaulting to English. The agent quote stays verbatim in English; the Chinese view shows a translation below it.
