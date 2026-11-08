/* =========================================================================
   Korálové sny – vektorová grafika (SVG generované kódem, žádné obrázky)
   Každá funkce vrací SVG řetězec. "u" = unikátní prefix id pro gradienty.
   Animace (sway, bob, swim…) jsou definované v css/style.css.
   ========================================================================= */
(function (root) {
  'use strict';
  const CD = root.CD = root.CD || {};
  const A = CD.Art = {};
  const tr = A.tr = (x, y, s = 1, r = 0) => `translate(${x} ${y})${r ? ` rotate(${r})` : ''}${s !== 1 ? ` scale(${s})` : ''}`;
  A.rng = seed => { let a = (seed >>> 0) || 1; return () => (a = (a * 16807) % 2147483647) / 2147483647; };
  const f1 = n => (+n).toFixed(1);

  /* ---------- gradienty ---------- */
  A.defs = (u, p) => `<defs>
<linearGradient id="${u}-water" gradientUnits="userSpaceOnUse" x1="0" y1="-260" x2="0" y2="900"><stop offset="0" stop-color="${p.top}"/><stop offset=".55" stop-color="${p.mid}"/><stop offset="1" stop-color="${p.deep}"/></linearGradient>
<linearGradient id="${u}-sand" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.sand1}"/><stop offset="1" stop-color="${p.sand2}"/></linearGradient>
<radialGradient id="${u}-glow"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset=".3" stop-color="${p.glow}" stop-opacity=".55"/><stop offset="1" stop-color="${p.glow}" stop-opacity="0"/></radialGradient>
<radialGradient id="${u}-warm"><stop offset="0" stop-color="#fffbe6"/><stop offset=".3" stop-color="#ffd76a" stop-opacity=".6"/><stop offset="1" stop-color="#ffb84a" stop-opacity="0"/></radialGradient>
<radialGradient id="${u}-pearl" cx=".35" cy=".3" r=".75"><stop offset="0" stop-color="#fff"/><stop offset=".55" stop-color="#f3eefc"/><stop offset="1" stop-color="#b6a2e0"/></radialGradient>
<radialGradient id="${u}-gold" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#fff6c4"/><stop offset=".5" stop-color="#ffcf3f"/><stop offset="1" stop-color="#d98a0b"/></radialGradient>
<linearGradient id="${u}-goldL" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe98a"/><stop offset="1" stop-color="#df970f"/></linearGradient>
<linearGradient id="${u}-ray" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".42"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<linearGradient id="${u}-wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bf8856"/><stop offset="1" stop-color="#6b4024"/></linearGradient>
<linearGradient id="${u}-rock" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.rock1 || '#8094ad'}"/><stop offset="1" stop-color="${p.rock2 || '#45536b'}"/></linearGradient>
<linearGradient id="${u}-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f7fcff"/><stop offset="1" stop-color="#a9cdee"/></linearGradient>
<linearGradient id="${u}-pink" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffc2d4"/><stop offset="1" stop-color="#ff7aa2"/></linearGradient>
</defs>`;

  /* ---------- pozadí ---------- */
  A.water = u => `<rect x="-500" y="-800" width="2600" height="1800" fill="url(#${u}-water)"/>`;
  A.rays = u => `<g class="rays">${[[120, 90], [470, 60], [820, 130], [1200, 80], [1480, 60]].map(([x, w]) =>
    `<polygon points="${x},-320 ${x + w},-320 ${x + w * 2.6 + 260},900 ${x + w * 1.2 + 260},900" fill="url(#${u}-ray)"/>`).join('')}</g>`;
  A.far = (c, y = 620, op = 0.55) => `<path d="M-500 ${y} C-300 ${y - 90} -150 ${y - 40} 0 ${y - 70} C120 ${y - 130} 260 ${y - 60} 380 ${y - 85} C520 ${y - 150} 640 ${y - 70} 760 ${y - 60} C900 ${y - 115} 1040 ${y - 145} 1160 ${y - 75} C1300 ${y - 40} 1400 ${y - 125} 1560 ${y - 95} C1700 ${y - 60} 1900 ${y - 100} 2100 ${y - 60} L2100 1000 L-500 1000Z" fill="${c}" opacity="${op}"/>`;
  A.sand = (u, y = 700) => `<path d="M-500 ${y + 10} C-200 ${y - 20} 100 ${y + 25} 420 ${y} C700 ${y - 25} 950 ${y + 20} 1250 ${y - 5} C1500 ${y - 25} 1800 ${y + 15} 2100 ${y} L2100 1000 L-500 1000Z" fill="url(#${u}-sand)"/>
<path d="M-500 ${y + 70} C0 ${y + 45} 400 ${y + 90} 800 ${y + 66} S1600 ${y + 45} 2100 ${y + 75}" fill="none" stroke="#fff" stroke-opacity=".2" stroke-width="7"/>
<path d="M-500 ${y + 140} C100 ${y + 120} 500 ${y + 160} 900 ${y + 135} S1700 ${y + 120} 2100 ${y + 145}" fill="none" stroke="#fff" stroke-opacity=".12" stroke-width="6"/>`;
  A.pebbles = (seed, n, y0 = 730, y1 = 880, cols = ['#e9c98a', '#cfa868', '#f3ddb0']) => {
    const R = A.rng(seed); let s = '';
    for (let i = 0; i < n; i++) s += `<ellipse cx="${f1(-100 + R() * 1800)}" cy="${f1(y0 + R() * (y1 - y0))}" rx="${f1(5 + R() * 9)}" ry="${f1(3 + R() * 5)}" fill="${cols[i % cols.length]}"/>`;
    return s;
  };
  A.bubbles = (n, seed = 1) => {
    const R = A.rng(seed); let s = '<g class="bubbles">';
    for (let i = 0; i < n; i++) {
      const d = 8 + R() * 9;
      s += `<circle class="bub" cx="${f1(-150 + R() * 1900)}" cy="${f1(920 + R() * 120)}" r="${f1(4 + R() * 11)}" style="animation-duration:${f1(d)}s;animation-delay:-${f1(R() * d)}s"/>`;
    }
    return s + '</g>';
  };
  A.sparkle = (x, y, s = 1, c = '#fff', delay = 0) => `<g transform="${tr(x, y, s)}"><path class="twinkle" style="animation-delay:${delay}s" d="M0 -18 C3 -4 4 -3 18 0 C4 3 3 4 0 18 C-3 4 -4 3 -18 0 C-4 -3 -3 -4 0 -18Z" fill="${c}"/></g>`;

  /* ---------- korály a rostliny ---------- */
  A.coral = (x, y, s, c, c2, delay = 0) => `<g transform="${tr(x, y, s)}"><g class="sway slow" style="animation-delay:${delay}s">
<path d="M0 0 C-4 -40 -28 -58 -38 -98 M0 0 C6 -50 0 -92 10 -140 M2 -62 C22 -80 40 -88 46 -122 M-16 -52 C-42 -58 -58 -70 -70 -90 M6 -98 C-8 -112 -14 -122 -12 -138" fill="none" stroke="${c}" stroke-width="17" stroke-linecap="round"/>
${[[-38, -98], [10, -140], [46, -122], [-70, -90], [-12, -138]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="11" fill="${c2}"/>`).join('')}
<path d="M-6 -20 C-8 -40 -20 -60 -28 -80" stroke="#fff" stroke-opacity=".35" stroke-width="5" fill="none" stroke-linecap="round"/></g></g>`;
  A.fan = (x, y, s, c, c2, delay = 0) => {
    let ribs = '';
    for (let a = -70; a <= 70; a += 14) { const r = a * Math.PI / 180; ribs += `<path d="M0 -14 L${f1(Math.sin(r) * 105)} ${f1(-14 - Math.cos(r) * 150)}" stroke="${c2}" stroke-width="4"/>`; }
    return `<g transform="${tr(x, y, s)}"><g class="sway slow" style="animation-delay:${delay}s">
<path d="M0 -6 C-80 -20 -120 -120 -70 -170 C-30 -205 30 -205 70 -170 C120 -120 80 -20 0 -6Z" fill="${c}"/>${ribs}
<path d="M-90 -90 C-40 -110 40 -110 90 -90 M-75 -140 C-30 -158 30 -158 75 -140 M-60 -50 C-20 -60 20 -60 60 -50" stroke="${c2}" stroke-width="3" fill="none"/>
<rect x="-7" y="-18" width="14" height="22" rx="6" fill="${c2}"/></g></g>`;
  };
  A.brain = (x, y, s, c, c2) => `<g transform="${tr(x, y, s)}"><path d="M-80 0 C-90 -60 -30 -90 0 -88 C40 -90 92 -60 80 0Z" fill="${c}"/>
<path d="M-60 -10 C-60 -40 -40 -30 -36 -55 C-30 -75 -10 -50 0 -70 C10 -50 30 -75 36 -55 C40 -30 60 -40 60 -10 M-40 -12 C-30 -30 -20 -20 -12 -40 C0 -30 10 -45 20 -30 C30 -20 36 -25 40 -12" stroke="${c2}" stroke-width="6" fill="none" stroke-linecap="round"/>
<ellipse cx="-30" cy="-60" rx="18" ry="8" fill="#fff" opacity=".3"/></g>`;
  A.tubes = (x, y, s, c, c2) => `<g transform="${tr(x, y, s)}">${[[-44, 80], [-20, 120], [6, 100], [30, 140], [54, 90]].map(([tx, h]) =>
    `<rect x="${tx - 12}" y="${-h}" width="24" height="${h}" rx="12" fill="${c}"/><ellipse cx="${tx}" cy="${-h + 6}" rx="10" ry="5" fill="${c2}"/>`).join('')}</g>`;
  A.deadCoral = (x, y, s) => `<g transform="${tr(x, y, s)}"><path d="M0 0 C-4 -30 -22 -44 -30 -72 M0 0 C6 -40 2 -64 10 -96 M2 -46 C18 -60 30 -64 34 -84 M-14 -40 C-30 -44 -42 -52 -50 -64" fill="none" stroke="#8d8f96" stroke-width="15" stroke-linecap="round"/>
<path d="M10 -96 l6 -8 M-30 -72 l-8 -4 M34 -84 l6 -6" stroke="#6f7178" stroke-width="5" stroke-linecap="round"/></g>`;
  A.seaweed = (x, y, h, c, delay = 0, w = 13) => `<g transform="translate(${x} ${y})"><g class="sway" style="animation-delay:${delay}s">
<path d="M0 0 C18 ${-h * 0.2} -18 ${-h * 0.4} 0 ${-h * 0.6} S16 ${-h * 0.85} 4 ${-h}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>
<ellipse cx="12" cy="${-h * 0.3}" rx="14" ry="6" fill="${c}" transform="rotate(-30 12 ${-h * 0.3})"/>
<ellipse cx="-12" cy="${-h * 0.55}" rx="14" ry="6" fill="${c}" transform="rotate(30 -12 ${-h * 0.55})"/>
<ellipse cx="12" cy="${-h * 0.78}" rx="12" ry="5" fill="${c}" transform="rotate(-30 12 ${-h * 0.78})"/></g></g>`;
  A.kelp = (x, y, cols, hs) => hs.map((h, i) => A.seaweed(x + i * 26 - hs.length * 13, y + (i % 2) * 6, h, cols[i % cols.length], -i * 0.7)).join('');
  A.anemone = (x, y, s, c, c2, delay = 0) => {
    let t = '';
    for (let a = -80; a <= 80; a += 16) {
      const r = a * Math.PI / 180, ex = Math.sin(r) * 62, ey = -40 - Math.cos(r) * 62;
      t += `<path d="M0 -36 Q${f1(ex * 0.4)} ${f1(ey - 20)} ${f1(ex)} ${f1(ey)}" stroke="${c}" stroke-width="10" fill="none" stroke-linecap="round"/><circle cx="${f1(ex)}" cy="${f1(ey)}" r="7" fill="${c2}"/>`;
    }
    return `<g transform="${tr(x, y, s)}"><g class="sway" style="animation-delay:${delay}s">${t}<path d="M-26 0 C-30 -20 -22 -38 0 -40 C22 -38 30 -20 26 0Z" fill="${c2}"/></g></g>`;
  };
  A.weeds = (x, y, s) => `<g transform="${tr(x, y, s)}"><path d="M-50 0 L-40 -60 L-30 -10 L-20 -90 L-8 -14 L4 -70 L14 -8 L26 -100 L34 -12 L46 -56 L54 0Z" fill="#4c4a2c"/>
<path d="M-36 0 L-28 -40 L-18 0 M18 0 L30 -52 L38 0" fill="#3a3a22"/></g>`;

  /* ---------- tvorové ---------- */
  A.fish = (x, y, s, c, c2, flip = false, delay = 0, anim = 'swim') => `<g transform="translate(${x} ${y})"><g class="${anim}" style="animation-delay:${delay}s"><g transform="scale(${flip ? -s : s} ${s})">
<path d="M28 0 L60 -24 Q52 0 60 24Z" fill="${c2}"/><ellipse cx="0" cy="0" rx="38" ry="25" fill="${c}"/>
<path d="M-8 -23 Q8 -46 26 -18Z" fill="${c2}"/><path d="M4 -24 Q-2 0 6 24" stroke="${c2}" stroke-width="6" fill="none"/><path d="M14 -20 Q10 0 16 20" stroke="${c2}" stroke-width="4" fill="none" opacity=".7"/>
<path d="M-6 8 Q6 22 14 10" fill="${c2}" opacity=".8"/>
<circle cx="-19" cy="-6" r="9" fill="#fff"/><circle cx="-21" cy="-6" r="5" fill="#1d2b4f"/><circle cx="-22.5" cy="-8" r="1.8" fill="#fff"/>
<path d="M-34 7 Q-29 11 -24 8" stroke="#1d2b4f" stroke-width="2.5" fill="none" stroke-linecap="round"/></g></g></g>`;
  A.school = (x, y, s, c, c2, flip, n = 6, delay = 0) => {
    let f = '';
    const R = A.rng(Math.round(x + y));
    for (let i = 0; i < n; i++) f += A.fish(f1((i % 3) * 70 + R() * 20), f1(Math.floor(i / 3) * 50 + (i % 2) * 20), 0.55, c, c2, flip, -i * 0.4, 'bob');
    return `<g transform="translate(${x} ${y}) scale(${s})"><g class="drift" style="animation-delay:${delay}s">${f}</g></g>`;
  };
  A.jelly = (u, x, y, s, c, delay = 0) => `<g transform="${tr(x, y, s)}"><g class="bob" style="animation-delay:${delay}s">
<circle r="95" fill="url(#${u}-glow)" class="glowpulse" style="animation-delay:${delay}s"/>
${[-22, -8, 8, 22].map((t, i) => `<path d="M${t} 2 q${i % 2 ? 9 : -9} 18 0 34 t0 34" stroke="${c}" stroke-width="5" fill="none" stroke-linecap="round" opacity=".85"/>`).join('')}
<path d="M-34 4 C-38 -48 38 -48 34 4 Q22 12 11 4 Q0 12 -11 4 Q-22 12 -34 4Z" fill="${c}"/>
<path d="M-20 -22 Q-12 -34 2 -34" stroke="#fff" stroke-opacity=".7" stroke-width="5" fill="none" stroke-linecap="round"/>
<circle cx="-10" cy="-8" r="3.5" fill="#1d2b4f"/><circle cx="10" cy="-8" r="3.5" fill="#1d2b4f"/><path d="M-5 0 Q0 5 5 0" stroke="#1d2b4f" stroke-width="2.5" fill="none" stroke-linecap="round"/></g></g>`;
  A.starfish = (x, y, s, c, rot = 0) => {
    let pts = [];
    for (let k = 0; k < 10; k++) { const r = (k % 2 ? 13 : 32), a = -Math.PI / 2 + k * Math.PI / 5; pts.push(`${f1(Math.cos(a) * r)},${f1(Math.sin(a) * r)}`); }
    return `<g transform="${tr(x, y, s, rot)}"><polygon points="${pts.join(' ')}" fill="${c}" stroke="${c}" stroke-width="9" stroke-linejoin="round"/>
<circle cx="0" cy="-16" r="2.5" fill="#fff" opacity=".7"/><circle cx="14" cy="-4" r="2.5" fill="#fff" opacity=".7"/><circle cx="-14" cy="-4" r="2.5" fill="#fff" opacity=".7"/><circle cx="8" cy="12" r="2.5" fill="#fff" opacity=".7"/><circle cx="-8" cy="12" r="2.5" fill="#fff" opacity=".7"/></g>`;
  };
  A.seahorse = (x, y, s, c, c2, flip = false, delay = 0) => `<g transform="translate(${x} ${y})"><g class="bob" style="animation-delay:${delay}s"><g transform="scale(${flip ? -s : s} ${s})">
<path d="M10 -60 C34 -60 38 -36 24 -28 C40 -14 38 8 22 22 C10 34 14 54 28 56 C40 58 42 42 32 40" fill="none" stroke="${c}" stroke-width="20" stroke-linecap="round"/>
<path d="M34 -24 C52 -20 52 0 36 4Z" fill="${c2}"/>
<path d="M2 -66 C-10 -70 -20 -64 -40 -62 L-40 -52 C-22 -52 -10 -48 2 -46Z" fill="${c}"/>
<circle cx="8" cy="-56" r="16" fill="${c}"/><path d="M14 -72 l6 -10 l4 10 l8 -6 l-2 12" fill="${c2}"/>
<circle cx="4" cy="-58" r="5" fill="#fff"/><circle cx="3" cy="-58" r="3" fill="#1d2b4f"/>
<path d="M18 -36 h12 M22 -18 h12 M18 0 h12" stroke="${c2}" stroke-width="3" stroke-linecap="round"/></g></g></g>`;
  /* průvodkyně – želvička Tóňa */
  A.turtle = (cls = '') => `<svg viewBox="0 0 200 210" class="turtle ${cls}" aria-hidden="true"><g class="bob">
<ellipse cx="100" cy="132" rx="76" ry="60" fill="#1f7f5c"/>
<path d="M36 120 C2 104 -2 144 18 154 C32 160 44 144 50 134Z" fill="#7fd99a"/>
<g class="wave"><path d="M164 120 C196 98 206 130 188 144 C174 154 160 142 152 134Z" fill="#7fd99a"/></g>
<path d="M66 172 C52 194 78 200 86 184Z M134 172 C148 194 122 200 114 184Z" fill="#7fd99a"/>
<ellipse cx="100" cy="138" rx="58" ry="48" fill="#3fae78"/>
<ellipse cx="100" cy="144" rx="41" ry="35" fill="#f8eab8"/>
<path d="M72 134 H128 M70 154 H130 M100 110 V178" stroke="#e5cf8c" stroke-width="3"/>
<circle cx="100" cy="74" r="48" fill="#8fe3a8"/>
<circle cx="126" cy="36" r="5" fill="#6cc98a"/><circle cx="70" cy="40" r="4" fill="#6cc98a"/><circle cx="58" cy="60" r="3" fill="#6cc98a"/>
<g transform="translate(132 34)"><circle r="7" cy="-9" fill="#ff8fb0"/><circle r="7" cx="9" fill="#ff8fb0"/><circle r="7" cy="9" fill="#ff8fb0"/><circle r="7" cx="-9" fill="#ff8fb0"/><circle r="6" fill="#ffd34d"/></g>
<ellipse cx="80" cy="72" rx="14" ry="16" fill="#fff"/><ellipse cx="120" cy="72" rx="14" ry="16" fill="#fff"/>
<circle cx="83" cy="75" r="8.5" fill="#1d2b4f"/><circle cx="117" cy="75" r="8.5" fill="#1d2b4f"/>
<circle cx="86" cy="71" r="3" fill="#fff"/><circle cx="120" cy="71" r="3" fill="#fff"/>
<ellipse cx="66" cy="94" rx="9" ry="5" fill="#ff9fb0" opacity=".75"/><ellipse cx="134" cy="94" rx="9" ry="5" fill="#ff9fb0" opacity=".75"/>
<path d="M88 96 Q100 108 112 96" stroke="#1d2b4f" stroke-width="4.5" fill="none" stroke-linecap="round"/></g></svg>`;

  /* ---------- předměty ---------- */
  A.scallop = (x, y, s, c, c2, rot = 0) => {
    let ribs = '';
    [-32, -19, -6, 6, 19, 32].forEach(a => { ribs += `<path d="M0 -4 L${a} ${f1(-70 + Math.abs(a) * 0.45)}" stroke="${c2}" stroke-width="3.5" stroke-linecap="round"/>`; });
    return `<g transform="${tr(x, y, s, rot)}"><path d="M0 0 L-44 -34 C-52 -62 -30 -80 0 -82 C30 -80 52 -62 44 -34Z" fill="${c}"/>${ribs}<path d="M-12 -2 L12 -2 L7 8 L-7 8Z" fill="${c2}"/></g>`;
  };
  A.rock = (x, y, w, h, c, c2) => `<g transform="translate(${x} ${y})"><path d="M${-w / 2} 0 C${-w / 2} ${-h * 0.8} ${-w * 0.25} ${-h * 1.05} 0 ${-h} C${w * 0.3} ${-h * 1.05} ${w / 2} ${-h * 0.75} ${w / 2} 0Z" fill="${c}"/>
<path d="M${-w * 0.3} ${-h * 0.55} C${-w * 0.2} ${-h * 0.85} ${w * 0.05} ${-h * 0.9} ${w * 0.15} ${-h * 0.85}" stroke="${c2}" stroke-width="6" fill="none" stroke-linecap="round" opacity=".6"/></g>`;
  A.net = (x, y, w, h) => {
    let s = `<g transform="translate(${x} ${y})" opacity=".9"><path d="M${-w / 2} 0 C${-w / 3} ${-h} ${w / 3} ${-h * 1.1} ${w / 2} 0Z" fill="#6b5a3a" opacity=".35"/>`;
    for (let i = -4; i <= 4; i++) s += `<path d="M${i * w / 9} 0 Q${i * w / 9 + 20} ${-h * 0.6} ${i * w / 12 + 30} ${-h * 0.95}" stroke="#8a744c" stroke-width="3" fill="none"/>`;
    for (let j = 1; j < 4; j++) s += `<path d="M${-w / 2 + j * 12} ${-j * h / 4} Q0 ${-j * h / 4 - 25} ${w / 2 - j * 12} ${-j * h / 4}" stroke="#8a744c" stroke-width="3" fill="none"/>`;
    return s + '</g>';
  };
  A.boot = (x, y, s, rot = 0) => `<g transform="${tr(x, y, s, rot)}"><path d="M-20 -70 L14 -70 L16 -20 C40 -18 60 -10 62 0 L-22 0Z" fill="#6a4a36"/><path d="M-22 -8 H62" stroke="#3e2a1e" stroke-width="7"/><path d="M-12 -60 h20 M-12 -48 h20 M-12 -36 h20" stroke="#c9b48a" stroke-width="3"/></g>`;
  A.bench = (u, x, y, s) => `<g transform="${tr(x, y, s)}">
<ellipse cx="0" cy="8" rx="190" ry="20" fill="#000" opacity=".12"/>
${A.scallop(-110, -40, 1.5, '#ff9bb8', '#ff6f96', -14)}${A.scallop(0, -54, 1.8, '#ffb6c9', '#ff7fa2')}${A.scallop(110, -40, 1.5, '#ff9bb8', '#ff6f96', 14)}
<path d="M-170 -50 C-170 -80 170 -80 170 -50 L160 0 L-160 0Z" fill="#f2d7a2"/><path d="M-170 -50 C-150 -70 150 -70 170 -50 C150 -38 -150 -38 -170 -50Z" fill="#fbe8bf"/>
<circle cx="0" cy="-30" r="14" fill="url(#${u}-pearl)"/><circle cx="-80" cy="-24" r="9" fill="url(#${u}-pearl)"/><circle cx="80" cy="-24" r="9" fill="url(#${u}-pearl)"/></g>`;
  A.clam = (u, x, y, s) => `<g transform="${tr(x, y, s)}">
<circle cx="0" cy="-50" r="110" fill="url(#${u}-glow)" class="glowpulse"/>
<path d="M-110 0 C-120 -60 -70 -150 0 -150 C70 -150 120 -60 110 0Z" fill="#c8a7f0"/>
${[-80, -48, -16, 16, 48, 80].map(a => `<path d="M0 -6 L${a} ${-140 + Math.abs(a) * 0.5}" stroke="#a580dc" stroke-width="5"/>`).join('')}
<path d="M-118 0 C-100 40 100 40 118 0Z" fill="#b28fe6"/><path d="M-100 0 C-60 12 60 12 100 0" stroke="#fff" stroke-opacity=".4" stroke-width="5" fill="none"/>
<circle cx="0" cy="-10" r="34" fill="url(#${u}-pearl)"/><circle cx="-10" cy="-22" r="8" fill="#fff" opacity=".9"/></g>`;
  A.clamClosed = (x, y, s) => `<g transform="${tr(x, y, s)}"><path d="M-118 0 C-110 -50 110 -50 118 0 C100 40 -100 40 -118 0Z" fill="#8c7aa6"/><path d="M-110 0 H110" stroke="#5e4e78" stroke-width="5"/></g>`;
  A.lanternString = (u, x1, x2, y, sag, n, cols) => {
    const mid = (x1 + x2) / 2;
    let s = `<path d="M${x1} ${y} Q${mid} ${y + sag * 2} ${x2} ${y}" stroke="#e9d9b0" stroke-width="4" fill="none"/>`;
    for (let i = 1; i < n; i++) {
      const t = i / n, px = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * mid + t * t * x2, py = (1 - t) * (1 - t) * y + 2 * (1 - t) * t * (y + sag * 2) + t * t * y;
      s += `<g transform="translate(${f1(px)} ${f1(py)})"><circle r="34" fill="url(#${u}-glow)" class="glowpulse" style="animation-delay:${-i * 0.3}s"/><line y1="0" y2="10" stroke="#e9d9b0" stroke-width="3"/><circle cy="22" r="13" fill="${cols[i % cols.length]}"/><circle cx="-4" cy="18" r="4" fill="#fff" opacity=".8"/></g>`;
    }
    return s;
  };
  A.rug = (x, y, w, h) => `<g transform="translate(${x} ${y})"><ellipse rx="${w / 2}" ry="${h / 2}" fill="#3fae78"/><ellipse rx="${w / 2 - 18}" ry="${h / 2 - 9}" fill="none" stroke="#bff0c9" stroke-width="5" stroke-dasharray="14 10"/><ellipse rx="${w / 2 - 60}" ry="${h / 2 - 24}" fill="#5cc98f"/></g>`;
  A.throne = (u, x, y, s) => {
    let ribs = '';
    for (let a = -60; a <= 60; a += 15) { const r = a * Math.PI / 180; ribs += `<path d="M0 -40 L${f1(Math.sin(r) * 140)} ${f1(-40 - Math.cos(r) * 190)}" stroke="#e58a3c" stroke-width="6"/>`; }
    return `<g transform="${tr(x, y, s)}"><ellipse cx="0" cy="6" rx="150" ry="18" fill="#000" opacity=".15"/>
<path d="M0 -36 C-110 -40 -170 -140 -120 -200 C-80 -250 80 -250 120 -200 C170 -140 110 -40 0 -36Z" fill="url(#${u}-goldL)"/>${ribs}
<circle cx="0" cy="-240" r="18" fill="url(#${u}-pearl)"/>
<path d="M-110 -40 C-110 -70 110 -70 110 -40 L100 0 L-100 0Z" fill="#c14b7b"/><path d="M-110 -40 C-90 -60 90 -60 110 -40 C90 -26 -90 -26 -110 -40Z" fill="#e66b9b"/>
<circle cx="-110" cy="-30" r="12" fill="url(#${u}-pearl)"/><circle cx="110" cy="-30" r="12" fill="url(#${u}-pearl)"/></g>`;
  };
  A.boulder = (x, y, r) => `<g transform="translate(${x} ${y})"><ellipse cx="0" cy="0" rx="${r * 1.1}" ry="${r * 0.22}" fill="#000" opacity=".2"/><path d="M${-r} 0 C${-r * 1.1} ${-r * 1.2} ${r * 0.9} ${-r * 1.4} ${r} 0Z" fill="#6c6688"/>
<path d="M${-r * 0.6} ${-r * 0.5} C${-r * 0.4} ${-r * 0.9} 0 ${-r} ${r * 0.3} ${-r * 0.95}" stroke="#8d88aa" stroke-width="10" fill="none" stroke-linecap="round"/>
<path d="M${r * 0.2} ${-r * 0.3} l${r * 0.2} ${r * 0.1} M${-r * 0.3} ${-r * 0.2} l${-r * 0.1} ${r * 0.15}" stroke="#4d4866" stroke-width="6" stroke-linecap="round"/>
<path d="M${-r * 0.9} ${-r * 0.4} C${-r * 0.7} ${-r * 0.7} ${-r * 0.4} ${-r * 0.8} ${-r * 0.2} ${-r * 0.75} L${-r * 0.4} ${-r * 0.55}Z" fill="#5d8a5a" opacity=".8"/></g>`;
  A.anchor = (x, y, s, rot = 0) => `<g transform="${tr(x, y, s, rot)}"><g fill="none" stroke="#56606e" stroke-width="16" stroke-linecap="round">
<circle cx="0" cy="-170" r="18"/><path d="M0 -152 V0"/><path d="M-50 -120 H50"/><path d="M-80 -50 C-70 0 -30 10 0 10 C30 10 70 0 80 -50"/></g>
<path d="M-92 -40 L-80 -70 L-66 -42Z M92 -40 L80 -70 L66 -42Z" fill="#56606e"/><path d="M-6 -150 V-10" stroke="#8a95a6" stroke-width="4"/>
<path d="M18 -170 C60 -190 70 -230 110 -240" stroke="#7b8594" stroke-width="7" fill="none" stroke-dasharray="10 6"/></g>`;
  A.hull = (u) => `<path d="M-340 -40 L340 -40 C330 40 270 120 160 140 L-200 140 C-300 120 -340 40 -340 -40Z" fill="url(#${u}-wood)"/>
<path d="M-336 0 H334 M-322 40 H318 M-292 80 H288 M-240 116 H226" stroke="#4e2f1a" stroke-opacity=".45" stroke-width="4"/>
<path d="M180 -40 L180 -150 L320 -150 L346 -40Z" fill="#a06d40"/><path d="M180 -150 L320 -150 L326 -138 L180 -138Z" fill="#7a4f2c"/>
<rect x="205" y="-128" width="34" height="40" rx="6" fill="#2b4a5a"/><rect x="262" y="-128" width="34" height="40" rx="6" fill="#2b4a5a"/>
<rect x="-352" y="-62" width="704" height="24" rx="9" fill="#8a5a34"/>
${[-210, -90, 30].map(px => `<circle cx="${px}" cy="40" r="19" fill="#26404e" stroke="#c9a24a" stroke-width="6"/>`).join('')}`;
  A.holes = () => `<path d="M-180 70 l30 -30 l26 12 l20 -18 l10 36 l-24 28 l-34 -4Z" fill="#1b1410"/><path d="M50 100 l24 -26 l34 8 l6 30 l-30 14Z" fill="#1b1410"/><path d="M230 30 l20 -14 l26 10 l-6 30 l-30 4Z" fill="#1b1410"/>
<path d="M-200 60 l-30 -20 M-120 40 l26 -30 M110 90 l30 -20" stroke="#2b1c12" stroke-width="5" stroke-linecap="round"/>`;
  A.patches = () => `<g><rect x="-200" y="34" width="110" height="34" rx="5" fill="#d9a46a" transform="rotate(-6 -145 51)"/><rect x="-196" y="70" width="100" height="30" rx="5" fill="#cf9659" transform="rotate(4 -146 85)"/>
<rect x="36" y="76" width="96" height="34" rx="5" fill="#d9a46a" transform="rotate(5 84 93)"/><rect x="220" y="14" width="76" height="32" rx="5" fill="#cf9659"/>
${[[-190, 44], [-100, 44], [-186, 80], [-104, 84], [46, 86], [122, 92], [228, 24], [288, 24]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="4" fill="#5b5f66"/>`).join('')}</g>`;
  A.mast = () => `<rect x="-14" y="-480" width="28" height="430" rx="8" fill="#8a5a34"/><rect x="-170" y="-400" width="340" height="16" rx="8" fill="#7a4f2c"/>
<path d="M-160 -386 C-120 -300 -130 -230 -150 -180 L150 -180 C130 -230 120 -300 160 -386Z" fill="#fbf1d8"/><path d="M-140 -300 H140 M-146 -240 H146" stroke="#e5d6b0" stroke-width="4"/>
<rect x="40" y="-330" width="50" height="40" fill="#f0dfb6" stroke="#d1bb88" stroke-width="3" stroke-dasharray="6 4"/>
<path d="M-40 -460 h80 l-10 30 h-60z" fill="#7a4f2c"/><rect x="-150" y="-186" width="300" height="12" rx="6" fill="#7a4f2c"/>
<path d="M0 -470 L-330 -60 M0 -470 L330 -60" stroke="#d8c79c" stroke-width="3"/>`;
  A.brokenMast = (x, y) => `<g transform="translate(${x} ${y}) rotate(-68)"><rect x="-14" y="-300" width="28" height="300" rx="8" fill="#7b5233"/><path d="M-14 -300 l8 -20 l8 14 l6 -18 l6 24Z" fill="#7b5233"/>
<rect x="-110" y="-230" width="220" height="14" rx="7" fill="#6a4529" transform="rotate(12 0 -223)"/><path d="M-90 -210 C-60 -170 -40 -140 -70 -100 L30 -120 C10 -150 20 -180 40 -205Z" fill="#cfc2a2" opacity=".85"/></g>`;
  A.stump = () => `<path d="M-14 -50 L-14 -110 l8 10 l6 -16 l8 12 l6 -8 L14 -50Z" fill="#7b5233"/>`;
  A.flag = (u) => `<g transform="translate(0 -480)"><rect x="-4" y="-80" width="8" height="84" fill="#7a4f2c"/><g class="flutter"><path d="M4 -80 C40 -90 70 -70 110 -80 C100 -60 100 -46 110 -30 C70 -20 40 -40 4 -30Z" fill="#ff6f8e"/><circle cx="48" cy="-55" r="12" fill="url(#${u}-gold)"/></g><circle cx="0" cy="-84" r="9" fill="url(#${u}-gold)"/></g>`;
  A.pennants = (x1, y1, x2, y2, sag, cols) => {
    const mid = { x: (x1 + x2) / 2, y: (y1 + y2) / 2 + sag };
    let s = `<path d="M${x1} ${y1} Q${mid.x} ${mid.y + sag} ${x2} ${y2}" stroke="#f2e6c6" stroke-width="3" fill="none"/>`;
    const n = 10;
    for (let i = 1; i < n; i++) {
      const t = i / n, px = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * mid.x + t * t * x2, py = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * (mid.y + sag) + t * t * y2;
      s += `<path d="M${f1(px - 14)} ${f1(py)} L${f1(px + 14)} ${f1(py)} L${f1(px)} ${f1(py + 30)}Z" fill="${cols[i % cols.length]}"/>`;
    }
    return s;
  };
  A.chest = (u, x, y, s) => `<g transform="${tr(x, y, s)}"><circle cx="0" cy="-70" r="140" fill="url(#${u}-warm)" class="glowpulse"/>
<ellipse cx="0" cy="6" rx="110" ry="16" fill="#000" opacity=".2"/>
<path d="M-90 -110 C-90 -170 90 -170 90 -110 L84 -126 C70 -190 -70 -190 -84 -126Z" fill="#8a4f2a" transform="rotate(-18 -90 -110)"/>
<rect x="-92" y="-100" width="184" height="100" rx="10" fill="#9a5a30"/><rect x="-92" y="-100" width="184" height="18" fill="url(#${u}-goldL)"/>
<rect x="-12" y="-80" width="24" height="34" rx="4" fill="url(#${u}-goldL)"/>
<path d="M-80 -100 C-60 -140 60 -140 80 -100Z" fill="url(#${u}-gold)"/>
${[[-50, -118], [-20, -128], [12, -124], [44, -116], [-34, -108], [28, -106]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="13" fill="url(#${u}-gold)" stroke="#c98a10" stroke-width="2"/>`).join('')}
<circle cx="-4" cy="-140" r="12" fill="url(#${u}-pearl)"/>
${[[110, -10], [130, 0], [-120, -4]].map(([a, b]) => `<ellipse cx="${a}" cy="${b}" rx="13" ry="7" fill="url(#${u}-gold)"/>`).join('')}</g>`;
  A.lantern = (u, x, y, s = 1, delay = 0) => `<g transform="${tr(x, y, s)}"><line x1="0" y1="-40" x2="0" y2="0" stroke="#4e3a26" stroke-width="3"/><circle cy="30" r="60" fill="url(#${u}-warm)" class="glowpulse" style="animation-delay:${delay}s"/>
<path d="M-16 6 h32 l6 12 v28 l-6 12 h-32 l-6 -12 v-28z" fill="#ffe7a0" stroke="#7a5228" stroke-width="5"/><rect x="-12" y="0" width="24" height="8" rx="3" fill="#7a5228"/></g>`;
  A.gazebo = (u, x, y, s) => `<g transform="${tr(x, y, s)}"><ellipse cx="0" cy="0" rx="230" ry="40" fill="#e9d5b4"/><ellipse cx="0" cy="-8" rx="210" ry="30" fill="#f6e6ca"/>
<rect x="-150" y="-300" width="22" height="300" rx="10" fill="#ffb3c8" opacity=".75"/><rect x="128" y="-300" width="22" height="300" rx="10" fill="#ffb3c8" opacity=".75"/>
<rect x="-196" y="-290" width="30" height="300" rx="12" fill="url(#${u}-pink)"/><rect x="166" y="-290" width="30" height="300" rx="12" fill="url(#${u}-pink)"/>
<path d="M-240 -280 C-230 -440 230 -440 240 -280Z" fill="url(#${u}-pink)"/>
${[-200, -140, -80, -20, 40, 100, 160, 220].map(px => `<path d="M${px - 30} -282 q30 34 60 0" fill="#ff8fb0"/>`).join('')}
<path d="M-150 -330 C-110 -400 110 -400 150 -330" stroke="#fff" stroke-opacity=".45" stroke-width="10" fill="none" stroke-linecap="round"/>
<circle cx="0" cy="-418" r="24" fill="url(#${u}-pearl)"/><circle cx="0" cy="-418" r="60" fill="url(#${u}-glow)" class="glowpulse"/></g>`;
  A.fountain = (u, x, y, s) => {
    let b = '';
    for (let i = 0; i < 9; i++) b += `<circle class="bub-short" cx="${f1(-20 + (i * 37) % 40)}" cy="-150" r="${6 + (i % 3) * 3}" style="animation-delay:-${f1(i * 0.33)}s"/>`;
    return `<g transform="${tr(x, y, s)}"><rect x="-18" y="-110" width="36" height="110" rx="10" fill="#bfe4f0"/>
${A.scallop(0, -100, 1.6, '#9fd8ff', '#5fb4e6', 180)}<ellipse cx="0" cy="-104" rx="64" ry="12" fill="#e6f8ff"/>${b}
<ellipse cx="0" cy="0" rx="70" ry="14" fill="#9cc9d8"/></g>`;
  };
  A.stonePath = (x, y0, y1, n) => {
    let s = '';
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1), y = y0 + (y1 - y0) * t, sc = 1.6 - t * 0.9, dx = Math.sin(i * 1.7) * 40 * sc;
      s += `<ellipse cx="${f1(x + dx)}" cy="${f1(y)}" rx="${f1(46 * sc)}" ry="${f1(17 * sc)}" fill="#d7d2e8"/><ellipse cx="${f1(x + dx - 8 * sc)}" cy="${f1(y - 4 * sc)}" rx="${f1(20 * sc)}" ry="${f1(5 * sc)}" fill="#fff" opacity=".6"/>`;
    }
    return s;
  };
  A.hall = (u) => `<g><rect x="-200" y="-300" width="400" height="300" fill="url(#${u}-wall)"/>
<path d="M-150 -300 C-150 -460 150 -460 150 -300Z" fill="url(#${u}-wall)"/><path d="M-150 -300 C-150 -460 150 -460 150 -300" stroke="#8fb9e0" stroke-width="8" fill="none"/>
<rect x="-210" y="-312" width="420" height="22" rx="8" fill="#d5e8f8"/>
${[-140, 140].map(px => `<path d="M${px - 26} -110 V-210 C${px - 26} -246 ${px + 26} -246 ${px + 26} -210 V-110Z" fill="#3a6fae"/>`).join('')}
<path d="M-70 0 V-170 C-70 -240 70 -240 70 0Z" fill="#1d3f74"/>
<circle cx="0" cy="-470" r="16" fill="url(#${u}-gold)"/><rect x="-4" y="-470" width="8" height="20" fill="#e0a520"/></g>`;
  A.stairs = (x, y) => {
    let s = '';
    for (let i = 0; i < 5; i++) s += `<path d="M${x - 200 - i * 50} ${y + i * 36} H${x + 200 + i * 50} L${x + 210 + i * 50} ${y + i * 36 + 36} H${x - 210 - i * 50}Z" fill="${i % 2 ? '#cfe2f4' : '#e2eefa'}"/>`;
    return s;
  };
  A.rubble = (x, y) => `${A.rock(x - 140, y + 60, 120, 70, '#7e8597', '#a2a9ba')}${A.rock(x + 60, y + 100, 170, 90, '#6e7588', '#959cae')}${A.rock(x + 190, y + 40, 90, 60, '#7e8597', '#a2a9ba')}
<path d="M${x - 260} ${y + 160} C${x - 160} ${y + 90} ${x + 160} ${y + 100} ${x + 280} ${y + 160}Z" fill="#cdb98c"/>${A.weeds(x - 60, y + 130, 1.1)}${A.weeds(x + 230, y + 150, 0.8)}`;
  A.tower = (u, x, y, h, c) => `<g transform="translate(${x} ${y})"><rect x="-60" y="${-h}" width="120" height="${h}" fill="url(#${u}-wall)"/><rect x="-70" y="${-h - 16}" width="140" height="22" rx="7" fill="#d5e8f8"/>
<path d="M-74 ${-h - 16} L0 ${-h - 190} L74 ${-h - 16}Z" fill="${c}"/><path d="M-40 ${-h - 30} L0 ${-h - 160}" stroke="#fff" stroke-opacity=".4" stroke-width="10" stroke-linecap="round"/>
<circle cx="0" cy="${-h - 196}" r="12" fill="url(#${u}-gold)"/>
${[0.3, 0.6].map(t => `<path d="M-20 ${-h * t + 40} V${-h * t} C-20 ${-h * t - 30} 20 ${-h * t - 30} 20 ${-h * t} V${-h * t + 40}Z" fill="#3a6fae"/>`).join('')}</g>`;
  A.gate = (u) => `<g><circle cx="0" cy="-110" r="170" fill="url(#${u}-warm)" class="glowpulse"/><path d="M-80 0 V-170 C-80 -250 80 -250 80 0" stroke="url(#${u}-goldL)" stroke-width="18" fill="none"/>
${[-48, -16, 16, 48].map(px => `<path d="M${px} 0 V${-200 + Math.abs(px) * 0.6}" stroke="url(#${u}-goldL)" stroke-width="8"/>`).join('')}
<path d="M-70 -120 H70" stroke="url(#${u}-goldL)" stroke-width="8"/>${A.scallop(0, -232, 0.7, '#ffd34d', '#e09a12')}</g>`;
  A.column = (u, x, y, h, c, c2) => {
    let bands = '';
    for (let yy = -30; yy > -h + 20; yy -= 46) bands += `<path d="M-30 ${yy} Q0 ${yy - 22} 30 ${yy - 10}" stroke="${c2}" stroke-width="10" fill="none"/>`;
    return `<g transform="translate(${x} ${y})"><rect x="-34" y="${-h}" width="68" height="${h}" rx="14" fill="${c}"/>${bands}<rect x="-48" y="${-h - 14}" width="96" height="22" rx="10" fill="${c2}"/>
<rect x="-48" y="-12" width="96" height="20" rx="8" fill="${c2}"/>${A.scallop(0, -h - 14, 0.75, '#fff3f7', c2)}<circle cx="0" cy="${-h - 50}" r="10" fill="url(#${u}-pearl)"/></g>`;
  };
  A.rainbow = (x, y, r) => ['#ff7b9c', '#ffb36b', '#ffe066', '#7be38a', '#6ad0ff', '#a98bff'].map((c, i) =>
    `<path d="M${x - r + i * 22} ${y} A${r - i * 22} ${r - i * 22} 0 0 1 ${x + r - i * 22} ${y}" stroke="${c}" stroke-width="22" fill="none" opacity=".55"/>`).join('');
  A.burst = (x, y, c, delay = 0) => {
    let s = `<g transform="translate(${x} ${y})"><g class="burst" style="animation-delay:${delay}s">`;
    for (let k = 0; k < 10; k++) { const a = k * Math.PI / 5; s += `<circle cx="${f1(Math.cos(a) * 60)}" cy="${f1(Math.sin(a) * 60)}" r="9" fill="${c}"/>`; }
    return s + `<circle r="16" fill="#fff"/></g></g>`;
  };

  /* ---------- UI grafika ---------- */
  A.chestIcon = () => `<svg viewBox="0 0 64 56" class="chest-ico" aria-hidden="true"><path d="M6 22 C6 6 58 6 58 22Z" fill="#c9773a"/><rect x="4" y="20" width="56" height="32" rx="6" fill="#a85a2a"/>
<rect x="4" y="20" width="56" height="7" fill="#ffd34d"/><rect x="27" y="24" width="10" height="14" rx="3" fill="#ffd34d"/><path d="M14 8 V20 M50 8 V20" stroke="#ffd34d" stroke-width="5"/></svg>`;
})(typeof window !== 'undefined' ? window : globalThis);
