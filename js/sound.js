/* =========================================================================
   Korálové sny – zvuky generované přes Web Audio API (žádné soubory)
   Na iPadu se zvuk odemkne až prvním dotykem (požadavek iOS).
   ========================================================================= */
(function (root) {
  'use strict';
  const CD = root.CD = root.CD || {};
  const SCALE = [523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1174.66, 1318.51, 1567.98, 1760, 2093];

  const S = {
    ctx: null, master: null, noiseBuf: null,
    get on() { return !(CD.Store && CD.Store.data && CD.Store.data.settings.sound === false); },
    unlock() {
      try {
        if (!this.ctx) {
          const AC = window.AudioContext || window.webkitAudioContext;
          if (!AC) return;
          this.ctx = new AC();
          this.master = this.ctx.createGain();
          this.master.gain.value = 0.55;
          this.master.connect(this.ctx.destination);
          const len = this.ctx.sampleRate * 0.4;
          this.noiseBuf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
          const d = this.noiseBuf.getChannelData(0);
          for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
        }
        if (this.ctx.state !== 'running') this.ctx.resume().catch(() => {});   // iOS: i stav „interrupted"
      } catch (e) { /* bez zvuku */ }
    },
    tone(freq, dur = 0.15, type = 'sine', vol = 0.2, delay = 0, slideTo = 0) {
      if (!this.on || !this.ctx) return;
      const t = this.ctx.currentTime + delay;
      const o = this.ctx.createOscillator(), g = this.ctx.createGain();
      o.type = type;
      o.frequency.setValueAtTime(freq, t);
      if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(vol, t + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g); g.connect(this.master);
      o.start(t); o.stop(t + dur + 0.05);
    },
    noise(dur = 0.12, vol = 0.12, delay = 0, freq = 1800) {
      if (!this.on || !this.ctx || !this.noiseBuf) return;
      const t = this.ctx.currentTime + delay;
      const src = this.ctx.createBufferSource(), f = this.ctx.createBiquadFilter(), g = this.ctx.createGain();
      src.buffer = this.noiseBuf;
      f.type = 'bandpass'; f.frequency.value = freq; f.Q.value = 0.8;
      g.gain.setValueAtTime(vol, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      src.connect(f); f.connect(g); g.connect(this.master);
      src.start(t); src.stop(t + dur + 0.05);
    },
    /* „šum vlny" stoupající filtrem – efekt pro combo */
    noiseSweep(dur = 0.4, vol = 0.08) {
      if (!this.on || !this.ctx || !this.noiseBuf) return;
      const t = this.ctx.currentTime;
      const src = this.ctx.createBufferSource(), f = this.ctx.createBiquadFilter(), g = this.ctx.createGain();
      src.buffer = this.noiseBuf; src.loop = true;
      f.type = 'bandpass'; f.Q.value = 1.4;
      f.frequency.setValueAtTime(500, t); f.frequency.exponentialRampToValueAtTime(5000, t + dur);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + dur * 0.5); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      src.connect(f); f.connect(g); g.connect(this.master);
      src.start(t); src.stop(t + dur + 0.05);
    },
    play(name, arg = 0) {
      if (!this.ctx) return;
      // při fanfárách hudbu krátce ztlumit
      if (CD.Music && (name === 'win' || name === 'lose' || name === 'task')) CD.Music.duck(name === 'task' ? 1.6 : 3);
      if (!this.on) return;
      switch (name) {
        case 'card': {
          // tón stoupá se sérií a ladí s tóninou hudby aktuálního prostředí
          const f = CD.Music ? CD.Music.cardFreq(arg) : SCALE[Math.min(Math.max(arg - 1, 0), SCALE.length - 1)];
          this.noise(0.06, 0.08, 0, 2600);
          this.tone(f, 0.22, 'triangle', 0.2);
          this.tone(f * 2, 0.14, 'sine', 0.05);
          if (arg >= 5) this.tone(f * 3, 0.3, 'sine', 0.025 + Math.min(arg, 15) * 0.002, 0.03);   // třpyt při sérii
          break;
        }
        case 'combo': {   // arg = stupeň série 1–5
          const ns = CD.Music ? CD.Music.keyNotes(Math.min(3 + arg, 8)) : [784, 988, 1175, 1568, 1976];
          ns.forEach((f, i) => { this.tone(f, 0.22, 'triangle', 0.11, i * 0.055); this.tone(f * 2, 0.16, 'sine', 0.035, i * 0.055 + 0.02); });
          this.noiseSweep(0.45, 0.06 + arg * 0.012);
          if (arg >= 3) this.tone(ns[0] / 2, 0.6, 'sine', 0.12, 0, ns[0]);
          break;
        }
        case 'comboEnd': {
          const ns = CD.Music ? CD.Music.keyNotes(3) : [784, 659, 523];
          this.tone(ns[2], 0.14, 'triangle', 0.07); this.tone(ns[0], 0.2, 'triangle', 0.06, 0.08);
          break;
        }
        case 'draw': this.noise(0.14, 0.12, 0, 1400); this.tone(330, 0.12, 'sine', 0.07, 0, 220); break;
        case 'flip': this.noise(0.05, 0.05, 0, 3200); break;
        case 'bad': this.tone(180, 0.16, 'square', 0.05); this.tone(140, 0.2, 'square', 0.04, 0.08); break;
        case 'coin': this.tone(1318.5, 0.08, 'square', 0.04); this.tone(1760, 0.14, 'square', 0.04, 0.06); break;
        case 'bonus': [784, 988, 1175, 1568].forEach((f, i) => this.tone(f, 0.16, 'triangle', 0.14, i * 0.06)); break;
        case 'win': [523, 659, 784, 1047, 1319, 1568].forEach((f, i) => this.tone(f, 0.35, 'triangle', 0.16, i * 0.09)); break;
        case 'lose': [392, 330, 262].forEach((f, i) => this.tone(f, 0.3, 'triangle', 0.14, i * 0.16)); break;
        case 'task': [1047, 1319, 1568, 2093, 2637].forEach((f, i) => this.tone(f, 0.25, 'sine', 0.12, i * 0.07)); break;
        case 'click': this.tone(760, 0.06, 'sine', 0.08); break;
        case 'unlock': this.tone(880, 0.1, 'triangle', 0.12); this.tone(1320, 0.18, 'triangle', 0.12, 0.08); break;
        case 'shuffle': for (let i = 0; i < 6; i++) this.noise(0.06, 0.07, i * 0.06, 2000 + i * 200); break;
        case 'wild': [660, 880, 1100, 1320, 1760].forEach((f, i) => this.tone(f, 0.18, 'sine', 0.1, i * 0.04)); break;
        case 'star': this.tone(1046.5 + arg * 262, 0.3, 'triangle', 0.16); break;
        // překážky Hlubin
        case 'splash': this.noise(0.35, 0.16, 0, 700); this.tone(420, 0.25, 'sine', 0.08, 0, 160); break;
        case 'ice': this.tone(2600, 0.06, 'triangle', 0.08); this.noise(0.08, 0.1, 0, 5200); break;
        case 'iceBreak': [2400, 3100, 1900, 2800, 3500].forEach((f, i) => this.tone(f, 0.12, 'triangle', 0.07, i * 0.035)); this.noise(0.3, 0.16, 0, 4500); break;
        case 'bubHit': this.tone(500, 0.08, 'sine', 0.1, 0, 900); break;
        case 'pop': for (let i = 0; i < Math.min(arg || 1, 3); i++) { this.tone(600, 0.09, 'sine', 0.16, i * 0.08, 1800); this.noise(0.04, 0.1, i * 0.08 + 0.05, 3000); } break;
        case 'shell': [784, 988, 1319, 1568, 1976].forEach((f, i) => { this.tone(f, 0.4, 'sine', 0.09, i * 0.06); this.tone(f * 2.76, 0.2, 'sine', 0.02, i * 0.06); }); break;
        case 'chomp': this.tone(95, 0.18, 'square', 0.12, 0, 60); this.noise(0.1, 0.2, 0, 600); this.tone(80, 0.15, 'square', 0.1, 0.16, 50); this.noise(0.1, 0.16, 0.16, 500); break;
        case 'sticker': [1047, 1568, 2093].forEach((f, i) => this.tone(f, 0.3, 'triangle', 0.12, i * 0.08)); this.noise(0.15, 0.06, 0, 6000); break;
        case 'trophy': [523, 659, 784, 1047, 784, 1047, 1319].forEach((f, i) => this.tone(f, 0.25, 'triangle', 0.13, i * 0.08)); break;
      }
    },
  };
  CD.Sound = S;
})(typeof window !== 'undefined' ? window : globalThis);
