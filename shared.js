/* shared.js — Ange Michel Ouraga Portfolio */

const CONFIG = {
  whatsapp: "2250151185932",
  email:    "ouragaangemichel267@gmail.com",
  github:   "https://github.com/tiefsalvador19"
};

// CURSOR
const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursor-ring');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove', e => {
  mx=e.clientX; my=e.clientY;
  cursor.style.left=mx+'px'; cursor.style.top=my+'px';
});
(function animRing(){
  rx+=(mx-rx)*.12; ry+=(my-ry)*.12;
  cursorRing.style.left=rx+'px'; cursorRing.style.top=ry+'px';
  requestAnimationFrame(animRing);
})();

// NAVBAR SCROLL
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', scrollY > 60);
}, { passive: true });

// ACTIVE NAV LINK — marque le lien de la page courante
(function setActiveNav() {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
})();

// HAMBURGER MENU
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
let menuOpen = false;
hamburger.addEventListener('click', () => {
  menuOpen = !menuOpen;
  hamburger.classList.toggle('open', menuOpen);
  mobileMenu.classList.toggle('open', menuOpen);
  document.body.style.overflow = menuOpen ? 'hidden' : '';
});
function closeMenu() {
  menuOpen = false;
  hamburger.classList.remove('open');
  mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
}
mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

// SCROLL REVEAL
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: .12, rootMargin: '0px 0px -50px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// PROGRESS BARS
const barObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.bar-fill').forEach((b, i) => {
        setTimeout(() => { b.style.width = b.dataset.width + '%'; }, i * 120);
      });
    }
  });
}, { threshold: .3 });
document.querySelectorAll('.bar-skills').forEach(el => barObs.observe(el));

// TOAST
function showToast(msg, type = 'success') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast ' + type + ' show';
  setTimeout(() => t.classList.remove('show'), 4500);
}

// CONTACT FORM (contact.html seulement)
let sendVia = 'whatsapp';
function selectVia(mode) {
  sendVia = mode;
  const wa = document.getElementById('viaWA');
  const em = document.getElementById('viaEM');
  const both = document.getElementById('viaBOTH');
  if(wa) wa.classList.toggle('active', mode==='whatsapp'||mode==='both');
  if(em) em.classList.toggle('active', mode==='email'||mode==='both');
  if(both) both.classList.toggle('active', mode==='both');
}
function sendMessage() {
  const nom   = document.getElementById('fname')?.value.trim();
  const email = document.getElementById('femail')?.value.trim();
  const sujet = document.getElementById('fsujet')?.value.trim();
  const msg   = document.getElementById('fmsg')?.value.trim();
  if (!nom||!email||!sujet||!msg) { showToast('⚠️ Remplis tous les champs !','info'); return; }

  const waText = encodeURIComponent(
    `✉️ *Nouveau message — Portfolio AMO*\n\n👤 *Nom :* ${nom}\n📧 *Email :* ${email}\n📌 *Sujet :* ${sujet}\n\n💬 *Message :*\n${msg}`
  );
  const waURL    = `https://wa.me/${CONFIG.whatsapp}?text=${waText}`;
  const emailURL = `mailto:${CONFIG.email}?subject=${encodeURIComponent('[Portfolio] '+sujet+' — '+nom)}&body=${encodeURIComponent('Nom: '+nom+'\nEmail: '+email+'\n\n'+msg)}`;

  const btn = document.getElementById('submitBtn');
  btn.innerHTML = '<span style="animation:spin .6s linear infinite;display:inline-block">↻</span> Envoi…';
  btn.disabled = true;

  setTimeout(() => {
    if (sendVia==='whatsapp')      { window.open(waURL,'_blank'); showToast('💬 WhatsApp ouvert !'); }
    else if (sendVia==='email')    { window.location.href=emailURL; showToast('✉️ Client mail ouvert !'); }
    else { window.open(waURL,'_blank'); setTimeout(()=>{window.location.href=emailURL;},700); showToast('🚀 WhatsApp + Email ouverts !'); }
    document.getElementById('contactForm').reset();
    selectVia('whatsapp');
    btn.innerHTML = '✓ Envoyé !'; btn.style.background = '#065F46';
    setTimeout(() => { btn.innerHTML = 'Envoyer le message <span>→</span>'; btn.style.background=''; btn.disabled=false; }, 3000);
  }, 600);
}
