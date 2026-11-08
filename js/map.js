/* =========================================================================
   Korálové sny – mapa levelů 1–150 ve třech světech (čím dál, tím těžší)
   ========================================================================= */
(function (root) {
  'use strict';
  const CD = root.CD = root.CD || {};
  const { $ } = CD.UI;
  const SP = 118;        // svislá vzdálenost uzlů
  const CH_GAP = 96;     // místo pro nadpis kapitoly
  const TOP = 150;
  const WORLD_GAP = 170; // místo pro předěl mezi světy

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
      return { x: W / 2 + Math.sin((n - 1) * 0.85) * amp, y: TOP + (n - 1) * SP + ch * CH_GAP + (n > 50 ? WORLD_GAP : 0) + (n > 100 ? WORLD_GAP : 0) };
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
      // svět Hlubiny má tmavší pozadí
      const deepY = this.pts[50].y - CH_GAP - WORLD_GAP + 20;
      const surfY = this.pts[100] ? this.pts[100].y - CH_GAP - WORLD_GAP + 20 : H;
      html = `<div class="map-deep" style="top:${deepY}px;height:${surfY - deepY}px"></div>` +
        (this.pts[100] ? `<div class="map-surface" style="top:${surfY}px;height:${H - surfY}px"></div>` : '') + html;
      html += `<div class="world-banner" style="top:${deepY + 30}px"><small>Svět 2</small>🌊 Hlubiny<span>${d.unlocked > 50 ? 'Těžší levely s novými překážkami' : 'Odemkne se po levelu 50'}</span></div>`;
      if (this.pts[100]) html += `<div class="world-banner surface" style="top:${surfY + 30}px"><small>Svět 3</small>⛈️ Bouřlivá hladina<span>${d.unlocked > 100 ? 'Příliv, řetězy, blesky, víry a Kraken' : 'Odemkne se po levelu 100'}</span></div>`;
      for (let i = 0; i < 52; i++) {
        const left = i % 2 === 0, y = 160 + i * (H - 300) / 52 + R() * 60;
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
        const running = d.run && d.run.level === n && !(d.run.state && d.run.state.mode);
        const def = CD.Levels.get(n);
        html += `<button class="node ${state}${running ? ' running' : ''}${def.boss ? ' boss-node' : ''}${n > 100 ? ' surface' : n > 50 ? ' deep' : ''}" data-n="${n}" style="left:${p.x}px;top:${p.y}px" aria-label="Level ${n}">
<span class="num">${state === 'locked' ? CD.UI.icon('lock') : n}</span>${state !== 'locked' ? CD.UI.starsHTML(best, 3, 'nstars') : ''}${def.boss ? `<span class="node-boss">${def.boss === 'kraken' ? '🐙' : '🦈'}</span>` : ''}${d.chal[n] ? '<span class="node-crown">🏆</span>' : ''}</button>`;
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
      const running = d.run && d.run.level === n && !(d.run.state && d.run.state.mode);
      const OB = { ink: '🖤 Inkoust', ice: '🧊 Led', bub: '🫧 Bubliny', shell: '🐚 Mušle', tide: '🌊 Příliv', chain: '⛓️ Řetězy', bottle: '🍾 Lahve', bolt: '⚡ Blesky' };
      const m = CD.UI.modal({ title: `Level ${n}`, cls: 'm-level', html: `
<div class="lv-chapter">Kapitola ${def.chapter + 1} · ${CD.Levels.CHAPTERS[def.chapter]} · <i>${def.name}</i></div>
${CD.UI.starsHTML(best, 3, 'lv-stars')}
${this.preview(def.lay, def.open)}
<div class="lv-info">
  <span>Karet na stole <b>${def.N}</b></span>
  <span>V balíčku <b>${def.stockSize - 1}</b></span>
  ${def.locks ? `<span>${CD.UI.icon('lock')} Zámky <b>${def.locks}</b></span>` : ''}
  ${Object.keys(OB).filter(k => def[k]).map(k => `<span>${OB[k]} <b>${def[k]}</b></span>`).join('')}
  ${def.vortex ? '<span>🌀 <b>Vír</b></span>' : ''}
  ${def.boss ? `<span>${def.boss === 'kraken' ? '🐙 <b>Boss Kraken</b>' : '🦈 <b>Boss</b>'}</span>` : ''}
</div>
<div class="lv-goal">${CD.UI.icon('star', 'st on')} 3 hvězdy = zbude aspoň <b>${def.t3}</b> karet v balíčku · 2 hvězdy = aspoň <b>${def.t2}</b></div>
<div class="m-btns">${running ? `<button class="btn btn-orange" data-new>Začít znovu</button><button class="btn btn-green" data-go>Pokračovat</button>` : `<button class="btn btn-green btn-lg" data-go>Hrát</button>`}</div>
${best ? `<div class="chal-box"><b>🏆 Výzva na tahy</b><span>${d.chal[n] ? 'Splněno! Můžeš ji hrát znovu.' : 'Dohraj level s omezeným počtem tahů · odměna 100 mincí'}</span><button class="btn btn-orange" data-chal>Hrát výzvu</button></div>` : ''}` });
      m.el.querySelector('[data-go]').addEventListener('click', () => { m.close(true); CD.Game.start(n, { resume: true }); });
      const cb = m.el.querySelector('[data-chal]');
      if (cb) cb.addEventListener('click', () => { m.close(true); CD.Game.start(n, { resume: true, mode: 'challenge' }); });
      const nb = m.el.querySelector('[data-new]');
      if (nb) nb.addEventListener('click', () => { m.close(true); CD.Game.start(n, { resume: false }); });
    },
  };

  CD.Map = M;
})(typeof window !== 'undefined' ? window : globalThis);
