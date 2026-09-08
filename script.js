
// Keep the homepage in its final recruiter-focused reading order.
const main=document.querySelector('main');
const hero=document.getElementById('home'),about=document.getElementById('about'),process=document.querySelector('.process-section'),work=document.getElementById('work'),moreWork=document.getElementById('more-work'),skills=document.getElementById('skills'),designs=document.getElementById('designs'),experience=document.getElementById('experience'),education=document.getElementById('education'),contact=document.getElementById('contact');
if(main)main.append(hero,about,process,work,moreWork,skills,designs,experience,education,contact);

const setKicker=(section,text)=>{const kicker=section?.querySelector('.section-kicker');if(kicker)kicker.textContent=text};
setKicker(about,'01 — About');setKicker(process,'02 — How I work');setKicker(work,'03 — Featured work');setKicker(skills,'04 — Skills & tools');setKicker(designs,'05 — Selected corporate work');setKicker(experience,'05 — Experience');setKicker(education,'06 — Education & Certifications');setKicker(contact,'07 — Contact');
if(moreWork){moreWork.classList.add('work-continuation');setKicker(moreWork,'More featured work');}

// Use the same project-art direction in the top three featured cards while retaining their detailed project information.
const spotlightCards=[...document.querySelectorAll('.spotlight-card')];
const featuredMedia=[...document.querySelectorAll('#more-work .featured-media')];
spotlightCards.forEach((card,index)=>{const media=card.querySelector('.spotlight-media');const href=card.querySelector('.spotlight-media')?.getAttribute('href');const source=featuredMedia.find(item=>item.querySelector('.featured-link')?.getAttribute('href')===href)||featuredMedia[index];if(media&&source){media.innerHTML=source.innerHTML;media.className='spotlight-media featured-media '+[...source.classList].filter(name=>name!=='featured-media').join(' ');}});
const packdMedia=spotlightCards[2]?.querySelector('.spotlight-media');
if(packdMedia){packdMedia.className='spotlight-media featured-media cdp-prototype-stack packd-prototype-stack pack-feature';packdMedia.innerHTML='<div class="cdp-thumb cdp-thumb-main"><img src="assets/images/packd-up-3.jpeg" alt="Pack’d Up product listing"></div><div class="cdp-thumb cdp-thumb-left"><img src="assets/images/packd-up-2.jpeg" alt="Pack’d Up home interface"></div><div class="cdp-thumb cdp-thumb-right"><img src="assets/images/packd-up-4.jpeg" alt="Pack’d Up storefront interface"></div>';}
document.querySelectorAll('#more-work .featured-card:nth-child(-n+3)').forEach(card=>card.remove());

// Group the existing work content without recreating its cards or controls.
if(work&&moreWork&&designs){
  const container=work.querySelector('.container');
  const featured=document.createElement('div');
  featured.id='featured-work';
  featured.append(work.querySelector('.spotlight-grid'));
  const categories=[['Featured Work',featured],['Academic Work',moreWork],['Corporate Work',designs]];
  const tablist=document.createElement('div');
  tablist.className='work-tabs';
  tablist.setAttribute('role','tablist');
  tablist.setAttribute('aria-label','Selected work categories');
  setKicker(work,'03 — Selected Work');
  work.querySelector('.display').innerHTML='Selected <span>Work.</span>';
  moreWork.querySelector('.section-kicker')?.remove();
  moreWork.querySelector('.featured-head')?.remove();
  designs.querySelector('.section-kicker')?.remove();
  container.append(tablist);
  const activate=(index,focus=false)=>{
    categories.forEach(([,panel],i)=>{
      const selected=i===index,tab=tablist.children[i];
      tab.setAttribute('aria-selected',String(selected));
      tab.tabIndex=selected?0:-1;
      panel.hidden=!selected;
      if(selected)panel.querySelectorAll('.reveal').forEach(el=>el.classList.add('visible'));
    });
    if(focus)tablist.children[index].focus();
  };
  categories.forEach(([label,panel],index)=>{
    const tab=document.createElement('button');
    tab.type='button';tab.id='work-tab-'+index;tab.textContent=label;
    tab.setAttribute('role','tab');tab.setAttribute('aria-controls',panel.id);
    panel.classList.add('work-panel');panel.setAttribute('role','tabpanel');
    panel.setAttribute('aria-labelledby',tab.id);panel.tabIndex=0;
    tab.addEventListener('click',()=>activate(index));
    tab.addEventListener('keydown',event=>{
      const next=event.key==='ArrowRight'?(index+1)%3:event.key==='ArrowLeft'?(index+2)%3:event.key==='Home'?0:event.key==='End'?2:null;
      if(next!==null){event.preventDefault();activate(next,true);}
    });
    tablist.append(tab);container.append(panel);
  });
  const syncHash=()=>{
    const index=categories.findIndex(([,panel])=>'#'+panel.id===location.hash||panel.querySelector('[id="'+location.hash.slice(1).replace(/[^\w-]/g,'')+'"]'));
    if(index>=0){activate(index);requestAnimationFrame(()=>work.scrollIntoView());}
  };
  activate(0);syncHash();window.addEventListener('hashchange',syncHash);
}

// The mobile sidebar mirrors the final section structure.
const mobileLinks=document.querySelector('.mobile-menu-links');
if(mobileLinks)mobileLinks.innerHTML='<a href="#about"><span>01</span>About</a><a href="#how-i-work"><span>02</span>How I work</a><a href="#work"><span>03</span>Selected Work</a><a href="#skills"><span>04</span>Skills &amp; tools</a><a href="#experience"><span>05</span>Experience</a><a href="#education"><span>06</span>Education &amp; Certifications</a><a href="#contact"><span>07</span>Contact</a>';
process?.setAttribute('id','how-i-work');
document.querySelector('.desktop-nav')?.remove();
const heroResume=document.querySelector('.hero .btn-outline');if(heroResume){heroResume.href='documents/Kaycee-Manalo-Resume.pdf';heroResume.target='_blank';heroResume.textContent='View resume ↗';}
const mobileSocial=document.querySelector('.mobile-menu-social');if(mobileSocial)mobileSocial.innerHTML='<a href="mailto:kayceebuenomanalo@gmail.com">Email</a><a href="https://www.linkedin.com/in/kaycee-manalo-b856b1390" target="_blank" rel="noopener noreferrer">LinkedIn</a><a href="https://github.com/kcmanalo1024" target="_blank" rel="noopener noreferrer">GitHub</a>';
const socialGroup=document.querySelector('.contact-links');
if(socialGroup){const github=document.createElement('a');github.className='contact-link';github.href='https://github.com/kcmanalo1024';github.target='_blank';github.rel='noopener noreferrer';github.setAttribute('aria-label','GitHub');github.innerHTML='<span class="contact-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5a9.5 9.5 0 0 0-3 18.5c.48.09.65-.2.65-.46v-1.68c-2.65.58-3.2-1.13-3.2-1.13-.43-1.1-1.06-1.39-1.06-1.39-.87-.59.07-.58.07-.58.96.07 1.47.99 1.47.99.86 1.46 2.24 1.04 2.78.79.09-.62.34-1.04.62-1.28-2.12-.24-4.35-1.06-4.35-4.72 0-1.04.37-1.89.98-2.55-.1-.24-.42-1.21.09-2.52 0 0 .8-.26 2.61.98a9 9 0 0 1 4.76 0c1.81-1.24 2.61-.98 2.61-.98.51 1.31.19 2.28.09 2.52.61.66.98 1.51.98 2.55 0 3.67-2.23 4.47-4.36 4.71.35.3.65.88.65 1.77v2.63c0 .26.17.56.66.46A9.5 9.5 0 0 0 12 2.5Z"/></svg></span><span class="contact-label">GitHub</span>';
socialGroup.append(github);}

// Order the supplied credentials by relevance, led by TESDA NC III.
const certificateOrder=['cert-IMG_5211.jpeg','cert-IMG_5206.jpeg','cert-IMG_5207.jpeg','cert-IMG_5210.jpeg','cert-IMG_5209.jpeg','cert-IMG_5208.jpeg','cert-IMG_5212.jpeg'];
const certificateDetails={'cert-IMG_5211.jpeg':['National Certificate III — Visual Graphic Design','TESDA'],'cert-IMG_5206.jpeg':['Java Object-Oriented Programming Certification Exam','CodeChum'],'cert-IMG_5207.jpeg':['IT7 — BSIT IIA Completion Certificate','CodeChum'],'cert-IMG_5210.jpeg':['DevNet Associate','Cisco Networking Academy'],'cert-IMG_5209.jpeg':['CCNA: Introduction to Networks','Cisco Networking Academy'],'cert-IMG_5208.jpeg':['CCNA: Switching, Routing, and Wireless Essentials','Cisco Networking Academy'],'cert-IMG_5212.jpeg':['Foundations of Cybersecurity','Google / Coursera']};
const certificateDescriptions={'cert-accenture-ux.jpg':'Introduces user-centred thinking for digital products.','cert-accenture-mobile.jpg':'Explores the considerations behind mobile digital experiences.','cert-IMG_5211.jpeg':'Recognizes foundational visual graphic design competency.','cert-IMG_5206.jpeg':'Validates learning in Java object-oriented programming concepts.','cert-IMG_5207.jpeg':'Documents completion of the listed BSIT IIA course requirement.','cert-IMG_5210.jpeg':'Covers introductory developer skills for software, APIs, and network automation.','cert-IMG_5209.jpeg':'Builds a foundation in networking concepts, architecture, and connectivity.','cert-IMG_5208.jpeg':'Develops knowledge of switching, routing, and wireless fundamentals.','cert-IMG_5212.jpeg':'Introduces core cybersecurity concepts, practices, and career pathways.'};
const certificateTrack=document.querySelector('.cert-carousel .carousel-track');
const newCertDetails={'cert-accenture-ux.jpg':['Digital Skills: User Experience','Accenture · FutureLearn','Issued September 7, 2026'],'cert-accenture-mobile.jpg':['Digital Skills: Mobile','Accenture · FutureLearn','Issued September 7, 2026']};
if(certificateTrack){
  const cards=[...certificateTrack.children];
  certificateOrder.forEach(file=>{const card=cards.find(item=>item.dataset.lightbox?.endsWith(file));if(card){certificateTrack.append(card);const [name,issuer]=certificateDetails[file];card.querySelector('b').textContent=name;card.querySelector('span').textContent=issuer;card.querySelector('img').alt=name;}});
  [...certificateTrack.querySelectorAll('.cert-item')].forEach(card=>{const file=card.dataset.lightbox.split('/').pop(),info=card.querySelector('.cert-info');if(info&&certificateDescriptions[file]&&!info.querySelector('.cert-description')){const description=document.createElement('small');description.className='cert-description';description.textContent=certificateDescriptions[file];info.append(description);}});
  // Build the scannable credential list beneath the carousel from the same data, so the two stay in sync.
  const certList=document.querySelector('.cert-list');
  if(certList){
    const newCards=[...certificateTrack.querySelectorAll('.cert-item')].filter(item=>Object.keys(newCertDetails).some(file=>item.dataset.lightbox?.endsWith(file)));
    const orderedCards=[...newCards,...certificateOrder.map(file=>cards.find(item=>item.dataset.lightbox?.endsWith(file))).filter(Boolean)];
    certList.innerHTML=orderedCards.map(item=>{
      const file=item.dataset.lightbox.split('/').pop();
      const details=newCertDetails[file]||[item.querySelector('b')?.textContent,item.querySelector('span')?.textContent,''];
      const [name,issuer,date]=details;
      return `<div class="learn-row reveal"><div class="learn-row-left"><span>${issuer}</span><h3>${name}</h3></div><div class="learn-row-right"><span>${date||'Verified credential'}</span></div></div>`;
    }).join('');
  }
}

const corporateCaption=document.querySelector('.design-caption');
if(corporateCaption){const label=corporateCaption.querySelector('em'),title=corporateCaption.querySelector('h2'),description=corporateCaption.querySelector('p');if(label)label.textContent='CLIENT / CORPORATE WORK';if(title)title.textContent='Unisea Manila Information Technology Corp.';if(description)description.textContent="Corporate materials created during my internship based on the company's established branding and visual identity. Selected materials were reviewed and approved by my OJT supervisor.";}

const header=document.getElementById('site-header');
window.addEventListener('scroll',()=>header&&header.classList.toggle('scrolled',scrollY>20));
const menuBtn=document.getElementById('menu-btn'),mobileMenu=document.getElementById('mobile-menu'),menuClose=document.getElementById('menu-close'),menuOverlay=document.getElementById('menu-overlay');
let menuReturnFocus=null;
mobileMenu?.setAttribute('inert','');
function openMenu(){menuReturnFocus=document.activeElement;mobileMenu?.removeAttribute('inert');mobileMenu?.classList.add('open');menuOverlay?.classList.add('open');mobileMenu?.setAttribute('aria-hidden','false');menuBtn?.setAttribute('aria-expanded','true');document.body.style.overflow='hidden';mobileMenu?.querySelector('a,button')?.focus();}
function closeMenu(){const wasOpen=mobileMenu?.classList.contains('open');mobileMenu?.classList.remove('open');menuOverlay?.classList.remove('open');mobileMenu?.setAttribute('aria-hidden','true');mobileMenu?.setAttribute('inert','');menuBtn?.setAttribute('aria-expanded','false');document.body.style.overflow='';if(wasOpen)menuReturnFocus?.focus?.();}
menuBtn?.addEventListener('click',()=>mobileMenu?.classList.contains('open')?closeMenu():openMenu());
menuClose?.addEventListener('click',closeMenu);
menuOverlay?.addEventListener('click',closeMenu);
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
mobileMenu?.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
mobileMenu?.addEventListener('keydown',e=>{if(e.key!=='Tab')return;const items=[...mobileMenu.querySelectorAll('a,button:not([disabled])')];const first=items[0],last=items.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}});
// Education / Certifications tab switcher.
function initLearnTabs(root){
  const tabs=[...root.querySelectorAll('.learn-tab')],indicator=root.querySelector('.learn-tab-indicator');
  const panels=root.parentElement.querySelectorAll('.learn-panel');
  function place(tab){if(!indicator||!tab)return;indicator.style.width=tab.offsetWidth+'px';indicator.style.transform=`translateX(${tab.offsetLeft}px)`;}
  function activate(tab){
    tabs.forEach(t=>{const on=t===tab;t.classList.toggle('active',on);t.setAttribute('aria-selected',String(on));});
    panels.forEach(p=>{const on=p.id===tab.dataset.target;p.classList.toggle('active',on);p.hidden=!on;if(on)p.querySelectorAll('.reveal').forEach(el=>el.classList.add('visible'));});
    place(tab);
  }
  tabs.forEach(tab=>tab.addEventListener('click',()=>activate(tab)));
  const initial=tabs.find(t=>t.classList.contains('active'))||tabs[0];
  requestAnimationFrame(()=>place(initial));
  window.addEventListener('resize',()=>place(tabs.find(t=>t.classList.contains('active'))||tabs[0]));
}
document.querySelectorAll('.learn-tabs').forEach(initLearnTabs);

// Decorative line icons keep each tab's text as its accessible name.
const tabIconPaths={
  'Featured Work':'<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-2.9-5.6 2.9 1.1-6.2L3 9.6l6.2-.9Z"/>',
  'Academic Work':'<path d="m2 9 10-5 10 5-10 5Z"/><path d="M6 11v6c4 3 8 3 12 0v-6M22 9v7"/>',
  'Corporate Work':'<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12c6 4 12 4 18 0M12 12v4"/>',
  'Education':'<path d="M12 5v16M12 5C9 3 5 3 2 4v15c3-1 7-1 10 2 3-3 7-3 10-2V4c-3-1-7-1-10 1Z"/>',
  'Certifications':'<circle cx="12" cy="9" r="6"/><path d="m8 14-1 8 5-3 5 3-1-8m-7-5 2 2 4-4"/>'
};
document.querySelectorAll('.work-tabs button,.learn-tab').forEach(tab=>{
  const label=tab.textContent.trim();
  if(tabIconPaths[label])tab.innerHTML='<svg class="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+tabIconPaths[label]+'</svg><span>'+label+'</span>';
});

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

// Keep the first visual responsive; defer lower-page images until needed.
document.querySelectorAll('main img').forEach((image,index)=>{if(index>1)image.loading='lazy';image.decoding='async'});


/* Branded intro splash — shows once per browser session only.
   The head of the document already checked sessionStorage and, if the
   splash was already shown this session, added a "no-splash" class to
   <html> before the splash markup even had a chance to paint. That
   covers every "returning to the portfolio" case (browser back button,
   clicking a "Back to portfolio" link, bfcache restores) with no flash,
   regardless of referrer or navigation-timing quirks. */
(function(){
  const splash = document.getElementById('site-splash');
  if(!splash) return;

  if(document.documentElement.classList.contains('no-splash')){
    splash.remove();
    return;
  }

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let hidden = false;

  const hide = () => {
    if(hidden) return;
    hidden = true;

    splash.classList.add('is-hidden');

    setTimeout(() => splash.remove(), 900);
  };

  if(reduce){
    hide();
    return;
  }

  window.addEventListener('load', () => {
    setTimeout(hide, 1900);
  }, {once:true});

  // Safety fallback
  setTimeout(hide, 2600);
})();
