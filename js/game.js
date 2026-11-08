/* =========================================================================
   Korálové sny – herní obrazovka TriPeaks (vykreslení, dotyky, animace)
   ========================================================================= */
(function (root) {
  'use strict';
  const CD = root.CD = root.CD || {};
  const { $ } = CD.UI;
  const E = () => CD.Engine;
  const GX = 1.06;                      // vodorovná mezera mezi kartami
  const PRICES = { wild: 250, undo: 60, shuffle: 120 };
  const LOCK_COLORS = ['', 'gold', 'pink', 'blue'];

  const G = {
    st: null, def: null, els: [], undoStack: [], ended: false,
    flights: 0, idleT: 0, stuckT: 0, cw: 60,

    /* ---------- start ---------- */
    start(level, opts = {}) {
      const d = CD.Store.data;
      CD.UI.closeAllModals();
      this.def = CD.Levels.get(level);
      if (opts.resume && d.run && d.run.level === level && d.run.state) {
        this.st = d.run.state;
        if (!Array.isArray(this.st.sol)) this.st.sol = [];
        this.undoStack = Array.isArray(d.run.undo) ? d.run.undo.slice() : [];
      } else {
        this.st = E().newGame(level, (Math.random() * 2147483647) >>> 0);
        d.stats.played++;
        this.undoStack = [];
      }
      this.ended = false;
      this.build();
      CD.UI.show('game');
      this.layout();
      this.renderAll();
      this.persist();
      setTimeout(() => this.tips(), 400);
      this.armIdle();
      this.checkStuck();
    },

    build() {
      const board = $('#board');
      board.innerHTML = '';
      this.els = this.st.cards.map((c, i) => {
        const el = document.createElement('div');
        el.className = 'card';
        el.innerHTML = CD.UI.cardInner(c) +
          (c.key ? `<div class="badge-key ${LOCK_COLORS[c.key]}">${CD.UI.icon('key')}</div>` : '') +
          (c.lock ? `<div class="lock-ov ${LOCK_COLORS[c.lock]}"><div class="chain"></div>${CD.UI.icon('lock')}</div>` : '') +
          (c.coin ? `<div class="badge-coin">${CD.UI.icon('coin')}</div>` : '');
        el.dataset.v = c.r + '-' + c.s;
        el.addEventListener('pointerdown', e => { e.preventDefault(); this.tapCard(i); });
        board.appendChild(el);
        return el;
      });
      $('#gLevel').textContent = `Level ${this.st.level}`;
    },

    /* ---------- rozměry ---------- */
    layout() {
      if (!this.st) return;
      const board = $('#board'), r = board.getBoundingClientRect(), lay = this.def.lay;
      const w = r.width - 16, h = r.height - 16;
      const unitsW = lay.maxX * GX / 2 + 1, unitsH = (lay.maxY / 2 + 1) * 1.4;
      const cw = Math.max(26, Math.floor(Math.min(w / unitsW, h / unitsH, 132)));
      const ch = Math.round(cw * 1.4);
      const ox = (r.width - unitsW * cw) / 2, oy = Math.max(8, (r.height - (lay.maxY / 2 + 1) * ch) / 2);
      this.cw = cw;
      board.classList.add('no-anim');
      this.els.forEach((el, i) => {
        const s = lay.slots[i];
        Object.assign(el.style, {
          left: (ox + s.x * cw / 2 * GX).toFixed(1) + 'px', top: (oy + s.y * ch / 2).toFixed(1) + 'px',
          width: cw + 'px', height: ch + 'px', fontSize: cw + 'px', zIndex: 10 + s.y * 2,
        });
      });
      requestAnimationFrame(() => board.classList.remove('no-anim'));
      const bar = $('.g-bar');
      const bcw = Math.floor(Math.max(34, Math.min(cw * 1.08, (bar.clientHeight - 18) / 1.4, 118)));
      $('#scr-game').style.setProperty('--bcw', bcw + 'px');
      this.renderStock();
      this.renderWaste();
    },

    /* ---------- vykreslení ---------- */
    renderAll() { this.renderCards(); this.renderStock(); this.renderWaste(); this.renderHud(); },

    renderCards() {
      const st = this.st;
      st.cards.forEach((c, i) => {
        const el = this.els[i];
        const locked = E().isLocked(st, i);
        el.classList.toggle('gone', c.gone);
        el.classList.toggle('down', !c.up);
        el.classList.toggle('locked', locked);
        el.classList.toggle('free', !c.gone && E().isFree(st, i) && !locked);
        const v = c.r + '-' + c.s;
        if (el.dataset.v !== v) {
          const f = el.querySelector('.cf.front');
          f.insertAdjacentHTML('afterend', CD.UI.cardFace(c));
          f.remove();
          el.dataset.v = v;
        }
      });
    },

    renderStock() {
      const n = E().stockLeft(this.st), show = Math.min(n, 10);
      const off = 5;
      let h = '';
      for (let k = 0; k < show; k++) h += `<div class="card down sc" style="left:${k * off}px"><div class="ci"><div class="cf back"></div></div></div>`;
      if (!n) h = `<div class="stock-empty">${CD.UI.icon('close')}</div>`;
      const el = $('#stock');
      el.innerHTML = h + `<div class="stock-count">${n}</div>`;
      el.style.width = `calc(var(--bcw) + ${Math.max(0, show - 1) * off}px)`;
      el.classList.toggle('empty', !n);
    },

    renderWaste(cardOverride) {
      const st = this.st, top = cardOverride || E().top(st);
      const prev = st.waste.length > 1 ? st.waste[st.waste.length - 2] : null;
      $('#waste').innerHTML = (prev && !cardOverride ? `<div class="card wprev">${CD.UI.cardInner(prev)}</div>` : '') +
        (top ? `<div class="card wtop">${CD.UI.cardInner(top)}</div>` : '');
    },

    renderHud() {
      const st = this.st, d = CD.Store.data, def = this.def;
      CD.UI.updateWallet();
      const k = st.streak % 7;
      $('#gStreak').innerHTML = `<i style="width:${(k / 7) * 100}%"></i><span>Série ${st.streak}</span>`;
      $('#gStreak').classList.toggle('hot', st.streak >= 7);
      const proj = st.plus ? 1 : E().stockLeft(st) >= def.t3 ? 3 : E().stockLeft(st) >= def.t2 ? 2 : 1;
      $('#gStars').innerHTML = CD.UI.starsHTML(proj, 3);
      document.querySelectorAll('.boost[data-b]').forEach(b => {
        const t = b.dataset.b;
        if (t === 'hint') return;
        const cnt = d.boosters[t] || 0;
        b.querySelector('.bcount').innerHTML = cnt > 0 ? `${cnt}` : `${CD.UI.icon('coin')}${PRICES[t]}`;
        b.classList.toggle('paid', cnt <= 0);
      });
      $('#gSound').innerHTML = CD.UI.icon(d.settings.sound ? 'sound' : 'mute');
    },

    persist() {
      if (this.ended) return;
      CD.Store.data.run = { level: this.st.level, state: this.st, undo: this.undoStack.slice(-10) };
      CD.Store.save();
    },

    /* ---------- akce hráče ---------- */
    pushUndo() {
      this.undoStack.push(E().snap(this.st));
      if (this.undoStack.length > 60) this.undoStack.shift();
    },

    wasteRect() { const w = $('#waste'); return (w.querySelector('.wtop') || w).getBoundingClientRect(); },

    fly(fromRect, card, flip) {
      this.flights++;
      const to = $('#waste').getBoundingClientRect();
      const toRect = { left: to.left, top: to.top, width: to.width, height: to.height };
      return CD.UI.flyCard(fromRect, toRect, card, { flip }).then(() => {
        this.flights--;
        if (this.flights === 0) this.renderWaste();
      });
    },

    tapCard(i) {
      if (this.ended || CD.UI.hasModal()) return;
      CD.Sound.unlock();
      this.clearHint();
      const st = this.st, el = this.els[i];
      if (!E().canPlay(st, i)) {
        if (st.cards[i].gone) return;
        if (E().isLocked(st, i) && E().isFree(st, i)) { this.shake(el); CD.UI.toast('Zámek otevře karta s klíčem stejné barvy.'); }
        else if (E().isFree(st, i)) { this.shake(el); CD.Sound.play('bad'); }
        return;
      }
      this.pushUndo();
      const from = el.getBoundingClientRect();
      const ev = E().play(st, i);
      el.classList.add('gone');
      this.fly(from, st.waste[st.waste.length - 1], false);
      CD.Sound.play('card', st.streak);
      CD.UI.float(from.left + from.width / 2, from.top, `+${ev.coin} ${CD.UI.icon('coin')}`, ev.coinCard ? 'coin big' : 'coin');
      if (ev.coinCard) setTimeout(() => CD.Sound.play('coin'), 120);
      if (ev.bonus) { CD.UI.banner(`Série ${st.streak}!<small>+${ev.bonus} mincí</small>`); setTimeout(() => CD.Sound.play('bonus'), 150); }
      if (ev.opened) {
        CD.Sound.play('unlock');
        this.els.forEach((e, j) => { if (st.cards[j].lock === ev.opened) e.classList.add('unlocking'); });
        setTimeout(() => this.els.forEach(e => e.classList.remove('unlocking')), 700);
      }
      if (ev.flipped.length) setTimeout(() => CD.Sound.play('flip'), 120);
      this.renderCards();
      this.renderHud();
      this.persist();
      this.armIdle();
      if (ev.won) setTimeout(() => this.win(), 420);
      else this.checkStuck();
    },

    tapStock() {
      if (this.ended || CD.UI.hasModal()) return;
      CD.Sound.unlock();
      this.clearHint();
      const st = this.st;
      if (E().stockLeft(st) <= 0) {
        if (!E().hasMoves(st)) this.outOfMoves();
        else CD.UI.toast('Balíček je prázdný – zkus zahrát kartu ze stolu.');
        return;
      }
      this.pushUndo();
      const cards = $('#stock').querySelectorAll('.sc');
      const from = (cards[cards.length - 1] || $('#stock')).getBoundingClientRect();
      const c = E().draw(st);
      this.renderStock();
      this.fly(from, c, true);
      CD.Sound.play('draw');
      this.renderHud();
      this.persist();
      this.armIdle();
      this.checkStuck();
    },

    pay(type) {
      const d = CD.Store.data;
      if (d.boosters[type] > 0) { d.boosters[type]--; CD.Store.save(); return true; }
      if (d.coins >= PRICES[type]) { d.coins -= PRICES[type]; CD.Store.save(); return true; }
      CD.Sound.play('bad');
      CD.UI.toast('Nemáš dost mincí.');
      return false;
    },

    booster(type) {
      if (this.ended || CD.UI.hasModal()) return;
      CD.Sound.unlock();
      this.clearHint();
      const st = this.st;
      if (type === 'hint') { this.hint(true); return; }
      if (type === 'undo') {
        if (!this.undoStack.length) { CD.UI.toast('Není co vrátit.'); return; }
        if (!this.pay('undo')) return;
        this.st = E().restore(st, this.undoStack.pop());
        CD.Sound.play('click');
        this.flights = 0;
        this.renderAll();
        this.persist();
        return;
      }
      if (type === 'wild') {
        const t = E().top(st);
        if (t && t.w) { CD.UI.toast('Žolík už leží na hromádce.'); return; }
        if (!this.pay('wild')) return;
        E().useWild(st);
        this.undoStack = [];
        const from = $('.boost[data-b="wild"]').getBoundingClientRect();
        this.fly({ left: from.left, top: from.top, width: from.width * 0.7, height: from.width }, E().top(st), false);
        CD.Sound.play('wild');
        this.renderHud();
        this.persist();
        return;
      }
      if (type === 'shuffle') {
        if (!st.cards.some(c => !c.gone)) return;
        if (!this.pay('shuffle')) return;
        E().shuffle(st);
        this.undoStack = [];
        CD.Sound.play('shuffle');
        const b = $('#board');
        b.classList.add('shuffling');
        setTimeout(() => { this.renderCards(); }, 300);
        setTimeout(() => b.classList.remove('shuffling'), 650);
        this.renderHud();
        this.persist();
        this.checkStuck();
      }
    },

    shake(el) {
      el.classList.remove('shake');
      void el.offsetWidth;
      el.classList.add('shake');
    },

    /* ---------- nápověda ---------- */
    clearHint() {
      document.querySelectorAll('.card.hint, #stock.hint').forEach(e => e.classList.remove('hint'));
    },
    hint(manual) {
      const st = this.st;
      if (this.ended) return;
      const p = E().playable(st);
      if (p.length) {
        // preferuj kartu, která odkryje víc dalších karet
        const lay = this.def.lay;
        let best = p[0], bv = -1;
        p.forEach(i => {
          const v = lay.slots[i].covers.filter(j => !st.cards[j].up).length * 2 + lay.slots[i].covers.length;
          if (v > bv) { bv = v; best = i; }
        });
        this.els[best].classList.add('hint');
      } else if (E().stockLeft(st) > 0) $('#stock').classList.add('hint');
      else if (manual) CD.UI.toast('Žádný tah – použij žolíka nebo zamíchej.');
      if (manual) CD.Sound.play('click');
    },
    armIdle() {
      clearTimeout(this.idleT);
      this.idleT = setTimeout(() => {
        if (CD.UI.current === 'game' && !this.ended && CD.Store.data.settings.hints && !CD.UI.hasModal()) this.hint(false);
      }, 9000);
    },

    checkStuck() {
      clearTimeout(this.stuckT);
      const st = this.st;
      if (this.ended || E().hasMoves(st)) return;
      this.stuckT = setTimeout(() => {
        if (this.st === st && !this.ended && !E().hasMoves(st) && CD.UI.current === 'game' && !CD.UI.hasModal()) this.outOfMoves();
      }, 750);
    },

    /* ---------- konec hry ---------- */
    outOfMoves() {
      const st = this.st, d = CD.Store.data, price = E().plusPrice(st);
      const canWild = d.boosters.wild > 0 || d.coins >= PRICES.wild;
      const m = CD.UI.modal({ title: 'Došly ti karty!', cls: 'm-out', html: `
<p class="m-text">Na stole zbývá <b>${E().remaining(st)}</b> ${E().remaining(st) === 1 ? 'karta' : E().remaining(st) < 5 ? 'karty' : 'karet'}. Nevzdávej to!</p>
<div class="plus-cards"><div class="pc-fan"><i></i><i></i><i></i><i></i><i></i></div><b>+5 karet</b></div>
<div class="m-btns col">
  <button class="btn btn-green btn-lg" data-plus ${d.coins < price ? 'disabled' : ''}>Přidat 5 karet · ${CD.UI.icon('coin')} ${price}</button>
  ${canWild ? `<button class="btn btn-blue" data-wild>Použít žolíka ${d.boosters.wild > 0 ? `(${d.boosters.wild}×)` : `· ${CD.UI.icon('coin')} ${PRICES.wild}`}</button>` : ''}
  <button class="btn btn-gray" data-give>Vzdát se</button>
</div>
<p class="m-small">Máš ${CD.UI.icon('coin')} ${CD.UI.fmt(d.coins)} mincí. Dokoupení karet snižuje hodnocení na 1 hvězdu.</p>` });
      m.el.querySelector('[data-plus]').addEventListener('click', () => {
        if (d.coins < price) return;
        d.coins -= price;
        E().addStock(st, 5);
        m.close(true);
        CD.Sound.play('coin');
        this.renderStock(); this.renderHud(); this.persist();
      });
      const w = m.el.querySelector('[data-wild]');
      if (w) w.addEventListener('click', () => { m.close(true); this.booster('wild'); });
      m.el.querySelector('[data-give]').addEventListener('click', () => { m.close(true); this.lose(); });
    },

    lose() {
      const st = this.st, d = CD.Store.data;
      this.ended = true;
      clearTimeout(this.idleT);
      d.coins += st.coinsWon;
      d.run = null;
      CD.Store.save();
      CD.Sound.play('lose');
      const m = CD.UI.modal({ title: `Level ${st.level}`, closable: false, cls: 'm-lose', html: `
<div class="lose-ico">🐢💧</div>
<p class="m-text big">Tentokrát to nevyšlo.</p>
<p class="m-text">Mince ze série si necháváš: <b>+${st.coinsWon}</b> ${CD.UI.icon('coin')}</p>
<div class="m-btns"><button class="btn btn-blue" data-home>Domů</button><button class="btn btn-green" data-retry>Zkusit znovu</button></div>` });
      m.el.querySelector('[data-home]').addEventListener('click', () => { m.close(true); CD.Home.open(); });
      m.el.querySelector('[data-retry]').addEventListener('click', () => { m.close(true); this.start(st.level, { resume: false }); });
    },

    win() {
      const st = this.st, d = CD.Store.data, n = st.level;
      this.ended = true;
      clearTimeout(this.idleT); clearTimeout(this.stuckT);
      const stars = E().stars(st), rem = E().stockLeft(st);
      const base = 40 + n * 4, stockBonus = rem * 15, total = base + stockBonus + st.coinsWon;
      const prev = d.best[n] || 0, gained = Math.max(0, stars - prev);
      d.best[n] = Math.max(prev, stars);
      d.stars += gained;
      d.coins += total;
      d.unlocked = Math.max(d.unlocked, n + 1);
      d.run = null;
      d.stats.wins++;
      d.stats.bestStreak = Math.max(d.stats.bestStreak, st.maxStreak);
      CD.Store.save();
      CD.Sound.play('win');
      CD.UI.confetti();
      // zbylé karty z balíčku odletí jako bonus
      $('#stock').querySelectorAll('.sc').forEach((c, k) => setTimeout(() => {
        const r = c.getBoundingClientRect();
        c.classList.add('fly-off');
        CD.UI.float(r.left + r.width / 2, r.top, `+15`, 'coin');
      }, 200 + k * 90));

      const last = n >= CD.Levels.COUNT;
      const sc = CD.Scenes.SCENES[d.scene], next = sc.tasks[d.tasks[d.scene]];
      const m = CD.UI.modal({ title: 'Výborně!', closable: false, cls: 'm-win', html: `
<div class="win-title">Level ${n} dokončen</div>
<div class="win-stars">${[0, 1, 2].map(i => `<svg class="wst ${i < stars ? 'on' : 'off'}" style="animation-delay:${0.35 + i * 0.3}s"><use href="#i-star"/></svg>`).join('')}</div>
<div class="win-lines">
  <div><span>Odměna za level</span><b>+${base}</b></div>
  <div><span>Zbylé karty (${rem} × 15)</span><b>+${stockBonus}</b></div>
  <div><span>Série a bonusy</span><b>+${st.coinsWon}</b></div>
  <div class="tot"><span>Celkem</span><b>+${CD.UI.fmt(total)} ${CD.UI.icon('coin')}</b></div>
</div>
<div class="win-gain">${gained ? `+${gained} ${CD.UI.icon('star', 'st on')} do scény` : stars < 3 ? 'Zkus level zopakovat a získat víc hvězd!' : 'Perfektní výsledek!'}${st.maxStreak >= 5 ? ` · nejdelší série ${st.maxStreak}` : ''}</div>
${last ? '<p class="m-text">Dohrál(a) jsi všech 50 levelů! 🎉</p>' : ''}
<div class="m-btns"><button class="btn btn-blue" data-home>${next && d.stars >= next.cost ? 'Splnit úkol' : 'Domů'}</button>${last ? '' : `<button class="btn btn-green" data-next>Další level</button>`}</div>` });
      [0, 1, 2].forEach(i => { if (i < stars) setTimeout(() => CD.Sound.play('star', i), 350 + i * 300); });
      m.el.querySelector('[data-home]').addEventListener('click', () => { m.close(true); CD.Home.open(); });
      const nb = m.el.querySelector('[data-next]');
      if (nb) nb.addEventListener('click', () => { m.close(true); this.start(n + 1, { resume: false }); });
    },

    async leave() {
      if (this.ended) { CD.Home.open(); return; }
      CD.Sound.play('click');
      const ok = await CD.UI.confirm('Odejít z levelu?', 'Rozehraná hra se uloží – můžeš v ní pokračovat později.', 'Odejít', 'Hrát dál', 'btn-orange');
      if (ok) { this.persist(); clearTimeout(this.idleT); CD.Home.open(); }
    },

    /* ---------- nápovědy pro nováčky ---------- */
    tips() {
      const d = CD.Store.data, st = this.st;
      let key = null, text = '';
      if (st.level === 1 && !d.tips.basic) { key = 'basic'; text = 'Klepni na kartu, která je o 1 vyšší nebo nižší než karta dole na hromádce. Král a eso na sebe navazují! Když nemáš tah, klepni na balíček.'; }
      else if (st.cards.some(c => c.lock) && !d.tips.lock) { key = 'lock'; text = 'Nové: zámek! Karta se zámkem se uvolní, až odehraješ kartu s klíčem stejné barvy.'; }
      else if (st.cards.some(c => !c.up) && !d.tips.hidden) { key = 'hidden'; text = 'Karty otočené rubem se otočí, jakmile odstraníš karty, které je zakrývají.'; }
      if (!key) return;
      d.tips[key] = true;
      CD.Store.save();
      const t = document.createElement('div');
      t.className = 'game-tip';
      t.innerHTML = `${CD.Art.turtle('tip-turtle')}<p>${text}</p>`;
      $('#scr-game').appendChild(t);
      const close = () => { t.classList.add('out'); setTimeout(() => t.remove(), 300); };
      t.addEventListener('click', close);
      setTimeout(close, 9000);
    },
  };

  CD.Game = G;
})(typeof window !== 'undefined' ? window : globalThis);
