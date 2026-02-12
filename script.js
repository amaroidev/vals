/* ╔══════════════════════════════════════════════════════════════╗
   ║  Valentine Proposal for Ama — script.js (Enhanced)         ║
   ║  + Cursor trail, petals, page transitions, EKG monitor,   ║
   ║    playlist, voice note, catch-the-hearts game             ║
   ╚══════════════════════════════════════════════════════════════╝ */

// ── CONFIG ──
const CONFIG = {
  web3formsKey: '52033bd9-63bc-40e7-8569-fcbb69e440a4',
  loveStartDate: new Date('2024-08-14T00:00:00'),
  loveLetter: `Ama, from the very first moment I knew you were special.\n\nYou spend your days saving lives, caring for strangers, giving your heart to everyone who needs it — and somehow, you still have enough love left to cross every mile between us and reach me.\n\nI don't know what I did to deserve you, but I thank God for you every single day.\n\nThis is for you, my love...`,
  typeSpeed: 45,

  // ── PLAYLIST ──
  // Add more songs: { src: 'hersong/song2.mp3', name: 'Song Name' }
  playlist: [
    { src: 'hersong/hersong.mp3', name: 'MAGIC💕' },
    { src: "hersong/hersong2.mp3", name: "4VER💖" },
    { src: "hersong/hersong3.mp3", name: "YOU'RE STILL THE ONE💘" }
  ],
};


/* ═══════════════════════════════════════════════════
   1. SPLASH SCREEN → Start Experience
   ═══════════════════════════════════════════════════ */
const splash   = document.getElementById('splash');
const mainEl   = document.getElementById('main-content');
const bgMusic  = document.getElementById('bg-music');
const musicBtn = document.getElementById('music-toggle');

let musicPlaying = false;
let currentTrack = 0;

function loadTrack(index) {
  const track = CONFIG.playlist[index];
  bgMusic.src = track.src;
  bgMusic.load();
  const nameEl = document.getElementById('music-track-name');
  if (nameEl) nameEl.textContent = track.name;
}

splash.addEventListener('click', () => {
  splash.classList.add('fade-out');
  mainEl.classList.remove('hidden');

  // Load first track & play
  loadTrack(0);
  bgMusic.volume = 0.5;
  bgMusic.play().then(() => {
    musicPlaying = true;
    musicBtn.classList.add('playing');
  }).catch(() => {});

  setTimeout(() => {
    initPageTransitions();
    initRevealObserver();
    startLoveTimer();
    startTypewriter();
    spawnFloatingHeartsAndPetals();
    initCursorTrail();
    initEKGMonitor();
  }, 400);
});


/* ═══════════════════════════════════════════════════
   2. MUSIC PLAYER — Playlist Controls
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

document.getElementById('music-prev').addEventListener('click', (e) => {
  e.stopPropagation();
  currentTrack = (currentTrack - 1 + CONFIG.playlist.length) % CONFIG.playlist.length;
  loadTrack(currentTrack);
  if (musicPlaying) bgMusic.play();
});

document.getElementById('music-next').addEventListener('click', (e) => {
  e.stopPropagation();
  currentTrack = (currentTrack + 1) % CONFIG.playlist.length;
  loadTrack(currentTrack);
  if (musicPlaying) bgMusic.play();
});

// Auto-advance to next track
bgMusic.addEventListener('ended', () => {
  currentTrack = (currentTrack + 1) % CONFIG.playlist.length;
  loadTrack(currentTrack);
  bgMusic.play();
});


/* ═══════════════════════════════════════════════════
   3. TYPEWRITER EFFECT
   ═══════════════════════════════════════════════════ */
function startTypewriter() {
  const el = document.getElementById('typewriter');
  const text = CONFIG.loveLetter;
  let i = 0;
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
      setTimeout(() => cursor.remove(), 2000);
    }
  }
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
   5. PAGE TRANSITION ANIMATIONS (storybook slide/fade)
   ═══════════════════════════════════════════════════ */
function initPageTransitions() {
  const sections = document.querySelectorAll('.page-section');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('page-visible');
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });
  sections.forEach(s => observer.observe(s));
}


/* ═══════════════════════════════════════════════════
   6. FLOATING HEARTS + ROSE PETALS
   ═══════════════════════════════════════════════════ */
function spawnFloatingHeartsAndPetals() {
  const container = document.getElementById('floating-hearts');
  const hearts = ['❤️', '💕', '💖', '💗', '🩷', '♥', '💘'];

  // Floating hearts
  for (let i = 0; i < 15; i++) {
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

  // Rose petals
  const petalColors = [
    'rgba(255,107,138,0.5)',
    'rgba(232,74,122,0.4)',
    'rgba(232,160,160,0.5)',
    'rgba(245,199,126,0.3)',
    'rgba(255,182,193,0.5)',
  ];

  for (let i = 0; i < 18; i++) {
    const petal = document.createElement('div');
    petal.classList.add('floating-petal');
    petal.style.setProperty('--left', Math.random() * 100 + '%');
    petal.style.setProperty('--delay', Math.random() * 20 + 's');
    petal.style.setProperty('--duration', 12 + Math.random() * 16 + 's');
    petal.style.setProperty('--petal-size', 8 + Math.random() * 16 + 'px');
    petal.style.setProperty('--petal-color', petalColors[Math.floor(Math.random() * petalColors.length)]);
    petal.style.setProperty('--opacity', 0.1 + Math.random() * 0.25);
    petal.style.setProperty('--rotation', Math.random() * 360 + 'deg');
    container.appendChild(petal);
  }
}


/* ═══════════════════════════════════════════════════
   7. GLOWING CURSOR TRAIL ✨
   ═══════════════════════════════════════════════════ */
function initCursorTrail() {
  const canvas = document.getElementById('cursor-trail');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouseX = -100, mouseY = -100;
  let isActive = false;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function onMove(x, y) {
    mouseX = x;
    mouseY = y;
    isActive = true;

    // Spawn sparkle particles
    for (let i = 0; i < 2; i++) {
      particles.push({
        x: mouseX + (Math.random() - 0.5) * 10,
        y: mouseY + (Math.random() - 0.5) * 10,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2 - 1,
        size: Math.random() * 4 + 2,
        life: 1,
        decay: 0.015 + Math.random() * 0.02,
        hue: 340 + Math.random() * 30, // pink range
      });
    }
  }

  document.addEventListener('mousemove', (e) => onMove(e.clientX, e.clientY));
  document.addEventListener('touchmove', (e) => {
    const t = e.touches[0];
    onMove(t.clientX, t.clientY);
  }, { passive: true });

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.02; // slight gravity
      p.life -= p.decay;

      if (p.life <= 0) {
        particles.splice(i, 1);
        return;
      }

      ctx.save();
      ctx.globalAlpha = p.life * 0.8;
      ctx.fillStyle = `hsla(${p.hue}, 100%, 75%, ${p.life})`;
      ctx.shadowColor = `hsla(${p.hue}, 100%, 75%, 0.8)`;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Limit particle count for performance
    if (particles.length > 120) particles.splice(0, 20);

    requestAnimationFrame(animate);
  }
  animate();
}


/* ═══════════════════════════════════════════════════
   8. LOVE TIMER
   ═══════════════════════════════════════════════════ */
function startLoveTimer() {
  const daysEl  = document.getElementById('timer-days');
  const hoursEl = document.getElementById('timer-hours');
  const minsEl  = document.getElementById('timer-mins');
  const secsEl  = document.getElementById('timer-secs');

  function update() {
    const diff = new Date() - CONFIG.loveStartDate;
    if (diff < 0) return;
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
   9. VOICE NOTE PLAYER
   ═══════════════════════════════════════════════════ */
const voicenoteBtn   = document.getElementById('voicenote-btn');
const voicenoteAudio = document.getElementById('voicenote-audio');
const voicenoteIcon  = document.querySelector('.voicenote-icon');
const voicenoteLabel = document.querySelector('.voicenote-label');
let voicePlaying = false;

voicenoteBtn.addEventListener('click', () => {
  if (voicePlaying) {
    voicenoteAudio.pause();
    voicenoteBtn.classList.remove('playing');
    voicenoteIcon.textContent = '▶';
    voicenoteLabel.textContent = 'Tap to play 🎙️';
  } else {
    // Lower bg music while voice plays
    bgMusic.volume = 0.15;
    voicenoteAudio.play().catch(() => {});
    voicenoteBtn.classList.add('playing');
    voicenoteIcon.textContent = '⏸';
    voicenoteLabel.textContent = 'Playing... 🎙️';
  }
  voicePlaying = !voicePlaying;
});

voicenoteAudio.addEventListener('ended', () => {
  voicePlaying = false;
  voicenoteBtn.classList.remove('playing');
  voicenoteIcon.textContent = '▶';
  voicenoteLabel.textContent = 'Tap to replay 🎙️';
  bgMusic.volume = 0.5; // restore bg music volume
});


/* ═══════════════════════════════════════════════════
   10. CATCH THE HEARTS MINI GAME 🎮
   ═══════════════════════════════════════════════════ */
const gameCanvas  = document.getElementById('game-canvas');
const gameCtx     = gameCanvas.getContext('2d');
const gameStartBtn = document.getElementById('game-start');
const gameOverEl  = document.getElementById('game-over');
const gameOverText = document.getElementById('game-over-text');
const gameContinue = document.getElementById('game-continue');
const scoreEl     = document.getElementById('game-score');
const timerDispEl = document.getElementById('game-timer-display');

let gameHearts = [];
let gameScore = 0;
let gameTime = 15;
let gameRunning = false;
let gameInterval = null;
let gameAnimId = null;

function resizeGameCanvas() {
  const rect = gameCanvas.getBoundingClientRect();
  gameCanvas.width = rect.width;
  gameCanvas.height = rect.height;
}

gameStartBtn.addEventListener('click', () => {
  resizeGameCanvas();
  gameStartBtn.classList.add('hidden');
  gameOverEl.classList.add('hidden');
  gameScore = 0;
  gameTime = 15;
  gameHearts = [];
  gameRunning = true;
  scoreEl.textContent = '💖 0';
  timerDispEl.textContent = '⏱ 15s';

  // Spawn hearts every 400ms
  gameInterval = setInterval(() => {
    if (!gameRunning) return;
    gameHearts.push({
      x: Math.random() * (gameCanvas.width - 40) + 20,
      y: -30,
      size: 22 + Math.random() * 18,
      speed: 1.5 + Math.random() * 2.5,
      emoji: ['❤️', '💖', '💗', '💕', '💘', '🩷'][Math.floor(Math.random() * 6)],
      caught: false,
      points: Math.random() > 0.8 ? 3 : 1, // 20% chance golden heart
    });
  }, 400);

  // Countdown
  const countdownId = setInterval(() => {
    gameTime--;
    timerDispEl.textContent = `⏱ ${gameTime}s`;
    if (gameTime <= 0) {
      clearInterval(countdownId);
      endGame();
    }
  }, 1000);

  animateGame();
});

function animateGame() {
  if (!gameRunning) return;
  gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

  gameHearts = gameHearts.filter(h => !h.caught && h.y < gameCanvas.height + 50);

  gameHearts.forEach(h => {
    h.y += h.speed;
    gameCtx.font = `${h.size}px serif`;
    gameCtx.textAlign = 'center';

    // Golden hearts glow
    if (h.points > 1) {
      gameCtx.shadowColor = 'rgba(245, 199, 126, 0.8)';
      gameCtx.shadowBlur = 15;
    } else {
      gameCtx.shadowColor = 'transparent';
      gameCtx.shadowBlur = 0;
    }

    gameCtx.fillText(h.emoji, h.x, h.y);
  });

  gameCtx.shadowBlur = 0;
  gameAnimId = requestAnimationFrame(animateGame);
}

function handleGameTap(x, y) {
  if (!gameRunning) return;
  const rect = gameCanvas.getBoundingClientRect();
  const cx = x - rect.left;
  const cy = y - rect.top;

  for (let i = gameHearts.length - 1; i >= 0; i--) {
    const h = gameHearts[i];
    const dist = Math.hypot(cx - h.x, cy - h.y);
    if (dist < h.size + 10) {
      h.caught = true;
      gameScore += h.points;
      scoreEl.textContent = `💖 ${gameScore}`;

      // Sparkle effect
      spawnGameSparkle(h.x, h.y);
      break;
    }
  }
}

function spawnGameSparkle(x, y) {
  const sparkles = 6;
  for (let i = 0; i < sparkles; i++) {
    const angle = (Math.PI * 2 / sparkles) * i;
    const sparkle = { x, y, vx: Math.cos(angle) * 3, vy: Math.sin(angle) * 3, life: 1 };
    const id = setInterval(() => {
      sparkle.x += sparkle.vx;
      sparkle.y += sparkle.vy;
      sparkle.life -= 0.05;
      if (sparkle.life > 0) {
        gameCtx.save();
        gameCtx.globalAlpha = sparkle.life;
        gameCtx.fillStyle = '#ff6b8a';
        gameCtx.beginPath();
        gameCtx.arc(sparkle.x, sparkle.y, 3, 0, Math.PI * 2);
        gameCtx.fill();
        gameCtx.restore();
      } else {
        clearInterval(id);
      }
    }, 16);
  }
}

gameCanvas.addEventListener('click', (e) => handleGameTap(e.clientX, e.clientY));
gameCanvas.addEventListener('touchstart', (e) => {
  e.preventDefault();
  const t = e.touches[0];
  handleGameTap(t.clientX, t.clientY);
}, { passive: false });

function endGame() {
  gameRunning = false;
  clearInterval(gameInterval);
  cancelAnimationFrame(gameAnimId);

  let msg = '';
  if (gameScore >= 20) msg = `${gameScore} hearts! You caught ALL my love! 💖`;
  else if (gameScore >= 10) msg = `${gameScore} hearts! My love is safe with you 💕`;
  else msg = `${gameScore} hearts! But my love for you is infinite anyway 🥰`;

  gameOverText.textContent = msg;
  gameOverEl.classList.remove('hidden');
}

gameContinue.addEventListener('click', () => {
  document.getElementById('proposal').scrollIntoView({ behavior: 'smooth' });
});


/* ═══════════════════════════════════════════════════
   11. ANIMATED EKG HEARTBEAT MONITOR
       Flatline → normal heartbeat → heart shape
   ═══════════════════════════════════════════════════ */
function initEKGMonitor() {
  const canvas = document.getElementById('ekg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let animStarted = false;

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !animStarted) {
      animStarted = true;
      resizeEKG();
      runEKG();
      observer.disconnect();
    }
  }, { threshold: 0.3 });
  observer.observe(canvas);

  function resizeEKG() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
  }

  function runEKG() {
    const W = canvas.width;
    const H = canvas.height;
    const midY = H / 2;
    let x = 0;
    const speed = 3;
    let phase = 'flatline'; // flatline → heartbeat → heart
    let phaseTime = 0;
    let heartbeatCount = 0;

    // Heartbeat pattern (normalized 0-1 → y offset)
    function heartbeatY(t) {
      // P wave
      if (t < 0.1) return Math.sin(t / 0.1 * Math.PI) * -8;
      // flat
      if (t < 0.2) return 0;
      // QRS complex
      if (t < 0.25) return (t - 0.2) / 0.05 * -10;
      if (t < 0.3) return -10 + (t - 0.25) / 0.05 * 50;
      if (t < 0.35) return 40 - (t - 0.3) / 0.05 * 55;
      if (t < 0.4) return -15 + (t - 0.35) / 0.05 * 15;
      // T wave
      if (t < 0.55) return Math.sin((t - 0.4) / 0.15 * Math.PI) * -12;
      return 0;
    }

    // Heart shape points
    function getHeartPoints(cx, cy, size, numPoints) {
      const points = [];
      for (let i = 0; i <= numPoints; i++) {
        const t = (i / numPoints) * Math.PI * 2;
        const px = size * 16 * Math.pow(Math.sin(t), 3) / 17;
        const py = -size * (13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t)) / 17;
        points.push({ x: cx + px, y: cy + py });
      }
      return points;
    }

    let trail = [];
    let heartPoints = [];
    let heartDrawIndex = 0;
    let glowPulse = 0;

    function animate() {
      // Semi-transparent clear for trail glow effect
      ctx.fillStyle = 'rgba(0, 20, 10, 0.15)';
      ctx.fillRect(0, 0, W, H);

      phaseTime++;

      if (phase === 'flatline') {
        // Draw flatline
        x += speed;
        trail.push({ x: x % W, y: midY });

        if (phaseTime > 80) {
          phase = 'heartbeat';
          phaseTime = 0;
          heartbeatCount = 0;
        }
      } else if (phase === 'heartbeat') {
        x += speed;
        const cycleLen = 80;
        const t = (phaseTime % cycleLen) / cycleLen;
        const yOff = heartbeatY(t);
        trail.push({ x: x % W, y: midY + yOff });

        if (phaseTime % cycleLen === 0) heartbeatCount++;
        if (heartbeatCount >= 4) {
          phase = 'heart';
          phaseTime = 0;
          trail = [];
          heartPoints = getHeartPoints(W / 2, midY, Math.min(W, H) * 0.28, 100);
          heartDrawIndex = 0;
        }
      } else if (phase === 'heart') {
        // Draw heart shape progressively
        if (heartDrawIndex < heartPoints.length) {
          heartDrawIndex += 2;
        }
        glowPulse += 0.05;
      }

      // Render trail
      if (trail.length > 1 && phase !== 'heart') {
        ctx.beginPath();
        ctx.strokeStyle = '#ff6b8a';
        ctx.lineWidth = 2.5;
        ctx.shadowColor = '#ff6b8a';
        ctx.shadowBlur = 10;

        // Only draw last W worth of trail
        const start = Math.max(0, trail.length - Math.floor(W / speed));
        ctx.moveTo(trail[start].x, trail[start].y);
        for (let i = start + 1; i < trail.length; i++) {
          ctx.lineTo(trail[i].x, trail[i].y);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Scanning dot
        const last = trail[trail.length - 1];
        ctx.beginPath();
        ctx.fillStyle = '#fff';
        ctx.shadowColor = '#ff6b8a';
        ctx.shadowBlur = 15;
        ctx.arc(last.x, last.y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Render heart shape
      if (phase === 'heart' && heartDrawIndex > 1) {
        const pulseScale = 1 + Math.sin(glowPulse) * 0.03;
        ctx.save();
        ctx.translate(W / 2, midY);
        ctx.scale(pulseScale, pulseScale);
        ctx.translate(-W / 2, -midY);

        ctx.beginPath();
        ctx.strokeStyle = '#ff6b8a';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#ff6b8a';
        ctx.shadowBlur = 20;

        const drawTo = Math.min(heartDrawIndex, heartPoints.length);
        ctx.moveTo(heartPoints[0].x, heartPoints[0].y);
        for (let i = 1; i < drawTo; i++) {
          ctx.lineTo(heartPoints[i].x, heartPoints[i].y);
        }
        ctx.stroke();

        // Fill when complete
        if (heartDrawIndex >= heartPoints.length) {
          ctx.fillStyle = 'rgba(255, 107, 138, 0.15)';
          ctx.fill();
        }

        ctx.restore();
        ctx.shadowBlur = 0;
      }

      // Keep trail manageable
      if (trail.length > 500) trail.splice(0, 100);

      requestAnimationFrame(animate);
    }
    animate();
  }
}


/* ═══════════════════════════════════════════════════
   12. PHOTO LIGHTBOX
   ═══════════════════════════════════════════════════ */
const lightbox     = document.getElementById('lightbox');
const lightboxImg  = document.getElementById('lightbox-img');
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
   13. PROPOSAL BUTTONS
   ═══════════════════════════════════════════════════ */
const btnYes    = document.getElementById('btn-yes');
const btnNo     = document.getElementById('btn-no');
const yesScreen = document.getElementById('yes-screen');

btnYes.addEventListener('click', () => {
  yesScreen.classList.remove('hidden');
  launchConfetti();
  sendNotification('YES 💖');
});

// ── NO — dodge away ──
let dodgeCount = 0;
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

  const messages = [
    'No 😢', 'Are you sure? 🥺', 'Really?! 😭', 'Please? 🥹',
    'Think again! 💕', 'I know you want to say Yes! 💖',
    "You can't catch me! 😜", 'Just say Yes already! 💘',
  ];
  dodgeCount++;
  if (dodgeCount < messages.length) btnNo.textContent = messages[dodgeCount];
}

btnNo.addEventListener('mouseenter', dodgeButton);
btnNo.addEventListener('touchstart', (e) => { e.preventDefault(); dodgeButton(); });


/* ═══════════════════════════════════════════════════
   14. CONFETTI 🎉
   ═══════════════════════════════════════════════════ */
function launchConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const pieces = [];
  const colors = ['#ff6b8a','#e84a7a','#f5c77e','#e8a0a0','#ff4081',
                  '#ff80ab','#ff1744','#f48fb1','#fce4ec','#ffffff'];
  const shapes = ['circle','rect','heart'];

  for (let i = 0; i < 300; i++) {
    pieces.push({
      x: canvas.width / 2, y: canvas.height / 2,
      vx: (Math.random()-0.5)*20, vy: (Math.random()-0.5)*20-8,
      size: Math.random()*8+4,
      color: colors[Math.floor(Math.random()*colors.length)],
      shape: shapes[Math.floor(Math.random()*shapes.length)],
      rotation: Math.random()*360,
      rotSpeed: (Math.random()-0.5)*10,
      gravity: 0.15+Math.random()*0.1,
      opacity: 1,
      decay: 0.003+Math.random()*0.005,
    });
  }

  function drawHeart(cx, cy, size) {
    ctx.beginPath();
    const s = size/2;
    ctx.moveTo(cx, cy+s/4);
    ctx.bezierCurveTo(cx, cy-s/2, cx-s, cy-s/2, cx-s, cy+s/4);
    ctx.bezierCurveTo(cx-s, cy+s, cx, cy+s*1.3, cx, cy+s*1.3);
    ctx.bezierCurveTo(cx, cy+s*1.3, cx+s, cy+s, cx+s, cy+s/4);
    ctx.bezierCurveTo(cx+s, cy-s/2, cx, cy-s/2, cx, cy+s/4);
    ctx.closePath();
    ctx.fill();
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;

    pieces.forEach(p => {
      if (p.opacity <= 0) return;
      alive = true;
      p.x += p.vx; p.y += p.vy;
      p.vy += p.gravity; p.vx *= 0.99;
      p.rotation += p.rotSpeed; p.opacity -= p.decay;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation * Math.PI / 180);
      ctx.globalAlpha = Math.max(0, p.opacity);
      ctx.fillStyle = p.color;

      if (p.shape === 'circle') {
        ctx.beginPath(); ctx.arc(0,0,p.size/2,0,Math.PI*2); ctx.fill();
      } else if (p.shape === 'rect') {
        ctx.fillRect(-p.size/2,-p.size/2,p.size,p.size*0.6);
      } else {
        drawHeart(0, 0, p.size);
      }
      ctx.restore();
    });

    if (alive) requestAnimationFrame(animate);
  }
  animate();

  // Second burst
  setTimeout(() => {
    for (let i = 0; i < 150; i++) {
      pieces.push({
        x: Math.random()*canvas.width, y: -20,
        vx: (Math.random()-0.5)*6, vy: Math.random()*5+2,
        size: Math.random()*8+3,
        color: colors[Math.floor(Math.random()*colors.length)],
        shape: shapes[Math.floor(Math.random()*shapes.length)],
        rotation: Math.random()*360,
        rotSpeed: (Math.random()-0.5)*8,
        gravity: 0.1+Math.random()*0.08,
        opacity: 1, decay: 0.002+Math.random()*0.004,
      });
    }
    animate();
  }, 1000);
}


/* ═══════════════════════════════════════════════════
   15. WEB3FORMS NOTIFICATION
   ═══════════════════════════════════════════════════ */
function sendNotification(answer) {
  const timestamp = new Date().toLocaleString('en-US', {
    dateStyle: 'full', timeStyle: 'short',
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
  }).catch(() => {});
}


/* ═══════════════════════════════════════════════════
   16. WINDOW RESIZE HANDLER
   ═══════════════════════════════════════════════════ */
window.addEventListener('resize', () => {
  const canvas = document.getElementById('confetti-canvas');
  if (canvas && !yesScreen.classList.contains('hidden')) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
});
