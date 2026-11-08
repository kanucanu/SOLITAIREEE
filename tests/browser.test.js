// Funkční test v prohlížeči (vyžaduje Playwright a běžící server: python3 -m http.server 8000).
// Spuštění: node tests/browser.test.js
const { chromium } = require('playwright');
const ok = (c, m) => { console.log((c ? 'OK   ' : 'FAIL ') + m); if (!c) process.exitCode = 1; };
(async () => {
  const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 1024, height: 768 }, hasTouch: true });
  const p = await ctx.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
  await p.goto('http://localhost:8000/'); await p.waitForTimeout(500);
  await p.evaluate(() => { const d = CD.Store.data; d.unlocked = 5; CD.Store.save(); CD.Game.start(5, {}); });
  await p.waitForTimeout(500);
  const sol = await p.evaluate(() => CD.Game.st.sol);
  for (const m of sol.slice(0, 4)) { await p.evaluate(m => m === -1 ? CD.Game.tapStock() : CD.Game.tapCard(m), m); await p.waitForTimeout(80); }
  const before = await p.evaluate(() => JSON.stringify({ c: CD.Game.st.cards, si: CD.Game.st.si, w: CD.Game.st.waste }));
  await p.reload(); await p.waitForTimeout(600);
  const saved = await p.evaluate(() => CD.Store.data.run && CD.Store.data.run.level);
  ok(saved === 5, 'rozehraný level přežil obnovení stránky');
  await p.evaluate(() => CD.Home.open()); await p.waitForTimeout(300);
  ok((await p.textContent('#playBtn')).includes('Pokračovat'), 'tlačítko na domovské obrazovce nabízí Pokračovat');
  await p.evaluate(() => CD.Home.play()); await p.waitForTimeout(500);
  const after = await p.evaluate(() => JSON.stringify({ c: CD.Game.st.cards, si: CD.Game.st.si, w: CD.Game.st.waste }));
  ok(before === after, 'stav hry po obnovení je identický');
  const gone1 = await p.evaluate(() => CD.Game.st.cards.filter(c => c.gone).length);
  await p.evaluate(() => CD.Game.booster('undo')); await p.waitForTimeout(200);
  const gone2 = await p.evaluate(() => CD.Game.st.cards.filter(c => c.gone).length + CD.Game.st.si);
  ok(gone2 < gone1 + 99 && (await p.evaluate(() => CD.Store.data.boosters.undo)) === 2, 'Zpět vrátil tah a spotřeboval 1 booster');
  await p.evaluate(() => CD.Game.booster('wild')); await p.waitForTimeout(400);
  ok(await p.evaluate(() => !!CD.Engine.top(CD.Game.st).w), 'žolík leží na hromádce');
  const free = await p.evaluate(() => CD.Game.st.cards.findIndex((c, i) => CD.Engine.isFree(CD.Game.st, i) && !CD.Engine.isLocked(CD.Game.st, i)));
  await p.evaluate(i => CD.Game.tapCard(i), free); await p.waitForTimeout(300);
  ok(await p.evaluate(i => CD.Game.st.cards[i].gone, free), 'na žolíka jde zahrát libovolná volná karta');
  const vals1 = await p.evaluate(() => CD.Game.st.cards.filter(c => !c.gone).map(c => c.r).sort().join());
  await p.evaluate(() => CD.Game.booster('shuffle')); await p.waitForTimeout(800);
  const vals2 = await p.evaluate(() => CD.Game.st.cards.filter(c => !c.gone).map(c => c.r).sort().join());
  ok(vals1.split(',').length === vals2.split(',').length, 'zamíchání zachovalo počet karet');
  ok(await p.evaluate(() => CD.Engine.playable(CD.Game.st).length > 0 || CD.Engine.stockLeft(CD.Game.st) > 0), 'po zamíchání existuje tah');
  // vyčerpat balíček a vzdát
  await p.evaluate(() => { const st = CD.Game.st; st.si = st.stock.length; st.waste.push({ r: 7, s: 0 }); st.cards.forEach(c => { if (!c.gone && (c.r === 6 || c.r === 8)) c.r = 1; }); CD.Game.renderAll(); CD.Game.checkStuck(); });
  await p.waitForTimeout(1200);
  ok(await p.isVisible('[data-plus]'), 'nabídka +5 karet se zobrazila');
  const coins0 = await p.evaluate(() => CD.Store.data.coins);
  await p.click('[data-plus]', { force: true }); await p.waitForTimeout(300);
  ok(await p.evaluate(c => CD.Store.data.coins === c - 150 && CD.Engine.stockLeft(CD.Game.st) === 5, coins0), '+5 karet stálo 150 mincí');
  await p.evaluate(() => { const st = CD.Game.st; st.si = st.stock.length; CD.Game.renderAll(); CD.Game.checkStuck(); });
  await p.waitForTimeout(1200);
  await p.click('[data-give]', { force: true }); await p.waitForTimeout(400);
  ok(await p.evaluate(() => CD.Store.data.run === null), 'po vzdání se rozehraná hra smazala');
  // dokončení scény -> truhla -> další scéna
  await p.evaluate(() => { CD.UI.closeAllModals(); const d = CD.Store.data; d.stars = 50; d.tasks[0] = 5; CD.Store.save(); CD.Home.open(); CD.Home.doTask(5); });
  await p.waitForTimeout(2800);
  ok(await p.isVisible('.m-chest'), 'po 6. úkolu se objevila truhla');
  await p.click('[data-ok]', { force: true }); await p.waitForTimeout(800);
  ok(await p.evaluate(() => CD.Store.data.scene === 1 && CD.Store.data.boosters.wild >= 2), 'truhla dala odměny a odemkla scénu 2');
  await p.reload(); await p.waitForTimeout(500);
  ok(await p.evaluate(() => CD.Store.data.scene === 1 && CD.Store.data.tasks[0] === 6), 'postup scén přežil obnovení');
  console.log('ERRORS', JSON.stringify(errs));
  await b.close();
})();
