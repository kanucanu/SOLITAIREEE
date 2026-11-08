/* =========================================================================
   Korálové sny – data levelů
   -------------------------------------------------------------------------
   ROZLOŽENÍ (layouts): každé "x" je jedna karta na stole.
     - jeden znak (sloupec) = polovina šířky karty
     - jeden řádek          = polovina výšky karty
   Karta na NIŽŠÍM řádku, která se s kartou nad sebou překrývá
   (vodorovný rozdíl < 2 sloupce), ji ZAKRÝVÁ. Zakrytá karta se otočí
   lícem nahoru a dá se hrát až po odstranění všech karet, které ji kryjí.

   LEVELY (1–50):
     layout – název rozložení
     open   – true = všechny karty jsou od začátku lícem nahoru (snazší)
     run    – průměrná délka série, kterou rozdání garantuje (víc = snazší)
     slack  – rezervní karty v balíčku navíc (víc = snazší, určuje hvězdy)
     locks  – počet zámků (karta se zámkem se uvolní po odehrání klíče)
     coins  – počet karet s bonusovou mincí (+25)
     ink    – karty pod inkoustem (vyčistí je zahraná sousední karta)
     ice    – zamrzlé karty (dvakrát zahrát sousední kartu)
     bub    – karty v bublině (prasknou po zahrání 2 karet dané barvy ♥♦ / ♠♣)
     shell  – perlové mušle (otevřou se při sérii 5, bonus +40)
     boss   – true = žralok: po každém 3. líznutí sežere kartu z balíčku
              'kraken' = Kraken: po každém 4. tahu chytí chapadlem kartu (uvolní ji sousední karta),
              zaženou ho 3 série (5, 10 a 15 karet)
   SVĚT 3 – Bouřlivá hladina (101–150):
     tide   – karty v přílivu (spodní řady; v tazích 5–7 z každých 8 jsou pod vodou)
     chain  – dvojice karet na řetězu (obě musí být odkryté; po jedné se musí hned zahrát druhá)
     bottle – lahve se vzkazem (pomocník nebo perla, připíše se na konci levelu)
     bolt   – blesky (zahraná karta otočí všechny sousední karty)
     vortex – true = vír po každém 4. líznutí prohodí dvě volné karty
   ========================================================================= */
(function (root) {
  'use strict';
  const CD = root.CD = root.CD || {};

  const LAYOUTS = {
    vlnky: { name: 'Vlnky', rows: [
      '  x       x',
      ' x x     x x',
      'x x x x x x x'] },

    pyramida: { name: 'Pyramida', rows: [
      '    x',
      '   x x',
      '  x x x',
      ' x x x x',
      'x x x x x'] },

    brana: { name: 'Brána', rows: [
      'x x x x x x x',
      ' x         x',
      ' x         x',
      'x x       x x'] },

    diamanty: { name: 'Diamanty', rows: [
      '   x       x',
      '  x x     x x',
      ' x x x   x x x',
      '  x x     x x',
      '   x       x'] },

    kruh: { name: 'Prstýnek', rows: [
      '   x x x',
      ' x x   x x',
      'x x     x x',
      ' x x   x x',
      '   x x x'] },

    vlna: { name: 'Vlna', rows: [
      'x       x       x',
      ' x     x x     x',
      '  x   x   x   x',
      '   x x     x x',
      '    x       x'] },

    trojvrch: { name: 'Tři vrchy', rows: [
      '   x     x     x',
      '  x x   x x   x x',
      ' x x x x x x x x x',
      'x x x x x x x x x x'] },

    vez: { name: 'Chaluhové věže', rows: [
      '      x',
      '   x  x  x',
      'x  x  x  x  x',
      'x  x  x  x  x',
      'x  x  x  x  x'] },

    zed: { name: 'Korálová zeď', rows: [
      'x x x x x x',
      ' x x x x x',
      'x x x x x x',
      ' x x x x x'] },

    medusa: { name: 'Medúza', rows: [
      '    x x x',
      '  x x x x x',
      'x x x x x x x',
      'x   x   x   x',
      'x   x   x   x',
      ' x   x   x   x'] },

    pyramida6: { name: 'Velká pyramida', rows: [
      '     x',
      '    x x',
      '   x x x',
      '  x x x x',
      ' x x x x x',
      'x x x x x x'] },

    ctyrvrch: { name: 'Čtyři vrchy', rows: [
      '  x     x     x     x',
      ' x x   x x   x x   x x',
      'x x x x x x x x x x x x'] },

    oblouk: { name: 'Oblouk', rows: [
      '    x x x x x',
      '  x x       x x',
      'x x           x x',
      'x               x',
      'x x x x x x x x x'] },

    srdce: { name: 'Srdce', rows: [
      ' x x   x x',
      'x x x x x x',
      ' x x x x x',
      '  x x x x',
      '   x x x',
      '    x x',
      '     x'] },

    ryba: { name: 'Ryba', rows: [
      '    x x x       x',
      '  x x x x x   x x',
      'x x x x x x x x x',
      '  x x x x x   x x',
      '    x x x       x'] },

    kruh2: { name: 'Brýle', rows: [
      '   x x x     x x x',
      ' x x   x x x x   x x',
      'x x     x x x     x x',
      ' x x   x x x x   x x',
      '   x x x     x x x'] },

    zed2: { name: 'Hradba', rows: [
      'x x x x x x',
      ' x x x x x',
      'x x x x x x',
      ' x x x x x',
      'x x x x x x'] },

    diamanty3: { name: 'Tři diamanty', rows: [
      '   x       x       x',
      '  x x     x x     x x',
      ' x x x   x x x   x x x',
      '  x x     x x     x x',
      '   x       x       x'] },

    koruna: { name: 'Koruna', rows: [
      'x       x       x',
      'x x   x x x   x x',
      'x x x x x x x x x',
      ' x x x x x x x x',
      'x x x x x x x x x'] },

    ctyrvrch2: { name: 'Hřeben', rows: [
      '  x     x     x     x',
      ' x x   x x   x x   x x',
      'x x x x x x x x x x x x',
      ' x x x x x x x x x x x'] },

    trojvrch2: { name: 'Velké tři vrchy', rows: [
      '    x     x     x',
      '   x x   x x   x x',
      '  x x x x x x x x x',
      ' x x x x x x x x x x',
      'x x x x x x x x x x x'] },

    palac: { name: 'Palác', rows: [
      'x   x       x   x',
      'x   x x x x x   x',
      'x x x x x x x x x',
      ' x x x x x x x x',
      'x x x x x x x x x',
      ' x x x x x x x x'] },
    /* ----- svět 2: Hlubiny ----- */
    propast: { name: 'Propast', rows: [
      'x x x x x x x x x x x',
      ' x x x x x x x x x x',
      '  x x x x x x x x x',
      '   x x x     x x x',
      '    x x       x x'] },

    chobotnice: { name: 'Chobotnice', rows: [
      '    x x x x',
      '   x x x x x',
      '  x x x x x x',
      '   x x x x x',
      '  x  x x x  x',
      ' x   x   x   x',
      'x   x     x   x'] },

    krystal: { name: 'Ledový krystal', rows: [
      '      x',
      '   x  x  x',
      '    x x x',
      'x x x x x x x',
      ' x x x x x x',
      '    x x x',
      '   x  x  x',
      '      x'] },

    iglu: { name: 'Iglú', rows: [
      '     x x x',
      '   x x x x x',
      '  x x x x x x',
      ' x x x x x x x',
      'x x x     x x x',
      'x x x     x x x'] },

    bublinky: { name: 'Bublinky', rows: [
      '  x x       x x',
      ' x   x  x  x   x',
      '  x x  x x  x x',
      '      x   x',
      '  x x  x x  x x',
      ' x   x  x  x   x',
      '  x x       x x'] },

    chram: { name: 'Chrám', rows: [
      'x x x x x x x x x',
      ' x x x x x x x x',
      'x   x   x   x   x',
      'x   x   x   x   x',
      'x   x   x   x   x',
      'x x x x x x x x x'] },

    musle: { name: 'Mušle', rows: [
      'x   x   x   x   x',
      ' x  x   x   x  x',
      '  x  x  x  x  x',
      '   x  x x x  x',
      '    x x x x x',
      '     x x x x',
      '      x x x'] },

    zralok: { name: 'Žralok', rows: [
      '        x',
      '       x x',
      'x     x x x x',
      'x x x x x x x x x x',
      ' x x x x x x x x x x x',
      'x x   x x x x x x',
      'x       x   x'] },

    trun: { name: 'Trůn hlubin', rows: [
      'x   x x x x x   x',
      'x  x x x x x x  x',
      'x x x x x x x x x',
      'x x x x x x x x x',
      ' x x x x x x x x',
      'x x x x x x x x x'] },
    /* ----- svět 3: Bouřlivá hladina ----- */
    majak: { name: 'Maják', rows: [
      '      x x',
      '     x x x',
      '      x x',
      '     x x x',
      '      x x',
      '   x x x x x',
      'x x x x x x x x x',
      ' x x x x x x x x'] },

    plachetnice: { name: 'Plachetnice', rows: [
      '        x',
      '       x x',
      '      x x x',
      '     x x x x',
      '    x x x x x',
      '        x',
      'x x x x x x x x x',
      ' x x x x x x x x',
      '  x x x x x x x'] },

    kotva: { name: 'Kotva', rows: [
      '     x x x',
      '    x     x',
      '     x x x',
      ' x x x x x x x',
      '       x',
      'x      x      x',
      ' x     x     x',
      '  x x x x x x',
      '   x x x x x'] },

    kormidlo: { name: 'Kormidlo', rows: [
      '      x x x',
      '  x  x x x x  x',
      '   x x x x x x',
      'x x x x   x x x x',
      '   x x x x x x',
      '  x  x x x x  x',
      '      x x x'] },

    velkavlna: { name: 'Velká vlna', rows: [
      '            x x',
      '          x x x x',
      '        x x x x x x',
      '      x x x   x x x',
      '    x x x x     x',
      '  x x x x x x',
      'x x x x x x x x x x x x'] },

    ostrov: { name: 'Ostrov s palmou', rows: [
      '   x x   x x',
      '  x x x x x x',
      '     x x',
      '      x',
      '     x x',
      '      x',
      '  x x x x x x',
      'x x x x x x x x x x',
      ' x x x x x x x x x'] },

    racek: { name: 'Racek', rows: [
      'x x           x x',
      ' x x x     x x x',
      '  x x x x x x x',
      '     x x x x',
      '    x x x x x',
      '   x x x x x x'] },

    kraken: { name: 'Kraken', rows: [
      '     x x x x x',
      '    x x x x x x',
      '   x x x x x x x',
      '    x x x x x x',
      '  x  x x x x x  x',
      ' x  x  x x x  x  x',
      'x  x  x  x  x  x  x',
      'x  x  x     x  x  x'] },

    lastura: { name: 'Lastura', rows: [
      '        x x x',
      '      x x x x x',
      '    x x x   x x x',
      '  x x x   x   x x',
      'x x x   x x x x x',
      ' x x   x x x x',
      '  x x x x x'] },

    hvezda: { name: 'Mořská hvězda', rows: [
      '        x',
      '       x x',
      'x x x x x x x x x',
      ' x x x x x x x x',
      '  x x x x x x x',
      '   x x x x x x',
      '  x x x   x x x',
      ' x x       x x',
      'x             x'] },
  };

  /* 150 levelů s postupně rostoucí obtížností */
  const LEVELS = [
    /*  1 */ { layout: 'vlnky',     open: true,  run: 7.0, slack: 8, locks: 0, coins: 0 },
    /*  2 */ { layout: 'pyramida',  open: true,  run: 6.5, slack: 8, locks: 0, coins: 1 },
    /*  3 */ { layout: 'brana',     open: true,  run: 6.0, slack: 8, locks: 0, coins: 1 },
    /*  4 */ { layout: 'diamanty',  open: false, run: 6.0, slack: 8, locks: 0, coins: 1 },
    /*  5 */ { layout: 'kruh',      open: false, run: 5.5, slack: 7, locks: 0, coins: 1 },
    /*  6 */ { layout: 'vlna',      open: false, run: 5.5, slack: 7, locks: 0, coins: 2 },
    /*  7 */ { layout: 'trojvrch',  open: false, run: 5.5, slack: 7, locks: 0, coins: 2 },
    /*  8 */ { layout: 'vez',       open: false, run: 5.0, slack: 7, locks: 0, coins: 2 },
    /*  9 */ { layout: 'zed',       open: false, run: 5.0, slack: 7, locks: 0, coins: 2 },
    /* 10 */ { layout: 'medusa',    open: false, run: 5.5, slack: 7, locks: 0, coins: 2 },
    /* 11 */ { layout: 'pyramida6', open: false, run: 5.5, slack: 7, locks: 0, coins: 2 },
    /* 12 */ { layout: 'ctyrvrch',  open: false, run: 5.0, slack: 7, locks: 0, coins: 2 },
    /* 13 */ { layout: 'oblouk',    open: false, run: 4.8, slack: 6, locks: 0, coins: 2 },
    /* 14 */ { layout: 'srdce',     open: false, run: 5.0, slack: 7, locks: 0, coins: 2 },
    /* 15 */ { layout: 'ryba',      open: false, run: 5.0, slack: 7, locks: 0, coins: 3 },
    /* 16 */ { layout: 'diamanty',  open: false, run: 4.6, slack: 6, locks: 1, coins: 2 },
    /* 17 */ { layout: 'trojvrch',  open: false, run: 4.5, slack: 6, locks: 1, coins: 2 },
    /* 18 */ { layout: 'kruh2',     open: false, run: 4.6, slack: 7, locks: 1, coins: 3 },
    /* 19 */ { layout: 'vlna',      open: true,  run: 4.0, slack: 4, locks: 1, coins: 2 },
    /* 20 */ { layout: 'zed2',      open: false, run: 4.4, slack: 5, locks: 1, coins: 3 },
    /* 21 */ { layout: 'medusa',    open: false, run: 4.3, slack: 5, locks: 1, coins: 3 },
    /* 22 */ { layout: 'diamanty3', open: false, run: 4.2, slack: 5, locks: 1, coins: 3 },
    /* 23 */ { layout: 'koruna',    open: false, run: 4.2, slack: 6, locks: 1, coins: 3 },
    /* 24 */ { layout: 'vez',       open: false, run: 4.0, slack: 5, locks: 1, coins: 2 },
    /* 25 */ { layout: 'trojvrch2', open: false, run: 4.2, slack: 6, locks: 1, coins: 3 },
    /* 26 */ { layout: 'ryba',      open: false, run: 4.0, slack: 5, locks: 1, coins: 3 },
    /* 27 */ { layout: 'oblouk',    open: false, run: 3.6, slack: 3, locks: 1, coins: 3 },
    /* 28 */ { layout: 'ctyrvrch2', open: false, run: 4.0, slack: 5, locks: 1, coins: 3 },
    /* 29 */ { layout: 'srdce',     open: false, run: 3.6, slack: 4, locks: 1, coins: 3 },
    /* 30 */ { layout: 'koruna',    open: false, run: 3.8, slack: 5, locks: 2, coins: 4 },
    /* 31 */ { layout: 'pyramida6', open: false, run: 3.8, slack: 5, locks: 1, coins: 3 },
    /* 32 */ { layout: 'kruh2',     open: false, run: 3.7, slack: 5, locks: 2, coins: 3 },
    /* 33 */ { layout: 'trojvrch',  open: false, run: 3.6, slack: 4, locks: 2, coins: 3 },
    /* 34 */ { layout: 'zed2',      open: false, run: 3.6, slack: 5, locks: 2, coins: 3 },
    /* 35 */ { layout: 'medusa',    open: false, run: 3.6, slack: 4, locks: 2, coins: 3 },
    /* 36 */ { layout: 'diamanty3', open: false, run: 3.5, slack: 4, locks: 2, coins: 3 },
    /* 37 */ { layout: 'trojvrch2', open: false, run: 3.5, slack: 5, locks: 2, coins: 4 },
    /* 38 */ { layout: 'ryba',      open: false, run: 3.5, slack: 4, locks: 2, coins: 3 },
    /* 39 */ { layout: 'ctyrvrch2', open: false, run: 3.4, slack: 4, locks: 2, coins: 4 },
    /* 40 */ { layout: 'koruna',    open: false, run: 3.4, slack: 4, locks: 2, coins: 4 },
    /* 41 */ { layout: 'palac',     open: false, run: 3.3, slack: 4, locks: 2, coins: 4 },
    /* 42 */ { layout: 'trojvrch2', open: false, run: 3.3, slack: 4, locks: 2, coins: 4 },
    /* 43 */ { layout: 'kruh2',     open: false, run: 3.1, slack: 3, locks: 2, coins: 4 },
    /* 44 */ { layout: 'koruna',    open: false, run: 3.2, slack: 4, locks: 2, coins: 4 },
    /* 45 */ { layout: 'ryba',      open: false, run: 3.1, slack: 3, locks: 2, coins: 4 },
    /* 46 */ { layout: 'ctyrvrch2', open: false, run: 3.1, slack: 4, locks: 3, coins: 4 },
    /* 47 */ { layout: 'diamanty3', open: false, run: 3.0, slack: 4, locks: 2, coins: 4 },
    /* 48 */ { layout: 'palac',     open: false, run: 3.0, slack: 4, locks: 3, coins: 4 },
    /* 49 */ { layout: 'trojvrch2', open: false, run: 2.9, slack: 3, locks: 3, coins: 5 },
    /* 50 */ { layout: 'palac',     open: false, run: 2.8, slack: 3, locks: 3, coins: 5 },
    /* ---------- svět 2: Hlubiny ---------- */
    /* kapitola 6 – Inkoustový les: inkoust */
    /* 51 */ { layout: 'chobotnice', open: false, run: 3.6, slack: 5, locks: 0, coins: 3, ink: 3 },
    /* 52 */ { layout: 'propast',    open: false, run: 3.5, slack: 5, locks: 1, coins: 3, ink: 3 },
    /* 53 */ { layout: 'ryba',       open: false, run: 3.4, slack: 4, locks: 1, coins: 3, ink: 4 },
    /* 54 */ { layout: 'chobotnice', open: false, run: 3.3, slack: 4, locks: 1, coins: 3, ink: 5 },
    /* 55 */ { layout: 'koruna',     open: false, run: 3.3, slack: 4, locks: 2, coins: 4, ink: 5 },
    /* 56 */ { layout: 'iglu',    open: false, run: 3.0, slack: 3, locks: 1, coins: 4, ink: 6 },
    /* 57 */ { layout: 'kruh2',      open: false, run: 3.2, slack: 4, locks: 2, coins: 4, ink: 6 },
    /* 58 */ { layout: 'chobotnice', open: false, run: 3.1, slack: 3, locks: 2, coins: 4, ink: 7 },
    /* 59 */ { layout: 'trojvrch2',  open: false, run: 3.1, slack: 4, locks: 2, coins: 4, ink: 7 },
    /* 60 */ { layout: 'zralok',     open: false, run: 3.2, slack: 6, locks: 1, coins: 5, ink: 5, boss: true },
    /* kapitola 7 – Ledová jeskyně: led */
    /* 61 */ { layout: 'krystal',    open: false, run: 3.4, slack: 5, locks: 0, coins: 3, ice: 2, ink: 1 },
    /* 62 */ { layout: 'iglu',       open: false, run: 3.3, slack: 4, locks: 1, coins: 3, ice: 3, ink: 1 },
    /* 63 */ { layout: 'krystal',    open: false, run: 3.2, slack: 4, locks: 1, coins: 3, ice: 3, ink: 2 },
    /* 64 */ { layout: 'zed2',       open: false, run: 3.2, slack: 4, locks: 1, coins: 4, ice: 4, ink: 2 },
    /* 65 */ { layout: 'iglu',       open: false, run: 3.1, slack: 4, locks: 2, coins: 4, ice: 4, ink: 2 },
    /* 66 */ { layout: 'diamanty3',  open: false, run: 2.7, slack: 3, locks: 2, coins: 4, ice: 5, ink: 2 },
    /* 67 */ { layout: 'krystal',    open: false, run: 2.8, slack: 3, locks: 1, coins: 4, ice: 5, ink: 3 },
    /* 68 */ { layout: 'propast',    open: false, run: 2.8, slack: 3, locks: 2, coins: 4, ice: 5, ink: 3 },
    /* 69 */ { layout: 'iglu',       open: false, run: 2.9, slack: 3, locks: 2, coins: 4, ice: 6, ink: 3 },
    /* 70 */ { layout: 'zralok',     open: false, run: 3.0, slack: 6, locks: 2, coins: 5, ice: 4, ink: 3, boss: true },
    /* kapitola 8 – Bublinková pole: bubliny */
    /* 71 */ { layout: 'bublinky',   open: false, run: 3.3, slack: 5, locks: 0, coins: 3, bub: 2, ice: 1 },
    /* 72 */ { layout: 'bublinky',   open: false, run: 3.2, slack: 4, locks: 1, coins: 3, bub: 2, ice: 2 },
    /* 73 */ { layout: 'medusa',     open: false, run: 3.1, slack: 4, locks: 1, coins: 4, bub: 3, ink: 2 },
    /* 74 */ { layout: 'ctyrvrch2',  open: false, run: 3.1, slack: 4, locks: 2, coins: 4, bub: 3, ice: 2 },
    /* 75 */ { layout: 'bublinky',   open: false, run: 2.6, slack: 3, locks: 1, coins: 4, bub: 3, ink: 2, ice: 1 },
    /* 76 */ { layout: 'chobotnice', open: false, run: 3.0, slack: 4, locks: 2, coins: 4, bub: 4, ice: 2 },
    /* 77 */ { layout: 'iglu',       open: false, run: 2.9, slack: 3, locks: 2, coins: 4, bub: 4, ink: 3 },
    /* 78 */ { layout: 'bublinky',   open: false, run: 2.9, slack: 4, locks: 2, coins: 4, bub: 4, ice: 3 },
    /* 79 */ { layout: 'palac',      open: false, run: 2.8, slack: 3, locks: 2, coins: 5, bub: 4, ink: 3, ice: 2 },
    /* 80 */ { layout: 'zralok',     open: false, run: 2.9, slack: 6, locks: 2, coins: 5, bub: 3, ink: 3, ice: 2, boss: true },
    /* kapitola 9 – Perlový chrám: mušle */
    /* 81 */ { layout: 'chram',      open: false, run: 3.2, slack: 5, locks: 1, coins: 3, shell: 1, ink: 2 },
    /* 82 */ { layout: 'musle',      open: false, run: 2.9, slack: 3, locks: 1, coins: 3, shell: 1, ice: 2 },
    /* 83 */ { layout: 'chram',      open: false, run: 2.8, slack: 4, locks: 2, coins: 4, shell: 2, bub: 2 },
    /* 84 */ { layout: 'musle',      open: false, run: 3.0, slack: 4, locks: 1, coins: 4, shell: 2, ink: 3, ice: 1 },
    /* 85 */ { layout: 'trojvrch2',  open: false, run: 2.9, slack: 4, locks: 2, coins: 4, shell: 2, bub: 2, ice: 2 },
    /* 86 */ { layout: 'chram',      open: false, run: 2.7, slack: 3, locks: 2, coins: 4, shell: 2, ink: 3, bub: 2 },
    /* 87 */ { layout: 'musle',      open: false, run: 2.8, slack: 3, locks: 2, coins: 4, shell: 3, ice: 3 },
    /* 88 */ { layout: 'propast',    open: false, run: 2.8, slack: 4, locks: 2, coins: 5, shell: 2, ink: 3, ice: 2, bub: 2 },
    /* 89 */ { layout: 'chram',      open: false, run: 2.7, slack: 3, locks: 3, coins: 5, shell: 3, bub: 3, ice: 2 },
    /* 90 */ { layout: 'zralok',     open: false, run: 2.6, slack: 5, locks: 2, coins: 5, shell: 2, ink: 3, ice: 2, bub: 2, boss: true },
    /* kapitola 10 – Trůn hlubin: všechno dohromady */
    /* 91 */ { layout: 'trun',       open: false, run: 3.0, slack: 4, locks: 2, coins: 4, ink: 3, ice: 2, bub: 2, shell: 1 },
    /* 92 */ { layout: 'chobotnice', open: false, run: 2.9, slack: 3, locks: 2, coins: 4, ink: 4, ice: 3, bub: 2 },
    /* 93 */ { layout: 'trun',       open: false, run: 2.9, slack: 4, locks: 2, coins: 5, ink: 3, ice: 3, bub: 3, shell: 1 },
    /* 94 */ { layout: 'krystal',    open: false, run: 2.8, slack: 3, locks: 2, coins: 4, ice: 4, bub: 2, shell: 1 },
    /* 95 */ { layout: 'palac',      open: false, run: 2.8, slack: 3, locks: 3, coins: 5, ink: 4, ice: 3, bub: 3, shell: 2 },
    /* 96 */ { layout: 'trun',       open: false, run: 2.7, slack: 3, locks: 3, coins: 5, ink: 4, ice: 3, bub: 3, shell: 2 },
    /* 97 */ { layout: 'chram',   open: false, run: 2.6, slack: 3, locks: 2, coins: 5, ink: 3, ice: 3, bub: 4, shell: 1 },
    /* 98 */ { layout: 'musle',      open: false, run: 2.6, slack: 3, locks: 3, coins: 5, ink: 4, ice: 3, bub: 3, shell: 2 },
    /* 99 */ { layout: 'trun',       open: false, run: 2.6, slack: 3, locks: 3, coins: 5, ink: 5, ice: 4, bub: 3, shell: 2 },
    /*100 */ { layout: 'trun',       open: false, run: 2.5, slack: 5, locks: 3, coins: 6, ink: 5, ice: 4, bub: 4, shell: 2, boss: true },
    /* ---------- svět 3: Bouřlivá hladina ---------- */
    /* kapitola 11 – Zhasnutý maják: příliv */
    /*101 */ { layout: 'majak',       open: false, run: 3.4, slack: 5, locks: 0, coins: 3, tide: 3 },
    /*102 */ { layout: 'plachetnice', open: false, run: 3.3, slack: 5, locks: 1, coins: 3, tide: 3, bottle: 1 },
    /*103 */ { layout: 'majak',       open: false, run: 3.2, slack: 4, locks: 1, coins: 3, tide: 4 },
    /*104 */ { layout: 'velkavlna',   open: false, run: 3.2, slack: 4, locks: 1, coins: 4, tide: 4, bottle: 1 },
    /*105 */ { layout: 'ostrov',      open: false, run: 3.1, slack: 4, locks: 1, coins: 4, tide: 5 },
    /*106 */ { layout: 'plachetnice', open: false, run: 3.0, slack: 4, locks: 2, coins: 4, tide: 5, bottle: 1 },
    /*107 */ { layout: 'majak',       open: false, run: 2.9, slack: 3, locks: 1, coins: 4, tide: 5 },
    /*108 */ { layout: 'velkavlna',   open: false, run: 3.0, slack: 4, locks: 2, coins: 4, tide: 6, bottle: 1 },
    /*109 */ { layout: 'ostrov',      open: false, run: 2.9, slack: 3, locks: 2, coins: 4, tide: 6 },
    /*110 */ { layout: 'kraken',      open: false, run: 3.0, slack: 6, locks: 1, coins: 5, tide: 4, bottle: 1, boss: 'kraken' },
    /* kapitola 12 – Přístav racků: řetězy a lahve */
    /*111 */ { layout: 'racek',       open: false, run: 3.3, slack: 5, locks: 0, coins: 3, chain: 1, bottle: 1 },
    /*112 */ { layout: 'kotva',       open: false, run: 3.2, slack: 4, locks: 1, coins: 3, chain: 1, bottle: 1, tide: 2 },
    /*113 */ { layout: 'racek',       open: false, run: 3.1, slack: 4, locks: 1, coins: 3, chain: 2, bottle: 1 },
    /*114 */ { layout: 'plachetnice', open: false, run: 3.0, slack: 4, locks: 1, coins: 4, chain: 2, bottle: 2, tide: 2 },
    /*115 */ { layout: 'kotva',       open: false, run: 2.9, slack: 4, locks: 2, coins: 4, chain: 2, bottle: 1 },
    /*116 */ { layout: 'kormidlo',    open: false, run: 2.9, slack: 3, locks: 1, coins: 4, chain: 2, bottle: 2, tide: 3 },
    /*117 */ { layout: 'racek',       open: false, run: 2.8, slack: 3, locks: 2, coins: 4, chain: 3, bottle: 1 },
    /*118 */ { layout: 'velkavlna',   open: false, run: 2.9, slack: 4, locks: 2, coins: 4, chain: 2, bottle: 2, tide: 3 },
    /*119 */ { layout: 'kotva',       open: false, run: 2.8, slack: 3, locks: 2, coins: 5, chain: 3, bottle: 1, tide: 2 },
    /*120 */ { layout: 'kraken',      open: false, run: 2.9, slack: 6, locks: 2, coins: 5, chain: 2, bottle: 1, tide: 3, boss: 'kraken' },
    /* kapitola 13 – Bouřkový útes: blesky a víry */
    /*121 */ { layout: 'kormidlo',    open: false, run: 3.2, slack: 5, locks: 1, coins: 3, bolt: 2, vortex: true },
    /*122 */ { layout: 'hvezda',      open: false, run: 3.1, slack: 4, locks: 1, coins: 3, bolt: 2, vortex: true, bottle: 1 },
    /*123 */ { layout: 'lastura',     open: false, run: 3.0, slack: 4, locks: 1, coins: 4, bolt: 2, vortex: true, chain: 1 },
    /*124 */ { layout: 'kormidlo',    open: false, run: 3.0, slack: 4, locks: 2, coins: 4, bolt: 3, vortex: true, tide: 3 },
    /*125 */ { layout: 'hvezda',      open: false, run: 3.2, slack: 7, locks: 2, coins: 4, bolt: 2, vortex: true, chain: 2, bottle: 1 },
    /*126 */ { layout: 'lastura',     open: false, run: 2.8, slack: 3, locks: 2, coins: 4, bolt: 3, vortex: true, tide: 3 },
    /*127 */ { layout: 'velkavlna',   open: false, run: 2.8, slack: 3, locks: 2, coins: 4, bolt: 2, vortex: true, chain: 2, tide: 2 },
    /*128 */ { layout: 'hvezda',      open: false, run: 3.1, slack: 5, locks: 2, coins: 5, bolt: 3, vortex: true, bottle: 2, tide: 3 },
    /*129 */ { layout: 'kormidlo',    open: false, run: 3.0, slack: 4, locks: 2, coins: 5, bolt: 3, vortex: true, chain: 2, tide: 3 },
    /*130 */ { layout: 'kraken',      open: false, run: 3.1, slack: 9, locks: 2, coins: 5, bolt: 2, vortex: true, chain: 1, tide: 3, boss: 'kraken' },
    /* kapitola 14 – Ostrov přílivu: příliv, řetězy a víry */
    /*131 */ { layout: 'ostrov',      open: false, run: 3.0, slack: 4, locks: 1, coins: 4, tide: 6, chain: 1, vortex: true },
    /*132 */ { layout: 'lastura',     open: false, run: 2.9, slack: 4, locks: 2, coins: 4, tide: 5, chain: 2, bottle: 1 },
    /*133 */ { layout: 'plachetnice', open: false, run: 3.1, slack: 6, locks: 2, coins: 4, tide: 4, chain: 2, vortex: true, bolt: 1 },
    /*134 */ { layout: 'ostrov',      open: false, run: 2.8, slack: 4, locks: 2, coins: 5, tide: 7, chain: 2, bottle: 2 },
    /*135 */ { layout: 'trun',        open: false, run: 2.8, slack: 4, locks: 2, coins: 5, tide: 6, chain: 2, vortex: true, ink: 2 },
    /*136 */ { layout: 'velkavlna',   open: false, run: 2.7, slack: 3, locks: 2, coins: 5, tide: 7, chain: 2, vortex: true, bolt: 2 },
    /*137 */ { layout: 'lastura',     open: false, run: 2.7, slack: 3, locks: 2, coins: 5, tide: 6, chain: 3, bottle: 1, ice: 2 },
    /*138 */ { layout: 'ostrov',      open: false, run: 2.7, slack: 3, locks: 3, coins: 5, tide: 7, chain: 2, vortex: true, bolt: 2 },
    /*139 */ { layout: 'kotva',       open: false, run: 2.9, slack: 6, locks: 2, coins: 5, tide: 4, chain: 3, vortex: true, bottle: 1 },
    /*140 */ { layout: 'kraken',      open: false, run: 3.0, slack: 9, locks: 2, coins: 5, tide: 5, chain: 2, vortex: true, bottle: 1, boss: 'kraken' },
    /* kapitola 15 – Tónin ostrov: všechno dohromady */
    /*141 */ { layout: 'ostrov',      open: false, run: 3.1, slack: 5, locks: 2, coins: 5, tide: 5, chain: 2, bolt: 2, bottle: 1, vortex: true },
    /*142 */ { layout: 'majak',       open: false, run: 2.7, slack: 3, locks: 2, coins: 5, tide: 5, chain: 2, bolt: 2, ink: 2 },
    /*143 */ { layout: 'kotva',       open: false, run: 2.7, slack: 3, locks: 2, coins: 5, tide: 4, chain: 2, bolt: 2, vortex: true, ice: 2 },
    /*144 */ { layout: 'kormidlo',    open: false, run: 3.0, slack: 6, locks: 2, coins: 5, tide: 5, chain: 2, bottle: 2, vortex: true, bub: 2 },
    /*145 */ { layout: 'hvezda',      open: false, run: 2.9, slack: 6, locks: 3, coins: 5, tide: 4, chain: 2, bolt: 3, vortex: true, shell: 1 },
    /*146 */ { layout: 'lastura',     open: false, run: 2.9, slack: 4, locks: 2, coins: 6, tide: 6, chain: 3, bolt: 2, vortex: true, ink: 2 },
    /*147 */ { layout: 'velkavlna',   open: false, run: 2.6, slack: 3, locks: 3, coins: 6, tide: 6, chain: 2, bolt: 2, bottle: 2, vortex: true, ice: 2 },
    /*148 */ { layout: 'trun',        open: false, run: 2.8, slack: 6, locks: 3, coins: 6, tide: 6, chain: 3, bolt: 3, vortex: true, bub: 2 },
    /*149 */ { layout: 'ostrov',      open: false, run: 2.5, slack: 3, locks: 3, coins: 6, tide: 7, chain: 3, bolt: 2, bottle: 2, vortex: true, ink: 2 },
    /*150 */ { layout: 'kraken',      open: false, run: 2.8, slack: 9, locks: 3, coins: 7, tide: 5, chain: 2, bolt: 2, bottle: 2, vortex: true, boss: 'kraken' },
  ];

  const CHAPTERS = ['Korálový útes', 'Perlová jeskyně', 'Potopená loď', 'Zahrada sasanek', 'Palác vln',
    'Inkoustový les', 'Ledová jeskyně', 'Bublinková pole', 'Perlový chrám', 'Trůn hlubin',
    'Zhasnutý maják', 'Přístav racků', 'Bouřkový útes', 'Ostrov přílivu', 'Tónin ostrov'];
  const WORLDS = [{ name: 'Korálové sny', from: 1, to: 50 }, { name: 'Hlubiny', from: 51, to: 100 }, { name: 'Bouřlivá hladina', from: 101, to: 150 }];
  const DAILY_BASE = 10000;          // čísla levelů od 10000 = denní výzvy (10000 + číslo dne)

  /* Převod ASCII rozložení na sloty se vztahy překrytí */
  function parse(rows) {
    const slots = [];
    rows.forEach((line, y) => {
      for (let x = 0; x < line.length; x++) if (line[x] !== ' ') slots.push({ x, y });
    });
    const minX = Math.min(...slots.map(s => s.x));
    slots.forEach(s => { s.x -= minX; s.coveredBy = []; s.covers = []; });
    slots.forEach((s, i) => slots.forEach((t, j) => {
      if (t.y - s.y === 1 && Math.abs(t.x - s.x) < 2) { s.coveredBy.push(j); t.covers.push(i); }
    }));
    // sousedé (pro inkoust a led): karty, které se dotýkají nebo překrývají
    slots.forEach((s, i) => { s.nb = []; slots.forEach((t, j) => { if (i !== j && Math.abs(t.x - s.x) <= 2 && Math.abs(t.y - s.y) <= 2) s.nb.push(j); }); });
    return {
      slots,
      maxX: Math.max(...slots.map(s => s.x)),
      maxY: Math.max(...slots.map(s => s.y)),
    };
  }

  const cache = {};
  /* denní výzva: level vygenerovaný z čísla dne – každý den jiný, pro všechny stejný */
  const DAILY_LAYOUTS = ['trojvrch', 'ryba', 'koruna', 'kruh2', 'medusa', 'srdce', 'chobotnice', 'iglu', 'bublinky', 'musle', 'chram', 'propast', 'diamanty3', 'ctyrvrch2'];
  function dailyDef(day) {
    let a = (day * 2654435761) >>> 0;
    const R = () => ((a = (a * 1103515245 + 12345) >>> 0) / 4294967296);
    const d = { layout: DAILY_LAYOUTS[Math.floor(R() * DAILY_LAYOUTS.length)], open: false, run: 3.4, slack: 4, locks: Math.floor(R() * 2) + 1, coins: 4 };
    const types = ['ink', 'ice', 'bub', 'shell'].sort(() => R() - 0.5).slice(0, 2);
    types.forEach(t => { d[t] = t === 'shell' ? 1 : 2 + Math.floor(R() * 2); });
    return d;
  }
  function get(n) {
    if (cache[n]) return cache[n];
    const daily = n >= DAILY_BASE;
    const d = daily ? dailyDef(n - DAILY_BASE) : LEVELS[n - 1];
    if (!d) return null;
    const L = LAYOUTS[d.layout];
    const lay = parse(L.rows);
    const N = lay.slots.length;
    const D = Math.min(N, Math.max(2, Math.round(N / d.run)));   // kolik karet z balíčku řešení potřebuje
    const t2 = Math.max(1, Math.ceil(d.slack * 0.35));          // zbylé karty pro 2 hvězdy
    const t3 = Math.max(t2 + 1, Math.ceil(d.slack * 0.75));     // zbylé karty pro 3 hvězdy
    cache[n] = Object.assign({}, d, {
      n, lay, name: L.name, N, D, stockSize: D + d.slack, t2, t3, daily,
      chapter: daily ? (n - DAILY_BASE) % CHAPTERS.length : Math.floor((n - 1) / 10),
      world: daily ? 0 : n > 100 ? 2 : n > 50 ? 1 : 0,
    });
    return cache[n];
  }
  const dayNumber = (t = Date.now()) => Math.floor((t - new Date(t).getTimezoneOffset() * 60000) / 86400000);

  CD.Levels = { LAYOUTS, LEVELS, CHAPTERS, WORLDS, DAILY_BASE, COUNT: LEVELS.length, get, parse, dayNumber };
})(typeof window !== 'undefined' ? window : globalThis);
