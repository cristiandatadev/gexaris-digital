
const cover=document.getElementById('cover');
const invite=document.getElementById('invite');
const openBtn=document.getElementById('openBtn');
const music=document.getElementById('music');

function revealVisible(){
  document.querySelectorAll('.reveal').forEach(el=>{
    if(el.getBoundingClientRect().top < innerHeight*.85) el.classList.add('visible');
  });
}

openBtn.addEventListener('click',()=>{
  if(music.getAttribute('src')) music.play().catch(()=>{});
  cover.style.transition='opacity .7s ease';
  cover.style.opacity='0';
  setTimeout(()=>{
    cover.remove();
    invite.hidden=false;
    requestAnimationFrame(revealVisible);
    window.scrollTo(0,0);
  },700);
});

window.addEventListener('scroll',revealVisible,{passive:true});
document.getElementById('rsvpBtn').addEventListener('click',()=>alert('Aquí conectaremos la confirmación real.'));
