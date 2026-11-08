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
  };

  /* 50 levelů s postupně rostoucí obtížností */
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
  ];

  const CHAPTERS = ['Korálový útes', 'Perlová jeskyně', 'Potopená loď', 'Zahrada sasanek', 'Palác vln'];

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
    return {
      slots,
      maxX: Math.max(...slots.map(s => s.x)),
      maxY: Math.max(...slots.map(s => s.y)),
    };
  }

  const cache = {};
  function get(n) {
    if (cache[n]) return cache[n];
    const d = LEVELS[n - 1];
    if (!d) return null;
    const L = LAYOUTS[d.layout];
    const lay = parse(L.rows);
    const N = lay.slots.length;
    const D = Math.min(N, Math.max(2, Math.round(N / d.run)));   // kolik karet z balíčku řešení potřebuje
    const t2 = Math.max(1, Math.ceil(d.slack * 0.35));          // zbylé karty pro 2 hvězdy
    const t3 = Math.max(t2 + 1, Math.ceil(d.slack * 0.75));     // zbylé karty pro 3 hvězdy
    cache[n] = Object.assign({}, d, {
      n, lay, name: L.name, N, D, stockSize: D + d.slack, t2, t3,
      chapter: Math.floor((n - 1) / 10),
    });
    return cache[n];
  }

  CD.Levels = { LAYOUTS, LEVELS, CHAPTERS, COUNT: LEVELS.length, get, parse };
})(typeof window !== 'undefined' ? window : globalThis);
