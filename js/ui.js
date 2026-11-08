/* =========================================================================
   Korálové sny – společné UI: obrazovky, modální okna, efekty, karty
   ========================================================================= */
(function (root) {
  'use strict';
  const CD = root.CD = root.CD || {};
  const $ = (s, el = document) => el.querySelector(s);

  const UI = {
    $,
    current: 'title',
    icon: (name, cls = '') => `<svg class="ico ${cls}" aria-hidden="true"><use href="#i-${name}"/></svg>`,
    fmt: n => Math.floor(n).toLocaleString('cs-CZ'),
    esc: s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])),

    show(name) {
      document.querySelectorAll('.screen').forEach(s => s.classList.toggle('active', s.id === 'scr-' + name));
      this.current = name;
      document.body.dataset.screen = name;
      this.updateWallet();
      if (CD.Music) CD.Music.forScreen(name);     // hudba podle prostředí
    },

    updateWallet() {
      const d = CD.Store.data;
      const extra = (this.current === 'game' && CD.Game.st && !CD.Game.ended) ? CD.Game.st.coinsWon : 0;
      document.querySelectorAll('.coins-val').forEach(e => { e.textContent = UI.fmt(d.coins + extra); });
      document.querySelectorAll('.stars-val').forEach(e => { e.textContent = UI.fmt(d.stars); });
    },

    /* ---------- karty ---------- */
    rankLabel: r => CD.Engine.RANKS[r],
    cardFace(c) {
      if (c.w) return `<div class="cf front wild"><svg class="wild-star"><use href="#i-wild"/></svg><span class="wild-txt">ŽOLÍK</span></div>`;
      const suit = CD.Engine.SUITS[c.s], r = CD.Engine.RANKS[c.r];
      return `<div class="cf front ${c.s < 2 ? 'red' : 'black'}${r === '10' ? ' ten' : ''}"><div class="corner"><span>${r}</span><svg><use href="#s-${suit}"/></svg></div><div class="cbig">${r}</div><svg class="csuit"><use href="#s-${suit}"/></svg></div>`;
    },
    cardInner(c) { return `<div class="ci">${this.cardFace(c)}<div class="cf back"></div></div>`; },
    starsHTML(n, max = 3, cls = '') {
      let s = `<span class="stars ${cls}">`;
      for (let i = 0; i < max; i++) s += `<svg class="st ${i < n ? 'on' : 'off'}"><use href="#i-star"/></svg>`;
      return s + '</span>';
    },

    /* ---------- modální okna ---------- */
    modal({ title = '', html = '', cls = '', closable = true, onClose = null } = {}) {
      const wrap = document.createElement('div');
      wrap.className = 'modal-wrap';
      wrap.innerHTML = `<div class="modal ${cls}" role="dialog" aria-modal="true">${title ? `<div class="ribbon"><span>${title}</span></div>` : ''}${closable ? `<button class="close-x" aria-label="Zavřít">${UI.icon('close')}</button>` : ''}<div class="modal-body scrollable">${html}</div></div>`;
      $('#modals').appendChild(wrap);
      requestAnimationFrame(() => wrap.classList.add('in'));
      let closed = false;
      const api = {
        el: wrap, body: $('.modal-body', wrap),
        close(silent) {
          if (closed) return; closed = true;
          wrap.classList.remove('in'); wrap.classList.add('out');
          setTimeout(() => wrap.remove(), 220);
          if (onClose && !silent) onClose();
        },
      };
      if (closable) {
        $('.close-x', wrap).addEventListener('click', () => { CD.Sound.play('click'); api.close(); });
        wrap.addEventListener('click', e => { if (e.target === wrap) api.close(); });
      }
      return api;
    },
    hasModal() { return !!document.querySelector('#modals .modal-wrap:not(.out)'); },
    closeAllModals() { document.querySelectorAll('#modals .modal-wrap').forEach(w => w.remove()); },
    confirm(title, text, okLabel = 'Ano', cancelLabel = 'Zpět', okCls = 'btn-green') {
      return new Promise(res => {
        const m = UI.modal({ title, html: `<p class="m-text">${text}</p><div class="m-btns"><button class="btn btn-gray" data-r="0">${cancelLabel}</button><button class="btn ${okCls}" data-r="1">${okLabel}</button></div>`, onClose: () => res(false) });
        m.el.querySelectorAll('[data-r]').forEach(b => b.addEventListener('click', () => { CD.Sound.play('click'); m.close(true); res(b.dataset.r === '1'); }));
      });
    },

    /* ---------- efekty ---------- */
    toast(text, ms = 2200) {
      const t = $('#toast');
      t.textContent = text;
      t.classList.add('show');
      clearTimeout(this._toastT);
      this._toastT = setTimeout(() => t.classList.remove('show'), ms);
    },
    float(x, y, html, cls = '') {
      const e = document.createElement('div');
      e.className = 'floater ' + cls;
      e.innerHTML = html;
      e.style.left = x + 'px'; e.style.top = y + 'px';
      $('#fx').appendChild(e);
      setTimeout(() => e.remove(), 1300);
    },
    banner(html, cls = '') {
      const e = document.createElement('div');
      e.className = 'banner ' + cls;
      e.innerHTML = html;
      $('#fx').appendChild(e);
      setTimeout(() => e.remove(), 1700);
    },
    confetti(n = 46) {
      const cols = ['#ffd166', '#ff6f91', '#5ee7df', '#b39dff', '#7be38a', '#ffffff'];
      for (let i = 0; i < n; i++) {
        const e = document.createElement('div');
        e.className = 'confetti' + (i % 3 === 0 ? ' round' : '');
        e.style.left = (Math.random() * 100) + 'vw';
        e.style.background = cols[i % cols.length];
        e.style.animationDelay = (Math.random() * 0.6) + 's';
        e.style.animationDuration = (1.8 + Math.random() * 1.4) + 's';
        e.style.setProperty('--dx', (Math.random() * 160 - 80) + 'px');
        $('#fx').appendChild(e);
        setTimeout(() => e.remove(), 3800);
      }
    },
    /* přelet karty z jednoho místa na druhé */
    flyCard(fromRect, toRect, card, { flip = false, duration = 260, cls = '' } = {}) {
      const el = document.createElement('div');
      el.className = 'card flyer' + (flip ? ' down' : '') + (cls ? ' ' + cls : '');
      el.innerHTML = this.cardInner(card);
      Object.assign(el.style, { left: toRect.left + 'px', top: toRect.top + 'px', width: toRect.width + 'px', height: toRect.height + 'px', fontSize: toRect.width + 'px' });
      $('#fx').appendChild(el);
      const sx = fromRect.width / toRect.width;
      const anim = el.animate([
        { transform: `translate(${fromRect.left - toRect.left}px, ${fromRect.top - toRect.top}px) scale(${sx})` },
        { transform: 'translate(0,0) scale(1)' },
      ], { duration, easing: 'cubic-bezier(.3,.7,.35,1)' });
      if (flip) requestAnimationFrame(() => requestAnimationFrame(() => el.classList.remove('down')));
      return new Promise(res => {
        const done = () => { el.remove(); res(); };
        anim.onfinish = done;
        setTimeout(done, duration + 300);
      });
    },

    /* ---------- společná okna ---------- */
    help() {
      UI.modal({ title: 'Jak hrát', cls: 'm-wide', html: `
<div class="help">
  <div class="help-row"><div class="help-ico">🃏</div><p><b>Odklízej karty ze stolu.</b> Klepni na odkrytou kartu, která je o <b>1 vyšší nebo nižší</b> než karta na odkládací hromádce dole. Na 7 můžeš dát 6 nebo 8. <b>Král a eso na sebe navazují</b> (K → A → 2).</p></div>
  <div class="help-row"><div class="help-ico">🂠</div><p>Když nemáš tah, klepni na <b>balíček</b> a lízni si novou kartu. Líznutí ale přeruší sérii.</p></div>
  <div class="help-row"><div class="help-ico">🔥</div><p>Hraj karty za sebou bez líznutí a sbírej <b>sérii</b> – každá 7. karta v řadě dává bonusové mince.</p></div>
  <div class="help-row"><div class="help-ico">🔒</div><p>Karta se <b>zámkem</b> se uvolní, až odehraješ kartu s <b>klíčem</b> stejné barvy.</p></div>
  <div class="help-row"><div class="help-ico">⭐</div><p>Čím víc karet ti na konci zůstane v balíčku, tím víc <b>hvězdiček</b> (1–3). Hvězdičkami plníš úkoly ve scénách a opravuješ podmořské království.</p></div>
  <div class="help-row"><div class="help-ico">✨</div><p><b>Pomocníci:</b> Žolík (pasuje na cokoliv), Zpět (vrátí tah), Zamíchat (přeskládá karty na stole), Nápověda (zdarma). Když dojdou karty, můžeš si za mince dokoupit +5 karet.</p></div>
  <div class="help-row"><div class="help-ico">💾</div><p>Postup se <b>ukládá automaticky</b> v tomto prohlížeči – i rozehraný level.</p></div>
</div><div class="m-btns"><button class="btn btn-green" data-close>Rozumím</button></div>` })
        .el.querySelector('[data-close]').addEventListener('click', () => UI.closeAllModals());
    },

    settings() {
      const d = CD.Store.data;
      const m = UI.modal({ title: 'Nastavení', html: `
<div class="set-list">
  <label class="set-row"><span>${UI.icon('music')} Hudba</span><input type="checkbox" data-s="music" ${d.settings.music ? 'checked' : ''}><i class="tgl"></i></label>
  <label class="set-row"><span>${UI.icon('sound')} Zvuky</span><input type="checkbox" data-s="sound" ${d.settings.sound ? 'checked' : ''}><i class="tgl"></i></label>
  <label class="set-row"><span>${UI.icon('bulb')} Automatická nápověda</span><input type="checkbox" data-s="hints" ${d.settings.hints ? 'checked' : ''}><i class="tgl"></i></label>
</div>
<div class="m-btns col">
  <button class="btn btn-blue" data-a="help">Jak hrát</button>
  <button class="btn btn-blue" data-a="title">Hlavní menu</button>
  <button class="btn btn-red" data-a="reset">Smazat postup</button>
</div>
<p class="m-small">${CD.Store.ok ? 'Postup se ukládá automaticky do tohoto prohlížeče.' : '⚠️ Prohlížeč nepovoluje ukládání (soukromý režim?). Postup se neuloží.'}<br>Odehráno levelů: ${d.stats.played} · výher: ${d.stats.wins} · nejdelší série: ${d.stats.bestStreak}</p>` });
      m.el.querySelectorAll('[data-s]').forEach(inp => inp.addEventListener('change', () => {
        d.settings[inp.dataset.s] = inp.checked;
        CD.Store.save();
        CD.Sound.unlock(); CD.Sound.play('click');
        CD.Music.refresh();
        if (CD.Game.st) CD.Game.renderHud();
      }));
      m.el.querySelector('[data-a="help"]').addEventListener('click', () => { m.close(); UI.help(); });
      m.el.querySelector('[data-a="title"]').addEventListener('click', () => { UI.closeAllModals(); CD.Main.openTitle(); });
      m.el.querySelector('[data-a="reset"]').addEventListener('click', async () => {
        m.close();
        if (!await UI.confirm('Smazat postup?', 'Opravdu smazat všechny levely, hvězdičky, mince i opravené scény? Tohle nejde vrátit.', 'Smazat', 'Ne', 'btn-red')) return;
        if (!await UI.confirm('Určitě?', 'Poslední šance – celý postup bude smazán.', 'Ano, smazat', 'Nechat', 'btn-red')) return;
        CD.Store.reset();
        UI.closeAllModals();
        CD.Main.openTitle();
        UI.toast('Postup byl smazán. Hodně štěstí!');
      });
    },
  };

  CD.UI = UI;
})(typeof window !== 'undefined' ? window : globalThis);
