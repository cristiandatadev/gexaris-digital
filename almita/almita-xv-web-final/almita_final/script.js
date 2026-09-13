const openBtn = document.getElementById('openBtn');
const opening = document.getElementById('opening');
const envelope = document.getElementById('envelope');
const invite = document.getElementById('invite');
const music = document.getElementById('music');
const soundBtn = document.getElementById('soundBtn');
const toast = document.getElementById('toast');

music.volume = 0.55;

function showToast(message){
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('show'), 2600);
}

async function startMusic(){
  try{
    await music.play();
    soundBtn.classList.remove('muted');
  }catch{
    soundBtn.classList.add('muted');
    showToast('Toca el botón ♪ para iniciar la música.');
  }
}

openBtn.addEventListener('click', async () => {
  openBtn.disabled = true;
  await startMusic();
  envelope.classList.add('open');
  opening.classList.add('leave');
  invite.hidden = false;
  setTimeout(() => {
    opening.remove();
    window.scrollTo({top: 0, behavior: 'instant'});
    revealVisible();
  }, 2850);
});

soundBtn.addEventListener('click', async () => {
  if(music.paused){
    await startMusic();
  }else{
    music.pause();
    soundBtn.classList.add('muted');
  }
});

function revealVisible(){
  document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
    const rect = el.getBoundingClientRect();
    if(rect.top < innerHeight * .82 && rect.bottom > 0) el.classList.add('visible');
  });
}
addEventListener('scroll', revealVisible, {passive:true});
addEventListener('resize', revealVisible);

const form = document.getElementById('rsvpForm');
const result = document.getElementById('rsvpResult');
const rsvpText = document.getElementById('rsvpText');
const shareBtn = document.getElementById('shareBtn');
const copyBtn = document.getElementById('copyBtn');
let confirmationMessage = '';

form.addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('guestName').value.trim();
  const attendance = document.getElementById('attendance').value;
  const size = document.getElementById('partySize').value || '1';
  confirmationMessage = `Confirmación XV de Almita\nNombre: ${name}\nRespuesta: ${attendance}\nPersonas: ${size}\nSábado 3 de octubre de 2026 · 5:00 p. m.`;
  rsvpText.textContent = `${name}, tu mensaje está listo. Compártelo con la familia para registrar tu confirmación.`;
  result.hidden = false;
  result.scrollIntoView({behavior:'smooth', block:'center'});
});

shareBtn.addEventListener('click', async () => {
  if(!confirmationMessage) return;
  if(navigator.share){
    try{
      await navigator.share({title:'Confirmación XV de Almita', text:confirmationMessage});
    }catch(err){
      if(err?.name !== 'AbortError') showToast('No se pudo abrir el menú para compartir.');
    }
  }else{
    await navigator.clipboard.writeText(confirmationMessage);
    showToast('Mensaje copiado. Pégalo en WhatsApp o Mensajes.');
  }
});

copyBtn.addEventListener('click', async () => {
  if(!confirmationMessage) return;
  try{
    await navigator.clipboard.writeText(confirmationMessage);
    showToast('Confirmación copiada.');
  }catch{
    showToast('Mantén presionado el mensaje para copiarlo.');
  }
});

revealVisible();
