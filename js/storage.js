/* =========================================================================
   Korálové sny – ukládání postupu do localStorage
   Ukládá se automaticky po každé změně (tah, výhra, úkol, nákup…).
   ========================================================================= */
(function (root) {
  'use strict';
  const CD = root.CD = root.CD || {};
  const KEY = 'koraloveSny.save.v1';

  function defaults() {
    return {
      v: 1,
      coins: 500,                        // mince
      stars: 0,                          // hvězdičky k utrácení za úkoly ve scénách
      best: {},                          // nejlepší počet hvězd v levelu { "1": 3 }
      unlocked: 1,                       // nejvyšší odemčený level (51 = vše dohráno)
      scene: 0,                          // index aktuální scény
      tasks: [0, 0, 0, 0, 0],            // počet splněných úkolů v každé scéně
      chests: [false, false, false, false, false],
      boosters: { wild: 2, undo: 3, shuffle: 1 },
      settings: { sound: true, hints: true },
      bonusAt: 0,                        // kdy půjde vyzvednout další bonus (ms)
      run: null,                         // rozehraný level { level, state }
      tips: {},                          // které nápovědy už hráč viděl
      introSeen: [],                     // úvodní řeči scén
      stats: { played: 0, wins: 0, bestStreak: 0 },
    };
  }

  function sanitize(src) {
    const d = defaults();
    if (!src || typeof src !== 'object') return d;
    for (const k of Object.keys(d)) {
      if (!(k in src)) continue;
      if (['boosters', 'settings', 'stats'].includes(k) && src[k] && typeof src[k] === 'object') d[k] = Object.assign(d[k], src[k]);
      else d[k] = src[k];
    }
    if (!Array.isArray(d.tasks) || d.tasks.length !== 5) d.tasks = defaults().tasks;
    if (!Array.isArray(d.chests) || d.chests.length !== 5) d.chests = defaults().chests;
    if (!Array.isArray(d.introSeen)) d.introSeen = [];
    d.coins = Math.max(0, Math.floor(+d.coins || 0));
    d.stars = Math.max(0, Math.floor(+d.stars || 0));
    d.unlocked = Math.min(51, Math.max(1, Math.floor(+d.unlocked || 1)));
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
