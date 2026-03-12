/* script.js – Angelo Gabisan Portfolio */

(function () {
  'use strict';

  /* ── Helpers ─────────────────────────────────────────── */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /* ── Theme toggle ────────────────────────────────────── */
  const body        = document.body;
  const themeBtn    = $('#theme-toggle');
  const THEME_KEY   = 'ag-theme';

  function applyTheme(theme) {
    body.classList.remove('light', 'dark');
    body.classList.add(theme);
    localStorage.setItem(THEME_KEY, theme);
  }

  // Priority: persisted choice → OS preference → light fallback
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const saved = localStorage.getItem(THEME_KEY) || (prefersDark ? 'dark' : 'light');
  applyTheme(saved);

  themeBtn.addEventListener('click', () => {
    applyTheme(body.classList.contains('dark') ? 'light' : 'dark');
  });

  /* ── Mobile navigation ───────────────────────────────── */
  const hamburger = $('#hamburger');
  const navLinks  = $('#nav-links');

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Close mobile menu when a link is clicked
  $$('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ── Active nav link on scroll ───────────────────────── */
  const sections  = $$('section[id]');
  const navAnchors = $$('.nav-links a');

  function setActiveLink() {
    const scrollY = window.scrollY + 100;

    let current = '';
    sections.forEach(sec => {
      if (scrollY >= sec.offsetTop) {
        current = sec.getAttribute('id');
      }
    });

    navAnchors.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
    });
  }

  window.addEventListener('scroll', setActiveLink, { passive: true });
  setActiveLink();

  /* ── Navbar shadow on scroll ─────────────────────────── */
  const navbar = $('#navbar');

  window.addEventListener('scroll', () => {
    navbar.style.boxShadow = window.scrollY > 20
      ? '0 2px 20px rgba(0,0,0,0.08)'
      : 'none';
  }, { passive: true });

  /* ── Reveal on scroll (IntersectionObserver) ─────────── */
  const revealEls = $$('.reveal, .fade-in');

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach(el => io.observe(el));
  } else {
    // Fallback: show all immediately
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* ── Footer year ──────────────────────────────────────── */
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ── Smooth scroll polyfill for older Safari ─────────── */
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ── Typing animation for hero title (subtle) ────────── */
  const heroTitle = $('.hero-title');
  if (heroTitle) {
    const text = heroTitle.textContent.trim();
    heroTitle.textContent = '';
    heroTitle.style.opacity = '1';
    heroTitle.style.transform = 'none';

    let i = 0;
    function type() {
      if (i <= text.length) {
        heroTitle.textContent = text.slice(0, i);
        i++;
        setTimeout(type, 60);
      }
    }

    // Wait for the fade-in animation before typing
    setTimeout(type, 900);
  }

})();
