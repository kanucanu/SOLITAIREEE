# Korálové sny – podmořský TriPeaks solitaire

Webová hra (HTML5 + čistý JavaScript + CSS + generované SVG), bez build kroku a bez závislostí.
Spuštění: `python3 -m http.server 8000` v tomto adresáři → http://localhost:8000

## Struktura
- `index.html` – obrazovky (titul, domov/scéna, mapa, hra), SVG sprite ikon a barev karet
- `css/style.css` – veškerý vzhled, animace, responzivita (iPad portrait/landscape, PC, mobil)
- `js/levels.js` – ASCII rozložení karet + data 50 levelů (obtížnost)
- `js/engine.js` – čistá herní logika TriPeaks (bez DOM, testovatelná v Node.js)
- `js/art.js` – SVG kreslící funkce (korály, ryby, želvička Tóňa…)
- `js/scenes.js` – 5 dekoračních scén po 6 úkolech (meta-vrstva)
- `js/storage.js` – ukládání do localStorage (klíč `koraloveSny.save.v1`)
- `js/sound.js` – zvukové efekty přes Web Audio API
- `js/music.js` – generovaná hudba na pozadí (téma podle obrazovky/kapitoly, intenzita podle série)
- `js/ui.js`, `js/home.js`, `js/map.js`, `js/game.js`, `js/main.js` – UI a obrazovky
- Skripty jsou klasické `<script>` (ne ES moduly), vše ve jmenném prostoru `window.CD`, aby hra šla otevřít i přes `file://`.

## Zásady
- Hra je originální: žádné postavy, názvy ani grafika z existujících her (Disney apod.).
- Texty ve hře jsou česky.
- Ovládání musí fungovat dotykem (iPad, iOS 17) i myší.
- Po změně `levels.js`/`engine.js` ověř řešitelnost testem (simulace všech 50 levelů).

## Pravidla pro správu kontextu
- Kdykoliv je vyvolána akce zápisu stavu (např. před kompaktováním nebo na konci sezení), zapiš kompletní přehled do souboru `HANDOFF.md` v kořenovém adresáři.
- Tento přehled musí obsahovat:
  1. **Aktuální cíl:** Co přesně se v této session řeší.
  2. **Hotová práce:** Jaké soubory byly upraveny a jaké změny jsou funkční.
  3. **Rozpracované úkoly a blokády:** Co chybí, co nefunguje, chybové hlášky.
  4. **Další kroky:** Konkrétní instrukce, na co má navázat příští session.
