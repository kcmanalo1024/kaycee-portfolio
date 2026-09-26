function createPhotoEditing(){
  const photos=[
    ["01", "Portrait Retouching", "Skin • Clothing • Exposure • Detail", "A portrait edit focused on balancing the subject’s skin, clothing, and surrounding light. The brighter, more even finish brings attention to the face and outfit while keeping the outdoor setting and fine details visible.", "Edited with Adobe Lightroom"],
    ["02", "Lifestyle Photoshoot", "Exposure • White Balance • Skin Tones • Light Balancing", "A lifestyle edit that brings a warmer, brighter feel to the family scene. Balanced exposure and skin tones help the subjects stand out from the greenery, while the richer light gives the photograph a cohesive, sunlit finish.", "Edited with Adobe Lightroom & Adobe Photoshop"],
    ["03", "Travel Photography", "Color Grading • Contrast • Highlights/Shadows", "A travel edit emphasizing the contrast between the subject, rocky foreground, and mountain scenery. A more defined sky, stronger color separation, and controlled highlights give the scene greater depth and a more dramatic atmosphere.", "Edited with Adobe Lightroom & Adobe Photoshop"],
    ["04", "Skin & Detail Retouching", "Skin Correction • Detail Enhancement • Natural Retouching", "A close-up portrait edit focused on a smoother, more balanced appearance while keeping facial features defined. Refined skin tones, light, and detail draw attention to the eyes and expression without losing the portrait’s warmth.", "Edited with Adobe Lightroom"],
    ["05", "Light & Skin Tone", "Exposure • White Balance • Skin Tones • Light Balancing", "A portrait edit balancing strong light and shadow across the face. More even skin tones and controlled highlights create a softer finish, while the dark background maintains the intimate mood and keeps attention on the subject.", "Edited with Adobe Lightroom"],
    ["06", "Editorial Portrait", "Color Grading • Contrast • Mood • Creative Direction", "An editorial portrait study exploring how light, contrast, and tone can change the mood of an image. Warmer skin tones, deeper shadows, and a more directional lighting effect give the portrait a polished, dramatic character.", "Edited with Adobe Lightroom"],
    ["07", "Urban Color Grade", "Contrast • Shadow Recovery • Color Grading • Detail Enhancement", "An urban edit bringing out the layers of a busy city street. Stronger contrast, clearer architectural detail, and balanced shadows help separate the buildings and traffic, while the color grade adds depth to the scene.", "Edited with Adobe Lightroom & Adobe Photoshop"],
    ["08", "Landscape Enhancement", "Exposure • Highlights • Shadows • Natural Color Enhancement", "A landscape edit that brings definition to the mountain ridges and sky. Balanced highlights and shadows reveal more detail across the terrain, while richer natural colors create a clearer separation between the land and clouds.", "Edited with Adobe Lightroom & Adobe Photoshop"],
    ["09", "Cinematic Sunset Grade", "Color Grading • Highlight Control • Atmospheric Contrast", "A sunset edit emphasizing the warm horizon and the silhouettes of the trees. A stronger color grade and controlled sky highlights create a cinematic atmosphere, while deeper foreground tones preserve the scene’s evening mood.", "Edited with Adobe Lightroom"]
  ];
  const panel=document.createElement('div');panel.id='photo-editing';
  panel.innerHTML='<div class="work-browser photo-browser"><div class="work-browser-top"><span class="work-window-dots" aria-hidden="true"><i></i><i></i><i></i></span><div class="project-tabs" role="tablist" aria-label="Photo editing projects"></div></div><div class="work-browser-toolbar"><button type="button" class="work-prev" aria-label="Previous photo">‹</button><button type="button" class="work-next" aria-label="Next photo">›</button><div class="work-address"><span aria-hidden="true">▣</span><span class="work-address-title"></span></div></div><div class="photo-editing-projects"></div><div class="personal-gallery photo-navigation" role="group" aria-label="Photo navigation"><button type="button" class="personal-prev" aria-label="Previous photo">‹</button><button type="button" class="personal-next" aria-label="Next photo">›</button><span class="personal-image-count" aria-live="polite" aria-atomic="true"></span></div></div>';
  const tabs=panel.querySelector('.project-tabs'),cards=[];
  let current=0;
  const selectPhoto=(index,focus=false)=>{
    current=(index+photos.length)%photos.length;
    cards.forEach((card,i)=>{card.hidden=i!==current;tabs.children[i].setAttribute('aria-selected',String(i===current));tabs.children[i].tabIndex=i===current?0:-1;});
    panel.querySelector('.work-address-title').textContent=photos[current][0]+' — '+photos[current][1];
    panel.querySelector('.personal-image-count').textContent=String(current+1).padStart(2,'0')+' / '+String(photos.length).padStart(2,'0');
    const tab=tabs.children[current];
    if(focus)tab.focus({preventScroll:true});
    if(tab.offsetLeft<tabs.scrollLeft)tabs.scrollLeft=tab.offsetLeft;
    else if(tab.offsetLeft+tab.offsetWidth>tabs.scrollLeft+tabs.clientWidth)tabs.scrollLeft=tab.offsetLeft+tab.offsetWidth-tabs.clientWidth;
  };
  photos.forEach(([number,title,description,body,credit],index)=>{
    const card=document.createElement('article');card.className='photo-comparison';
    card.innerHTML='<div class="photo-comparison-stage"><img class="photo-before" loading="lazy" decoding="async"><img class="photo-after" loading="lazy" decoding="async" aria-hidden="true"></div><div class="photo-comparison-copy"><span class="photo-editing-label">PHOTO EDITING</span><h4></h4><p class="photo-techniques"></p><p class="photo-description"></p><p class="photo-editing-credit"></p><div class="photo-comparison-controls"><div class="photo-toggle" role="group"><button type="button" aria-pressed="true">BEFORE</button><button type="button" aria-pressed="false">AFTER</button></div><span class="photo-comparison-status" role="status"></span></div></div>';
    card.id='photo-panel-'+number;card.setAttribute('role','tabpanel');card.setAttribute('aria-labelledby','photo-tab-'+number);
    const tab=document.createElement('button');tab.type='button';tab.id='photo-tab-'+number;tab.textContent=number+' — '+title;tab.title=tab.textContent;tab.setAttribute('role','tab');tab.setAttribute('aria-controls',card.id);
    tab.addEventListener('click',()=>selectPhoto(index));
    tab.addEventListener('keydown',event=>{const next=event.key==='ArrowRight'?index+1:event.key==='ArrowLeft'?index-1:event.key==='Home'?0:event.key==='End'?photos.length-1:null;if(next!==null){event.preventDefault();selectPhoto(next,true);}});
    tabs.append(tab);cards.push(card);
    card.querySelector('h4').textContent=number+' — '+title;
    card.querySelector('.photo-techniques').textContent=description;
    card.querySelector('.photo-description').textContent=body;
    card.querySelector('.photo-editing-credit').textContent=credit;
    const stage=card.querySelector('.photo-comparison-stage');stage.id='photo-comparison-'+number;
    const before=card.querySelector('.photo-before'),after=card.querySelector('.photo-after');
    before.src='assets/images/photo-editing/Before - '+title+'.jpg';before.alt=title+' — before editing';
    after.src='assets/images/photo-editing/After - '+title+'.jpg';after.alt=title+' — after editing';
    const buttons=[...card.querySelectorAll('.photo-toggle button')],status=card.querySelector('.photo-comparison-status');
    card.querySelector('.photo-toggle').setAttribute('aria-label',title+' comparison');
    let request=0;
    const show=async(edited)=>{
      const current=++request;
      status.textContent='';stage.setAttribute('aria-busy',String(edited));
      if(edited){
        status.textContent='Loading edit…';after.loading='eager';
        try{await after.decode();}catch{
          if(current===request){status.textContent='Unable to load edit. Try again.';stage.setAttribute('aria-busy','false');}
          return;
        }
      }
      if(current!==request)return;
      card.classList.toggle('is-after',edited);
      buttons[0].setAttribute('aria-pressed',String(!edited));buttons[1].setAttribute('aria-pressed',String(edited));
      before.setAttribute('aria-hidden',String(edited));after.setAttribute('aria-hidden',String(!edited));
      stage.setAttribute('aria-busy','false');status.textContent=edited?'Showing AFTER':'Showing BEFORE';
    };
    buttons.forEach((button,index)=>{button.setAttribute('aria-controls',stage.id);button.addEventListener('click',()=>show(index===1));});
    panel.querySelector('.photo-editing-projects').append(card);
  });
  panel.querySelectorAll('.work-prev,.personal-prev').forEach(button=>button.addEventListener('click',()=>selectPhoto(current-1)));
  panel.querySelectorAll('.work-next,.personal-next').forEach(button=>button.addEventListener('click',()=>selectPhoto(current+1)));
  selectPhoto(0);
  return panel;
}
