(function () {
'use strict';
const NAME = document.documentElement.lang === 'en' ? 'A Good Keyboard' : 'Un bon clavier';
const W = 393, H = 852, CX = W / 2, CY = Math.round(H * 0.46);
const FONT_STACK = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif';
const font = (px, w = 700) => `${w} ${px}px ${FONT_STACK}`;
const TAU = Math.PI * 2;
const PAL = {
  light: { bg: '#F2F2F7', ink: '#000000', green: '#237220', soft: '#8E8E93', spark2: '#6DB85F', hot: '#FFFFFF',
           face: '#FFFFFF', face2: '#F2F2F5', skirt: '#C8C8CE', shadow: 'rgba(0,0,0,0.18)', glow: false },
  dark:  { bg: '#000000', ink: '#FFFFFF', green: '#4EC24A', soft: '#9C9CA3', spark2: '#B9F2A6', hot: '#F2FFE9',
           face: '#5A5A60', face2: '#3F3F44', skirt: '#1F1F22', shadow: 'rgba(0,0,0,0.75)', glow: true }
};
const clamp = (v, a = 0, b = 1) => v < a ? a : v > b ? b : v;
const lerp = (a, b, k) => a + (b - a) * k;
const eio = k => k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
const invEio = y => y < 0.5 ? Math.cbrt(y / 4) : 1 - Math.cbrt(2 * (1 - y)) / 2;
const eo = k => 1 - Math.pow(1 - k, 3);
const invEo = y => 1 - Math.cbrt(1 - clamp(y));
const eback = k => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(k - 1, 3) + c1 * Math.pow(k - 1, 2); };
const ss = (a, b, t) => { const k = clamp((t - a) / (b - a)); return k * k * (3 - 2 * k); };
function rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const T = {};
(function () {
  const c = document.createElement('canvas'), x = c.getContext('2d');
  x.font = font(40);
  T.w = x.measureText(NAME).width; T.x0 = CX - T.w / 2; T.x1 = CX + T.w / 2;
  T.bounds = [];
  for (let j = 0; j <= NAME.length; j++) T.bounds.push(T.x0 + x.measureText(NAME.slice(0, j)).width);
  T.letters = [];
  for (let i = 0; i < NAME.length; i++) {
    if (NAME[i] === ' ') continue;
    const cx = (T.bounds[i] + T.bounds[i + 1]) / 2;
    T.letters.push({ ch: NAME[i], i, cx, w: T.bounds[i + 1] - T.bounds[i], xn: (cx - T.x0) / T.w });
  }
  const S = 3, bh = 100;
  c.width = Math.ceil(W * S); c.height = bh * S;
  x.setTransform(S, 0, 0, S, 0, 0); x.font = font(40); x.textAlign = 'left'; x.textBaseline = 'middle';
  x.fillStyle = '#000'; x.fillText(NAME, T.x0, bh / 2);
  const d = x.getImageData(0, 0, c.width, c.height).data, cw = c.width, r = rng(7), pts = [];
  for (let y = 0; y < c.height; y += 3) for (let X = 0; X < cw; X += 3) {
    if (d[(y * cw + X) * 4 + 3] > 110) pts.push({ tx: X / S + (r() - 0.5) * 0.7, ty: y / S - bh / 2 + CY + (r() - 0.5) * 0.7 });
  }
  for (let i = pts.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); const tmp = pts[i]; pts[i] = pts[j]; pts[j] = tmp; }
  T.pts = pts.slice(0, 3200);
  T.pts.forEach(p => { p.xn = clamp((p.tx - T.x0) / T.w); });
})();
function drawName(ctx, color, alpha) {
  if (alpha <= 0.001) return;
  ctx.save(); ctx.globalAlpha = Math.min(1, alpha); ctx.fillStyle = color; ctx.font = font(40);
  ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(NAME, T.x0, CY); ctx.restore();
}
function drawLetter(ctx, L, color, alpha, scale = 1, px = 40, x = L.cx, y = CY) {
  if (alpha <= 0.001) return;
  ctx.save(); ctx.globalAlpha = Math.min(1, alpha); ctx.fillStyle = color; ctx.translate(x, y); ctx.scale(scale, scale);
  ctx.font = font(px); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(L.ch, 0, 0); ctx.restore();
}
function rrect(ctx, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}
function drawKey(ctx, P, x, y, w, h, o = {}) {
  const press = o.press || 0, alpha = o.alpha == null ? 1 : o.alpha;
  if (alpha <= 0.001) return;
  ctx.save(); ctx.globalAlpha = alpha; ctx.translate(x, y); if (o.rot) ctx.rotate(o.rot); if (o.scale) ctx.scale(o.scale, o.scale);
  const r = Math.min(w, h) * 0.2, sk = h * 0.085 * (1 - press * 0.6), dy = press * h * 0.05;
  const sh = o.shadow == null ? 1 : o.shadow;
  ctx.shadowColor = P.shadow; ctx.shadowBlur = h * 0.32 * (1 - press * 0.5) * sh; ctx.shadowOffsetY = h * 0.11 * (1 - press * 0.5) * sh;
  ctx.fillStyle = P.skirt; rrect(ctx, -w / 2, -h / 2 + dy, w, h, r); ctx.fill();
  ctx.shadowColor = 'transparent';
  const g = ctx.createLinearGradient(0, -h / 2 + dy, 0, h / 2 - sk + dy);
  g.addColorStop(0, P.face); g.addColorStop(1, P.face2);
  ctx.fillStyle = g; rrect(ctx, -w / 2, -h / 2 + dy, w, h - sk, r); ctx.fill();
  if (o.label) {
    ctx.fillStyle = o.labelColor || P.ink; ctx.globalAlpha = alpha * (o.labelAlpha == null ? 1 : o.labelAlpha);
    ctx.font = font(o.labelPx || 18, o.labelWeight || 600); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(o.label, 0, -sk / 2 + dy + (o.labelDy || 0));
  }
  ctx.restore();
}
const INTROS = [];
INTROS.push({
  id: 'poussiere', name: "Poussière d'encre", fine: true, dur: 1.95,
  desc: "Une poussière d'encre flotte sur l'écran, puis se rassemble lettre par lettre pour écrire le nom, et passe au vert en se posant.",
  init() {
    const r = rng(11);
    this.p = T.pts.map(p => {
      const sx = r() * W, sy = r() * H, dx = p.tx - sx, dy = p.ty - sy, L = Math.hypot(dx, dy) || 1;
      return { tx: p.tx, ty: p.ty, sx, sy, nx: dx / L, ny: dy / L, ph: r() * TAU, curl: (r() - 0.5) * 120,
               dl: 0.08 + p.xn * 0.42 + r() * 0.16, a0: 0.14 + r() * 0.42, s: 0.85 + r() * 0.55 };
    });
    const n = this.p.length; this.X = new Float32Array(n); this.Y = new Float32Array(n); this.A = new Float32Array(n); this.G = new Float32Array(n);
  },
  draw(ctx, t, P) {
    const fin = ss(1.6, 1.9, t), appear = ss(0, 0.2, t), p = this.p;
    for (let i = 0; i < p.length; i++) {
      const q = p[i], k = eio(clamp((t - q.dl) / 0.95)), free = 1 - k;
      const dx = Math.sin(t * 0.9 + q.ph) * 10 * free, dy = Math.cos(t * 0.7 + q.ph) * 8 * free;
      const s = Math.sin(k * Math.PI) * q.curl;
      this.X[i] = lerp(q.sx + dx, q.tx, k) - q.ny * s;
      this.Y[i] = lerp(q.sy + dy, q.ty, k) + q.nx * s;
      this.A[i] = lerp(q.a0 * (0.7 + 0.3 * Math.sin(t * 5 + q.ph)), 1, k) * appear * (1 - fin);
      this.G[i] = ss(0.72, 1, k);
    }
    for (let pass = 0; pass < 2; pass++) {
      ctx.fillStyle = pass ? P.green : P.ink;
      for (let i = 0; i < p.length; i++) {
        const a = this.A[i] * (pass ? this.G[i] : 1 - this.G[i]);
        if (a < 0.01) continue;
        const s = p[i].s; ctx.globalAlpha = a; ctx.fillRect(this.X[i] - s / 2, this.Y[i] - s / 2, s, s);
      }
    }
    ctx.globalAlpha = 1;
    drawName(ctx, P.green, fin);
  }
});
const KB = (function () {
  const rows = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'], kw = 31, kh = 42, gap = 6, rg = 11;
  const top = CY + 26 - (3 * kh + 2 * rg) / 2, keys = [];
  rows.forEach((row, ri) => {
    const rw = row.length * kw + (row.length - 1) * gap, x0 = CX - rw / 2;
    for (let c = 0; c < row.length; c++) keys.push({ x: x0 + c * (kw + gap) + kw / 2, y: top + ri * (kh + rg) + kh / 2, ch: row[c] });
  });
  return { keys, kw, kh };
})();
INTROS.push({
  id: 'sable', name: 'Le clavier en sable', fine: true, dur: 2.25,
  desc: "Un clavier apparaît, puis s'efface en sable fin de gauche à droite. Le sable s'envole en rafale et retombe en « Un bon clavier ».",
  slope: 0.35,
  sweep(t) { return lerp(-30, 410, eio(clamp((t - 0.42) / 0.55))); },
  init() {
    const r = rng(23);
    this.p = T.pts.map(p => {
      const k = KB.keys[Math.floor(r() * KB.keys.length)];
      const sx = k.x + (r() - 0.5) * KB.kw * 0.96, sy = k.y + (r() - 0.5) * KB.kh * 0.9;
      const v = sx - (sy - CY) * this.slope, rel = 0.42 + invEio(clamp((v + 30) / 440)) * 0.55;
      return { tx: p.tx, ty: p.ty, sx, sy, rel, d: 0.95 + r() * 0.2, cx: sx + 50 + r() * 110, cy: sy - 110 - r() * 170, ph: r() * TAU, s: 0.8 + r() * 0.5 };
    });
  },
  draw(ctx, t, P) {
    const rise = eo(clamp(t / 0.35)), kbA = ss(0, 0.22, t), sw = this.sweep(t);
    if (t < 1.0) {
      ctx.save(); ctx.beginPath();
      ctx.moveTo(sw + (0 - CY) * this.slope, 0); ctx.lineTo(W + 200, 0); ctx.lineTo(W + 200, H); ctx.lineTo(sw + (H - CY) * this.slope, H); ctx.closePath(); ctx.clip();
      const off = (1 - rise) * 34;
      for (const k of KB.keys) drawKey(ctx, P, k.x, k.y + off, KB.kw, KB.kh, { alpha: kbA, label: k.ch, labelPx: 17, labelWeight: 500, labelDy: 1 });
      ctx.restore();
    }
    const fin = ss(1.95, 2.2, t), p = this.p;
    for (let pass = 0; pass < 2; pass++) {
      ctx.fillStyle = pass ? P.green : P.soft;
      for (let i = 0; i < p.length; i++) {
        const q = p[i]; if (t < q.rel) continue;
        const k = eio(clamp((t - q.rel) / q.d)), g = ss(0.7, 1, k), a = (1 - fin) * (pass ? g : 1 - g);
        if (a < 0.01) continue;
        const m = 1 - k, turb = Math.sin(k * Math.PI) * Math.sin(k * 12 + q.ph) * 5;
        const x = m * m * q.sx + 2 * m * k * q.cx + k * k * q.tx + turb;
        const y = m * m * q.sy + 2 * m * k * q.cy + k * k * q.ty + turb * 0.6;
        ctx.globalAlpha = a; ctx.fillRect(x - q.s / 2, y - q.s / 2, q.s, q.s);
      }
    }
    ctx.globalAlpha = 1;
    drawName(ctx, P.green, fin);
  }
});
INTROS.push({
  id: 'etincelles', name: 'Étincelles de frappe', fine: true, dur: 2.0,
  desc: "Le nom se tape tout seul. Chaque lettre jaillit avec une gerbe d'étincelles, puis le mot s'allume en vert sous un scintillement.",
  start: 0.2, step: 0.085,
  init() {
    const r = rng(37);
    this.sparks = [];
    for (const L of T.letters) {
      L.appear = this.start + L.i * this.step;
      for (let j = 0; j < 34; j++) {
        const ang = -Math.PI / 2 + (r() - 0.5) * Math.PI * 1.5, sp = 90 + r() * 230;
        this.sparks.push({ x: L.cx + (r() - 0.5) * L.w * 0.6, y: CY + (r() - 0.5) * 22, a0: L.appear + r() * 0.04,
                           vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp, life: 0.4 + r() * 0.5, w: 0.6 + r() * 0.7, alt: r() < 0.4 });
      }
    }
    this.twinkles = [];
    for (let j = 0; j < 90; j++) {
      const p = T.pts[Math.floor(r() * T.pts.length)];
      this.twinkles.push({ x: p.tx, y: p.ty, t0: 1.42 + p.xn * 0.3 + r() * 0.18, life: 0.45 + r() * 0.3, len: 2 + r() * 3, alt: r() < 0.5 });
    }
  },
  draw(ctx, t, P) {
    const fin = ss(1.85, 1.98, t);
    for (const L of T.letters) {
      if (t < L.appear) continue;
      const k = clamp((t - L.appear) / 0.22), sc = lerp(0.45, 1, eback(k)), a = clamp(k * 3) * (1 - fin);
      const g = ss(1.42 + L.xn * 0.28, 1.56 + L.xn * 0.28, t);
      drawLetter(ctx, L, P.ink, a * (1 - g), sc);
      drawLetter(ctx, L, P.green, a * g, sc);
    }
    drawName(ctx, P.green, fin);
    const f = clamp((t - this.start) / this.step + 1, 0, NAME.length), j = Math.floor(f), fr = f - j;
    const cxp = j >= NAME.length ? T.bounds[NAME.length] : lerp(T.bounds[j], T.bounds[j + 1], eo(fr));
    const blink = t < this.start ? (Math.sin(t * 28) > -0.2 ? 1 : 0.25) : 1;
    const ca = blink * ss(0, 0.06, t) * (1 - ss(1.4, 1.62, t));
    if (ca > 0.01) { ctx.globalAlpha = ca; ctx.fillStyle = P.green; ctx.fillRect(cxp + 2, CY - 19, 2.4, 38); }
    ctx.globalCompositeOperation = P.glow ? 'lighter' : 'source-over';
    ctx.lineCap = 'round';
    for (const s of this.sparks) {
      const u = t - s.a0; if (u < 0 || u > s.life) continue;
      const x = s.x + s.vx * u, y = s.y + s.vy * u + 350 * u * u, vy = s.vy + 700 * u;
      ctx.globalAlpha = Math.pow(1 - u / s.life, 1.3);
      ctx.strokeStyle = s.alt ? P.spark2 : P.green; ctx.lineWidth = s.w * (1 - 0.5 * u / s.life);
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - s.vx * 0.022, y - vy * 0.022); ctx.stroke();
    }
    for (const s of this.twinkles) {
      const u = (t - s.t0) / s.life; if (u < 0 || u > 1) continue;
      const a = Math.sin(u * Math.PI), y = s.y - u * 6, l = s.len * a;
      ctx.globalAlpha = a; ctx.strokeStyle = s.alt ? P.hot : P.spark2; ctx.lineWidth = 0.7;
      ctx.beginPath(); ctx.moveTo(s.x - l, y); ctx.lineTo(s.x + l, y); ctx.moveTo(s.x, y - l); ctx.lineTo(s.x, y + l); ctx.stroke();
    }
    ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
  }
});
INTROS.push({
  id: 'trait', name: 'Le trait de lumière', fine: true, dur: 2.15,
  desc: "Un trait de lumière grave le nom de gauche à droite, comme au laser, et laisse derrière lui des braises qui s'envolent.",
  a: T.x0 - 16, b: T.x1 + 16,
  lineX(t) { return lerp(this.a, this.b, eio(clamp((t - 0.2) / 1.0))); },
  init() {
    const r = rng(41);
    this.embers = [];
    for (let i = 0; i < T.pts.length; i += 2) {
      const p = T.pts[i];
      const b = 0.2 + invEio(clamp((p.tx - this.a) / (this.b - this.a))) * 1.0;
      this.embers.push({ x: p.tx, y: p.ty, b, life: 0.45 + r() * 0.55, vx: -(8 + r() * 46), vy: -(18 + r() * 72), ph: r() * TAU, s: 0.6 + r() * 0.85, alt: r() < 0.4 });
    }
  },
  draw(ctx, t, P) {
    const lx = this.lineX(t), beam = ss(0.04, 0.2, t) * (1 - ss(1.18, 1.38, t));
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, lx, H); ctx.clip(); drawName(ctx, P.green, 1); ctx.restore();
    if (beam > 0.01) {
      ctx.save(); ctx.beginPath(); ctx.rect(lx - 16, 0, 16, H); ctx.clip(); drawName(ctx, P.hot, 0.9 * beam); ctx.restore();
    }
    ctx.globalCompositeOperation = P.glow ? 'lighter' : 'source-over';
    for (const e of this.embers) {
      const u = t - e.b; if (u < 0 || u > e.life) continue;
      const x = e.x + e.vx * u + Math.sin(u * 9 + e.ph) * 2.5, y = e.y + e.vy * u - 20 * u * u;
      const a = Math.pow(1 - u / e.life, 1.5) * (0.55 + 0.45 * Math.sin(u * 30 + e.ph));
      ctx.globalAlpha = a; ctx.fillStyle = u < 0.08 ? P.hot : (e.alt ? P.spark2 : P.green);
      ctx.fillRect(x - e.s / 2, y - e.s / 2, e.s, e.s);
    }
    if (beam > 0.01) {
      const g = ctx.createLinearGradient(0, CY - 80, 0, CY + 80);
      g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(0.5, P.green); g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.globalAlpha = beam; ctx.shadowColor = P.green; ctx.shadowBlur = 14; ctx.fillStyle = g; ctx.fillRect(lx - 1.3, CY - 80, 2.6, 160);
      ctx.shadowBlur = 0; const g2 = ctx.createLinearGradient(0, CY - 40, 0, CY + 40);
      g2.addColorStop(0, 'rgba(255,255,255,0)'); g2.addColorStop(0.5, P.hot); g2.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = g2; ctx.fillRect(lx - 0.5, CY - 40, 1, 80);
    }
    ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1; ctx.shadowColor = 'transparent';
  }
});
INTROS.push({
  id: 'galaxie', name: 'Galaxie', fine: true, dur: 2.3,
  desc: "Un point s'allume au centre et s'ouvre en galaxie qui tourne. Puis toute la poussière d'étoiles s'effondre dans le nom.",
  init() {
    const r = rng(53);
    this.p = T.pts.map((p, i) => {
      const r0 = 6 + Math.pow(r(), 1.6) * 178, arm = (i % 3) * TAU / 3;
      return { tx: p.tx, ty: p.ty, xn: p.xn, r0, th: arm + r0 * 0.034 + (r() - 0.5) * (0.35 + r0 * 0.004), w: 1.9 * (70 / (r0 + 50)),
               rd: r(), cls: r0 < 34 ? 2 : (r() < 0.35 ? 1 : 0), s: r0 < 34 ? 1.2 + r() * 0.5 : 0.75 + r() * 0.6, ph: r() * TAU };
    });
  },
  draw(ctx, t, P) {
    const flash = ss(0, 0.1, t) * (1 - ss(0.12, 0.55, t));
    if (flash > 0.01) {
      const g = ctx.createRadialGradient(CX, CY, 0, CX, CY, 46);
      g.addColorStop(0, P.hot); g.addColorStop(0.25, P.green); g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.globalAlpha = flash; ctx.fillStyle = g; ctx.fillRect(CX - 50, CY - 50, 100, 100);
    }
    ctx.globalCompositeOperation = P.glow ? 'lighter' : 'source-over';
    const e = eo(clamp((t - 0.1) / 0.65)), fin = ss(1.95, 2.25, t), appear = ss(0.06, 0.25, t), cols = [P.green, P.spark2, P.hot];
    for (let pass = 0; pass < 4; pass++) {
      ctx.fillStyle = pass === 3 ? P.green : cols[pass];
      for (const q of this.p) {
        if (pass < 3 && q.cls !== pass) continue;
        const c = eio(clamp((t - 0.82 - q.xn * 0.22 - q.rd * 0.12) / 0.82));
        const a = appear * (1 - fin) * (pass === 3 ? c : 1 - c) * (0.75 + 0.25 * Math.sin(t * 7 + q.ph));
        if (a < 0.01) continue;
        const rr = q.r0 * e, th = q.th + q.w * t + (1 - e) * 1.6;
        const gx = CX + Math.cos(th) * rr, gy = CY + Math.sin(th) * rr * 0.42;
        const x = lerp(gx, q.tx, c), y = lerp(gy, q.ty, c);
        ctx.globalAlpha = a; ctx.fillRect(x - q.s / 2, y - q.s / 2, q.s, q.s);
      }
    }
    ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
    drawName(ctx, P.green, fin);
  }
});
INTROS.push({
  id: 'onde', name: "L'onde de la touche", fine: true, dur: 1.85,
  desc: "Une touche tombe et s'enfonce. L'onde de l'appui traverse l'écran en anneau de poussière et allume chaque lettre sur son passage.",
  tR: 0.6, Rmax: 270, dR: 1.0,
  init() {
    const r = rng(67);
    this.ring = [];
    for (let i = 0; i < 1100; i++) this.ring.push({ a: r() * TAU, j: (r() - 0.5) * 2, al: 0.35 + r() * 0.65, s: 0.6 + r() * 0.7, late: r() < 0.3 ? 0.07 : 0 });
    this.burst = [];
    for (const L of T.letters) {
      L.rv = this.tR + invEo(Math.abs(L.cx - CX) / this.Rmax) * this.dR;
      for (let j = 0; j < 20; j++) {
        const ang = (L.cx >= CX ? 0 : Math.PI) + (r() - 0.5) * 2.4, sp = 40 + r() * 140;
        this.burst.push({ x: L.cx, y: CY + (r() - 0.5) * 20, t0: L.rv, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp, life: 0.35 + r() * 0.45, s: 0.6 + r() * 0.6, alt: r() < 0.5 });
      }
    }
  },
  draw(ctx, t, P) {
    const fin = ss(1.55, 1.78, t);
    for (const L of T.letters) {
      const k = clamp((t - L.rv) / 0.28); if (k <= 0) continue;
      const sc = 1 + 0.38 * (1 - eo(k)), a = clamp(k * 2.5) * (1 - fin);
      drawLetter(ctx, L, P.green, a, sc);
      drawLetter(ctx, L, P.hot, a * (1 - eo(k)) * 0.85, sc);
    }
    drawName(ctx, P.green, fin);
    const drop = eback(clamp(t / 0.42)), press = ss(0.47, 0.55, t) * (1 - ss(0.6, 0.7, t));
    const gone = eio(clamp((t - 0.62) / 0.26));
    if (gone < 1) drawKey(ctx, P, CX, CY - 220 * (1 - drop), 64, 78, { press, alpha: ss(0, 0.08, t) * (1 - gone), scale: 1 - gone * 0.7, label: 'U', labelPx: 34, labelWeight: 700, labelColor: P.green });
    ctx.globalCompositeOperation = P.glow ? 'lighter' : 'source-over';
    ctx.fillStyle = P.green;
    for (const q of this.ring) {
      const u = clamp((t - this.tR - q.late) / this.dR); if (u <= 0 || u >= 1) continue;
      const R = eo(u) * this.Rmax, rr = R + q.j * (3 + R * 0.035);
      const a = q.al * (1 - ss(0.2, 1, u)) * (q.late ? 0.5 : 1);
      ctx.globalAlpha = a; ctx.fillRect(CX + Math.cos(q.a) * rr - q.s / 2, CY + Math.sin(q.a) * rr - q.s / 2, q.s, q.s);
    }
    for (const s of this.burst) {
      const u = t - s.t0; if (u < 0 || u > s.life) continue;
      const d = (1 - Math.exp(-4 * u)) / 4;
      ctx.globalAlpha = Math.pow(1 - u / s.life, 1.4); ctx.fillStyle = s.alt ? P.spark2 : P.green;
      ctx.fillRect(s.x + s.vx * d - s.s / 2, s.y + s.vy * d - s.s / 2, s.s, s.s);
    }
    ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
  }
});
INTROS.push({
  id: 'eventail', name: "L'éventail", fine: false, dur: 1.9,
  desc: "Une seule touche s'ouvre en éventail : une touche par lettre. Elles s'enfoncent en vague, puis fondent dans le nom, comme aujourd'hui.",
  kw: 23, kh: 30,
  init() {
    const byDist = T.letters.slice().sort((a, b) => Math.abs(a.cx - CX) - Math.abs(b.cx - CX));
    byDist.forEach((L, rank) => { L.fanDelay = 0.3 + rank * 0.026; });
    T.letters.forEach(L => { L.kx = CX + (L.cx - CX) * 1.3; });
    this.order = byDist.slice().reverse();
  },
  draw(ctx, t, P) {
    const pop = eback(clamp(t / 0.3)), fin = ss(1.72, 1.86, t);
    for (const L of this.order) {
      const k = clamp((t - L.fanDelay) / 0.45), kb = eback(k);
      const m = eio(clamp((t - 1.2 - L.xn * 0.06) / 0.45));
      const press = ss(0, 1, (t - (1.0 + L.xn * 0.12)) / 0.05) * (1 - ss(0, 1, (t - (1.06 + L.xn * 0.12)) / 0.07));
      const kx = lerp(CX, L.kx, kb), x = lerp(kx, L.cx, m);
      const y = CY - Math.sin(clamp(k) * Math.PI) * 18;
      const rot = (1 - eo(k)) * (L.kx - CX) * 0.006;
      const w = lerp(this.kw, L.w, m), h = lerp(this.kh, 26, m);
      const keyA = ss(0, 0.12, t) * (1 - ss(0.15, 0.85, m)) * (1 - fin);
      drawKey(ctx, P, x, y, w, h, { press, alpha: keyA, rot, scale: lerp(0.4, 1, pop), shadow: 1 - ss(0, 0.5, m) });
      const px = lerp(19, 40, m), g = ss(0.3, 0.85, m), la = ss(0, 0.12, t) * (1 - fin);
      const ly = y - (1 - m) * (h * 0.04) + press * 1.5 * (1 - m);
      ctx.save(); ctx.translate(x, ly); ctx.rotate(rot * (1 - m)); ctx.scale(lerp(0.4, 1, pop), lerp(0.4, 1, pop)); ctx.translate(-x, -ly);
      drawLetter(ctx, L, P.ink, la * (1 - g), 1, px, x, ly);
      drawLetter(ctx, L, P.green, la * g, 1, px, x, ly);
      ctx.restore();
    }
    drawName(ctx, P.green, fin);
  }
});
(function () {
  const x = document.createElement('canvas').getContext('2d');
  x.font = font(40); x.textBaseline = 'middle';
  T.base = CY + x.measureText('n').actualBoundingBoxDescent;
})();
const DOT = { s: 7, gap: 2 };
DOT.x0 = T.x1 + DOT.gap; DOT.cx = DOT.x0 + DOT.s / 2; DOT.cy = T.base - DOT.s / 2;
const SHIFT = (DOT.gap + DOT.s) / 2;
const CUR = { w: 2.4, h: 38 };
const curX = j => T.bounds[j] + 3.2;
T.pts.forEach(p => { let li = 0; T.letters.forEach((L, k) => { if (p.tx >= T.bounds[L.i] - 1) li = k; }); p.li = li; });
let DOT_INK = true;
const dotColor = P => DOT_INK ? P.ink : P.green;
const COUPS = [[0, 1.9], [0.05, 1.35], [0.10, 1]];
function coup(t, t0) { if (t < t0) return 0; let e = 1; for (const [d, s] of COUPS) if (t >= t0 + d) e = s; return e; }
const bump = (t, t0, d) => { const u = (t - t0) / d; return u > 0 && u < 1 ? Math.sin(u * Math.PI) : 0; };
function sq(ctx, color, cx, cy, w, h, a) {
  if (a <= 0.001 || w <= 0 || h <= 0) return;
  ctx.globalAlpha = Math.min(1, a); ctx.fillStyle = color; ctx.fillRect(cx - w / 2, cy - h / 2, w, h); ctx.globalAlpha = 1;
}
function onde(L, t, t0, amp) {
  const u = (t - t0 - Math.abs(DOT.cx - L.cx) / 650) / 0.2;
  return u > 0 && u < 1 ? -amp * Math.sin(u * Math.PI) : 0;
}
function parts(r, n, x, y, t0, o) {
  const a = [];
  for (let i = 0; i < n; i++) {
    const ang = lerp(o.a0, o.a1, r()), sp = lerp(o.v0, o.v1, r());
    a.push({ x: x + (r() - 0.5) * (o.jx || 0), y: y + (r() - 0.5) * (o.jy || 0), vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp,
             t0: t0 + r() * (o.spread || 0), life: lerp(o.l0, o.l1, r()), s: lerp(o.s0 || 0.7, o.s1 || 1.3, r()), c: r() });
  }
  return a;
}
function drawParts(ctx, P, a, t, o = {}) {
  const drag = o.drag || 0, g = o.grav || 0;
  ctx.globalCompositeOperation = P.glow ? 'lighter' : 'source-over'; ctx.lineCap = 'round';
  for (const q of a) {
    const u = t - q.t0; if (u < 0 || u > q.life) continue;
    const f = drag ? (1 - Math.exp(-drag * u)) / drag : u, k = u / q.life;
    const x = q.x + q.vx * f + (o.wob ? Math.sin(u * 9 + q.c * 40) * o.wob : 0), y = q.y + q.vy * f + 0.5 * g * u * u;
    ctx.globalAlpha = Math.pow(1 - k, 1.2) * (o.twinkle ? 0.5 + 0.5 * Math.sin(u * o.twinkle + q.c * 60) : 1);
    const col = q.c < 0.45 ? P.green : q.c < 0.85 || !P.glow ? P.spark2 : P.hot;
    if (o.streak) {
      const e = drag ? Math.exp(-drag * u) : 1, vx = q.vx * e, vy = q.vy * e + g * u;
      ctx.strokeStyle = col; ctx.lineWidth = q.s * (1 - 0.5 * k);
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - vx * o.streak, y - vy * o.streak); ctx.stroke();
    } else { const s = q.s * (1 - 0.4 * k); ctx.fillStyle = col; ctx.fillRect(x - s / 2, y - s / 2, s, s); }
  }
  ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
}
const INTROS2 = [];
INTROS2.push({
  id: 'curseur-point', name: 'Le curseur devient le point', dur: 2.1, shift: SHIFT,
  desc: "Le curseur clignote, puis tape le nom : chaque lettre naît d'une poussière qui sort du curseur. Au bout, le curseur s'étire, s'écrase en point carré qui claque, et le nom en tressaille.",
  S: 0.3, step: 0.07, TC: 1.4, TP: 1.55,
  init() {
    const r = rng(101), S = this.S, st = this.step;
    this.p = T.pts.map(p => {
      const L = T.letters[p.li], a = S + L.i * st;
      const sx = T.bounds[L.i + 1] + 3 + (r() - 0.5) * 3, sy = CY + (r() - 0.5) * 34;
      return { tx: p.tx, ty: p.ty, sx, sy, cx: lerp(sx, p.tx, 0.5) + (r() - 0.3) * 26, cy: lerp(sy, p.ty, 0.5) - 8 - r() * 26,
               dl: a + r() * 0.05, d: 0.2 + r() * 0.14, s: 0.8 + r() * 0.5, li: p.li };
    });
    this.extra = [];
    for (const L of T.letters) this.extra.push(...parts(r, 14, L.cx, CY, S + L.i * st + 0.02,
      { a0: -Math.PI * 0.95, a1: -Math.PI * 0.05, v0: 40, v1: 130, l0: 0.3, l1: 0.6, jx: L.w * 0.6, jy: 20, spread: 0.08, s0: 0.6, s1: 1.1 }));
    this.ring = parts(r, 70, DOT.cx, DOT.cy, this.TP, { a0: 0, a1: TAU, v0: 60, v1: 190, l0: 0.32, l1: 0.52 });
  },
  draw(ctx, t, P) {
    const S = this.S, st = this.step, end = S + NAME.length * st;
    const G = T.letters.map(L => ss(1.22 + L.xn * 0.25, 1.36 + L.xn * 0.25, t));
    const C = T.letters.map(L => ss(S + L.i * st + 0.2, S + L.i * st + 0.36, t));
    for (let pass = 0; pass < 2; pass++) {
      ctx.fillStyle = pass ? P.green : P.ink;
      for (const q of this.p) {
        if (t < q.dl) continue;
        const k = eio(clamp((t - q.dl) / q.d)), m = 1 - k, g = G[q.li];
        const a = (1 - C[q.li]) * (0.35 + 0.65 * k) * (pass ? g : 1 - g);
        if (a < 0.01) continue;
        ctx.globalAlpha = a;
        ctx.fillRect(m * m * q.sx + 2 * m * k * q.cx + k * k * q.tx - q.s / 2, m * m * q.sy + 2 * m * k * q.cy + k * k * q.ty - q.s / 2, q.s, q.s);
      }
    }
    ctx.globalAlpha = 1;
    T.letters.forEach((L, k) => {
      const y = CY + onde(L, t, this.TP, 1.8);
      drawLetter(ctx, L, P.ink, C[k] * (1 - G[k]), 1, 40, L.cx, y);
      drawLetter(ctx, L, P.green, C[k] * G[k], 1, 40, L.cx, y);
    });
    drawParts(ctx, P, this.extra, t);
    if (t < this.TP) {
      let cx, cy = CY, w = CUR.w, h = CUR.h + 6 * ss(end, this.TC, t), a = ss(0, 0.05, t), k = 0;
      if (t < S) { cx = curX(0); a *= Math.sin(t * 22) > -0.3 ? 1 : 0.15; }
      else if (t < this.TC) { const f = clamp((t - S) / st, 0, NAME.length), j = Math.floor(f); cx = j >= NAME.length ? curX(NAME.length) : lerp(curX(j), curX(j + 1), eo(f - j)); }
      else { k = eio(clamp((t - this.TC) / (this.TP - this.TC))); cx = lerp(curX(NAME.length), DOT.cx, k); cy = lerp(CY, DOT.cy, k); w = lerp(CUR.w, DOT.s, k); h = lerp(CUR.h + 6, DOT.s, k); }
      sq(ctx, P.green, cx, cy, w, h, a * (1 - k));
      sq(ctx, dotColor(P), cx, cy, w, h, a * k);
    } else { const e = coup(t, this.TP); sq(ctx, dotColor(P), DOT.cx, DOT.cy, DOT.s * e, DOT.s * e, 1); }
    drawParts(ctx, P, this.ring, t, { drag: 5 });
  }
});
INTROS2.push({
  id: 'point-ecrit', name: 'Le point qui écrit', dur: 2.35, shift: SHIFT,
  desc: "Le point carré claque au milieu de l'écran et bat deux fois dans un petit nuage. Il s'étire en curseur, file vers la droite en semant les lettres, puis redevient le point au bout du nom.",
  T0: 0.06, M0: 0.56, M1: 0.74, E: 1.5, P1: 1.68,
  sweep(t) { return lerp(curX(0) - 4, curX(NAME.length), eio(clamp((t - this.M1) / (this.E - this.M1)))); },
  init() {
    const r = rng(202), span = this.E - this.M1, x0 = curX(0) - 4, x1 = curX(NAME.length);
    this.home = { x: CX + SHIFT, y: DOT.cy };
    this.p = T.pts.map(p => ({ tx: p.tx, ty: p.ty, sx: p.tx - 3, sy: CY + (r() - 0.5) * 32, cx: p.tx + 6 + r() * 26, cy: p.ty - 18 - r() * 38,
      rel: this.M1 + invEio(clamp((p.tx - x0) / (x1 - x0))) * span, d: 0.3 + r() * 0.14, s: 0.8 + r() * 0.5 }));
    this.orb = [];
    for (let i = 0; i < 90; i++) this.orb.push({ R: 12 + r() * 26, th: r() * TAU, w: (2.5 + r() * 3.5) * (r() < 0.5 ? -1 : 1), s: 0.7 + r() * 0.8, c: r() });
    this.spray = [];
    for (let i = 0; i < 420; i++) {
      const t0 = this.M1 + 0.02 + r() * (span - 0.02), ang = -Math.PI * (0.15 + r() * 0.7), sp = 60 + r() * 150;
      this.spray.push({ x: this.sweep(t0), y: CY + (r() - 0.5) * 38, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp, t0, life: 0.3 + r() * 0.25, s: 0.6 + r() * 0.6, c: r() });
    }
    this.ring = parts(r, 70, DOT.cx, DOT.cy, this.P1, { a0: 0, a1: TAU, v0: 60, v1: 190, l0: 0.35, l1: 0.64 });
  },
  draw(ctx, t, P) {
    const fin = ss(1.62, 2.0, t);
    for (let pass = 0; pass < 2; pass++) {
      ctx.fillStyle = pass ? P.green : P.spark2;
      for (const q of this.p) {
        if (t < q.rel) continue;
        const k = eo(clamp((t - q.rel) / q.d)), m = 1 - k, land = ss(0.6, 1, k), a = (1 - fin) * (pass ? land : 1 - land);
        if (a < 0.01) continue;
        ctx.globalAlpha = a;
        ctx.fillRect(m * m * q.sx + 2 * m * k * q.cx + k * k * q.tx - q.s / 2, m * m * q.sy + 2 * m * k * q.cy + k * k * q.ty - q.s / 2, q.s, q.s);
      }
    }
    ctx.globalAlpha = 1;
    drawName(ctx, P.green, fin);
    drawParts(ctx, P, this.spray, t, { grav: 500, streak: 0.02 });
    let cx, cy, w, h, k = 0, a = 1;
    if (t < this.M0) {
      const e = coup(t, this.T0) * (1 + 0.24 * bump(t, 0.24, 0.13) + 0.16 * bump(t, 0.40, 0.13));
      cx = this.home.x; cy = this.home.y; w = h = DOT.s * e; k = 1;
    } else if (t < this.M1) {
      const u = eio((t - this.M0) / (this.M1 - this.M0));
      cx = lerp(this.home.x, curX(0) - 4, u); cy = lerp(this.home.y, CY, u); w = lerp(DOT.s, CUR.w, u); h = lerp(DOT.s, CUR.h, u); k = 1 - u;
    } else if (t < this.E) { cx = this.sweep(t); cy = CY; w = CUR.w; h = CUR.h; }
    else if (t < this.P1) {
      k = eio((t - this.E) / (this.P1 - this.E));
      cx = lerp(curX(NAME.length), DOT.cx, k); cy = lerp(CY, DOT.cy, k); w = lerp(CUR.w, DOT.s, k); h = lerp(CUR.h, DOT.s, k);
    } else { const e = coup(t, this.P1); cx = DOT.cx; cy = DOT.cy; w = h = DOT.s * e; k = 1; }
    const oa = ss(0.08, 0.3, t) * (1 - ss(this.M0, this.M1, t));
    if (oa > 0.01) {
      ctx.globalCompositeOperation = P.glow ? 'lighter' : 'source-over';
      const shrink = 1 - 0.8 * ss(this.M0, this.M1, t), grow = eo(clamp((t - 0.06) / 0.3));
      for (const o of this.orb) {
        const th = o.th + o.w * t, R = o.R * grow * shrink;
        ctx.globalAlpha = oa * (0.5 + 0.5 * Math.sin(t * 9 + o.th)); ctx.fillStyle = o.c < 0.5 ? P.green : P.spark2;
        ctx.fillRect(cx + Math.cos(th) * R - o.s / 2, cy + Math.sin(th) * R * 0.8 - o.s / 2, o.s, o.s);
      }
      ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
    }
    sq(ctx, P.green, cx, cy, w, h, a * (1 - k));
    sq(ctx, dotColor(P), cx, cy, w, h, a * k);
    drawParts(ctx, P, this.ring, t, { drag: 5 });
  }
});
INTROS2.push({
  id: 'aimant', name: 'La poussière aimantée', dur: 2.3, shift: SHIFT,
  desc: "Une poussière flotte sur tout l'écran. Le curseur passe et l'aimante en lettres sur son passage. Le reste tourbillonne au bout du nom et se serre en point carré, qui claque dans un éclair.",
  A: 0.3, B: 1.25, SNAP: 1.8,
  sweep(t) { return lerp(curX(0), curX(NAME.length), eio(clamp((t - this.A) / (this.B - this.A)))); },
  init() {
    const r = rng(303), x0 = curX(0), x1 = curX(NAME.length);
    this.p = T.pts.map(p => {
      const sx = r() * W, sy = r() * H, dx = p.tx - sx, dy = p.ty - sy, L = Math.hypot(dx, dy) || 1;
      return { tx: p.tx, ty: p.ty, sx, sy, nx: dx / L, ny: dy / L, ph: r() * TAU, curl: (r() - 0.5) * 110,
               rel: this.A + invEio(clamp((p.tx - 55 - x0) / (x1 - x0))) * (this.B - this.A) - 0.12 + r() * 0.08,
               d: 0.4 + r() * 0.14, a0: 0.14 + r() * 0.4, s: 0.85 + r() * 0.55 };
    });
    this.v = [];
    for (let i = 0; i < 650; i++) {
      const sx = r() * W, sy = r() * H, dx = sx - DOT.cx, dy = sy - DOT.cy;
      this.v.push({ sx, sy, R0: Math.hypot(dx, dy), th0: Math.atan2(dy, dx), rel: 0.95 + r() * 0.4, d: 0.32 + r() * 0.12, ph: r() * TAU, a0: 0.14 + r() * 0.4, s: 0.8 + r() * 0.5 });
    }
    this.ring = parts(r, 60, DOT.cx, DOT.cy, this.SNAP, { a0: 0, a1: TAU, v0: 50, v1: 170, l0: 0.3, l1: 0.48 });
    const n = this.p.length; this.X = new Float32Array(n); this.Y = new Float32Array(n); this.Al = new Float32Array(n); this.G = new Float32Array(n);
  },
  draw(ctx, t, P) {
    const appear = ss(0, 0.2, t), fin = ss(1.75, 2.1, t), p = this.p;
    for (let i = 0; i < p.length; i++) {
      const q = p[i], k = eio(clamp((t - q.rel) / q.d)), free = 1 - k, s = Math.sin(k * Math.PI) * q.curl;
      this.X[i] = lerp(q.sx + Math.sin(t * 0.9 + q.ph) * 10 * free, q.tx, k) - q.ny * s;
      this.Y[i] = lerp(q.sy + Math.cos(t * 0.7 + q.ph) * 8 * free, q.ty, k) + q.nx * s;
      this.Al[i] = lerp(q.a0 * (0.7 + 0.3 * Math.sin(t * 5 + q.ph)), 1, k) * appear * (1 - fin);
      this.G[i] = ss(0.72, 1, k);
    }
    for (let pass = 0; pass < 2; pass++) {
      ctx.fillStyle = pass ? P.green : P.ink;
      for (let i = 0; i < p.length; i++) {
        const a = this.Al[i] * (pass ? this.G[i] : 1 - this.G[i]); if (a < 0.01) continue;
        const s = p[i].s; ctx.globalAlpha = a; ctx.fillRect(this.X[i] - s / 2, this.Y[i] - s / 2, s, s);
      }
    }
    let arrived = 0;
    for (let pass = 0; pass < 2; pass++) {
      ctx.fillStyle = pass ? P.green : P.ink;
      for (const q of this.v) {
        const k = clamp((t - q.rel) / q.d);
        if (k >= 1) { if (!pass) arrived++; continue; }
        const e = eio(k), g = ss(0.4, 0.8, k), a = lerp(q.a0 * (0.7 + 0.3 * Math.sin(t * 5 + q.ph)), 1, e) * appear * (pass ? g : 1 - g);
        if (a < 0.01) continue;
        let x, y;
        if (k <= 0) { x = q.sx + Math.sin(t * 0.9 + q.ph) * 10; y = q.sy + Math.cos(t * 0.7 + q.ph) * 8; }
        else { const R = q.R0 * (1 - e), th = q.th0 + 6 * e; x = DOT.cx + Math.cos(th) * R; y = DOT.cy + Math.sin(th) * R; }
        ctx.globalAlpha = a; ctx.fillRect(x - q.s / 2, y - q.s / 2, q.s, q.s);
      }
    }
    ctx.globalAlpha = 1;
    drawName(ctx, P.green, fin);
    if (t < this.B + 0.16) {
      let cx = curX(0), cy = CY, h = CUR.h, a = ss(0.05, 0.15, t);
      if (t < this.A) a *= Math.sin(t * 22) > -0.3 ? 1 : 0.15;
      else if (t < this.B) cx = this.sweep(t);
      else { const k = eio((t - this.B) / 0.16); cx = lerp(curX(NAME.length), DOT.cx, k); cy = lerp(CY, DOT.cy, k); h = lerp(CUR.h, 0, k); }
      sq(ctx, P.green, cx, cy, CUR.w, h, a);
    }
    if (t < this.SNAP) {
      const f = arrived / this.v.length;
      if (f > 0.002) {
        if (P.glow) glow(ctx, P, DOT.cx, DOT.cy, 18 * Math.sqrt(f), 0.18 * f);
        sq(ctx, P.green, DOT.cx, DOT.cy, DOT.s * Math.sqrt(f), DOT.s * Math.sqrt(f), 0.45 + 0.5 * f);
      }
    } else {
      const e = coup(t, this.SNAP), u = clamp((t - this.SNAP) / 0.32);
      if (u < 1) glow(ctx, P, DOT.cx, DOT.cy, lerp(DOT.s, 34, eo(u)), (P.glow ? 0.55 : 0.44) * (1 - u) * (1 - u), null, P.glow ? P.hot : P.green);
      sq(ctx, dotColor(P), DOT.cx, DOT.cy, DOT.s * e, DOT.s * e, 1);
    }
    drawParts(ctx, P, this.ring, t, { drag: 5 });
  }
});
INTROS2.push({
  id: 'chute', name: 'Le point qui tombe', dur: 2.45, shift: SHIFT,
  desc: "Le nom se tape en gerbes d'étincelles. Le curseur attend au bout, puis le point carré tombe du haut de l'écran, frappe la ligne, claque, et l'impact allume le nom en vert de droite à gauche.",
  start: 0.2, step: 0.07, F0: 1.36, F1: 1.62,
  init() {
    const r = rng(404);
    this.sparks = [];
    for (const L of T.letters) {
      L.app2 = this.start + L.i * this.step;
      this.sparks.push(...parts(r, 26, L.cx, CY, L.app2, { a0: -Math.PI * 1.25, a1: Math.PI * 0.25, v0: 90, v1: 300, l0: 0.4, l1: 0.85, jx: L.w * 0.6, jy: 22, spread: 0.04, s0: 0.6, s1: 1.3 }));
    }
    this.trail = [];
    for (let i = 0; i < 150; i++) {
      const te = lerp(this.F0, this.F1, r()), u = (te - this.F0) / (this.F1 - this.F0);
      this.trail.push({ x: DOT.cx + (r() - 0.5) * 6, y: lerp(-20, DOT.cy, u * u) + (r() - 0.5) * 8, vx: (r() - 0.5) * 50, vy: -10 - r() * 40, t0: te, life: 0.25 + r() * 0.25, s: 0.6 + r() * 0.7, c: r() });
    }
    this.boom = parts(r, 110, DOT.cx, DOT.cy, this.F1, { a0: -Math.PI, a1: 0, v0: 120, v1: 340, l0: 0.4, l1: 0.78, s0: 0.7, s1: 1.4 });
    this.twinkles = [];
    for (let j = 0; j < 90; j++) {
      const p = T.pts[Math.floor(r() * T.pts.length)];
      const t0 = this.F1 + 0.1 + (1 - p.xn) * 0.24 + r() * 0.12;
      this.twinkles.push({ x: p.tx, y: p.ty, t0, life: Math.min(0.3 + r() * 0.3, this.dur - 0.02 - t0), len: 2 + r() * 3, alt: r() < 0.5 });
    }
  },
  draw(ctx, t, P) {
    for (const L of T.letters) {
      if (t < L.app2) continue;
      const k = clamp((t - L.app2) / 0.22), sc = lerp(0.45, 1, eback(k)), a = clamp(k * 3);
      const g = ss(this.F1 + 0.02 + (1 - L.xn) * 0.24, this.F1 + 0.14 + (1 - L.xn) * 0.24, t), y = CY + onde(L, t, this.F1, 3);
      drawLetter(ctx, L, P.ink, a * (1 - g), sc, 40, L.cx, y);
      drawLetter(ctx, L, P.green, a * g, sc, 40, L.cx, y);
    }
    if (t < this.F1) {
      const f = clamp((t - this.start) / this.step + 1, 0, NAME.length), j = Math.floor(f);
      const cx = j >= NAME.length ? curX(NAME.length) : lerp(curX(j), curX(j + 1), eo(f - j));
      let a = ss(0, 0.06, t);
      if (t < this.start) a *= Math.sin(t * 28) > -0.2 ? 1 : 0.25;
      if (t > 1.28 && t < 1.4) a *= 0.2;
      sq(ctx, P.green, cx, CY, CUR.w, CUR.h, a);
    }
    drawParts(ctx, P, this.sparks, t, { grav: 700, streak: 0.022 });
    drawParts(ctx, P, this.trail, t, { drag: 2 });
    if (t >= this.F0 && t < this.F1) {
      const u = (t - this.F0) / (this.F1 - this.F0);
      sq(ctx, dotColor(P), DOT.cx, lerp(-20, DOT.cy, u * u), DOT.s * (1 - 0.15 * u), DOT.s * (1 + 0.7 * u), 1);
    } else if (t >= this.F1) { const e = coup(t, this.F1); sq(ctx, dotColor(P), DOT.cx, DOT.cy, DOT.s * e, DOT.s * e, 1); }
    drawParts(ctx, P, this.boom, t, { grav: 700, streak: 0.022 });
    ctx.globalCompositeOperation = P.glow ? 'lighter' : 'source-over';
    for (const s of this.twinkles) {
      const u = (t - s.t0) / s.life; if (u < 0 || u > 1) continue;
      const a = Math.sin(u * Math.PI), y = s.y - u * 6, l = s.len * a;
      ctx.globalAlpha = a; ctx.strokeStyle = s.alt && P.glow ? P.hot : P.spark2; ctx.lineWidth = 0.7;
      ctx.beginPath(); ctx.moveTo(s.x - l, y); ctx.lineTo(s.x + l, y); ctx.moveTo(s.x, y - l); ctx.lineTo(s.x, y + l); ctx.stroke();
    }
    ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
  }
});
INTROS2.push({
  id: 'fil', name: "Le fil d'écriture", dur: 2.3, shift: SHIFT,
  desc: "Le curseur file sur la ligne en tirant un fil lumineux, et les lettres montent du fil en poussière. Puis le fil se rembobine vers la droite, allume le nom en vert, et se serre en point carré.",
  A: 0.28, B: 1.22, R0: 1.28, R1: 1.6,
  sweep(t) { return lerp(curX(0) - 2, curX(NAME.length), eio(clamp((t - this.A) / (this.B - this.A)))); },
  relAt(x) { return this.A + invEio(clamp((x - (curX(0) - 2)) / (curX(NAME.length) - curX(0) + 2))) * (this.B - this.A); },
  leftEnd(t) { return lerp(curX(0) - 2, DOT.cx, eio(clamp((t - this.R0) / (this.R1 - this.R0)))); },
  init() {
    const r = rng(505);
    this.LY = T.base + 4;
    this.p = T.pts.map(p => ({ tx: p.tx, ty: p.ty, wob: (r() - 0.5) * 8, rel: this.relAt(p.tx), d: 0.28 + r() * 0.18, s: 0.8 + r() * 0.5, li: p.li }));
    this.C = T.letters.map(L => this.relAt(L.cx + L.w / 2) + 0.46);
    this.embers = [];
    for (let i = 0; i < 320; i++) {
      const t0 = lerp(this.A + 0.03, this.B, r());
      this.embers.push({ x: this.sweep(t0) - r() * 18, y: this.LY, vx: (r() - 0.5) * 24, vy: -40 - r() * 80, t0, life: 0.4 + r() * 0.45, s: 0.6 + r() * 0.7, c: r() });
    }
    this.residue = [];
    for (let i = 0; i < 140; i++) {
      const t0 = lerp(this.R0, this.R1 - 0.03, r());
      this.residue.push({ x: this.leftEnd(t0), y: this.LY, vx: (r() - 0.5) * 30, vy: -20 - r() * 50, t0, life: 0.3 + r() * 0.35, s: 0.6 + r() * 0.6, c: r() });
    }
    this.ring = parts(r, 50, DOT.cx, DOT.cy, this.R1, { a0: 0, a1: TAU, v0: 40, v1: 130, l0: 0.35, l1: 0.65 });
  },
  draw(ctx, t, P) {
    const Lx = this.leftEnd(t), fin = ss(1.62, 1.95, t);
    const G = T.letters.map(L => clamp((Lx - (L.cx - 10)) / 20));
    const C = this.C.map(c => ss(c - 0.12, c + 0.08, t));
    for (let pass = 0; pass < 3; pass++) {
      ctx.fillStyle = pass === 0 ? P.spark2 : pass === 1 ? P.ink : P.green;
      for (const q of this.p) {
        if (t < q.rel) continue;
        const k = eo(clamp((t - q.rel) / q.d)), land = ss(0.7, 1, k), g = G[q.li];
        const w = pass === 0 ? 1 - land : pass === 1 ? land * (1 - g) : land * g;
        const a = (1 - C[q.li]) * w; if (a < 0.01) continue;
        ctx.globalAlpha = a;
        ctx.fillRect(q.tx + Math.sin(k * Math.PI) * q.wob - q.s / 2, lerp(this.LY, q.ty, k) - q.s / 2, q.s, q.s);
      }
    }
    ctx.globalAlpha = 1;
    T.letters.forEach((L, k) => {
      const a = C[k] * (1 - fin);
      drawLetter(ctx, L, P.ink, a * (1 - G[k])); drawLetter(ctx, L, P.green, a * G[k]);
    });
    drawName(ctx, P.green, fin);
    drawParts(ctx, P, this.embers, t, { drag: 1.5, grav: -30 });
    drawParts(ctx, P, this.residue, t, { drag: 1.5, grav: -20 });
    let Rx;
    if (t < this.A) Rx = curX(0) - 2; else if (t < this.R0) Rx = this.sweep(t); else Rx = lerp(curX(NAME.length), DOT.cx, eio(clamp((t - this.R0) / (this.R1 - this.R0))));
    if (t < this.R1 && Rx - Lx > 0.5) {
      const a = ss(0.1, 0.3, t);
      if (P.glow) { ctx.globalCompositeOperation = 'lighter'; sq(ctx, P.green, (Lx + Rx) / 2, this.LY, Rx - Lx, 4, 0.22 * a); ctx.globalCompositeOperation = 'source-over'; }
      sq(ctx, P.green, (Lx + Rx) / 2, this.LY, Rx - Lx, 1.4, 0.95 * a);
    }
    if (t < this.R1) {
      let cx, cy = CY, w = CUR.w, h = CUR.h, k = 0, a = ss(0.05, 0.15, t);
      if (t < this.A) { cx = curX(0) - 2; a *= Math.sin(t * 22) > -0.3 ? 1 : 0.15; }
      else if (t < this.R0) cx = this.sweep(t);
      else { k = eio((t - this.R0) / (this.R1 - this.R0)); cx = lerp(curX(NAME.length), DOT.cx, k); cy = lerp(CY, DOT.cy, k); w = lerp(CUR.w, DOT.s, k); h = lerp(CUR.h, DOT.s, k); }
      sq(ctx, P.green, cx, cy, w, h, a * (1 - k));
      sq(ctx, dotColor(P), cx, cy, w, h, a * k);
    } else {
      const e = coup(t, this.R1), u = clamp((t - this.R1) / 0.5);
      if (u < 1) { const z = lerp(DOT.s, 36, eo(u)); ctx.globalAlpha = (1 - u) * (1 - u) * 0.8; ctx.strokeStyle = P.green; ctx.lineWidth = 1; ctx.strokeRect(DOT.cx - z / 2, DOT.cy - z / 2, z, z); ctx.globalAlpha = 1; }
      sq(ctx, dotColor(P), DOT.cx, DOT.cy, DOT.s * e, DOT.s * e, 1);
    }
    drawParts(ctx, P, this.ring, t, { drag: 5 });
  }
});
const CH = { start: 0.2, step: 0.07, F0: 1.36, F1: 1.62 };
const chApp = L => CH.start + L.i * CH.step;
const chDist = L => Math.abs(DOT.cx - L.cx);
T.byLetter = T.letters.map(() => []); T.pts.forEach(p => T.byLetter[p.li].push(p));
function chLetters(ctx, P, t, o = {}) {
  for (const L of T.letters) {
    const a0 = chApp(L); if (t < a0) continue;
    const k = clamp((t - a0) / 0.22), sc = o.noPop ? 1 : lerp(0.45, 1, eback(k));
    const a = clamp(k * 3) * (o.alpha ? o.alpha(L, t) : 1);
    const g = o.g ? o.g(L, t) : ss(CH.F1 + 0.02 + (1 - L.xn) * 0.24, CH.F1 + 0.14 + (1 - L.xn) * 0.24, t);
    const y = o.y ? o.y(L, t) : CY + onde(L, t, CH.F1, 3);
    drawLetter(ctx, L, P.ink, a * (1 - g), sc, 40, L.cx, y);
    drawLetter(ctx, L, P.green, a * g, sc, 40, L.cx, y);
  }
}
function chCursor(ctx, P, t) {
  if (t >= CH.F1) return;
  const f = clamp((t - CH.start) / CH.step + 1, 0, NAME.length), j = Math.floor(f);
  const cx = j >= NAME.length ? curX(NAME.length) : lerp(curX(j), curX(j + 1), eo(f - j));
  let a = ss(0, 0.06, t);
  if (t < CH.start) a *= Math.sin(t * 28) > -0.2 ? 1 : 0.25;
  if (t > 1.28 && t < 1.4) a *= 0.2;
  sq(ctx, P.green, cx, CY, CUR.w, CUR.h, a);
}
const chFall = t => { const u = clamp((t - CH.F0) / (CH.F1 - CH.F0)); return { u, y: lerp(-20, DOT.cy, u * u) }; };
function chDot(ctx, P, t, mul = 1, col) {
  col = col || dotColor(P);
  if (t >= CH.F0 && t < CH.F1) { const { u, y } = chFall(t); sq(ctx, col, DOT.cx, y, DOT.s * (1 - 0.15 * u), DOT.s * (1 + 0.7 * u), 1); }
  else if (t >= CH.F1) { const e = coup(t, CH.F1) * mul; sq(ctx, col, DOT.cx, DOT.cy, DOT.s * e, DOT.s * e, 1); }
}
function chSparks(r, n) {
  const a = [];
  for (const L of T.letters) a.push(...parts(r, n, L.cx, CY, chApp(L), { a0: -Math.PI * 1.25, a1: Math.PI * 0.25, v0: 90, v1: 300, l0: 0.4, l1: 0.85, jx: L.w * 0.6, jy: 22, spread: 0.04, s0: 0.6, s1: 1.3 }));
  return a;
}
function rgba(hex, a) { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16 & 255},${n >> 8 & 255},${n & 255},${a})`; }
function glow(ctx, P, x, y, z, a, h, col) {
  a *= P.glow ? 1 : 0.5; if (a <= 0.001 || z <= 0) return;
  col = col || P.green;
  ctx.save(); ctx.globalCompositeOperation = P.glow ? 'lighter' : 'source-over';
  ctx.translate(x, y); ctx.scale(z * 0.9, (h || z) * 0.9);
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
  g.addColorStop(0, rgba(col, Math.min(1, a))); g.addColorStop(1, rgba(col, 0));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, 1, 0, TAU); ctx.fill(); ctx.restore();
}
function chCurX(t) {
  const f = clamp((t - CH.start) / CH.step + 1, 0, NAME.length), j = Math.floor(f);
  return j >= NAME.length ? curX(NAME.length) : lerp(curX(j), curX(j + 1), eo(f - j));
}
function chComet(r, n, dur) {
  const a = [];
  for (let i = 0; i < n; i++) {
    const u = Math.sqrt(r()), te = lerp(CH.F0, CH.F1, u);
    a.push({ x: DOT.cx + (r() - 0.5) * 18, y: lerp(-20, DOT.cy, u * u) + (r() - 0.5) * 10, vx: (r() - 0.5) * 150, vy: -10 - r() * 80, t0: te, life: Math.min(0.45 + r() * 0.4, dur - 0.02 - te), s: 0.8 + r() * 1.2, c: r() });
  }
  return a;
}
function chCometDraw(ctx, P, t, tail) {
  drawParts(ctx, P, tail, t, { drag: 1.8, grav: 70 });
  if (t >= CH.F0 && t < CH.F1) { const { y } = chFall(t); glow(ctx, P, DOT.cx, y, 18, 0.25); }
}
T.letters.forEach((L, k) => { L.k = k; });
const INTROS3 = [];
INTROS3.push({
  id: 'comete', name: 'La comète', dur: 2.5, shift: SHIFT,
  desc: "Chaque lettre se condense d'un petit nuage. Le point tombe comme une comète, avec une longue traîne de poussière qui retombe en pluie fine après l'impact.",
  init() {
    const r = rng(601);
    this.puffs = [];
    T.letters.forEach((L, li) => {
      const pts = T.byLetter[li];
      for (let j = 0; j < 60; j++) {
        const p = pts[Math.floor(r() * pts.length)], ang = r() * TAU, R = 22 + r() * 40;
        this.puffs.push({ sx: p.tx + Math.cos(ang) * R, sy: p.ty + Math.sin(ang) * R, tx: p.tx, ty: p.ty, t0: chApp(L) - 0.16 + r() * 0.05, s: 0.9 + r() * 0.8 });
      }
    });
    this.tail = chComet(r, 1200, this.dur);
    this.splash = parts(r, 280, DOT.cx, DOT.cy, CH.F1, { a0: -Math.PI, a1: 0, v0: 80, v1: 320, l0: 0.4, l1: 0.8, s0: 0.9, s1: 2 });
  },
  draw(ctx, t, P) {
    ctx.fillStyle = P.ink;
    for (const q of this.puffs) {
      const k = (t - q.t0) / 0.2; if (k < 0 || k >= 1) continue;
      const e = eio(k); ctx.globalAlpha = 0.45 + 0.55 * k * (1 - k * k);
      ctx.fillRect(lerp(q.sx, q.tx, e) - q.s / 2, lerp(q.sy, q.ty, e) - q.s / 2, q.s, q.s);
    }
    ctx.globalAlpha = 1;
    chLetters(ctx, P, t); chCursor(ctx, P, t);
    chCometDraw(ctx, P, t, this.tail);
    chDot(ctx, P, t);
    drawParts(ctx, P, this.splash, t, { drag: 3, grav: 300 });
  }
});
INTROS3.push({
  id: 'artifice', name: "Le feu d'artifice", dur: 2.6, shift: SHIFT,
  desc: "Le nom se tape en étincelles. Le point tombe et éclate en feu d'artifice : une gerbe ronde de paillettes qui scintillent et retombent sur le nom, qui passe au vert depuis le point.",
  init() {
    const r = rng(602);
    this.sparks = chSparks(r, 22);
    this.bloom = [];
    for (let i = 0; i < 700; i++) {
      const ang = r() * TAU, sp = 30 + Math.sqrt(r()) * 380;
      this.bloom.push({ x: DOT.cx, y: DOT.cy, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp, t0: CH.F1 + r() * 0.03, life: 0.6 + r() * 0.32, s: 1.1 + r() * 1.4, c: r() });
    }
    this.ring = parts(r, 200, DOT.cx, DOT.cy, CH.F1 + 0.12, { a0: 0, a1: TAU, v0: 230, v1: 280, l0: 0.5, l1: 0.78, s0: 1, s1: 1.8 });
  },
  draw(ctx, t, P) {
    chLetters(ctx, P, t, { g: (L, t) => ss(CH.F1 + chDist(L) / 520, CH.F1 + chDist(L) / 520 + 0.12, t) });
    chCursor(ctx, P, t);
    drawParts(ctx, P, this.sparks, t, { grav: 700, streak: 0.022 });
    chDot(ctx, P, t);
    drawParts(ctx, P, this.bloom, t, { drag: 1.9, grav: 140, twinkle: 38 });
    drawParts(ctx, P, this.ring, t, { drag: 2.6, grav: 90, streak: 0.018 });
  }
});
INTROS3.push({
  id: 'defait', name: 'Le nom en poussière', dur: 2.6, shift: SHIFT,
  desc: "Le nom se tape. Le point tombe, et le choc court vers la gauche : chaque lettre se défait en poussière, tourbillonne, puis se reforme en vert, une après l'autre.",
  hit(L) { return CH.F1 + 0.03 + chDist(L) / 900; },
  init() {
    const r = rng(603);
    this.sparks = chSparks(r, 12);
    this.p = T.pts.map(p => {
      const ang = -Math.PI / 2 + (r() - 0.5) * 2.6, m = 8 + r() * 34;
      return { tx: p.tx, ty: p.ty, ox: Math.cos(ang) * m, oy: Math.sin(ang) * m, sw: (r() - 0.5) * 16, h: this.hit(T.letters[p.li]), s: 0.8 + r() * 0.5 };
    });
    this.lost = [];
    for (const L of T.letters) this.lost.push(...parts(r, 14, L.cx, CY, this.hit(L), { a0: -Math.PI * 0.95, a1: -Math.PI * 0.05, v0: 40, v1: 120, l0: 0.35, l1: 0.6, jx: L.w * 0.7, jy: 26, s0: 0.6, s1: 1.1 }));
    this.splash = parts(r, 70, DOT.cx, DOT.cy, CH.F1, { a0: -Math.PI, a1: 0, v0: 80, v1: 220, l0: 0.35, l1: 0.6 });
  },
  draw(ctx, t, P) {
    chLetters(ctx, P, t, {
      alpha: (L, t) => { const h = this.hit(L); return 1 - ss(h - 0.01, h + 0.03, t) + ss(h + 0.48, h + 0.6, t); },
      g: (L, t) => ss(this.hit(L) + 0.3, this.hit(L) + 0.5, t),
      y: (L, t) => CY + onde(L, t, CH.F1, 2)
    });
    for (let pass = 0; pass < 2; pass++) {
      ctx.fillStyle = pass ? P.green : P.ink;
      for (const q of this.p) {
        const u = (t - q.h) / 0.6; if (u <= 0 || u >= 1) continue;
        const e = u < 0.28 ? eo(u / 0.28) : 1 - eio((u - 0.28) / 0.72), g = ss(0.3, 0.7, u);
        const a = (pass ? g : 1 - g) * (1 - ss(0.82, 1, u)); if (a < 0.01) continue;
        ctx.globalAlpha = a;
        ctx.fillRect(q.tx + q.ox * e + Math.sin(u * Math.PI) * q.sw - q.s / 2, q.ty + q.oy * e - q.s / 2, q.s, q.s);
      }
    }
    ctx.globalAlpha = 1;
    chCursor(ctx, P, t);
    drawParts(ctx, P, this.sparks, t, { grav: 700, streak: 0.022 });
    drawParts(ctx, P, this.lost, t, { drag: 1.5, grav: -20 });
    chDot(ctx, P, t);
    drawParts(ctx, P, this.splash, t, { drag: 3, grav: 400 });
  }
});
INTROS3.push({
  id: 'goutte', name: 'La goutte', dur: 2.5, shift: SHIFT,
  desc: "Le point tombe comme une goutte et éclabousse en touchant la ligne. Toutes les fines gouttelettes filent en arc vers les lettres, et c'est en s'y posant qu'elles les colorent en vert.",
  init() {
    const r = rng(604);
    this.sparks = chSparks(r, 18);
    this.drops = [];
    const per = T.letters.map(() => []);
    for (let i = 0; i < 1800; i++) {
      const p = T.pts[Math.floor(r() * T.pts.length)], d = Math.abs(p.tx - DOT.cx);
      const t0 = CH.F1 + r() * 0.1, fl = 0.2 + d / 1000 + r() * 0.08;
      const q = { x0: DOT.cx + (r() - 0.5) * 14, y0: DOT.cy - 2 - r() * 10, tx: p.tx, ty: p.ty, t0, fl, land: t0 + fl, h: 14 + d * 0.18 + r() * 130, s: 0.45 + r() * 0.55, c: r() };
      this.drops.push(q); per[p.li].push(q.land);
    }
    this.land = per.map(a => a.sort((x, y) => x - y));
  },
  frac(k, t) { const a = this.land[k]; let n = 0; while (n < a.length && a[n] <= t) n++; return a.length ? n / a.length : 0; },
  draw(ctx, t, P) {
    chLetters(ctx, P, t, {
      g: (L, t) => ss(0.08, 0.75, this.frac(L.k, t)),
      y: (L, t) => { const a = this.land[L.k]; return CY + (a.length ? bump(t, a[Math.floor(a.length * 0.3)], 0.16) * 1.8 : 0); }
    });
    chCursor(ctx, P, t);
    drawParts(ctx, P, this.sparks, t, { grav: 700, streak: 0.022 });
    chDot(ctx, P, t);
    ctx.globalCompositeOperation = P.glow ? 'lighter' : 'source-over'; ctx.lineCap = 'round';
    for (const q of this.drops) {
      if (t < q.t0 || t > q.land + 0.14) continue;
      const col = q.c < 0.5 ? P.green : q.c < 0.85 || !P.glow ? P.spark2 : P.hot;
      if (t < q.land) {
        const u = (t - q.t0) / q.fl, v = Math.max(0, u - 0.006 / q.fl);
        const at = w => [lerp(q.x0, q.tx, w), lerp(q.y0, q.ty, w) - q.h * 4 * w * (1 - w)];
        const [x, y] = at(u), [px, py] = at(v);
        ctx.globalAlpha = 0.95; ctx.strokeStyle = col; ctx.lineWidth = q.s * 0.8;
        ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(x, y); ctx.stroke();
        ctx.fillStyle = col; ctx.fillRect(x - q.s * 0.55, y - q.s * 0.55, q.s * 1.1, q.s * 1.1);
      } else {
        const k = (t - q.land) / 0.14, z = q.s * (1 - k);
        ctx.globalAlpha = 1 - k; ctx.fillStyle = col; ctx.fillRect(q.tx - z / 2, q.ty - 2.5 * k - z / 2, z, z);
      }
    }
    ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
  }
});
INTROS3.push({
  id: 'braises', name: 'Les braises', dur: 2.55, shift: SHIFT,
  desc: "Le point tombe brûlant et refroidit en se posant. Le nom s'embrase de droite à gauche, et chaque lettre laisse monter des braises qui ondulent et s'éteignent.",
  hit(L) { return CH.F1 + chDist(L) / 650; },
  init() {
    const r = rng(605);
    this.sparks = chSparks(r, 22);
    this.embers = []; this.ignite = [];
    T.letters.forEach((L, li) => {
      const h = this.hit(L), pts = T.byLetter[li];
      for (let j = 0; j < 95; j++) {
        const p = pts[Math.floor(r() * pts.length)], t0 = lerp(h, this.dur - 0.56, r() * r());
        this.embers.push({ x: p.tx, y: p.ty, vx: (r() - 0.5) * 30, vy: -40 - r() * 100, t0, life: Math.min(0.38 + r() * 0.15, this.dur - 0.02 - t0), s: 1 + r() * 1.3, c: 0.3 + r() * 0.7 });
      }
      this.ignite.push(...parts(r, 18, L.cx, CY, h, { a0: -Math.PI * 0.85, a1: -Math.PI * 0.15, v0: 90, v1: 260, l0: 0.25, l1: 0.45, jx: L.w * 0.6, jy: 20, s0: 0.9, s1: 1.6 }));
    });
  },
  draw(ctx, t, P) {
    chLetters(ctx, P, t, { g: (L, t) => ss(this.hit(L), this.hit(L) + 0.12, t) });
    chCursor(ctx, P, t);
    drawParts(ctx, P, this.sparks, t, { grav: 700, streak: 0.022 });
    drawParts(ctx, P, this.embers, t, { drag: 1, grav: -40, wob: 3 });
    drawParts(ctx, P, this.ignite, t, { grav: 300, streak: 0.02 });
    const hot = P.glow ? P.hot : P.spark2, cool = ss(CH.F1, CH.F1 + 0.4, t);
    if (t >= CH.F0) { const y = t < CH.F1 ? chFall(t).y : DOT.cy; glow(ctx, P, DOT.cx, y, 20, 0.3 * (1 - cool)); }
    if (t >= CH.F0 && t < CH.F1) chDot(ctx, P, t, 1, hot);
    else if (t >= CH.F1) { ctx.save(); chDot(ctx, P, t); ctx.globalAlpha = 1; const e = coup(t, CH.F1); sq(ctx, hot, DOT.cx, DOT.cy, DOT.s * e, DOT.s * e, 1 - cool); ctx.restore(); }
  }
});
INTROS3.push({
  id: 'tourbillon', name: 'Le tourbillon', dur: 2.6, shift: SHIFT,
  desc: "Une poussière flotte pendant que le nom se tape. Le point tombe, et toute la poussière de l'écran tourbillonne vers lui. Il gonfle, puis relâche un anneau d'étincelles qui allume le nom en vert.",
  REL: 2.12,
  init() {
    const r = rng(606);
    this.sparks = chSparks(r, 16);
    this.v = [];
    for (let i = 0; i < 1200; i++) {
      const sx = r() * W, sy = r() * H, dx = sx - DOT.cx, dy = sy - DOT.cy;
      this.v.push({ sx, sy, R0: Math.hypot(dx, dy), th0: Math.atan2(dy, dx), rel: CH.F1 + 0.02 + r() * 0.3, d: 0.28 + r() * 0.14, ph: r() * TAU, a0: 0.25 + r() * 0.45, s: 0.9 + r() * 0.9 });
    }
    this.ring = parts(r, 240, DOT.cx, DOT.cy, this.REL, { a0: 0, a1: TAU, v0: 150, v1: 420, l0: 0.3, l1: 0.45, s0: 1, s1: 2 });
  },
  draw(ctx, t, P) {
    chLetters(ctx, P, t, {
      g: (L, t) => ss(this.REL + chDist(L) / 800, this.REL + 0.1 + chDist(L) / 800, t),
      y: (L, t) => CY + onde(L, t, CH.F1, 2) + onde(L, t, this.REL, 3)
    });
    const appear = ss(0, 0.4, t);
    for (let pass = 0; pass < 2; pass++) {
      ctx.fillStyle = pass ? P.green : P.ink;
      for (const q of this.v) {
        const k = clamp((t - q.rel) / q.d); if (k >= 1) continue;
        const e = eio(k), g = ss(0.35, 0.8, k), a = lerp(q.a0 * (0.7 + 0.3 * Math.sin(t * 5 + q.ph)), 1, e) * appear * (pass ? g : 1 - g);
        if (a < 0.01) continue;
        let x, y;
        if (k <= 0) { x = q.sx + Math.sin(t * 0.9 + q.ph) * 12; y = q.sy + Math.cos(t * 0.7 + q.ph) * 9; }
        else { const R = q.R0 * (1 - e), th = q.th0 + 6.5 * e; x = DOT.cx + Math.cos(th) * R; y = DOT.cy + Math.sin(th) * R; }
        ctx.globalAlpha = a; ctx.fillRect(x - q.s / 2, y - q.s / 2, q.s, q.s);
      }
    }
    ctx.globalAlpha = 1;
    chCursor(ctx, P, t);
    drawParts(ctx, P, this.sparks, t, { grav: 700, streak: 0.022 });
    const swell = ss(CH.F1 + 0.1, 2.02, t) * (1 - ss(this.REL, this.REL + 0.08, t));
    if (swell > 0.01) glow(ctx, P, DOT.cx, DOT.cy, 10 + 14 * swell, 0.3 * swell);
    chDot(ctx, P, t, 1 + 0.45 * swell);
    drawParts(ctx, P, this.ring, t, { drag: 3, streak: 0.02 });
  }
});
const INTROS4 = [];
INTROS4.push({
  id: 'cierge', name: 'Le cierge magique', dur: 2.5, shift: SHIFT,
  desc: "Le curseur crépite comme un cierge magique et projette des étincelles tout autour de lui pendant qu'il tape le nom. Puis le point tombe en comète sur lui et éclate.",
  init() {
    const r = rng(701);
    this.sp = [];
    for (let i = 0; i < 1400; i++) {
      const t0 = lerp(0.05, CH.F1, r()), ang = r() * TAU, v = 60 + r() * 250;
      this.sp.push({ x: chCurX(t0) + 3 * (r() - 0.5), y: CY + (r() - 0.5) * 38, vx: Math.cos(ang) * v, vy: Math.sin(ang) * v, t0, life: Math.min(0.16 + r() * 0.26, this.dur - 0.02 - t0), s: 0.6 + r() * 1, c: r() });
    }
    this.tail = chComet(r, 1000, this.dur);
    this.burst = parts(r, 240, DOT.cx, DOT.cy, CH.F1, { a0: 0, a1: TAU, v0: 80, v1: 340, l0: 0.3, l1: 0.6, s0: 0.8, s1: 1.6 });
  },
  draw(ctx, t, P) {
    chLetters(ctx, P, t);
    if (t < CH.F1) glow(ctx, P, chCurX(t), CY, 12, 0.28 * ss(0, 0.1, t), 30);
    chCursor(ctx, P, t);
    drawParts(ctx, P, this.sp, t, { drag: 3, grav: 260, streak: 0.03 });
    chCometDraw(ctx, P, t, this.tail);
    chDot(ctx, P, t);
    drawParts(ctx, P, this.burst, t, { drag: 3, grav: 200, streak: 0.02 });
  }
});
INTROS4.push({
  id: 'aspire', name: 'Le curseur qui aspire', dur: 2.5, shift: SHIFT,
  desc: "Une poussière couvre l'écran et le curseur l'aspire en tourbillons pendant qu'il tape : chaque lettre sort de lui. Puis le point tombe en comète sur le curseur.",
  init() {
    const r = rng(702);
    this.dust = [];
    for (let i = 0; i < 1600; i++) {
      const ta = lerp(0.12, CH.F0 - 0.04, r());
      this.dust.push({ sx: r() * W, sy: r() * H, ta, d: 0.32 + r() * 0.26, oy: (r() - 0.5) * 32, ph: r() * TAU, a0: 0.22 + r() * 0.4, s: 0.9 + r() * 0.8, curl: (r() - 0.5) * 90 });
    }
    this.tail = chComet(r, 1000, this.dur);
    this.burst = parts(r, 200, DOT.cx, DOT.cy, CH.F1, { a0: 0, a1: TAU, v0: 70, v1: 300, l0: 0.3, l1: 0.6, s0: 0.8, s1: 1.6 });
  },
  draw(ctx, t, P) {
    chLetters(ctx, P, t);
    const appear = ss(0, 0.25, t), cx = chCurX(t);
    for (let pass = 0; pass < 2; pass++) {
      ctx.fillStyle = pass ? P.green : P.ink;
      for (const q of this.dust) {
        if (t >= q.ta) continue;
        const k = clamp((t - (q.ta - q.d)) / q.d), e = eio(k), g = ss(0.35, 0.9, e);
        const a = lerp(q.a0 * appear * (0.7 + 0.3 * Math.sin(t * 5 + q.ph)), 1, e) * (pass ? g : 1 - g);
        if (a < 0.01) continue;
        const bx = q.sx + Math.sin(t * 0.9 + q.ph) * 10, by = q.sy + Math.cos(t * 0.7 + q.ph) * 8;
        const dx = cx - bx, dy = CY + q.oy - by, L = Math.hypot(dx, dy) || 1, c = Math.sin(e * Math.PI) * q.curl;
        ctx.globalAlpha = a;
        ctx.fillRect(bx + dx * e - dy / L * c - q.s / 2, by + dy * e + dx / L * c - q.s / 2, q.s, q.s);
      }
    }
    ctx.globalAlpha = 1;
    if (t < CH.F1) glow(ctx, P, cx, CY, 12, 0.28 * appear, 30);
    chCursor(ctx, P, t);
    chCometDraw(ctx, P, t, this.tail);
    chDot(ctx, P, t);
    drawParts(ctx, P, this.burst, t, { drag: 3, grav: 200, streak: 0.02 });
  }
});
INTROS4.push({
  id: 'traine', name: 'La traîne du curseur', dur: 2.5, shift: SHIFT,
  desc: "Le curseur file comme une comète couchée : sa traîne de poussière s'étire derrière lui sur le nom qu'il vient de taper. Puis la vraie comète, le point, tombe sur lui et les deux traînes se croisent.",
  init() {
    const r = rng(703);
    this.sp = [];
    for (let i = 0; i < 2200; i++) {
      const t0 = lerp(0.1, CH.F1, r());
      this.sp.push({ x: chCurX(t0) - 1 + (r() - 0.5) * 3, y: CY + (r() - 0.5) * 36, vx: -(15 + r() * 110), vy: (r() - 0.5) * 34, t0, life: Math.min(0.5 + r() * 0.45, this.dur - 0.02 - t0), s: 1 + r() * 1.1, c: r() });
    }
    this.tail = chComet(r, 1200, this.dur);
    this.burst = parts(r, 180, DOT.cx, DOT.cy, CH.F1, { a0: -Math.PI, a1: 0, v0: 80, v1: 300, l0: 0.35, l1: 0.65, s0: 0.8, s1: 1.6 });
  },
  draw(ctx, t, P) {
    chLetters(ctx, P, t);
    drawParts(ctx, P, this.sp, t, { drag: 1.4, grav: 10 });
    if (t < CH.F1) glow(ctx, P, chCurX(t), CY, 12, 0.28 * ss(0, 0.1, t), 30);
    chCursor(ctx, P, t);
    chCometDraw(ctx, P, t, this.tail);
    chDot(ctx, P, t);
    drawParts(ctx, P, this.burst, t, { drag: 3, grav: 300 });
  }
});
INTROS4.push({
  id: 'orbite', name: "L'orbite", dur: 2.6, shift: SHIFT,
  desc: "Un nuage de particules tourne autour du curseur pendant qu'il tape. Le nom tapé, le curseur aspire tout le nuage et se charge. Le point tombe en comète, et le choc redéploie les particules sur les lettres, qui verdissent en les recevant.",
  init() {
    const r = rng(704);
    this.o = [];
    const per = T.letters.map(() => []);
    for (let i = 0; i < 1100; i++) {
      const p = T.pts[Math.floor(r() * T.pts.length)], d = Math.abs(p.tx - DOT.cx);
      const t0 = CH.F1 + r() * 0.08, fl = 0.22 + d / 900 + r() * 0.1;
      const q = { R: 7 + r() * 30, ell: 1.2 + r() * 0.35, w: (4 + r() * 5) * (r() < 0.5 ? -1 : 1), th: r() * TAU, lag: r() * 0.12,
                  ta: 1.12 + r() * 0.08, ad: 0.07 + r() * 0.07,
                  x0: DOT.cx + (r() - 0.5) * 8, y0: DOT.cy - r() * 8, tx: p.tx, ty: p.ty, t0, fl, land: t0 + fl, h: 8 + r() * 80,
                  s: 1 + r() * 1.1, c: r() };
      this.o.push(q); per[p.li].push(q.land);
    }
    this.land = per.map(a => a.sort((x, y) => x - y));
    this.tail = chComet(r, 1000, this.dur);
  },
  frac(k, t) { const a = this.land[k]; let n = 0; while (n < a.length && a[n] <= t) n++; return a.length ? n / a.length : 0; },
  draw(ctx, t, P) {
    chLetters(ctx, P, t, {
      g: (L, t) => ss(0.08, 0.75, this.frac(L.k, t)),
      y: (L, t) => { const a = this.land[L.k]; return CY + (a.length ? bump(t, a[Math.floor(a.length * 0.3)], 0.16) * 1.8 : 0); }
    });
    let charge = 0;
    for (const q of this.o) charge += clamp((t - q.ta) / q.ad);
    charge /= this.o.length;
    if (t < CH.F1) glow(ctx, P, chCurX(t), CY, 10 + 10 * charge, (0.12 + 0.3 * charge) * ss(0, 0.2, t), 30 + 14 * charge);
    chCursor(ctx, P, t);
    const appear = ss(0.02, 0.25, t);
    ctx.globalCompositeOperation = P.glow ? 'lighter' : 'source-over'; ctx.lineCap = 'round';
    for (const q of this.o) {
      const col = q.c < 0.5 ? P.green : q.c < 0.85 || !P.glow ? P.spark2 : P.hot;
      if (t < q.ta + q.ad) {
        const e = eio(clamp((t - q.ta) / q.ad)), th = q.th + q.w * t + 7 * e * Math.sign(q.w), R = q.R * (1 - e);
        const lag = q.lag * (1 - e);
        ctx.globalAlpha = appear * (0.55 + 0.45 * Math.sin(t * 7 + q.th)) * (1 - 0.3 * e); ctx.fillStyle = col;
        ctx.fillRect(chCurX(t - lag) + Math.cos(th) * R - q.s / 2, CY + Math.sin(th) * R * q.ell - q.s / 2, q.s, q.s);
      } else if (t >= q.t0 && t < q.land) {
        const u = (t - q.t0) / q.fl, v = Math.max(0, u - 0.009 / q.fl);
        const at = w => [lerp(q.x0, q.tx, w), lerp(q.y0, q.ty, w) - q.h * 4 * w * (1 - w)];
        const [x, y] = at(u), [px, py] = at(v);
        ctx.globalAlpha = 0.95; ctx.strokeStyle = col; ctx.lineWidth = q.s;
        ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(x, y); ctx.stroke();
        ctx.fillStyle = col; ctx.fillRect(x - q.s * 0.6, y - q.s * 0.6, q.s * 1.2, q.s * 1.2);
      } else if (t >= q.land && t < q.land + 0.14) {
        const k = (t - q.land) / 0.14, z = q.s * (1 - k);
        ctx.globalAlpha = 1 - k; ctx.fillStyle = col; ctx.fillRect(q.tx - z / 2, q.ty - 2.5 * k - z / 2, z, z);
      }
    }
    ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
    chCometDraw(ctx, P, t, this.tail);
    chDot(ctx, P, t);
  }
});
INTROS4.push({
  id: 'electrique', name: 'Le curseur électrique', dur: 2.45, shift: SHIFT,
  desc: "Le curseur est chargé d'électricité : de petits éclairs jaillissent de lui en crépitant pendant qu'il tape. Le point tombe en comète, et l'impact lâche une gerbe d'éclairs vers le ciel.",
  bolt(r, x, y, ang, len, t0, keep) {
    const pts = [[x, y]], n = 6;
    for (let k = 1; k <= n; k++) {
      const d = len * k / n, j = k < n ? (r() - 0.5) * len * 0.35 : 0;
      pts.push([x + Math.cos(ang) * d - Math.sin(ang) * j, y + Math.sin(ang) * d + Math.cos(ang) * j]);
    }
    this.bolts.push({ pts, t0, keep });
    this.sp.push(...parts(r, 5, pts[n][0], pts[n][1], t0, { a0: 0, a1: TAU, v0: 40, v1: 160, l0: 0.15, l1: 0.35, s0: 0.6, s1: 1.2 }));
  },
  init() {
    const r = rng(705);
    this.bolts = []; this.sp = [];
    for (let tb = 0.08; tb < CH.F1 - 0.02; tb += 0.045) {
      const n = 2 + (r() < 0.5 ? 1 : 0);
      for (let i = 0; i < n; i++) this.bolt(r, chCurX(tb), CY + (r() - 0.5) * 36, r() * TAU, 18 + r() * 40, tb + r() * 0.02, 0.07);
    }
    for (let i = 0; i < 11; i++) this.bolt(r, DOT.cx, DOT.cy, -Math.PI * (0.1 + 0.8 * i / 10) + (r() - 0.5) * 0.15, 50 + r() * 90, CH.F1 + r() * 0.04, 0.16);
    this.tail = chComet(r, 900, this.dur);
    this.burst = parts(r, 180, DOT.cx, DOT.cy, CH.F1, { a0: 0, a1: TAU, v0: 80, v1: 320, l0: 0.3, l1: 0.6, s0: 0.8, s1: 1.6 });
  },
  draw(ctx, t, P) {
    chLetters(ctx, P, t);
    if (t < CH.F1) glow(ctx, P, chCurX(t), CY, 12, (0.18 + 0.14 * Math.sin(t * 60)) * ss(0, 0.1, t), 30);
    chCursor(ctx, P, t);
    ctx.globalCompositeOperation = P.glow ? 'lighter' : 'source-over'; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    for (const b of this.bolts) {
      const u = (t - b.t0) / b.keep; if (u < 0 || u > 1) continue;
      const a = 1 - u;
      for (const [w, col, al] of [[3.2, P.green, 0.3], [1.1, P.glow ? P.hot : P.green, 1]]) {
        ctx.globalAlpha = a * al; ctx.strokeStyle = col; ctx.lineWidth = w;
        ctx.beginPath(); ctx.moveTo(b.pts[0][0], b.pts[0][1]); for (let k = 1; k < b.pts.length; k++) ctx.lineTo(b.pts[k][0], b.pts[k][1]); ctx.stroke();
      }
    }
    ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
    drawParts(ctx, P, this.sp, t, { drag: 4, streak: 0.02 });
    chCometDraw(ctx, P, t, this.tail);
    chDot(ctx, P, t);
    drawParts(ctx, P, this.burst, t, { drag: 3, grav: 200, streak: 0.02 });
  }
});
INTROS.forEach(i => i.init());
INTROS2.forEach(i => i.init());
INTROS3.forEach(i => i.init());
INTROS4.forEach(i => i.init());
let THEME = 'light', SPEED = 1;
const HOLD = 1.5;
const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const TOUTES = [...INTROS4, ...INTROS3, ...INTROS2, ...INTROS];
window.OUVERTURES = { W, H, pal: PAL.light, liste: ["comete", "cierge", "aspire", "traine", "orbite", "artifice", "defait", "goutte", "braises", "tourbillon", "curseur-point", "point-ecrit", "aimant", "fil"].map(id => TOUTES.find(i => i.id === id)) };
})();
