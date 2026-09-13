// Shared, lightweight line icons for portfolio actions.
(()=>{
 const paths={
  work:'<rect x="3" y="7" width="18" height="14" rx="3"/><path d="M8 7V4h8v3M3 12h18M10 12v3h4v-3"/>',
  mail:'<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/>',
  document:'<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9Z M14 3v6h6M8 13h8M8 17h5"/>',
  gallery:'<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8" cy="8" r="1.5"/><path d="m3 17 6-6 4 4 3-3 5 5"/>',
  expand:'<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/>',
  left:'<path d="m14 6-6 6 6 6"/>',right:'<path d="m10 6 6 6-6 6"/>',
  back:'<path d="m10 5-7 7 7 7M3 12h18"/>',
  close:'<path d="m6 6 12 12M6 18 18 6"/>',
  menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',
  external:'<path d="M14 3h7v7m0-7L10 14M10 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5"/>'
 };
 const icon=name=>{const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('class','action-icon');svg.setAttribute('fill','none');svg.setAttribute('stroke','currentColor');svg.setAttribute('stroke-width','1.7');svg.setAttribute('stroke-linecap','round');svg.setAttribute('stroke-linejoin','round');svg.setAttribute('aria-hidden','true');svg.innerHTML=paths[name];return svg;};
 document.querySelectorAll('a.btn,a.nav-cta,a.tb-back,a.featured-link,a.tb-hero-link,.certificate-view,.internship-preview>span').forEach(el=>{
  const label=el.textContent.replace(/[↗→↑]/g,'').trim();
  const name=/back/i.test(label)?'back':/resume/i.test(label)?'document':/connect|contact|email/i.test(label)?'mail':/case study/i.test(label)?'document':/certificate|design/i.test(label)?'expand':/gallery/i.test(label)?'gallery':/work/i.test(label)?'work':'external';
  const text=document.createElement('span');text.textContent=label;el.replaceChildren(icon(name),text);el.classList.add('icon-action');
 });
 const controls=[['.work-prev,.learn-prev,.carousel-arrow.prev,.design-nav.prev','left','Previous item'],['.work-next,.learn-next,.carousel-arrow.next,.design-nav.next','right','Next item'],['#menu-btn','menu','Open menu'],['#menu-close,#close-lightbox,#tb-close','close','Close']];
 controls.forEach(([selector,name,label])=>document.querySelectorAll(selector).forEach(el=>{if(!el.hasAttribute('aria-label'))el.setAttribute('aria-label',label);el.replaceChildren(icon(name));el.classList.add('icon-control');}));
 document.querySelectorAll('.work-address>span[aria-hidden="true"]').forEach((el)=>el.replaceChildren(icon(el.textContent.includes('↗')?'external':'document')));
})();
