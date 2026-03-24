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

// ── 250K Counter Campaign ──
(function() {
  'use strict';

  // TODO: Replace with real API endpoint once backend is live
  const COUNTER_API = '/api/counter';
  const GOAL = 250000;
  const ANIMATION_DURATION = 2000;
  // Demo value for development — remove when API is connected
  const DEMO_COUNT = 4721;

  const counterValue = document.getElementById('counter-value');
  const counterBar = document.getElementById('counter-bar');
  const counterPercentage = document.getElementById('counter-percentage');
  const counterLabel = document.getElementById('counter-label');

  if (!counterValue || !counterBar || !counterPercentage) return;

  function animateCount(start, end, duration) {
    const startTime = performance.now();
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (end - start) * eased);
      counterValue.textContent = current.toLocaleString('de-DE');
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  function updateCounter(count) {
    const percentage = Math.min((count / GOAL) * 100, 100);
    const remaining = Math.max(GOAL - count, 0);

    // Ab 80%: Countdown-Modus
    if (counterLabel && percentage >= 80 && percentage < 100) {
      animateCount(0, remaining, ANIMATION_DURATION);
      counterLabel.textContent = 'Familien fehlen noch!';
    } else {
      animateCount(0, count, ANIMATION_DURATION);
    }

    // Fortschrittsbalken
    setTimeout(function() {
      counterBar.style.width = percentage + '%';
    }, 100);

    // Prozentzahl
    if (percentage >= 100) {
      counterPercentage.textContent = 'Geschafft! Danke an jede einzelne Familie.';
      counterPercentage.style.fontSize = '1.1rem';
    } else {
      counterPercentage.textContent = Math.floor(percentage) + '% geschafft';
    }

    // Cache für Fallback
    try {
      localStorage.setItem('t4k_counter', JSON.stringify({ count: count, ts: Date.now() }));
    } catch(e) {}
  }

  function fetchCounter() {
    fetch(COUNTER_API)
      .then(function(response) {
        if (!response.ok) throw new Error('API error');
        return response.json();
      })
      .then(function(data) {
        updateCounter(data.count || 0);
      })
      .catch(function() {
        // Fallback: localStorage, dann Demo-Wert
        try {
          var cached = JSON.parse(localStorage.getItem('t4k_counter'));
          if (cached && cached.count) {
            updateCounter(cached.count);
            return;
          }
        } catch(e) {}
        // Demo-Modus: Zeige Demo-Wert bis API steht
        updateCounter(DEMO_COUNT);
      });
  }

  // Counter laden wenn Section sichtbar wird
  var counterObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        fetchCounter();
        counterObserver.disconnect();
      }
    });
  }, { threshold: 0.2 });

  var section = document.querySelector('.counter-campaign');
  if (section) counterObserver.observe(section);

  // Share-Buttons
  var shareWA = document.getElementById('share-whatsapp');
  var shareCopy = document.getElementById('share-copy');
  var shareURL = window.location.origin + '/#250k';
  var shareText = 'Tune4Kids braucht 250.000 Familien, um kindersicheres Musikhören mit Spotify zu ermöglichen. Registriere dich kostenlos: ';

  if (shareWA) {
    shareWA.href = 'https://wa.me/?text=' + encodeURIComponent(shareText + shareURL);
    shareWA.target = '_blank';
    shareWA.rel = 'noopener noreferrer';
  }

  if (shareCopy) {
    shareCopy.addEventListener('click', function() {
      navigator.clipboard.writeText(shareURL).then(function() {
        shareCopy.querySelector('span').textContent = 'Kopiert!';
        setTimeout(function() {
          shareCopy.querySelector('span').textContent = 'Link kopieren';
        }, 2000);
      });
    });
  }
})();
