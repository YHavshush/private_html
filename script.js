/* ============================================================
   Meridian Capital Partners — JavaScript
   ============================================================ */

'use strict';

/* ── Navbar scroll state ─────────────────────────────────── */
const navbar = document.getElementById('navbar');

function updateNavbar() {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', updateNavbar, { passive: true });
updateNavbar();

/* ── Mobile nav toggle ───────────────────────────────────── */
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const isOpen = navLinks.classList.contains('open');
  navToggle.setAttribute('aria-expanded', isOpen);
});

// Close mobile nav on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

/* ── Smooth anchor scroll ────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navH = navbar.offsetHeight;
    const top  = target.getBoundingClientRect().top + window.scrollY - navH;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ── Scroll-reveal ───────────────────────────────────────── */
function initReveal() {
  const elements = document.querySelectorAll(
    '.about-grid, .service-card, .deal-card, .team-card, ' +
    '.sector-item, .pillar, .why-point, .metric, .contact-grid'
  );

  elements.forEach((el, i) => {
    el.classList.add('reveal');
    // Stagger children of grids
    if (el.parentElement && el.parentElement.children.length > 1) {
      const idx = Array.from(el.parentElement.children).indexOf(el);
      if (idx > 0 && idx <= 4) {
        el.classList.add(`reveal-delay-${idx}`);
      }
    }
  });

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(el => observer.observe(el));
}

/* ── Counter animation ───────────────────────────────────── */
function animateCounter(el) {
  const target   = parseFloat(el.dataset.target);
  const isFloat  = target % 1 !== 0;
  const duration = 1800;
  const start    = performance.now();

  function step(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased    = 1 - Math.pow(1 - progress, 3);
    const current  = eased * target;

    el.textContent = isFloat
      ? current.toFixed(1)
      : Math.floor(current).toString();

    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = isFloat ? target.toFixed(1) : target.toString();
  }

  requestAnimationFrame(step);
}

function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(c => observer.observe(c));
}

/* ── Active nav link on scroll ───────────────────────────── */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a[href^="#"]');

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          links.forEach(link => {
            link.classList.toggle(
              'active',
              link.getAttribute('href') === `#${id}`
            );
          });
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach(s => observer.observe(s));
}

/* ── Contact form ────────────────────────────────────────── */
function initContactForm() {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    // Basic validation
    let valid = true;
    form.querySelectorAll('[required]').forEach(field => {
      if (!field.value.trim()) {
        field.style.borderColor = '#c0392b';
        valid = false;
      } else {
        field.style.borderColor = '';
      }
    });

    if (!valid) return;

    // Simulate submission (replace with actual API call)
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Sending...';
    btn.disabled = true;

    setTimeout(() => {
      form.style.display = 'none';
      success.classList.add('visible');
    }, 1000);
  });

  // Clear error styling on input
  form.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('input', () => {
      field.style.borderColor = '';
    });
  });
}

/* ── Service card hover (ensure keyboard accessible) ─────── */
function initServiceCards() {
  document.querySelectorAll('.service-card').forEach(card => {
    card.setAttribute('tabindex', '0');
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        card.classList.toggle('active');
      }
    });
  });
}

/* ── Init ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initReveal();
  initCounters();
  initActiveNav();
  initContactForm();
  initServiceCards();
});
