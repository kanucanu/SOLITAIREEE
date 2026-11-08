# HANDOFF – Korálové sny

## 1. Aktuální cíl
Prohlížečová hra „TriPeaks solitaire + dekorační meta" v originálním podmořském světě (bez cizích IP), nasazená na
https://kanucanu.github.io/SOLITAIREEE/. Hra běží uživateli na iPadu i iPhonu.
Kolo 2 (hotovo): oprava UI na telefonu na výšku a v oknech, hudba na pozadí podle prostředí a efekty série (combo).
Další kolo (zatím nezačato): návrh nových prvků / nového světa s těžšími levely – uživatel ho chce až po tomto kole.

## 2. Hotová práce (vše funkční a otestované)
- Základ hry: `index.html`, `css/style.css`, `js/levels.js` (22 rozložení, 50 levelů), `js/engine.js`, `js/art.js`, `js/scenes.js`
  (5 scén × 6 úkolů), `js/storage.js`, `js/sound.js`, `js/ui.js`, `js/home.js`, `js/map.js`, `js/game.js`, `js/main.js`,
  PWA (`manifest.webmanifest`, `sw.js`, `icons/`), `README.md`, testy v `tests/`.
- **Kolo 2 – opravy UI:**
  - Okna (modály): `.modal-body` má vnitřní rezervu (padding + záporný margin), posuvná oblast už neořezává 3D spodek tlačítek.
  - Telefon na výšku (`max-width: 600px` + portrait): spodní lišta ve 2 řádcích (nahoře balíček + hromádka, dole 4 pomocníci);
    `CD.Game.layout()` v tomto režimu počítá `--bcw` z šířky displeje (`stacked`).
  - Hvězdičky v horní liště se už nelámou (`.g-stars .stars { flex-wrap: nowrap }`), pro displeje ≤ 400 px zhuštěná horní lišta.
- **Kolo 2 – hudba (`js/music.js`, nový soubor):**
  - Generovaná přes Web Audio, bez souborů. Šest témat: `title` (ukolébavka G dur), `reef` (calypso C dur), `cave`
    (D dórská, skleněné zvonky), `ship` (námořnická 6/8 a moll), `garden` (valčík 3/4 F dur), `palace` (fanfára Es dur).
  - Forma 16 taktů (úvod / melodie / mezihra), každé druhé kolo melodie jiným nástrojem; podmořské zvuky (bubliny, kapky, vrzání, třpyt).
  - Téma podle obrazovky (`UI.show` → `Music.forScreen`): domov = aktuální scéna, mapa = kapitola nejvyššího odemčeného levelu,
    hra = kapitola levelu, titul = `title`. Plynulé prolínání témat.
  - Intenzita podle série (5+ bicí, 10+ vyšší rejstřík), ztlumení při fanfárách (výhra/prohra/úkol), pauza při skrytí stránky.
  - Nastavení: nový přepínač „Hudba" (`settings.music`), tlačítko reproduktoru ve hře vypíná hudbu i zvuky najednou.
- **Kolo 2 – combo efekty (`js/game.js`, `js/sound.js`, CSS):**
  - Počítadlo „×N COMBO" u odkládací hromádky (barva podle stupně 1–4), bubliny/jiskry z odehrané karty, vlnka kolem hromádky,
    svítící přelet karty, pochvaly 3 Pěkně! · 5 Super! · 10 Úžasné! · 15 Neuvěřitelné! · 20 Mistrovské! · 25 Legendární!,
    záře okrajů (5+), hejno ryb přes obrazovku (10+), přerušení série líznutím = „×N" odpadne se zvukem.
  - Tón karty stoupá po pentatonice v tónině aktuální hudby; zvuky `combo`, `comboEnd`.
- `sw.js`: CACHE `koralove-sny-v2`, přidán `js/music.js`.
- Testy: `node tests/engine.test.js` ALL OK; `tests/browser.test.js` všech 14 kontrol OK; vlastní test hudby (všech 6 témat
  bez chyb, špička 0,13–0,20, přepínání podle obrazovek) a dohrání levelů 12 a 31 podle řešení s efekty – bez chyb v konzoli.
- Screenshoty zkontrolovány: 390×664, 375×553, 844×390, 1024×768.

## 3. Rozpracované úkoly a blokády
- Nic neblokuje. Testováno v Chromiu (WebKit/Safari v prostředí není) – zvuk a vzhled na iPadu/iPhonu ověří uživatel.
- iPhone v tichém režimu ztlumí zvuk i hudbu webu (záměrně respektujeme; případně by šlo `navigator.audioSession.type = 'playback'`).
- Poslech hudby „uchem" v prostředí nejde – úroveň ověřena jen měřením. Pokud se uživateli nějaké téma nelíbí, upravit
  `THEMES` v `js/music.js` (melodie zapsaná stupni stupnice, akordy v půltónech).

## 4. Další kroky
1. Počkat na zpětnou vazbu k hudbě/efektům, pak kolo 3: navrhnout a po schválení udělat nové prvky (překážky, denní výzva…)
   nebo nový svět s levely 51+ s vyšší obtížností (nové rozložení v `js/levels.js`, nová scéna v `js/scenes.js`,
   nové téma hudby v `js/music.js` + položka v `CHAPTER_THEMES`).
2. Při změně souborů po nasazení zvýšit `CACHE` v `sw.js`. Nasazení = push do `main`, GitHub Pages se sestaví samo (~1–2 min).
   Pages přes API zapnout nejde (proxy), pro test webu je potřeba prostředí `solitaireee` s hostem kanucanu.github.io.
3. Po úpravě levelů spustit `node tests/engine.test.js`; browser test očekává server na portu 8000.
