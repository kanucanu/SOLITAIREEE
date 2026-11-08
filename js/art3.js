/* =========================================================================
   Korálové sny – grafika světa Bouřlivá hladina (SVG generované kódem)
   Scény nad hladinou: obloha, moře, pláže a útesy. Navazuje na art.js a art2.js.
   ========================================================================= */
(function (root) {
  'use strict';
  const CD = root.CD = root.CD || {};
  const A = CD.Art;
  const tr = A.tr;
  const f1 = n => (+n).toFixed(1);
  const eyes = (dx, y, r = 6) => `<circle cx="${-dx}" cy="${y}" r="${r}" fill="#fff"/><circle cx="${dx}" cy="${y}" r="${r}" fill="#fff"/><circle cx="${-dx + 1}" cy="${y + 1}" r="${r * 0.55}" fill="#1d2b4f"/><circle cx="${dx + 1}" cy="${y + 1}" r="${r * 0.55}" fill="#1d2b4f"/><circle cx="${-dx + 2}" cy="${y - 1}" r="${r * 0.2}" fill="#fff"/><circle cx="${dx + 2}" cy="${y - 1}" r="${r * 0.2}" fill="#fff"/>`;
  const eye1 = (x, y, r = 6) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff"/><circle cx="${x + 1}" cy="${y + 1}" r="${r * 0.55}" fill="#1d2b4f"/><circle cx="${x + 2}" cy="${y - 1}" r="${r * 0.2}" fill="#fff"/>`;
  const smile = (y, w = 7) => `<path d="M${-w} ${y} Q0 ${y + w * 0.8} ${w} ${y}" stroke="#1d2b4f" stroke-width="3" fill="none" stroke-linecap="round"/>`;

  /* ---------- obloha a moře ---------- */
  A.sky = (u, c1, c2, H = 430) => `<defs><linearGradient id="${u}-sky" gradientUnits="userSpaceOnUse" x1="0" y1="-500" x2="0" y2="${H}"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient>
</defs>
<rect x="-500" y="-800" width="2600" height="${H + 820}" fill="url(#${u}-sky)"/>`;
  A.sea = (H, c1, c2, seed = 1) => {
    const R = A.rng(seed); let lines = '';
    for (let k = 0; k < 7; k++) {
      const y = H + 18 + k * k * 9 + R() * 6, op = 0.35 - k * 0.035;
      lines += `<path class="swell" style="animation-delay:${f1(-R() * 4)}s" d="M-520 ${f1(y)} q 40 -9 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0" stroke="#fff" stroke-opacity="${f1(op)}" stroke-width="${f1(3 + k * 0.6)}" fill="none"/>`;
    }
    return `<path d="M-500 ${H} L2100 ${H} L2100 1000 L-500 1000Z" fill="${c2}"/><path d="M-500 ${H} L2100 ${H} L2100 ${H + 230} C1200 ${H + 260} 400 ${H + 200} -500 ${H + 240}Z" fill="${c1}" opacity=".85"/>
<path d="M-500 ${H} L2100 ${H}" stroke="#fff" stroke-opacity=".7" stroke-width="3"/>${lines}`;
  };
  A.sun = (u, x, y, r, c = '#ffe066') => `<circle cx="${x}" cy="${y}" r="${r * 2.6}" fill="url(#${u}-warm)" class="glowpulse"/><circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/><circle cx="${x - r * 0.3}" cy="${y - r * 0.3}" r="${r * 0.35}" fill="#fff" opacity=".35"/>`;
  A.moon = (u, x, y, r) => `<circle cx="${x}" cy="${y}" r="${r * 2.4}" fill="url(#${u}-glow)" opacity=".5"/><circle cx="${x}" cy="${y}" r="${r}" fill="#fff6d6"/><circle cx="${x - r * 0.3}" cy="${y + r * 0.2}" r="${r * 0.18}" fill="#e8dcb0"/><circle cx="${x + r * 0.25}" cy="${y - r * 0.35}" r="${r * 0.12}" fill="#e8dcb0"/>`;
  A.stars = (n, seed, H = 420) => {
    const R = A.rng(seed); let s = '';
    for (let i = 0; i < n; i++) s += A.sparkle(f1(-200 + R() * 2000), f1(-400 + R() * (H + 300)), 0.25 + R() * 0.35, '#fff8d6', f1(-R() * 2));
    return s;
  };
  A.cloud = (x, y, s, c = '#fff', op = 0.95) => `<g transform="${tr(x, y, s)}" opacity="${op}"><path d="M-110 20 C-130 20 -138 -6 -116 -14 C-122 -44 -84 -58 -66 -38 C-58 -76 2 -84 14 -42 C30 -66 76 -56 74 -24 C104 -30 122 4 100 20Z" fill="${c}"/><path d="M-110 20 L100 20" stroke="#000" stroke-opacity=".06" stroke-width="10" stroke-linecap="round"/></g>`;
  A.clouds = (seed, n, c = '#fff', op = 0.9, y0 = -60, y1 = 260) => {
    const R = A.rng(seed); let s = '';
    for (let i = 0; i < n; i++) s += `<g class="drift" style="animation-duration:${f1(30 + R() * 30)}s;animation-delay:-${f1(R() * 30)}s">${A.cloud(f1(-100 + R() * 1800), f1(y0 + R() * (y1 - y0)), 0.6 + R() * 0.8, c, op)}</g>`;
    return s;
  };
  A.rain = (seed, n = 60) => {
    const R = A.rng(seed); let s = '<g class="rain" opacity=".35">';
    for (let i = 0; i < n; i++) { const x = -100 + R() * 1800, y = -300 + R() * 900; s += `<path d="M${f1(x)} ${f1(y)} l-14 40" stroke="#dfe8ff" stroke-width="3" stroke-linecap="round" style="animation-delay:-${f1(R())}s"/>`; }
    return s + '</g>';
  };

  /* ---------- pobřeží ---------- */
  A.cliff = (x, y, w, h, c1, c2, flip = false) => `<g transform="translate(${x} ${y}) scale(${flip ? -1 : 1} 1)">
<path d="M0 0 L${-w * 0.08} ${-h * 0.55} L${w * 0.06} ${-h * 0.62} L${w * 0.02} ${-h * 0.92} L${w * 0.3} ${-h} L${w * 0.55} ${-h * 0.94} L${w * 0.68} ${-h * 0.7} L${w * 0.9} ${-h * 0.6} L${w} ${-h * 0.3} L${w * 1.1} 0Z" fill="${c1}"/>
<path d="M${w * 0.3} ${-h} L${w * 0.4} ${-h * 0.5} L${w * 0.3} 0 L${w * 0.55} 0 L${w * 0.68} ${-h * 0.7}" fill="${c2}" opacity=".5"/>
<path d="M${w * 0.02} ${-h * 0.92} L${w * 0.3} ${-h} L${w * 0.55} ${-h * 0.94}" stroke="#fff" stroke-opacity=".25" stroke-width="8" fill="none" stroke-linecap="round"/></g>`;
  A.grassTop = (x, y, w, c = '#5fbf5f') => `<path d="M${x} ${y} q ${w * 0.1} -26 ${w * 0.2} 0 q ${w * 0.1} -20 ${w * 0.2} 0 q ${w * 0.1} -28 ${w * 0.2} 0 q ${w * 0.1} -18 ${w * 0.2} 0 q ${w * 0.1} -24 ${w * 0.2} 0Z" fill="${c}"/>`;
  A.lighthouse = (u, x, y, s, lit = false) => `<g transform="${tr(x, y, s)}">
<path d="M-70 0 L-42 -380 L42 -380 L70 0Z" fill="#f4f1ea"/><path d="M20 -380 L42 -380 L70 0 L36 0Z" fill="#000" opacity=".08"/>
<rect x="-22" y="-80" width="44" height="80" rx="22" fill="#5a4a6a"/><rect x="-12" y="-250" width="24" height="34" rx="12" fill="#5a4a6a"/>
<rect x="-62" y="-396" width="124" height="18" rx="6" fill="#4a5873"/><path d="M-58 -396 L-58 -410 M-30 -396 L-30 -410 M0 -396 L0 -410 M30 -396 L30 -410 M58 -396 L58 -410 M-62 -410 L62 -410" stroke="#4a5873" stroke-width="5"/>
<rect x="-34" y="-470" width="68" height="74" rx="8" fill="${lit ? '#fff3b0' : '#3a4a68'}"/>${lit ? `<circle cx="0" cy="-433" r="26" fill="#fff"/><circle cx="0" cy="-433" r="90" fill="url(#${u}-warm)" class="glowpulse"/>` : '<path d="M-24 -455 L-10 -455 L-24 -420Z" fill="#fff" opacity=".2"/>'}
<path d="M-34 -470 L-34 -396 M34 -470 L34 -396 M0 -470 L0 -396" stroke="#4a5873" stroke-width="5"/>
<path d="M-44 -470 L0 -512 L44 -470Z" fill="#d94a4a"/><circle cx="0" cy="-516" r="7" fill="#d94a4a"/></g>`;
  A.lighthouseStripes = (x, y, s) => `<g transform="${tr(x, y, s)}"><path d="M-66 -60 L-61 -120 L61 -120 L66 -60Z" fill="#e8484a"/><path d="M-57 -180 L-53 -240 L53 -240 L57 -180Z" fill="#e8484a"/><path d="M-49 -300 L-45 -360 L45 -360 L49 -300Z" fill="#e8484a"/>
<rect x="-12" y="-250" width="24" height="34" rx="12" fill="#5a4a6a"/><rect x="-22" y="-80" width="44" height="80" rx="22" fill="#5a4a6a"/><circle cx="10" cy="-40" r="3.5" fill="#ffd166"/></g>`;
  A.beam = (u, x, y) => `<g transform="translate(${x} ${y})"><g class="beam"><path d="M0 0 L900 -120 L900 120Z" fill="#fff6c4" opacity=".28"/><path d="M0 0 L-900 -120 L-900 120Z" fill="#fff6c4" opacity=".28"/></g><circle r="34" fill="#fff"/><circle r="110" fill="url(#${u}-warm)" class="glowpulse"/></g>`;
  A.stoneStairs = (x, y, n = 6, c = '#b9a98f') => {
    let s = '';
    for (let k = 0; k < n; k++) s += `<rect x="${x + k * 34 - 50}" y="${y - k * 30}" width="80" height="22" rx="7" fill="${c}"/><rect x="${x + k * 34 - 50}" y="${y - k * 30}" width="80" height="7" rx="3" fill="#fff" opacity=".3"/>`;
    return s + `<path d="M${x - 46} ${y - 10} L${x + (n - 1) * 34 + 26} ${y - n * 30 - 30}" stroke="#7a5a3a" stroke-width="5"/>${Array.from({ length: n }, (_, k) => `<path d="M${x + k * 34 - 42} ${y - k * 30} l0 -36" stroke="#7a5a3a" stroke-width="5"/>`).join('')}`;
  };
  A.driftwood = (x, y, s, rot = 0) => `<g transform="${tr(x, y, s, rot)}"><path d="M-80 0 C-60 -14 40 -16 80 -4 C86 4 70 14 40 10 L-70 12 C-90 12 -92 4 -80 0Z" fill="#9c7a5a"/><path d="M-50 -2 L30 -6 M-30 6 L50 4" stroke="#7a5a3a" stroke-width="3"/><path d="M40 -8 L62 -30" stroke="#9c7a5a" stroke-width="9" stroke-linecap="round"/></g>`;
  A.barrel = (u, x, y, s, rot = 0) => `<g transform="${tr(x, y, s, rot)}"><path d="M-34 -70 C-46 -40 -46 -30 -34 0 L34 0 C46 -30 46 -40 34 -70Z" fill="url(#${u}-wood)"/><path d="M-40 -56 L40 -56 M-43 -14 L43 -14" stroke="#4a5873" stroke-width="7"/><path d="M-10 -66 L-12 -4" stroke="#fff" stroke-opacity=".2" stroke-width="5"/></g>`;
  A.boat = (u, x, y, s, c = '#e8484a', sail = '#fff', flip = false, delay = 0) => `<g transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s})"><g class="rock-boat" style="animation-delay:${delay}s">
<path d="M0 -150 L0 -10" stroke="#7a5a3a" stroke-width="7"/><path d="M6 -146 C60 -110 80 -60 74 -24 L6 -24Z" fill="${sail}"/><path d="M-6 -120 C-40 -90 -50 -56 -48 -26 L-6 -26Z" fill="${sail}" opacity=".9"/>
<path d="M2 -154 L32 -146 L2 -138Z" fill="${c}"/><path d="M-90 -20 L90 -20 L70 14 L-66 14Z" fill="${c}"/><path d="M-90 -20 L90 -20 L86 -10 L-86 -10Z" fill="#fff" opacity=".45"/>
<circle cx="-40" cy="-2" r="5" fill="#fff" opacity=".7"/><circle cx="-14" cy="-2" r="5" fill="#fff" opacity=".7"/></g></g>`;
  A.rowboat = (u, x, y, s, c = '#ff9a3a', rot = 0) => `<g transform="${tr(x, y, s, rot)}"><path d="M-110 -26 L110 -26 C100 10 70 22 0 22 C-70 22 -100 10 -110 -26Z" fill="${c}"/><path d="M-110 -26 L110 -26 L106 -14 L-106 -14Z" fill="#fff" opacity=".5"/>
<path d="M-60 -24 L-60 18 M60 -24 L60 18" stroke="#000" stroke-opacity=".12" stroke-width="5"/><path d="M-30 -30 L-140 30 M40 -30 L150 26" stroke="#9c7a5a" stroke-width="7" stroke-linecap="round"/>
<circle cx="0" cy="-48" r="22" fill="none" stroke="#e8484a" stroke-width="12"/><circle cx="0" cy="-48" r="22" fill="none" stroke="#fff" stroke-width="12" stroke-dasharray="17 17"/></g>`;
  A.posts = (x, y, n, gap, h = 70) => Array.from({ length: n }, (_, k) => `<rect x="${x + k * gap - 9}" y="${y - h}" width="18" height="${h + 40}" rx="6" fill="#6b4a32"/><rect x="${x + k * gap - 9}" y="${y - h}" width="18" height="10" rx="5" fill="#8a6a4a"/>`).join('');
  A.pier = (u, x, y, w, broken = false) => {
    let planks = '';
    for (let k = 0; k * 24 < w; k++) {
      if (broken && (k % 5 === 2 || k % 7 === 4)) continue;
      const rot = broken && k % 3 === 0 ? (k % 2 ? 6 : -5) : 0;
      planks += `<rect x="${x + k * 24}" y="${y - 22}" width="21" height="22" rx="3" fill="url(#${u}-wood)" transform="rotate(${rot} ${x + k * 24 + 10} ${y - 11})"/>`;
    }
    return `${A.posts(x + 12, y + 30, Math.ceil(w / 120) + 1, 120, 50)}<rect x="${x}" y="${y - 4}" width="${w}" height="8" fill="#5a3a22" opacity="${broken ? 0.4 : 1}"/>${planks}
${broken ? '' : `<path d="M${x} ${y - 60} L${x + w} ${y - 60}" stroke="#c9a46a" stroke-width="6"/>${A.posts(x + 6, y - 24, Math.ceil(w / 120) + 1, 120, 40).replace(/#6b4a32/g, '#8a6a4a')}`}`;
  };
  A.stall = (u, x, y, s) => `<g transform="${tr(x, y, s)}"><rect x="-90" y="-120" width="180" height="120" fill="url(#${u}-wood)"/><rect x="-100" y="-60" width="200" height="16" rx="5" fill="#8a5a32"/>
<path d="M-110 -120 L110 -120 L96 -170 L-96 -170Z" fill="#fff"/>${[-110, -66, -22, 22, 66].map(a => `<path d="M${a} -120 L${a + 22} -120 L${a + 19} -170 L${a + 2 + (a < 0 ? 3 : -3)} -170Z" fill="#3fa5e6"/>`).join('')}
<path d="M-110 -120 q11 16 22 0 q11 16 22 0 q11 16 22 0 q11 16 22 0 q11 16 22 0 q11 16 22 0 q11 16 22 0 q11 16 22 0 q11 16 22 0 q11 16 22 0" fill="#3fa5e6"/>
${A.fish(-50, -76, 0.32, '#ff9f43', '#ff6b6b', false, 0, '')}${A.fish(10, -80, 0.3, '#5ee7df', '#1f9fb0', true, 0, '')}${A.fish(60, -74, 0.3, '#ffd23f', '#3d8bfd', false, 0, '')}
<rect x="-30" y="-200" width="60" height="26" rx="6" fill="#fff8ec" stroke="#8a5a32" stroke-width="4"/><text x="0" y="-181" font-size="16" font-weight="700" text-anchor="middle" fill="#8a5a32" font-family="Fredoka, sans-serif">RYBY</text></g>`;
  A.buoy = (x, y, s, c = '#e8484a', delay = 0) => `<g transform="${tr(x, y, s)}"><g class="rock-boat" style="animation-delay:${delay}s"><path d="M-30 0 C-30 -40 30 -40 30 0Z" fill="${c}"/><rect x="-30" y="-12" width="60" height="10" fill="#fff"/><path d="M0 -34 L0 -70" stroke="#4a5873" stroke-width="6"/><circle cx="0" cy="-74" r="8" fill="#ffe066" class="glowpulse"/></g></g>`;
  A.palm = (x, y, s, flip = false, delay = 0) => `<g transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s})">
<path d="M0 0 C6 -80 -6 -160 30 -250" stroke="#a9784a" stroke-width="26" fill="none" stroke-linecap="round"/><path d="M-6 -40 l22 -6 M-2 -90 l22 -4 M8 -140 l22 -2 M18 -190 l20 0" stroke="#8a5a32" stroke-width="4"/>
<g class="sway" style="animation-delay:${delay}s">${[[-150, -200, -0.2], [-110, -310, 0.3], [40, -340, -0.4], [150, -280, 0.2], [170, -190, -0.1]].map(([a, b]) => `<path d="M30 -250 Q${(30 + a) / 2} ${b - 40} ${a} ${b}" stroke="#3faa5a" stroke-width="20" fill="none" stroke-linecap="round"/><path d="M30 -250 Q${(30 + a) / 2} ${b - 40} ${a} ${b}" stroke="#7bd389" stroke-width="5" fill="none" stroke-linecap="round" stroke-dasharray="2 14"/>`).join('')}
<circle cx="22" cy="-238" r="13" fill="#7a4a2a"/><circle cx="42" cy="-236" r="12" fill="#6a3a1a"/><circle cx="32" cy="-224" r="12" fill="#7a4a2a"/></g></g>`;
  A.sandcastle = (u, x, y, s) => `<g transform="${tr(x, y, s)}"><rect x="-110" y="-70" width="220" height="70" rx="6" fill="#f2d48c"/><rect x="-130" y="-120" width="60" height="120" rx="4" fill="#ecc878"/><rect x="70" y="-120" width="60" height="120" rx="4" fill="#ecc878"/><rect x="-40" y="-170" width="80" height="100" rx="4" fill="#f2d48c"/>
${[-130, -110, -90, 70, 90, 110, -40, -20, 0, 20].map((a, i) => `<rect x="${a}" y="${i < 6 ? -136 : -186}" width="14" height="18" rx="2" fill="${i < 6 ? '#ecc878' : '#f2d48c'}"/>`).join('')}
<path d="M-18 0 L-18 -40 C-18 -60 18 -60 18 -40 L18 0Z" fill="#c9a058"/><path d="M0 -170 L0 -220" stroke="#7a5a3a" stroke-width="4"/><path d="M2 -220 L36 -208 L2 -196Z" fill="#ff6f91" class="flutter"/>
${A.scallop(-80, -40, 0.3, '#ffc2d4', '#ff8fb0', 0)}${A.scallop(70, -30, 0.28, '#ffe3a3', '#e9b44c', 10)}<circle cx="-100" cy="-90" r="5" fill="#fff" opacity=".5"/><circle cx="100" cy="-96" r="5" fill="#fff" opacity=".5"/></g>`;
  A.nest = (x, y, s, eggs = 3) => `<g transform="${tr(x, y, s)}"><ellipse cx="0" cy="-6" rx="80" ry="26" fill="#d8b878"/><ellipse cx="0" cy="-14" rx="64" ry="16" fill="#b8925a"/>
${Array.from({ length: eggs }, (_, k) => `<ellipse cx="${-36 + k * 36 / Math.max(1, (eggs - 1) / 2)}" cy="${-22 - (k % 2) * 6}" rx="16" ry="20" fill="#fff8ec" stroke="#e8dcc0" stroke-width="3"/>`).join('')}
<path d="M-80 -6 C-60 4 60 4 80 -6" stroke="#a9784a" stroke-width="5" fill="none"/><path d="M-70 -14 l-12 -6 M70 -14 l12 -6 M-40 0 l-6 10 M40 0 l6 10" stroke="#a9784a" stroke-width="4"/></g>`;
  A.lightningRod = (x, y, s) => `<g transform="${tr(x, y, s)}"><path d="M0 0 L0 -220" stroke="#8a95ab" stroke-width="8"/><path d="M-14 -220 L0 -260 L14 -220Z" fill="#c9d2e3"/><circle cx="0" cy="-160" r="10" fill="#8a95ab"/><path d="M-30 0 L30 0" stroke="#5a6478" stroke-width="10" stroke-linecap="round"/></g>`;
  A.bolt = (x, y, s, delay = 0) => `<g transform="${tr(x, y, s)}"><path class="flash" style="animation-delay:${delay}s" d="M0 0 L-30 90 L4 86 L-24 190 L44 70 L8 74 L30 0Z" fill="#fff59a" stroke="#ffd23f" stroke-width="5" stroke-linejoin="round"/></g>`;
  A.puddles = (seed, n, y0, y1) => { const R = A.rng(seed); let s = ''; for (let i = 0; i < n; i++) s += `<ellipse cx="${f1(R() * 1600)}" cy="${f1(y0 + R() * (y1 - y0))}" rx="${f1(30 + R() * 40)}" ry="${f1(6 + R() * 6)}" fill="#bfe8ff" opacity=".45"/>`; return s; };
  A.garland = (x1, x2, y, sag, cols) => A.pennants(x1, y, x2, y, sag, cols);

  /* ---------- postavy ---------- */
  A.gull = (x, y, s, flip = false, delay = 0, fly = true) => fly
    ? `<g transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s})"><g class="drift" style="animation-duration:22s;animation-delay:${delay}s"><g class="flap" style="animation-delay:${delay}s"><path d="M-70 -6 C-50 -34 -20 -30 0 -4 C20 -30 50 -34 70 -6 C46 -18 20 -12 0 6 C-20 -12 -46 -18 -70 -6Z" fill="#fff" stroke="#9aa6bc" stroke-width="3"/><path d="M-70 -6 C-60 -16 -52 -18 -44 -16 M70 -6 C60 -16 52 -18 44 -16" stroke="#4a5873" stroke-width="5" stroke-linecap="round"/></g><path d="M0 2 L10 6 L0 8Z" fill="#ffb22e"/></g></g>`
    : `<g transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s})"><g class="bob" style="animation-delay:${delay}s"><path d="M-6 -6 L-10 22 M10 -6 L12 22" stroke="#ffb22e" stroke-width="6" stroke-linecap="round"/><path d="M-16 22 L-2 22 M6 22 L20 22" stroke="#ffb22e" stroke-width="6" stroke-linecap="round"/>
<ellipse cx="0" cy="-34" rx="40" ry="30" fill="#fff"/><path d="M-36 -40 C-60 -44 -70 -30 -66 -20 C-50 -22 -40 -26 -30 -24Z" fill="#9aa6bc"/><path d="M-10 -40 C10 -64 40 -52 34 -30 C20 -40 0 -38 -10 -40Z" fill="#c9d2e3"/>
<circle cx="28" cy="-66" r="22" fill="#fff"/>${eye1(34, -70, 6)}<path d="M46 -64 L72 -58 L46 -54Z" fill="#ffb22e"/><path d="M46 -58 L60 -56" stroke="#e8484a" stroke-width="3"/></g></g>`;
  A.puffin = (x, y, s, flip = false, delay = 0) => `<g transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s})"><g class="bob" style="animation-delay:${delay}s">
<path d="M-12 0 L-14 -14 M12 0 L12 -14" stroke="#ff8a3d" stroke-width="7" stroke-linecap="round"/><ellipse cx="0" cy="-46" rx="34" ry="42" fill="#2b3550"/><ellipse cx="6" cy="-38" rx="24" ry="32" fill="#fff"/>
<circle cx="4" cy="-90" r="28" fill="#2b3550"/><ellipse cx="12" cy="-90" rx="18" ry="16" fill="#fff"/>${eye1(12, -94, 5)}
<path d="M24 -96 C44 -98 52 -86 44 -78 C36 -76 28 -80 24 -84Z" fill="#ff8a3d"/><path d="M28 -92 C36 -92 42 -88 44 -84" stroke="#ffd166" stroke-width="4" fill="none"/><path d="M-32 -60 C-46 -40 -40 -20 -26 -14" stroke="#1d2540" stroke-width="10" fill="none" stroke-linecap="round"/></g></g>`;
  A.otter = (x, y, s, delay = 0) => `<g transform="${tr(x, y, s)}"><g class="rock-boat" style="animation-delay:${delay}s">
<ellipse cx="0" cy="0" rx="90" ry="26" fill="#9a6a44"/><ellipse cx="0" cy="-6" rx="70" ry="16" fill="#e8c9a0"/><path d="M80 0 C110 -4 126 10 120 20" stroke="#9a6a44" stroke-width="16" fill="none" stroke-linecap="round"/>
<circle cx="-80" cy="-16" r="30" fill="#9a6a44"/><ellipse cx="-86" cy="-8" rx="18" ry="13" fill="#e8c9a0"/><circle cx="-100" cy="-38" r="8" fill="#9a6a44"/><circle cx="-62" cy="-40" r="8" fill="#9a6a44"/>
${eye1(-92, -22, 5)}${eye1(-70, -22, 5)}<ellipse cx="-82" cy="-10" rx="6" ry="4" fill="#3a2a1a"/><path d="M-90 -2 Q-82 4 -74 -2" stroke="#3a2a1a" stroke-width="2.5" fill="none"/>
<path d="M-30 -20 C-30 -40 -10 -44 0 -30 M20 -20 C20 -40 40 -42 46 -28" stroke="#9a6a44" stroke-width="13" fill="none" stroke-linecap="round"/>${A.scallop(8, -36, 0.32, '#ffc2d4', '#ff8fb0', 0)}</g></g>`;
  A.hermit = (x, y, s, c = '#ff8a5c', shell = '#ffd8a8', delay = 0) => `<g transform="${tr(x, y, s)}"><g class="bob" style="animation-delay:${delay}s">
<path d="M-40 -6 L-56 10 M-30 -2 L-40 14 M30 -2 L40 14" stroke="${c}" stroke-width="7" stroke-linecap="round"/><path d="M10 -40 C10 -100 100 -100 100 -40 C100 -10 70 0 40 0 L10 0Z" fill="${shell}"/>
<path d="M30 -40 C30 -76 84 -76 84 -44 C84 -24 60 -20 52 -36 C46 -48 62 -56 66 -44" stroke="#d99a5a" stroke-width="6" fill="none" stroke-linecap="round"/>
<ellipse cx="-14" cy="-20" rx="34" ry="22" fill="${c}"/><path d="M-30 -36 L-38 -62 M-12 -38 L-8 -64" stroke="${c}" stroke-width="5"/>${eye1(-38, -66, 7)}${eye1(-8, -68, 7)}
<path d="M-40 -18 C-62 -30 -74 -14 -58 -4 C-50 0 -44 -6 -40 -10" fill="${c}"/><path d="M-26 -12 Q-20 -6 -14 -12" stroke="#1d2b4f" stroke-width="3" fill="none" stroke-linecap="round"/></g></g>`;
  A.cat = (x, y, s, c = '#ffb36b', delay = 0) => `<g transform="${tr(x, y, s)}"><g class="bob" style="animation-delay:${delay}s">
<path d="M40 -10 C80 -10 86 -50 70 -60" stroke="${c}" stroke-width="12" fill="none" stroke-linecap="round" class="wave"/><ellipse cx="0" cy="-34" rx="44" ry="36" fill="${c}"/><ellipse cx="0" cy="-26" rx="26" ry="24" fill="#fff4e0"/>
<circle cx="0" cy="-86" r="34" fill="${c}"/><path d="M-30 -104 L-26 -136 L-6 -114Z M30 -104 L26 -136 L6 -114Z" fill="${c}"/><path d="M-24 -110 L-22 -126 L-12 -114Z M24 -110 L22 -126 L12 -114Z" fill="#ffb3c8"/>
${eyes(13, -88, 7)}<path d="M-4 -76 L4 -76 L0 -71Z" fill="#ff7aa2"/><path d="M0 -71 Q-7 -64 -12 -68 M0 -71 Q7 -64 12 -68" stroke="#1d2b4f" stroke-width="2.5" fill="none"/><path d="M-18 -74 L-40 -78 M-18 -70 L-40 -68 M18 -74 L40 -78 M18 -70 L40 -68" stroke="#fff" stroke-width="2"/>
<path d="M-34 -112 L34 -112 L28 -128 L-28 -128Z" fill="#fff"/><path d="M-36 -112 L36 -112" stroke="#1f6fd1" stroke-width="6"/><rect x="-28" y="-140" width="56" height="14" rx="6" fill="#fff"/></g></g>`;
  A.babyTurtle = (x, y, s, flip = false, delay = 0) => `<g transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s})"><g class="bob" style="animation-delay:${delay}s;animation-duration:1.4s">
<ellipse cx="-30" cy="-6" rx="14" ry="7" fill="#7be38a" transform="rotate(-20 -30 -6)"/><ellipse cx="26" cy="-4" rx="14" ry="7" fill="#7be38a" transform="rotate(25 26 -4)"/>
<ellipse cx="0" cy="-20" rx="34" ry="22" fill="#3fae5a"/><path d="M-20 -30 L0 -38 L20 -30 L14 -14 L-14 -14Z" fill="#2f8f4a"/><circle cx="40" cy="-26" r="16" fill="#7be38a"/>${eye1(44, -30, 5)}<path d="M46 -20 Q50 -18 54 -21" stroke="#1d2b4f" stroke-width="2" fill="none"/></g></g>`;
  A.krakenFriend = (u, x, y, s, delay = 0) => {
    let legs = '';
    [[-150, 1], [-90, 0.8], [90, 0.8], [150, 1]].forEach(([dx, k], i) => {
      const dir = dx < 0 ? -1 : 1;
      legs += `<path class="wave" style="animation-delay:${-i * 0.3 + delay}s" d="M${dx * 0.4} 0 C${dx * 0.6} -60 ${dx} -80 ${dx + dir * 20} -150 C${dx + dir * 30} -190 ${dx + dir * 70} -200 ${dx + dir * 70} -170" stroke="#9a6ae0" stroke-width="${30 * k}" fill="none" stroke-linecap="round"/>`;
    });
    return `<g transform="${tr(x, y, s)}"><g class="bob" style="animation-delay:${delay}s">${legs}
<path d="M-120 20 C-130 -110 -60 -170 0 -170 C60 -170 130 -110 120 20Z" fill="#a679ec"/><ellipse cx="-46" cy="-120" rx="24" ry="14" fill="#fff" opacity=".25" transform="rotate(-25 -46 -120)"/>
${eyes(40, -70, 20)}<path d="M-24 -26 Q0 -6 24 -26" stroke="#1d2b4f" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="-70" cy="-38" r="12" fill="#ff8fb0" opacity=".5"/><circle cx="70" cy="-38" r="12" fill="#ff8fb0" opacity=".5"/>
<path d="M-60 -168 L-40 -210 L-20 -176 L0 -220 L20 -176 L40 -210 L60 -168Z" fill="url(#${u}-gold)"/></g></g>`;
  };
  A.splash = (x, y, s) => `<g transform="${tr(x, y, s)}" fill="#fff" opacity=".8"><path d="M-80 0 C-60 -20 -40 -10 -30 -30 C-20 -6 20 -6 30 -30 C40 -10 60 -20 80 0Z"/><circle cx="-50" cy="-40" r="6"/><circle cx="40" cy="-48" r="5"/><circle cx="0" cy="-56" r="4"/></g>`;
})(typeof window !== 'undefined' ? window : globalThis);
(function (root) {
  'use strict';
  const A = root.CD.Art, f1 = n => (+n).toFixed(1);
  /* svítící plankton na hladině */
  A.glowSea = (n, seed, H = 430, cols = ['#9ffcff', '#b8ffcf', '#fff3b0']) => {
    const R = A.rng(seed); let s = '';
    for (let i = 0; i < n; i++) s += A.sparkle(f1(-50 + R() * 1700), f1(H + 20 + R() * 260), 0.25 + R() * 0.35, cols[i % cols.length], f1(-R() * 2));
    return s;
  };
  /* tyčka s lucerničkou */
  A.lanternPole = (u, x, y, s = 1, delay = 0) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0 L0 -150 M0 -150 L30 -150" stroke="#6b4a32" stroke-width="8" stroke-linecap="round"/></g>` + A.lantern(u, x + 30 * s, y - 110 * s, 0.55 * s, delay);
})(typeof window !== 'undefined' ? window : globalThis);
