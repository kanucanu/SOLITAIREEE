/* =========================================================================
   Korálové sny – ukládání postupu do localStorage
   Ukládá se automaticky po každé změně (tah, výhra, úkol, nákup…).
   ========================================================================= */
(function (root) {
  'use strict';
  const CD = root.CD = root.CD || {};
  const KEY = 'koraloveSny.save.v1';
  const SCENES = 15;                   // počet dekoračních scén (3 světy × 5)

  function defaults() {
    return {
      v: 1,
      coins: 500,                        // mince
      stars: 0,                          // hvězdičky k utrácení za úkoly ve scénách
      best: {},                          // nejlepší počet hvězd v levelu { "1": 3 }
      unlocked: 1,                       // nejvyšší odemčený level (151 = vše dohráno)
      scene: 0,                          // index aktuální scény
      tasks: new Array(SCENES).fill(0),  // počet splněných úkolů v každé scéně
      chests: new Array(SCENES).fill(false),
      boosters: { wild: 2, undo: 3, shuffle: 1 },
      settings: { sound: true, music: true, hints: true },
      bonusAt: 0,                        // kdy půjde vyzvednout další bonus (ms)
      run: null,                         // rozehraný level { level, state }
      tips: {},                          // které nápovědy už hráč viděl
      introSeen: [],                     // úvodní řeči scén
      stats: { played: 0, wins: 0, bestStreak: 0, boss: 0, obst: 0, daily: 0, chal: 0 },
      daily: { last: -1, step: -1 },     // denní výzva: poslední splněný den a krok kalendáře 0–6
      stickers: {},                      // sbírka nálepek { id: počet }
      sets: {},                          // vyzvednuté odměny za kompletní sady
      chal: {},                          // splněné 3★ výzvy { "12": true }
      ach: {},                           // získané úspěchy { id: true }
      res: {},                           // obyvatelé scén: den posledního dárku { "0-1": 20400 }
      pearls: 15,                        // perly – vzácná měna obchodu
      bank: 0,                           // mince v perlové kasičce
      owned: { back: ['classic'], table: ['reef'] },   // koupený vzhled
      look: { back: 'classic', table: 'reef' },        // používaný vzhled
      shop: { gift: -1, deal: -1, starter: false },    // den denního dárku / nabídky, startovní balíček
      purchases: [],                     // id plateb (aby se nákup nepřipsal dvakrát)
    };
  }

  function sanitize(src) {
    const d = defaults();
    if (!src || typeof src !== 'object') return d;
    for (const k of Object.keys(d)) {
      if (!(k in src)) continue;
      if (['boosters', 'settings', 'stats', 'daily', 'owned', 'look', 'shop'].includes(k) && src[k] && typeof src[k] === 'object') d[k] = Object.assign(d[k], src[k]);
      else d[k] = src[k];
    }
    // starší uložené hry měly méně scén – doplnit na 15
    const pad = (arr, v) => { const a = Array.isArray(arr) ? arr.slice(0, SCENES) : []; while (a.length < SCENES) a.push(v); return a; };
    d.tasks = pad(d.tasks, 0).map(n => Math.max(0, Math.min(6, n | 0)));
    d.chests = pad(d.chests, false).map(Boolean);
    ['stickers', 'sets', 'chal', 'ach', 'res'].forEach(k => { if (!d[k] || typeof d[k] !== 'object' || Array.isArray(d[k])) d[k] = {}; });
    if (!Array.isArray(d.introSeen)) d.introSeen = [];
    if (!Array.isArray(d.purchases)) d.purchases = [];
    ['back', 'table'].forEach(k => {
      const base = k === 'back' ? 'classic' : 'reef';
      if (!Array.isArray(d.owned[k])) d.owned[k] = [];
      if (!d.owned[k].includes(base)) d.owned[k].unshift(base);
      if (!d.owned[k].includes(d.look[k])) d.look[k] = base;
    });
    d.pearls = Math.max(0, Math.floor(+d.pearls || 0));
    d.bank = Math.max(0, Math.floor(+d.bank || 0));
    d.coins = Math.max(0, Math.floor(+d.coins || 0));
    d.stars = Math.max(0, Math.floor(+d.stars || 0));
    d.unlocked = Math.min(151, Math.max(1, Math.floor(+d.unlocked || 1)));
    d.scene = Math.max(0, Math.min(SCENES - 1, d.scene | 0));
    while (d.scene < SCENES - 1 && d.chests[d.scene]) d.scene++;   // kdo dokončil svět, pokračuje první scénou dalšího
    return d;
  }

  const Store = {
    data: defaults(),
    ok: true,
    load() {
      try {
        const raw = localStorage.getItem(KEY);
        this.data = sanitize(raw ? JSON.parse(raw) : null);
        localStorage.setItem(KEY + '.probe', '1');
        localStorage.removeItem(KEY + '.probe');
      } catch (e) {
        this.ok = false;
        this.data = defaults();
      }
      return this.data;
    },
    save() {
      try { localStorage.setItem(KEY, JSON.stringify(this.data)); this.ok = true; } catch (e) { this.ok = false; }
    },
    reset() {
      this.data = defaults();
      this.save();
    },
    totalStars() { return Object.values(this.data.best).reduce((a, b) => a + b, 0); },
  };

  CD.Store = Store;
})(typeof window !== 'undefined' ? window : globalThis);
