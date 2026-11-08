# 🐢 Korálové sny – podmořský solitaire

Webová hra pro jednoho hráče: **TriPeaks solitaire** + **opravování podmořského království**.
Běží v prohlížeči na PC, iPadu (iOS 17) i telefonu. Je zdarma, bez reklam, bez internetu po prvním načtení.

- **100 levelů ve 2 světech** (31 tvarů rozložení karet): Korálová říše (1–50) a temnější **Hlubiny** (51–100) s těsnějším balíčkem
- **Překážky v Hlubinách:** 🦑 inkoust (karta skrytá, dokud nezahraješ sousední), 🧊 led (2 zásahy sousedy),
  🫧 bublina (uvolní ji 2 karty dané barvy ♥♦ / ♠♣), 🐚 perlová mušle (otevře se sérií 5, perla = +40 mincí)
- **Boss každých 10 levelů** (60, 70 … 100): žralok sní kartu z balíčku po každém 3. líznutí
- **Denní výzva** s 7denním kalendářem odměn, **sbírka nálepek** (4 sady s odměnou), **16 úspěchů**
- **Obyvatelé scén** – klepni na ně, promluví si a jednou denně dají dárek
- **3★ Výzva:** dohrané levely znovu s omezeným počtem tahů (tlačítko „Hrát výzvu" v okně levelu na mapě)
- 1–3 hvězdičky za level podle zbylých karet v balíčku, mince za série
- Zámky a klíče, bonusové mince na kartách, série s bonusy
- Pomocníci: **Žolík**, **Zpět**, **Zamíchat**, **Nápověda**, dokoupení **+5 karet**
- 10 scén × 6 úkolů (Korálový útes → … → Palác vln, v Hlubinách Inkoustový les → Ledová jeskyně → Bublinková pole → Perlový chrám → Trůn hlubin)
- Průvodkyně želvička Tóňa, truhly s odměnami, bonus mincí každých 20 minut, album scén
- Automatické ukládání do `localStorage` – i rozehraného levelu včetně historie tahů
- **Hudba na pozadí** podle prostředí – každá kapitola má vlastní skladbu (calypso na útesu, tajemné zvonky v jeskyni,
  námořnická píseň u lodi, valčík v zahradě, fanfára v paláci, v Hlubinách temnější témata a vlastní hudba pro bosse).
  Při dlouhé sérii přidá hudba bicí.
- **Efekty série (combo):** počítadlo ×N, bubliny, vlnky, pochvaly (Pěkně! · Super! · Úžasné! …), záře a hejno ryb;
  tóny karet stoupají v tónině aktuální hudby
- Vše je vlastní grafika (SVG generované kódem), zvuky i hudba (Web Audio) – žádné externí obrázky, nahrávky ani knihovny

## Spuštění na PC

**Nejrychleji:** dvojklik na `index.html` (funguje i přes `file://`, jen bez offline režimu).

**Doporučeně (lokální server):**

```bash
cd coral-dreams
python3 -m http.server 8000
```

Pak otevři <http://localhost:8000>. (Alternativa: `npx serve .`)

## Hraní na iPadu

### A) Přes lokální síť (rychlé testování)
1. Na PC spusť server tak, aby byl vidět v síti:
   ```bash
   python3 -m http.server 8000 --bind 0.0.0.0
   ```
2. Zjisti IP adresu PC (Windows: `ipconfig`, macOS/Linux: `ifconfig` / `ip a`), např. `192.168.1.20`.
3. Na iPadu (stejná Wi-Fi) otevři v Safari `http://192.168.1.20:8000`.

### B) Trvale přes internet (GitHub Pages nebo Vercel)
- **GitHub Pages:** nahraj obsah složky do repozitáře → *Settings → Pages → Deploy from branch → main / root*. Za minutu běží na `https://<uživatel>.github.io/<repo>/`.
- **Vercel:** `npx vercel` ve složce projektu (nebo import repozitáře na vercel.com, framework „Other", bez build příkazu).
- **Netlify:** přetáhni složku na <https://app.netlify.com/drop>.

### Jako aplikace na ploše (doporučeno)
V Safari klepni na **Sdílet → Přidat na plochu**. Hra se pak spouští přes celou obrazovku bez lišt
prohlížeče a díky service workeru funguje i offline.

> ⚠️ Safari a ikona na ploše mají **oddělené úložiště** – postup z jednoho se nepřenese do druhého.
> V anonymním režimu Safari se postup po zavření panelu smaže.
> 🔇 Na iPhonu ztlumí **tichý režim** (přepínač na boku / Ovládací centrum) zvuky i hudbu webové hry – pro zvuk ho vypni.
> Hudbu a zvuky jde zvlášť vypnout v **Nastavení**, tlačítko reproduktoru ve hře vypne obojí najednou.

## Ovládání
- Klepni na odkrytou kartu o **1 vyšší nebo nižší** než karta na odkládací hromádce (K ↔ A navazují).
- Když není tah, klepni na **balíček** vlevo dole.
- Na domovské obrazovce: **Úkoly** (vlevo dole) utrácí hvězdičky, zelené tlačítko **Level** spouští další level,
  **Mapa** ukazuje všech 100 levelů, **Album** všechny scény, **Výzva** denní výzvu, **Sbírka** nálepky, **Úspěchy** trofeje.

## Testy

```bash
node tests/engine.test.js        # řešitelnost všech 100 levelů a 30 denních výzev (~4 min) + simulace obtížnosti
python3 -m http.server 8000 &    # server pro test v prohlížeči
node tests/browser.test.js       # (jiný port: URL=http://localhost:8123/) vyžaduje: npm i playwright && npx playwright install chromium
```

Rychlý test na iPadu ručně: dohraj level 1 → vrať se domů → splň úkol → obnov stránku (postup zůstane) →
rozehraj level, zavři Safari a znovu otevři → tlačítko ukáže **Pokračovat**.

## Struktura projektu

```
index.html              obrazovky + SVG ikony a barvy karet
css/style.css           vzhled, animace, responzivita
js/levels.js            rozložení karet (ASCII), 100 levelů, kapitoly, denní výzva
js/engine.js            herní logika (generátor řešitelných rozdání, tahy, hvězdy)
js/art.js, art2.js      SVG grafika (art2 = tvorové a dekorace Hlubin)
js/scenes.js            10 dekoračních scén s úkoly
js/meta.js              denní výzva, nálepky, úspěchy, obyvatelé scén, 3★ výzva
js/storage.js           ukládání do localStorage
js/sound.js             zvukové efekty (Web Audio API)
js/music.js             hudba na pozadí – 12 témat, plánovač not, syntetické nástroje
js/ui.js, home.js, map.js, game.js, main.js   uživatelské rozhraní
sw.js, manifest.webmanifest, icons/           offline režim a ikona aplikace
tests/                  testy
```

### Úprava levelů
V `js/levels.js` každé `x` v rozložení znamená kartu; sloupec = půl šířky karty, řádek = půl výšky.
Karta na nižším řádku zakrývá překrývající se kartu nad sebou. U levelu nastavíš `run` (délka garantovaných sérií),
`slack` (rezervní karty → hvězdy), `locks` (zámky), `coins` (bonusové mince), `ink`, `ice`, `bub`, `shell` (počty překážek)
a `boss: true`. Po úpravě spusť `node tests/engine.test.js`.

Po změně souborů na serveru zvyš verzi `CACHE` v `sw.js`, ať se offline kopie obnoví.
