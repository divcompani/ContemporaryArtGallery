const images = [
  ['poets-house-nextoffice-rev-01.webp','نمای کلی خانه شاعر','General view of The Poet’s House'],
  ['poets-house-nextoffice-rev-02.webp','رابطه حجم آجری و مداخله فولادی','The brick volume and steel intervention'],
  ['poets-house-nextoffice-rev-03.webp','دیوار آیدا در امتداد بنا','The Aida Wall extending through the house'],
  ['poets-house-nextoffice-rev-04-683x1024.webp','فضای داخلی و مسیر حرکت','Interior space and circulation'],
  ['poets-house-nextoffice-rev-05-683x1024.webp','نور طبیعی و کیفیت سطوح','Natural light and material surfaces'],
  ['poets-house-nextoffice-rev-06.webp','جزئیات اجرایی فولاد و آجر','Steel and brick construction detail'],
  ['poets-house-nextoffice-rev-07-683x1024.webp','پلکان منحنی و پوسته فولادی','Curved stair and steel shell'],
  ['poets-house-nextoffice-rev-08.webp','حیاط، مسیر ورودی و دیوار آیدا','Courtyard, entrance path and Aida Wall'],
  ['poets-house-nextoffice-rev-09-683x1024.webp','تلاقی سازه جدید و خانه موجود','The new structure meeting the existing house'],
  ['poets-house-nextoffice-rev-10-683x1024.webp','حرکت عمودی در میان طبقات','Vertical movement between levels'],
  ['poets-house-nextoffice-rev-11-715x1024.webp','بافت، نور و سایه','Texture, light and shadow'],
  ['poets-house-nextoffice-rev-12-683x1024.webp','جزئیات پلکان فولادی','Steel stair detail'],
  ['poets-house-nextoffice-rev-13-673x1024.webp','نمای دیوار آیدا از حیاط','The Aida Wall seen from the courtyard'],
  ['poets-house-nextoffice-rev-14-732x1024.webp','پوسته فولادی به‌مثابه مسیر','The steel shell as a route'],
  ['poets-house-nextoffice-rev-15-683x1024.webp','گفت‌وگوی آجر تاریخی و فولاد معاصر','Historic brick in dialogue with contemporary steel']
];

const root = document.documentElement;
const body = document.body;
const langButton = document.querySelector('#lang-toggle span');
let language = 'fa';

function applyLanguage(next) {
  language = next;
  const fa = language === 'fa';
  root.lang = language;
  root.dir = fa ? 'rtl' : 'ltr';
  body.classList.toggle('en', !fa);
  langButton.textContent = fa ? 'EN' : 'فا';
  document.title = fa ? 'خانه شاعر | پیشنهاد گالری هنر معاصر' : 'The Poet’s House | Contemporary Gallery Proposal';
  document.querySelectorAll('[data-fa][data-en]').forEach(el => el.innerHTML = el.dataset[language]);
  document.querySelector('.floating-bar').setAttribute('aria-label', fa ? 'ناوبری اصلی' : 'Main navigation');
  buildGallery();
}

document.querySelector('#lang-toggle').addEventListener('click', () => applyLanguage(language === 'fa' ? 'en' : 'fa'));

const grid = document.querySelector('#gallery-grid');
function buildGallery() {
  grid.innerHTML = '';
  images.forEach((image, index) => {
    const card = document.createElement('figure');
    card.className = 'gallery-card reveal';
    card.tabIndex = 0;
    card.innerHTML = `<img src="assets/images/${image[0]}" loading="lazy" alt="${language === 'fa' ? image[1] : image[2]}"><figcaption><b>${String(index + 1).padStart(2,'0')}</b><span lang="fa" dir="rtl">${image[1]}</span><small lang="en" dir="ltr">${image[2]}</small></figcaption>`;
    card.addEventListener('click', () => openLightbox(index));
    card.addEventListener('keydown', e => { if (e.key === 'Enter') openLightbox(index); });
    grid.appendChild(card);
  });
  observeReveals();
}

const dialog = document.querySelector('#lightbox');
let activeImage = 0;
function showLightboxImage() {
  const item = images[activeImage];
  dialog.querySelector('img').src = `assets/images/${item[0]}`;
  dialog.querySelector('img').alt = language === 'fa' ? item[1] : item[2];
  dialog.querySelector('figcaption').innerHTML = `<span lang="fa" dir="rtl">${item[1]}</span><small lang="en" dir="ltr">${item[2]}</small><b>${String(activeImage + 1).padStart(2,'0')} / ${images.length}</b>`;
}
function closeLightbox(){ dialog.classList.remove('open'); dialog.setAttribute('aria-hidden','true'); body.style.overflow=''; }
function openLightbox(index) { activeImage = index; showLightboxImage(); dialog.classList.add('open'); dialog.setAttribute('aria-hidden','false'); body.style.overflow='hidden'; dialog.querySelector('.lightbox-close').focus(); }
dialog.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
dialog.querySelector('.prev').addEventListener('click', () => { activeImage = (activeImage - 1 + images.length) % images.length; showLightboxImage(); });
dialog.querySelector('.next').addEventListener('click', () => { activeImage = (activeImage + 1) % images.length; showLightboxImage(); });
dialog.addEventListener('click', e => { if (e.target === dialog) closeLightbox(); });
document.addEventListener('keydown', e => {
  if (!dialog.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') dialog.querySelector('.prev').click();
  if (e.key === 'ArrowRight') dialog.querySelector('.next').click();
});

let revealObserver;
function observeReveals() {
  if (!revealObserver) revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('in'); revealObserver.unobserve(entry.target); }
  }), { threshold: .12, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.reveal:not(.in)').forEach(el => revealObserver.observe(el));
}

const canvas = document.querySelector('#engineering-canvas');
const ctx = canvas.getContext('2d');
let pointer = { x: innerWidth * .5, y: innerHeight * .5, tx: innerWidth * .5, ty: innerHeight * .5 };
let nodes = [];
function resizeCanvas() {
  const dpr = Math.min(devicePixelRatio || 1, 2);
  canvas.width = innerWidth * dpr; canvas.height = innerHeight * dpr;
  canvas.style.width = `${innerWidth}px`; canvas.style.height = `${innerHeight}px`;
  ctx.setTransform(dpr,0,0,dpr,0,0);
  nodes = Array.from({length: innerWidth < 700 ? 16 : 28}, (_,i) => ({
    x:(i%7)/6*innerWidth, y:Math.floor(i/7)/4*innerHeight,
    depth:.25+(i%5)*.12
  }));
}
function drawEngineering() {
  pointer.x += (pointer.tx-pointer.x)*.045; pointer.y += (pointer.ty-pointer.y)*.045;
  ctx.clearRect(0,0,innerWidth,innerHeight); ctx.strokeStyle='rgba(91,69,56,.15)'; ctx.lineWidth=.7;
  nodes.forEach((n,i) => {
    const sx=(pointer.x-innerWidth/2)*.012*n.depth; const sy=(pointer.y-innerHeight/2)*.012*n.depth;
    const y=(n.y + scrollY*.035*n.depth) % (innerHeight+120)-60;
    ctx.beginPath(); ctx.arc(n.x+sx,y+sy,2.1,0,Math.PI*2); ctx.stroke();
    if(i%7<6){const m=nodes[i+1];ctx.beginPath();ctx.moveTo(n.x+sx,y+sy);ctx.lineTo(m.x+sx,(m.y+scrollY*.035*m.depth)%(innerHeight+120)-60+sy);ctx.stroke()}
  });
  const cx=innerWidth*.72+(pointer.x-innerWidth/2)*.018, cy=innerHeight*.46+(pointer.y-innerHeight/2)*.018;
  ctx.save();ctx.translate(cx,cy);ctx.rotate(scrollY*.00015);ctx.strokeStyle='rgba(139,67,44,.17)';
  [42,78,118].forEach(r=>{ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*1.45);ctx.stroke()});
  ctx.restore();requestAnimationFrame(drawEngineering);
}
window.addEventListener('pointermove', e => {
  pointer.tx=e.clientX;pointer.ty=e.clientY;
  const nx=e.clientX/innerWidth-.5, ny=e.clientY/innerHeight-.5, floats=document.querySelector('.architectural-floats');
  root.style.setProperty('--cinema-x', `${nx*34}px`);
  root.style.setProperty('--cinema-y', `${ny*24}px`);
  root.style.setProperty('--cinema-x-neg', `${nx*-34}px`);
  root.style.setProperty('--cinema-y-neg', `${ny*-24}px`);
  root.style.setProperty('--cinema-tilt-x', `${ny*7}deg`);
  root.style.setProperty('--cinema-tilt-y', `${nx*-8}deg`);
  root.style.setProperty('--cinema-tilt-z', `${nx*3}deg`);
  floats.style.setProperty('--blade-x',`${nx*24}px`);
  floats.style.setProperty('--ribbon-x',`${nx*-34}px`);
  floats.style.setProperty('--stair-x',`${nx*18}px`);
}, {passive:true});
window.addEventListener('deviceorientation', e => { if(e.gamma != null){pointer.tx=innerWidth/2+e.gamma*8;pointer.ty=innerHeight/2+e.beta*3;} }, {passive:true});
window.addEventListener('resize', resizeCanvas, {passive:true});
window.addEventListener('scroll', () => {
  const max = document.documentElement.scrollHeight-innerHeight;
  document.querySelector('.progress span').style.width = `${max ? scrollY/max*100 : 0}%`;
  document.querySelector('.hero-image').style.setProperty('--hero-y', `${Math.min(scrollY*.12,100)}px`);
  root.style.setProperty('--cinema-scroll-r', `${scrollY*.006}deg`);
  const floats=document.querySelector('.architectural-floats');
  floats.style.setProperty('--blade-y',`${scrollY*-.055}px`);
  floats.style.setProperty('--blade-r',`${-7+scrollY*.002}deg`);
  floats.style.setProperty('--ribbon-y',`${scrollY*-.028}px`);
  floats.style.setProperty('--ribbon-r',`${-18-scrollY*.0015}deg`);
  floats.style.setProperty('--stair-y',`${scrollY*-.04}px`);
  floats.style.setProperty('--stair-r',`${scrollY*.025}deg`);
}, {passive:true});

let audioContext, masterGain, audioActive=false, audioReady=false, oscillators=[];
const soundButton=document.querySelector('#sound-toggle');
const siteTrack=document.querySelector('#ambient-track');
let useFileTrack=false, startingAudio=false;
const audioHint=document.createElement('button');
audioHint.type='button';audioHint.className='audio-hint';audioHint.hidden=true;
audioHint.innerHTML='<i></i><span>برای فعال‌کردن موسیقی کلیک کنید</span>';
body.appendChild(audioHint);
function showAudioHint(){audioHint.hidden=false;requestAnimationFrame(()=>audioHint.classList.add('show'))}
function hideAudioHint(){audioHint.classList.remove('show');setTimeout(()=>audioHint.hidden=true,350)}
function createAmbientAudio(){
  if(audioReady) return;
  audioContext=new (window.AudioContext||window.webkitAudioContext)();
  masterGain=audioContext.createGain(); masterGain.gain.value=0; masterGain.connect(audioContext.destination);
  const notes=[110,164.81,220];
  notes.forEach((freq,i)=>{
    const osc=audioContext.createOscillator(), gain=audioContext.createGain(), filter=audioContext.createBiquadFilter();
    osc.type=i===1?'triangle':'sine';osc.frequency.value=freq;gain.gain.value=.018/(i+1);filter.type='lowpass';filter.frequency.value=650;
    osc.connect(filter);filter.connect(gain);gain.connect(masterGain);osc.start();oscillators.push(osc);
  });
  audioReady=true;
}
async function setAudio(on){
  if(!on){
    if(useFileTrack) siteTrack.pause();
    if(audioReady){const now=audioContext.currentTime;masterGain.gain.cancelScheduledValues(now);masterGain.gain.setValueAtTime(masterGain.gain.value,now);masterGain.gain.linearRampToValueAtTime(0,now+1.2)}
    audioActive=false;soundButton.setAttribute('aria-pressed','false');hideAudioHint();return;
  }
  if(startingAudio)return;startingAudio=true;
  try{
    try{
      siteTrack.volume=.32;await siteTrack.play();useFileTrack=true;
    }catch(_){
      useFileTrack=false;createAmbientAudio();
      if(audioContext.state==='suspended')await audioContext.resume();
      if(audioContext.state!=='running')throw new Error('interaction-required');
      const now=audioContext.currentTime;masterGain.gain.cancelScheduledValues(now);masterGain.gain.setValueAtTime(masterGain.gain.value,now);masterGain.gain.linearRampToValueAtTime(.38,now+1.2);
    }
    audioActive=true;soundButton.setAttribute('aria-pressed','true');hideAudioHint();
  }catch(_){
    audioActive=false;soundButton.setAttribute('aria-pressed','false');showAudioHint();
  }finally{
    startingAudio=false;
  }
}
soundButton.addEventListener('click', e => { e.stopPropagation(); setAudio(!audioActive); });
audioHint.addEventListener('click',()=>setAudio(true));
function firstInteraction(){ if(!audioActive) setAudio(true).catch(()=>{}); }
window.addEventListener('mousemove',firstInteraction,{once:true,passive:true});
['pointerdown','touchstart','keydown'].forEach(type=>window.addEventListener(type,firstInteraction,{once:true,passive:true}));

applyLanguage(language); resizeCanvas(); drawEngineering(); observeReveals();
