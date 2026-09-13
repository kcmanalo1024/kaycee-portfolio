// Shared floating control for standalone case studies and galleries.
(()=>{
  if(document.querySelector('.back-to-top'))return;
  const button=document.createElement('button');
  button.type='button';button.className='back-to-top';
  button.setAttribute('aria-label','Back to top');button.title='Back to top';
  button.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 12 6-6 6 6M12 6v13"/></svg>';
  document.body.append(button);
  button.addEventListener('click',()=>window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'}));
  const update=()=>{const visible=window.scrollY>300;button.classList.toggle('is-visible',visible);button.tabIndex=visible?0:-1;button.setAttribute('aria-hidden',String(!visible));};
  window.addEventListener('scroll',update,{passive:true});window.addEventListener('pageshow',update);update();
})();
