/* =========================================================================
   Korálové sny – grafika světa Hlubiny (SVG generované kódem)
   Navazuje na js/art.js (stejný styl: oči #1d2b4f, animace sway/bob/swim…).
   ========================================================================= */
(function (root) {
  'use strict';
  const CD = root.CD = root.CD || {};
  const A = CD.Art;
  const tr = A.tr;
  const f1 = n => (+n).toFixed(1);
  const eyes = (dx, y, r = 7) => `<circle cx="${-dx}" cy="${y}" r="${r}" fill="#fff"/><circle cx="${dx}" cy="${y}" r="${r}" fill="#fff"/><circle cx="${-dx + 1}" cy="${y + 1}" r="${r * 0.55}" fill="#1d2b4f"/><circle cx="${dx + 1}" cy="${y + 1}" r="${r * 0.55}" fill="#1d2b4f"/><circle cx="${-dx + 2.5}" cy="${y - 1.5}" r="${r * 0.2}" fill="#fff"/><circle cx="${dx + 2.5}" cy="${y - 1.5}" r="${r * 0.2}" fill="#fff"/>`;
  const smile = (y, w = 8) => `<path d="M${-w} ${y} Q0 ${y + w * 0.8} ${w} ${y}" stroke="#1d2b4f" stroke-width="3" fill="none" stroke-linecap="round"/>`;

  /* ---------- postavy ---------- */
  A.octopus = (x, y, s, c, c2, delay = 0) => {
    let legs = '';
    for (let k = 0; k < 6; k++) {
      const bx = -45 + k * 18, dir = k < 3 ? -1 : 1;
      legs += `<path class="wave" style="animation-delay:${-k * 0.2 + delay}s" d="M${bx} 10 C${bx + dir * 6} 40 ${bx - dir * 14} 56 ${bx + dir * 4} 78 C${bx + dir * 14} 90 ${bx + dir * 26} 84 ${bx + dir * 24} 74" stroke="${c}" stroke-width="15" fill="none" stroke-linecap="round"/>`;
    }
    return `<g transform="${tr(x, y, s)}"><g class="bob" style="animation-delay:${delay}s">${legs}
<path d="M-58 14 C-70 -60 -30 -96 0 -96 C30 -96 70 -60 58 14 Q0 30 -58 14Z" fill="${c}"/>
<ellipse cx="-24" cy="-62" rx="14" ry="9" fill="#fff" opacity=".3" transform="rotate(-30 -24 -62)"/>
${[[-34, -20], [32, -30], [20, 2]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="5" fill="${c2}"/>`).join('')}
${eyes(18, -26, 10)}${smile(-6, 9)}<circle cx="-34" cy="-8" r="6" fill="#ff8fb0" opacity=".5"/><circle cx="34" cy="-8" r="6" fill="#ff8fb0" opacity=".5"/></g></g>`;
  };
  A.crab = (x, y, s, c, delay = 0) => `<g transform="${tr(x, y, s)}"><g class="bob" style="animation-delay:${delay}s">
${[-1, 1].map(d => `<path d="M${d * 40} 6 L${d * 62} 24 M${d * 34} 12 L${d * 52} 32 M${d * 26} 14 L${d * 40} 36" stroke="${c}" stroke-width="7" stroke-linecap="round"/>
<g class="wave" style="animation-delay:${d * 0.4}s"><path d="M${d * 44} -14 L${d * 66} -40" stroke="${c}" stroke-width="9" stroke-linecap="round"/><path d="M${d * 62} -36 C${d * 92} -48 ${d * 90} -80 ${d * 70} -78 L${d * 72} -58 L${d * 58} -62 C${d * 50} -74 ${d * 56} -44 ${d * 62} -36Z" fill="${c}"/></g>`).join('')}
<ellipse cx="0" cy="0" rx="52" ry="34" fill="${c}"/><ellipse cx="-14" cy="-14" rx="16" ry="7" fill="#fff" opacity=".3"/>
<path d="M-14 -30 V-48 M14 -30 V-48" stroke="${c}" stroke-width="5"/>${eyes(14, -50, 9)}${smile(4, 10)}</g></g>`;
  A.seal = (x, y, s, flip = false, delay = 0) => `<g transform="translate(${x} ${y})"><g class="bob" style="animation-delay:${delay}s"><g transform="scale(${flip ? -s : s} ${s})">
<path d="M-90 30 C-110 -10 -60 -60 0 -56 C40 -54 60 -20 70 10 C80 40 40 50 -10 46 C-50 44 -80 46 -90 30Z" fill="#c9d3e2"/>
<path d="M-88 30 C-100 50 -120 54 -126 40 C-118 36 -110 30 -100 22Z" fill="#aab7cb"/><path d="M20 30 C30 56 10 66 -6 56" fill="#aab7cb"/>
<circle cx="40" cy="-30" r="44" fill="#dce4ef"/><ellipse cx="62" cy="-14" rx="20" ry="14" fill="#f2f5fa"/><circle cx="72" cy="-20" r="6" fill="#1d2b4f"/>
<circle cx="30" cy="-40" r="8" fill="#1d2b4f"/><circle cx="54" cy="-44" r="8" fill="#1d2b4f"/><circle cx="32" cy="-43" r="2.5" fill="#fff"/><circle cx="56" cy="-47" r="2.5" fill="#fff"/>
<path d="M60 -8 Q66 -2 72 -8" stroke="#1d2b4f" stroke-width="2.5" fill="none"/><path d="M78 -14 l18 -4 M78 -10 l18 2" stroke="#8b97ab" stroke-width="2"/></g></g></g>`;
  A.lanternfish = (u, x, y, s, c, flip = false, delay = 0) => `<g transform="translate(${x} ${y})"><g class="swim" style="animation-delay:${delay}s"><g transform="scale(${flip ? -s : s} ${s})">
<path d="M-30 -36 C-20 -70 10 -80 18 -78" stroke="${c}" stroke-width="4" fill="none"/><circle cx="20" cy="-80" r="44" fill="url(#${u}-glow)" class="glowpulse" style="animation-delay:${delay}s"/><circle cx="20" cy="-80" r="10" fill="#fff8c4"/>
<path d="M-60 0 C-50 -40 30 -46 54 -6 C30 36 -50 34 -60 0Z" fill="${c}"/><path d="M50 -4 L80 -26 L74 0 L80 26Z" fill="${c}"/>
<path d="M-58 4 L-36 10 L-28 2 L-20 12 L-12 4" stroke="#fff" stroke-width="3" fill="none" stroke-linejoin="round"/>
<circle cx="-30" cy="-14" r="11" fill="#fff"/><circle cx="-32" cy="-13" r="6" fill="#1d2b4f"/><circle cx="-30" cy="-16" r="2" fill="#fff"/>
${[0, 14, 28].map(px => `<circle cx="${px}" cy="10" r="3" fill="#bff6ff" class="glowpulse"/>`).join('')}</g></g></g>`;
  A.puffer = (x, y, s, c, delay = 0) => `<g transform="${tr(x, y, s)}"><g class="bob" style="animation-delay:${delay}s">
${Array.from({ length: 14 }, (_, k) => { const a = k * Math.PI / 7; return `<path d="M${f1(Math.cos(a) * 44)} ${f1(Math.sin(a) * 44)} L${f1(Math.cos(a) * 60)} ${f1(Math.sin(a) * 60)}" stroke="${c}" stroke-width="5" stroke-linecap="round"/>`; }).join('')}
<circle r="48" fill="${c}"/><ellipse cx="0" cy="18" rx="34" ry="22" fill="#fff6d6"/><path d="M44 -6 L66 -20 L62 0 L66 18Z" fill="${c}"/>
${eyes(16, -12, 10)}<circle cx="0" cy="10" r="6" fill="#ff8fb0"/></g></g>`;
  A.shark = (x, y, s, happy = true, flip = false, delay = 0) => `<g transform="translate(${x} ${y})"><g class="swim" style="animation-delay:${delay}s"><g transform="scale(${flip ? -s : s} ${s})">
<path d="M-150 10 C-110 -60 40 -70 130 -20 L190 -70 L176 0 L190 66 L130 24 C40 70 -110 64 -150 10Z" fill="#7d93b4"/>
<path d="M-20 -50 L10 -120 L44 -46Z" fill="#6a7fa0"/><path d="M10 30 L40 80 L60 26Z" fill="#6a7fa0"/>
<path d="M-140 16 C-100 48 30 56 120 26 C40 66 -110 60 -140 16Z" fill="#eef2f8"/>
<circle cx="-96" cy="-10" r="11" fill="#fff"/><circle cx="-98" cy="-9" r="7" fill="#1d2b4f"/><circle cx="-95" cy="-12" r="2.5" fill="#fff"/>
${happy ? '<path d="M-140 18 Q-112 40 -84 22" stroke="#1d2b4f" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M-130 24 l6 7 l6 -5 l6 7 l6 -6" stroke="#fff" stroke-width="3" fill="none"/><circle cx="-80" cy="10" r="9" fill="#ff8fb0" opacity=".45"/>'
    : '<path d="M-142 16 L-128 26 L-120 16 L-110 28 L-100 17 L-90 27 L-80 16" stroke="#fff" stroke-width="5" fill="none" stroke-linejoin="round"/><path d="M-110 -26 L-84 -18" stroke="#1d2b4f" stroke-width="5" stroke-linecap="round"/>'}
${[0, 18, 36].map(px => `<path d="M${px - 40} -10 Q${px - 32} 2 ${px - 40} 14" stroke="#5d7090" stroke-width="4" fill="none"/>`).join('')}</g></g></g>`;

  /* ---------- Inkoustový les ---------- */
  A.inkBlob = (x, y, s, rot = 0) => `<g transform="${tr(x, y, s, rot)}"><path d="M-60 -10 C-70 -50 -20 -60 0 -44 C20 -64 70 -50 64 -10 C90 6 60 40 30 34 C10 54 -30 50 -40 30 C-76 32 -84 4 -60 -10Z" fill="#241a3c"/><circle cx="76" cy="-30" r="9" fill="#241a3c"/><circle cx="-80" cy="26" r="7" fill="#241a3c"/><ellipse cx="-20" cy="-20" rx="16" ry="7" fill="#fff" opacity=".12"/></g>`;
  A.mushroom = (u, x, y, s, c, delay = 0) => `<g transform="${tr(x, y, s)}"><circle cy="-70" r="80" fill="url(#${u}-glow)" class="glowpulse" style="animation-delay:${delay}s"/>
<path d="M-12 0 C-10 -40 -8 -60 -6 -70 L6 -70 C8 -60 10 -40 12 0Z" fill="#e9f7ff"/><path d="M-60 -64 C-60 -120 60 -120 60 -64 Q0 -50 -60 -64Z" fill="${c}"/>
${[[-30, -88], [10, -98], [34, -78], [-6, -76]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="7" fill="#fff" opacity=".75"/>`).join('')}</g>`;
  A.kelpArch = (x, y, w, h, c) => `<g transform="translate(${x} ${y})"><g class="sway slow"><path d="M${-w / 2} 0 C${-w / 2} ${-h} ${w / 2} ${-h} ${w / 2} 0" stroke="${c}" stroke-width="26" fill="none" stroke-linecap="round"/>
${Array.from({ length: 9 }, (_, k) => { const t = (k + 1) / 10, px = -w / 2 + w * t, py = -h * 4 * t * (1 - t) * 0.75; return `<ellipse cx="${f1(px)}" cy="${f1(py)}" rx="26" ry="11" fill="${c}" transform="rotate(${k % 2 ? 30 : -30} ${f1(px)} ${f1(py)})"/>`; }).join('')}
<path d="M${-w / 2 + 6} -20 C${-w / 2 + 6} ${-h * 0.8} ${-w * 0.1} ${-h * 0.75} 0 ${-h * 0.75}" stroke="#fff" stroke-opacity=".25" stroke-width="6" fill="none"/></g></g>`;
  A.plankton = (n, seed, cols = ['#9ffcff', '#d6b8ff', '#b8ffcf']) => {
    const R = A.rng(seed); let s = '';
    for (let i = 0; i < n; i++) s += A.sparkle(f1(80 + R() * 1440), f1(80 + R() * 560), 0.35 + R() * 0.5, cols[i % cols.length], f1(-R() * 2));
    return s;
  };
  A.den = (u, x, y, s) => `<g transform="${tr(x, y, s)}"><path d="M-170 0 C-170 -150 170 -150 170 0Z" fill="url(#${u}-rock)"/><path d="M-80 0 C-80 -90 80 -90 80 0Z" fill="#1b1430"/>
${[[-130, -40], [120, -60], [-60, -110], [70, -112]].map(([a, b], i) => A.scallop(a, b, 0.4, ['#ffb0cf', '#ffe3a3', '#b8f0ff', '#d6b8ff'][i], '#c77aa0', a / 4)).join('')}</g>`;

  /* ---------- Ledová jeskyně ---------- */
  A.icicles = (x, y, w, n, seed = 3) => {
    const R = A.rng(seed); let s = `<g transform="translate(${x} ${y})"><path d="M${-w / 2} 0 H${w / 2} V-30 H${-w / 2}Z" fill="#dff4ff"/>`;
    for (let i = 0; i < n; i++) { const px = -w / 2 + (i + 0.5) * w / n, h = 50 + R() * 120; s += `<path d="M${f1(px - 16)} 0 L${f1(px)} ${f1(h)} L${f1(px + 16)} 0Z" fill="${i % 2 ? '#bfe6fb' : '#e6f7ff'}"/><path d="M${f1(px - 6)} 6 L${f1(px)} ${f1(h * 0.7)}" stroke="#fff" stroke-width="3"/>`; }
    return s + '</g>';
  };
  A.iceBlock = (x, y, w, h, rot = 0) => `<g transform="${tr(x, y, 1, rot)}"><rect x="${-w / 2}" y="${-h}" width="${w}" height="${h}" rx="12" fill="#cdeefc" stroke="#fff" stroke-width="5"/><path d="M${-w / 2 + 14} ${-h + 18} L${-w / 4} ${-h / 2}" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".8"/><path d="M${w / 6} ${-h + 10} L0 ${-h / 2} L${w / 4} ${-h / 4}" stroke="#9fd3ee" stroke-width="3" fill="none"/></g>`;
  A.crystal = (u, x, y, s, c, delay = 0) => `<g transform="${tr(x, y, s)}"><circle cy="-60" r="90" fill="url(#${u}-glow)" class="glowpulse" style="animation-delay:${delay}s"/>
<path d="M0 0 L-26 -40 L-10 -130 L10 -130 L26 -40Z" fill="${c}" stroke="#fff" stroke-width="3"/><path d="M-10 -130 L0 -150 L10 -130" fill="#fff"/>
<path d="M-30 4 L-60 -30 L-58 -80 L-44 -86 L-34 -36Z" fill="${c}" opacity=".85" stroke="#fff" stroke-width="3"/><path d="M30 4 L56 -24 L60 -64 L48 -70 L34 -30Z" fill="${c}" opacity=".85" stroke="#fff" stroke-width="3"/>
<path d="M-4 -30 L-6 -116" stroke="#fff" stroke-width="5" opacity=".7"/></g>`;
  A.aurora = () => ['#7cffc4', '#7fd8ff', '#c4a0ff'].map((c, i) =>
    `<path class="sway slow" style="animation-delay:${-i}s" d="M-200 ${120 + i * 50} C200 ${20 + i * 40} 500 ${220 + i * 30} 800 ${110 + i * 40} S1400 ${10 + i * 50} 1800 ${130 + i * 40}" stroke="${c}" stroke-width="${46 - i * 8}" fill="none" opacity=".33" stroke-linecap="round"/>`).join('');
  A.igloo = (x, y, s) => {
    let bricks = '';
    for (let r = 1; r < 5; r++) bricks += `<path d="M${-150 + r * 6} ${-r * 34} H${150 - r * 6}" stroke="#a9d3ea" stroke-width="4"/>`;
    return `<g transform="${tr(x, y, s)}"><path d="M-160 0 C-160 -200 160 -200 160 0Z" fill="#f2fbff" stroke="#c4e5f6" stroke-width="6"/>${bricks}
<path d="M-50 0 C-50 -80 50 -80 50 0Z" fill="#2f5c86"/><path d="M-60 0 C-60 -96 60 -96 60 0" stroke="#e6f6ff" stroke-width="16" fill="none"/></g>`;
  };
  A.iceSlide = (x, y, s) => `<g transform="${tr(x, y, s)}"><path d="M0 0 C40 -40 60 -160 160 -200 L190 -186 C100 -150 80 -30 30 10Z" fill="#cdeefc" stroke="#fff" stroke-width="5"/><path d="M160 -200 V0 M190 -186 V0" stroke="#9fd3ee" stroke-width="10"/><path d="M30 -40 C60 -80 80 -150 150 -180" stroke="#fff" stroke-width="6" opacity=".7" fill="none"/></g>`;
  A.snowflakes = (n, seed) => {
    const R = A.rng(seed); let s = '<g class="bubbles">';
    for (let i = 0; i < n; i++) { const d = 10 + R() * 9; s += `<circle class="bub" cx="${f1(-100 + R() * 1800)}" cy="${f1(920 + R() * 120)}" r="${f1(3 + R() * 5)}" style="fill:#fff;stroke:none;opacity:.7;animation-duration:${f1(d)}s;animation-delay:-${f1(R() * d)}s"/>`; }
    return s + '</g>';
  };

  /* ---------- Bublinková pole ---------- */
  A.vent = (x, y, s, active, seed = 1) => {
    let b = '';
    if (active) { const R = A.rng(seed); for (let i = 0; i < 7; i++) b += `<circle class="bub-short" cx="${f1(-14 + R() * 28)}" cy="${-110}" r="${f1(5 + R() * 9)}" style="animation-delay:-${f1(R() * 2.6)}s;animation-duration:${f1(2 + R() * 1.5)}s"/>`; }
    return `<g transform="${tr(x, y, s)}">${b}<path d="M-70 0 C-60 -40 -34 -60 -26 -110 L26 -110 C34 -60 60 -40 70 0Z" fill="#6b5a6e"/><path d="M-26 -110 C-20 -96 20 -96 26 -110" fill="${active ? '#ffb36b' : '#3a2f3c'}"/>
<path d="M-40 -20 C-30 -40 -20 -60 -14 -90" stroke="#8f7c92" stroke-width="7" fill="none" stroke-linecap="round"/>${active ? '<ellipse cx="0" cy="-108" rx="24" ry="8" fill="#ffe0a3" class="glowpulse"/>' : ''}</g>`;
  };
  A.bubbleColumn = (x, y0, y1, seed = 2, w = 60) => {
    const R = A.rng(seed); let s = '';
    for (let i = 0; i < 12; i++) { const d = 3 + R() * 3; s += `<circle class="bub" cx="${f1(x - w / 2 + R() * w)}" cy="${y0}" r="${f1(8 + R() * 16)}" style="animation-duration:${f1(d)}s;animation-delay:-${f1(R() * d)}s"/>`; }
    return `<g>${s}</g>`;
  };
  A.bubbleFlower = (x, y, s, c, delay = 0) => `<g transform="${tr(x, y, s)}"><g class="sway" style="animation-delay:${delay}s"><path d="M0 0 C-6 -40 6 -70 0 -110" stroke="#3fbf7f" stroke-width="8" fill="none"/>
${[0, 72, 144, 216, 288].map(a => { const r = a * Math.PI / 180; return `<circle cx="${f1(Math.cos(r) * 24)}" cy="${f1(-120 + Math.sin(r) * 24)}" r="16" fill="${c}" opacity=".55" stroke="#fff" stroke-width="3"/>`; }).join('')}<circle cy="-120" r="12" fill="#fff6c4"/></g></g>`;
  A.crabHouse = (x, y, s, c) => `<g transform="${tr(x, y, s)}"><path d="M-70 0 C-80 -90 -40 -150 0 -150 C40 -150 80 -90 70 0Z" fill="${c}"/><path d="M-60 -60 C-20 -80 20 -80 60 -60 M-66 -20 C-20 -40 20 -40 66 -20" stroke="#fff" stroke-opacity=".35" stroke-width="6" fill="none"/>
<path d="M-22 0 V-40 C-22 -64 22 -64 22 -40 V0Z" fill="#4a2f2a"/><circle cx="34" cy="-96" r="14" fill="#fff6c4" stroke="#4a2f2a" stroke-width="4"/><path d="M0 -150 C10 -176 30 -180 34 -196" stroke="#3fbf7f" stroke-width="6" fill="none"/></g>`;
  A.ventRocks = (x, y) => A.rock(x, y, 170, 120, '#4e3f52', '#6b5a6e') + A.rock(x + 70, y + 8, 100, 70, '#5a4a5e', '#7a6a7e');

  /* ---------- Perlový chrám ---------- */
  A.dune = (x, y, w, h) => `<path d="M${x - w / 2} ${y} C${x - w / 4} ${y - h} ${x + w / 4} ${y - h} ${x + w / 2} ${y}Z" fill="#e3c78a"/><path d="M${x - w / 3} ${y - h * 0.4} C${x - w / 6} ${y - h * 0.7} ${x + w / 6} ${y - h * 0.7} ${x + w / 3} ${y - h * 0.4}" stroke="#f3dda8" stroke-width="6" fill="none"/>`;
  A.temple = (u, x, y) => `<g transform="translate(${x} ${y})"><path d="M-330 -330 L0 -460 L330 -330Z" fill="#e8d6a8" stroke="#c9ad6e" stroke-width="8"/><rect x="-340" y="-340" width="680" height="30" fill="#d9c28a"/>
<rect x="-300" y="-30" width="600" height="30" fill="#d9c28a"/><circle cx="0" cy="-380" r="30" fill="url(#${u}-pearl)"/>
<path d="M-120 -30 V-220 C-120 -300 120 -300 120 -220 V-30Z" fill="#2c5f6e" opacity=".85"/></g>`;
  A.altar = (u, x, y, s) => `<g transform="${tr(x, y, s)}"><circle cy="-130" r="120" fill="url(#${u}-glow)" class="glowpulse"/><rect x="-90" y="-60" width="180" height="60" rx="10" fill="#e8d6a8" stroke="#c9ad6e" stroke-width="6"/><rect x="-110" y="-74" width="220" height="20" rx="8" fill="#d9c28a"/>
${A.scallop(0, -74, 1.1, '#ffd6ea', '#e88db3')}<circle cx="0" cy="-118" r="30" fill="url(#${u}-pearl)"/><circle cx="-10" cy="-128" r="8" fill="#fff"/></g>`;
  A.goldRays = (u) => `<g class="rays">${[[540, 70], [720, 50], [880, 60], [1020, 50]].map(([px, w]) => `<polygon points="${px},-300 ${px + w},-300 ${px + w * 1.6 + 60},900 ${px + w * 0.6 + 60},900" fill="url(#${u}-warm)" opacity=".35"/>`).join('')}</g>`;

  /* ---------- Trůn hlubin ---------- */
  A.bones = (x, y, s) => `<g transform="${tr(x, y, s)}" opacity=".9"><path d="M-120 0 C-60 -40 60 -40 120 0" stroke="#d8d3c4" stroke-width="12" fill="none"/>
${[-80, -40, 0, 40, 80].map(px => `<path d="M${px} -22 C${px - 10} -70 ${px + 10} -90 ${px} -120" stroke="#d8d3c4" stroke-width="9" fill="none" stroke-linecap="round"/>`).join('')}
<path d="M140 -10 L180 -40 L200 -10Z" fill="#6b5a3a"/><rect x="150" y="-14" width="70" height="20" rx="4" fill="#8a744c" transform="rotate(-12 150 -14)"/></g>`;
  A.crown = (u, x, y, s) => `<g transform="${tr(x, y, s)}"><circle cy="-40" r="110" fill="url(#${u}-warm)" class="glowpulse"/><path d="M-80 0 L-90 -90 L-45 -50 L0 -110 L45 -50 L90 -90 L80 0Z" fill="url(#${u}-gold)" stroke="#c97f0a" stroke-width="5"/>
${[[-90, -90], [0, -110], [90, -90]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="12" fill="url(#${u}-pearl)"/>`).join('')}<circle cx="0" cy="-36" r="16" fill="#5ee7df" stroke="#fff" stroke-width="4"/></g>`;
  A.glowAnemone = (x, y, s, c, delay = 0) => A.anemone(x, y, s, c, '#ffffff', delay) + `<circle cx="${x}" cy="${y - 60 * s}" r="${70 * s}" fill="${c}" opacity=".18" class="glowpulse"/>`;
})(typeof window !== 'undefined' ? window : globalThis);
