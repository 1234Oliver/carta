/* ============================================================
   CARTA DE AMOR — script.js
   ✏️  CONFIGURACIÓN PRINCIPAL — cambia aquí tus datos
   ============================================================ */

const CONFIG = {

  /* ── Contraseña de acceso ─────────────────────────────── */
  password: "11-08-2025",        // ✏️ CAMBIA por tu contraseña secreta

  /* ── Fecha de inicio de la relación ──────────────────── */
  // Formato: new Date(año, mes-1, día, hora, minuto)
  // Ejemplo: 14 de febrero de 2023 → new Date(2023, 1, 14, 0, 0)
  startDate: new Date(2025, 7, 11, 0, 0),  // ✏️ CAMBIA esta fecha

  /* ── Frases románticas rotativas ─────────────────────── */
  // ✏️ Agrega, edita o elimina frases aquí
  quotes: [
    "Eres la respuesta a todas las preguntas que aún no sabía que tenía.",
    "Contigo, incluso el silencio tiene algo que decir.",
    "Mi lugar favorito en el mundo es a tu lado.",
    "Eres el tipo de amor del que escriben canciones.",
    "Gracias por ser mi persona favorita en todo el universo.",
    "En un mar de gente, mis ojos siempre te buscan a ti.",
    "Amarte es lo más fácil y lo más bonito que he hecho.",
    "Eres mi hogar, mi calma, mi todo.",
  ],

};

/* ============================================================
   UTILIDADES
   ============================================================ */
const $ = (s, ctx = document) => ctx.querySelector(s);
const $$ = (s, ctx = document) => [...ctx.querySelectorAll(s)];
const rand = (min, max) => Math.random() * (max - min) + min;

/* ============================================================
   PARTÍCULAS DE FONDO (canvas)
   ============================================================ */
(function initParticles() {
  const canvas = $('#particles-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function Particle() {
    this.reset();
  }
  Particle.prototype.reset = function () {
    this.x = rand(0, W);
    this.y = rand(0, H);
    this.r = rand(.6, 2.2);
    this.alpha = rand(.08, .45);
    this.speed = rand(.1, .4);
    this.drift = rand(-.2, .2);
    this.hue = rand(330, 360); // rosados/rojo
  };
  Particle.prototype.update = function () {
    this.y -= this.speed;
    this.x += this.drift;
    this.alpha -= .0005;
    if (this.y < 0 || this.alpha <= 0) this.reset();
  };
  Particle.prototype.draw = function () {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${this.hue}, 80%, 70%, ${this.alpha})`;
    ctx.fill();
  };

  function init() {
    resize();
    particles = Array.from({ length: 90 }, () => new Particle());
    window.addEventListener('resize', resize);
    loop();
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }

  window.addEventListener('load', init);
})();

/* ============================================================
   PANTALLA DE BLOQUEO — TABS
   ============================================================ */
$$('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    $$('.tab-btn').forEach(b => b.classList.remove('active'));
    $$('.tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    $(`#tab-${btn.dataset.tab}`).classList.add('active');
  });
});

/* ============================================================
   CORAZONES EN LA PANTALLA DE BLOQUEO
   ============================================================ */
(function lockHearts() {
  const container = $('#lock-hearts');
  const symbols = ['❤️', '🌹', '✨', '💕', '🌸'];
  for (let i = 0; i < 20; i++) {
    const el = document.createElement('div');
    el.className = 'petal';
    el.textContent = symbols[Math.floor(rand(0, symbols.length))];
    el.style.cssText = `
      left: ${rand(0, 100)}%;
      font-size: ${rand(.8, 1.8)}rem;
      animation-duration: ${rand(6, 16)}s;
      animation-delay: ${rand(0, 10)}s;
    `;
    container.appendChild(el);
  }
})();

/* ============================================================
   LÓGICA DE DESBLOQUEO
   ============================================================ */
function unlockAndTransition() {
  const overlay = $('#cinematic-overlay');
  const lockScreen = $('#lock-screen');
  const mainLetter = $('#main-letter');

  // Crear corazones en el burst cinematográfico
  const burst = $('#cin-burst');
  for (let i = 0; i < 60; i++) {
    const h = document.createElement('div');
    h.textContent = ['❤️', '💕', '✨', '🌹', '💫'][Math.floor(rand(0, 5))];
    h.style.cssText = `
      position:absolute;
      left:${rand(5,95)}%;
      top:${rand(5,95)}%;
      font-size:${rand(1.2,2.8)}rem;
      animation: cinHeart ${rand(0.8,2)}s ease-out ${rand(0,.5)}s both;
      opacity:0;
    `;
    burst.appendChild(h);
  }

  // Inyectar keyframe para los corazones del burst
  if (!document.getElementById('cin-heart-style')) {
    const s = document.createElement('style');
    s.id = 'cin-heart-style';
    s.textContent = `
      @keyframes cinHeart {
        0%   { transform: scale(0) rotate(0deg); opacity: 0; }
        40%  { transform: scale(1.3) rotate(20deg); opacity: 1; }
        100% { transform: scale(.8) rotate(-10deg) translateY(-30px); opacity: 0; }
      }
    `;
    document.head.appendChild(s);
  }

  // Mostrar overlay
  overlay.classList.add('active');

  // Ocultar lock-screen con fade
  lockScreen.style.transition = 'opacity .8s ease';
  lockScreen.style.opacity = '0';
  setTimeout(() => lockScreen.style.display = 'none', 800);

  // Mostrar carta después de 2.5s
  setTimeout(() => {
    overlay.classList.add('fade-out');
    mainLetter.classList.remove('hidden');
    initLetterFeatures();
    setTimeout(() => {
      overlay.style.display = 'none';
    }, 1200);
  }, 2500);
}

/* ── Contraseña ──────────────────────────────────────────── */
$('#unlock-btn').addEventListener('click', checkPassword);
$('#password-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') checkPassword();
});

function checkPassword() {
  const val = $('#password-input').value.trim();
  const err = $('#error-msg');

  // Normalizar: minúsculas y sin tildes para comparación flexible
  const normalize = s => s.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  if (normalize(val) === normalize(CONFIG.password)) {
    err.classList.remove('show');
    unlockAndTransition();
  } else {
    err.classList.remove('show');
    void err.offsetWidth; // reset animation
    err.classList.add('show');
    $('#password-input').value = '';
  }
}

/* ── Huella digital ──────────────────────────────────────── */
let fpTimeout;
$('#fp-btn').addEventListener('click', startFingerprint);
$('#fingerprint-wrap').addEventListener('click', startFingerprint);

function startFingerprint() {
  const wrap = $('#fingerprint-wrap');
  const text = $('#fp-text');

  if (wrap.classList.contains('scanning') || wrap.classList.contains('accepted')) return;

  clearTimeout(fpTimeout);
  wrap.classList.add('scanning');
  text.textContent = 'Escaneando…';

  fpTimeout = setTimeout(() => {
    wrap.classList.remove('scanning');
    wrap.classList.add('accepted');
    text.textContent = '✓ Huella reconocida';
    text.style.color = 'var(--gold)';
    setTimeout(unlockAndTransition, 900);
  }, 2200);
}

/* ============================================================
   INICIAR FUNCIONES DE LA CARTA
   ============================================================ */
function initLetterFeatures() {
  initScrollReveal();
  initPetals();
  initQuotes();
  initGallery();
  initCounter();
  initFinalStars();
  initHeartBtn();
  initMusicPlayer();
  initHeartsRain();
}

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
function initScrollReveal() {
  // Activar inmediatamente los del hero
  requestAnimationFrame(() => {
    $$('.hero-section .fade-up').forEach(el => el.classList.add('visible'));
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: .15 });

  $$('.fade-up:not(.hero-section .fade-up)').forEach(el => io.observe(el));
}

/* ============================================================
   PÉTALOS FLOTANTES (HERO)
   ============================================================ */
function initPetals() {
  const container = $('#petals');
  const symbols = ['🌸', '🌹', '❤️', '✨', '💕', '🌷'];
  for (let i = 0; i < 22; i++) {
    const el = document.createElement('div');
    el.className = 'petal';
    el.textContent = symbols[Math.floor(rand(0, symbols.length))];
    el.style.cssText = `
      left: ${rand(0, 100)}%;
      font-size: ${rand(.8, 1.8)}rem;
      animation-duration: ${rand(8, 20)}s;
      animation-delay: ${rand(0, 12)}s;
    `;
    container.appendChild(el);
  }
}

/* ============================================================
   FRASES ROTATIVAS
   ============================================================ */
function initQuotes() {
  const quotes = CONFIG.quotes;
  const el = $('#rotating-quote');
  const dotsContainer = $('#quote-dots');
  let current = 0;

  // Crear dots
  quotes.forEach((_, i) => {
    const d = document.createElement('div');
    d.className = 'qdot' + (i === 0 ? ' active' : '');
    d.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(d);
  });

  function goTo(idx) {
    el.classList.add('fade');
    setTimeout(() => {
      current = idx;
      el.textContent = quotes[current];
      el.classList.remove('fade');
      $$('.qdot').forEach((d, i) => d.classList.toggle('active', i === current));
    }, 500);
  }

  el.textContent = quotes[0];
  setInterval(() => goTo((current + 1) % quotes.length), 5000);
}

/* ============================================================
   GALERÍA POLAROID (drag + botones)
   ============================================================ */
function initGallery() {
  const track = $('#gallery-track');
  const itemW = () => track.querySelector('.polaroid')?.offsetWidth + 28 || 268;

  $('#gnext').addEventListener('click', () => {
    track.scrollBy({ left: itemW(), behavior: 'smooth' });
  });
  $('#gprev').addEventListener('click', () => {
    track.scrollBy({ left: -itemW(), behavior: 'smooth' });
  });

  // Drag to scroll
  let startX, startScroll, dragging = false;
  track.addEventListener('mousedown', e => {
    dragging = true;
    startX = e.pageX - track.offsetLeft;
    startScroll = track.scrollLeft;
    track.style.cursor = 'grabbing';
  });
  window.addEventListener('mouseup', () => { dragging = false; track.style.cursor = 'grab'; });
  track.addEventListener('mousemove', e => {
    if (!dragging) return;
    const x = e.pageX - track.offsetLeft;
    track.scrollLeft = startScroll - (x - startX);
  });
}

/* ============================================================
   CONTADOR DE TIEMPO
   ============================================================ */
function initCounter() {
  function update() {
    const now   = new Date();
    const start = CONFIG.startDate;

    let years  = now.getFullYear() - start.getFullYear();
    let months = now.getMonth()    - start.getMonth();
    let days   = now.getDate()     - start.getDate();

    // Ajustar si el día actual es menor al día de inicio
    if (days < 0) {
      months--;
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prevMonth.getDate();
    }

    // Ajustar si los meses quedan negativos
    if (months < 0) {
      years--;
      months += 12;
    }

    // Horas, minutos y segundos del día actual
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(),
                                  start.getHours(), start.getMinutes(), start.getSeconds());
    let ms    = now - startOfToday;
    if (ms < 0) ms += 24 * 3600 * 1000;

    const hours = Math.floor(ms / (3600 * 1000)); ms -= hours * 3600 * 1000;
    const mins  = Math.floor(ms / (60   * 1000)); ms -= mins  *   60 * 1000;
    const secs  = Math.floor(ms / 1000);

    const pad = n => String(n).padStart(2, '0');
    $('#c-years').textContent  = years;
    $('#c-months').textContent = months;
    $('#c-days').textContent   = days;
    $('#c-hours').textContent  = pad(hours);
    $('#c-mins').textContent   = pad(mins);
    $('#c-secs').textContent   = pad(secs);
  }
  update();
  setInterval(update, 1000);
}

/* ============================================================
   ESTRELLAS SECCIÓN FINAL
   ============================================================ */
function initFinalStars() {
  const container = $('#final-stars');
  for (let i = 0; i < 80; i++) {
    const s = document.createElement('div');
    s.className = 'star-el';
    const size = rand(.8, 2.8);
    s.style.cssText = `
      width:${size}px; height:${size}px;
      left:${rand(0, 100)}%;
      top:${rand(0, 100)}%;
      animation-duration:${rand(2, 6)}s;
      animation-delay:${rand(0, 5)}s;
    `;
    container.appendChild(s);
  }
}

/* ============================================================
   BOTÓN "TE AMO"
   ============================================================ */
function initHeartBtn() {
  const btn    = $('#love-btn');
  const burst  = $('#love-burst');
  const rain   = $('#hearts-rain');

  btn.addEventListener('click', () => {
    // Burst local
    for (let i = 0; i < 24; i++) {
      const h = document.createElement('span');
      h.textContent = ['❤️','💕','💖','✨'][Math.floor(rand(0,4))];
      const angle = rand(0, 360);
      const dist  = rand(60, 180);
      h.style.cssText = `
        position:absolute;
        left:50%; top:50%;
        font-size:${rand(1,2.2)}rem;
        transform:translate(-50%,-50%);
        animation: burstHeart .9s ease-out ${rand(0,.25)}s both;
        --dx:${Math.cos(angle*Math.PI/180)*dist}px;
        --dy:${Math.sin(angle*Math.PI/180)*dist}px;
      `;
      burst.appendChild(h);
      setTimeout(() => h.remove(), 1200);
    }

    // Lluvia de corazones
    rainHearts(rain, 30);
  });

  // Inyectar keyframe
  const s = document.createElement('style');
  s.textContent = `
    @keyframes burstHeart {
      0%   { transform: translate(-50%,-50%) scale(0); opacity:1; }
      100% { transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(1); opacity:0; }
    }
  `;
  document.head.appendChild(s);
}

/* ============================================================
   LLUVIA DE CORAZONES
   ============================================================ */
function initHeartsRain() {
  // Lluvia pasiva continua
  const container = $('#hearts-rain');
  setInterval(() => rainHearts(container, 1), 1800);
}

function rainHearts(container, count) {
  const symbols = ['❤️','💕','🌹','💖','✨'];
  for (let i = 0; i < count; i++) {
    const h = document.createElement('div');
    h.className = 'rain-heart';
    h.textContent = symbols[Math.floor(rand(0, symbols.length))];
    const duration = rand(3.5, 7);
    h.style.cssText = `
      left: ${rand(0, 100)}%;
      font-size: ${rand(.9, 1.8)}rem;
      animation: rainFall ${duration}s linear ${rand(0, .5)}s both;
    `;
    container.appendChild(h);
    setTimeout(() => h.remove(), (duration + 1) * 1000);
  }
}

/* ============================================================
   REPRODUCTOR DE MÚSICA
   ============================================================ */
function initMusicPlayer() {
  const audio    = $('#bg-music');
  const btn      = $('#music-btn');
  const info     = $('#music-info');
  let playing    = false;

  btn.addEventListener('click', () => {
    if (playing) {
      audio.pause();
      playing = false;
      info.classList.remove('show');
      btn.querySelector('.music-icon').textContent = '🎵';
    } else {
      audio.play().catch(() => {
        // Si no hay archivo de audio, igual mostramos la UI
        console.info('Sin archivo de audio. Coloca tu MP3 en music/cancion.mp3');
      });
      playing = true;
      info.classList.add('show');
      btn.querySelector('.music-icon').textContent = '🎶';
    }
  });

  // Autoplay silencioso (puede requerir interacción del usuario)
  document.addEventListener('click', function autoplay() {
    if (!playing && audio.paused) {
      audio.play().catch(() => {});
      playing = true;
      info.classList.add('show');
      btn.querySelector('.music-icon').textContent = '🎶';
    }
    document.removeEventListener('click', autoplay);
  }, { once: false });
}
