
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
  const categories=[['Featured Work',featured],['Academic Work',moreWork],['Internship Graphic Design',designs]];
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

  // A native category picker leaves the browser tabs dedicated to individual projects.
  const categoryControl=document.createElement('label');
  categoryControl.className='work-category';
  categoryControl.innerHTML='<span>Work category</span><select aria-label="Work category"></select>';
  const categorySelect=categoryControl.querySelector('select');
  categories.forEach(([label],index)=>categorySelect.add(new Option(label,String(index))));
  tablist.before(categoryControl);
  tablist.hidden=true;
  categorySelect.addEventListener('change',()=>activate(Number(categorySelect.value)));
  const syncCategory=()=>{categorySelect.value=String([...tablist.children].findIndex(tab=>tab.getAttribute('aria-selected')==='true'));};
  new MutationObserver(syncCategory).observe(tablist,{subtree:true,attributes:true,attributeFilter:['aria-selected']});
  syncCategory();

  [featured,moreWork].forEach((panel,groupIndex)=>{
    const grid=panel.querySelector('.spotlight-grid,.featured-grid');
    const cards=[...grid.children];
    const frame=document.createElement('div');
    frame.className='work-browser';
    frame.innerHTML='<div class="work-browser-top"><span class="work-window-dots" aria-hidden="true"><i></i><i></i><i></i></span><div class="project-tabs" role="tablist" aria-label="'+categories[groupIndex][0]+' projects"></div></div><div class="work-browser-toolbar"><button type="button" class="work-prev" aria-label="Previous project">‹</button><button type="button" class="work-next" aria-label="Next project">›</button><a class="work-address"><span aria-hidden="true">▣</span><span class="work-address-title"></span><span aria-hidden="true">↗</span></a></div>';
    grid.before(frame);frame.append(grid);
    const tabs=frame.querySelector('.project-tabs');
    let current=0;
    const show=(index,focus=false)=>{
      current=(index+cards.length)%cards.length;
      cards.forEach((card,i)=>{
        card.hidden=i!==current;
        card.classList.add('visible');
        tabs.children[i].setAttribute('aria-selected',String(i===current));
        tabs.children[i].tabIndex=i===current?0:-1;
      });
      const card=cards[current];
      frame.querySelector('.work-address-title').textContent=card.querySelector('h3').textContent;
      frame.querySelector('.work-address').href=card.querySelector('.featured-link').getAttribute('href');
      if(focus)tabs.children[current].focus();
    };
    cards.forEach((card,index)=>{
      const tab=document.createElement('button');
      tab.type='button';tab.textContent=card.querySelector('h3').textContent;
      tab.id='project-tab-'+groupIndex+'-'+index;
      card.id='project-panel-'+groupIndex+'-'+index;
      tab.setAttribute('role','tab');tab.setAttribute('aria-controls',card.id);
      card.setAttribute('role','tabpanel');card.setAttribute('aria-labelledby',tab.id);
      tab.addEventListener('click',()=>show(index));
      tab.addEventListener('keydown',event=>{
        const next=event.key==='ArrowRight'?index+1:event.key==='ArrowLeft'?index-1:event.key==='Home'?0:event.key==='End'?cards.length-1:null;
        if(next!==null){event.preventDefault();show(next,true);}
      });
      tabs.append(tab);
    });
    frame.querySelector('.work-prev').addEventListener('click',()=>show(current-1));
    frame.querySelector('.work-next').addEventListener('click',()=>show(current+1));
    show(0);
  });
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
const certificateDescriptions={
  'cert-accenture-ux.jpg':'A three-week Accenture course on FutureLearn introducing user experience and its importance in digital products and services. Supports my UI/UX foundation by encouraging a user-centred approach to creating clear, usable digital experiences.',
  'cert-accenture-mobile.jpg':'A three-week Accenture course on FutureLearn exploring the role of mobile technology in everyday digital experiences. Introduces mobile design, development, and the considerations involved in creating experiences for mobile users.',
  'cert-IMG_5211.jpeg':'Awarded for completing TESDA competency requirements in Visual Graphic Design. Covers logo and print design, user experience and interface design, product packaging, and booth and display design, alongside workplace communication and quality standards.',
  'cert-IMG_5206.jpeg':'A CodeChum credential documenting the LPU Batangas Java Object-Oriented Programming Certification Exam. Reflects my academic work with Java and object-oriented programming as part of my software development foundation.',
  'cert-IMG_5207.jpeg':'Recognizes completion of the IT7 — BSIT IIA coursework on CodeChum, with a recorded total of 2,083 out of 2,440 points. Documents my progress in the course and contributes to my academic programming foundation.',
  'cert-IMG_5210.jpeg':'Recognizes completion of the DevNet Associate course offered by LPU through Cisco Networking Academy. Covers introductory software, API, and network automation concepts, connecting application development with the systems that support it.',
  'cert-IMG_5209.jpeg':'Recognizes completion of the Introduction to Networks course offered by LPU through Cisco Networking Academy. Builds a foundation in network concepts, architecture, and connectivity that supports my broader understanding of IT systems.',
  'cert-IMG_5208.jpeg':'Recognizes completion of the Switching, Routing, and Wireless Essentials course offered by LPU through Cisco Networking Academy. Develops my understanding of these core networking areas and extends the foundation established in Introduction to Networks.',
  'cert-IMG_5212.jpeg':'Recognizes completion of Foundations of Cybersecurity, an online course authorized by Google and offered through Coursera. Introduces core cybersecurity concepts, practices, and career pathways, adding security awareness to my design, development, and IT foundation.'
};
// Dates transcribed from the supplied certificate images.
const certificateDates={
  'cert-accenture-ux.jpg':'Issued date: September 7, 2026',
  'cert-accenture-mobile.jpg':'Issued date: September 7, 2026',
  'cert-IMG_5211.jpeg':'Issued date: February 4, 2025',
  'cert-IMG_5206.jpeg':'Issued date: January 15, 2025',
  'cert-IMG_5207.jpeg':'Issued date: January 7, 2025',
  'cert-IMG_5210.jpeg':'Completion date: December 20, 2025',
  'cert-IMG_5209.jpeg':'Completion date: March 11, 2025',
  'cert-IMG_5208.jpeg':'Completion date: June 15, 2026',
  'cert-IMG_5212.jpeg':'Completion date: April 15, 2026'
};
const certificateTrack=document.querySelector('.cert-carousel .carousel-track');
const newCertDetails={'cert-accenture-ux.jpg':['Digital Skills: User Experience','Accenture · FutureLearn','Issued September 7, 2026'],'cert-accenture-mobile.jpg':['Digital Skills: Mobile','Accenture · FutureLearn','Issued September 7, 2026']};
if(certificateTrack){
  const cards=[...certificateTrack.children];
  certificateOrder.forEach(file=>{const card=cards.find(item=>item.dataset.lightbox?.endsWith(file));if(card){certificateTrack.append(card);const [name,issuer]=certificateDetails[file];card.querySelector('b').textContent=name;card.querySelector('span').textContent=issuer;card.querySelector('img').alt=name;}});
  [...certificateTrack.querySelectorAll('.cert-item')].forEach(card=>{
    const file=card.dataset.lightbox.split('/').pop(),info=card.querySelector('.cert-info');
    if(!info)return;
    const date=info.querySelector('small:not(.cert-description)')||document.createElement('small');
    date.className='cert-date';date.textContent=certificateDates[file];info.append(date);
    const description=info.querySelector('.cert-description')||document.createElement('small');
    description.className='cert-description';description.textContent=certificateDescriptions[file];info.append(description);
  });
  // Build the scannable credential list beneath the carousel from the same data, so the two stay in sync.
  const certList=document.querySelector('.cert-list');
  if(certList){
    const newCards=[...certificateTrack.querySelectorAll('.cert-item')].filter(item=>Object.keys(newCertDetails).some(file=>item.dataset.lightbox?.endsWith(file)));
    const orderedCards=[...newCards,...certificateOrder.map(file=>cards.find(item=>item.dataset.lightbox?.endsWith(file))).filter(Boolean)];
    certList.innerHTML=orderedCards.map(item=>{
      const file=item.dataset.lightbox.split('/').pop();
      const details=newCertDetails[file]||[item.querySelector('b')?.textContent,item.querySelector('span')?.textContent,''];
      const [name,issuer]=details;
      const date=certificateDates[file];
      return `<div class="learn-row reveal"><div class="learn-row-left"><span>${issuer}</span><h3>${name}</h3></div><div class="learn-row-right"><span>${date||'Verified credential'}</span></div></div>`;
    }).join('');
  }
}

const corporateCaption=document.querySelector('.design-caption');
if(corporateCaption){const label=corporateCaption.querySelector('em'),title=corporateCaption.querySelector('h2'),description=corporateCaption.querySelector('p');if(label)label.textContent='CLIENT / CORPORATE WORK';if(title)title.textContent='Unisea Manila Information Technology Corp.';if(description)description.textContent="Corporate materials created during my internship based on the company's established branding and visual identity. Selected materials were reviewed and approved by my OJT supervisor.";}

if(designs){
  const internshipDesigns=[
    ['A4 Blank Template (Building BG).png','Hiring template','A hiring template created during my internship, designed to present recruitment information in a clear, professional layout.'],
    ['C1_MDL.png','Standee design','A standee created during my internship, arranging corporate information in a tall display format with a clear visual hierarchy.'],
    ['C1_MWL.png','Standee design','A standee created during my internship, arranging corporate information in a tall display format with a clear visual hierarchy.'],
    ['D1_MDL.png','Standee design','A standee created during my internship, arranging corporate information in a tall display format with a clear visual hierarchy.'],
    ['D1_MWL.png','Standee design','A standee created during my internship, arranging corporate information in a tall display format with a clear visual hierarchy.'],
    ['H1_MDL.png','Standee design','A standee created during my internship, arranging corporate information in a tall display format with a clear visual hierarchy.'],
    ['H1_MWL.png','Standee design','A standee created during my internship, arranging corporate information in a tall display format with a clear visual hierarchy.'],
    ['I1_MWL.png','Standee design','A standee created during my internship, arranging corporate information in a tall display format with a clear visual hierarchy.'],
    ['UNISEA_DESKTOP WALLPAPER (1920 X 1080).png','Desktop wallpaper','A branded desktop wallpaper featuring the company logo and maritime service areas, adapted to a widescreen format for a consistent workplace identity.']
  ];
  const container=designs.querySelector('.container');
  const frame=document.createElement('div');frame.className='work-browser internship-browser';
  frame.innerHTML='<div class="work-browser-top"><span class="work-window-dots" aria-hidden="true"><i></i><i></i><i></i></span><div class="project-tabs" role="tablist" aria-label="Internship graphic designs"></div></div><div class="work-browser-toolbar"><button type="button" class="work-prev" aria-label="Previous internship design">‹</button><button type="button" class="work-next" aria-label="Next internship design">›</button><div class="work-address"><span aria-hidden="true">▣</span><span class="work-address-title"></span></div></div>';
  const carousel=document.createElement('div');carousel.className='portfolio-carousel internship-carousel';carousel.dataset.carousel='internship';
  carousel.innerHTML='<button class="carousel-arrow prev" type="button" aria-label="Previous internship design">‹</button><div class="carousel-window"><div class="carousel-track"></div></div><button class="carousel-arrow next" type="button" aria-label="Next internship design">›</button><div class="carousel-dots"></div>';
  const track=carousel.querySelector('.carousel-track');
  internshipDesigns.forEach(([file,type,description],index)=>{
    const title='Internship Design '+String(index+1).padStart(2,'0');
    const source='assets/images/ojt/'+file;
    const slide=document.createElement('article');slide.className='carousel-item internship-slide';
    slide.id='internship-panel-'+index;slide.setAttribute('role','tabpanel');slide.setAttribute('aria-labelledby','internship-tab-'+index);
    const tab=document.createElement('button');tab.type='button';tab.id='internship-tab-'+index;tab.textContent=title;tab.setAttribute('role','tab');tab.setAttribute('aria-controls',slide.id);frame.querySelector('.project-tabs').append(tab);
    const preview=document.createElement('button');preview.type='button';preview.className='internship-preview';preview.dataset.lightbox=source;preview.setAttribute('aria-label','View design: '+title);
    const img=document.createElement('img');img.src=source;img.alt=type+' — '+title;img.loading='lazy';img.decoding='async';
    const link=document.createElement('span');link.textContent='View design ↗';preview.append(img,link);
    const copy=document.createElement('div');copy.className='internship-copy';
    const label=document.createElement('span');label.className='internship-type';label.textContent=type;
    const heading=document.createElement('h3');heading.textContent=title;
    const body=document.createElement('p');body.textContent=description;copy.append(label,heading,body);
    if(index===0){const note=document.createElement('aside');note.className='internship-note';note.innerHTML='<strong>Confidentiality note</strong><p>Some information in this hiring template has been blocked out to protect the company’s confidential details.</p>';copy.append(note);}
    slide.append(preview,copy);track.append(slide);
  });
  frame.append(carousel);container.replaceChildren(frame);
  frame.querySelector('.work-prev').addEventListener('click',()=>carousel.querySelector('.prev').click());
  frame.querySelector('.work-next').addEventListener('click',()=>carousel.querySelector('.next').click());
}

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
  const frame=document.createElement('div');
  frame.className='work-browser education-browser';
  frame.innerHTML='<div class="work-browser-top"><span class="work-window-dots" aria-hidden="true"><i></i><i></i><i></i></span></div><div class="work-browser-toolbar"><button type="button" class="learn-prev" aria-label="Previous education category">‹</button><button type="button" class="learn-next" aria-label="Next education category">›</button><div class="work-address"><span aria-hidden="true">▣</span><span class="work-address-title" aria-live="polite"></span></div></div>';
  root.before(frame);
  root.classList.remove('learn-tabs','reveal');
  root.classList.add('project-tabs');
  indicator?.remove();
  frame.querySelector('.work-browser-top').append(root);
  panels.forEach(panel=>{panel.tabIndex=0;frame.append(panel);});
  function place(tab){if(!indicator||!tab)return;indicator.style.width=tab.offsetWidth+'px';indicator.style.transform=`translateX(${tab.offsetLeft}px)`;}
  function activate(tab){
    tabs.forEach(t=>{const on=t===tab;t.classList.toggle('active',on);t.setAttribute('aria-selected',String(on));t.tabIndex=on?0:-1;});
    panels.forEach(p=>{const on=p.id===tab.dataset.target;p.classList.toggle('active',on);p.hidden=!on;if(on)p.querySelectorAll('.reveal').forEach(el=>el.classList.add('visible'));});
    frame.querySelector('.work-address-title').textContent=tab.textContent.trim();
    place(tab);
  }
  tabs.forEach((tab,index)=>{
    tab.addEventListener('click',()=>activate(tab));
    tab.addEventListener('keydown',event=>{
      const next=event.key==='ArrowRight'?(index+1)%tabs.length:event.key==='ArrowLeft'?(index+tabs.length-1)%tabs.length:event.key==='Home'?0:event.key==='End'?tabs.length-1:null;
      if(next!==null){event.preventDefault();activate(tabs[next]);tabs[next].focus();}
    });
  });
  const step=direction=>activate(tabs[(tabs.findIndex(tab=>tab.classList.contains('active'))+direction+tabs.length)%tabs.length]);
  frame.querySelector('.learn-prev').addEventListener('click',()=>step(-1));
  frame.querySelector('.learn-next').addEventListener('click',()=>step(1));
  const initial=tabs.find(t=>t.classList.contains('active'))||tabs[0];
  activate(initial);
  window.addEventListener('resize',()=>place(tabs.find(t=>t.classList.contains('active'))||tabs[0]));
}
document.querySelectorAll('.learn-tabs').forEach(initLearnTabs);

// Decorative line icons keep each tab's text as its accessible name.
const tabIconPaths={
  'Featured Work':'<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-2.9-5.6 2.9 1.1-6.2L3 9.6l6.2-.9Z"/>',
  'Academic Work':'<path d="m2 9 10-5 10 5-10 5Z"/><path d="M6 11v6c4 3 8 3 12 0v-6M22 9v7"/>',
  'Internship Graphic Design':'<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12c6 4 12 4 18 0M12 12v4"/>',
  'Education':'<path d="M12 5v16M12 5C9 3 5 3 2 4v15c3-1 7-1 10 2 3-3 7-3 10-2V4c-3-1-7-1-10 1Z"/>',
  'Certifications':'<circle cx="12" cy="9" r="6"/><path d="m8 14-1 8 5-3 5 3-1-8m-7-5 2 2 4-4"/>'
};
document.querySelectorAll('.work-tabs button,.learn-tab').forEach(tab=>{
  const label=tab.textContent.trim();
  if(tabIconPaths[label])tab.innerHTML='<svg class="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+tabIconPaths[label]+'</svg><span>'+label+'</span>';
});

if('IntersectionObserver' in window){const io=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&e.target.classList.add('visible')),{threshold:.08});document.querySelectorAll('.reveal').forEach(e=>io.observe(e));}else document.querySelectorAll('.reveal').forEach(e=>e.classList.add('visible'));
const year=document.getElementById('year');if(year)year.textContent=new Date().getFullYear();

// Present each credential as a preview paired with its existing details.
document.querySelectorAll('.cert-carousel .cert-item').forEach(button=>{
 const slide=document.createElement('article');
 slide.className='carousel-item certificate-slide';
 const info=button.querySelector('.cert-info');
 const title=info.querySelector('b'),heading=document.createElement('h3');
 heading.textContent=title.textContent.trim();title.replaceWith(heading);
 const issuer=info.querySelector('span');info.prepend(issuer);
 button.before(slide);
 button.className='certificate-preview';
 button.setAttribute('aria-label','View certificate: '+heading.textContent);
 const caption=document.createElement('span');caption.className='certificate-view';caption.textContent='View certificate ↗';
 button.append(caption);slide.append(button,info);
});

function initCarousel(root){
 const track=root.querySelector('.carousel-track'),items=[...root.querySelectorAll('.carousel-item')],prev=root.querySelector('.prev'),next=root.querySelector('.next'),dots=root.querySelector('.carousel-dots');
 if(!track||!items.length)return;let index=0;
 items.forEach((_,i)=>{const d=document.createElement('button');d.type='button';d.setAttribute('aria-label','Go to item '+(i+1));d.addEventListener('click',()=>go(i));dots.appendChild(d)});
 const isCertificate=root.classList.contains('cert-carousel')||root.classList.contains('internship-carousel');
 const internshipFrame=root.closest('.internship-browser');
 const designTabs=internshipFrame?[...internshipFrame.querySelectorAll('.project-tabs button')]:[];
 designTabs.forEach((tab,n)=>{tab.addEventListener('click',()=>go(n));tab.addEventListener('keydown',event=>{const next=event.key==='ArrowRight'?(n+1)%items.length:event.key==='ArrowLeft'?(n+items.length-1)%items.length:event.key==='Home'?0:event.key==='End'?items.length-1:null;if(next!==null){event.preventDefault();go(next);designTabs[next].focus();}});});
 let counter;
 if(isCertificate){counter=document.createElement('span');counter.className='certificate-counter';counter.setAttribute('aria-live','polite');root.append(counter);root.setAttribute('aria-label',root.classList.contains('internship-carousel')?'Internship graphic designs':'Certificates');}
 function go(i){index=(i+items.length)%items.length;track.style.transform=`translateX(-${index*100}%)`;[...dots.children].forEach((d,n)=>d.classList.toggle('active',n===index));if(isCertificate){counter.textContent=String(index+1).padStart(2,'0')+' / '+String(items.length).padStart(2,'0');items.forEach((item,n)=>{item.inert=n!==index;item.setAttribute('aria-hidden',String(n!==index));});}if(internshipFrame){designTabs.forEach((tab,n)=>{tab.setAttribute('aria-selected',String(n===index));tab.tabIndex=n===index?0:-1;});internshipFrame.querySelector('.work-address-title').textContent=designTabs[index].textContent;}}
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
  // Never restore an unfinished intro when navigating back from another page.
  window.addEventListener('pagehide',()=>{
    document.documentElement.classList.add('no-splash');
    splash.remove();
  },{once:true});

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
