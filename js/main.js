/* =========================================================================
   Korálové sny – spuštění aplikace a globální události
   ========================================================================= */
(function (root) {
  'use strict';
  const CD = root.CD = root.CD || {};
  const { $ } = CD.UI;

  const Main = {
    openTitle() {
      const d = CD.Store.data;
      $('#titleScene').innerHTML = CD.Scenes.render(d.scene, d.tasks[d.scene]);
      CD.Scenes.fit($('#titleScene svg'), innerWidth, innerHeight);
      $('#titleContinue').textContent = (d.stats.played || d.unlocked > 1) ? 'Pokračovat' : 'Hrát';
      CD.UI.show('title');
    },

    onResize() {
      clearTimeout(this._rt);
      this._rt = setTimeout(() => {
        document.documentElement.style.setProperty('--vh', innerHeight + 'px');
        const cur = CD.UI.current;
        if (cur === 'game') CD.Game.layout();
        if (cur === 'map') CD.Map.build();
        if (cur === 'home') CD.Home.fit();
        if (cur === 'title') CD.Scenes.fit($('#titleScene svg'), innerWidth, innerHeight);
      }, 80);
    },

    init() {
      CD.Store.load();
      document.documentElement.style.setProperty('--vh', innerHeight + 'px');

      // tlačítka s data-act (fungují na všech obrazovkách)
      document.addEventListener('click', e => {
        const b = e.target.closest('[data-act]');
        if (!b) return;
        CD.Sound.unlock();
        CD.Sound.play('click');
        switch (b.dataset.act) {
          case 'home': CD.Home.open(); break;
          case 'map': CD.Map.open(); break;
          case 'album': CD.Home.album(); break;
          case 'help': CD.UI.help(); break;
          case 'settings': CD.UI.settings(); break;
          case 'title': Main.openTitle(); break;
        }
      });
      $('#tasksBtn').addEventListener('click', () => CD.Home.openTasks());
      $('#playBtn').addEventListener('click', () => CD.Home.play());
      $('#bonusBtn').addEventListener('click', () => CD.Home.bonus());
      $('#dailyBtn').addEventListener('click', () => CD.Meta.openDaily());
      $('#stickersBtn').addEventListener('click', () => CD.Meta.openStickers());
      $('#achBtn').addEventListener('click', () => CD.Meta.openAchievements());
      $('#homeGuide').addEventListener('click', () => CD.Home.tapGuide());
      $('#stock').addEventListener('pointerdown', e => { e.preventDefault(); CD.Game.tapStock(); });
      $('#gHome').addEventListener('click', () => CD.Game.leave());
      // tlačítko reproduktoru ve hře vypíná/zapíná hudbu i zvuky najednou (zvlášť jdou v Nastavení)
      $('#gSound').addEventListener('click', () => {
        const s = CD.Store.data.settings, on = !(s.sound || s.music);
        s.sound = on; s.music = on; CD.Store.save();
        CD.Sound.unlock(); CD.Sound.play('click');
        CD.Music.refresh();
        CD.Game.renderHud();
      });
      document.querySelectorAll('.boost[data-b]').forEach(b => b.addEventListener('click', () => CD.Game.booster(b.dataset.b)));

      // zvuk na iOS lze spustit jen po dotyku
      const unlock = () => { CD.Sound.unlock(); CD.Music.kick(); };
      document.addEventListener('pointerdown', unlock, { passive: true });
      document.addEventListener('touchend', unlock, { passive: true });

      // zabránit zoomu gestem na iPadu a nechtěnému posouvání stránky
      document.addEventListener('gesturestart', e => e.preventDefault());
      document.addEventListener('dblclick', e => e.preventDefault());
      document.addEventListener('touchmove', e => { if (!e.target.closest('.scrollable')) e.preventDefault(); }, { passive: false });

      addEventListener('resize', () => this.onResize());
      addEventListener('orientationchange', () => setTimeout(() => this.onResize(), 250));
      // na pozadí (jiná aplikace, zamčený displej) hudbu pozastavit
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) { CD.Store.save(); CD.Music.stop(); if (CD.Sound.ctx) CD.Sound.ctx.suspend().catch(() => {}); }
        else if (CD.Sound.ctx) { CD.Sound.ctx.resume().catch(() => {}); CD.Music.kick(); }
      });
      addEventListener('pagehide', () => CD.Store.save());

      this.openTitle();
      if (!CD.Store.ok) setTimeout(() => CD.UI.toast('⚠️ Prohlížeč nepovoluje ukládání – postup se neuloží (soukromý režim?).', 5000), 800);

      // offline režim (jen přes http/https, ne file://)
      if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol) && window.top === window.self) {
        navigator.serviceWorker.register('sw.js').catch(() => {});
      }
    },
  };

  CD.Main = Main;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => Main.init());
  else Main.init();
})(window);
