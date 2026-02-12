/* ╔══════════════════════════════════════════════════╗
   ║  Valentine Proposal for Ama — script.js          ║
   ║  Interactions, animations, music, notifications   ║
   ╚══════════════════════════════════════════════════╝ */

// ── CONFIG ──
const CONFIG = {
  // Web3Forms access key — sends you an email when she clicks Yes/No
  web3formsKey: '52033bd9-63bc-40e7-8569-fcbb69e440a4',

  // Love timer start date
  loveStartDate: new Date('2024-08-14T00:00:00'),

  // Typewriter love letter text
  loveLetter: `Ama, from the very first moment I knew you were special.\n\nYou spend your days saving lives, caring for strangers, giving your heart to everyone who needs it — and somehow, you still have enough love left to cross every mile between us and reach me.\n\nI don't know what I did to deserve you, but I thank God for you every single day.\n\nThis is for you, my love...`,

  // Typewriter speed (ms per character)
  typeSpeed: 45,
};


/* ═══════════════════════════════════════════════════
   1. SPLASH SCREEN → Start Experience
   ═══════════════════════════════════════════════════ */
const splash    = document.getElementById('splash');
const mainEl    = document.getElementById('main-content');
const bgMusic   = document.getElementById('bg-music');
const musicBtn  = document.getElementById('music-toggle');

let musicPlaying = false;

splash.addEventListener('click', () => {
  splash.classList.add('fade-out');
  mainEl.classList.remove('hidden');

  // Start music
  bgMusic.volume = 0.5;
  bgMusic.play().then(() => {
    musicPlaying = true;
    musicBtn.classList.add('playing');
  }).catch(() => {
    // Autoplay blocked — user can tap the music button
  });

  // Trigger scroll reveals after a short delay
  setTimeout(() => {
    initRevealObserver();
    startLoveTimer();
    startTypewriter();
    spawnFloatingHearts();
  }, 400);
});


/* ═══════════════════════════════════════════════════
   2. MUSIC TOGGLE
   ═══════════════════════════════════════════════════ */
musicBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  if (musicPlaying) {
    bgMusic.pause();
    musicBtn.classList.remove('playing');
  } else {
    bgMusic.play();
    musicBtn.classList.add('playing');
  }
  musicPlaying = !musicPlaying;
});


/* ═══════════════════════════════════════════════════
   3. TYPEWRITER EFFECT
   ═══════════════════════════════════════════════════ */
function startTypewriter() {
  const el = document.getElementById('typewriter');
  const text = CONFIG.loveLetter;
  let i = 0;

  // Add cursor
  const cursor = document.createElement('span');
  cursor.classList.add('cursor');
  el.appendChild(cursor);

  function type() {
    if (i < text.length) {
      const char = text.charAt(i);
      if (char === '\n') {
        el.insertBefore(document.createElement('br'), cursor);
      } else {
        el.insertBefore(document.createTextNode(char), cursor);
      }
      i++;
      setTimeout(type, CONFIG.typeSpeed);
    } else {
      // Remove cursor after a pause
      setTimeout(() => cursor.remove(), 2000);
    }
  }

  // Small delay so it feels intentional
  setTimeout(type, 800);
}


/* ═══════════════════════════════════════════════════
   4. SCROLL REVEAL (IntersectionObserver)
   ═══════════════════════════════════════════════════ */
function initRevealObserver() {
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => observer.observe(el));
}


/* ═══════════════════════════════════════════════════
   5. FLOATING HEARTS (background particles)
   ═══════════════════════════════════════════════════ */
function spawnFloatingHearts() {
  const container = document.getElementById('floating-hearts');
  const hearts = ['❤️', '💕', '💖', '💗', '🩷', '♥', '💘'];
  const count = 20;

  for (let i = 0; i < count; i++) {
    const heart = document.createElement('div');
    heart.classList.add('floating-heart');
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.setProperty('--left', Math.random() * 100 + '%');
    heart.style.setProperty('--delay', Math.random() * 15 + 's');
    heart.style.setProperty('--duration', 10 + Math.random() * 15 + 's');
    heart.style.setProperty('--size', 0.8 + Math.random() * 1.5 + 'rem');
    heart.style.setProperty('--opacity', 0.06 + Math.random() * 0.12);
    container.appendChild(heart);
  }
}


/* ═══════════════════════════════════════════════════
   6. LOVE TIMER (counting up from start date)
   ═══════════════════════════════════════════════════ */
function startLoveTimer() {
  const daysEl  = document.getElementById('timer-days');
  const hoursEl = document.getElementById('timer-hours');
  const minsEl  = document.getElementById('timer-mins');
  const secsEl  = document.getElementById('timer-secs');

  function update() {
    const now  = new Date();
    const diff = now - CONFIG.loveStartDate;

    if (diff < 0) {
      daysEl.textContent = '000';
      hoursEl.textContent = '00';
      minsEl.textContent = '00';
      secsEl.textContent = '00';
      return;
    }

    const secs  = Math.floor(diff / 1000) % 60;
    const mins  = Math.floor(diff / 60000) % 60;
    const hours = Math.floor(diff / 3600000) % 24;
    const days  = Math.floor(diff / 86400000);

    daysEl.textContent  = String(days).padStart(3, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minsEl.textContent  = String(mins).padStart(2, '0');
    secsEl.textContent  = String(secs).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}


/* ═══════════════════════════════════════════════════
   7. PHOTO LIGHTBOX
   ═══════════════════════════════════════════════════ */
const lightbox    = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.querySelector('.lightbox-close');

document.querySelectorAll('.reason-img-wrap img').forEach(img => {
  img.addEventListener('click', () => {
    lightboxImg.src = img.src;
    lightbox.classList.remove('hidden');
  });
});

lightboxClose.addEventListener('click', () => lightbox.classList.add('hidden'));
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) lightbox.classList.add('hidden');
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') lightbox.classList.add('hidden');
});


/* ═══════════════════════════════════════════════════
   8. PROPOSAL BUTTONS
   ═══════════════════════════════════════════════════ */
const btnYes    = document.getElementById('btn-yes');
const btnNo     = document.getElementById('btn-no');
const yesScreen = document.getElementById('yes-screen');

// ── YES ──
btnYes.addEventListener('click', () => {
  // Show yes screen
  yesScreen.classList.remove('hidden');

  // Launch confetti
  launchConfetti();

  // Notify via Web3Forms
  sendNotification('YES 💖');
});

// ── NO — dodge away ──
function dodgeButton() {
  const container = btnNo.closest('.proposal-buttons');
  const rect = container.getBoundingClientRect();

  const maxX = rect.width - btnNo.offsetWidth - 20;
  const maxY = 200;

  const randX = Math.random() * maxX - maxX / 2;
  const randY = -(Math.random() * maxY + 50);

  btnNo.style.position = 'relative';
  btnNo.style.transform = `translate(${randX}px, ${randY}px)`;
  btnNo.style.transition = 'transform 0.25s ease-out';

  // Keep dodging with increasing sass
  const messages = [
    'No 😢',
    'Are you sure? 🥺',
    'Really?! 😭',
    'Please? 🥹',
    'Think again! 💕',
    'I know you want to say Yes! 💖',
    'You can\'t catch me! 😜',
    'Just say Yes already! 💘',
  ];

  dodgeCount++;
  if (dodgeCount < messages.length) {
    btnNo.textContent = messages[dodgeCount];
  }
}

let dodgeCount = 0;

// Desktop: hover dodge
btnNo.addEventListener('mouseenter', dodgeButton);
// Mobile: touch dodge
btnNo.addEventListener('touchstart', (e) => {
  e.preventDefault();
  dodgeButton();
});


/* ═══════════════════════════════════════════════════
   9. CONFETTI 🎉
   ═══════════════════════════════════════════════════ */
function launchConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const pieces = [];
  const colors = ['#ff6b8a', '#e84a7a', '#f5c77e', '#e8a0a0', '#ff4081',
                  '#ff80ab', '#ff1744', '#f48fb1', '#fce4ec', '#ffffff'];
  const shapes = ['circle', 'rect', 'heart'];

  // Create 300 confetti pieces
  for (let i = 0; i < 300; i++) {
    pieces.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 20,
      vy: (Math.random() - 0.5) * 20 - 8,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 10,
      gravity: 0.15 + Math.random() * 0.1,
      opacity: 1,
      decay: 0.003 + Math.random() * 0.005,
    });
  }

  function drawHeart(cx, cy, size, ctx) {
    ctx.beginPath();
    const s = size / 2;
    ctx.moveTo(cx, cy + s / 4);
    ctx.bezierCurveTo(cx, cy - s / 2, cx - s, cy - s / 2, cx - s, cy + s / 4);
    ctx.bezierCurveTo(cx - s, cy + s, cx, cy + s * 1.3, cx, cy + s * 1.3);
    ctx.bezierCurveTo(cx, cy + s * 1.3, cx + s, cy + s, cx + s, cy + s / 4);
    ctx.bezierCurveTo(cx + s, cy - s / 2, cx, cy - s / 2, cx, cy + s / 4);
    ctx.closePath();
    ctx.fill();
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;

    pieces.forEach(p => {
      if (p.opacity <= 0) return;
      alive = true;

      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= 0.99;
      p.rotation += p.rotSpeed;
      p.opacity -= p.decay;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = Math.max(0, p.opacity);
      ctx.fillStyle = p.color;

      if (p.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.shape === 'rect') {
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      } else {
        drawHeart(0, 0, p.size, ctx);
      }

      ctx.restore();
    });

    if (alive) requestAnimationFrame(animate);
  }

  animate();

  // Second burst after 1s
  setTimeout(() => {
    for (let i = 0; i < 150; i++) {
      pieces.push({
        x: Math.random() * canvas.width,
        y: -20,
        vx: (Math.random() - 0.5) * 6,
        vy: Math.random() * 5 + 2,
        size: Math.random() * 8 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 8,
        gravity: 0.1 + Math.random() * 0.08,
        opacity: 1,
        decay: 0.002 + Math.random() * 0.004,
      });
    }
    animate();
  }, 1000);
}


/* ═══════════════════════════════════════════════════
   10. WEB3FORMS NOTIFICATION
   ═══════════════════════════════════════════════════ */
function sendNotification(answer) {
  const now = new Date();
  const timestamp = now.toLocaleString('en-US', {
    dateStyle: 'full',
    timeStyle: 'short',
  });

  fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      access_key: CONFIG.web3formsKey,
      subject: `💖 Ama's Valentine Answer: ${answer}`,
      from_name: 'Valentine Proposal 💌',
      message: `Ama answered: ${answer}\n\nTime: ${timestamp}\n\n💕 Happy Valentine's Day! 💕`,
    }),
  }).catch(() => {
    // Silently fail — don't ruin the moment
  });
}


/* ═══════════════════════════════════════════════════
   11. HANDLE WINDOW RESIZE (confetti canvas)
   ═══════════════════════════════════════════════════ */
window.addEventListener('resize', () => {
  const canvas = document.getElementById('confetti-canvas');
  if (canvas && !yesScreen.classList.contains('hidden')) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
});
