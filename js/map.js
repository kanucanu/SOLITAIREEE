/* =========================================================================
   Korálové sny – mapa levelů 1–50 (čím hlouběji, tím těžší)
   ========================================================================= */
(function (root) {
  'use strict';
  const CD = root.CD = root.CD || {};
  const { $ } = CD.UI;
  const SP = 118;        // svislá vzdálenost uzlů
  const CH_GAP = 96;     // místo pro nadpis kapitoly
  const TOP = 150;

  const M = {
    pts: [],
    open(focus) {
      CD.UI.show('map');
      this.build();
      const d = CD.Store.data;
      const target = focus || Math.min(d.run ? d.run.level : d.unlocked, CD.Levels.COUNT);
      const p = this.pts[target - 1];
      const sc = $('#mapScroll');
      sc.scrollTop = Math.max(0, p.y - sc.clientHeight / 2);
    },

    posFor(n, W) {
      const ch = Math.floor((n - 1) / 10);
      const amp = Math.min(W * 0.27, 170);
      return { x: W / 2 + Math.sin((n - 1) * 0.85) * amp, y: TOP + (n - 1) * SP + ch * CH_GAP };
    },

    build() {
      const d = CD.Store.data, sc = $('#mapScroll'), inner = $('#mapInner');
      const W = sc.clientWidth || innerWidth;
      this.pts = [];
      for (let n = 1; n <= CD.Levels.COUNT; n++) this.pts.push(this.posFor(n, W));
      const H = this.pts[this.pts.length - 1].y + 200;
      inner.style.height = H + 'px';

      // cestička mezi uzly
      let path = `M${this.pts[0].x} ${this.pts[0].y}`;
      for (let i = 1; i < this.pts.length; i++) {
        const a = this.pts[i - 1], b = this.pts[i];
        path += ` C${a.x} ${a.y + SP * 0.5} ${b.x} ${b.y - SP * 0.5} ${b.x} ${b.y}`;
      }
      const doneIdx = Math.min(d.unlocked, CD.Levels.COUNT) - 1;
      let pathDone = `M${this.pts[0].x} ${this.pts[0].y}`;
      for (let i = 1; i <= doneIdx; i++) {
        const a = this.pts[i - 1], b = this.pts[i];
        pathDone += ` C${a.x} ${a.y + SP * 0.5} ${b.x} ${b.y - SP * 0.5} ${b.x} ${b.y}`;
      }
      let html = `<svg class="map-path" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><path d="${path}" class="mp-all"/><path d="${pathDone}" class="mp-done"/></svg>`;

      // dekorace podél okrajů
      const R = CD.Art.rng(7);
      for (let i = 0; i < 26; i++) {
        const left = i % 2 === 0, y = 160 + i * (H - 300) / 26 + R() * 60;
        const h = 60 + R() * 90, c = ['#2fae6b', '#46c47d', '#ff7eb6', '#ffb36b', '#b48cff'][i % 5];
        html += `<svg class="map-deco" style="${left ? 'left' : 'right'}:${(R() * 6).toFixed(0)}px;top:${y.toFixed(0)}px" width="70" height="${(h + 10).toFixed(0)}" viewBox="-35 ${(-h - 5).toFixed(0)} 70 ${(h + 10).toFixed(0)}">${i % 3 === 2 ? CD.Art.coral(0, 0, h / 150, c, '#fff6') : CD.Art.seaweed(0, 0, h, c, -i * 0.5, 9)}</svg>`;
      }

      // nadpisy kapitol
      CD.Levels.CHAPTERS.forEach((name, ch) => {
        const y = this.pts[ch * 10].y - 92;
        const unlocked = d.unlocked > ch * 10;
        html += `<div class="chapter ${unlocked ? '' : 'locked'}" style="top:${y}px"><small>Kapitola ${ch + 1}</small>${name}</div>`;
      });

      // uzly levelů
      this.pts.forEach((p, i) => {
        const n = i + 1, best = d.best[n] || 0;
        const state = n > d.unlocked ? 'locked' : best ? 'done' : 'current';
        const running = d.run && d.run.level === n;
        html += `<button class="node ${state}${running ? ' running' : ''}" data-n="${n}" style="left:${p.x}px;top:${p.y}px" aria-label="Level ${n}">
<span class="num">${state === 'locked' ? CD.UI.icon('lock') : n}</span>${state !== 'locked' ? CD.UI.starsHTML(best, 3, 'nstars') : ''}</button>`;
      });
      inner.innerHTML = html;
      inner.querySelectorAll('.node').forEach(b => b.addEventListener('click', () => this.openLevel(+b.dataset.n)));
    },

    preview(lay, open) {
      const cw = 20, ch = 28, gx = 10.6;
      const W = lay.maxX * gx + cw, H = lay.maxY * ch / 2 + ch;
      const rects = lay.slots.map(s => {
        const free = !s.coveredBy.length;
        return `<rect x="${(s.x * gx).toFixed(1)}" y="${s.y * ch / 2}" width="${cw}" height="${ch}" rx="3" class="${free || open ? 'pv-up' : 'pv-down'}"/>`;
      }).join('');
      return `<svg class="lv-preview" viewBox="-2 -2 ${W + 4} ${H + 4}">${rects}</svg>`;
    },

    openLevel(n) {
      CD.Sound.play('click');
      const d = CD.Store.data;
      if (n > d.unlocked) { CD.Sound.play('bad'); CD.UI.toast(`Nejdřív dohraj level ${d.unlocked}.`); return; }
      const def = CD.Levels.get(n), best = d.best[n] || 0;
      const running = d.run && d.run.level === n;
      const m = CD.UI.modal({ title: `Level ${n}`, cls: 'm-level', html: `
<div class="lv-chapter">Kapitola ${def.chapter + 1} · ${CD.Levels.CHAPTERS[def.chapter]} · <i>${def.name}</i></div>
${CD.UI.starsHTML(best, 3, 'lv-stars')}
${this.preview(def.lay, def.open)}
<div class="lv-info">
  <span>Karet na stole <b>${def.N}</b></span>
  <span>V balíčku <b>${def.stockSize - 1}</b></span>
  ${def.locks ? `<span>${CD.UI.icon('lock')} Zámky <b>${def.locks}</b></span>` : ''}
</div>
<div class="lv-goal">${CD.UI.icon('star', 'st on')} 3 hvězdy = zbude aspoň <b>${def.t3}</b> karet v balíčku · 2 hvězdy = aspoň <b>${def.t2}</b></div>
<div class="m-btns">${running ? `<button class="btn btn-orange" data-new>Začít znovu</button><button class="btn btn-green" data-go>Pokračovat</button>` : `<button class="btn btn-green btn-lg" data-go>Hrát</button>`}</div>` });
      m.el.querySelector('[data-go]').addEventListener('click', () => { m.close(true); CD.Game.start(n, { resume: true }); });
      const nb = m.el.querySelector('[data-new]');
      if (nb) nb.addEventListener('click', () => { m.close(true); CD.Game.start(n, { resume: false }); });
    },
  };

  CD.Map = M;
})(typeof window !== 'undefined' ? window : globalThis);
