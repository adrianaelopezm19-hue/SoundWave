/* ===== SOUNDWAVE CYBERPUNK — script.js ===== */

document.addEventListener("DOMContentLoaded", () => {

  /* ================================================
     1. CANVAS DE PARTÍCULAS DE FONDO
  ================================================ */
  const canvas = document.getElementById("bg-canvas");
  const ctx    = canvas.getContext("2d");

  function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  const COLORS = ["#ff4fa3", "#bf00ff", "#00e5ff", "#ff80c0", "#d966ff"];

  class Particle {
    constructor() { this.reset(true); }
    reset(initial = false) {
      this.x  = Math.random() * canvas.width;
      this.y  = initial ? Math.random() * canvas.height : canvas.height + 10;
      this.r  = Math.random() * 1.8 + .4;
      this.vx = (Math.random() - .5) * .4;
      this.vy = -(Math.random() * .6 + .2);
      this.alpha  = Math.random() * .6 + .2;
      this.color  = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.twinkle = Math.random() * Math.PI * 2;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.twinkle += .04;
      this.alpha = (.4 + Math.sin(this.twinkle) * .3);
      if (this.y < -10) this.reset();
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle   = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur  = 8;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  const particles = Array.from({ length: 120 }, () => new Particle());

  // Líneas de grid cyberpunk
  function drawGrid() {
    ctx.save();
    ctx.strokeStyle = "rgba(255,79,163,0.04)";
    ctx.lineWidth   = 1;
    const step = 80;
    for (let x = 0; x < canvas.width; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    ctx.restore();
  }

  function animateCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animateCanvas);
  }
  animateCanvas();


  /* ================================================
     2. CURSOR PERSONALIZADO
  ================================================ */
  const cursor      = document.getElementById("cursor");
  const cursorTrail = document.getElementById("cursor-trail");

  if (cursor && cursorTrail) {
    document.addEventListener("mousemove", e => {
      cursor.style.left      = e.clientX + "px";
      cursor.style.top       = e.clientY  + "px";
      cursorTrail.style.left = e.clientX + "px";
      cursorTrail.style.top  = e.clientY  + "px";
    });
  }


  /* ================================================
     3. SONIDOS UI (Web Audio API — sin archivos externos)
  ================================================ */
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  let audioCtx = null;

  function getAudioCtx() {
    if (!audioCtx) audioCtx = new AudioCtx();
    return audioCtx;
  }

  // Sonido "click" suave tipo sci-fi
  function playClickSound() {
    try {
      const ac  = getAudioCtx();
      const osc = ac.createOscillator();
      const gain = ac.createGain();

      osc.connect(gain);
      gain.connect(ac.destination);

      osc.type      = "sine";
      osc.frequency.setValueAtTime(880, ac.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ac.currentTime + .12);

      gain.gain.setValueAtTime(.18, ac.currentTime);
      gain.gain.exponentialRampToValueAtTime(.001, ac.currentTime + .15);

      osc.start(ac.currentTime);
      osc.stop(ac.currentTime + .15);
    } catch(e) {}
  }

  // Sonido "play" — ascendente
  function playStartSound() {
    try {
      const ac   = getAudioCtx();
      const osc1 = ac.createOscillator();
      const osc2 = ac.createOscillator();
      const gain = ac.createGain();

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ac.destination);

      osc1.type = "triangle";
      osc2.type = "sine";

      osc1.frequency.setValueAtTime(330, ac.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(660, ac.currentTime + .18);
      osc2.frequency.setValueAtTime(550, ac.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(880, ac.currentTime + .18);

      gain.gain.setValueAtTime(.12, ac.currentTime);
      gain.gain.exponentialRampToValueAtTime(.001, ac.currentTime + .22);

      osc1.start(ac.currentTime); osc1.stop(ac.currentTime + .22);
      osc2.start(ac.currentTime); osc2.stop(ac.currentTime + .22);
    } catch(e) {}
  }

  // Sonido "pause" — descendente
  function playPauseSound() {
    try {
      const ac  = getAudioCtx();
      const osc = ac.createOscillator();
      const gain = ac.createGain();

      osc.connect(gain);
      gain.connect(ac.destination);

      osc.type = "triangle";
      osc.frequency.setValueAtTime(660, ac.currentTime);
      osc.frequency.exponentialRampToValueAtTime(220, ac.currentTime + .18);

      gain.gain.setValueAtTime(.12, ac.currentTime);
      gain.gain.exponentialRampToValueAtTime(.001, ac.currentTime + .2);

      osc.start(ac.currentTime);
      osc.stop(ac.currentTime + .2);
    } catch(e) {}
  }

  // Sonido hover en botones
  function playHoverSound() {
    try {
      const ac  = getAudioCtx();
      const osc = ac.createOscillator();
      const gain = ac.createGain();

      osc.connect(gain);
      gain.connect(ac.destination);

      osc.type = "sine";
      osc.frequency.setValueAtTime(1200, ac.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1800, ac.currentTime + .06);

      gain.gain.setValueAtTime(.05, ac.currentTime);
      gain.gain.exponentialRampToValueAtTime(.001, ac.currentTime + .07);

      osc.start(ac.currentTime);
      osc.stop(ac.currentTime + .07);
    } catch(e) {}
  }

  // Asignar hover sound a todos los botones y links
  document.querySelectorAll("button, a, .card").forEach(el => {
    el.addEventListener("mouseenter", playHoverSound);
  });


  /* ================================================
     4. HEADER SCROLL
  ================================================ */
  const header = document.getElementById("header");
  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 20);
  });


  /* ================================================
     5. MENÚ MÓVIL
  ================================================ */
  const menuToggle = document.getElementById("menuToggle");
  const nav        = document.getElementById("nav");

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      playClickSound();
      nav.classList.toggle("open");
      menuToggle.textContent = nav.classList.contains("open") ? "✕" : "☰";
    });

    nav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        menuToggle.textContent = "☰";
      });
    });
  }


  /* ================================================
     6. BOTÓN EXPLORAR
  ================================================ */
  const explorarBtn = document.querySelector(".explorar-btn");
  if (explorarBtn) {
    explorarBtn.addEventListener("click", () => {
      playClickSound();
      document.getElementById("biblioteca")?.scrollIntoView({ behavior: "smooth" });
    });
  }


  /* ================================================
     7. CONTACTO → WhatsApp
  ================================================ */
  const contactarBtn = document.querySelector(".contactar-btn");
  if (contactarBtn) {
    contactarBtn.addEventListener("click", () => {
      playClickSound();
      const msg = "Hola 👋 soy usuario de SoundWave, necesito soporte o ayuda.";
      window.open("https://wa.me/50375618860?text=" + encodeURIComponent(msg), "_blank");
    });
  }


  /* ================================================
     8. AUDIO PLAYER COMPLETO
  ================================================ */
  const audio        = new Audio();
  const player       = document.getElementById("player");
  const songName     = document.getElementById("songName");
  const progressBar  = document.getElementById("progress");
  const playPauseBtn = document.getElementById("playPause");
  const iconPlay     = document.getElementById("iconPlay");
  const iconPause    = document.getElementById("iconPause");
  const timeElapsed  = document.getElementById("timeElapsed");
  const timeDuration = document.getElementById("timeDuration");

  let currentCard = null;
  let currentBtn  = null;

  function fmt(secs) {
    if (!isFinite(secs)) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  function setPlayerIcon(playing) {
    iconPlay.style.display  = playing ? "none"  : "inline";
    iconPause.style.display = playing ? "inline" : "none";
  }

  function setCardIcon(btn, playing) {
    const path = btn.querySelector("svg path");
    if (!path) return;
    path.setAttribute("d", playing
      ? "M6 19h4V5H6v14zm8-14v14h4V5h-4z"
      : "M8 5v14l11-7z"
    );
  }

  function showPlayer() { player.classList.remove("player-hidden"); }

  // Progreso
  audio.addEventListener("timeupdate", () => {
    if (!audio.duration) return;
    const pct = (audio.currentTime / audio.duration) * 100;
    progressBar.value = pct;
    timeElapsed.textContent  = fmt(audio.currentTime);
    timeDuration.textContent = fmt(audio.duration);
  });

  // Scrubbing
  progressBar.addEventListener("input", () => {
    if (!audio.duration) return;
    audio.currentTime = (progressBar.value / 100) * audio.duration;
    playClickSound();
  });

  // Fin de canción
  audio.addEventListener("ended", () => {
    setPlayerIcon(false);
    if (currentBtn)  { setCardIcon(currentBtn, false); currentBtn.classList.remove("playing"); }
    if (currentCard) { currentCard.classList.remove("active"); }
    progressBar.value = 0;
    timeElapsed.textContent = "0:00";
  });

  // Play/Pause desde el player fijo
  playPauseBtn.addEventListener("click", () => {
    if (!audio.src) return;
    if (audio.paused) {
      audio.play();
      playStartSound();
      setPlayerIcon(true);
      if (currentBtn)  { setCardIcon(currentBtn, true); currentBtn.classList.add("playing"); }
      if (currentCard) { currentCard.classList.add("active"); }
    } else {
      audio.pause();
      playPauseSound();
      setPlayerIcon(false);
      if (currentBtn)  { setCardIcon(currentBtn, false); currentBtn.classList.remove("playing"); }
      if (currentCard) { currentCard.classList.remove("active"); }
    }
  });

  // Play desde cards
  function activateSong(card, btn) {
    const src    = card.getAttribute("data-audio");
    const title  = card.querySelector("h3").textContent;
    const artist = card.querySelector(".card-artist")?.textContent || "";

    // Misma canción → toggle
    if (audio.src.endsWith(src)) {
      if (audio.paused) {
        audio.play();
        playStartSound();
        setPlayerIcon(true);
        setCardIcon(btn, true);
        btn.classList.add("playing");
        btn.classList.remove("paused");
        card.classList.add("active");
      } else {
        audio.pause();
        playPauseSound();
        setPlayerIcon(false);
        setCardIcon(btn, false);
        btn.classList.remove("playing");
        btn.classList.add("paused");
        card.classList.remove("active");
      }
      return;
    }

    // Nueva canción — resetear anterior
    if (currentBtn && currentBtn !== btn) {
      setCardIcon(currentBtn, false);
      currentBtn.classList.remove("playing", "paused");
    }
    if (currentCard && currentCard !== card) {
      currentCard.classList.remove("active");
    }

    audio.src = src;
    audio.currentTime = 0;
    audio.play();
    playStartSound();

    setPlayerIcon(true);
    setCardIcon(btn, true);
    btn.classList.add("playing");
    btn.classList.remove("paused");
    card.classList.add("active");

    songName.textContent = `${title} — ${artist}`;
    showPlayer();

    currentBtn  = btn;
    currentCard = card;
  }

  document.querySelectorAll(".play-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      activateSong(btn.closest(".card"), btn);
    });
  });

  document.querySelectorAll(".card").forEach(card => {
    card.addEventListener("click", () => {
      activateSong(card, card.querySelector(".play-btn"));
    });
  });


  /* ================================================
     9. EFECTO PARALLAX AL MOVER EL MOUSE
  ================================================ */
  const headphone = document.querySelector(".headphone-svg");

  document.addEventListener("mousemove", e => {
    if (!headphone) return;
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;  // -1 a 1
    const dy = (e.clientY - cy) / cy;

    headphone.style.transform = `translateY(${-16 * (1 + dy * .3)}px) rotate(${dx * 5}deg)`;
  });

  document.addEventListener("mouseleave", () => {
    if (headphone) headphone.style.transform = "";
  });

});