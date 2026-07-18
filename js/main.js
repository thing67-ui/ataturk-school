/* =========================================
   ATATURK GOVERNMENT MODEL HIGH SCHOOL
   Main JavaScript
   ========================================= */

/* ------------------------------------------
   1. LANGUAGE TOGGLE (English <-> Bengali)
   ------------------------------------------ */
let currentLang = 'en';

const langToggleBtn = document.getElementById('langToggle');

function setLanguage(lang) {
  currentLang = lang;

  // Update every element that has data-en and data-bn
  document.querySelectorAll('[data-en]').forEach(el => {
    if (lang === 'bn') {
      el.textContent = el.getAttribute('data-bn');
    } else {
      el.textContent = el.getAttribute('data-en');
    }
  });

  // Update toggle button label
  langToggleBtn.textContent = lang === 'en' ? 'বাংলা' : 'English';

  // Update html lang attribute
  document.documentElement.lang = lang === 'bn' ? 'bn' : 'en';
}

langToggleBtn.addEventListener('click', () => {
  setLanguage(currentLang === 'en' ? 'bn' : 'en');
});


/* ------------------------------------------
   2. NAVBAR — scroll effect + active link
   ------------------------------------------ */
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  // Add scrolled class
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Highlight active nav link
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.style.color = '';
    if (link.getAttribute('href') === '#' + current) {
      link.style.color = 'var(--gold)';
    }
  });
});


/* ------------------------------------------
   3. HAMBURGER MENU
   ------------------------------------------ */
const hamburger = document.getElementById('hamburger');
const navLinksMenu = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinksMenu.classList.toggle('open');
  document.body.style.overflow =
    navLinksMenu.classList.contains('open') ? 'hidden' : '';
});

// Close menu when a link is clicked
navLinksMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinksMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});


/* ------------------------------------------
   4. SMOOTH SCROLL for nav links
   ------------------------------------------ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});


/* ------------------------------------------
   5. SCROLL REVEAL ANIMATION
   ------------------------------------------ */
const revealElements = document.querySelectorAll(
  '.stat-card, .timeline-item, .achievement-card, .alumni-card, ' +
  '.teacher-card, .headmaster-card, .gallery-item, .notice-card, ' +
  '.admission-item, .contact-item, .about-text, .about-stats, ' +
  '.admission-cta, .map-container, .footer-brand, .footer-links, ' +
  '.footer-contact'
);

revealElements.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealElements.forEach(el => revealObserver.observe(el));


/* ------------------------------------------
   6. ANIMATED COUNTERS (About Section)
   ------------------------------------------ */
function animateCounter(el, target, duration = 1800) {
  let start = 0;
  const step = target / (duration / 16);

  const update = () => {
    start += step;
    if (start < target) {
      el.textContent = Math.floor(start).toLocaleString();
      requestAnimationFrame(update);
    } else {
      el.textContent = target.toLocaleString();
    }
  };
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-target'));
      animateCounter(el, target);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number[data-target]').forEach(el => {
  counterObserver.observe(el);
});


/* ------------------------------------------
   7. GALLERY LIGHTBOX
   ------------------------------------------ */
const lightbox      = document.getElementById('lightbox');
const lightboxImg   = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');

document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => {
    const img     = item.querySelector('img');
    const caption = item.getAttribute('data-caption');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = caption || '';
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
});

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}


/* ------------------------------------------
   8. THREE.JS HERO — FLOATING PARTICLES
   ------------------------------------------ */
(function initHero() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene    = new THREE.Scene();
  const camera   = new THREE.PerspectiveCamera(
    75, window.innerWidth / window.innerHeight, 0.1, 1000
  );
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // --- Create particles ---
  const count    = 1800;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const colors    = new Float32Array(count * 3);

  // Color palette: gold, teal, white
  const palette = [
    [1.0, 0.84, 0.0],   // gold
    [0.0, 0.59, 0.65],  // teal
    [1.0, 1.0,  1.0],   // white
    [0.1, 0.14, 0.56],  // blue
  ];

  for (let i = 0; i < count; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 12;

    const col = palette[Math.floor(Math.random() * palette.length)];
    colors[i * 3]     = col[0];
    colors[i * 3 + 1] = col[1];
    colors[i * 3 + 2] = col[2];
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color',    new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.055,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    sizeAttenuation: true,
  });

  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  // --- Mouse parallax ---
  let mouseX = 0;
  let mouseY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth  - 0.5) * 0.6;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 0.4;
  });

  // --- Resize handler ---
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // --- Animation loop ---
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsed = clock.getElapsedTime();

    // Slow rotation
    particles.rotation.y = elapsed * 0.04;
    particles.rotation.x = elapsed * 0.02;

    // Mouse parallax
    particles.rotation.y += (mouseX - particles.rotation.y) * 0.02;
    particles.rotation.x += (mouseY - particles.rotation.x) * 0.02;

    renderer.render(scene, camera);
  }

  animate();
})();


/* ------------------------------------------
   9. NOTICE BOARD — auto date update
   ------------------------------------------ */
// Marks "New" notices dynamically
// (already handled via HTML class="new")


/* ------------------------------------------
   10. FOOTER YEAR — auto update
   ------------------------------------------ */
const yearEls = document.querySelectorAll('.footer-bottom p');
const thisYear = new Date().getFullYear();
yearEls.forEach(el => {
  el.textContent = el.textContent.replace('2026', thisYear);
});