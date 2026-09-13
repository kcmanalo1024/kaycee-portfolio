// Each project keeps its own selected artwork while visitors switch browser tabs.
function createPersonalWork(){
  const base='assets/images/personal-concept/';
  const timplado=(number,title,description)=>({src:base+'timplado/Green Simple Morning Routine Carousel Instagram Post - '+number+'.png',title,description});
  const poster=(number,title,description)=>({src:base+'posters/Copy of Tubaland CV - '+number+'.png',title,description});
  const projects=[
    {name:'Timplado',type:'FICTIONAL BRAND',intro:'A fictional café brand exploring product presentation, typography, and a cohesive visual identity through menus, promotional graphics, and launch concepts.',images:[
      timplado(5,'Coffee Break','A product-led brand concept pairing an iced coffee visual with bold, repeated typography and a warm café palette.'),
      timplado(6,'Menu','A menu concept arranging the drink range into a clear, consistent product grid.'),
      timplado(7,'Which Timplado Are You?','A drink selection concept combining product imagery with expressive handwritten accents.'),
      timplado(8,'Coming Soon','A teaser layout introducing featured drinks through product cutouts and a warm, inviting composition.'),
      timplado(10,'Three Days to Go','The first of three coordinated countdown graphics for the fictional brand launch.'),
      timplado(11,'Two Days to Go','A countdown variation using oversized numerals, photography, and red graphic accents.'),
      timplado(12,'One Day Left','The final countdown concept, keeping the campaign’s visual structure consistent.'),
      timplado(13,'Grand Opening','A fictional opening announcement exploring bold display type and a photograph-led layout.'),
      timplado(14,'Opening Promotion','A promotional concept combining a word-search graphic and drink imagery.')
    ]},
    {name:'Personal Posters',type:'POSTER DESIGN',intro:'Self-initiated poster studies exploring typography, image composition, and visual storytelling.',images:[
      poster(38,'My Graduation Pubmat','A personal graduation tribute bringing together my graduation photos from kindergarten through college. The layered collage celebrates the milestones along my journey and honors the people whose love, guidance, and support helped me reach this moment.'),
      poster(39,'Will you choose me in another lifetime?','A personal poster exploring the quiet uncertainty of being chosen again in another life. Glowing silhouettes, a dark atmosphere, and delicate typography give the question a dreamlike sense of longing and possibility.'),
      poster(40,"The world was a blur, U weren’t",'A portrait-led poster about one person remaining clear when everything around them feels out of focus. Warm light, blurred surroundings, and a sharply defined subject turn that contrast into a visual expression of connection.'),
      poster(41,'La La Lost You','A personal fan-made poster inspired by NIKI’s song, with text drawn from its lyrics. A blue-toned collage, fragmented photographs, and layered typography create a reflective composition that explores longing, distance, and memories of a connection.'),
      poster(42,'Not You Too by Drake','A personal fan-made poster inspired by Drake’s song, using lyrics from the track as part of the composition. The oversized “Trust Who?” text behind his portrait, monochrome palette, and layered textures emphasize a sense of vulnerability and uncertainty.'),
      poster(43,'Count Me Out by Kendrick Lamar','A personal fan-made poster inspired by Kendrick Lamar’s song, incorporating lyrics from the track into the design. Torn-paper layers, a central portrait, and bold red accents create a raw, expressive composition exploring self-reflection and resilience.')
    ]},
    {name:'Other Concepts',type:'TYPOGRAPHY & VISUAL EXPLORATION',intro:'Independent visual experiments exploring mood, texture, and typographic composition.',images:[
      {src:base+'posters/ENTRY 001.png',title:'What If It All Works Out?',description:'An experimental landscape composition pairing a reflective typographic message with soft, monochrome texture.'}
    ]}
  ];
  const panel=document.createElement('div');panel.id='personal-concept';
  panel.innerHTML='<div class="personal-intro"><h3>Personal &amp; Concept Design</h3><p>Self-initiated projects exploring branding, products, typography, and visual storytelling.</p></div><div class="work-browser personal-browser"><div class="work-browser-top"><span class="work-window-dots" aria-hidden="true"><i></i><i></i><i></i></span><div class="project-tabs" role="tablist" aria-label="Personal and concept projects"></div></div><div class="work-browser-toolbar"><button type="button" class="work-prev" aria-label="Previous project">‹</button><button type="button" class="work-next" aria-label="Next project">›</button><div class="work-address"><span aria-hidden="true">▣</span><span class="work-address-title"></span></div></div><div class="personal-projects"></div></div>';
  const tabs=panel.querySelector('.project-tabs'),cards=[];
  let current=0;
  const show=(index,focus=false)=>{
    current=(index+projects.length)%projects.length;
    cards.forEach((card,i)=>{card.hidden=i!==current;tabs.children[i].setAttribute('aria-selected',String(i===current));tabs.children[i].tabIndex=i===current?0:-1;});
    panel.querySelector('.work-address-title').textContent=projects[current].name;
    if(focus)tabs.children[current].focus();
  };
  projects.forEach((project,index)=>{
    const tab=document.createElement('button');tab.type='button';tab.textContent=project.name;tab.id='personal-tab-'+index;tab.setAttribute('role','tab');tab.setAttribute('aria-controls','personal-project-'+index);
    tab.addEventListener('click',()=>show(index));
    tab.addEventListener('keydown',event=>{const next=event.key==='ArrowRight'?index+1:event.key==='ArrowLeft'?index-1:event.key==='Home'?0:event.key==='End'?projects.length-1:null;if(next!==null){event.preventDefault();show(next,true);}});
    tabs.append(tab);
    const card=document.createElement('article');card.className='personal-project';card.id='personal-project-'+index;card.setAttribute('role','tabpanel');card.setAttribute('aria-labelledby',tab.id);
    card.innerHTML='<div class="personal-project-layout"><div class="personal-art"><button type="button" class="internship-preview personal-preview" data-lightbox=""><img alt=""><span>View design ↗</span></button></div><div class="internship-copy"><span class="internship-type"></span><h3></h3><p class="personal-summary"></p><div class="personal-art-caption"><h4></h4><p></p></div><span class="personal-image-count" aria-live="polite"></span></div></div><div class="personal-gallery" role="group" aria-label="Choose an image"></div>';
    card.querySelector('.internship-type').textContent=project.type;
    card.querySelector('h3').textContent=project.name;
    card.querySelector('.personal-summary').textContent=project.intro;
    const gallery=card.querySelector('.personal-gallery'),preview=card.querySelector('.personal-preview');
    const selectImage=(imageIndex)=>{
      const item=project.images[imageIndex];
      preview.dataset.lightbox=item.src;preview.setAttribute('aria-label','View design: '+item.title);
      preview.querySelector('img').src=item.src;preview.querySelector('img').alt=project.name+' — '+item.title;
      card.querySelector('h4').textContent=item.title;card.querySelector('.personal-art-caption p').textContent=item.description;
      card.querySelector('.personal-image-count').textContent=String(imageIndex+1).padStart(2,'0')+' / '+String(project.images.length).padStart(2,'0')+' designs';
      [...gallery.children].forEach((button,i)=>button.setAttribute('aria-pressed',String(i===imageIndex)));
    };
    project.images.forEach((item,imageIndex)=>{
      const button=document.createElement('button');button.type='button';button.setAttribute('aria-label','Show '+item.title);button.title=item.title;
      const image=document.createElement('img');image.src=item.src;image.alt='';image.loading='lazy';image.decoding='async';button.append(image);
      button.addEventListener('click',()=>selectImage(imageIndex));gallery.append(button);
    });
    selectImage(0);cards.push(card);panel.querySelector('.personal-projects').append(card);
  });
  panel.querySelector('.work-prev').addEventListener('click',()=>show(current-1));
  panel.querySelector('.work-next').addEventListener('click',()=>show(current+1));
  show(0);return panel;
}
