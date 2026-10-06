import {motion} from './config.js';
export function initMedia(isPaused){
  const cleanups=[];
  document.querySelectorAll('.mission-screen img,.project-media').forEach(element=>{
    const move=event=>{
      if(isPaused()||!matchMedia('(hover:hover) and (pointer:fine)').matches)return;
      const r=element.getBoundingClientRect(),amount=motion.mediaTilt*.35;
      element.style.setProperty('--tilt-x',`${-(event.clientY-r.top-r.height/2)/r.height*amount}deg`);
      element.style.setProperty('--tilt-y',`${(event.clientX-r.left-r.width/2)/r.width*amount}deg`);
    };
    const reset=()=>{element.style.setProperty('--tilt-x','0deg');element.style.setProperty('--tilt-y','0deg');};
    element.addEventListener('pointermove',move,{passive:true});element.addEventListener('pointerleave',reset);
    document.addEventListener('experience:motion',reset);
    cleanups.push(()=>{element.removeEventListener('pointermove',move);element.removeEventListener('pointerleave',reset);document.removeEventListener('experience:motion',reset);reset();});
  });
  return ()=>cleanups.forEach(clean=>clean());
}
