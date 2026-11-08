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

  /* ---------- nové rozdání ----------
     Řešení se "odehraje" skutečnými pravidly (play/draw) na prázdném stole a hodnoty karet
     se přidělují za běhu. Díky tomu platí zaručená řešitelnost i pro všechny překážky
     (inkoust, led, bubliny, mušle) a pro žraloka v boss levelech. */
  const BOSS_EVERY = 3;               // žralok sežere kartu po každém 3. líznutí
  const OBST = ['ink', 'ice', 'bub', 'shell'];

  function blank(def, level, seed) {
    return {
      level, seed, cards: def.lay.slots.map(() => ({ r: 0, s: 0, up: false, gone: false, lock: 0, key: 0, coin: false, ink: false, ice: 0, bub: 0, bn: 0, shell: 0 })),
      stock: [], si: 1, waste: [], opened: [], streak: 0, maxStreak: 0, coinsWon: 0, plus: 0, moves: 0,
      draws: 0, eaten: 0, lastEaten: null, obst: 0, boss: !!def.boss, sol: [],
    };
  }

  function generate(level, seed, scale) {
    const def = CD.Levels.get(level), lay = def.lay, N = lay.slots.length;
    const R = mulberry32(seed);
    const st = blank(def, level, seed), cards = st.cards;

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
    // překážky Hlubin
    const oPool = cards.map((_, i) => i).filter(i => !cards[i].lock && !cards[i].key);
    OBST.forEach(type => {
      const n = Math.round((def[type] || 0) * scale);
      for (let k = 0; k < n && oPool.length; k++) {
        const i = oPool.splice(pickIdx(R, oPool), 1)[0], c = cards[i];
        if (type === 'ink') c.ink = true;
        else if (type === 'ice') c.ice = 2;
        else if (type === 'bub') { c.bub = R() < 0.5 ? 1 : 2; c.bn = 2; }
        else c.shell = 1;
      }
    });
    const orig = cards.map(c => ({ ink: c.ink, ice: c.ice, bn: c.bn, shell: c.shell }));

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
    const rnd = () => 1 + Math.floor(R() * 13);
    const pushStock = r => st.stock.push({ r, s: suitFor(r) });

    // simulace řešení: série karet ±1, mezi sériemi líznutí
    const runs = splitRuns(N, def.D, R);
    if (def.shell && scale > 0) {                   // mušle se otevře až při sérii 5 → aspoň jedna dlouhá série
      let mi = 0; runs.forEach((v, i) => { if (v > runs[mi]) mi = i; });
      for (let i = 0; i < runs.length && runs[mi] < 7; i++) while (i !== mi && runs[i] > 1 && runs[mi] < 7) { runs[i]--; runs[mi]++; }
    }
    let v = rnd(), dir = R() < 0.5 ? 1 : -1;
    pushStock(v);
    st.waste = [st.stock[0]];
    const left = () => cards.some(c => !c.gone);
    for (let r = 0; left() && r < runs.length + N; r++) {
      if (r > 0) {
        let nv;
        do { nv = rnd(); } while (nv === v || adjacent(nv, v));
        v = nv;
        pushStock(v);
        if (st.boss && (st.draws + 1) % BOSS_EVERY === 0) pushStock(rnd());   // návnada pro žraloka
        draw(st);
        st.sol.push(-1);
      }
      const len = r < runs.length - 1 ? runs[r] : N;   // poslední série dohraje, co jde
      for (let k = 0; k < len; k++) {
        const a = [];
        for (let i = 0; i < N; i++) if (!cards[i].gone && isFree(st, i) && !isLocked(st, i)) a.push(i);
        if (!a.length) break;                          // zaseklo se (překážka) → líznout a pokračovat
        const i = a[pickIdx(R, a)];
        if (R() < 0.3) dir = -dir;
        v = wrap(v + dir);
        cards[i].r = v; cards[i].s = suitFor(v);
        play(st, i);
        st.sol.push(i);
      }
    }
    if (!cards.every(c => c.gone)) return null;
    for (let k = 0; k < def.slack; k++) pushStock(rnd());

    // vrátit stůl do výchozího stavu
    cards.forEach((c, i) => {
      Object.assign(c, orig[i]);
      c.gone = false;
      c.up = def.open || lay.slots[i].coveredBy.length === 0;
    });
    Object.assign(st, { si: 1, waste: [st.stock[0]], opened: [], streak: 0, maxStreak: 0, coinsWon: 0, moves: 0, draws: 0, eaten: 0, lastEaten: null, obst: 0 });
    return st;
  }

  function newGame(level, seed) {
    // když se rozdání s překážkami nepovede, zkusí se jiné; v nouzi s méně překážkami
    for (let a = 0; a < 80; a++) {
      const st = generate(level, (seed + a * 7919) >>> 0, a < 40 ? 1 : a < 60 ? 0.5 : 0);
      if (st) { st.seed = seed; st.gen = a; return st; }
    }
    throw new Error('Nepodařilo se rozdat level ' + level);
  }

  /* ---------- dotazy ---------- */
  const layOf = st => CD.Levels.get(st.level).lay;
  function isFree(st, i) {
    if (st.cards[i].gone) return false;
    return layOf(st).slots[i].coveredBy.every(j => st.cards[j].gone);
  }
  /* proč kartu nejde zahrát (i když je odkrytá): '' = nic ji neblokuje */
  function blockReason(st, i) {
    const c = st.cards[i];
    if (c.lock && !st.opened.includes(c.lock)) return 'lock';
    if (c.ink) return 'ink';
    if (c.ice > 0) return 'ice';
    if (c.bub && c.bn > 0) return 'bub';
    if (c.shell === 1) return 'shell';
    return '';
  }
  function isLocked(st, i) { return blockReason(st, i) !== ''; }
  function top(st) { return st.waste[st.waste.length - 1]; }
  function canPlay(st, i) {
    if (!isFree(st, i) || isLocked(st, i)) return false;
    const t = top(st);
    return !!t && (t.w || adjacent(t.r, st.cards[i].r));
  }
  function playable(st) { const out = []; for (let i = 0; i < st.cards.length; i++) if (canPlay(st, i)) out.push(i); return out; }
  function stockLeft(st) { return st.stock.length - st.si; }
  function limitReached(st) { return !!st.limit && st.moves >= st.limit; }
  function hasMoves(st) { return !limitReached(st) && (stockLeft(st) > 0 || playable(st).length > 0); }
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
    // překážky: inkoust a led reagují na sousední kartu, bubliny na barvu, mušle na sérii 5
    const fx = { inkCleared: [], iceHit: [], iceFreed: [], bubHit: [], bubPopped: [], shellsOpened: [], pearl: !!c.shell };
    if (c.shell) coin += 40;
    layOf(st).slots[i].nb.forEach(j => {
      const d = st.cards[j];
      if (d.gone) return;
      if (d.ink) { d.ink = false; fx.inkCleared.push(j); st.obst = (st.obst || 0) + 1; }
      if (d.ice > 0) { d.ice--; fx.iceHit.push(j); if (!d.ice) { fx.iceFreed.push(j); st.obst = (st.obst || 0) + 1; } }
    });
    const col = c.s < 2 ? 1 : 2;
    st.cards.forEach((d, j) => {
      if (d.gone || d.bub !== col || d.bn <= 0) return;
      d.bn--; fx.bubHit.push(j);
      if (!d.bn) { fx.bubPopped.push(j); st.obst = (st.obst || 0) + 1; }
    });
    if (st.streak >= 5) st.cards.forEach((d, j) => { if (!d.gone && d.shell === 1) { d.shell = 2; fx.shellsOpened.push(j); st.obst = (st.obst || 0) + 1; } });
    st.coinsWon += c.shell ? 40 : 0;
    const flipped = [];
    st.cards.forEach((d, j) => { if (!d.gone && !d.up && isFree(st, j)) { d.up = true; flipped.push(j); } });
    return Object.assign({ coin, bonus, opened, flipped, coinCard: c.coin, won: isWon(st) }, fx);
  }

  function draw(st) {
    if (stockLeft(st) <= 0) return null;
    const c = st.stock[st.si++];
    st.waste.push({ r: c.r, s: c.s });
    st.streak = 0; st.moves++;
    st.draws = (st.draws || 0) + 1;
    st.lastEaten = null;
    // boss: žralok po každém 3. líznutí sežere další kartu z balíčku
    if (st.boss && st.draws % BOSS_EVERY === 0 && stockLeft(st) > 0) { st.lastEaten = st.stock[st.si++]; st.eaten = (st.eaten || 0) + 1; }
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
    RANKS, SUITS, mulberry32, adjacent, wrap, BOSS_EVERY,
    newGame, isFree, isLocked, blockReason, limitReached, top, canPlay, playable, stockLeft, hasMoves, isWon, remaining,
    play, draw, useWild, shuffle, addStock, stars, plusPrice, snap, restore,
  };
})(typeof window !== 'undefined' ? window : globalThis);
