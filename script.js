/* ============================================================
   IMPROVED Corporate Finance — JavaScript
   ============================================================ */

'use strict';

/* ── Canvas Hero ─────────────────────────────────────────── */
function initHero() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Pre-compute streak data once for consistency
  let streaks = [];

  function buildStreaks(W, H) {
    streaks = [];
    const cx = W * 0.5;
    const cy = H * 0.5;
    const count = 350;

    for (let i = 0; i < count; i++) {
      const base  = (Math.PI * 2 * i) / count;
      const jitter = (Math.random() - 0.5) * (Math.PI * 2 / count) * 2;
      const angle  = base + jitter;
      const inner  = 15 + Math.random() * 120;
      const outer  = Math.sqrt(W * W + H * H) * (0.35 + Math.random() * 0.75);
      const bright = Math.random();
      const width  = 0.3 + Math.random() * 1.8;

      streaks.push({ angle, inner, outer, bright, width, cx, cy });
    }
  }

  function draw(W, H) {
    ctx.clearRect(0, 0, W, H);
    const cx = W * 0.5;
    const cy = H * 0.5;

    // ── Base: very dark red-black
    ctx.fillStyle = '#060000';
    ctx.fillRect(0, 0, W, H);

    // ── Radial glow from centre
    const radGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H) * 0.65);
    radGrad.addColorStop(0,    'rgba(210, 70, 15, 0.90)');
    radGrad.addColorStop(0.12, 'rgba(175, 40, 8,  0.88)');
    radGrad.addColorStop(0.30, 'rgba(130, 18, 4,  0.80)');
    radGrad.addColorStop(0.55, 'rgba(75,  5,  1,  0.75)');
    radGrad.addColorStop(1,    'rgba(4,   0,  0,  0.97)');
    ctx.fillStyle = radGrad;
    ctx.fillRect(0, 0, W, H);

    // ── Speed streaks
    ctx.save();
    for (const s of streaks) {
      const x1 = cx + Math.cos(s.angle) * s.inner;
      const y1 = cy + Math.sin(s.angle) * s.inner;
      const x2 = cx + Math.cos(s.angle) * s.outer;
      const y2 = cy + Math.sin(s.angle) * s.outer;

      const lg = ctx.createLinearGradient(x1, y1, x2, y2);

      if (s.bright > 0.87) {
        // Gold/orange highlight streak
        const alpha = 0.35 + s.bright * 0.45;
        lg.addColorStop(0,   'rgba(255,210,80,0)');
        lg.addColorStop(0.25, `rgba(255,${140 + s.bright * 60},25,${alpha})`);
        lg.addColorStop(1,   'rgba(180,90,10,0)');
      } else {
        // Red streak
        const r = Math.round(140 + s.bright * 85);
        const g = Math.round(18  + s.bright * 28);
        const a = 0.15 + s.bright * 0.55;
        lg.addColorStop(0,    `rgba(${r},${g},8,0)`);
        lg.addColorStop(0.28, `rgba(${r},${g},8,${a})`);
        lg.addColorStop(1,    `rgba(${Math.round(r * 0.5)},${Math.round(g * 0.4)},4,0)`);
      }

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.lineWidth   = s.width;
      ctx.strokeStyle = lg;
      ctx.stroke();
    }
    ctx.restore();

    // ── Edge vignette
    const vig = ctx.createRadialGradient(cx, cy, H * 0.15, cx, cy, Math.max(W, H) * 0.95);
    vig.addColorStop(0,   'rgba(0,0,0,0)');
    vig.addColorStop(0.55,'rgba(0,0,0,0.05)');
    vig.addColorStop(1,   'rgba(0,0,0,0.88)');
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, W, H);
  }

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    buildStreaks(canvas.width, canvas.height);
    draw(canvas.width, canvas.height);
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });
}

/* ── Navbar scroll state ─────────────────────────────────── */
function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const toggle    = document.getElementById('navToggle');
  const mobileNav = document.getElementById('navMobile');

  function updateNav() {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  toggle.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
  });

  mobileNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => mobileNav.classList.remove('open'));
  });
}

/* ── Smooth scroll ───────────────────────────────────────── */
function initSmoothScroll() {
  const navbar = document.getElementById('navbar');
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - navbar.offsetHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ── Scroll reveal ───────────────────────────────────────── */
function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  const obs = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    }),
    { threshold: 0.15, rootMargin: '0px 0px -30px 0px' }
  );
  items.forEach(el => obs.observe(el));
}

/* ── Deal carousel ───────────────────────────────────────── */
function initCarousel() {
  const track    = document.getElementById('dealsTrack');
  const prevBtn  = document.getElementById('dealPrev');
  const nextBtn  = document.getElementById('dealNext');
  const dotsWrap = document.getElementById('carouselDots');
  if (!track) return;

  const cards     = Array.from(track.children);
  const perPage   = () => window.innerWidth < 768 ? 1 : 3;
  let   current   = 0;

  function pages() { return Math.ceil(cards.length / perPage()); }

  function buildDots() {
    dotsWrap.innerHTML = '';
    for (let i = 0; i < pages(); i++) {
      const d = document.createElement('div');
      d.className = 'dot' + (i === current ? ' active' : '');
      d.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(d);
    }
  }

  function goTo(page) {
    current = Math.max(0, Math.min(page, pages() - 1));
    const pp   = perPage();
    const card = cards[0];
    const gap  = 24; // 1.5rem gap
    const w    = card.offsetWidth + gap;
    track.style.transform = `translateX(-${current * pp * w}px)`;
    dotsWrap.querySelectorAll('.dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));
  window.addEventListener('resize', () => { current = 0; buildDots(); goTo(0); }, { passive: true });

  buildDots();
}

/* ── Init ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initHero();
  initNavbar();
  initSmoothScroll();
  initReveal();
  initCarousel();
});
