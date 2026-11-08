/* =========================================================================
   Korálové sny – dekorační scény (meta-vrstva)
   Každá scéna má 6 úkolů. Úkol stojí hvězdičky a vizuálně proměňuje scénu:
     before(u) – co ve scéně je, dokud úkol není splněný (např. nepořádek)
     art(u)    – co se objeví po splnění úkolu
     z: -1     – vykreslit za hlavní objekty scény (base)
   Pořadí vrstev: back → ground → úkoly z<0 → base → úkoly → front
   ========================================================================= */
(function (root) {
  'use strict';
  const CD = root.CD = root.CD || {};
  const A = CD.Art;
  const SHIP = 'translate(820 640) rotate(-5)';

  const SCENES = [
    /* ------------------------------------------------------------- 1 */
    {
      id: 'reef', name: 'Korálový útes',
      pal: { top: '#b3f5ec', mid: '#2bb3c0', deep: '#0b5f86', sand1: '#f6dfa4', sand2: '#d6ae68', far: '#168aa3', glow: '#b9f6ff', rock1: '#7d93a8', rock2: '#4a5d75' },
      intro: 'Ahoj, já jsem želvička Tóňa! Náš korálový útes zešedl a ryby odplavaly. Pomůžeš mi ho znovu rozzářit?',
      outro: 'Hurá! Útes je zase plný barev a rybky se vrátily domů!',
      chest: { coins: 400, wild: 1, undo: 2, shuffle: 1 },
      back: (u, p) => A.water(u) + A.rays(u) + A.far(p.far, 650),
      ground: u => A.sand(u, 705) + A.pebbles(11, 40),
      base: () => A.rock(230, 745, 170, 110, '#6f8399', '#9fb2c6') + A.rock(1390, 755, 200, 120, '#6f8399', '#9fb2c6') + A.rock(1290, 770, 90, 60, '#5f7389', '#8ea2b8'),
      tasks: [
        { name: 'Uklidit písek', cost: 1, icon: '🧹', line: 'Paráda! Písek je čistý a objevily se mořské hvězdice.',
          before: () => A.rock(650, 760, 150, 80, '#596273', '#7e8899') + A.rock(1010, 765, 130, 70, '#596273', '#7e8899') + A.net(820, 760, 280, 80) + A.boot(930, 790, 0.9, 12),
          art: () => A.starfish(640, 800, 1, '#ff8a5c', 15) + A.starfish(1000, 812, 0.8, '#ffd166', -20) + A.scallop(730, 818, 0.55, '#ffc2d4', '#ff8fb0', -15) + A.scallop(905, 830, 0.5, '#ffe3a3', '#e9b44c', 20) },
        { name: 'Oživit korály', cost: 2, icon: '🌺', line: 'Podívej, jak korály září! Takhle to tu mám ráda.',
          before: () => A.deadCoral(470, 712, 1.2) + A.deadCoral(1140, 716, 1.1) + A.deadCoral(360, 728, 0.8),
          art: () => A.fan(355, 728, 0.95, '#b57bff', '#8a4fe0', -1) + A.coral(470, 712, 1.25, '#ff6f91', '#ffc0d0') + A.tubes(585, 735, 0.8, '#ffd166', '#e09a12') + A.coral(1140, 716, 1.15, '#ff9f43', '#ffd8a8', -2) + A.brain(1250, 750, 0.9, '#7bd389', '#4fa865') },
        { name: 'Zasadit chaluhy', cost: 2, icon: '🌿', line: 'Chaluhy se vlní v proudu. Rybky se v nich rády schovávají.',
          art: () => A.kelp(285, 735, ['#2fae6b', '#46c47d', '#239a5c'], [220, 280, 190]) + A.kelp(1330, 740, ['#2fae6b', '#46c47d', '#239a5c'], [240, 200, 270]) + A.seaweed(1035, 728, 150, '#3fbf7f', -1.5) + A.seaweed(560, 725, 120, '#3fbf7f', -0.5) },
        { name: 'Lavička z mušlí', cost: 2, icon: '🐚', line: 'Krásná lavička! Konečně si mám kde odpočinout.',
          art: u => A.bench(u, 800, 775, 1) },
        { name: 'Rozsvítit medúzy', cost: 2, icon: '💡', line: 'Medúzy svítí jako lampičky. Je to kouzelné!',
          art: u => A.jelly(u, 520, 300, 1, '#ff9ad5', 0) + A.jelly(u, 1085, 250, 1.1, '#b39dff', -1.2) + A.jelly(u, 820, 140, 0.8, '#7fe7ff', -2) },
        { name: 'Přivolat rybky', cost: 3, icon: '🐠', line: 'Rybky jsou zpátky! Útes zase žije.',
          art: () => A.school(400, 420, 1, '#ffd23f', '#ff9f1c', false, 6) + A.school(950, 330, 1, '#5ee7df', '#1f9fb0', true, 6, -3) + A.fish(1010, 560, 1.35, '#ffd23f', '#3d8bfd', true, -1) + A.fish(640, 540, 0.9, '#ff7b9c', '#ff4f7b', false, -4) },
      ],
      front: () => A.bubbles(16, 3),
    },
    /* ------------------------------------------------------------- 2 */
    {
      id: 'cave', name: 'Perlová jeskyně',
      pal: { top: '#d3c7ff', mid: '#6f72d8', deep: '#2b2a6e', sand1: '#ecdcf5', sand2: '#bba5d8', far: '#4b4aa8', glow: '#e7dcff', rock1: '#5d5795', rock2: '#2c2858' },
      intro: 'Za útesem je tajná Perlová jeskyně. Vchod ale zavalil obří balvan…',
      outro: 'Jeskyně se třpytí jako šperkovnice! Perlový trůn je nádherný.',
      chest: { coins: 550, wild: 1, undo: 2, shuffle: 1 },
      back: (u, p) => A.water(u) + A.rays(u) + A.far(p.far, 640),
      ground: u => A.sand(u, 722) + A.pebbles(23, 36, 750, 890, ['#d8c4ea', '#c4acdf', '#efe4f8']),
      base: u => `<path d="M-500 -800 H2100 V1000 H1480 C1400 720 1390 330 1260 170 C1110 20 490 20 340 170 C210 330 200 720 120 1000 H-500Z" fill="url(#${u}-rock)"/>
<path d="M340 170 C210 330 200 720 120 1000 M1260 170 C1390 330 1400 720 1480 1000" stroke="#7d76b8" stroke-width="14" fill="none" opacity=".6"/>
${[[255, 520], [1345, 430], [300, 270], [1310, 660], [190, 760]].map(([x, y], i) => `<g transform="translate(${x} ${y})"><circle r="60" fill="url(#${u}-glow)" class="glowpulse" style="animation-delay:${-i * 0.5}s"/><path d="M0 -40 L14 -6 L4 20 L-12 14 L-14 -10Z" fill="#c9b6ff"/><path d="M0 -40 L4 20" stroke="#fff" stroke-opacity=".6" stroke-width="3"/></g>`).join('')}`,
      tasks: [
        { name: 'Odvalit balvan', cost: 2, icon: '⛏️', line: 'Uf, to byla dřina! Vchod do jeskyně je volný.',
          before: () => A.boulder(800, 775, 175),
          art: () => A.starfish(760, 820, 0.8, '#ffb36b', 10) + A.scallop(860, 830, 0.5, '#ffc2d4', '#ff8fb0', 10) },
        { name: 'Vyleštit obří perlu', cost: 2, icon: '💎', line: 'Mušle se otevřela a perla svítí na celou jeskyni!',
          before: () => A.clamClosed(480, 800, 0.9),
          art: u => A.clam(u, 480, 800, 0.95) },
        { name: 'Ozdobit stěny mušlemi', cost: 2, icon: '🐚', line: 'Stěny teď vypadají jako z pohádky.',
          art: () => A.scallop(330, 340, 0.85, '#ff9bb8', '#ff6f96', -20) + A.scallop(290, 580, 0.7, '#ffd166', '#e0a020', 10) + A.scallop(1270, 310, 0.85, '#7fe7ff', '#3fb5d6', 20) + A.scallop(1305, 560, 0.7, '#ff9bb8', '#ff6f96', -10) + A.scallop(520, 160, 0.6, '#ffd166', '#e0a020', -30) + A.scallop(1080, 160, 0.6, '#b39dff', '#8a6fe0', 30) + A.starfish(380, 460, 0.6, '#ff8a5c', 20) + A.starfish(1230, 440, 0.6, '#ffd166', -15) },
        { name: 'Perlové lampiony', cost: 3, icon: '🏮', line: 'Lampiony z perel! Teď je tu světla dost.',
          art: u => A.lanternString(u, 380, 1220, 190, 70, 9, ['#ffffff', '#ffd6f0', '#d6f4ff']) + A.lanternString(u, 470, 1130, 270, 40, 7, ['#fff3c4', '#ffffff', '#ffd6f0']) },
        { name: 'Koberec z chaluh', cost: 3, icon: '🧶', line: 'Měkoučký koberec. Bosé ploutvičky děkují!',
          art: () => A.rug(800, 835, 580, 100) },
        { name: 'Perlový trůn', cost: 3, icon: '👑', line: 'Perlový trůn je hotový! Kdo si na něj sedne první?',
          art: u => A.throne(u, 810, 800, 1.0) },
      ],
      front: () => A.bubbles(12, 5),
    },
    /* ------------------------------------------------------------- 3 */
    {
      id: 'ship', name: 'Potopená loď',
      pal: { top: '#a8f3dc', mid: '#2a9a96', deep: '#0f4a5c', sand1: '#ead9a4', sand2: '#bca363', far: '#1d7a7a', glow: '#c9fff0', rock1: '#6d8a86', rock2: '#3c5552' },
      intro: 'Na dně leží stará potopená loď. Opravíme ji a najdeme ztracený poklad?',
      outro: 'Loď je jako nová a vlajka hrdě vlaje. Ahoj, námořníci!',
      chest: { coins: 700, wild: 2, undo: 2, shuffle: 1 },
      back: (u, p) => A.water(u) + A.rays(u) + A.far(p.far, 650),
      ground: u => A.sand(u, 722) + A.pebbles(31, 36),
      base: u => `<g transform="${SHIP}">${A.hull(u)}</g>` + A.seaweed(520, 760, 110, '#2f9e6b', -1) + A.seaweed(1150, 770, 130, '#2f9e6b', -2) + A.rock(1420, 770, 180, 100, '#5d7470', '#87a19c'),
      tasks: [
        { name: 'Vyprostit kotvu', cost: 2, icon: '⚓', line: 'Kotva je volná! Teď se loď neutrhne.',
          before: () => A.anchor(330, 800, 0.8, -24) + A.net(330, 805, 260, 200) + A.rock(250, 815, 120, 70, '#5d7470', '#87a19c'),
          art: () => A.anchor(330, 805, 0.85, -8) + A.starfish(420, 830, 0.7, '#ff8a5c', 20) },
        { name: 'Opravit trup lodi', cost: 3, icon: '🔨', line: 'Díry jsou zalepené. Loď už nepropouští vodu… teda bubliny!',
          before: () => `<g transform="${SHIP}">${A.holes()}</g>`,
          art: () => `<g transform="${SHIP}">${A.patches()}</g>` },
        { name: 'Vztyčit stěžeň', cost: 3, icon: '⛵', z: -1, line: 'Stěžeň stojí a plachta se nadouvá.',
          before: () => A.brokenMast(1250, 830) + `<g transform="${SHIP}">${A.stump()}</g>`,
          art: () => `<g transform="${SHIP}">${A.mast()}</g>` },
        { name: 'Najít truhlu s pokladem', cost: 3, icon: '💰', line: 'Poklad! Zlaťáky a perly – to je nádhera!',
          art: u => A.chest(u, 1235, 815, 0.9) },
        { name: 'Rozsvítit lucerny', cost: 3, icon: '🏮', line: 'Lucerny hřejí jako malá sluníčka.',
          art: u => `<g transform="${SHIP}">${A.lantern(u, -165, -255, 1, 0)}${A.lantern(u, -262, -132, 0.9, -0.7)}${A.lantern(u, 165, -255, 1, -1.2)}${A.lantern(u, 262, -132, 0.9, -1.8)}</g>` },
        { name: 'Vyvěsit vlajku', cost: 4, icon: '🚩', line: 'Vlajka vlaje! Loď je připravená na dobrodružství.',
          art: u => `<g transform="${SHIP}">${A.pennants(0, -470, -340, -64, 40, ['#ff6f8e', '#ffd166', '#5ee7df', '#b39dff'])}${A.pennants(0, -470, 340, -64, 40, ['#5ee7df', '#ff6f8e', '#ffd166', '#b39dff'])}${A.flag(u)}</g>` + A.school(300, 300, 1, '#ffd23f', '#ff9f1c', false, 6) },
      ],
      front: () => A.bubbles(14, 9),
    },
    /* ------------------------------------------------------------- 4 */
    {
      id: 'garden', name: 'Zahrada sasanek',
      pal: { top: '#d2fcff', mid: '#3cc7cf', deep: '#147f99', sand1: '#fbe8c3', sand2: '#e0bd84', far: '#2aa5b5', glow: '#fff2fb', rock1: '#88a7b8', rock2: '#557587' },
      intro: 'Tady bývala nejkrásnější zahrada v moři. Teď ji ale zarostl plevel…',
      outro: 'Zahrada kvete a mořští koníci tančí. Je to tu kouzelné!',
      chest: { coins: 850, wild: 2, undo: 3, shuffle: 2 },
      back: (u, p) => A.water(u) + A.rays(u) + A.far(p.far, 640),
      ground: u => A.sand(u, 712) + A.pebbles(41, 40, 740, 890, ['#f0d7a6', '#dcb97f', '#fff0d2']),
      base: () => A.rock(240, 760, 180, 110, '#7a98aa', '#a7c2d2') + A.rock(1380, 770, 200, 120, '#7a98aa', '#a7c2d2') + A.seaweed(200, 740, 200, '#32b37a', -1) + A.seaweed(1430, 745, 220, '#32b37a', -2),
      tasks: [
        { name: 'Vyplet plevel', cost: 3, icon: '✂️', line: 'Plevel je pryč. Teď můžeme sázet!',
          before: () => A.weeds(450, 740, 1) + A.weeds(800, 760, 1.25) + A.weeds(1150, 742, 1) + A.weeds(620, 815, 0.9) + A.weeds(985, 822, 0.9),
          art: () => A.starfish(620, 830, 0.7, '#ff8a5c', 15) + A.scallop(990, 840, 0.5, '#ffc2d4', '#ff8fb0', 15) + A.starfish(1100, 800, 0.6, '#ffd166', -10) },
        { name: 'Zasadit sasanky', cost: 3, icon: '🌸', line: 'Sasanky se vlní a mávají ti!',
          art: () => A.anemone(420, 745, 1, '#ff7eb6', '#ffd1e6') + A.anemone(1180, 750, 1, '#b48cff', '#e8dcff', -1) + A.anemone(330, 815, 0.8, '#ffb36b', '#ffe2c4', -2) + A.anemone(1270, 825, 0.8, '#5fd4ff', '#d6f6ff', -0.5) + A.anemone(600, 735, 0.6, '#ff7eb6', '#ffffff', -1.5) },
        { name: 'Postavit altánek', cost: 4, icon: '🏛️', line: 'Altánek je jako z cukrkandlu!',
          art: u => A.gazebo(u, 800, 725, 0.85) },
        { name: 'Bublinková fontána', cost: 3, icon: '⛲', line: 'Fontána bublá a šimrá na ploutvičkách.',
          art: u => A.fountain(u, 1040, 800, 0.9) },
        { name: 'Oblázková cestička', cost: 4, icon: '👣', z: -1, line: 'Cestička vede rovnou k altánku.',
          art: () => A.stonePath(800, 885, 750, 7) },
        { name: 'Pozvat mořské koníky', cost: 4, icon: '🐎', line: 'Mořští koníci přijali pozvání! Zahrada je kompletní.',
          art: () => A.seahorse(560, 430, 1, '#ffb347', '#ff7f50', false, 0) + A.seahorse(1050, 380, 1.1, '#ff8fb0', '#ff5d8f', true, -1) + A.school(1050, 200, 0.9, '#5ee7df', '#1f9fb0', true, 5) + A.fish(420, 560, 0.9, '#ffd23f', '#ff9f1c', false, -2) },
      ],
      front: () => A.bubbles(14, 13),
    },
    /* ------------------------------------------------------------- 5 */
    {
      id: 'palace', name: 'Palác vln',
      pal: { top: '#dcf0ff', mid: '#4a8ee0', deep: '#1b2f7a', sand1: '#f3e6c4', sand2: '#cdb688', far: '#2f5fb0', glow: '#fff6cf', rock1: '#7f8fb0', rock2: '#4a587a' },
      intro: 'Poslední zastávka: Palác vln! Když ho opravíme, uspořádáme velkou slavnost.',
      outro: 'Podmořské království je obnovené! Děkuju ti, jsi ten nejlepší kamarád!',
      chest: { coins: 1200, wild: 3, undo: 3, shuffle: 2 },
      back: (u, p) => A.water(u) + A.rays(u) + A.far(p.far, 660),
      ground: u => A.sand(u, 728) + A.pebbles(51, 30),
      base: u => `<g transform="translate(800 690)">${A.hall(u)}</g>` + A.stairs(800, 690),
      tasks: [
        { name: 'Vyčistit schodiště', cost: 3, icon: '🧹', line: 'Schody se lesknou. Můžeme stavět!',
          before: () => A.rubble(800, 700),
          art: () => A.sparkle(700, 760, 1.2, '#fff', 0) + A.sparkle(920, 800, 1, '#fff', -0.6) + A.scallop(640, 860, 0.5, '#ffc2d4', '#ff8fb0', -10) + A.scallop(980, 865, 0.5, '#ffe3a3', '#e9b44c', 10) },
        { name: 'Postavit věže', cost: 4, icon: '🏰', line: 'Věže sahají skoro až k hladině!',
          art: u => A.tower(u, 535, 690, 300, '#ff8fb0') + A.tower(u, 1065, 690, 300, '#ff8fb0') },
        { name: 'Zlatá brána', cost: 4, icon: '🚪', line: 'Zlatá brána – vstup pro hosty je připravený.',
          art: u => `<g transform="translate(800 690)">${A.gate(u)}</g>` },
        { name: 'Korálové sloupy', cost: 4, icon: '🌸', line: 'Korálové sloupy hlídají vchod.',
          art: u => A.column(u, 370, 770, 300, '#ff9bb8', '#ff6f96') + A.column(u, 1230, 770, 300, '#ff9bb8', '#ff6f96') },
        { name: 'Duhové světlo', cost: 4, icon: '🌈', z: -1, line: 'Duha pod vodou! To jsem ještě neviděla.',
          art: u => A.rainbow(800, 600, 560) + `<circle cx="800" cy="300" r="320" fill="url(#${u}-warm)" opacity=".5"/>` },
        { name: 'Velká slavnost', cost: 5, icon: '🎉', line: 'Slavnost začíná! Celé moře slaví s námi!',
          art: u => A.pennants(535, 300, 800, 240, 30, ['#ff6f8e', '#ffd166', '#5ee7df', '#b39dff']) + A.pennants(800, 240, 1065, 300, 30, ['#5ee7df', '#ff6f8e', '#ffd166', '#b39dff']) +
            A.burst(380, 200, '#ffd166', 0) + A.burst(1220, 170, '#ff8fb0', -0.8) + A.burst(800, 70, '#7fe7ff', -1.6) + A.burst(600, 110, '#b39dff', -0.4) + A.burst(1010, 100, '#7be38a', -1.2) +
            A.jelly(u, 300, 430, 0.8, '#ff9ad5', -1) + A.jelly(u, 1300, 400, 0.8, '#b39dff', -2) + A.school(900, 380, 0.9, '#ffd23f', '#ff9f1c', true, 6) + A.seahorse(470, 470, 0.8, '#ffb347', '#ff7f50', false, -1) },
      ],
      front: () => A.bubbles(16, 17),
    },
  ];

  /* ---------- vykreslení ---------- */
  let uidCounter = 0;
  function render(idx, done, opts = {}) {
    const sc = SCENES[idx];
    const u = 'sc' + (++uidCounter);
    const p = sc.pal;
    const grp = (t, i) => (t.before ? `<g data-before="${i}"${i < done ? ' style="display:none"' : ''}>${t.before(u, p)}</g>` : '') +
      `<g data-task="${i}"${i < done ? '' : ' style="display:none"'}>${t.art(u, p)}</g>`;
    let s = `<svg class="scene-svg${opts.cls ? ' ' + opts.cls : ''}" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">`;
    s += A.defs(u, p) + sc.back(u, p) + (sc.ground ? sc.ground(u, p) : '');
    sc.tasks.forEach((t, i) => { if ((t.z || 0) < 0) s += grp(t, i); });
    s += sc.base(u, p);
    sc.tasks.forEach((t, i) => { if ((t.z || 0) >= 0) s += grp(t, i); });
    if (sc.front && !opts.noFront) s += sc.front(u, p);
    return s + '</svg>';
  }

  /* animované odhalení nového úkolu */
  function reveal(svg, i) {
    const NS = 'http://www.w3.org/2000/svg';
    const b = svg.querySelector(`[data-before="${i}"]`);
    if (b) { b.classList.add('vanish'); setTimeout(() => { b.style.display = 'none'; }, 650); }
    const g = svg.querySelector(`[data-task="${i}"]`);
    if (!g) return;
    g.style.display = '';
    Array.from(g.children).forEach((ch, k) => {
      const w = document.createElementNS(NS, 'g');
      w.setAttribute('class', 'pop-in');
      w.style.animationDelay = (0.25 + k * 0.12) + 's';
      g.insertBefore(w, ch);
      w.appendChild(ch);
    });
    // jiskřičky kolem nového objektu
    try {
      const bb = g.getBBox();
      const sp = document.createElementNS(NS, 'g');
      let h = '';
      for (let k = 0; k < 9; k++) {
        const x = bb.x + Math.random() * bb.width, y = bb.y + Math.random() * bb.height;
        h += `<g transform="translate(${x.toFixed(0)} ${y.toFixed(0)})"><path class="spark-once" style="animation-delay:${(0.2 + k * 0.08).toFixed(2)}s" d="M0 -22 C4 -5 5 -4 22 0 C5 4 4 5 0 22 C-4 5 -5 4 -22 0 C-5 -4 -4 -5 0 -22Z" fill="#fff8c9"/></g>`;
      }
      sp.innerHTML = h;
      svg.appendChild(sp);
      setTimeout(() => sp.remove(), 2200);
    } catch (e) { /* getBBox může selhat u skrytých prvků */ }
  }

  /* na výšku (portrait) zúžíme výřez, aby hlavní objekty zůstaly vidět */
  function fit(svg, w, h) {
    if (!svg) return;
    svg.setAttribute('viewBox', h > w * 1.05 ? '260 -120 1080 1020' : '0 0 1600 900');
  }

  const totalCost = idx => SCENES[idx].tasks.reduce((a, t) => a + t.cost, 0);

  CD.Scenes = { SCENES, COUNT: SCENES.length, render, reveal, fit, totalCost };
})(typeof window !== 'undefined' ? window : globalThis);
