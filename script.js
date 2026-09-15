
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
// Give each academic thumbnail the same three-screen stack used by Featured Work.
const academicStacks={
  'lms-feature':[['assets/images/lpub-dashboard-1.png','LPUB dashboard overview'],['assets/images/lpub-dashboard-2.png','LPUB dashboard screen'],['assets/images/lpub-dashboard-3.png','LPUB dashboard detail']],
  'portal-feature':[['assets/images/lpub-portal-1.png','LPUB portal overview'],['assets/images/lpub-portal-2.png','LPUB portal screen'],['assets/images/lpub-portal-3.png','LPUB portal detail']],
  'meditrack-feature':[['assets/images/meditrack-doctor-1-after.png','MediTrack doctor dashboard'],['assets/images/meditrack-doctor-2-after.png','MediTrack patient record'],['assets/images/meditrack-doctor-3-after.png','MediTrack appointment view']]
};
document.querySelectorAll('#more-work .featured-media').forEach(media=>{
  const key=Object.keys(academicStacks).find(name=>media.classList.contains(name));
  if(!key)return;
  media.className='featured-media academic-prototype-stack '+key;
  media.innerHTML=academicStacks[key].map(([src,alt],index)=>`<div class="cdp-thumb ${index===0?'cdp-thumb-main':index===1?'cdp-thumb-left':'cdp-thumb-right'}"><img src="${src}" alt="${alt}"></div>`).join('');
});
document.querySelectorAll('#more-work .featured-card:nth-child(-n+3)').forEach(card=>card.remove());

// Group the existing work content without recreating its cards or controls.
const karibokCard=document.getElementById('karibok-featured-card');
if(karibokCard&&work)work.querySelector('.spotlight-grid').prepend(karibokCard.content.cloneNode(true));
if(work&&moreWork&&designs){
  const container=work.querySelector('.container');
  const featured=document.createElement('div');
  featured.id='featured-work';
  featured.append(work.querySelector('.spotlight-grid'));
  const personalWork=createPersonalWork();
  const categories=[['Featured Work',featured],['Academic Work',moreWork],['Internship Graphic Design',designs],['Personal & Concept Design',personalWork]];
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
      const next=event.key==='ArrowRight'?(index+1)%categories.length:event.key==='ArrowLeft'?(index+categories.length-1)%categories.length:event.key==='Home'?0:event.key==='End'?categories.length-1:null;
      if(next!==null){event.preventDefault();activate(next,true);}
    });
    tablist.append(tab);container.append(panel);
  });
  const syncHash=()=>{
    // Case studies return with their project slug; resolve its category and tab.
    const project=location.hash==='#work'?new URLSearchParams(location.search).get('project'):null;
    if(project){
      const categoryIndex=categories.findIndex(([,panel])=>[...panel.querySelectorAll('.featured-link')].some(link=>link.getAttribute('href')===project+'.html'));
      if(categoryIndex>=0){
        const panel=categories[categoryIndex][1];
        const link=[...panel.querySelectorAll('.featured-link')].find(link=>link.getAttribute('href')===project+'.html');
        const card=link.closest('article');
        activate(categoryIndex);
        panel.querySelector('[role="tab"][aria-controls="'+card.id+'"]')?.click();
        requestAnimationFrame(()=>work.scrollIntoView());
        return;
      }
    }
    const index=categories.findIndex(([,panel])=>'#'+panel.id===location.hash||panel.querySelector('[id="'+location.hash.slice(1).replace(/[^\w-]/g,'')+'"]'));
    if(index>=0){activate(index);requestAnimationFrame(()=>work.scrollIntoView());}
  };
  activate(0);window.addEventListener('hashchange',syncHash);

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
  // Restore only after all project cards and tab controls have been constructed.
  syncHash();syncCategory();
}

// The mobile sidebar mirrors the final section structure.
const mobileLinks=document.querySelector('.mobile-menu-links');
if(mobileLinks)mobileLinks.innerHTML='<a href="#about"><span>01</span>About</a><a href="#how-i-work"><span>02</span>How I work</a><a href="#work"><span>03</span>Selected Work</a><a href="#skills"><span>04</span>Skills &amp; tools</a><a href="#experience"><span>05</span>Experience</a><a href="#education"><span>06</span>Education &amp; Certifications</a><a href="#contact"><span>07</span>Contact</a>';
process?.setAttribute('id','how-i-work');
document.querySelector('.desktop-nav')?.remove();
const heroResume=document.querySelector('.hero .btn-outline');if(heroResume){heroResume.href='https://drive.google.com/file/d/1PtFBGwxsc5fc1tfaUI4S8WFFlftUObi0/view?usp=sharing';heroResume.target='_blank';heroResume.rel='noopener noreferrer';heroResume.textContent='View resume ↗';}
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
  const container=root.parentElement;
  const panels=[...container.querySelectorAll('.learn-panel')];
  const picker=document.createElement('label');picker.className='work-category';
  picker.innerHTML='<span>Learning category</span><select aria-label="Learning category"><option>Education</option><option>Certifications</option></select>';
  root.replaceWith(picker);
  const select=picker.querySelector('select');
  panels.forEach((panel,group)=>{
    const label=group===0?'Education':'Certifications';
    panel.removeAttribute('aria-labelledby');panel.setAttribute('role','region');panel.setAttribute('aria-label',label);
    let cards=[...panel.querySelectorAll(group===0?'.education-row':'.certificate-slide')];
    if(group===0){const schools=document.createElement('div');schools.className='education-schools';schools.append(...cards);cards=[schools];}
    const frame=document.createElement('div');frame.className='work-browser education-browser learning-browser';
    frame.innerHTML='<div class="work-browser-top"><span class="work-window-dots" aria-hidden="true"><i></i><i></i><i></i></span><div class="project-tabs" role="tablist"></div></div><div class="work-browser-toolbar"><button type="button" class="learn-prev" aria-label="Previous item">‹</button><button type="button" class="learn-next" aria-label="Next item">›</button><div class="work-address"><span aria-hidden="true">▣</span><span class="work-address-title"></span></div></div><div class="learning-cards"></div>';
    const tabs=frame.querySelector('.project-tabs');tabs.setAttribute('aria-label',label+' items');
    if(group===1)frame.querySelector('.learning-cards').classList.add('cert-carousel');
    let current=0;
    const show=(index,focus=false)=>{
      current=(index+cards.length)%cards.length;
      cards.forEach((card,i)=>{card.hidden=i!==current;card.classList.add('visible');card.querySelectorAll('.reveal').forEach(el=>el.classList.add('visible'));tabs.children[i].setAttribute('aria-selected',String(i===current));tabs.children[i].tabIndex=i===current?0:-1;});
      frame.querySelector('.work-address-title').textContent=tabs.children[current].textContent;
      if(focus)tabs.children[current].focus();
    };
    cards.forEach((card,index)=>{
      const title=group===0?'Education':card.querySelector('h3').textContent.trim();
      const tab=document.createElement('button');tab.type='button';tab.textContent=title;tab.id='learning-tab-'+group+'-'+index;
      card.id='learning-card-'+group+'-'+index;card.setAttribute('role','tabpanel');card.setAttribute('aria-labelledby',tab.id);card.tabIndex=0;
      tab.setAttribute('role','tab');tab.setAttribute('aria-controls',card.id);
      tab.addEventListener('click',()=>show(index));
      tab.addEventListener('keydown',event=>{const next=event.key==='ArrowRight'?index+1:event.key==='ArrowLeft'?index-1:event.key==='Home'?0:event.key==='End'?cards.length-1:null;if(next!==null){event.preventDefault();show(next,true);}});
      tabs.append(tab);frame.querySelector('.learning-cards').append(card);
    });
    panel.replaceChildren(frame);
    if(group===0){frame.querySelector('.learn-prev').hidden=true;frame.querySelector('.learn-next').hidden=true;}
    frame.querySelector('.learn-prev').addEventListener('click',()=>show(current-1));
    frame.querySelector('.learn-next').addEventListener('click',()=>show(current+1));show(0);
  });
  const activate=()=>panels.forEach((panel,index)=>{const on=index===select.selectedIndex;panel.hidden=!on;panel.classList.toggle('active',on);});
  select.addEventListener('change',activate);activate();
}
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

document.querySelectorAll('.learn-tabs').forEach(initLearnTabs);
// Uniform tabs retain full accessible names while long visible labels fade out.
const projectTabLabels=[];
document.querySelectorAll('#work .project-tabs button,#education .project-tabs button').forEach(tab=>{
  const title=tab.textContent.trim();
  const label=document.createElement('span');label.className='project-tab-label';label.textContent=title;
  tab.replaceChildren(label);tab.title=title;tab.setAttribute('aria-label',title);projectTabLabels.push(label);
});
const updateTabOverflow=()=>projectTabLabels.forEach(label=>label.classList.toggle('is-truncated',label.scrollWidth>label.clientWidth));
if('ResizeObserver' in window){const tabResize=new ResizeObserver(updateTabOverflow);projectTabLabels.forEach(label=>tabResize.observe(label));}
window.addEventListener('resize',updateTabOverflow);requestAnimationFrame(updateTabOverflow);
// Shared category picker with a styled menu and full keyboard navigation.
document.querySelectorAll('.work-category select').forEach((select,index)=>{
  const old=select.parentElement,group=document.createElement('div');group.className='work-category';
  group.append(...old.childNodes);old.replaceWith(group);select.hidden=true;
  const dropdown=document.createElement('div');dropdown.className='category-dropdown';
  const trigger=document.createElement('button');trigger.type='button';trigger.className='category-trigger';
  trigger.innerHTML='<span></span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="m7 10 5 5 5-5"/></svg>';
  trigger.setAttribute('aria-haspopup','listbox');trigger.setAttribute('aria-expanded','false');trigger.setAttribute('aria-controls','category-options-'+index);
  const menu=document.createElement('div');menu.className='category-options';menu.id='category-options-'+index;menu.setAttribute('role','listbox');menu.setAttribute('aria-label',select.getAttribute('aria-label'));menu.hidden=true;
  const options=[...select.options].map((option,i)=>{const button=document.createElement('button');button.type='button';button.textContent=option.text;button.setAttribute('role','option');button.tabIndex=-1;button.addEventListener('click',()=>{select.selectedIndex=i;select.dispatchEvent(new Event('change',{bubbles:true}));sync();close(true);});menu.append(button);return button;});
  const sync=()=>{trigger.querySelector('span').textContent=select.options[select.selectedIndex].text;trigger.setAttribute('aria-label',select.getAttribute('aria-label')+': '+select.options[select.selectedIndex].text);options.forEach((option,i)=>option.setAttribute('aria-selected',String(i===select.selectedIndex)));};
  const close=(focus=false)=>{menu.hidden=true;trigger.setAttribute('aria-expanded','false');if(focus)trigger.focus();};
  const open=()=>{menu.hidden=false;trigger.setAttribute('aria-expanded','true');options[select.selectedIndex].focus();};
  trigger.addEventListener('click',()=>menu.hidden?open():close());
  trigger.addEventListener('keydown',event=>{if(['ArrowDown','ArrowUp'].includes(event.key)){event.preventDefault();open();}});
  menu.addEventListener('keydown',event=>{const current=options.indexOf(document.activeElement);const next=event.key==='ArrowDown'?(current+1)%options.length:event.key==='ArrowUp'?(current+options.length-1)%options.length:event.key==='Home'?0:event.key==='End'?options.length-1:null;if(next!==null){event.preventDefault();options[next].focus();}if(event.key==='Escape'){event.preventDefault();close(true);}if(event.key==='Tab')close();});
  document.addEventListener('click',event=>{if(!dropdown.contains(event.target))close();});
  select.addEventListener('change',sync);window.addEventListener('hashchange',()=>requestAnimationFrame(sync));
  dropdown.append(trigger,menu);group.append(dropdown);sync();
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
let lightboxReturnFocus=null,lightboxOverflow='',lightboxInert=[];
if(lightbox&&lightboxImg){
  lightbox.classList.add('asset-viewer');lightbox.setAttribute('role','dialog');lightbox.setAttribute('aria-modal','true');lightbox.setAttribute('aria-labelledby','asset-viewer-title');
  const shell=document.createElement('div');shell.className='asset-viewer-shell';
  shell.innerHTML='<div class="asset-viewer-header"><div><span class="asset-viewer-kicker">Portfolio preview</span><h2 id="asset-viewer-title"></h2></div><button id="close-lightbox" type="button" aria-label="Close preview"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6"/></svg></button></div><div class="asset-viewer-stage"></div><div class="asset-viewer-footer"><span>Press Esc or click outside to close</span><a class="asset-viewer-original" target="_blank" rel="noopener">Open full-size image ↗</a></div>';
  shell.querySelector('.asset-viewer-stage').append(lightboxImg);lightbox.replaceChildren(shell);
}
document.querySelectorAll('[data-lightbox]').forEach(el=>el.addEventListener('click',()=>{
  if(!lightbox||!lightboxImg)return;
  const title=el.closest('.certificate-slide,.internship-slide')?.querySelector('h3')?.textContent||el.querySelector('img')?.alt||'Design preview';
  lightbox.querySelector('#asset-viewer-title').textContent=title;
  lightbox.querySelector('.asset-viewer-kicker').textContent=el.classList.contains('certificate-preview')?'Certificate':'Design preview';
  lightbox.querySelector('.asset-viewer-original').href=el.dataset.lightbox;
  lightboxImg.alt=title;lightboxImg.src=el.dataset.lightbox;
  lightboxReturnFocus=el;lightboxOverflow=document.body.style.overflow;document.body.style.overflow='hidden';
  lightboxInert=[...document.body.children].filter(child=>child!==lightbox&&!child.inert);lightboxInert.forEach(child=>child.inert=true);
  lightbox.classList.add('open');lightbox.setAttribute('aria-hidden','false');lightbox.querySelector('#close-lightbox').focus();
}));
function closeBox(){if(!lightbox?.classList.contains('open'))return;lightbox.classList.remove('open');if(lightboxImg)lightboxImg.src='';lightbox.setAttribute('aria-hidden','true');document.body.style.overflow=lightboxOverflow;lightboxInert.forEach(child=>child.inert=false);lightboxInert=[];lightboxReturnFocus?.focus();}
lightbox?.addEventListener('keydown',event=>{if(event.key!=='Tab')return;const controls=[...lightbox.querySelectorAll('button,a[href]')];const first=controls[0],last=controls.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}});
document.getElementById('close-lightbox')?.addEventListener('click',closeBox);lightbox?.addEventListener('click',e=>{if(e.target===lightbox)closeBox()});document.addEventListener('keydown',e=>e.key==='Escape'&&closeBox());

// Keep the first visual responsive; defer lower-page images until needed.
document.querySelectorAll('main img').forEach((image,index)=>{if(index>1)image.loading='lazy';image.decoding='async'});


// Consistent decorative icons add cues without repeating accessible labels.
const detailIconPaths={
 search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
 structure:'<rect x="8" y="3" width="8" height="5" rx="1"/><path d="M12 8v4M5 16v-4h14v4"/><rect x="2" y="16" width="6" height="5" rx="1"/><rect x="16" y="16" width="6" height="5" rx="1"/>',
 design:'<path d="m4 16-1 5 5-1L20 8l-4-4Z M13 7l4 4"/>',
 code:'<path d="m7 6-5 6 5 6m10-12 5 6-5 6m-4-15-2 18"/>',
 check:'<path d="m9 12 2 2 4-4"/><rect x="3" y="3" width="18" height="18" rx="5"/>',
 tools:'<path d="M14 6a5 5 0 0 0-6 6l-5 5a2 2 0 0 0 4 4l5-5a5 5 0 0 0 6-6l-3 3-4-4Z"/>'
};
function detailIcon(name){const icon=document.createElementNS('http://www.w3.org/2000/svg','svg');icon.setAttribute('viewBox','0 0 24 24');icon.setAttribute('class','detail-icon');icon.setAttribute('fill','none');icon.setAttribute('stroke','currentColor');icon.setAttribute('stroke-width','1.6');icon.setAttribute('stroke-linecap','round');icon.setAttribute('stroke-linejoin','round');icon.setAttribute('aria-hidden','true');icon.innerHTML=detailIconPaths[name];return icon;}
document.querySelectorAll('.process-list h3').forEach((heading,index)=>heading.prepend(detailIcon(['search','structure','design','code','check'][index]||'check')));
document.querySelectorAll('.skills-grid h3').forEach((heading,index)=>heading.prepend(detailIcon(['design','code','structure','tools'][index]||'tools')));

const backToTop=document.querySelector('.back-to-top');
if(backToTop){
  document.body.append(backToTop);
  const updateBackToTop=()=>{const visible=window.scrollY>300;backToTop.classList.toggle('is-visible',visible);backToTop.tabIndex=visible?0:-1;backToTop.setAttribute('aria-hidden',String(!visible));};
  window.addEventListener('scroll',updateBackToTop,{passive:true});
  window.addEventListener('pageshow',updateBackToTop);
  updateBackToTop();
}

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
