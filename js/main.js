/* =========================================
   ATATURK GOVERNMENT MODEL HIGH SCHOOL
   Main JavaScript — v2 Full Animations
   ========================================= */

/* ------------------------------------------
   1. LANGUAGE TOGGLE
   ------------------------------------------ */
let currentLang = 'en';
const langToggleBtn = document.getElementById('langToggle');

function setLanguage(lang) {
  currentLang = lang;
  document.querySelectorAll('[data-en]').forEach(el => {
    el.textContent = lang === 'bn'
      ? el.getAttribute('data-bn')
      : el.getAttribute('data-en');
  });
  langToggleBtn.textContent = lang === 'en' ? 'বাংলা' : 'English';
  document.documentElement.lang = lang === 'bn' ? 'bn' : 'en';
}

langToggleBtn.addEventListener('click', () => {
  setLanguage(currentLang === 'en' ? 'bn' : 'en');
});

/* ------------------------------------------
   2. NAVBAR
   ------------------------------------------ */
const navbar = document.getElementById('navbar');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 100) {
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

navLinksMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinksMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ------------------------------------------
   4. SMOOTH SCROLL
   ------------------------------------------ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - 80,
        behavior: 'smooth'
      });
    }
  });
});

/* ------------------------------------------
   5. ANIMATED COUNTERS
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
      animateCounter(el, parseInt(el.getAttribute('data-target')));
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number[data-target]').forEach(el => {
  counterObserver.observe(el);
});

/* ------------------------------------------
   6. GALLERY LIGHTBOX
   ------------------------------------------ */
const lightbox       = document.getElementById('lightbox');
const lightboxImg    = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose  = document.getElementById('lightboxClose');

document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = item.getAttribute('data-caption') || '';
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
});

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

/* ------------------------------------------
   7. THREE.JS HERO PARTICLES
   ------------------------------------------ */
(function initHero() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene    = new THREE.Scene();
  const camera   = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const count     = 1800;
  const geometry  = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const colors    = new Float32Array(count * 3);
  const palette   = [
    [1.0, 0.84, 0.0],
    [0.0, 0.59, 0.65],
    [1.0, 1.0,  1.0],
    [0.1, 0.14, 0.56],
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

  const material  = new THREE.PointsMaterial({ size: 0.055, vertexColors: true, transparent: true, opacity: 0.85 });
  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  let mouseX = 0, mouseY = 0;
  window.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth  - 0.5) * 0.6;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 0.4;
  });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const elapsed = clock.getElapsedTime();
    particles.rotation.y = elapsed * 0.04;
    particles.rotation.x = elapsed * 0.02;
    particles.rotation.y += (mouseX - particles.rotation.y) * 0.02;
    particles.rotation.x += (mouseY - particles.rotation.x) * 0.02;
    renderer.render(scene, camera);
  }
  animate();
})();

/* ------------------------------------------
   8. FOOTER YEAR
   ------------------------------------------ */
document.querySelectorAll('.footer-bottom p').forEach(el => {
  el.textContent = el.textContent.replace('2026', new Date().getFullYear());
});


/* ==========================================
   9. SECTION BACKGROUND ANIMATIONS
   ========================================== */

   
   /* --- ABOUT: Welcoming — deep aurora with visible beams --- */
(function aboutBg() {
  const section = document.querySelector('.about-section');
  if (!section) return;
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:0;';
  section.style.position = 'relative';
  section.style.overflow = 'hidden';
  section.insertBefore(canvas, section.firstChild);
  const ctx = canvas.getContext('2d');

  function draw() {
    canvas.width  = section.offsetWidth;
    canvas.height = section.offsetHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const t = Date.now() / 1500;

    // Deeper ash-blue base
    const bg = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    bg.addColorStop(0, 'rgba(180,200,220,0.75)');
    bg.addColorStop(0.5, 'rgba(160,185,210,0.65)');
    bg.addColorStop(1, 'rgba(175,205,215,0.75)');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Strong visible light beams
    for (let i = 0; i < 10; i++) {
      const x     = (canvas.width / 10) * i + Math.sin(t + i * 0.7) * 40;
      const alpha = 0.18 + 0.14 * Math.abs(Math.sin(t * 1.2 + i));
      const g     = ctx.createLinearGradient(x, canvas.height, x + 50, 0);
      g.addColorStop(0, `rgba(0,120,150,${alpha})`);
      g.addColorStop(0.4, `rgba(255,214,0,${alpha * 0.7})`);
      g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.beginPath();
      ctx.moveTo(x - 25, canvas.height);
      ctx.lineTo(x + 25, canvas.height);
      ctx.lineTo(x + 70, 0);
      ctx.lineTo(x + 20, 0);
      ctx.closePath();
      ctx.fillStyle = g;
      ctx.fill();
    }

    // Bold glowing orbs
    const orbs = [
      { x: canvas.width * 0.12, y: canvas.height * 0.35, r: 200, h: 195 },
      { x: canvas.width * 0.82, y: canvas.height * 0.55, r: 240, h: 150 },
      { x: canvas.width * 0.48, y: canvas.height * 0.12, r: 170, h: 220 },
      { x: canvas.width * 0.65, y: canvas.height * 0.8,  r: 160, h: 40  },
    ];
    orbs.forEach((o, i) => {
      const px = o.x + Math.sin(t * 0.6 + i) * 30;
      const py = o.y + Math.cos(t * 0.45 + i) * 25;
      const g  = ctx.createRadialGradient(px, py, 0, px, py, o.r);
      g.addColorStop(0, `hsla(${o.h},85%,50%,0.38)`);
      g.addColorStop(0.5,`hsla(${o.h},85%,60%,0.18)`);
      g.addColorStop(1, `hsla(${o.h},85%,60%,0)`);
      ctx.beginPath();
      ctx.arc(px, py, o.r, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
    });

    // Floating sparkle dots
    for (let i = 0; i < 18; i++) {
      const x = canvas.width  * ((i * 0.07 + Math.sin(t * 0.4 + i) * 0.08 + 1) % 1);
      const y = canvas.height * ((i * 0.11 + Math.cos(t * 0.3 + i) * 0.06 + 1) % 1);
      const a = 0.4 + 0.4 * Math.abs(Math.sin(t * 1.5 + i));
      ctx.beginPath();
      ctx.arc(x, y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,214,0,${a})`;
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

/* --- HISTORY: Intense — cinematic dark storm --- */
(function historyBg() {
  const section = document.querySelector('.history-section');
  if (!section) return;
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:0;';
  section.style.position = 'relative';
  section.style.overflow = 'hidden';
  section.insertBefore(canvas, section.firstChild);
  const ctx = canvas.getContext('2d');

  // Smoke particles
  const smokes = Array.from({ length: 20 }, () => ({
    x:     Math.random() * window.innerWidth,
    y:     Math.random() * 800 + 200,
    r:     40 + Math.random() * 80,
    vx:    (Math.random() - 0.5) * 0.4,
    vy:   -0.3 - Math.random() * 0.5,
    life:  Math.random(),
    speed: 0.003 + Math.random() * 0.004,
  }));

  // Lightning bolts
  const lightnings = [];
  let lTimer = 0;

  function makeLightning() {
    const x = 80 + Math.random() * (canvas.width - 160);
    const segs = [];
    let cx = x, cy = 0;
    while (cy < canvas.height * 0.7) {
      cx += (Math.random() - 0.5) * 100;
      cy += 25 + Math.random() * 45;
      segs.push({ x: cx, y: cy });
      // Branch
      if (Math.random() > 0.65 && segs.length > 2) {
        let bx = cx, by = cy;
        const branch = [];
        for (let b = 0; b < 3; b++) {
          bx += (Math.random() - 0.5) * 70;
          by += 20 + Math.random() * 30;
          branch.push({ x: bx, y: by });
        }
        lightnings.push({ x, segs: branch, life: 0.7, branch: true });
      }
    }
    lightnings.push({ x, segs, life: 1.0, branch: false });
  }

  function draw() {
    canvas.width  = section.offsetWidth;
    canvas.height = section.offsetHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const t = Date.now() / 1000;

    // Deep stormy base
    const bg = ctx.createLinearGradient(0, 0, 0, canvas.height);
    bg.addColorStop(0, 'rgba(8,15,30,0.18)');
    bg.addColorStop(0.5, 'rgba(15,20,50,0.14)');
    bg.addColorStop(1, 'rgba(10,20,40,0.1)');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Smoke clouds
    smokes.forEach(s => {
      s.x    += s.vx;
      s.y    += s.vy;
      s.life += s.speed;
      s.r    += 0.15;
      if (s.life > 1) {
        s.life = 0;
        s.x    = Math.random() * canvas.width;
        s.y    = canvas.height + 50;
        s.r    = 40 + Math.random() * 60;
      }
      const alpha = Math.sin(s.life * Math.PI) * 0.1;
      const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r);
      g.addColorStop(0, `rgba(30,40,80,${alpha})`);
      g.addColorStop(1, 'rgba(30,40,80,0)');
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
    });

    // Dramatic scanning light sweep
    const sweepX = ((Math.sin(t * 0.4) + 1) / 2) * canvas.width;
    const sweep  = ctx.createRadialGradient(sweepX, 0, 0, sweepX, 0, canvas.height * 0.9);
    sweep.addColorStop(0, 'rgba(255,214,0,0.07)');
    sweep.addColorStop(0.4, 'rgba(26,35,126,0.04)');
    sweep.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = sweep;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Lightning
    lTimer++;
    if (lTimer % 90 === 0 || lTimer % 97 === 0) makeLightning();
    for (let i = lightnings.length - 1; i >= 0; i--) {
      const bolt = lightnings[i];
      bolt.life -= 0.05;
      if (bolt.life <= 0) { lightnings.splice(i, 1); continue; }
      // Glow
      ctx.shadowColor = bolt.branch ? 'rgba(180,220,255,0.9)' : 'rgba(255,230,100,0.95)';
      ctx.shadowBlur  = bolt.branch ? 12 : 25;
      ctx.strokeStyle = bolt.branch
        ? `rgba(180,220,255,${bolt.life * 0.7})`
        : `rgba(255,240,150,${bolt.life})`;
      ctx.lineWidth   = bolt.branch ? 1.5 * bolt.life : 3 * bolt.life;
      ctx.beginPath();
      ctx.moveTo(bolt.x, 0);
      bolt.segs.forEach(s => ctx.lineTo(s.x, s.y));
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Flash on main bolt
      if (!bolt.branch && bolt.life > 0.7) {
        ctx.fillStyle = `rgba(255,255,220,${(bolt.life - 0.7) * 0.08})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }

    // Floating embers
    for (let i = 0; i < 12; i++) {
      const ex = canvas.width  * ((i * 0.09 + t * 0.02 + Math.sin(t + i) * 0.05) % 1);
      const ey = canvas.height * ((1 - (t * 0.04 + i * 0.08) % 1));
      const ea = 0.3 + 0.4 * Math.abs(Math.sin(t * 2 + i));
      ctx.beginPath();
      ctx.arc(ex, ey, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,180,50,${ea})`;
      ctx.shadowColor = 'rgba(255,150,0,0.8)';
      ctx.shadowBlur  = 8;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

/* --- ACHIEVEMENTS: Inspirational — gorgeous fireworks --- */
(function achievementsBg() {
  const section = document.querySelector('.achievements-section');
  if (!section) return;
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:0;';
  section.style.position = 'relative';
  section.style.overflow = 'hidden';
  section.insertBefore(canvas, section.firstChild);
  const ctx = canvas.getContext('2d');

  const fireworks = [];
  const particles = [];
  let fwTimer = 0;

  function launchFirework() {
    const x      = 80 + Math.random() * (canvas.width - 160);
    const targetY = 60 + Math.random() * (canvas.height * 0.55);
    fireworks.push({ x, y: canvas.height, targetY, speed: 6 + Math.random() * 4 });
  }

  function explode(x, y) {
    const palettes = [
      ['#FFD600','#FFAB40','#FFF176','#FF6F00','#ffffff'],
      ['#00E5FF','#18FFFF','#80DEEA','#ffffff','#B3E5FC'],
      ['#FF4081','#F50057','#FF80AB','#ffffff','#FCE4EC'],
      ['#69F0AE','#00E676','#B9F6CA','#ffffff','#CCFF90'],
      ['#E040FB','#EA80FC','#CE93D8','#ffffff','#F3E5F5'],
    ];
    const colors = palettes[Math.floor(Math.random() * palettes.length)];
    const count  = 90 + Math.floor(Math.random() * 40);

    for (let i = 0; i < count; i++) {
      const angle  = (Math.PI * 2 / count) * i + Math.random() * 0.2;
      const speed  = 2 + Math.random() * 5;
      const length = 3 + Math.random() * 5;
      particles.push({
        x, y,
        vx:    Math.cos(angle) * speed,
        vy:    Math.sin(angle) * speed,
        length,
        life:  1.0,
        decay: 0.008 + Math.random() * 0.012,
        color: colors[Math.floor(Math.random() * colors.length)],
        trail: [],
        twinkle: Math.random() > 0.5,
      });
    }

    // Sparkle ring
    for (let i = 0; i < 20; i++) {
      const angle = (Math.PI * 2 / 20) * i;
      particles.push({
        x: x + Math.cos(angle) * 8,
        y: y + Math.sin(angle) * 8,
        vx: Math.cos(angle) * 1.2,
        vy: Math.sin(angle) * 1.2,
        length: 2,
        life: 0.8,
        decay: 0.02,
        color: '#ffffff',
        trail: [],
        twinkle: true,
      });
    }
  }

  // Rising stars
  const stars = Array.from({ length: 40 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * 800 + 800,
    r: 1 + Math.random() * 2,
    speed: 0.4 + Math.random() * 1,
    opacity: 0.3 + Math.random() * 0.5,
  }));

  function draw() {
    canvas.width  = section.offsetWidth;
    canvas.height = section.offsetHeight;

    // Fade trail
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Rising stars
    stars.forEach(s => {
      s.y -= s.speed;
      if (s.y < -10) { s.y = canvas.height + 10; s.x = Math.random() * canvas.width; }
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,214,0,${s.opacity})`;
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(s.x, s.y + s.speed * 12);
      ctx.strokeStyle = `rgba(255,214,0,${s.opacity * 0.2})`;
      ctx.lineWidth   = s.r * 0.6;
      ctx.stroke();
    });

    // Launch fireworks
    fwTimer++;
    if (fwTimer % 100 === 0) launchFirework();
    if (fwTimer % 130 === 0) launchFirework();
    if (fwTimer % 160 === 0) launchFirework();

    // Draw firework rockets
    for (let i = fireworks.length - 1; i >= 0; i--) {
      const fw = fireworks[i];
      fw.y -= fw.speed;

      // Rocket trail
      ctx.beginPath();
      ctx.moveTo(fw.x, fw.y);
      ctx.lineTo(fw.x, fw.y + 20);
      const rg = ctx.createLinearGradient(fw.x, fw.y, fw.x, fw.y + 20);
      rg.addColorStop(0, 'rgba(255,200,50,0.9)');
      rg.addColorStop(1, 'rgba(255,100,0,0)');
      ctx.strokeStyle = rg;
      ctx.lineWidth   = 3;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(fw.x, fw.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      if (fw.y <= fw.targetY) {
        explode(fw.x, fw.y);
        fireworks.splice(i, 1);
      }
    }

    // Draw burst particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.trail.push({ x: p.x, y: p.y });
      if (p.trail.length > 6) p.trail.shift();
      p.x    += p.vx;
      p.y    += p.vy;
      p.vy   += 0.08;
      p.vx   *= 0.98;
      p.life -= p.decay;
      if (p.life <= 0) { particles.splice(i, 1); continue; }

      // Draw trail
      if (p.trail.length > 1) {
        ctx.beginPath();
        ctx.moveTo(p.trail[0].x, p.trail[0].y);
        p.trail.forEach(pt => ctx.lineTo(pt.x, pt.y));
        ctx.strokeStyle = p.color.replace(')', `,${p.life * 0.4})`).replace('rgb', 'rgba').replace('##', '#');
        ctx.lineWidth   = p.length * p.life * 0.5;
        ctx.stroke();
      }

      // Twinkle star shape
      if (p.twinkle && p.life > 0.3) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.globalAlpha = p.life;
        ctx.strokeStyle = p.color;
        ctx.lineWidth   = 1.5;
        ctx.shadowColor = p.color;
        ctx.shadowBlur  = 8;
        for (let j = 0; j < 4; j++) {
          ctx.beginPath();
          ctx.moveTo(-p.length * 1.5, 0);
          ctx.lineTo(p.length * 1.5, 0);
          ctx.stroke();
          ctx.rotate(Math.PI / 4);
        }
        ctx.restore();
      } else {
        ctx.globalAlpha = p.life;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.length * p.life, 0, Math.PI * 2);
        ctx.fillStyle   = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur  = 6;
        ctx.fill();
        ctx.shadowBlur  = 0;
      }
      ctx.globalAlpha = 1;
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

/* --- TEACHERS: Motivating — power surge network --- */
(function teachersBg() {
  const section = document.querySelector('.teachers-section');
  if (!section) return;
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:0;';
  section.style.position = 'relative';
  section.style.overflow = 'hidden';
  section.insertBefore(canvas, section.firstChild);
  const ctx = canvas.getContext('2d');

  // Network nodes
  const nodes = Array.from({ length: 28 }, () => ({
    x:   Math.random() * window.innerWidth,
    y:   Math.random() * 800,
    vx:  (Math.random() - 0.5) * 0.7,
    vy:  (Math.random() - 0.5) * 0.5,
    r:   3 + Math.random() * 4,
    pulse: Math.random() * Math.PI * 2,
  }));

  // Energy bursts
  const bursts = [];
  let bTimer = 0;

  function addBurst() {
    const node = nodes[Math.floor(Math.random() * nodes.length)];
    bursts.push({ x: node.x, y: node.y, r: 0, maxR: 80 + Math.random() * 60, life: 1.0 });
  }

  function draw() {
    canvas.width  = section.offsetWidth;
    canvas.height = section.offsetHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const t = Date.now() / 1000;

    // Motivating gradient base
    const bg = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    bg.addColorStop(0, 'rgba(200,215,230,0.55)');
    bg.addColorStop(0.5,'rgba(210,225,235,0.45)');
    bg.addColorStop(1, 'rgba(195,215,225,0.55)');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Move nodes
    nodes.forEach(n => {
      n.x += n.vx; n.y += n.vy;
      n.pulse += 0.04;
      if (n.x < 0 || n.x > canvas.width)  n.vx *= -1;
      if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
    });

    // Draw connections
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx   = nodes[j].x - nodes[i].x;
        const dy   = nodes[j].y - nodes[i].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 160) {
          const alpha = (1 - dist / 160) * 0.45;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(0,120,150,${alpha})`;
          ctx.lineWidth   = 1.5 * (1 - dist / 160);
          ctx.stroke();

          // Energy pulse travelling along line
          const prog = (t * 0.8 + i * 0.3) % 1;
          const px   = nodes[i].x + dx * prog;
          const py   = nodes[i].y + dy * prog;
          if (dist < 120) {
            ctx.beginPath();
            ctx.arc(px, py, 2.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,214,0,${alpha * 1.8})`;
            ctx.fill();
          }
        }
      }
    }

    // Draw nodes
    nodes.forEach(n => {
      const pulse = 0.6 + 0.4 * Math.sin(n.pulse);
      // Glow
      const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 4);
      g.addColorStop(0, `rgba(0,151,167,${0.35 * pulse})`);
      g.addColorStop(1, 'rgba(0,151,167,0)');
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r * 4, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
      // Core
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r * pulse, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,151,167,0.85)`;
      ctx.shadowColor = '#0097A7';
      ctx.shadowBlur  = 10;
      ctx.fill();
      ctx.shadowBlur  = 0;
    });

    // Energy burst rings
    bTimer++;
    if (bTimer % 70 === 0) addBurst();
    for (let i = bursts.length - 1; i >= 0; i--) {
      const b = bursts[i];
      b.r    += 4;
      b.life -= 0.025;
      if (b.life <= 0) { bursts.splice(i, 1); continue; }
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255,214,0,${b.life * 0.7})`;
      ctx.lineWidth   = 3 * b.life;
      ctx.shadowColor = 'rgba(255,214,0,0.6)';
      ctx.shadowBlur  = 12;
      ctx.stroke();
      ctx.shadowBlur  = 0;
    }

    // Moving wave lines
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      for (let x = 0; x <= canvas.width; x += 8) {
        const y = canvas.height * (0.15 + i * 0.18) +
                  Math.sin((x / canvas.width) * Math.PI * 5 + t * 2.5 + i * 0.8) * 22;
        i === 0 && x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `rgba(0,151,167,${0.1 + i * 0.03})`;
      ctx.lineWidth   = 2;
      ctx.stroke();
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

/* --- GALLERY: Inspirational — aurora + floating color orbs --- */
(function galleryBg() {
  const section = document.querySelector('.gallery-section');
  if (!section) return;
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:0;';
  section.style.position = 'relative';
  section.style.overflow = 'hidden';
  section.insertBefore(canvas, section.firstChild);
  const ctx = canvas.getContext('2d');

  const orbs = Array.from({ length: 10 }, (_, i) => ({
    x:   Math.random() * window.innerWidth,
    y:   Math.random() * 800,
    r:   60 + Math.random() * 100,
    vx:  (Math.random() - 0.5) * 0.6,
    vy:  (Math.random() - 0.5) * 0.4,
    hue: 160 + i * 20,
  }));

  function draw() {
    canvas.width  = section.offsetWidth;
    canvas.height = section.offsetHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const t = Date.now() / 2000;

    // Aurora wave bands
    for (let i = 0; i < 7; i++) {
      const x1  = canvas.width  * (0.03 + 0.15 * i + 0.04 * Math.sin(t * 1.1 + i * 1.3));
      const y1  = canvas.height * (0.15  + 0.08 * Math.sin(t * 1.3 + i));
      const x2  = canvas.width  * (0.18  + 0.15 * i + 0.04 * Math.cos(t * 0.9 + i * 1.3));
      const y2  = canvas.height * (0.85  + 0.08 * Math.cos(t * 1.0 + i));
      const hue = 155 + i * 25;
      const g   = ctx.createLinearGradient(x1, y1, x2, y2);
      g.addColorStop(0, `hsla(${hue},95%,58%,0.22)`);
      g.addColorStop(0.4,`hsla(${hue+25},95%,65%,0.14)`);
      g.addColorStop(1, `hsla(${hue+55},95%,58%,0)`);
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.bezierCurveTo(
        x1 + 140 * Math.sin(t * 1.3 + i), y1 + 100 * Math.cos(t + i),
        x2 - 140 * Math.cos(t * 0.9 + i), y2 - 100 * Math.sin(t + i),
        x2, y2
      );
      ctx.lineWidth   = 90 + 35 * Math.sin(t * 0.8 + i);
      ctx.strokeStyle = g;
      ctx.stroke();
    }

    // Floating color orbs
    orbs.forEach(o => {
      o.x += o.vx; o.y += o.vy;
      if (o.x < -o.r) o.x = canvas.width  + o.r;
      if (o.x > canvas.width  + o.r) o.x = -o.r;
      if (o.y < -o.r) o.y = canvas.height + o.r;
      if (o.y > canvas.height + o.r) o.y = -o.r;
      const g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
      g.addColorStop(0, `hsla(${o.hue},90%,60%,0.28)`);
      g.addColorStop(1, `hsla(${o.hue},90%,60%,0)`);
      ctx.beginPath();
      ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
    });

    // Sparkle dots floating up
    for (let i = 0; i < 15; i++) {
      const x = canvas.width  * ((i * 0.068 + t * 0.015 + Math.sin(t + i) * 0.04) % 1);
      const y = canvas.height * ((1 - (t * 0.03 + i * 0.07) % 1));
      const a = 0.4 + 0.4 * Math.abs(Math.sin(t * 2 + i));
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${180 + i * 12},90%,65%,${a})`;
      ctx.shadowColor = `hsla(${180 + i * 12},90%,65%,0.8)`;
      ctx.shadowBlur  = 8;
      ctx.fill();
      ctx.shadowBlur  = 0;
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

/* --- ADMISSION: Welcoming — festive confetti + sparkles --- */
(function admissionBg() {
  const section = document.querySelector('.admission-section');
  if (!section) return;
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:0;';
  section.style.position = 'relative';
  section.style.overflow = 'hidden';
  section.insertBefore(canvas, section.firstChild);
  const ctx = canvas.getContext('2d');

  const pieces = Array.from({ length: 60 }, () => ({
    x:     Math.random() * window.innerWidth,
    y:     Math.random() * -800,
    w:     7 + Math.random() * 10,
    h:     12 + Math.random() * 8,
    speed: 0.8 + Math.random() * 1.8,
    angle: Math.random() * Math.PI * 2,
    spin:  (Math.random() - 0.5) * 0.08,
    color: ['#FFD600','#0097A7','#1A237E','#2E7D32','#E65100','#ffffff','#FF4081'][
      Math.floor(Math.random() * 7)
    ],
    shape: Math.random() > 0.5 ? 'rect' : 'circle',
  }));

  const sparkles = Array.from({ length: 25 }, () => ({
    x:     Math.random() * window.innerWidth,
    y:     Math.random() * 800,
    r:     2 + Math.random() * 4,
    life:  Math.random(),
    speed: 0.02 + Math.random() * 0.03,
  }));

  function draw() {
    canvas.width  = section.offsetWidth;
    canvas.height = section.offsetHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Welcoming warm base gradient
    const bg = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    bg.addColorStop(0, 'rgba(255,253,231,0.5)');
    bg.addColorStop(1, 'rgba(224,247,250,0.4)');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Confetti
    pieces.forEach(p => {
      p.y     += p.speed;
      p.angle += p.spin;
      p.x     += Math.sin(p.angle * 0.5) * 0.5;
      if (p.y > canvas.height + 20) {
        p.y = -20;
        p.x = Math.random() * canvas.width;
      }
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = 0.75;
      if (p.shape === 'rect') {
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });

    // Sparkles
    ctx.globalAlpha = 1;
    sparkles.forEach(s => {
      s.life += s.speed;
      if (s.life > 1) { s.life = 0; s.x = Math.random() * canvas.width; s.y = Math.random() * canvas.height; }
      const alpha = Math.sin(s.life * Math.PI);
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r * alpha, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,214,0,${alpha * 0.8})`;
      ctx.fill();

      // Star shape
      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.globalAlpha = alpha * 0.6;
      ctx.strokeStyle = '#FFD600';
      ctx.lineWidth   = 1.5;
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(-s.r * 2 * alpha, 0);
        ctx.lineTo(s.r * 2 * alpha, 0);
        ctx.stroke();
        ctx.rotate(Math.PI / 4);
      }
      ctx.restore();
    });
    requestAnimationFrame(draw);
  }
  draw();
})();




/* ==========================================
   10. SCROLL ANIMATIONS — slide, draw, bounce
   ========================================== */

// Add animation classes to elements
function setupScrollAnimations() {

  // ABOUT — slide in left/right (welcoming)
  document.querySelectorAll('.about-text').forEach(el => {
    el.classList.add('anim-slide-left');
  });
  document.querySelectorAll('.about-stats').forEach(el => {
    el.classList.add('anim-slide-right');
  });

  // HISTORY — draw border + slide (intense)
  document.querySelectorAll('.timeline-item').forEach((el, i) => {
    el.classList.add(i % 2 === 0 ? 'anim-slide-left' : 'anim-slide-right');
    el.classList.add('anim-draw-border');
  });

  // ACHIEVEMENTS — bounce in (inspirational)
  document.querySelectorAll('.achievement-card').forEach((el, i) => {
    el.classList.add('anim-bounce');
    el.style.animationDelay = `${i * 0.1}s`;
  });
  document.querySelectorAll('.alumni-card').forEach((el, i) => {
    el.classList.add('anim-bounce');
    el.style.animationDelay = `${i * 0.12}s`;
  });

  // TEACHERS — bounce + draw border (motivating)
  document.querySelectorAll('.teacher-card').forEach((el, i) => {
    el.classList.add('anim-bounce');
    el.classList.add('anim-draw-border');
    el.style.animationDelay = `${i * 0.06}s`;
  });
  document.querySelectorAll('.headmaster-card').forEach(el => {
    el.classList.add('anim-slide-left');
  });

  // GALLERY — slide in (inspirational)
  document.querySelectorAll('.gallery-box').forEach((el, i) => {
    el.classList.add(i % 2 === 0 ? 'anim-slide-left' : 'anim-slide-right');
  });

  // NOTICES — bounce in
  document.querySelectorAll('.notice-card').forEach((el, i) => {
    el.classList.add('anim-bounce');
    el.style.animationDelay = `${i * 0.1}s`;
  });

  // ADMISSION — slide in (welcoming)
  document.querySelectorAll('.admission-item').forEach((el, i) => {
    el.classList.add('anim-slide-left');
    el.style.transitionDelay = `${i * 0.1}s`;
  });
  document.querySelectorAll('.admission-cta').forEach(el => {
    el.classList.add('anim-slide-right');
  });

  // CONTACT PAGE 1 — contact items fly in + map zoom in
  document.querySelectorAll('.contact-item').forEach((el, i) => {
    el.classList.add('anim-contact-item');
    el.style.transitionDelay = `${i * 0.15}s`;
  });
  document.querySelectorAll('.map-container').forEach(el => {
    el.classList.add('anim-map-enter');
  });
  document.querySelectorAll('.contact-grid').forEach(el => {
    el.classList.add('anim-contact-grid');
  });

  // FOOTER PAGE 2 — footer blocks drop in
  document.querySelectorAll('.footer-brand').forEach(el => {
    el.classList.add('anim-footer-drop');
    el.style.transitionDelay = '0s';
  });
  document.querySelectorAll('.footer-links').forEach(el => {
    el.classList.add('anim-footer-drop');
    el.style.transitionDelay = '0.15s';
  });
  document.querySelectorAll('.footer-contact').forEach(el => {
    el.classList.add('anim-footer-drop');
    el.style.transitionDelay = '0.3s';
  });
  document.querySelectorAll('.footer-bottom').forEach(el => {
    el.classList.add('anim-footer-rise');
  });

  // STAT CARDS
  document.querySelectorAll('.stat-card').forEach((el, i) => {
    el.classList.add('anim-bounce');
    el.style.animationDelay = `${i * 0.12}s`;
  });
}

// Intersection Observer to trigger animations
const animObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('anim-visible');
      animObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

function observeAnimations() {
  document.querySelectorAll(
    '.anim-slide-left, .anim-slide-right, .anim-bounce, .anim-draw-border, ' +
    '.anim-contact-item, .anim-map-enter, .anim-footer-drop, .anim-footer-rise'
  ).forEach(el => animObserver.observe(el));
}

setupScrollAnimations();
observeAnimations();


/* ==========================================
   11. TYPEWRITER for section headings
   ========================================== */
function typeWriter(el, text, speed = 45) {
  el.textContent = '';
  let i = 0;
  const type = () => {
    if (i < text.length) {
      el.textContent += text[i++];
      setTimeout(type, speed);
    }
  };
  type();
}

const typeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el   = entry.target;
      const text = el.getAttribute('data-en') || el.textContent;
      typeWriter(el, text);
      typeObserver.unobserve(el);
    }
  });
}, { threshold: 0.6 });

document.querySelectorAll('.section-header h2').forEach(el => {
  typeObserver.observe(el);
});