# HANDOFF – Korálové sny

## 1. Aktuální cíl
Prohlížečová hra „TriPeaks solitaire + dekorační meta" v originálním podmořském světě (bez cizích IP), nasazená na
https://kanucanu.github.io/SOLITAIREEE/ (repo kanucanu/SOLITAIREEE, větev `main`). Hra běží uživateli na iPadu i iPhonu.
Kolo 3 (tato session): body 1–12 – nový svět Hlubiny (levely 51–100), těsnější balíčky a nová rozložení,
překážky (inkoust, led, bublina, perlová mušle), boss žralok, denní výzva s kalendářem, nálepky, obyvatelé scén,
úspěchy a 3★ výzva s limitem tahů.

## 2. Hotová práce (vše funkční a otestované)
- Kola 1–2: základ hry, 50 levelů, 5 scén, PWA, hudba (`js/music.js`), combo efekty, opravy UI na telefonu.
- **Engine (`js/engine.js`):** generátor „přehrává" řešení skutečnými `play()`/`draw()` na prázdném stavu a karty přiřazuje
  za běhu → řešitelnost zaručena i s překážkami a bossem. `newGame` zkouší až 80 seedů (od pokusu 40 poloviční,
  od 60 žádné překážky). Nové: `blockReason`, `limitReached`, pole karet `ink/ice/bub/bn/shell`, stav `draws/eaten/boss/mode/limit`.
  Boss sní kartu z balíčku po každém 3. líznutí (`BOSS_EVERY`). Perla = +40 mincí.
- **Levely (`js/levels.js`):** 9 nových rozložení (propast, chobotnice, krystal, iglu, bublinky, chram, musle, zralok, trun),
  levely 51–100 (bossové 60/70/80/90/100), 10 kapitol, `WORLDS`, denní level `DAILY_BASE + dayNumber()` přes `dailyDef`.
- **Hra (`js/game.js`):** překryvy překážek, boss widget s odpočtem, „Zbývá tahů" ve výzvě, intro bosse, efekty
  (cákanec, praskání ledu, praskání bubliny, otevření mušle, kousnutí žraloka), tipy pro nové prvky, režimy `daily`/`challenge`.
  `start()` maže starý `.game-tip`.
- **Meta (`js/meta.js`, nový):** denní výzva + 7denní kalendář, 24 nálepek ve 4 sadách, 16 úspěchů (toast), obyvatelé scén
  (3 na scénu, klepnutí = řeč + denní dárek +15), odměna za první splnění výzvy (+100).
- **Grafika/scény:** `js/art2.js` (chobotnice, krab, tuleň, lucernovka, čepýřník, žralok + dekorace), scény 6–10 v `js/scenes.js`.
- **Hudba/zvuk:** 6 nových témat (ink, ice, vents, temple, abyss, boss), nové zvuky překážek, nálepky a trofeje.
- **Domov/mapa:** tlačítka Výzva/Sbírka/Úspěchy, obyvatelé ve scéně, kontrola úspěchů při otevření domova;
  mapa 100 levelů s předělem světa, odznaky bossů a 🏆, okno levelu s počty překážek a tlačítkem „Hrát výzvu".
- `js/storage.js`: 10 scén, nová pole (`daily`, `stickers`, `sets`, `chal`, `ach`, `res`), kompatibilní se starým uložením.
- `sw.js`: CACHE `koralove-sny-v3` (+ art2.js, meta.js). README a CLAUDE.md aktualizovány.
- **Testy:** `node tests/engine.test.js` ALL OK (100 levelů + 30 denních dní, bez nouzového odebrání překážek);
  `tests/browser.test.js` 14/14 OK (port nastavitelný přes `URL=`); vlastní play-test vyhrál level 60 (boss), 91,
  výzvu levelu 12 a denní výzvu bez chyb v konzoli; screenshoty telefon 390×664 a iPad 1024×768.

## 3. Rozpracované úkoly a blokády
- Nic neblokuje. Testováno jen v Chromiu – vzhled a zvuk na iPadu/iPhonu ověří uživatel.
- Obtížnost Hlubin je nastavená simulací (chytrý hráč vyhraje ~28–68 %); podle zpětné vazby případně upravit `run`/`slack`.
- Na telefonu na výšku může uvítací bublina Tóni dočasně překrýt mřížku tlačítek (bublina je nad nimi a sama zmizí).

## 4. Další kroky
1. Počkat na zpětnou vazbu uživatele k Hlubinám (obtížnost, překážky, hudba, odměny).
2. Při změně souborů po nasazení zvýšit `CACHE` v `sw.js`. Nasazení = push do `main`, GitHub Pages se sestaví samo (~1–2 min).
3. Po úpravě `levels.js`/`engine.js` spustit `node tests/engine.test.js` (~4 min, filtr `LV=56,66`).
4. Nápady na další kolo: třetí svět, sezónní události, žebříček osobních rekordů, víc obyvatel/rozhovorů.
