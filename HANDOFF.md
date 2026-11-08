# HANDOFF – Korálové sny

## 1. Aktuální cíl
Kompletní prohlížečová hra „TriPeaks solitaire + dekorační meta" v originálním podmořském světě (bez cizích IP):
50 levelů, hvězdičky a mince, 5 scén s úkoly, ukládání do localStorage, dotykové ovládání pro iPad (iOS 17) i PC, návod ke spuštění.

## 2. Hotová práce (vše funkční a otestované)
- `index.html` – 4 obrazovky (titul/menu, domov = scéna, mapa levelů, hra), SVG sprite ikon a barev karet, PWA meta tagy.
- `css/style.css` – karty s 3D otočením, HUD, modály, animace scén, responzivita (iPad na šířku/výšku, telefon, PC).
- `js/levels.js` – 22 rozložení + 50 levelů (level 50 = „palac", 45 karet, 3 zámky).
- `js/engine.js` – logika: řešitelná rozdání, tahy, zámky/klíče, mince, série, žolík, zamíchání, +5 karet, hvězdy, undo.
- `js/art.js`, `js/scenes.js` – SVG grafika, 5 scén × 6 úkolů (90 ★ celkem), animované odhalení úkolu.
- `js/storage.js`, `js/sound.js`, `js/ui.js`, `js/home.js`, `js/map.js`, `js/game.js`, `js/main.js`.
- Ukládá se i rozehraný level včetně posledních 10 kroků pro „Zpět".
- `manifest.webmanifest`, `sw.js` (network-first offline cache), `icons/` (SVG + PNG 180/192/512).
- `README.md` – návod: PC, iPad (lokální síť, GitHub Pages, Vercel, Netlify, Přidat na plochu), testy, úprava levelů.
- `tests/engine.test.js` (Node, řešitelnost + obtížnost) – prochází, `tests/browser.test.js` (Playwright) – všech 14 kontrol prochází.
- Hratelná verze zveřejněna jako soukromý Artifact: https://claude.ai/artifact/5KpzbZ7kpDCWEMKoL1js1T (zdroj: scratchpad/artifact/koralove-sny.html = index.html bez <head>, soubory css/ a js/ přiložené).
- Kód je v repozitáři https://github.com/kanucanu/SOLITAIREEE (větev main) a hra běží na GitHub Pages: https://kanucanu.github.io/SOLITAIREEE/ (ověřeno: level 1 dohrán, ukládání i service worker fungují, bez chyb v konzoli).
- Screenshoty zkontrolovány: iPad 1024×768, 768×1024, telefon 844×390; žádné chyby v konzoli.

## 3. Rozpracované úkoly a blokády
- Nic neblokuje. Testováno jen v Chromiu (WebKit/Safari v prostředí není) – skutečný iPad ověří uživatel.
- Možná vylepšení: hudba na pozadí, víc druhů překážek, denní výzvy, jemnější ladění obtížnosti (simulace má šum ±10 %).

## 4. Další kroky
1. Pokud uživatel nahlásí problém ze Safari/iPadu, nejdřív zkontrolovat `-webkit-` prefixy v `css/style.css` (3D flip karet, backface-visibility) a `touchmove` blokaci v `js/main.js` (scrollovat jde jen v prvcích s třídou `scrollable`).
2. Při změně souborů po nasazení zvýšit `CACHE` verzi v `sw.js`. Nasazení = push do `main`, GitHub Pages se sestaví samo (~1–2 min).
   Pozn.: Pages přes API zapnout nejde (proxy blokuje), nastavuje se ručně v Settings → Pages; pro test webu je potřeba prostředí `solitaireee` s povoleným hostem kanucanu.github.io.
3. Po úpravě levelů spustit `node tests/engine.test.js`.
