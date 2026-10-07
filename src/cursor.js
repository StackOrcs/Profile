// Event-driven: no continuous cursor render loop or delay behind the pointer.
export function initCursor(){
  const fine=matchMedia('(any-hover:hover) and (any-pointer:fine)');
  const cursor=document.createElement('div');cursor.id='studio-cursor';cursor.setAttribute('aria-hidden','true');
  cursor.innerHTML='<img src="assets/brand-cursor.svg" alt=""><span class="cursor-view">VIEW ↗</span><svg class="cursor-heart" viewBox="0 0 32 32"><path d="M16 27C11 23 4 18 4 11a7 7 0 0 1 12-4 7 7 0 0 1 12 4c0 7-7 12-12 16Z"/></svg><span class="cursor-arrow">↗</span>';
  document.body.append(cursor);let x=0,y=0,seen=false,ready=false;
  const image=cursor.querySelector('img');
  const hide=()=>{document.body.classList.remove('cursor-ready');cursor.hidden=true;};
  const show=target=>{
    if(!ready||!seen)return hide();
    if(target?.closest('input,textarea,select,[contenteditable="true"]'))return hide();
    const action=target?.closest('a,button,[role="button"],summary');
    cursor.dataset.state=action?.dataset.cursor||(action?'link':'brand');
    cursor.style.transform=`translate3d(${x}px,${y}px,0)`;
    cursor.hidden=false;document.body.classList.add('cursor-ready');
  };
  const loaded=()=>{ready=image.naturalWidth>0;if(seen)show(document.elementFromPoint(x,y));};
  image.addEventListener('load',loaded);image.addEventListener('error',hide);
  if(image.complete)loaded();
  hide();
  const move=event=>{
    if(event.pointerType==='touch')return hide();
    x=event.clientX;y=event.clientY;seen=true;show(event.target);
  };
  const scroll=()=>{if(seen&&document.body.classList.contains('cursor-ready'))show(document.elementFromPoint(x,y));};
  const keys=event=>{if(event.key==='Tab')hide();};
  window.addEventListener('pointermove',move,{passive:true});window.addEventListener('scroll',scroll,{passive:true});document.addEventListener('pointerleave',hide);window.addEventListener('blur',hide);document.addEventListener('keydown',keys);document.addEventListener('visibilitychange',hide);fine.addEventListener('change',hide);
  return()=>{hide();cursor.remove();window.removeEventListener('pointermove',move);window.removeEventListener('scroll',scroll);document.removeEventListener('pointerleave',hide);window.removeEventListener('blur',hide);document.removeEventListener('keydown',keys);document.removeEventListener('visibilitychange',hide);fine.removeEventListener('change',hide);};
}
