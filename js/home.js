/* =========================================================================
   Korálové sny – domovská obrazovka = dekorační scéna s úkoly
   ========================================================================= */
(function (root) {
  'use strict';
  const CD = root.CD = root.CD || {};
  const { $ } = CD.UI;
  const BONUS_MS = 20 * 60 * 1000;   // bonus každých 20 minut
  const BONUS_COINS = 60;

  const TIPS = [
    'Klepni na zelené tlačítko vpravo dole a zahraj si další level!',
    'Za hvězdičky z levelů plníš úkoly. Klepni na Úkoly vlevo dole.',
    'Král a eso na sebe navazují. Na krále můžeš dát eso!',
    'Dlouhá série karet bez líznutí = bonusové mince!',
    'Zkus nejdřív odkrývat karty, které jsou otočené rubem nahoru.',
    'Když se ti nedaří, žolík pasuje úplně na všechno.',
    'Hvězdičky navíc získáš i opakováním levelu s lepším výsledkem.',
  ];

  const H = {
    svg: null,
    timer: 0,

    open() {
      CD.UI.show('home');
      this.render();
      clearInterval(this.timer);
      this.timer = setInterval(() => { if (CD.UI.current === 'home') this.updateBonus(); }, 1000);
      const d = CD.Store.data;
      if (d.tasks[d.scene] >= 6 && !d.chests[d.scene]) setTimeout(() => this.claimChest(), 500);
      else this.greet();
    },

    render() {
      const d = CD.Store.data, idx = d.scene, sc = CD.Scenes.SCENES[idx];
      $('#homeScene').innerHTML = CD.Scenes.render(idx, d.tasks[idx]);
      this.svg = $('#homeScene svg');
      this.fit();
      $('#homeTitle').innerHTML = `<small>Scéna ${idx + 1}</small>${sc.name}`;
      this.updateHud();
    },
    fit() { CD.Scenes.fit(this.svg, innerWidth, innerHeight); },

    nextLevel() {
      const d = CD.Store.data;
      if (d.run && d.run.level) return d.run.level;
      return d.unlocked;
    },

    updateHud() {
      const d = CD.Store.data, idx = d.scene, sc = CD.Scenes.SCENES[idx];
      const done = d.tasks[idx], next = sc.tasks[done];
      CD.UI.updateWallet();
      $('#tasksBtn').innerHTML = `<div class="tb-ico">${CD.Art.chestIcon()}</div><div class="tb-txt"><b>Úkoly</b><div class="tb-bar"><i style="width:${(done / 6) * 100}%"></i><span>${done}/6</span></div></div>${next && d.stars >= next.cost ? '<span class="badge-red">!</span>' : ''}`;
      const lvl = this.nextLevel();
      $('#playBtn').innerHTML = lvl > CD.Levels.COUNT ? `<span>Vše</span><b>hotovo</b>` : `<span>${d.run && d.run.level ? 'Pokračovat' : 'Level'}</span><b>${lvl}</b>`;
      this.updateBonus();
    },

    updateBonus() {
      const d = CD.Store.data, left = d.bonusAt - Date.now(), b = $('#bonusBtn');
      if (!b) return;
      if (left <= 0) { b.classList.add('ready'); b.querySelector('.bn-t').textContent = 'Vyzvedni!'; }
      else {
        b.classList.remove('ready');
        const m = Math.floor(left / 60000), s = Math.floor(left / 1000) % 60;
        b.querySelector('.bn-t').textContent = `${m}:${String(s).padStart(2, '0')}`;
      }
    },

    bonus() {
      const d = CD.Store.data;
      if (Date.now() < d.bonusAt) { CD.UI.toast('Bonus ještě není připravený. Zkus to za chvíli!'); return; }
      d.coins += BONUS_COINS;
      d.bonusAt = Date.now() + BONUS_MS;
      CD.Store.save();
      const r = $('#bonusBtn').getBoundingClientRect();
      CD.UI.float(r.left + r.width / 2, r.top, `+${BONUS_COINS} ${CD.UI.icon('coin')}`, 'coin big');
      CD.Sound.play('coin');
      this.updateHud();
    },

    /* ---------- průvodkyně Tóňa ---------- */
    say(text, ms = 6000) {
      const b = $('#guideBubble');
      b.textContent = text;
      b.classList.add('show');
      clearTimeout(this._sayT);
      this._sayT = setTimeout(() => b.classList.remove('show'), ms);
    },
    greet() {
      const d = CD.Store.data;
      if (!d.introSeen.includes(d.scene)) {
        d.introSeen.push(d.scene); CD.Store.save();
        this.say(CD.Scenes.SCENES[d.scene].intro, 9000);
      } else if (d.tasks[d.scene] < 6) {
        const next = CD.Scenes.SCENES[d.scene].tasks[d.tasks[d.scene]];
        this.say(d.stars >= next.cost ? `Máš dost hvězdiček na úkol „${next.name}"! Klepni na Úkoly.` : TIPS[Math.floor(Math.random() * TIPS.length)], 6000);
      }
    },
    tapGuide() {
      CD.Sound.play('click');
      this.say(TIPS[Math.floor(Math.random() * TIPS.length)], 5000);
    },

    /* ---------- úkoly ---------- */
    openTasks() {
      CD.Sound.play('click');
      const d = CD.Store.data, idx = d.scene, sc = CD.Scenes.SCENES[idx], done = d.tasks[idx];
      const rows = sc.tasks.map((t, i) => {
        const state = i < done ? 'done' : i === done ? 'next' : 'locked';
        let right;
        if (state === 'done') right = `<div class="t-check">${CD.UI.icon('check')}</div>`;
        else if (state === 'next') right = `<button class="btn ${d.stars >= t.cost ? 'btn-green' : 'btn-gray'} t-btn" data-task="${i}">${CD.UI.icon('star', 'st on')}<span>${t.cost}</span></button>`;
        else right = `<div class="t-lock">${CD.UI.icon('lock')}<span>${t.cost}</span></div>`;
        return `<div class="task ${state}"><div class="t-ico">${t.icon}</div><div class="t-name">${t.name}</div>${right}</div>`;
      }).join('');
      const next = sc.tasks[done];
      const hint = next ? (d.stars >= next.cost ? `Máš ${d.stars} ★ – můžeš splnit další úkol!` : `Chybí ti ${next.cost - d.stars} ★. Získáš je dohráním levelů.`) : 'Všechny úkoly jsou hotové!';
      const m = CD.UI.modal({ title: sc.name, cls: 'm-tasks', html: `
<div class="scene-prog"><div class="sp-lbl">Postup scény</div><div class="sp-bar"><i style="width:${done / 6 * 100}%"></i><span>${done}/6</span></div>${CD.Art.chestIcon()}</div>
<div class="task-list">${rows}</div>
<div class="t-hint">${hint}</div>
${next && d.stars < next.cost ? `<div class="m-btns"><button class="btn btn-green" data-play>Hrát level ${Math.min(this.nextLevel(), CD.Levels.COUNT)}</button></div>` : ''}` });
      m.el.querySelectorAll('[data-task]').forEach(b => b.addEventListener('click', () => {
        const i = +b.dataset.task;
        if (d.stars < sc.tasks[i].cost) { CD.Sound.play('bad'); CD.UI.toast(`Potřebuješ ${sc.tasks[i].cost} ★. Zahraj si level!`); return; }
        m.close(true);
        this.doTask(i);
      }));
      const pb = m.el.querySelector('[data-play]');
      if (pb) pb.addEventListener('click', () => { m.close(true); this.play(); });
    },

    doTask(i) {
      const d = CD.Store.data, idx = d.scene, sc = CD.Scenes.SCENES[idx], t = sc.tasks[i];
      if (d.tasks[idx] !== i || d.stars < t.cost) return;
      d.stars -= t.cost;
      d.tasks[idx]++;
      CD.Store.save();
      CD.Sound.play('task');
      CD.Scenes.reveal(this.svg, i);
      this.say(t.line, 5000);
      this.updateHud();
      if (d.tasks[idx] >= 6) setTimeout(() => this.claimChest(), 2200);
    },

    claimChest() {
      const d = CD.Store.data, idx = d.scene, sc = CD.Scenes.SCENES[idx], ch = sc.chest;
      if (d.chests[idx]) return;
      CD.Sound.play('win');
      CD.UI.confetti();
      const m = CD.UI.modal({ title: 'Scéna dokončena!', closable: false, cls: 'm-chest', html: `
<p class="m-text big">${sc.outro}</p>
<div class="chest-big">${CD.Art.chestIcon()}</div>
<div class="rewards">
  <div class="rw">${CD.UI.icon('coin')}<b>+${CD.UI.fmt(ch.coins)}</b></div>
  <div class="rw">${CD.UI.icon('wild')}<b>+${ch.wild}</b></div>
  <div class="rw">${CD.UI.icon('undo')}<b>+${ch.undo}</b></div>
  <div class="rw">${CD.UI.icon('shuffle')}<b>+${ch.shuffle}</b></div>
</div>
<div class="m-btns"><button class="btn btn-green" data-ok>Vyzvednout</button></div>` });
      m.el.querySelector('[data-ok]').addEventListener('click', () => {
        d.coins += ch.coins;
        d.boosters.wild += ch.wild; d.boosters.undo += ch.undo; d.boosters.shuffle += ch.shuffle;
        d.chests[idx] = true;
        const last = idx >= CD.Scenes.COUNT - 1;
        if (!last) d.scene = idx + 1;
        CD.Store.save();
        CD.Sound.play('coin');
        m.close(true);
        if (last) {
          this.updateHud();
          CD.UI.modal({ title: 'Gratulujeme!', html: `<p class="m-text big">Opravil(a) jsi celé podmořské království! 🐢💙</p><p class="m-text">Můžeš dál hrát levely a sbírat 3 hvězdičky všude, nebo si prohlédnout všechny scény v albu.</p>` });
        } else {
          $('#homeScene').classList.add('fade');
          setTimeout(() => { this.render(); $('#homeScene').classList.remove('fade'); this.greet(); }, 450);
        }
      });
    },

    /* ---------- album scén ---------- */
    album() {
      CD.Sound.play('click');
      const d = CD.Store.data;
      const cards = CD.Scenes.SCENES.map((sc, i) => {
        const open = i <= d.scene;
        return `<button class="alb ${open ? '' : 'locked'}" data-i="${i}" ${open ? '' : 'disabled'}>
<div class="alb-thumb">${open ? CD.Scenes.render(i, d.tasks[i], { noFront: true, cls: 'thumb' }) : `<div class="alb-lock">${CD.UI.icon('lock')}</div>`}${d.chests[i] ? `<div class="alb-done">${CD.UI.icon('check')}</div>` : ''}</div>
<div class="alb-name">${i + 1}. ${open ? sc.name : '???'}</div>
<div class="alb-bar"><i style="width:${d.tasks[i] / 6 * 100}%"></i><span>${d.tasks[i]}/6</span></div></button>`;
      }).join('');
      const m = CD.UI.modal({ title: 'Album scén', cls: 'm-album', html: `<div class="alb-grid">${cards}</div>` });
      m.el.querySelectorAll('.alb:not(.locked)').forEach(b => b.addEventListener('click', () => this.viewScene(+b.dataset.i)));
    },
    viewScene(i) {
      CD.Sound.play('click');
      const d = CD.Store.data;
      const m = CD.UI.modal({ title: CD.Scenes.SCENES[i].name, cls: 'm-viewer', html: `<div class="viewer">${CD.Scenes.render(i, d.tasks[i])}</div>` });
      CD.Scenes.fit(m.el.querySelector('svg'), 16, 9);
    },

    play() {
      CD.Sound.play('click');
      const lvl = this.nextLevel();
      if (lvl > CD.Levels.COUNT) { CD.Map.open(); return; }
      CD.Game.start(lvl, { resume: true });
    },
  };

  CD.Home = H;
})(typeof window !== 'undefined' ? window : globalThis);
