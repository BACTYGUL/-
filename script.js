/**
 * Portfolio Script — Абдурасулова Бактыгул
 * Smooth scroll, typing effect, reveal animations,
 * skill bar fill, nav highlights, contact form, scroll-to-top
 */

'use strict';

/* =========================================
   LUCIDE ICONS — INIT
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    lucide.createIcons();
  }

  init();
});

function init() {
  setupNav();
  setupTypingEffect();
  setupRevealObserver();
  setupSkillBarsObserver();
  setupScrollTop();
  setupContactForm();
  setupSmoothScroll();
  setupActiveNavLinks();
}

/* =========================================
   NAV — MOBILE TOGGLE & SCROLL STYLE
   ========================================= */
function setupNav() {
  const header    = document.getElementById('header');
  const toggle    = document.getElementById('navToggle');
  const navList   = document.getElementById('navList');
  const navLinks  = document.querySelectorAll('.nav__link');

  if (!header || !toggle || !navList) return;

  /* Toggle hamburger menu */
  toggle.addEventListener('click', () => {
    const isOpen = navList.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  /* Close menu when a nav link is clicked */
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navList.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  /* Close menu on outside click */
  document.addEventListener('click', (e) => {
    if (navList.classList.contains('open') &&
        !navList.contains(e.target) &&
        !toggle.contains(e.target)) {
      navList.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  /* Header background on scroll */
  const handleHeaderScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  };

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll(); // initial call
}

/* =========================================
   ACTIVE NAV LINKS — INTERSECTION OBSERVER
   ========================================= */
function setupActiveNavLinks() {
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav__link');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            const href = link.getAttribute('href');
            link.classList.toggle('active-link', href === `#${id}`);
          });
        }
      });
    },
    {
      threshold: 0.35,
      rootMargin: '-80px 0px -40% 0px',
    }
  );

  sections.forEach(section => observer.observe(section));
}

/* =========================================
   TYPING EFFECT — HERO TITLE
   ========================================= */
function setupTypingEffect() {
  const el = document.getElementById('typedText');
  if (!el) return;

  const phrases = [
    'Developer',
    'UI Designer',
    'React Developer',
    'Problem Solver',
  ];

  let phraseIndex = 0;
  let charIndex   = 0;
  let isDeleting  = false;
  let isPaused    = false;

  const TYPE_SPEED   = 90;
  const DELETE_SPEED = 50;
  const PAUSE_AFTER  = 1800;
  const PAUSE_BEFORE = 400;

  function type() {
    if (isPaused) return;

    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      charIndex--;
      el.textContent = currentPhrase.slice(0, charIndex);

      if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        isPaused = true;
        setTimeout(() => {
          isPaused = false;
          type();
        }, PAUSE_BEFORE);
        return;
      }

      setTimeout(type, DELETE_SPEED);
    } else {
      charIndex++;
      el.textContent = currentPhrase.slice(0, charIndex);

      if (charIndex === currentPhrase.length) {
        isDeleting = true;
        isPaused = true;
        setTimeout(() => {
          isPaused = false;
          type();
        }, PAUSE_AFTER);
        return;
      }

      setTimeout(type, TYPE_SPEED);
    }
  }

  // Small initial delay so page loads first
  setTimeout(type, 800);
}

/* =========================================
   REVEAL ANIMATIONS — INTERSECTION OBSERVER
   ========================================= */
function setupRevealObserver() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target); // animate only once
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  elements.forEach((el, i) => {
    // Stagger siblings that appear at the same time
    const parent = el.parentElement;
    if (parent) {
      const siblings = parent.querySelectorAll('.reveal');
      siblings.forEach((sib, idx) => {
        sib.style.transitionDelay = `${idx * 0.1}s`;
      });
    }
    observer.observe(el);
  });
}

/* =========================================
   SKILL BARS — FILL ON SCROLL INTO VIEW
   ========================================= */
function setupSkillBarsObserver() {
  const bars = document.querySelectorAll('.skill-card__bar-fill');
  if (!bars.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar    = entry.target;
          const width  = bar.dataset.width || '0';
          // Small delay so reveal animation finishes first
          setTimeout(() => {
            bar.style.width = `${width}%`;
          }, 300);
          observer.unobserve(bar);
        }
      });
    },
    { threshold: 0.3 }
  );

  bars.forEach(bar => {
    bar.style.width = '0%'; // ensure reset
    observer.observe(bar);
  });
}

/* =========================================
   SMOOTH SCROLL — ANCHOR LINKS
   ========================================= */
function setupSmoothScroll() {
  // CSS scroll-behavior handles most cases, but this adds extra
  // compatibility and easing control for older browsers.
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href   = anchor.getAttribute('href');
      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const headerH = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--header-h'),
        10
      ) || 72;

      const targetY = target.getBoundingClientRect().top + window.scrollY - headerH;

      window.scrollTo({
        top:      targetY,
        behavior: 'smooth',
      });

      // Update URL without triggering scroll
      history.pushState(null, '', href);
    });
  });
}

/* =========================================
   SCROLL TO TOP BUTTON
   ========================================= */
function setupScrollTop() {
  const btn = document.getElementById('scrollTop');
  if (!btn) return;

  const handleScroll = () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* =========================================
   CONTACT FORM — CLIENT-SIDE VALIDATION
   ========================================= */
function setupContactForm() {
  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');
  if (!form || !note) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nameInput    = form.querySelector('#name');
    const emailInput   = form.querySelector('#email');
    const messageInput = form.querySelector('#message');
    const submitBtn    = form.querySelector('button[type="submit"]');

    // Clear previous note
    note.textContent = '';
    note.className   = 'form-note';

    // Validate
    const errors = validateForm(nameInput.value, emailInput.value, messageInput.value);

    if (errors.length > 0) {
      note.textContent = errors[0];
      note.classList.add('error');
      shakeForm(form);
      return;
    }

    // Simulate sending (replace with actual API call / EmailJS / etc.)
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="spinner" viewBox="0 0 24 24" width="16" height="16" fill="none"
           stroke="currentColor" stroke-width="2.5">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83
                 M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
      </svg>
      Жөнөтүлүүдө...
    `;

    await simulateSend(1400);

    note.textContent = '✓ Кабарыңыз жөнөтүлдү! Жакында байланышам.';
    note.classList.add('success');
    form.reset();

    submitBtn.disabled = false;
    submitBtn.innerHTML = `
      <i data-lucide="send"></i>
      Жиберүү
    `;

    // Re-init lucide icons (new icon was added)
    if (window.lucide) lucide.createIcons();

    // Clear success message after 5s
    setTimeout(() => {
      note.textContent = '';
      note.className   = 'form-note';
    }, 5000);
  });
}

function validateForm(name, email, message) {
  const errors = [];

  if (!name.trim() || name.trim().length < 2) {
    errors.push('Атыңызды туура жазыңыз (кеминде 2 символ).');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.trim() || !emailRegex.test(email)) {
    errors.push('Электрондук почтаны туура форматта жазыңыз.');
  }

  if (!message.trim() || message.trim().length < 10) {
    errors.push('Кабарыңыз өтө кыска (кеминде 10 символ).');
  }

  return errors;
}

function simulateSend(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function shakeForm(form) {
  form.classList.add('shake');
  form.addEventListener('animationend', () => form.classList.remove('shake'), { once: true });
}

/* =========================================
   SPINNER & SHAKE STYLES (injected)
   ========================================= */
(function injectDynamicStyles() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }
    .spinner {
      animation: spin 0.8s linear infinite;
      display: inline-block;
    }
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      15%       { transform: translateX(-6px); }
      30%       { transform: translateX(6px); }
      45%       { transform: translateX(-4px); }
      60%       { transform: translateX(4px); }
      75%       { transform: translateX(-2px); }
      90%       { transform: translateX(2px); }
    }
    .shake {
      animation: shake 0.5s ease;
    }
  `;
  document.head.appendChild(style);
})();

/* =========================================
   CURSOR GLOW EFFECT (subtle, desktop only)
   ========================================= */
(function setupCursorGlow() {
  if (window.matchMedia('(hover: none)').matches) return; // skip touch devices

  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    pointer-events: none;
    width: 320px;
    height: 320px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(230,57,70,0.06) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: left 0.12s ease, top 0.12s ease;
    z-index: 0;
    will-change: left, top;
  `;
  document.body.appendChild(glow);

  document.addEventListener('mousemove', (e) => {
    glow.style.left = `${e.clientX}px`;
    glow.style.top  = `${e.clientY}px`;
  }, { passive: true });
})();
