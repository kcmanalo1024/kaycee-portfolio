function createFreelanceWork(){
  const base='assets/images/freelance-cabrini/';
  const projects=[
    {title:'Logo Enhancement',type:'BRAND ASSET REFINEMENT',description:'The client needed an enhanced version of their existing logo. I refined its visual presentation while preserving the recognizable symbol and established colors, following their instructions and preferred direction.',comparisons:[
      {title:'Hospital logo',images:[['logo-before.jpg','Before'],['logo-after.jpg','After']]}
    ]},
    {title:'Machine Tags',type:'EQUIPMENT TAG DESIGN',description:'I designed front and back machine tags that carry the hospital’s identity into everyday equipment labeling. The layouts emphasize the unit number on the front and organize the serial number, manufacturing date, and installation date on the back, using the client’s branding and design preferences.',comparisons:[
      {title:'Front · Unit identification',images:[['machine-tag-front-before.jpg','Before'],['machine-tag-front-after.png','After']]},
      {title:'Back · Equipment details',images:[['machine-tag-back-before.jpg','Before'],['machine-tag-back-designed.png','Redesigned']]}
    ]},
    {title:'Organizational Chart',type:'INFORMATION & LAYOUT DESIGN',description:'I recreated the Hemodialysis Unit’s organizational chart with a more consistent layout, clearer connections, and color-coded roles. The design follows the hospital’s instructions, brand identity, and preferences while presenting the unit’s structure in one coordinated visual.',privacy:true,comparisons:[
      {title:'Hemodialysis Unit',images:[['org-chart-before.jpg','Before'],['org-chart-after.png','After']]}
    ]}
  ];
  const panel=document.createElement('div');panel.id='freelance';
  panel.innerHTML='<div class="personal-intro freelance-intro"><span class="internship-type">FREELANCE · GRAPHIC DESIGN</span><h3>St. Cabrini Hospital</h3><p>St. Cabrini Hospital is a hospital in Sto. Tomas, Batangas. The client needed someone to enhance their existing logo, design their machine tags, and recreate their organizational chart. I developed these materials based on their instructions, established brand identity, and visual preferences.</p></div><div class="work-browser freelance-browser"><div class="work-browser-top"><span class="work-window-dots" aria-hidden="true"><i></i><i></i><i></i></span><div class="project-tabs" role="tablist" aria-label="St. Cabrini freelance deliverables"></div></div><div class="work-browser-toolbar"><button type="button" class="work-prev" aria-label="Previous freelance deliverable">‹</button><button type="button" class="work-next" aria-label="Next freelance deliverable">›</button><div class="work-address"><span aria-hidden="true">▣</span><span class="work-address-title"></span></div></div><div class="freelance-projects"></div></div>';
  const tabs=panel.querySelector('.project-tabs'),cards=[];
  let current=0;
  const show=(index,focus=false)=>{
    current=(index+projects.length)%projects.length;
    cards.forEach((card,i)=>{card.hidden=i!==current;tabs.children[i].setAttribute('aria-selected',String(i===current));tabs.children[i].tabIndex=i===current?0:-1;});
    panel.querySelector('.work-address-title').textContent='St. Cabrini · '+projects[current].title;
    if(focus)tabs.children[current].focus();
  };
  projects.forEach((project,index)=>{
    const tab=document.createElement('button');tab.type='button';tab.id='freelance-tab-'+index;tab.textContent=project.title;tab.setAttribute('role','tab');tab.setAttribute('aria-controls','freelance-project-'+index);
    tab.addEventListener('click',()=>show(index));
    tab.addEventListener('keydown',event=>{const next=event.key==='ArrowRight'?index+1:event.key==='ArrowLeft'?index-1:event.key==='Home'?0:event.key==='End'?projects.length-1:null;if(next!==null){event.preventDefault();show(next,true);}});
    tabs.append(tab);
    const card=document.createElement('article');card.className='freelance-project';card.id='freelance-project-'+index;card.setAttribute('role','tabpanel');card.setAttribute('aria-labelledby',tab.id);
    const copy=document.createElement('div');copy.className='internship-copy freelance-copy';
    const type=document.createElement('span');type.className='internship-type';type.textContent=project.type;
    const heading=document.createElement('h3');heading.textContent=project.title;
    const description=document.createElement('p');description.textContent=project.description;copy.append(type,heading,description);card.append(copy);
    if(project.privacy){
      const note=document.createElement('aside');note.className='internship-note freelance-privacy';
      note.innerHTML='<strong>Privacy note</strong><p>The original organizational chart used the nurses’ PRC IDs. All nurses’ personal information and PRC ID details have been blocked or hidden in these portfolio previews to protect their privacy. The chart’s layout and reporting structure remain visible.</p>';
      card.append(note);
    }
    project.comparisons.forEach(comparison=>{
      const group=document.createElement('div');group.className='freelance-comparison';
      const title=document.createElement('h4');title.textContent=comparison.title;group.append(title);
      const images=document.createElement('div');images.className='freelance-pair';
      comparison.images.forEach(([file,label])=>{
        const figure=document.createElement('figure');
        const caption=document.createElement('figcaption');caption.textContent=label;
        const preview=document.createElement('button');preview.type='button';preview.className='internship-preview freelance-preview';preview.dataset.lightbox=base+file;preview.setAttribute('aria-label','View '+comparison.title+' — '+label);
        const image=document.createElement('img');image.src=base+file;image.alt='St. Cabrini '+comparison.title+' — '+label+(project.privacy?' (staff information hidden)':'');image.loading='lazy';image.decoding='async';
        const action=document.createElement('span');action.textContent='View design ↗';preview.append(image,action);figure.append(caption,preview);images.append(figure);
      });
      group.append(images);card.append(group);
    });
    cards.push(card);panel.querySelector('.freelance-projects').append(card);
  });
  panel.querySelector('.work-prev').addEventListener('click',()=>show(current-1));
  panel.querySelector('.work-next').addEventListener('click',()=>show(current+1));
  show(0);return panel;
}
