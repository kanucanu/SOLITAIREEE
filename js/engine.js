/* =========================================================================
   Korálové sny – herní logika TriPeaks (bez DOM, testovatelná v Node.js)
   -------------------------------------------------------------------------
   Pravidla:
   - Hrát lze odkrytou kartu (nic ji nezakrývá), která je o 1 vyšší nebo
     nižší než vrchní karta odkládací hromádky. Král a eso na sebe navazují.
   - Když není tah, lízne se karta z balíčku (přeruší sérii).
   - Level je vyhraný, když zmizí všechny karty ze stolu.
   Rozdání se generuje "zpětně" tak, aby měl každý level garantované řešení.
   ========================================================================= */
(function (root) {
  'use strict';
  const CD = root.CD = root.CD || {};

  const RANKS = ['', 'A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  const SUITS = ['h', 'd', 'c', 's']; // srdce, káry, kříže, piky

  function mulberry32(seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const wrap = r => ((r - 1 + 13) % 13) + 1;
  const adjacent = (a, b) => { const d = Math.abs(a - b); return d === 1 || d === 12; };
  const pickIdx = (R, arr) => Math.floor(R() * arr.length);

  /* rozdělí N karet do D sérií (každá aspoň 1) */
  function splitRuns(N, D, R) {
    const runs = new Array(D).fill(1);
    const w = runs.map((_, i) => 0.35 + R() * 1.3 + (i === 0 ? 0.5 : 0));
    const tw = w.reduce((a, b) => a + b, 0);
    for (let e = 0; e < N - D; e++) {
      let x = R() * tw, k = 0;
      while (k < D - 1 && x > w[k]) { x -= w[k]; k++; }
      runs[k]++;
    }
    return runs;
  }

  /* ---------- nové rozdání ---------- */
  function newGame(level, seed) {
    const def = CD.Levels.get(level);
    const lay = def.lay;
    const N = lay.slots.length;
    const R = mulberry32(seed);
    const cards = lay.slots.map(() => ({ r: 0, s: 0, up: false, gone: false, lock: 0, key: 0, coin: false }));

    // zámky (na zakrytých kartách v horní části) a klíče (na volných kartách)
    const free0 = [], covered = [];
    lay.slots.forEach((s, i) => (s.coveredBy.length ? covered : free0).push(i));
    covered.sort((a, b) => lay.slots[a].y - lay.slots[b].y);
    const lockPool = covered.slice(0, Math.max(1, Math.ceil(covered.length * 0.45)));
    const keyPool = free0.slice();
    for (let g = 1; g <= def.locks && lockPool.length && keyPool.length; g++) {
      const li = lockPool.splice(pickIdx(R, lockPool), 1)[0];
      const ki = keyPool.splice(pickIdx(R, keyPool), 1)[0];
      cards[li].lock = g;
      cards[ki].key = g;
    }
    // bonusové mince
    const coinPool = cards.map((_, i) => i).filter(i => !cards[i].lock && !cards[i].key);
    for (let k = 0; k < def.coins && coinPool.length; k++) cards[coinPool.splice(pickIdx(R, coinPool), 1)[0]].coin = true;

    // simulace řešení: série karet ±1, mezi sériemi líznutí z balíčku
    const gone = new Array(N).fill(false);
    const opened = [];
    const avail = () => {
      const out = [];
      for (let i = 0; i < N; i++) {
        if (gone[i]) continue;
        if (cards[i].lock && !opened.includes(cards[i].lock)) continue;
        if (lay.slots[i].coveredBy.every(j => gone[j])) out.push(i);
      }
      return out;
    };
    const runs = splitRuns(N, def.D, R);
    const stockR = [];
    const sol = [];
    let v = 1 + Math.floor(R() * 13);
    let dir = R() < 0.5 ? 1 : -1;
    stockR.push(v);
    for (let r = 0; r < runs.length; r++) {
      if (r > 0) {
        let nv;
        do { nv = 1 + Math.floor(R() * 13); } while (nv === v || adjacent(nv, v));
        v = nv;
        stockR.push(v);
        sol.push(-1); // -1 = líznout
      }
      for (let k = 0; k < runs[r]; k++) {
        const a = avail();
        if (!a.length) break;
        const i = a[pickIdx(R, a)];
        if (R() < 0.3) dir = -dir;
        v = wrap(v + dir);
        cards[i].r = v;
        gone[i] = true;
        if (cards[i].key) opened.push(cards[i].key);
        sol.push(i);
      }
    }
    for (let k = 0; k < def.slack; k++) stockR.push(1 + Math.floor(R() * 13));

    // barvy – rovnoměrně, ať se moc neopakují stejné karty
    const used = {};
    const suitFor = r => {
      let best = 0, bc = 1e9;
      const start = Math.floor(R() * 4);
      for (let q = 0; q < 4; q++) {
        const s = (start + q) % 4, c = used[r * 4 + s] || 0;
        if (c < bc) { bc = c; best = s; }
      }
      used[r * 4 + best] = (used[r * 4 + best] || 0) + 1;
      return best;
    };
    cards.forEach(c => { c.s = suitFor(c.r); });
    const stock = stockR.map(r => ({ r, s: suitFor(r) }));
    cards.forEach((c, i) => { c.up = def.open || lay.slots[i].coveredBy.length === 0; });

    return {
      level, seed, cards, stock, si: 1, waste: [stock[0]], opened: [],
      streak: 0, maxStreak: 0, coinsWon: 0, plus: 0, moves: 0, sol,
    };
  }

  /* ---------- dotazy ---------- */
  const layOf = st => CD.Levels.get(st.level).lay;
  function isFree(st, i) {
    if (st.cards[i].gone) return false;
    return layOf(st).slots[i].coveredBy.every(j => st.cards[j].gone);
  }
  function isLocked(st, i) { const c = st.cards[i]; return !!c.lock && !st.opened.includes(c.lock); }
  function top(st) { return st.waste[st.waste.length - 1]; }
  function canPlay(st, i) {
    if (!isFree(st, i) || isLocked(st, i)) return false;
    const t = top(st);
    return !!t && (t.w || adjacent(t.r, st.cards[i].r));
  }
  function playable(st) { const out = []; for (let i = 0; i < st.cards.length; i++) if (canPlay(st, i)) out.push(i); return out; }
  function stockLeft(st) { return st.stock.length - st.si; }
  function hasMoves(st) { return stockLeft(st) > 0 || playable(st).length > 0; }
  function isWon(st) { return st.cards.every(c => c.gone); }
  function remaining(st) { return st.cards.filter(c => !c.gone).length; }

  /* ---------- tahy ---------- */
  function play(st, i) {
    if (!canPlay(st, i)) return null;
    const c = st.cards[i];
    c.gone = true; c.up = true;
    st.waste.push({ r: c.r, s: c.s });
    st.streak++; st.moves++;
    if (st.streak > st.maxStreak) st.maxStreak = st.streak;
    let coin = Math.min(1 + Math.floor((st.streak - 1) / 3), 5);
    if (c.coin) coin += 25;
    let bonus = 0;
    if (st.streak % 7 === 0) bonus = 10 + 5 * (st.streak / 7);
    st.coinsWon += coin + bonus;
    let opened = 0;
    if (c.key) { st.opened.push(c.key); opened = c.key; }
    const flipped = [];
    st.cards.forEach((d, j) => { if (!d.gone && !d.up && isFree(st, j)) { d.up = true; flipped.push(j); } });
    return { coin, bonus, opened, flipped, coinCard: c.coin, won: isWon(st) };
  }

  function draw(st) {
    if (stockLeft(st) <= 0) return null;
    const c = st.stock[st.si++];
    st.waste.push({ r: c.r, s: c.s });
    st.streak = 0; st.moves++;
    return c;
  }

  function useWild(st) {
    const t = top(st);
    if (t && t.w) return false;
    st.waste.push({ w: true, r: 0, s: 0 });
    return true;
  }

  function shuffle(st) {
    const idx = st.cards.map((_, i) => i).filter(i => !st.cards[i].gone);
    const vals = idx.map(i => ({ r: st.cards[i].r, s: st.cards[i].s }));
    for (let k = vals.length - 1; k > 0; k--) {
      const j = Math.floor(Math.random() * (k + 1));
      [vals[k], vals[j]] = [vals[j], vals[k]];
    }
    idx.forEach((i, k) => { st.cards[i].r = vals[k].r; st.cards[i].s = vals[k].s; });
    const t = top(st);
    if (t && !t.w && playable(st).length === 0) {
      const free = idx.filter(i => isFree(st, i) && !isLocked(st, i));
      if (free.length) {
        const f = free[Math.floor(Math.random() * free.length)];
        const want = wrap(t.r + (Math.random() < 0.5 ? 1 : -1));
        const other = idx.find(i => i !== f && st.cards[i].r === want);
        if (other !== undefined) {
          const a = st.cards[f], b = st.cards[other];
          [a.r, b.r] = [b.r, a.r]; [a.s, b.s] = [b.s, a.s];
        } else st.cards[f].r = want;
      }
    }
  }

  function addStock(st, n) {
    const free = st.cards.map((_, i) => i).filter(i => isFree(st, i) && !isLocked(st, i));
    for (let k = 0; k < n; k++) {
      let r;
      if ((k === 0 || k === 2) && free.length) {
        const f = st.cards[free[Math.floor(Math.random() * free.length)]];
        r = wrap(f.r + (Math.random() < 0.5 ? 1 : -1));
      } else r = 1 + Math.floor(Math.random() * 13);
      st.stock.push({ r, s: Math.floor(Math.random() * 4) });
    }
    st.plus++;
  }

  /* hvězdy: podle zbylých karet v balíčku (při dokoupení karet max. 1) */
  function stars(st) {
    if (st.plus) return 1;
    const d = CD.Levels.get(st.level);
    const rem = stockLeft(st);
    return rem >= d.t3 ? 3 : rem >= d.t2 ? 2 : 1;
  }
  function plusPrice(st) { return 150 + 100 * st.plus; }

  function snap(st) { const o = Object.assign({}, st); delete o.sol; return JSON.stringify(o); }
  function restore(st, json) { const o = JSON.parse(json); o.sol = st.sol; return o; }

  CD.Engine = {
    RANKS, SUITS, mulberry32, adjacent, wrap,
    newGame, isFree, isLocked, top, canPlay, playable, stockLeft, hasMoves, isWon, remaining,
    play, draw, useWild, shuffle, addStock, stars, plusPrice, snap, restore,
  };
})(typeof window !== 'undefined' ? window : globalThis);
