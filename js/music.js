/* =========================================================================
   Korálové sny – hudba na pozadí generovaná přes Web Audio (žádné soubory)
   Každé prostředí má vlastní skladbu: tóninu, tempo, nástroje a melodii.
   Při dlouhé sérii v levelu se přidají bicí a vyšší rejstřík (intenzita).
   ========================================================================= */
(function (root) {
  'use strict';
  const CD = root.CD = root.CD || {};
  const mtof = m => 440 * Math.pow(2, (m - 69) / 12);
  const MODES = {
    major: [0, 2, 4, 5, 7, 9, 11], minor: [0, 2, 3, 5, 7, 8, 10], dorian: [0, 2, 3, 5, 7, 9, 10],
  };

  /* Zápis: akordy v půltónech od základního tónu; melodie = takty, v každém jeden znak na krok
     (číslo = stupeň stupnice, '#' zvýší o půltón, '-' drží tón, '.' pauza).
     Basa: R = základ, 5 = kvinta, 8 = oktáva. Arpeggio: index tónu akordu (3+ = o oktávu výš). */
  const THEMES = {
    // úvodní menu – klidná ukolébavka (G dur)
    title: {
      key: 67, mode: 'major', step: 0.32, steps: 8, cutoff: 4200, rev: 0.45,
      chords: [[0, 4, 7], [5, 9, 12], [-3, 0, 4], [5, 9, 12]],
      bass: 'R...5...', arp: [0, 1, 2, 3, 2, 1, 2, 1], arpInst: 'harp', arpVol: 0.045, pad: 0.018,
      melInst: 'box', melOct: 12, melVol: 0.07,
      mel: ['4 - 2 - 0 - 2 -', '4 - 5 - 4 - - -', '4 - 2 - 1 - 0 -', '1 - - - - - . .',
            '4 - 2 - 0 - 2 -', '5 - 7 - 5 - 4 -', '2 - 1 - 2 - 4 -', '0 - - - - - . .'],
      perc: [], fx: 'bubbles',
    },
    // 1. Korálový útes – slunečné calypso, marimba a steel drum (C dur)
    reef: {
      key: 60, mode: 'major', step: 0.27, steps: 8, cutoff: 5200, rev: 0.25,
      chords: [[0, 4, 7], [-3, 0, 4], [5, 9, 12], [7, 11, 14]],
      bass: 'R..5R.8.', arp: [null, 1, 2, null, 1, 2, 3, 2], arpInst: 'marimba', arpVol: 0.06, pad: 0,
      melInst: 'steel', melOct: 12, melVol: 0.085,
      mel: ['4 - 4 2 0 - 2 4', '5 - 4 - 2 - . .', '3 - 5 - 7 - 5 3', '4 - 2 - 1 - - .',
            '4 - 4 2 0 - 2 4', '5 - 7 - 5 4 2 -', '3 4 5 - 3 - 1 -', '1 - 2 - 0 - . .'],
      perc: [{ i: 'shaker', p: '.x.x.x.x', lvl: 0, v: 0.025 }, { i: 'kick', p: 'x...x...', lvl: 1, v: 0.16 }, { i: 'shaker', p: 'xxxxxxxx', lvl: 2, v: 0.02 }],
      fx: 'bubbles',
    },
    // 2. Perlová jeskyně – tajemná, skleněné zvonky a dlouhá ozvěna (D dórská)
    cave: {
      key: 62, mode: 'dorian', step: 0.36, steps: 8, cutoff: 3400, rev: 0.6,
      chords: [[0, 3, 7], [5, 9, 12], [-2, 2, 5], [7, 10, 14]],
      bass: 'R.....5.', arp: [0, null, 2, null, 3, null, 1, null], arpInst: 'glass', arpVol: 0.045, pad: 0.03,
      melInst: 'flute', melOct: 12, melVol: 0.07,
      mel: ['4 - - - 2 - 3 -', '5 - - - 4 - . .', '6 - 4 - 2 - 1 -', '4 - - - - - . .',
            '7 - - - 6 - 4 -', '5 - 4 - 3 - - .', '2 - 1 - 2 - 4 -', '1 - - - - - . .'],
      perc: [{ i: 'drip', p: '...x....', lvl: 1, v: 0.05 }, { i: 'shaker', p: '..x...x.', lvl: 1, v: 0.02 }, { i: 'kick', p: 'x.......', lvl: 2, v: 0.14 }],
      fx: 'drips',
    },
    // 3. Potopená loď – námořnická píseň v 6/8, harmonika a basa „um-pa-pa" (a moll)
    ship: {
      key: 57, mode: 'minor', step: 0.2, steps: 6, cutoff: 3800, rev: 0.3,
      chords: [[0, 3, 7], [-2, 2, 5], [0, 3, 7], [7, 11, 14], [0, 3, 7], [-2, 2, 5], [7, 11, 14], [0, 3, 7]],
      bass: 'R..5..', stab: '..x..x', arp: null, arpInst: 'accordion', arpVol: 0.03, pad: 0,
      melInst: 'accordion', melOct: 12, melVol: 0.065,
      mel: ['4 - 4 4 - 2', '3 - 3 1 - -', '2 - 0 2 - 4', '1 - - -1# - -',
            '4 - 4 5 - 4', '3 - 3 1 - 3', '1 - 2 1 - -1#', '0 - - - - .'],
      perc: [{ i: 'kick', p: 'x.....', lvl: 0, v: 0.12 }, { i: 'shaker', p: '...x..', lvl: 1, v: 0.03 }, { i: 'shaker', p: '.xx.xx', lvl: 2, v: 0.02 }],
      fx: 'creak',
    },
    // 4. Zahrada sasanek – snivý valčík ve 3/4, harfa a flétna (F dur)
    garden: {
      key: 65, mode: 'major', step: 0.28, steps: 6, cutoff: 4600, rev: 0.45,
      chords: [[0, 4, 7], [-3, 0, 4], [5, 9, 12], [7, 11, 14]],
      bass: 'R.....', arp: [0, 1, 2, 3, 2, 1], arpInst: 'harp', arpVol: 0.05, pad: 0.02,
      melInst: 'flute', melOct: 12, melVol: 0.07,
      mel: ['4 - - - 2 3', '2 - - - 0 1', '3 - - - 5 4', '4 - - - - -',
            '7 - - - 6 5', '5 - - - 4 2', '3 - 2 - 1 -', '1 - - - . .'],
      perc: [{ i: 'shaker', p: '..x.x.', lvl: 1, v: 0.025 }, { i: 'kick', p: 'x.....', lvl: 1, v: 0.12 }, { i: 'shaker', p: 'xxxxxx', lvl: 2, v: 0.015 }],
      fx: 'shimmer',
    },
    // 5. Palác vln – vznešená fanfára, žestě, harfa a tympány (Es dur)
    palace: {
      key: 63, mode: 'major', step: 0.32, steps: 8, cutoff: 5200, rev: 0.45,
      chords: [[0, 4, 7], [5, 9, 12], [-3, 0, 4], [7, 11, 14]],
      bass: 'R...R.5.', arp: [0, 1, 2, 3, 5, 3, 2, 1], arpInst: 'harp', arpVol: 0.04, pad: 0.025,
      melInst: 'brass', melOct: 0, melVol: 0.06,
      mel: ['0 - 2 - 4 - - -', '5 - 4 - 3 - 2 -', '2 - 0 - 2 - 4 -', '4 - - - 1 - - -',
            '7 - - 6 7 - 4 -', '5 - - 4 5 - 7 -', '6 - 5 - 4 - 2 -', '1 - - - - - . .'],
      perc: [{ i: 'timp', p: 'x.......', lvl: 0, v: 0.14 }, { i: 'shaker', p: '..x...x.', lvl: 1, v: 0.025 }, { i: 'timp', p: 'x...x.x.', lvl: 2, v: 0.1 }],
      fx: 'shimmer',
    },
  };
  const CHAPTER_THEMES = ['reef', 'cave', 'ship', 'garden', 'palace'];
  const FORM_BARS = 16;          // 4 takty úvod, 8 taktů melodie, 4 takty mezihra

  function parseMel(theme) {
    // převede zápis melodie na pole kroků: { m: midi, len: počet kroků } | null
    const out = [];
    theme.mel.forEach(bar => bar.trim().split(/\s+/).forEach(tok => out.push(tok)));
    const notes = new Array(out.length).fill(null);
    let last = -1;
    out.forEach((tok, i) => {
      if (tok === '-') { if (last >= 0) notes[last].len++; return; }
      if (tok === '.') { last = -1; return; }
      const sharp = tok.endsWith('#');
      const d = parseInt(tok, 10);
      const sc = MODES[theme.mode], oct = Math.floor(d / 7), idx = ((d % 7) + 7) % 7;
      notes[i] = { m: theme.key + theme.melOct + oct * 12 + sc[idx] + (sharp ? 1 : 0), len: 1 };
      last = i;
    });
    return notes;
  }
  Object.values(THEMES).forEach(t => { t.notes = parseMel(t); });

  const M = {
    THEMES, CHAPTER_THEMES,
    ctx: null, out: null, rev: null, bus: null, filt: null,
    want: null, cur: null, timer: 0, nextT: 0, stepN: 0, level: 0, duckUntil: 0,

    get on() { return !(CD.Store && CD.Store.data && CD.Store.data.settings.music === false); },

    /* připojí hudbu ke zvukovému kontextu (vznikne po prvním dotyku) */
    init() {
      if (this.out) return true;
      const S = CD.Sound;
      if (!S || !S.ctx) return false;
      const ctx = this.ctx = S.ctx;
      this.out = ctx.createGain();
      this.out.gain.value = this.on ? 1 : 0;
      this.out.connect(ctx.destination);
      // dozvuk z vygenerované impulsní odezvy (≈2,4 s)
      try {
        const len = Math.floor(ctx.sampleRate * 2.4), ir = ctx.createBuffer(2, len, ctx.sampleRate);
        for (let c = 0; c < 2; c++) {
          const d = ir.getChannelData(c);
          for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.2);
        }
        this.rev = ctx.createConvolver();
        this.rev.buffer = ir;
        const rg = ctx.createGain(); rg.gain.value = 0.55;
        this.rev.connect(rg); rg.connect(this.out);
      } catch (e) { this.rev = null; }
      return true;
    },

    /* téma podle obrazovky (titul, domov = scéna, mapa, hra = kapitola levelu) */
    themeFor(screen) {
      const d = CD.Store && CD.Store.data;
      if (!d) return 'title';
      if (screen === 'game' && CD.Game && CD.Game.def) return CHAPTER_THEMES[CD.Game.def.chapter] || 'reef';
      if (screen === 'home') return CHAPTER_THEMES[d.scene] || 'reef';
      if (screen === 'map') return CHAPTER_THEMES[Math.floor((Math.min(d.unlocked, CD.Levels.COUNT) - 1) / 10)] || 'reef';
      return 'title';
    },
    forScreen(screen) {
      if (screen !== 'game') this.level = 0;
      this.play(this.themeFor(screen));
    },

    play(id) {
      if (!THEMES[id]) id = 'title';
      this.want = id;
      this.kick();
    },

    /* spustí/přepne hudbu, pokud to jde (odemčený zvuk, zapnutá hudba, viditelná stránka) */
    kick() {
      if (!this.want || !this.init()) return;
      if (!this.on || (typeof document !== 'undefined' && document.hidden)) { if (this.timer) this.stop(); return; }
      if (this.cur === this.want && this.timer) return;          // už hraje (nerušit ani ztlumení)
      const ctx = this.ctx;
      if (!this.timer) { this.out.gain.cancelScheduledValues(ctx.currentTime); this.out.gain.setTargetAtTime(1, ctx.currentTime, 0.2); }
      // plynulý přechod: staré téma doznívá, nové se rozjede
      if (this.bus) {
        const old = this.bus;
        old.gain.cancelScheduledValues(ctx.currentTime);
        old.gain.setValueAtTime(old.gain.value, ctx.currentTime);
        old.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.2);
        setTimeout(() => { try { old.disconnect(); } catch (e) { /* už odpojeno */ } }, 3500);
      }
      const t = THEMES[this.want];
      this.cur = this.want;
      this.bus = ctx.createGain();
      this.bus.gain.setValueAtTime(0, ctx.currentTime);
      this.bus.gain.linearRampToValueAtTime(0.42, ctx.currentTime + 1.5);
      this.filt = ctx.createBiquadFilter();
      this.filt.type = 'lowpass'; this.filt.frequency.value = t.cutoff; this.filt.Q.value = 0.5;
      this.bus.connect(this.filt);
      this.filt.connect(this.out);
      if (this.rev) { const s = ctx.createGain(); s.gain.value = t.rev; this.filt.connect(s); s.connect(this.rev); }
      this.stepN = 0;
      this.nextT = ctx.currentTime + 0.15;
      if (!this.timer) this.timer = setInterval(() => this.tick(), 60);
    },

    stop() {
      clearInterval(this.timer); this.timer = 0;
      if (this.out && this.ctx) {
        this.out.gain.cancelScheduledValues(this.ctx.currentTime);
        this.out.gain.setTargetAtTime(0, this.ctx.currentTime, 0.15);
      }
      this.cur = null;
    },

    /* zapnutí/vypnutí v nastavení */
    refresh() { if (this.on) this.kick(); else this.stop(); },

    /* intenzita podle série v levelu: 0 klid, 1 bicí, 2 plné obsazení */
    intensity(n) { this.level = Math.max(0, Math.min(2, n | 0)); },

    /* ztlumení hudby během fanfár */
    duck(sec = 2.5, to = 0.25) {
      if (!this.out || !this.timer) return;
      const g = this.out.gain, t = this.ctx.currentTime;
      g.cancelScheduledValues(t);
      g.setTargetAtTime(to, t, 0.08);
      g.setTargetAtTime(1, t + sec, 0.6);
    },

    /* tón karty v tónině aktuální hudby – série stoupá po pentatonice */
    cardFreq(streak) {
      const t = THEMES[this.cur || this.want || 'reef'];
      const minorish = t.mode !== 'major';
      const pent = minorish ? [0, 3, 5, 7, 10] : [0, 2, 4, 7, 9];
      let base = t.key; while (base < 67) base += 12; while (base > 78) base -= 12;
      const i = Math.min(Math.max(streak - 1, 0), 12);
      return mtof(base + Math.floor(i / 5) * 12 + pent[i % 5]);
    },
    keyNotes(n = 5, up = 0) {
      const t = THEMES[this.cur || this.want || 'reef'];
      const pent = t.mode !== 'major' ? [0, 3, 7, 10, 12, 15, 19, 22] : [0, 4, 7, 9, 12, 16, 19, 21];
      let base = t.key; while (base < 72) base += 12;
      return pent.slice(0, n).map(s => mtof(base + s + up));
    },

    /* ---------- plánovač not (dopředu ~0,3 s) ---------- */
    tick() {
      const ctx = this.ctx;
      if (!ctx || ctx.state !== 'running') return;
      const t = THEMES[this.cur];
      if (!t) return;
      if (this.nextT < ctx.currentTime - 0.2) this.nextT = ctx.currentTime + 0.05;   // po pauze nedohánět
      while (this.nextT < ctx.currentTime + 0.3) {
        try { this.schedule(t, this.stepN, this.nextT); } catch (e) { /* vadná nota nesmí zastavit hudbu */ }
        this.nextT += t.step;
        this.stepN++;
      }
    },

    schedule(t, n, time) {
      const bus = this.bus, steps = t.steps, step = n % steps, bar = Math.floor(n / steps);
      const formBar = bar % FORM_BARS, chord = t.chords[bar % t.chords.length];
      const k = t.key, lvl = this.level;
      const melOn = formBar >= 4 && formBar < 12;
      // podložka (pad) – celý takt
      if (t.pad && step === 0) chord.forEach(s => this.inst('pad', time, mtof(k + s), t.step * steps * 1.02, t.pad, bus));
      // basa
      const b = t.bass[step];
      if (b && b !== '.') {
        let r = k + chord[0];                       // basa v rozsahu E2–E3, aby byla slyšet i z tabletu
        while (r > 52) r -= 12;
        while (r < 40) r += 12;
        this.inst('bass', time, mtof(r + (b === '5' ? 7 : b === '8' ? 12 : 0)), t.step * 1.8, 0.11, bus);
      }
      // údery akordu (námořnická harmonika)
      if (t.stab && t.stab[step] === 'x') chord.forEach(s => this.inst('accordion', time, mtof(k + s), t.step * 0.8, 0.022, bus));
      // arpeggio – v mezihře a při vysoké intenzitě o oktávu výš
      if (t.arp) {
        const a = t.arp[step];
        if (a !== null && a !== undefined) {
          const up = (formBar >= 12 || lvl >= 2) ? 12 : 0;
          const s = chord[a % 3] + 12 * Math.floor(a / 3) + up;
          this.inst(t.arpInst, time, mtof(k + s), t.step * 2.5, t.arpVol, bus);
        }
      }
      // melodie (každé druhé kolo jiným nástrojem pro pestrost)
      if (melOn) {
        const idx = ((formBar - 4) * steps + step) % t.notes.length, note = t.notes[idx];
        if (note) {
          let inst = t.melInst, m = note.m;
          if (Math.floor(bar / FORM_BARS) % 2 === 1) {          // druhé kolo: hrací skříňka o oktávu výš
            if (inst === 'box') inst = 'flute'; else { inst = 'box'; m += 12; }
          }
          this.inst(inst, time, mtof(m), note.len * t.step * 0.95, t.melVol, bus);
        }
      }
      // bicí podle intenzity
      t.perc.forEach(p => { if (lvl >= p.lvl && p.p[step % p.p.length] === 'x') this.inst(p.i, time, 0, 0, p.v, bus); });
      // podmořské zvuky prostředí
      if (step === 0 && Math.random() < 0.5) this.ambient(t, time + Math.random() * t.step * steps, bus);
    },

    ambient(t, time, bus) {
      if (t.fx === 'bubbles') for (let i = 0, c = 1 + Math.floor(Math.random() * 3); i < c; i++) this.inst('bubble', time + i * 0.09, 300 + Math.random() * 500, 0, 0.03, bus);
      else if (t.fx === 'drips') this.inst('drip', time, 900 + Math.random() * 900, 0, 0.04, bus);
      else if (t.fx === 'creak') { if (Math.random() < 0.35) this.inst('creak', time, 60 + Math.random() * 30, 0, 0.03, bus); else this.inst('bubble', time, 260 + Math.random() * 300, 0, 0.025, bus); }
      else if (t.fx === 'shimmer') {
        const sc = MODES[t.mode];
        for (let i = 0; i < 3; i++) this.inst('glass', time + i * 0.11, mtof(t.key + 24 + sc[(i * 2 + Math.floor(Math.random() * 3)) % 7]), 1.5, 0.012, bus);
      }
    },

    /* ---------- nástroje ---------- */
    osc(type, f, t0, t1, dest, detune = 0) {
      const o = this.ctx.createOscillator();
      o.type = type; o.frequency.setValueAtTime(f, t0);
      if (detune) o.detune.setValueAtTime(detune, t0);
      o.connect(dest); o.start(t0); o.stop(t1 + 0.05);
      return o;
    },
    gainEnv(t, a, peak, hold, rel, dest) {
      const g = this.ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(Math.max(peak, 0.0002), t + a);
      if (hold > 0) g.gain.setValueAtTime(Math.max(peak, 0.0002), t + a + hold);
      g.gain.exponentialRampToValueAtTime(0.0001, t + a + Math.max(hold, 0) + rel);
      g.connect(dest);
      return g;
    },
    noiseSrc(t, dur, dest) {
      const buf = CD.Sound.noiseBuf;
      if (!buf) return null;
      const s = this.ctx.createBufferSource();
      s.buffer = buf; s.connect(dest); s.start(t, Math.random() * 0.2); s.stop(t + dur);
      return s;
    },

    inst(name, t, f, dur, v, dest) {
      const ctx = this.ctx;
      if (!(f > 0)) f = name === 'drip' ? 1300 : name === 'bubble' ? 500 : name === 'creak' ? 75 : 440;
      switch (name) {
        case 'marimba': {
          const g = this.gainEnv(t, 0.005, v, 0, 0.55, dest);
          this.osc('sine', f, t, t + 0.6, g);
          const g2 = this.gainEnv(t, 0.003, v * 0.35, 0, 0.12, dest);
          this.osc('sine', f * 4, t, t + 0.15, g2);
          break;
        }
        case 'steel': {
          const g = this.gainEnv(t, 0.006, v, 0, Math.min(1.2, dur + 0.4), dest);
          const o = this.osc('sine', f * 1.01, t, t + 1.3, g);
          o.frequency.exponentialRampToValueAtTime(f, t + 0.05);
          const g2 = this.gainEnv(t, 0.006, v * 0.45, 0, 0.5, dest);
          this.osc('sine', f * 2, t, t + 0.6, g2);
          const g3 = this.gainEnv(t, 0.004, v * 0.18, 0, 0.25, dest);
          this.osc('sine', f * 3.01, t, t + 0.3, g3);
          break;
        }
        case 'glass': {
          const r = Math.max(1.2, dur);
          const g = this.gainEnv(t, 0.004, v, 0, r, dest);
          this.osc('sine', f, t, t + r, g);
          const g2 = this.gainEnv(t, 0.003, v * 0.3, 0, r * 0.5, dest);
          this.osc('sine', f * 2.76, t, t + r * 0.5, g2);
          const g3 = this.gainEnv(t, 0.002, v * 0.12, 0, r * 0.25, dest);
          this.osc('sine', f * 5.4, t, t + r * 0.25, g3);
          break;
        }
        case 'box': {      // hrací skříňka
          const g = this.gainEnv(t, 0.003, v, 0, 1.3, dest);
          this.osc('sine', f, t, t + 1.35, g);
          const g2 = this.gainEnv(t, 0.002, v * 0.25, 0, 0.4, dest);
          this.osc('sine', f * 3, t, t + 0.45, g2);
          break;
        }
        case 'harp': {
          const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2600; lp.connect(dest);
          const g = this.gainEnv(t, 0.004, v, 0, 1.3, lp);
          this.osc('triangle', f, t, t + 1.35, g);
          const g2 = this.gainEnv(t, 0.003, v * 0.25, 0, 0.5, dest);
          this.osc('sine', f * 2, t, t + 0.55, g2);
          break;
        }
        case 'flute': {
          const hold = Math.max(0.05, dur - 0.12);
          const g = this.gainEnv(t, 0.08, v, hold, 0.22, dest);
          const o = this.osc('sine', f, t, t + 0.08 + hold + 0.25, g);
          const lfo = ctx.createOscillator(), lg = ctx.createGain();
          lfo.frequency.value = 5.2; lg.gain.setValueAtTime(0, t); lg.gain.linearRampToValueAtTime(f * 0.007, t + 0.3);
          lfo.connect(lg); lg.connect(o.frequency); lfo.start(t); lfo.stop(t + 0.08 + hold + 0.3);
          const g2 = this.gainEnv(t, 0.06, v * 0.18, hold, 0.2, dest);
          this.osc('triangle', f * 2, t, t + 0.08 + hold + 0.25, g2);
          break;
        }
        case 'accordion': {
          const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1700; lp.connect(dest);
          const hold = Math.max(0.03, dur - 0.08);
          const g = this.gainEnv(t, 0.035, v, hold, 0.1, lp);
          this.osc('sawtooth', f, t, t + hold + 0.2, g, -7);
          this.osc('sawtooth', f, t, t + hold + 0.2, g, 7);
          this.osc('square', f / 2, t, t + hold + 0.2, g);
          break;
        }
        case 'brass': {
          const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.Q.value = 2;
          lp.frequency.setValueAtTime(500, t); lp.frequency.exponentialRampToValueAtTime(2400, t + 0.09); lp.frequency.exponentialRampToValueAtTime(1300, t + 0.4);
          lp.connect(dest);
          const hold = Math.max(0.05, dur - 0.1);
          const g = this.gainEnv(t, 0.05, v, hold, 0.2, lp);
          this.osc('sawtooth', f, t, t + hold + 0.3, g, -5);
          this.osc('sawtooth', f, t, t + hold + 0.3, g, 5);
          break;
        }
        case 'pad': {
          const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 850; lp.connect(dest);
          const g = this.gainEnv(t, Math.min(0.8, dur * 0.4), v, Math.max(0, dur - 0.8), 1.0, lp);
          const end = t + dur + 1.1;
          this.osc('sawtooth', f, t, end, g, -9);
          this.osc('sawtooth', f, t, end, g, 9);
          this.osc('triangle', f / 2, t, end, g);
          break;
        }
        case 'bass': {
          const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 650; lp.connect(dest);
          const g = this.gainEnv(t, 0.012, v, 0, Math.max(0.3, dur), lp);
          this.osc('triangle', f, t, t + dur + 0.1, g);
          this.osc('sine', f, t, t + dur + 0.1, g);
          break;
        }
        case 'kick': {
          const g = this.gainEnv(t, 0.004, v, 0, 0.28, dest);
          const o = this.osc('sine', 120, t, t + 0.3, g);
          o.frequency.exponentialRampToValueAtTime(45, t + 0.16);
          break;
        }
        case 'timp': {
          const g = this.gainEnv(t, 0.006, v, 0, 0.9, dest);
          const o = this.osc('sine', 98, t, t + 0.95, g);
          o.frequency.exponentialRampToValueAtTime(82, t + 0.5);
          const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 300; lp.connect(dest);
          const gn = this.gainEnv(t, 0.003, v * 0.6, 0, 0.25, lp);
          this.noiseSrc(t, 0.3, gn);
          break;
        }
        case 'shaker': {
          const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 6000; hp.connect(dest);
          const g = this.gainEnv(t, 0.004, v, 0, 0.06, hp);
          this.noiseSrc(t, 0.08, g);
          break;
        }
        case 'bubble': {
          const g = this.gainEnv(t, 0.004, v, 0, 0.09, dest);
          const o = this.osc('sine', f, t, t + 0.12, g);
          o.frequency.exponentialRampToValueAtTime(f * 2.6, t + 0.09);
          break;
        }
        case 'drip': {
          const g = this.gainEnv(t, 0.002, v, 0, 0.14, dest);
          const o = this.osc('sine', f * 0.6, t, t + 0.16, g);
          o.frequency.exponentialRampToValueAtTime(f * 1.6, t + 0.05);
          break;
        }
        case 'creak': {
          const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 420; bp.Q.value = 3; bp.connect(dest);
          const g = this.gainEnv(t, 0.25, v, 0.2, 0.45, bp);
          const o = this.osc('sawtooth', f, t, t + 1, g);
          o.frequency.linearRampToValueAtTime(f * 1.25, t + 0.9);
          break;
        }
      }
    },
  };

  CD.Music = M;
})(typeof window !== 'undefined' ? window : globalThis);
