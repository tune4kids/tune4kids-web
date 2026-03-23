/* ==========================================
   TUNE4KIDS – Main JavaScript
   ========================================== */

// ── Navbar scroll effect ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// ── Mobile burger menu ──
const burger = document.getElementById('burger');
const navLinks = document.querySelector('.navbar__links');

burger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  burger.setAttribute('aria-expanded', navLinks.classList.contains('open'));
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ── Scroll-reveal animation ──
const observerOptions = {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll(
  '.feature-card, .step, .safety-fact, .qr-card, .section-header'
).forEach((el, i) => {
  el.style.setProperty('--delay', `${i * 80}ms`);
  el.classList.add('reveal');
  observer.observe(el);
});

// Inject reveal styles
const style = document.createElement('style');
style.textContent = `
  .reveal {
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 0.5s ease var(--delay, 0ms), transform 0.5s ease var(--delay, 0ms);
  }
  .reveal.visible {
    opacity: 1;
    transform: translateY(0);
  }
`;
document.head.appendChild(style);

// ── Smooth active nav link highlighting ──
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.navbar__links a[href^="#"]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navAnchors.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

// Inject active nav style
const navStyle = document.createElement('style');
navStyle.textContent = `
  .navbar__links a.active:not(.btn) { color: var(--purple) !important; }
`;
document.head.appendChild(navStyle);
