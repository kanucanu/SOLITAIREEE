# HANDOFF – Korálové sny

## 1. Aktuální cíl
Prohlížečová hra „TriPeaks solitaire + dekorační meta" (originální podmořský svět), nasazená na
https://kanucanu.github.io/SOLITAIREEE/ (repo kanucanu/SOLITAIREEE, větev `main`).
Kolo 4 (tato session): monetizace – vybrán a zapracován **Perlový obchod** se druhou měnou (perly) a připraveným,
ve výchozím stavu vypnutým napojením na skutečné platby.

## 2. Hotová práce (vše funkční a otestované)
- Kola 1–3: 100 levelů ve 2 světech, překážky, bossové, denní výzva, nálepky, úspěchy, obyvatelé, 3★ výzva, hudba, combo.
- **`js/shop.js` (nový):** `CD.Shop` – perly, okno obchodu se 4 záložkami:
  - Nabídky: denní dárek zdarma (75 mincí, každý 3. den 1 perla), nabídka dne (6 rotujících, sleva počítaná automaticky),
    startovní balíček (jednorázově, 9 perel), perlová kasička (plní se 25 % mincí z výher, max 2500, rozbití 10 perel od 400).
  - Pomocníci: 1× / 5× (−20 %) za mince, velký balík za 18 perel. `PRICES` jsou sdílené s `game.js`.
  - Vzhled: 6 rubů karet (`body[data-back]`) a 5 stolů (`body[data-table]`), nákup za perly, CSS na konci `style.css`.
  - Perly: balíčky za peníze (jen když je platba zapnutá), výměna perel za mince, seznam, jak získat perly zdarma.
- **`js/pay.js` (nový):** `CD.PayConfig` (provider `none`/`stripe`, odkazy Stripe Payment Links), `CD.Pay` – rodičovská
  pojistka (násobilka), test `?obchod=test`/`?obchod=off`, návrat `?koupeno=perly_m&sid=cs_…` (sid jen jednou, `d.purchases`).
- **Zdroje perel:** perla z mušle +1 (v `st.pearlsWon`, tah zpět ji vrátí), první 3 ★ +1, boss poprvé +5, dohraný svět +10,
  denní výzva +2 (jen poprvé za den), 3★ výzva poprvé +2, kalendář den 7 +5, sady nálepek +5/+10, úspěchy +2–10, truhla scény +3.
- `storage.js`: nová pole `pearls` (start 15), `bank`, `owned`, `look`, `shop`, `purchases` + kontrola.
- UI: tlačítko „Obchod" s počtem perel a odznakem, „+" u mincí (domov, mapa) otevře obchod, perly v oknech výher,
  nápověda „Jak hrát", varování při mazání postupu o zakoupených perlách. `sw.js` CACHE v4.
- Testy: `tests/browser.test.js` 14/14 OK, play-test (boss 60, level 91, výzva, denní) bez chyb, vlastní test obchodu
  (všechny nákupy, kasička, vzhled ve hře, testovací platba s pojistkou, návrat z platby bez dvojího připsání).
  Engine/levely se neměnily.

## 3. Rozpracované úkoly a blokády
- Skutečné placení není zapnuté: vyžaduje účet uživatele u Stripe (nebo zabalení do iOS aplikace s App Store nákupy).
  Bez serveru se nákup ověřuje jen v prohlížeči (pro hru jednoho hráče přijatelné; přísné ověření = Cloudflare Worker + webhook).
- Testováno jen v Chromiu; vzhled na iPadu ověří uživatel.

## 4. Další kroky
1. Pokud uživatel chce skutečné platby: založit Stripe Payment Links podle hlavičky `js/pay.js`, vložit odkazy,
   `provider: 'stripe'`, zvýšit `CACHE` v `sw.js`, push do `main`.
2. Případně vyladit ceny/odměny v `js/shop.js` (konstanty nahoře) podle zpětné vazby.
3. Po změně `levels.js`/`engine.js` spustit `node tests/engine.test.js`; browser test `URL=http://localhost:8123/ node tests/browser.test.js`.
