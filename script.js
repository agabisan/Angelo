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

  /* ── Ask Angelo terminal ─────────────────────────────── */
  const terminalForm = $('#terminal-form');
  const terminalInput = $('#terminal-input');
  const terminalOutput = $('#terminal-output');
  const terminalChips = $$('.terminal-chip');

  if (terminalForm && terminalInput && terminalOutput) {
    const knowledgeBase = [
      {
        match: ['experience', 'background', 'career'],
        answer: 'I am a Senior Software Engineer with 10+ years of experience building backend systems, APIs, publishing platforms, e-commerce integrations, and cloud-based applications for international clients.'
      },
      {
        match: ['stack', 'skills', 'tech', 'technology'],
        answer: 'My core stack includes PHP, Laravel, Yii2, ReactJS, Shopify API, GraphQL, AWS, MySQL, Docker, and Git.'
      },
      {
        match: ['current', 'now', 'working', 'role'],
        answer: 'I currently work as a Senior Software Engineer at Stison, contributing to publishing management modules, metadata workflows, ONIX exports, and e-commerce integrations for remote international teams.'
      },
      {
        match: ['project', 'portfolio', 'built'],
        answer: 'Some highlights are a Shopify API integration system, a Rackspace Cloud Files integration, a book publishing management platform, and inventory plus sales reporting systems.'
      },
      {
        match: ['contact', 'email', 'hire', 'reach'],
        answer: 'You can reach me at gabisanangelo@yahoo.com.ph, through GitHub at github.com/gabisan, or by using the LinkedIn link in my contact section.'
      },
      {
        match: ['linkedin', 'profile'],
        answer: 'You can view more of my professional profile on LinkedIn: linkedin.com/in/angelo-gabisan-85973299. This terminal also reflects the experience and skills highlighted there.'
      },
      {
        match: ['help', 'commands'],
        answer: 'Try prompts like: "Tell me about your experience", "What is your tech stack?", "What are you working on now?", or "Show me your LinkedIn profile".'
      }
    ];

    function appendTerminalLine(text, className) {
      const line = document.createElement('p');
      line.className = `terminal-line ${className}`.trim();
      line.textContent = text;
      terminalOutput.appendChild(line);
      terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }

    function getTerminalAnswer(prompt) {
      const query = prompt.trim().toLowerCase();
      const entry = knowledgeBase.find(item => item.match.some(keyword => query.includes(keyword)));

      if (entry) return entry.answer;

      return 'I can answer questions about my experience, tech stack, projects, contact details, and LinkedIn profile. Try one of the quick prompts above.';
    }

    function runPrompt(prompt) {
      const cleanedPrompt = prompt.trim();
      if (!cleanedPrompt) return;

      appendTerminalLine(`$ ${cleanedPrompt}`);
      appendTerminalLine(getTerminalAnswer(cleanedPrompt), 'terminal-response');
      terminalInput.value = '';
    }

    terminalForm.addEventListener('submit', (event) => {
      event.preventDefault();
      runPrompt(terminalInput.value);
    });

    terminalChips.forEach((chip) => {
      chip.addEventListener('click', () => {
        const prompt = chip.getAttribute('data-prompt') || '';
        terminalInput.value = prompt;
        runPrompt(prompt);
      });
    });
  }

})();
