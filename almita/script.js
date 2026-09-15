
const $ = (s) => document.querySelector(s);

const hero = $("#intro");
const reveal = $("#reveal");
const openBtn = $("#openInvite");
const enterBtn = $("#enterInvite");
const music = $("#music");
const musicToggle = $("#musicToggle");
const toast = $("#toast");
const rsvpDialog = $("#rsvpDialog");

let musicStarted = false;

async function playMusic(){
  try{
    await music.play();
    musicStarted = true;
    musicToggle.classList.add("playing");
    musicToggle.setAttribute("aria-label","Pausar música");
  }catch(err){
    showToast("Toca el botón de música para iniciar el audio.");
  }
}

function pauseMusic(){
  music.pause();
  musicToggle.classList.remove("playing");
  musicToggle.setAttribute("aria-label","Reproducir música");
}

openBtn.addEventListener("click", async () => {
  await playMusic();
  document.body.classList.add("intro-open");

  setTimeout(() => {
    hero.style.display = "none";
    reveal.classList.add("active");
    reveal.setAttribute("aria-hidden","false");
    requestAnimationFrame(() => reveal.classList.add("animate"));
    window.scrollTo({top:0,behavior:"instant"});
  }, 1750);
});

enterBtn.addEventListener("click", () => {
  $("#story").scrollIntoView({behavior:"smooth"});
});

musicToggle.addEventListener("click", () => {
  if(music.paused) playMusic();
  else pauseMusic();
});

document.querySelectorAll("[data-scroll]").forEach(btn => {
  btn.addEventListener("click", () => {
    const target = document.querySelector(btn.dataset.scroll);
    if(target) target.scrollIntoView({behavior:"smooth"});
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting) entry.target.classList.add("visible");
  });
},{threshold:.16});

document.querySelectorAll(".reveal-on-scroll").forEach(el => observer.observe(el));

const eventDate = new Date("2026-10-03T17:00:00-06:00");

function updateCountdown(){
  const diff = eventDate.getTime() - Date.now();

  if(diff <= 0){
    $("#countdown").innerHTML = "<div style='grid-column:1/-1'><strong>¡Hoy!</strong><span>Es el gran día</span></div>";
    return;
  }

  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);

  $("#days").textContent = String(d).padStart(2,"0");
  $("#hours").textContent = String(h).padStart(2,"0");
  $("#minutes").textContent = String(m).padStart(2,"0");
  $("#seconds").textContent = String(s).padStart(2,"0");
}
updateCountdown();
setInterval(updateCountdown,1000);

$("#rsvpOpen").addEventListener("click", () => rsvpDialog.showModal());

$("#confirmRsvp").addEventListener("click", async () => {
  const name = $("#guestName").value.trim();
  const count = $("#guestCount").value;
  const note = $("#guestMessage").value.trim();

  if(!name){
    showToast("Escribe tu nombre para preparar la confirmación.");
    return;
  }

  const message =
`Hola, confirmo mi asistencia a los XV de Almita.

Nombre: ${name}
Personas: ${count}${note ? `\nMensaje: ${note}` : ""}`;

  // Si luego quieres enviarlo directo por WhatsApp, coloca aquí el número
  // en formato internacional, por ejemplo: const whatsappNumber = "50255555555";
  const whatsappNumber = "";

  if(whatsappNumber){
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url,"_blank","noopener");
  }else{
    try{
      await navigator.clipboard.writeText(message);
      showToast("Confirmación preparada y copiada. Puedes pegarla en WhatsApp.");
    }catch{
      showToast(message);
    }
  }
});

$("#shareBtn").addEventListener("click", async () => {
  const data = {
    title:"Mis XV — Almita",
    text:"Acompáñame a celebrar mis XV años ✨",
    url:location.href
  };

  if(navigator.share){
    try{ await navigator.share(data); }catch{}
  }else{
    try{
      await navigator.clipboard.writeText(location.href);
      showToast("Enlace copiado.");
    }catch{
      showToast(location.href);
    }
  }
});

function showToast(message){
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 3200);
}
