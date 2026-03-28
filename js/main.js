/* ============================================================
   Xavier High School — Main JS
   ============================================================ */

// ---------- HERO SLIDESHOW ----------
(function initSlideshow() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots   = document.querySelectorAll('.hero-dot');
  const prev   = document.getElementById('hero-prev');
  const next   = document.getElementById('hero-next');
  if (!slides.length) return;

  let current = 0;
  let timer;

  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), 5500);
  }

  if (prev) prev.addEventListener('click', () => { goTo(current - 1); startTimer(); });
  if (next) next.addEventListener('click', () => { goTo(current + 1); startTimer(); });
  dots.forEach(dot => {
    dot.addEventListener('click', () => { goTo(+dot.dataset.index); startTimer(); });
  });

  startTimer();
})();

// ---------- HEADER SCROLL EFFECT ----------
const header = document.getElementById('site-header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}, { passive: true });

// ---------- MOBILE NAV TOGGLE ----------
const navToggle = document.getElementById('nav-toggle');
const mainNav = document.getElementById('main-nav');

navToggle.addEventListener('click', () => {
  mainNav.classList.toggle('open');
  navToggle.classList.toggle('active');
});

// Mobile dropdown toggles
document.querySelectorAll('.nav-item.has-dropdown > a').forEach(link => {
  link.addEventListener('click', (e) => {
    if (window.innerWidth <= 900) {
      e.preventDefault();
      const parent = link.parentElement;
      parent.classList.toggle('open');
    }
  });
});

// Close nav when clicking outside
document.addEventListener('click', (e) => {
  if (!header.contains(e.target)) {
    mainNav.classList.remove('open');
    navToggle.classList.remove('active');
  }
});

// ---------- ANIMATED COUNTERS ----------
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const counterEls = document.querySelectorAll('.stat-number[data-target]');
let countersStarted = false;

// ---------- INTERSECTION OBSERVER ----------
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Fade in animation
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

// Fade-in targets
document.querySelectorAll(
  '.feature-card, .program-card, .testimonial-card, .news-card, .stat-item, .quick-link-item'
).forEach((el, i) => {
  el.classList.add('fade-in');
  el.style.transitionDelay = `${(i % 3) * 80}ms`;
  observer.observe(el);
});

// Counter observer (fire once when stats section is visible)
const statsSection = document.querySelector('.stats-section');
if (statsSection) {
  const counterObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !countersStarted) {
      countersStarted = true;
      counterEls.forEach(el => animateCounter(el));
      counterObserver.disconnect();
    }
  }, { threshold: 0.4 });
  counterObserver.observe(statsSection);
}

// ---------- ACTIVE NAV LINK ----------
(function setActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-item > a').forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.split('#')[0] === path) {
      link.parentElement.classList.add('active');
    }
  });
})();
