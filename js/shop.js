/* =========================================================================
   Korálové sny – Perlový obchod
   Dvě měny: mince (běžná, za hraní) a perly (vzácná – mušle, 3★, bossové,
   úspěchy, kalendář, truhly… a volitelně nákup přes CD.Pay).
   Obchod: Nabídky (denní dárek, denní nabídka, startovní balíček, kasička),
   Pomocníci, Vzhled (rubové strany karet, stoly) a Perly.
   ========================================================================= */
(function (root) {
  'use strict';
  const CD = root.CD = root.CD || {};
  const data = () => CD.Store.data;
  const today = () => CD.Levels.dayNumber();
  const ico = (n, c) => CD.UI.icon(n, c);
  const fmt = n => CD.UI.fmt(n);

  const PRICES = { wild: 250, undo: 60, shuffle: 120 };   // cena pomocníka v mincích (i ve hře)
  const PEARL_VALUE = 100;                                // 1 perla ≈ 100 mincí (pro výpočet slev)
  const BOOST_NAMES = { wild: 'Žolík', undo: 'Zpět', shuffle: 'Zamíchat' };

  const BACKS = [
    { id: 'classic', name: 'Mořská vlna', cost: 0 },
    { id: 'coral', name: 'Korálová', cost: 20 },
    { id: 'star', name: 'Hvězdice', cost: 25 },
    { id: 'jelly', name: 'Medúza', cost: 30 },
    { id: 'deep', name: 'Hlubiny', cost: 40 },
    { id: 'lighthouse', name: 'Maják', cost: 45 },
    { id: 'gold', name: 'Zlatá perla', cost: 60 },
  ];
  const TABLES = [
    { id: 'reef', name: 'Útes', cost: 0 },
    { id: 'lagoon', name: 'Laguna', cost: 25 },
    { id: 'kelp', name: 'Chaluhový les', cost: 30 },
    { id: 'sunset', name: 'Západ slunce', cost: 40 },
    { id: 'beach', name: 'Pláž při západu', cost: 45 },
    { id: 'night', name: 'Noční moře', cost: 50 },
  ];
  const DEALS = [
    { name: 'Balíček žolíků', ico: '✨', get: { wild: 3 }, cost: { coins: 550 } },
    { name: 'Záchranná sada', ico: '🛟', get: { undo: 5, shuffle: 2 }, cost: { coins: 400 } },
    { name: 'Perlový poklad', ico: '💰', get: { coins: 1500 }, cost: { pearls: 12 } },
    { name: 'Mix pomocníků', ico: '🎒', get: { wild: 1, undo: 3, shuffle: 1 }, cost: { coins: 420 } },
    { name: 'Perly z trhu', ico: '🦪', get: { pearls: 3 }, cost: { coins: 450 } },
    { name: 'Velký žolíkový den', ico: '🌟', get: { wild: 5 }, cost: { pearls: 9 } },
  ];
  const STARTER = { get: { wild: 3, undo: 3, shuffle: 2, coins: 1000 }, cost: { pearls: 9 } };
  const BIG_PACK = { get: { wild: 5, undo: 10, shuffle: 5 }, cost: { pearls: 18 } };
  const EXCHANGE = [{ pearls: 10, coins: 1100 }, { pearls: 25, coins: 3000 }, { pearls: 60, coins: 7800 }];
  const BANK_CAP = 2500, BANK_MIN = 400, BANK_PRICE = 10, BANK_RATE = 0.25;

  const worth = g => (g.coins || 0) + (g.pearls || 0) * PEARL_VALUE + ['wild', 'undo', 'shuffle'].reduce((a, k) => a + (g[k] || 0) * PRICES[k], 0);
  const costCoins = c => (c.coins || 0) + (c.pearls || 0) * PEARL_VALUE;
  const discount = o => Math.round((1 - costCoins(o.cost) / worth(o.get)) * 100);
  const getText = g => [g.coins && `${fmt(g.coins)} ${ico('coin')}`, g.pearls && `${g.pearls} ${ico('pearl')}`,
    ...['wild', 'undo', 'shuffle'].filter(k => g[k]).map(k => `${g[k]}× ${ico(k)}`)].filter(Boolean).join(' + ');
  const priceText = c => c.pearls ? `${c.pearls} ${ico('pearl')}` : `${fmt(c.coins)} ${ico('coin')}`;
  const backHTML = id => `<div class="sh-back"><div class="cf back bk-${id}"></div></div>`;
  const tableHTML = id => `<div class="sh-table tb-${id}"><i></i><i></i><i></i></div>`;

  const S = {
    PRICES, BACKS, TABLES, BANK_CAP,
    tab: 'deals', m: null,

    /* ---------- peněženka ---------- */
    canPay(c) { const d = data(); return d.coins >= (c.coins || 0) && d.pearls >= (c.pearls || 0); },
    pay(c) {
      const d = data();
      if (!this.canPay(c)) {
        CD.Sound.play('bad');
        CD.UI.toast(c.pearls && d.pearls < c.pearls ? 'Nemáš dost perel.' : 'Nemáš dost mincí.');
        if (c.pearls && d.pearls < c.pearls && this.m) this.show('pearls');
        return false;
      }
      d.coins -= c.coins || 0; d.pearls -= c.pearls || 0;
      return true;
    },
    give(g) {
      const d = data();
      d.coins += g.coins || 0; d.pearls += g.pearls || 0;
      ['wild', 'undo', 'shuffle'].forEach(k => { d.boosters[k] += g[k] || 0; });
    },
    /* perly z hraní – vrací text pro okno výhry */
    addPearls(n, why) {
      if (!n) return '';
      data().pearls += n;
      return `${ico('pearl')} ${why}: <b>+${n}</b> ${n === 1 ? 'perla' : n < 5 ? 'perly' : 'perel'}`;
    },
    /* kasička se plní z výher; vrací přidanou částku */
    fillBank(total) {
      const d = data(), add = Math.max(0, Math.min(BANK_CAP - d.bank, Math.round(total * BANK_RATE)));
      d.bank += add;
      return add;
    },

    /* ---------- vzhled ---------- */
    applyLook() {
      const d = data();
      document.body.dataset.back = d.look.back;
      document.body.dataset.table = d.look.table;
    },

    /* ---------- stav nabídek ---------- */
    giftReady() { return data().shop.gift !== today(); },
    giftToday() { return today() % 3 === 2 ? { pearls: 1 } : { coins: 75 }; },
    dealToday() { return DEALS[((today() % DEALS.length) + DEALS.length) % DEALS.length]; },
    dealDone() { return data().shop.deal === today(); },
    badge() { return this.giftReady() || (data().bank >= BANK_CAP && data().pearls >= BANK_PRICE); },

    /* ---------- okno obchodu ---------- */
    open(tab) {
      CD.Sound.play('click');
      this.tab = tab || this.tab || 'deals';
      this.m = CD.UI.modal({ title: 'Perlový obchod', cls: 'm-wide m-shop', html: '<div class="sh-root"></div>', onClose: () => { this.m = null; CD.Home && CD.Home.updateHud && CD.UI.current === 'home' && CD.Home.updateHud(); } });
      this.render();
    },
    show(tab) { this.tab = tab; this.render(); },
    refresh() { if (this.m) this.render(); CD.UI.updateWallet(); if (CD.UI.current === 'home') CD.Home.updateHud(); },

    render() {
      if (!this.m) return;
      const d = data(), el = this.m.body.querySelector('.sh-root');
      const tabs = [['deals', '🎁', 'Nabídky'], ['boost', '✨', 'Pomocníci'], ['look', '🎨', 'Vzhled'], ['pearls', '🦪', 'Perly']];
      el.innerHTML = `
<div class="sh-wallet"><span>${ico('coin')} <b>${fmt(d.coins)}</b></span><span>${ico('pearl')} <b>${fmt(d.pearls)}</b></span></div>
<div class="sh-tabs">${tabs.map(([k, e, n]) => `<button class="sh-tab ${this.tab === k ? 'on' : ''}" data-tab="${k}"><span class="emo">${e}</span>${n}${k === 'deals' && this.badge() ? '<i class="dot"></i>' : ''}</button>`).join('')}</div>
<div class="sh-page">${this['page_' + this.tab]()}</div>`;
      el.querySelectorAll('[data-tab]').forEach(b => b.addEventListener('click', () => { CD.Sound.play('click'); this.show(b.dataset.tab); }));
      el.querySelectorAll('[data-buy]').forEach(b => b.addEventListener('click', () => this.action(b.dataset.buy, b)));
    },

    item({ ico: icon, name, desc, btn, act, disabled, tag, cls = '' }) {
      return `<div class="sh-item ${cls}">${tag ? `<span class="sh-tag">${tag}</span>` : ''}<div class="sh-ico">${icon}</div>
<div class="sh-txt"><b>${name}</b><small>${desc}</small></div>
<button class="btn ${disabled ? 'btn-gray' : 'btn-green'} sh-btn" data-buy="${act}" ${disabled ? 'disabled' : ''}>${btn}</button></div>`;
    },

    page_deals() {
      const d = data(), gift = this.giftToday(), deal = this.dealToday(), dd = this.dealDone();
      const left = new Date(); left.setHours(24, 0, 0, 0);
      const h = Math.floor((left - Date.now()) / 3600000), mi = Math.floor((left - Date.now()) / 60000) % 60;
      const disc = discount(deal);
      const bankPct = Math.round(d.bank / BANK_CAP * 100), bankOk = d.bank >= BANK_MIN;
      return `
${this.item({ ico: '<span class="emo">🎁</span>', name: 'Denní dárek', desc: this.giftReady() ? `Zdarma: ${getText(gift)}` : `Další dárek za ${h} h ${mi} min`, btn: this.giftReady() ? 'Vzít zdarma' : 'Vyzvednuto ✓', act: 'gift', disabled: !this.giftReady(), cls: this.giftReady() ? 'glow' : '' })}
${this.item({ ico: `<span class="emo">${deal.ico}</span>`, name: `Nabídka dne: ${deal.name}`, desc: `${getText(deal.get)} · končí za ${h} h ${mi} min`, btn: dd ? 'Koupeno ✓' : priceText(deal.cost), act: 'deal', disabled: dd, tag: disc > 0 && !dd ? `−${disc} %` : '' })}
${d.shop.starter ? '' : this.item({ ico: '<span class="emo">🐢</span>', name: 'Startovní balíček', desc: `Jen jednou! ${getText(STARTER.get)}`, btn: priceText(STARTER.cost), act: 'starter', tag: `−${discount(STARTER)} %`, cls: 'gold' })}
<div class="sh-item sh-bank">
  <div class="sh-ico"><span class="emo">🐷</span></div>
  <div class="sh-txt"><b>Perlová kasička</b><small>Každá výhra sem přidá čtvrtinu mincí navíc. Rozbij ji za ${BANK_PRICE} ${ico('pearl')}${d.bank >= BANK_CAP ? ' – je plná!' : ` (od ${BANK_MIN} mincí)`}.</small>
    <div class="ach-bar"><i style="width:${bankPct}%"></i><span>${fmt(d.bank)} / ${fmt(BANK_CAP)}</span></div></div>
  <button class="btn ${bankOk ? 'btn-orange' : 'btn-gray'} sh-btn" data-buy="bank" ${bankOk ? '' : 'disabled'}>Rozbít · ${BANK_PRICE} ${ico('pearl')}</button>
</div>`;
    },

    page_boost() {
      const d = data();
      const rows = ['wild', 'undo', 'shuffle'].map(k => `
<div class="sh-item"><div class="sh-ico boost-ico ${k}">${ico(k)}</div>
  <div class="sh-txt"><b>${BOOST_NAMES[k]}</b><small>Máš ${d.boosters[k]}×</small></div>
  <div class="sh-btns"><button class="btn btn-blue sh-btn" data-buy="b1-${k}">1× · ${PRICES[k]} ${ico('coin')}</button>
  <button class="btn btn-green sh-btn" data-buy="b5-${k}">5× · ${fmt(PRICES[k] * 4)} ${ico('coin')}</button></div></div>`).join('');
      return `<p class="sh-hint">Balení po 5 kusech má slevu 20 %.</p>${rows}
${this.item({ ico: '<span class="emo">🎒</span>', name: 'Velký balík pomocníků', desc: getText(BIG_PACK.get), btn: priceText(BIG_PACK.cost), act: 'bigpack', tag: `−${discount(BIG_PACK)} %` })}`;
    },

    page_look() {
      const d = data();
      const card = (it, kind) => {
        const own = d.owned[kind].includes(it.id), on = d.look[kind] === it.id;
        return `<button class="sh-look ${on ? 'on' : ''}" data-buy="${kind}-${it.id}">${kind === 'back' ? backHTML(it.id) : tableHTML(it.id)}
<b>${it.name}</b><span>${on ? 'Používáš ✓' : own ? 'Použít' : `${it.cost} ${ico('pearl')}`}</span></button>`;
      };
      return `<h4 class="sh-h">Rub karet</h4><div class="sh-looks">${BACKS.map(b => card(b, 'back')).join('')}</div>
<h4 class="sh-h">Hrací stůl</h4><div class="sh-looks">${TABLES.map(t => card(t, 'table')).join('')}</div>
<p class="sh-hint">Vzhled je jen pro radost – na obtížnost nemá vliv.</p>`;
    },

    page_pearls() {
      const d = data(), P = CD.Pay;
      const packs = P && P.enabled() ? `<h4 class="sh-h">Koupit perly${P.test() ? ' <span class="sh-test">TESTOVACÍ REŽIM</span>' : ''}</h4>
<div class="sh-packs">${P.PACKS.map(p => `<button class="sh-pack ${p.best ? 'best' : ''}" data-buy="pack-${p.id}">${p.best ? '<span class="sh-tag">Nejvýhodnější</span>' : ''}
<span class="emo">${p.ico}</span><b>${p.pearls} ${ico('pearl')}</b><small>${p.name}${P.bonus(p) > 0 ? ` · +${P.bonus(p)} %` : ''}</small><span class="sh-price">${p.price}</span></button>`).join('')}</div>
<p class="sh-hint">Nákup je dobrovolný – celá hra jde dohrát zdarma. Platbu potvrzuje dospělý.</p>` : '';
      return `${packs}
<h4 class="sh-h">Vyměnit perly za mince</h4>
<div class="sh-ex">${EXCHANGE.map((x, i) => `<button class="sh-exb" data-buy="ex-${i}" ${d.pearls < x.pearls ? 'disabled' : ''}><b>${x.pearls} ${ico('pearl')}</b><span>→</span><b>${fmt(x.coins)} ${ico('coin')}</b></button>`).join('')}</div>
<h4 class="sh-h">Jak získat perly zdarma</h4>
<ul class="sh-earn">
  <li><span class="emo">🐚</span>Perla z otevřené mušle v Hlubinách: +1</li>
  <li><span class="emo">⭐</span>První 3 ★ v levelu: +1</li>
  <li><span class="emo">🦈</span>Poražený boss: +5 · dohraný svět: +10</li>
  <li><span class="emo">📅</span>Denní výzva: +2 (7. den kalendáře +5 navíc)</li>
  <li><span class="emo">🏆</span>Úspěchy, výzvy na tahy, kompletní sady nálepek a truhly ve scénách</li>
  <li><span class="emo">🎁</span>Denní dárek v obchodě (každý 3. den perla)</li>
</ul>`;
    },

    /* ---------- akce ---------- */
    done(msg, el) {
      CD.Store.save();
      CD.Sound.play('coin');
      if (el) { const r = el.getBoundingClientRect(); CD.UI.float(r.left + r.width / 2, r.top, msg, 'coin big'); }
      this.refresh();
    },
    action(a, el) {
      const d = data();
      if (a === 'gift') {
        if (!this.giftReady()) return;
        const g = this.giftToday(); d.shop.gift = today(); this.give(g); return this.done(`+${getText(g)}`, el);
      }
      if (a === 'deal') {
        if (this.dealDone()) return;
        const o = this.dealToday(); if (!this.pay(o.cost)) return;
        d.shop.deal = today(); this.give(o.get); return this.done(`+${getText(o.get)}`, el);
      }
      if (a === 'starter') {
        if (d.shop.starter || !this.pay(STARTER.cost)) return;
        d.shop.starter = true; this.give(STARTER.get); CD.UI.confetti(24); return this.done('Startovní balíček!', el);
      }
      if (a === 'bank') {
        if (d.bank < BANK_MIN || !this.pay({ pearls: BANK_PRICE })) return;
        const got = d.bank; d.bank = 0; d.coins += got;
        CD.Sound.play('shell'); CD.UI.confetti(30);
        return this.done(`+${fmt(got)} ${ico('coin')}`, el);
      }
      if (a === 'bigpack') { if (!this.pay(BIG_PACK.cost)) return; this.give(BIG_PACK.get); return this.done(`+${getText(BIG_PACK.get)}`, el); }
      let m = a.match(/^b([15])-(wild|undo|shuffle)$/);
      if (m) {
        const n = +m[1], k = m[2], cost = { coins: PRICES[k] * (n === 5 ? 4 : 1) };
        if (!this.pay(cost)) return;
        d.boosters[k] += n; return this.done(`+${n}× ${ico(k)}`, el);
      }
      m = a.match(/^(back|table)-(\w+)$/);
      if (m) {
        const kind = m[1], it = (kind === 'back' ? BACKS : TABLES).find(x => x.id === m[2]);
        if (!it) return;
        if (!d.owned[kind].includes(it.id)) {
          if (!this.pay({ pearls: it.cost })) return;
          d.owned[kind].push(it.id);
          CD.Sound.play('sticker');
        } else CD.Sound.play('click');
        d.look[kind] = it.id;
        this.applyLook();
        CD.Store.save(); this.refresh();
        return;
      }
      m = a.match(/^ex-(\d)$/);
      if (m) { const x = EXCHANGE[+m[1]]; if (!this.pay({ pearls: x.pearls })) return; d.coins += x.coins; return this.done(`+${fmt(x.coins)} ${ico('coin')}`, el); }
      m = a.match(/^pack-(\w+)$/);
      if (m && CD.Pay) CD.Pay.buy(m[1]);
    },
  };

  CD.Shop = S;
})(typeof window !== 'undefined' ? window : globalThis);
