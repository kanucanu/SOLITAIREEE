/* =========================================================================
   Korálové sny – meta-vrstva: denní výzva, sbírka nálepek, úspěchy,
   obyvatelé scén a 3★ výzvy dohraných levelů
   ========================================================================= */
(function (root) {
  'use strict';
  const CD = root.CD = root.CD || {};
  const { $ } = CD.UI;
  const data = () => CD.Store.data;
  const today = () => CD.Levels.dayNumber();

  /* ---------- odměny ---------- */
  function grant(r) {
    const d = data(), parts = [];
    if (r.coins) { d.coins += r.coins; parts.push(`+${r.coins} ${CD.UI.icon('coin')}`); }
    if (r.pearls) { d.pearls += r.pearls; parts.push(`+${r.pearls} ${CD.UI.icon('pearl')}`); }
    ['wild', 'undo', 'shuffle'].forEach(b => { if (r[b]) { d.boosters[b] += r[b]; parts.push(`+${r[b]} ${CD.UI.icon(b)}`); } });
    let extra = '';
    if (r.sticker) for (let k = 0; k < r.sticker; k++) extra += ' ' + M.giveSticker().short;
    return parts.join(' ') + extra;
  }

  /* ---------- denní výzva + kalendář (7 dní za sebou) ---------- */
  const CAL = [
    { coins: 100 }, { undo: 1, coins: 50 }, { coins: 150 }, { wild: 1 },
    { coins: 200 }, { shuffle: 1, undo: 1 }, { coins: 400, wild: 2, sticker: 2, pearls: 5 },
  ];
  const calIcon = r => r.sticker ? '🎁' : r.wild ? '✨' : r.shuffle ? '🔀' : r.undo ? '↩️' : '🪙';
  const calText = r => [r.coins && `${r.coins} mincí`, r.wild && `${r.wild}× žolík`, r.undo && `${r.undo}× zpět`, r.shuffle && `${r.shuffle}× zamíchat`, r.sticker && `${r.sticker} nálepky`, r.pearls && `${r.pearls} perel`].filter(Boolean).join(' + ');

  /* ---------- nálepky (24 mořských tvorů ve 4 sadách) ---------- */
  const SETS = [
    { name: 'Korálový útes', color: '#ff9fb8', reward: { coins: 300, wild: 1, pearls: 5 } },
    { name: 'Tvorové hlubin', color: '#9a8cff', reward: { coins: 400, undo: 2, pearls: 5 } },
    { name: 'Ledové moře', color: '#8fd8ff', reward: { coins: 400, shuffle: 2, pearls: 5 } },
    { name: 'Poklady moře', color: '#ffd166', reward: { coins: 600, wild: 2, pearls: 10 } },
  ];
  const STICKERS = [
    ['🐠', 'Klauní rybka'], ['🐡', 'Čtverzubec'], ['🐢', 'Kareta'], ['🪸', 'Korál'], ['🦐', 'Kreveta'], ['🐟', 'Modrá rybka'],
    ['🐙', 'Chobotnice'], ['🦑', 'Krakatice'], ['🪼', 'Medúza'], ['🦈', 'Žralok'], ['🐋', 'Plejtvák'], ['🦞', 'Humr'],
    ['🦭', 'Tuleň'], ['🐧', 'Tučňák'], ['🐳', 'Velryba'], ['🦦', 'Vydra'], ['🐬', 'Delfín'], ['🦀', 'Krab'],
    ['🐚', 'Mušle'], ['🦪', 'Perlorodka'], ['💎', 'Drahokam'], ['👑', 'Koruna'], ['⚓', 'Kotva'], ['🔱', 'Trojzubec'],
  ].map(([e, name], i) => ({ id: i, e, name, set: Math.floor(i / 6) }));

  /* ---------- úspěchy ---------- */
  const st3 = d => Object.values(d.best).filter(v => v >= 3).length;
  const uniq = d => Object.keys(d.stickers).length;
  const ACH = [
    { id: 'win1', ico: '🎉', name: 'První krůčky', desc: 'Vyhraj první level', goal: 1, val: d => d.stats.wins, coins: 50 },
    { id: 'win25', ico: '🏅', name: 'Sběratel výher', desc: 'Vyhraj 25 her', goal: 25, val: d => d.stats.wins, coins: 150 },
    { id: 'win100', ico: '⚓', name: 'Mořský vlk', desc: 'Vyhraj 100 her', goal: 100, val: d => d.stats.wins, coins: 400 },
    { id: 'st10', ico: '⭐', name: 'Tři hvězdy', desc: 'Získej 3 ★ v 10 levelech', goal: 10, val: st3, coins: 150 },
    { id: 'st50', ico: '🌟', name: 'Hvězdná flotila', desc: 'Získej 3 ★ v 50 levelech', goal: 50, val: st3, coins: 500 },
    { id: 'str10', ico: '🌊', name: 'Vlna', desc: 'Sérii 10 karet', goal: 10, val: d => d.stats.bestStreak, coins: 100 },
    { id: 'str20', ico: '🌀', name: 'Tsunami', desc: 'Sérii 20 karet', goal: 20, val: d => d.stats.bestStreak, coins: 300 },
    { id: 'sc5', ico: '🐢', name: 'Stavitel útesu', desc: 'Oprav 5 scén', goal: 5, val: d => d.chests.filter(Boolean).length, coins: 400 },
    { id: 'sc10', ico: '🏰', name: 'Vládce hlubin', desc: 'Oprav všech 10 scén', goal: 10, val: d => d.chests.filter(Boolean).length, coins: 1000 },
    { id: 'w1', ico: '🐠', name: 'Korálové sny', desc: 'Dohraj level 50', goal: 50, val: d => d.unlocked - 1, coins: 300 },
    { id: 'w2', ico: '🦑', name: 'Hlubiny', desc: 'Dohraj level 100', goal: 100, val: d => d.unlocked - 1, coins: 1000 },
    { id: 'boss', ico: '🦈', name: 'Krotitel žraloků', desc: 'Poraz všech 5 bossů', goal: 5, val: d => d.stats.boss || 0, coins: 500 },
    { id: 'daily7', ico: '📅', name: 'Věrný kamarád', desc: 'Splň 7 denních výzev', goal: 7, val: d => d.stats.daily || 0, coins: 300 },
    { id: 'chal10', ico: '🏆', name: 'Mistr výzev', desc: 'Splň 10 výzev na tahy', goal: 10, val: d => d.stats.chal || 0, coins: 300 },
    { id: 'obst', ico: '🧽', name: 'Čistič moře', desc: 'Odstraň 100 překážek', goal: 100, val: d => d.stats.obst || 0, coins: 300 },
    { id: 'stk', ico: '📒', name: 'Kompletní sbírka', desc: 'Sesbírej všech 24 nálepek', goal: 24, val: uniq, coins: 1000 },
  ];

  const achPearls = a => Math.max(2, Math.round(a.coins / 100));

  /* ---------- obyvatelé scén (přistěhují se po 2., 4. a 6. úkolu) ---------- */
  const RES = [
    [{ at: 2, name: 'Rybka Bublinka', art: () => CD.Art.fish(1250, 420, 1.1, '#ff9f43', '#ff6b6b', true, 0, 'bob'), lines: ['Ahoj! Já jsem Bublinka a ráda závodím!', 'Víš, že korály jsou vlastně zvířátka?'] },
     { at: 4, name: 'Hvězdice Stela', art: () => CD.Art.starfish(1180, 830, 1.1, '#ff6fa3', 10), lines: ['Ležím tu a koukám na hvězdy nad hladinou.', 'Psst… pod pískem je schovaná mušle!'] },
     { at: 6, name: 'Čtverzubec Puf', art: () => CD.Art.puffer(330, 330, 0.9, '#ffd166', -1), lines: ['Když se leknu, nafouknu se jako balon!', 'Tvoje série karet jsou úžasné!'] }],
    [{ at: 2, name: 'Krab Kryštof', art: () => CD.Art.crab(1130, 840, 0.7, '#ff7a4a', 0), lines: ['Klap klap! Hlídám perly.', 'Do jeskyně se smí jen s úsměvem!'] },
     { at: 4, name: 'Koník Perlička', art: () => CD.Art.seahorse(1180, 470, 0.9, '#c4a0ff', '#8a6fe0', true, -1), lines: ['Na trůn si sedám jen o svátcích.', 'Perly svítí nejvíc v noci.'] },
     { at: 6, name: 'Lampička', art: u => CD.Art.lanternfish(u, 470, 360, 0.8, '#6a7fe0', false, -2), lines: ['Svítím, aby se tu nikdo neztratil.', 'Chceš si posvítit na další level?'] }],
    [{ at: 2, name: 'Krab Kapitán', art: () => CD.Art.crab(560, 850, 0.7, '#e8553a', 0), lines: ['Ahoj, námořníku! Kurz na další level!', 'Tahle loď zažila velké bouře.'] },
     { at: 4, name: 'Chobotnice Olga', art: () => CD.Art.octopus(1380, 470, 0.7, '#ff8fb0', '#ffd0e0', -1), lines: ['Mám osm rukou – můžu hrát čtyři levely najednou!', 'Na lodi jsem našla starou mapu…'] },
     { at: 6, name: 'Delfín Šplouch', art: () => CD.Art.fish(420, 260, 1.4, '#7fd8ff', '#3fa5d6', false, -3, 'swim'), lines: ['Hop! Skáču přes vlny!', 'Plavat s tebou je radost!'] }],
    [{ at: 2, name: 'Koník Lístek', art: () => CD.Art.seahorse(280, 480, 0.8, '#7be38a', '#3fae5a', false, 0), lines: ['Zahrada je můj taneční sál.', 'Sasanky mě lechtají na ocásku.'] },
     { at: 4, name: 'Hvězdice Kvítek', art: () => CD.Art.starfish(1320, 850, 0.9, '#ffb36b', -15), lines: ['Ráda se dívám, jak rostou květiny.', 'Cestičku jsem pomáhala skládat!'] },
     { at: 6, name: 'Medúzka Lili', art: u => CD.Art.jelly(u, 1300, 300, 0.8, '#ff9ad5', -1), lines: ['Svítím, když jsem šťastná. Teď svítím pořád!', 'Tancuješ se mnou?'] }],
    [{ at: 2, name: 'Krab Strážce', art: () => CD.Art.crab(1300, 860, 0.7, '#ffb347', 0), lines: ['Stojím na stráži u brány.', 'Heslo? Tři hvězdičky!'] },
     { at: 4, name: 'Babička Ryba', art: () => CD.Art.fish(1290, 400, 1.2, '#b39dff', '#8a6fe0', true, -1, 'bob'), lines: ['Pamatuju si, když byl palác úplně nový.', 'Tóňa sem jezdí na prázdniny.'] },
     { at: 6, name: 'Rybí sbor', art: () => CD.Art.school(260, 180, 0.8, '#ff9ad5', '#ff6f91', false, 5), lines: ['Laláá! Zpíváme na slavnosti!', 'Ještě jednou od začátku!'] }],
    [{ at: 2, name: 'Chobotnice Olga', art: () => CD.Art.octopus(1180, 470, 0.6, '#b06ad6', '#e0a8ff', -1), lines: ['Promiň za ten inkoust, lekla jsem se!', 'Inkoust smyješ kartou hned vedle.'] },
     { at: 4, name: 'Lampovník Blik', art: u => CD.Art.lanternfish(u, 420, 500, 0.7, '#5ad0c0', false, -1), lines: ['Blik, blik! Svítím na cestu.', 'V Hlubinách je tma, ale ne s námi.'] },
     { at: 6, name: 'Krab Inkoustík', art: () => CD.Art.crab(1340, 860, 0.6, '#9a7fe0', 0), lines: ['Jsem fialový od inkoustu. Sluší mi to?', 'Houby svítí celou noc.'] }],
    [{ at: 2, name: 'Tuleň Ťapka', art: () => CD.Art.seal(1340, 850, 0.6, true, 0), lines: ['Brr, ale mně zima není!', 'Led roztají dvě karty zahrané vedle.'] },
     { at: 4, name: 'Rybka Rampouch', art: () => CD.Art.fish(320, 420, 1.1, '#bfe6fb', '#6fb8e0', false, -1, 'swim'), lines: ['Plavu mezi krystaly.', 'Polární záře je nejhezčí v noci.'] },
     { at: 6, name: 'Čtverzubec Mrazík', art: () => CD.Art.puffer(1250, 300, 0.7, '#9fdcff', -2), lines: ['Jsem nafouklý jako sněhová koule!', 'Klouzačka je nejlepší vynález!'] }],
    [{ at: 2, name: 'Krab Bublinář', art: () => CD.Art.crab(330, 860, 0.6, '#ff9a5a', 0), lines: ['Bubliny mě šimrají na krunýři.', 'Bublina s ♥ chce dvě červené karty.'] },
     { at: 4, name: 'Čtverzubec Hop', art: () => CD.Art.puffer(330, 380, 0.7, '#ff9ec7', -1), lines: ['Jezdím bublinkovým výtahem nahoru a dolů!', 'Hop, hop!'] },
     { at: 6, name: 'Chobotnice Bubu', art: () => CD.Art.octopus(1180, 420, 0.55, '#ff9a6b', '#ffd0a0', -2), lines: ['Hraju v krabím orchestru na buben!', 'Tleskej do rytmu!'] }],
    [{ at: 2, name: 'Rybka Zlatuška', art: () => CD.Art.fish(1320, 420, 1.1, '#ffd166', '#e09a12', true, 0, 'bob'), lines: ['V chrámu je spousta zlata!', 'Mušle se otevře při sérii 5.'] },
     { at: 4, name: 'Krab Archeolog', art: () => CD.Art.crab(1330, 860, 0.6, '#d98a3a', 0), lines: ['Vykopal jsem tu starou mušli!', 'Pod pískem je ještě víc pokladů.'] },
     { at: 6, name: 'Lampovník Moudrý', art: u => CD.Art.lanternfish(u, 300, 300, 0.8, '#d0a85a', false, -1), lines: ['Chrám je starší než všechny korály.', 'Perly přinášejí štěstí.'] }],
    [{ at: 2, name: 'Medúza Noční', art: u => CD.Art.jelly(u, 1350, 470, 0.7, '#7fe7ff', -1), lines: ['V hlubinách je klid a ticho.', 'Já se žraloka nebojím!'] },
     { at: 4, name: 'Chobotnice Olga', art: () => CD.Art.octopus(300, 470, 0.55, '#b06ad6', '#e0a8ff', -2), lines: ['Žralok je ve skutečnosti hodný, jen měl hlad.', 'Vařím mu chaluhovou polévku.'] },
     { at: 6, name: 'Žralok Žrout', art: () => CD.Art.shark(1200, 600, 0.5, true, true, -1), lines: ['Promiň, že jsem ti jedl karty. Už nebudu!', 'Jsme kamarádi? Mňam… teda, ahoj!'] }],
  ];

  const M = {
    CAL, STICKERS, SETS, ACH, RES,

    /* ===== denní výzva ===== */
    dailyLevel() { return CD.Levels.DAILY_BASE + today(); },
    dailyDone() { return data().daily.last === today(); },
    nextStep() {   // který den kalendáře by teď hráč dostal
      const dd = data().daily, t = today();
      if (dd.last === t) return dd.step;
      return dd.last === t - 1 ? (dd.step + 1) % 7 : 0;
    },
    dailyWin() {
      const d = data(), dd = d.daily, t = today();
      if (dd.last === t) return 'Dnešní odměnu z kalendáře už máš. Přijď zítra!';
      const step = this.nextStep();
      dd.step = step; dd.last = t;
      d.stats.daily = (d.stats.daily || 0) + 1;
      return `📅 Den ${step + 1} v kalendáři: ${grant(CAL[step])}`;
    },
    openDaily() {
      CD.Sound.play('click');
      const done = this.dailyDone(), step = this.nextStep(), d = data();
      const def = CD.Levels.get(this.dailyLevel());
      const obst = ['ink', 'ice', 'bub', 'shell'].filter(k => def[k]).map(k => ({ ink: '🖤 inkoust', ice: '🧊 led', bub: '🫧 bubliny', shell: '🐚 mušle' })[k]).join(' · ');
      const cells = CAL.map((r, i) => {
        const cls = i < step || (done && i === step) ? 'got' : i === step ? 'today' : '';
        return `<div class="cal ${cls}"><small>Den ${i + 1}</small><div class="cal-ico">${cls === 'got' ? '✅' : calIcon(r)}</div><span>${calText(r)}</span></div>`;
      }).join('');
      const running = d.run && d.run.level === this.dailyLevel();
      const left = new Date(); left.setHours(24, 0, 0, 0);
      const hrs = Math.max(0, Math.floor((left - Date.now()) / 3600000)), mins = Math.max(0, Math.floor((left - Date.now()) / 60000) % 60);
      const m = CD.UI.modal({ title: 'Denní výzva', cls: 'm-wide m-daily', html: `
<p class="m-text">Každý den nový level – pro všechny hráče stejný. Splň výzvu několik dní po sobě a odměny v kalendáři rostou!</p>
<div class="cal-row">${cells}</div>
<div class="lv-chapter">Dnes: <i>${def.name}</i> · ${def.N} karet${obst ? ' · ' + obst : ''}</div>
${CD.Map.preview(def.lay, false)}
<div class="m-btns">${done ? `<button class="btn btn-gray" disabled>Splněno ✓ · nová za ${hrs} h ${mins} min</button><button class="btn btn-blue" data-go>Hrát znovu</button>` : `<button class="btn btn-green btn-lg" data-go>${running ? 'Pokračovat' : 'Hrát výzvu'}</button>`}</div>
${!done && d.daily.last >= 0 && d.daily.last < today() - 1 ? '<p class="m-small">Série dní se přerušila – kalendář začíná znovu od 1. dne.</p>' : ''}` });
      m.el.querySelector('[data-go]').addEventListener('click', () => { m.close(true); CD.Game.start(this.dailyLevel(), { resume: true }); });
    },

    /* ===== nálepky ===== */
    giveSticker() {
      const d = data(), s = STICKERS[Math.floor(Math.random() * STICKERS.length)];
      const dup = !!d.stickers[s.id];
      d.stickers[s.id] = (d.stickers[s.id] || 0) + 1;
      if (dup) d.coins += 25;
      let setDone = '';
      const set = SETS[s.set];
      if (!d.sets[s.set] && STICKERS.filter(x => x.set === s.set).every(x => d.stickers[x.id])) {
        d.sets[s.set] = true;
        setDone = ` · Sada „${set.name}" je kompletní! ${grant(set.reward)}`;
      }
      setTimeout(() => CD.Sound.play('sticker'), 900);
      return {
        short: `<span class="stk">${s.e}</span>`,
        html: `<span class="stk">${s.e}</span> ${dup ? `Nálepka ${s.name} (už ji máš → +25 ${CD.UI.icon('coin')})` : `Nová nálepka: <b>${s.name}</b>!`}${setDone}`,
      };
    },
    stickerDrop(chance) { return Math.random() < chance ? this.giveSticker().html : ''; },
    openStickers() {
      CD.Sound.play('click');
      const d = data();
      const html = SETS.map((set, si) => {
        const items = STICKERS.filter(s => s.set === si);
        const have = items.filter(s => d.stickers[s.id]).length;
        return `<div class="stk-set"><div class="stk-head" style="--sc:${set.color}"><b>${set.name}</b><span>${have}/6 ${d.sets[si] ? '✅' : `· odměna ${set.reward.coins} ${CD.UI.icon('coin')} + ${set.reward.pearls} ${CD.UI.icon('pearl')}`}</span></div>
<div class="stk-grid">${items.map(s => d.stickers[s.id] ? `<div class="stk-card" style="--sc:${set.color}"><span class="stk">${s.e}</span><small>${s.name}</small>${d.stickers[s.id] > 1 ? `<i>×${d.stickers[s.id]}</i>` : ''}</div>` : '<div class="stk-card empty"><span class="stk">?</span><small>???</small></div>').join('')}</div></div>`;
      }).join('');
      CD.UI.modal({ title: 'Sbírka tvorů', cls: 'm-wide m-stickers', html: `<p class="m-text">Nálepky padají z výher (hlavně za 3 ★), z bossů, denních výzev a truhel. Kompletní sada = odměna!</p>${html}<p class="m-small">Máš ${uniq(d)} z 24 nálepek.</p>` });
    },

    /* ===== 3★ výzvy ===== */
    challengeWin(n) {
      const d = data();
      if (d.chal[n]) return '🏆 Výzvu tohoto levelu už máš splněnou – gratulace k opakování!';
      d.chal[n] = true;
      d.stats.chal = (d.stats.chal || 0) + 1;
      d.coins += 100; d.pearls += 2;
      return `🏆 Výzva splněna poprvé: +100 ${CD.UI.icon('coin')} +2 ${CD.UI.icon('pearl')}`;
    },

    /* ===== úspěchy ===== */
    checkAchievements() {
      const d = data(), fresh = ACH.filter(a => !d.ach[a.id] && a.val(d) >= a.goal);
      if (!fresh.length) return;
      fresh.forEach(a => { d.ach[a.id] = true; d.coins += a.coins; d.pearls += achPearls(a); });
      CD.Store.save();
      CD.UI.updateWallet();
      fresh.forEach((a, k) => setTimeout(() => {
        CD.Sound.play('trophy');
        const e = document.createElement('div');
        e.className = 'ach-pop';
        e.innerHTML = `<span class="ach-ico">${a.ico}</span><div><small>Nový úspěch!</small><b>${a.name}</b><span>+${a.coins} ${CD.UI.icon('coin')} +${achPearls(a)} ${CD.UI.icon('pearl')}</span></div>`;
        $('#fx').appendChild(e);
        setTimeout(() => e.remove(), 3600);
      }, k * 3800));
    },
    openAchievements() {
      CD.Sound.play('click');
      const d = data();
      const rows = ACH.map(a => {
        const v = Math.min(a.val(d), a.goal), done = !!d.ach[a.id];
        return `<div class="ach ${done ? 'done' : ''}"><span class="ach-ico">${a.ico}</span><div class="ach-txt"><b>${a.name}</b><small>${a.desc}</small>
<div class="ach-bar"><i style="width:${v / a.goal * 100}%"></i><span>${v}/${a.goal}</span></div></div><div class="ach-rw">${done ? '✅' : `+${a.coins} ${CD.UI.icon('coin')}<br>+${achPearls(a)} ${CD.UI.icon('pearl')}`}</div></div>`;
      }).join('');
      CD.UI.modal({ title: 'Úspěchy', cls: 'm-wide m-ach', html: `<p class="m-text">Získáno ${ACH.filter(a => d.ach[a.id]).length} z ${ACH.length}</p><div class="ach-list">${rows}</div>` });
    },

    /* ===== obyvatelé scén ===== */
    residentsSVG(idx, done, u) {
      return (RES[idx] || []).map((r, k) => r.at <= done ? `<g class="res" data-res="${k}">${r.art(u)}</g>` : '').join('');
    },
    tapResident(idx, k, el) {
      const r = RES[idx][k], d = data(), key = idx + '-' + k;
      CD.Sound.play('bubHit');
      el.classList.remove('res-hop'); void el.getBoundingClientRect(); el.classList.add('res-hop');
      CD.Home.say(`${r.name}: ${r.lines[Math.floor(Math.random() * r.lines.length)]}`, 4500);
      if (d.res[key] !== today()) {        // jednou denně dárek
        d.res[key] = today();
        d.coins += 15;
        CD.Store.save();
        CD.UI.updateWallet();
        const b = el.getBoundingClientRect();
        CD.UI.float(b.left + b.width / 2, b.top, `Dárek +15 ${CD.UI.icon('coin')}`, 'coin big');
        CD.Sound.play('coin');
      }
    },
    residentGifts(idx) {
      const d = data(), done = d.tasks[idx];
      return (RES[idx] || []).filter((r, k) => r.at <= done && d.res[idx + '-' + k] !== today()).length;
    },
  };

  CD.Meta = M;
})(typeof window !== 'undefined' ? window : globalThis);
