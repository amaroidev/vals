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
    { src: 'hersong/hersong.mp3', name: 'BE YOUR HERO ' },
    { src: "hersong/hersong1.mp3", name: "I NEED YOU💞" },
    { src: "hersong/hersong2.mp3", name: "4VER💖" },
    { src: "hersong/hersong3.mp3", name: "YOU'RE STILL THE ONE💘" },
    { src: "hersong/hersong4.mp3", name: "I FEEL IT COMING💗" },
    { src: "hersong/hersong5.mp3", name: "MAGIC " },
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

  // Show loading spinner until audio is ready
  musicBtn.classList.add('loading');
  bgMusic.addEventListener('canplaythrough', function onReady() {
    musicBtn.classList.remove('loading');
    bgMusic.removeEventListener('canplaythrough', onReady);
  });
}

// ── PRELOAD first track immediately (before splash tap) ──
// This starts downloading the audio as soon as the page loads,
// so it's ready to play instantly when Ama taps the envelope.
loadTrack(0);
bgMusic.volume = 0.5;

splash.addEventListener('click', () => {
  splash.classList.add('fade-out');
  mainEl.classList.remove('hidden');

  // Audio should already be loaded — play immediately
  musicBtn.classList.add('loading');
  const playAttempt = bgMusic.play();
  if (playAttempt !== undefined) {
    playAttempt.then(() => {
      musicPlaying = true;
      musicBtn.classList.remove('loading');
      musicBtn.classList.add('playing');
    }).catch(() => {
      // Autoplay blocked — wait for canplaythrough then retry
      bgMusic.addEventListener('canplaythrough', function retry() {
        bgMusic.removeEventListener('canplaythrough', retry);
        bgMusic.play().then(() => {
          musicPlaying = true;
          musicBtn.classList.remove('loading');
          musicBtn.classList.add('playing');
        }).catch(() => {
          musicBtn.classList.remove('loading');
        });
      });
    });
  }

  // Hide scroll hint after first scroll
  const scrollHint = document.querySelector('.scroll-hint');
  if (scrollHint) {
    const hideHint = () => {
      scrollHint.style.transition = 'opacity 0.5s ease';
      scrollHint.style.opacity = '0';
      setTimeout(() => scrollHint.style.display = 'none', 500);
      window.removeEventListener('scroll', hideHint);
    };
    window.addEventListener('scroll', hideHint, { once: true });
  }

  setTimeout(() => {
    initPageTransitions();
    initRevealObserver();
    startLoveTimer();
    startTypewriter();
    spawnFloatingHeartsAndPetals();
    initCursorTrail();
    initStarName();
    initFortuneCookie();
    initEKGMonitor();
    initLDRMap();
    initTimeGreeting();
    initPhotoPuzzle();
    initVirtualHug();
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
  if (musicPlaying) {
    bgMusic.addEventListener('canplaythrough', function playWhenReady() {
      bgMusic.removeEventListener('canplaythrough', playWhenReady);
      bgMusic.play().catch(() => {});
    });
  }
});

document.getElementById('music-next').addEventListener('click', (e) => {
  e.stopPropagation();
  currentTrack = (currentTrack + 1) % CONFIG.playlist.length;
  loadTrack(currentTrack);
  if (musicPlaying) {
    bgMusic.addEventListener('canplaythrough', function playWhenReady() {
      bgMusic.removeEventListener('canplaythrough', playWhenReady);
      bgMusic.play().catch(() => {});
    });
  }
});

// Auto-advance to next track
bgMusic.addEventListener('ended', () => {
  currentTrack = (currentTrack + 1) % CONFIG.playlist.length;
  loadTrack(currentTrack);
  bgMusic.addEventListener('canplaythrough', function playWhenReady() {
    bgMusic.removeEventListener('canplaythrough', playWhenReady);
    bgMusic.play().catch(() => {});
  });
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
  const isMobile = window.innerWidth <= 600;
  const hearts = ['❤️', '💕', '💖', '💗', '🩷', '♥', '💘'];

  // Floating hearts (fewer on mobile)
  const heartCount = isMobile ? 4 : 15;
  for (let i = 0; i < heartCount; i++) {
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

  // Rose petals (fewer on mobile)
  const petalColors = [
    'rgba(255,107,138,0.5)',
    'rgba(232,74,122,0.4)',
    'rgba(232,160,160,0.5)',
    'rgba(245,199,126,0.3)',
    'rgba(255,182,193,0.5)',
  ];
  const petalCount = isMobile ? 4 : 18;
  for (let i = 0; i < petalCount; i++) {
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

  // 🌸 Floating flowers
  const flowers = ['🌸', '🌺', '🌷', '🌹', '💐', '🌻', '🪷', '🌼'];
  const flowerCount = isMobile ? 3 : 12;
  for (let i = 0; i < flowerCount; i++) {
    const flower = document.createElement('div');
    flower.classList.add('floating-flower');
    flower.textContent = flowers[Math.floor(Math.random() * flowers.length)];
    flower.style.setProperty('--left', Math.random() * 100 + '%');
    flower.style.setProperty('--delay', Math.random() * 25 + 's');
    flower.style.setProperty('--duration', 14 + Math.random() * 18 + 's');
    flower.style.setProperty('--size', 1 + Math.random() * 1.6 + 'rem');
    flower.style.setProperty('--opacity', 0.12 + Math.random() * 0.18);
    flower.style.setProperty('--rotation', Math.random() * 360 + 'deg');
    container.appendChild(flower);
  }
}


/* ═══════════════════════════════════════════════════
   7. GLOWING CURSOR TRAIL ✨
   ═══════════════════════════════════════════════════ */
function initCursorTrail() {
  // Skip cursor trail entirely on mobile for performance
  if (window.innerWidth <= 600 || 'ontouchstart' in window) return;

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

    if (particles.length > 0) {
      requestAnimationFrame(animate);
    } else {
      isActive = false;
    }
  }

  // Only start animation loop when mouse moves (not forever)
  document.addEventListener('mousemove', (e) => {
    onMove(e.clientX, e.clientY);
    if (!isActive) {
      isActive = true;
      animate();
    }
  }, { passive: true });
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
   9. HER NAME WRITTEN IN STARS ✨
   ═══════════════════════════════════════════════════ */
function initStarName() {
  const canvas = document.getElementById('star-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let animStarted = false;
  let starVisible = false;

  const observer = new IntersectionObserver((entries) => {
    starVisible = entries[0].isIntersecting;
    if (starVisible && !animStarted) {
      animStarted = true;
      resizeStarCanvas();
      runStars();
    }
  }, { threshold: 0.1 });
  observer.observe(canvas);

  function resizeStarCanvas() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
  }

  function runStars() {
    const W = canvas.width;
    const H = canvas.height;

    // Background stars
    const bgStars = [];
    for (let i = 0; i < 120; i++) {
      bgStars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        size: Math.random() * 1.8 + 0.3,
        twinkleSpeed: 0.005 + Math.random() * 0.02,
        twinkleOffset: Math.random() * Math.PI * 2,
        brightness: 0.3 + Math.random() * 0.7,
      });
    }

    // Get text points by drawing text to a temp canvas and sampling
    const textParticles = [];
    const tmpCanvas = document.createElement('canvas');
    const tmpCtx = tmpCanvas.getContext('2d');
    tmpCanvas.width = W;
    tmpCanvas.height = H;

    const fontSize = Math.min(W * 0.22, 140);
    tmpCtx.font = `bold ${fontSize}px 'Dancing Script', cursive`;
    tmpCtx.textAlign = 'center';
    tmpCtx.textBaseline = 'middle';
    tmpCtx.fillStyle = '#fff';
    tmpCtx.fillText('AMA', W / 2, H / 2);

    // Sample pixels to find text positions
    const imageData = tmpCtx.getImageData(0, 0, W, H);
    const gap = window.innerWidth <= 600 ? 5 : 4;
    for (let y = 0; y < H; y += gap) {
      for (let x = 0; x < W; x += gap) {
        const idx = (y * W + x) * 4;
        if (imageData.data[idx + 3] > 128) {
          textParticles.push({
            targetX: x,
            targetY: y,
            x: Math.random() * W,
            y: Math.random() * H,
            size: Math.random() * 2.5 + 1,
            arrived: false,
            speed: 0.02 + Math.random() * 0.03,
            twinkleSpeed: 0.02 + Math.random() * 0.04,
            twinkleOffset: Math.random() * Math.PI * 2,
            hue: 330 + Math.random() * 50, // pink-gold range
          });
        }
      }
    }

    // Shooting stars
    const shootingStars = [];
    function maybeSpawnShootingStar() {
      if (Math.random() < 0.008 && shootingStars.length < 2) {
        shootingStars.push({
          x: Math.random() * W * 0.8,
          y: Math.random() * H * 0.3,
          vx: 4 + Math.random() * 4,
          vy: 2 + Math.random() * 2,
          life: 1,
          length: 40 + Math.random() * 60,
        });
      }
    }

    let time = 0;
    let phase = 'gathering'; // gathering → settled → twinkling

    function animate() {
      if (!starVisible) { requestAnimationFrame(animate); return; }
      // Clear with dark sky
      ctx.fillStyle = 'rgba(5, 2, 16, 0.25)';
      ctx.fillRect(0, 0, W, H);

      time += 0.016;

      // Draw background stars
      bgStars.forEach(s => {
        const twinkle = 0.3 + Math.sin(time * s.twinkleSpeed * 60 + s.twinkleOffset) * 0.35 + 0.35;
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, ${twinkle * s.brightness})`;
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw & move text particles
      let allArrived = true;
      textParticles.forEach(p => {
        // Ease toward target
        const dx = p.targetX - p.x;
        const dy = p.targetY - p.y;
        const dist = Math.hypot(dx, dy);

        if (dist > 1) {
          allArrived = false;
          p.x += dx * p.speed;
          p.y += dy * p.speed;
        } else {
          p.arrived = true;
        }

        // Twinkling
        const twinkle = 0.5 + Math.sin(time * p.twinkleSpeed * 60 + p.twinkleOffset) * 0.5;
        const alpha = p.arrived ? twinkle : 0.6 + twinkle * 0.4;

        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = `hsla(${p.hue}, 100%, 80%, ${alpha})`;
        ctx.shadowColor = `hsla(${p.hue}, 100%, 75%, ${alpha * 0.8})`;
        ctx.shadowBlur = p.arrived ? 8 : 4;
        ctx.arc(p.x, p.y, p.size * (p.arrived ? (0.8 + twinkle * 0.4) : 1), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      if (allArrived && phase === 'gathering') {
        phase = 'settled';
      }

      // Shooting stars
      maybeSpawnShootingStar();
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        ss.x += ss.vx;
        ss.y += ss.vy;
        ss.life -= 0.015;

        if (ss.life <= 0) {
          shootingStars.splice(i, 1);
          continue;
        }

        ctx.save();
        const grad = ctx.createLinearGradient(
          ss.x, ss.y,
          ss.x - ss.vx * ss.length / 5, ss.y - ss.vy * ss.length / 5
        );
        grad.addColorStop(0, `rgba(255, 255, 255, ${ss.life})`);
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(ss.x, ss.y);
        ctx.lineTo(ss.x - ss.vx * ss.length / 5, ss.y - ss.vy * ss.length / 5);
        ctx.stroke();

        // Head glow
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, ${ss.life})`;
        ctx.shadowColor = '#fff';
        ctx.shadowBlur = 6;
        ctx.arc(ss.x, ss.y, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      requestAnimationFrame(animate);
    }
    animate();
  }
}


/* ═══════════════════════════════════════════════════
   10. LOVE FORTUNE COOKIE 🥠
   ═══════════════════════════════════════════════════ */
function initFortuneCookie() {
  const cookie = document.getElementById('fortune-cookie');
  const slip = document.getElementById('fortune-slip');
  const fortuneText = document.getElementById('fortune-text');
  const againBtn = document.getElementById('fortune-again');
  if (!cookie) return;

  const fortunes = [
    "Ama, the stars aligned the day I met you. Every moment since has been a gift. 💫",
    "Your love is the medicine that heals every wound distance creates. 💉❤️",
    "In every time zone, in every heartbeat — it's always you, Ama. 🌍",
    "God spent extra time on you, and I'm the lucky one who gets to love you. ✨",
    "Your smile after a long shift is my favorite thing in this whole world. 😊",
    "Even the oceans between us can't dilute how strong my love is for you. 🌊",
    "Every night I fall asleep grateful — because somewhere in this world, you're mine. 🌙",
    "You don't just save lives at work, Ama. You saved mine too. 🩺💖",
    "Our love story is my favorite — and we're only at the beginning. 📖",
    "Distance means nothing when someone means everything. You mean everything. 💕",
    "I'd wait a thousand more days if it meant forever starts with you. ⏳",
    "The way you love me from far away proves love has no limits. 💌",
    "One day, the only distance between us will be across the pillow. 🛏️💖",
    "You are my 11:11 wish, every single time. 🕯️",
    "My heart doesn't beat — it spells your name. A-M-A. 💓",
  ];

  let lastIndex = -1;

  // Sparkle dots around cookie
  const sparkleWrap = cookie.querySelector('.cookie-sparkles');
  for (let i = 0; i < 8; i++) {
    const dot = document.createElement('div');
    dot.classList.add('cookie-sparkle');
    const angle = (Math.PI * 2 / 8) * i;
    dot.style.setProperty('--sx', `${Math.cos(angle) * 40}px`);
    dot.style.setProperty('--sy', `${Math.sin(angle) * 40}px`);
    dot.style.left = `${50 + Math.cos(angle) * 30}%`;
    dot.style.top = `${50 + Math.sin(angle) * 30}%`;
    dot.style.animationDelay = `${i * 0.15}s`;
    sparkleWrap.appendChild(dot);
  }

  function showFortune() {
    // Pick random fortune (avoid repeats)
    let idx;
    do {
      idx = Math.floor(Math.random() * fortunes.length);
    } while (idx === lastIndex && fortunes.length > 1);
    lastIndex = idx;

    cookie.classList.add('cracked');
    setTimeout(() => {
      cookie.classList.add('hidden');
      fortuneText.textContent = fortunes[idx];
      slip.classList.remove('hidden');
      againBtn.classList.remove('hidden');
    }, 500);
  }

  cookie.addEventListener('click', showFortune);

  againBtn.addEventListener('click', () => {
    slip.classList.add('hidden');
    againBtn.classList.add('hidden');
    cookie.classList.remove('cracked', 'hidden');

    // Small delay before allowing next crack
    setTimeout(() => {
      // ready for next tap
    }, 300);
  });
}


/* ═══════════════════════════════════════════════════
   11. VOICE NOTE PLAYER
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
   12. CATCH THE HEARTS MINI GAME 🎮
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
  gameCanvas.classList.add('game-active');
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
  if (!gameRunning) return; // allow normal scroll when game not active
  e.preventDefault();
  const t = e.touches[0];
  handleGameTap(t.clientX, t.clientY);
}, { passive: false });

function endGame() {
  gameRunning = false;
  clearInterval(gameInterval);
  cancelAnimationFrame(gameAnimId);
  gameCanvas.classList.remove('game-active');

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
   13. ANIMATED EKG HEARTBEAT MONITOR
       Flatline → normal heartbeat → heart shape
   ═══════════════════════════════════════════════════ */
function initEKGMonitor() {
  const canvas = document.getElementById('ekg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let animStarted = false;
  let ekgVisible = false;

  const observer = new IntersectionObserver((entries) => {
    ekgVisible = entries[0].isIntersecting;
    if (ekgVisible && !animStarted) {
      animStarted = true;
      resizeEKG();
      runEKG();
    }
  }, { threshold: 0.1 });
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

      if (ekgVisible) {
        requestAnimationFrame(animate);
      } else {
        // When visible again, restart
        const resume = new IntersectionObserver((e) => {
          if (e[0].isIntersecting) { resume.disconnect(); requestAnimationFrame(animate); }
        }, { threshold: 0.1 });
        resume.observe(canvas);
      }
    }
    animate();
  }
}


/* ═══════════════════════════════════════════════════
   14. PHOTO LIGHTBOX
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
   15. PROPOSAL BUTTONS
   ═══════════════════════════════════════════════════ */
const btnYes    = document.getElementById('btn-yes');
const btnNo     = document.getElementById('btn-no');
const yesScreen = document.getElementById('yes-screen');

btnYes.addEventListener('click', () => {
  yesScreen.classList.remove('hidden');
  sendNotification('YES 💖');
  showBouquetThenConfetti();
});

function showBouquetThenConfetti() {
  const bouquetScene = document.getElementById('bouquet-scene');
  const yesContent = document.querySelector('.yes-content');

  // Hide yes-content initially, show bouquet
  yesContent.style.opacity = '0';
  yesContent.style.pointerEvents = 'none';

  // Activate bouquet scene
  requestAnimationFrame(() => {
    bouquetScene.classList.add('active');
  });

  // Spawn falling petals during bouquet
  spawnBouquetPetals();

  // After bouquet plays out (~5.5s), transition to yes screen
  setTimeout(() => {
    bouquetScene.classList.add('fade-out');

    setTimeout(() => {
      bouquetScene.classList.remove('active', 'fade-out');
      bouquetScene.style.display = 'none';
      // Remove lingering petals
      document.querySelectorAll('.bouquet-petal').forEach(p => p.remove());

      // Show yes content with confetti
      yesContent.style.opacity = '1';
      yesContent.style.pointerEvents = 'auto';
      yesContent.style.animation = 'zoomIn 0.6s ease-out';
      launchConfetti();
    }, 1000);
  }, 5500);
}

function spawnBouquetPetals() {
  const petals = ['🌸', '🌺', '🌷', '💮', '🪻', '🏵️'];
  const body = document.body;

  // Spawn petals in waves
  for (let wave = 0; wave < 3; wave++) {
    const waveDelay = 2500 + wave * 1200; // start at 2.5s (after blooms start)
    setTimeout(() => {
      for (let i = 0; i < 10; i++) {
        const petal = document.createElement('div');
        petal.classList.add('bouquet-petal');
        petal.textContent = petals[Math.floor(Math.random() * petals.length)];
        petal.style.left = Math.random() * 100 + 'vw';
        petal.style.top = '-40px';
        petal.style.setProperty('--delay', (Math.random() * 0.8) + 's');
        petal.style.setProperty('--duration', (3 + Math.random() * 3) + 's');
        petal.style.fontSize = (1 + Math.random() * 1.2) + 'rem';
        body.appendChild(petal);

        // Self-remove after animation
        setTimeout(() => petal.remove(), 7000);
      }
    }, waveDelay);
  }
}

// ── Replay / go back button on Yes screen ──
document.getElementById('btn-replay').addEventListener('click', () => {
  yesScreen.classList.add('hidden');
  // Reset bouquet scene for potential replay
  const bouquetScene = document.getElementById('bouquet-scene');
  bouquetScene.style.display = '';
  bouquetScene.classList.remove('active', 'fade-out');
  // Reset bloom animations by re-cloning
  bouquetScene.querySelectorAll('.bloom, .stem, .bouquet-ribbon').forEach(el => {
    el.style.animation = 'none';
    el.offsetHeight; // trigger reflow
    el.style.animation = '';
  });
  document.getElementById('intro').scrollIntoView({ behavior: 'smooth' });
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
   16. CONFETTI 🎉
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
   17. WEB3FORMS NOTIFICATION
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
   18. LDR MAP ANIMATION ✈️ (Tarkwa ↔ Reading)
   ═══════════════════════════════════════════════════ */
function initLDRMap() {
  const canvas = document.getElementById('map-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let animStarted = false;
  let mapVisible = false;

  const observer = new IntersectionObserver((entries) => {
    mapVisible = entries[0].isIntersecting;
    if (mapVisible && !animStarted) {
      animStarted = true;
      resizeMapCanvas();
      runMap();
    }
  }, { threshold: 0.1 });
  observer.observe(canvas);

  function resizeMapCanvas() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
  }

  function runMap() {
    const W = canvas.width;
    const H = canvas.height;

    // --- Positions (Tarkwa bottom-left, Reading top-right) ---
    const tarkwa  = { x: W * 0.15, y: H * 0.72 };
    const reading = { x: W * 0.85, y: H * 0.25 };

    // Control points for a nice arc (goes up through the "sky")
    const cp1 = { x: W * 0.35, y: H * 0.08 };
    const cp2 = { x: W * 0.65, y: H * 0.05 };

    // Background stars
    const bgStars = [];
    for (let i = 0; i < 80; i++) {
      bgStars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        size: Math.random() * 1.5 + 0.3,
        twinkleSpeed: 0.005 + Math.random() * 0.015,
        twinkleOffset: Math.random() * Math.PI * 2,
        brightness: 0.3 + Math.random() * 0.5,
      });
    }

    // Bezier helper
    function bezierPoint(t, p0, p1, p2, p3) {
      const mt = 1 - t;
      return {
        x: mt*mt*mt*p0.x + 3*mt*mt*t*p1.x + 3*mt*t*t*p2.x + t*t*t*p3.x,
        y: mt*mt*mt*p0.y + 3*mt*mt*t*p1.y + 3*mt*t*t*p2.y + t*t*t*p3.y,
      };
    }

    // Build the full path as discrete points for drawing
    const pathPoints = [];
    for (let i = 0; i <= 200; i++) {
      pathPoints.push(bezierPoint(i / 200, tarkwa, cp1, cp2, reading));
    }

    let time = 0;
    let dashOffset = 0;
    let drawProgress = 0; // 0→1 how much of path is drawn
    const drawSpeed = 0.004;

    // Heart particles that float along the path
    const hearts = [];
    let heartSpawnTimer = 0;

    function spawnHeart() {
      hearts.push({
        t: 0,
        speed: 0.002 + Math.random() * 0.002,
        size: 12 + Math.random() * 10,
        opacity: 0.7 + Math.random() * 0.3,
        wobble: Math.random() * Math.PI * 2,
        wobbleAmp: 3 + Math.random() * 5,
      });
    }

    function animate() {
      if (!mapVisible) { requestAnimationFrame(animate); return; }
      // Clear
      ctx.fillStyle = 'rgba(5, 3, 16, 0.3)';
      ctx.fillRect(0, 0, W, H);

      time += 0.016;
      dashOffset -= 0.4;

      // Background stars
      bgStars.forEach(s => {
        const twinkle = 0.3 + Math.sin(time * s.twinkleSpeed * 60 + s.twinkleOffset) * 0.35 + 0.35;
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, ${twinkle * s.brightness})`;
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw path progressively
      if (drawProgress < 1) {
        drawProgress = Math.min(1, drawProgress + drawSpeed);
      }

      const drawnCount = Math.floor(drawProgress * pathPoints.length);

      // --- Dotted path ---
      if (drawnCount > 1) {
        ctx.save();
        ctx.setLineDash([8, 6]);
        ctx.lineDashOffset = dashOffset;
        ctx.strokeStyle = 'rgba(255, 107, 138, 0.4)';
        ctx.lineWidth = 2;
        ctx.shadowColor = 'rgba(255, 107, 138, 0.3)';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.moveTo(pathPoints[0].x, pathPoints[0].y);
        for (let i = 1; i < drawnCount; i++) {
          ctx.lineTo(pathPoints[i].x, pathPoints[i].y);
        }
        ctx.stroke();
        ctx.restore();
      }

      // --- City markers ---
      // Tarkwa
      drawCityMarker(tarkwa.x, tarkwa.y, '🇬🇭', time);
      // Reading
      if (drawProgress >= 1) {
        drawCityMarker(reading.x, reading.y, '🇬🇧', time);
      }

      // --- Traveling hearts ---
      if (drawProgress >= 1) {
        heartSpawnTimer += 0.016;
        if (heartSpawnTimer > 1.8) { // spawn every ~1.8s
          heartSpawnTimer = 0;
          spawnHeart();
        }
      }

      for (let i = hearts.length - 1; i >= 0; i--) {
        const h = hearts[i];
        h.t += h.speed;

        if (h.t >= 1) {
          // Burst effect at destination
          spawnArrivalSparkle(reading.x, reading.y);
          hearts.splice(i, 1);
          continue;
        }

        const pos = bezierPoint(h.t, tarkwa, cp1, cp2, reading);
        const wobbleY = Math.sin(time * 3 + h.wobble) * h.wobbleAmp;

        ctx.save();
        ctx.globalAlpha = h.opacity;
        ctx.font = `${h.size}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(255, 107, 138, 0.6)';
        ctx.shadowBlur = 12;
        ctx.fillText('❤️', pos.x, pos.y + wobbleY);
        ctx.restore();
      }

      // Sparkles
      updateSparkles();

      requestAnimationFrame(animate);
    }

    // City marker with flag + glow ring
    function drawCityMarker(x, y, flag, t) {
      // Pulsing ring
      const ringSize = 18 + Math.sin(t * 2) * 4;
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, ringSize, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 107, 138, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.shadowColor = 'rgba(255, 107, 138, 0.4)';
      ctx.shadowBlur = 12;
      ctx.stroke();
      ctx.restore();

      // Inner dot
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#ff6b8a';
      ctx.shadowColor = '#ff6b8a';
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.restore();

      // Flag emoji
      ctx.save();
      ctx.font = '20px serif';
      ctx.textAlign = 'center';
      ctx.fillText(flag, x, y - 28);
      ctx.restore();
    }

    // Arrival sparkles
    const sparkles = [];
    function spawnArrivalSparkle(x, y) {
      for (let i = 0; i < 8; i++) {
        const angle = (Math.PI * 2 / 8) * i + Math.random() * 0.3;
        sparkles.push({
          x, y,
          vx: Math.cos(angle) * (2 + Math.random() * 2),
          vy: Math.sin(angle) * (2 + Math.random() * 2),
          life: 1,
          size: 2 + Math.random() * 2,
          hue: 330 + Math.random() * 40,
        });
      }
    }

    function updateSparkles() {
      for (let i = sparkles.length - 1; i >= 0; i--) {
        const s = sparkles[i];
        s.x += s.vx;
        s.y += s.vy;
        s.life -= 0.03;
        if (s.life <= 0) { sparkles.splice(i, 1); continue; }
        ctx.save();
        ctx.globalAlpha = s.life;
        ctx.fillStyle = `hsla(${s.hue}, 100%, 75%, ${s.life})`;
        ctx.shadowColor = `hsla(${s.hue}, 100%, 70%, 0.6)`;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * s.life, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    animate();
  }
}


/* ═══════════════════════════════════════════════════
   19. TIME-AWARE GREETING ☀️🌙
       Detects Ama's local time in Reading, UK
   ═══════════════════════════════════════════════════ */
function initTimeGreeting() {
  const iconEl = document.getElementById('time-icon');
  const textEl = document.getElementById('time-text');
  if (!iconEl || !textEl) return;

  // Get current time in Reading, UK (Europe/London handles GMT/BST)
  const now = new Date();
  const options = { timeZone: 'Europe/London', hour: '2-digit', hour12: false };
  const hourStr = new Intl.DateTimeFormat('en-GB', options).format(now);
  const hour = parseInt(hourStr, 10);

  let icon, greeting, bodyClass;

  if (hour >= 5 && hour < 12) {
    // Morning 5am–11:59am
    icon = '☀️';
    greeting = 'Good morning, my love ☀️';
    bodyClass = 'time-morning';
  } else if (hour >= 12 && hour < 17) {
    // Afternoon 12pm–4:59pm
    icon = '🌤️';
    greeting = 'Good afternoon, Ama 🌤️';
    bodyClass = 'time-afternoon';
  } else if (hour >= 17 && hour < 21) {
    // Evening 5pm–8:59pm
    icon = '🌅';
    greeting = 'Good evening, beautiful 🌅';
    bodyClass = 'time-evening';
  } else {
    // Night 9pm–4:59am
    icon = '🌙';
    greeting = 'Sweet dreams, Ama 🌙';
    bodyClass = 'time-night';
  }

  iconEl.textContent = icon;
  textEl.textContent = greeting;
  document.body.classList.add(bodyClass);

  // Apply subtle tint to main-content background
  const mainContent = document.getElementById('main-content');
  if (mainContent && bodyClass) {
    mainContent.style.background = `var(--time-gradient, linear-gradient(180deg, #1a0a10 0%, #2d0a1a 20%, #1a0a10 40%, #2d0a1a 60%, #1a0a10 80%, #2d0a1a 100%))`;
  }
}


/* ═══════════════════════════════════════════════════
   21. PHOTO PUZZLE 🧩
   ═══════════════════════════════════════════════════ */
function initPhotoPuzzle() {
  const board = document.getElementById('puzzle-board');
  const tray = document.getElementById('puzzle-tray');
  const startBtn = document.getElementById('puzzle-start');
  const completeEl = document.getElementById('puzzle-complete');
  if (!board || !startBtn || !tray) return;

  const imgSrc = 'herpictures/photo2.jpg';
  const GRID = 3;
  let boardSize = 0;
  const pieceSize = () => boardSize / GRID;
  let pieces = [];
  let placedCount = 0;
  let dragging = null;
  let dragOffset = { x: 0, y: 0 };

  startBtn.addEventListener('click', () => {
    startBtn.classList.add('hidden');
    completeEl.classList.add('hidden');
    placedCount = 0;
    pieces = [];
    board.innerHTML = '';
    tray.innerHTML = '';
    tray.classList.add('active');
    boardSize = board.offsetWidth;
    board.style.height = boardSize + 'px';
    buildPuzzle();
  });

  function buildPuzzle() {
    const ps = pieceSize();

    // Draw grid guide slots on the board
    for (let r = 0; r < GRID; r++) {
      for (let c = 0; c < GRID; c++) {
        const slot = document.createElement('div');
        slot.classList.add('puzzle-slot');
        slot.style.width = ps + 'px';
        slot.style.height = ps + 'px';
        slot.style.left = c * ps + 'px';
        slot.style.top = r * ps + 'px';
        board.appendChild(slot);
      }
    }

    // Create all 9 pieces
    const allPositions = [];
    for (let row = 0; row < GRID; row++) {
      for (let col = 0; col < GRID; col++) {
        allPositions.push({ row, col });
      }
    }

    // Shuffle order for tray placement
    const shuffled = [...allPositions].sort(() => Math.random() - 0.5);

    // Calculate tray layout: arrange pieces in a grid inside the tray with spacing
    const trayW = tray.offsetWidth;
    const trayH = tray.offsetHeight;
    const trayPieceScale = Math.min((trayW - 30) / (GRID * ps + 20), (trayH - 10) / (Math.ceil(GRID * GRID / GRID) * ps + 10), 0.38);
    const smallPs = Math.floor(ps * trayPieceScale);
    const trayCols = Math.min(5, Math.floor((trayW - 10) / (smallPs + 8)));

    shuffled.forEach((pos, idx) => {
      const piece = document.createElement('div');
      piece.classList.add('puzzle-piece', 'in-tray');
      piece.dataset.row = pos.row;
      piece.dataset.col = pos.col;
      piece.dataset.inTray = 'true';

      // Full-size piece (will be placed on board at full size)
      piece.style.width = smallPs + 'px';
      piece.style.height = smallPs + 'px';
      piece.style.backgroundImage = `url(${imgSrc})`;
      piece.style.backgroundSize = `${smallPs * GRID}px ${smallPs * GRID}px`;
      piece.style.backgroundPosition = `-${pos.col * smallPs}px -${pos.row * smallPs}px`;

      // Arrange in tray grid with no overlap
      const trayCol = idx % trayCols;
      const trayRow = Math.floor(idx / trayCols);
      const spacingX = (trayW - trayCols * smallPs) / (trayCols + 1);
      const spacingY = 10;
      const tx = spacingX + trayCol * (smallPs + spacingX);
      const ty = spacingY + trayRow * (smallPs + spacingY);
      piece.style.left = tx + 'px';
      piece.style.top = ty + 'px';

      piece.addEventListener('pointerdown', onPointerDown);
      tray.appendChild(piece);
      pieces.push(piece);
    });
  }

  function onPointerDown(e) {
    const piece = e.currentTarget;
    if (piece.classList.contains('placed')) return;
    e.preventDefault();
    piece.setPointerCapture(e.pointerId);
    piece.style.touchAction = 'none';

    // If piece is in tray, move it to the board
    if (piece.dataset.inTray === 'true') {
      const trayRect = tray.getBoundingClientRect();
      const boardRect = board.getBoundingClientRect();
      const pieceRect = piece.getBoundingClientRect();

      // Calculate where piece is on screen, place it at same visual position relative to board
      const ps = pieceSize();
      piece.style.width = ps + 'px';
      piece.style.height = ps + 'px';
      piece.style.backgroundSize = `${boardSize}px ${boardSize}px`;
      const col = parseInt(piece.dataset.col);
      const row = parseInt(piece.dataset.row);
      piece.style.backgroundPosition = `-${col * ps}px -${row * ps}px`;

      // Position on board — center of where it was visually
      let newX = (pieceRect.left + pieceRect.width / 2) - boardRect.left - ps / 2;
      let newY = (pieceRect.top + pieceRect.height / 2) - boardRect.top - ps / 2;
      newX = Math.max(0, Math.min(newX, boardSize - ps));
      newY = Math.max(0, Math.min(newY, boardSize - ps));
      piece.style.left = newX + 'px';
      piece.style.top = newY + 'px';

      piece.dataset.inTray = 'false';
      piece.classList.remove('in-tray');
      board.appendChild(piece);

      dragOffset.x = e.clientX - boardRect.left - newX;
      dragOffset.y = e.clientY - boardRect.top - newY;
    } else {
      const boardRect = board.getBoundingClientRect();
      dragOffset.x = e.clientX - boardRect.left - parseFloat(piece.style.left);
      dragOffset.y = e.clientY - boardRect.top - parseFloat(piece.style.top);
    }

    dragging = piece;
    piece.classList.add('dragging');

    piece.addEventListener('pointermove', onPointerMove);
    piece.addEventListener('pointerup', onPointerUp);
  }

  function onPointerMove(e) {
    if (!dragging) return;
    const boardRect = board.getBoundingClientRect();
    const ps = pieceSize();
    let x = e.clientX - boardRect.left - dragOffset.x;
    let y = e.clientY - boardRect.top - dragOffset.y;
    x = Math.max(0, Math.min(x, boardSize - ps));
    y = Math.max(0, Math.min(y, boardSize - ps));
    dragging.style.left = x + 'px';
    dragging.style.top = y + 'px';
  }

  function onPointerUp(e) {
    if (!dragging) return;
    const piece = dragging;
    piece.classList.remove('dragging');
    piece.style.touchAction = 'auto';
    piece.removeEventListener('pointermove', onPointerMove);
    piece.removeEventListener('pointerup', onPointerUp);

    // Check if piece is near its correct position
    const ps = pieceSize();
    const correctX = parseInt(piece.dataset.col) * ps;
    const correctY = parseInt(piece.dataset.row) * ps;
    const curX = parseFloat(piece.style.left);
    const curY = parseFloat(piece.style.top);
    const snapThreshold = ps * 0.35;

    if (Math.abs(curX - correctX) < snapThreshold && Math.abs(curY - correctY) < snapThreshold) {
      // Snap into place
      piece.style.left = correctX + 'px';
      piece.style.top = correctY + 'px';
      piece.classList.add('placed');
      piece.style.transition = 'left 0.2s ease, top 0.2s ease';
      placedCount++;

      if (placedCount === GRID * GRID) {
        onPuzzleComplete();
      }
    }

    dragging = null;
  }

  function onPuzzleComplete() {
    // Hide tray
    tray.classList.remove('active');
    // Remove guide slots
    board.querySelectorAll('.puzzle-slot').forEach(s => s.remove());

    // Brief delay then show completion
    setTimeout(() => {
      // Flash all pieces
      pieces.forEach(p => {
        p.style.border = '1px solid rgba(255, 107, 138, 0.4)';
        p.style.boxShadow = '0 0 20px rgba(255, 107, 138, 0.3)';
      });

      setTimeout(() => {
        // Fade away borders to show full image
        pieces.forEach(p => {
          p.style.border = 'none';
          p.style.boxShadow = 'none';
          p.style.borderRadius = '0';
        });
        board.style.borderRadius = '12px';
        board.style.overflow = 'hidden';
        board.style.border = '2px solid rgba(255, 107, 138, 0.3)';
        board.style.boxShadow = '0 0 40px rgba(255, 107, 138, 0.2)';

        completeEl.classList.remove('hidden');
      }, 800);
    }, 300);
  }
}


/* ═══════════════════════════════════════════════════
   22. VIRTUAL HUG 🤗
   ═══════════════════════════════════════════════════ */
function initVirtualHug() {
  const btn = document.getElementById('hug-btn');
  const ringFill = document.getElementById('hug-ring-fill');
  const msgEl = document.getElementById('hug-message');
  const hugWrap = document.querySelector('.hug-wrap');
  const hintEl = document.querySelector('.hug-hint');
  if (!btn || !ringFill) return;

  const HOLD_DURATION = 2500; // ms to complete hug
  const CIRCUMFERENCE = 2 * Math.PI * 54; // r=54
  let holdTimer = null;
  let startTime = 0;
  let animFrame = null;
  let completed = false;

  const messages = [
    "I'm hugging you right now, Ama 🤗",
    "Feel my arms around you 💖",
    "You're safe with me, always 🫂",
    "This hug crosses every mile 🌍❤️",
    "I never want to let go 💕",
  ];

  function startHug(e) {
    if (completed) resetHug();
    // Don't preventDefault immediately — let the pointer capture handle it
    startTime = Date.now();
    btn.classList.add('hugging');
    btn.setPointerCapture(e.pointerId);
    if (hintEl) hintEl.style.opacity = '0';

    function updateRing() {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / HOLD_DURATION, 1);
      const offset = CIRCUMFERENCE * (1 - progress);
      ringFill.style.strokeDashoffset = offset;

      // Spawn heart particles during hold
      if (Math.random() < 0.15) spawnHugHeart(btn);

      if (progress >= 1) {
        completeHug();
        return;
      }
      animFrame = requestAnimationFrame(updateRing);
    }
    animFrame = requestAnimationFrame(updateRing);
  }

  function stopHug(e) {
    if (completed) return;
    cancelAnimationFrame(animFrame);
    btn.classList.remove('hugging');

    // Animate ring back to 0
    ringFill.style.transition = 'stroke-dashoffset 0.5s ease';
    ringFill.style.strokeDashoffset = CIRCUMFERENCE;
    setTimeout(() => {
      ringFill.style.transition = 'stroke-dashoffset 0.1s linear';
    }, 500);
  }

  function completeHug() {
    completed = true;
    btn.classList.remove('hugging');
    btn.classList.add('complete');

    // Arms wrap around
    hugWrap.classList.add('arms-visible');

    // Vibrate if available
    if (navigator.vibrate) navigator.vibrate([100, 50, 150, 50, 200]);

    // Show message
    const msg = messages[Math.floor(Math.random() * messages.length)];
    msgEl.textContent = msg;
    msgEl.classList.add('show');

    // Burst of hearts
    for (let i = 0; i < 12; i++) {
      setTimeout(() => spawnHugHeart(btn), i * 80);
    }

    // Change emoji
    const emoji = btn.querySelector('.hug-emoji');
    if (emoji) emoji.textContent = '🤗';
  }

  function resetHug() {
    completed = false;
    btn.classList.remove('complete');
    hugWrap.classList.remove('arms-visible');
    msgEl.classList.remove('show');
    msgEl.textContent = '';
    ringFill.style.strokeDashoffset = CIRCUMFERENCE;
    const emoji = btn.querySelector('.hug-emoji');
    if (emoji) emoji.textContent = '🫂';
    if (hintEl) hintEl.style.opacity = '0.5';
  }

  function spawnHugHeart(anchor) {
    const hearts = ['❤️', '💖', '💕', '💗', '🩷', '🤗'];
    const rect = anchor.getBoundingClientRect();
    const h = document.createElement('div');
    h.classList.add('hug-heart-particle');
    h.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    h.style.left = (rect.left + rect.width / 2 + (Math.random() - 0.5) * 60) + 'px';
    h.style.top = (rect.top + rect.height / 2) + 'px';
    h.style.fontSize = (0.8 + Math.random() * 1) + 'rem';
    h.style.setProperty('--duration', (1.5 + Math.random() * 1.5) + 's');
    document.body.appendChild(h);
    setTimeout(() => h.remove(), 3000);
  }

  // Pointer events for press-and-hold (works on both touch & mouse)
  btn.addEventListener('pointerdown', startHug);
  btn.addEventListener('pointerup', stopHug);
  btn.addEventListener('pointerleave', stopHug);
  btn.addEventListener('pointercancel', stopHug);
}


/* ═══════════════════════════════════════════════════
   20. WINDOW RESIZE HANDLER
   ═══════════════════════════════════════════════════ */
window.addEventListener('resize', () => {
  const canvas = document.getElementById('confetti-canvas');
  if (canvas && !yesScreen.classList.contains('hidden')) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
});
