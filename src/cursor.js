// Event-driven: no continuous cursor render loop or delay behind the pointer.
export function initCursor(isPaused){
  const fine=matchMedia('(hover:hover) and (pointer:fine)');
  const cursor=document.createElement('div');cursor.id='studio-cursor';cursor.setAttribute('aria-hidden','true');
  cursor.innerHTML='<img src="assets/brand-cursor.svg" alt=""><span class="cursor-view">VIEW ↗</span><svg class="cursor-heart" viewBox="0 0 32 32"><path d="M16 27C11 23 4 18 4 11a7 7 0 0 1 12-4 7 7 0 0 1 12 4c0 7-7 12-12 16Z"/></svg><span class="cursor-arrow">↗</span>';
  document.body.append(cursor);let frame=0,x=0,y=0;
  const hide=()=>{document.body.classList.remove('cursor-ready');cancelAnimationFrame(frame);frame=0;};
  const move=event=>{
    if(!fine.matches||isPaused()||event.pointerType==='touch')return hide();
    if(event.target.closest('input,textarea,select,[contenteditable="true"],dialog[open]'))return hide();
    x=event.clientX;y=event.clientY;
    const target=event.target.closest('a,button');
    cursor.dataset.state=target?.dataset.cursor||(target?'link':'brand');
    if(!frame)frame=requestAnimationFrame(()=>{frame=0;cursor.style.transform=`translate3d(${x}px,${y}px,0)`;document.body.classList.add('cursor-ready');});
  };
  const keys=event=>{if(event.key==='Tab')hide();};
  window.addEventListener('pointermove',move,{passive:true});document.addEventListener('pointerleave',hide);window.addEventListener('blur',hide);document.addEventListener('keydown',keys);document.addEventListener('experience:motion',hide);document.addEventListener('visibilitychange',hide);fine.addEventListener('change',hide);
  return()=>{hide();cursor.remove();window.removeEventListener('pointermove',move);document.removeEventListener('pointerleave',hide);window.removeEventListener('blur',hide);document.removeEventListener('keydown',keys);document.removeEventListener('experience:motion',hide);document.removeEventListener('visibilitychange',hide);fine.removeEventListener('change',hide);};
}
