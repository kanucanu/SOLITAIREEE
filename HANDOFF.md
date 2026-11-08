# HANDOFF – Korálové sny

## 1. Aktuální cíl
Prohlížečová hra „TriPeaks solitaire + dekorační meta" (originální podmořský svět), nasazená na
https://kanucanu.github.io/SOLITAIREEE/ (repo kanucanu/SOLITAIREEE, větev `main`).
Kolo 5 (tato session): **třetí svět „Bouřlivá hladina"** (varianta A) – levely 101–150, 5 scén, nové překážky,
boss Kraken, hudba, obyvatelé, nálepky, úspěchy a vzhled do obchodu.

## 2. Hotová práce (vše funkční a otestované)
- Kola 1–4: 100 levelů ve 2 světech, překážky, žralok, denní výzva, nálepky, úspěchy, obyvatelé, 3★ výzva,
  hudba, combo, Perlový obchod s perlami (`js/shop.js`, `js/pay.js` – platby vypnuté).
- **`js/engine.js`:** nové překážky – příliv (`tide`, cyklus 8 tahů, 5.–7. tah voda), kotva s řetězem (`ch`, páry,
  `st.chainWait`), láhev (`bottle` → loot v `st.loot`, připíše se až na konci hry), blesk (`bolt`, otočí sousedy),
  vír (`def.vortex`, prohození při líznutí, deterministicky přes `st.vseed`), boss Kraken (`def.boss === 'kraken'`,
  chapadlo každé 4 tahy, `khp` 3 zásahy sériemi 5/10/15). Žralok je nadále `boss: true`.
- **`js/levels.js`:** 10 nových rozložení (celkem 41), levely 101–150 (bossové 110–150), kapitoly 11–15, `WORLDS[2]`.
- **`js/game.js`:** UI všech nových prvků (překryvy, ukazatel přílivu, widget Krakena se srdíčky, úvodní okno
  „Velké finále" na 150, tipy při prvním výskytu, loot v okně výhry, `stats.kraken`), texty konce světa 2 a 3.
- **`js/art3.js` (nový):** nebe, moře, útesy, maják, lodě, molo, palmy, racci, papuchalci, vydry, poustevníčci,
  kocour, želvičky, hodný Kraken… `js/scenes.js`: scény 11–15 (Zhasnutý maják, Přístav racků, Bouřkový útes,
  Ostrov přílivu, Tónin ostrov). `js/music.js`: 6 nových témat. `js/sound.js`: 9 nových zvuků.
- **Meta:** `storage.js` SCENES = 15, `unlocked` až 151; `meta.js` obyvatelé scén 11–15, 5. sada nálepek „Pobřeží"
  (30 nálepek), úspěchy Strážce majáku, Doma na ostrově (15 scén), Bouřlivá hladina (level 150), Krotitel Krakena.
- **Mapa:** 3. svět s vlastním pozadím a bannerem, oranžové uzly, odznak 🐙 u Krakena, překážky v okně levelu.
- **Obchod:** rub „Maják" (45 perel), stůl „Pláž při západu" (45 perel). Album, nápověda „Jak hrát", `index.html`
  (art3.js, popisky), `sw.js` CACHE v5, README, CLAUDE.md.
- **Telefon na výšku (po zpětné vazbě z iPhonu):** horní lišta hry ve dvou řádcích (CSS na konci `style.css`);
  `game.js` `fitBoard()`/`blocks()` – rozložení ze samostatných vrcholů (ctyrvrch, diamanty3) se rozdělí do dvou řádků,
  jiná široká rozložení se zobrazí jako vějíř (`GX_MIN = 0.64`), řady se roztáhnou na výšku (až 0,7 karty);
  `ResizeObserver` + druhé `layout()` po `renderAll()` – opraveno přečuhování spodní řady u levelů s přílivem. `sw.js` v7.
- **Testy:** `node tests/engine.test.js` – všech 150 levelů i denní výzvy řešitelné; browser test OK;
  Playwright průchod levely 101/105/111/121/131/150 na telefonu i iPadu (výhry, loot, Kraken, konec světa)
  bez chyb v konzoli; screenshoty scén 11–15 s obyvateli.

## 3. Rozpracované úkoly a blokády
- Žádné blokády. Testováno v Chromiu; vzhled na skutečném iPadu ověří uživatel.
- Skutečné placení perel stále vypnuté (vyžaduje Stripe účet uživatele) – viz `js/pay.js`.
- Obtížnost 101–150 je naladěná simulací (chytrý hráč vyhrává cca 15–64 %); případně doladit podle zpětné vazby.

## 4. Další kroky
1. Podle zpětné vazby z iPadu doladit obtížnost (v `js/levels.js` hlavně `slack`/počty překážek) a umístění obyvatel.
2. Po každé změně `levels.js`/`engine.js` spustit `node tests/engine.test.js` (~7 min).
3. Browser test: `URL=http://localhost:8123/ node tests/browser.test.js` (server `python3 -m http.server 8123`).
4. Při změně souborů zvýšit `CACHE` v `sw.js`, aby se aktualizace dostala i do nainstalované hry.
