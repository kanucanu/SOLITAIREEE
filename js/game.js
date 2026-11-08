/* =========================================================================
   Korálové sny – herní obrazovka TriPeaks (vykreslení, dotyky, animace)
   ========================================================================= */
(function (root) {
  'use strict';
  const CD = root.CD = root.CD || {};
  const { $ } = CD.UI;
  const E = () => CD.Engine;
  const GX = 1.06;                      // vodorovná mezera mezi kartami
  const PRICES = CD.Shop.PRICES;          // ceny pomocníků v mincích (společné s obchodem)
  const LOCK_COLORS = ['', 'gold', 'pink', 'blue'];
  // stupeň série: 0 (méně než 3) … 4 (15 a víc) – určuje barvu a sílu efektů
  const comboTier = n => n >= 15 ? 4 : n >= 10 ? 3 : n >= 5 ? 2 : n >= 3 ? 1 : 0;
  // proč nejde kartu zahrát – vysvětlení pro hráče
  const BLOCK_MSG = {
    lock: 'Zámek otevře karta s klíčem stejné barvy.',
    ink: 'Inkoust smyje karta zahraná hned vedle.',
    ice: 'Led roztají karty zahrané hned vedle (potřeba je {n}×).',
    bub: 'Bublina praskne po zahrání ještě {n} {c} karet.',
    shell: 'Perlová mušle se otevře, až budeš mít sérii 5 karet.',
    tent: 'Chapadlo Krakena kartu pustí, když zahraješ kartu hned vedle.',
    tide: 'Karta je pod vodou. Odliv přijde za {n} {t}.',
    chainwait: 'Nejdřív zahraj druhou kartu na řetězu (svítí)!',
    chain: 'Řetěz: zahrát jde, až budou odkryté obě karty – pak hned po sobě.',
  };
  const CHAIN_COLORS = ['', '#ffb22e', '#ff6f91', '#5ee7df', '#a98bff'];
  const LOOT = { wild: ['žolík', 'wild'], undo: ['tah zpět', 'undo'], shuffle: ['zamíchání', 'shuffle'], pearl: ['perla', 'pearl'] };
  const tahy = n => n === 1 ? 'tah' : n < 5 ? 'tahy' : 'tahů';
  const KRAKEN_SVG = '<svg viewBox="0 0 120 100"><g fill="#8a5bd6"><path d="M22 70 C10 78 6 92 16 96 C24 99 24 88 30 84Z"/><path d="M40 76 C34 88 38 99 48 98 C54 97 50 88 52 80Z"/><path d="M80 76 C86 88 82 99 72 98 C66 97 70 88 68 80Z"/><path d="M98 70 C110 78 114 92 104 96 C96 99 96 88 90 84Z"/></g><path d="M60 8 C88 8 102 30 100 54 C98 74 82 84 60 84 C38 84 22 74 20 54 C18 30 32 8 60 8Z" fill="#a679ec"/><ellipse cx="48" cy="30" rx="12" ry="7" fill="#fff" opacity=".2" transform="rotate(-20 48 30)"/><circle cx="46" cy="52" r="9" fill="#fff"/><circle cx="74" cy="52" r="9" fill="#fff"/><circle class="pupil" cx="48" cy="54" r="5" fill="#2a1d4a"/><circle class="pupil" cx="76" cy="54" r="5" fill="#2a1d4a"/><path class="brow" d="M36 40 L54 45 M84 40 L66 45" stroke="#5a3a9a" stroke-width="4" stroke-linecap="round"/><path d="M50 70 Q60 76 70 70" stroke="#5a3a9a" stroke-width="3.5" fill="none" stroke-linecap="round"/><g fill="#c9a8ff"><circle cx="30" cy="64" r="3"/><circle cx="90" cy="64" r="3"/></g></svg>';
  const TENT_SVG = '<svg viewBox="0 0 100 140" preserveAspectRatio="none"><path d="M-6 150 C10 110 -4 80 20 60 C40 44 70 52 74 32 C78 16 64 8 56 16 C50 22 58 30 64 26" stroke="#8a5bd6" stroke-width="22" fill="none" stroke-linecap="round"/><path d="M-6 150 C10 110 -4 80 20 60 C40 44 70 52 74 32" stroke="#b98cf5" stroke-width="8" fill="none" stroke-linecap="round" stroke-dasharray="1 16"/><g fill="#f3e6ff"><circle cx="14" cy="96" r="4.5"/><circle cx="24" cy="68" r="4.5"/><circle cx="46" cy="52" r="4.5"/><circle cx="68" cy="40" r="4"/></g></svg>';
  const BOTTLE_SVG = '<svg viewBox="0 0 40 60"><rect x="15" y="2" width="10" height="8" rx="2" fill="#b07a3a"/><path d="M14 10 H26 V18 C34 22 36 28 36 34 V52 C36 56 33 58 30 58 H10 C7 58 4 56 4 52 V34 C4 28 6 22 14 18Z" fill="#7fe0c8" fill-opacity=".85" stroke="#2f9c86" stroke-width="2.5"/><rect x="10" y="30" width="20" height="16" rx="2" fill="#fff4d6" transform="rotate(-8 20 38)"/><path d="M13 36 H26 M13 41 H23" stroke="#c9a46a" stroke-width="1.6" transform="rotate(-8 20 38)"/><path d="M9 26 C8 32 8 40 9 48" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity=".7"/></svg>';
  const BOLT_SVG = '<svg viewBox="0 0 40 50"><path d="M24 2 L6 28 H18 L12 48 L34 18 H22 Z" fill="#ffe14d" stroke="#e08a00" stroke-width="2.5" stroke-linejoin="round"/></svg>';
  const ANCHOR_SVG = '<svg viewBox="0 0 40 40"><circle cx="20" cy="7" r="4" fill="none" stroke="currentColor" stroke-width="3"/><path d="M20 11 V35 M12 17 H28 M7 26 C8 33 14 36 20 36 C26 36 32 33 33 26" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/></svg>';
  const INK_SVG = '<svg viewBox="0 0 100 140" preserveAspectRatio="none"><path d="M8 18 C20 2 42 10 52 4 C66 -2 90 6 94 24 C100 44 88 52 96 72 C102 92 86 98 90 116 C92 132 72 138 60 128 C50 120 44 140 30 132 C16 124 22 108 10 100 C-2 90 6 74 4 58 C2 44 -2 30 8 18Z" fill="#2a1d4a"/><path d="M30 132 C30 138 26 142 22 140 M60 128 C62 136 58 141 54 139" stroke="#2a1d4a" stroke-width="6" stroke-linecap="round"/><ellipse cx="34" cy="34" rx="12" ry="7" fill="#fff" opacity=".18" transform="rotate(-25 34 34)"/><circle cx="70" cy="80" r="5" fill="#fff" opacity=".12"/></svg>';
  const SHELL_SVG = '<svg viewBox="0 0 100 100"><defs><linearGradient id="shg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff3fa"/><stop offset="1" stop-color="#f3a7c8"/></linearGradient></defs><path d="M50 92 L8 52 C2 22 26 6 50 6 C74 6 98 22 92 52Z" fill="url(#shg)" stroke="#d8779f" stroke-width="3"/><path d="M50 90 L20 30 M50 90 L35 16 M50 90 L50 10 M50 90 L65 16 M50 90 L80 30" stroke="#d8779f" stroke-width="3" fill="none" opacity=".7"/><path d="M38 88 Q50 98 62 88 L56 82 L44 82Z" fill="#e88db3"/></svg>';
  const SHARK_SVG = '<svg viewBox="0 0 120 80"><path d="M10 44 C30 22 70 18 100 34 L116 22 L112 44 L116 62 L100 52 C72 66 32 64 10 44Z" fill="#7d93b4"/><path d="M48 24 L58 4 L68 26Z" fill="#6a7fa0"/><path d="M14 46 C34 58 70 60 98 50 C70 66 32 64 14 46Z" fill="#e8eef7"/><circle cx="30" cy="38" r="4.5" fill="#1d2b4f"/><circle cx="31.5" cy="36.5" r="1.4" fill="#fff"/><path class="jaw" d="M14 46 L22 50 L26 46 L30 51 L34 47 L38 51 L42 47" stroke="#fff" stroke-width="2.4" fill="none" stroke-linejoin="round"/><path d="M60 40 Q64 44 60 48 M66 40 Q70 44 66 48" stroke="#5d7090" stroke-width="2.2" fill="none" stroke-linecap="round"/></svg>';
  const COMBO_WORDS = { 3: 'Pěkně!', 5: 'Super!', 10: 'Úžasné!', 15: 'Neuvěřitelné!', 20: 'Mistrovské!', 25: 'Legendární!' };

  const G = {
    st: null, def: null, els: [], undoStack: [], ended: false,
    flights: 0, idleT: 0, stuckT: 0, cw: 60,

    /* ---------- start ---------- */
    start(level, opts = {}) {
      const d = CD.Store.data;
      CD.UI.closeAllModals();
      document.querySelectorAll('.game-tip').forEach(t => t.remove());
      this.def = CD.Levels.get(level);
      const mode = opts.mode || (this.def.daily ? 'daily' : '');
      let fresh = false;
      if (opts.resume && d.run && d.run.level === level && d.run.state && (d.run.state.mode || '') === mode) {
        this.st = d.run.state;
        if (!Array.isArray(this.st.sol)) this.st.sol = [];
        this.undoStack = Array.isArray(d.run.undo) ? d.run.undo.slice() : [];
      } else {
        this.st = E().newGame(level, (Math.random() * 2147483647) >>> 0);
        if (mode) this.st.mode = mode;
        // 3★ výzva: omezený počet tahů = délka zaručeného řešení + 3
        if (mode === 'challenge') this.st.limit = this.st.sol.length + 3;
        d.stats.played++;
        this.undoStack = [];
        fresh = true;
      }
      this.ended = false;
      this.build();
      CD.UI.show('game');
      this.layout();
      this.renderAll();
      this.persist();
      if (fresh && this.def.boss) setTimeout(() => this.bossIntro(), 350);
      else setTimeout(() => this.tips(), 400);
      this.armIdle();
      this.checkStuck();
    },

    bossIntro() {
      if (this.def.boss === 'kraken') return this.krakenIntro();
      const m = CD.UI.modal({ title: 'Boss level!', cls: 'm-boss', html: `
<div class="boss-pic">${SHARK_SVG}</div>
<p class="m-text big">Žralok Žrout hlídá tenhle level!</p>
<p class="m-text">Po každém <b>${E().BOSS_EVERY}. líznutí</b> ti sežere jednu kartu z balíčku. Hraj co nejdelší série a lízej jen v nouzi!</p>
<div class="m-btns"><button class="btn btn-orange btn-lg" data-ok>Do boje!</button></div>` });
      m.el.querySelector('[data-ok]').addEventListener('click', () => { m.close(true); this.tips(); });
    },

    krakenIntro() {
      const final = this.st.level >= CD.Levels.COUNT;
      const m = CD.UI.modal({ title: final ? 'Velké finále!' : 'Boss level!', cls: 'm-boss m-kraken', html: `
<div class="boss-pic">${KRAKEN_SVG}</div>
<p class="m-text big">${final ? 'Kraken se postavil do cesty naposledy!' : 'Kraken rozbouřil moře!'}</p>
<p class="m-text">Po každém <b>${E().KRAKEN_EVERY}. tahu</b> chytí chapadlem jednu kartu – pustí ji, když zahraješ kartu hned vedle.<br>Zažeň ho <b>třemi sériemi</b> (5, 10 a 15 karet za sebou)!</p>
<div class="m-btns"><button class="btn btn-orange btn-lg" data-ok>Do boje!</button></div>` });
      m.el.querySelector('[data-ok]').addEventListener('click', () => { m.close(true); this.tips(); });
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
          (c.coin ? `<div class="badge-coin">${CD.UI.icon('coin')}</div>` : '') +
          (c.ink ? `<div class="ink-ov">${INK_SVG}</div>` : '') +
          (c.ice ? '<div class="ice-ov"><i class="crack"></i></div>' : '') +
          (c.bub ? `<div class="bub-ov ${c.bub === 1 ? 'red' : 'black'}"><svg class="bub-suit"><use href="#s-${c.bub === 1 ? 'h' : 's'}"/></svg><b class="bub-n">2</b></div>` : '') +
          (c.shell ? `<div class="shell-ov">${SHELL_SVG}<b>5</b></div>` : '') +
          (c.tide ? '<div class="tide-ov"><i class="wave"></i></div>' : '') +
          (c.ch ? `<div class="chain-ov" style="--cc:${CHAIN_COLORS[c.ch] || '#ffb22e'}"><i class="links"></i><span class="anchor">${ANCHOR_SVG}</span></div>` : '') +
          (c.bottle ? `<div class="bottle-ov">${BOTTLE_SVG}</div>` : '') +
          (c.bolt ? `<div class="bolt-ov">${BOLT_SVG}</div>` : '') +
          `<div class="tent-ov">${TENT_SVG}</div>`;
        el.dataset.v = c.r + '-' + c.s;
        el.addEventListener('pointerdown', e => { e.preventDefault(); this.tapCard(i); });
        board.appendChild(el);
        return el;
      });
      const st = this.st;
      $('#gLevel').textContent = st.mode === 'daily' ? 'Denní výzva' : st.mode === 'challenge' ? `Výzva · Level ${st.level}` : this.def.boss ? `Boss · Level ${st.level}` : `Level ${st.level}`;
      const old = $('#boss');
      if (old) old.remove();
      if (this.def.boss === 'kraken') $('.piles').insertAdjacentHTML('afterbegin', `<div class="boss kraken" id="boss" aria-label="Kraken">${KRAKEN_SVG}<span class="boss-n"></span><span class="khp"></span></div>`);
      else if (this.def.boss) $('.piles').insertAdjacentHTML('afterbegin', `<div class="boss" id="boss" aria-label="Žralok">${SHARK_SVG}<span class="boss-n"></span></div>`);
      const oldT = $('#gTide');
      if (oldT) oldT.remove();
      if (st.tide) $('.g-mid').insertAdjacentHTML('beforeend', '<div class="g-tide" id="gTide"></div>');
      if (!$('#combo')) $('.piles').insertAdjacentHTML('beforeend', '<div class="combo" id="combo" aria-hidden="true"><b></b><span>COMBO</span></div>');
    },

    /* ---------- rozměry ---------- */
    layout() {
      if (!this.st) return;
      // telefon na výšku: lišta ve dvou řádcích, velikost karet v liště podle šířky displeje
      const stacked = matchMedia('(max-width: 600px) and (orientation: portrait)').matches;
      if (stacked) $('#scr-game').style.setProperty('--bcw', Math.round(Math.max(54, Math.min(innerWidth * 0.2, 92))) + 'px');
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
      if (!stacked) {
        const bar = $('.g-bar');
        const bcw = Math.floor(Math.max(34, Math.min(cw * 1.08, (bar.clientHeight - 18) / 1.4, 118)));
        $('#scr-game').style.setProperty('--bcw', bcw + 'px');
      }
      this.renderStock();
      this.renderWaste();
    },

    /* ---------- vykreslení ---------- */
    renderAll() { this.renderCards(); this.renderStock(); this.renderWaste(); this.renderHud(); },

    renderCards() {
      const st = this.st;
      st.cards.forEach((c, i) => {
        const el = this.els[i];
        const blocked = E().isLocked(st, i);
        el.classList.toggle('gone', c.gone);
        el.classList.toggle('down', !c.up);
        el.classList.toggle('locked', !!c.lock && !st.opened.includes(c.lock));
        el.classList.toggle('inked', !!c.ink);
        el.classList.toggle('ice2', c.ice === 2);
        el.classList.toggle('ice1', c.ice === 1);
        el.classList.toggle('bubbled', !!c.bub && c.bn > 0);
        el.classList.toggle('shelled', c.shell === 1);
        el.classList.toggle('pearl', c.shell === 2);
        el.classList.toggle('flooded', c.tide && E().tideHigh(st));
        el.classList.toggle('tented', !!c.tent);
        el.classList.toggle('chained', !!c.ch);
        el.classList.toggle('chain-next', !!c.ch && st.chainWait === c.ch && !c.gone);
        if (c.bub) el.querySelector('.bub-n').textContent = Math.max(0, c.bn);
        el.classList.toggle('free', !c.gone && E().isFree(st, i) && !blocked);
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
      this.renderCombo();
      const gm = $('#gMoves');
      gm.hidden = !st.limit;
      if (st.limit) {
        const left = Math.max(0, st.limit - st.moves);
        gm.innerHTML = `Zbývá tahů <b>${left}</b>`;
        gm.classList.toggle('low', left <= 5);
      }
      const bs = $('#boss');
      if (bs && st.kraken) {
        const every = E().KRAKEN_EVERY, n = every - (st.moves % every);
        bs.querySelector('.boss-n').textContent = st.khp > 0 ? n : '💤';
        bs.querySelector('.khp').innerHTML = Array.from({ length: E().KRAKEN_HP }, (_, k) => `<i class="${k < st.khp ? 'on' : ''}"></i>`).join('');
        bs.classList.toggle('hungry', st.khp > 0 && n === 1);
        bs.classList.toggle('beaten', st.khp <= 0);
      } else if (bs) {
        const every = E().BOSS_EVERY, n = every - ((st.draws || 0) % every);
        bs.querySelector('.boss-n').textContent = n;
        bs.classList.toggle('hungry', n === 1 && E().stockLeft(st) > 1);
      }
      const gt = $('#gTide');
      if (gt) {
        const hi = E().tideHigh(st), n = E().tideIn(st);
        gt.className = 'g-tide' + (hi ? ' high' : n === 1 ? ' soon' : '');
        gt.innerHTML = hi ? `🌊 Příliv · odliv za <b>${n}</b>` : `🏖️ Odliv · příliv za <b>${n}</b>`;
      }
      CD.Music.intensity(st.streak >= 10 ? 2 : st.streak >= 5 ? 1 : 0);
      const proj = st.plus ? 1 : E().stockLeft(st) >= def.t3 ? 3 : E().stockLeft(st) >= def.t2 ? 2 : 1;
      $('#gStars').innerHTML = CD.UI.starsHTML(proj, 3);
      document.querySelectorAll('.boost[data-b]').forEach(b => {
        const t = b.dataset.b;
        if (t === 'hint') return;
        const cnt = d.boosters[t] || 0;
        b.querySelector('.bcount').innerHTML = cnt > 0 ? `${cnt}` : `${CD.UI.icon('coin')}${PRICES[t]}`;
        b.classList.toggle('paid', cnt <= 0);
      });
      $('#gSound').innerHTML = CD.UI.icon(d.settings.sound || d.settings.music ? 'sound' : 'mute');
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

    fly(fromRect, card, flip, cls = '') {
      this.flights++;
      const to = $('#waste').getBoundingClientRect();
      const toRect = { left: to.left, top: to.top, width: to.width, height: to.height };
      return CD.UI.flyCard(fromRect, toRect, card, { flip, cls }).then(() => {
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
        const why = E().blockReason(st, i);
        if (why && E().isFree(st, i)) {
          this.shake(el);
          CD.Sound.play('bad');
          const c = st.cards[i];
          const n = why === 'ice' ? c.ice : why === 'tide' ? E().tideIn(st) : c.bn;
          CD.UI.toast(BLOCK_MSG[why].replace('{n}', n).replace('{t}', tahy(n)).replace('{c}', c.bub === 1 ? 'červené ♥♦' : 'černé ♠♣'));
          if (why === 'chainwait') { const p = st.cards.findIndex(d => d.ch === st.chainWait && !d.gone); if (p >= 0) this.pulse(p, 'chain-call', 900); }
        }
        else if (E().isFree(st, i)) { this.shake(el); CD.Sound.play('bad'); }
        return;
      }
      this.pushUndo();
      const from = el.getBoundingClientRect();
      const tideWas = E().tideHigh(st);
      const ev = E().play(st, i);
      el.classList.add('gone');
      const tier = comboTier(st.streak);
      this.fly(from, st.waste[st.waste.length - 1], false, tier >= 2 ? `hot t${tier}` : '');
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
      this.obstacleFx(ev, from);
      this.stormFx(ev, from);
      this.tideFx(tideWas);
      this.renderCards();
      this.renderHud();
      this.comboFx(st.streak, from);
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
      const had = st.streak, tideWas = E().tideHigh(st);
      const c = E().draw(st);
      this.renderStock();
      this.fly(from, c, true);
      CD.Sound.play('draw');
      if (st.lastEaten) this.sharkBite(from, st.lastEaten);
      if (st.lastSwap) this.swirlFx(st.lastSwap);
      if (st.lastTent >= 0) this.tentFx(st.lastTent);
      this.tideFx(tideWas);
      if (st.lastSwap) setTimeout(() => this.renderCards(), 450); else this.renderCards();
      this.renderStock();
      this.renderHud();
      if (had >= 3) this.comboBreak(had);
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

    /* ---------- překážky ---------- */
    pulse(j, cls, ms = 800) {
      const el = this.els[j];
      el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls);
      setTimeout(() => el.classList.remove(cls), ms);
    },
    obstacleFx(ev, from) {
      ev.inkCleared.forEach(j => this.pulse(j, 'ink-clear'));
      if (ev.inkCleared.length) setTimeout(() => CD.Sound.play('splash'), 90);
      ev.iceHit.forEach(j => this.pulse(j, ev.iceFreed.includes(j) ? 'ice-break' : 'ice-hit'));
      if (ev.iceFreed.length) setTimeout(() => CD.Sound.play('iceBreak'), 90);
      else if (ev.iceHit.length) setTimeout(() => CD.Sound.play('ice'), 90);
      ev.bubHit.forEach(j => this.pulse(j, ev.bubPopped.includes(j) ? 'bub-pop' : 'bub-hit'));
      if (ev.bubPopped.length) setTimeout(() => CD.Sound.play('pop', ev.bubPopped.length), 120);
      else if (ev.bubHit.length) setTimeout(() => CD.Sound.play('bubHit'), 100);
      if (ev.shellsOpened.length) {
        ev.shellsOpened.forEach(j => this.pulse(j, 'shell-open', 1000));
        setTimeout(() => CD.Sound.play('shell'), 150);
        const r = this.els[ev.shellsOpened[0]].getBoundingClientRect();
        CD.UI.float(r.left + r.width / 2, r.top, 'Mušle se otevřela!', 'info');
      }
      if (ev.pearl) {
        this.st.pearlsWon = (this.st.pearlsWon || 0) + 1;
        CD.UI.float(from.left + from.width / 2, from.top - 30, `+1 ${CD.UI.icon('pearl')} +40 ${CD.UI.icon('coin')}`, 'coin big');
        setTimeout(() => CD.Sound.play('coin'), 200);
      }
    },
    /* ---------- Bouřlivá hladina ---------- */
    stormFx(ev, from) {
      const st = this.st, cx = from.left + from.width / 2;
      if (ev.tentCleared.length) { ev.tentCleared.forEach(j => this.pulse(j, 'tent-free', 700)); setTimeout(() => CD.Sound.play('splash'), 80); }
      if (ev.chainStart >= 0) { CD.Sound.play('chain'); this.pulse(ev.chainStart, 'chain-call', 900); CD.UI.float(cx, from.top - 20, 'Teď druhou kartu na řetězu!', 'info'); }
      if (ev.chainDone) { setTimeout(() => CD.Sound.play('chainDone'), 100); CD.UI.float(cx, from.top - 20, `Řetěz! +20 ${CD.UI.icon('coin')}`, 'coin big'); }
      if (ev.bottle) {
        const [name, ico] = LOOT[ev.bottle];
        setTimeout(() => CD.Sound.play('bottle'), 140);
        CD.UI.float(cx, from.top - 34, `🍾 ${CD.UI.icon(ico)} ${name}`, 'coin big');
      }
      if (ev.bolted.length) {
        CD.Sound.play('thunder');
        const b = $('#board'); b.classList.remove('thunder'); void b.offsetWidth; b.classList.add('thunder');
        setTimeout(() => b.classList.remove('thunder'), 700);
        ev.bolted.forEach(j => this.pulse(j, 'bolt-flash', 700));
      }
      if (ev.krakenHit) {
        setTimeout(() => CD.Sound.play('krakenHit'), 150);
        const bs = $('#boss');
        if (bs) { bs.classList.remove('hit'); void bs.offsetWidth; bs.classList.add('hit'); }
        CD.UI.banner(st.khp > 0 ? `Zásah! ${ev.krakenHit}/${E().KRAKEN_HP}<small>Kraken +30 mincí</small>` : 'Kraken uplaval!<small>Už žádná chapadla</small>');
      }
      if (ev.tent >= 0) this.tentFx(ev.tent);
    },
    tentFx(j) { setTimeout(() => { CD.Sound.play('tentacle'); this.pulse(j, 'tent-grab', 900); this.renderCards(); }, 260); },
    swirlFx([a, b]) {
      CD.Sound.play('swirl');
      [a, b].forEach(j => this.pulse(j, 'swirl', 900));
      const r = this.els[a].getBoundingClientRect();
      CD.UI.float(r.left + r.width / 2, r.top, '🌀 Vír!', 'info');
    },
    tideFx(was) {
      const st = this.st;
      if (!st.tide) return;
      const now = E().tideHigh(st);
      if (now === was) return;
      CD.Sound.play(now ? 'wave' : 'ebb');
      const b = $('#board');
      b.classList.remove('tide-in', 'tide-out'); void b.offsetWidth; b.classList.add(now ? 'tide-in' : 'tide-out');
      setTimeout(() => b.classList.remove('tide-in', 'tide-out'), 1000);
      CD.UI.toast(now ? '🌊 Příliv! Spodní karty jsou pod vodou.' : '🏖️ Odliv – karty jsou zase volné.', 1600);
    },
    /* lahve se vzkazem: odměna se připíše na konci hry (tah zpět ji tak nemůže zdvojit) */
    creditLoot() {
      const st = this.st, d = CD.Store.data, got = {};
      (st.loot || []).forEach(k => { if (k === 'pearl') d.pearls++; else d.boosters[k]++; got[k] = (got[k] || 0) + 1; });
      st.loot = [];
      const parts = Object.entries(got).map(([k, n]) => `${n}× ${CD.UI.icon(LOOT[k][1])}`);
      return parts.length ? `🍾 Lahve se vzkazem: ${parts.join(' ')}` : '';
    },
    sharkBite(from, card) {
      const b = $('#boss');
      if (!b) return;
      const to = b.getBoundingClientRect();
      setTimeout(() => {
        CD.UI.flyCard(from, { left: to.left + to.width * 0.1, top: to.top, width: to.width * 0.45, height: to.width * 0.63 }, card, { duration: 420, cls: 'eaten' });
        setTimeout(() => {
          b.classList.remove('bite'); void b.offsetWidth; b.classList.add('bite');
          CD.Sound.play('chomp');
          CD.UI.float(to.left + to.width / 2, to.top - 10, 'Ham!', 'info');
          this.renderHud();
        }, 380);
      }, 320);
    },

    /* ---------- efekty série (combo) ---------- */
    renderCombo() {
      const el = $('#combo');
      if (!el) return;
      const n = this.st.streak;
      el.className = `combo t${comboTier(n)}${n >= 2 ? ' on' : ''}`;
      el.querySelector('b').textContent = '×' + n;
    },

    comboFx(n, from) {
      const tier = comboTier(n), fx = $('#fx');
      const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
      // počítadlo poskočí, lišta série pulzne
      const c = $('#combo');
      if (c && n >= 2) { c.classList.remove('pop'); void c.offsetWidth; c.classList.add('pop'); }
      const sb = $('#gStreak');
      sb.classList.remove('bump'); void sb.offsetWidth; sb.classList.add('bump');
      if (reduced) { if (COMBO_WORDS[n]) this.callout(COMBO_WORDS[n], tier); return; }
      // bublinky z místa odehrané karty
      const cx = from.left + from.width / 2, cy = from.top + from.height / 2;
      const count = Math.min(4 + n, 16);
      for (let k = 0; k < count; k++) {
        const b = document.createElement('i');
        const a = Math.random() * Math.PI * 2, dist = 30 + Math.random() * (40 + tier * 18);
        b.className = 'cbub' + (tier >= 2 && k % 3 === 0 ? ` spark t${tier}` : '');
        const sz = 5 + Math.random() * (8 + tier * 2);
        Object.assign(b.style, { left: cx + 'px', top: cy + 'px', width: sz + 'px', height: sz + 'px' });
        b.style.setProperty('--dx', Math.cos(a) * dist + 'px');
        b.style.setProperty('--dy', (Math.sin(a) * dist - 40 - Math.random() * 40) + 'px');
        b.style.animationDelay = (Math.random() * 0.08) + 's';
        fx.appendChild(b);
        setTimeout(() => b.remove(), 1100);
      }
      // vlnka kolem odkládací hromádky
      if (tier >= 1) {
        const w = this.wasteRect(), r = document.createElement('i');
        r.className = `cripple t${tier}`;
        Object.assign(r.style, { left: (w.left + w.width / 2) + 'px', top: (w.top + w.height / 2) + 'px', width: w.width * 1.1 + 'px', height: w.width * 1.1 + 'px' });
        fx.appendChild(r);
        setTimeout(() => r.remove(), 750);
      }
      // pochvala při milnících série
      const word = COMBO_WORDS[n] || (n > 25 && n % 5 === 0 ? 'Úžasné!' : '');
      if (word) {
        this.callout(word, tier);
        setTimeout(() => CD.Sound.play('combo', Math.min(5, tier + (n >= 20 ? 1 : 0))), 60);
        if (n >= 5) {
          const g = document.createElement('div');
          g.className = `combo-glow t${tier}`;
          fx.appendChild(g);
          setTimeout(() => g.remove(), 1200);
        }
        if (n >= 10) this.fishRush(tier);
      }
    },

    callout(text, tier) {
      document.querySelectorAll('#fx .callout').forEach(o => o.remove());   // nová pochvala nahradí starou
      const w = this.wasteRect(), e = document.createElement('div');
      e.className = `callout t${tier}`;
      e.textContent = text;
      e.style.top = Math.max(80, w.top - (matchMedia('(max-width: 600px) and (orientation: portrait)').matches ? 90 : 135)) + 'px';
      $('#fx').appendChild(e);
      setTimeout(() => e.remove(), 1400);
    },

    fishRush(tier) {
      const e = document.createElement('div');
      const cols = [['#ffd166', '#ff8a3d'], ['#7fe7ff', '#2f8fe0'], ['#ff9ec7', '#e04a8a'], ['#b8ff8a', '#3fae5a']];
      const [c1, c2] = cols[(tier + Math.floor(Math.random() * 4)) % cols.length];
      e.className = 'fish-rush';
      e.style.top = (22 + Math.random() * 30) + '%';
      e.innerHTML = `<svg viewBox="-40 -40 260 160">${CD.Art.school(0, 0, 1, c1, c2, false, 6)}</svg>`;
      $('#fx').appendChild(e);
      setTimeout(() => e.remove(), 2600);
    },

    comboBreak(n) {
      const c = $('#combo');
      if (!c) return;
      const r = c.getBoundingClientRect();
      CD.UI.float(r.left + r.width / 2, r.top, `×${n}`, 'combo-end');
      CD.Sound.play('comboEnd');
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
      if (E().limitReached(st)) { this.lose('limit'); return; }
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

    lose(reason) {
      const st = this.st, d = CD.Store.data;
      this.ended = true;
      clearTimeout(this.idleT);
      d.coins += st.coinsWon;
      d.pearls += st.pearlsWon || 0;
      const loot = this.creditLoot();
      d.run = null;
      CD.Store.save();
      CD.Sound.play('lose');
      const title = st.mode === 'daily' ? 'Denní výzva' : `Level ${st.level}`;
      const m = CD.UI.modal({ title, closable: false, cls: 'm-lose', html: `
<div class="lose-ico">🐢💧</div>
<p class="m-text big">${reason === 'limit' ? 'Došly ti tahy!' : 'Tentokrát to nevyšlo.'}</p>
${reason === 'limit' ? `<p class="m-text">Ve výzvě máš jen <b>${st.limit}</b> tahů. Zkus delší série a méně líznutí.</p>` : ''}
<p class="m-text">Mince ze série si necháváš: <b>+${st.coinsWon}</b> ${CD.UI.icon('coin')}${st.pearlsWon ? ` a perly z mušlí: <b>+${st.pearlsWon}</b> ${CD.UI.icon('pearl')}` : ''}</p>
${loot ? `<div class="win-note">${loot}</div>` : ''}
<div class="m-btns"><button class="btn btn-blue" data-home>Domů</button><button class="btn btn-green" data-retry>Zkusit znovu</button></div>` });
      m.el.querySelector('[data-home]').addEventListener('click', () => { m.close(true); CD.Home.open(); });
      m.el.querySelector('[data-retry]').addEventListener('click', () => { m.close(true); this.start(st.level, { resume: false, mode: st.mode }); });
    },

    win() {
      const st = this.st, d = CD.Store.data, n = st.level, def = this.def, mode = st.mode || '';
      this.ended = true;
      clearTimeout(this.idleT); clearTimeout(this.stuckT);
      const stars = E().stars(st), rem = E().stockLeft(st);
      const base = mode === 'daily' ? 150 : 40 + Math.min(n, 100) * 4, stockBonus = rem * 15, total = base + stockBonus + st.coinsWon;
      let gained = 0, pearls = st.pearlsWon || 0;
      const pearlNotes = [];
      if (pearls) pearlNotes.push(CD.Shop.addPearls(pearls, 'Perly z mušlí'));
      if (!mode) {
        const prev = d.best[n] || 0;
        if (stars === 3 && prev < 3) pearlNotes.push(CD.Shop.addPearls(1, 'První 3 ★ v levelu'));
        if (def.boss && !prev) pearlNotes.push(CD.Shop.addPearls(5, 'Poražený boss'));
        if (!prev && (n === 50 || n === 100 || n === CD.Levels.COUNT)) pearlNotes.push(CD.Shop.addPearls(10, 'Dohraný svět'));
        gained = Math.max(0, stars - prev);
        d.best[n] = Math.max(prev, stars);
        d.stars += gained;
        d.unlocked = Math.max(d.unlocked, n + 1);
        if (def.boss === true) d.stats.boss = (d.stats.boss || 0) + 1;
        if (def.boss === 'kraken' && !prev) d.stats.kraken = (d.stats.kraken || 0) + 1;
      }
      d.coins += total;
      d.run = null;
      d.stats.wins++;
      d.stats.bestStreak = Math.max(d.stats.bestStreak, st.maxStreak);
      d.stats.obst = (d.stats.obst || 0) + (st.obst || 0);
      // odměny meta-vrstvy: denní kalendář, výzva, nálepky
      const notes = [];
      if (mode === 'daily') {
        const fresh = !CD.Meta.dailyDone();
        notes.push(CD.Meta.dailyWin());
        if (fresh) pearlNotes.push(CD.Shop.addPearls(2, 'Denní výzva'));
      }
      if (mode === 'challenge') notes.push(CD.Meta.challengeWin(n));
      const drop = CD.Meta.stickerDrop(def.boss && !mode ? 1 : mode === 'daily' ? 0.5 : stars === 3 ? 0.3 : 0.12);
      if (drop) notes.push(drop);
      notes.push(...pearlNotes);
      const loot = this.creditLoot();
      if (loot) notes.push(loot);
      const banked = CD.Shop.fillBank(total);
      if (banked) notes.push(`🐷 Do kasičky: +${banked} ${CD.UI.icon('coin')}${d.bank >= CD.Shop.BANK_CAP ? ' – kasička je plná, rozbij ji v Obchodě!' : ''}`);
      CD.Store.save();
      CD.Sound.play('win');
      CD.UI.confetti();
      // zbylé karty z balíčku odletí jako bonus
      $('#stock').querySelectorAll('.sc').forEach((c, k) => setTimeout(() => {
        const r = c.getBoundingClientRect();
        c.classList.add('fly-off');
        CD.UI.float(r.left + r.width / 2, r.top, `+15`, 'coin');
      }, 200 + k * 90));

      const worldEnd = !mode && n === 50, world2End = !mode && n === 100, last = !mode && n >= CD.Levels.COUNT;
      const sc = CD.Scenes.SCENES[d.scene], next = sc.tasks[d.tasks[d.scene]];
      const head = mode === 'daily' ? 'Denní výzva splněna!' : mode === 'challenge' ? `Výzva levelu ${n} splněna!` : `Level ${n} dokončen`;
      const m = CD.UI.modal({ title: def.boss === 'kraken' && !mode ? 'Kraken zahnán!' : def.boss && !mode ? 'Žralok poražen!' : 'Výborně!', closable: false, cls: 'm-win', html: `
<div class="win-title">${head}</div>
<div class="win-stars">${[0, 1, 2].map(i => `<svg class="wst ${i < stars ? 'on' : 'off'}" style="animation-delay:${0.35 + i * 0.3}s"><use href="#i-star"/></svg>`).join('')}</div>
<div class="win-lines">
  <div><span>Odměna za ${mode === 'daily' ? 'výzvu' : 'level'}</span><b>+${base}</b></div>
  <div><span>Zbylé karty (${rem} × 15)</span><b>+${stockBonus}</b></div>
  <div><span>Série a bonusy</span><b>+${st.coinsWon}</b></div>
  <div class="tot"><span>Celkem</span><b>+${CD.UI.fmt(total)} ${CD.UI.icon('coin')}</b></div>
</div>
${mode ? '' : `<div class="win-gain">${gained ? `+${gained} ${CD.UI.icon('star', 'st on')} do scény` : stars < 3 ? 'Zkus level zopakovat a získat víc hvězd!' : 'Perfektní výsledek!'}${st.maxStreak >= 5 ? ` · nejdelší série ${st.maxStreak}` : ''}</div>`}
${notes.map(t => `<div class="win-note">${t}</div>`).join('')}
${worldEnd ? '<p class="m-text">🌊 Svět Korálové sny je dohraný! Otevírá se nový svět <b>Hlubiny</b> s těžšími levely.</p>' : ''}
${world2End ? '<p class="m-text">🦈 Hlubiny jsou dohrané! Tóňa plave k hladině – otevírá se svět <b>Bouřlivá hladina</b>.</p>' : ''}
${last ? `<p class="m-text">Dohrál(a) jsi všech ${CD.Levels.COUNT} levelů a zahnal(a) Krakena! Jsi pán(í) moří! 🐢🎉</p>` : ''}
<div class="m-btns"><button class="btn btn-blue" data-home>${!mode && next && d.stars >= next.cost ? 'Splnit úkol' : 'Domů'}</button>${mode || last ? '' : `<button class="btn btn-green" data-next>Další level</button>`}</div>` });
      [0, 1, 2].forEach(i => { if (i < stars) setTimeout(() => CD.Sound.play('star', i), 350 + i * 300); });
      m.el.querySelector('[data-home]').addEventListener('click', () => { m.close(true); CD.Home.open(); });
      const nb = m.el.querySelector('[data-next]');
      if (nb) nb.addEventListener('click', () => { m.close(true); this.start(n + 1, { resume: false }); });
      setTimeout(() => CD.Meta.checkAchievements(), 1800);
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
      else if (st.cards.some(c => c.ink) && !d.tips.ink) { key = 'ink'; text = 'Nové: inkoust chobotnice! Kartu pod inkoustem smyje karta, kterou zahraješ hned vedle ní.'; }
      else if (st.cards.some(c => c.ice) && !d.tips.ice) { key = 'ice'; text = 'Nové: led! Zamrzlou kartu roztají dvě karty zahrané hned vedle ní.'; }
      else if (st.cards.some(c => c.bub) && !d.tips.bub) { key = 'bub'; text = 'Nové: bubliny! Bublina s ♥ praskne po zahrání 2 červených karet, bublina s ♠ po 2 černých.'; }
      else if (st.cards.some(c => c.shell) && !d.tips.shell) { key = 'shell'; text = 'Nové: perlová mušle! Otevře se, když budeš mít sérii 5 karet. Uvnitř je perla za 40 mincí.'; }
      else if (st.tide && !d.tips.tide) { key = 'tide'; text = 'Nové: příliv! Karty s vlnkou jsou v některých tazích pod vodou a nejdou zahrát. Nahoře vidíš, kdy přijde příliv a odliv.'; }
      else if (st.cards.some(c => c.ch) && !d.tips.chain) { key = 'chain'; text = 'Nové: kotva s řetězem! Dvě karty se stejnou kotvou musíš zahrát hned po sobě – nejdřív ale musí být obě odkryté.'; }
      else if (st.cards.some(c => c.bottle) && !d.tips.bottle) { key = 'bottle'; text = 'Nové: láhev se vzkazem! Zahraj kartu s lahví a na konci levelu dostaneš pomocníka nebo perlu.'; }
      else if (st.cards.some(c => c.bolt) && !d.tips.bolt) { key = 'bolt'; text = 'Nové: blesk! Karta s bleskem po zahrání otočí všechny karty kolem sebe – uvidíš, co skrývají.'; }
      else if (st.vortex && !d.tips.vortex) { key = 'vortex'; text = 'Nové: vír! Po každém 4. líznutí prohodí dvě volné karty na stole. Dívej se pozorně!'; }
      else if (st.limit && !d.tips.limit) { key = 'limit'; text = 'Výzva: máš omezený počet tahů (nahoře). Každé zahrání i líznutí je jeden tah.'; }
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
