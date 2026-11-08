/* =========================================================================
   Korálové sny – napojení na skutečné platby (nákup perel)
   -------------------------------------------------------------------------
   Ve výchozím stavu je VYPNUTO (provider: 'none') – v obchodě se pak balíčky
   perel za peníze vůbec nezobrazí a hra je celá zdarma.

   Zapnutí přes Stripe Payment Links (bez vlastního serveru):
     1. Na dashboard.stripe.com vytvoř 3 produkty (Payment Links) s cenami níže.
     2. U každého odkazu nastav „Po platbě → Přesměrovat na web":
          https://kanucanu.github.io/SOLITAIREEE/?koupeno=perly_s&sid={CHECKOUT_SESSION_ID}
        (u dalších balíčků perly_m / perly_l).
     3. Odkazy vlož do stripeLinks a nastav provider: 'stripe'.
   Pozn.: hra nemá server, takže připsání perel ověřuje jen klient (sid se
   nedá použít dvakrát). Pro hru jednoho hráče to stačí; přísné ověření by
   vyžadovalo malý server (např. Cloudflare Worker) s webhookem Stripe.

   Testovací režim (bez placení): otevři hru s ?obchod=test (vypnutí ?obchod=off).
   ========================================================================= */
(function (root) {
  'use strict';
  const CD = root.CD = root.CD || {};

  CD.PayConfig = {
    provider: 'none',                     // 'none' | 'stripe'
    stripeLinks: { perly_s: '', perly_m: '', perly_l: '' },
  };

  // balíčky perel za skutečné peníze (ceny se zobrazují, účtuje je platební brána)
  const PACKS = [
    { id: 'perly_s', pearls: 40, price: '49 Kč', kc: 49, name: 'Hrst perel', ico: '🦪' },
    { id: 'perly_m', pearls: 110, price: '119 Kč', kc: 119, name: 'Perlový váček', ico: '👝' },
    { id: 'perly_l', pearls: 260, price: '229 Kč', kc: 229, name: 'Truhla perel', ico: '🧰', best: true },
  ];
  const TEST_KEY = 'koraloveSny.shopTest';

  const Pay = {
    PACKS,
    test() { try { return localStorage.getItem(TEST_KEY) === '1'; } catch (e) { return false; } },
    enabled() {
      const c = CD.PayConfig;
      return this.test() || (c.provider === 'stripe' && PACKS.every(p => /^https:\/\//.test(c.stripeLinks[p.id] || '')));
    },
    bonus(p) { const base = PACKS[0].pearls / PACKS[0].kc; return Math.round((p.pearls / p.kc / base - 1) * 100); },

    /* rodičovská pojistka před placením – hru hrají i děti */
    gate() {
      return new Promise(res => {
        const a = 6 + Math.floor(Math.random() * 4), b = 6 + Math.floor(Math.random() * 4);
        const opts = [a * b, a * b + a, a * b - b, a * b + 10].sort(() => Math.random() - 0.5);
        const m = CD.UI.modal({ title: 'Pro rodiče', html: `
<p class="m-text">Nákup za skutečné peníze. Požádej rodiče, ať vyřeší příklad:</p>
<p class="m-text big">${a} × ${b} = ?</p>
<div class="m-btns">${opts.map(o => `<button class="btn btn-blue" data-v="${o}">${o}</button>`).join('')}</div>`, onClose: () => res(false) });
        m.el.querySelectorAll('[data-v]').forEach(btn => btn.addEventListener('click', () => {
          m.close(true);
          const ok = +btn.dataset.v === a * b;
          if (!ok) CD.UI.toast('To nebylo správně.');
          res(ok);
        }));
      });
    },

    async buy(id) {
      const p = PACKS.find(x => x.id === id);
      if (!p || !this.enabled()) return;
      if (!await this.gate()) return;
      if (this.test()) {
        const ok = await CD.UI.confirm('Testovací nákup', `Testovací režim – nic se neplatí. Připsat ${p.pearls} perel?`, 'Připsat', 'Zrušit');
        if (ok) this.credit(p, 'test-' + Date.now());
        return;
      }
      const ref = 'ks-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
      location.href = CD.PayConfig.stripeLinks[id] + '?client_reference_id=' + encodeURIComponent(ref);
    },

    credit(p, sid) {
      const d = CD.Store.data;
      if (d.purchases.includes(sid)) return false;
      d.purchases.push(sid);
      d.pearls += p.pearls;
      d.stats.bought = (d.stats.bought || 0) + 1;
      CD.Store.save();
      CD.UI.updateWallet();
      CD.Sound.play('win');
      CD.UI.confetti(30);
      CD.UI.modal({ title: 'Děkujeme!', html: `<p class="m-text big">${p.ico} ${p.name}</p><p class="m-text">Připsáno <b>+${p.pearls}</b> ${CD.UI.icon('pearl')} perel. Díky, že podporuješ Korálové sny! 🐢💙</p>` });
      if (CD.Shop) CD.Shop.refresh();
      return true;
    },

    /* volá se při spuštění: návrat z platební brány a přepínání testovacího režimu */
    checkUrl() {
      let q;
      try { q = new URLSearchParams(location.search); } catch (e) { return; }
      if (!q.toString()) return;
      try {
        if (q.get('obchod') === 'test') localStorage.setItem(TEST_KEY, '1');
        if (q.get('obchod') === 'off') localStorage.removeItem(TEST_KEY);
      } catch (e) { /* bez úložiště */ }
      const p = PACKS.find(x => x.id === q.get('koupeno')), sid = q.get('sid') || '';
      if (p && /^cs_[A-Za-z0-9_]{8,}$/.test(sid)) setTimeout(() => this.credit(p, sid), 600);
      try { history.replaceState(null, '', location.pathname + location.hash); } catch (e) { /* ignore */ }
    },
  };

  CD.Pay = Pay;
})(typeof window !== 'undefined' ? window : globalThis);
