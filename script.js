
const header=document.getElementById('site-header');
window.addEventListener('scroll',()=>header&&header.classList.toggle('scrolled',scrollY>20));
const menuBtn=document.getElementById('menu-btn'),mobileMenu=document.getElementById('mobile-menu');
menuBtn?.addEventListener('click',()=>mobileMenu?.classList.toggle('open'));
mobileMenu?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>mobileMenu.classList.remove('open')));
if('IntersectionObserver' in window){const io=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&e.target.classList.add('visible')),{threshold:.08});document.querySelectorAll('.reveal').forEach(e=>io.observe(e));}else document.querySelectorAll('.reveal').forEach(e=>e.classList.add('visible'));
const year=document.getElementById('year');if(year)year.textContent=new Date().getFullYear();

function initCarousel(root){
 const track=root.querySelector('.carousel-track'),items=[...root.querySelectorAll('.carousel-item')],prev=root.querySelector('.prev'),next=root.querySelector('.next'),dots=root.querySelector('.carousel-dots');
 if(!track||!items.length)return;let index=0;
 items.forEach((_,i)=>{const d=document.createElement('button');d.type='button';d.setAttribute('aria-label','Go to item '+(i+1));d.addEventListener('click',()=>go(i));dots.appendChild(d)});
 function go(i){index=(i+items.length)%items.length;track.style.transform=`translateX(-${index*100}%)`;[...dots.children].forEach((d,n)=>d.classList.toggle('active',n===index));}
 prev?.addEventListener('click',()=>go(index-1));next?.addEventListener('click',()=>go(index+1));go(0);
}
document.querySelectorAll('[data-carousel]').forEach(initCarousel);
function initStandeeCarousel(root){
 const stage=root.querySelector('.designs-stage'),cards=[...root.querySelectorAll('.design-card')],prev=root.querySelector('.prev'),next=root.querySelector('.next'),count=document.querySelector('.design-count');
 if(!stage||cards.length===0)return; let index=0;
 const positions=['pos-center','pos-right','pos-back-right','pos-hidden','pos-back-left','pos-left'];
 function render(){
  cards.forEach((card,i)=>{card.classList.remove('pos-center','pos-right','pos-back-right','pos-hidden','pos-back-left','pos-left');const rel=(i-index+cards.length)%cards.length;card.classList.add(positions[rel]);});
  if(count)count.textContent=String(index+1).padStart(2,'0')+' / '+String(cards.length).padStart(2,'0');
 }
 prev?.addEventListener('click',()=>{index=(index-1+cards.length)%cards.length;render()});
 next?.addEventListener('click',()=>{index=(index+1)%cards.length;render()});
 render();
}
document.querySelectorAll('[data-standees]').forEach(initStandeeCarousel);


const lightbox=document.getElementById('lightbox'),lightboxImg=document.getElementById('lightbox-img');
document.querySelectorAll('[data-lightbox]').forEach(el=>el.addEventListener('click',()=>{if(!lightbox||!lightboxImg)return;lightboxImg.src=el.dataset.lightbox;lightbox.classList.add('open');lightbox.setAttribute('aria-hidden','false')}));
function closeBox(){lightbox?.classList.remove('open');if(lightboxImg)lightboxImg.src='';lightbox?.setAttribute('aria-hidden','true')}
document.getElementById('close-lightbox')?.addEventListener('click',closeBox);lightbox?.addEventListener('click',e=>{if(e.target===lightbox)closeBox()});document.addEventListener('keydown',e=>e.key==='Escape'&&closeBox());
