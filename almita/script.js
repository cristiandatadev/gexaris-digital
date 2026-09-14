/* =========================================================
   MIS XV AÑOS — ALMITA
   Lógica de la invitación
========================================================= */

/* ---------------------------------------------------------
   CONFIGURA AQUÍ tus datos — todo lo demás se genera solo
--------------------------------------------------------- */
const CONFIG = {
  nombre: "Almita",
  fecha: "Sábado 3 de octubre",
  hora: "5:00 p. m.",
  lugar: "Restaurante El Fogón Zabdi",
  direccion: "Calzada 15 de Septiembre, Santa Lucía Cotzumalguapa, Guatemala",
  whatsapp: "18176553997",                       // número que recibe las confirmaciones
  eventDateISO: "2026-10-03T17:00:00-06:00",      // para la cuenta regresiva
  mapsQuery: "Restaurante El Fogón Zabdi, Calzada 15 de Septiembre, Santa Lucía Cotzumalguapa, Guatemala"
};

document.addEventListener('DOMContentLoaded', () => {
  fillDynamicText();
  buildDecor();
  buildNavDots();
  setupScrollSpy();
  setupRSVPAndMaps();
  setupCountdown();
  setupEnvelope();
  setupMute();
});

/* ---------------------------------------------------------
   Texto dinámico (fecha, hora, ubicación)
--------------------------------------------------------- */
function fillDynamicText(){
  const map = {
    detalleFecha: CONFIG.fecha,
    detalleHora: CONFIG.hora,
    detalleLugar: CONFIG.lugar,
    detalleDireccion: CONFIG.direccion
  };
  Object.entries(map).forEach(([id, value]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  });
}

/* ---------------------------------------------------------
   Decoraciones: destellos + mariposas en cada escena
--------------------------------------------------------- */
function buildDecor(){
  const butterflyTemplate = document.getElementById('butterflySVG').innerHTML;

  document.querySelectorAll('.scene').forEach(scene => {
    const layer = scene.querySelector('[data-decor]');
    if (!layer) return;

    for (let i = 0; i < 8; i++) {
      const sp = document.createElement('div');
      sp.className = 'sparkle';
      sp.style.left = Math.random() * 100 + '%';
      sp.style.top = Math.random() * 100 + '%';
      sp.style.animationDelay = (Math.random() * 3) + 's';
      layer.appendChild(sp);
    }

    for (let i = 0; i < 2; i++) {
      const b = document.createElement('div');
      b.className = 'butterfly';
      b.style.left = (12 + Math.random() * 72) + '%';
      b.style.top = (12 + Math.random() * 72) + '%';
      b.style.animationDelay = (Math.random() * 4) + 's';
      b.innerHTML = butterflyTemplate;
      layer.appendChild(b);
    }
  });
}

/* ---------------------------------------------------------
   Puntos de navegación lateral, sincronizados con el scroll
--------------------------------------------------------- */
function buildNavDots(){
  const scenes = document.querySelectorAll('.scene');
  const dotsWrap = document.getElementById('dots');

  scenes.forEach((scene, i) => {
    const dot = document.createElement('button');
    dot.className = 'dot';
    dot.setAttribute('aria-label', scene.dataset.title || `Sección ${i + 1}`);
    dot.addEventListener('click', () => scene.scrollIntoView({ behavior: 'smooth' }));
    dotsWrap.appendChild(dot);
  });
}

/* ---------------------------------------------------------
   Revelado de contenido al entrar en pantalla (IntersectionObserver)
   y sincronización de los puntos de navegación
--------------------------------------------------------- */
function setupScrollSpy(){
  const scenes = Array.from(document.querySelectorAll('.scene'));
  const dots = Array.from(document.querySelectorAll('.dot'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const index = scenes.indexOf(entry.target);
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        dots.forEach((d, i) => d.classList.toggle('active', i === index));
      }
    });
  }, { root: document.getElementById('scroll-container'), threshold: 0.55 });

  scenes.forEach(scene => observer.observe(scene));
}

/* ---------------------------------------------------------
   Enlaces dinámicos: confirmar por WhatsApp / abrir Google Maps
--------------------------------------------------------- */
function setupRSVPAndMaps(){
  const rsvpBtn = document.getElementById('rsvpBtn');
  if (rsvpBtn) {
    const msg = encodeURIComponent(`¡Hola! Confirmo mi asistencia a los XV años de ${CONFIG.nombre} 💜🎉`);
    rsvpBtn.href = `https://wa.me/${CONFIG.whatsapp}?text=${msg}`;
  }

  const mapsBtn = document.getElementById('mapsBtn');
  if (mapsBtn) {
    mapsBtn.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONFIG.mapsQuery)}`;
  }
}

/* ---------------------------------------------------------
   Cuenta regresiva al evento
--------------------------------------------------------- */
function setupCountdown(){
  const el = document.getElementById('countdown');
  if (!el) return;

  function update(){
    const diff = new Date(CONFIG.eventDateISO).getTime() - Date.now();
    if (diff <= 0) {
      el.innerHTML = '<div class="unit">¡Hoy es el gran día!</div>';
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor(diff % 86400000 / 3600000);
    const m = Math.floor(diff % 3600000 / 60000);
    el.innerHTML = `
      <div><span class="num">${d}</span><span class="unit">DÍAS</span></div>
      <div><span class="num">${h}</span><span class="unit">HORAS</span></div>
      <div><span class="num">${m}</span><span class="unit">MIN</span></div>
    `;
  }
  update();
  setInterval(update, 30000);
}

/* ---------------------------------------------------------
   Sobre de entrada: abre, muestra la carta y arranca la música
   (la reproducción de audio requiere gesto del usuario — el clic
   sobre el sobre cumple esa condición en todos los navegadores)
--------------------------------------------------------- */
function setupEnvelope(){
  const intro = document.getElementById('intro');
  const envelopeWrap = document.getElementById('envelopeWrap');
  const bgm = document.getElementById('bgm');
  const scrollContainer = document.getElementById('scroll-container');

  // Bloquea el scroll de fondo mientras el sobre está cerrado
  scrollContainer.style.pointerEvents = 'none';

  envelopeWrap.addEventListener('click', () => {
    if (envelopeWrap.classList.contains('open')) return;
    envelopeWrap.classList.add('open');

    bgm.volume = 0.6;
    bgm.play().catch(() => {
      // Si el navegador bloquea el audio, el botón de sonido (arriba a la
      // izquierda) permite intentarlo de nuevo manualmente.
    });

    setTimeout(() => {
      intro.classList.add('hidden');
      scrollContainer.style.pointerEvents = 'auto';
    }, 2100);
  });
}

/* ---------------------------------------------------------
   Botón de silenciar / activar música
--------------------------------------------------------- */
function setupMute(){
  const bgm = document.getElementById('bgm');
  const muteBtn = document.getElementById('muteBtn');
  const soundIcon = document.getElementById('soundIcon');
  let muted = false;

  const ICON_ON = "M3 10v4h4l5 5V5L7 10H3zm13.5 2A4.5 4.5 0 0 0 14 7.97v8.05A4.5 4.5 0 0 0 16.5 12z";
  const ICON_OFF = "M3 10v4h4l5 5V5l-5 5H3zm12.6 1.9l1.8-1.8-1.1-1.1-1.8 1.8-1.8-1.8-1.1 1.1 1.8 1.8-1.8 1.8 1.1 1.1 1.8-1.8 1.8 1.8 1.1-1.1z";

  muteBtn.addEventListener('click', () => {
    muted = !muted;
    bgm.muted = muted;
    if (!muted && bgm.paused) bgm.play().catch(() => {});
    soundIcon.setAttribute('d', muted ? ICON_OFF : ICON_ON);
  });
}
